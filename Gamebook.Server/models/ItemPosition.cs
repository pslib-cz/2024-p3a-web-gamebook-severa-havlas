using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Gamebook.Server.models
{
    public class ItemPosition
    {
        [Key]
        public int ItemPositionId { get; set; }

        [ForeignKey("Room")]
        public int RoomId { get; set; } // Reference to the room
        public virtual Room Room { get; set; }

        [ForeignKey("Item")]
        public int ItemId { get; set; } // Reference to the item
        public virtual Item Item { get; set; }

        public int X { get; set; } // X position
        public int Y { get; set; } // Y position
    }
}
