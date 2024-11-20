namespace FiveBoltAuto.Web.Models;

public class PictureModel {
    public PhotoSize[] Sizes { get; set; }
    public required string ImageUrl { get; set; }
    public required string AltText { get; set; }
    public string? CssClass { get; set; } = "";
    public required int Width { get; set; }
}