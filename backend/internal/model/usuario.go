package model

import "time"

type Usuario struct {
	ID        uint      `gorm:"primaryKey"`
	Nome      string    `gorm:"size:100;not null"`
	Email     string    `gorm:"size:100;uniqueIndex;not null"`
	Senha     string    `gorm:"not null"`
	Tipo      string    `gorm:"size:20;not null"`
	CreatedAt time.Time
	UpdatedAt time.Time
}
