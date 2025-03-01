using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Gamebook.Server.Data;
using Gamebook.Server.models;

namespace Gamebook.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProgressesController : ControllerBase
    {
        private readonly GamebookDbContext _context;

        public ProgressesController(GamebookDbContext context)
        {
            _context = context;
        }

        // GET: api/Progresses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Progress>>> GetProgress()
        {
            return await _context.Progress.ToListAsync();
        }

        // GET: api/Progresses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Progress>> GetProgress(int id)
        {
            var progress = await _context.Progress.FindAsync(id);

            if (progress == null)
            {
                return NotFound();
            }

            return progress;
        }

        // PUT: api/Progresses/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProgress(int id, Progress progress)
        {
            if (id != progress.ProgressId)
            {
                return BadRequest();
            }

            _context.Entry(progress).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProgressExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
        public class MyDto
        {
            public string Value { get; set; }
            public int Value2 { get; set; }
        }





        [HttpPost]
        public IActionResult Post([FromBody] MyDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Invalid data.");
            }

            var progress = new Progress
            {
                Name = dto.Value,
                Value = dto.Value2
            };

            _context.Set<Progress>().Add(progress);
            _context.SaveChanges();

            return Ok(new { Message = "Data saved", Data = progress });
        }

        // DELETE: api/Progresses/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProgress(int id)
        {
            var progress = await _context.Progress.FindAsync(id);
            if (progress == null)
            {
                return NotFound();
            }

            _context.Progress.Remove(progress);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProgressExists(int id)
        {
            return _context.Progress.Any(e => e.ProgressId == id);
        }
    }
}
