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

            // Return only the required properties
            return new
            {

                RequiredItems = room.RequiredItems,
                RequiredNPCs = room.RequiredNPCs,
                RequiredActions = room.RequiredActions
            };
        }
        public class RoomCreateDto
        {
            public required string Name { get; set; } // Name of the room
            public required string Text { get; set; } // Description of the room
            public IFormFile Img { get; set; }        // Image file (uploaded by user)
        }

    }
}
