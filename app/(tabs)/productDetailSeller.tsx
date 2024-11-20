import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import axios from 'axios';
import Feather from 'react-native-vector-icons/Feather';
import * as SecureStore from 'expo-secure-store';

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Obtiene el ID del producto desde los parámetros de la URL
  const [product, setProduct] = useState<{
    name: string;
    description: string;
    price: number;
    stock: number;
    measure: string;
    imageUrl: string;
  } | null>(null);
  const [paymentReceived, setPaymentReceived] = useState(false);

  // Función para alternar el estado del checkbox
  const toggleCheckbox = (setChecked: React.Dispatch<React.SetStateAction<boolean>>) => {
    setChecked((prev) => !prev);
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken'); // Obtener el token guardado

        console.log('Token:', token);  // Verifica si el token está presente

        if (!token) {
          console.error('No se encontró el token');
          return;  // Si no hay token, no se hace la petición
        }

        const response = await axios.post('https://backend-j959.onrender.com/api/Product/GetProductById?id',
          id,
          {
            headers: {
              'Authorization': `Bearer ${token}`,  // Usar el token en la cabecera
              'Content-Type': 'application/json',
            },
          }
        );
        setProduct(response.data);  // Si la respuesta es exitosa, guardar los detalles del producto
      } catch (error: unknown) {
        // Verificación del tipo de error
        if (axios.isAxiosError(error)) {
          console.error('Error al obtener los detalles del producto:', error.response ? error.response.data : error.message);
        } else {
          console.error('Error desconocido:', error);
        }
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  if (!product) {
    return <Text>Cargando detalles del producto...</Text>;  // Muestra mensaje mientras se carga el producto
  }

  const handleDeleteProduct = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken'); // Obtener el token guardado

      if (!token) {
        console.error('No se encontró el token');
        return; // Si no hay token, no se realiza la petición
      }

      const response = await axios.post(
        'https://backend-j959.onrender.com/api/Product/DeleteProduct',
        id, // Enviar el ID del producto en el cuerpo de la petición
        {
          headers: {
            'Authorization': `Bearer ${token}`,  // Usar el token en la cabecera
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        alert('Producto eliminado exitosamente');
        router.push('/sellerProducts'); // Redireccionar después de la eliminación si es necesario
      } else {
        console.error('Error al eliminar el producto:', response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error al eliminar el producto:', error.response ? error.response.data : error.message);
      } else {
        console.error('Error desconocido:', error);
      }
    }
  };

  const confirmDeleteProduct = () => {
    Alert.alert(
      'Confirmación de eliminación',
      '¿Estás seguro de que deseas eliminar este producto?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Sí',
          onPress: handleDeleteProduct,
        },
      ]
    );
  };

  const handleUpdateProduct = () => {
    router.push({
      pathname: '/updateProductSeller', // Asegúrate de que esta ruta exista en tu configuración
      params: {
        id: id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        measure: product.measure,
      },
    });
  };

  

  // Método para obtener la fuente de la imagen
  const getImageSource = (imageUrl: string | undefined) => {
    // Si `imageUrl` está presente y no es una cadena vacía, la usa, de lo contrario, usa la imagen predeterminada
    return imageUrl && imageUrl.trim() !== '' ? { uri: imageUrl } : require('../../assets/images/logo.png');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Image source={getImageSource(product.imageUrl)} style={styles.productImage} />
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>${product.price} MXN</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
          <Text style={styles.productStock}>Stock: {product.stock}</Text>
          <Text style={styles.productMeasure}>Medida: {product.measure}</Text>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => toggleCheckbox(setPaymentReceived)}
          >
            <View style={styles.checkbox}>
              {paymentReceived && (
                <Feather name="check" size={24} color="#666" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>
              Cumple con los Estándares de Calidad
            </Text>
          </TouchableOpacity>
          <Text style={styles.requestsTitle}>Solicitudes del Producto</Text>

          <TouchableOpacity onPress={() => router.push(`/userProfile`)} activeOpacity={1}>
            <View style={styles.sectionContainer}>
              <RequestItem name="Diego Armando" date="Hace 2 horas" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push(`/userProfile`)} activeOpacity={1}>
            <View style={styles.sectionContainer}>
              <RequestItem name="Alexis Santana" date="Hace 1 horas" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push(`/userProfile`)} activeOpacity={1}>
            <View style={styles.sectionContainer}>
              <RequestItem name="Juan Pablo" date="Hace 30 minutos" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.updateButton, styles.halfButton]} onPress={handleUpdateProduct}>
            <Text style={styles.updateButtonText}>Modificar producto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.deleteButton, styles.halfButton]} onPress={confirmDeleteProduct}>
            <Text style={styles.deleteButtonText}>Eliminar producto</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push('/home')}>
          <Feather name="home" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/sellerProducts')}>
          <Feather name="list" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/profileSeller')}>
          <Feather name="user" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Componente de ejemplo para una solicitud individual
function RequestItem({ name, date }: { name: string; date: string }) {
  return (
    <View style={styles.requestItem}>
      <Text style={styles.requestText}>{name}</Text>
      <Text style={styles.requestText}>{date}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  productStock: { // Agregado
    fontSize: 16,
    color: '#000', // Puedes ajustar el color según tus preferencias
    marginBottom: 10,
  },
  productMeasure: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  deliveryContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
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
  buttonRow: {
    flexDirection: 'row', // Alinea los botones en una fila horizontal
    justifyContent: 'space-between', // Espaciado uniforme entre los botones
    marginHorizontal: 12, // Margen a los lados de la fila
    bottom: 10, // Espacio desde el borde inferior
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
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});

