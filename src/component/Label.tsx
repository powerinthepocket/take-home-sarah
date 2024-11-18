// PortfolioValueCard.tsx

import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

interface PortfolioValueCardProps {
  label: string;
}
const styles = StyleSheet.create({
  section: {
    width: "100%",
    alignItems: "flex-start",
  },

  label: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
  },
});
const Label: React.FC<PortfolioValueCardProps> = memo(({ label }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
});

export default Label;
