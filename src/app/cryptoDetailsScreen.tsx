import { Link } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function CryptoDetailsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crypto Details Screen</Text>
      <Link href="/">Main Screen</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
  },
});
