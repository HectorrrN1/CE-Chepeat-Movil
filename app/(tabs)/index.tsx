import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView, // Importar ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button } from '@/components/ui/Button';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const StyledInput: React.FC<TextInput['props']> = ({ style, ...props }) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor="#999"
        {...props}
      />
    </View>
  );
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const router = useRouter();

  const validateEmail = () => {
    const emailRegex = /.+@.+\..+/;
    if (!emailRegex.test(email)) {
      setEmailError('Por favor, ingresa un correo válido con @');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = () => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*.,]{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres, incluyendo letras, números y puede contener símbolos.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = () => {
    validateEmail();
    validatePassword();
    if (!emailError && !passwordError) {
      console.log('Login attempted with:', email, password);
      // Lógica de login
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Bienvenido a Chepeat</Text>
          </View>
          <Text style={styles.subtitle}>Por favor, inicia sesión para continuar.</Text>

          {/* Correo Electrónico */}
          <Text style={styles.text}>Correo Electrónico</Text>
          <StyledInput
            placeholder="Correo Electrónico"
            value={email}
            onChangeText={setEmail}
            onBlur={validateEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.inputStyle}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          {/* Contraseña */}
          <Text style={styles.text}>Contraseña</Text>
          <View style={styles.passwordContainer}>
            <StyledInput
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              onBlur={validatePassword}
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

          <Button title="Iniciar sesión" onPress={handleLogin} style={styles.Button} />
          
          <Text style={styles.forgotPassword}>
            <Text onPress={() => router.push('/explore')}>¿Olvidaste tu contraseña?</Text>
          </Text>

          {/* Divisor con "Oh" */}
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>O</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>¿No tienes cuenta? Regístrate ahora</Text>
            <Button
              title="Crear Cuenta"
              onPress={() => router.push('/register')}
              style={styles.Button}
            />
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
    marginBottom: 0,
    marginTop: 35,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 250,
    height: 250,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginTop: -10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
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
    paddingHorizontal: 10,
  },
  Button: {
    width: '100%',
    marginBottom: 30,
    backgroundColor: '#df1c24',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotPassword: {
    color: '#df1c24',
    fontSize: 14,
    marginBottom: 10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#999',
  },
  signupContainer: {
    alignItems: 'center',
    width: '100%',
  },
  signupText: {
    color: '#7e7e7e',
    fontSize: 14,
    marginBottom: 20,
    marginTop: 10,
  },
  text: {
    width: '97%',
    height: 25,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 12,
  },
});
