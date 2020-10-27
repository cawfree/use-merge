import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useMerge, { By } from './lib';

export default function App() {

  // Hooks as normal, plus merged properties.
  const { a, b, e, merged: { loading, error } } = useMerge({
    a: useState({ loading: false, error: new Error() }),
    b: useState({ loading: false, error: null, }),
    c: { loading: false, error: null },
    d: { loading: false, error: new Error() },
    e: [{loading: true}],
    f: [undefined],
  })({ error: By.Error, loading: By.Truthy });

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
