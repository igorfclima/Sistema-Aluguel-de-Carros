package dto

type CreateCreditoRequest struct {
	ContratoID   uint    `json:"contrato_id" binding:"required"`
	ValorCredito float64 `json:"valor_credito" binding:"required,gt=0"`
	TaxaJuros    float64 `json:"taxa_juros" binding:"required"`
}
