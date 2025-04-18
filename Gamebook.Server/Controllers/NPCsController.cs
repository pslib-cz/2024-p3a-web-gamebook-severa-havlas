﻿using System;
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

        [HttpGet]
        [Route("{id}/image")]
        public async Task<IActionResult> GetNpcImage(int id)
        {
            var Npc = await _context.NPCs.FindAsync(id);
            if (Npc == null || Npc.Img == null)
            {
                return NotFound("Image not found.");
            }

            return File(Npc.Img, "image/jpeg"); // Adjust the MIME type as needed
        }

        // GET: api/NPCs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NPC>>> GetNPCs()
        {
            var npc = await _context.NPCs
              .Select(npc => new
              {
                  npc.NPCId,
                  npc.Name,
                  npc.Target,
                  npc.Action,
                  npc.Dialogs,
                  ImgUrl = $"/api/rooms/{npc.NPCId}/image" // Provide URL to fetch the image
              })
              .ToListAsync();

            return Ok(npc);
        }

        // GET: api/NPCs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<NPC>> GetNPC(int id)
        {
            var npc = await _context.NPCs
               .Select(npc => new
               {
                   npc.NPCId,
                   npc.Name,
                   npc.Target,
                   npc.Action,
                   npc.Dialogs,
                   ImgUrl = $"/api/rooms/{npc.NPCId}/image" // Provide URL to fetch the image
               })
                .FirstOrDefaultAsync(npc => npc.NPCId == id);

            return Ok(npc);
        }

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
        public async Task<IActionResult> CreateNPC([FromForm] NPCDTO npcDto)
        {
            if (npcDto == null)
            {
                return BadRequest("NPC data is null.");
            }

            // Check if an image is provided and convert it to a byte array if present
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
                Img = imgBytes, // Set the image as a byte array
                Target = npcDto.Target,
                ActionId = npcDto.ActionId // Include the new ActionId property
            };

            // Add the new NPC to the database
            _context.NPCs.Add(newNPC);
            await _context.SaveChangesAsync();

            // Return the created NPC object
            return Ok(newNPC);
        }

        public class NPCDTO
        {
            public string Name { get; set; }
            public string Description { get; set; }
            public IFormFile Img { get; set; }
            public int? Target { get; set; }
            public int? ActionId { get; set; }
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
