namespace Gamebook.Server.models
{
    public class Option
    {
        public int OptionId { get; set; }
        public string Label { get; set; }
        public string Text { get; set; }

        public GameBookAction? Action { get; set; }
    }
}
