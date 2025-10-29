import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Filters } from './FilterModal';

interface ActiveFiltersProps {
  filters: Filters;
  onUpdateFilters: (filters: Filters) => void;
  onResetFilters: () => void;
}

export default function ActiveFilters({
  filters,
  onUpdateFilters,
  onResetFilters,
}: ActiveFiltersProps) {
  const activeFilterCount = [
    filters.category !== 'All',
    filters.condition !== 'All',
    filters.location !== 'All',
    filters.minPrice > 0 || filters.maxPrice < 100,
  ].filter(Boolean).length;

  if (activeFilterCount === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {filters.category !== 'All' && (
          <View style={styles.filterChip}>
            <Text style={styles.filterText}>{filters.category}</Text>
            <Pressable onPress={() => onUpdateFilters({ ...filters, category: 'All' })}>
              <Ionicons name="close" size={14} color="#7B68EE" />
            </Pressable>
          </View>
        )}
        {filters.condition !== 'All' && (
          <View style={styles.filterChip}>
            <Text style={styles.filterText}>{filters.condition}</Text>
            <Pressable onPress={() => onUpdateFilters({ ...filters, condition: 'All' })}>
              <Ionicons name="close" size={14} color="#7B68EE" />
            </Pressable>
          </View>
        )}
        {filters.location !== 'All' && (
          <View style={styles.filterChip}>
            <Text style={styles.filterText}>{filters.location}</Text>
            <Pressable onPress={() => onUpdateFilters({ ...filters, location: 'All' })}>
              <Ionicons name="close" size={14} color="#7B68EE" />
            </Pressable>
          </View>
        )}
        {(filters.minPrice > 0 || filters.maxPrice < 100) && (
          <View style={styles.filterChip}>
            <Text style={styles.filterText}>
              ${filters.minPrice}-${filters.maxPrice}
            </Text>
            <Pressable
              onPress={() => onUpdateFilters({ ...filters, minPrice: 0, maxPrice: 100 })}
            >
              <Ionicons name="close" size={14} color="#7B68EE" />
            </Pressable>
          </View>
        )}
        <Pressable style={styles.clearAllButton} onPress={onResetFilters}>
          <Text style={styles.clearAllText}>Clear all</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8E4F3',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    gap: 6,
  },
  filterText: {
    color: '#7B68EE',
    fontSize: 13,
    fontWeight: '600',
  },
  clearAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  clearAllText: {
    color: '#7B68EE',
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
