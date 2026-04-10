package main

import (
	"log"
	"time"

	"github.com/gin-contrib/cors"
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
	automovelRepo := repository.NewAutomovelRepository(db)
	contratoRepo := repository.NewContratoRepository(db)
	creditoRepo := repository.NewContratoCreditoRepository(db)

	// Services
	usuarioService := service.NewUsuarioService(usuarioRepo, clienteRepo, agenteRepo, bancoRepo)
	authService := service.NewAuthService(usuarioRepo)
	pedidoService := service.NewPedidoService(pedidoRepo, clienteRepo, agenteRepo)
	automovelService := service.NewAutomovelService(automovelRepo)
	contratoService := service.NewContratoService(contratoRepo, pedidoRepo, agenteRepo)
	creditoService := service.NewCreditoService(creditoRepo, contratoRepo, bancoRepo)

	// Handlers
	usuarioHandler := handler.NewUsuarioHandler(usuarioService)
	authHandler := handler.NewAuthHandler(authService)
	pedidoHandler := handler.NewPedidoHandler(pedidoService)
	automovelHandler := handler.NewAutomovelHandler(automovelService)
	contratoHandler := handler.NewContratoHandler(contratoService)
	creditoHandler := handler.NewCreditoHandler(creditoService)

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

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
		protected.GET("/me", func(c *gin.Context) {
			userID, _ := c.Get("userID")
			c.JSON(200, gin.H{
				"success": true,
				"userID":  userID,
				"message": "Sessão ativa e válida",
			})
		})

		protected.POST("/pedidos", pedidoHandler.Create)
		protected.GET("/pedidos", pedidoHandler.GetByCliente)
		protected.PATCH("/pedidos/:id/status", pedidoHandler.UpdateStatus)
		protected.POST("/automoveis", automovelHandler.Create)
		protected.POST("/contratos", contratoHandler.Create)
		protected.POST("/creditos", creditoHandler.Create)
	}

	log.Println("server running on port 8080")
	if err := router.Run(":8080"); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
