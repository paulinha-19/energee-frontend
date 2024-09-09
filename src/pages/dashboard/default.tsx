import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { People, Receipt, Moneys, MoneyRecive, MoneyRemove } from 'iconsax-react';
import {
  getChartProductionData,
  getChartFinancialData,
  getClientData,
  getDistributorData,
  postReferenceClientData,
  getChartProductionDataAdmin,
  getChartFinancialDataAdmin,
  getInfoDashboard
} from 'services';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Client, Distributor, FinancialDataAdmin, FinancialDataClient, ProductionDataAdmin, ProductionDataClient } from 'interfaces';
import FinancialChart from 'sections/widget/chart/FinancialChart';
import ChartCard from 'sections/widget/chart/ChartCard';
import ProductionChart from 'sections/widget/chart/ProductionChart';
import { Button, MenuItem, Select, FormControl, Box, InputLabel } from '@mui/material';
import useAuth from 'hooks/useAuth';

export default function DashboardDefault() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedDistribuidora, setSelectedDistribuidora] = useState<string | null>(null);
  const [selectedReferencia, setSelectedReferencia] = useState<string | null>(null);
  const page = 0;
  const rowsPerPage = 10;

  const { data: clients }: any = useQuery({
    queryKey: ['clients', page, rowsPerPage],
    queryFn: () => getClientData(page + 1, rowsPerPage),
    enabled: user?.role === 'AD'
  });

  const { data: distributor, isLoading: isLoadingDistributor } = useQuery({
    queryKey: ['distribuidoras', selectedClient],
    queryFn: () => getDistributorData(user?.role === 'AD' ? selectedClient! : user?.id?.toString()!),
    enabled: user?.role !== 'AD' || !!selectedClient
  });

  const { data: references, isLoading: isLoadingReferences } = useQuery({
    queryKey: ['referencias', selectedClient, selectedDistribuidora],
    queryFn: () =>
      postReferenceClientData(user?.role === 'AD' ? selectedClient : user?.id?.toString() ?? null, selectedDistribuidora ?? null),
    enabled: !!selectedDistribuidora
  });

  // Separate queries for Admin and Client roles for production data
  const productionDataAdminQuery = useQuery({
    queryKey: ['data-chart-production-admin', selectedDistribuidora, selectedReferencia],
    queryFn: () => getChartProductionDataAdmin(selectedReferencia, selectedClient, selectedDistribuidora),
    enabled: user?.role === 'AD'
  });

  const productionDataClientQuery = useQuery({
    queryKey: ['data-chart-production-client', selectedDistribuidora, selectedReferencia],
    queryFn: () => getChartProductionData(selectedDistribuidora, selectedReferencia),
    enabled: user?.role !== 'AD'
  });

  // Separate queries for Admin and Client roles for financial data
  const financialDataAdminQuery = useQuery({
    queryKey: ['data-chart-financial-admin', selectedDistribuidora, selectedReferencia],
    queryFn: () => getChartFinancialDataAdmin(selectedReferencia, selectedClient, selectedDistribuidora),
    enabled: user?.role === 'AD'
  });

  const financialDataClientQuery = useQuery({
    queryKey: ['data-chart-financial-client', selectedDistribuidora, selectedReferencia],
    queryFn: () => getChartFinancialData(selectedDistribuidora, selectedReferencia),
    enabled: user?.role !== 'AD'
  });

  const handleFilter = () => {
    if ((!selectedClient && user?.role === 'AD') || !selectedDistribuidora || !selectedReferencia) {
      alert('Todos os campos são obrigatórios!');
      return;
    }
    queryClient.invalidateQueries({ queryKey: ['data-chart-production-admin'] });
    queryClient.invalidateQueries({ queryKey: ['data-chart-production-client'] });
    queryClient.invalidateQueries({ queryKey: ['data-chart-financial-admin'] });
    queryClient.invalidateQueries({ queryKey: ['data-chart-financial-client'] });
    queryClient.invalidateQueries({ queryKey: ['info-dashboard'] });
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid item xs={12}>
        <Typography variant="h1">Dashboard</Typography>
      </Grid>

      <Grid item xs={12}>
        <Box
          sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, backgroundColor: theme.palette.background.paper, borderRadius: 1, padding: 2 }}
        >
          {user?.role === 'AD' && (
            <FormControl size="small" sx={{ flex: 1, minWidth: 200 }}>
              <InputLabel>Selecione o Cliente</InputLabel>
              <Select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)} displayEmpty>
                {clients?.items.map((client: Client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <FormControl size="small" sx={{ flex: 1, minWidth: 200 }}>
            <InputLabel>{isLoadingDistributor ? 'Carregando os dados' : 'Selecione a Distribuidora'}</InputLabel>
            <Select
              value={selectedDistribuidora}
              onChange={(e) => setSelectedDistribuidora(e.target.value)}
              displayEmpty
              disabled={user?.role === 'AD' && !selectedClient}
            >
              {distributor?.items.map((distribuidora: Distributor) => (
                <MenuItem key={distribuidora.id} value={distribuidora.id}>
                  {distribuidora.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ flex: 1, minWidth: 200 }}>
            <InputLabel>{isLoadingReferences ? 'Carregando os dados' : 'Selecione a Referência'}</InputLabel>
            <Select
              value={selectedReferencia}
              onChange={(e) => setSelectedReferencia(e.target.value)}
              displayEmpty
              disabled={!selectedDistribuidora}
            >
              {references?.map((referencia: string, index: number) => (
                <MenuItem key={index} value={referencia}>
                  {referencia}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button onClick={handleFilter} variant="contained" color="primary">
            Filtrar
          </Button>
        </Box>
      </Grid>

      <Grid item xs={12} md={6}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ChartCard title="Geradores" icon={<People color={theme.palette.primary.main} />}>
              <Typography variant="h2">13</Typography>
            </ChartCard>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
            <ChartCard title="Crédito Recebido" icon={<MoneyRecive color={theme.palette.primary.main} />}>
              <Typography variant="h4" color="success.main">
                R$ 93.602,80
              </Typography>
            </ChartCard>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
            <ChartCard title="Desconto do Cliente" icon={<MoneyRemove color={theme.palette.primary.main} />}>
              <Typography variant="h4" color="error.main">
                R$ 16.508,14
              </Typography>
            </ChartCard>
          </Grid>
          <Grid item xs={12}>
            <ChartCard title="Gráfico de Produção">
              {user?.role === 'AD' ? (
                <ProductionChart
                  data={productionDataAdminQuery.data as ProductionDataAdmin}
                  error={productionDataAdminQuery.error}
                  isLoading={productionDataAdminQuery.isLoading}
                  isAdmin={true}
                />
              ) : (
                <ProductionChart
                  data={productionDataClientQuery.data as ProductionDataClient}
                  error={productionDataClientQuery.error}
                  isLoading={productionDataClientQuery.isLoading}
                  isAdmin={false}
                />
              )}
            </ChartCard>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} md={6}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ChartCard title="Consumidores" icon={<People color={theme.palette.primary.main} />}>
              <Typography variant="h2">141</Typography>
            </ChartCard>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
            <ChartCard title="Faturas dos Geradores" icon={<Receipt color={theme.palette.primary.main} />}>
              <Typography variant="h4">R$ 2.903,20</Typography>
            </ChartCard>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
            <ChartCard title="Total a Pagar" icon={<Moneys color={theme.palette.primary.main} />}>
              <Typography variant="h4">R$ 77.094,66</Typography>
            </ChartCard>
          </Grid>
          <Grid item xs={12}>
            <ChartCard title="Gráfico Financeiro">
              {user?.role === 'AD' ? (
                <FinancialChart
                  data={financialDataAdminQuery.data as FinancialDataAdmin}
                  error={financialDataAdminQuery.error}
                  isLoading={financialDataAdminQuery.isLoading}
                  isAdmin={true}
                />
              ) : (
                <FinancialChart
                  data={financialDataClientQuery.data as FinancialDataClient}
                  error={financialDataClientQuery.error}
                  isLoading={financialDataClientQuery.isLoading}
                  isAdmin={false}
                />
              )}
            </ChartCard>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
