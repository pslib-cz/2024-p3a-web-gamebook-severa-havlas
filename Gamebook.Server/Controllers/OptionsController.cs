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
    public class OptionsController : ControllerBase
    {
        private readonly GamebookDbContext _context;

        public OptionsController(GamebookDbContext context)
        {
            _context = context;
        }

        // GET: api/Options
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Option>>> GetOptions()
        {
            return await _context.Options.ToListAsync();
        }

        // GET: api/Options/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Option>> GetOption(string id)
        {
            var option = await _context.Options.FindAsync(id);

            if (option == null)
            {
                return NotFound();
            }

            return option;
        }

        // PUT: api/Options/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOption(string id, Option option)
        {
            if (id != option.Label)
            {
                return BadRequest();
            }

            _context.Entry(option).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OptionExists(id))
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

        // POST: api/Options
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754

        public class OptionCreateDto
        {
           
            public string Label { get; set; }

            
            public string Text { get; set; }

           
            public int NextActionId { get; set; } // Foreign key to GameBookAction
        }

        [HttpPost]
        public async Task<IActionResult> CreateOption([FromBody] OptionCreateDto optionDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if the related GameBookAction exists
            var gameBookAction = await _context.Actions.FindAsync(optionDto.NextActionId);
            if (gameBookAction == null)
            {
                return NotFound($"GameBookAction with ID {optionDto.NextActionId} not found.");
            }

            // Map DTO to Entity
            var option = new Option
            {
                Label = optionDto.Label,
                Text = optionDto.Text,
                NextActionId = optionDto.NextActionId
            };

            // Add and save the option
            _context.Options.Add(option);
            await _context.SaveChangesAsync();

            // Return the created option with its ID
            return Ok(option);
        }

        // DELETE: api/Options/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOption(string id)
        {
            var option = await _context.Options.FindAsync(id);
            if (option == null)
            {
                return NotFound();
            }

            _context.Options.Remove(option);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OptionExists(string id)
        {
            return _context.Options.Any(e => e.Label == id);
        }
    }
}
