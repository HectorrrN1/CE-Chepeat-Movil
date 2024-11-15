import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, Animated, Text } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname  } from 'expo-router';
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
  const pathname = usePathname(); // Obtén la ruta actual
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

  const logoutRequest = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (!refreshToken) {
        throw new Error("Refresh token not found");
      }

      await axios.post('https://backend-j959.onrender.com/api/Auth/CerrarSesion', { refreshToken });
      console.log('Se cerró la sesion');
    } catch (error) {
      console.error('Error al hacer logout:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (!refreshToken) {
        console.log('No se puede hacer logout: refreshToken no encontrado');
        return;
      }

      await logoutRequest();
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
      await SecureStore.deleteItemAsync('refreshToken');
      await SecureStore.deleteItemAsync('sellerData');

      handleToggle();
      setTimeout(() => {
        router.push('/');
      }, 300);
    } catch (error) {
      console.error('Error al manejar el logout:', error);
    }
  };

  const handleBecomeSeller = () => {
    if (userData?.isSeller) {
      router.push('/home');
    } else {
      router.push('/registerSeller');
    }
  };

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
            onPress={() => router.push('/filterProducts')}
            disabled={pathname === '/filterProducts'} // Deshabilita si ya estás en esta vista
          >
            <Feather name="search" size={24} color={pathname === '/filterProducts' ? '#ccc' : 'black'} />
            <Text style={[styles.menuItemText, pathname === '/filterProducts' && { color: '#ccc' }]}>Buscar comida</Text>
            <Ionicons name="chevron-forward" size={24} color={pathname === '/searchFood' ? '#ccc' : 'black'} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/profileBuyer')}
            disabled={pathname === '/profileBuyer'} // Deshabilita si ya estás en esta vista
          >
            <Feather name="user" size={24} color={pathname === '/profileBuyer' ? '#ccc' : 'black'} />
            <Text style={[styles.menuItemText, pathname === '/profileBuyer' && { color: '#ccc' }]}>Mi cuenta</Text>
            <Ionicons name="chevron-forward" size={24} color={pathname === '/profileBuyer' ? '#ccc' : 'black'} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleBecomeSeller}
            disabled={pathname === '/home' || pathname === '/registerSeller'}
          >
            <Feather name="user-check" size={24} color={(pathname === '/home' || pathname === '/registerSeller') ? '#ccc' : 'black'} />
            <Text style={[styles.menuItemText, (pathname === '/home' || pathname === '/registerSeller') && { color: '#ccc' }]}>Quiero ser vendedor</Text>
            <Ionicons name="chevron-forward" size={24} color={(pathname === '/home' || pathname === '/registerSeller') ? '#ccc' : 'black'} />
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
    paddingBottom: 25,
  },
  menuItems: {
    marginBottom: 35,
  },
  menuItem: {
    backgroundColor: '#fdebd0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ff6e33',
    marginHorizontal: 10,
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 17,
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