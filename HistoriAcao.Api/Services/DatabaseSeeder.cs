using HistoriAcao.Api.Models;
using HistoriAcao.Api.Data;
using System.IO;
using System.Text.Json;

using Microsoft.EntityFrameworkCore;


namespace HistoriAcao.Api.Services
{
    public static class DatabaseSeeder
    {
        private static DateTime Utc(int year, int month, int day)
        {
            return DateTime.SpecifyKind(new DateTime(year, month, day), DateTimeKind.Utc);
        }
        public static List<Topic> GetTopics()
        {
            return new List<Topic>
            {
                new Topic
                {
                    Nome = "Brasil pré-Cabralino",
                    DataInicio = null,
                    DataFim = Utc(1500, 1, 1)
                },

                new Topic
                {
                    Nome = "Brasil Colônia",
                    DataInicio = Utc(1500, 1, 1),
                    DataFim = Utc(1822, 12, 31),
                    Subtopicos = new List<Subtopic>
                    {
                        new Subtopic
                        {
                            Nome = "Pré-Colonial",
                            DataInicio = Utc(1500, 1, 1),
                            DataFim = Utc(1530, 12, 31)
                        },
                        new Subtopic
                        {
                            Nome = "Colonial",
                            DataInicio = Utc(1530, 1, 1),
                            DataFim = Utc(1808, 12, 31)
                        },
                        new Subtopic
                        {
                            Nome = "Joanino",
                            DataInicio = Utc(1808, 1, 1),
                            DataFim = Utc(1822, 12, 31)
                        },
                    }
                },

                new Topic
                {
                    Nome = "Independência",
                    DataInicio = Utc(1822, 1, 1),
                    DataFim = Utc(1822, 12, 31)
                },

                new Topic
                {
                    Nome = "Primeiro Reinado",
                    DataInicio = Utc(1822, 1, 1),
                    DataFim = Utc(1831, 12, 31),
                    Subtopicos = new List<Subtopic>
                    {
                        new Subtopic
                        {
                            Nome = "Consolidação da Independência",
                            DataInicio = Utc(1822, 1, 1),
                            DataFim = Utc(1823, 12, 31)
                        },
                        new Subtopic
                        {
                            Nome = "Organização Política",
                            DataInicio = Utc(1823, 1, 1),
                            DataFim = Utc(1828, 12, 31)
                        },
                        new Subtopic
                        {
                            Nome = "Crise e Abdicação",
                            DataInicio = Utc(1828, 1, 1),
                            DataFim = Utc(1831, 12, 31)
                        },
                    }
                },

                new Topic
                {
                    Nome = "Período Regencial",
                    DataInicio = Utc(1831, 1, 1),
                    DataFim = Utc(1840, 12, 31),
                    Subtopicos = new List<Subtopic>
                    {
                        new Subtopic
                        {
                            Nome = "Regência Trina Provisória",
                            DataInicio = Utc(1831, 1, 1),
                            DataFim = Utc(1831, 12, 31)
                        },
                        new Subtopic
                        {
                            Nome = "Regência Trina Permanente",
                            DataInicio = Utc(1831, 1, 1),
                            DataFim = Utc(1835, 12, 31)
                        },
                        new Subtopic
                        {
                            Nome = "Regência Una",
                            DataInicio = Utc(1835, 1, 1),
                            DataFim = Utc(1840, 12, 31)
                        },
                        new Subtopic
                        {
                            Nome = "Revoltas Regenciais",
                            DataInicio = Utc(1831, 1, 1),
                            DataFim = Utc(1845, 12, 31)
                        },
                    }
                },

                new Topic
                {
                    Nome = "Segundo Reinado",
                    DataInicio = Utc(1840, 1, 1),
                    DataFim = Utc(1889, 12, 31),
                    Subtopicos = new List<Subtopic>
                    {
                        new Subtopic
                        {
                            Nome = "Consolidação",
                            DataInicio = Utc(1840, 1, 1),
                            DataFim = Utc(1850, 12, 31)
                        },
                        new Subtopic
                        {
                            Nome = "Auge",
                            DataInicio = Utc(1850, 1, 1),
                            DataFim = Utc(1870, 12, 31)
                        },
                        new Subtopic
                        {
                            Nome = "Declínio",
                            DataInicio = Utc(1870, 1, 1),
                            DataFim = Utc(1889, 12, 31)
                        },
                    }
                },

                new Topic
                {
                    Nome = "República Velha",
                    DataInicio = Utc(1889, 1, 1),
                    DataFim = Utc(1930, 12, 31),
                    Subtopicos = new List<Subtopic>
                    {
                        new Subtopic
                        {
                            Nome = "República da Espada",
                            DataInicio = Utc(1889, 1, 1),
                            DataFim = Utc(1894, 12, 31)
                        },
                        new Subtopic
                        {
                            Nome = "República do Café com Leite/Oligárquica",
                            DataInicio = Utc(1894, 1, 1),
                            DataFim = Utc(1930, 12, 31)
                        },
                    }
                },

                new Topic
                {
                    Nome = "Era Vargas",
                    DataInicio = Utc(1930, 1, 1),
                    DataFim = Utc(1945, 12, 31),
                    Subtopicos = new List<Subtopic>
                    {
                        new Subtopic
                        {
                            Nome = "Governo Provisório",
                            DataInicio = Utc(1930, 1, 1),
                            DataFim = Utc(1934, 12, 31)
                        },
                        new Subtopic
                        {
                            Nome = "Governo Constitucional",
                            DataInicio = Utc(1934, 1, 1),
                            DataFim = Utc(1937, 12, 31)
                        },
                        new Subtopic
                        {
                            Nome = "Estado Novo",
                            DataInicio = Utc(1937, 1, 1),
                            DataFim = Utc(1945, 12, 31)
                        },
                    }
                },

                new Topic
                {
                    Nome = "Quarta República",
                    DataInicio = Utc(1946, 1, 1),
                    DataFim = Utc(1964, 12, 31),
                    Subtopicos = new List<Subtopic>
                    {
                        new Subtopic
                        {
                            Nome = "Redemocratização e Constituição de 1946",
                            DataInicio = Utc(1946, 1, 1),
                            DataFim = Utc(1946, 12, 31)
                        },
                        new Subtopic
                        {
                            Nome = "Governo Getúlio Vargas",
                            DataInicio = Utc(1951, 1, 1),
                            DataFim = Utc(1954, 12, 31)
                        },
                        new Subtopic
                        {
                            Nome = "Café Filho e Juscelino Kubitschek",
                            DataInicio = Utc(1954, 1, 1),
                            DataFim = Utc(1961, 12, 31)
                        },
                        new Subtopic
                        {
                            Nome = "Crise política e renúncia de Jânio Quadros",
                            DataInicio = Utc(1961, 1, 1),
                            DataFim = Utc(1961, 12, 31)
                        },
                        new Subtopic
                        {
                            Nome = "João Goulart e o caminho para o golpe",
                            DataInicio = Utc(1961, 1, 1),
                            DataFim = Utc(1964, 12, 31)
                        },
                    }
                },

                new Topic
                {
                    Nome = "Ditadura Militar",
                    DataInicio = Utc(1964, 1, 1),
                    DataFim = Utc(1985, 12, 31),
                    Subtopicos = new List<Subtopic>
                    {
                        new Subtopic
                        {
                            Nome = "Consolidação",
                            DataInicio = Utc(1964, 1, 1),
                            DataFim = Utc(1968, 12, 31)
                        },
                        new Subtopic
                        {
                            Nome = "Anos de Chumbo",
                            DataInicio = Utc(1968, 1, 1),
                            DataFim = Utc(1978, 12, 31)
                        },
                        new Subtopic
                        {
                            Nome = "Abertura Política",
                            DataInicio = Utc(1978, 1, 1),
                            DataFim = Utc(1985, 12, 31)
                        },
                    }
                },

                new Topic
                {
                    Nome = "Nova República",
                    DataInicio = Utc(1985, 1, 1),
                    DataFim = DateTime.UtcNow
                },
            };
        }
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            if (!await context.Topics.AnyAsync())
            {
                var topics = GetTopics(); 
                await context.Topics.AddRangeAsync(topics); 
                await context.SaveChangesAsync(); 
            }
            var path = "questions.json";
            if (!File.Exists(path))
                throw new FileNotFoundException("Arquivo questions.json não encontrado");

