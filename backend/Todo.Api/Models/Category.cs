namespace Todo.Api.Models;

public class Category
{
    public int Id { get; set; }
    public string CategoryTitle { get; set; }
    public DateTime CreatedDateTime { get; set; } = DateTime.UtcNow;
    public DateTime ModifiedDateTime { get; set; } = DateTime.UtcNow;
    public int Void{ get; set; }
}