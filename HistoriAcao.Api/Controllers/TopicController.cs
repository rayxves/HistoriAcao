using HistoriAcao.Api.Dtos;
using HistoriAcao.Api.Interfaces;
using HistoriAcao.Api.Models;
using HistoriAcao.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace HistoriAcao.Api.Controllers
{
    [ApiController]
    [Route("api")]
    public class TopicController : ControllerBase
    {
        private readonly ITopicServices _topicServices;

        public TopicController(ITopicServices topicServices)
        {
            _topicServices = topicServices;
        }

        [HttpGet("subtopics/{id}/questions")]
        public async Task<IActionResult> GetQuestionsBySubtopicId(int id)
        {
            var questions = await _topicServices.GetQuestionsBySubtopicIdAsync(id);
            if (questions == null || !questions.Any())
            {
                return NotFound();
            }

            return Ok(questions);
        }

        [HttpGet("topics/{id}/questions")]
        public async Task<IActionResult> GetQuestionsByTopicId(int id)
        {
            var questions = await _topicServices.GetQuestionsByTopicIdAsync(id);
            if (questions == null || !questions.Any())
            {
                return NotFound();
            }

            return Ok(questions);
        }

        [HttpGet("topics")]
        public async Task<IActionResult> GetAllTopics()
        {
            var topics = await _topicServices.GetAllTopicsAsync();
            if (topics == null || !topics.Any())
            {
                return NotFound();
            }

            return Ok(topics);
        }

        [HttpPost("topics/create")]
        public async Task<IActionResult> CreateTopic([FromBody] TopicDto topic)
        {
            if (topic == null)
            {
                return BadRequest("Topic cannot be null");
            }

            var topicModel = new Topic
            {
                Nome = topic.Nome,
                DataInicio = topic.DataInicio,
                DataFim = topic.DataFim,
                Subtopicos = topic.Subtopicos?.Select(s => new Subtopic
                {
                    Nome = s.Nome,
                    DataInicio = s.DataInicio,
                    DataFim = s.DataFim
                }).ToList() ?? new List<Subtopic>()
            };

            var createdTopic = await _topicServices.CreateTopicAsync(topicModel);
            return CreatedAtAction(nameof(GetAllTopics), createdTopic);
        }

        [HttpPut("topics/update")]
        public async Task<IActionResult> UpdateTopic([FromBody] TopicDto topic)
        {
            if (topic == null)
            {
                return BadRequest("Topic cannot be null");
            }

            var topicModel = new Topic
            {
                Nome = topic.Nome,
                DataInicio = topic.DataInicio,
                DataFim = topic.DataFim,
                Subtopicos = topic.Subtopicos?.Select(s => new Subtopic
                {
                    Nome = s.Nome,
                    DataInicio = s.DataInicio,
                    DataFim = s.DataFim
                }).ToList() ?? new List<Subtopic>()
            };

            var updatedTopic = await _topicServices.UpdateTopicAsync(topicModel);
            return Ok(updatedTopic);
        }

        [HttpDelete("topics/delete")]
        public async Task<IActionResult> DeleteTopic(int id)
        {
            var result = await _topicServices.DeleteTopicAsync(id);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}