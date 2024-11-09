import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView, View, KeyboardAvoidingView,
  Platform, TextInput, Image, Text,
  ScrollView, Alert, ActivityIndicator, Dimensions,
  FlatList, Animated, TouchableOpacity, Modal
} from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Icon } from 'react-native-elements';
import { useRouter } from 'expo-router';
import Carousel from 'react-native-snap-carousel';
import HeaderComponent from '@/components/navigation/headerComponent';
import BottomBarComponent from '@/components/navigation/bottomComponent';
import MenuBuyer from '@/components/navigation/menuBuyer';
import * as SecureStore from 'expo-secure-store';
import axios, { AxiosError } from 'axios';
import { styles } from '@/assets/styles/homeBuyer.styles'; // Importa los estilos desde el archivo separado

const { width: viewportWidth } = Dimensions.get('window');

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  measure: string;
  idSeller: string;
  latitude?: number;
  longitude?: number;
  image?: string;
}

interface Seller {
  id: string;
  storeName: string;
  description: string;
  street: string;
  extNumber: string;
  intNumber: string;
  neighborhood: string;
  city: string;
  state: string;
  cp: string;
  addressNotes?: string;
  latitude: number;
  longitude: number;
  rating: number;
  createdAt: string; // Puedes usar Date si conviertes este string a Date al recibir los datos
  updatedAt: string; // Igual que arriba, Date es una opción si haces conversión
  idUser: string;
}

interface ProductWithSeller extends Product {
  sellerData: Seller;
}



const StyledInput: React.FC<TextInput['props']> = ({ style, ...props }) => {
  return (
    <View style={styles.inputContainer}>
      <Icon name="search" type="feather" color="#999" style={styles.searchIcon} />
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor="#999"
        {...props}
      />
    </View>
  );
};

