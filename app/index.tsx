import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

export default function StartPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#7B68EE', '#9370DB', '#8B7BB8']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.content}>
          {/* Logo and Title */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoIcon}>🛒</Text>
            </View>
            <Text style={styles.title}>Axis</Text>
            <Text style={styles.subtitle}>
              Shop and sell locally. Join the school community
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.primaryButton}
              onPress={() => router.push('/sign-in')}
            >
              <Text style={styles.primaryButtonText}>Sign In</Text>
              <Text style={styles.arrow}>›</Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              onPress={() => router.push('/sign-up')}
            >
              <Text style={styles.secondaryButtonText}>Create an account</Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingTop: 120,
    paddingBottom: 60,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 56,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: 'white',
    marginBottom: 12,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 22,
  },
  buttonContainer: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: 'white',
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7B68EE',
    marginRight: 8,
  },
  arrow: {
    fontSize: 24,
    color: '#7B68EE',
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderWidth: 2,
    borderColor: 'white',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
});
