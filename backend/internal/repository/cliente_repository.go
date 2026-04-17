package repository

import (
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/model"
	"gorm.io/gorm"
)

type ClienteRepository interface {
	Create(cliente *model.Cliente) error
	FindByUsuarioID(usuarioID uint) (*model.Cliente, error)
	CreateRendimento(rendimento *model.Rendimento) error
}

type clienteRepository struct {
	db *gorm.DB
}


func NewClienteRepository(db *gorm.DB) ClienteRepository {
	return &clienteRepository{db}
}

func (r *clienteRepository) Create(cliente *model.Cliente) error {
	result := r.db.Create(cliente)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *clienteRepository) FindByUsuarioID(usuarioID uint) (*model.Cliente, error) {
	var cliente model.Cliente
	result := r.db.
		Preload("Rendimentos").
		Preload("Empregadores").
		Where("usuario_id = ?", usuarioID).
		First(&cliente)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, result.Error
	}

	return &cliente, nil
}

func (r *clienteRepository) CreateRendimento(rendimento *model.Rendimento) error {
	return r.db.Create(rendimento).Error
}
