import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, Animated, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

interface UserData {
  fullname: string;
  isSeller: boolean;
  isBuyer: boolean;
}

interface MenuBuyerProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MenuBuyer: React.FC<MenuBuyerProps> = ({ isOpen, onToggle }) => {
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const storedUserData = await SecureStore.getItemAsync('userData');
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        setUserData(parsedData);
      }
    };
    loadUserData();
  }, []);

  const rotateInterpolate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const handleToggle = () => {
    Animated.timing(rotationAnim, {
      toValue: isOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    onToggle();
  };

  // Función para enviar el refreshToken y hacer logout
  const logoutRequest = async () => {
    try {
      // Obtener el refreshToken almacenado
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (!refreshToken) {
        throw new Error("Refresh token not found");
      }

      // Enviar el refreshToken al backend para hacer el logout
      await axios.post('https://backend-j959.onrender.com/api/Auth/CerrarSesion', { refreshToken });

      console.log('Se cerró la sesion');
    } catch (error) {
      console.error('Error al hacer logout:', error);
      throw error; // Re-lanzar el error para que el handleLogout lo maneje
    }
  };

  // Función para manejar el logout
  const handleLogout = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (!refreshToken) {
        console.log('No se puede hacer logout: refreshToken no encontrado');
        return; // Detener el flujo si no se encuentra el refreshToken
      }

      // Llamar a la función de logout
      await logoutRequest();

      // Eliminar los tokens y datos del usuario
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
      await SecureStore.deleteItemAsync('refreshToken');
      await SecureStore.deleteItemAsync('sellerData');

      handleToggle(); // Si tienes un toggle para cambiar estado del UI
      setTimeout(() => {
        router.push(''); // Redirigir a la pantalla de login
      }, 300);
    } catch (error) {
      console.error('Error al manejar el logout:', error);
    }
  };


  const handleBecomeSeller = () => {
    if (userData?.isSeller) {
      router.push('/home'); // Si ya es vendedor, ir a homeBuyer
    } else {
      router.push('/registerSeller'); // Si no es vendedor, ir a registerSeller
    }
  };

  const fetchUserData = async () => {
    try {
      const userDataString = await SecureStore.getItemAsync('userData');
      const userData = userDataString ? JSON.parse(userDataString) : null;

      if (userData) {
        console.log('Datos del usuario:', userData);
        // Aquí puedes usar userData para realizar acciones adicionales
      } else {
        console.warn('No se encontraron datos de usuario en SecureStore');
      }
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleToggle}>
          <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
            <Feather name={isOpen ? "arrow-left" : "arrow-right"} size={24} color="black" />
          </Animated.View>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userData ? userData.fullname.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <Text style={styles.greeting}>Hola</Text>
          <Text style={styles.username}>
            {userData ? userData.fullname : 'Cargando...'}
          </Text>
        </View>


        <View style={styles.menuItems}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              handleToggle(); // Cerrar sidebar primero
              setTimeout(() => router.push('/profileBuyer'), 300); // Esperar 300ms antes de redirigir
            }}>
            <Feather name="user" size={24} color="black" />
            <Text style={styles.menuItemText}>Mi cuenta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              handleToggle(); // Cerrar sidebar primero
              setTimeout(() => router.push('/profileSeller'), 300); // Esperar 300ms antes de redirigir
            }}>
            <Feather name="user" size={24} color="black" />
            <Text style={styles.menuItemText}>Mi cuenta</Text>
          </TouchableOpacity>

          {/* Botón único "Quiero ser vendedor" */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              handleToggle(); // Cerrar sidebar primero
              setTimeout(() => handleBecomeSeller(), 300); // Esperar 300ms antes de redirigir
            }}>
            <Feather name="user-check" size={24} color="black" />
            <Text style={styles.menuItemText}>Quiero ser vendedor</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  contentContainer: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ff6e33',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  greeting: {
    fontSize: 16,
    color: 'black',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  menuItems: {
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginHorizontal: 10,
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: 'black',
  },
  logoutContainer: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#df1c24',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logoutButtonText: {
    color: '#df1c24',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MenuBuyer;