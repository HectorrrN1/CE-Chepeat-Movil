import { Stack } from 'expo-router';
import React from 'react';

export default function TabLayout() {

  return (
    <Stack
      screenOptions={{
        headerShown: false, // Oculta los encabezados si no los quieres
      }}>
      <Stack.Screen name="index"/>
      <Stack.Screen name="register"/>
<<<<<<< HEAD
      <Stack.Screen name="homeBuyer"/>
      <Stack.Screen name='home'/>
      <Stack.Screen name='sellerProducts'/>
      <Stack.Screen name='productDetails'/>
      <Stack.Screen name='profileBuyer'/>
      
=======
      <Stack.Screen name="home"/>
      <Stack.Screen name="sellerProducts"/>
      <Stack.Screen name="profileSeller"/>
      <Stack.Screen name="addProductSeller"/>
      <Stack.Screen name="productDetailSeller"/>
      <Stack.Screen name="userProfile"/>
      <Stack.Screen name="closerScreen"/>
>>>>>>> 5bebd8d4fd93b70893a6e4914ac0ba907f9add5e
    </Stack>
  );
}
