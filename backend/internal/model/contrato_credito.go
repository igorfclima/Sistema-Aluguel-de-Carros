package model

import "time"

type ContratoCredito struct {
	ID            uint      `gorm:"primaryKey"`
	ContratoID    uint      `gorm:"uniqueIndex;not null"`
	Contrato      Contrato  `gorm:"foreignKey:ContratoID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	BancoID       uint      `gorm:"not null"`
	Banco         Banco     `gorm:"foreignKey:BancoID"`
	ValorCredito  float64   `gorm:"not null"`
	TaxaJuros     float64   `gorm:"not null"`
	DataConcessao time.Time `gorm:"autoCreateTime"`
}
