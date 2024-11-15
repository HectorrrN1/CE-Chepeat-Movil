// BottomBarComponent.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const BottomBarComponent: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname(); // Obtiene la ruta actual

  const getIconColor = (routeName: string) => {
    return pathname === routeName ? '#ff6e33' : 'gray';  // Cambia a color más oscuro si es la ruta activa
  };

  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity onPress={() => router.push('/homeBuyer')}>
        <FontAwesome name="home" size={24} color={getIconColor('/homeBuyer')} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/filterProducts')}>
        <FontAwesome name="th-large" size={24} color={getIconColor('/filterProducts')} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/')}>
        <FontAwesome name="shopping-basket" size={24} color={getIconColor('/')} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
});

export default BottomBarComponent;
