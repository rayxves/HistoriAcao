using HistoriAcao.Api.Interfaces;
using HistoriAcao.Api.Models;
using Microsoft.AspNetCore.Identity;

namespace HistoriAcao.Api.Services
{
    public class AuthServices : IAuthServices
    {
        private readonly UserManager<User> _userManager;
        private readonly ITokenServices _tokenServices;

        public AuthServices(UserManager<User> userManager, ITokenServices tokenServices)
        {
            _tokenServices = tokenServices;
            _userManager = userManager;
        }

        public async Task<string> LoginAsync(string email, string password)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, password))
            {
                throw new UnauthorizedAccessException("Invalid credentials");
            }

            return await _tokenServices.GenerateTokenAsync(user);
        }

        public async Task<bool> IsUserInRoleAsync(string username, string role)
        {
            var user = await _userManager.FindByNameAsync(username);
            if (user == null) return false;

            return await _userManager.IsInRoleAsync(user, role);
        }
    }

}