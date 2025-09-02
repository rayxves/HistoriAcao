import { useContext } from "react";

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
} from "lucide-react";
import Header from "@/components/Header";
import { AuthContext } from "@/context/AuthContext";

const mockData = {
  overview: {
    totalUsers: 15420,
    pageViews: 45280,
    avgSessionDuration: "3m 42s",
    bounceRate: "42.3%",
  },
  topPages: [
    { path: "/", views: 12580, users: 8420 },
    { path: "/analytics", views: 8940, users: 5620 },
    { path: "/dashboard", views: 6720, users: 4180 },
    { path: "/login", views: 3890, users: 3890 },
    { path: "/about", views: 2150, users: 1830 },
  ],
  traffic: [
    { source: "Google", users: 8420, percentage: 54.6 },
    { source: "Direct", users: 3890, percentage: 25.2 },
    { source: "Social Media", users: 1850, percentage: 12.0 },
    { source: "Referral", users: 980, percentage: 6.4 },
    { source: "Email", users: 280, percentage: 1.8 },
  ],
};

const Analytics = () => {
  const { user } = useContext(AuthContext);

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
  }: {
    title: string;
    value: string;
    icon: any;
    trend?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground">
            <TrendingUp className="inline h-3 w-3 mr-1" />
            {trend} vs mês anterior
          </p>
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
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Últimos 30 dias
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Usuários Totais"
            value={mockData.overview.totalUsers.toLocaleString()}
            icon={Users}
            trend="+12.5%"
          />
          <StatCard
            title="Visualizações"
            value={mockData.overview.pageViews.toLocaleString()}
            icon={Eye}
            trend="+8.2%"
          />
          <StatCard
            title="Duração Média"
            value={mockData.overview.avgSessionDuration}
            icon={Clock}
            trend="+5.1%"
          />
          <StatCard
            title="Taxa de Rejeição"
            value={mockData.overview.bounceRate}
            icon={TrendingUp}
            trend="-2.3%"
          />
        </div>

        <Tabs defaultValue="pages" className="space-y-4">
          <TabsList className="grid w-full lg:w-[400px] grid-cols-2">
            <TabsTrigger value="pages">Páginas Populares</TabsTrigger>
            <TabsTrigger value="traffic">Fontes de Tráfego</TabsTrigger>
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
                <div className="space-y-4">
                  {mockData.topPages.map((page, index) => (
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
                <div className="space-y-4">
                  {mockData.traffic.map((source) => (
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
