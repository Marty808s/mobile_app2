import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import TabNavigator from './src/navigation/TabNavigator';
import { fetchRSSChannel } from './src/api/FetchRSS';
import { useEffect } from 'react';
import { initDB } from './src/db/db';
import { UpdateProvider } from './src/services/UpdateService';

export default function App() {

  // init databáze
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
