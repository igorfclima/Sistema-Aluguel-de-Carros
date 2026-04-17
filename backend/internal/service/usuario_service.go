package service

import (
	"errors"
	"log"

	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/dto"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/model"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/repository"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UsuarioService interface {
	CreateUsuario(req *dto.CreateUsuarioRequest) error
	FindByID(id uint) (*model.Usuario, error)
}

type usuarioService struct {
	usuarioRepo repository.UsuarioRepository
	clienteRepo repository.ClienteRepository
	agenteRepo  repository.AgenteRepository
	bancoRepo   repository.BancoRepository
	db         *gorm.DB
}

func NewUsuarioService(
	uRepo repository.UsuarioRepository,
	cRepo repository.ClienteRepository,
	aRepo repository.AgenteRepository,
	bRepo repository.BancoRepository,
	db *gorm.DB,
) UsuarioService {
	return &usuarioService{
		usuarioRepo: uRepo,
		clienteRepo: cRepo,
		agenteRepo:  aRepo,
		bancoRepo:   bRepo,
		db:         db,
	}
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

	err = s.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(usuario).Error; err != nil {
			return errors.New("failed to create user")
		}

		switch req.Tipo {
		case "CLIENTE":
			if req.CPF == "" {
				return errors.New("cpf is required for cliente profile")
			}
			if req.Rendimento1 <= 0 && req.Rendimento2 <= 0 && req.Rendimento3 <= 0 {
				return errors.New("informe pelo menos um rendimento mensal")
			}

			cliente := &model.Cliente{
				UsuarioID: usuario.ID,
				CPF:       req.CPF,
				RG:        req.RG,
				Endereco:  req.Endereco,
				Profissao: req.Profissao,
			}
			if err := tx.Create(cliente).Error; err != nil {
				return errors.New("failed to create client profile")
			}

			rendimentos := []float64{req.Rendimento1, req.Rendimento2, req.Rendimento3}
			for _, valor := range rendimentos {
				if valor <= 0 {
					continue
				}

				rendimento := &model.Rendimento{
					ClienteID: cliente.ID,
					Valor:     valor,
					Periodo:   "MENSAL",
				}

				if err := tx.Create(rendimento).Error; err != nil {
					return errors.New("failed to create client income data")
				}
			}

		case "AGENTE":
			if req.NomeInstituicao == "" {
				return errors.New("nome_instituicao is required for agente profile")
			}
			agente := &model.Agente{
				UsuarioID:       usuario.ID,
				Tipo:            req.TipoAgente,
				NomeInstituicao: req.NomeInstituicao,
			}
			if err := tx.Create(agente).Error; err != nil {
				return errors.New("failed to create agente profile")
			}

		case "BANCO":
			if req.NomeInstituicao == "" || req.CodigoBancario == "" {
				return errors.New("nome_instituicao and codigo_bancario are required for banco profile")
			}

			agente := &model.Agente{
				UsuarioID:       usuario.ID,
				Tipo:            "INSTITUICAO_FINANCEIRA",
				NomeInstituicao: req.NomeInstituicao,
			}
			if err := tx.Create(agente).Error; err != nil {
				return errors.New("failed to create base agente for banco")
			}

			banco := &model.Banco{
				AgenteID:       agente.ID,
				CodigoBancario: req.CodigoBancario,
			}
			if err := tx.Create(banco).Error; err != nil {
				return errors.New("failed to create banco profile")
			}
		}

		return nil
	})

	if err != nil {
		log.Printf("error creating user transaction: %v", err)
		return err
	}

	return nil
}

func (s *usuarioService) FindByID(id uint) (*model.Usuario, error) {
	usuario, err := s.usuarioRepo.FindByID(id)
	if err != nil {
		log.Printf("erro ao buscar usuario por ID: %v", err)
		return nil, errors.New("usuário não encontrado")
	}
	return usuario, nil
}
