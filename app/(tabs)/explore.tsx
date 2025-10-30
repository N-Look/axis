import ActiveFilters from '@/components/explore/ActiveFilters';
import FilterModal, { Filters } from '@/components/explore/FilterModal';
import ListingCard, { Listing } from '@/components/explore/ListingCard';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// Dummy data for listings
const DUMMY_LISTINGS: Listing[] = [
  { id: '1', title: 'Calculus Textbook', price: 45, condition: 'Like New', category: 'Books' },
  { id: '2', title: 'Desk Lamp', price: 20, condition: 'Good', category: 'Furniture' },
  { id: '3', title: 'Winter Jacket', price: 60, condition: 'Like New', category: 'Clothing' },
  { id: '4', title: 'Laptop Stand', price: 35, condition: 'Fair', category: 'Electronics' },
  { id: '5', title: 'Biology Notes', price: 15, condition: 'Good', category: 'Books' },
  { id: '6', title: 'Mini Fridge', price: 80, condition: 'Like New', category: 'Appliances' },
  { id: '7', title: 'Chemistry Lab Coat', price: 25, condition: 'Good', category: 'Clothing' },
  { id: '8', title: 'Graphing Calculator', price: 50, condition: 'Like New', category: 'Electronics' },
  { id: '9', title: 'Office Chair', price: 70, condition: 'Fair', category: 'Furniture' },
  { id: '10', title: 'Physics Textbook', price: 55, condition: 'Good', category: 'Books' },
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    category: 'All',
    condition: 'All',
    minPrice: 0,
    maxPrice: 100,
  });

  const filteredListings = DUMMY_LISTINGS.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filters.category === 'All' || listing.category === filters.category;
    const matchesCondition = filters.condition === 'All' || listing.condition === filters.condition;
    const matchesPrice = listing.price >= filters.minPrice && listing.price <= filters.maxPrice;
    return matchesSearch && matchesCategory && matchesCondition && matchesPrice;
  });

  const activeFilterCount = [
    filters.category !== 'All',
    filters.condition !== 'All',
    filters.minPrice > 0 || filters.maxPrice < 100,
  ].filter(Boolean).length;

  const resetFilters = () => {
    setFilters({
      category: 'All',
      condition: 'All',
      minPrice: 0,
      maxPrice: 100,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header with gradient */}
      <LinearGradient
        colors={['#7B68EE', '#9370DB']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Explore</Text>
          <Text style={styles.headerSubtitle}>{filteredListings.length} items available</Text>
        </View>

        {/* Search Bar with Filter Button */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={22} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search items..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </Pressable>
            )}
          </View>

          {/* Filter Button */}
          <Pressable 
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons name="options-outline" size={22} color="#7B68EE" />
            {activeFilterCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </LinearGradient>

      {/* Active Filters Display */}
      <ActiveFilters
        filters={filters}
        onUpdateFilters={setFilters}
        onResetFilters={resetFilters}
      />

      {/* Listings Grid */}
      <FlatList
        data={filteredListings}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listingsContainer}
        columnWrapperStyle={styles.listingsRow}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ListingCard listing={item} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color="#CCC" />
            <Text style={styles.emptyStateText}>No items found</Text>
            <Text style={styles.emptyStateSubtext}>Try adjusting your filters</Text>
          </View>
        }
      />

      {/* Filter Modal */}
      <FilterModal
        visible={showFilters}
        filters={filters}
        onClose={() => setShowFilters(false)}
        onUpdateFilters={setFilters}
        onResetFilters={resetFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#7B68EE',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  filterBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
  },
  listingsContainer: {
    padding: 16,
  },
  listingsRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
});
