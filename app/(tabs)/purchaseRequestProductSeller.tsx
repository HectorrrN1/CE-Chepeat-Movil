import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Definir la interfaz para los detalles de la solicitud
interface RequestDetails {
  id: string;
  idProduct: string;
  idBuyer: string;
  requestDate: string;
  status: string;
  productName: string;
  buyerName: string;
}

export default function UserProfileCard() {
  const { requestId } = useLocalSearchParams(); // Recuperar el ID de la solicitud
  const [requestDetails, setRequestDetails] = useState<RequestDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Estado para controlar la carga

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken'); // Obtener el token guardado

        if (!token) {
          console.error('No se encontró el token');
          return;
        }

        const response = await axios.post(
          'https://backend-j959.onrender.com/api/PurchaseRequest/GetRequestById',
          requestId,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // Actualizar el estado con los detalles de la solicitud
        setRequestDetails(response.data);
        setLoading(false); // Cambiar el estado a cargado
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error(
            'Error al obtener los detalles de la solicitud:',
            error.response ? error.response.data : error.message
          );
        } else {
          console.error('Error desconocido:', error);
        }
        setLoading(false); // Cambiar el estado a cargado aunque haya error
      }
    };

    if (requestId) {
      fetchRequestDetails();
    }
  }, [requestId]);

  // Mostrar cargando si los datos aún no han sido recuperados
  if (loading) {
    return <Text>Cargando detalles de la solicitud...</Text>;
  }

  // Verifica que requestDetails tenga datos antes de intentar renderizar
  if (!requestDetails) {
    return <Text>No se encontraron detalles de la solicitud.</Text>;
  }

  const handleRejectRequest = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) throw new Error('Token no encontrado');

      const response = await axios.post(
        'https://backend-j959.onrender.com/api/PurchaseRequest/Reject',
        requestId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert('Solicitud rechazada exitosamente');
      }
    } catch (error) {
      console.error('Error al rechazar la solicitud:', error);
      Alert.alert('Error al rechazar la solicitud');
    }
  };

  const handleAddTransaction = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) throw new Error('Token no encontrado');
  
      const payload = {
        idPurchaseRequest: requestId, // Reemplaza `requestId` con el valor correcto
      };
  
      const response = await axios.post(
        'https://backend-j959.onrender.com/api/Transaction/AddTransaction',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      // Imprimir la respuesta completa de la API
      console.log('Respuesta de la API:', response);
  
      if (response.status === 200 || response.status === 201) {
        Alert.alert('Transacción añadida exitosamente');
        router.replace('/home');
      }
    } catch (error) {
      console.error('Error al añadir la transacción:', error);
      Alert.alert('Error al añadir la transacción');
    }
  };
  
  

  {/* 
  const handleCancelRequest = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) throw new Error('Token no encontrado');

      const response = await axios.post(
        'https://backend-j959.onrender.com/api/PurchaseRequest/Cancel',
        requestId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert('Solicitud eliminada exitosamente');
        router.push('/home'); // Redirigir al inicio
      }
    } catch (error) {
      console.error('Error al eliminar la solicitud:', error);
      Alert.alert('Error al eliminar la solicitud');
    }
  };
  
  */}

  return (
    <View style={styles.container}>
      <View style={styles.containerUser}>
        <Image
          source={require('@/assets/images/profile.jpg')}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{requestDetails.buyerName || 'Nombre del comprador no disponible'}</Text>
        <Text style={styles.description}>{requestDetails.productName || 'Nombre del producto no disponible'}</Text>
        <Text style={styles.location}>{requestDetails.status || 'Estado no disponible'}</Text>
        <Text style={styles.joinDate}>{new Date(requestDetails.requestDate).toLocaleString() || 'Fecha de solicitud no disponible'}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.updateButton, styles.halfButton]} onPress={handleRejectRequest}>
            <Text style={styles.updateButtonText}>Rechazar Solicitud</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.deleteButton, styles.halfButton]} onPress={handleAddTransaction}>
            <Text style={styles.deleteButtonText}>Aceptar Solicitud</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push('/home')}>
          <Feather name="home" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/sellerProducts')}>
          <Feather name="search" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/profileSeller')}>
          <Feather name="user" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 35,
  },
  containerUser: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
  location: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
    textAlign: 'center',
  },
  joinDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row', // Alinea los botones en una fila horizontal
    justifyContent: 'space-between', // Espaciado uniforme entre los botones
    marginHorizontal: 12, // Margen a los lados de la fila
    bottom: 0, // Espacio desde el borde inferior
    width: '94%', // Asegura que ocupe todo el ancho disponible
  },
  halfButton: {
    flex: 1, // Cada botón ocupa la mitad del espacio disponible
    marginHorizontal: 5, // Separación entre los botones
  },
  deleteButton: {
    backgroundColor: '#DF1C24',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  updateButton: {
    backgroundColor: '#E8AE1D',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});
