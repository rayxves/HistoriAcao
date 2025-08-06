
namespace HistoriAcao.Api.Dtos
{
    public class AlternativeDto
    {
        public int Id { get; set; }
        public string Letra { get; set; } = string.Empty;
        public string Texto { get; set; } = string.Empty;
        public int Pontuacao { get; set; }
    }

}