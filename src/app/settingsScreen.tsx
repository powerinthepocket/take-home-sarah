import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
} from "react-native";
import Colors from "../constants/Colors";

interface PriceAlertModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  currentAsset: { name: string } | null;
  abovePrice: string;
  setAbovePrice: (value: string) => void;
  belowPrice: string;
  setBelowPrice: (value: string) => void;
  savePriceAlert: () => Promise<void>;
}

const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  modalVisible,
  setModalVisible,
  currentAsset,
  abovePrice,
  setAbovePrice,
  belowPrice,
  setBelowPrice,
  savePriceAlert,
}) => (
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
          <TouchableOpacity style={styles.modalButton} onPress={savePriceAlert}>
            <Text style={styles.modalButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
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

export default PriceAlertModal;
