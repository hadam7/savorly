using System.Collections.Generic;

namespace Savorly.API.Dtos;

public class RecipeListItemDto
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public int? PrepTimeMinutes { get; set; }
    public string? Difficulty { get; set; }
    public string? AuthorName { get; set; }
    public List<string> Categories { get; set; } = new();
    public int Likes { get; set; } // Placeholder for now
    public bool IsVegan { get; set; }
    public List<string> Allergens { get; set; } = new();
}

public class RecipeDetailDto
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public List<string> Instructions { get; set; } = new(); // List of strings
    public int? PrepTimeMinutes { get; set; }
    public string? Difficulty { get; set; }
    public string? ImageUrl { get; set; }
    public int Servings { get; set; }
    public bool IsVegan { get; set; }
    public List<string> Allergens { get; set; } = new();
    public List<string> Ingredients { get; set; } = new();
    public string? AuthorName { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<int> CategoryIds { get; set; } = new();
    public int Likes { get; set; }
}

public class RecipeCreateUpdateDto
{
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public List<string> Instructions { get; set; } = new();
    public int? PrepTimeMinutes { get; set; }
    public string? Difficulty { get; set; }
    public string? ImageUrl { get; set; }
    public int Servings { get; set; }
    public bool IsVegan { get; set; }
    public List<string> Allergens { get; set; } = new();
    public List<string> Ingredients { get; set; } = new();
    public List<int> CategoryIds { get; set; } = new();
}
