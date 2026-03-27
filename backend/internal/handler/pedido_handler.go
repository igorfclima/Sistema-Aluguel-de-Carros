package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/service"
)

type PedidoHandler struct {
	pedidoService service.PedidoService
}

func NewPedidoHandler(s service.PedidoService) *PedidoHandler {
	return &PedidoHandler{pedidoService: s}
}

func (h *PedidoHandler) Create(c *gin.Context) {
	userIDValue, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user identification not found in token"})
		return
	}

	userID := uint(userIDValue.(float64))

	response, err := h.pedidoService.CreatePedido(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, response)
}
