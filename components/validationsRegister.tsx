// validations.ts

export const validateName = (name: string) => {
    const nameRules = [
      (v: string) => !!v || 'Nombre es requerido',
      (v: string) => v.length <= 30 || 'Máximo 30 caracteres',
      (v: string) => /^[a-zA-Z\s]+$/.test(v) || 'El nombre solo debe contener letras y espacios',
    ];
  
    for (let rule of nameRules) {
      const validationMessage = rule(name);
      if (validationMessage !== true) {
        return validationMessage as string;
      }
    }
    return '';
  };
  
  export const validateEmail = (email: string) => {
    const emailRules = [
      (v: string) => !!v || 'Correo electrónico requerido',
      (v: string) => v.length <= 60 || 'Máximo 60 caracteres',
      (v: string) => /.+@.+\..+/.test(v) || 'Formato de correo electrónico no válido',
    ];
  
    for (let rule of emailRules) {
      const validationMessage = rule(email);
      if (validationMessage !== true) {
        return validationMessage as string;
      }
    }
    return '';
  };
  
  export const validatePassword = (password: string) => {
    const passRules = [
      (v: string) => !!v || 'Contraseña requerida',
      (v: string) => v.length <= 15 || 'Máximo 15 caracteres',
      (v: string) =>
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&])\S{8,15}$/.test(v) ||
        'La contraseña debe contener al menos 8 caracteres, incluyendo letras, números y puede contener símbolos',
    ];
  
    for (let rule of passRules) {
      const validationMessage = rule(password);
      if (validationMessage !== true) {
        return validationMessage as string;
      }
    }
    return '';
  };
  
  export const validateConfirmPassword = (password: string, confirmPassword: string) => {
    if (confirmPassword !== password) {
      return 'Las contraseñas no coinciden';
    }
    return '';
  };
  