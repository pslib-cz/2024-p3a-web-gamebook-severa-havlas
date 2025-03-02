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

        [HttpGet("GetRequireds/{actionId}")]
        public async Task<IActionResult> GetRequireds(int actionId)
        {
            var action = await _context.Actions
                .Where(a => a.ActionId == actionId)
                .Select(a => new
                {
                    a.ReqItem,
                    a.ReqProgress
                })
                .FirstOrDefaultAsync();

            if (action == null)
            {
                return NotFound(new { message = "GameBookAction not found." });
            }

            var item = await _context.Items
                .Where(i => i.ItemId == action.ReqItem)
                .Select(i => new
                {
                    i.ItemId,
                    i.Name,
                    i.Description,
                    i.Price
                })
                .FirstOrDefaultAsync();

            var progress = await _context.Progress
                .Where(p => p.ProgressId == action.ReqProgress)
                .Select(p => new
                {
                    p.ProgressId,
                    p.Name,
                    p.Value
                })
                .FirstOrDefaultAsync();

            return Ok(new
            {
                RequiredItem = item,
                RequiredProgress = progress
            });
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


        [HttpPatch]
        public IActionResult Patch(int progressId, int gameBookActionId)
        {
            var gameBookAction = _context.Set<GameBookAction>().Find(gameBookActionId);
            if (gameBookAction == null)
            {
                return NotFound("GameBookAction not found.");
            }

            gameBookAction.ReqProgress = progressId;
            _context.SaveChanges();

            return Ok(new { Message = "GameBookAction updated", Data = gameBookAction });
        }

        private bool GameBookActionExists(int id)
        {
            return _context.Actions.Any(e => e.ActionId == id);
        }


    }
}
