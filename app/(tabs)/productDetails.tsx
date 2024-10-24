import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, ScrollView, Text, Image, StyleSheet, TouchableOpacity, Modal, Linking, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import CheckBox from 'expo-checkbox';
import BottomBarComponent from '@/components/navigation/bottomComponent';

type ImageSource = { uri: string } | null;

const ProductDetails = () => {
  const router = useRouter();
  const { name, price, amount } = useLocalSearchParams();
  const [isChecked, setChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { image } = useLocalSearchParams();
  const [imageSource, setImageSource] = useState<ImageSource>(null);

  useEffect(() => {
    if (typeof image === 'string' && image.startsWith('http')) {
      setImageSource({ uri: image });
    } else {
      console.warn('No se pudo cargar la imagen. Verifica el valor del parámetro image:', image);
    }
  }, [image]);

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
    const destinationAddress = "Avenida Universidad Tecnológica, No. 1000, El Carmen, 42830 Hgo.";

    // Detectar si es Android o iOS y construir la URL adecuada
    const mapUrl = Platform.select({
      ios: `maps://?daddr=${encodeURIComponent(destinationAddress)}`,  // URL para Apple Maps
      android: `google.navigation:q=${encodeURIComponent(destinationAddress)}` // URL para Google Maps en Android
    });

    if (mapUrl) {
      Linking.openURL(mapUrl).catch(err => console.error('Error al abrir el mapa:', err));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {imageSource ? (
          <Image source={imageSource} style={styles.productImage} />
        ) : (
          <Text style={styles.errorText}>Imagen no disponible</Text>
        )}

        <Text style={styles.productName}>{name}</Text>
        <Text style={styles.productPrice}>${price}</Text>
        <Text style={styles.productDescription}>{amount} rollos de sushi variados</Text>

        <View style={styles.detailsContainer}>
          <Text style={styles.detailsText}>Dirección</Text>
          <Text style={styles.detailsValue}>Avenida Universidad Tecnológica, No. 1000, El Carmen, 42830 Hgo.</Text>
          <Text style={styles.detailsText}>Hora de entrega</Text>
          <Text style={styles.detailsValue}>11:30 p.m.</Text>
        </View>

        <View style={styles.checkboxContainer}>
          <CheckBox
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? '#f7b82b' : undefined}
          />
          <Text style={styles.checkboxText}>Estoy de acuerdo con las condiciones del producto</Text>
        </View>

        {/* Botón para iniciar la ruta de viaje */}
        <TouchableOpacity style={styles.mapButton} onPress={openMap}>
          <Text style={styles.buttonText}>Iniciar ruta de viaje</Text>
        </TouchableOpacity>

        {/* Card del vendedor */}
        <View style={styles.sellerCard}>
          <Image
            source={{ uri: 'https://via.placeholder.com/50' }}
            style={styles.sellerIcon}
          />
          <View>
            <Text style={styles.sellerName}>Diego Armando</Text>
            <Text style={styles.sellerRating}>⭐ 4.9</Text>
          </View>
        </View>

        {/* Botón de compra */}
        <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase}>
          <Text style={styles.buttonText}>Comprar</Text>
        </TouchableOpacity>

        {/* Modal de confirmación */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={cancelPurchase}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalText}>¿Estás seguro de que deseas realizar la compra?</Text>
              <Text style={styles.modalPrice}>Total: ${price}</Text>

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
