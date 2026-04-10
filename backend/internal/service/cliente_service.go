package service

import (
	"errors"

	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/model"
	"gorm.io/gorm"
)

type ClienteService interface {
	GetPerfilCompleto(usuarioID uint) (*model.Cliente, error)
	AtualizarPerfil(cliente *model.Cliente) error
}

type clienteService struct {
	db *gorm.DB
}

func NewClienteService(db *gorm.DB) ClienteService {
	return &clienteService{db: db}
}

func (s *clienteService) GetPerfilCompleto(usuarioID uint) (*model.Cliente, error) {
	var cliente model.Cliente
	// O Preload carrega as listas de empregadores e rendimentos automaticamente
	err := s.db.Preload("Empregadores").Preload("Rendimentos").
		Where("usuario_id = ?", usuarioID).First(&cliente).Error
	return &cliente, err
}

func (s *clienteService) AtualizarPerfil(cliente *model.Cliente) error {
	// Validação da Regra de Negócio do Enunciado: Máximo 3
	if len(cliente.Rendimentos) > 3 {
		return errors.New("o sistema permite no máximo 3 rendimentos")
	}
	return s.db.Save(cliente).Error
}
