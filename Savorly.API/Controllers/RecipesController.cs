using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Savorly.API.Data;
using Savorly.API.Dtos;
using Savorly.API.Models;
namespace Savorly.API.Controllers;

[ApiController]
[Route("api/[controller]")]
// [Authorize]
public class RecipesController : ControllerBase
{
    private readonly AppDbContext _db;

    public RecipesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<RecipeListItemDto>>> GetAll()
    {
        var recipes = await _db.Recipes
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
            Likes = r.Likes,
            IsVegan = r.IsVegan,
            Allergens = !string.IsNullOrEmpty(r.Allergens)
                ? JsonSerializer.Deserialize<List<string>>(r.Allergens) ?? new List<string>()
                : new List<string>()
        });

        return Ok(result);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<RecipeDetailDto>> GetById(int id)
    {
        var recipe = await _db.Recipes
            .Include(r => r.RecipeCategories)
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (recipe == null) return NotFound();

        var dto = new RecipeDetailDto
        {
            Id = recipe.Id,
            Title = recipe.Title,
            Description = recipe.Description,
            Instructions = !string.IsNullOrEmpty(recipe.InstructionsJson) 
                ? JsonSerializer.Deserialize<List<string>>(recipe.InstructionsJson) ?? new List<string>()
                : new List<string> { recipe.Instructions ?? "" },
            PrepTimeMinutes = recipe.PrepTimeMinutes,
            Difficulty = recipe.Difficulty,
            ImageUrl = recipe.ImageUrl,
            Servings = recipe.Servings,
            IsVegan = recipe.IsVegan,
            Allergens = !string.IsNullOrEmpty(recipe.Allergens)
                ? JsonSerializer.Deserialize<List<string>>(recipe.Allergens) ?? new List<string>()
                : new List<string>(),
            Ingredients = !string.IsNullOrEmpty(recipe.Ingredients)
                ? JsonSerializer.Deserialize<List<string>>(recipe.Ingredients) ?? new List<string>()
                : new List<string>(),
            AuthorName = recipe.User?.UserName,
            CreatedAt = recipe.CreatedAt,
            CategoryIds = recipe.RecipeCategories.Select(rc => rc.CategoryId).ToList(),
            Categories = recipe.RecipeCategories.Select(rc => rc.Category.Name).ToList(),
            Likes = recipe.Likes
        };

        return Ok(dto);
    }

    [HttpPost]
    // [Authorize]
    public async Task<ActionResult> Create(RecipeCreateUpdateDto dto)
    {
        var userName = User.Identity?.Name ?? "UserA"; // Fallback for testing
        var user = await _db.Users.FirstOrDefaultAsync(u => u.UserName == userName);

        if (user == null) 
        {
            user = new User { UserName = "UserA", Email = "usera@example.com", PasswordHash = "dummy", Role = "User", CreatedAt = DateTime.UtcNow };
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
        }

        var recipe = new Recipe
        {
            Title = dto.Title,
            Description = dto.Description,
            InstructionsJson = JsonSerializer.Serialize(dto.Instructions),
            Instructions = string.Join("\n", dto.Instructions), // Fallback
            PrepTimeMinutes = dto.PrepTimeMinutes,
            Difficulty = dto.Difficulty,
            ImageUrl = dto.ImageUrl,
            Servings = dto.Servings,
            IsVegan = dto.IsVegan,
            Allergens = JsonSerializer.Serialize(dto.Allergens),
            Ingredients = JsonSerializer.Serialize(dto.Ingredients),
            UserId = user.Id,
            Likes = 0
        };

        _db.Recipes.Add(recipe);
        await _db.SaveChangesAsync();

        await UpdateRecipeCategories(recipe, dto.CategoryIds);

        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = recipe.Id }, new { recipe.Id });
    }

    [HttpPut("{id:int}")]
    // [Authorize]
    public async Task<IActionResult> Update(int id, RecipeCreateUpdateDto dto)
    {
        var userName = User.Identity?.Name ?? "UserA"; // Fallback for testing
        var user = await _db.Users.FirstOrDefaultAsync(u => u.UserName == userName);
        if (user == null) 
        {
            user = new User { UserName = "UserA", Email = "usera@example.com", PasswordHash = "dummy", Role = "User", CreatedAt = DateTime.UtcNow };
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
        }

        var recipe = await _db.Recipes
            .Include(r => r.RecipeCategories)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (recipe == null) return NotFound();

        // Check ownership
        if (recipe.UserId != user.Id && user.Role != "Admin")
        {
            return Forbid();
        }

        recipe.Title = dto.Title;
        recipe.Description = dto.Description;
        recipe.InstructionsJson = JsonSerializer.Serialize(dto.Instructions);
        recipe.Instructions = string.Join("\n", dto.Instructions);
        recipe.PrepTimeMinutes = dto.PrepTimeMinutes;
        recipe.Difficulty = dto.Difficulty;
        recipe.ImageUrl = dto.ImageUrl;
        recipe.Servings = dto.Servings;
        recipe.IsVegan = dto.IsVegan;
        recipe.Allergens = JsonSerializer.Serialize(dto.Allergens);
        recipe.Ingredients = JsonSerializer.Serialize(dto.Ingredients);

        await UpdateRecipeCategories(recipe, dto.CategoryIds);

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    // [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var userName = User.Identity?.Name ?? "UserA"; // Fallback for testing
        var user = await _db.Users.FirstOrDefaultAsync(u => u.UserName == userName);
        if (user == null) 
        {
            user = new User { UserName = "UserA", Email = "usera@example.com", PasswordHash = "dummy", Role = "User", CreatedAt = DateTime.UtcNow };
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
        }

        var recipe = await _db.Recipes.FindAsync(id);
        if (recipe == null) return NotFound();

        // Check ownership
        if (recipe.UserId != user.Id && user.Role != "Admin")
        {
            return Forbid();
        }

        _db.Recipes.Remove(recipe);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("{id:int}/like")]
    public async Task<IActionResult> Like(int id)
    {
        var recipe = await _db.Recipes.FindAsync(id);
        if (recipe == null) return NotFound();

        recipe.Likes++;
        await _db.SaveChangesAsync();

        return Ok(new { likes = recipe.Likes });
    }

    [HttpPost("{id:int}/unlike")]
    public async Task<IActionResult> Unlike(int id)
    {
        var recipe = await _db.Recipes.FindAsync(id);
        if (recipe == null) return NotFound();

        if (recipe.Likes > 0)
        {
            recipe.Likes--;
            await _db.SaveChangesAsync();
        }

        return Ok(new { likes = recipe.Likes });
    }

    private async Task UpdateRecipeCategories(Recipe recipe, List<int> categoryIds)
    {
        var existing = await _db.RecipeCategories
            .Where(rc => rc.RecipeId == recipe.Id)
            .ToListAsync();
        _db.RecipeCategories.RemoveRange(existing);

        foreach (var catId in categoryIds.Distinct())
        {
            _db.RecipeCategories.Add(new RecipeCategory
            {
                RecipeId = recipe.Id,
                CategoryId = catId
            });
        }
    }
}
