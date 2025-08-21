using Microsoft.EntityFrameworkCore;
using Todo.Api.Data;
using Todo.Api.Models;

var builder = WebApplication.CreateBuilder(args);

// SQLite 连接串（项目根目录生成 todo.db）
var connStr = builder.Configuration.GetConnectionString("Default")
              ?? "Data Source=todo.db";
builder.Services.AddDbContext<AppDbContext>(o => o.UseSqlite(connStr));

builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins("http://localhost:5173") // Vite 默认端口
     .AllowAnyHeader()
     .AllowAnyMethod()
));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 简单 CRUD
app.MapGet("/api/todos", async (AppDbContext db) =>
    await db.Todos.OrderByDescending(t => t.Id).ToListAsync());

app.MapGet("/api/todos/{id:int}", async (int id, AppDbContext db) =>
    await db.Todos.FindAsync(id) is { } t ? Results.Ok(t) : Results.NotFound());

app.MapPost("/api/todos", async (TodoItem input, AppDbContext db) =>
{
    db.Todos.Add(input);
    await db.SaveChangesAsync();
    return Results.Created($"/api/todos/{input.Id}", input);
});

app.MapPut("/api/todos/{id:int}", async (int id, TodoItem input, AppDbContext db) =>
{
    var todo = await db.Todos.FindAsync(id);
    if (todo is null) return Results.NotFound();
    todo.Title = input.Title;
    todo.IsDone = input.IsDone;
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/api/todos/{id:int}", async (int id, AppDbContext db) =>
{
    var todo = await db.Todos.FindAsync(id);
    if (todo is null) return Results.NotFound();
    db.Remove(todo);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();
