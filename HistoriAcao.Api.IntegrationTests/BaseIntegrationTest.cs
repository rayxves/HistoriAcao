using HistoriAcao.Api.Data;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.DependencyInjection;

namespace HistoriAcao.Api.IntegrationTests;

[Collection("DatabaseCollection")] 
public class BaseIntegrationTest : IClassFixture<CustomWebApplicationFactory>, IDisposable
{
    private readonly IServiceScope _scope;
    protected readonly ApplicationDbContext Context;
    protected readonly HttpClient Client;
    private readonly IDbContextTransaction _transaction;

    protected BaseIntegrationTest(CustomWebApplicationFactory factory)
    {
        _scope = factory.Services.CreateScope();
        Context = _scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        Client = factory.CreateClient();
        _transaction = Context.Database.BeginTransaction();
    }

    public void Dispose()
    {
        _transaction.Rollback();
        _transaction.Dispose();
        Context.Dispose();
        _scope.Dispose();
        Client.Dispose();
    }
}