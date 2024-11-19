import { Link } from "expo-router";
import { View, Text, StyleSheet, SafeAreaView, FlatList } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PortfolioValue from "../component/PortfolioValue";
import Label from "../component/Label";
import Colors from "../constants/Colors";
import { GET_ASSETS } from "../api/apis";
import { useGetData } from "../api/queries";
import {
  calculatePercentageChange,
  formatNumber,
  getAssetsWithNonZeroVolume,
} from "../helper";
import { Ionicons } from "@expo/vector-icons";
import AssetCard from "../component/AssetCard";

export default function MainScreen() {
  const [savedAssets, setSavedAssets] = useState<any[]>([]);
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(0);

  const config = {
    retry: 1,
    refetchOnWindowFocus: false,
  };

  const { data, isLoading, isError } = useGetData<any>(GET_ASSETS);
  useEffect(() => {
    loadSavedAssets();
  }, []);

  useEffect(() => {
    if (data && savedAssets.length > 0) {
      calculateTotalPortfolioValue();
    }
  }, [data, savedAssets]);

  const loadSavedAssets = async () => {
    try {
      const saved = await AsyncStorage.getItem("userAssets");
      if (saved) {
        setSavedAssets(JSON.parse(saved));
      }
    } catch (error) {
      __DEV__ && console.error("Error loading saved assets:", error);
    }
  };

  const calculateTotalPortfolioValue = () => {
    const total = data.reduce((sum: number, asset: any) => {
      const savedAsset = savedAssets.find((saved) => {
        return saved.asset_id === asset.asset_id;
      });

      const price = typeof asset.price_usd === "number" ? asset.price_usd : 0;
      const quantity =
        savedAsset && typeof savedAsset.quantity === "number"
          ? savedAsset.quantity
          : 0;

      if (quantity > 0) {
        return sum + price * quantity;
      }
      return sum;
    }, 0);
    setTotalPortfolioValue(total);
  };

  const getFilteredAssets = () => {
    if (!data) return [];

    return data
      .filter((asset: any) =>
        savedAssets.some(
          (savedAsset) =>
            savedAsset.asset_id === asset.asset_id && savedAsset.quantity > 0
        )
      )
      .map((asset: any) => {
        const savedAsset = savedAssets.find(
          (saved) => saved.asset_id === asset.asset_id
        );
        return {
          ...asset,
          quantity: savedAsset?.quantity || 0,
          total: asset.volume_1hrs_usd * (savedAsset?.quantity || 0),
        };
      });
  };

  const renderAssetCard = ({ item }: { item: any }) => (
    <Link
      href={{
        pathname: "/cryptoDetailsScreen",
        params: {
          assetItem: JSON.stringify(item),
        },
      }}
      style={styles.settingsButton}
    >
      <AssetCard
        amount={item.price_usd}
        currency={item.asset_id}
        value={item.price_usd}
        percentage={calculatePercentageChange(
          item?.volume_1day_usd,
          item?.volume_1hrs_usd
        )}
        currencyTotal={item.asset_id}
        total={item.total}
      />
    </Link>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Link
          href={{
            pathname: "/settingsScreen",
            params: {
              assetsData: JSON.stringify(getAssetsWithNonZeroVolume(data)),
            },
          }}
          style={styles.settingsButton}
        >
          <Ionicons name="settings" size={30} color={Colors.light.greyText} />
        </Link>
      </View>
      <PortfolioValue value={formatNumber(totalPortfolioValue)} label="USD " />
      <Label label="Portfolio Value" />
      <View style={styles.chart} />
      <Label label="Assets" />

      {isLoading ? (
        <Text>Loading...</Text>
      ) : isError ? (
        <Text>Error loading assets</Text>
      ) : (
        <FlatList
          data={getFilteredAssets()}
          renderItem={renderAssetCard}
          keyExtractor={(item) => item?.asset_id?.toString()}
          style={styles.list}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.light.background,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  chart: {
    width: "100%",
    height: "30%",
    backgroundColor: Colors.light.tabIconDefault,
  },
  list: {
    width: "100%",
  },
  listContent: {
    paddingHorizontal: 16,
  },
  headerContainer: {
    alignSelf: "flex-end",
  },
  settingsButton: {
    backgroundColor: "white",
    borderRadius: 30,
  },
});
