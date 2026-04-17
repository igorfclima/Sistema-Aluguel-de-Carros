package repository

import (
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/model"
	"gorm.io/gorm"
)

type ContratoRepository interface {
	Create(contrato *model.Contrato) error
	FindByID(id uint) (*model.Contrato, error)
	FindAll() ([]model.Contrato, error)
    Update(contrato *model.Contrato) error
}

type contratoRepository struct {
	db *gorm.DB
}

func NewContratoRepository(db *gorm.DB) ContratoRepository {
	return &contratoRepository{db}
}

func (r *contratoRepository) Create(contrato *model.Contrato) error {
	return r.db.Create(contrato).Error
}

func (r *contratoRepository) FindByID(id uint) (*model.Contrato, error) {
    var contrato model.Contrato
    result := r.db.Preload("Automovel").First(&contrato, id)
    if result.Error != nil {
        return nil, result.Error
    }
    return &contrato, nil
}

func (r *contratoRepository) FindAll() ([]model.Contrato, error) {
    var contratos []model.Contrato
    err := r.db.Preload("Automovel").Find(&contratos).Error
    return contratos, err
}

func (r *contratoRepository) Update(contrato *model.Contrato) error {
	return r.db.Save(contrato).Error
}
