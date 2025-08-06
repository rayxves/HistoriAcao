using HistoriAcao.Api.Data;
using HistoriAcao.Api.Dtos;
using HistoriAcao.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HistoriAcao.Api.Mappers
{
    public static class ModelsToDto
    {
        public async static Task<QuestionDto> MapToQuestionDto(this Question question, ApplicationDbContext context)
        {
            var topico = await context.Topics.FirstOrDefaultAsync(t => t.Id == question.TopicoId);

            var subtopico = await context.Subtopics.FirstOrDefaultAsync(s => s.Id == question.SubtopicoId);

            var questionDto = new QuestionDto
            {
                Id = question.Id,
                Enunciado = question.Enunciado,
                NivelDificuldade = question.NivelDificuldade,
                Fase = question.Fase,
                Olimpiada = question.Olimpiada,
                Topico = topico.Nome,
                Subtopico = subtopico != null ? subtopico.Nome : null,
                DataInicio = subtopico != null ? subtopico.DataInicio : topico.DataInicio,
                DataFim = subtopico != null ? subtopico.DataFim : topico.DataFim,
                Documentos = question.Documentos?.Select(d => d.MapToDocumentDto()).ToList(),
                Alternativas = question.Alternativas?.Select(a => a.MapToAlternativeDto()).ToList()
            };

            return questionDto;
        }
        public static DocumentDto MapToDocumentDto(this Document doc)
        {
            return new DocumentDto
            {
                Id = doc.Id,
                Titulo = doc.Titulo,
                Tipo = doc.Tipo,
                Texto = doc.Texto,
                Url = doc.Url,
                Descricao = doc.Descricao,
                Origem = doc.Origem
            };
        }

        public static AlternativeDto MapToAlternativeDto(this Alternative alt)
        {
            return new AlternativeDto
            {
                Id = alt.Id,
                Texto = alt.Texto,
                Letra = alt.Letra,
                Pontuacao = alt.Pontuacao
            };
        }
    }


}