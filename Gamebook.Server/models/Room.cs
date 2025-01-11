using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gamebook.Server.models
{
    public class Room
    {
        [Key]
        public int RoomId { get; set; }

        public required byte[] Img { get; set; } // Image of the room
        public required string Name { get; set; } // Room name
        public required string Text { get; set; } // Room description

        // Navigation properties
        public virtual ICollection<Item> Items { get; set; }
        public virtual ICollection<NPC> NPCs { get; set; }
        public virtual ICollection<ItemPosition> ItemPositions { get; set; }
        public virtual ICollection<Dialog> Dialogs { get; set; } // Dialogs in the room

        // Connections
        public virtual ICollection<Connection> ConnectionsFrom { get; set; } // Connections originating from this room
        public virtual ICollection<Connection> ConnectionsTo { get; set; }   // Connections leading to this room

        // Requirements
        public virtual ICollection<Item> RequiredItems { get; set; }
        public virtual ICollection<NPC> RequiredNPCs { get; set; }
        public virtual ICollection<GameBookAction> RequiredActions { get; set; }

        public virtual ICollection<GameBookAction> GameBookActions { get; set; }
    }



}
