using HistoriAcao.Api.Data;
using HistoriAcao.Api.Dtos;
using HistoriAcao.Api.Interfaces;
using HistoriAcao.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HistoriAcao.Api.Services
{
    public class TopicServices : ITopicServices
    {
        private readonly ApplicationDbContext _context;
        public TopicServices(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<TopicDto> CreateTopicAsync(Topic topic)
        {
            if (topic == null)
            {
                throw new ArgumentNullException(nameof(topic));
            }

            _context.Topics.Add(topic);
            await _context.SaveChangesAsync();

            return new TopicDto
            {
                Nome = topic.Nome,
                DataInicio = topic.DataInicio,
                DataFim = topic.DataFim,
                Subtopicos = topic.Subtopicos.Any() ? topic.Subtopicos.Select(s => new SubtopicDto
                {
                    Nome = s.Nome,
                    DataInicio = s.DataInicio,
                    DataFim = s.DataFim
                }).ToList() : new List<SubtopicDto>()
            };

        }

        public async Task<bool> DeleteTopicAsync(int id)
        {
            var topic = await _context.Topics.FindAsync(id);
            if (topic == null)
            {
                return false;
            }

            _context.Topics.Remove(topic);
            return await _context.SaveChangesAsync().ContinueWith(t => t.Result > 0);
        }

        public async Task<IEnumerable<TopicDto>> GetAllTopicsAsync()
        {
            var topics = await _context.Topics
                .Include(t => t.Subtopicos)
                .ToListAsync();

            return topics.Select(t => new TopicDto
            {
                Nome = t.Nome,
                DataInicio = t.DataInicio,
                DataFim = t.DataFim,
                Subtopicos = t.Subtopicos.Any() ? t.Subtopicos.Select(s => new SubtopicDto
                {
                    Nome = s.Nome,
                    DataInicio = s.DataInicio,
                    DataFim = s.DataFim
                }).ToList() : new List<SubtopicDto>()
            });
        }

        public async Task<IEnumerable<QuestionDto>> GetQuestionsBySubtopicIdAsync(int subtopicId)
        {
            return await _context.Subtopics
                           .Where(t => t.Id == subtopicId)
                           .SelectMany(t => t.Questoes)
                           .Select(q => new QuestionDto
                           {
                               Fase = q.Fase,
                               NivelDificuldade = q.NivelDificuldade,
                               Topico = q.Topico.Nome,
                               Subtopico = q.Subtopico != null ? q.Topico.Nome : string.Empty,
                               Enunciado = q.Enunciado,
                               Documentos = q.Documentos != null ? q.Documentos.Select(d => new DocumentDto
                               {
                                   Descricao = d.Descricao,
                                   Origem = d.Origem,
                                   Url = d.Url
                               }).ToList() : new List<DocumentDto>(),
                               Alternativas = q.Alternativas.Select(a => new AlternativeDto
                               {
                                   Letra = a.Letra,
                                   Texto = a.Texto,
                                   Pontuacao = a.Pontuacao
                               }).ToList()
                           })
                           .ToListAsync();
        }

        public async Task<IEnumerable<QuestionDto>> GetQuestionsByTopicIdAsync(int topicId)
        {
            return await _context.Topics
                .Where(t => t.Id == topicId)
                .SelectMany(t => t.Questoes)
                .Select(q => new QuestionDto
                {
                    Fase = q.Fase,
                    NivelDificuldade = q.NivelDificuldade,
                    Topico = q.Topico.Nome,
                    Subtopico = q.Subtopico != null ? q.Topico.Nome : string.Empty,
                    Enunciado = q.Enunciado,
                    Documentos = q.Documentos != null ? q.Documentos.Select(d => new DocumentDto
                    {
                        Descricao = d.Descricao,
                        Origem = d.Origem,
                        Url = d.Url
                    }).ToList() : new List<DocumentDto>(),
                    Alternativas = q.Alternativas.Select(a => new AlternativeDto
                    {
                        Letra = a.Letra,
                        Texto = a.Texto,
                        Pontuacao = a.Pontuacao
                    }).ToList()
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<SubtopicDto>> GetSubtopicsByTopicIdAsync(int topicId)
        {
            var topic = await _context.Topics
                 .Include(t => t.Subtopicos)
                 .FirstOrDefaultAsync(t => t.Id == topicId);

            if (topic == null)
            {
                return Enumerable.Empty<SubtopicDto>();
            }

            return topic.Subtopicos.Select(s => new SubtopicDto
            {
                Nome = s.Nome,
                DataInicio = s.DataInicio,
                DataFim = s.DataFim
            });
        }

        public Task<TopicDto> UpdateTopicAsync(Topic topic)
        {
            if (topic == null)
            {
                throw new ArgumentNullException(nameof(topic));
            }

            _context.Topics.Update(topic);
            _context.SaveChanges();

            return Task.FromResult(new TopicDto
            {
                Nome = topic.Nome,
                DataInicio = topic.DataInicio,
                DataFim = topic.DataFim,
                Subtopicos = topic.Subtopicos.Any() ? topic.Subtopicos.Select(s => new SubtopicDto
                {
                    Nome = s.Nome,
                    DataInicio = s.DataInicio,
                    DataFim = s.DataFim
                }).ToList() : new List<SubtopicDto>()
            });
        }
    }
}