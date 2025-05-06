import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import Route from './src/Navigation/Route';

export default function App() {
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        <Route />
      </SafeAreaView>
    </>
  );
}
