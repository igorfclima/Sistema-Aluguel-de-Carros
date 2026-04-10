package database

import (
	"fmt"
	"log"
	"os"

	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/internal/model"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect() {
	_ = godotenv.Load(".env")

	var dsn string

	railwayDSN := os.Getenv("DATABASE_URL")

	if railwayDSN != "" {
		dsn = railwayDSN
	} else {
		fmt.Println("Usando variáveis individuais para conexão local...")
		dsn = fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
			os.Getenv("DB_HOST"),
			os.Getenv("DB_USER"),
			os.Getenv("DB_PASSWORD"),
			os.Getenv("DB_NAME"),
			os.Getenv("DB_PORT"),
		)
	}

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Falha ao conectar no banco de dados: %v", err)
	}

	DB = database
	fmt.Println("Banco de dados conectado com sucesso!")

	fmt.Println("Executando AutoMigrate...")
	err = DB.AutoMigrate(
		&model.Usuario{},
		&model.Automovel{},
		&model.Cliente{},
		&model.Agente{},
		&model.Banco{},
		&model.Empregador{},
		&model.Rendimento{},
		&model.PedidoAluguel{},
		&model.Contrato{},
		&model.ContratoCredito{},
	)

	if err != nil {
		log.Fatal("Erro nas migrations: ", err)
	}
	fmt.Println("Tabelas sincronizadas!")
}
