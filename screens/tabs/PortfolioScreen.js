import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { marketData } from '../utils/MarketData';
import { getUserDoc, getUserIdAndBalance } from '../utils/UserData';

export default function PortfolioScreen({ navigation }) {
    const [mode, setMode] = useState("Automated");
    const [risk, setRisk] = useState("Medium");
    const [userId, setUserId] = useState(null);
    const [portfolioBalance, setPortfolioBalance] = useState(0);
    const [walletBalance, setWalletBalance] = useState(0);
    const [activeBroker, setActiveBroker] = useState("N/A");
    const [userStocks, setUserStocks] = useState([]);

    const loadData = async () => {
        const {
            userId,
            portfolioBalance,
            walletBalance,
            activeBroker,
            riskMode,
            tradingMode,
        } = await getUserIdAndBalance();

        const userDoc = await getUserDoc(userId);
        const orders = (userDoc.orders || [])
            .filter(order => order.quantity > 0)
            .sort((a, b) => a.ticker.localeCompare(b.ticker));

        setUserId(userId);
        setPortfolioBalance(portfolioBalance);
        setWalletBalance(walletBalance);
        setActiveBroker(activeBroker);
        setMode(tradingMode);
        setRisk(riskMode);
        setUserStocks(orders);
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.portfolioSection}>
                    <View style={styles.secHeader}>
                        <Text style={styles.subtitle}>Portfolio balance</Text>
                        <Text style={styles.balance}>KES {walletBalance.toLocaleString()}</Text>
                    </View>

                    <View style={styles.portfolioContent}>
                        {userStocks.map((stock, index) => {
                            const tickerData = marketData.find(item => item.ticker === stock.ticker);
                            const name = tickerData?.name || 'Unknown';

                            return (
                                <View key={`${stock.ticker}-${index}`} style={styles.stockItem}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.stockText}>
                                            {stock.ticker} - {name}
                                        </Text>
                                        <Text style={styles.sharesText}>
                                            {stock.quantity} shares
                                        </Text>
                                    </View>
                                    <Button
                                        mode="contained"
                                        onPress={() =>
                                            navigation.navigate('SellStock', { selectedTicker: stock.ticker })
                                        }
                                        style={styles.sellButton}
                                        labelStyle={{ color: 'white' }}
                                    >
                                        SELL
                                    </Button>
                                </View>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    secHeader: {
        width: "100%",
        padding: 16,
        backgroundColor: "#e3f6ff"
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    portfolioContent: {
        padding: 16,
        width: '100%',
    },
    scrollContainer: {
        padding: 0,
    },
    portfolioSection: {
        width: '100%',
        alignItems: 'flex-start',
        marginTop: 0,
    },
    subtitle: {
        fontSize: 24, 
        marginTop: 24, 
        color: "#102a54",
        fontWeight: "300"
    },
    balance: {
        fontSize: 30, 
        color: '#1c242e',
        fontWeight: "bold", 
        marginTop: 5
    },
    ownedHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#121619',
    },
    stockItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    stockText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    sharesText: {
        fontSize: 14,
        color: '#666',
    },
    sellButton: {
        backgroundColor: '#d32f2f',
        borderRadius: 4,
        paddingVertical: 0,
        paddingHorizontal: 0,
    },
});
