package repository

import (
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/model"
	"gorm.io/gorm"
)

type ContratoCreditoRepository interface {
	Create(credito *model.ContratoCredito) error
}

type contratoCreditoRepository struct {
	db *gorm.DB
}

func NewContratoCreditoRepository(db *gorm.DB) ContratoCreditoRepository {
	return &contratoCreditoRepository{db}
}

func (r *contratoCreditoRepository) Create(credito *model.ContratoCredito) error {
	return r.db.Create(credito).Error
}
