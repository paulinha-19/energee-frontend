import { useFormik } from 'formik';
import * as yup from 'yup';
import { Box, Button, FormGroup, FormControlLabel, Radio, RadioGroup, TextField, FormControl } from '@mui/material';
import { Distributor } from 'interfaces';

interface DistributorFormProps {
  distributor?: Distributor | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const validationSchema = yup.object({
  status: yup.boolean().required('O status é obrigatório'),
});

export default function DistributorForm({ distributor, onSave, onCancel }: DistributorFormProps) {
  const formik = useFormik({
    initialValues: {
      status: distributor?.status ?? true,
    },
    validationSchema,
    onSubmit: (values) => {
      onSave(values);
    },
  });

  return (
    <Box component="form" noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} onSubmit={formik.handleSubmit}>
      <FormControl component="fieldset">
        <RadioGroup
          aria-label="status"
          name="status"
          value={formik.values.status ? 'ativo' : 'inativo'}
          onChange={(e) => formik.setFieldValue('status', e.target.value === 'ativo')}
        >
          <FormControlLabel value="ativo" control={<Radio />} label="Ativo" />
          <FormControlLabel value="inativo" control={<Radio />} label="Inativo" />
        </RadioGroup>
      </FormControl>

      <TextField
        label="Nome da Distribuidora"
        value={distributor?.nome || ''}
        InputProps={{
          readOnly: true,
        }}
        variant="outlined"
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="contained" color="primary" type="submit">
          Salvar
        </Button>
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          Cancelar
        </Button>
      </Box>
    </Box>
  );
}