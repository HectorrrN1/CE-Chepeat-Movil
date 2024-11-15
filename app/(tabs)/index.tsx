import React, { useState } from 'react';
import { View, Text, SafeAreaView, KeyboardAvoidingView, ScrollView, Platform, Image, TextInput, TouchableOpacity, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button } from '@/components/ui/Button';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store'; // Importar SecureStore
import styles from '@/assets/styles/index.styles';

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState(''); // Nuevo estado para el mensaje del modal

  const router = useRouter();

  const validateEmail = () => {
    const emailRegex = /.+@.+\..+/;
    if (!emailRegex.test(email)) {
      setEmailError('Ingresa el formato de correo electrónico válido');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = () => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*.,]{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres, incluyendo letras y números.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = async () => {
    setIsModalVisible(false);
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (isEmailValid && isPasswordValid) {
      try {
        const response = await axios.post('https://backend-j959.onrender.com/api/Auth/IniciarSesion', {
          email,
          password,
        });

        if (response.data.numError === 1 && response.data.token) {
          //Si el login es exitoso, se guarda el JWT Y 
          // los datos del usuario en SecureStore
          const token = response.data.token;
          const refreshToken = response.data.refreshToken;
          const userData = {
            id: response.data.user.id, // Asegúrate de que el ID esté presente.
            isSeller: response.data.user.isSeller || false, // Asegúrate de guardar `isSeller`.
            email: response.data.user.email, // Guarda otros campos importantes si los necesitas.
            fullname: response.data.user.fullname,
          };

          await SecureStore.setItemAsync('userToken', token);
          await SecureStore.setItemAsync('refreshToken', refreshToken);
          await SecureStore.setItemAsync('userData', JSON.stringify({ user: userData, token }));

          console.log('Inicio de sesión exitoso, token y datos del usuario guardados:', token, refreshToken, userData);

          router.push('/homeBuyer');
        } else {
          setModalMessage('Credenciales no válidas. Vuelve a intentarlo.');
          setIsModalVisible(true);
        }
      } catch (error) {
        console.error('Error al realizar la solicitud: ', error);
        setModalMessage('Error al intentar iniciar sesión, verifica tu conexión o credenciales. ');
        setIsModalVisible(true);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' || Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
        >
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
            <Text onPress={() => router.push('/')}>¿Olvidaste tu contraseña?</Text>
          </Text>

          {/* Modal de alerta */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalText}>{modalMessage}</Text>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setIsModalVisible(false)}
                  >
                    <Text style={styles.buttonText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Divisor con "O" */}
          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>O</Text>
            <View style={styles.line} />
          </View>

          {/* Crear Cuenta */}
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