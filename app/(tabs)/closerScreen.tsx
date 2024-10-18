import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SaleConfirmationScreen() {
  // Inicializando estados con useState
  const [productDelivered, setProductDelivered] = useState(false);
  const [paymentReceived, setPaymentReceived] = useState(false);

  // Función para alternar el estado de los checkboxes
  const toggleCheckbox = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(prev => !prev); // Alterna el valor booleano
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/profile.jpg')}
        style={styles.profileImage}
      />
      <Text style={styles.name}>Juan Pablo</Text>
      
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
        <Text style={styles.checkboxLabel}>Acepto que el usuario pagó el monto acordado</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.push('/home')}
      >
        <Text style={styles.closeButtonText}>Cerrar venta</Text>
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
});
