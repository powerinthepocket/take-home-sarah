import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { formatNumber } from "../helper";

interface Asset {
  asset_id: string;
  name: string;
  quantity?: number;
  price_usd?: number | string;
  priceAlert?: {
    abovePrice?: number;
    belowPrice?: number;
  };
}

interface AssetItemProps {
  item: Asset;
  selectedAssets: Asset[];
  updateAssetQuantity: (asset: Asset, quantity: string) => void;
  incrementQuantity: (asset: Asset) => void;
  decrementQuantity: (asset: Asset) => void;
  openPriceAlertModal: (asset: Asset) => void;
}

const AssetItem: React.FC<AssetItemProps> = ({
  item,
  selectedAssets,
  updateAssetQuantity,
  incrementQuantity,
  decrementQuantity,
  openPriceAlertModal,
}) => {
  const selectedAsset = selectedAssets.find(
    (asset) => asset.asset_id === item.asset_id
  );
  const quantity = selectedAsset ? selectedAsset.quantity || 0 : 0;
  const priceAlert = selectedAsset?.priceAlert;

  return (
    <View style={styles.assetItem}>
      <View style={styles.assetInfo}>
        <View style={styles.VerticalView}>
          <Text style={styles.assetId}>{item?.asset_id}</Text>
          <Text style={styles.assetName}>
            {item?.price_usd ? `USD ${formatNumber(item.price_usd)}` : "__"}
          </Text>
          <TouchableOpacity
            style={styles.alertButton}
            onPress={() => openPriceAlertModal(item)}
          >
            <Ionicons
              name="notifications"
              size={15}
              color={Colors.light.background}
            />
            <Text style={styles.alertButtonText}>Alert Me!</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.VerticalView}>
          <Text style={styles.assetName}>{item?.name}</Text>
          {priceAlert && (
            <Text style={styles.alertText}>
              Alert:{" "}
              {priceAlert.abovePrice ? `Above $${priceAlert.abovePrice} ` : ""}
              {priceAlert.belowPrice ? `Below $${priceAlert.belowPrice}` : ""}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.actionContainer}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => decrementQuantity(item)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.quantityInput}
            value={quantity.toString()}
            onChangeText={(text) => updateAssetQuantity(item, text)}
            keyboardType="numeric"
            selectTextOnFocus
          />
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => incrementQuantity(item)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  assetInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  VerticalView: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  assetId: {
    fontSize: 18,
    fontWeight: "bold",
    width: 80,
  },
  assetName: {
    fontSize: 14,
    flex: 1,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.greyBG,
    borderRadius: 8,
    padding: 4,
  },
  actionContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  quantityButton: {
    width: 20,
    height: 20,
    backgroundColor: Colors.light.tint,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },

  alertButton: {
    flexDirection: "row",
    backgroundColor: Colors.light.tint,
    borderRadius: 6,
    padding: 4,
    marginTop: 8,
  },

  alertButtonText: {
    color: Colors.light.background,
    fontSize: 12,
  },
  alertText: {
    fontSize: 12,
    color: Colors.light.grey,
    marginTop: 4,
  },
  quantityButtonText: {
    color: Colors.light.background,
    fontSize: 14,
    fontWeight: "bold",
  },
  quantityInput: {
    textAlign: "center",
    fontSize: 14,
    minWidth: 40,
    paddingHorizontal: 8,
    marginHorizontal: 8,
  },
  assetItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.greyBG,
    justifyContent: "space-between",
  },
});

export default AssetItem;
