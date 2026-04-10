package model

type Automovel struct {
	ID        uint   `gorm:"primaryKey"`
	Matricula string `gorm:"size:50;uniqueIndex;not null"`
	Ano       int    `gorm:"not null"`
	Marca     string `gorm:"size:50;not null"`
	Modelo    string `gorm:"size:50;not null"`
	Placa     string `gorm:"size:10;uniqueIndex;not null"`

	ProprietarioTipo string
	ProprietarioID   uint
}
