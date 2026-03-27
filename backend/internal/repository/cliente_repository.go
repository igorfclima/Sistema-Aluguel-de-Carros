package repository

import (
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/model"
	"gorm.io/gorm"
)

type ClienteRepository interface {
	Create(cliente *model.Cliente) error
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
