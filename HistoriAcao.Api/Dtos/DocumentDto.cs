
namespace HistoriAcao.Api.Dtos
{
    public class DocumentDto
    {
        public string? Titulo { get; set; }
        public string Tipo { get; set; } = string.Empty;
        public string? Descricao { get; set; }
        public string? Origem { get; set; }
        public string? Url { get; set; }
    }

}