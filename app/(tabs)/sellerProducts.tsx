import React, { FC } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

// Define la interfaz para los props del componente
interface ProductItemProps {
  name: string;
  price: string;
  status: string;
  imageUrl: string;
}

// Aplica la interfaz a los props del componente
const ProductItem: FC<ProductItemProps> = ({ name, price, status, imageUrl }) => (
  <View style={styles.productItem}>
    <Image source={{ uri: imageUrl }} style={styles.productImage} />
    <View style={styles.productInfo}>
      <Text style={styles.productName}>{name}</Text>
      <Text style={styles.productPrice}>${price} por lb</Text>
    </View>
    <Text style={[styles.productStatus, status === 'En Stock' ? styles.inStock : styles.outOfStock]}>
      {status}
    </Text>
  </View>
);

export default function VendorProductList() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Feather name="menu" size={24} color="black" />
        <Text style={styles.headerTitle}>Vendedor Cheapeat</Text>
        <View style={styles.headerIcons}>
          <Feather name="bell" size={24} color="black" style={styles.icon} />
          <Feather name="settings" size={24} color="black" />
        </View>
      </View>
      <View style={styles.subHeader}>
        <Text style={styles.subHeaderTitle}>Tus Productos</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Añadir Nuevo</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.productList}>
        <ProductItem
          name="Tomates Orgánicos"
          price="3.50"
          status="En Stock"
          imageUrl="https://example.com/tomato.jpg"
        />
        <ProductItem
          name="Papas Orgánicas"
          price="1.20"
          status="En Stock"
          imageUrl="https://example.com/potato.jpg"
        />
        <ProductItem
          name="Zanahorias Orgánicas"
          price="2.00"
          status="Agotado"
          imageUrl="https://example.com/carrot.jpg"
        />
      </ScrollView>
      <View style={styles.navbar}>
        <Feather name="home" size={24} color="black" />
        <Feather name="list" size={24} color="black" />
        <Feather name="user" size={24} color="black" />
      </View>
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
    backgroundColor: '#ff0000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  productList: {
    flex: 1,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
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
  productStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  inStock: {
    color: '#4CAF50',
  },
  outOfStock: {
    color: '#F44336',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});
