using Gamebook.Server.models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Gamebook.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public UserController( // Fixed method name to UserController
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _roleManager = roleManager;
        }

        // POST: api/users/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = new User
            {
                UserName = model.Email,
                Email = model.Email,
                Role = UserRole.User // Default to 'User'
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "User");
                return Ok(new { Message = "User registered successfully" });
            }

            return BadRequest(result.Errors);
        }

        // POST: api/users/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserDto model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null) return Unauthorized("Invalid login attempt");

            var result = await _signInManager.PasswordSignInAsync(user.UserName ?? string.Empty, model.Password, false, false);

            if (!result.Succeeded) return Unauthorized("Invalid login attempt");

            // Include user role in the response
            var role = (await _userManager.GetRolesAsync(user)).FirstOrDefault();  // Assuming user only has one role

            return Ok(new { Message = "Login successful", Role = role });
        }

        // GET: api/users
        [HttpGet]
        [Authorize(Roles = "Admin")] // Only Admins can access this
        public IActionResult GetUsers()
        {
            var users = _userManager.Users.Select(u => new { u.Id, u.UserName, u.Email, u.Role }).ToList();
            return Ok(users);
        }

        // PUT: api/users/{id}/role
        [HttpPut("{id}/role")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ChangeUserRole(string id, [FromBody] ChangeRoleDto model)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound("User not found");

            var currentRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, currentRoles);

            if (!await _roleManager.RoleExistsAsync(model.NewRole))
                return BadRequest("Invalid role");

            await _userManager.AddToRoleAsync(user, model.NewRole);
            user.Role = Enum.Parse<UserRole>(model.NewRole);
            await _userManager.UpdateAsync(user);

            return Ok(new { Message = "User role updated successfully" });
        }

        public class RegisterUserDto
        {
            public string? Email { get; set; } // Made nullable
            public string? Password { get; set; } // Made nullable
        }

        public class LoginUserDto
        {
            public string? Email { get; set; } // Made nullable
            public string? Password { get; set; } // Made nullable
        }

        public class ChangeRoleDto
        {
            public string? NewRole { get; set; } // Made nullable
        }
    }
}
