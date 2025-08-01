import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, List, Text, TextInput } from 'react-native-paper';

export default function MPESAWalletScreen({navigation}) {
    const [balance, setBalance] = useState(8250);
    const [amount, setAmount] = useState('');
    const [transactions, setTransactions] = useState([]);
    
    const generateReceipt = () => 'MP' + Math.floor(Math.random() * 1000000);
    
    const handleTransaction = (type) => {
        const amt = parseFloat(amount);
        
        if(isNaN(amt) || amt <= 0){
            Alert.alert('Invalid amount');
            return;
        }
        
        const newBalance = type === 'Deposit' ? balance + amt : balance - amt;
        
        if(newBalance < 0){
            Alert.alert('Insufficient funds');
            return;
        }

        setBalance(newBalance);
        setTransactions([
            {
                id: generateReceipt(),
                type,
                amount: amt,
                date: new Date().toLocaleString()
            },
            ...transactions
        ]);
        Alert.alert('MPESA Transaction Received');
        setAmount('');
    };

    return (
        <ScrollView style={styles.container}>
            <Text variant="titleLarge" style={styles.header}>MPESA Wallet</Text>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="headlineSmall">Balance: KES {balance.toLocaleString()}</Text>
                </Card.Content>
            </Card>

            <TextInput
                label="Amount (KES)"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
            />

            <View style={styles.row}>
                <Button mode="contained" onPress={() => handleTransaction('Deposit')} style={styles.button}>
                    Deposit
                </Button>
                <Button mode="outlined" onPress={() => handleTransaction('Withdraw')} style={styles.button}>
                    Withdraw
                </Button>
            </View>

            <Text variant="titleMedium" style={styles.section}>Transaction History</Text>
            {transactions.length === 0 ? (
                <Text style={styles.note}>No transactions yet.</Text>
            ) : (
            transactions.map((tx, i) => (
                <List.Item
                    key={i}
                    title={`${tx.type} - KES ${tx.amount}`}
                    description={`Receipt: ${tx.id} | ${tx.date}`}
                    left={props => <List.Icon {...props} icon={tx.type === 'Deposit' ? 'arrow-down-bold' : 'arrow-up-bold'} />}
                />
            ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        padding: 16
    },
    header: {
        textAlign: 'center', 
        marginBottom: 20
    },
    card: {
        marginBottom: 20
    },
    input: {
        marginBottom: 16
    },
    row: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 20
    },
    button: {
        flex: 1, 
        marginHorizontal: 5
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
