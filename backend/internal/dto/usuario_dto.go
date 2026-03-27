package dto

type CreateUsuarioRequest struct {
	//user
	Nome  string `json:"nome" binding:"required"`
	Email string `json:"email" binding:"required,email"`
	Senha string `json:"senha" binding:"required,min=6"`
	Tipo  string `json:"tipo" binding:"required"`

	//cliebte
	CPF       string `json:"cpf"`
	RG        string `json:"rg"`
	Endereco  string `json:"endereco"`
	Profissao string `json:"profissao"`

	//agente
	TipoAgente      string `json:"tipo_agente"`
	NomeInstituicao string `json:"nome_instituicao"`
	//banco
	CodigoBancario string `json:"codigo_bancario"`
}
