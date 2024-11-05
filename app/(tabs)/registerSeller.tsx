import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, Image
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export default function StoreRegistrationScreen() {
  const [formData, setFormData] = useState({
    storeName: '',
    description: '',
    street: '',
    exteriorNumber: '',
    interiorNumber: '',
    neighborhood: '',
    city: '',
    state: '',
    postalCode: '',
    addressNotes: '',  // Cambiado de 'address' a 'addressNotes'
    latitude: '',
    longitude: '',
  });

  const router = useRouter();

  const handleRegister = async () => {
    const now = new Date().toISOString();
    const dataWithTimestamps = {
      id: '',  // El backend generará este ID
      storeName: formData.storeName,
      description: formData.description,
      street: formData.street,
      extNumber: formData.exteriorNumber,  // Cambiado a 'extNumber'
      intNumber: formData.interiorNumber,  // Cambiado a 'intNumber'
      neighborhood: formData.neighborhood,
      city: formData.city,
      state: formData.state,
      cp: formData.postalCode,  // Cambiado a 'cp'
      addressNotes: formData.addressNotes,  // Cambiado de 'address' a 'addressNotes'
      latitude: parseFloat(formData.latitude),  // Convertido a número
      longitude: parseFloat(formData.longitude),  // Convertido a número
      createdAt: now,
      updatedAt: now,
      idUser: ''  // Este campo se llenará con el ID del usuario
    };

    console.log('Form submitted:', dataWithTimestamps);

    try {
      // Obtener el token del usuario almacenado en SecureStore
      const userDataString = await SecureStore.getItemAsync('userData');
      const userData = userDataString ? JSON.parse(userDataString) : null;

      if (!userData || !userData.token) {
        console.warn('Token no encontrado en SecureStore');
        alert('No se ha encontrado el token de autenticación.');
        return;
      }

      // Llenar el idUser con el ID del usuario recuperado
      dataWithTimestamps.idUser = userData.id;  // Suponiendo que el ID del usuario está en userData

      // Configurar el encabezado de autorización con el token
      const config = {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      };

      // Hacer la solicitud POST con Axios y pasar el encabezado
      const response = await axios.post('https://backend-j959.onrender.com/api/Seller/AddSeller', dataWithTimestamps, config);
      console.log('Datos del vendedor guardados en la API:', response.data);

      await AsyncStorage.setItem('datosVendedor', JSON.stringify(dataWithTimestamps));
      console.log('Datos del vendedor guardados en AsyncStorage');

      router.push('/home');

    } catch (error) {
      console.error('Error al registrar datos del vendedor:', error);
      if (axios.isAxiosError(error)) {
        alert(`Error: ${error.response?.data?.message || 'Ha ocurrido un error inesperado.'}`);
      } else {
        alert('Ha ocurrido un error inesperado.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
          />
          <Text style={styles.logoText}>Chepeat</Text>
        </View>

        <Text style={styles.title}>Regístrate</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre de la tienda"
          value={formData.storeName}
          onChangeText={(text) => setFormData({ ...formData, storeName: text })}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Descripción"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          multiline
          numberOfLines={3}
        />

        <TextInput
          style={styles.input}
          placeholder="Calle"
          value={formData.street}
          onChangeText={(text) => setFormData({ ...formData, street: text })}
        />

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Num. Exterior"
            value={formData.exteriorNumber}
            onChangeText={(text) => setFormData({ ...formData, exteriorNumber: text })}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Num. Interior"
            value={formData.interiorNumber}
            onChangeText={(text) => setFormData({ ...formData, interiorNumber: text })}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Vecindario"
          value={formData.neighborhood}
          onChangeText={(text) => setFormData({ ...formData, neighborhood: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Ciudad"
          value={formData.city}
          onChangeText={(text) => setFormData({ ...formData, city: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Estado"
          value={formData.state}
          onChangeText={(text) => setFormData({ ...formData, state: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="CP"
          value={formData.postalCode}
          onChangeText={(text) => setFormData({ ...formData, postalCode: text })}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Notas de dirección"
          value={formData.addressNotes}  // Cambiado de 'address' a 'addressNotes'
          onChangeText={(text) => setFormData({ ...formData, addressNotes: text })}  // Cambiado aquí también
        />

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Latitud"
            value={formData.latitude}
            onChangeText={(text) => setFormData({ ...formData, latitude: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Longitud"
            value={formData.longitude}
            onChangeText={(text) => setFormData({ ...formData, longitude: text })}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Registrar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#df1c24',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    marginBottom: 10,
  },
  textArea: {
    height: 80,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginRight: 10,
  },
  registerButton: {
    backgroundColor: '#df1c24',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
