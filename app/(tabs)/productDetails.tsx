import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, ScrollView, Text, Image, StyleSheet, TouchableOpacity, Modal, Linking, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import CheckBox from 'expo-checkbox';
import BottomBarComponent from '@/components/navigation/bottomComponent';

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
  name: string;
  price: number;
  description: string;
  image: string;
  sellerData: SellerData;
};

type ImageSource = { uri: string } | null;

const ProductDetails = () => {
  const { name } = useLocalSearchParams();  // Obtener 'name' desde los parámetros de la URL
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isChecked, setChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageSource, setImageSource] = useState<ImageSource>(null);

  // Función para normalizar el nombre (eliminar espacios extra)
  const normalizeString = (str: string) => str.trim().replace(/\s+/g, '').toLowerCase();

  useEffect(() => {
    if (!name) {
      console.warn('No se ha proporcionado un nombre para buscar en SecureStore.');
      return;
    }

const normalizedName = normalizeString(Array.isArray(name) ? name[0] : name || '');


    const fetchProductDetails = async () => {
      try {
        const storedProducts = await SecureStore.getItemAsync('products');
        if (storedProducts) {
          const products: Product[] = JSON.parse(storedProducts);

          const foundProduct = products.find((p) => normalizeString(p.name) === normalizedName);

          if (foundProduct) {
            setProduct(foundProduct);
            if (foundProduct.image && foundProduct.image.startsWith('http')) {
              setImageSource({ uri: foundProduct.image });
            }
          } else {
            console.warn('Producto no encontrado en SecureStore. Nombre buscado:', normalizedName);
          }
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

  const confirmPurchase = () => {
    setModalVisible(false);
    router.push('/confirmBuy');
    console.log('Compra confirmada');
  };

  const openMap = () => {
    if (product?.sellerData?.latitude && product?.sellerData?.longitude) {
      const mapUrl = Platform.select({
        ios: `maps://?daddr=${product.sellerData.latitude},${product.sellerData.longitude}`,
        android: `google.navigation:q=${product.sellerData.latitude},${product.sellerData.longitude}`
      });

      if (mapUrl) {
        Linking.openURL(mapUrl).catch(err => console.error('Error al abrir el mapa:', err));
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
            <Text style={styles.sellerName}>{product.sellerData.storeName}</Text>
            <Text style={styles.sellerRating}>⭐ {product.sellerData.rating}</Text>
          </View>
        </View>

        <View style={styles.checkboxContainer}>
          <CheckBox
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? '#f7b82b' : undefined}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginTop: 35,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 20,
    color: '#df1c24',
    marginBottom: 20,
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: '#df1c24',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  detailsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  detailsValue: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  purchaseButton: {
    backgroundColor: '#df1c24',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro semi-transparente
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
  },
  modalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#df1c24',
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#666',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10,
    flex: 1,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#df1c24',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    marginBottom: 20,
  },
  sellerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  sellerName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  sellerRating: {
    color: '#666',
    fontSize: 14,
  },
  mapButton: {
    backgroundColor: '#1c88df', // Color diferente para el botón del mapa
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default ProductDetails;
