import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import ReactApexChart, { Props as ChartProps } from 'react-apexcharts';
import { ThemeMode } from 'config';
import { ProductionDataAdmin, ProductionDataClient } from 'interfaces';

interface ProductionChartProps {
  data: ProductionDataAdmin | ProductionDataClient | undefined;
  error: any;
  isLoading: boolean;
  isAdmin: boolean;
}

const areaChartOptions = {
  chart: {
    type: 'area',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 1
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      type: 'vertical',
      inverseColors: false,
      opacityFrom: 0.5,
      opacityTo: 0
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '45%',
      borderRadius: 4
    }
  },
  grid: {
    strokeDashArray: 4
  }
};

export default function ProductionChart({ data, error, isLoading, isAdmin }: ProductionChartProps) {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState<ChartProps>(areaChartOptions);
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([]);

  useEffect(() => {
    if (data) {
      const categories = data.labels;
      let seriesData: { name: string; data: number[] }[] = [];

      if (isAdmin && 'geracao' in data && 'consumo' in data) {
        const geracaoData = data.geracao.map((value: string) => parseFloat(value.replace('.', '').replace(',', '.')));
        const consumoData = data.consumo.map((value: string) => parseFloat(value.replace('.', '').replace(',', '.')));
        seriesData = [
          { name: 'Geração', data: geracaoData },
          { name: 'Consumo', data: consumoData }
        ];
      } else if (!isAdmin && 'consumo_mensal' in data) {
        const chartData = data.consumo_mensal.map((value: string) => parseFloat(value));
        seriesData = [{ name: 'Consumo mensal', data: chartData }];
      }

      setOptions((prevState) => ({
        ...prevState,
        xaxis: {
          categories,
          labels: {
            style: {
              colors: Array(categories.length).fill(secondary)
            }
          },
          axisBorder: {
            show: false,
            color: line
          },
          axisTicks: {
            show: false
          },
          tickAmount: categories.length - 1
        },
        yaxis: {
          labels: {
            style: {
              colors: [secondary]
            }
          }
        },
        grid: {
          borderColor: line
        },
        theme: {
          mode: mode === ThemeMode.DARK ? 'dark' : 'light'
        }
      }));

      setSeries(seriesData);
    }
  }, [data, mode, secondary, line, isAdmin]);

  if (isLoading) return <div style={{ textAlign: 'center' }}>Carregando o gráfico...</div>;
  if (error) return <div>Erro ao carregar dados: {error.message}</div>;

  return <ReactApexChart options={options} series={series} type="area" height={300} />;
}