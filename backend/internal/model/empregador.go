package model

type Empregador struct {
	ID        uint   `gorm:"primaryKey"`
	ClienteID uint   `gorm:"not null"`
	Nome      string `gorm:"size:100;not null"`
	CNPJ      string `gorm:"size:18;not null"`
}
