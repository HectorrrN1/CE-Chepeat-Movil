import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker'; // Importación del Picker

export default function UpdateProductScreen() {
  const router = useRouter();
  const { id, idSeller } = useLocalSearchParams(); // Recibe `id` e `idSeller` como parámetros
  const [product, setProduct] = useState({
    id: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    measure: '',
    createdAt: '',
    updatedAt: '',
    idSeller: '',
  });

  useEffect(() => {
    // Cargar los detalles del producto
    const fetchProductDetails = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (!token) {
          console.error('No se encontró el token');
          return;
        }

        const response = await axios.post(
          'https://backend-j959.onrender.com/api/Product/GetProductById?id',
          id,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const data = response.data;
        setProduct({
          id: data.id,
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          measure: data.measure,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          idSeller: data.idSeller,
        });
      } catch (error) {
        console.error('Error al obtener los detalles del producto:', error);
      }
    };

    if (id) fetchProductDetails();
  }, [id]);

  const handleUpdateProduct = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) {
        Alert.alert('Error', 'No se encontró el token');
        return;
      }

      // Actualiza la fecha `updatedAt` al momento actual
      const updatedAt = new Date().toISOString();

      const response = await axios.post(
        'https://backend-j959.onrender.com/api/Product/UpdateProduct',
        {
          id: product.id,
          idSeller: product.idSeller,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          measure: product.measure,
          updatedAt,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        Alert.alert('Éxito', 'Producto actualizado correctamente');
        router.replace(`/productDetailSeller?id=${product.id}`); // Redirige a la lista de productos
      } else {
        Alert.alert('Error', 'No se pudo actualizar el producto');
      }
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      Alert.alert('Error', 'Ocurrió un problema al actualizar el producto');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.title}>Modificar Producto</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nombre del producto</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre del producto"
              value={product.name}
              onChangeText={(text) => setProduct({ ...product, name: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}  // Añadí un estilo específico para el textarea
              placeholder="Descripción"
              value={product.description}
              onChangeText={(text) => setProduct({ ...product, description: text })}
              multiline={true}  // Permite múltiples líneas
              numberOfLines={4}  // Establece el número de líneas visibles por defecto
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Precio Mnx</Text>
            <TextInput
              style={styles.input}
              placeholder="Precio"
              keyboardType="numeric"
              value={product.price.toString()}
              onChangeText={(text) =>
                setProduct({ ...product, price: parseFloat(text) || 0 })
              }
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Stock</Text>
            <TextInput
              style={styles.input}
              placeholder="Stock"
              keyboardType="numeric"
              value={product.stock.toString()}
              onChangeText={(text) =>
                setProduct({ ...product, stock: parseInt(text, 10) || 0 })
              }
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Medida</Text>
            <Picker
              selectedValue={product.measure}
              style={styles.picker}
              onValueChange={(itemValue) =>
                setProduct({ ...product, measure: itemValue })
              }
            >
              <Picker.Item label="Litros" value="Litros" />
              <Picker.Item label="Kilos" value="kilos" />
              <Picker.Item label="Piezas" value="piezas" />
              <Picker.Item label="Paquetes" value="paquetes" />
              <Picker.Item label="Unidades" value="Unidades" />
            </Picker>
          </View>

          <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProduct}>
            <Text style={styles.updateButtonText}>Actualizar Producto</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  picker: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,  // Agrega un margen inferior para separarlo del borde de la pantalla
    marginHorizontal: 10,  // Opcional: Agrega un margen lateral para no pegarlo a los bordes
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
