import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, KeyboardAvoidingView,
         Platform, Image, TextInput, TouchableOpacity
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Checkbox } from 'expo-checkbox';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import styles from '@/assets/styles/register.styles';
import { validateName, validateEmail, validatePassword, 
         validateConfirmPassword } from '@/components/validationsRegister';

const StyledInput: React.FC<TextInput['props']> = ({ style, ...props }) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, style]} // Se mezclan estilos
        placeholderTextColor="#999"
        {...props}
      />
    </View>
  );
};

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const router = useRouter();

  const handleRegister = async () => {
    const nameValidation = validateName(name);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validateConfirmPassword(password, confirmPassword);
  
    setNameError(nameValidation);
    setEmailError(emailValidation);
    setPasswordError(passwordValidation);
    setConfirmPasswordError(confirmPasswordValidation);
  
    if (!nameValidation && !emailValidation && !passwordValidation && !confirmPasswordValidation && acceptTerms) {
      console.log('Registro ingresado con:', name, email, password);
      try {
        const response = await axios.post('https://backend-j959.onrender.com/api/Auth/RegistrarUsuario', {
          email,
          fullname: name,
          password,
          confirmPassword
        });
  
        // Maneja la respuesta de la API según sea necesario
        console.log('Usuario registrado exitosamente:', response.data);
        router.push(''); // Redirige a la página de inicio de sesión después del registro exitoso
  
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Manejo específico de errores de Axios
          console.error('Error en la respuesta de la API:', error.response?.data);
          alert(`Error: ${error.response?.data?.message || 'Ha ocurrido un error inesperado.'}`);
        } else {
          // Manejo de errores genéricos
          console.error('Error desconocido:', error);
          alert('Ha ocurrido un error inesperado.');
        }
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' || Platform.OS === 'ios' ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.imageTextContainer}>
            <Image
              source={require('@/assets/images/tenecuchillo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.imageText}>Chepeat</Text>
          </View>

          <Text style={styles.title}>Registrate</Text>

          <StyledInput
            placeholder="Nombre completo"
            value={name}
            onChangeText={setName}
            onBlur={() => setNameError(validateName(name))}
            autoCapitalize="words"
            style={styles.inputStyle}
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

          <StyledInput
            placeholder="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            onBlur={() => setEmailError(validateEmail(email))}
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
              onBlur={() => setPasswordError(validatePassword(password))}
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
              onBlur={() => setConfirmPasswordError(validateConfirmPassword(password, confirmPassword))}
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

          <View style={styles.checkboxContainer}>
            <Checkbox
              value={acceptTerms}
              onValueChange={setAcceptTerms}
              color={acceptTerms ? '#df1c24' : undefined}
            />
            <Text style={styles.checkboxLabel}>
              Acepto los <Text style={styles.link}>términos y condiciones</Text>
            </Text>
          </View>

          <Button title="Registrar" onPress={handleRegister} style={styles.formButton} />

          <View style={styles.formContainer}>
            <Text style={styles.formText}>
              ¿Ya tienes cuenta? <Text style={styles.link} onPress={() => router.push('')}>Inicia sesión</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
