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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ItemDto>>> GetItems()
        {
            var items = await _context.Items.ToListAsync();

            var itemDtos = items.Select(item => new ItemDto
            {
                ItemId = item.ItemId,
                Name = item.Name,
                Description = item.Description,
                ImgUrl = $"/api/rooms/{item.ItemId}/image",
                Target = item.Target,
                Price = item.Price
            }).ToList();

            return Ok(itemDtos);


        
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
            public int? Price { get; set; } // Nullable price field
        }
        [HttpPost("bulk")]
        public async Task<IActionResult> CreateItemsBulk([FromBody] List<ItemCreateDto> itemDtos)
        {
            if (itemDtos == null || itemDtos.Count == 0)
            {
                return BadRequest("The request body cannot be empty.");
            }

            var invalidItems = new List<object>();
            var itemsToAdd = new List<Item>();

            foreach (var itemDto in itemDtos)
            {
                if (!ModelState.IsValid)
                {
                    invalidItems.Add(new { itemDto, Error = "Invalid model state" });
                    continue;
                }

                var gameBookAction = await _context.Actions.FindAsync(itemDto.GameBookActionId);
                if (gameBookAction == null)
                {
                    invalidItems.Add(new { itemDto, Error = $"GameBookAction with ID {itemDto.GameBookActionId} not found." });
                    continue;
                }

                itemsToAdd.Add(new Item
                {
                    Name = itemDto.Name,
                    Description = itemDto.Description,
                    GameBookActionId = itemDto.GameBookActionId,
                    Target = itemDto.Target,
                    Price = itemDto.Price
                });
            }

            if (itemsToAdd.Count > 0)
            {
                await _context.Items.AddRangeAsync(itemsToAdd);
                await _context.SaveChangesAsync();
            }

            if (invalidItems.Count > 0)
            {
                return BadRequest(new { Message = "Some items were not created", InvalidItems = invalidItems });
            }

            return Ok(new { Message = $"{itemsToAdd.Count} items created successfully" });
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
