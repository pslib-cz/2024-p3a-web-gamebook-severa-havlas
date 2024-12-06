using System.ComponentModel.DataAnnotations;

namespace Gamebook.Server.models
{
    public class Connection
    {
        [Key]
        public int ConnectionId { get; set; }

        public int FromRoomId { get; set; }
        public int ToRoomId { get; set; }
    }
}
