

namespace HistoriAcao.Api.Dtos
{
    public class QuestionDto
    {

        public int Fase { get; set; }
        public string NivelDificuldade { get; set; } = "Média";

        public string Topico { get; set; }

        public string Subtopico { get; set; }

        public string Enunciado { get; set; } = string.Empty;

        public ICollection<DocumentDto>? Documentos { get; set; } = new List<DocumentDto>();
        public ICollection<AlternativeDto>? Alternativas { get; set; } = new List<AlternativeDto>();
    }

}