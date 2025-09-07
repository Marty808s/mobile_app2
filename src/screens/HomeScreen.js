import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import { resetDB, addContent } from '../db/db';
import { useEffect } from 'react';
import { useUpdateService } from '../services/UpdateService';

export default function HomeScreen() {
  const { isUpdating, lastUpdate, nextUpdate, updateInterval } = useUpdateService();

  useEffect(() => {
    (async () => {
      console.log("Adding content");
      await addContent(1);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Domů</Text>
        <Text style={styles.subtitle}>Vítejte v RSS aplikaci</Text>
        <TouchableOpacity style={styles.button} onPress={() => resetDB()}>
          <Text style={styles.buttonText}>RESETOVAT DB</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.appInfo}>
        <Text style={styles.infoText}>Aktualizace: {isUpdating ? 'Ano' : 'Ne'}</Text>
        <Text style={styles.infoText}>Poslední aktualizace: {lastUpdate ? lastUpdate.toLocaleString() : 'Zatím nebyla provedena žádná aktualizace'}</Text>
        <Text style={styles.infoText}>Další aktualizace: {nextUpdate ? nextUpdate.toLocaleString() : 'Není naplánována'}</Text>
        <Text style={styles.infoText}>Interval: {updateInterval} milisekund</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  appInfo: {
    backgroundColor: Colors.primary,
    padding: 15,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: Colors.background,
    marginBottom: 5,
    textAlign: 'center',
  },
});
