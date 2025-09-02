using System.Net;
using HistoriAcao.Api.Dtos;
using Newtonsoft.Json;


namespace HistoriAcao.Api.IntegrationTests.Tests
{
    [Collection("DatabaseCollection")]
    public class QuestionControllerTests : BaseIntegrationTest
    {
        public QuestionControllerTests(CustomWebApplicationFactory factory) : base(factory)
        {
        }

        [Fact]
        public async Task GetAllQuestions_ShouldReturnOkAndContent()
        {
            var response = await Client.GetAsync("api/question");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var responseString = await response.Content.ReadAsStringAsync();
            Assert.NotEmpty(responseString);
        }

        [Fact]
        public async Task GetByFilter_WithTopicAndDifficulty_ShouldReturnFilteredQuestions()
        {
            var topicName = WebUtility.UrlEncode("Segundo Reinado");
            var nivelDificuldade = "Fácil";
            var url = $"api/question/by-filters?topicName={topicName}&nivelDificuldade={nivelDificuldade}";

            var response = await Client.GetAsync(url);

            response.EnsureSuccessStatusCode();

            var questions = JsonConvert.DeserializeObject<List<QuestionDto>>(await response.Content.ReadAsStringAsync());

            Assert.NotNull(questions);
            Assert.All(questions, q =>
            {
                Assert.Equal("Segundo Reinado", q.Topico);
                Assert.Equal("Fácil", q.NivelDificuldade);
            });
        }

        [Fact]
        public async Task GetByFilter_WithDateRange_ShouldReturnFilteredQuestions()
        {
            var dataInicio = DateTime.SpecifyKind(new DateTime(1800, 01, 01), DateTimeKind.Utc);
            var dataFim = DateTime.SpecifyKind(new DateTime(1900, 01, 01), DateTimeKind.Utc);
            var dataInicioEncoded = WebUtility.UrlEncode(dataInicio.ToString("o"));
            var dataFimEncoded = WebUtility.UrlEncode(dataFim.ToString("o"));

            var url = $"/api/question/by-filters?inicialDate={dataInicioEncoded}&finishDate={dataFimEncoded}";

            var response = await Client.GetAsync(url);

            response.EnsureSuccessStatusCode();

            var questions = JsonConvert.DeserializeObject<List<QuestionDto>>(await response.Content.ReadAsStringAsync());

            Assert.NotNull(questions);
            Assert.NotEmpty(questions);
            Assert.Contains(questions, q => q.Topico == "Segundo Reinado");
        }

        [Fact]
        public async Task GetByFilter_WhenNoResultsFound_ShouldReturnOkWithEmptyList()
        {
            var olimpiadaInexistente = "OLIMPIADA_QUE_NAO_EXISTE_123";
            var url = $"api/question/by-filters?olimpiada={olimpiadaInexistente}";

            var response = await Client.GetAsync(url);

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var questions = JsonConvert.DeserializeObject<List<QuestionDto>>(await response.Content.ReadAsStringAsync());
            Assert.NotNull(questions);
            Assert.Empty(questions);
        }

        [Fact]
        public async Task GetQuestionById_ShouldReturnOkAndContent()
        {
            var id = 1;
            var response = await Client.GetAsync($"api/question/by-id/{id}");

            response.EnsureSuccessStatusCode();
            var question = JsonConvert.DeserializeObject<QuestionDto>(await response.Content.ReadAsStringAsync());

            Assert.NotNull(question);
            Assert.Equal(question.Id, id);
        }
    }


}