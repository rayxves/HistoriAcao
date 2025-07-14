

namespace HistoriAcao.Api.Dtos
{
    public class TopicDto
    {
        public string Nome { get; set; }
        public DateTime? DataInicio { get; set; }
        public DateTime? DataFim { get; set; }
        public ICollection<SubtopicDto> Subtopicos { get; set; } = new List<SubtopicDto>();
    }
}
