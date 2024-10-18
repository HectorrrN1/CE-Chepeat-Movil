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
      <Stack.Screen name="homeBuyer"/>
      <Stack.Screen name='home'/>
      <Stack.Screen name='sellerProducts'/>
      <Stack.Screen name='productDetails'/>
      <Stack.Screen name='profileBuyer'/>
      
    </Stack>
  );
}
