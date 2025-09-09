using HistoriAcao.Api.Data;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;
using HistoriAcao.Api.Interfaces;
using HistoriAcao.Api.Services;
using HistoriAcao.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
});

 builder.Services.AddDbContextPool<ApplicationDbContext>(options =>
    {
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
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


builder.Services.AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JWT:Audience"],
        ValidateLifetime = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:SigningKey"]!)),
        ValidateIssuerSigningKey = true
    };
});

var isLambda = !string.IsNullOrEmpty(Environment.GetEnvironmentVariable("AWS_LAMBDA_FUNCTION_NAME"));

var corsPolicy = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: corsPolicy,
                      policy =>
                      {
                          if (isLambda)
                          {
                              policy.AllowAnyOrigin()
                                    .AllowAnyHeader()
                                    .AllowAnyMethod();
                          }
                          else
                          {
                              policy.WithOrigins("http://localhost:8080")
                                    .AllowAnyHeader()
                                    .AllowAnyMethod();
                          }
                      });
});

builder.Services.AddScoped<ITopicServices, TopicServices>();
builder.Services.AddScoped<IQuestionServices, QuestionServices>();
builder.Services.AddScoped<ITokenServices, TokenServices>();
builder.Services.AddScoped<IAuthServices, AuthServices>();
builder.Services.AddScoped<GoogleAnalyticsService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (!isLambda)
{
    app.UsePathBase("/default/HistoriAcaoApi");
}

app.UseCors(corsPolicy);

if (app.Environment.IsDevelopment() && !isLambda)
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "HistoriAcao API V1");
        c.RoutePrefix = string.Empty;
    });
}

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

if (!isLambda)
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        try
        {
            var context = services.GetRequiredService<ApplicationDbContext>();
            var configuration = services.GetRequiredService<IConfiguration>();

            await DatabaseSeeder.SeedAsync(context, configuration);
        }
        catch (Exception ex)
        {
            var logger = services.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "Ocorreu um erro durante o seeding do banco de dados.");
        }
    }
}

await app.RunAsync();

public partial class Program { }