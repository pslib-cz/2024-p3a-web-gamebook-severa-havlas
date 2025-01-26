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

        public string MiniGameData { get; set; } // Data or configuration for the mini-game

        [ForeignKey("RequiredConnection")]
        public int? RequiredConnectionId { get; set; }
        public virtual Connection RequiredConnection { get; set; }

        [ForeignKey("CurrentRoom")]
        public int? CurrentRoomId { get; set; }
        public virtual Room CurrentRoom { get; set; }

        // Navigation property
        public virtual ICollection<Dialog>? Dialogs { get; set; }
    }

}
