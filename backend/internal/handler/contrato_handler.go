package handler

import (
	"net/http"
	"strconv"

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

func (h *ContratoHandler) ListAll(c *gin.Context) {
    contratos, err := h.contratoService.ListAllContratos()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, contratos)
}

func (h *ContratoHandler) Assinar(c *gin.Context) {
	userIDValue, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	contratoID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid contrato id"})
		return
	}

	contrato, err := h.contratoService.AssinarContrato(uint(contratoID), userIDValue.(uint))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, contrato)
}

func (h *ContratoHandler) AprovarCredito(c *gin.Context) {
	userIDValue, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	contratoID, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid contrato id"})
		return
	}

	var req dto.CreateCreditoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	req.ContratoID = uint(contratoID)

	contrato, err := h.contratoService.AprovarCreditoContrato(uint(contratoID), &req, userIDValue.(uint))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, contrato)
}
