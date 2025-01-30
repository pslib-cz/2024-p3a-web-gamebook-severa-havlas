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
        public async Task<ActionResult<ItemDto>> GetItem(int id)
        {
            var item = await _context.Items.FindAsync(id);

            if (item == null)
            {
                return NotFound();
            }

            // Map the 'item' to ItemDto, only returning required fields
            var itemDto = new ItemDto
            {
                ItemId = item.ItemId,
                Name = item.Name,
                Description = item.Description,
                ImgUrl = $"/api/rooms/{item.ItemId}/image",
                Target = item.Target,
                Price = item.Price
            };

            return itemDto;
        }
        public class ItemDto
        {
            public int ItemId { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }
            public string ImgUrl { get; set; }
            public int? Target { get; set; }
            public int? Price { get; set; }
        }
        public class ItemCreateDto
        {
            
            public string Name { get; set; }

            
            public string Description { get; set; }

            
            public int GameBookActionId { get; set; } // Mandatory foreign key

            public int? Target { get; set; } // Nullable field
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutItem(int id, Item item)
        {
            if (id != item.ItemId)
            {
                return BadRequest();
            }

            _context.Entry(item).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemExists(id))
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

        [HttpPost]
        public async Task<IActionResult> CreateItem([FromBody] ItemCreateDto itemDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if the related GameBookAction exists
            var gameBookAction = await _context.Actions.FindAsync(itemDto.GameBookActionId);
            if (gameBookAction == null)
            {
                return NotFound($"GameBookAction with ID {itemDto.GameBookActionId} not found.");
            }

            // Map DTO to Entity
            var item = new Item
            {
                Name = itemDto.Name,
                Description = itemDto.Description,
                GameBookActionId = itemDto.GameBookActionId,
                Target = itemDto.Target
            };

            // Add and save the item
            _context.Items.Add(item);
            await _context.SaveChangesAsync();

            // Return the created item with its ID
            return Ok(item);
        }


        // POST: api/Items
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754


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
