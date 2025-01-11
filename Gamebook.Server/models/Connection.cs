using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Gamebook.Server.models
{
    public class Connection
    {
        [Key]
        public int ConnectionId { get; set; }

        [ForeignKey("FromRoom")]
        public int FromRoomId { get; set; }
        public virtual Room FromRoom { get; set; }

        [ForeignKey("ToRoom")]
        public int ToRoomId { get; set; }
        public virtual Room ToRoom { get; set; }
    }
}
