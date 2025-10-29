import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/contexts/AuthContext';

// Dummy data for listings
const DUMMY_LISTINGS = [
  { id: '1', title: 'Calculus Textbook', price: 45, image: 'https://via.placeholder.com/150', category: 'Books' },
  { id: '2', title: 'Desk Lamp', price: 20, image: 'https://via.placeholder.com/150', category: 'Furniture' },
  { id: '3', title: 'Winter Jacket', price: 60, image: 'https://via.placeholder.com/150', category: 'Clothing' },
  { id: '4', title: 'Laptop Stand', price: 35, image: 'https://via.placeholder.com/150', category: 'Electronics' },
  { id: '5', title: 'Biology Notes', price: 15, image: 'https://via.placeholder.com/150', category: 'Books' },
  { id: '6', title: 'Mini Fridge', price: 80, image: 'https://via.placeholder.com/150', category: 'Appliances' },
];

const CATEGORIES = ['All', 'Books', 'Electronics', 'Furniture', 'Clothing', 'Other'];

export default function HomeScreen() {
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredListings = DUMMY_LISTINGS.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header with gradient */}
      <LinearGradient
        colors={['#7B68EE', '#9370DB']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View style={styles.welcomeSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {profile?.first_name?.[0] || 'U'}
              </Text>
            </View>
            <View>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.userName}>{profile?.first_name || 'User'}</Text>
            </View>
          </View>
          
          <Pressable style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </Pressable>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search here"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      {/* Category Filter */}
      <View style={styles.categorySection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((category) => (
            <Pressable
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipSelected,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <View style={styles.categoryIcon}>
                <Text style={styles.categoryIconText}>
                  {category === 'All' ? '☰' : '📦'}
                </Text>
              </View>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextSelected,
                ]}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Listings */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* For You Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>For you</Text>
            <Pressable>
              <Text style={styles.viewMore}>View more</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listingScroll}
          >
            {filteredListings.slice(0, 3).map((listing) => (
              <Pressable key={listing.id} style={styles.listingCard}>
                <View style={styles.listingImage}>
                  <Text style={styles.placeholderText}>📷</Text>
                </View>
                <Text style={styles.listingTitle}>{listing.title}</Text>
                <Text style={styles.listingPrice}>${listing.price}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Something Else Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular items</Text>
            <Pressable>
              <Text style={styles.viewMore}>View more</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listingScroll}
          >
            {filteredListings.slice(3, 6).map((listing) => (
              <Pressable key={listing.id} style={styles.listingCard}>
                <View style={styles.listingImage}>
                  <Text style={styles.placeholderText}>📷</Text>
                </View>
                <Text style={styles.listingTitle}>{listing.title}</Text>
                <Text style={styles.listingPrice}>${listing.price}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Shopping Cart FAB */}
      <Pressable style={styles.cartFab}>
        <Text style={styles.cartIcon}>🛒</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#7B68EE',
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    fontSize: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchIcon: {
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categorySection: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  categoryScroll: {
    paddingHorizontal: 24,
    gap: 16,
  },
  categoryChip: {
    alignItems: 'center',
    gap: 8,
  },
  categoryChipSelected: {
    opacity: 1,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIconText: {
    fontSize: 24,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#7B68EE',
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  viewMore: {
    fontSize: 14,
    color: '#7B68EE',
    fontWeight: '600',
  },
  listingScroll: {
    paddingHorizontal: 24,
    gap: 16,
  },
  listingCard: {
    width: 120,
  },
  listingImage: {
    width: 120,
    height: 120,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 32,
  },
  listingTitle: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  listingPrice: {
    fontSize: 16,
    color: '#7B68EE',
    fontWeight: '700',
  },
  cartFab: {
    position: 'absolute',
    bottom: 80,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  cartIcon: {
    fontSize: 24,
  },
});
