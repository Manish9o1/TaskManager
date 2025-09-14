using Backend.Common.Entities;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Service
{
    public class IdentityService
    {
        readonly IConfiguration _config;
        public IdentityService(IConfiguration configuration)
        {
            _config = configuration;

        }
        public string GenerateToken(User user)
        {
            var key = _config["Identity:Key"] ?? throw new Exception("Identity Key not configured");
            var issuer = _config["Identity:Issuer"] ?? throw new Exception("Identity Key Issuer configured"); ;
            var audience = _config["Identity:Audience"] ?? throw new Exception("Identity Key Audience configured"); ;
            var expireMinutes = int.Parse(_config["Identity:ExpireMinutes"] ?? "30");
            var claims = new[]
            {
                     new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                     new Claim("username", user.Username),
                     new Claim(ClaimTypes.Role, user.Role)
            };
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expireMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
