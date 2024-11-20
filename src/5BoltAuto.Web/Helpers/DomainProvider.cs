namespace FiveBoltAuto.Web.Helpers;

public interface IDomainProvider
{
    public string Domain { get; }
    public Uri DomainUri { get; }
    public UriBuilder BaseUriBuilder { get; }
}

public class HttpRequestDomainProvider : IDomainProvider
{
    private IHttpContextAccessor _httpContextAccessor;

    public string Domain
    {
        get
        {
            return _httpContextAccessor.HttpContext == null ? "" :
            _httpContextAccessor.HttpContext.Request.Scheme +
            "://" + _httpContextAccessor.HttpContext.Request.Host.Value;
        }
    }

    public Uri DomainUri
    {
        get
        {
            return new Uri(Domain);
        }
    }

    public UriBuilder BaseUriBuilder
    {
        get
        {
            var builder = new UriBuilder
            {
                Scheme = _httpContextAccessor.HttpContext.Request.Scheme,
                Host = _httpContextAccessor.HttpContext.Request.Host.Host
            };
            var port = _httpContextAccessor.HttpContext.Request.Host.Port;
            if (port.HasValue && (port != 80 && port != 443))
            {
                builder.Port = port.Value;
            }
            return builder;
        }
    }

    public HttpRequestDomainProvider(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

}

public class ConfigDomainProvider : IDomainProvider
{
    public string Domain
    {
        get
        {
            return Environment.GetEnvironmentVariable("HOST_URL") ?? "";
        }
    }

    public Uri DomainUri
    {
        get
        {
            return new Uri(Domain);
        }
    }

    public UriBuilder BaseUriBuilder
    {
        get
        {
            // TODO get scheme, host and port from parsing HOST_URL in config
            var builder = new UriBuilder
            {
                Scheme = "https",
                Host = "www.5boltauto.ca"
            };
            return builder;
        }
    }
}