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
        [HttpPost]
        public async Task<IActionResult> ProcessOption([FromBody] OptionDto optionDto)
        {
            if (optionDto == null)
            {
                return BadRequest("Invalid option data.");
            }

            // Fetch GameBookAction if actionId is provided
            GameBookAction? action = null;
            if (optionDto.ActionId.HasValue)
            {
                action = await _context.Actions
                    .Include(a => a.ActionType) // Include related ActionType if needed
                    .FirstOrDefaultAsync(a => a.ActionId == optionDto.ActionId.Value);

                if (action == null)
                {
                    return NotFound($"Action with ID {optionDto.ActionId.Value} not found.");
                }
            }

            // Map OptionDto to Option
            var option = new Option
            {
                Label = optionDto.Label,
                Text = optionDto.Text,
                Action = action
            };

            return Ok(option);
        }

       
        public class OptionDto
        {
            public string Label { get; set; }
            public string Text { get; set; }
            public int? ActionId { get; set; }
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
