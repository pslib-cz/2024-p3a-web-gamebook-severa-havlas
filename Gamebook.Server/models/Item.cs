using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gamebook.Server.models
{
    public class Item
    {
        [Key]
        public int ItemId { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }

        [ForeignKey("GameBookAction")]
        public int? GameBookActionId { get; set; } // Optional action association
        public virtual GameBookAction GameBookAction { get; set; }

        public int? Target { get; set; } // Nullable target reference
    }
}
