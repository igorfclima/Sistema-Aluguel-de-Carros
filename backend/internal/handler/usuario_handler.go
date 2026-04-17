package handler

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/dto"
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

	err := h.usuarioService.CreateUsuario(&req)
	if err != nil {
		if strings.Contains(err.Error(), "required") ||
			strings.Contains(err.Error(), "informe pelo menos") ||
			strings.Contains(err.Error(), "already in use") {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "user and profile created successfully"})
}

func (h *UsuarioHandler) Me(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	var id uint
	switch v := userID.(type) {
	case uint:
		id = v
	case float64:
		id = uint(v)
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ID de usuário em formato inválido no token"})
		return
	}

	usuario, err := h.usuarioService.FindByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuário não encontrado"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":    usuario.ID,
		"nome":  usuario.Nome,
		"email": usuario.Email,
		"tipo":  usuario.Tipo,
	})
}
