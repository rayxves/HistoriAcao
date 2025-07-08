using System.ComponentModel.DataAnnotations;

namespace HistoriAcao.Api.Models
{
    public class Subtopic
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Nome { get; set; } = string.Empty;
        public int TopicId { get; set; }
        public Topic Topic { get; set; }
    }

}