using System;
using System.Collections.Generic;

namespace Savorly.API.Models;

public class Recipe
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public string? Instructions { get; set; } // Keeping for backward compatibility or simple string storage if needed, but we'll use JSON for structured data
    public int? PrepTimeMinutes { get; set; }
    public string? Difficulty { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int Likes { get; set; }

    // New Fields
    public string? ImageUrl { get; set; }
    public int Servings { get; set; } = 1;
    public bool IsVegan { get; set; }
    public string? Allergens { get; set; } // JSON stored as string
    public string? Ingredients { get; set; } // JSON stored as string
    public string? InstructionsJson { get; set; } // JSON stored as string for structured steps

    public int? UserId { get; set; }
    public User? User { get; set; }

    public ICollection<RecipeCategory> RecipeCategories { get; set; } = new List<RecipeCategory>();
}
