import React, { useState, useEffect, use } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import Colors from '../constants/Colors';
import { useRoute } from '@react-navigation/native';
import { getDetailsById } from '../db/db';

export default function ContentScreen() {
  const route = useRoute();
  const { id } = route.params || {};
  const [details, setDetails] = useState(null);

  useEffect(() => {
    (async () => {
      if (!id) {
        console.warn('Nemám id');
        setDetails({});
        return;
      }
      try {
        const data = await getDetailsById(id); // vrací 1 objekt s parsed JSON
        setDetails(data);
      } catch (e) {
        console.warn('Chyba načítání details:', e);
        setDetails({});
      }
    })();
  }, [id]);


  useEffect(() => {
    console.log("Detaily", details);
  }, [details])

  const renderAbility = ({ item }) => {
    return (
      <View style={styles.feedItem}>
        <Text style={styles.feedTitle}>{item.name}</Text>
        <Text style={styles.feedTitle}>{item.url}</Text>
      </View>
    );
  };


  return (
    <View style={styles.container}>
      <FlatList
        data={details.abilities}
        renderItem={renderAbility}
        style={styles.list}
        ListEmptyComponent={
          <Text style={styles.feedDescription}>Žádné schopnosti k zobrazení.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginVertical: 20,
    textAlign: 'center',
  },
  list: { flex: 1 },
  feedItem: {
    backgroundColor: Colors.background,
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  feedTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 5,
  },
  feedDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
