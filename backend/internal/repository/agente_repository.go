package repository

import (
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/model"
	"gorm.io/gorm"
)

type AgenteRepository interface {
	Create(agente *model.Agente) error
}

type agenteRepository struct {
	db *gorm.DB
}

func NewAgenteRepository(db *gorm.DB) AgenteRepository {
	return &agenteRepository{db}
}

func (r *agenteRepository) Create(agente *model.Agente) error {
	result := r.db.Create(agente)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
