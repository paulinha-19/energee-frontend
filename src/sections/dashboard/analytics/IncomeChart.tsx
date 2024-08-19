import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart, { Props as ChartProps } from 'react-apexcharts';

// project-imports
import { ThemeMode } from 'config';

// chart options
const areaChartOptions = {
  chart: {
    height: 355,
    type: 'area',
    toolbar: {
      show: false
    }
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
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'straight',
    width: 1
  },
  grid: {
    show: true,
    borderColor: '#90A4AE',
    strokeDashArray: 0,
    position: 'back',
    xaxis: {
      lines: {
        show: true
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  }
};

interface Props {
  slot: string;
  quantity: any;
}

// ==============================|| ANALYTICS - INCOME LINE CHART ||============================== //

export default function IncomeAreaChart({ slot, quantity }: Props) {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;
  const mode = theme.palette.mode;

  const [options, setOptions] = useState<ChartProps>(areaChartOptions);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary[700]],
      xaxis: {
        categories:
          slot === 'month'
            ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        labels: {
          style: {
            colors: [
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary
            ]
          }
        },
        axisBorder: {
          show: true,
          color: line
        },
        tickAmount: slot === 'month' ? 11 : 7
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
      tooltip: {
        y: {
          formatter(val: number) {
            return `$ ${val}`;
          }
        }
      },
      theme: {
        mode: mode === ThemeMode.DARK ? 'dark' : 'light'
      }
    }));
  }, [mode, primary, secondary, line, theme, slot]);

  const [series, setSeries] = useState([
    {
      name: 'Income',
      data: [0, 86, 28, 115, 48, 210, 136]
    }
  ]);

  useEffect(() => {
    switch (quantity) {
      case 'By volume':
        setSeries([
          {
            name: 'Income',
            data: slot === 'month' ? [100, 40, 60, 40, 40, 40, 80, 40, 40, 50, 40, 40] : [100, 20, 60, 20, 20, 80, 20]
          }
        ]);
        break;

      case 'By margin':
        setSeries([
          {
            name: 'Income',
            data: slot === 'month' ? [120, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 35] : [51, 40, 28, 51, 42, 109, 100]
          }
        ]);
        break;
      case 'By sales':
        setSeries([
          {
            name: 'Income',
            data: slot === 'month' ? [90, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 35] : [21, 40, 28, 51, 42, 109, 100]
          }
        ]);
        break;
      default:
        break;
    }
  }, [slot, quantity]);

  return <ReactApexChart options={options} series={series} type="area" height={355} />;
}
