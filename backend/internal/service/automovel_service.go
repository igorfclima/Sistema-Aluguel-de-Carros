package service

import (
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/dto"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/model"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/repository"
)

type AutomovelService interface {
	CreateAutomovel(req *dto.CreateAutomovelRequest) error
	ListAll() ([]model.Automovel, error)
	UpdateAutomovel(id uint, req *dto.UpdateAutomovelRequest) error
	DeleteAutomovel(id uint) error
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
        Placa:     req.Placa,
		Valor:     req.Valor,
    }
    return s.automovelRepo.Create(automovel)
}

func (s *automovelService) ListAll() ([]model.Automovel, error) {
	return s.automovelRepo.FindAll()
}

func (s *automovelService) UpdateAutomovel(id uint, req *dto.UpdateAutomovelRequest) error {
	automovel, err := s.automovelRepo.FindByID(id)
	if err != nil {
		return err
	}

	automovel.Matricula = req.Matricula
	automovel.Marca = req.Marca
	automovel.Modelo = req.Modelo
	automovel.Ano = req.Ano
	automovel.Placa = req.Placa
	automovel.Valor = req.Valor

	return s.automovelRepo.Update(automovel)
}

func (s *automovelService) DeleteAutomovel(id uint) error {
	_, err := s.automovelRepo.FindByID(id)
	if err != nil {
		return err
	}

	return s.automovelRepo.Delete(id)
}
