using System.ComponentModel.DataAnnotations;

namespace HistoriAcao.Api.Models
{
    public class Topic
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Nome { get; set; } = string.Empty;

    public List<Subtopic>? Subtopicos { get; set; } = new();
}

}