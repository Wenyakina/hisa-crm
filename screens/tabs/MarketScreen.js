import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { marketData } from '../utils/MarketData';

export default function MarketScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                
                {/* Market Highlights Section */}
                <View style={styles.marketSection}>
                    <View style={styles.secHeader}>
                        <Text style={styles.subtitle}>Wallet balance</Text>
                        <Text style={styles.balance}>KES 0</Text>
                    </View>

                    <View style={styles.marketContent}>
                        <Text style={styles.marketTitle}>Today&apos;s Market Highlights</Text>
                        <View style={{ width: '100%' }}>
                            {marketData.map((stock, index) => (
                            <View key={stock.id}>
                                <TouchableOpacity
                                    style={styles.stockItem}
                                    onPress={() => navigation.navigate('BuyStock', { stock })}
                                    activeOpacity={0.7}>
                                    <View style={styles.stockRow}>
                                        <Text style={styles.stockName}>{stock.ticker}</Text>
                                        <Text
                                            style={[
                                                styles.stockChange,
                                                Number(stock.change) < 0 && { color: 'red' },
                                                Number(stock.change) > 0 && { color: 'green' },
                                            ]}>
                                            {Number(stock.change) > 0
                                                ? `↑ ${stock.change}%`
                                                : Number(stock.change) < 0
                                                ? `↓ ${Math.abs(stock.change)}%`
                                                : `${stock.change}%`}
                                        </Text>
                                    </View>
                                    <Text style={styles.topGainer}>{stock.category}</Text>
                                </TouchableOpacity>

                                {/* Add separator between items except after the last one */}
                                {index !== marketData.length - 1 && <View style={styles.separator} />}
                            </View>
                            ))}
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
        fontWeight: "300"
    },
    balance: {
        fontSize: 30, 
        color: '#1c242e',
        fontWeight: "bold", 
        marginTop: 5
    },
});
