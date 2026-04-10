package model

type Rendimento struct {
	ID        uint    `gorm:"primaryKey"`
	ClienteID uint    `gorm:"not null;index"`
	Valor     float64 `gorm:"not null"`
	Periodo   string  `gorm:"size:50;not null"`
}
