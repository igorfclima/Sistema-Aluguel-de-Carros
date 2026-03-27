package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/pkgs/database"
)

func main() {
	fmt.Println("Starting..")

	database.Connect()

	router := gin.Default()

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "API running",
		})
	})

	fmt.Println("Servidor rodando em http://localhost:8080")
	if err := router.Run(":8080"); err != nil {
		log.Fatal("Error opening server: ", err)
	}
}
