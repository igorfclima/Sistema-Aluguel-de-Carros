package dto

type CreateContratoRequest struct {
	PedidoID        uint   `json:"pedido_id" binding:"required"`
	AutomovelID     uint   `json:"automovel_id" binding:"required"`
	Tipo            string `json:"tipo" binding:"required"`
	TipoPropriedade string `json:"tipo_propriedade" binding:"required"`
}
