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
    [ApiController]
    [Route("api/[controller]")]

    public class RoomsController : ControllerBase
    {
        private readonly GamebookDbContext _context;

        public RoomsController(GamebookDbContext context)
        {
            _context = context;
        }
        
        [HttpGet]
        [Route("{id}/image")]
        public async Task<IActionResult> GetRoomImage(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null || room.Img == null)
            {
                return NotFound("Image not found.");
            }

            return File(room.Img, "image/jpeg"); // Adjust the MIME type as needed
        }

        [HttpGet]
        
        public async Task<IActionResult> GetAllRooms()
        {
            var rooms = await _context.Rooms
                .Select(room => new
                {
                    room.RoomId,
                    room.Name,
                    room.Text,
                    ImgUrl = $"/api/rooms/{room.RoomId}/image" // Provide URL to fetch the image
                })
                .ToListAsync();

            return Ok(rooms);
        }
        /*
        [HttpGet]
        [Route("{id}")]
        public async Task<IActionResult> GetRoomById(int id)
        {
            
            var room = await _context.Rooms
                .Where(r => r.RoomId == id)
                .Select(r => new
                {
                    r.RoomId,
                    r.Name,
                    r.Text,
                    ImgUrl = $"/api/rooms/{r.RoomId}/image", // Provide URL to fetch the image
                    Items = r.Items.Select(i => new { i.ItemId, i.Name }), // Optional: Include related data
                    NPCs = r.NPCs.Select(n => new { n.NPCId, n.Name }),
                   
                })
                .FirstOrDefaultAsync();

            if (room == null)
            {
                return NotFound($"Room with ID {id} not found.");
            }

            return Ok(room);
        }
        





        [HttpPost]
        
        public async Task<IActionResult> CreateRoom([FromForm] RoomCreateDto roomDto)
        {
            if (roomDto.Img == null || roomDto.Img.Length == 0)
                return BadRequest("Image is required.");

            // Convert image to byte array
            using var memoryStream = new MemoryStream();
            await roomDto.Img.CopyToAsync(memoryStream);
            var imgBytes = memoryStream.ToArray();

            // Create Room object
            var room = new Room
            {
                Name = roomDto.Name,
                Text = roomDto.Text,
                Img = imgBytes,
                Items = new List<Item>(), // Initialize collections if needed
                NPCs = new List<NPC>(),
                ItemPositions = new List<ItemPosition>(),
                ConnectionsFrom = new List<Connection>(),
                ConnectionsTo = new List<Connection>(),
                RequiredItems = new List<Item>(),
                RequiredNPCs = new List<NPC>(),
                RequiredActions = new List<GameBookAction>()
            };

            // Save room to database (assuming EF Core)
            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            return Ok(room);
        }
        */
        // GET: api/Rooms/5
        // GET: api/Rooms/5
        [HttpGet("Required/{id}")]
        public async Task<ActionResult<object>> GetRoom(int id)
        {
            var room = await _context.Rooms
                .Include(r => r.RequiredItems)
                .Include(r => r.RequiredNPCs)
                .Include(r => r.RequiredActions)
                .FirstOrDefaultAsync(r => r.RoomId == id);

            if (room == null)
            {
                return NotFound();
            }

            // Return only the IDs of the required properties
            return new
            {
                RequiredItems = room.RequiredItems.Select(item => item.ItemId), // Assuming ItemId exists in Item class
                RequiredNPCs = room.RequiredNPCs.Select(npc => npc.NPCId),     // Assuming NPCId exists in NPC class
                RequiredActions = room.RequiredActions.Select(action => action.ActionId) // Assuming ActionId exists in GameBookAction class
            };
        }


        // PATCH: api/Rooms/{id}/UpdateRequirements
        [HttpPatch("{id}/UpdateRequirements")]
        public async Task<IActionResult> UpdateRoomRequirements(
            int id,
            [FromBody] RoomRequirementsUpdateDto updateDto)
        {
            // Validate input
            if (updateDto == null)
            {
                return BadRequest("Invalid request payload.");
            }

            // Find the room
            var room = await _context.Rooms
                .Include(r => r.RequiredItems)
                .Include(r => r.RequiredNPCs)
                .Include(r => r.RequiredActions)
                .FirstOrDefaultAsync(r => r.RoomId == id);

            if (room == null)
            {
                return NotFound($"Room with ID {id} not found.");
            }

            try
            {
                // Update RequiredItems
                if (updateDto.RequiredItems != null)
                {
                    var items = await _context.Items
                        .Where(item => updateDto.RequiredItems.Contains(item.ItemId))
                        .ToListAsync();

                    room.RequiredItems = items;
                }

                // Update RequiredNPCs
                if (updateDto.RequiredNPCs != null)
                {
                    var npcs = await _context.NPCs
                        .Where(npc => updateDto.RequiredNPCs.Contains(npc.NPCId))
                        .ToListAsync();

                    room.RequiredNPCs = npcs;
                }

                // Update RequiredActions
                if (updateDto.RequiredActions != null)
                {
                    var actions = await _context.Actions
                        .Where(action => updateDto.RequiredActions.Contains(action.ActionId))
                        .ToListAsync();

                    room.RequiredActions = actions;
                }

                // Save changes
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                // Handle potential errors
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        /*
        [HttpPatch("{id}/updateRoomContent")]
        public async Task<IActionResult> UpdateRoomContent(
    int id,
    [FromBody] RoomContentUpdateDto updateDto)
        {
            // Validate input
            if (updateDto == null)
            {
                return BadRequest("Invalid request payload.");
            }

            // Find the room
            var room = await _context.Rooms
                .Include(r => r.Items)
                .Include(r => r.NPCs)
                .Include(r => r.ItemPositions)
                .FirstOrDefaultAsync(r => r.RoomId == id);

            if (room == null)
            {
                return NotFound($"Room with ID {id} not found.");
            }

            try
            {
                // Add NPCs
                if (updateDto.NPCs != null && updateDto.NPCs.Any())
                {
                    var npcsToAdd = await _context.NPCs
                        .Where(npc => updateDto.NPCs.Contains(npc.NPCId))
                        .ToListAsync();

                    foreach (var npc in npcsToAdd)
                    {
                        if (!room.NPCs.Contains(npc))
                        {
                            room.NPCs.Add(npc);
                        }
                    }
                }

                // Add Items
                if (updateDto.Items != null && updateDto.Items.Any())
                {
                    var itemsToAdd = await _context.Items
                        .Where(item => updateDto.Items.Contains(item.ItemId))
                        .ToListAsync();

                    foreach (var item in itemsToAdd)
                    {
                        if (!room.Items.Contains(item))
                        {
                            room.Items.Add(item);
                        }
                    }
                }
        
                // Add ItemPositions
                if (updateDto.ItemPositions != null && updateDto.ItemPositions.Any())
                {
                    foreach (var itemPositionDto in updateDto.ItemPositions)
                    {
                        // Create and add new ItemPosition if it doesn't already exist
                        var itemPosition = new ItemPosition
                        {
                            X = itemPositionDto.X,
                            Y = itemPositionDto.Y,
                            ItemId = itemPositionDto.ItemId,
                            RoomId = id
                        };

                        if (!room.ItemPositions.Any(ip =>
                            ip.X == itemPosition.X &&
                            ip.Y == itemPosition.Y &&
                            ip.ItemId == itemPosition.ItemId))
                        {
                            room.ItemPositions.Add(itemPosition);
                        }
                    }
                }

                // Save changes
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                // Handle potential errors
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("{roomId}/RoomContent")]
        public async Task<IActionResult> GetRoomContent(int roomId)
        {
            // Find the room and include related entities (NPCs, Items, ItemPositions)
            var room = await _context.Rooms
                .Include(r => r.NPCs)
                .Include(r => r.Items)
                .Include(r => r.ItemPositions)
                .FirstOrDefaultAsync(r => r.RoomId == roomId);

            // Check if the room exists
            if (room == null)
            {
                return NotFound($"Room with ID {roomId} not found.");
            }

            // Map the data to a DTO to prevent over-fetching
            var roomContentDto = new RoomContentDto
            {
                NPCs = room.NPCs.Select(npc => new NPCDto
                {
                    NPCId = npc.NPCId,
                    Name = npc.Name
                }).ToList(),
                Items = room.Items.Select(item => new ItemDto
                {
                    ItemId = item.ItemId,
                    Name = item.Name
                }).ToList(),
                ItemPositions = room.ItemPositions.Select(pos => new ItemPositionDto
                {
                    ItemId = pos.ItemId,
                    X = pos.X,
                    Y = pos.Y
                }).ToList()
            };

            // Return the room content
            return Ok(roomContentDto);
        }
        */

        public class RoomContentDto
        {
            public List<NPCDto> NPCs { get; set; }
            public List<ItemDto> Items { get; set; }
            public List<ItemPositionDto> ItemPositions { get; set; }
        }
        public class NPCDto
        {
            public int NPCId { get; set; }
            public string Name { get; set; }
        }

        public class ItemDto
        {
            public int ItemId { get; set; }
            public string Name { get; set; }
        }
        public class RoomContentUpdateDto
        {
            public List<int>? NPCs { get; set; } // IDs of NPCs to add
            public List<int>? Items { get; set; } // IDs of Items to add
            public List<ItemPositionDto>? ItemPositions { get; set; } // Item positions to add
        }
        public class ItemPositionDto
        {
            public int ItemId { get; set; } // ID of the item
            public int X { get; set; } // X-coordinate of the item's position
            public int Y { get; set; } // Y-coordinate of the item's position
        }

        public class RoomRequirementsUpdateDto
        {
            public List<int>? RequiredItems { get; set; }
            public List<int>? RequiredNPCs { get; set; }
            public List<int>? RequiredActions { get; set; }
        }

        public class RoomCreateDto
        {
            public required string Name { get; set; } // Name of the room
            public required string Text { get; set; } // Description of the room
            public IFormFile Img { get; set; }        // Image file (uploaded by user)
        }
       
    }
}
