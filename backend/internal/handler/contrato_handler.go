package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/dto"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/service"
)

type ContratoHandler struct {
	contratoService service.ContratoService
}

func NewContratoHandler(s service.ContratoService) *ContratoHandler {
	return &ContratoHandler{contratoService: s}
}

func (h *ContratoHandler) Create(c *gin.Context) {
	userIDValue, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "identificação do agente não encontrada"})
		return
	}
	userID := userIDValue.(uint)

	var req dto.CreateContratoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "dados do contrato inválidos", "details": err.Error()})
		return
	}

	contrato, err := h.contratoService.CreateContrato(&req, userID)
	if err != nil {
		if err.Error() == "apenas agentes podem gerar contratos" {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, contrato)
}