export default function homeBuyer() {

  const [overlayVisible, setOverlayVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<ProductWithSeller[]>([]);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);


  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Función para obtener productos desde la API
  const fetchProducts = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      const lat = latitude ? parseFloat(latitude.toString()) : null;
      const lon = longitude ? parseFloat(longitude.toString()) : null;

      if (lat === null || lon === null) {
        Alert.alert('Error', 'No se pudo obtener la ubicación actual.');
        return;
      }

      // Obtener productos cercanos
      const response = await axios.post(
        'https://backend-j959.onrender.com/api/Product/GetProductsByRadius',
        { latitude: lat, longitude: lon, radiusKm: 500 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const productData = response.data.slice(0, 6);

      // Obtener datos de vendedores para cada producto
      const productsWithSellerData = await Promise.all(
        productData.map(async (product: Product) => {
          const sellerResponse = await axios.post(
            'https://backend-j959.onrender.com/api/Seller/SelectSellerById',
            product.idSeller,  // El `idSeller` se envía en el cuerpo de la solicitud
            { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
          );
          return { ...product, sellerData: sellerResponse.data };
        })
      );



      // Guardar datos en SecureStore
      await SecureStore.setItemAsync('products', JSON.stringify(productsWithSellerData));

      // Mostrar productos en la consola para verificación
      console.log('Productos con datos del vendedor:', productsWithSellerData);

      setProducts(productsWithSellerData);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error fetching products or seller data:', error.response?.data || error.message);
        Alert.alert('Error', error.response?.data?.title || 'No se pudieron obtener los productos.');
      } else {
        console.error('Unexpected error:', error);
        Alert.alert('Error', 'Ocurrió un error inesperado.');
      }
    }
  };




  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300, // Duración de la animación
      useNativeDriver: true,
    }).start(() => {
      setMenuVisible(false);
      setOverlayVisible(false);
    });
  };

  // Función para mostrar el sidebar y el overlay
  const openMenu = () => {
    setOverlayVisible(true);
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300, // Duración de la animación
      useNativeDriver: true,
    }).start();
  };

  // Función para alternar el estado del sidebar
  const toggleSidebar = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const carouselItems = [
    { id: 1, title: 'Un 50% de descuento', image: require('../../assets/images/concha.jpg'), description: '¡Todos los productos de panadería después de las 9 PM todos los días!' },
    { id: 2, title: '30% de descuento', image: require('../../assets/images/tacosd.jpg'), description: 'En toda la comida' },
  ];


  useEffect(() => {
    const obtenerUbicacionInicial = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Error', 'Permiso de ubicación denegado');
          setIsLoading(false);
          return;
        }

        // Obtener la ubicación actual
        const ubicacion = await Location.getCurrentPositionAsync({});
        setLatitude(ubicacion.coords.latitude);
        setLongitude(ubicacion.coords.longitude);

        // Verificar en consola las coordenadas obtenidas
        console.log("Ubicación obtenida:", ubicacion.coords);
      } catch (error) {
        console.error('Error al obtener la ubicación:', error);
        Alert.alert('Error', 'No se pudo obtener la ubicación actual.');
      } finally {
        setIsLoading(false);
      }
    };

    obtenerUbicacionInicial();
  }, []);

  useEffect(() => {
    // Llamar a la API solo cuando latitude y longitude estén definidos
    if (latitude && longitude) {
      fetchProducts();
    }
  }, [latitude, longitude]);


  const renderItem = ({ item }: { item: { title: string; image: any, description: string } }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.carouselTitle}>{item.title}</Text>
          <Text style={styles.carouselDescription}>{item.description}</Text>
        </View>
        <Image source={item.image} style={styles.carouselImage} />
      </View>
    );
  };

  const handleProductPress = (product: ProductWithSeller) => {
    router.push({
      pathname: '/productDetails',
      params: { name: product.name }  // Asegúrate de pasar solo el nombre aquí
    });
  };

  const renderProductItem = ({ item }: { item: ProductWithSeller }) => (
    <TouchableOpacity style={styles.productCard} onPress={() => handleProductPress(item)}>
      <Image source={item.image ? { uri: item.image } : require('../../assets/images/logo.png')} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      <Text style={styles.productStock}>{item.stock} {item.measure}</Text>
      <TouchableOpacity>
        <Text style={styles.productButton}>Ver más</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );



  if (errorMsg) {
    Alert.alert('Error', errorMsg);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' || Platform.OS === 'ios' ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <HeaderComponent onMenuPress={openMenu} onFilterPress={() => router.push('/filterProducts')} />
        <Modal
          transparent={true}
          visible={menuVisible}
          animationType="none"
          onRequestClose={closeMenu}
        >
          {overlayVisible && (
            <TouchableOpacity style={styles.modalOverlay} onPress={closeMenu} />
          )}
          <Animated.View style={[styles.sidebarContainer, { transform: [{ translateX: slideAnim }] }]}>
            {/* Llama el contenido del sidebar desde otro componente */}
            <MenuBuyer isOpen={menuVisible} onToggle={closeMenu} />
          </Animated.View>
        </Modal>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.searchContainer}>
            <StyledInput
              placeholder='Buscar "Pollo frito"'
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <View style={styles.mapContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#ff6e33" style={{ marginVertical: 20 }} />
            ) : (
              latitude && longitude && (
                <MapView
                  //provider={PROVIDER_GOOGLE}
                  style={styles.map}
                  region={{ latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
                >
                  <Marker coordinate={{ latitude, longitude }} />
                  {products.map((product, index) => (
                    product.latitude && product.longitude ? (
                      <Marker
                        key={index}
                        coordinate={{ latitude: product.latitude, longitude: product.longitude }}
                        title={product.name}
                      >
                        <Image source={product.image ? { uri: product.image } : require('../../assets/images/logo.png')} style={styles.carouselImage} />
                      </Marker>
                    ) : null
                  ))}
                </MapView>
              )
            )}
          </View>

          <View style={styles.carouselContainer}>
            <Carousel
              data={carouselItems}
              renderItem={renderItem}
              sliderWidth={viewportWidth}
              itemWidth={300}
              autoplay={true}
              autoplayInterval={4000}
              loop={true}
              vertical={false}
            />
          </View>

          <View style={styles.productGridContainer}>
            <Text style={styles.headerProduct}>Productos</Text>
            <FlatList
              data={products}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
        <BottomBarComponent />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}