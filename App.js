import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import TabNavigator from './src/navigation/TabNavigator';
import { fetchRSSChannel } from './src/api/FetchRSS';
import { useEffect } from 'react';
import { initDB } from './src/db/db';
import { UpdateProvider } from './src/services/UpdateService';

export default function App() {
  // na této stránce bude proběhne aktualizace jednotlivých zpráv na dostupných feedech
  // testovací funkce - zatím init
  useEffect(() => {
    const initFetch = async() => {
      await initDB();
    }
    initFetch();
  }, []);

  return (
    <UpdateProvider>
      <NavigationContainer>
        <TabNavigator />
        <StatusBar style="light" />
      </NavigationContainer>
    </UpdateProvider>
  );
}
