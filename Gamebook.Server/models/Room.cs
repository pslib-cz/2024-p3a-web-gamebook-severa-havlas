using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gamebook.Server.models
{
    public class Room
    {
        [Key]
        public int RoomId { get; set; }

        public required byte[]  Img { get; set; } // Image in byte array
        public required string Name { get; set; } // Name
        public required string Text { get; set; }  // Description/Text

        // Navigation properties
        public virtual ICollection<Item> Items { get; set; }
        public virtual ICollection<NPC> NPCs { get; set; }
        public virtual ICollection<Room> Connections { get; set; }
        public virtual ICollection<ItemPosition> ItemPositions { get; set; } // Positions of items

        // Requirements
        public virtual ICollection<Item> RequiredItems { get; set; }
        public virtual ICollection<NPC> RequiredNPCs { get; set; }
        public virtual ICollection<Action> RequiredActions { get; set; }

       
    }

  

}
