using HistoriAcao.Api.Data;
using HistoriAcao.Api.Dtos;
using HistoriAcao.Api.Interfaces;
using HistoriAcao.Api.Mappers;
using HistoriAcao.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace HistoriAcao.Api.Services
{
    public class QuestionServices : IQuestionServices
    {
        private readonly ApplicationDbContext _context;
        public QuestionServices(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<QuestionDto> CreateQuestionAsync(CreateQuestionDto questionDto)
        {
            var topic = await _context.Topics.FirstOrDefaultAsync(t => t.Nome.ToLower() == questionDto.Topico.ToLower());
            if (topic == null)
            {
                throw new ArgumentNullException("Tópico não foi encontrado, tente inserir o nome exato novamente.");
            }

            Subtopic? subtopico = null;
            if (!string.IsNullOrWhiteSpace(questionDto.Subtopico))
            {
                subtopico = await _context.Subtopics.FirstOrDefaultAsync(t => t.Nome.ToLower() == questionDto.Subtopico.ToLower());
                if (subtopico == null)
                {
                    throw new ArgumentNullException("Subtópico não foi encontrado, tente inserir o nome exato novamente.");
                }
            }

            var newQuestion = new Question
            {
                Enunciado = questionDto.Enunciado,
                Olimpiada = questionDto.Olimpiada,
                Fase = questionDto.Fase,
                NivelDificuldade = questionDto.NivelDificuldade,
                Topico = topic,
                Subtopico = subtopico,
                TopicoId = topic.Id,
                SubtopicoId = subtopico != null ? subtopico.Id : null,
            };

            _context.Add(newQuestion);
            await _context.SaveChangesAsync();

            var documents = questionDto.Documentos?.Select(q => new Document
            {
                Titulo = q.Titulo,
                Tipo = q.Tipo,
                Texto = q.Texto,
                Url = q.Url,
                Descricao = q.Descricao,
                Questao = newQuestion,
                QuestaoId = newQuestion.Id
            }).ToList();

            var alternatives = questionDto.Alternativas.Select(a => new Alternative
            {
                Texto = a.Texto,
                Letra = a.Letra,
                Pontuacao = a.Pontuacao,
                Questao = newQuestion,
                QuestaoId = newQuestion.Id
            }).ToList();

            newQuestion.Documentos = documents;
            newQuestion.Alternativas = alternatives;
            _context.Update(newQuestion);
            await _context.SaveChangesAsync();

            return await newQuestion.MapToQuestionDto(_context);
        }

        public async Task<bool> DeleteQuestionAsync(int id)
        {
            var question = await _context.Questions.FirstOrDefaultAsync(q => q.Id == id);
            if (question == null)
            {
                throw new ArgumentNullException("Nenhuma questão foi encontrada para esse id.");
            }

            _context.Remove(question);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<QuestionDto>> GetAllQuestionsAsync()
        {
            var questions = await _context.Questions
                .Include(q => q.Topico)
                .Include(q => q.Subtopico)
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

       

        public async Task<QuestionDto> GetQuestionByIdAsync(int id)
        {
            var question = await _context.Questions
                .Include(q => q.Topico)
                .Include(q => q.Subtopico)
                .Include(q => q.Documentos)
                .Include(q => q.Alternativas)
                .FirstOrDefaultAsync(q => q.Id == id);
            if (question == null)
            {
                throw new ArgumentNullException("Nenhuma questão foi encontrada.");
            }

            return await question.MapToQuestionDto(_context);
        }

        public async Task<List<QuestionDto>> GetQuestionsByFilterAsync(
            string? topicName,
            string? subtopicName,
            int? fase,
            string? olimpiada,
            DateTime? inicialDate,
            DateTime? finishDate)
        {
            var query = _context.Questions
                .Include(q => q.Topico)
                .Include(q => q.Subtopico)
                .Include(q => q.Documentos)
                .Include(q => q.Alternativas)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(olimpiada))
            {
                query = query.Where(q => q.Olimpiada == olimpiada);
            }

            if (!string.IsNullOrWhiteSpace(topicName))
            {
                query = query.Where(q => q.Topico.Nome == topicName);
            }

            if (!string.IsNullOrWhiteSpace(subtopicName))
            {
                query = query.Where(q => q.Subtopico.Nome == subtopicName);
            }

            if (fase.HasValue)
            {
                query = query.Where(q => q.Fase == fase.Value);
            }

            if (inicialDate.HasValue)
            {
                query = query.Where(q =>
                    (q.Topico.DataInicio == null || q.Topico.DataInicio >= inicialDate.Value) &&
                    (q.Subtopico.DataInicio == null || q.Subtopico.DataInicio >= inicialDate.Value));
            }

            if (finishDate.HasValue)
            {
                query = query.Where(q =>
                    (q.Topico.DataFim == null || q.Topico.DataFim <= finishDate.Value) &&
                    (q.Subtopico.DataFim == null || q.Subtopico.DataFim <= finishDate.Value));
            }

            var filteredQuestions = await query.ToListAsync();

            var questionDtos = new List<QuestionDto>();
            foreach (var q in filteredQuestions)
            {
                var dto = await q.MapToQuestionDto(_context);
                questionDtos.Add(dto);
            }

            return questionDtos;
        }

        public async Task<QuestionDto> UpdateQuestionAsync(QuestionDto questionDto)
        {
            var question = await _context.Questions
                .Include(q => q.Topico)
                .Include(q => q.Subtopico)
                .Include(q => q.Documentos)
                .Include(q => q.Alternativas)
                .FirstOrDefaultAsync(q => q.Id == questionDto.Id);
            if (question == null)
            {
                throw new ArgumentNullException("Nenhuma questão foi encontrada para esse id.");
            }
            var topic = await _context.Topics.FirstOrDefaultAsync(t => t.Nome.ToLower() == questionDto.Topico.ToLower());
            if (topic == null)
            {
                throw new ArgumentNullException("Tópico não foi encontrado, tente inserir o nome exato novamente.");
            }

            Subtopic? subtopico = null;
            if (!string.IsNullOrWhiteSpace(questionDto.Subtopico))
            {
                subtopico = await _context.Subtopics.FirstOrDefaultAsync(t => t.Nome.ToLower() == questionDto.Subtopico.ToLower());
                if (subtopico == null)
                {
                    throw new ArgumentNullException("Subtópico não foi encontrado, tente inserir o nome exato novamente.");
                }
            }

            question.Enunciado = questionDto.Enunciado;
            question.Fase = questionDto.Fase;
            question.Subtopico = subtopico;
            question.Topico = topic;
            question.SubtopicoId = subtopico?.Id;
            question.TopicoId = topic.Id;
            question.Olimpiada = questionDto.Olimpiada;
            question.Alternativas = questionDto.Alternativas.Select(a => new Alternative
            {
                Texto = a.Texto,
                Letra = a.Letra,
                Pontuacao = a.Pontuacao,
                Questao = question,
                QuestaoId = question.Id
            }).ToList();
            question.Documentos = questionDto.Documentos.Select(d => new Document
            {
                Tipo = d.Tipo,
                Texto = d.Texto,
                Titulo = d.Titulo,
                Descricao = d.Descricao,
                Origem = d.Origem,
                Url = d.Url,
                Questao = question,
                QuestaoId = question.Id
            }).ToList();

            _context.Update(question);
            await _context.SaveChangesAsync();
            return questionDto;

        }



    }
}
