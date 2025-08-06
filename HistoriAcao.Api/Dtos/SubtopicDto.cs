

namespace HistoriAcao.Api.Dtos
{
    public class SubtopicDto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public DateTime? DataInicio { get; set; }
        public DateTime? DataFim { get; set; }

    }

}