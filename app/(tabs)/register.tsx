import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Image, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Checkbox } from 'expo-checkbox';
import { Picker } from '@react-native-picker/picker';  // Importa Picker

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

export default function register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [userType, setUserType] = useState('Cliente');  // Nueva variable para el Dropdown

  const router = useRouter();

  const handleRegister = () => {
    console.log('Registration attempted with:', name, email, password, userType);
    // Logica para el registro
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.imageTextContainer}>
          <Image
            source={require('@/assets/images/tenecuchillo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.imageText}>Chepeat</Text>
        </View>
        <View style={styles.dropdownContainer}>
        <Text style={styles.title}>Registrate</Text>
        <Picker
          selectedValue={userType}
          style={styles.pickerStyle}
          onValueChange={(itemValue) => setUserType(itemValue)}
        >
          <Picker.Item label="Cliente" value="Cliente" />
          <Picker.Item label="Negocio" value="Negocio" />
        </Picker>
        </View>

        <StyledInput
          placeholder="Nombre completo"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          style={styles.inputStyle}
        />
        <StyledInput
          placeholder="Correo electrónico"
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
        <StyledInput
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.inputStyle}
        />

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
            ¿Ya tienes cuenta? <Text style={styles.link} onPress={() => router.push('/explore')}>Inicia sesión</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 0,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 150,
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
    marginTop: 5,
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
    marginTop: 20,
  },
  formText: {
    color: '#333',
    fontSize: 14,
  },
  pickerStyle: {
    height: 40, // Ajusta la altura
    width: '40%', // Ajusta el ancho
    marginBottom: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 8, // Bordes redondeados para darle mejor apariencia
    justifyContent: 'center', // Asegura que el contenido esté centrado
    paddingHorizontal: 10, // Añade algo de espacio interior
    fontSize: 10, // Tamaño de la fuente más pequeño
  },
  dropdownContainer: {
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});



/*import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Image, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Checkbox } from 'expo-checkbox';

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

export default function Registro() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const router = useRouter();

  const handleRegister = () => {
    console.log('Registration attempted with:', name, email, password);
    // Logica para el registro
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
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
          autoCapitalize="words"
          style={styles.inputStyle}
        />
        <StyledInput
          placeholder="Correo electrónico"
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
        <StyledInput
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.inputStyle}
        />
        
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
            ¿Ya tienes cuenta? <Text style={styles.link} onPress={() => router.push('/explore')}>Inicia sesión</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 0,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-start',  // Se mueve el contenido hacia arriba
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 150,  // Ajusta la altura del formularo
  },
  imageTextContainer: {
    position: 'absolute', // Fija la posición
    top: 0,  // Ajusta según la distancia que se desea
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
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 50,
    marginTop: 5,
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
    marginTop: 20,
  },
  formText: {
    color: '#333',
    fontSize: 14,
  },
});*/