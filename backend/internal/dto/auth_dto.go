package dto

type LoginRequest struct {
	Email string `json:"email" binding:"required,email"`
	Senha string `json:"senha" binding:"required"`
}

type LoginResponse struct {
	Token string `json:"token"`
}
