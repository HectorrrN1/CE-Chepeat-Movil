import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform, Image, TextInput, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Checkbox } from 'expo-checkbox';
import { MaterialIcons } from '@expo/vector-icons';

// Componente de input personalizado, donde se ajusta el estilo y se pasa cualquier propiedad adicional
const StyledInput: React.FC<TextInput['props']> = ({ style, ...props }) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, style]} // Se mezclan estilos
        placeholderTextColor="#999" // Color del texto cuando el campo está vacío
        {...props} // Aquí pasamos las demás propiedades como el "value" o el "onChangeText"
      />
    </View>
  );
};

// Componente principal donde se maneja el registro
export default function register() {
  // Definimos estados para manejar el valor de cada campo
  const [name, setName] = useState(''); // Nombre del usuario
  const [email, setEmail] = useState(''); // Correo electrónico
  const [password, setPassword] = useState(''); // Contraseña
  const [confirmPassword, setConfirmPassword] = useState(''); // Confirmación de la contraseña
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña
  const [acceptTerms, setAcceptTerms] = useState(false); // Si se aceptan los términos
  /*
  const [storeName, setStoreName] = useState(''); // Nombre de la tienda (si es negocio)
  const [street, setStreet] = useState(''); // Calle
  const [extNumber, setExtNumber] = useState(''); // Número exterior
  const [neighborhood, setNeighborhood] = useState(''); // Colonia
  const [city, setCity] = useState(''); // Ciudad
  const [state, setState] = useState(''); // Estado
  const [cp, setCP] = useState(''); // Código Postal
  const [addressNotes, setAddressNotes] = useState(''); // Notas adicionales de la dirección*/

  // Estos estados se usan para manejar errores
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Usamos el router para navegar entre pantallas
  const router = useRouter();

  // Validar que el nombre no esté vacío
  const validateName = () => {
    const nameRules = [
      (v: string) => !!v || 'Nombre es requerido', // Requerimos un nombre
      (v: string) => v.length <= 30 || 'Máximo 30 caracteres', // Máximo 30 caracteres
      (v: string) => /^[a-zA-Z\s]+$/.test(v) || 'El nombre solo debe contener letras y espacios', // Solo letras y espacios
    ];
  
    for (let rule of nameRules) {
      const validationMessage = rule(name);
      if (validationMessage !== true) {
        setNameError(validationMessage as string);
        return false;
      }
    }
    setNameError('');
    return true;
  };
  

  // Función para validar el correo electrónico
  const validateEmail = () => {
    const emailRules = [
      (v: string) => !!v || 'Correo electrónico requerido', // El correo es requerido
      (v: string) => v.length <= 60 || 'Máximo 60 caracteres', // Máximo de 60 caracteres
      (v: string) => /.+@.+\..+/.test(v) || 'Formato de correo electrónico no válido', // Formato básico de correo
    ];

    // Recorremos las reglas y verificamos que se cumplan
    for (let rule of emailRules) {
      const validationMessage = rule(email);
      if (validationMessage !== true) {
        setEmailError(validationMessage as string);
        return false;
      }
    }
    setEmailError(''); // Si todo va bien, no hay error
    return true;
  };

  // Función para validar la contraseña
  const validatePassword = () => {
    const passRules = [
      (v: string) => !!v || 'Contraseña requerida', // Requerimos una contraseña
      (v: string) => v.length <= 15 || 'Máximo 15 caracteres', // Máximo 15 caracteres
      (v: string) =>
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&])\S{8,15}$/.test(v) ||
        'La contraseña debe contener al menos 8 carácteres, incluyendo letras, números y puede contener símbolos',
    ];

    // Igual que con el correo, recorremos las reglas
    for (let rule of passRules) {
      const validationMessage = rule(password);
      if (validationMessage !== true) {
        setPasswordError(validationMessage as string);
        return false;
      }
    }
    setPasswordError('');
    return true;
  };

  // Validamos que la contraseña de confirmación sea igual
  const validateConfirmPassword = () => {
    if (confirmPassword !== password) {
      setConfirmPasswordError('Las contraseñas no coinciden');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  // Función que se ejecuta cuando el usuario presiona "Registrar"
  const handleRegister = () => {
    const isNameValid = validateName(); //Validamos el nombre
    const isEmailValid = validateEmail(); // Validamos el correo
    const isPasswordValid = validatePassword(); // Validamos la contraseña
    const isConfirmPasswordValid = validateConfirmPassword(); // Validamos que las contraseñas coincidan

    // Si todo está correcto, mostramos los valores en consola
    if (isEmailValid && isPasswordValid && isConfirmPasswordValid) {
      console.log('Registration attempted with:', name, email, password)
      // Aquí iría la lógica para registrar al usuario
    }
  };

  return (
    // Estructura principal de la pantalla, con scroll y evitar problemas de teclado
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>

          {/* Logo e imagen */}
          <View style={styles.imageTextContainer}>
            <Image
              source={require('@/assets/images/tenecuchillo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.imageText}>Chepeat</Text>
          </View>

          <Text style={styles.title}>Registrate</Text>

          {/* Campos generales para todos los usuarios */}
          <StyledInput
            placeholder="Nombre completo"
            value={name}
            onChangeText={setName}
            onBlur={validateName}
            autoCapitalize="words"
            style={styles.inputStyle}
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

          <StyledInput
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            onBlur={validateEmail} // Validamos cuando el usuario deja de escribir
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.inputStyle}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <View style={styles.passwordContainer}>
            <StyledInput
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              onBlur={validatePassword} // Valida al perder foco
              secureTextEntry={!showPassword}
              style={styles.inputStyle}
            />
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="gray" />
            </TouchableOpacity>
          </View>

          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          <View style={styles.passwordContainer}>
            <StyledInput
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onBlur={validateConfirmPassword} // Valida al perder foco
              secureTextEntry={!showPassword}
              style={styles.inputStyle}
            />
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={24} color="gray" />
            </TouchableOpacity>
          </View>
          {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}


          {/* Checkbox de términos y condiciones */}
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={acceptTerms} // Si los términos están aceptados o no
              onValueChange={setAcceptTerms} // Cambiamos el valor cuando se selecciona
              color={acceptTerms ? '#df1c24' : undefined} // Cambiamos el color del checkbox si está seleccionado
            />
            <Text style={styles.checkboxLabel}>
              Acepto los <Text style={styles.link}>términos y condiciones</Text>
            </Text>
          </View>

          {/* Botón para registrar */}
          <Button title="Registrar" onPress={handleRegister} style={styles.formButton} />

          {/* Opción para ir a la pantalla de inicio de sesión */}
          <View style={styles.formContainer}>
            <Text style={styles.formText}>
              ¿Ya tienes cuenta? <Text style={styles.link} onPress={() => router.push('/')}>Inicia sesión</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 35,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  imageTextContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 25,
    height: 25,
    marginRight: 5,
  },
  imageText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
  },
  title: {
    fontSize: 34,
    fontWeight: '600',
    color: '#333',
    marginBottom: 50,
    marginTop: 100,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    width: '100%',
    marginBottom: 15,
  },
  input: {
    fontSize: 16,
    color: '#333',
  },
  inputStyle: {
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  link: {
    color: '#df1c24',
    textDecorationLine: 'underline',
  },
  formButton: {
    width: '100%',
    marginBottom: 15,
    backgroundColor: '#df1c24',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    alignItems: 'center',
    width: '100%',
  },
  formText: {
    color: '#333',
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
    zIndex: 1,
    height: 40,
    paddingHorizontal: 10, // Espacio alrededor del icono
  }
});