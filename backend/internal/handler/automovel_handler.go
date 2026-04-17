package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/dto"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/service"
)

type AutomovelHandler struct {
	automovelService service.AutomovelService
}

func (h *AutomovelHandler) ListAll(c *gin.Context) {
	automoveis, err := h.automovelService.ListAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar frota"})
		return
	}
	c.JSON(http.StatusOK, automoveis)
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

func (h *AutomovelHandler) Update(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid automovel id"})
		return
	}

	var req dto.UpdateAutomovelRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request format"})
		return
	}

	err = h.automovelService.UpdateAutomovel(uint(id), &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update automovel"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "automovel updated successfully"})
}

func (h *AutomovelHandler) Delete(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.ParseUint(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid automovel id"})
		return
	}

	err = h.automovelService.DeleteAutomovel(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete automovel"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "automovel deleted successfully"})
}
