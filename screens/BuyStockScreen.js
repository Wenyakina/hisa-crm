import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Divider, Menu, Provider, Snackbar, Text, TextInput } from 'react-native-paper';
import ReviewOrderDialog from './dialogs/ReviewOrderDialog';
import { marketData } from './utils/MarketData';
import { getUserIdAndBalance } from './utils/UserData';

export default function BuyStockScreen({ navigation }) {
    const route = useRoute();
    const selectedStock = route.params?.stock || {};

    const [orderType, setOrderType] = useState('Limit');
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedQty, setSelectedQty] = useState(null);
    const [unitPrice, setUnitPrice] = useState(Number(selectedStock.curr_price) || 0);
    const [quantity, setQuantity] = useState(0);
    const [estimatedCost, setEstimatedCost] = useState(0);
    const [balance, setBalance] = useState(0);

    const quantities = [100, 500, 1000];

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const [dialogVisible, setDialogVisible] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredTickers, setFilteredTickers] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const loadBalance = async () => {
            const { walletBalance } = await getUserIdAndBalance();
            setBalance(walletBalance);
        };
        loadBalance();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredTickers([]);
            setShowSearchResults(false);
            return;
        }

        const filtered = marketData.filter(stock =>
            stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
            stock.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setFilteredTickers(filtered);
        setShowSearchResults(true);
    }, [searchQuery]);

    useEffect(() => {
        const qty = selectedQty || quantity || 0;
        const total = qty * unitPrice;
        setEstimatedCost(total);
    }, [unitPrice, quantity, selectedQty]);

    const handleQuantityChange = (val) => {
        const numericVal = parseInt(val.replace(/[^0-9]/g, '')) || 0;
        setSelectedQty(null);
        setQuantity(numericVal);
    };

    const isBuyDisabled = estimatedCost > balance || !unitPrice || (!selectedQty && !quantity);

    return (
        <Provider>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.label}>Search Ticker or Name</Text>
                <TextInput
                    mode="outlined"
                    placeholder="Enter Ticker or Name (e.g., KCB)"
                    value={searchQuery}
                    onChangeText={text => setSearchQuery(text)}
                    style={[styles.input, styles.customInputBorder]}
                    textColor="#000"
                    selectionColor="#000"
                    outlineColor="#000"/>

                {showSearchResults && filteredTickers.length > 0 && (
                    <View style={{ marginBottom: 16, backgroundColor: '#f0f0f0', borderRadius: 6 }}>
                        {filteredTickers.map(stock => (
                            <Button
                                key={stock.id}
                                mode="text"
                                onPress={() => {
                                    setSearchQuery(stock.name);
                                    setShowSearchResults(false);
                                    navigation.setParams({ stock }); // Update route stock
                                    setUnitPrice(stock.curr_price);
                                }}
                                contentStyle={{ justifyContent: 'flex-start' }}
                                textColor="#1976D2"
                                style={{ paddingVertical: 4, borderBottomWidth: 0.5, borderColor: '#ccc' }}>
                                {stock.name} - {stock.ticker}
                            </Button>
                        ))}
                    </View>
                )}

                <Text style={styles.header}>Buy {selectedStock.name}</Text>

                <Text style={styles.label}>Order Type</Text>
                <Menu
                    visible={menuVisible}
                    onDismiss={closeMenu}
                    anchor={
                        <TextInput
                            mode="outlined"
                            value={orderType}
                            editable={false}
                            right={<TextInput.Icon icon="menu-down" onPress={openMenu} />}
                            style={[styles.input, styles.customInputBorder]}
                            textColor="#000"
                            selectionColor="#000"
                            outlineColor="#000"
                        />
                    }>
                    <Menu.Item onPress={() => { setOrderType('Market'); closeMenu(); }} title="Market" />
                    <Divider />
                    <Menu.Item onPress={() => { setOrderType('Limit'); closeMenu(); }} title="Limit" />
                </Menu>

                <Text style={styles.label}>
                    {orderType === 'Market' ? 'Market Price (KES)' : 'Limit Price (KES)'}
                </Text>
                <TextInput
                    mode="outlined"
                    placeholder="2.00"
                    keyboardType="numeric"
                    value={unitPrice.toString()}
                    onChangeText={(text) => setUnitPrice(parseFloat(text) || 0)}
                    style={[styles.input, styles.customInputBorder]}
                    textColor="#000"
                    selectionColor="#000"
                    outlineColor="#000"/>

                <Text style={styles.label}>Quantity</Text>
                <TextInput
                    mode="outlined"
                    placeholder="1,000"
                    keyboardType="numeric"
                    value={quantity.toString()}
                    onChangeText={handleQuantityChange}
                    style={[styles.input, styles.customInputBorder]}
                    textColor="#000"
                    selectionColor="#000"
                    outlineColor="#000" />

                <View style={styles.quickQuantity}>
                    {quantities.map((qty) => {
                        const isSelected = selectedQty === qty;
                        return (
                            <Button
                                key={qty}
                                mode={isSelected ? 'contained' : 'outlined'}
                                onPress={() => {
                                    setSelectedQty(qty);
                                    setQuantity(qty);
                                }}
                                buttonColor={isSelected ? '#1976D2' : undefined}
                                textColor={isSelected ? '#fff' : '#606060'}
                                style={[styles.quantityButton, { borderColor: isSelected ? '#1976D2' : '#e0e0e0' }]}
                                contentStyle={{ paddingVertical: 6 }}>
                                {qty}
                            </Button>
                        );
                    })}
                </View>

                <Text style={styles.estimatedLabel}>Estimated Cost</Text>
                <Text style={styles.estimatedValue}>{estimatedCost.toLocaleString()} KES</Text>
                <Text style={styles.balanceNote}>Available Balance: {balance.toLocaleString()} KES</Text>

                <Button
                    mode="contained"
                    disabled={!unitPrice || (!selectedQty && !quantity)}
                    style={styles.reviewButton}
                    labelStyle={{ color: 'white' }}
                    onPress={() => {
                        if (estimatedCost > balance) {
                            setSnackbarMessage("Insufficient balance to place this order.");
                            setSnackbarVisible(true);
                        } else {
                            setDialogVisible(true);
                        }
                    }}>
                    REVIEW ORDER
                </Button>
            </ScrollView>

            <ReviewOrderDialog
                visible={dialogVisible}
                onDismiss={(success) => {
                    setDialogVisible(false);

                    if(success){
                        setSnackbarMessage("Successfully bought shares.");
                        setSnackbarVisible(true);

                        setTimeout(() => {
                            navigation.goBack();
                        }, 1500);
                    }
                }}
                orderDetails={{
                    ticker: selectedStock.ticker,
                    unitPrice,
                    quantity: selectedQty || quantity,
                    orderType,
                    estimatedCost
                }}/>
            
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
                action={{
                    label: 'Dismiss',
                    onPress: () => setSnackbarVisible(false),
                }}>
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
        marginBottom: 4,
        marginTop: 4,
        color: '#121619'
    },
    subheader: {
        fontSize: 16,
        color: '#7f8183',
        marginBottom: 16,
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#121516'
    },
    priceChange: {
        fontSize: 16,
    },
    label: {
        color: '#606060',
        fontSize: 16,
        marginTop: 6,
        marginBottom: 3,
    },
    input: {
        marginBottom: 6,
        color: '#606060'
    },
    customInputBorder: {
        backgroundColor: '#fff',
        borderColor: '#e0e0e0',
    },
    quickQuantity: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        marginTop: 10
    },
    quantityButton: {
        flex: 1,
        marginHorizontal: 4,
        borderRadius: 6,
        borderWidth: 1,
    },
    estimatedLabel: {
        color: '#606060',
        fontSize: 16,
        marginBottom: 4,
    },
    estimatedValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#3fc450',
        marginBottom: 8,
    },
    balanceNote: {
        fontSize: 14,
        color: '#606060',
        marginBottom: 24,
    },
    reviewButton: {
        padding: 4,
        borderRadius: 6,
        backgroundColor: '#307def'
    },
});
