using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Gamebook.Server.Data;
using Gamebook.Server.models;
using static Gamebook.Server.Controllers.RoomsController;

namespace Gamebook.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ItemsController : ControllerBase
    {
        private readonly GamebookDbContext _context;

        public ItemsController(GamebookDbContext context)
        {
            _context = context;
        }

        // GET: api/Items
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Item>>> GetItems()
        {
            return await _context.Items.ToListAsync();
        }

        // GET: api/Items/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Item>> GetItem(int id)
        {
            var item = await _context.Items.FindAsync(id);

            if (item == null)
            {
                return NotFound();
            }

            return item;
        }




        // POST: api/Items
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<IActionResult> CreateItem([FromBody] ItemDTO itemDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Validate if GameBookAction exists
            var gameBookAction = await _context.Actions.FindAsync(itemDto.GameBookActionId);
            if (gameBookAction == null)
            {
                return NotFound($"GameBookAction with ID {itemDto.GameBookActionId} not found.");
            }

            // Create Item entity
            var item = new Item
            {
                Name = itemDto.Name,
                Description = itemDto.Description,
                Action = gameBookAction,
                Target = itemDto.Target
            };

            // Add to DbContext and save changes
            _context.Items.Add(item);
            await _context.SaveChangesAsync();

            // Return the created item
            return Ok(item);
        }

        public class ItemDTO
        {
            public string Name { get; set; }
            public string Description { get; set; }
            public int GameBookActionId { get; set; } // Foreign key to GameBookAction
            public int? Target { get; set; } // Nullable target
        }

        // DELETE: api/Items/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var item = await _context.Items.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            _context.Items.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ItemExists(int id)
        {
            return _context.Items.Any(e => e.ItemId == id);
        }
    }
}
