import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already verified
    if (user?.email_confirmed_at) {
      // User is verified, check if they have a profile
      if (profile && profile.program && profile.year_of_study) {
        // Profile is complete, go to home
        router.replace('/(tabs)');
      } else {
        // Need to complete profile
        router.replace('/create-profile');
      }
    }
  }, [user, profile]);

  const handleOpenEmail = () => {
    // Try to open the default email app
    Linking.openURL('message://');
  };

  const handleContinue = () => {
    // Check if verified
    if (user?.email_confirmed_at) {
      router.push('/create-profile');
    } else {
      Alert.alert(
        'Not Verified Yet',
        'Please check your email and click the verification link before continuing.'
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
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="mail" size={48} color="#7B68EE" />
            </View>
            <Text style={styles.title}>Check Your Email</Text>
            <Text style={styles.subtitle}>
              We sent a verification link to your @uwo.ca email. Click the link to verify your account.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.instructionText}>
              1. Check your email inbox{'\n'}
              2. Click the verification link{'\n'}
              3. Come back here and tap Continue
            </Text>

            <Pressable
              style={styles.emailButton}
              onPress={handleOpenEmail}
            >
              <Text style={styles.emailButtonText}>Open Email App</Text>
            </Pressable>

            <Pressable
              style={[styles.verifyButton, loading && styles.buttonDisabled]}
              onPress={handleContinue}
              disabled={loading}
            >
              <Text style={styles.verifyButtonText}>
                I've Verified - Continue
              </Text>
            </Pressable>

            <Pressable onPress={() => router.back()}>
              <Text style={styles.backText}>Back to Sign Up</Text>
            </Pressable>
          </View>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    maxWidth: 300,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 28,
    marginBottom: 24,
  },
  emailButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  emailButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  verifyButton: {
    backgroundColor: '#7B68EE',
    borderRadius: 24,
    paddingVertical: 16,
    marginBottom: 16,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  backText: {
    textAlign: 'center',
    color: '#7B68EE',
    fontSize: 14,
    fontWeight: '600',
  },
});
