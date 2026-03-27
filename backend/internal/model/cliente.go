package model

type Cliente struct {
	ID        uint    `gorm:"primaryKey"`
	UsuarioID uint    `gorm:"uniqueIndex;not null"`
	Usuario   Usuario `gorm:"foreignKey:UsuarioID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	RG        string  `gorm:"size:20"`
	CPF       string  `gorm:"size:14;uniqueIndex;not null"`
	Endereco  string
	Profissao string

	Empregadores []Empregador    `gorm:"foreignKey:ClienteID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Rendimentos  []Rendimento    `gorm:"foreignKey:ClienteID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Pedidos      []PedidoAluguel `gorm:"foreignKey:ClienteID;constraint:OnUpdate:CASCADE,OnDelete:RESTRICT;"`
}
