package model

import "time"

type StatusPedido string

const (
	StatusAguardando StatusPedido = "AGUARDANDO_ANALISE"
	StatusAprovado   StatusPedido = "APROVADO"
	StatusCancelado  StatusPedido = "CANCELADO"
	StatusContratado StatusPedido = "CONTRATADO"
)

type PedidoAluguel struct {
    ID              uint         `gorm:"primaryKey"`
    ClienteID       uint         `gorm:"not null"`
    Cliente         Cliente      `gorm:"foreignKey:ClienteID"`
    AutomovelID     uint         `gorm:"not null"`
    Automovel       Automovel    `gorm:"foreignKey:AutomovelID"`
    AgenteID        *uint
    Agente          *Agente      `gorm:"foreignKey:AgenteID"`
    DataSolicitacao time.Time    `gorm:"autoCreateTime"`
    Status          StatusPedido `gorm:"type:varchar(30);default:'AGUARDANDO_ANALISE'"`
    Contrato        *Contrato    `gorm:"foreignKey:PedidoID"`
}
