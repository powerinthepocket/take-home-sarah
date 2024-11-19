import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../constants/Colors";
import { formatNumber } from "../helper";
import { Ionicons } from "@expo/vector-icons";

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

const SettingsScreen = () => {
  const params = useLocalSearchParams();
  const assetsData = JSON.parse(params.assetsData as string);

  const [selectedAssets, setSelectedAssets] = useState<Asset[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);
  const [abovePrice, setAbovePrice] = useState("");
  const [belowPrice, setBelowPrice] = useState("");
  const navigation = useNavigation();

  const loadSavedAssets = useCallback(async () => {
    try {
      const savedAssets = await AsyncStorage.getItem("userAssets");
      if (savedAssets) {
        setSelectedAssets(JSON.parse(savedAssets));
      }
    } catch (error) {
      __DEV__ && console.error("Error loading assets:", error);
    }
  }, []);

  useEffect(() => {
    loadSavedAssets();
  }, [loadSavedAssets]);

  const updateAssetQuantity = useCallback((asset: Asset, quantity: string) => {
    setSelectedAssets((prevSelected: Asset[]) => {
      const newQuantity = Math.max(0, parseInt(quantity) || 0);
      const existingIndex = prevSelected.findIndex(
        (item) => item.asset_id === asset.asset_id
      );

      if (existingIndex >= 0) {
        if (newQuantity === 0) {
          return prevSelected.filter(
            (item) => item.asset_id !== asset.asset_id
          );
        }
        const newSelected = [...prevSelected];
        newSelected[existingIndex] = { ...asset, quantity: newQuantity };
        return newSelected;
      } else if (newQuantity > 0) {
        return [...prevSelected, { ...asset, quantity: newQuantity }];
      }
      return prevSelected;
    });
  }, []);

  const incrementQuantity = (asset: Asset) => {
    const currentAsset = selectedAssets.find(
      (item) => item.asset_id === asset.asset_id
    );
    const currentQuantity = currentAsset ? currentAsset?.quantity || 0 : 0;
    updateAssetQuantity(asset, (currentQuantity + 1).toString());
  };

  const decrementQuantity = (asset: Asset) => {
    const currentAsset = selectedAssets.find(
      (item) => item.asset_id === asset.asset_id
    );
    const currentQuantity = currentAsset ? currentAsset.quantity || 0 : 0;
    updateAssetQuantity(asset, (currentQuantity - 1).toString());
  };

  const openPriceAlertModal = (asset: Asset) => {
    setCurrentAsset(asset);
    const existingAlert = selectedAssets.find(
      (a) => a.asset_id === asset.asset_id
    )?.priceAlert;

    setAbovePrice(existingAlert?.abovePrice?.toString() || "");
    setBelowPrice(existingAlert?.belowPrice?.toString() || "");
    setModalVisible(true);
  };

  const savePriceAlert = async () => {
    if (!currentAsset) return;

    try {
      const updatedAssets = selectedAssets.map((asset) =>
        asset.asset_id === currentAsset.asset_id
          ? {
              ...asset,
              priceAlert: {
                abovePrice: abovePrice ? parseFloat(abovePrice) : undefined,
                belowPrice: belowPrice ? parseFloat(belowPrice) : undefined,
              },
            }
          : asset
      );

      await AsyncStorage.setItem("userAssets", JSON.stringify(updatedAssets));

      setSelectedAssets(updatedAssets);
      setModalVisible(false);
    } catch (error) {
      __DEV__ && console.error("Error saving price alert:", error);
      Alert.alert("Error", "Failed to save price alert");
    }
  };

  const renderPriceAlertModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Price Alert for {currentAsset?.name}
          </Text>

          <View style={styles.alertInputContainer}>
            <Text>Alert when price goes above:</Text>
            <TextInput
              style={styles.alertInput}
              value={abovePrice}
              onChangeText={setAbovePrice}
              keyboardType="numeric"
              placeholder="Enter price"
            />
          </View>

          <View style={styles.alertInputContainer}>
            <Text>Alert when price goes below:</Text>
            <TextInput
              style={styles.alertInput}
              value={belowPrice}
              onChangeText={setBelowPrice}
              keyboardType="numeric"
              placeholder="Enter price"
            />
          </View>

          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={savePriceAlert}
            >
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderAssetItem = useCallback(
    ({ item }: { item: Asset }) => {
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
                  {priceAlert.abovePrice
                    ? `Above $${priceAlert.abovePrice} `
                    : ""}
                  {priceAlert.belowPrice
                    ? `Below $${priceAlert.belowPrice}`
                    : ""}
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
    },
    [selectedAssets]
  );

  const saveAssets = async () => {
    try {
      await AsyncStorage.setItem("userAssets", JSON.stringify(selectedAssets));
      navigation.goBack();
    } catch (error) {
      __DEV__ && console.error("Error saving assets:", error);
    }
  };
  const handelCancel = () => {
    navigation.goBack();
  };

  const getItemLayout = useCallback(
    (data: Asset[] | null | undefined, index: number) => {
      const ITEM_HEIGHT = 80;
      return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index };
    },
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Assets</Text>
        <Text style={styles.subtitle}>
          Selected: {selectedAssets.length} assets
        </Text>
      </View>

      <FlatList
        data={assetsData}
        renderItem={renderAssetItem}
        keyExtractor={(item) => item.asset_id}
        style={styles.list}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={5}
        getItemLayout={getItemLayout}
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveAssets}>
        <Text style={styles.saveButtonText}>Save Selection</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveButton} onPress={handelCancel}>
        <Text style={styles.saveButtonText}>Cancel</Text>
      </TouchableOpacity>

      {renderPriceAlertModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.greyBG,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.grey,
    marginTop: 8,
  },
  list: {
    flex: 1,
  },
  assetItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.greyBG,
    justifyContent: "space-between",
  },
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
  quantityButton: {
    width: 20,
    height: 20,
    backgroundColor: Colors.light.tint,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
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
  saveButton: {
    backgroundColor: Colors.light.tint,
    padding: 14,
    margin: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: Colors.light.background,
    fontSize: 18,
    fontWeight: "bold",
  },
  actionContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  alertInputContainer: {
    width: "100%",
    marginVertical: 10,
  },
  alertInput: {
    borderWidth: 1,
    borderColor: Colors.light.greyBG,
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
  },
  modalButton: {
    backgroundColor: Colors.light.tint,
    padding: 10,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
  },
  modalButtonText: {
    color: Colors.light.background,
    fontWeight: "bold",
  },
});

export default SettingsScreen;
