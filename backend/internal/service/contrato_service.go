package service

import (
	"errors"
	"time"

	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/dto"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/model"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/repository"
	"gorm.io/gorm"
)

type ContratoService interface {
	CreateContrato(req *dto.CreateContratoRequest, usuarioID uint) (*model.Contrato, error)
	ListAllContratos() ([]dto.ContratoResponse, error)
	ExecutarContrato(contrato *model.Contrato) error
	AssinarContrato(contratoID uint, usuarioID uint) (*model.Contrato, error)
	AprovarCreditoContrato(contratoID uint, req *dto.CreateCreditoRequest, usuarioID uint) (*model.Contrato, error)
}

type contratoService struct {
	contratoRepo repository.ContratoRepository
	pedidoRepo   repository.PedidoRepository
	agenteRepo   repository.AgenteRepository
	bancoRepo    repository.BancoRepository
	creditoRepo  repository.ContratoCreditoRepository
	db           *gorm.DB
}

const aluguelPercentualContrato = 0.03

func NewContratoService(
	cr repository.ContratoRepository,
	pr repository.PedidoRepository,
	ar repository.AgenteRepository,
	br repository.BancoRepository,
	cred repository.ContratoCreditoRepository,
	db *gorm.DB,
) ContratoService {
	return &contratoService{
		contratoRepo: cr,
		pedidoRepo:   pr,
		agenteRepo:   ar,
		bancoRepo:    br,
		creditoRepo:  cred,
		db:           db,
	}
}

func (s *contratoService) CreateContrato(req *dto.CreateContratoRequest, usuarioID uint) (*model.Contrato, error) {
	agente, err := s.agenteRepo.FindByUsuarioID(usuarioID)
	if err != nil || agente == nil {
		return nil, errors.New("apenas agentes podem gerar contratos")
	}

	pedido, err := s.pedidoRepo.FindByID(req.PedidoID)
	if err != nil || pedido.Status != model.StatusAprovado {
		return nil, errors.New("pedido inválido ou não aprovado")
	}

	contrato := &model.Contrato{
		PedidoID:        req.PedidoID,
		AutomovelID:     req.AutomovelID,
		ClienteID:       pedido.ClienteID,
		AgenteID:        agente.ID,
		Tipo:            model.TipoContrato(req.Tipo),
		TipoPropriedade: model.TipoPropriedade(req.TipoPropriedade),
		Status:          model.StatusContratoPendenteAssinatura,
	}

	if contrato.Tipo == model.TipoComCredito {
		contrato.TipoPropriedade = model.PropriedadeBanco
	}

	if err := s.contratoRepo.Create(contrato); err != nil {
		return nil, err
	}

	return contrato, nil
}

func (s *contratoService) ListAllContratos() ([]dto.ContratoResponse, error) {
    contratos, err := s.contratoRepo.FindAll()
    if err != nil {
        return nil, errors.New("falha ao buscar contratos")
    }

    var response []dto.ContratoResponse
    for _, c := range contratos {
		item := dto.ContratoResponse{
            ID:              c.ID,
            PedidoID:        c.PedidoID,
            AutomovelID:     c.AutomovelID,
            ClienteID:       c.ClienteID,
            AgenteID:        c.AgenteID,
            Tipo:            string(c.Tipo),
            TipoPropriedade: string(c.TipoPropriedade),
			Status:          string(c.Status),
			ValorAutomovel:  c.Automovel.Valor,
			ValorAluguel:    c.Automovel.Valor * aluguelPercentualContrato,
			AutomovelMarca:  c.Automovel.Marca,
			AutomovelModelo: c.Automovel.Modelo,
			AutomovelPlaca:  c.Automovel.Placa,
			ClienteNome:     c.Cliente.Usuario.Nome,
			ClienteCPF:      c.Cliente.CPF,
			ClienteRG:       c.Cliente.RG,
			ClienteEndereco: c.Cliente.Endereco,
			ClienteProfissao: c.Cliente.Profissao,
			AgenteNomeAprovador: c.Agente.Usuario.Nome,
			AgenteInstituicao:   c.Agente.NomeInstituicao,
            DataAssinatura:  c.DataAssinatura,
		}

		if c.ContratoCredito != nil {
			item.ValorCredito = c.ContratoCredito.ValorCredito
			item.TaxaJuros = c.ContratoCredito.TaxaJuros
			item.BancoNomeInstituicao = c.ContratoCredito.Banco.Agente.NomeInstituicao
			item.BancoCodigoBancario = c.ContratoCredito.Banco.CodigoBancario
			item.BancoAprovadorNome = c.ContratoCredito.Banco.Agente.Usuario.Nome
		}

		response = append(response, item)
    }
    return response, nil
}

