using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Todo.Api.Data;
using Todo.Api.Models;

namespace Todo.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodosController(AppDbContext db) : ControllerBase
{
    //GET /api/todos?isDone=true
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoItem>>> Get([FromQuery] bool? isDone)
    {
        var query = db.Todos.Where(x => x.Void == 0).AsQueryable();
        if (isDone.HasValue) query = query.Where(t => t.IsDone == isDone.Value);

        var items = await query.OrderByDescending(t => t.Id).ToListAsync();
        return Ok(items);
    }

    // GET /api/todos/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<TodoItem>> GetById(int id)
    {
        var todo = await db.Todos.FirstOrDefaultAsync(t => t.Id == id && t.Void == 0);
        return todo is null ? NotFound() : Ok(todo);
    }

    // POST /api/todos
    [HttpPost]
    public async Task<ActionResult<TodoItem>> Create([FromBody] TodoItem input)
    {
        if (string.IsNullOrWhiteSpace(input.Title))
        {
            var ms = new ModelStateDictionary();
            ms.AddModelError("title", "Title is required.");
            return ValidationProblem(ms);
        }

        db.Todos.Add(input);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = input.Id }, input);
    }

    // PUT /api/todos/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] TodoItem input)
    {
        var todo = await db.Todos.FirstOrDefaultAsync(x => x.Id == id && x.Void == 0);
        if (todo is null) return NotFound();

        todo.Title = input.Title;
        todo.IsDone = input.IsDone;
        todo.CategoryId = input.CategoryId;
        todo.Description = input.Description;
        todo.TaskStartTime = input.TaskStartTime;
        todo.TaskFinishTime = input.TaskFinishTime;
        todo.ModifiedDateTime = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE /api/todos/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var todo = await db.Todos.FirstOrDefaultAsync(x => x.Id == id && x.Void == 0);
        if (todo is null) return NotFound();
        todo.Void = 1;
        await db.SaveChangesAsync();
        return NoContent();
    }
}
