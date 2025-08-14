namespace HistoriAcao.Api.Interfaces
{
    public interface IAuthServices
    {
        Task<string> LoginAsync(string email, string password);
        Task<bool> IsUserInRoleAsync(string username, string role);
    }
}