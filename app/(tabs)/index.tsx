import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Image, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation para usar la navegación
import { Button } from '@/components/ui/Button';

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

  const navigation = useNavigation(); // Usa este hook para acceder a la navegación

  const handleLogin = () => {
    console.log('Login attempted with:', email, password);
    // Implement your login logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
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
        <StyledInput
          placeholder="Correo Electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.inputStyle}
        />
        <StyledInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.inputStyle}
        />
        <Button title="Iniciar sesión" onPress={handleLogin} style={styles.loginButton} />
        <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>

        {/* Aquí está el divisor con "Oh" */}
        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>o</Text>
          <View style={styles.line} />
        </View>
 
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>¿No tienes cuenta? Regístrate ahora</Text>
          <Button title="Crear Cuenta" 
          onPress={() => navigation.navigate('/explore')} // Redirige a la pantalla "Signup"
          style={styles.signupButton}/>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10, // Ajusta este valor para pegar el título al logo
  },
  logo: {
    width: 250,
    height: 250,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginTop: -10, // Reduce este margen superior para acercarlo al logo
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
  loginButton: {
    width: '100%',
    marginBottom: 15,
    backgroundColor: '#df1c24', // Color de fondo del botón
    borderRadius: 25, // Redondeado
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotPassword: {
    color: '#df1c24',
    fontSize: 14,
    marginBottom: 20, // Ajusta este valor para la separación con el divisor
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20, // Ajusta este valor para la separación del divisor
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc', // Color de la línea
  },
  dividerText: {
    marginHorizontal: 10, // Espacio entre las líneas y el texto
    color: '#999', // Color del texto "Oh"
  },
  signupContainer: {
    alignItems: 'center',
    width: '100%',
  },
  signupText: {
    color: '#7e7e7e',
    fontSize: 14,
    marginBottom: 15,
  },
  signupButton: {
    width: '100%',
    backgroundColor: '#df1c24', // Color igual que el botón de iniciar sesión
    borderRadius: 25, // Redondeado
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
});

