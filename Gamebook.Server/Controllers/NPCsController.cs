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
    public class NPCsController : ControllerBase
    {
        private readonly GamebookDbContext _context;

        public NPCsController(GamebookDbContext context)
        {
            _context = context;
        }

        // GET: api/NPCs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NPC>>> GetNPCs()
        {
            return await _context.NPCs.ToListAsync();
        }

        // GET: api/NPCs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NPC>> GetNPC(int id)
        {
            var nPC = await _context.NPCs.FindAsync(id);

            if (nPC == null)
            {
                return NotFound();
            }

            return nPC;
        }



        // POST: api/NPCs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<IActionResult> CreateNPC([FromBody] NPCDto npcDto)
        {
            if (npcDto == null)
            {
                return BadRequest("NPC data is required.");
            }

            // Validate that the Action exists
            var action = await _context.Actions
                .FirstOrDefaultAsync(a => a.ActionId == npcDto.Action);

            if (action == null)
            {
                return NotFound($"Action with ID {npcDto.Action} {npcDto.Name} not found.");
            }

            // Create the NPC entity
            var npc = new NPC
            {
                Name = npcDto.Name,
                Description = npcDto.Description,
                Action = action
            };

            // Add the NPC to the database
            _context.NPCs.Add(npc);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNPC), new { id = npc.NPCId }, npc);
        }

        public class NPCDto
        {
            public string Name { get; set; }
            public string Description { get; set; }
            public int Action { get; set; }
        }

        // DELETE: api/NPCs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNPC(int id)
        {
            var nPC = await _context.NPCs.FindAsync(id);
            if (nPC == null)
            {
                return NotFound();
            }

            _context.NPCs.Remove(nPC);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NPCExists(int id)
        {
            return _context.NPCs.Any(e => e.NPCId == id);
        }
    }
}
