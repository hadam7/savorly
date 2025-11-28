using System.Collections.Generic;

namespace Savorly.API.Dtos;

public class RecipeListItemDto
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public List<string> Categories { get; set; } = new();
}

public class RecipeDetailDto
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public string? Instructions { get; set; }
    public int? PrepTimeMinutes { get; set; }
    public string? Difficulty { get; set; }
    public List<int> CategoryIds { get; set; } = new();
}

public class RecipeCreateUpdateDto
{
    public string Title { get; set; } = default!;
    public string? Description { get; set; }
    public string? Instructions { get; set; }
    public int? PrepTimeMinutes { get; set; }
    public string? Difficulty { get; set; }
    public List<int> CategoryIds { get; set; } = new();
}
