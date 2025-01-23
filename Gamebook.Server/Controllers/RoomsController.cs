using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Gamebook.Server.Data;
using Gamebook.Server.models;
using Newtonsoft.Json;

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
        private bool RoomExists(int id)
        {
            return _context.Rooms.Any(e => e.RoomId == id);
        }
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutRoom(int id, Room room)
        {
            if (id != room.RoomId)
            {
                return BadRequest();
            }

            _context.Entry(room).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!RoomExists(id))
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

                    // Related data
                    RequiredItems = r.RequiredItems.Select(ri => new { ri.ItemId, ri.Name }),
                    RequiredNPCs = r.RequiredNPCs.Select(rn => new { rn.NPCId, rn.Name }),
                    RequiredActions = r.RequiredActions.Select(ra => new { ra.ActionId }),

                    Progress = r.Progress.Select(p => new { p.ProgressId }),

                    NPCs = r.NPCs.Select(n => new { n.NPCId, n.Name }),

                    Items = r.Items.Select(ip => new
                    {
                        ip.ItemPositionId,
                        ip.RoomId,
                        ip.X,
                        ip.Y,
                        ip.ItemId,

                        Item = ip.Item != null ? new
                        {
                            ip.Item.ItemId,
                            ip.Item.Name,
                            ip.Item.Description // Add other properties of Item if needed
                        } : null // Handle cases where ip.Item is null
                    }),

                    TriggerActions = r.TriggerActions.Select(ta => new { ta.ActionId })
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
            // Validate input
            if (roomDto == null)
                return BadRequest("Room data is required.");

            if (string.IsNullOrWhiteSpace(roomDto.Name))
                return BadRequest("Room name is required.");

            if (string.IsNullOrWhiteSpace(roomDto.Text))
                return BadRequest("Room description is required.");

            if (roomDto.Img == null || roomDto.Img.Length == 0)
                return BadRequest("Image is required.");

            try
            {
                // Convert image to byte array
                byte[] imgBytes;
                using (var memoryStream = new MemoryStream())
                {
                    await roomDto.Img.CopyToAsync(memoryStream);
                    imgBytes = memoryStream.ToArray();
                }

                // Create Room object
                var room = new Room
                {
                    Name = roomDto.Name,
                    Text = roomDto.Text,
                    Img = imgBytes,
                  
                    NPCs = new List<NPC>(),
                    Items = new List<ItemPosition>(),
                    ConnectionsFrom = new List<Connection>(),
                    ConnectionsTo = new List<Connection>(),
                    RequiredItems = new List<Item>(),
                    RequiredNPCs = new List<NPC>(),
                    RequiredActions = new List<GameBookAction>()
                };

                // Save room to database
                _context.Rooms.Add(room);
                await _context.SaveChangesAsync();

                // Return success response
                return Ok();// Adjust GetRoomById if needed
            }
            catch (Exception ex)
            {
                // Log the error (optional)
                // _logger.LogError(ex, "Error creating room");
                return StatusCode(500, "An error occurred while creating the room. Please try again.");
            }
        }

        // GET: api/Rooms/5
        // GET: api/Rooms/5
        [HttpGet("Required/{id}")]
        public async Task<ActionResult<object>> GetRoomReq(int id)
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

        [HttpPatch("{id}/updateRoomContent")]
        public async Task<IActionResult> UpdateRoomContent(
     int id,
     [FromBody] RoomContentDto updateDto)
        {
            // Validate input
            if (updateDto == null)
            {
                return BadRequest("Invalid request payload.");
            }

            // Find the room
            var room = await _context.Rooms
                .Include(r => r.NPCs)
                .Include(r => r.TriggerActions)
                .FirstOrDefaultAsync(r => r.RoomId == id);

            if (room == null)
            {
                return NotFound($"Room with ID {id} not found.");
            }

            try
            {
                // Update NPCs
                if (updateDto.NPCIds != null && updateDto.NPCIds.Any())
                {
                    var npcsToAdd = await _context.NPCs
                        .Where(npc => updateDto.NPCIds.Contains(npc.NPCId))
                        .ToListAsync();

                    foreach (var npc in npcsToAdd)
                    {
                        if (!room.NPCs.Contains(npc))
                        {
                            room.NPCs.Add(npc);
                        }
                    }
                }

                // Update TriggerActions
                if (updateDto.triggerActionIds != null && updateDto.triggerActionIds.Any())
                {
                    var actionsToAdd = await _context.Actions
                        .Where(action => updateDto.triggerActionIds.Contains(action.ActionId))
                        .ToListAsync();

                    foreach (var action in actionsToAdd)
                    {
                        if (!room.TriggerActions.Contains(action))
                        {
                            room.TriggerActions.Add(action);
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
        /*
        [HttpGet("{roomId}/RoomContent")]
        public async Task<IActionResult> GetRoomContent(int roomId)
        {
            // Find the room and include related entities (NPCs, Items, ItemPositions)
            var room = await _context.Rooms
                .Include(r => r.NPCs)
                .Include(r => r.Items)
               
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

        [HttpGet("{roomId}/Connection")]
        public async Task<IActionResult> GetRoomConnectionsWithState(int roomId, [FromQuery] string gameState)
        {
            try
            {
                // Deserialize the gameState JSON string
                var gameStateData = JsonConvert.DeserializeObject<GameState>(gameState);

                if (gameStateData == null)
                {
                    return BadRequest("Invalid gameState format.");
                }

                // Query the connections where the given roomId matches FromRoomId
                var connections = await _context.Connections
                    .Where(c => c.FromRoomId == roomId)
                    .Include(c => c.ToRoom) // Include the related Room entity for ToRoomId
                    .ToListAsync();

                // Construct the response with state logic
                var result = connections.Select(connection =>
                {
                    // Get the required items for the "ToRoomId"
                    var requiredItems = connection.ToRoom.RequiredItems?.Select(item => item.ItemId).ToList() ?? new List<int>();

                    // Check if the player has all required items in sufficient quantity
                    var hasAllRequiredItems = requiredItems.All(requiredItemId =>
                        gameStateData.Player.Items.Any(playerItem =>
                            playerItem.ItemId == requiredItemId && playerItem.Quantity >= 1));

                    // Return the connection with the state property
                    return new
                    {
                        connection.FromRoomId,
                        connection.ToRoomId,
                        connection.X,
                        connection.Y,
                        connection.Img,
                        State = hasAllRequiredItems // true if all required items are present, false otherwise
                    };
                });

                return Ok(result);
            }
            catch (JsonException ex)
            {
                return BadRequest($"Error deserializing gameState: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }

    // Define a GameState model to deserialize gameState JSON
    public class GameState
    {
        public string RoomId { get; set; }
        public PlayerState Player { get; set; }
    }

    public class PlayerState
    {
        public List<PlayerItem> Items { get; set; }
    }

    public class PlayerItem
    {
        public int ItemId { get; set; }
        public string ItemName { get; set; }
        public int Quantity { get; set; }
    }

        public class RoomContentDto
        {
            public List<int> NPCIds { get; set; }
            public List<int> triggerActionIds { get; set; }
           
        }
        public class NPCDto
        {
            public int NPCId { get; set; }
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
