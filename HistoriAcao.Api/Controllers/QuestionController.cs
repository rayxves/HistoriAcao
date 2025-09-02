using HistoriAcao.Api.Dtos;
using HistoriAcao.Api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace HistoriAcao.Api.Controllers
{
    [Route("api/question")]
    [ApiController]
    public class QuestionController : ControllerBase
    {
        private readonly IQuestionServices _questionService;

        public QuestionController(IQuestionServices questionService)
        {
            _questionService = questionService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllQuestionsAsync()
        {
            try
            {
                var questions = await _questionService.GetAllQuestionsAsync();
                return Ok(questions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, Problem(ex.Message, StatusCodes.Status500InternalServerError));
            }
        }

        [HttpGet("by-id/{id}")]
        public async Task<IActionResult> GetQuestionById(int id)
        {
            try
            {
                var question = await _questionService.GetQuestionByIdAsync(id);
                return Ok(question);
            }
            catch (ArgumentNullException ex)
            {
                return NotFound(Problem(ex.Message, StatusCodes.Status404NotFound));
            }
            catch (Exception ex)
            {
                return StatusCode(500, Problem(ex.Message, StatusCodes.Status500InternalServerError));
            }
        }


        [HttpGet("by-filters")]
        public async Task<IActionResult> GetQuestionByFilter(
            [FromQuery] string? topicName,
            [FromQuery] string? subtopicName,
            [FromQuery] int? fase,
            [FromQuery] string? olimpiada,
            [FromQuery] DateTime? inicialDate,
            [FromQuery] DateTime? finishDate,
            [FromQuery] string? search,
            [FromQuery] string? nivelDificuldade)
        {
            try
            {
                var questions = await _questionService.GetQuestionsByFilterAsync(topicName, subtopicName, fase, olimpiada, inicialDate, finishDate, search, nivelDificuldade);
                return Ok(questions);
            }
            catch (Exception ex)
            {
                return StatusCode(500, Problem(ex.Message, StatusCodes.Status500InternalServerError));
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("create")]
        public async Task<IActionResult> CreateQuestion([FromBody] CreateQuestionDto questionDto)
        {
            try
            {
                var created = await _questionService.CreateQuestionAsync(questionDto);
                return CreatedAtAction(nameof(GetQuestionById), new { id = created.Id }, created);
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest(Problem(ex.Message, StatusCodes.Status400BadRequest));
            }
            catch (Exception ex)
            {
                return StatusCode(500, Problem(ex.Message, StatusCodes.Status500InternalServerError));
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            try
            {
                var result = await _questionService.DeleteQuestionAsync(id);
                return Ok(new { deleted = result });
            }
            catch (ArgumentNullException ex)
            {
                return NotFound(Problem(ex.Message, StatusCodes.Status404NotFound));
            }
            catch (Exception ex)
            {
                return StatusCode(500, Problem(ex.Message, StatusCodes.Status500InternalServerError));
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("update")]
        public async Task<IActionResult> UpdateQuestion([FromBody] QuestionDto questionDto)
        {
            try
            {
                var updated = await _questionService.UpdateQuestionAsync(questionDto);
                return Ok(updated);
            }
            catch (ArgumentNullException ex)
            {
                return NotFound(Problem(ex.Message, StatusCodes.Status404NotFound));
            }
            catch (Exception ex)
            {
                return StatusCode(500, Problem(ex.Message, StatusCodes.Status500InternalServerError));
            }
        }

        private ProblemDetails Problem(string detail, int statusCode, string? title = null)
        {
            return new ProblemDetails
            {
                Title = title ?? "Erro na API",
                Detail = detail,
                Status = statusCode,
                Instance = HttpContext?.Request?.Path
            };
        }
    }
}