using System.ComponentModel.DataAnnotations;

namespace HistoriAcao.Api.Models
{
    public class Alternative
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Letra { get; set; } = string.Empty;
        public string Texto { get; set; } = string.Empty;
        public int Pontuacao { get; set; }
        public int QuestionId { get; set; }
        public Question Question { get; set; }
    }

}