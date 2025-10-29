import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

const PROGRAMS = [
  'Engineering',
  'Business',
  'Science',
  'Arts & Humanities',
  'Social Science',
  'Health Sciences',
  'Music',
  'Other',
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'];

export default function CreateProfilePage() {
  const router = useRouter();
  const { updateProfile, profile, user, createProfileIfMissing } = useAuth();
  const [loading, setLoading] = useState(false);
  const [needsProfileCreation, setNeedsProfileCreation] = useState(false);

  const [program, setProgram] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [bio, setBio] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [customProgram, setCustomProgram] = useState('');
  const [showProgramPicker, setShowProgramPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  useEffect(() => {
    // Check if profile exists
    if (user && !profile) {
      setNeedsProfileCreation(true);
      // Try to get name from user metadata
      const metadata = user.user_metadata;
      if (metadata?.first_name) setFirstName(metadata.first_name);
      if (metadata?.last_name) setLastName(metadata.last_name);
    }
  }, [user, profile]);

  const handleContinue = async () => {
    if (!program || !yearOfStudy) {
      Alert.alert('Error', 'Please select your program and year of study');
      return;
    }

    // Check if Other is selected and custom program is empty
    if (program === 'Other' && !customProgram.trim()) {
      Alert.alert('Error', 'Please enter your program name');
      return;
    }

    setLoading(true);

    // If profile doesn't exist, create it first
    if (needsProfileCreation) {
      if (!firstName || !lastName) {
        Alert.alert('Error', 'Please enter your name');
        setLoading(false);
        return;
      }

      const { error: createError } = await createProfileIfMissing(firstName, lastName);
      if (createError) {
        Alert.alert('Error', createError.message);
        setLoading(false);
        return;
      }
    }

    // Update profile with program and year
    const finalProgram = program === 'Other' ? customProgram : program;
    const { error } = await updateProfile({
      program: finalProgram,
      year_of_study: yearOfStudy,
      bio: bio || null,
      phone_number: phoneNumber || null,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={48} color="#7B68EE" />
            </View>
            <Text style={styles.greeting}>
              Hi {profile?.first_name || firstName || 'there'}!
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {needsProfileCreation && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>First Name</Text>
                  <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="First Name"
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Last Name</Text>
                  <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Last Name"
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                  />
                </View>
              </>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Program</Text>
              <Pressable
                style={styles.dropdown}
                onPress={() => setShowProgramPicker(true)}
              >
                <Text style={program ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {program || 'Select your program'}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </Pressable>
            </View>

            {program === 'Other' && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Enter Your Program</Text>
                <TextInput
                  style={styles.input}
                  value={customProgram}
                  onChangeText={setCustomProgram}
                  placeholder="e.g., Kinesiology, Nursing, etc."
                  placeholderTextColor="#999"
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Year of Study</Text>
              <Pressable
                style={styles.dropdown}
                onPress={() => setShowYearPicker(true)}
              >
                <Text style={yearOfStudy ? styles.dropdownText : styles.dropdownPlaceholder}>
                  {yearOfStudy || 'Select your year'}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </Pressable>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bio (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number (Optional)</Text>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="(123) 456-7890"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
            </View>

            <Pressable
              style={[styles.continueButton, loading && styles.buttonDisabled]}
              onPress={handleContinue}
              disabled={loading}
            >
              <Text style={styles.continueButtonText}>
                {loading ? 'Saving...' : 'Continue'}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={showProgramPicker} transparent={true} animationType="slide" onRequestClose={() => setShowProgramPicker(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowProgramPicker(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Program</Text>
              <Pressable onPress={() => setShowProgramPicker(false)}>
                <Text style={styles.modalClose}>×</Text>
              </Pressable>
            </View>
            <ScrollView style={styles.modalList}>
              {PROGRAMS.map((prog) => (
                <Pressable key={prog} style={styles.modalItem} onPress={() => { setProgram(prog); setShowProgramPicker(false); }}>
                  <Text style={styles.modalItemText}>{prog}</Text>
                  {program === prog && <Text style={styles.checkmark}>✓</Text>}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      <Modal visible={showYearPicker} transparent={true} animationType="slide" onRequestClose={() => setShowYearPicker(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowYearPicker(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Year of Study</Text>
              <Pressable onPress={() => setShowYearPicker(false)}>
                <Text style={styles.modalClose}>×</Text>
              </Pressable>
            </View>
            <ScrollView style={styles.modalList}>
              {YEARS.map((year) => (
                <Pressable key={year} style={styles.modalItem} onPress={() => { setYearOfStudy(year); setShowYearPicker(false); }}>
                  <Text style={styles.modalItemText}>{year}</Text>
                  {yearOfStudy === year && <Text style={styles.checkmark}>✓</Text>}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8E4F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2D1B69',
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  dropdown: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D1B69',
  },
  modalClose: {
    fontSize: 24,
    color: '#666',
    fontWeight: '300',
  },
  modalList: {
    padding: 8,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  checkmark: {
    fontSize: 18,
    color: '#7B68EE',
    fontWeight: '700',
  },
  continueButton: {
    backgroundColor: '#7B68EE',
    borderRadius: 24,
    paddingVertical: 16,
    marginTop: 8,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
