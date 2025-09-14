using Backend.Common.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Common.Data
{
    public class TaskAppDbContext : DbContext
    {
        public TaskAppDbContext(DbContextOptions<TaskAppDbContext> opts) : base(opts) { }
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<TaskItem> Tasks { get; set; } = null!;
    }
}
