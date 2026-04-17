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
	ClienteNome     string    `json:"cliente_nome,omitempty"`
	ClienteCPF      string    `json:"cliente_cpf,omitempty"`
	ClienteRG       string    `json:"cliente_rg,omitempty"`
	ClienteEndereco string    `json:"cliente_endereco,omitempty"`
	ClienteProfissao string   `json:"cliente_profissao,omitempty"`
	AgenteID        uint      `json:"agente_id"`
	AgenteNomeAprovador string `json:"agente_nome_aprovador,omitempty"`
	AgenteInstituicao  string `json:"agente_instituicao,omitempty"`
	Tipo            string    `json:"tipo"`
	TipoPropriedade string    `json:"tipo_propriedade"`
	Status          string    `json:"status"`
	ValorAutomovel  float64   `json:"valor_automovel"`
	ValorAluguel    float64   `json:"valor_aluguel"`
	AutomovelMarca  string    `json:"automovel_marca,omitempty"`
	AutomovelModelo string    `json:"automovel_modelo,omitempty"`
	AutomovelPlaca  string    `json:"automovel_placa,omitempty"`
	BancoNomeInstituicao string `json:"banco_nome_instituicao,omitempty"`
	BancoCodigoBancario  string `json:"banco_codigo_bancario,omitempty"`
	BancoAprovadorNome   string `json:"banco_aprovador_nome,omitempty"`
	ValorCredito         float64 `json:"valor_credito,omitempty"`
	TaxaJuros            float64 `json:"taxa_juros,omitempty"`
	DataAssinatura  time.Time `json:"data_assinatura"`
}

type AssinarContratoRequest struct {
	Assinado bool `json:"assinado" binding:"required"`
}
