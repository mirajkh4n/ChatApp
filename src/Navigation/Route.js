import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider} from 'react-redux';
import store from '../redux/store';
import Login from '../Screens/Auth/Login';
import ChatScreen from '../Screens/Main/ChatScreen';
import InboxScreen from '../Screens/Main/InboxScreen';
import {Platform, StatusBar} from 'react-native';
import SingUp from '../Screens/Auth/SingUp';
const Route = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: '#fff',
              paddingTop:
                Platform.OS === 'android' ? StatusBar.currentHeight : 0,
            },
          }}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SingUp" component={SingUp} />

          
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Inbox" component={InboxScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default Route;
