import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

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
      
      {/* Sticky Header with gradient */}
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
            <Ionicons name="notifications-outline" size={22} color="#7B68EE" />
          </Pressable>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={22} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search here"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      {/* Scrollable Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

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
                <Ionicons 
                  name={
                    category === 'All' ? 'sparkles' :
                    category === 'Books' ? 'book' :
                    category === 'Electronics' ? 'laptop' :
                    category === 'Furniture' ? 'bed' :
                    category === 'Clothing' ? 'shirt' :
                    'cube'
                  } 
                  size={18} 
                  color={selectedCategory === category ? 'white' : '#666'} 
                />
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
                  <Ionicons name="image-outline" size={40} color="#999" />
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
                  <Ionicons name="image-outline" size={40} color="#999" />
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
        <Ionicons name="cart-outline" size={28} color="#7B68EE" />
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
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
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
  categorySection: {
    backgroundColor: '#F8F9FA',
    paddingVertical: 8,
    paddingBottom: 20,
  },
  categoryScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryChipSelected: {
    backgroundColor: '#7B68EE',
    borderColor: '#7B68EE',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  categoryTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
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
    paddingHorizontal: 20,
    gap: 12,
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
    bottom: 90,
    right: 16,
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
});
