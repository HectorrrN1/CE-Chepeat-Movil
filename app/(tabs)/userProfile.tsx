import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function UserProfileCard() {
  return (
    <View style={styles.container}>
      <View style={styles.containerUser}>
      <Image
        source={require('@/assets/images/profile.jpg')}
        style={styles.profileImage}
      />
      <Text style={styles.name}>Juan Pablo</Text>
      <Text style={styles.description}>Usa con frecuencia la aplicación</Text>
      <Text style={styles.location}>Se encuentra cerca de la Universidad</Text>
      <Text style={styles.joinDate}>Se unió en enero de 2022</Text>
      <TouchableOpacity style={styles.acceptButton} onPress={() => router.push('/closerScreen')}>
        <Text style={styles.acceptButtonText}>Aceptar Solicitud</Text>
      </TouchableOpacity>
      </View>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => router.push('/home')}>
          <Feather name="home" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/sellerProducts')}>
          <Feather name="search" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/profileSeller')}>
          <Feather name="user" size={24} color="black" />
        </TouchableOpacity>
      </View>

    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 35,
  },
  containerUser: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
  location: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
    textAlign: 'center',
  },
  joinDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  acceptButton: {
    backgroundColor: '#df1c24',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    width: '100%',
  },
  acceptButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});