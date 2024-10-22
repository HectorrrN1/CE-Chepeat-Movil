// HeaderComponent.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { Feather } from '@expo/vector-icons';

interface HeaderComponentProps {
  onMenuPress: () => void;
  onFilterPress: () => void;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({ onMenuPress, onFilterPress }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onMenuPress}>
        <Feather name="menu" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.headerText}>Chepeat</Text>
      <TouchableOpacity onPress={onFilterPress}>
      <Icon name="tune" type="material" color="black"/>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
  },
});

export default HeaderComponent;
