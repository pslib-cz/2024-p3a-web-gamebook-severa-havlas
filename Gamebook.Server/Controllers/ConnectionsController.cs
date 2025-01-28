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
    public class ConnectionsController : ControllerBase
    {
        private readonly GamebookDbContext _context;

        public ConnectionsController(GamebookDbContext context)
        {
            _context = context;
        }

        // GET: api/Connections
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Connection>>> GetConnections()
        {
            return await _context.Connections.ToListAsync();
        }

        // GET: api/Connections/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Connection>> GetConnection(int id)
        {
            var connection = await _context.Connections.FindAsync(id);

            if (connection == null)
            {
                return NotFound();
            }

            return connection;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutConnection(int id, Connection connection)
        {
            if (id != connection.ConnectionId)
            {
                return BadRequest();
            }

            _context.Entry(connection).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ConnectionExists(id))
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

        // POST: api/Connections
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Connection>> PostConnection([FromForm] ConnectionDto connectionData) // Use [FromForm] to bind form data
        {
            // Validate input
            if (connectionData == null || connectionData.FromRoomId == 0 || connectionData.ToRoomId == 0)
            {
                return BadRequest("Invalid input. Both FromRoomId and ToRoomId must be provided.");
            }

            // Fetch Rooms from database
            var fromRoom = await _context.Rooms.FindAsync(connectionData.FromRoomId);
            var toRoom = await _context.Rooms.FindAsync(connectionData.ToRoomId);

            // Check if Rooms exist
            if (fromRoom == null || toRoom == null)
            {
                return NotFound("One or both of the specified rooms do not exist.");
            }

            // Handle the image file
            byte[]? imageBytes = null;
            if (connectionData.Img != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await connectionData.Img.CopyToAsync(memoryStream);
                    imageBytes = memoryStream.ToArray();
                }
            }

          

      

            // Create new Connection
            var connection = new Connection
            {
                FromRoomId = connectionData.FromRoomId,
                ToRoomId = connectionData.ToRoomId,
                X = connectionData.X,
                Y = connectionData.Y,
                Img = imageBytes
            };

            // Add Connection to database
            _context.Connections.Add(connection);
            await _context.SaveChangesAsync();

            // Return created connection
            return CreatedAtAction("GetConnection", new { id = connection.ConnectionId }, connection);
        }

        

        public class ConnectionDto
        {
            public int FromRoomId { get; set; }
            public int X { get; set; } // X position
            public int Y { get; set; } // Y position 
            public int ToRoomId { get; set; }
            public IFormFile? Img { get; set; }
        }


        // DELETE: api/Connections/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConnection(int id)
        {
            var connection = await _context.Connections.FindAsync(id);
            if (connection == null)
            {
                return NotFound();
            }

            _context.Connections.Remove(connection);
            await _context.SaveChangesAsync();

            return NoContent();
        }


        // GET: api/Connections/GetConnection/{FromRoomId}
        [HttpGet("{FromRoomId}/GetFromConnection")]
        public async Task<ActionResult<IEnumerable<Connection>>> GetConnectionsByFromRoomId(int FromRoomId)
        {
            var connections = await _context.Connections
                            .Select(connection => new
                            {
                                connection.ConnectionId,
                                connection.X,
                                connection.Y,
                                connection.ToRoomId,
                                connection.FromRoomId,
                                ImgUrl = $"/api/connections/{connection.ConnectionId}/image" // Provide URL to fetch the image
                            }).Where(connection => FromRoomId == connection.ToRoomId)
                            .ToListAsync();

            return Ok(connections);
        }
        [HttpGet]
        [Route("{id}/image")]
        public async Task<IActionResult> GetRoomImage(int id)
        {
            var connection = await _context.Connections.FindAsync(id);
            if (connection == null || connection.Img == null)
            {
                return NotFound("Image not found.");
            }

            return File(connection.Img, "image/jpeg"); // Adjust the MIME type as needed
        }

        [HttpGet("GetToConnection/{ToRoomId}")]
        public async Task<ActionResult<IEnumerable<Connection>>> GetConnectionsByToRoomId(int ToRoomId)
        {
            // Find the connections based on ToRoomId
            var connections = await _context.Connections
                .Where(c => c.ToRoomId == ToRoomId)
                .ToListAsync();

            // If no connections are found
            if (connections == null || !connections.Any())
            {
                return NotFound($"No connections found for ToRoomId: {ToRoomId}");
            }

            return Ok(connections);
        }
        private bool ConnectionExists(int id)
        {
            return _context.Connections.Any(e => e.ConnectionId == id);
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
            var connection = await _context.Connections
                .Include(r => r.RequiredItems)
                .Include(r => r.RequiredNPCs)
                .Include(r => r.RequiredProgress)
                .FirstOrDefaultAsync(r => r.ConnectionId == id);

            if (connection == null)
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

                    connection.RequiredItems = items;
                }

                // Update RequiredNPCs
                if (updateDto.RequiredNPCs != null)
                {
                    var npcs = await _context.NPCs
                        .Where(npc => updateDto.RequiredNPCs.Contains(npc.NPCId))
                        .ToListAsync();

                    connection.RequiredNPCs = npcs;
                }

                // Update RequiredActions
                if (updateDto.RequiredProgress != null)
                {
                    var progress = await _context.Progress
                        .Where(progress => updateDto.RequiredProgress.Contains(progress.ProgressId))
                        .ToListAsync();

                    connection.RequiredProgress = progress;
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

        public class RoomRequirementsUpdateDto
        {
            public List<int>? RequiredItems { get; set; }
            public List<int>? RequiredNPCs { get; set; }
            public List<int>? RequiredProgress { get; set; }
        }
    }
}
