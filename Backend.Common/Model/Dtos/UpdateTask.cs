
namespace Backend.Common.Model.Dtos
{
    public class UpdateTask
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public Backend.Common.Entities.TaskStatus? Status { get; set; }
        public Guid? AssigneeId { get; set; }
    }
}
