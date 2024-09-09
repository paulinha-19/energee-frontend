import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import Box from '@mui/material/Box';
import { ReactNode } from 'react';

interface ChartCardProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

export default function ChartCard({ title, children, icon }: ChartCardProps) {
  return (
    <MainCard style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} style={{ marginBottom: '16px' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {icon && (
            <Box
              sx={{
                backgroundColor: (theme) => theme.palette.primary.lighter,
                borderRadius: '50%',
                padding: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40
              }}
            >
              {icon}
            </Box>
          )}
          <Typography variant="h5">{title}</Typography>
        </Stack>
      </Stack>
      <div style={{ flexGrow: 1 }}>{children}</div>
    </MainCard>
  );
}
