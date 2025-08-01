namespace HistoriAcao.Api.Data
{
    using HistoriAcao.Api.Models;
    using Microsoft.EntityFrameworkCore;

    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Document> Documents { get; set; } = null!;
        public DbSet<Alternative> Alternatives { get; set; } = null!;
        public DbSet<Question> Questions { get; set; } = null!;
        public DbSet<Topic> Topics { get; set; } = null!;
        public DbSet<Subtopic> Subtopics { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Document>()
                .HasKey(d => d.Id);

            modelBuilder.Entity<Document>()
                .HasOne(d => d.Questao)
                .WithMany(q => q.Documentos)
                .HasForeignKey(d => d.QuestaoId);

            modelBuilder.Entity<Alternative>()
                .HasKey(a => a.Id);

            modelBuilder.Entity<Alternative>()
                .HasOne(a => a.Questao)
                .WithMany(q => q.Alternativas)
                .HasForeignKey(a => a.QuestaoId);

            modelBuilder.Entity<Question>()
                .HasKey(q => q.Id);

            modelBuilder.Entity<Question>()
                .HasOne(q => q.Topico)
                .WithMany(t => t.Questoes)
                .HasForeignKey(q => q.TopicoId);

            modelBuilder.Entity<Question>()
                .HasOne(q => q.Subtopico)
                .WithMany(s => s.Questoes)
                .HasForeignKey(q => q.SubtopicoId)
                .IsRequired(false);

            modelBuilder.Entity<Topic>()
                .HasKey(t => t.Id);

            modelBuilder.Entity<Topic>()
                .HasMany(t => t.Subtopicos)
                .WithOne(s => s.Topico)
                .HasForeignKey(s => s.TopicoId);

            modelBuilder.Entity<Subtopic>()
                .HasKey(s => s.Id);

           
        }

    }
}