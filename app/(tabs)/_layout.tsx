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
      <Stack.Screen name="home"/>
      <Stack.Screen name="homeBuyer"/>
      <Stack.Screen name="productDetails"/>
      <Stack.Screen name="confirmBuy"/>
      <Stack.Screen name="profileBuyer"/>
      <Stack.Screen name="sellerProducts"/>
      <Stack.Screen name="profileSeller"/>
      <Stack.Screen name="addProductSeller"/>
      <Stack.Screen name="productDetailSeller"/>
      <Stack.Screen name="userProfile"/>
      <Stack.Screen name="closerScreen"/>
    </Stack>
  );
}
