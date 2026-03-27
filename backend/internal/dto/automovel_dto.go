package dto

type CreateAutomovelRequest struct {
	Matricula string `json:"matricula" binding:"required"`
	Marca     string `json:"marca" binding:"required"`
	Modelo    string `json:"modelo" binding:"required"`
	Ano       int    `json:"ano" binding:"required,gt=1900"`
}
