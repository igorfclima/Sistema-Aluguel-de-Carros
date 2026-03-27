package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/handler"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/repository"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/service"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/pkgs/database"
)

func main() {
	database.Connect()

	db := database.DB
	if db == nil {
		log.Fatal("database connection is nil")
	}

	usuarioRepo := repository.NewUsuarioRepository(db)
	clienteRepo := repository.NewClienteRepository(db)
	agenteRepo := repository.NewAgenteRepository(db)
	bancoRepo := repository.NewBancoRepository(db)

	usuarioService := service.NewUsuarioService(usuarioRepo, clienteRepo, agenteRepo, bancoRepo)
	usuarioHandler := handler.NewUsuarioHandler(usuarioService)

	router := gin.Default()

	router.POST("/usuarios", usuarioHandler.Create)

	log.Println("server running on port 8080")
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
