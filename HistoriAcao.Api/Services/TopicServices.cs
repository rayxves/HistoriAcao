using HistoriAcao.Api.Data;
using HistoriAcao.Api.Dtos;
using HistoriAcao.Api.Interfaces;
using HistoriAcao.Api.Mappers;
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
                Id = topic.Id,
                Nome = topic.Nome,
                DataInicio = topic.DataInicio,
                DataFim = topic.DataFim,
                Subtopicos = topic.Subtopicos.Any() ? topic.Subtopicos.Select(s => new SubtopicDto
                {
                    Id = s.Id,
                    Nome = s.Nome,
                    DataInicio = s.DataInicio,
                    DataFim = s.DataFim
                }).ToList() : new List<SubtopicDto>()
            };
        }

        public async Task<bool> DeleteTopicAsync(int id)
        {
            var topic = await _context.Topics.FindAsync(id);
            if (topic == null) return false;

            _context.Topics.Remove(topic);
            return await _context.SaveChangesAsync().ContinueWith(t => t.Result > 0);
        }

        public async Task<IEnumerable<TopicDto>> GetAllTopicsAsync()
        {
            var topics = await _context.Topics.Include(t => t.Subtopicos).ToListAsync();

            return topics.Select(t => new TopicDto
            {
                Id = t.Id,
                Nome = t.Nome,
                DataInicio = t.DataInicio,
                DataFim = t.DataFim,
                Subtopicos = t.Subtopicos?.Select(s => new SubtopicDto
                {
                    Id = s.Id,
                    Nome = s.Nome,
                    DataInicio = s.DataInicio,
                    DataFim = s.DataFim
                }).ToList() ?? new List<SubtopicDto>()
            });
        }

        public async Task<IEnumerable<QuestionDto>> GetQuestionsBySubtopicIdAsync(int subtopicId)
        {
            var questions = await _context.Subtopics
                .Where(t => t.Id == subtopicId)
                .SelectMany(t => t.Questoes)
                .Include(q => q.Documentos)
                .Include(q => q.Alternativas)
                .ToListAsync();

            var questionDtos = new List<QuestionDto>();
            foreach (var q in questions)
            {
                var dto = await q.MapToQuestionDto(_context);
                questionDtos.Add(dto);
            }

            return questionDtos;
        }

        public async Task<IEnumerable<QuestionDto>> GetQuestionsByTopicIdAsync(int topicId)
        {
            var questions = await _context.Topics
                .Where(t => t.Id == topicId)
                .SelectMany(t => t.Questoes)
                .Include(q => q.Documentos)
                .Include(q => q.Alternativas)
                .ToListAsync();

            var questionDtos = new List<QuestionDto>();
            foreach (var q in questions)
            {
                var dto = await q.MapToQuestionDto(_context);
                questionDtos.Add(dto);
            }

            return questionDtos;
        }

        public async Task<IEnumerable<SubtopicDto>> GetSubtopicsByTopicIdAsync(int topicId)
        {
            var topic = await _context.Topics
                .Include(t => t.Subtopicos)
                .FirstOrDefaultAsync(t => t.Id == topicId);

            if (topic == null) return Enumerable.Empty<SubtopicDto>();

            return topic.Subtopicos.Select(s => new SubtopicDto
            {
                Id = s.Id,
                Nome = s.Nome,
                DataInicio = s.DataInicio,
                DataFim = s.DataFim
            });
        }

        public async Task<TopicDto> UpdateTopicAsync(Topic topic)
        {
            if (topic == null || await _context.Topics.FindAsync(topic.Id) == null)
            {
                throw new ArgumentNullException(nameof(topic));
            }

            _context.Topics.Update(topic);
            await _context.SaveChangesAsync();

            return new TopicDto
            {
                Id = topic.Id,
                Nome = topic.Nome,
                DataInicio = topic.DataInicio,
                DataFim = topic.DataFim,
                Subtopicos = topic.Subtopicos.Any() ? topic.Subtopicos.Select(s => new SubtopicDto
                {
                    Id = s.Id,
                    Nome = s.Nome,
                    DataInicio = s.DataInicio,
                    DataFim = s.DataFim
                }).ToList() : new List<SubtopicDto>()
            };
        }
    }
}
