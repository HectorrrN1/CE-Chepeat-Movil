import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image, Modal, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
// Importa el contenido del sidebar desde otro archivo
import Sidebar from '@/components/navigation/sidebar';
import { useRouter } from 'expo-router';


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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={openSidebar}>
          <Feather name="menu" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cheapeat</Text>
      </View>

      <ScrollView style={styles.content}>

        {/*<TouchableOpacity onPress={() => router.push(`/productDetail?name=${name}`)}>
          <View style={styles.productItemContainer}>
            <View style={styles.productItem}>
              <Image source={image} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{name}</Text>
                <Text style={styles.productPrice}>${price}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        */}
        <Text style={styles.sectionTitle}>Mis Productos</Text>
        <View style={styles.productContainer}>
          <TouchableOpacity
            onPress={() => router.push(`/productDetailSeller`)}
            activeOpacity={1}
          >
            <ProductItem
              name="Verduras Frescas"
              price="12.99"
              image={require('@/assets/images/verduras.jpg')}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push(`/productDetailSeller`)}
            activeOpacity={1}
          >
          <ProductItem 
            name="Pan Artesanal" 
            price="5.50" 
            image={require('@/assets/images/pan.jpg')} 
          />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/addProductSeller')} // Usa el nombre de la pantalla
        >
          <Text style={styles.addButtonText}>Agregar Producto</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Solicitudes de Productos</Text>
        <View style={styles.productContainer}>
          <TouchableOpacity
            onPress={() => router.push(`/userProfile`)}
            activeOpacity={1}
          >
            <View style={styles.sectionContainer}>
              <RequestItem name="Juan Pablo" time="Hace 2 horas" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push(`/userProfile`)}
            activeOpacity={1}
          >
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

      {/* Modal que representa el sidebar */}
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
          {/* Llama el contenido del sidebar desde otro componente */}
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
  productItemContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#F9F9F9',
    borderRadius: 15,
    borderColor: '#7E7E7E',
    borderWidth: 1,
    shadowColor: '#000',
    shadowRadius: 5,
    elevation: 3,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
    marginRight: 12,
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
  addButton: {
    width: '100%',
    marginBottom: 10,
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