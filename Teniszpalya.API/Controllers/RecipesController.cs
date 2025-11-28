using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Savorly.API.Data;
using Savorly.API.Dtos;
using Savorly.API.Models;

namespace Savorly.API.Controllers;

[ApiController]
[Route("api/[controller]")]
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
            .OrderByDescending(r => r.Id)
            .ToListAsync();

        var result = recipes.Select(r => new RecipeListItemDto
        {
            Id = r.Id,
            Title = r.Title,
            Description = r.Description,
            Categories = r.RecipeCategories.Select(rc => rc.Category.Name).ToList()
        });

        return Ok(result);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<RecipeDetailDto>> GetById(int id)
    {
        var recipe = await _db.Recipes
            .Include(r => r.RecipeCategories)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (recipe == null) return NotFound();

        var dto = new RecipeDetailDto
        {
            Id = recipe.Id,
            Title = recipe.Title,
            Description = recipe.Description,
            Instructions = recipe.Instructions,
            PrepTimeMinutes = recipe.PrepTimeMinutes,
            Difficulty = recipe.Difficulty,
            CategoryIds = recipe.RecipeCategories.Select(rc => rc.CategoryId).ToList()
        };

        return Ok(dto);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult> Create(RecipeCreateUpdateDto dto)
    {
        var recipe = new Recipe
        {
            Title = dto.Title,
            Description = dto.Description,
            Instructions = dto.Instructions,
            PrepTimeMinutes = dto.PrepTimeMinutes,
            Difficulty = dto.Difficulty
        };

        _db.Recipes.Add(recipe);
        await _db.SaveChangesAsync();

        await UpdateRecipeCategories(recipe, dto.CategoryIds);

        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = recipe.Id }, new { recipe.Id });
    }

    [HttpPut("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, RecipeCreateUpdateDto dto)
    {
        var recipe = await _db.Recipes
            .Include(r => r.RecipeCategories)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (recipe == null) return NotFound();

        recipe.Title = dto.Title;
        recipe.Description = dto.Description;
        recipe.Instructions = dto.Instructions;
        recipe.PrepTimeMinutes = dto.PrepTimeMinutes;
        recipe.Difficulty = dto.Difficulty;

        await UpdateRecipeCategories(recipe, dto.CategoryIds);

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var recipe = await _db.Recipes.FindAsync(id);
        if (recipe == null) return NotFound();

        _db.Recipes.Remove(recipe);
        await _db.SaveChangesAsync();
        return NoContent();
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
