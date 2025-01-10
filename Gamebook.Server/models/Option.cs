using System.ComponentModel.DataAnnotations.Schema;

namespace Gamebook.Server.models
{
    public class Option
    {
        public int OptionId { get; set; }
        public string Label { get; set; }
        public string Text { get; set; }

        [ForeignKey("NextAction")]
        public int? NextActionId { get; set; }

        // Navigation property
        public GameBookAction NextAction { get; set; }

    }
}
