package repository

import (
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/model"
	"gorm.io/gorm"
)

type AutomovelRepository interface {
	Create(automovel *model.Automovel) error
	FindAll() ([]model.Automovel, error)
	Update(automovel *model.Automovel) error
	Delete(id uint) error
	FindByID(id uint) (*model.Automovel, error)
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

func (r *automovelRepository) FindAll() ([]model.Automovel, error) {
	var automoveis []model.Automovel
	err := r.db.Find(&automoveis).Error
	return automoveis, err
}

func (r *automovelRepository) FindByID(id uint) (*model.Automovel, error) {
	var automovel model.Automovel
	err := r.db.First(&automovel, id).Error
	if err != nil {
		return nil, err
	}

	return &automovel, nil
}

func (r *automovelRepository) Update(automovel *model.Automovel) error {
	return r.db.Save(automovel).Error
}

func (r *automovelRepository) Delete(id uint) error {
	return r.db.Delete(&model.Automovel{}, id).Error
}
