import React, { useState, useRef, useEffect } from 'react';
import { View, Button, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image, Modal, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Sidebar from '@/components/navigation/sidebar';
import { useRouter } from 'expo-router';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import { Platform, Alert } from 'react-native';
import base64 from 'base-64';
import * as Sharing from 'expo-sharing';


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
  const [requests, setRequests] = useState<any[]>([]); // Estado para solicitudes de productos

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

  // Obtener datos del usuario desde SecureStore
  const fetchUserData = async () => {
    try {
      const userDataString = await SecureStore.getItemAsync('userData');
      const userData = userDataString ? JSON.parse(userDataString) : null;

      if (userData && userData.user) {
        console.log('Datos del usuario:', userData);
        setIsSeller(userData.user.isSeller || false);
        return userData;
      } else {
        console.warn('No se encontraron datos de usuario en SecureStore');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Obtener y guardar datos del vendedor y del usuario combinados
  const obtenerYGuardarDatosCombinados = async () => {
    try {
      const userData = await fetchUserData();
      if (!userData) return;

      const token = userData.token;
      const idUser = userData.user.id;

      if (!token || !idUser) {
        console.error('Error: No se encontró el token o idUser');
        return;
      }

      const sellerResponse = await axios.post(
        'https://backend-j959.onrender.com/api/seller/SelectSellerByIdUser',
        idUser, // Enviar solo el ID como cadena de texto en el cuerpo
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const sellerData = sellerResponse.data;
      console.log('Datos del vendedor obtenidos:', sellerData);

      if (sellerData) {
        setSellerData(sellerData);

        // Combina ambos datos en un solo objeto
        const combinedData = { ...userData, sellerData };

        // Guarda el objeto combinado en SecureStore
        await SecureStore.setItemAsync('combinedUserData', JSON.stringify(combinedData));
        console.log('Datos del usuario y su negocio guardados en SecureStore:', combinedData);
      } else {
        console.error('No se encontraron datos del vendedor.');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Si el error es de Axios, puedes acceder a response y message
        console.error('Error al obtener los datos combinados del usuario y vendedor:', error.response?.data || error.message);
      } else {
        // Si el error es de otro tipo
        console.error('Error desconocido:', error);
      }
    }
  };

  // Obtener productos del vendedor usando su ID
  const obtenerProductosPorIdSeller = async () => {
    try {
      const combinedDataString = await SecureStore.getItemAsync('combinedUserData');
      const combinedData = combinedDataString ? JSON.parse(combinedDataString) : null;

      if (!combinedData || !combinedData.sellerData) {
        console.warn('No se encontraron datos de vendedor en SecureStore');
        return;
      }

      const sellerId = combinedData.sellerData.id;
      const token = combinedData.token;

      if (!token || !sellerId) {
        console.error('Error: No se encontró el token o el ID del vendedor');
        return;
      }

      const productsResponse = await axios.post(
        'https://backend-j959.onrender.com/api/Product/GetProductsByIdSeller',
        sellerId, // Enviar el ID del vendedor en el cuerpo de la solicitud
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const productsData = productsResponse.data;
      console.log('Productos obtenidos:', productsData);

      if (productsData) {
        const productosOrdenados = productsResponse.data.sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

        // Tomar los tres productos más recientes
        const lastThreeProducts = productosOrdenados.slice(0, 3); // Tomar los primeros tres productos

        setProducts(lastThreeProducts);  // Actualizamos el estado con estos productos
      } else {
        console.warn('No se encontraron productos para este vendedor.');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error al obtener los productos del vendedor:', error.response?.data || error.message);
      } else {
        console.error('Error desconocido:', error);
      }
    }
  };

  // Hook para cargar los productos después de obtener los datos del vendedor
  useEffect(() => {
    obtenerYGuardarDatosCombinados().then(() => {
      obtenerProductosPorIdSeller();
    });
  }, []);

  // Método para obtener la fuente de la imagen
  const getImageSource = (imageUrl: string | undefined) => {
    // Si `imageUrl` está presente y no es una cadena vacía, la usa, de lo contrario, usa la imagen predeterminada
    return imageUrl && imageUrl.trim() !== '' ? { uri: imageUrl } : require('../../assets/images/logo.png');
  };

  // Obtener solicitudes del comprador
  const fetchRequestsByBuyer = async () => {
    try {
      const combinedDataString = await SecureStore.getItemAsync('combinedUserData');
      const combinedData = combinedDataString ? JSON.parse(combinedDataString) : null;

      if (!combinedData || !combinedData.sellerData) {
        console.warn('No se encontraron datos de vendedor en SecureStore');
        return;
      }

      const sellerId = combinedData.sellerData.id;
      const token = combinedData.token;

      if (!token || !sellerId) {
        console.error('Error: No se encontró el token o el ID del vendedor');
        return;
      }

      const response = await axios.post(
        'https://backend-j959.onrender.com/api/Transaction/ViewBySeller',
        sellerId, // Enviar el ID del vendedor en el cuerpo de la solicitud
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const requestData = response.data;
      console.log('Solicitudes obtenidas:', requestData);

      if (requestData && requestData.length > 0) {
        setRequests(requestData);
      } else {
        setRequests([]); // Si no hay solicitudes, establecemos un array vacío
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error al obtener las solicitudes:', error.response?.data || error.message);
      } else {
        console.error('Error desconocido:', error);
      }
    }
  };

  // Hook para cargar las solicitudes después de montar el componente
  useEffect(() => {
    fetchRequestsByBuyer();
  }, []);

  const exportarProductosAExcel = async () => {
    try {
      const combinedDataString = await SecureStore.getItemAsync('combinedUserData');
      const combinedData = combinedDataString ? JSON.parse(combinedDataString) : null;

      if (!combinedData || !combinedData.sellerData) {
        console.warn('No se encontraron datos de vendedor en SecureStore');
        return;
      }

      const sellerId = combinedData.sellerData.id;
      const token = combinedData.token;

      if (!token || !sellerId) {
        console.error('Error: No se encontró el token o el ID del vendedor');
        return;
      }

      const response = await axios.post(
        'https://backend-j959.onrender.com/api/FileExport/ExportToExcelSalesHistoryBySeller',
        sellerId,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer', // Descargar el archivo como un buffer
        }
      );

      // Convertir el array buffer a Base64
      const base64Data = base64.encode(String.fromCharCode(...new Uint8Array(response.data)));

      // Definir la ruta donde se guardará el archivo
      const fileName = 'productos_vendedor.xlsx';
      const fileUri =
        Platform.OS === 'android'
          ? `${FileSystem.documentDirectory}/${fileName}` // Android
          : `${FileSystem.documentDirectory}${fileName}`; // iOS

      // Guardar el archivo en Base64
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Compartir el archivo directamente
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Archivo exportado', `El archivo Excel se guardó en:\n${fileUri}`);
      }
      console.log('Archivo Excel guardado:', fileUri);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error al exportar productos a Excel:', error.response?.data || error.message);
      } else {
        console.error('Error desconocido:', error);
      }
      Alert.alert('Error', 'Hubo un problema al exportar los productos.');
    }
  };


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
              <TouchableOpacity key={product.id} onPress={() => router.push(`/productDetailSeller?id=${product.id}`)} activeOpacity={1}>
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
            <Text style={styles.noProductsText}>Aun no ha agregado productos a vender</Text>
          )}
        </ScrollView>

        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/addProductSeller')}>
          <Text style={styles.addButtonText}>Agregar Producto</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Solicitudes de Productos en Curso</Text>
        <View style={styles.productContainer}>
          {requests && requests.length > 0 ? (
            requests.map((request: any, index: number) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  router.push({ pathname: '/completeTransaction', params: { idPurchaseRequest: request.idPurchaseRequest, id: request.id, } })
                }
                activeOpacity={1}
              >
                <View style={styles.sectionContainer}>
                  {/* Nombre del comprador */}
                  <Text style={styles.buyerNameText}>{request.buyerName}</Text>

                  {/* Contenedor del nombre del producto y la fecha */}
                  <View style={styles.productRow}>
                    <Text style={styles.productNameText}>{request.productName}</Text>
                    <Text style={styles.requestDateText}>
                      {new Date(request.requestDate).toLocaleDateString()} {/* Formato amigable */}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noRequestsText}>Aún no tienes solicitudes pendientes</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Mis Ventas</Text>
        <View style={styles.productContainer}>
          <View style={styles.sectionContainer}>
            <HistoryItem name="Michael Brown compró Verduras Frescas" time="Hace 2 días" />
          </View>
        </View>



        <Text style={styles.sectionTitle}>Descargar Historial de Ventas</Text>
        <View style={styles.productContainer}>
          <View style={styles.sectionContainer}>
            {/* Botón para exportar productos a Excel */}
            <Button
              title="Exportar productos a Excel"
              onPress={exportarProductosAExcel}
            />
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
    paddingHorizontal: 5,
    marginTop: 35,
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
  buyerNameText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  productNameText: {
    fontSize: 14,
    color: '#666',
    flex: 1, // Ocupa todo el espacio disponible
  },
  requestDateText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  noProductsText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
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
  noRequestsText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  buttonContainer: {
    margin: 16,
    width: '100%',
    alignItems: 'center',

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