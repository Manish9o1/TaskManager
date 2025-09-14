using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Common.Model.Dtos
{
    public class CreateTask
    {
        [Required] 
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int Priority { get; set; } = 0;
        public Guid? AssigneeId { get; set; }
    }
}

