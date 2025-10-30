import { View, Text, StyleSheet, ScrollView, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const CATEGORIES = ['All', 'Books', 'Electronics', 'Furniture', 'Clothing', 'Appliances', 'Other'];
const CONDITIONS = ['All', 'Like New', 'Good', 'Fair'];

export interface Filters {
  category: string;
  condition: string;
  minPrice: number;
  maxPrice: number;
}

interface FilterModalProps {
  visible: boolean;
  filters: Filters;
  onClose: () => void;
  onUpdateFilters: (filters: Filters) => void;
  onResetFilters: () => void;
}

export default function FilterModal({
  visible,
  filters,
  onClose,
  onUpdateFilters,
  onResetFilters,
}: FilterModalProps) {
  const updateFilter = (key: keyof Filters, value: any) => {
    onUpdateFilters({ ...filters, [key]: value });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </Pressable>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Category Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Category</Text>
              <View style={styles.filterOptions}>
                {CATEGORIES.map((category) => (
                  <Pressable
                    key={category}
                    style={[
                      styles.filterOption,
                      filters.category === category && styles.filterOptionSelected,
                    ]}
                    onPress={() => updateFilter('category', category)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.category === category && styles.filterOptionTextSelected,
                      ]}
                    >
                      {category}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Condition Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Condition</Text>
              <View style={styles.filterOptions}>
                {CONDITIONS.map((condition) => (
                  <Pressable
                    key={condition}
                    style={[
                      styles.filterOption,
                      filters.condition === condition && styles.filterOptionSelected,
                    ]}
                    onPress={() => updateFilter('condition', condition)}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.condition === condition && styles.filterOptionTextSelected,
                      ]}
                    >
                      {condition}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Price Range Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Price Range</Text>
              <View style={styles.priceRangeContainer}>
                <Text style={styles.priceLabel}>${filters.minPrice}</Text>
                <Text style={styles.priceLabel}>${filters.maxPrice}</Text>
              </View>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Min</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  step={5}
                  value={filters.minPrice}
                  onValueChange={(value: number) => updateFilter('minPrice', value)}
                  minimumTrackTintColor="#7B68EE"
                  maximumTrackTintColor="#E0E0E0"
                  thumbTintColor="#7B68EE"
                />
              </View>
              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>Max</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={100}
                  step={5}
                  value={filters.maxPrice}
                  onValueChange={(value: number) => updateFilter('maxPrice', value)}
                  minimumTrackTintColor="#7B68EE"
                  maximumTrackTintColor="#E0E0E0"
                  thumbTintColor="#7B68EE"
                />
              </View>
            </View>
          </ScrollView>

          {/* Modal Footer */}
          <View style={styles.modalFooter}>
            <Pressable style={styles.resetButton} onPress={onResetFilters}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </Pressable>
            <Pressable style={styles.applyButton} onPress={onClose}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterOptionSelected: {
    backgroundColor: '#7B68EE',
    borderColor: '#7B68EE',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterOptionTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  priceRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7B68EE',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#666',
    width: 30,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#7B68EE',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
