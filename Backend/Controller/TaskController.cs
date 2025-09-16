using Backend.Service;
using Backend.Common.Common;
using Backend.Common.Data;
using Backend.Common.Entities;
using Backend.Common.Model.Dtos;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Backend.Common.Model;
using TaskStatus = Backend.Common.Entities.TaskStatus;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using System.Threading.Tasks;

namespace Backend.Controller
{
    [Authorize]
    public class TaskController : BaseApiController
    {

        private readonly TaskAppDbContext context;
        public TaskController(IdentityService identityService, TaskAppDbContext context, IPasswordHasher<User> hasher)
        {
            this.context = context;
        }
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] Backend.Common.Entities.TaskStatus? status, [FromQuery] Guid? assignee)
        {
            var querry = context.Tasks.Include(t => t.Assignee).Include(t => t.Creator).AsQueryable();
            if (status.HasValue) querry = querry.Where(t => t.Status == status.Value);
            if (assignee.HasValue) querry = querry.Where(t => t.AssigneeId == assignee.Value);
            var TaskList = await querry.OrderByDescending(x => x.Priority).Select(x => new TaskResponse
            {
                Id = x.Id,
                AssigneeId = x.AssigneeId,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt,
                CreatorId = x.CreatorId,
                Description = x.Description,
                Priority = EnumHelper.GetPriority(x.Priority).Name,
                Status = x.Status.ToString(),
                Title = x.Title

            }).ToListAsync();
            return ReturnOk(TaskList);
        }

        [HttpGet("GetUser")]       
        public async Task<IActionResult> GetUser()
        {
            var users = await context.Users.Select(x => new { x.Id, x.Username, x.Email }).ToListAsync();
            return ReturnOk(users);
        }
        public async Task<IActionResult> Create(CreateTask createTask)
        {

            var userId = GetUserId();
            //if (await context.Users.FindAsync(createTask.AssigneeId) == null) return ReturnBadRequest(new List<string> { "Invalid Assignee User Id" });
            var task = new TaskItem { Title = createTask.Title, Description = createTask.Description, Priority = createTask.Priority, CreatorId = userId, AssigneeId = createTask.AssigneeId };
            context.Tasks.Add(task);
            await context.SaveChangesAsync();
            var response = new TaskResponse
            {
                Id = task.Id,
                AssigneeId = task.AssigneeId,
                CreatedAt = task.CreatedAt,
                UpdatedAt = task.UpdatedAt,
                CreatorId = task.CreatorId,
                Description = task.Description,
                Priority = EnumHelper.GetPriority(task.Priority).Name,
                Status = task.Status.ToString(),
                Title = task.Title
            };
            var (PriorityName, _) = EnumHelper.GetPriority(createTask.Priority);
            return ReturnOk(response, $"Task Is created with Priority {PriorityName}");
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var task = await context.Tasks.FindAsync(id);
            if (task == null) return ReturnNotFound($"Task Id :{id} not found");
            var response = new TaskResponse
            {
                Id = task.Id,
                AssigneeId = task.AssigneeId,
                CreatedAt = task.CreatedAt,
                UpdatedAt = task.UpdatedAt,
                CreatorId = task.CreatorId,
                Description = task.Description,
                Priority = EnumHelper.GetPriority(task.Priority).Name,
                Status = task.Status.ToString(),
                Title = task.Title
            };
            return ReturnOk(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateTask dto)
        {
            var task = await context.Tasks.FindAsync(id);
            if (task == null) return ReturnNotFound($"Task Id :{id} not found");

            task.Title = dto.Title ?? task.Title;
            task.Description = dto.Description ?? task.Description;
            if (dto.Status.HasValue)
            {
                task.Status = dto.Status.Value;
            }
            task.AssigneeId = dto.AssigneeId ?? task.AssigneeId;
            task.UpdatedAt = DateTime.UtcNow;
            await context.SaveChangesAsync();
            var response = new TaskResponse
            {
                Id = task.Id,
                AssigneeId = task.AssigneeId,
                CreatedAt = task.CreatedAt,
                UpdatedAt = task.UpdatedAt,
                CreatorId = task.CreatorId,
                Description = task.Description,
                Priority = EnumHelper.GetPriority(task.Priority).Name,
                Status = task.Status.ToString(),
                Title = task.Title
            };
            return ReturnOk(response, $"Task is updated!");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var task = await context.Tasks.FindAsync(id);
            if (task == null) return ReturnNotFound(message:$"Task with Id {id} not found in record");
            context.Tasks.Remove(task);
            await context.SaveChangesAsync();
            return ReturnOk(message: "Task is deleted!");
        }

        [NonAction]
        private Guid GetUserId()
        {
            Request.Headers.TryGetValue("Authorization", out var headerValue);
            var Token = headerValue.ToString().Split(" ")[1];
            var handler = new JwtSecurityTokenHandler();
            var jwtSecurityToken = handler.ReadJwtToken(Token);
            var userID = jwtSecurityToken.Payload.Where(x => x.Key == "sub").Select(x => x.Value).FirstOrDefault().ToString();
            return Guid.Parse(userID);

        }
    }
}
