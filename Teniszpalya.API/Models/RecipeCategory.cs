namespace Savorly.API.Models;

public class RecipeCategory
{
    public int RecipeId { get; set; }
    public Recipe Recipe { get; set; } = default!;

    public int CategoryId { get; set; }
    public Category Category { get; set; } = default!;
}
