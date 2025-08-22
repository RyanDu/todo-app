namespace Todo.Api.Models;

public class TodoItem
{
    public int Id { get; set; }
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public bool IsDone { get; set; }
    public int CategoryId{ get; set; }
    public DateTime? TaskStartTime { get; set; } = DateTime.UtcNow;
    public DateTime? TaskFinishTime { get; set; } = DateTime.UtcNow.AddHours(1);
    public DateTime CreatedDateTime { get; set; } = DateTime.UtcNow;
    public DateTime ModifiedDateTime { get; set; } = DateTime.UtcNow;
    public int Void{ get; set; }
}