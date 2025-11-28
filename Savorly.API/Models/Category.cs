using System.Collections.Generic;

namespace Savorly.API.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string Slug { get; set; } = default!;

    public ICollection<RecipeCategory> RecipeCategories { get; set; } = new List<RecipeCategory>();
}
