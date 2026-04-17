package main

import (
	"log"
	"os"
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
	usuarioService := service.NewUsuarioService(usuarioRepo, clienteRepo, agenteRepo, bancoRepo, db)
	authService := service.NewAuthService(usuarioRepo, clienteRepo, db)
	pedidoService := service.NewPedidoService(pedidoRepo, clienteRepo, agenteRepo)
	automovelService := service.NewAutomovelService(automovelRepo)
	contratoService := service.NewContratoService(contratoRepo, pedidoRepo, agenteRepo, bancoRepo, creditoRepo, db)
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

		AllowOrigins:     []string{"*"},
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
		protected.GET("/me", usuarioHandler.Me)

		protected.POST("/pedidos", pedidoHandler.Create)
		protected.GET("/pedidos", pedidoHandler.GetByCliente)
		protected.PATCH("/pedidos/:id/status", pedidoHandler.UpdateStatus)
		protected.GET("/automoveis", automovelHandler.ListAll)
		protected.POST("/automoveis", automovelHandler.Create)
		protected.PUT("/automoveis/:id", automovelHandler.Update)
		protected.DELETE("/automoveis/:id", automovelHandler.Delete)
		protected.GET("/contratos", contratoHandler.ListAll)
		protected.POST("/contratos", contratoHandler.Create)
		protected.POST("/contratos/:id/assinar", contratoHandler.Assinar)
		protected.POST("/contratos/:id/aprovar-credito", contratoHandler.AprovarCredito)
		protected.POST("/creditos", creditoHandler.Create)
	}

	port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    log.Printf("Server running on port %s", port)
    if err := router.Run(":" + port); err != nil {
        log.Fatalf("failed to start server: %v", err)
    }
}
