package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/dto"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/service"
)

type AutomovelHandler struct {
	automovelService service.AutomovelService
}

func NewAutomovelHandler(s service.AutomovelService) *AutomovelHandler {
	return &AutomovelHandler{automovelService: s}
}

func (h *AutomovelHandler) Create(c *gin.Context) {
	//valida e cria um novo automovel a partir do request
	var req dto.CreateAutomovelRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request format"})
		return
	}

	err := h.automovelService.CreateAutomovel(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create automovel"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "automovel registered successfully"})
}
