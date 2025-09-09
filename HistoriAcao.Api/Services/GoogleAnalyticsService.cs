using Google.Analytics.Data.V1Beta;
using Google.Apis.Auth.OAuth2;
using Grpc.Auth;

namespace HistoriAcao.Api.Services;

public class GoogleAnalyticsService
{
    private readonly string _propertyId;
    private readonly BetaAnalyticsDataClient _client;

    public GoogleAnalyticsService(IConfiguration configuration)
    {
        _propertyId = configuration["GoogleAnalytics:PropertyId"]!;

        var json = Environment.GetEnvironmentVariable("GOOGLE_CREDENTIALS_JSON");

        if (string.IsNullOrEmpty(json))
        {
            var path = configuration["GoogleAnalytics:CredentialsPath"];
            if (string.IsNullOrEmpty(path) || !File.Exists(path))
                throw new Exception("Credenciais do Google Analytics não encontradas.");

            json = File.ReadAllText(path);
        }

        var credential = GoogleCredential
            .FromJson(json)
            .CreateScoped(BetaAnalyticsDataClient.DefaultScopes);

        _client = new BetaAnalyticsDataClientBuilder
        {
            ChannelCredentials = credential.ToChannelCredentials()
        }.Build();
    }

    public async Task<RunReportResponse> GetActiveUsersAsync()
    {
        var request = new RunReportRequest
        {
            Property = $"properties/{_propertyId}",
            DateRanges = { new DateRange { StartDate = "7daysAgo", EndDate = "today" } },
            Metrics = { new Metric { Name = "activeUsers" } }
        };

        return await _client.RunReportAsync(request);
    }

    // Visão geral completa (totalUsers, pageViews, avgSessionDuration, bounceRate)
    public async Task<RunReportResponse> GetOverviewDataAsync(string startDate = "30daysAgo", string endDate = "today")
    {
        var request = new RunReportRequest
        {
            Property = $"properties/{_propertyId}",
            DateRanges = { new DateRange { StartDate = startDate, EndDate = endDate } },
            Metrics = {
                new Metric { Name = "totalUsers" },
                new Metric { Name = "screenPageViews" },
                new Metric { Name = "averageSessionDuration" },
                new Metric { Name = "bounceRate" }
            }
        };

        return await _client.RunReportAsync(request);
    }

    public async Task<RunReportResponse> GetTopPagesAsync(string startDate = "30daysAgo", string endDate = "today", int limit = 10)
    {
        var request = new RunReportRequest
        {
            Property = $"properties/{_propertyId}",
            DateRanges = { new DateRange { StartDate = startDate, EndDate = endDate } },
            Dimensions = { new Dimension { Name = "pagePath" } },
            Metrics = {
                new Metric { Name = "screenPageViews" },
                new Metric { Name = "totalUsers" }
            },
            OrderBys = {
                new OrderBy
                {
                    Metric = new OrderBy.Types.MetricOrderBy { MetricName = "screenPageViews" },
                    Desc = true
                }
            },
            Limit = limit
        };

        return await _client.RunReportAsync(request);
    }

    public async Task<RunReportResponse> GetTrafficSourcesAsync(string startDate = "30daysAgo", string endDate = "today")
    {
        var request = new RunReportRequest
        {
            Property = $"properties/{_propertyId}",
            DateRanges = { new DateRange { StartDate = startDate, EndDate = endDate } },
            Dimensions = { new Dimension { Name = "sessionSource" } },
            Metrics = {
                new Metric { Name = "totalUsers" },
                new Metric { Name = "sessions" }
            },
            OrderBys = {
                new OrderBy
                {
                    Metric = new OrderBy.Types.MetricOrderBy { MetricName = "totalUsers" },
                    Desc = true
                }
            }
        };

        return await _client.RunReportAsync(request);
    }

    public async Task<RunReportResponse> GetDeviceDataAsync(string startDate = "30daysAgo", string endDate = "today")
    {
        var request = new RunReportRequest
        {
            Property = $"properties/{_propertyId}",
            DateRanges = { new DateRange { StartDate = startDate, EndDate = endDate } },
            Dimensions = { new Dimension { Name = "deviceCategory" } },
            Metrics = {
                new Metric { Name = "totalUsers" },
                new Metric { Name = "sessions" },
                new Metric { Name = "screenPageViews" }
            },
            OrderBys = {
                new OrderBy
                {
                    Metric = new OrderBy.Types.MetricOrderBy { MetricName = "totalUsers" },
                    Desc = true
                }
            }
        };

        return await _client.RunReportAsync(request);
    }

    public async Task<RunReportResponse> GetLocationDataAsync(string startDate = "30daysAgo", string endDate = "today", int limit = 10)
    {
        var request = new RunReportRequest
        {
            Property = $"properties/{_propertyId}",
            DateRanges = { new DateRange { StartDate = startDate, EndDate = endDate } },
            Dimensions = {
                new Dimension { Name = "country" },
                new Dimension { Name = "city" }
            },
            Metrics = {
                new Metric { Name = "totalUsers" },
                new Metric { Name = "sessions" }
            },
            OrderBys = {
                new OrderBy
                {
                    Metric = new OrderBy.Types.MetricOrderBy { MetricName = "totalUsers" },
                    Desc = true
                }
            },
            Limit = limit
        };

        return await _client.RunReportAsync(request);
    }


    public async Task<RunReportResponse> GetTimeSeriesDataAsync(string startDate = "30daysAgo", string endDate = "today")
    {
        var request = new RunReportRequest
        {
            Property = $"properties/{_propertyId}",
            DateRanges = { new DateRange { StartDate = startDate, EndDate = endDate } },
            Dimensions = { new Dimension { Name = "date" } },
            Metrics = {
                new Metric { Name = "totalUsers" },
                new Metric { Name = "sessions" },
                new Metric { Name = "screenPageViews" }
            },
            OrderBys = {
                new OrderBy
                {
                    Dimension = new OrderBy.Types.DimensionOrderBy { DimensionName = "date" },
                    Desc = false
                }
            }
        };

        return await _client.RunReportAsync(request);
    }


    public async Task<RunReportResponse> GetEventsDataAsync(string startDate = "30daysAgo", string endDate = "today")
    {
        var request = new RunReportRequest
        {
            Property = $"properties/{_propertyId}",
            DateRanges = { new DateRange { StartDate = startDate, EndDate = endDate } },
            Dimensions = { new Dimension { Name = "eventName" } },
            Metrics = {
                new Metric { Name = "eventCount" },
                new Metric { Name = "totalUsers" }
            },
            OrderBys = {
                new OrderBy
                {
                    Metric = new OrderBy.Types.MetricOrderBy { MetricName = "eventCount" },
                    Desc = true
                }
            }
        };

        return await _client.RunReportAsync(request);
    }


    public async Task<RunReportResponse> GetDemographicsDataAsync(string startDate = "30daysAgo", string endDate = "today")
    {
        var request = new RunReportRequest
        {
            Property = $"properties/{_propertyId}",
            DateRanges = { new DateRange { StartDate = startDate, EndDate = endDate } },
            Dimensions = {
                new Dimension { Name = "userAgeBracket" },
                new Dimension { Name = "userGender" }
            },
            Metrics = {
                new Metric { Name = "totalUsers" }
            }
        };

        return await _client.RunReportAsync(request);
    }
}