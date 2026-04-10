package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	localJwt "github.com/igorfclima/Sistema-Aluguel-de-Carros/backend/pkgs/jwt"
)

//pega o token JWT e extrai as infos para validar o acesso
func RequireAuth() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "authorization header required"})
            c.Abort()
            return
        }

        parts := strings.Split(authHeader, " ")
        if len(parts) != 2 || parts[0] != "Bearer" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid authorization format"})
            c.Abort()
            return
        }

        tokenString := parts[1]
        token, err := localJwt.ValidateToken(tokenString)
        if err != nil || !token.Valid {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired token"})
            c.Abort()
            return
        }

        claims, ok := token.Claims.(jwt.MapClaims)
        if !ok || claims["sub"] == nil {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token claims"})
            c.Abort()
            return
        }

        userID := uint(claims["sub"].(float64))
        c.Set("userID", userID)

		if tipo, ok := claims["tipo"].(string); ok {
			c.Set("userTipo", tipo)
		} else {
		    c.Set("userTipo", "CLIENTE")
		}

        c.Next()
    }
}
