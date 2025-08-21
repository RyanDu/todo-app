using Microsoft.EntityFrameworkCore;
using Todo.Api.Models;

namespace Todo.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<TodoItem> Todos => Set<TodoItem>();
}