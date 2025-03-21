﻿using System;
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
    public class ActionTypesController : ControllerBase
    {
        private readonly GamebookDbContext _context;

        public ActionTypesController(GamebookDbContext context)
        {
            _context = context;
        }

        // GET: api/ActionTypes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ActionType>>> GetActionTypes()
        {
            return await _context.ActionTypes.ToListAsync();
        }

        // GET: api/ActionTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ActionType>> GetActionType(int id)
        {
            var actionType = await _context.ActionTypes.FindAsync(id);

            if (actionType == null)
            {
                return NotFound();
            }

            return actionType;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutActionType(int id, ActionType actionType)
        {
            if (id != actionType.ActionTypeId)
            {
                return BadRequest();
            }

            _context.Entry(actionType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ActionTypeExists(id))
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

        // POST: api/ActionTypes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ActionType>> PostActionType(PostActionTypeDto actionTypeDto)
        {
            // Map the DTO to the ActionType entity
            var actionType = new ActionType
            {
                Name = actionTypeDto.Name
            };

            // Add to context and save changes
            _context.ActionTypes.Add(actionType);
            await _context.SaveChangesAsync();

            // Return the created resource
            return CreatedAtAction("GetActionType", new { id = actionType.ActionTypeId }, actionType);
        }

        // DTO class
        public class PostActionTypeDto
        {
            public string Name { get; set; }
        }

        // DELETE: api/ActionTypes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActionType(int id)
        {
            var actionType = await _context.ActionTypes.FindAsync(id);
            if (actionType == null)
            {
                return NotFound();
            }

            _context.ActionTypes.Remove(actionType);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ActionTypeExists(int id)
        {
            return _context.ActionTypes.Any(e => e.ActionTypeId == id);
        }
    }
}
