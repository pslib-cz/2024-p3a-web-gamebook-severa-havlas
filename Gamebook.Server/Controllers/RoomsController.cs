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

        // Helper method: Convert byte array to base64 string
        private string ConvertByteArrayToBase64(byte[] byteArray)
        {
            return Convert.ToBase64String(byteArray);
        }

        // GET: api/Rooms
        // GET: api/Rooms
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomDTO>>> GetRooms()
        {
            var rooms = await _context.Rooms.ToListAsync();

            var roomDTOs = rooms.Select(room => new RoomDTO
            {
                Name = room.Name,
                Text = room.Text,
                ImgBase64 = Convert.ToBase64String(room.Img)
            });

            return Ok(roomDTOs);
        }

        // GET: api/Rooms/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RoomDTO>> GetRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);

            if (room == null)
            {
                return NotFound();
            }

            return new RoomDTO
            {
                Name = room.Name,
                Text = room.Text,
                ImgBase64 = Convert.ToBase64String(room.Img)
            };
        }


        [HttpPost]
        public async Task<ActionResult> PostRoom([FromBody] RoomDTO roomDto)
        {
            if (string.IsNullOrWhiteSpace(roomDto.ImgBase64))
            {
                return BadRequest("Image data is required.");
            }

            var room = new Room
            {
                Img = Convert.FromBase64String(roomDto.ImgBase64), // Convert Base64 to byte array
                Name = roomDto.Name,
                Text = roomDto.Text
            };

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRoom), new { id = room.RoomId }, new
            {
                room.RoomId,
                room.Name,
                room.Text,
                Img = roomDto.ImgBase64 // Send back Base64 string to match the response format
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutRoom(int id, [FromBody] RoomDTO roomDto)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrWhiteSpace(roomDto.ImgBase64))
            {
                room.Img = Convert.FromBase64String(roomDto.ImgBase64); // Update image
            }

            room.Name = roomDto.Name;
            room.Text = roomDto.Text;

            _context.Entry(room).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        public class RoomDTO
        {
            public string Name { get; set; }
            public string Text { get; set; }
            public string ImgBase64 { get; set; } // Base64-encoded image string
        }

    }
}
