using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gamebook.Server.models
{
    public class NPC
    {
        [Key]
        public int NPCId { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }

        public virtual ICollection<Dialog> Dialogs { get; set; } // No ForeignKey attribute here

        [ForeignKey("GameBookAction")]
        public int? ActionId { get; set; }
        public virtual GameBookAction Action { get; set; }

        // Explicit Room reference
        [ForeignKey("CurrentRoom")]
        public int? CurrentRoomId { get; set; }
        public virtual Room CurrentRoom { get; set; }

        [ForeignKey("RequiredRoom")]
        public int? RequiredRoomId { get; set; }
        public virtual Room RequiredRoom { get; set; }

        public int? Target { get; set; }
    }
}

