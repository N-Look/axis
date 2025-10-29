import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const { profile } = useAuth();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>
        {profile?.first_name} {profile?.last_name}
      </Text>
      <Text style={styles.email}>{profile?.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#999',
  },
});
