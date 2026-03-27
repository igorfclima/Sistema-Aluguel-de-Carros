package service

import (
	"errors"
	"log"

	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/dto"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/model"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

type UsuarioService interface {
	CreateUsuario(req *dto.CreateUsuarioRequest) error
}

type usuarioService struct {
	usuarioRepo repository.UsuarioRepository
	clienteRepo repository.ClienteRepository
}

func NewUsuarioService(uRepo repository.UsuarioRepository, cRepo repository.ClienteRepository) UsuarioService {
	return &usuarioService{usuarioRepo: uRepo, clienteRepo: cRepo}
}

func (s *usuarioService) CreateUsuario(req *dto.CreateUsuarioRequest) error {
	existingUser, err := s.usuarioRepo.FindByEmail(req.Email)
	if err != nil {
		log.Printf("error checking existing user: %v", err)
		return errors.New("internal server error")
	}
	if existingUser != nil {
		return errors.New("email already in use")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Senha), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("error hashing password: %v", err)
		return errors.New("failed to process password")
	}

	usuario := &model.Usuario{
		Nome:  req.Nome,
		Email: req.Email,
		Senha: string(hashedPassword),
		Tipo:  req.Tipo,
	}

	err = s.usuarioRepo.Create(usuario)
	if err != nil {
		log.Printf("error creating user: %v", err)
		return errors.New("failed to create user")
	}

	if req.Tipo == "CLIENTE" {
		if req.CPF == "" {
			return errors.New("cpf is required for cliente profile")
		}

		cliente := &model.Cliente{
			UsuarioID: usuario.ID,
			CPF:       req.CPF,
			RG:        req.RG,
			Endereco:  req.Endereco,
			Profissao: req.Profissao,
		}

		err = s.clienteRepo.Create(cliente)
		if err != nil {
			log.Printf("error creating cliente profile: %v", err)
			return errors.New("user created, but failed to create client profile")
		}
	}

	return nil
}
