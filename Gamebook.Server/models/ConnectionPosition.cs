using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Gamebook.Server.models
{
    public class ConnectionPosition
    {

        [Key]
        public int ConnectionPositionId { get; set; }
/*
        public int RoomId { get; set; } // Reference to the room
        public virtual Room Room { get; set; }

        public int FromRoomId { get; set; } // Reference to the Connection
        public virtual Connection Connection { get; set; }
*/
        public int X { get; set; } // X position
        public int Y { get; set; } // Y position

    }
}
