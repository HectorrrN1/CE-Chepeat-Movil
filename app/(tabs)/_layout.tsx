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
      <Stack.Screen name="sellerProducts" />
      <Stack.Screen name="profileSeller"/>
      <Stack.Screen name="addProductSeller"/>
      <Stack.Screen name="productDetailSeller"/>
      <Stack.Screen name="purchaseRequestProductSeller"/>
      <Stack.Screen name="completeTransaction"/>
      <Stack.Screen name="registerSeller"/>
      <Stack.Screen name="updateProductSeller"/>
      <Stack.Screen name="filterProducts"/>
    </Stack>
  );
}
