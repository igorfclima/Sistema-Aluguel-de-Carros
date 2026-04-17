package dto

import "time"

type CreateContratoRequest struct {
	PedidoID        uint   `json:"pedido_id" binding:"required"`
	AutomovelID     uint   `json:"automovel_id" binding:"required"`
	Tipo            string `json:"tipo" binding:"required"`
	TipoPropriedade string `json:"tipo_propriedade" binding:"required"`
}

type ContratoResponse struct {
	ID              uint      `json:"id"`
	PedidoID        uint      `json:"pedido_id"`
	AutomovelID     uint      `json:"automovel_id"`
	ClienteID       uint      `json:"cliente_id"`
	AgenteID        uint      `json:"agente_id"`
	Tipo            string    `json:"tipo"`
	TipoPropriedade string    `json:"tipo_propriedade"`
	Status          string    `json:"status"`
	ValorAutomovel  float64   `json:"valor_automovel"`
	ValorAluguel    float64   `json:"valor_aluguel"`
	DataAssinatura  time.Time `json:"data_assinatura"`
}

type AssinarContratoRequest struct {
	Assinado bool `json:"assinado" binding:"required"`
}
