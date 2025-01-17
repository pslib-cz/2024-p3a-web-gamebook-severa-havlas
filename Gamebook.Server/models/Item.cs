using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gamebook.Server.models
{
    public class Item
    {
        [Key]
        public int ItemId { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }

        [ForeignKey("GameBookAction")]
        public int? GameBookActionId { get; set; }
        public virtual GameBookAction GameBookAction { get; set; }

        [ForeignKey("ItemPosition")]
        public int ItemPositionId { get; set; } // Foreign key for the one-to-one relationship
        public virtual ItemPosition ItemPosition { get; set; }

        public byte[]? Img { get; set; }

        [ForeignKey("RequiredRoomId")]
        public int? RequiredRoomId { get; set; }
        public virtual Room RequiredRoom { get; set; }

        public int? Target { get; set; }
        public int? Price { get; set; }
    }
}
