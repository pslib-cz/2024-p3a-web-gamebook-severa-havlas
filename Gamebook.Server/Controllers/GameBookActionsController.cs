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

        // PUT: api/GameBookActions/5
        [HttpPatch("UpdateOptions")]
        public async Task<IActionResult> UpdateOptions([FromBody] UpdateOptionsDTO dto)
        {
            if (dto == null || dto.ActionId <= 0 || dto.Options == null)
            {
                return BadRequest("Invalid data.");
            }

            // Find the GameBookAction by its ID
            var action = await _context.Actions
                .Include(a => a.Options)
                .FirstOrDefaultAsync(a => a.ActionId == dto.ActionId);

            if (action == null)
            {
                return NotFound($"GameBookAction with ID {dto.ActionId} not found.");
            }

            // Update the options
            action.Options = dto.Options;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(action);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        public class UpdateOptionsDTO
        {
            public int ActionId { get; set; } // ID of the action to update
            public ICollection<Option> Options { get; set; } // Updated list of options
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
                Options = dto.Options,
                ReqItem = dto.ReqItem,
                ReqProgress = dto.ReqProgress,
                ReqNPC = dto.ReqNPC,
                Description = dto.Description,
                ReqAction = dto.ReqAction
            };

            // Save to database
            _context.Set<GameBookAction>().Add(gameBookAction);
            await _context.SaveChangesAsync();

            return Ok();
        }
        public class GameBookActionCreateDto
        {
            public int ActionTypeId { get; set; }
            public ICollection<Option> Options { get; set; }
            public int? ReqItem { get; set; }
            public int? ReqProgress { get; set; }
            public int? ReqNPC { get; set; }
            public string Description { get; set; }
            public int? ReqAction { get; set; }
        }

        public class OptionIdsDto
        {
            
            public List<int> OptionIds { get; set; } // List of Option IDs
        }
        [HttpPatch]
        public async Task<IActionResult> FindOptionsByIds([FromBody] OptionIdsDto idsDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (idsDto.OptionIds == null || !idsDto.OptionIds.Any())
            {
                return BadRequest("OptionIds array cannot be null or empty.");
            }

            // Retrieve the options from the database
            var options = await _context.Options
                .Where(o => idsDto.OptionIds.Contains(o.OptionId))
                .ToListAsync();

            if (!options.Any())
            {
                return NotFound("No options found for the provided IDs.");
            }

            return Ok(options);
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
        [HttpGet("GetGameBookActionByNPCId/{NPCId}")]
        public async Task<ActionResult<IEnumerable<GameBookAction>>> GetGameBookActionsByNPCId(int NPCId)
        {
            // Find game book actions based on ReqNPC
            var actions = await _context.Actions
                .Where(gba => gba.ReqNPC == NPCId)
                .Include(gba => gba.ActionType)  // Include ActionType if needed
                .Include(gba => gba.Options)     // Include Options if needed
                .ToListAsync();

            if (actions == null || !actions.Any())
            {
                return NotFound($"No actions found for NPCId: {NPCId}");
            }

            return Ok(actions);
        }

        // GET: api/GameBookActions/GetGameBookActionByItemId/{ItemId}
        [HttpGet("GetGameBookActionByItemId/{ItemId}")]
        public async Task<ActionResult<IEnumerable<GameBookAction>>> GetGameBookActionsByItemId(int ItemId)
        {
            // Find game book actions based on ReqItem
            var actions = await _context.Actions
                .Where(gba => gba.ReqItem == ItemId)
                .Include(gba => gba.ActionType)  // Include ActionType if needed
                .Include(gba => gba.Options)     // Include Options if needed
                .ToListAsync();

            if (actions == null || !actions.Any())
            {
                return NotFound($"No actions found for ItemId: {ItemId}");
            }

            return Ok(actions);
        }
        private bool GameBookActionExists(int id)
        {
            return _context.Actions.Any(e => e.ActionId == id);
        }
    }
}
