import React, { useState, useRef, FC, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Modal, Animated, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Sidebar from '@/components/navigation/sidebar';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { Double } from 'react-native/Libraries/Types/CodegenTypes';

// Define la interfaz para los props del componente
interface ProductItemProps {
  name: string;
  description: string;
  price: Double;
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
      <Text style={styles.productPrice}>${price} MXN</Text>
      <Text style={[styles.productStock, stock > 0 ? styles.inStock : styles.outOfStock]}>
        {stock > 0 ? `${stock} ${measure}` : 'Sin Stock'}
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

  const obtenerDatosVendedor = async () => {
    try {
      // Obtener el token y los datos de usuario almacenados en SecureStore
      const token = await SecureStore.getItemAsync('userToken');
      const userDataString = await SecureStore.getItemAsync('userData');

      if (!token || !userDataString) {
        console.error('Error: No se encontraron los datos de autenticación o del usuario');
        alert('Error: No se encontraron los datos de autenticación o del usuario.');
        return null;
      }

      // Parsear los datos de usuario para obtener el idUser
      const userData = JSON.parse(userDataString);
      const idUser = userData.id;  // Aquí se obtiene el ID directamente del objeto userData

      if (!idUser) {
        console.error('Error: No se encontró el idUser');
        alert('Error: No se encontró el idUser.');
        return null;
      }

      // Hacer la petición a SelectSellerByIdUser
      const sellerResponse = await axios.post(
        'https://backend-j959.onrender.com/api/seller/SelectSellerByIdUser',
        idUser,  // Enviar el idUser como parte del cuerpo en un objeto
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
    } catch (error: unknown) {  // Especificar que error es de tipo unknown
      if (axios.isAxiosError(error)) {  // Comprobar si el error es de tipo AxiosError
        console.error('Error al obtener los datos del vendedor:', error.response?.data || error.message);
      } else {
        console.error('Error inesperado:', error);
      }
      alert('Error al obtener los datos del vendedor');
      return null;
    }
  };

  const fetchProductsBySellerId = async (sellerId: string) => {
    try {
      // Obtener el token y los datos de usuario almacenados en SecureStore
      const token = await SecureStore.getItemAsync('userToken');
      const userDataString = await SecureStore.getItemAsync('userData');

      if (!token || !userDataString) {
        console.error('Error: No se encontraron los datos de autenticación o del usuario');
        alert('Error: No se encontraron los datos de autenticación o del usuario.');
        return;
      }

      // Parsear los datos de usuario
      const userData = JSON.parse(userDataString);

      // Asegurarnos de que el userData tenga la estructura correcta
      const sellerIdFromUserData = userData.id;  // Usamos el id de userData si es necesario

      if (!sellerIdFromUserData) {
        console.error('Error: No se encontró el sellerId del usuario');
        alert('Error: No se encontró el sellerId del usuario.');
        return;
      }

      console.log('ID del vendedor para obtener productos:', sellerId);

      // Petición para obtener productos por ID del vendedor
      const response = await axios.post(
        'https://backend-j959.onrender.com/api/Product/GetProductsByIdSeller',
        sellerId,  // Enviar el sellerId como un objeto
        {
          headers: {
            'Authorization': `Bearer ${token}`,  // Usar el token en la cabecera
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        console.log('Productos obtenidos exitosamente:', response.data);
        // Asignar los productos al estado o procesamiento necesario
        setProducts(response.data);  // Aquí deberías actualizar el estado con los productos obtenidos
      } else {
        console.error('Error en la respuesta:', response);
        alert('Error al obtener los productos');
      }
    } catch (error: unknown) {  // Especificamos que el error es de tipo unknown
      if (axios.isAxiosError(error)) {  // Comprobamos si el error es un AxiosError
        console.error('Error en la respuesta de la API:', error.response?.data || error.message);
      } else {
        console.error('Error inesperado:', error);
      }
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

  // Método para obtener la fuente de la imagen
  const getImageSource = (imageUrl: string | undefined) => {
    // Si `imageUrl` está presente y no es una cadena vacía, la usa, de lo contrario, usa la imagen predeterminada
    return imageUrl && imageUrl.trim() !== '' ? { uri: imageUrl } : require('../../assets/images/logo.png');
  };

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
            <TouchableOpacity
              key={product.id}
              onPress={() => router.push(`/productDetailSeller?id=${product.id}`)} // Redirige con el ID del producto
              activeOpacity={1}
            >
              <View style={styles.productItemContainer}>
              <Image source={getImageSource(product.imageUrl)} style={styles.productImage} />
                <View style={styles.productTextContainer}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noProductsText}>Aún no ha agregado productos a vender</Text>
        )}
      </ScrollView>

      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.replace('/home')}>
          <Feather name="home" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/sellerProducts')}>
          <Feather name="list" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/profileSeller')}>
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
    marginBottom: 0,
  },
  productItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  productItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2, // Para Android
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
    color: '#333',
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
  },
  productPrice: {
    fontSize: 14,
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
  noProductsText: {
    marginHorizontal: 20,
    marginVertical: 10,
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
