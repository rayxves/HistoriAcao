using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HistoriAcao.Api.Models
{
    public class Question
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int Fase { get; set; }
        public string NivelDificuldade { get; set; } = "Média";

        public int TopicoId { get; set; }
        public Topic Topico { get; set; }

        public int SubtopicoId { get; set; }
        public Subtopic Subtopico { get; set; }

        public string Enunciado { get; set; } = string.Empty;

        public ICollection<Document>? Documentos { get; set; } = new List<Document>();
        public ICollection<Alternative>? Alternativas { get; set; } = new List<Alternative>();
    }

}