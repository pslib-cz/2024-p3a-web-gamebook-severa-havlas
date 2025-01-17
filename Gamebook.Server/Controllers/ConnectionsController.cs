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

      
        /*
        // POST: api/Connections
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Connection>> PostConnection([FromBody] ConnectionDto connectionData)
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

            // Create new connection
            var connection = new Connection
            {
                FromRoomId = connectionData.FromRoomId,
                ToRoomId = connectionData.ToRoomId,
                FromRoom = fromRoom,
                ToRoom = toRoom
            };

            // Add connection to database
            _context.Connections.Add(connection);
            await _context.SaveChangesAsync();

            // Return created connection
            return CreatedAtAction("GetConnection", new { id = connection.ConnectionId }, connection);
        }

        // DTO class for incoming JSON
        public class ConnectionDto
        {
            public int FromRoomId { get; set; }
            public int ToRoomId { get; set; }
        }
        */

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
        [HttpGet("GetFromConnection/{FromRoomId}")]
        public async Task<ActionResult<IEnumerable<Connection>>> GetConnectionsByFromRoomId(int FromRoomId)
        {
            // Find the connections based on FromRoomId
            var connections = await _context.Connections
                .Where(c => c.FromRoomId == FromRoomId)
                .ToListAsync();

            // If no connections are found
            if (connections == null || !connections.Any())
            {
                return NotFound($"No connections found for FromRoomId: {FromRoomId}");
            }

            return Ok(connections);
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
    }
}
