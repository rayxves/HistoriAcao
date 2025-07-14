using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace HistoriAcao.Api.Dtos
{
    public class SubtopicDto
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public DateTime? DataInicio { get; set; }
        public DateTime? DataFim { get; set; }

    }

}