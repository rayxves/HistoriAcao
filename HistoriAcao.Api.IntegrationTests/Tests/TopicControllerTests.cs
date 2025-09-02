using System.Net;
using HistoriAcao.Api.Dtos;
using Newtonsoft.Json;


namespace HistoriAcao.Api.IntegrationTests.Tests
{
    [Collection("DatabaseCollection")]
    public class TopicControllerTests : BaseIntegrationTest
    {
        public TopicControllerTests(CustomWebApplicationFactory factory) : base(factory)
        {
        }

        [Fact]
        public async Task GetAllTopics_ShouldReturnOkAndContent()
        {
            var response = await Client.GetAsync("api/topics");
            
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            
            var responseString = await response.Content.ReadAsStringAsync();
            Assert.NotEmpty(responseString);
        }

        [Fact]
        public async Task GetQuestionsByTopicId_WhenTopicExists_ShouldReturnOkAndQuestions()
        {
            var topicId = 6;
            var url = $"api/topics/{topicId}/questions";

            var response = await Client.GetAsync(url);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var responseString = await response.Content.ReadAsStringAsync();
            var questions = JsonConvert.DeserializeObject<List<QuestionDto>>(responseString);
            
            Assert.NotNull(questions);
            Assert.NotEmpty(questions);
        }

        [Fact]
        public async Task GetQuestionsByTopicId_WhenTopicDoesNotExist_ShouldReturnNotFound()
        {
            var nonExistentTopicId = 999;
            var url = $"api/topics/{nonExistentTopicId}/questions";
            
            var response = await Client.GetAsync(url);
            
            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task GetQuestionsBySubtopicId_WhenSubtopicExists_ShouldReturnOkAndQuestions()
        {
            var subtopicId = 13;
            var url = $"api/subtopics/{subtopicId}/questions";

            var response = await Client.GetAsync(url);
            
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            
            var responseString = await response.Content.ReadAsStringAsync();
            var questions = JsonConvert.DeserializeObject<List<QuestionDto>>(responseString);

            Assert.NotNull(questions);
            Assert.NotEmpty(questions);
        }

        [Fact]
        public async Task GetQuestionsBySubtopicId_WhenSubtopicDoesNotExist_ShouldReturnNotFound()
        {
            var nonExistentSubtopicId = 999;
            var url = $"api/subtopics/{nonExistentSubtopicId}/questions";

            var response = await Client.GetAsync(url);

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }
    }
}