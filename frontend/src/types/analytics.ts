export interface AnalyticsOverview {
  totalUsers: number;
  pageViews: number;
  avgSessionDuration: string;
  bounceRate: string;
}

export interface TopPage {
  path: string;
  views: number;
  users: number;
}

export interface TrafficSource {
  source: string;
  users: number;
  percentage: number;
}

export interface DeviceData {
  deviceCategory: string;
  users: number;
  sessions: number;
  pageViews: number;
}

export interface LocationData {
  country: string;
  city: string;
  users: number;
  sessions: number;
}

export interface TimeSeriesData {
  date: string;
  users: number;
  sessions: number;
  pageViews: number;
}

export interface EventData {
  eventName: string;
  eventCount: number;
  users: number;
}

export interface DemographicData {
  ageBracket: string;
  gender: string;
  users: number;
}