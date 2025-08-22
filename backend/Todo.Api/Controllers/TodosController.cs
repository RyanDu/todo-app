using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Todo.Api.Data;
using Todo.Api.Dtos;
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
    public async Task<ActionResult<TodoItem>> Create([FromBody] TodoCreateDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var entity = new TodoItem
        {
            Title = dto.Title,
            Description = dto.Description ?? "",
            IsDone = dto.IsDone,
            CategoryId = dto.CategoryId ?? 0,
            TaskStartTime = dto.TaskStartTime?.UtcDateTime,
            TaskFinishTime = dto.TaskFinishTime?.UtcDateTime,
            CreatedDateTime = DateTime.UtcNow,
            ModifiedDateTime = DateTime.UtcNow
        };

        db.Todos.Add(entity);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = entity.Id }, entity);
    }

    // PUT /api/todos/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] TodoUpdateDto dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var entity = await db.Todos.FindAsync(id);
        if (entity is null) return NotFound();

        entity.Title = dto.Title;
        entity.Description = dto.Description ?? "";
        entity.IsDone = dto.IsDone;
        entity.CategoryId = dto.CategoryId ?? 0;
        entity.TaskStartTime = dto.TaskStartTime?.UtcDateTime;
        entity.TaskFinishTime = dto.TaskFinishTime?.UtcDateTime;
        entity.ModifiedDateTime = DateTime.UtcNow;

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
