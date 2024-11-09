import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image, Modal, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Sidebar from '@/components/navigation/sidebar';
import { useRouter } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

type ProductItemProps = {
  name: string;
  price: string;
  image: any;
};

const ProductItem: React.FC<ProductItemProps> = ({ name, price, image }) => (
  <View style={styles.productItemContainer}>
    <View style={styles.productItem}>
      <Image source={image} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{name}</Text>
        <Text style={styles.productPrice}>${price}</Text>
      </View>
    </View>
  </View>
);

type RequestItemProps = {
  name: string;
  time: string;
};

const RequestItem: React.FC<RequestItemProps> = ({ name, time }) => (
  <View style={styles.requestItem}>
    <Text style={styles.requestName}>{name}</Text>
    <Text style={styles.requestTime}>{time}</Text>
  </View>
);

type HistoryItemProps = {
  name: string;
  time: string;
};

const HistoryItem: React.FC<HistoryItemProps> = ({ name, time }) => (
  <View style={styles.historyItem}>
    <Text style={styles.historyName}>{name}</Text>
    <Text style={styles.historyTime}>{time}</Text>
  </View>
);

export default function ProductManagement() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const router = useRouter();
  const [sellerData, setSellerData] = useState(null);
  const [products, setProducts] = useState<any[]>([]); // Estado para almacenar los productos
  const [isSeller, setIsSeller] = useState(false);

  // Función para ocultar el sidebar con animación 'timing'
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

  const fetchUserData = async () => {
    try {
      const userDataString = await SecureStore.getItemAsync('userData');
      const userData = userDataString ? JSON.parse(userDataString) : null;

      if (userData && userData.user) {
        console.log('Datos del usuario:', userData);
        setIsSeller(userData.user.isSeller || false); // Acceder correctamente a isSeller dentro de user
      } else {
        console.warn('No se encontraron datos de usuario en SecureStore');
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const obtenerDatosVendedor = async () => {
    try {
      // Obtener el userData almacenado en SecureStore
      const userDataString = await SecureStore.getItemAsync('userData');
  
      if (!userDataString) {
        console.error('Error: No se encontraron los datos del usuario');
        alert('Error: No se encontraron los datos del usuario.');
        return null;
      }
  
      // Parsear los datos de usuario para obtener el token y idUser
      const userData = JSON.parse(userDataString);
      const token = userData.token; // Aquí obtienes el token directamente del objeto userData
      const idUser = userData.user.id;
  
      if (!token || !idUser) {
        console.error('Error: No se encontró el token o idUser');
        alert('Error: No se encontró el token o idUser.');
        return null;
      }
  
      // Hacer la petición a SelectSellerByIdUser
      const sellerResponse = await axios.post(
        'https://backend-j959.onrender.com/api/seller/SelectSellerByIdUser',
        idUser,  // Enviar el idUser como parte del cuerpo
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      // Guardar los datos del vendedor en SecureStore como sellerData
      const sellerData = sellerResponse.data;
      await SecureStore.setItemAsync('sellerData', JSON.stringify(sellerData));
      console.log('Datos del vendedor guardados:', sellerData);
  
      return sellerData; // Devolver los datos del vendedor para usarlos en la siguiente función
    } catch (error: any) {
      console.error('Error al obtener los datos del vendedor:', error.response?.data || error.message);
      alert('Error al obtener los datos del vendedor');
      return null;
    }
  };
  
  
  const fetchProductsBySellerId = async (sellerId: string) => {
    try {
      // Obtener los datos de usuario almacenados en SecureStore
      const userDataString = await SecureStore.getItemAsync('userData');
  
      if (!userDataString) {
        console.error('Error: No se encontraron los datos del usuario');
        alert('Error: No se encontraron los datos del usuario.');
        return;
      }
  
      // Parsear los datos de usuario para obtener el token
      const userData = JSON.parse(userDataString);
      const token = userData.token; // Aquí obtenemos el token desde userData
  
      if (!token) {
        console.error('Error: No se encontró el token de usuario');
        alert('Error: No se encontró el token de usuario.');
        return;
      }
  
      console.log('ID del vendedor para obtener productos:', sellerId);
  
      // Petición para obtener productos por ID del vendedor
      const response = await axios.post(
        'https://backend-j959.onrender.com/api/Product/GetProductsByIdSeller',
        sellerId,  // Pasamos sellerId en el cuerpo de la solicitud
        {
          headers: {
            'Authorization': `Bearer ${token}`,  // Usamos el token aquí
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 200) {
        console.log('Productos obtenidos exitosamente:', response.data);
        // Asignar los productos al estado o procesamiento necesario
        setProducts(response.data); // Directamente asignar el arreglo de productos
      } else {
        console.error('Error en la respuesta:', response);
        alert('Error al obtener los productos');
      }
    } catch (error: any) {
      console.error('Error en la respuesta de la API:', error.response?.data || error.message);
      alert('Error en la solicitud a la API');
    }
  };
  
  
  useEffect(() => {
    const obtenerDatosYProductos = async () => {
      const sellerData = await obtenerDatosVendedor(); // Paso 1: Obtener los datos del vendedor
      if (sellerData && sellerData.id) {
        await fetchProductsBySellerId(sellerData.id); // Paso 2: Obtener los productos usando el ID del vendedor
      }
    };
  
    obtenerDatosYProductos();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={openSidebar}>
          <Feather name="menu" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cheapeat</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Mis Productos</Text>
        <ScrollView style={styles.productList}>
          {products && products.length > 0 ? (
            products.map((product: any) => (
              <TouchableOpacity key={product.id} onPress={() => router.push(`/productDetailSeller`)} activeOpacity={1}>
                <View style={styles.productItemContainer}>
                  <Image source={{ uri: product.imageUrl || 'default-image-url' }} style={styles.productImage} />
                  <View style={styles.productTextContainer}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noProductsText}>Aun no ha agregado productos a vender</Text>
          )}
        </ScrollView>

        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/addProductSeller')}>
          <Text style={styles.addButtonText}>Agregar Producto</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Solicitudes de Productos</Text>
        <View style={styles.productContainer}>
          <TouchableOpacity onPress={() => router.push(`/userProfile`)} activeOpacity={1}>
            <View style={styles.sectionContainer}>
              <RequestItem name="Juan Pablo" time="Hace 2 horas" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push(`/userProfile`)} activeOpacity={1}>
            <View style={styles.sectionContainer}>
              <RequestItem name="Emily Johnson quiere comprar Pan Artesanal" time="Ayer" />
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Historial de Compras</Text>
        <View style={styles.productContainer}>
          <View style={styles.sectionContainer}>
            <HistoryItem name="Michael Brown compró Verduras Frescas" time="Hace 2 días" />
          </View>
          <View style={styles.sectionContainer}>
            <HistoryItem name="Sarah Davis compró Pan Artesanal" time="La semana pasada" />
          </View>
        </View>
      </ScrollView>

      {/* Navbar con redirección */}
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
      <Modal transparent={true} visible={sidebarVisible} animationType="none" onRequestClose={closeSidebar}>
        {overlayVisible && <TouchableOpacity style={styles.modalOverlay} onPress={closeSidebar} />}
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
    paddingHorizontal: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerTitle: {
    fontSize: 18,
    color: '#999',
    marginRight: 140,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  productList: {
    marginBottom: 50,
  },
  productItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2, // Para Android
  },

  productItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productTextContainer: {
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
  addButton: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: '#DF1C24',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginBottom: 10,
    padding: 15,
    backgroundColor: '#F9F9F9',
    borderRadius: 15,
    borderColor: '#7E7E7E',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  requestItem: {
    marginBottom: 8,
  },
  requestName: {
    fontSize: 16,
  },
  requestTime: {
    fontSize: 14,
    color: '#666',
  },
  historyItem: {
    marginBottom: 8,
  },
  historyName: {
    fontSize: 16,
  },
  historyTime: {
    fontSize: 14,
    color: '#666',
  },
  noProductsText: {
    marginHorizontal: 10, 
    marginTop: 10,
    fontSize: 16, 
    color: '#666',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  productContainer: {
    padding: 10,
    marginBottom: 10,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebarContainer: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 300,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
});
