using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Savorly.API.Data;
using Savorly.API.Dtos;
using Savorly.API.Models;

namespace Savorly.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;

    public UsersController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAll()
    {
        var users = await _db.Users
            .Select(u => new UserDto
            {
                Id = u.Id,
                UserName = u.UserName,
                Email = u.Email,
                Role = u.Role,
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt
            })
            .ToListAsync();

        return Ok(users);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null) return NotFound();


        
        _db.Users.Remove(user);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{id:int}/toggle-status")]
    public async Task<IActionResult> ToggleStatus(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null) return NotFound();

        user.IsActive = !user.IsActive;
        await _db.SaveChangesAsync();

        return Ok(new { IsActive = user.IsActive });
    }

    [HttpGet("{id:int}/recipes")]
    public async Task<ActionResult<IEnumerable<RecipeListItemDto>>> GetRecipesByUser(int id)
    {
        var recipes = await _db.Recipes
            .Where(r => r.UserId == id)
            .Include(r => r.RecipeCategories)
                .ThenInclude(rc => rc.Category)
            .Include(r => r.User)
            .OrderByDescending(r => r.Id)
            .ToListAsync();

        var result = recipes.Select(r => new RecipeListItemDto
        {
            Id = r.Id,
            Title = r.Title,
            Description = r.Description,
            ImageUrl = r.ImageUrl,
            PrepTimeMinutes = r.PrepTimeMinutes,
            Difficulty = r.Difficulty,
            AuthorName = r.User?.UserName,
            Categories = r.RecipeCategories.Select(rc => rc.Category.Name).ToList(),
            Likes = 0
        });

        return Ok(result);
    }
}
