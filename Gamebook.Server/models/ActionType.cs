using System.ComponentModel.DataAnnotations;

namespace Gamebook.Server.models
{
    public class ActionType
    {
        [Key]
        public int ActionTypeId { get; set; }
        public string Name { get; set; } // Name of the action type

        // Navigation property
        public virtual ICollection<GameBookAction> GameBookActions { get; set; }
    }


}
