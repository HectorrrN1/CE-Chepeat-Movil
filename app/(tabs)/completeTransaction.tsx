import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export default function SaleConfirmationScreen() {
  // Inicializando estados con useState
  const [productDelivered, setProductDelivered] = useState(false);
  const [paymentReceived, setPaymentReceived] = useState(false);
  const { idPurchaseRequest, id } = useLocalSearchParams();
  const [requestDetails, setRequestDetails] = useState<any>(null);

  // Función para alternar el estado de los checkboxes
  const toggleCheckbox = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(prev => !prev); // Alterna el valor booleano
  };

  // Método para obtener la solicitud por ID
  const fetchRequestById = async (id: string) => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) throw new Error('Token no encontrado');

      const response = await axios.post(
        'https://backend-j959.onrender.com/api/PurchaseRequest/GetRequestById',
        idPurchaseRequest, // Enviamos el idPurchaseRequest
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Detalles de la solicitud:', response.data);
      setRequestDetails(response.data);
    } catch (error) {
      console.error('Error al obtener los detalles de la solicitud:', error);
      Alert.alert('Error al obtener los detalles de la solicitud');
    }
  };

  const completeTransaction = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) throw new Error('Token no encontrado');

      const data = {
        id, // Usamos el id proporcionado por la vista anterior
        wasDelivered: productDelivered,
        wasPaid: paymentReceived,
      };

      const response = await axios.post(
        'https://backend-j959.onrender.com/api/Transaction/CompleteTransaction',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      Alert.alert('Transacción completada con éxito');
      router.push('/home'); // Redirigimos a la vista principal
    } catch (error) {
      console.error('Error al completar la transacción:', error);
      Alert.alert('Error al completar la transacción');
    }
  };

  useEffect(() => {
    if (idPurchaseRequest) {
      fetchRequestById(idPurchaseRequest as string);
    }
  }, [idPurchaseRequest]);

  return (
    <View style={styles.container}>
      {requestDetails ? (
        <>
          <Image
            source={require('@/assets/images/profile.jpg')}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{requestDetails.buyerName}</Text>
          <Text style={styles.text}>Producto: {requestDetails.productName}</Text>
          <Text style={styles.text}>
            Fecha: {new Date(requestDetails.requestDate).toLocaleDateString()}
          </Text>
        </>
      ) : (
        <Text style={styles.text}>Cargando detalles de la solicitud...</Text>
      )}

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => toggleCheckbox(setProductDelivered)}
      >
        <View style={styles.checkbox}>
          {productDelivered && <Feather name="check" size={18} color="#000" />}
        </View>
        <Text style={styles.checkboxLabel}>Entregue el producto</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => toggleCheckbox(setPaymentReceived)}
      >
        <View style={styles.checkbox}>
          {paymentReceived && <Feather name="check" size={18} color="#000" />}
        </View>
        <Text style={styles.checkboxLabel}>
          Acepto que el usuario pagó el monto acordado
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.closeButton} onPress={completeTransaction}>
        <Text style={styles.closeButtonText}>Completar venta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 35,
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
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 16,
    flex: 1,
    flexWrap: 'wrap',
  },
  closeButton: {
    backgroundColor: '#df1c24',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
    marginBottom: 15,
  },
});
