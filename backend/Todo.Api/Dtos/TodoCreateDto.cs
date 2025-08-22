using System.ComponentModel.DataAnnotations;

namespace Todo.Api.Dtos;

public sealed class TodoCreateDto
{
    [Required]
    public string Title { get; set; } = default!;

    public string? Description { get; set; }
    public bool IsDone { get; set; } = false;
    public int? CategoryId { get; set; }
    public DateTimeOffset? TaskStartTime { get; set; }
    public DateTimeOffset? TaskFinishTime { get; set; }
}