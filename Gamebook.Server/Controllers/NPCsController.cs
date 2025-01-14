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
        public async Task<IActionResult> CreateNPC([FromForm] NPCDTO npcDto)
        {
            if (npcDto == null)
            {
                return BadRequest("NPC data is null.");
            }

            // Check if an image is provided and convert it to byte array if present
            byte[]? imgBytes = null;
            if (npcDto.Img != null && npcDto.Img.Length > 0)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await npcDto.Img.CopyToAsync(memoryStream);
                    imgBytes = memoryStream.ToArray();
                }
            }

            // Create new NPC entity
            var newNPC = new NPC
            {
                Name = npcDto.Name,
                Description = npcDto.Description,
                Img = imgBytes, // Set the image as byte array
                Target = npcDto.Target
            };

            // Add the new NPC to the database
            _context.NPCs.Add(newNPC);
            await _context.SaveChangesAsync();

            // Return the created NPC object
            return Ok();
        }

        public class NPCDTO
        {
            public string Name { get; set; }
            public string Description { get; set; }
            public IFormFile Img { get; set; }
            public int? Target { get; set; }
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
