import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface Listing {
  id: string;
  title: string;
  price: number;
  condition: string;
  category: string;
}

interface ListingCardProps {
  listing: Listing;
  onPress?: () => void;
}

export default function ListingCard({ listing, onPress }: ListingCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.image}>
        <Ionicons name="image-outline" size={40} color="#999" />
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {listing.title}
        </Text>
        <View style={styles.meta}>
          <Ionicons name="pricetag-outline" size={12} color="#666" />
          <Text style={styles.condition}>{listing.condition}</Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.price}>${listing.price}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    height: 36,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  condition: {
    fontSize: 12,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#7B68EE',
  },
});
