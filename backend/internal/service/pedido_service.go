package service

import (
	"errors"

	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/dto"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/model"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/repository"
)

type PedidoService interface {
	CreatePedido(usuarioID uint) (*dto.PedidoResponse, error)
	UpdateStatus(pedidoID uint, status string, usuarioID uint) error
}

type pedidoService struct {
	pedidoRepo  repository.PedidoRepository
	clienteRepo repository.ClienteRepository
	agenteRepo  repository.AgenteRepository
}

func NewPedidoService(pRepo repository.PedidoRepository, cRepo repository.ClienteRepository, aRepo repository.AgenteRepository) PedidoService {
	return &pedidoService{pedidoRepo: pRepo, clienteRepo: cRepo, agenteRepo: aRepo}
}

func (s *pedidoService) CreatePedido(usuarioID uint) (*dto.PedidoResponse, error) {
	cliente, err := s.clienteRepo.FindByUsuarioID(usuarioID)
	if err != nil || cliente == nil {
		return nil, errors.New("user does not have a valid client profile")
	}
	pedido := &model.PedidoAluguel{
		ClienteID: cliente.ID,
		Status:    model.StatusAguardando,
	}

	if err := s.pedidoRepo.Create(pedido); err != nil {
		return nil, errors.New("failed to create rental order")
	}

	response := &dto.PedidoResponse{
		ID:              pedido.ID,
		ClienteID:       pedido.ClienteID,
		Status:          string(pedido.Status),
		DataSolicitacao: pedido.DataSolicitacao,
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

	if status != "APROVADO" && status != "REJEITADO" {
		return errors.New("invalid status: must be APROVADO or REJEITADO")
	}

	pedido.Status = model.StatusPedido(status)
	return s.pedidoRepo.Update(pedido)
}
