package dto

import "time"

type CreatePedidoRequest struct {
    AutomovelID uint `json:"automovel_id" binding:"required"`
}

type PedidoResponse struct {
    ID              uint            `json:"id"`
    Status          string          `json:"status"`
    DataSolicitacao time.Time       `json:"data_solicitacao"`
    AutomovelID     uint            `json:"automovel_id"`
    Marca           string          `json:"marca,omitempty"`
    Modelo          string          `json:"modelo,omitempty"`
    ClienteID       uint            `json:"cliente_id"`
    NomeCliente     string          `json:"nome_cliente,omitempty"`
    CPF             string          `json:"cpf,omitempty"`
    RG              string          `json:"rg,omitempty"`
    Profissao       string          `json:"profissao,omitempty"`
    Rendimentos     []RendimentoDTO `json:"rendimentos,omitempty"`
    SomaRenda       float64   `json:"soma_renda"`
}

type RendimentoDTO struct {
    Empregador string  `json:"empregador"`
    Valor      float64 `json:"valor"`
}

type UpdatePedidoStatusRequest struct {
    Status string `json:"status" binding:"required"`
}
