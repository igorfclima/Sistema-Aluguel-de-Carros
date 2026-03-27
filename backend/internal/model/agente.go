package model

type Agente struct {
	ID              uint    `gorm:"primaryKey"`
	UsuarioID       uint    `gorm:"uniqueIndex;not null"`
	Usuario         Usuario `gorm:"foreignKey:UsuarioID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Tipo            string  `gorm:"size:50;not null"`
	NomeInstituicao string  `gorm:"size:100;not null"`

	PedidosAvaliados []PedidoAluguel `gorm:"foreignKey:AgenteID"`
}
