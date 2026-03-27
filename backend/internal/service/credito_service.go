package service

import (
	"errors"

	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/dto"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/model"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/repository"
)

type CreditoService interface {
	ConcederCredito(req *dto.CreateCreditoRequest, usuarioID uint) (*model.ContratoCredito, error)
}

type creditoService struct {
	creditoRepo  repository.ContratoCreditoRepository
	contratoRepo repository.ContratoRepository
	bancoRepo    repository.BancoRepository
}

func NewCreditoService(creRepo repository.ContratoCreditoRepository, conRepo repository.ContratoRepository, bRepo repository.BancoRepository) CreditoService {
	return &creditoService{creditoRepo: creRepo, contratoRepo: conRepo, bancoRepo: bRepo}
}

func (s *creditoService) ConcederCredito(req *dto.CreateCreditoRequest, usuarioID uint) (*model.ContratoCredito, error) {
	// Verifica se e um banco e se o contrato existe e aceita crédito, depois cria a concessão de crédito
	banco, err := s.bancoRepo.FindByUsuarioID(usuarioID)
	if err != nil || banco == nil {
		return nil, errors.New("acesso negado: apenas instituições bancárias podem conceder crédito")
	}
	credito := &model.ContratoCredito{
		ContratoID:   req.ContratoID,
		BancoID:      banco.ID,
		ValorCredito: req.ValorCredito,
		TaxaJuros:    req.TaxaJuros,
	}

	if err := s.creditoRepo.Create(credito); err != nil {
		return nil, err
	}
	return credito, nil
}
