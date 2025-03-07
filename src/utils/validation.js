export function validate(fields) {
  let isValid = true;
  let erros = {};

  // Inicializa o objeto de erros
  Object.keys(fields).forEach(key => {
    erros[key] = { status: false, msg: null };
  });

  // Validação de campos vazios
  Object.keys(fields).forEach(key => {
    if (!fields[key]) {
      erros[key].status = true;
      erros[key].msg = `${key.replace("_", " ")} é obrigatório`;
      isValid = false;
    }
  });

  // Validação de e-mail
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (fields.email && !emailPattern.test(fields.email)) {
    erros.email.status = true;
    erros.email.msg = "e-mail inválido";
    isValid = false;
  }

  // Validação de CPF (Formato: XXX.XXX.XXX-XX)
  const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  if (fields.cpf && !cpfPattern.test(fields.cpf)) {
    erros.cpf.status = true;
    erros.cpf.msg = "CPF inválido";
    isValid = false;
  }

  // Validação de senha e confirmação de senha
  if (
    fields.senha &&
    fields.confirmar_senha &&
    fields.senha !== fields.confirmar_senha
  ) {
    erros.confirmar_senha.status = true;
    erros.confirmar_senha.msg = "as senhas não coincidem";
    isValid = false;
  }

  return { isValid, erros };
}
