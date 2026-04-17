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
    userID := userIDValue.(uint)


    var req dto.CreatePedidoRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
        return
    }

    response, err := h.pedidoService.CreatePedido(&req, userID)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, response)
}

func (h *PedidoHandler) UpdateStatus(c *gin.Context) {

	pedidoIDParam := c.Param("id")
	pedidoID, err := strconv.ParseUint(pedidoIDParam, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid order id"})
		return
	}

	userIDValue, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID := userIDValue.(uint)

	var req dto.UpdatePedidoStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

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

func (h *PedidoHandler) GetByCliente(c *gin.Context) {
    userIDValue, exists := c.Get("userID")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
        return
    }
    userID := userIDValue.(uint)

    userTipo, _ := c.Get("userTipo")

    var pedidos []dto.PedidoResponse
    var err error
    if userTipo == "AGENTE" || userTipo == "BANCO" {
        pedidos, err = h.pedidoService.ListAllPedidos()
    } else {
        pedidos, err = h.pedidoService.GetPedidosByCliente(userID)
    }

    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, pedidos)
}

func (h *PedidoHandler) Update(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    var req dto.CreatePedidoRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(400, gin.H{"error": "dados inválidos"})
        return
    }

    userIDValue, exists := c.Get("userID")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
        return
    }

    err := h.pedidoService.UpdatePedido(uint(id), userIDValue.(uint), &req)
    if err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }
    c.JSON(200, gin.H{"message": "pedido atualizado"})
}

func (h *PedidoHandler) Cancel(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    userIDValue, exists := c.Get("userID")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
        return
    }

    err := h.pedidoService.CancelarPedido(uint(id), userIDValue.(uint))
    if err != nil {
        c.JSON(400, gin.H{"error": err.Error()})
        return
    }
    c.JSON(200, gin.H{"message": "pedido cancelado com sucesso"})
}
