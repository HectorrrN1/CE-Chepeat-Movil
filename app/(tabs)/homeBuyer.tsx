import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, KeyboardAvoidingView, Platform, TextInput, StyleSheet, Image, Text, ScrollView, Alert, ActivityIndicator, Dimensions, FlatList } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { Icon } from 'react-native-elements';
import { useRouter } from 'expo-router';
import Carousel from 'react-native-snap-carousel';

const { width: viewportWidth } = Dimensions.get('window');

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
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const carouselItems = [
    { id: 1, title: 'Un 50% de descuento', image: require('../../assets/images/concha.png'), description: '¡Todos los productos de panadería después de las 9 PM todos los días!' },
    { id: 2, title: '30% de descuento', image: require('../../assets/images/tacosd.png'), description: 'En toda la comida' },
  ];

  const productItems = [
    { id: 1, name: 'Tacos', price: '$25', amount: '3 piezas', image: require('../../assets/images/tacosd.png') },
    { id: 2, name: 'Torta', price: '$20', amount: '1 pieza', image: require('../../assets/images/torta.png') },
    { id: 3, name: 'Postre', price: '$15', amount: '1 pieza', image: require('../../assets/images/postre.png') },
    { id: 4, name: 'Pizza grande', price: '$20', amount: '/100g', image: require('../../assets/images/pizza.png') },
    { id: 5, name: 'Burrito', price: '$10', amount: '1 pieza', image: require('../../assets/images/burrito.png') },
    { id: 6, name: 'Ensalada', price: '$25', amount: '1 pieza', image: require('../../assets/images/ensalada.png') },
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setIsLoading(false);
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);
      setIsLoading(false);
    })();
  }, []);

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

  const renderProductItem = ({ item }: { item: { name: string; price: string; amount: string; image: any } }) => {
    return (
      <View style={styles.productCard}>
        <Image source={item.image} style={styles.productImage} />
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        <Text style={styles.productAmount}>{item.amount}</Text>
        <Text style={styles.productButton}>Ver más</Text>
      </View>
    );
  };

  if (errorMsg) {
    Alert.alert('Error', errorMsg);
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.headerContainer}>
          <Feather name="menu" size={24} color="black" onPress={() => console.log('Menu clicked')} />
          <Text style={styles.headerText}>Chepeat</Text>
          <Icon name="tune" type="material" color="black" onPress={() => console.log('Filter clicked')} />
        </View>
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
              <ActivityIndicator size="large" color="#df1c24" />
            ) : (
              location && (
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
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
              data={productItems}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
        <View style={styles.bottomBar}>
          <FontAwesome name="home" size={24} color="black" />
          <FontAwesome name="th-large" size={24} color="gray" />
          <FontAwesome name="heart" size={24} color="gray" />
          <FontAwesome name="shopping-basket" size={24} color="gray" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 35,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5'
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
  },
  searchContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    width: '100%',
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  mapContainer: {
    width: '100%',
    height: 300,
    alignItems: 'center',
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  carouselContainer: {
    marginTop: 20,
  },
  card: {
    backgroundColor: '#df1c24',
    borderRadius: 15,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    height: 120,
  },
  cardContent: {
    flex: 1,
    paddingRight: 10,
    height: '100%',
  },
  carouselImage: {
    width: 80,
    height: 80,
    borderRadius: 15,
    marginLeft: 10,
  },
  carouselTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  carouselDescription: {
    fontSize: 14,
    color: '#fff',
  },
  productGridContainer: {
    marginTop: 20,
    flex: 1,
  },
  headerProduct: {
    fontSize: 20,

  },
  productCard: {
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    width: (viewportWidth / 2) - 25,
    padding: 10,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: '100%', 
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,

  },
  productPrice: {
    fontSize: 14,
    color: '#df1c24',
    fontWeight: 'bold',
  },
  productAmount: {
    fontSize: 12,
    color: '#999',
  },
  productButton: {
    fontSize: 12,
    color: '#df1c24',
    marginTop: 10,
    fontWeight: '600',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  }
});

