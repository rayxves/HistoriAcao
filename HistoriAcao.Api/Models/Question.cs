using System.ComponentModel.DataAnnotations;

namespace HistoriAcao.Api.Models
{
    public class Question
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid(); 

    public int Fase { get; set; }
    public string NivelDificuldade { get; set; } = "Média";

    public Guid TopicId { get; set; }
    public Topic Topic { get; set; }

    public Guid SubtopicId { get; set; }
    public Subtopic Subtopic { get; set; }

    public string Enunciado { get; set; } = string.Empty;

    public List<Document>? Documentos { get; set; } = new();
    public List<Alternative>? Alternativas { get; set; } = new();
}

}