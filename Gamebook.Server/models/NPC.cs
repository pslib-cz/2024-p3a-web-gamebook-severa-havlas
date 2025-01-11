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

        [ForeignKey("Dialog")]
        public virtual ICollection<Dialog> Dialogs { get; set; } // Dialogs associated with the NPC

        [ForeignKey("GameBookAction")]
        public int? ActionId { get; set; }
        public virtual GameBookAction Action { get; set; }

        public int? Target { get; set; }
    }
}

