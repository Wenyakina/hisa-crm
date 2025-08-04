import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    addDoc, collection, doc, getDoc, getDocs,
    orderBy, query, updateDoc
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator, Alert, ScrollView,
    StyleSheet, View
} from 'react-native';
import {
    Button, Card, List, Text, TextInput
} from 'react-native-paper';
import { db } from '../firebaseConfig';

export default function MPESAWalletScreen({ navigation }) {
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState('');
    const [phone, setPhone] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getUserIdFromStorage = async () => {
            try {
                const userStr = await AsyncStorage.getItem('user');
                if (userStr) {
                    const userObj = JSON.parse(userStr);
                    if (userObj?.id) {
                        setUserId(userObj.id);
                        fetchUserData(userObj.id);
                        fetchTransactions(userObj.id);
                    }
                }
            } catch (err) {
                console.error('Failed to retrieve user from storage:', err);
            }
        };

        getUserIdFromStorage();
    }, []);

    const fetchUserData = async (uid) => {
        try {
            const userDocRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const data = userDoc.data();
                if (data?.portfolioBalance != null) {
                    setBalance(data.portfolioBalance);
                }
            }
        } catch (err) {
            console.error('Failed to fetch user data:', err);
        }
    };

    const fetchTransactions = async (uid) => {
        try {
            const txRef = collection(db, 'users', uid, 'transactions');
            const q = query(txRef, orderBy('date', 'desc'));
            const snapshot = await getDocs(q);
            const txList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTransactions(txList.slice(0, 5));
        } catch (err) {
            console.error('Failed to fetch transactions:', err);
        }
    };

    const generateReceipt = () => 'MP' + Math.floor(Math.random() * 1000000);

    const simulateSTKPush = () => {
        return new Promise(resolve => setTimeout(resolve, 1000));
    };

    const handleDeposit = async () => {
        const amt = parseFloat(amount);
        if (isNaN(amt) || amt <= 0) {
            Alert.alert('Invalid amount');
            return;
        }

        if (!phone || phone.length < 10) {
            Alert.alert('Enter a valid phone number');
            return;
        }

        if (!userId) {
            Alert.alert('User not loaded yet');
            return;
        }

        setLoading(true);

        try {
            // Simulate STK push
            console.log('Simulating STK push to', phone);
            await simulateSTKPush();

            Alert.alert('MPESA Payment Successful');

            // Update balance
            const newBalance = balance + amt;
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                portfolioBalance: newBalance
            });
            setBalance(newBalance);

            // Log transaction
            const txRef = collection(db, 'users', userId, 'transactions');
            const newTx = {
                type: 'Deposit',
                amount: amt,
                date: new Date().toISOString(),
                phone,
                receipt: generateReceipt()
            };
            const docRef = await addDoc(txRef, newTx);
            setTransactions([{ id: docRef.id, ...newTx }, ...transactions]);

            // Clear inputs
            setAmount('');
            setPhone('');
        } catch (err) {
            console.error('Error during deposit:', err);
            Alert.alert('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="headlineSmall">
                            Balance: KES {balance.toLocaleString()}
                        </Text>
                    </Card.Content>
                </Card>

                <TextInput
                    label="Phone Number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    mode="outlined"
                    style={styles.input}
                    placeholder="e.g. 07XXXXXXXX"
                />

                <TextInput
                    label="Amount (KES)"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    mode="outlined"
                    style={styles.input}
                />

                <Button
                    mode="contained"
                    onPress={handleDeposit}
                    style={styles.button}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Deposit via MPESA'}
                </Button>

                {loading && (
                    <ActivityIndicator size="large" style={{ marginVertical: 10 }} />
                )}

                <Text variant="titleMedium" style={styles.section}>
                    Transaction History
                </Text>

                {transactions.length === 0 ? (
                    <Text style={styles.note}>No transactions yet.</Text>
                ) : (
                    transactions.map((tx, i) => (
                        <List.Item
                            key={i}
                            title={`${tx.type} - KES ${Number(tx.amount).toLocaleString()}`}
                            description={`Phone: ${tx.phone || '-'} | Receipt: ${tx.receipt} | ${new Date(tx.date).toLocaleString()}`}
                            left={props => (
                                <List.Icon
                                    {...props}
                                    icon={tx.type === 'Deposit' ? 'arrow-down-bold' : 'arrow-up-bold'}
                                />
                            )}
                        />
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff'
    },
    card: {
        marginBottom: 20
    },
    input: {
        marginBottom: 16
    },
    button: {
        marginBottom: 20
    },
    section: {
        marginBottom: 10
    },
    note: {
        textAlign: 'center',
        fontStyle: 'italic',
        color: 'gray'
    }
});
