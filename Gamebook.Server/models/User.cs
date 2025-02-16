using Microsoft.AspNetCore.Identity;

namespace Gamebook.Server.models
{
    public enum UserRole
    {
        Admin,
        User
    }

    public class User : IdentityUser
    {
       
        public UserRole Role { get; set; } = UserRole.User;// "Admin" or "User"
    }
}
