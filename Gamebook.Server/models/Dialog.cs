
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Gamebook.Server.models
{
    public class Dialog
    {
        [Key]
        public int DialogId { get; set; }

        [ForeignKey("NPC")]
        public int? NPCId { get; set; } // Optional reference to NPC
        public virtual NPC NPC { get; set; }

   

        [ForeignKey("GameBookAction")]
        public int? ActionId { get; set; } // Optional reference to Action
        public virtual GameBookAction GameBookAction { get; set; }

        public int? ParentDialogId { get; set; } // Recursive relationship
        public virtual Dialog ParentDialog { get; set; }

        public virtual ICollection<Dialog> ChildDialogs { get; set; } // Navigation property

        public string Text { get; set; } // Dialog text
        public string Label { get; set; }
    }
}
