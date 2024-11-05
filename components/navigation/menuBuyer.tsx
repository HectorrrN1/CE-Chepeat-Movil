import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, Animated, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

interface UserData {
  fullname: string;
}

interface MenuBuyerProps {
  isOpen: boolean;
  onToggle: () => void;
}

const MenuBuyer: React.FC<MenuBuyerProps> = ({ isOpen, onToggle }) => {
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const [isSeller, setIsSeller] = useState(false); // Estado para controlar el rol actual
  const [firstTimeSeller, setFirstTimeSeller] = useState(true); // Estado para controlar el registro inicial de vendedor
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      const storedUserData = await SecureStore.getItemAsync('userData');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    };
    loadUserData();
  }, []);

  // Animar la rotación del ícono
  const rotateInterpolate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  // Función para manejar el cambio de estado del sidebar
  const handleToggle = () => {
    Animated.timing(rotationAnim, {
      toValue: isOpen ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    onToggle();
  };

  // Función para cerrar sesión con un pequeño retraso
  const handleLogout = () => {
    handleToggle();
    setTimeout(() => {
      router.push('/');
    }, 300);
  };

  // Función para cambiar de rol
  const handleRoleSwitch = () => {
    handleToggle();

    if (!isSeller && firstTimeSeller) {
      // Primera vez que entra al modo vendedor, redirige a la pantalla de registro de vendedor
      setFirstTimeSeller(false);
      setIsSeller(true);
      router.push('/registerSeller');
    } else {
      // Cambia de rol sin registro adicional
      setIsSeller(!isSeller);
      setTimeout(() => {
        router.push(isSeller ? '/homeBuyer' : '/home'); // Navega a la pantalla adecuada
      }, 300);
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
          <TouchableOpacity style={styles.menuItem}>
            <Feather name="search" size={24} color="black" />
            <Text style={styles.menuItemText}>Buscar comida</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Feather name="user" size={24} color="black" />
            <Text style={styles.menuItemText} onPress={() => router.push('/profileBuyer')}>Mi cuenta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleRoleSwitch}>
            <Feather name="tag" size={24} color="black" />
            <Text style={styles.menuItemText}>
              {isSeller ? 'Modo Cliente' : 'Quiero ser Vendedor'}
            </Text>
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

export default MenuBuyer;
