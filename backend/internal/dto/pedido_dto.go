package dto

import "time"

type CreatePedidoRequest struct {
    AutomovelID uint `json:"automovel_id" binding:"required"`
}

type PedidoResponse struct {
    ID              uint      `json:"id"`
    ClienteID       uint      `json:"cliente_id"`
    AutomovelID     uint      `json:"automovel_id"`
    Status          string    `json:"status"`
    DataSolicitacao time.Time `json:"data_solicitacao"`
}

type UpdatePedidoStatusRequest struct {
    Status string `json:"status" binding:"required"`
}
