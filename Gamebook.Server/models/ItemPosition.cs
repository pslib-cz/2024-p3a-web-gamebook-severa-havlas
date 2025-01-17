using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Gamebook.Server.models
{
    public class ItemPosition
    {
        [Key]
        public int ItemPositionId { get; set; }

        [ForeignKey("Room")]
        public int RoomId { get; set; }
        public virtual Room Room { get; set; }

        public virtual Item Item { get; set; } // Reverse navigation property

        public int X { get; set; } // X position
        public int Y { get; set; } // Y position
    }
}
