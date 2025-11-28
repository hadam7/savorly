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
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetAll()
    {
        var cats = await _db.Categories
            .OrderBy(c => c.Name)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug
            })
            .ToListAsync();

        return Ok(cats);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<CategoryDto>> GetById(int id)
    {
        var c = await _db.Categories.FindAsync(id);
        if (c == null) return NotFound();

        return Ok(new CategoryDto
        {
            Id = c.Id,
            Name = c.Name,
            Slug = c.Slug
        });
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<CategoryDto>> Create(CategoryCreateUpdateDto dto)
    {
        var c = new Category
        {
            Name = dto.Name,
            Slug = dto.Slug
        };

        _db.Categories.Add(c);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = c.Id }, new CategoryDto
        {
            Id = c.Id,
            Name = c.Name,
            Slug = c.Slug
        });
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, CategoryCreateUpdateDto dto)
    {
        var c = await _db.Categories.FindAsync(id);
        if (c == null) return NotFound();

        c.Name = dto.Name;
        c.Slug = dto.Slug;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var c = await _db.Categories.FindAsync(id);
        if (c == null) return NotFound();

        _db.Categories.Remove(c);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
