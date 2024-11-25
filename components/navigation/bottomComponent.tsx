// BottomBarComponent.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const BottomBarComponent: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname(); // Obtiene la ruta actual

  // Definir las rutas posibles
  const routes = {
    homeBuyer: '/homeBuyer' as const,
    filterProducts: '/filterProducts' as const,
    basket: '/' as const,
  };

  const getIconColor = (routeName: string) => {
    return pathname === routeName ? '#ff6e33' : 'gray'; // Cambia a color más oscuro si es la ruta activa
  };

  // Función para obtener el evento de pulsación solo si la ruta no está activa
  const getOnPressHandler = (routeName: string) => {
    return pathname === routeName ? undefined : () => router.push(routeName as any);
  };

  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity onPress={getOnPressHandler(routes.homeBuyer)}>
        <FontAwesome name="home" size={24} color={getIconColor(routes.homeBuyer)} />
      </TouchableOpacity>

      <TouchableOpacity onPress={getOnPressHandler(routes.filterProducts)}>
        <FontAwesome name="th-large" size={24} color={getIconColor(routes.filterProducts)} />
      </TouchableOpacity>

      <TouchableOpacity onPress={getOnPressHandler(routes.basket)}>
        <FontAwesome name="shopping-basket" size={24} color={getIconColor(routes.basket)} />
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
