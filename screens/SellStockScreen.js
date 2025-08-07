import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Provider, Snackbar, Text, TextInput } from 'react-native-paper';
import ReviewSellDialog from './dialogs/ReviewSellDialog';
import { marketData } from './utils/MarketData';
import { getUserDoc, getUserIdAndBalance } from './utils/UserData';

export default function SellStockScreen({ navigation }) {
    const [userOrders, setUserOrders] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);
    const [unitPrice, setUnitPrice] = useState(0);
    const [quantity, setQuantity] = useState('');
    const [maxQuantity, setMaxQuantity] = useState(0);
    const [estimatedRevenue, setEstimatedRevenue] = useState(0);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [dialogVisible, setDialogVisible] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            const { userId } = await getUserIdAndBalance();
            const userDoc = await getUserDoc(userId);
            const orders = (userDoc.orders || [])
                .filter(order => order.quantity > 0)
                .sort((a, b) => a.ticker.localeCompare(b.ticker));
            setUserOrders(orders);
        };

        fetchOrders();
    }, []);

    useEffect(() => {
        const qty = parseInt(quantity) || 0;
        setEstimatedRevenue(qty * unitPrice);
    }, [quantity, unitPrice]);

    const handleSelectStock = (stock) => {
        const tickerData = marketData.find(item => item.ticker === stock.ticker);
        const currentPrice = tickerData?.curr_price || 0;

        setSelectedStock(stock);
        setUnitPrice(currentPrice);
        setMaxQuantity(stock.quantity);
        setQuantity('');
    };

    const handleQuantityChange = (val) => {
        const numericVal = parseInt(val.replace(/[^0-9]/g, '')) || 0;
        if (numericVal <= maxQuantity) {
            setQuantity(numericVal.toString());
        }
    };

    const handleSellReview = () => {
        if (parseInt(quantity) > 0 && parseInt(quantity) <= maxQuantity) {
            setDialogVisible(true);
        }
    };

    return (
        <Provider>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.header}>Owned Stocks</Text>
                <View style={styles.stockList}>
                    {userOrders.map((stock, index) => {
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
                                    mode="outlined"
                                    disabled={stock.quantity <= 0}
                                    onPress={() => handleSelectStock(stock)}
                                    style={styles.sellButton}
                                    labelStyle={{ color: '#fff' }}>
                                    SELL
                                </Button>
                            </View>
                        );
                    })}
                </View>

                {selectedStock && (
                    <>
                        <Text style={styles.header}>Sell {selectedStock.ticker}</Text>

                        <Text style={styles.label}>Unit Price (Current)</Text>
                        <TextInput
                            mode="outlined"
                            value={unitPrice.toString()}
                            editable={false}
                            style={styles.input}
                        />

                        <Text style={styles.label}>Quantity to Sell</Text>
                        <TextInput
                            mode="outlined"
                            placeholder="Enter quantity"
                            keyboardType="numeric"
                            value={quantity.toString()}
                            onChangeText={handleQuantityChange}
                            style={styles.input}
                        />

                        <Text style={styles.label}>Available Shares: {maxQuantity}</Text>

                        <Text style={styles.estimatedLabel}>Estimated Revenue</Text>
                        <Text style={styles.estimatedValue}>
                            {estimatedRevenue.toLocaleString()} KES
                        </Text>

                        <Button
                            mode="contained"
                            onPress={handleSellReview}
                            disabled={!quantity || parseInt(quantity) <= 0 || parseInt(quantity) > maxQuantity}
                            style={styles.reviewButton}
                            labelStyle={{ color: 'white' }}>
                            REVIEW SALE
                        </Button>
                    </>
                )}
            </ScrollView>

            <ReviewSellDialog
                visible={dialogVisible}
                onDismiss={(success) => {
                    setDialogVisible(false);
                    if (success) {
                        setSnackbarMessage("Successfully sold shares.");
                        setSnackbarVisible(true);
                        setTimeout(() => navigation.goBack(), 1500);
                    }
                }}
                sellDetails={{
                    ticker: selectedStock?.ticker || '',
                    unitPrice: Number(unitPrice),
                    quantity: parseInt(quantity),
                    estimatedRevenue: Number(estimatedRevenue),
                }}
            />


            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
                action={{ label: 'Dismiss', onPress: () => setSnackbarVisible(false) }}>
                {snackbarMessage}
            </Snackbar>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 16,
        color: '#121619',
    },
    label: {
        fontSize: 16,
        marginTop: 12,
        marginBottom: 6,
        color: '#606060',
    },
    input: {
        backgroundColor: '#fff',
        marginBottom: 8,
    },
    stockList: {
        marginBottom: 24,
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
        borderRadius: 5,
        borderWidth: 0,
        borderColor: '#d32f2f',
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    estimatedLabel: {
        fontSize: 16,
        color: '#606060',
        marginTop: 16,
    },
    estimatedValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#3fc450',
        marginBottom: 24,
    },
    reviewButton: {
        backgroundColor: '#1976D2',
        paddingVertical: 10,
        borderRadius: 6,
    },
});
