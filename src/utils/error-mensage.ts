const errorMessages: { [key: string]: string } = {
  'password|String should have at least 8 characters': 'A senha deve ter pelo menos 8 caracteres.',
  'email|Value error, E-mail já registrado': 'E-mail já registrado.',
  'telefone|Value error, O campo telefone deve conter apenas números e ter no máximo 15 dígitos':
    'O campo telefone deve conter apenas números e ter no máximo 15 dígitos.'
  // Adicione outros erros conforme necessário
};

export function getErrorMessage(error: any): string {
  const loc = error.loc.join('.');
  const key = `${loc}|${error.msg}`;
  console.log('key', key);
  return errorMessages[key] || 'Erro desconhecido. Por favor, tente novamente.';
}
