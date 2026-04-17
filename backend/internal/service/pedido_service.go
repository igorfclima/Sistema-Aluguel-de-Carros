package service

import (
	"errors"

	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/dto"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/model"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/repository"
)

type PedidoService interface {
    CreatePedido(req *dto.CreatePedidoRequest, usuarioID uint) (*dto.PedidoResponse, error)
    UpdateStatus(pedidoID uint, status string, usuarioID uint) error
	GetPedidosByCliente(usuarioID uint) ([]dto.PedidoResponse, error)
	ListAllPedidos() ([]dto.PedidoResponse, error)
	UpdatePedido(pedidoID uint, usuarioID uint, req *dto.CreatePedidoRequest) error
    CancelarPedido(pedidoID uint, usuarioID uint) error
}

type pedidoService struct {
	pedidoRepo  repository.PedidoRepository
	clienteRepo repository.ClienteRepository
	agenteRepo  repository.AgenteRepository
}

const aluguelPercentual = 0.03

func (s *pedidoService) GetPedidosByCliente(usuarioID uint) ([]dto.PedidoResponse, error) {
    cliente, err := s.clienteRepo.FindByUsuarioID(usuarioID)
    if err != nil || cliente == nil {
        return nil, errors.New("client profile not found")
    }

    pedidos, err := s.pedidoRepo.FindByClienteID(cliente.ID)
    if err != nil {
        return nil, errors.New("failed to fetch orders")
    }

    var response []dto.PedidoResponse
    for _, p := range pedidos {
        var somaTotal float64
        for _, r := range p.Cliente.Rendimentos {
            somaTotal += r.Valor
        }

        response = append(response, dto.PedidoResponse{
            ID:              p.ID,
            ClienteID:       p.ClienteID,
            AutomovelID:     p.AutomovelID,
            Status:          string(p.Status),
            DataSolicitacao: p.DataSolicitacao,
            SomaRenda:       somaTotal,
            NomeCliente:     p.Cliente.Usuario.Nome,
			Marca:           p.Automovel.Marca,
			Modelo:          p.Automovel.Modelo,
			Placa:           p.Automovel.Placa,
			ValorAutomovel:  p.Automovel.Valor,
			ValorAluguel:    p.Automovel.Valor * aluguelPercentual,
        })
    }

    return response, nil
}

func NewPedidoService(pRepo repository.PedidoRepository, cRepo repository.ClienteRepository, aRepo repository.AgenteRepository) PedidoService {
	return &pedidoService{pedidoRepo: pRepo, clienteRepo: cRepo, agenteRepo: aRepo}
}

func (s *pedidoService) CreatePedido(req *dto.CreatePedidoRequest, usuarioID uint) (*dto.PedidoResponse, error) {
    cliente, err := s.clienteRepo.FindByUsuarioID(usuarioID)
    if err != nil || cliente == nil {
        return nil, errors.New("user does not have a valid client profile")
    }

	var somaTotal float64
    for _, r := range cliente.Rendimentos {
        somaTotal += r.Valor
    }

    pedido := &model.PedidoAluguel{
        ClienteID:   cliente.ID,
        AutomovelID: req.AutomovelID,
        Status:      model.StatusAguardando,
    }

    if err := s.pedidoRepo.Create(pedido); err != nil {
        return nil, errors.New("failed to create rental order")
    }

    response := &dto.PedidoResponse{
        ID:              pedido.ID,
        ClienteID:       pedido.ClienteID,
        AutomovelID:     pedido.AutomovelID,
        Status:          string(pedido.Status),
        DataSolicitacao: pedido.DataSolicitacao,
		SomaRenda:       somaTotal,
		Marca:           pedido.Automovel.Marca,
		Modelo:          pedido.Automovel.Modelo,
		Placa:           pedido.Automovel.Placa,
		ValorAutomovel:  pedido.Automovel.Valor,
		ValorAluguel:    pedido.Automovel.Valor * aluguelPercentual,
    }

    return response, nil
}

func (s *pedidoService) UpdateStatus(pedidoID uint, status string, usuarioID uint) error {
    agente, err := s.agenteRepo.FindByUsuarioID(usuarioID)
    if err != nil || agente == nil {
        return errors.New("access denied: only agents can update order status")
    }

    pedido, err := s.pedidoRepo.FindByID(pedidoID)
    if err != nil {
        return errors.New("rental order not found")
    }

    if status != string(model.StatusAprovado) && status != string(model.StatusCancelado) {
        return errors.New("invalid status: must be APROVADO or CANCELADO")
    }

    pedido.Status = model.StatusPedido(status)
    return s.pedidoRepo.Update(pedido)
}

func (s *pedidoService) ListAllPedidos() ([]dto.PedidoResponse, error) {
    pedidos, err := s.pedidoRepo.FindAll()
    if err != nil {
        return nil, errors.New("failed to fetch all orders")
    }

    var response []dto.PedidoResponse
    for _, p := range pedidos {

        var somaTotal float64
        for _, r := range p.Cliente.Rendimentos {
            somaTotal += r.Valor
        }

        response = append(response, dto.PedidoResponse{
            ID:              p.ID,
            ClienteID:       p.ClienteID,
            AutomovelID:      p.AutomovelID,
            Status:          string(p.Status),
            DataSolicitacao: p.DataSolicitacao,

            SomaRenda:       somaTotal,
            NomeCliente:     p.Cliente.Usuario.Nome,
			Marca:           p.Automovel.Marca,
			Modelo:          p.Automovel.Modelo,
			Placa:           p.Automovel.Placa,
			ValorAutomovel:  p.Automovel.Valor,
			ValorAluguel:    p.Automovel.Valor * aluguelPercentual,
        })
    }
    return response, nil
}

func (s *pedidoService) UpdatePedido(pedidoID uint, usuarioID uint, req *dto.CreatePedidoRequest) error {
    pedido, err := s.pedidoRepo.FindByID(pedidoID)
    if err != nil || pedido.Cliente.UsuarioID != usuarioID {
        return errors.New("pedido não encontrado ou sem permissão")
    }

    if pedido.Status != "AGUARDANDO_ANALISE" {
        return errors.New("não é possível modificar um pedido que já saiu da análise")
    }

    pedido.AutomovelID = req.AutomovelID
    return s.pedidoRepo.Update(pedido)
}

func (s *pedidoService) CancelarPedido(pedidoID uint, usuarioID uint) error {
    pedido, err := s.pedidoRepo.FindByID(pedidoID)
    if err != nil || pedido.Cliente.UsuarioID != usuarioID {
        return errors.New("pedido não encontrado")
    }

    if pedido.Status == "CONTRATADO" {
        return errors.New("não é possível cancelar um pedido com contrato já assinado")
    }

    pedido.Status = "CANCELADO"
    return s.pedidoRepo.Update(pedido)
}
