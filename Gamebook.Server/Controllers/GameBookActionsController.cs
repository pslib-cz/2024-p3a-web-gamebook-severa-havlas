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
    public class GameBookActionsController : ControllerBase
    {
        private readonly GamebookDbContext _context;

        public GameBookActionsController(GamebookDbContext context)
        {
            _context = context;
        }

        // GET: api/GameBookActions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GameBookAction>>> GetActions()
        {
            return await _context.Actions.ToListAsync();
        }

        // GET: api/GameBookActions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GameBookAction>> GetGameBookAction(int id)
        {
            var gameBookAction = await _context.Actions.FindAsync(id);

            if (gameBookAction == null)
            {
                return NotFound();
            }

            return gameBookAction;
        }

        // PUT: api/GameBookActions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGameBookAction(int id, GameBookAction gameBookAction)
        {
            if (id != gameBookAction.ActionId)
            {
                return BadRequest();
            }

            _context.Entry(gameBookAction).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GameBookActionExists(id))
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

        // POST: api/GameBookActions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<GameBookAction>> PostGameBookAction(GameBookAction gameBookAction)
        {
            _context.Actions.Add(gameBookAction);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetGameBookAction", new { id = gameBookAction.ActionId }, gameBookAction);
        }

        // DELETE: api/GameBookActions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGameBookAction(int id)
        {
            var gameBookAction = await _context.Actions.FindAsync(id);
            if (gameBookAction == null)
            {
                return NotFound();
            }

            _context.Actions.Remove(gameBookAction);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GameBookActionExists(int id)
        {
            return _context.Actions.Any(e => e.ActionId == id);
        }
    }
}
