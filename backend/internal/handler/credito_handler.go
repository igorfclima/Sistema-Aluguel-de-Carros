package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/dto"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/service"
)

type CreditoHandler struct {
	service service.CreditoService
}

func NewCreditoHandler(s service.CreditoService) *CreditoHandler {
	return &CreditoHandler{service: s}
}

func (h *CreditoHandler) Create(c *gin.Context) {
    userIDValue, exists := c.Get("userID")
    if !exists {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
        return
    }
    userID := userIDValue.(uint)

    var req dto.CreateCreditoRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    resultado, err := h.service.ConcederCredito(&req, userID)
    if err != nil {
        c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, resultado)
}
