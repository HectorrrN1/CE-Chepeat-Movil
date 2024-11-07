import React, { useState, useRef, FC, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Modal, Animated, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Sidebar from '@/components/navigation/sidebar';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

// Define la interfaz para los props del componente
interface ProductItemProps {
  name: string;
  description: string;
  price: number;
  stock: number;
  measure: string;
  imageUrl: string;
}

// Aplica la interfaz a los props del componente
const ProductItem: FC<ProductItemProps> = ({ name, description, price, stock, measure, imageUrl }) => (
  <View style={styles.productItem}>
    <Image source={{ uri: imageUrl }} style={styles.productImage} />
    <View style={styles.productInfo}>
      <Text style={styles.productName}>{name}</Text>
      <Text style={styles.productDescription}>{description}</Text>
      <Text style={styles.productPrice}>${price} por {measure}</Text>
      <Text style={[styles.productStock, stock > 0 ? styles.inStock : styles.outOfStock]}>
        {stock > 0 ? `${stock} en stock` : 'Sin Stock'}
      </Text>
    </View>
  </View>
);

export default function VendorProductList() {
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const [sellerData, setSellerData] = useState<any>(null); // Estado para almacenar los datos del vendedor
  const [products, setProducts] = useState<any[]>([]); // Estado para almacenar los productos

  // Función para ocultar el sidebar con animación
  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300,
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
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const fetchProductsBySellerId = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) {
        console.error('Error: No se encontró el token de usuario');
        alert('Error: No se encontró el token de usuario.');
        return;
      }

      const sellerDataString = await SecureStore.getItemAsync('sellerData');
      let sellerId = null;

      if (sellerDataString) {
        const sellerData = JSON.parse(sellerDataString);

        if (sellerData && sellerData.id) {
          sellerId = sellerData.id;
          console.log('ID del vendedor recuperado:', sellerId);
        } else {
          console.error('Error: No se encontró el id del vendedor');
          alert('Error: No se encontró el id del vendedor.');
          return;
        }
      }

      console.log('Datos a enviar:', sellerId);

      const response = await axios.post(
        'https://backend-j959.onrender.com/api/Product/GetProductsByIdSeller',
        sellerId,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        console.log('Productos obtenidos exitosamente:', response.data);
        setProducts(response.data); // Directamente asignar el arreglo de productos
      } else {
        console.error('Error en la respuesta:', response);
        alert('Error al obtener los productos');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error en la respuesta de la API:', error.response?.data);
        alert('Error en la solicitud a la API');
      } else {
        console.error('Error desconocido:', error);
        alert('Ha ocurrido un error inesperado.');
      }
    }
  };

  useEffect(() => {
    fetchProductsBySellerId();
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
        {products && products.length > 0 ? (
          products.map((product: any) => (
            <TouchableOpacity key={product.id} onPress={() => router.push(`/productDetailSeller`)} activeOpacity={1}>
              <ProductItem
                name={product.name}
                description={product.description}
                price={product.price}
                stock={product.stock}
                measure={product.measure}
                imageUrl={product.imageUrl || 'default-image-url'} // Asumiendo una imagen por defecto si no hay URL
              />
            </TouchableOpacity>
          ))
        ) : (
          <Text>No se encontraron productos disponibles</Text>
        )}
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
        <Animated.View style={[styles.sidebarContainer, { transform: [{ translateX: slideAnim }] }]} >
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
    marginBottom: 50,
  },
  productItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  productStock: {
    fontSize: 14,
  },
  inStock: {
    color: 'green',
  },
  outOfStock: {
    color: 'red',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 10,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 300,
    backgroundColor: 'white',
    elevation: 5,
  },
});
