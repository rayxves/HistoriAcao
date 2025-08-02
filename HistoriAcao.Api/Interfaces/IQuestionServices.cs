using HistoriAcao.Api.Dtos;

namespace HistoriAcao.Api.Interfaces
{
    public interface IQuestionServices
    {
        Task<List<QuestionDto>> GetAllQuestionsAsync();
        Task<List<QuestionDto>> GetQuestionsByFilterAsync(string? topicName, string? subtopicName, int? fase, string? olimpiada, DateTime? inicialDate, DateTime? finishDate);
        Task<QuestionDto> CreateQuestionAsync(QuestionDto questionDto);
        Task<QuestionDto> UpdateQuestionAsync(QuestionDto questionDto, int id);
        Task<bool> DeleteQuestionAsync(int id);
        Task<QuestionDto> GetQuestionByIdAsync(int id);
        Task<QuestionDto> GetQuestionByEnunciadoAndOlimpiadaAsync(string enunciado, string olimpiada);
    }
}