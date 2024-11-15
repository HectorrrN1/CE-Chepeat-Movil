import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Image, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native'; // Importar useNavigation
import { router } from 'expo-router';

export default function AddProductScreen() {
    const navigation = useNavigation(); // Usar el hook de navegación
    const [price, setPrice] = useState('');
    const [deliveryDateTime, setDeliveryDateTime] = useState(new Date());
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [idSeller, setIdSeller] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [stock, setStock] = useState('');
    const [measure, setMeasure] = useState('litros');

    // Función para obtener datos del SecureStore y extraer el id de sellerData
    const fetchUserData = async () => {
        try {
            // Obtiene los datos de sellerData de SecureStore
            const sellerDataString = await SecureStore.getItemAsync('sellerData');
            const sellerData = sellerDataString ? JSON.parse(sellerDataString) : null;

            if (sellerData) {
                console.log('Datos de seller recuperados:', sellerData); // Mostrar datos en la consola
                const sellerId = sellerData.id; // Suponiendo que el id está en los datos de sellerData
                if (sellerId) {
                    setIdSeller(sellerId); // Almacena el id en el estado
                } else {
                    Alert.alert('Error', 'No se encontró el id en los datos de seller');
                }
            } else {
                console.warn('No se encontraron datos de seller en SecureStore');
                Alert.alert('Error', 'No se encontraron datos de seller');
            }
        } catch (error) {
            console.error('Error al obtener los datos de seller:', error);
            Alert.alert('Error', 'Hubo un problema al obtener los datos del seller');
        }
    };

    // Usar useEffect para recuperar los datos al montar el componente
    useEffect(() => {
        fetchUserData();
    }, []);


    const handleSave = async () => {
        if (!name || !price || !deliveryDateTime || !description || !stock || !measure || !idSeller) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }
    
        try {
            // Obtener los datos de usuario almacenados en SecureStore
            const userDataString = await SecureStore.getItemAsync('userData');
            if (!userDataString) {
                console.error('Error: No se encontraron los datos del usuario');
                Alert.alert('Error', 'No se encontraron los datos del usuario.');
                return;
            }
    
            // Parsear los datos de usuario para obtener el token
            const userData = JSON.parse(userDataString);
            const token = userData.token;  // Aquí obtenemos el token desde userData
    
            if (!token) {
                console.error('Error: No se encontró el token de usuario');
                Alert.alert('Error', 'No se encontró el token de usuario.');
                return;
            }
    
            const response = await axios.post(
                'https://backend-j959.onrender.com/api/Product/AddProduct',
                {
                    name,
                    description,
                    price: parseFloat(price),
                    stock: parseInt(stock),
                    measure,
                    deliveryTime: deliveryDateTime.toISOString(),
                    idSeller: idSeller,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,  // Usamos el token aquí
                    },
                }
            );
    
            Alert.alert('Éxito', 'Producto guardado con éxito');
    
            // Redirigir a la pantalla /sellerProducts
            router.replace('/sellerProducts'); // Esto redirige a /sellerProducts
    
        } catch (error) {
            Alert.alert('Error', 'Hubo un problema al guardar el producto');
            console.error(error);
        }
    };
    

    const openImagePicker = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
            alert('Se necesitan permisos para acceder a la galería y la cámara');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const openCamera = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
            alert('Se necesitan permisos para acceder a la cámara');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Agregar Producto</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.imageUpload}>
                    <Text style={styles.label}>Imagen del producto</Text>
                    <View style={styles.imageButtonsContainer}>
                        <TouchableOpacity style={styles.uploadButton} onPress={openImagePicker}>
                            <Feather name="image" size={24} color="white" />
                            <Text style={styles.uploadButtonText}>Galería</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.uploadButton} onPress={openCamera}>
                            <Feather name="camera" size={24} color="white" />
                            <Text style={styles.uploadButtonText}>Cámara</Text>
                        </TouchableOpacity>
                    </View>
                    {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nombre del producto</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Ingrese el nombre del producto"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Precio Mnx</Text>
                    <TextInput
                        style={styles.input}
                        value={price}
                        onChangeText={text => setPrice(text.replace(/[^0-9.]/g, ''))}
                        keyboardType="decimal-pad"
                        placeholder="Ingrese el precio"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Descripción</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Descripción del producto"
                        placeholderTextColor="#999"
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Stock</Text>
                    <TextInput
                        style={styles.input}
                        value={stock}
                        onChangeText={text => setStock(text.replace(/[^0-9]/g, ''))}
                        keyboardType="numeric"
                        placeholder="Ingrese el stock"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Medida</Text>
                    <Picker
                        selectedValue={measure}
                        style={styles.picker}
                        onValueChange={(itemValue) => setMeasure(itemValue)}
                    >
                        <Picker.Item label="Litros" value="Litros" />
                        <Picker.Item label="Kilos" value="kilos" />
                        <Picker.Item label="Piezas" value="piezas" />
                        <Picker.Item label="Paquetes" value="paquetes" />
                        <Picker.Item label="Unidades" value="Unidades" />
                    </Picker>
                </View>
            </ScrollView>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        marginTop: 35,
    },
    scrollContent: {
        padding: 16,
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginTop: 10,
    },
    headerTitle: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#999',
        marginBottom: 10,
    },
    imageUpload: {
        marginBottom: 20,
    },
    imageButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 16,
        color: '#000000',
        marginBottom: 10,
        marginTop: 0,
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#9c9898',
        padding: 15,
        borderRadius: 8,
        marginRight: 5,
    },
    uploadButtonText: {
        color: 'white',
        marginLeft: 5,
    },
    imagePreview: {
        width: '100%',
        height: 200,
        marginTop: 10,
        borderRadius: 10,
    },
    inputGroup: {
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#F9F9F9',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    picker: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 8,
        backgroundColor: '#F9F9F9',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        margin: 16,
    },
    saveButtonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 18,
    },
});