using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HistoriAcao.Api.Models
{
    public class Topic
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Nome { get; set; }
        public DateTime? DataInicio { get; set; }
        public DateTime? DataFim { get; set; }
        public ICollection<Subtopic> Subtopicos { get; set; } = new List<Subtopic>();
        public ICollection<Question> Questoes { get; set; } = new List<Question>();
    }
}
