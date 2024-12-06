using System.ComponentModel.DataAnnotations;

namespace Gamebook.Server.models
{
    public class Item
    {
        [Key]
        public int ItemId { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }
        public ActionType Action { get; set; } // Enum
        public int? Target { get; set; } // Nullable target reference
    }
}
