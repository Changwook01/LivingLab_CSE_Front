import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import StatusBarHeader from '../components/StatusBarHeader';

const sampleMenus = [
  { id: '1', name: '치즈버거', price: '5,000원' },
  { id: '2', name: '감자튀김', price: '3,000원' },
  { id: '3', name: '콜라', price: '1,500원' },
];

const MenuScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBarHeader />
      <FlatList
        contentContainerStyle={styles.content}
        data={sampleMenus}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.menuName}>{item.name}</Text>
            <Text style={styles.menuPrice}>{item.price}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuName: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuPrice: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
  },
});