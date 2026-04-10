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
}

type contratoService struct {
	contratoRepo repository.ContratoRepository
	pedidoRepo   repository.PedidoRepository
	agenteRepo   repository.AgenteRepository
	db           *gorm.DB
}

func NewContratoService(cr repository.ContratoRepository, pr repository.PedidoRepository, ar repository.AgenteRepository, db *gorm.DB) ContratoService {
	return &contratoService{contratoRepo: cr, pedidoRepo: pr, agenteRepo: ar, db: db}
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
		DataAssinatura:  time.Now(),
	}

	if err := s.contratoRepo.Create(contrato); err != nil {
		return nil, err
	}

	if err := s.ExecutarContrato(contrato); err != nil {
        return nil, errors.New("contrato criado, mas falha ao atualizar propriedade do veículo")
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
        response = append(response, dto.ContratoResponse{
            ID:              c.ID,
            PedidoID:        c.PedidoID,
            AutomovelID:     c.AutomovelID,
            ClienteID:       c.ClienteID,
            AgenteID:        c.AgenteID,
            Tipo:            string(c.Tipo),
            TipoPropriedade: string(c.TipoPropriedade),
            DataAssinatura:  c.DataAssinatura,
        })
    }
    return response, nil
}

func (s *contratoService) ExecutarContrato(contrato *model.Contrato) error {
    var auto model.Automovel
    s.db.First(&auto, contrato.AutomovelID)

    auto.ProprietarioTipo = string(contrato.TipoPropriedade)

    return s.db.Save(&auto).Error
}
