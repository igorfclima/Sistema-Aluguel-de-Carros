package repository

import (
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/model"
	"gorm.io/gorm"
)

type PedidoRepository interface {
	Create(pedido *model.PedidoAluguel) error
	FindByClienteID(clienteID uint) ([]model.PedidoAluguel, error)
}

type pedidoRepository struct {
	db *gorm.DB
}

func NewPedidoRepository(db *gorm.DB) PedidoRepository {
	return &pedidoRepository{db}
}

func (r *pedidoRepository) Create(pedido *model.PedidoAluguel) error {
	result := r.db.Create(pedido)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *pedidoRepository) FindByClienteID(clienteID uint) ([]model.PedidoAluguel, error) {
	var pedidos []model.PedidoAluguel
	result := r.db.Where("cliente_id = ?", clienteID).Find(&pedidos)
	if result.Error != nil {
		return nil, result.Error
	}
	return pedidos, nil
}
