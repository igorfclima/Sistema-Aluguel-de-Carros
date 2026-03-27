package repository

import (
	"errors"

	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/model"
	"gorm.io/gorm"
)

type UsuarioRepository interface {
	Create(usuario *model.Usuario) error
	FindByEmail(email string) (*model.Usuario, error)
}

type usuarioRepository struct {
	db *gorm.DB
}

func NewUsuarioRepository(db *gorm.DB) UsuarioRepository {
	return &usuarioRepository{db: db}
}

func (r *usuarioRepository) Create(usuario *model.Usuario) error {
	result := r.db.Create(usuario)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *usuarioRepository) FindByEmail(email string) (*model.Usuario, error) {
	var usuario model.Usuario
	result := r.db.Where("email = ?", email).First(&usuario)

	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, result.Error
	}

	return &usuario, nil
}
