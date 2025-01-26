using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gamebook.Server.models
{
    public class Connection
    {
        [Key]
        public int ConnectionId { get; set; }

        public virtual ICollection<Item> RequiredItems { get; set; }
        public virtual ICollection<NPC> RequiredNPCs { get; set; }


        public virtual ICollection<Progress> RequiredProgress { get; set; }

        public int FromRoomId { get; set; } // Reference to the room
        public virtual Room Room { get; set; }

        public int ToRoomId { get; set; } // ToRoom reference
        public virtual Room ToRoom { get; set; }

        public int? X { get; set; } // X position
        public int? Y { get; set; } // Y position

        public byte[]? Img { get; set; }
    }
}
