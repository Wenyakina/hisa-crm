import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    doc, getDoc, updateDoc
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    Alert, ScrollView, StyleSheet
} from 'react-native';
import {
    Button,
    Card,
    Text,
    TextInput
} from 'react-native-paper';
import { db } from '../firebaseConfig';

export default function AccountScreen() {
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        walletBalance: 0
    });

    useEffect(() => {
        const loadUser = async () => {
            const userStr = await AsyncStorage.getItem('user');
            if (userStr) {
                const userObj = JSON.parse(userStr);
                if (userObj?.id) {
                    setUserId(userObj.id);
                    await fetchUserData(userObj.id);
                }
            }
        };
        loadUser();
    }, []);

    const fetchUserData = async (uid) => {
        try {
            const docRef = doc(db, 'users', uid);
            const snapshot = await getDoc(docRef);
            if (snapshot.exists()) {
                setUserData({ ...snapshot.data() });
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
            Alert.alert('Failed to load user profile');
        }
    };

    const handleUpdateProfile = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            await updateDoc(doc(db, 'users', userId), {
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                company: userData.company
            });
            Alert.alert('Profile updated');
        } catch (err) {
            console.error(err);
            Alert.alert('Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async () => {
        const amount = parseFloat(withdrawAmount);

        if (isNaN(amount) || amount <= 0) {
            Alert.alert('Enter a valid withdrawal amount');
            return;
        }

        if (amount > userData.walletBalance) {
            Alert.alert('Withdrawal amount exceeds wallet balance');
            return;
        }

        setLoading(true);
        setTimeout(async () => {
            try {
                const newBalance = userData.walletBalance - amount;
                await updateDoc(doc(db, 'users', userId), {
                    walletBalance: newBalance
                });
                setUserData(prev => ({ ...prev, walletBalance: newBalance }));
                setWithdrawAmount('');
                Alert.alert(`KES ${amount.toLocaleString()} withdrawn to MPESA`);
            } catch (err) {
                console.error(err);
                Alert.alert('Withdrawal failed');
            } finally {
                setLoading(false);
            }
        }, 1500);
    };

    return (
        <ScrollView 
            contentContainerStyle={styles.scrollContent}
            style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium" style={{ marginBottom: 10 }}>
                        Wallet Balance: KES {userData.walletBalance?.toLocaleString() ?? 0}
                    </Text>

                    <TextInput
                        label="Amount to Withdraw"
                        value={withdrawAmount}
                        onChangeText={setWithdrawAmount}
                        keyboardType="numeric"
                        mode="outlined"
                        style={styles.input}
                    />

                    <Button
                        mode="contained"
                        onPress={handleWithdraw}
                        disabled={loading || userData.walletBalance <= 0}
                        style={styles.withdrawBtn}
                        labelStyle={{ color: '#ffffff' }}>
                        {loading ? 'Processing...' : 'Withdraw to MPESA'}
                    </Button>
                </Card.Content>
            </Card>

            <TextInput
                label="Full Name"
                value={userData.name}
                onChangeText={text => setUserData({ ...userData, name: text })}
                mode="outlined"
                style={styles.input}/>
            <TextInput
                label="Email"
                value={userData.email}
                onChangeText={text => setUserData({ ...userData, email: text })}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"/>
            <TextInput
                label="Phone"
                value={userData.phone}
                mode="outlined"
                style={styles.input}
                keyboardType="phone-pad"
                editable={false}/>

            <Button
                mode="contained"
                onPress={handleUpdateProfile}
                style={styles.updateBtn}
                disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    card: {
        marginBottom: 20,
        backgroundColor: '#ffffff',
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#ffffff',
    },
    withdrawBtn: {
        marginTop: 10,
        backgroundColor: '#2e7d32',
        borderRadius: 5
    },
    updateBtn: {
        marginTop: 10,
        padding: 4,
        backgroundColor: '#1976d2',
        borderRadius: 5
    },
});
