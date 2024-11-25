import React, { FC, useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

interface SellerData {
  fullname: string;
  storeName: string;
  isSeller: boolean;
  isBuyer: boolean;
  email: string;
}

export default function ProfileScreen() {
  const router = useRouter(); // Hook para navegar entre pantallas
  const [sellerData, setSellerData] = useState<SellerData | null>(null);

  useEffect(() => {
    const loadSellerData = async () => {
      try {
        const storedSellerData = await SecureStore.getItemAsync('sellerData');
        if (storedSellerData) {
          const parsedData = JSON.parse(storedSellerData);
          setSellerData(parsedData);
          console.log("Datos cargados en Sidebar:", parsedData);
        } else {
          console.log("No se encontraron datos en SecureStore");
        }
      } catch (error) {
        console.error("Error al cargar sellerData:", error);
      }
    };

    loadSellerData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
            {sellerData ? sellerData.storeName.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <Text style={styles.greeting}>Hola</Text>
          <Text style={styles.username}>
          {sellerData ?.storeName}
          </Text>
        </View>
        
        <View style={styles.optionsContainer}>

          <TouchableOpacity style={styles.optionItem}>
            <Feather name="edit" size={24} color="black" />
            <Text style={styles.optionText}>Editar perfil</Text>
            <Ionicons name="chevron-forward" size={24} color="black" />
          </TouchableOpacity>
        </View>

      </ScrollView>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push('/home')}>
          <Feather name="home" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/sellerProducts')}>
          <Feather name="list" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/profileSeller')}>
          <Feather name="user" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Fondo blanco
    marginTop: 35,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop: 10,
    paddingBottom: 10, // Espaciado inferior para el encabezado
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#999', // Color gris claro para el título
  },
  
  /////////////////////////////

  profileSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    backgroundColor: '#4CAF50', // Puedes cambiar este color si lo deseas
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  greeting: {
    fontSize: 18,
    color: '#666',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
  },
  optionItem: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 17,
  },
  optionsContainer: {
    paddingHorizontal: 20,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0', // Línea superior más clara
  },
});
