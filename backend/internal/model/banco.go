package model

type Banco struct {
	ID             uint   `gorm:"primaryKey"`
	AgenteID       uint   `gorm:"uniqueIndex;not null"`
	Agente         Agente `gorm:"foreignKey:AgenteID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	CodigoBancario string `gorm:"size:20;uniqueIndex;not null"`

	ContratosCreditos []ContratoCredito `gorm:"foreignKey:BancoID"`
}
