import React, { useState, useRef, FC, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Modal, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Sidebar from '@/components/navigation/sidebar';
import * as SecureStore from 'expo-secure-store';

// Define la interfaz para los props del componente
interface ProductItemProps {
  name: string;
  price: string;
  status: string;
  imageUrl: any; // Cambiamos el tipo a 'any' para permitir 'require'
}

// Aplica la interfaz a los props del componente
const ProductItem: FC<ProductItemProps> = ({ name, price, status, imageUrl }) => (
  <View style={styles.productItem}>
    <Image source={imageUrl} style={styles.productImage} />
    <View style={styles.productInfo}>
      <Text style={styles.productName}>{name}</Text>
      <Text style={styles.productPrice}>${price} por lb</Text>
    </View>
    <Text style={[styles.productStatus, status === 'En Stock' ? styles.inStock : styles.outOfStock]}>
      {status}
    </Text>
  </View>
);

export default function VendorProductList() {
  const router = useRouter(); // Hook para navegar entre pantallas

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;

  // Función para ocultar el sidebar con animación 'timing'
  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300, // Duración de la animación
      useNativeDriver: true,
    }).start(() => {
      setSidebarVisible(false);
      setOverlayVisible(false);
    });
  };

  // Función para mostrar el sidebar y el overlay
  const openSidebar = () => {
    setOverlayVisible(true);
    setSidebarVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300, // Duración de la animación
      useNativeDriver: true,
    }).start();
  };

  // Función para obtener datos del SecureStore
  const fetchUserData = async () => {
    try {
      const userDataString = await SecureStore.getItemAsync('userData');
      const userData = userDataString ? JSON.parse(userDataString) : null;

      if (userData) {
        console.log('Datos del usuario:', userData); // Mostrar datos en la consola
      } else {
        console.warn('No se encontraron datos de usuario en SecureStore');
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  };

  // Usar useEffect para recuperar los datos al montar el componente
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={openSidebar}>
          <Feather name="menu" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vendedor Cheapeat</Text>
        <View style={styles.headerIcons}>
          <Feather name="bell" size={24} color="black" style={styles.icon} />
        </View>
      </View>
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderTitle}>Tus Productos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/addProductSeller')}
        >
          <Text style={styles.addButtonText}>Añadir Nuevo</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.productList}>
        <TouchableOpacity onPress={() => router.push(`/productDetailSeller`)} activeOpacity={1}>
          <ProductItem
            name="Tomates Orgánicos"
            price="3.50"
            status="En Stock"
            imageUrl={require('@/assets/images/tomate.jpg')}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push(`/productDetailSeller`)} activeOpacity={1}>
          <ProductItem
            name="Papas Orgánicas"
            price="1.20"
            status="En Stock"
            imageUrl={require('@/assets/images/papas.jpg')}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push(`/productDetailSeller`)} activeOpacity={1}>
          <ProductItem
            name="Zanahorias Orgánicas"
            price="2.00"
            status="Agotado"
            imageUrl={require('@/assets/images/carrots.jpg')}
          />
        </TouchableOpacity>
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

      {/* Modal para el sidebar */}
      <Modal
        transparent={true}
        visible={sidebarVisible}
        animationType="none"
        onRequestClose={closeSidebar}
      >
        {overlayVisible && (
          <TouchableOpacity style={styles.modalOverlay} onPress={closeSidebar} />
        )}
        <Animated.View style={[styles.sidebarContainer, { transform: [{ translateX: slideAnim }] }]}>
          <Sidebar isOpen={sidebarVisible} onToggle={closeSidebar} />
        </Animated.View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 35,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginRight: 16,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  subHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#df1c24',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 25,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  productList: {
    flex: 1,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#666',
  },
  productStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  inStock: {
    color: '#4CAF50',
  },
  outOfStock: {
    color: '#F44336',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  sidebarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 300,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
