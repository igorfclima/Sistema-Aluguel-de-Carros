package model

import "time"

type TipoContrato string

const (
	TipoSimples    TipoContrato = "SIMPLES"
	TipoComCredito TipoContrato = "COM_CREDITO"
)

type StatusContrato string

const (
	StatusContratoPendenteAssinatura     StatusContrato = "PENDENTE_ASSINATURA"
	StatusContratoAguardandoBanco        StatusContrato = "AGUARDANDO_APROVACAO_BANCO"
	StatusContratoAtivo                  StatusContrato = "ATIVO"
)

type TipoPropriedade string

const (
	PropriedadeCliente TipoPropriedade = "CLIENTE"
	PropriedadeEmpresa TipoPropriedade = "EMPRESA"
	PropriedadeBanco   TipoPropriedade = "BANCO"
)

type Contrato struct {
	ID              uint            `gorm:"primaryKey"`
	PedidoID        uint            `gorm:"uniqueIndex;not null"`
	Pedido          PedidoAluguel   `gorm:"foreignKey:PedidoID"`
	Tipo            TipoContrato    `gorm:"type:varchar(20);not null"`
	TipoPropriedade TipoPropriedade `gorm:"type:varchar(20);not null"`
	Status          StatusContrato  `gorm:"type:varchar(40);not null;default:'PENDENTE_ASSINATURA'"`
	DataAssinatura  time.Time

	AutomovelID uint      `gorm:"not null"`
	Automovel   Automovel `gorm:"foreignKey:AutomovelID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
	ClienteID   uint      `gorm:"not null"`
	Cliente     Cliente   `gorm:"foreignKey:ClienteID"`
	AgenteID    uint      `gorm:"not null"`
	Agente      Agente    `gorm:"foreignKey:AgenteID"`

	ContratoCredito *ContratoCredito `gorm:"foreignKey:ContratoID"`
}
