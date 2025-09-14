using Backend.Common.Common;
using Backend.Common.Entities;
using Backend.Common.Model.Dtos;
using Backend.Common.Data;
using Backend.Service;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : BaseApiController
    {
        private readonly IdentityService identityService;
        private readonly TaskAppDbContext context;
        private readonly IPasswordHasher<User> _hasher;
        public AuthController(IdentityService identityService, TaskAppDbContext context, IPasswordHasher<User> hasher)
        {
            this.identityService = identityService;
            this.context = context;
            _hasher = hasher;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(Register registerUser)
        {
            if (await context.Users.AnyAsync(u => u.Email == registerUser.Email)) return ReturnBadRequest(new List<string> { "Email Already Exists!" });
            var user = new User { Email = registerUser.Email, Username = registerUser.Username, Role = registerUser.Role.ToString() };
            user.PasswordHash = _hasher.HashPassword(user, registerUser.Password);
            context.Users.Add(user);
            await context.SaveChangesAsync();
            return ReturnOk(message: $"User Created with userid {user.Id},please login with that.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(Login login)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Email == login.Email);
            if (user == null) return Unauthorized();
            var res = _hasher.VerifyHashedPassword(user, user.PasswordHash, login.Password);
            if (res == PasswordVerificationResult.Failed) return Unauthorized();
            var token = identityService.GenerateToken(user);
            return ReturnOk(token);
        }
    }
}
