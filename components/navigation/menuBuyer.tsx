import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, Animated, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

interface menuBuyerProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuBuyer: React.FC<menuBuyerProps> = ({ isOpen, onToggle }) => {
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const [isSeller, setIsSeller] = useState(false);

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

  const handleLogout = () => {
    handleToggle();
    setTimeout(() => {
      router.push('/');
    }, 300);
  };

  const fetchUserData = async () => {
    try {
      const userDataString = await SecureStore.getItemAsync('userData');
      const userData = userDataString ? JSON.parse(userDataString) : null;

      if (userData && userData.user) {
        console.log('Datos del usuario:', userData);
        setIsSeller(userData.user.isSeller || false); // Acceder correctamente a isSeller dentro de user
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
            <Text style={styles.avatarText}>U</Text>
          </View>
          <Text style={styles.greeting}>Hola</Text>
          <Text style={styles.username}>Usuario</Text>
        </View>

        <View style={styles.menuItems}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              handleToggle();
              setTimeout(() => router.push('/filterProducts'), 300);
            }}>
            <Feather name="search" size={24} color="black" />
            <Text style={styles.menuItemText}>Buscar comida</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              handleToggle();
              setTimeout(() => router.push('/profileBuyer'), 300);
            }}>
            <Feather name="user" size={24} color="black" />
            <Text style={styles.menuItemText}>Mi cuenta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              handleToggle();
              setTimeout(() => {
                if (isSeller) {
                  router.push('/home'); // Si es vendedor, ir a /home
                } else {
                  router.push('/registerSeller'); // Si no es vendedor, ir a /registerSeller
                }
              }, 300);
            }}
          >
            <Feather name="tag" size={24} color="black" />
            <Text style={styles.menuItemText}>Quiero ser vendedor</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
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
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
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

export default menuBuyer;
