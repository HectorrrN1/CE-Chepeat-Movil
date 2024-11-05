import 'react-native-get-random-values';
import React, { useState, useEffect } from 'react';
import {
    View, Text, SafeAreaView, ScrollView, KeyboardAvoidingView,
    Platform, Image, TextInput, ActivityIndicator
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Checkbox } from 'expo-checkbox';
import styles from '@/assets/styles/registerSeller';

const StyledInput: React.FC<TextInput['props']> = ({ style, ...props }) => {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={[styles.input, style]}
                placeholderTextColor="#999"
                {...props}
            />
        </View>
    );
};

// Define un tipo para los componentes de dirección
interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}

export default function RegisterSeller() {
    const [storeName, setStoreName] = useState('');
    const [description, setDescription] = useState('');
    const [street, setStreet] = useState('');
    const [extNumber, setExtNumber] = useState('');
    const [intNumber, setIntNumber] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [cp, setCp] = useState('');
    const [addressNotes, setAddressNotes] = useState('');
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [acceptTerms, setAcceptTerms] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const obtenerUbicacionInicial = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    alert('Permiso de ubicación denegado');
                    setIsLoading(false);
                    return;
                }

                const ubicacion = await Location.getCurrentPositionAsync({});
                setLatitude(ubicacion.coords.latitude);
                setLongitude(ubicacion.coords.longitude);
            } catch (error) {
                console.error('Error al obtener la ubicación:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (latitude === null || longitude === null) {
            obtenerUbicacionInicial();
        } else {
            setIsLoading(false);
        }
    }, [latitude, longitude]);

    const handleCpChange = async (value: string) => {
        setCp(value);
        if (value.length === 5) {
            try {
                const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=AIzaSyCj3tSGFatl1_SoYh6l6VZ06A0su2oJWcI`);
                const { results } = response.data;

                if (results.length > 0) {
                    const { geometry, address_components } = results[0];

                    setLatitude(geometry.location.lat);
                    setLongitude(geometry.location.lng);

                    // Extraer ciudad y estado
                    const cityComponent = address_components.find((component: AddressComponent) =>
                        component.types.includes("locality")
                    );
                    const stateComponent = address_components.find((component: AddressComponent) =>
                        component.types.includes("administrative_area_level_1")
                    );

                    setCity(cityComponent ? cityComponent.long_name : '');
                    setState(stateComponent ? stateComponent.long_name : '');
                } else {
                    console.error('No se encontraron resultados para el código postal:', value);
                }
            } catch (error) {
                console.error('Error al obtener la dirección:', error);
            }
        }
    };

    const handleRegisterSeller = async () => {
        if (acceptTerms) {
            console.log('Registro ingresado con:', storeName, description, street, extNumber, intNumber,
                neighborhood, city, state, cp, addressNotes, latitude, longitude);
            try {
                const response = await axios.post('https://backend-j959.onrender.com/api/Seller/AddUSeller', {
                    storeName,
                    description,
                    street,
                    extNumber,
                    intNumber,
                    neighborhood,
                    city,
                    state,
                    cp,
                    addressNotes,
                    latitude,
                    longitude,
                });

                console.log('Negocio registrado exitosamente:', response.data);
                router.push('/home');

            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error('Error en la respuesta de la API:', error.response?.data);
                    alert(`Error: ${error.response?.data?.message || 'Ha ocurrido un error inesperado.'}`);
                } else {
                    console.error('Error desconocido:', error);
                    alert('Ha ocurrido un error inesperado.');
                }
            }
        } else {
            alert('Debes aceptar los términos y condiciones para continuar.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'android' || Platform.OS === 'ios' ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled">
                    <View style={styles.imageTextContainer}>
                        <Image
                            source={require('@/assets/images/tenecuchillo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.imageText}>Chepeat</Text>
                    </View>

                    <Text style={styles.title}>Registrar Negocio</Text>

                    <StyledInput
                        placeholder="Nombre del negocio"
                        value={storeName}
                        onChangeText={setStoreName}
                        style={styles.inputStyle}
                    />

                    <StyledInput
                        placeholder="Descripción"
                        value={description}
                        onChangeText={setDescription}
                        style={styles.inputStyle}
                    />

                    <StyledInput
                        placeholder="Calle"
                        value={street}
                        onChangeText={setStreet}
                        style={styles.inputStyle}
                    />

                    <StyledInput
                        placeholder="Número exterior"
                        value={extNumber}
                        onChangeText={setExtNumber}
                        keyboardType="numeric"
                        style={styles.inputStyle}
                    />

                    <StyledInput
                        placeholder="Número interior"
                        value={intNumber}
                        onChangeText={setIntNumber}
                        keyboardType="numeric"
                        style={styles.inputStyle}
                    />

                    <StyledInput
                        placeholder="Colonia"
                        value={neighborhood}
                        onChangeText={setNeighborhood}
                        style={styles.inputStyle}
                    />

                    <StyledInput
                        placeholder="Estado"
                        value={state}
                        onChangeText={setState}
                        style={styles.inputStyle}
                        editable={false} // Deshabilitado para que no se pueda editar
                    />

                    <StyledInput
                        placeholder="Ciudad"
                        value={city}
                        onChangeText={setCity}
                        style={styles.inputStyle}
                        editable={false} // Deshabilitado para que no se pueda editar
                    />

                    <StyledInput
                        placeholder="Código postal"
                        value={cp}
                        onChangeText={handleCpChange} // Cambia aquí
                        style={styles.inputStyle}
                    />

                    <StyledInput
                        placeholder="Notas de dirección"
                        value={addressNotes}
                        onChangeText={setAddressNotes}
                        style={styles.inputStyle}
                    />

                    <View style={styles.mapContainer}>
                        {isLoading ? (
                            <ActivityIndicator size="large" color="#0000ff" style={{ marginVertical: 20 }} />
                        ) : (
                            latitude !== null && longitude !== null && (
                                <MapView
                                    style={styles.map}
                                    region={{
                                        latitude: latitude,
                                        longitude: longitude,
                                        latitudeDelta: 0.01,
                                        longitudeDelta: 0.01,
                                    }}
                                    onPress={(e) => {
                                        const { latitude, longitude } = e.nativeEvent.coordinate;
                                        setLatitude(latitude);
                                        setLongitude(longitude);
                                    }}
                                >
                                    <Marker
                                        coordinate={{ latitude, longitude }}
                                        draggable
                                        onDragEnd={(e) => {
                                            const { latitude, longitude } = e.nativeEvent.coordinate;
                                            setLatitude(latitude);
                                            setLongitude(longitude);
                                        }}
                                    />
                                </MapView>
                            )
                        )}
                    </View>

                    <View style={styles.checkboxContainer}>
                        <Checkbox
                            value={acceptTerms}
                            onValueChange={setAcceptTerms}
                        />
                        <Text style={styles.checkboxLabel}>
                            Acepto los <Text style={styles.link}>términos y condiciones</Text>
                        </Text>
                    </View>

                    <Button onPress={handleRegisterSeller} title="Registrar Negocio" />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
