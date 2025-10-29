import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import FilterModal, { Filters } from '@/components/explore/FilterModal';
import ActiveFilters from '@/components/explore/ActiveFilters';
import ListingCard, { Listing } from '@/components/explore/ListingCard';

// Dummy data for listings
const DUMMY_LISTINGS: Listing[] = [
  { id: '1', title: 'Calculus Textbook', price: 45, condition: 'Like New', category: 'Books', location: 'North Campus' },
  { id: '2', title: 'Desk Lamp', price: 20, condition: 'Good', category: 'Furniture', location: 'South Campus' },
  { id: '3', title: 'Winter Jacket', price: 60, condition: 'Like New', category: 'Clothing', location: 'West Campus' },
  { id: '4', title: 'Laptop Stand', price: 35, condition: 'Fair', category: 'Electronics', location: 'North Campus' },
  { id: '5', title: 'Biology Notes', price: 15, condition: 'Good', category: 'Books', location: 'East Campus' },
  { id: '6', title: 'Mini Fridge', price: 80, condition: 'Like New', category: 'Appliances', location: 'South Campus' },
  { id: '7', title: 'Chemistry Lab Coat', price: 25, condition: 'Good', category: 'Clothing', location: 'North Campus' },
  { id: '8', title: 'Graphing Calculator', price: 50, condition: 'Like New', category: 'Electronics', location: 'West Campus' },
  { id: '9', title: 'Office Chair', price: 70, condition: 'Fair', category: 'Furniture', location: 'East Campus' },
  { id: '10', title: 'Physics Textbook', price: 55, condition: 'Good', category: 'Books', location: 'South Campus' },
];

export default function ExploreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    category: 'All',
    condition: 'All',
    location: 'All',
    minPrice: 0,
    maxPrice: 100,
  });

  const filteredListings = DUMMY_LISTINGS.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filters.category === 'All' || listing.category === filters.category;
    const matchesCondition = filters.condition === 'All' || listing.condition === filters.condition;
    const matchesLocation = filters.location === 'All' || listing.location === filters.location;
    const matchesPrice = listing.price >= filters.minPrice && listing.price <= filters.maxPrice;
    return matchesSearch && matchesCategory && matchesCondition && matchesLocation && matchesPrice;
  });

  const activeFilterCount = [
    filters.category !== 'All',
    filters.condition !== 'All',
    filters.location !== 'All',
    filters.minPrice > 0 || filters.maxPrice < 100,
  ].filter(Boolean).length;

  const resetFilters = () => {
    setFilters({
      category: 'All',
      condition: 'All',
      location: 'All',
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

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search items..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#999" />
            </Pressable>
          )}
        </View>

        {/* Filter Button */}
        <Pressable 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="options-outline" size={20} color="white" />
          <Text style={styles.filterButtonText}>Filters</Text>
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </Pressable>
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
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerContent: {
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  filterBadge: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#7B68EE',
    fontSize: 12,
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
