import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, KeyboardAvoidingView, Platform, Animated, 
  Modal, TouchableOpacity, StyleSheet, FlatList
} from 'react-native';
import { useRouter } from 'expo-router';
import { Icon } from 'react-native-elements';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomBarComponent from '@/components/navigation/bottomComponent';
import HeaderComponent from '@/components/navigation/headerComponent';
import MenuBuyer from '@/components/navigation/menuBuyer';

const StyledInput: React.FC<TextInput['props']> = ({ style, ...props }) => {
  return (
    <View style={styles.inputContainer}>
      <Icon name="search" type="feather" color="#999" style={styles.searchIcon} />
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor="#999"
        {...props}
      />
    </View>
  );
};

const filterProducts: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setMenuVisible(false);
      setOverlayVisible(false);
    });
  };

  const openMenu = () => {
    setOverlayVisible(true);
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const toggleSidebar = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const categories = [
    'Frutas',
    'Verduras',
    'Cacerola',
    'Carne',
    'Lácteos',
    'Postres'
  ];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' || Platform.OS === 'ios' ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <HeaderComponent onMenuPress={openMenu} onFilterPress={() => router.push('/filterProducts')} />
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
            <MenuBuyer isOpen={menuVisible} onToggle={closeMenu} />
          </Animated.View>
        </Modal>

        {/* Reemplaza ScrollView por FlatList */}
        <FlatList
          data={categories}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={() => (
            <View style={styles.searchContainer}>
              <StyledInput
                placeholder='¿Qué estás buscando?'
                value={search}
                onChangeText={setSearch}
              />
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.categoryButton}>
              <Text style={styles.categoryText}>{item}</Text>
              <FontAwesome name="chevron-right" size={18} color="gray" />
            </TouchableOpacity>
          )}
        />

        <BottomBarComponent />
      </KeyboardAvoidingView>
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 0,
    marginTop: 35,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  searchContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    width: '100%',
    marginBottom: 15,
  },
  input: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  searchIcon: {
    marginLeft: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '500',
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

export default filterProducts;
