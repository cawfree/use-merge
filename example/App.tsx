import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useMerge } from './lib';

export default function App() {
  const { a, b, merged } = useMerge({
    a: useState({ loading: true }),
    b: useState({ loading: false }),
  })({});
  console.log({ merged });
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
