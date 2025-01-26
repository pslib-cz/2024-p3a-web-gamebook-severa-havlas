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



        public virtual ICollection<Connection> ConnectionsFrom { get; set; } // Connections originating from this room
        public virtual ICollection<Connection> ConnectionsTo { get; set; }   // Connections leading to this room


        public virtual ICollection<NPC> NPCs { get; set; }
        public virtual ICollection<ItemPosition> Items { get; set; }
        public virtual ICollection<GameBookAction> TriggerActions { get; set; }


        
       
    }


  

   

  
}
