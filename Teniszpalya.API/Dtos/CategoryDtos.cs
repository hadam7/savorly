namespace Savorly.API.Dtos;

public class CategoryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string Slug { get; set; } = default!;
}

public class CategoryCreateUpdateDto
{
    public string Name { get; set; } = default!;
    public string Slug { get; set; } = default!;
}
