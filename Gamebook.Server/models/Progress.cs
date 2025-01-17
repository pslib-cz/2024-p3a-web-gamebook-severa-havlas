using System.ComponentModel.DataAnnotations.Schema;

namespace Gamebook.Server.models
{
    public class Progress
    {
        public int ProgressId { get; set; }
        public string Name { get; set; }
        public int Value { get; set; }

        [ForeignKey("CurrentRoom")]
        public int? CurrentRoomId { get; set; }
        public virtual Room CurrentRoom { get; set; }
    }
}
