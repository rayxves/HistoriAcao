using HistoriAcao.Api.Data;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseNpgsql(connectionString);
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    if (!await context.Topics.AnyAsync())
    {
        var topics = SeedData.GetTopics();
        int topicId = 1;
        int subtopicId = 1;

        foreach (var topic in topics)
        {
            topic.Id = topicId++;

            foreach (var sub in topic.Subtopicos)
            {
                sub.Id = subtopicId++;
                sub.TopicoId = topic.Id;
            }

            context.Topics.Add(topic);

        }

        await context.SaveChangesAsync();
    }
}


await app.RunAsync();
