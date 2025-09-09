import {
  AnalyticsOverview,
  TopPage,
  TrafficSource,
  DeviceData,
  LocationData,
  TimeSeriesData,
  EventData,
  DemographicData,
} from "@/types/analytics";
import api from "./api";

const parseGoogleAnalyticsResponse = (response: any) => {
  if (!response.rows || response.rows.length === 0) {
    return [];
  }

  return response.rows.map((row: any) => {
    const result: any = {};

    if (response.dimensionHeaders) {
      response.dimensionHeaders.forEach((header: any, index: number) => {
        result[header.name] = row.dimensionValues[index].value;
      });
    }

    if (response.metricHeaders) {
      response.metricHeaders.forEach((header: any, index: number) => {
        result[header.name] = parseFloat(row.metricValues[index].value) || 0;
      });
    }

    return result;
  });
};

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
};

class AnalyticsApiService {
  async getOverview(
    startDate: string = "30daysAgo",
    endDate: string = "today"
  ): Promise<AnalyticsOverview> {
    try {
      const response = await api.get("/analytics/overview", {
        params: { startDate, endDate },
      });

      const data = parseGoogleAnalyticsResponse(response.data);

      if (data.length === 0) {
        return {
          totalUsers: 0,
          pageViews: 0,
          avgSessionDuration: "0m 0s",
          bounceRate: "0%",
        };
      }

      const row = data[0];

      return {
        totalUsers: row.totalUsers || 0,
        pageViews: row.screenPageViews || 0,
        avgSessionDuration: formatDuration(row.averageSessionDuration || 0),
        bounceRate: `${(row.bounceRate * 100).toFixed(1)}%`,
      };
    } catch (error) {
      console.error("Erro ao buscar dados de overview:", error);
      return {
        totalUsers: 0,
        pageViews: 0,
        avgSessionDuration: "0m 0s",
        bounceRate: "0%",
      };
    }
  }

  async getTopPages(
    startDate: string = "30daysAgo",
    endDate: string = "today",
    limit: number = 10
  ): Promise<TopPage[]> {
    try {
      const response = await api.get("/analytics/top-pages", {
        params: { startDate, endDate, limit },
      });

      const data = parseGoogleAnalyticsResponse(response.data);

      return data.map((row: any) => ({
        path: row.pagePath || "/",
        views: row.screenPageViews || 0,
        users: row.totalUsers || 0,
      }));
    } catch (error) {
      console.error("Erro ao buscar páginas populares:", error);
      return [];
    }
  }

  async getTrafficSources(
    startDate: string = "30daysAgo",
    endDate: string = "today"
  ): Promise<TrafficSource[]> {
    try {
      const response = await api.get("/analytics/traffic-sources", {
        params: { startDate, endDate },
      });

      const data = parseGoogleAnalyticsResponse(response.data);

      const totalUsers = data.reduce(
        (sum: number, row: any) => sum + (row.totalUsers || 0),
        0
      );

      return data.map((row: any) => {
        const users = row.totalUsers || 0;
        const percentage = totalUsers > 0 ? (users / totalUsers) * 100 : 0;

        return {
          source: this.formatSourceName(row.sessionSource || "Unknown"),
          users,
          percentage: parseFloat(percentage.toFixed(1)),
        };
      });
    } catch (error) {
      console.error("Erro ao buscar fontes de tráfego:", error);
      return [];
    }
  }

  async getDeviceData(
    startDate: string = "30daysAgo",
    endDate: string = "today"
  ): Promise<DeviceData[]> {
    try {
      const response = await api.get("/analytics/devices", {
        params: { startDate, endDate },
      });

      const data = parseGoogleAnalyticsResponse(response.data);

      return data.map((row: any) => ({
        deviceCategory: row.deviceCategory || "Unknown",
        users: row.totalUsers || 0,
        sessions: row.sessions || 0,
        pageViews: row.screenPageViews || 0,
      }));
    } catch (error) {
      console.error("Erro ao buscar dados de dispositivos:", error);
      return [];
    }
  }

