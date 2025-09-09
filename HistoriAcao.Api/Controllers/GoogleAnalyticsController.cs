using HistoriAcao.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace HistoriAcao.Api.Controllers;

[ApiController]
[Route("api/analytics")]
public class GoogleAnalyticsController : ControllerBase
{
    private readonly GoogleAnalyticsService _googleAnalyticsService;

    public GoogleAnalyticsController(GoogleAnalyticsService googleAnalyticsService)
    {
        _googleAnalyticsService = googleAnalyticsService;
    }

    [HttpGet("active-users")]
    public async Task<IActionResult> GetActiveUsers()
    {
        try
        {
            var response = await _googleAnalyticsService.GetActiveUsersAsync();
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview([FromQuery] string? startDate = "30daysAgo", [FromQuery] string? endDate = "today")
    {
        try
        {
            var response = await _googleAnalyticsService.GetOverviewDataAsync(startDate, endDate);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("top-pages")]
    public async Task<IActionResult> GetTopPages(
        [FromQuery] string? startDate = "30daysAgo", 
        [FromQuery] string? endDate = "today",
        [FromQuery] int limit = 10)
    {
        try
        {
            var response = await _googleAnalyticsService.GetTopPagesAsync(startDate, endDate, limit);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("traffic-sources")]
    public async Task<IActionResult> GetTrafficSources([FromQuery] string? startDate = "30daysAgo", [FromQuery] string? endDate = "today")
    {
        try
        {
            var response = await _googleAnalyticsService.GetTrafficSourcesAsync(startDate, endDate);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("devices")]
    public async Task<IActionResult> GetDeviceData([FromQuery] string? startDate = "30daysAgo", [FromQuery] string? endDate = "today")
    {
        try
        {
            var response = await _googleAnalyticsService.GetDeviceDataAsync(startDate, endDate);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("locations")]
    public async Task<IActionResult> GetLocationData(
        [FromQuery] string? startDate = "30daysAgo", 
        [FromQuery] string? endDate = "today",
        [FromQuery] int limit = 10)
    {
        try
        {
            var response = await _googleAnalyticsService.GetLocationDataAsync(startDate, endDate, limit);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("timeseries")]
    public async Task<IActionResult> GetTimeSeriesData([FromQuery] string? startDate = "30daysAgo", [FromQuery] string? endDate = "today")
    {
        try
        {
            var response = await _googleAnalyticsService.GetTimeSeriesDataAsync(startDate, endDate);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("events")]
    public async Task<IActionResult> GetEventsData([FromQuery] string? startDate = "30daysAgo", [FromQuery] string? endDate = "today")
    {
        try
        {
            var response = await _googleAnalyticsService.GetEventsDataAsync(startDate, endDate);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("demographics")]
    public async Task<IActionResult> GetDemographicsData([FromQuery] string? startDate = "30daysAgo", [FromQuery] string? endDate = "today")
    {
        try
        {
            var response = await _googleAnalyticsService.GetDemographicsDataAsync(startDate, endDate);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardData([FromQuery] string? startDate = "30daysAgo", [FromQuery] string? endDate = "today")
    {
        try
        {
            var overviewTask = _googleAnalyticsService.GetOverviewDataAsync(startDate, endDate);
            var topPagesTask = _googleAnalyticsService.GetTopPagesAsync(startDate, endDate, 5);
            var trafficSourcesTask = _googleAnalyticsService.GetTrafficSourcesAsync(startDate, endDate);
            var devicesTask = _googleAnalyticsService.GetDeviceDataAsync(startDate, endDate);

            await Task.WhenAll(overviewTask, topPagesTask, trafficSourcesTask, devicesTask);

            var dashboardData = new
            {
                overview = await overviewTask,
                topPages = await topPagesTask,
                trafficSources = await trafficSourcesTask,
                devices = await devicesTask
            };

            return Ok(dashboardData);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}