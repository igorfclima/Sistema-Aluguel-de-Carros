package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/dto"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/model"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/service"
)

type UsuarioHandler struct {
	usuarioService service.UsuarioService
}

func NewUsuarioHandler(s service.UsuarioService) *UsuarioHandler {
	return &UsuarioHandler{usuarioService: s}
}

func (h *UsuarioHandler) Create(c *gin.Context) {
	var req dto.CreateUsuarioRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body or missing fields"})
		return
	}

	usuario := &model.Usuario{
		Nome:  req.Nome,
		Email: req.Email,
		Senha: req.Senha,
		Tipo:  req.Tipo,
	}

	err := h.usuarioService.CreateUsuario(usuario)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "user created successfully"})
}
