import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useMerge, By } from './lib';

export default function App() {

  const { a, b, merged } = useMerge({
    a: useState({ loading: true, error: new Error() }),
    b: useState({ loading: false, error: null, }),
    c: { loading: true, error: null },
    d: { loading: false, error: new Error() },
  })({ error: By.Error, loading: By.Truthy });

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
