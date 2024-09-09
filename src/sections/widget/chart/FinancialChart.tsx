import { useEffect, useState } from 'react';
import ReactApexChart, { Props as ChartProps } from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { ThemeMode } from 'config';
import { FinancialDataAdmin, FinancialDataClient } from 'interfaces';

interface FinancialChartProps {
  data: FinancialDataAdmin | FinancialDataClient | undefined;
  error: any;
  isLoading: boolean;
  isAdmin: boolean;
}

const barChartOptions = {
  chart: {
    type: 'bar',
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      columnWidth: '50%'
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 0
  },
  grid: {
    row: {
      colors: ['#fff', '#f2f2f2']
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'light',
      type: 'horizontal',
      shadeIntensity: 0.25,
      opacityFrom: 0.85,
      opacityTo: 0.85,
      stops: [50, 0, 100]
    }
  }
};

export default function FinancialChart({ data, error, isLoading, isAdmin }: FinancialChartProps) {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const { secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState<ChartProps>(barChartOptions);
  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([]);

  useEffect(() => {
    if (data) {
      const categories = data.labels;
      let seriesData: { name: string; data: number[] }[] = [];

      if (isAdmin && 'valor' in data) {
        const valorData = data.valor.map((value: string) => parseFloat(value.replace('.', '').replace(',', '.')));
        seriesData = [{ name: 'Valores', data: valorData }];
      } else if (!isAdmin && 'valor_inicial' in data && 'valor_pago' in data && 'desconto' in data) {
        const discountData = data.desconto.map((value: string) => parseFloat(value.replace('.', '').replace(',', '.')));
        const paidValueData = data.valor_pago.map((value: string) => parseFloat(value.replace('.', '').replace(',', '.')));
        const initialValueData = data.valor_inicial.map((value: string) => parseFloat(value.replace('.', '').replace(',', '.')));

        seriesData = [
          { name: 'Desconto', data: discountData },
          { name: 'Valor Pago', data: paidValueData },
          { name: 'Valor Inicial', data: initialValueData }
        ];
      }

      setOptions((prevState) => ({
        ...prevState,
        xaxis: {
          categories,
          labels: {
            rotate: -45,
            style: {
              colors: Array(categories.length).fill(secondary)
            }
          },
          tickPlacement: 'on'
        },
        yaxis: {
          title: {
            text: 'Valores em Reais'
          },
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

  return <ReactApexChart options={options} series={series} type="bar" height={300} />;
}