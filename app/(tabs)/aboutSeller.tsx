import React from 'react';
import { View, Text, Image, Button, StyleSheet, FlatList, ListRenderItem } from 'react-native';
import { useRouter } from 'expo-router';

interface Product {
  id: string;
  title: string;
  offers: number;
  quantity: number;
  image: string;
}

interface Sale {
  id: string;
  title: string;
  rating: number;
  image: string;
}

const aboutSeller = () => {

    const router = useRouter();
  // Sample data for total products and star rating
  const sellerInfo = {
    totalProducts: 848,
    starRating: 4.8,
    products: [
      { id: '1', title: 'Tacos', offers: 50, quantity: 5, image: 'https://example.com/tacos.jpg' },
      { id: '2', title: 'Carne Frita', offers: 30, quantity: 32, image: 'https://example.com/carne.jpg' },
    ] as Product[],
    sales: [
      { id: '1', title: 'Comida', rating: 1.3, image: 'https://example.com/comida.jpg' },
      { id: '2', title: 'Fruta', rating: 1.3, image: 'https://example.com/fruta.jpg' },
    ] as Sale[],
  };

  const renderProduct: ListRenderItem<Product> = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productTitle}>{item.title}</Text>
      <Text style={styles.productInfo}>Ofertas: ${item.offers}</Text>
      <Text style={styles.productInfo}>Cantidad: {item.quantity}</Text>
    </View>
  );

  const renderSale: ListRenderItem<Sale> = ({ item }) => (
    <View style={styles.saleCard}>
      <Image source={{ uri: item.image }} style={styles.saleImage} />
      <Text style={styles.saleTitle}>{item.title}</Text>
      <Text style={styles.saleRating}>{item.rating}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://example.com/banner.jpg' }}
        style={styles.banner}
      />
      <View style={styles.sellerInfo}>
        <Text style={styles.sellerTitle}>Vendedor Info</Text>
        <Text style={styles.sellerSubtitle}>Nombre de usuario</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>{sellerInfo.totalProducts} productos</Text>
          <Text style={styles.statsText}>Rating: {sellerInfo.starRating} estrellas</Text>
        </View>
        <Button title="Dejar comentario" color="#D32F2F" onPress={() => {}} />
      </View>
      <Text style={styles.sectionTitle}>Productos</Text>
      <FlatList
        data={sellerInfo.products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      <Text style={styles.sectionTitle}>Ventas</Text>
      <FlatList
        data={sellerInfo.sales}
        renderItem={renderSale}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  banner: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 16,
  },
  sellerInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  sellerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sellerSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  statsText: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  productCard: {
    width: 150,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productInfo: {
    fontSize: 14,
    color: '#666666',
  },
  saleCard: {
    width: 100,
    alignItems: 'center',
    marginRight: 10,
  },
  saleImage: {
    width: '100%',
    height: 80,
    borderRadius: 10,
  },
  saleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  saleRating: {
    fontSize: 12,
    color: '#666666',
  },
});

export default aboutSeller;