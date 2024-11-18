import Colors from "@/src/constants/Colors";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { formatNumber } from "../helper";

// Define the types for the props
interface AssetCardProps {
  amount: number | string;
  currency: number |string;
  value: number |string;
  percentage: string;
  currencyTotal: string;
  total: number |number;
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
      <Text numberOfLines={1} style={styles.assetAmount}>
        {currency} {formatNumber(amount)}
      </Text>
      <Text numberOfLines={1} style={styles.assetValue}>
        {currencyTotal} {formatNumber(value)}
      </Text>
    </View>
    <View style={styles.percentageBox}>
      <Text numberOfLines={1} style={styles.percentageText}>
        {percentage}
      </Text>
    </View>
    <View style={styles.assetRight}>
      <Text numberOfLines={1} style={styles.assetAmount}>
        {currencyTotal}
        {formatNumber(total)}
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
