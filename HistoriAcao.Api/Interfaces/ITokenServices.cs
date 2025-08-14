using HistoriAcao.Api.Models;

namespace HistoriAcao.Api.Interfaces
{
    public interface ITokenServices
    {
        Task<string> GenerateTokenAsync(User user);
    }
}