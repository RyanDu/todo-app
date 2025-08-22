using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using Todo.Api.Data;
using Todo.Api.Models;

namespace Todo.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController(AppDbContext db) : ControllerBase
{
    // GET /api/categories?page=1&pageSize=20&q=foo
    [HttpGet]
    public async Task<IActionResult> GetByPage([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] string? q = null)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = db.Categories.Where(c => c.Void == 0).AsQueryable();
        if (!string.IsNullOrWhiteSpace(q))
            query = query.Where(c => EF.Functions.Like(c.CategoryTitle, $"%{q}%"));

        var total = await query.CountAsync();
        var items = await query.OrderBy(c => c.Id).Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return Ok(new { total, items, page, pageSize });
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        var c = await db.Categories.FirstOrDefaultAsync(c => c.Id == id && c.Void == 0);
        return c is null ? NotFound() : Ok(c);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Category input)
    {
        if (string.IsNullOrWhiteSpace(input.CategoryTitle))
        {
            var ms = new ModelStateDictionary();
            ms.AddModelError("title", "Title is required.");
            return ValidationProblem(ms);
        }

        db.Categories.Add(input);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = input.Id }, input);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] Category input)
    {
        var c = await db.Categories.FirstOrDefaultAsync(x => x.Id == id && x.Void == 0);
        if (c is null) return NotFound();
        if (string.IsNullOrWhiteSpace(input.CategoryTitle))
        {
            var ms = new ModelStateDictionary();
            ms.AddModelError("title", "Title is required.");
            return ValidationProblem(ms);
        }

        c.CategoryTitle = input.CategoryTitle;
        c.Description = input.Description;
        c.ModifiedDateTime = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var c = await db.Categories.FirstOrDefaultAsync(x => x.Id == id && x.Void == 0);
        if (c is null) return NotFound();
        c.Void = 1;
        await db.SaveChangesAsync();
        return NoContent();
    }
}