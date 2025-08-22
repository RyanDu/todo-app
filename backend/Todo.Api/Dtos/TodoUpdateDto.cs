using System.ComponentModel.DataAnnotations;

namespace Todo.Api.Dtos;

public sealed class TodoUpdateDto
{
    [Required]
    public string Title { get; set; } = default!;

    public string? Description { get; set; }

    public bool IsDone { get; set; }

    public int? CategoryId { get; set; }

    public DateTimeOffset? TaskStartTime { get; set; }

    public DateTimeOffset? TaskFinishTime { get; set; }
}