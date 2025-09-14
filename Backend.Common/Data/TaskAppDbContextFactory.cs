using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;


namespace Backend.Common.Data
{
    public class TaskAppDbContextFactory : IDesignTimeDbContextFactory<TaskAppDbContext>
    {
        public TaskAppDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<TaskAppDbContext>();

            
            optionsBuilder.UseSqlite("Data Source=taskapp.db");

            return new TaskAppDbContext(optionsBuilder.Options);
        }
    }
}
