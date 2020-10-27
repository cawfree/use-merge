import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import useMerge, { By } from "use-merge";

export default function App() {
  const { a, b, merged: { loading } } = useMerge({
    a: useState({ loading: false }),
    b: useState({ loading: false }),
  })({ loading: By.Truthy });

  const [{ loading: aIsLoading }, setA] = a;
  const [{ loading: bIsLoading }, setB] = b;

  return (
    <View style={styles.container}>
      <Text children={`A is loading? ${aIsLoading}`} />
      <Text children={`B is loading? ${bIsLoading}`} />
      <Text children={`isLoading? ${loading}`} />

      <TouchableOpacity onPress={() => setA(({ loading }) => ({ loading: !loading }))}>
        <Text>Toggle A</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setB(({ loading }) => ({ loading: !loading }))}>
        <Text>Toggle B</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
