import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import StatusBarHeader from '../components/StatusBarHeader';

const sampleZones = [
  { id: 'A', name: '1번 존 - 중앙광장' },
  { id: 'B', name: '2번 존 - 공원 앞' },
  { id: 'C', name: '3번 존 - 학교 근처' },
];

const ZoneScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBarHeader />
      <FlatList
        contentContainerStyle={styles.content}
        data={sampleZones}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.zoneName}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default ZoneScreen;

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
  zoneName: {
    fontSize: 16,
    fontWeight: '600',
  },
});