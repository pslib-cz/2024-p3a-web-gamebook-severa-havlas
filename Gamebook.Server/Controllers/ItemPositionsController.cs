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
    public class ItemPositionsController : ControllerBase
    {
        private readonly GamebookDbContext _context;

        public ItemPositionsController(GamebookDbContext context)
        {
            _context = context;
        }

        // GET: api/ItemPositions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ItemPosition>>> GetItemPositions()
        {
            return await _context.ItemPositions.ToListAsync();
        }

        // GET: api/ItemPositions/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ItemPosition>> GetItemPosition(int id)
        {
            var itemPosition = await _context.ItemPositions.FindAsync(id);

            if (itemPosition == null)
            {
                return NotFound();
            }

            return itemPosition;
        }

        // PUT: api/ItemPositions/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutItemPosition(int id, ItemPosition itemPosition)
        {
            if (id != itemPosition.ItemPositionId)
            {
                return BadRequest();
            }

            _context.Entry(itemPosition).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemPositionExists(id))
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

        // POST: api/ItemPositions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ItemPosition>> PostItemPosition(CreateItemDTO createItemDto)
        {
            // Validate Room existence
            var room = await _context.Rooms.FindAsync(createItemDto.RoomId);
            if (room == null)
            {
                return NotFound($"Room with ID {createItemDto.RoomId} not found.");
            }

            // Validate Item existence
            var item = await _context.Items.FindAsync(createItemDto.ItemId);
            if (item == null)
            {
                return NotFound($"Item with ID {createItemDto.ItemId} not found.");
            }

            // Create new ItemPosition
            var itemPosition = new ItemPosition
            {
                RoomId = createItemDto.RoomId,
                Room = room,
                ItemId = createItemDto.ItemId,
                Item = item,
                X = createItemDto.X,
                Y = createItemDto.Y
            };

            _context.ItemPositions.Add(itemPosition);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetItemPosition", new { id = itemPosition.ItemPositionId }, itemPosition);
        }
        public class CreateItemDTO{
        public int RoomId { get; set; }
        public int ItemId { get; set; }

        public int X { get; set; } // X position
        public int Y { get; set; } // Y position
    }
    // DELETE: api/ItemPositions/5
    [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItemPosition(int id)
        {
            var itemPosition = await _context.ItemPositions.FindAsync(id);
            if (itemPosition == null)
            {
                return NotFound();
            }

            _context.ItemPositions.Remove(itemPosition);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ItemPositionExists(int id)
        {
            return _context.ItemPositions.Any(e => e.ItemPositionId == id);
        }
    }
}
