package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/handler"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/middleware"
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

	// Repositories
	usuarioRepo := repository.NewUsuarioRepository(db)
	clienteRepo := repository.NewClienteRepository(db)
	agenteRepo := repository.NewAgenteRepository(db)
	bancoRepo := repository.NewBancoRepository(db)
	pedidoRepo := repository.NewPedidoRepository(db)

	// Services
	usuarioService := service.NewUsuarioService(usuarioRepo, clienteRepo, agenteRepo, bancoRepo)
	authService := service.NewAuthService(usuarioRepo)
	pedidoService := service.NewPedidoService(pedidoRepo, clienteRepo, agenteRepo)

	// Handlers
	usuarioHandler := handler.NewUsuarioHandler(usuarioService)
	authHandler := handler.NewAuthHandler(authService)
	pedidoHandler := handler.NewPedidoHandler(pedidoService)

	router := gin.Default()

	// Pubs
	public := router.Group("/api")
	{
		public.POST("/usuarios", usuarioHandler.Create)
		public.POST("/login", authHandler.Login)
	}

	// Jwt
	protected := router.Group("/api")
	protected.Use(middleware.RequireAuth())
	{
		protected.GET("/perfil", func(c *gin.Context) {
			userID, _ := c.Get("userID")
			c.JSON(200, gin.H{
				"message": "Acesso autorizado",
				"userID":  userID,
			})
		})
		protected.POST("/pedidos", pedidoHandler.Create)
		protected.PATCH("/pedidos/:id/status", pedidoHandler.UpdateStatus)
	}

	log.Println("server running on port 8080")
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
