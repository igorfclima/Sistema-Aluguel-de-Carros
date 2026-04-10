package dto

type CreateUsuarioRequest struct {
	Nome  string `json:"nome" binding:"required"`
	Email string `json:"email" binding:"required,email"`
	Senha string `json:"senha" binding:"required,min=6"`
	Tipo  string `json:"tipo" binding:"required,oneof=CLIENTE AGENTE BANCO"`

	CPF       string `json:"cpf"`
	RG        string `json:"rg"`
	Endereco  string `json:"endereco"`
	Profissao string `json:"profissao"`

	TipoAgente      string `json:"tipo_agente"`
	NomeInstituicao string `json:"nome_instituicao"`
	CodigoBancario  string `json:"codigo_bancario"`

	Empregador1 string  `json:"empregador1"`
	Rendimento1 float64 `json:"rendimento1"`

	Empregador2 string  `json:"empregador2"`
	Rendimento2 float64 `json:"rendimento2"`

	Empregador3 string  `json:"empregador3"`
	Rendimento3 float64 `json:"rendimento3"`
}
