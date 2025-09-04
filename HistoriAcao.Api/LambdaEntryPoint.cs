using Amazon.Lambda.AspNetCoreServer;

namespace HistoriAcao.Api;

/// <summary>
/// </summary>
public class LambdaEntryPoint : APIGatewayHttpApiV2ProxyFunction
{
    /// <summary>
    /// </summary>
    protected override void Init(IWebHostBuilder builder)
    {
        builder.UseStartup<Program>(); 
    }
}