func (s *contratoService) ExecutarContrato(contrato *model.Contrato) error {
    var auto model.Automovel
    s.db.First(&auto, contrato.AutomovelID)

    auto.ProprietarioTipo = string(contrato.TipoPropriedade)

    return s.db.Save(&auto).Error
}

func (s *contratoService) AssinarContrato(contratoID uint, usuarioID uint) (*model.Contrato, error) {
	agente, agenteErr := s.agenteRepo.FindByUsuarioID(usuarioID)
	cliente, clienteErr := s.clienteRepoSafe(usuarioID)
	if (agenteErr != nil || agente == nil) && (clienteErr != nil || !cliente) {
		return nil, errors.New("apenas agente ou cliente podem assinar contrato")
	}

	contrato, err := s.contratoRepo.FindByID(contratoID)
	if err != nil {
		return nil, errors.New("contrato nao encontrado")
	}

	if contrato.Status != model.StatusContratoPendenteAssinatura {
		return nil, errors.New("contrato nao esta pendente de assinatura")
	}

	contrato.DataAssinatura = time.Now()
	if contrato.Tipo == model.TipoComCredito {
		contrato.Status = model.StatusContratoAguardandoBanco
		contrato.TipoPropriedade = model.PropriedadeBanco
		if err := s.contratoRepo.Update(contrato); err != nil {
			return nil, err
		}
		return contrato, nil
	}

	contrato.Status = model.StatusContratoAtivo
	if err := s.contratoRepo.Update(contrato); err != nil {
		return nil, err
	}

	if err := s.ExecutarContrato(contrato); err != nil {
		return nil, errors.New("contrato assinado, mas falha ao atualizar propriedade")
	}

	if err := s.marcarPedidoComoContratado(contrato.PedidoID); err != nil {
		return nil, err
	}

	return contrato, nil
}

func (s *contratoService) AprovarCreditoContrato(contratoID uint, req *dto.CreateCreditoRequest, usuarioID uint) (*model.Contrato, error) {
	banco, err := s.bancoRepo.FindByUsuarioID(usuarioID)
	if err != nil || banco == nil {
		return nil, errors.New("apenas banco pode aprovar credito")
	}

	contrato, err := s.contratoRepo.FindByID(contratoID)
	if err != nil {
		return nil, errors.New("contrato nao encontrado")
	}

	if contrato.Tipo != model.TipoComCredito {
		return nil, errors.New("este contrato nao possui credito")
	}

	if contrato.Status != model.StatusContratoAguardandoBanco {
		return nil, errors.New("contrato ainda nao esta aguardando aprovacao bancaria")
	}

	credito := &model.ContratoCredito{
		ContratoID:   contrato.ID,
		BancoID:      banco.ID,
		ValorCredito: req.ValorCredito,
		TaxaJuros:    req.TaxaJuros,
	}
	if err := s.creditoRepo.Create(credito); err != nil {
		return nil, err
	}

	contrato.TipoPropriedade = model.PropriedadeBanco
	contrato.Status = model.StatusContratoAtivo
	if err := s.contratoRepo.Update(contrato); err != nil {
		return nil, err
	}

	if err := s.ExecutarContrato(contrato); err != nil {
		return nil, errors.New("credito aprovado, mas falha ao atualizar propriedade")
	}

	if err := s.marcarPedidoComoContratado(contrato.PedidoID); err != nil {
		return nil, err
	}

	return contrato, nil
}

func (s *contratoService) marcarPedidoComoContratado(pedidoID uint) error {
	pedido, err := s.pedidoRepo.FindByID(pedidoID)
	if err != nil {
		return errors.New("falha ao atualizar status do pedido")
	}

	pedido.Status = model.StatusContratado
	if err := s.pedidoRepo.Update(pedido); err != nil {
		return errors.New("falha ao salvar status do pedido")
	}

	return nil
}

func (s *contratoService) clienteRepoSafe(usuarioID uint) (bool, error) {
	var cliente model.Cliente
	err := s.db.Where("usuario_id = ?", usuarioID).First(&cliente).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, nil
		}
		return false, err
	}

	return true, nil
}
