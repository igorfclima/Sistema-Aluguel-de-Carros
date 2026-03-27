package service

import (
	"errors"
	"log"

	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/model"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

type UsuarioService interface {
	CreateUsuario(usuario *model.Usuario) error
}

type usuarioService struct {
	repo repository.UsuarioRepository
}

func NewUsuarioService(repo repository.UsuarioRepository) UsuarioService {
	return &usuarioService{repo}
}

func (s *usuarioService) CreateUsuario(usuario *model.Usuario) error {
	// email check
	existingUser, err := s.repo.FindByEmail(usuario.Email)
	if err != nil {
		log.Printf("error checking existing user: %v", err)
		return errors.New("internal server error")
	}
	if existingUser != nil {
		return errors.New("email already in use")
	}

	// hash
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(usuario.Senha), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("error hashing password: %v", err)
		return errors.New("failed to process password")
	}
	usuario.Senha = string(hashedPassword)

	// save on table
	err = s.repo.Create(usuario)
	if err != nil {
		log.Printf("error creating user in database: %v", err)
		return errors.New("failed to create user")
	}

	return nil
}
