import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const CATEGORIES = [
  'Books',
  'Electronics',
  'Furniture',
  'Clothing',
  'Appliances',
  'Sports',
  'Other',
];

const CONDITIONS = ['Like New', 'Good', 'Fair', 'Poor'];

const LOCATIONS = [
  'Main Campus',
  'Alumni Hall',
  'Delaware Hall',
  'Essex Hall',
  'Medway-Sydenham Hall',
  'Perth Hall',
  'Saugeen-Maitland Hall',
  'Off-Campus',
];

const MAX_IMAGES = 10;

export default function SellScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [location, setLocation] = useState('');

  const handleImagePicker = async () => {
    if (images.length >= MAX_IMAGES) {
      Alert.alert('Maximum Images', `You can only upload up to ${MAX_IMAGES} images.`);
      return;
    }

    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant permission to access your photos to upload images.'
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: MAX_IMAGES - images.length,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(asset => asset.uri);
      setImages(prev => [...prev, ...newImages].slice(0, MAX_IMAGES));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToStorage = async (): Promise<string[]> => {
    if (images.length === 0) return [];

    const uploadedUrls: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const imageUri = images[i];
      
      try {
        // Fetch the image as ArrayBuffer (works in React Native)
        const response = await fetch(imageUri);
        const arrayBuffer = await response.arrayBuffer();
        
        // Create a unique filename
        const fileExt = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `${user!.id}/${Date.now()}_${i}.${fileExt}`;
        const filePath = `listings/${fileName}`;

        // Upload to Supabase Storage using ArrayBuffer
        const { data, error } = await supabase.storage
          .from('listing-images')
          .upload(filePath, arrayBuffer, {
            contentType: `image/${fileExt}`,
            upsert: false,
          });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('listing-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload images');
      }
    }

    return uploadedUrls;
  };

  const validateForm = (): string | null => {
    if (!title.trim()) return 'Please enter a title';
    if (title.length < 3) return 'Title must be at least 3 characters';
    if (!description.trim()) return 'Please enter a description';
    if (description.length < 10) return 'Description must be at least 10 characters';
    if (!price.trim()) return 'Please enter a price';
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) return 'Please enter a valid price';
    if (!category) return 'Please select a category';
    if (!condition) return 'Please select a condition';
    if (!location) return 'Please select a location';
    return null;
  };

  const handleSubmit = async () => {
    // Validate form
    const error = validateForm();
    if (error) {
      Alert.alert('Validation Error', error);
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a listing');
      return;
    }

    setLoading(true);

    try {
      // Upload images to Supabase Storage
      let imageUrls: string[] = [];
      if (images.length > 0) {
        setUploadingImages(true);
        imageUrls = await uploadImagesToStorage();
        setUploadingImages(false);
      }

      // Insert listing into database
      const { data, error: insertError } = await supabase
        .from('listings')
        .insert({
          seller_id: user.id,
          title: title.trim(),
          description: description.trim(),
          price: parseFloat(price),
          category,
          condition,
          location,
          images: imageUrls,
          status: 'pending',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      Alert.alert(
        'Success!',
        'Your listing has been created and is pending approval.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setTitle('');
              setDescription('');
              setPrice('');
              setCategory('');
              setCondition('');
              setLocation('');
              setImages([]);
              // Navigate to explore tab
              router.push('/(tabs)/explore');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error creating listing:', error);
      Alert.alert(
        'Error',
        'Failed to create listing. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      
      {/* Header */}
      <LinearGradient colors={['#7B68EE', '#9370DB']} style={styles.header}>
        <Text style={styles.headerTitle}>Create Listing</Text>
        <Text style={styles.headerSubtitle}>Sell your items to other students</Text>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Upload Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Photos {images.length > 0 && `(${images.length}/${MAX_IMAGES})`}
          </Text>
          
          {/* Image Preview Grid */}
          {images.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imagePreviewScroll}
              contentContainerStyle={styles.imagePreviewContainer}
            >
              {images.map((uri, index) => (
                <View key={index} style={styles.imagePreviewWrapper}>
                  <Image source={{ uri }} style={styles.imagePreview} />
                  <Pressable
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close-circle" size={24} color="#FF3B30" />
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Add Photos Button */}
          {images.length < MAX_IMAGES && (
            <Pressable style={styles.imageUploadButton} onPress={handleImagePicker}>
              <Ionicons name="camera-outline" size={32} color="#7B68EE" />
              <Text style={styles.imageUploadText}>Add Photos</Text>
              <Text style={styles.imageUploadSubtext}>
                {images.length === 0
                  ? `Tap to add up to ${MAX_IMAGES} photos`
                  : `Add ${MAX_IMAGES - images.length} more photo(s)`}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Calculus Textbook 9th Edition"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your item, its condition, and any other relevant details..."
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={styles.charCount}>{description.length}/500</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price (CAD) *</Text>
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={[styles.input, styles.priceInput]}
                placeholder="0.00"
                placeholderTextColor="#999"
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category *</Text>
          <View style={styles.optionsGrid}>
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat}
                style={[
                  styles.optionButton,
                  category === cat && styles.optionButtonSelected,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.optionText,
                    category === cat && styles.optionTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Condition Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Condition *</Text>
          <View style={styles.optionsGrid}>
            {CONDITIONS.map((cond) => (
              <Pressable
                key={cond}
                style={[
                  styles.optionButton,
                  condition === cond && styles.optionButtonSelected,
                ]}
                onPress={() => setCondition(cond)}
              >
                <Text
                  style={[
                    styles.optionText,
                    condition === cond && styles.optionTextSelected,
                  ]}
                >
                  {cond}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Location Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location *</Text>
          <View style={styles.optionsGrid}>
            {LOCATIONS.map((loc) => (
              <Pressable
                key={loc}
                style={[
                  styles.optionButton,
                  location === loc && styles.optionButtonSelected,
                ]}
                onPress={() => setLocation(loc)}
              >
                <Text
                  style={[
                    styles.optionText,
                    location === loc && styles.optionTextSelected,
                  ]}
                >
                  {loc}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <Pressable
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="white" />
              <Text style={styles.loadingText}>
                {uploadingImages ? 'Uploading images...' : 'Creating listing...'}
              </Text>
            </View>
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={24} color="white" />
              <Text style={styles.submitButtonText}>Create Listing</Text>
            </>
          )}
        </Pressable>

        <Text style={styles.disclaimer}>
          * All listings are subject to approval by moderators
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  imagePreviewScroll: {
    marginBottom: 16,
  },
  imagePreviewContainer: {
    gap: 12,
  },
  imagePreviewWrapper: {
    position: 'relative',
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  imageUploadButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  imageUploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7B68EE',
    marginTop: 12,
  },
  imageUploadSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 120,
    paddingTop: 16,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingLeft: 16,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    borderWidth: 0,
    paddingLeft: 0,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  optionButtonSelected: {
    backgroundColor: '#7B68EE',
    borderColor: '#7B68EE',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  optionTextSelected: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#7B68EE',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    shadowColor: '#7B68EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  disclaimer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
});
