using System.ComponentModel.DataAnnotations;

namespace Gamebook.Server.models
{
    public class NPC
    {
        [Key]
        public int NPCId { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }
        public GameBookAction Action { get; set; } // Enum

        // Relationships
        
        public int? Target { get; set; }
    }
}
