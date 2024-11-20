import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const confirmBuy = () => {
  const router = useRouter();

  // Función para finalizar la compra (puedes redirigir a cualquier otra pantalla)
  const handleFinishPurchase = () => {
    // Aquí podrías navegar a otra pantalla, como la pantalla principal
    router.push('/homeBuyer'); // Redirigir al usuario a la pantalla de inicio
  };

  return (
    <View style={styles.container}>
      {/* Icono de la confirmación */}
      <Image 
        source={require('../../assets/images/logo.png')} // Ruta de la imagen del icono de aprobación
        style={styles.icon}
      />

      {/* Mensaje de aprobación */}
      <Text style={styles.title}>Solicitud Aprobada</Text>

      {/* Texto de confirmación */}
      <Text style={styles.description}>
        Tu solicitud ha sido enviada y aprobada por el vendedor. ¡Gracias por elegir Cheapeat!
      </Text>

      {/* Botón de finalizar compra */}
      <TouchableOpacity style={styles.button} onPress={handleFinishPurchase}>
        <Text style={styles.buttonText}>Finalizar compra</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    marginTop: 35,
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#df1c24',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default confirmBuy;
