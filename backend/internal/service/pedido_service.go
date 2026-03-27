package service

import (
	"errors"

	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/dto"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/model"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/repository"
)

type PedidoService interface {
	CreatePedido(usuarioID uint) (*dto.PedidoResponse, error)
}

type pedidoService struct {
	pedidoRepo  repository.PedidoRepository
	clienteRepo repository.ClienteRepository
}

func NewPedidoService(pRepo repository.PedidoRepository, cRepo repository.ClienteRepository) PedidoService {
	return &pedidoService{pedidoRepo: pRepo, clienteRepo: cRepo}
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
