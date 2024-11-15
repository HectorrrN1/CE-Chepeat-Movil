import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Animated, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import MenuBuyer from '@/components/navigation/menuBuyer';
import HeaderComponent from '@/components/navigation/headerComponent';
import BottomBarComponent from '@/components/navigation/bottomComponent';


interface UserData {
  fullname: string;
  email: string;
  isSeller: boolean;
  isBuyer: boolean;
}

export default function ProfileScreen() {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);

  const openMenu = () => {
    setOverlayVisible(true);
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300, // Duración de la animación
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300, // Duración de la animación
      useNativeDriver: true,
    }).start(() => {
      setMenuVisible(false);
      setOverlayVisible(false);
    });
  };

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


  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent onMenuPress={openMenu} onFilterPress={() => router.push('/filterProducts')} />
      <ScrollView >
        <Modal
          transparent={true}
          visible={menuVisible}
          animationType="none"
          onRequestClose={closeMenu}
        >
          {overlayVisible && (
            <TouchableOpacity style={styles.modalOverlay} onPress={closeMenu} />
          )}
          <Animated.View style={[styles.sidebarContainer, { transform: [{ translateX: slideAnim }] }]}>
            {/* Llama el contenido del sidebar desde otro componente */}
            <MenuBuyer isOpen={menuVisible} onToggle={closeMenu} />
          </Animated.View>
        </Modal>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userData ? userData.fullname.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <Text style={styles.greeting}>Tu cuenta</Text>
          <Text style={styles.username}>
            {userData ? userData.fullname : 'Usuario'}
          </Text>
          <Text style={styles.greeting}>
            {userData ? userData.email : 'Email'}
          </Text>
        </View>

        <View style={styles.optionsContainer}>

          <TouchableOpacity style={styles.optionItem}>
            <Feather name="edit" size={24} color="black" />
            <Text style={styles.optionText}>Editar perfil</Text>
            <Ionicons name="chevron-forward" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomBarComponent />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 35,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
    marginTop: 35,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ff6e33',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: 'white',
  },
  greeting: {
    fontSize: 18,
    color: 'black',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    width: '100%',
    marginBottom: 15,
  },
  input: {
    fontSize: 16,
    color: '#333',
  },
  inputStyle: {
    width: '100%',
  },
  optionsContainer: {
    paddingHorizontal: 20,
  },
  optionItem: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 17,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebarContainer: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 300,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
});
