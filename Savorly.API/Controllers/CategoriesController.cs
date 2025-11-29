using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Savorly.API.Data;
using Savorly.API.Dtos;
using Savorly.API.Models;

namespace Savorly.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _db;

    public CategoriesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetAll()
    {
        var categories = await _db.Categories
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug
            })
            .ToListAsync();

        return Ok(categories);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CategoryDto>> Create(CategoryCreateUpdateDto dto)
    {
        if (await _db.Categories.AnyAsync(c => c.Name == dto.Name))
        {
            return BadRequest("Category already exists.");
        }

        var slug = dto.Slug;
        if (string.IsNullOrWhiteSpace(slug))
        {
            slug = dto.Name.ToLower().Replace(" ", "-");
        }

        var category = new Category
        {
            Name = dto.Name,
            Slug = slug
        };

        _db.Categories.Add(category);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new { id = category.Id }, new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Slug = category.Slug
        });
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var category = await _db.Categories.FindAsync(id);
        if (category == null) return NotFound();

        _db.Categories.Remove(category);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, CategoryCreateUpdateDto dto)
    {
        var category = await _db.Categories.FindAsync(id);
        if (category == null) return NotFound();

        if (await _db.Categories.AnyAsync(c => c.Name == dto.Name && c.Id != id))
        {
            return BadRequest("Category name already exists.");
        }

        category.Name = dto.Name;
        
        var slug = dto.Slug;
        if (string.IsNullOrWhiteSpace(slug))
        {
            slug = dto.Name.ToLower().Replace(" ", "-");
        }
        category.Slug = slug;

        await _db.SaveChangesAsync();

        return NoContent();
    }
}