            var questionsFromJson = JsonSerializer.Deserialize<List<Question>>(
                await File.ReadAllTextAsync(path),
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
            ) ?? throw new Exception("Falha na desserialização do JSON");

            using var transaction = await context.Database.BeginTransactionAsync();

            try
            {
                foreach (var question in questionsFromJson)
                {
                    var existingQuestion = await context.Questions.FirstOrDefaultAsync(q => q.Enunciado == question.Enunciado && q.TopicoId == question.TopicoId && q.SubtopicoId == question.SubtopicoId && q.Olimpiada == question.Olimpiada);
                    var topico = await context.Topics.FindAsync(question.TopicoId);
                    if (topico == null)
                    {
                        throw new ArgumentNullException("Tópico não encontrado");
                    }
                    var subtopico = await context.Subtopics.FindAsync(question.SubtopicoId);

                    if (existingQuestion == null)
                    {
                        var newQuestion = new Question
                        {
                            Fase = question.Fase,
                            Enunciado = question.Enunciado,
                            Olimpiada = question.Olimpiada,
                            NivelDificuldade = question.NivelDificuldade,
                            Topico = topico,
                            TopicoId = question.TopicoId,
                            Subtopico = subtopico,
                            SubtopicoId = question.SubtopicoId
                        };

                        context.Add(newQuestion);
                        topico.Questoes.Add(newQuestion);
                        context.Update(topico);

                        if (subtopico != null)
                        {
                            subtopico.Questoes.Add(newQuestion);
                            context.Update(subtopico);
                        }

                        await context.SaveChangesAsync();

                        if (question.Documentos.Any())
                        {
                            var newDocs = question.Documentos.Select(d => new Document
                            {
                                Tipo = d.Tipo,
                                Descricao = d.Descricao,
                                Texto = d.Texto,
                                Titulo = d.Titulo,
                                Url = d.Url,
                                Origem = d.Origem,
                                Questao = newQuestion,
                                QuestaoId = newQuestion.Id
                            }).ToList();

                            foreach (var doc in newDocs)
                            {
                                newQuestion.Documentos.Add(doc);
                            }
                        }

                        if (question.Alternativas.Any())
                        {
                            var newAlternative = question.Alternativas.Select(a => new Alternative
                            {
                                Texto = a.Texto,
                                Letra = a.Letra,
                                Pontuacao = a.Pontuacao,
                                Questao = newQuestion,
                                QuestaoId = newQuestion.Id
                            });

                            foreach (var alt in newAlternative)
                            {
                                newQuestion.Alternativas.Add(alt);
                            }
                        }

                        context.Update(newQuestion);
                        await context.SaveChangesAsync();
                    }
                }

                await transaction.CommitAsync();
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

    }

}
