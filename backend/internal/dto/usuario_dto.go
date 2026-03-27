package dto

type CreateUsuarioRequest struct {
	Nome  string `json:"nome" binding:"required"`
	Email string `json:"email" binding:"required,email"`
	Senha string `json:"senha" binding:"required,min=6"`
	Tipo  string `json:"tipo" binding:"required"`

	CPF       string `json:"cpf"`
	RG        string `json:"rg"`
	Endereco  string `json:"endereco"`
	Profissao string `json:"profissao"`
}
