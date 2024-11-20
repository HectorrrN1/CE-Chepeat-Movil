import React, { FC } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface MenuItemProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  onPress: () => void; // Prop para la función de navegación
}

const MenuItem: FC<MenuItemProps> = ({ icon, title, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Feather name={icon} size={24} color="black" />
    <Text style={styles.menuItemText}>{title}</Text>
    <Feather name="chevron-right" size={24} color="black" style={styles.menuItemArrow} />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const router = useRouter(); // Hook para navegar entre pantallas
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileInfo}>
          <Image
            source={require('@/assets/images/profile.jpg')}
            style={styles.avatar}
          />
          <Text style={styles.userName}>Usuario</Text>
          <Text style={styles.userHandle}>@usuarioforaneo</Text>
        </View>
        <View style={styles.menuItems}>
          <MenuItem 
            icon="user" 
            title="Mi información" 
            onPress={() => {
              console.log('Navigating to Mi información');
              router.push('/explore'); 
            }} 
          />
          {/*
          <MenuItem 
            icon="shield" 
            title="Políticas y privacidad" 
            onPress={() => {
              console.log('Navigating to Políticas y privacidad');
              router.push('/explore'); 
            }} 
          />
          <MenuItem 
            icon="edit" 
            title="Editar perfil" 
            onPress={() => {
              console.log('Navigating to Editar perfil');
              router.push('/explore'); 
            }} 
          />*/}
          <MenuItem 
            icon="shopping-bag" 
            title="Modo comprador" 
            onPress={() => {
              console.log('Navigating to Modo comprador');
              router.push('/explore'); 
            }} 
          />
          <MenuItem 
            icon="log-out" 
            title="Cerrar sesión" 
            onPress={() => {
              console.log('Logging out');
              router.push('/'); 
            }} 
          />
        </View>
      </ScrollView>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push('/home')}>
          <Feather name="home" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/sellerProducts')}>
          <Feather name="list" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/profileSeller')}>
          <Feather name="user" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Fondo blanco
    marginTop: 35,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop: 10,
    paddingBottom: 10, // Espaciado inferior para el encabezado
  },
  headerTitle: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#999', // Color gris claro para el título
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black', // Color negro
    marginBottom: 5,
  },
  userHandle: {
    fontSize: 16,
    color: '#555', // Gris oscuro
  },
  menuItems: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0', // Línea inferior más clara
  },
  menuItemText: {
    fontSize: 16,
    color: 'black', // Color negro
    marginLeft: 15,
    flex: 1,
  },
  menuItemArrow: {
    marginLeft: 'auto',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0', // Línea superior más clara
  },
});
