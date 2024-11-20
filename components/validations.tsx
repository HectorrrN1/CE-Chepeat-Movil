
export const validateEmail = (email: string): string => {
  const emailRegex = /.+@.+\..+/;
  return emailRegex.test(email) ? '' : 'Ingresa el formato de correo electrónico válido';
};

export const validatePassword = (password: string): string => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*.,]{8,}$/;
  return passwordRegex.test(password) ? '' : 'La contraseña debe tener al menos 8 caracteres, incluyendo letras y números.';
};