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

       

        // POST: api/ItemPositions
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ItemPosition>> PostItemPosition(ItemPosition itemPosition)
        {
            _context.ItemPositions.Add(itemPosition);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetItemPosition", new { id = itemPosition.ItemPositionId }, itemPosition);
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
