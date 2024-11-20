namespace FiveBoltAuto.Web.Models;

public class PhotoSize {
    public PhotoSize() {}
    public PhotoSize(int Width, int Breakpoint) {
        this.Width = Width;
        this.Breakpoint = Breakpoint;
    }
    public int Width { get; set; }
    public int Breakpoint { get; set;}
}