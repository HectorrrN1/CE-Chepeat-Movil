import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, SafeAreaView, Animated, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Definición de las propiedades del componente
interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
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

        <View style={styles.menuItems}>
          <TouchableOpacity style={styles.menuItem}>
            <Feather name="user" size={24} color="black" />
            <Text style={styles.menuItemText}>Mi cuenta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Feather name="file-text" size={24} color="black" />
            <Text style={styles.menuItemText}>Términos y condiciones</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Feather name="package" size={24} color="black" />
            <Text style={styles.menuItemText}>Mis productos</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 20,
    marginTop: 10,
  },
  header: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  contentContainer: {
    flex: 1, // Permitir que este contenedor ocupe todo el espacio disponible
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFD700',
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
    fontSize: 18,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  menuItems: {
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  menuItemText: {
    marginLeft: 15,
    fontSize: 16,
  },
  logoutContainer: {
    justifyContent: 'flex-end', // Empujar el botón de cerrar sesión hacia abajo
    paddingBottom: 20, // Un poco de espacio para que no esté pegado al borde inferior
  },
  logoutButton: {
    borderWidth: 2,
    borderColor: '#df1c24',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#df1c24',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Sidebar;
