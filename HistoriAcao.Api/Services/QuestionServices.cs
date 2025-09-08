using Microsoft.EntityFrameworkCore;
using HistoriAcao.Api.Data;
using HistoriAcao.Api.Dtos;
using HistoriAcao.Api.Interfaces;
using HistoriAcao.Api.Models;
using HistoriAcao.Api.Mappers;

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
                throw new ArgumentNullException(nameof(questionDto.Topico), "Tópico não foi encontrado.");
            }

            Subtopic? subtopic = null;
            if (!string.IsNullOrWhiteSpace(questionDto.Subtopico))
            {
                subtopic = await _context.Subtopics.FirstOrDefaultAsync(t => t.Nome.ToLower() == questionDto.Subtopico.ToLower());
                if (subtopic == null)
                {
                    throw new ArgumentNullException(nameof(questionDto.Subtopico), "Subtópico não foi encontrado.");
                }
            }

            var newQuestion = new Question
            {
                Enunciado = questionDto.Enunciado,
                Olimpiada = questionDto.Olimpiada,
                Fase = questionDto.Fase,
                NivelDificuldade = questionDto.NivelDificuldade,
                TopicoId = topic.Id,
                SubtopicoId = subtopic?.Id,
                Alternativas = questionDto.Alternativas?.Select(a => new Alternative
                {
                    Texto = a.Texto,
                    Letra = a.Letra,
                    Pontuacao = a.Pontuacao,
                }).ToList() ?? new List<Alternative>(),
                Documentos = questionDto.Documentos?.Select(d => new Document
                {
                    Titulo = d.Titulo,
                    Tipo = d.Tipo,
                    Texto = d.Texto,
                    Url = d.Url,
                    Descricao = d.Descricao,
                    Origem = d.Origem
                }).ToList() ?? new List<Document>()
            };

            await _context.Questions.AddAsync(newQuestion);
            await _context.SaveChangesAsync();

            return new QuestionDto
            {
                Id = newQuestion.Id,
                Enunciado = newQuestion.Enunciado,
                Olimpiada = newQuestion.Olimpiada,
                Fase = newQuestion.Fase,
                NivelDificuldade = newQuestion.NivelDificuldade,
                Topico = topic.Nome,
                Subtopico = subtopic?.Nome
            };
        }

        public async Task<bool> DeleteQuestionAsync(int id)
        {
            var question = await _context.Questions.FirstOrDefaultAsync(q => q.Id == id);
            if (question == null)
            {
                throw new ArgumentNullException(nameof(id), "Nenhuma questão foi encontrada para esse id.");
            }

            _context.Remove(question);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<List<QuestionDto>> GetAllQuestionsAsync()
        {
            var questions = await _context.Questions
                .AsNoTracking()
                .Select(q => new QuestionDto
                {
                    Id = q.Id,
                    Enunciado = q.Enunciado,
                    Olimpiada = q.Olimpiada,
                    Fase = q.Fase,
                    NivelDificuldade = q.NivelDificuldade,
                    Topico = q.Topico.Nome,
                    DataInicio = q.Topico.DataInicio,
                    DataFim = q.Topico.DataFim,
                    Subtopico = q.Subtopico != null ? q.Subtopico.Nome : null,
                    Alternativas = q.Alternativas.Select(a => new AlternativeDto
                    {
                        Id = a.Id,
                        Letra = a.Letra,
                        Texto = a.Texto,
                        Pontuacao = a.Pontuacao
                    }).ToList(),
                    Documentos = q.Documentos.Select(d => new DocumentDto
                    {
                        Id = d.Id,
                        Titulo = d.Titulo,
                        Tipo = d.Tipo,
                        Texto = d.Texto,
                        Url = d.Url,
                        Descricao = d.Descricao,
                        Origem = d.Origem
                    }).ToList()
                })
                .ToListAsync();

            return questions;
        }

        public async Task<List<QuestionDto>> GetQuestionsByFilterAsync(
            string? topicName, string? subtopicName, int? fase, string? olimpiada,
            DateTime? inicialDate, DateTime? finishDate, string? search, string? nivelDificuldade)
        {
            var query = _context.Questions
                .Include(q => q.Topico)
                .Include(q => q.Subtopico)
                .Include(q => q.Documentos)
                .Include(q => q.Alternativas)
                .AsNoTracking()
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
                query = query.Where(q => q.Subtopico != null && q.Subtopico.Nome.ToLower() == subtopicName.Trim().ToLower());
            }
            if (!string.IsNullOrWhiteSpace(search))
            {
                string searchLower = search.ToLower().Trim();
                query = query.Where(q => q.Enunciado.ToLower().Contains(searchLower) || q.Alternativas.Any(a => a.Texto.ToLower().Contains(searchLower)));
            }
            if (!string.IsNullOrWhiteSpace(nivelDificuldade))
            {
                query = query.Where(q => q.NivelDificuldade.ToLower() == nivelDificuldade.ToLower());
            }
            if (fase.HasValue)
            {
                query = query.Where(q => q.Fase == fase.Value);
            }
            if (inicialDate.HasValue)
            {
                query = query.Where(q =>
                    (q.Topico.DataFim == null || q.Topico.DataInicio >= inicialDate.Value) &&
                    (q.Subtopico != null && q.Subtopico.DataFim == null || q.Subtopico != null && q.Subtopico.DataInicio >= inicialDate.Value));
            }

            if (finishDate.HasValue)
            {
                query = query.Where(q =>
                    (q.Topico.DataInicio == null || q.Topico.DataFim <= finishDate.Value) &&
                    (q.Subtopico != null && q.Subtopico.DataInicio == null || q.Subtopico != null && q.Subtopico.DataFim <= finishDate.Value));
            }
            var filteredQuestions = await query
                .Select(q => new QuestionDto
                {
                    Id = q.Id,
                    Enunciado = q.Enunciado,
                    Olimpiada = q.Olimpiada,
                    Fase = q.Fase,
                    NivelDificuldade = q.NivelDificuldade,
                    Topico = q.Topico.Nome,
                    DataInicio = q.Topico.DataInicio,
                    DataFim = q.Topico.DataFim,
                    Subtopico = q.Subtopico != null ? q.Subtopico.Nome : null,
                    Alternativas = q.Alternativas.Select(a => new AlternativeDto
                    {
                        Id = a.Id,
                        Letra = a.Letra,
                        Texto = a.Texto,
                        Pontuacao = a.Pontuacao
                    }).ToList(),
                    Documentos = q.Documentos.Select(d => new DocumentDto
                    {
                        Id = d.Id,
                        Titulo = d.Titulo,
                        Tipo = d.Tipo,
                        Texto = d.Texto,
                        Url = d.Url,
                        Descricao = d.Descricao,
                        Origem = d.Origem
                    }).ToList()
                })
                .ToListAsync();

            return filteredQuestions;
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
                throw new ArgumentNullException(nameof(id), "Nenhuma questão foi encontrada.");
            }

            return await question.MapToQuestionDto(_context);
        }

        public async Task<QuestionDto> UpdateQuestionAsync(QuestionDto questionDto)
        {
            var question = await _context.Questions
                .Include(q => q.Topico)
                .Include(q => q.Subtopico)
                .Include(q => q.Alternativas)
                .Include(q => q.Documentos)
                .FirstOrDefaultAsync(q => q.Id == questionDto.Id);

            if (question == null)
            {
                throw new ArgumentNullException(nameof(questionDto.Id), "Nenhuma questão foi encontrada para esse id.");
            }

            var topic = await _context.Topics.FirstOrDefaultAsync(t => t.Nome.ToLower() == questionDto.Topico.ToLower());
            if (topic == null)
            {
                throw new ArgumentNullException(nameof(questionDto.Topico), "Tópico não foi encontrado.");
            }

            Subtopic? subtopic = null;
            if (!string.IsNullOrWhiteSpace(questionDto.Subtopico))
            {
                subtopic = await _context.Subtopics.FirstOrDefaultAsync(t => t.Nome.ToLower() == questionDto.Subtopico.ToLower());
                if (subtopic == null)
                {
                    throw new ArgumentNullException(nameof(questionDto.Subtopico), "Subtópico não foi encontrado.");
                }
            }

            question.Enunciado = questionDto.Enunciado;
            question.Fase = questionDto.Fase;
            question.Olimpiada = questionDto.Olimpiada;
            question.NivelDificuldade = questionDto.NivelDificuldade;
            question.TopicoId = topic.Id;
            question.SubtopicoId = subtopic?.Id;

            question.Alternativas.Clear();
            if (questionDto.Alternativas != null)
            {
                foreach (var altDto in questionDto.Alternativas)
                {
                    question.Alternativas.Add(new Alternative { Letra = altDto.Letra, Texto = altDto.Texto, Pontuacao = altDto.Pontuacao });
                }
            }

            question.Documentos.Clear();
            if (questionDto.Documentos != null)
            {
                foreach (var docDto in questionDto.Documentos)
                {
                    question.Documentos.Add(new Document { Titulo = docDto.Titulo, Tipo = docDto.Tipo, Texto = docDto.Texto, Url = docDto.Url, Descricao = docDto.Descricao, Origem = docDto.Origem });
                }
            }

            await _context.SaveChangesAsync();
            return questionDto;
        }
    }
}