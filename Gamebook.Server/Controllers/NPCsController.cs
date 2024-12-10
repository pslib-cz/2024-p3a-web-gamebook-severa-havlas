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

        // PUT: api/NPCs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNPC(int id, NPC nPC)
        {
            if (id != nPC.NPCId)
            {
                return BadRequest();
            }

            _context.Entry(nPC).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NPCExists(id))
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

        // POST: api/NPCs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<NPC>> PostNPC(NPC nPC)
        {
            _context.NPCs.Add(nPC);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNPC", new { id = nPC.NPCId }, nPC);
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
