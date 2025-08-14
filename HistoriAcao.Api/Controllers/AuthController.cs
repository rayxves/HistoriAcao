using HistoriAcao.Api.Dtos;
using HistoriAcao.Api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HistoriAcao.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthServices _authService;
        public AuthController(IAuthServices authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public Task<IActionResult> LoginAsync([FromBody] LoginDto loginDto)
        {
            try
            {
                var token = _authService.LoginAsync(loginDto.Email, loginDto.Password);
                return Task.FromResult<IActionResult>(Ok(new { Token = token }));
            }
            catch (UnauthorizedAccessException ex)
            {
                return Task.FromResult<IActionResult>(Unauthorized(Problem(ex.Message)));
            }
            catch (Exception ex)
            {
                return Task.FromResult<IActionResult>(StatusCode(500, Problem("Login failed: " + ex.Message)));
            }
        }
    }
}