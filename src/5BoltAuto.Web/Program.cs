using AspNetStatic;
using Microsoft.AspNetCore.StaticFiles;
using Sidio.Sitemap.AspNetCore;
using Sidio.Sitemap.Blazor;
using Sidio.Sitemap.Core.Services;
using FiveBoltAuto.Web.Components;
using System.Globalization;
using FiveBoltAuto.Web.Helpers;

const string RUN_MODE_SSG = "ssg";
const string SSG_DEST_ROOT_FOLDER_NAME = "out";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents();
builder.Services
    .AddHttpContextAccessor()
    .AddDefaultSitemapServices<HttpContextBaseUrlProvider>();

string runMode = Environment.GetEnvironmentVariable("RUN_MODE") ?? "ssr";

if (runMode == RUN_MODE_SSG) {
    builder.Services.AddSingleton<IStaticResourcesInfoProvider>(provider =>
    {
        return StaticWebSiteHelper.GetStaticResourcesInfo(builder.Environment.WebRootPath);
    });
    builder.Services.AddScoped<IDomainProvider, ConfigDomainProvider>();
} else {
    builder.Services.AddHttpContextAccessor();
    builder.Services.AddScoped<IDomainProvider, HttpRequestDomainProvider>();
}

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
}

// ContentType mappings
var provider = new FileExtensionContentTypeProvider();
provider.Mappings[".avif"] = "image/avif";

app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        // Cache static files for 1 year
        ctx.Context.Response.Headers.Append("Cache-Control", "public,max-age=31536000");
        ctx.Context.Response.Headers.Append("Expires", DateTime.UtcNow.AddDays(60).ToString("R", CultureInfo.InvariantCulture));
    },
    ContentTypeProvider = provider
});
app.UseAntiforgery();

app.UseSitemap();
app.MapRazorComponents<App>();

if (runMode == RUN_MODE_SSG) {
    var SsgOutputPath = Path.Combine(
        "../../", SSG_DEST_ROOT_FOLDER_NAME);

    Directory.CreateDirectory(SsgOutputPath);

    app.GenerateStaticContent(
        SsgOutputPath,
        exitWhenDone: true);
}

app.Run();