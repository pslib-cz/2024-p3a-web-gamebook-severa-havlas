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

        [ForeignKey("Option")]
        public ICollection<int> OptionsIDs { get; set; }
        public int? ReqItem { get; set; }
        public int? ReqProgress { get; set; }
        public int? ReqNPC { get; set; }
        public string Description { get; set; }
        public int? ReqAction { get; set; }
    }

}
