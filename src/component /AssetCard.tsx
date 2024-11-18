import Colors from "@/src/constants/Colors";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Define the types for the props
interface AssetCardProps {
  amount: number | string;
  currency: string;
  value: string;
  percentage: string;
  currencyTotal: string;
  total: number;
}

const AssetCard: React.FC<AssetCardProps> = ({
  amount,
  currency,
  value,
  total,
  currencyTotal,
  percentage,
}) => (
  <View style={styles.assetCard}>
    <View style={styles.assetLeft}>
      <Text style={styles.assetAmount}>
        {currency} {amount}
      </Text>
      <Text style={styles.assetValue}>
        {currencyTotal} {value}
      </Text>
    </View>
    <View style={styles.percentageBox}>
      <Text style={styles.percentageText}>+{percentage}</Text>
    </View>
    <View style={styles.assetRight}>
      <Text style={styles.assetAmount}>
        {total}
        {currencyTotal}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  assetCard: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: Colors.light.greyBG,
    justifyContent: "space-between",
  },
  assetLeft: {
    flex: 3,
  },
  assetAmount: {
    fontSize: 16,
    fontWeight: "500",
  },
  assetValue: {
    fontSize: 14,
    color: Colors.light.greyText,
  },
  assetRight: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexDirection: "column",
    flex: 3,
  },
  percentageBox: {
    backgroundColor: Colors.light.grey,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 14,
    color: Colors.light.background,
    fontWeight: "bold",
  },
});

export default AssetCard;
