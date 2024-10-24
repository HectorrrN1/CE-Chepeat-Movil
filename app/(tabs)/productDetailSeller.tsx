import React, { FC, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

interface RequestItemProps {
  name: string;
  date: string;
}

const RequestItem: FC<RequestItemProps> = ({ name, date }) => (
  <View style={styles.requestItem}>
    <Text style={styles.requestText}>Solicitud de {name} el {date}</Text>
    <TouchableOpacity style={styles.viewMoreButton} onPress={() => router.push('/userProfile')}>
      <Text style={styles.viewMoreText}>Ver más</Text>
    </TouchableOpacity>
  </View>
);

const ProductDetailScreen: FC = () => {
  
  const [paymentReceived, setPaymentReceived] = useState(false); // Mover el hook dentro del componente

  const toggleCheckbox = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setter(prev => !prev); // Alterna el valor booleano
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image
          source={require('@/assets/images/manzanas.jpg')} // Cambiado para cargar la imagen local
          style={styles.productImage}
        />
        <View style={styles.content}>
          <Text style={styles.productName}>Manzanas Orgánicas</Text>
          <Text style={styles.productPrice}>$4.99 por kilo</Text>
          <Text style={styles.productDescription}>
            Manzanas orgánicas recién recolectadas de granjas locales, perfectas para un snack saludable o para hornear.
          </Text>
          <View style={styles.deliveryContainer}>
            <Text style={styles.deliveryTime}>
              Tiempo Estimado de Entrega: 1-2 horas
            </Text>
          </View>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => toggleCheckbox(setPaymentReceived)}
          >
            <View style={styles.checkbox}>
              {paymentReceived && <Feather name="check" size={24} color="#666" />}
            </View>
            <Text style={styles.checkboxLabel}>Cumple con los Estándares de Calidad</Text>
          </TouchableOpacity>
          <Text style={styles.requestsTitle}>Solicitudes del Producto</Text>
          <RequestItem name="Diego Armando" date="10 de octubre de 2024" />
          <RequestItem name="Alexis Santana" date="9 de octubre de 2024" />
          <RequestItem name="Juan Pablo" date="8 de octubre de 2024" />
        </View>
      </ScrollView>
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
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 35,
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    color: '#FF0000',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  deliveryContainer: {
    padding: 16, // Espacio interno del contenedor
    borderWidth: 1, // Contorno del contenedor
    borderColor: '#ccc', // Color del contorno
    borderRadius: 25, // Bordes redondeados
    backgroundColor: '#fff', // Fondo blanco para que la sombra se vea
    shadowColor: '#000', // Color de la sombra
    shadowOffset: { width: 0, height: 2 }, // Dirección de la sombra
    shadowOpacity: 0.3, // Opacidad de la sombra
    shadowRadius: 3, // Radio de desenfoque de la sombra
    elevation: 4, // Para sombra en Android
    marginVertical: 0, // Margen vertical para separar el contenedor
    marginBottom: 10,
  },
  deliveryTime: {
    fontSize: 16, 
    color: '#000',
  },
  requestsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  requestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestText: {
    fontSize: 14,
    color: '#666',
  },
  viewMoreButton: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 25,
  },
  viewMoreText: {
    color: '#fff',
    fontSize: 12,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  checkboxLabel: {
    fontSize: 16,
    flex: 1,
    flexWrap: 'wrap',
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
});

export default ProductDetailScreen;
