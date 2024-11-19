import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "@/src/constants/Colors";

interface PortfolioValueCardProps {
  value: string | number;
  label: string;
}
const styles = StyleSheet.create({
  portfolioSection: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  portfolioValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
  },
});
const PortfolioValue: React.FC<PortfolioValueCardProps> = memo(
  ({ value, label }) => {
    return (
      <View style={styles.portfolioSection}>
        <Text style={styles.portfolioValue}>{label}</Text>
        <Text style={styles.portfolioValue}>{value}</Text>
      </View>
    );
  }
);

export default PortfolioValue;
