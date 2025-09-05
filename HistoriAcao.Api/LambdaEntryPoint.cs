using Amazon.Lambda.AspNetCoreServer;

namespace HistoriAcao.Api;

/// <summary>
/// This class extends from APIGatewayProxyFunction which contains the method FunctionHandlerAsync which is the 
/// actual Lambda function entry point. The Lambda handler field should be set to
/// </summary>
public class LambdaEntryPoint : APIGatewayHttpApiV2ProxyFunction
{
    /// <summary>
    /// The builder has configuration, logging and Amazon API Gateway already configured.
    /// </summary>
    /// <param name="builder"></param>
    protected override void Init(IWebHostBuilder builder)
    {
        builder
            .UseStartup<Startup>();
    }
}