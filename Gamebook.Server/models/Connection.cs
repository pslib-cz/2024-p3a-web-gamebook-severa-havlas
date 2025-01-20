using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gamebook.Server.models
{
    public class Connection
    {
        [Key]
        public int ConnectionId { get; set; }

        public int FromRoomId { get; set; } 
        public virtual ConnectionPosition ConnectionPosition { get; set; }

        public int ToRoomId { get; set; } // ToRoom reference
        public virtual Room ToRoom { get; set; }

        public byte[]? Img { get; set; }
    }
}
