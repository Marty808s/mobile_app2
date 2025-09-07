import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FeedScreen from '../screens/FeedScreen';
import ContentScreen from '../screens/ContentScreen';
import Colors from '../constants/Colors';
import { UpdateProvider } from '../services/UpdateService';

const Stack = createStackNavigator();

export default function FeedStackNavigator() {
    return (
      <UpdateProvider>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.primary,
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="FeedList" 
            component={FeedScreen}
            options={{ title: 'RSS Feedy' }}
          />
            <Stack.Screen 
                name="ContentScreen" 
                component={ContentScreen}
                options={{ title: 'Obsah' }}
            />
        </Stack.Navigator>
      </UpdateProvider>
    );
  }