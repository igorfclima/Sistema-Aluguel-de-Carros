package repository

import (
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/model"
	"gorm.io/gorm"
)

type AutomovelRepository interface {
	Create(automovel *model.Automovel) error
}

type automovelRepository struct {
	db *gorm.DB
}

func NewAutomovelRepository(db *gorm.DB) AutomovelRepository {
	return &automovelRepository{db}
}

func (r *automovelRepository) Create(automovel *model.Automovel) error {
	result := r.db.Create(automovel)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
