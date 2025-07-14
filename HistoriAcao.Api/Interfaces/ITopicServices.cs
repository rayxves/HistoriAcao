using HistoriAcao.Api.Dtos;
using HistoriAcao.Api.Models;

namespace HistoriAcao.Api.Interfaces
{
    public interface ITopicServices
    {
        Task<IEnumerable<TopicDto>> GetAllTopicsAsync();
        Task<TopicDto> CreateTopicAsync(Topic topic);
        Task<TopicDto> UpdateTopicAsync(Topic topic);
        Task<bool> DeleteTopicAsync(int id);
        Task<IEnumerable<SubtopicDto>> GetSubtopicsByTopicIdAsync(int topicId);
        Task<IEnumerable<QuestionDto>> GetQuestionsByTopicIdAsync(int topicId);
        Task<IEnumerable<QuestionDto>> GetQuestionsBySubtopicIdAsync(int subtopicId);

    }
}
