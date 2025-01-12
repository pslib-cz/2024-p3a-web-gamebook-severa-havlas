using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gamebook.Server.models
{
    public class Room
    {
        [Key]
        public int RoomId { get; set; }

        public required byte[] Img { get; set; }
        public required string Name { get; set; }
        public required string Text { get; set; }

        public virtual ICollection<Item> RequiredItems { get; set; }
        public virtual ICollection<NPC> NPCs { get; set; }

        public virtual ICollection<ItemPosition> ItemPositions { get; set; }
    }



}
