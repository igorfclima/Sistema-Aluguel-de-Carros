package service

import (
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/dto"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/model"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/repository"
)

type AutomovelService interface {
	CreateAutomovel(req *dto.CreateAutomovelRequest) error
}

type automovelService struct {
	automovelRepo repository.AutomovelRepository
}

func NewAutomovelService(repo repository.AutomovelRepository) AutomovelService {
	return &automovelService{automovelRepo: repo}
}

func (s *automovelService) CreateAutomovel(req *dto.CreateAutomovelRequest) error {
	automovel := &model.Automovel{
		Matricula: req.Matricula,
		Marca:     req.Marca,
		Modelo:    req.Modelo,
		Ano:       req.Ano,
	}

	return s.automovelRepo.Create(automovel)
}
