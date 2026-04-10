package service

import (
	"errors"

	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/dto"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/model"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/repository"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/pkgs/jwt"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthService interface {
	Login(req *dto.LoginRequest) (string, error)
	Register(req *dto.CreateUsuarioRequest) error
}

type authService struct {
	usuarioRepo repository.UsuarioRepository
	clienteRepo repository.ClienteRepository
	db		  *gorm.DB
}

func NewAuthService(ur repository.UsuarioRepository, cr repository.ClienteRepository, database *gorm.DB) AuthService {
	return &authService{usuarioRepo: ur, clienteRepo: cr, db: database}
}

func (s *authService) Login(req *dto.LoginRequest) (string, error) {
	usuario, err := s.usuarioRepo.FindByEmail(req.Email)
	if err != nil || usuario == nil {
		return "", errors.New("invalid credentials")
	}

	err = bcrypt.CompareHashAndPassword([]byte(usuario.Senha), []byte(req.Senha))
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	token, err := jwt.GenerateToken(usuario.ID, usuario.Nome, usuario.Tipo)
	if err != nil {
		return "", errors.New("failed to generate token")
	}

	return token, nil
}

func (s *authService) Register(req *dto.CreateUsuarioRequest) error {
    usuario := &model.Usuario{
        Nome:  req.Nome,
        Email: req.Email,
        Senha: req.Senha,
        Tipo:  req.Tipo,
    }

    if err := s.usuarioRepo.Create(usuario); err != nil {
        return err
    }

    if req.Tipo == "CLIENTE" {
    cliente := &model.Cliente{
        UsuarioID: usuario.ID,
        RG:        req.RG,
        CPF:       req.CPF,
        Endereco:  req.Endereco,
        Profissao: req.Profissao,
    }

    if err := s.clienteRepo.Create(cliente); err != nil {
        return err
    }

    if req.Empregador1 != "" {
        s.db.Create(&model.Empregador{ClienteID: cliente.ID, Nome: req.Empregador1})
        s.db.Create(&model.Rendimento{ClienteID: cliente.ID, Valor: req.Rendimento1})
    }
    if req.Empregador2 != "" {
        s.db.Create(&model.Empregador{ClienteID: cliente.ID, Nome: req.Empregador2})
        s.db.Create(&model.Rendimento{ClienteID: cliente.ID, Valor: req.Rendimento2})
    }
    if req.Empregador3 != "" {
        s.db.Create(&model.Empregador{ClienteID: cliente.ID, Nome: req.Empregador3})
        s.db.Create(&model.Rendimento{ClienteID: cliente.ID, Valor: req.Rendimento3})
    }
}

    return nil
}
