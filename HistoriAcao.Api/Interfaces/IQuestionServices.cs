using HistoriAcao.Api.Dtos;

namespace HistoriAcao.Api.Interfaces
{
    public interface IQuestionServices
    {
        Task<List<QuestionDto>> GetAllQuestionsAsync();
        Task<List<QuestionDto>> GetQuestionsByFilterAsync(string? topicName, string? subtopicName, int? fase, string? olimpiada, DateTime? inicialDate, DateTime? finishDate, string? enunciado, string? nivelDificuldade);
        Task<QuestionDto> CreateQuestionAsync(CreateQuestionDto questionDto);
        Task<QuestionDto> UpdateQuestionAsync(QuestionDto questionDto);
        Task<bool> DeleteQuestionAsync(int id);
        Task<QuestionDto> GetQuestionByIdAsync(int id);
    }
}