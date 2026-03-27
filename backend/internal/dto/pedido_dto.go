package dto

import "time"

type PedidoResponse struct {
	ID              uint      `json:"id"`
	ClienteID       uint      `json:"cliente_id"`
	Status          string    `json:"status"`
	DataSolicitacao time.Time `json:"data_solicitacao"`
}
