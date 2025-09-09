import { useContext, useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Eye,
  Clock,
  TrendingUp,
  Calendar,
  Download,
  AlertCircle,
  Loader2,
  Smartphone,
  MapPin,
} from "lucide-react";
import Header from "@/components/Header";
import { AuthContext } from "@/context/AuthContext";
import { analyticsApi } from "@/services/analyticsServices";
import {
  AnalyticsOverview,
  TopPage,
  TrafficSource,
  DeviceData, 
  LocationData, 
} from "@/types/analytics";

const Analytics = () => {
  const { user } = useContext(AuthContext);

  const [overview, setOverview] = useState<AnalyticsOverview>({
    totalUsers: 0,
    pageViews: 0,
    avgSessionDuration: "0m 0s",
    bounceRate: "0%",
  });
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]);
  const [deviceData, setDeviceData] = useState<DeviceData[]>([]);
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyticsData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const [
        overviewData,
        topPagesData,
        trafficData,
        devicesData,
        locationsData,
      ] = await Promise.all([
        analyticsApi.getOverview(),
        analyticsApi.getTopPages(undefined, undefined, 5),
        analyticsApi.getTrafficSources(),
        analyticsApi.getDeviceData(), 
        analyticsApi.getLocationData(undefined, undefined, 5),
      ]);

      setOverview(overviewData);
      setTopPages(topPagesData);
      setTrafficSources(trafficData);
      setDeviceData(devicesData); 
      setLocationData(locationsData); 
    } catch (err) {
      console.error("Erro ao carregar dados do analytics:", err);
      setError("Erro ao carregar dados do Analytics. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [user]);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    isLoading = false,
  }: {
    title: string;
    value: string;
    icon: any;
    trend?: string;
    isLoading?: boolean;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-muted-foreground">Carregando...</span>
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {trend && (
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                {trend} vs mês anterior
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <CardTitle className="text-2xl">Acesso Não Autorizado</CardTitle>
              <CardDescription>
                Você não tem permissão para acessar esta página.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Analytics Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Análise detalhada dos dados do Google Analytics
              </p>
            </div>
            <div className="flex items-center space-x-2 mt-4 sm:mt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchAnalyticsData()}
                disabled={loading}
              >
                <Calendar className="w-4 h-4 mr-2" />
                {loading ? "Atualizando..." : "Últimos 30 dias"}
              </Button>
             
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6">
            <Card className="border-destructive">
              <CardContent className="flex items-center space-x-2 p-4">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">{error}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchAnalyticsData}
                  className="ml-auto"
                >
                  Tentar novamente
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Usuários Totais"
            value={overview.totalUsers.toLocaleString()}
            icon={Users}
            
            isLoading={loading}
          />
          <StatCard
            title="Visualizações"
            value={overview.pageViews.toLocaleString()}
            icon={Eye}
            isLoading={loading}
          />
          <StatCard
            title="Duração Média"
            value={overview.avgSessionDuration}
            icon={Clock}
            isLoading={loading}
          />
          <StatCard
            title="Taxa de Rejeição (Visitantes que não iteragem com o site)"
            value={overview.bounceRate}
            icon={TrendingUp}
            isLoading={loading}
          />
        </div>

<Tabs defaultValue="pages" className="flex flex-col gap-4">          
          <TabsList className="grid h-auto w-full grid-cols-2 sm:grid-cols-4 mb-2">
            <TabsTrigger value="pages">Páginas Populares</TabsTrigger>
            <TabsTrigger value="traffic">Fontes de Tráfego</TabsTrigger>
            <TabsTrigger value="devices">Dispositivos</TabsTrigger>
            <TabsTrigger value="locations">Localização</TabsTrigger>
          </TabsList>

          <TabsContent value="pages">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Páginas Mais Visitadas</CardTitle>
                    <CardDescription>
                      Ranking das páginas com mais visualizações
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span className="text-muted-foreground">
                      Carregando páginas...
                    </span>
                  </div>
                ) : topPages.length === 0 ? (
                  <div className="flex items-center justify-center p-8">
                    <span className="text-muted-foreground">
                      Nenhum dado disponível
                    </span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topPages.map((page, index) => (
                      <div
                        key={page.path}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {page.path}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {page.users.toLocaleString()} usuários únicos
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-foreground">
                            {page.views.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            visualizações
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="traffic">
            <Card>
              <CardHeader>
                <CardTitle>Fontes de Tráfego</CardTitle>
                <CardDescription>
                  Origem dos visitantes do seu site
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span className="text-muted-foreground">
                      Carregando fontes de tráfego...
                    </span>
                  </div>
                ) : trafficSources.length === 0 ? (
                  <div className="flex items-center justify-center p-8">
                    <span className="text-muted-foreground">
                      Nenhum dado disponível
                    </span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {trafficSources.map((source) => (
                      <div
                        key={source.source}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                          <div>
                            <p className="font-medium text-foreground">
                              {source.source}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {source.users.toLocaleString()} usuários
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <Badge variant="secondary">
                              {source.percentage}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices">
            <Card>
              <CardHeader>
                <CardTitle>Acesso por Dispositivo</CardTitle>
                <CardDescription>
                  Usuários por categoria de dispositivo
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span className="text-muted-foreground">
                      Carregando dados de dispositivos...
                    </span>
                  </div>
                ) : deviceData.length === 0 ? (
                  <div className="flex items-center justify-center p-8">
                    <span className="text-muted-foreground">
                      Nenhum dado disponível
                    </span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deviceData.map((device) => (
                      <div
                        key={device.deviceCategory}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card"
                      >
                        <div className="flex items-center space-x-4">
                           <Smartphone className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground">
                              {device.deviceCategory}
                            </p>
                             <p className="text-sm text-muted-foreground">
                              {device.sessions.toLocaleString()} sessões
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                           <p className="text-lg font-semibold text-foreground">
                              {device.users.toLocaleString()}
                            </p>
                          <p className="text-sm text-muted-foreground">
                            usuários
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations">
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Localizações</CardTitle>
                <CardDescription>
                  Principais países por número de usuários
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span className="text-muted-foreground">
                      Carregando dados de localização...
                    </span>
                  </div>
                ) : locationData.length === 0 ? (
                  <div className="flex items-center justify-center p-8">
                    <span className="text-muted-foreground">
                      Nenhum dado disponível
                    </span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {locationData.map((loc) => (
                      <div
                        key={`${loc.country}-${loc.city}`}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card"
                      >
                        <div className="flex items-center space-x-4">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground">
                              {loc.country}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {loc.city !== '(not set)' ? loc.city : 'Cidade não especificada'}
                            </p>
                          </div>
                        </div>
                         <div className="text-right">
                           <p className="text-lg font-semibold text-foreground">
                              {loc.users.toLocaleString()}
                            </p>
                          <p className="text-sm text-muted-foreground">
                            usuários
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;