using HistoriAcao.Api.Data;
using HistoriAcao.Api.Interfaces;
using HistoriAcao.Api.Models;
using HistoriAcao.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.Text;

namespace HistoriAcao.Api;

public class Startup
{
    public IConfiguration Configuration { get; }

    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers().AddNewtonsoftJson(options =>
        {
            options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
        });

    services.AddDbContextPool<ApplicationDbContext>(options =>
    {
     var connectionString = Configuration.GetConnectionString("DefaultConnection");

     options.UseNpgsql(connectionString, npgsqlOptions =>
     {
         npgsqlOptions.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);

         npgsqlOptions.CommandTimeout(60);

         npgsqlOptions.EnableRetryOnFailure(
             maxRetryCount: 2,
             maxRetryDelay: TimeSpan.FromSeconds(3),
             errorCodesToAdd: null
         );
     });

     options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);

     options.EnableSensitiveDataLogging(false);

    }, poolSize: 32);

        services.AddIdentity<User, IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = Configuration["JWT:Issuer"],
                ValidateAudience = true,
                ValidAudience = Configuration["JWT:Audience"],
                ValidateLifetime = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:SigningKey"]!)),
                ValidateIssuerSigningKey = true
            };
        });

        services.AddCors(options =>
        {
            options.AddPolicy("AllowAll",
                policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
        });

        services.AddScoped<ITopicServices, TopicServices>();
        services.AddScoped<IQuestionServices, QuestionServices>();
        services.AddScoped<ITokenServices, TokenServices>();
        services.AddScoped<IAuthServices, AuthServices>();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseRouting();
        app.UseCors("AllowAll");
        app.UseAuthentication();
        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();

            endpoints.MapGet("/", async context =>
            {
                var response = new { message = "HistoriAcao API is running!", timestamp = DateTime.UtcNow };
                await context.Response.WriteAsJsonAsync(response);
            });
        });
    }
}