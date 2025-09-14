using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Common.Entities
{
    public class TaskItem
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public TaskStatus Status { get; set; } = TaskStatus.TODO;
        public int Priority { get; set; } = (int)TaskPriority.LOW;
        public Guid? AssigneeId { get; set; }
        public User? Assignee { get; set; }
        public Guid CreatorId { get; set; }
        public User? Creator { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public enum TaskStatus { TODO, IN_PROGRESS, DONE }

    public enum TaskPriority
    {
        LOW = 0,
        MEDIUM = 1,
        HIGH = 2
    }
}