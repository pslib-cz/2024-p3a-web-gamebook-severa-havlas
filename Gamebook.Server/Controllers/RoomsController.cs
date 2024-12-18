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
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomDTOs>>> GetRooms()
        {
            var rooms = await _context.Rooms.ToListAsync();

            var roomDTOs = rooms.Select(room => new RoomDTOs
            {
                roomId = room.RoomId,
                Name = room.Name,
                Text = room.Text,
                ImgBase64 = Convert.ToBase64String(room.Img)
            });

            return Ok(roomDTOs);
        }

        // GET: api/Rooms/5
        [HttpGet("{id}")]
        public async Task<ActionResult<RoomDTOs>> GetRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);

            if (room == null)
            {
                return NotFound();
            }

            return new RoomDTOsz
            {
                roomId = room.RoomId,
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

            try
            {
                // Detect and remove Base64 header if it exists
                const string base64HeaderPattern = @"^data:image\/[a-zA-Z]+;base64,";
                if (System.Text.RegularExpressions.Regex.IsMatch(roomDto.ImgBase64, base64HeaderPattern))
                {
                    roomDto.ImgBase64 = System.Text.RegularExpressions.Regex.Replace(
                        roomDto.ImgBase64,
                        base64HeaderPattern,
                        string.Empty
                    );
                }

                // Convert Base64 string to a byte array
                var room = new Room
                {
                    Img = Convert.FromBase64String(roomDto.ImgBase64), // Convert Base64 to byte array
                    Name = roomDto.Name,
                    Text = roomDto.Text
                };

                // Add to database and save changes
                _context.Rooms.Add(room);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetRoom), new { id = room.RoomId }, new
                {
                    room.RoomId,
                    room.Name,
                    room.Text,
                    Img = roomDto.ImgBase64 // Optionally return the sanitized base64
                });
            }
            catch (FormatException)
            {
                return BadRequest("Invalid Base64 string provided.");
            }
            catch (Exception ex)
            {
                // Handle other exceptions
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
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
        public class RoomDTOs
        {
            public int roomId { get; set; }
            public string Name { get; set; }
            public string Text { get; set; }
            public string ImgBase64 { get; set; } // Base64-encoded image string
        }
        public class RoomDTOsz
        {
            public int roomId { get; set; }
            public string Name { get; set; }
            public string Text { get; set; }
            public string ImgBase64 { get; set; } // Base64-encoded image string
        }
    }
}
