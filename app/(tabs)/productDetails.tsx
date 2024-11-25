import React, { useState, useEffect } from 'react';
import {
  View, SafeAreaView, ScrollView, Text, Image,
  TouchableOpacity, Modal, Linking, Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import CheckBox from 'expo-checkbox';
import BottomBarComponent from '@/components/navigation/bottomComponent';
import styles from '@/assets/styles/productDetails';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid'; // Para generar UUID

// Definimos los tipos de los datos del producto
type SellerData = {
  storeName: string;
  rating: number;
  image: string;
  latitude: number;
  longitude: number;
  street: string;
  intNumber: number;
  neighborhood: string;
  city: string;
  state: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  sellerData: SellerData;
};

type ImageSource = { uri: string } | null;

const ProductDetails = () => {
  const { name } = useLocalSearchParams(); // Obtener 'name' desde los parámetros de la URL
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isChecked, setChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageSource, setImageSource] = useState<ImageSource>(null);

  // Función para normalizar el nombre (eliminar espacios extra)
  const normalizeString = (str: string) => str.trim().replace(/\s+/g, '').toLowerCase();

  useEffect(() => {
    if (!name) {
      console.warn('No se ha proporcionado un nombre para buscar ');
      return;
    }

    const normalizedName = normalizeString(Array.isArray(name) ? name[0] : name || '');
    console.log("Buscando producto con el nombre normalizado:", normalizedName);

    const fetchProductDetails = async () => {
      try {
        const storedProducts = await AsyncStorage.getItem('products');
        if (!storedProducts) {
          console.warn('No se encontraron productos:');
          return;
        }

        const products: Product[] = JSON.parse(storedProducts);
        console.log('Productos encontrados:', products);

        const foundProduct = products.find(
          (p) => normalizeString(p.name).toLowerCase() === normalizedName.toLowerCase()
        );

        if (foundProduct) {
          setProduct(foundProduct);
          if (foundProduct.image && foundProduct.image.startsWith('http')) {
            setImageSource({ uri: foundProduct.image });
          }
        } else {
          console.warn('Producto no encontrado:', normalizedName);
        }
      } catch (error) {
        console.error('Error al obtener los detalles del producto:', error);
      }
    };

    fetchProductDetails();
  }, [name]);

  const handlePurchase = () => {
    setModalVisible(true);
  };

  const cancelPurchase = () => {
    setModalVisible(false);
  };

  const confirmPurchase = async () => {
    console.log("confirmPurchase fue llamado");
    setModalVisible(false);

    try {
      // Obtener el token de autorización
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) {
        console.warn('Token no encontrado');
        return;
      }

      // Obtener los datos del usuario
      const userDataString = await SecureStore.getItemAsync('userData');
      console.log("Datos del usuario recuperados de SecureStore:", userDataString);

      if (!userDataString) {
        console.warn('Datos del usuario no encontrados');
        return;
      }

      // Acceder al id del comprador (idBuyer)
      const userData = JSON.parse(userDataString);
      const idBuyer = userData.user?.id; // Ajusta al formato almacenado
      console.log("idBuyer obtenido:", idBuyer);

      // Validar que todos los datos necesarios están presentes
      if (!product?.id || !idBuyer) {
        console.warn('Faltan datos para realizar la compra.');
        return;
      }

      // Crear el objeto de solicitud
      const purchaseRequest = {
        idProduct: product.id,
        idBuyer: idBuyer,
      };

      console.log("Datos que se enviarán en la solicitud:", purchaseRequest);

      // Realizar la solicitud a la API
      const response = await axios.post(
        'https://backend-j959.onrender.com/api/PurchaseRequest/Create',
        purchaseRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Respuesta de la API:', response.data);

      // Redirigir al homeBuyer y mostrar el modal
      router.push('/homeBuyer'); // Redirige a la vista de buyer
      // Mostrar el modal en homeBuyer (se manejaría en esa vista)
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Error al hacer la solicitud de compra:', error.response?.data || error.message);
      } else {
        console.error('Error inesperado:', error);
      }
    }
  };




  const openMap = () => {
    if (product?.sellerData?.latitude && product?.sellerData?.longitude) {
      const mapUrl = Platform.select({
        ios: `maps://?daddr=${product.sellerData.latitude},${product.sellerData.longitude}`,
        android: `google.navigation:q=${product.sellerData.latitude},${product.sellerData.longitude}`,
      });

      if (mapUrl) {
        Linking.openURL(mapUrl).catch((err) => console.error('Error al abrir el mapa:', err));
      }
    }
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Producto no encontrado.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {imageSource ? (
          <Image source={imageSource} style={styles.productImage} />
        ) : (
          <Text style={styles.errorText}>Imagen no disponible</Text>
        )}

        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>

        <View style={styles.detailsContainer}>
          <TouchableOpacity onPress={openMap}>
            <Text style={styles.detailsText}>Dirección</Text>
            <Text style={styles.detailsValue}>
              {product.sellerData.street}, {product.sellerData.intNumber}, {product.sellerData.city}, {product.sellerData.state}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sellerCard}>
          <Image
            source={{ uri: product.sellerData.image || 'https://via.placeholder.com/50' }}
            style={styles.sellerIcon}
          />
          <View>
            <TouchableOpacity onPress={() => router.push('/aboutSeller')}>
              <Text style={styles.sellerName}>{product.sellerData.storeName}</Text>
              <Text style={styles.sellerRating}>⭐ {product.sellerData.rating}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.checkboxContainer}>
          <CheckBox
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? '#ff6e33' : undefined}
          />
          <Text style={styles.checkboxText}>Estoy de acuerdo con las condiciones del producto</Text>
        </View>

        <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase}>
          <Text style={styles.buttonText}>Comprar</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={cancelPurchase}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>¿Estás seguro de que deseas realizar la compra?</Text>
              <Text style={styles.modalPrice}>Total: ${product.price.toFixed(2)}</Text>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={cancelPurchase}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton} onPress={confirmPurchase}>
                  <Text style={styles.buttonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
      <BottomBarComponent />
    </SafeAreaView>
  );
};

export default ProductDetails;
