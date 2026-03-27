package repository

import (
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/model"
	"gorm.io/gorm"
)

type AgenteRepository interface {
	Create(agente *model.Agente) error
	FindByUsuarioID(usuarioID uint) (*model.Agente, error)
}

type agenteRepository struct {
	db *gorm.DB
}

func NewAgenteRepository(db *gorm.DB) AgenteRepository {
	return &agenteRepository{db}
}

func (r *agenteRepository) FindByUsuarioID(usuarioID uint) (*model.Agente, error) {
	var agente model.Agente
	result := r.db.Where("usuario_id = ?", usuarioID).First(&agente)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, result.Error
	}

	return &agente, nil
}

func (r *agenteRepository) Create(agente *model.Agente) error {
	result := r.db.Create(agente)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
