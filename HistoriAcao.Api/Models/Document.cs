using System.ComponentModel.DataAnnotations;

namespace HistoriAcao.Api.Models
{
    public class Document
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public string? Titulo { get; set; }
        public string Tipo { get; set; } = string.Empty;
        public string? Descricao { get; set; }
        public string? Origem { get; set; }
        public string? Url { get; set; }
        public int QuestionId { get; set; }
        public Question Question { get; set; }
    }

}