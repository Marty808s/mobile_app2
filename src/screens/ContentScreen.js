import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function ContentScreen() {
    const route = useRoute();
    const { id } = route.params || {};

    return(
        <Text>{id}</Text>
    )

}