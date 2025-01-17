using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Gamebook.Server.Data;
using Gamebook.Server.models;
using static Gamebook.Server.Controllers.GameBookActionsController;

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





        // POST: api/GameBookActions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<IActionResult> CreateGameBookAction([FromBody] GameBookActionCreateDto dto)
        {
            // Validate if ActionTypeId exists
            var actionTypeExists = await _context.Set<ActionType>()
                                                 .AnyAsync(at => at.ActionTypeId == dto.ActionTypeId);
            if (!actionTypeExists)
            {
                return BadRequest($"ActionType with ID {dto.ActionTypeId} does not exist.");
            }

            // Map DTO to GameBookAction
            var gameBookAction = new GameBookAction
            {
                ActionTypeId = dto.ActionTypeId,
                Description = dto.Description,
                MiniGameData = dto.MiniGameData // Map the new MiniGameData property
            };

            // Save to database
            _context.Set<GameBookAction>().Add(gameBookAction);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // DTO Definition
        public class GameBookActionCreateDto
        {
            public int ActionTypeId { get; set; }
            public string Description { get; set; }
            public string MiniGameData { get; set; } // Data or configuration for the mini-game
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
         

       
          
    }
}
