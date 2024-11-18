import { Link, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import Svg, { Path, Line, Text as SvgText, Circle } from "react-native-svg";
import DateTimePicker from "@react-native-community/datetimepicker";
import { API_KEY, API_URL, GET_EXCHANGERATE } from "../api/apis";
import { formatNumber } from "../helper";
import Colors from "../constants/Colors";

const CHART_WIDTH = Dimensions.get("window").width - 60;
const CHART_HEIGHT = 200;
const PADDING = 20;
const CHART_COLOR = "#007AFF";

interface HistoricalData {
  date: string;
  price: number;
}

export default function CryptoDetailsScreen() {
  const params = useLocalSearchParams();
  const assetItem = JSON.parse(params?.assetItem as string);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
  );

  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);

  const fetchHistoricalData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/${GET_EXCHANGERATE}${assetItem?.asset_id}/USD/history`,
        {
          params: {
            period_id: "1HRS",
            time_start: startDate.toISOString(),
            time_end: endDate.toISOString(),
            limit: 12,
          },
          headers: {
            Accept: "text/plain",
            "X-CoinAPI-Key": API_KEY,
          },
        }
      );

      const formattedData = response.data.map(
        (item: { time_period_start: string; rate_close: number }) => ({
          date: new Date(item.time_period_start).toLocaleDateString(),
          price: item.rate_close,
        })
      );

      setHistoricalData(formattedData);
    } catch (error) {
      console.error("Error fetching historical data:", error);
    }
  };

  useEffect(() => {
    fetchHistoricalData();
  }, [startDate, endDate]);

  const chartData = useMemo(() => {
    if (historicalData.length === 0) return null;

    const prices = historicalData.map((d) => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    const points = historicalData.map((d, i) => ({
      x:
        (i * (CHART_WIDTH - PADDING * 2)) / (historicalData.length - 1) +
        PADDING,
      y:
        CHART_HEIGHT -
        ((d.price - minPrice) * (CHART_HEIGHT - PADDING * 2)) / priceRange -
        PADDING,
      price: d.price,
      date: d.date,
    }));

    const pathData = points.reduce((path, point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      return `${path} L ${point.x} ${point.y}`;
    }, "");

    return {
      points,
      pathData,
      minPrice,
      maxPrice,
    };
  }, [historicalData]);

  const PriceChart = () => {
    if (!chartData) return null;

    const { points, pathData, minPrice, maxPrice } = chartData;

    return (
      <View style={styles.chartContainer}>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          <SvgText x={5} y={15} fontSize="10" fill="#666">
            ${maxPrice.toLocaleString()}
          </SvgText>
          <SvgText x={5} y={CHART_HEIGHT - 5} fontSize="10" fill="#666">
            ${minPrice.toLocaleString()}
          </SvgText>

          <Path d={pathData} stroke={CHART_COLOR} strokeWidth="2" fill="none" />

          {points.map((point, index) => (
            <Circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={5}
              fill={selectedPoint === index ? CHART_COLOR : "white"}
              stroke={CHART_COLOR}
              strokeWidth="2"
              onPress={() => setSelectedPoint(index)}
            />
          ))}
        </Svg>

        {/* X-axis labels */}
        <View style={styles.xAxisLabels}>
          {points.map((point, index) => (
            <Text
              key={index}
              style={[
                styles.xAxisLabel,
                { width: (CHART_WIDTH - PADDING * 2) / points.length },
              ]}
            >
              {point.date}
            </Text>
          ))}
        </View>

        {/* Selected point info */}
        {selectedPoint !== null && (
          <View style={styles.tooltipContainer}>
            <Text style={styles.tooltipText}>{points[selectedPoint].date}</Text>
            <Text style={styles.tooltipText}>
              ${points[selectedPoint].price.toLocaleString()}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const FilterModal = () => (
    <Modal
      visible={showFilter}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilter(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Date Range</Text>

          <Pressable
            style={styles.dateButton}
            onPress={() => setShowStartPicker(true)}
          >
            <Text>Start Date: {startDate.toLocaleDateString()}</Text>
          </Pressable>

          {showStartPicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              onChange={(event, date) => {
                setShowStartPicker(false);
                if (date) setStartDate(date);
              }}
            />
          )}

          <Pressable
            style={styles.dateButton}
            onPress={() => setShowEndPicker(true)}
          >
            <Text>End Date: {endDate.toLocaleDateString()}</Text>
          </Pressable>

          {showEndPicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              onChange={(event, date) => {
                setShowEndPicker(false);
                if (date) setEndDate(date);
              }}
            />
          )}

          <Pressable
            style={styles.closeButton}
            onPress={() => setShowFilter(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{assetItem.asset_id}</Text>
          <Pressable
            style={styles.filterButton}
            onPress={() => setShowFilter(true)}
          >
            <Text style={styles.filterButtonText}>Filter</Text>
          </Pressable>
        </View>

        <PriceChart />

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Your balance</Text>
          <Text style={styles.balanceAmount}>
            USD {formatNumber(assetItem?.total)}
          </Text>
          <Text style={styles.btcBalance}>
            {assetItem?.asset_id} {assetItem.quantity.toFixed(2)}
          </Text>
        </View>

        <FilterModal />

        <Link href="/" style={styles.link}>
          Back to Main Screen
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  filterButton: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterButtonText: {
    fontSize: 16,
    color: "#000000",
  },
  chartContainer: {
    height: 250,
    backgroundColor: "#F5F5F5",
    paddingVertical: 10,
    marginBottom: 24,
  },
  xAxisLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  xAxisLabel: {
    fontSize: 8,
    color: Colors.light.greyText,
    textAlign: "center",
    transform: [{ rotate: "-45deg" }],
  },
  tooltipContainer: {
    position: "absolute",
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    top: 10,
    right: 10,
  },
  tooltipText: {
    fontSize: 12,
    color: "#333",
  },
  balanceContainer: {
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 18,
    color: "#000000",
    fontWeight: "600",
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  btcBalance: {
    fontSize: 16,
    color: Colors.light.greyText,
  },
  link: {
    marginTop: 24,
    color: Colors.light.tabIconSelected,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  dateButton: {
    backgroundColor: Colors.light.greyBG,
    padding: 12,
    marginBottom: 12,
  },
  closeButton: {
    backgroundColor: Colors.light.tabIconSelected,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  closeButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
