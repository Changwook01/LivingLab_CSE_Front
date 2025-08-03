import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import StatusBarHeader from '../components/StatusBarHeader';
import TruckOperation from '../components/TruckOperation';
import TruckInfoScreen from '../components/TruckInfoScreen';
import SaleStatus from '../components/SaleStatus';

const HomeScreen = () => {
  const [tab, setTab] = useState('home');

  const renderContent = () => {
    switch (tab) {
      case 'home':
        return (
          <ScrollView style={styles.container}>
            <SaleStatus />
            <TruckInfoScreen />
            <TruckOperation />
          </ScrollView>
        );
      case 'menu':
        return (
          <View style={styles.centered}>
            <Text>메뉴 관리 화면</Text>
          </View>
        );
      case 'zone':
        return (
          <View style={styles.centered}>
            <Text>영업 구역 화면</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBarHeader />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F9F9F9',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;