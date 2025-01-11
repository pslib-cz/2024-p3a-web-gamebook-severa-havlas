using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Gamebook.Server.models
{

    public class GameBookAction
    {
        [Key]
        public int ActionId { get; set; }

        [ForeignKey("ActionType")]
        public int ActionTypeId { get; set; }
        public virtual ActionType ActionType { get; set; }

        public int? ReqItem { get; set; }
        public int? ReqProgress { get; set; }
        public int? ReqNPC { get; set; }
        public string Description { get; set; }
        public int? ReqAction { get; set; }

        // Mini-game properties
        public string MiniGameType { get; set; } // Type of mini-game (e.g., "Puzzle", "Quiz")
        public string MiniGameData { get; set; } // Data or configuration for the mini-game

        // Navigation property
        public virtual ICollection<Dialog> Dialogs { get; set; }
    }

}
