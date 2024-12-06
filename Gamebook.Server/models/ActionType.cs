using System.ComponentModel.DataAnnotations;

namespace Gamebook.Server.models
{
    public class ActionType
    {
        [Key]
        public int ActionTypeId { get; set; }
        public string Name { get; set; } // Action type name, e.g., "Type1", "Type2"
    }

   
}
