using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HistoriAcao.Api.Models
{
    public class Alternative
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Letra { get; set; } = string.Empty;
        public string Texto { get; set; } = string.Empty;
        public int Pontuacao { get; set; }
        public int QuestaoId { get; set; }
        public Question Questao { get; set; }
    }

}