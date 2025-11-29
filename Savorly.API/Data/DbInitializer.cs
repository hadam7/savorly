using Savorly.API.Models;

namespace Savorly.API.Data;

public static class DbInitializer
{
    public static void Initialize(AppDbContext context)
    {
        var categories = new Category[]
        {
            new Category { Name = "Reggeli", Slug = "reggeli" },
            new Category { Name = "Ebéd", Slug = "ebed" },
            new Category { Name = "Vacsora", Slug = "vacsora" },
            new Category { Name = "Desszert", Slug = "desszert" },
            new Category { Name = "Leves", Slug = "leves" },
            new Category { Name = "Főétel", Slug = "foetel" },
            new Category { Name = "Egytálétel", Slug = "egytaletel" },
            new Category { Name = "Könnyű", Slug = "konnyu" },
            new Category { Name = "Vegetáriánus", Slug = "vegetarianus" },
            new Category { Name = "Vegán", Slug = "vegan" },
            new Category { Name = "Indiai", Slug = "indiai" },
            new Category { Name = "Olasz", Slug = "olasz" },
            new Category { Name = "Előétel", Slug = "eloetel" },
            new Category { Name = "Tészta", Slug = "teszta" }
        };

        foreach (var c in categories)
        {
            if (!context.Categories.Any(x => x.Name == c.Name))
            {
                context.Categories.Add(c);
            }
        }

        context.SaveChanges();
    }
}
