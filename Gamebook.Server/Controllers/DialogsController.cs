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
    public class DialogsController : ControllerBase
    {
        private readonly GamebookDbContext _context;

        public DialogsController(GamebookDbContext context)
        {
            _context = context;
        }

        // GET: api/Dialogs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Dialog>>> GetDialogs()
        {
            return await _context.Dialogs.ToListAsync();
        }

        [HttpGet("getOptions/{dialogId}")]
        public async Task<IActionResult> GetOptionsByParentDialogId(int dialogId)
        {
            // Find dialogs where ParentDialogId matches dialogId
            var childDialogs = await _context.Dialogs
                .Where(d => d.ParentDialogId == dialogId)
                .Select(d => new DialogDTO
                {
                    DialogId = d.DialogId,
                    Text = d.Text
                })
                .ToListAsync();

            if (!childDialogs.Any())
            {
                return NotFound($"No dialogs found with ParentDialogId {dialogId}.");
            }

            return Ok(childDialogs);
        }

        // GET: api/Dialog/{DialogId}
        [HttpGet("{dialogId}")]
        public async Task<IActionResult> GetDialogById(int dialogId)
        {
            // Find the dialog with the given DialogId
            var dialog = await _context.Dialogs
                .Where(d => d.DialogId == dialogId)
                .Select(d => new DialogDTO
                {
                    DialogId = d.DialogId,
                    Text = d.Text
                })
                .FirstOrDefaultAsync();

            if (dialog == null)
            {
                return NotFound($"Dialog with ID {dialogId} not found.");
            }

            return Ok(dialog);
        }
        public class DialogDTO
        {
            public int DialogId { get; set; }
            public string Text { get; set; }
        }

        // PUT: api/Dialogs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDialog(int id, Dialog dialog)
        {
            if (id != dialog.DialogId)
            {
                return BadRequest();
            }

            _context.Entry(dialog).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DialogExists(id))
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
        public async Task<IActionResult> CreateDialog([FromBody] CreateDialogDTO dialogDto)
        {
            if (dialogDto == null || string.IsNullOrWhiteSpace(dialogDto.Text))
            {
                return BadRequest("Invalid dialog data. Ensure all required fields are provided.");
            }

            // Validate if NPC exists (if provided)
            if (dialogDto.NPCId.HasValue)
            {
                var npcExists = await _context.NPCs.AnyAsync(n => n.NPCId == dialogDto.NPCId.Value);
                if (!npcExists)
                {
                    return NotFound($"NPC with ID {dialogDto.NPCId} not found.");
                }
            }

            // Validate if ParentDialog exists (if provided)
            if (dialogDto.ParentDialogId.HasValue)
            {
                var parentDialogExists = await _context.Dialogs.AnyAsync(d => d.DialogId == dialogDto.ParentDialogId.Value);
                if (!parentDialogExists)
                {
                    return NotFound($"Parent Dialog with ID {dialogDto.ParentDialogId} not found.");
                }
            }

            // Create new Dialog entity
            var newDialog = new Dialog
            {
                NPCId = dialogDto.NPCId,
                ParentDialogId = dialogDto.ParentDialogId,
                Text = dialogDto.Text
            };

            try
            {
                // Add to database
                _context.Dialogs.Add(newDialog);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Log the error and return a generic error message
                // (Log to file or monitoring system in production)
                return StatusCode(500, "An error occurred while saving the dialog. Please try again later.");
            }

            // Map to response DTO to prevent cyclic reference
            var result = new
            {
                newDialog.DialogId,
                newDialog.NPCId,
                newDialog.ParentDialogId,
                newDialog.Text
            };

            return Ok(result);
        }
        public class CreateDialogDTO
        {
            public int? ParentDialogId { get; set; }
            public int? NPCId { get; set; }
            public string Text { get; set; }
        }
        // DELETE: api/Dialogs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDialog(int id)
        {
            var dialog = await _context.Dialogs.FindAsync(id);
            if (dialog == null)
            {
                return NotFound();
            }

            _context.Dialogs.Remove(dialog);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DialogExists(int id)
        {
            return _context.Dialogs.Any(e => e.DialogId == id);
        }
    }
}
