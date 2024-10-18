import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function AddProductScreen() {
    const [price, setPrice] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<string | null>(null);

    const handleSave = () => {
        console.log('Guardando producto:', { price, deliveryTime, description, image });
    };

    const openImagePicker = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert('Se necesitan permisos para acceder a la galería');
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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Agregar Producto</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.imageUpload}>
                    <Text style={styles.label}>Imagen del producto</Text>
                    <TouchableOpacity style={styles.uploadButton} onPress={openImagePicker}>
                        <Feather name="upload" size={24} color="white" />
                        <Text style={styles.uploadButtonText}>Subir Imagen</Text>
                    </TouchableOpacity>
                    {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Precio</Text>
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
                    <Text style={styles.label}>Hora de entrega</Text>
                    <TextInput
                        style={styles.input}
                        value={deliveryTime}
                        onChangeText={setDeliveryTime}
                        placeholder="Ingrese la hora de entrega"
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
    },
    uploadButtonText: {
        color: 'white',
        marginLeft: 10,
        fontSize: 16,
    },
    imagePreview: {
        marginTop: 10,
        width: '100%',
        height: 200,
        borderRadius: 8,
    },
    inputGroup: {
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#EEEEEE',
        color: '#000000',
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: '#df1c24',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
        margin: 20,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
