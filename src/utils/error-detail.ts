import { enqueueSnackbar } from 'notistack';

export function getErrorDetail(error: any) {
  if (Array.isArray(error?.detail)) {
    // O detail é uma lista de erros
    error.detail.forEach((err: any) => {
      if (err?.ctx?.error) {
        // Exibir o erro do ctx
        console.error(err.ctx.error);
        enqueueSnackbar(err.ctx.error, {
          variant: 'error',
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          }
        });
      } else {
        // Caso não tenha ctx, exibir a mensagem do erro diretamente
        console.error(err.msg);
        enqueueSnackbar(err.msg, {
          variant: 'error',
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
          }
        });
      }
    });
  } else if (typeof error?.detail === 'string') {
    // O detail é uma string, exibir diretamente
    console.error(error.detail);
    enqueueSnackbar(error.detail, {
      variant: 'error',
      autoHideDuration: 5000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
  } else {
    // Exibir mensagem genérica se não for nenhum dos casos
    console.error('Ocorreu um erro inesperado');
    enqueueSnackbar('Ocorreu um ao enviar os dados do cliente', {
      variant: 'error',
      autoHideDuration: 5000,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      }
    });
  }
}
