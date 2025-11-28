using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Savorly.API.Data;
using Savorly.API.Dtos;
using Savorly.API.Models;

namespace Savorly.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;
    private readonly PasswordHasher<User> _passwordHasher = new();

    public AuthController(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        if (await _db.Users.AnyAsync(u => u.UserName == request.UserName))
        {
            return BadRequest("Username already taken.");
        }

        var user = new User
        {
            UserName = request.UserName,
            Email = request.Email,
            Role = "User"
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var token = GenerateJwtToken(user);
        return Ok(new AuthResponse
        {
            Token = token,
            UserName = user.UserName,
            Role = user.Role
        });
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.UserName == request.UserName);
        if (user == null)
        {
            return Unauthorized("Invalid credentials.");
        }

        var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (result == PasswordVerificationResult.Failed)
        {
            return Unauthorized("Invalid credentials.");
        }

        var token = GenerateJwtToken(user);
        return Ok(new AuthResponse
        {
            Token = token,
            UserName = user.UserName,
            Role = user.Role
        });
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<object>> Me()
    {
        var userName = User.Identity?.Name;
        if (userName == null) return Unauthorized();

        var user = await _db.Users.FirstOrDefaultAsync(u => u.UserName == userName);
        if (user == null) return Unauthorized();

        return Ok(new
        {
            user.UserName,
            user.Email,
            user.Role
        });
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSection = _config.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSection.GetValue<string>("Key")!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expiresMinutes = jwtSection.GetValue<int>("ExpiresMinutes");

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: jwtSection.GetValue<string>("Issuer"),
            audience: jwtSection.GetValue<string>("Audience"),
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiresMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
