package repository

import (
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/model"
	"gorm.io/gorm"
)

type BancoRepository interface {
	Create(banco *model.Banco) error
}

type bancoRepository struct {
	db *gorm.DB
}

func NewBancoRepository(db *gorm.DB) BancoRepository {
	return &bancoRepository{db}
}

func (r *bancoRepository) Create(banco *model.Banco) error {
	result := r.db.Create(banco)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
