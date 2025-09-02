using HistoriAcao.Api.Data;
using HistoriAcao.Api.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Testcontainers.PostgreSql;

namespace HistoriAcao.Api.IntegrationTests;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private readonly PostgreSqlContainer _dbContainer;

    public CustomWebApplicationFactory()
    {
        var config = new ConfigurationBuilder()
            .AddJsonFile("appsettings.Test.json")
            .Build();

        var containerConfig = config.GetSection("TestDatabaseContainer");

        _dbContainer = new PostgreSqlBuilder()
            .WithImage(containerConfig["Image"])
            .WithDatabase(containerConfig["Database"])
            .WithUsername(containerConfig["Username"])
            .WithPassword(containerConfig["Password"])
            .Build();    
    }

    public async Task InitializeAsync()
    {
        await _dbContainer.StartAsync();
    }

    public new async Task DisposeAsync()
    {
        await _dbContainer.StopAsync();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {

        builder.ConfigureServices((builderContext, services) =>
        {
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));

            if (descriptor != null)
            {
                services.Remove(descriptor);
            }
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseNpgsql(_dbContainer.GetConnectionString());
            });

            var sp = services.BuildServiceProvider();
            using var scope = sp.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            db.Database.EnsureCreated();
            DatabaseSeeder.SeedAsync(db).Wait();
        });
    }
}