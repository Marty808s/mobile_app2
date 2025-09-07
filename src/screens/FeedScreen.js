import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import { getFeeds, addContent } from '../db/db';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import { getPokemons } from '../api/fetchAPI';
import { insertPokemons, selectPokemonsAll } from '../db/db';

export default function FeedScreen() {
  const [pokemons, setFeeds] = useState([]);
  const navigation = useNavigation();
      
  const getData = async () => {
    console.log("Stahuji pokemony z API...")
    // data z API
    const apiData = await getPokemons();
    console.log("API data:", apiData);
    // uložit do databáze
    await insertPokemons(apiData);
    // načíst z databáze a zobrazit
    const pokemonsFromDb = await selectPokemonsAll();
    setFeeds(pokemonsFromDb);
  }

  useEffect(() => {
    console.log(pokemons);
  }, [pokemons])

  useEffect(() => {
    getData();
  }, [])


  const onPress = (item) => {
    console.log("Pressed", item.name);
    // navigace na content screen
    navigation.navigate('ContentScreen', { 
      id: item.id,
    });
  }

  //entita feedu
  const renderFeed = ({ item }) => (
    <TouchableOpacity style={styles.feedItem} onPress={() => onPress(item)}>
      <Text style={styles.feedTitle}>{item.name}</Text>
      <Text style={styles.feedDescription}>{item.url}</Text>
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokemoni</Text>
      <FlatList
        data={pokemons}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFeed}
        style={styles.list}
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
  list: {
    flex: 1,
  },
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
