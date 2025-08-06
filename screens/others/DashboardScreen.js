import { useState } from 'react';
import { Button, ScrollView, StyleSheet, View } from 'react-native';
import { Card, Divider, Switch, Text } from 'react-native-paper';

export default function DashboardScreen({navigation}) {
    const [isAutopilot, setIsAutopilot] = useState(false);
    
    const suggestions = [
        {
            action: 'Buy', 
            stock: 'Safaricom', 
            reason: 'Strong upward momentum'
        },
        {
            action: 'Sell', 
            stock: 'KCB', 
            reason: 'Downtrend forecasted'
        },
    ];

    const recentTrades = [
        {
            stock: 'Equity Bank', 
            type: 'Buy', 
            result: '+KES 1,200'
        },
        {
            stock: 'EABL', 
            type: 'Sell', 
            result: '-KES 500'
        },
    ];

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Welcome, Investor</Text>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium">Portfolio Value</Text>
                    <Text variant="headlineSmall">KES 120,000</Text>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium">MPESA Wallet</Text>
                    <Text variant="headlineSmall">KES 8,250</Text>
                </Card.Content>
            </Card>

            <View style={styles.switchContainer}>
                <Text>AI Mode:</Text>
                <Switch value={isAutopilot} onValueChange={() => setIsAutopilot(!isAutopilot)} />
                <Text>{isAutopilot ? 'Autopilot' : 'Manual'}</Text>
            </View>

            <Divider style={{ marginVertical: 12 }} />

            <Text variant="titleMedium" style={styles.section}>Investment Suggestions</Text>
            {suggestions.map((s, i) => (
            <Card key={i} style={styles.card}>
                <Card.Content>
                    <Text>{s.action} {s.stock}</Text>
                    <Text style={styles.reason}>{s.reason}</Text>
                </Card.Content>
            </Card>
            ))}

            <Text variant="titleMedium" style={styles.section}>Recent Trades</Text>
            {recentTrades.map((t, i) => (
            <Card key={i} style={styles.card}>
                <Card.Content>
                    <Text>{t.type} – {t.stock}</Text>
                    <Text>{t.result}</Text>
                </Card.Content>
            </Card>
            ))}

            <Button mode="outlined" onPress={() => navigation.navigate('CDSOnboarding')} style={{ marginTop: 20 }}>
                Simulate CDS Onboarding
            </Button>

            <Button mode="outlined" onPress={() => navigation.navigate('AIAutopilot')} style={{ marginTop: 10 }}>
                Launch AI Autopilot
            </Button>

            <Button mode="outlined" onPress={() => navigation.navigate('MPESAWallet')} style={{ marginTop: 10 }}>
                MPESA Wallet
            </Button>

            <Button mode="contained-tonal" onPress={() => navigation.navigate('AdminDashboard')} style={{ marginTop: 10 }}>
                Admin Dashboard
            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        padding: 16
    },
    header: {
        fontSize: 22, 
        fontWeight: 'bold', 
        marginBottom: 16
    },
    card: {
        marginBottom: 10
    },
    section: {
        marginTop: 20, 
        marginBottom: 10
    },
    switchContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 10, marginVertical: 16
    },
    reason: {
        color: 'gray', 
        fontSize: 12
    }
});
