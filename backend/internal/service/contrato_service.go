package service

import (
	"errors"

	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/dto"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/model"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/repository"
)

type ContratoService interface {
	CreateContrato(req *dto.CreateContratoRequest, usuarioID uint) (*model.Contrato, error)
}

type contratoService struct {
	contratoRepo repository.ContratoRepository
	pedidoRepo   repository.PedidoRepository
	agenteRepo   repository.AgenteRepository
}

func NewContratoService(cr repository.ContratoRepository, pr repository.PedidoRepository, ar repository.AgenteRepository) ContratoService {
	return &contratoService{contratoRepo: cr, pedidoRepo: pr, agenteRepo: ar}
}

func (s *contratoService) CreateContrato(req *dto.CreateContratoRequest, usuarioID uint) (*model.Contrato, error) {
	agente, err := s.agenteRepo.FindByUsuarioID(usuarioID)
	if err != nil || agente == nil {
		return nil, errors.New("apenas agentes podem gerar contratos")
	}

	pedido, err := s.pedidoRepo.FindByID(req.PedidoID)
	if err != nil || pedido.Status != "APROVADO" {
		return nil, errors.New("pedido inválido ou não aprovado")
	}

	contrato := &model.Contrato{
		PedidoID:        req.PedidoID,
		AutomovelID:     req.AutomovelID,
		ClienteID:       pedido.ClienteID,
		AgenteID:        agente.ID,
		Tipo:            model.TipoContrato(req.Tipo),
		TipoPropriedade: model.TipoPropriedade(req.TipoPropriedade),
	}

	if err := s.contratoRepo.Create(contrato); err != nil {
		return nil, err
	}

	return contrato, nil
}
