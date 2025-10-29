import { useState } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/contexts/AuthContext';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!email.endsWith('@uwo.ca')) {
      Alert.alert('Error', 'Please use your @uwo.ca email address');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, password, firstName, lastName);
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert(
        'Check your email',
        'We sent you a verification code to your @uwo.ca email',
        [
          {
            text: 'OK',
            onPress: () => router.push('/verify-email'),
          },
        ]
      );
    }
  };


  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#7B68EE', '#9370DB']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {/* Back Button */}
        <Pressable style={styles.topBackButton} onPress={() => router.back()}>
          <Text style={styles.topBackButtonText}>← Back</Text>
        </Pressable>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoIcon}>🛒</Text>
              </View>
              <Text style={styles.title}>Axis</Text>
            </View>

            {/* Form Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Sign Up</Text>

              <View style={styles.nameRow}>
                <View style={styles.nameInput}>
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
                <View style={styles.nameInput}>
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
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Your school address</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="email@uwo.ca"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Choose a password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  secureTextEntry
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm password</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm Password"
                  placeholderTextColor="#999"
                  secureTextEntry
                />
              </View>

              <Pressable
                style={[styles.continueButton, loading && styles.buttonDisabled]}
                onPress={handleSignUp}
                disabled={loading}
              >
                <Text style={styles.continueButtonText}>
                  {loading ? 'Creating account...' : 'Continue'}
                </Text>
              </Pressable>

              <Pressable onPress={() => router.push('/sign-in')}>
                <Text style={styles.switchText}>
                  Already have an account? <Text style={styles.switchLink}>Sign In</Text>
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  topBackButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  topBackButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2D1B69',
    marginBottom: 24,
    textAlign: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  nameInput: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
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
  continueButton: {
    backgroundColor: '#7B68EE',
    borderRadius: 24,
    paddingVertical: 16,
    marginTop: 8,
    marginBottom: 16,
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
  switchText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  switchLink: {
    color: '#7B68EE',
    fontWeight: '600',
  },
});
