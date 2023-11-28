export function getPasswordStrength(password: string) {
  let score = 0;

  // Check the length of the password
  if (password.length < 8) {
    return { msg: "Senha Fraca", point: 10 };
  }

  // Add points for length
  score += password.length < 12 ? 1 : password.length < 20 ? 2 : 3;

  // Check for lowercase letters
  if (/[a-z]/.test(password)) {
    score++;
  }

  // Check for uppercase letters
  if (/[A-Z]/.test(password)) {
    score++;
  }

  // Check for digits
  if (/\d/.test(password)) {
    score++;
  }

  // Check for special characters
  if (/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password)) {
    score++;
  }

  if (score < 5) {
    return { msg: "Pouco Forte", point: 30 };
  } else if (score < 7) {
    return { msg: "Forte", point: 60 };
  } else if (score < 9) {
    return { msg: "Muito Forte", point: 80 };
  } else {
    return { msg: "Senha Muito Forte", point: 100 };
  }
}
export function formatCPF(value: string) {
  // Remove all non-numeric characters from the input
  const numericValue = value.replace(/\D/g, "");

  // Apply the CPF mask
  const maskedValue = numericValue.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    "$1.$2.$3-$4"
  );

  return maskedValue;
}
export function formatPhoneNumber(value: string) {
  // Remove all non-numeric characters from the input
  const numericValue = value.replace(/\D/g, "");

  // Apply the phone number mask
  const maskedValue = numericValue.replace(
    /(\d{2})(\d{5})(\d{4})/,
    "($1) $2-$3"
  );

  return maskedValue;
}

export function validarCPF(cpf: string) {
  var cpfRegex: any = /^(?:(\d{3}).(\d{3}).(\d{3})-(\d{2}))$/;
  if (!cpfRegex.test(cpf)) {
    return false;
  }

  var numeros: any = cpf.match(/\d/g)?.map(Number);
  var soma = numeros.reduce((acc: any, cur: any, idx: number) => {
    if (idx < 9) {
      return acc + cur * (10 - idx);
    }
    return acc;
  }, 0);

  var resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) {
    resto = 0;
  }

  if (resto !== numeros[9]) {
    return false;
  }

  soma = numeros.reduce((acc: any, cur: any, idx: number) => {
    if (idx < 10) {
      return acc + cur * (11 - idx);
    }
    return acc;
  }, 0);

  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) {
    resto = 0;
  }

  if (resto !== numeros[10]) {
    return false;
  }

  return true;
}
