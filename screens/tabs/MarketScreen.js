import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { marketData } from '../utils/MarketData';

export default function MarketScreen({ navigation }) {
    const stockData = marketData;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                
                {/* Market Highlights Section */}
                <View style={styles.marketSection}>
                    <View style={styles.secHeader}>
                        <Text style={styles.subtitle}>Today&apos;s Market Highlights</Text>
                    </View>

                    <View style={styles.marketContent}>
                        <View style={{ width: '100%' }}>
                            {stockData.map((stock, index) => {
                                const { prev_price, curr_price } = stock;
                                const change = ((curr_price - prev_price) / prev_price) * 100;
                                const isGain = change > 0;
                                const isLoss = change < 0;

                                return (
                                    <View
                                        key={stock.id}
                                        style={styles.stockItem}
                                        activeOpacity={0.7}>
                                        <View style={styles.stockRow}>
                                            <Text style={styles.stockName}>{stock.name}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Ionicons
                                                    name={isGain ? "chevron-up" : isLoss ? "chevron-down" : "remove"}
                                                    size={14}
                                                    color={isGain ? "green" : isLoss ? "red" : "gray"}
                                                    style={{ marginRight: 4 }}
                                                />
                                                <Text
                                                    style={[
                                                        styles.stockChange,
                                                        { color: isGain ? "green" : isLoss ? "red" : "gray" }
                                                    ]}>
                                                    {change.toFixed(2)}%
                                                </Text>
                                            </View>
                                        </View>
                                        <Text style={styles.topGainer}>{stock.ticker}</Text>

                                        {index !== marketData.length - 1 && <View style={styles.separatorMarketHighlight} />}
                                    </View>
                                );
                            })}
                        </View>
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
    marketContent: {
        padding: 16,
        width: '100%',
    },
    scrollContainer: {
        padding: 0,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    marketSection: {
        width: '100%',
        alignItems: 'flex-start',
        marginTop: 0,
    },
    marketTitle: {
        fontSize: 20,
        fontWeight: "500",
        marginBottom: 12,
    },
    stockItem: {
        width: '100%',
        marginBottom: 8,
    },
    stockRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    stockName: {
        fontSize: 18,
        fontWeight: "500",
        marginTop: 8,
    },
    stockChange: {
        fontSize: 18,
        marginTop: 5,
    },
    topGainer: {
        fontSize: 14,
        color: "#555",
    },
    separator: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 8,
    },
    subtitle: {
        fontSize: 24, 
        marginTop: 24, 
        color: "#102a54",
        fontWeight: "500"
    },
    balance: {
        fontSize: 30, 
        color: '#1c242e',
        fontWeight: "bold", 
        marginTop: 5
    },
    separatorMarketHighlight: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 8,
        marginTop: 16,
        marginBottom: 8
    },
});
