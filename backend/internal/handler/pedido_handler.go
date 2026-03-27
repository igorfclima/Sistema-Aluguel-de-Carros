package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/dto"
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

func (h *PedidoHandler) UpdateStatus(c *gin.Context) {
	// Extrai o ID do pedido da URL (ex: /api/pedidos/1/status)
	pedidoIDParam := c.Param("id")
	pedidoID, err := strconv.ParseUint(pedidoIDParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid order id"})
		return
	}

	// Extrai o ID do usuário do token JWT
	userIDValue, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID := uint(userIDValue.(float64))

	// Faz o bind do JSON recebido
	var req dto.UpdatePedidoStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	// Chama o serviço
	err = h.pedidoService.UpdateStatus(uint(pedidoID), req.Status, userID)
	if err != nil {
		if err.Error() == "access denied: only agents can update order status" {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "order status updated successfully"})
}