  async getLocationData(
    startDate: string = "30daysAgo",
    endDate: string = "today",
    limit: number = 10
  ): Promise<LocationData[]> {
    try {
      const response = await api.get("/analytics/locations", {
        params: { startDate, endDate, limit },
      });

      const data = parseGoogleAnalyticsResponse(response.data);

      return data.map((row: any) => ({
        country: row.country || "Unknown",
        city: row.city || "Unknown",
        users: row.totalUsers || 0,
        sessions: row.sessions || 0,
      }));
    } catch (error) {
      console.error("Erro ao buscar dados de localização:", error);
      return [];
    }
  }

  async getTimeSeriesData(
    startDate: string = "30daysAgo",
    endDate: string = "today"
  ): Promise<TimeSeriesData[]> {
    try {
      const response = await api.get("/analytics/timeseries", {
        params: { startDate, endDate },
      });

      const data = parseGoogleAnalyticsResponse(response.data);

      return data.map((row: any) => ({
        date: row.date || "",
        users: row.totalUsers || 0,
        sessions: row.sessions || 0,
        pageViews: row.screenPageViews || 0,
      }));
    } catch (error) {
      console.error("Erro ao buscar dados de série temporal:", error);
      return [];
    }
  }

  async getEventsData(
    startDate: string = "30daysAgo",
    endDate: string = "today"
  ): Promise<EventData[]> {
    try {
      const response = await api.get("/analytics/events", {
        params: { startDate, endDate },
      });

      const data = parseGoogleAnalyticsResponse(response.data);

      return data.map((row: any) => ({
        eventName: row.eventName || "Unknown",
        eventCount: row.eventCount || 0,
        users: row.totalUsers || 0,
      }));
    } catch (error) {
      console.error("Erro ao buscar dados de eventos:", error);
      return [];
    }
  }

  async getDemographicsData(
    startDate: string = "30daysAgo",
    endDate: string = "today"
  ): Promise<DemographicData[]> {
    try {
      const response = await api.get("/analytics/demographics", {
        params: { startDate, endDate },
      });

      const data = parseGoogleAnalyticsResponse(response.data);

      return data.map((row: any) => ({
        ageBracket: row.userAgeBracket || "Unknown",
        gender: row.userGender || "Unknown",
        users: row.totalUsers || 0,
      }));
    } catch (error) {
      console.error("Erro ao buscar dados demográficos:", error);
      return [];
    }
  }

  async getDashboardData(
    startDate: string = "30daysAgo",
    endDate: string = "today"
  ) {
    try {
      const response = await api.get("/analytics/dashboard", {
        params: { startDate, endDate },
      });

      return {
        overview: parseGoogleAnalyticsResponse(response.data.overview),
        topPages: parseGoogleAnalyticsResponse(response.data.topPages),
        trafficSources: parseGoogleAnalyticsResponse(
          response.data.trafficSources
        ),
        devices: parseGoogleAnalyticsResponse(response.data.devices),
      };
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
      throw error;
    }
  }

  private formatSourceName(source: string): string {
    const sourceMap: { [key: string]: string } = {
      google: "Google",
      direct: "Tráfego Direto (navegador, links...)",
      "(direct)": "Tráfego Direto (navegador, links...)",
      "not set": "Não Identificado",
      "(not set)": "Não Identificado",
      "facebook.com": "Facebook",
      "instagram.com": "Instagram",
      "twitter.com": "Twitter",
      "linkedin.com": "LinkedIn",
      "youtube.com": "YouTube",
      organic: "Google",
      referral: "Referral",
      email: "Email",
      social: "Social Media",
    };

    const lowerSource = source.toLowerCase();
    return sourceMap[lowerSource] || source;
  }
}

export const analyticsApi = new AnalyticsApiService();
