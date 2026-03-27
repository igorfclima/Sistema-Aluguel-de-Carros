package service

import (
	"errors"

	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/dto"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/repository"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/pkgs/jwt"
	"golang.org/x/crypto/bcrypt"
)

type AuthService interface {
	Login(req *dto.LoginRequest) (string, error)
}

type authService struct {
	usuarioRepo repository.UsuarioRepository
}

func NewAuthService(repo repository.UsuarioRepository) AuthService {
	return &authService{usuarioRepo: repo}
}

//valida as credenciais do usuário e gera o token JWT para o usuário autenticado
func (s *authService) Login(req *dto.LoginRequest) (string, error) {
	usuario, err := s.usuarioRepo.FindByEmail(req.Email)
	if err != nil || usuario == nil {
		return "", errors.New("invalid credentials")
	}

	err = bcrypt.CompareHashAndPassword([]byte(usuario.Senha), []byte(req.Senha))
	if err != nil {
		return "", errors.New("invalid credentials")
	}

	token, err := jwt.GenerateToken(usuario.ID)
	if err != nil {
		return "", errors.New("failed to generate token")
	}

	return token, nil
}
