import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, Animated, Text } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Se usa Feather como ícono
import { useRouter } from 'expo-router';

// Definición de las propiedades del componente
interface menuBuyerProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuBuyer: React.FC<menuBuyerProps> = ({ isOpen, onToggle }) => {
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

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
    onToggle(); // Mantener la animación al tocar fuera del botón de cerrar sesión
  };

  // Función para cerrar sesión con un pequeño retraso
  const handleLogout = () => {
    // Primero cierra el sidebar
    handleToggle();

    // Luego agrega un delay antes de redirigir a la pantalla de logout
    setTimeout(() => {
      router.push('/'); // Navegar a la pantalla de logout después del delay
    }, 300); // 300ms de delay para esperar el cierre del sidebar
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
      
      {/* Contenido del perfil y menú */}
      <View style={styles.contentContainer}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>U</Text>
          </View>
          <Text style={styles.greeting}>Hola</Text>
          <Text style={styles.username}>Usuario</Text>
        </View>

        {/* Ítems del menú */}
        <View style={styles.menuItems}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              handleToggle(); // Cerrar sidebar primero
              setTimeout(() => router.push('/filterProducts'), 300); // Esperar 300ms antes de redirigir
            }}>
            <Feather name="search" size={24} color="black" />
            <Text style={styles.menuItemText}>Buscar comida</Text>
          </TouchableOpacity>

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
              setTimeout(() => router.push('/home'), 300); // Esperar 300ms antes de redirigir
            }}>
            <Feather name="tag" size={24} color="black" />
            <Text style={styles.menuItemText}>Quiero ser vendedor</Text>
          </TouchableOpacity>

          {/*
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              handleToggle(); // Cerrar sidebar primero
              setTimeout(() => router.push('/terminosCondiciones'), 300); // Esperar 300ms antes de redirigir
            }}>
            <Feather name="file-text" size={24} color="black" />
            <Text style={styles.menuItemText}>Términos y condiciones</Text>
          </TouchableOpacity>
          */}
        </View>
      </View>

      {/* Botón para Cerrar Sesión */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout} // Usar la nueva función con delay
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
    paddingHorizontal: 20, // Espacio lateral para todo el contenedor
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
    paddingHorizontal: 10, // Espacio dentro del elemento
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginHorizontal: 10, // Añadir espacio lateral fuera del elemento
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: 'black',
  },
  logoutContainer: {
    paddingBottom: 20, 
    paddingHorizontal: 20, // Añadir espacio lateral al botón de "Cerrar sesión"
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
