import { useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Divider, Menu, Provider, Text, TextInput } from 'react-native-paper';
import ReviewOrderDialog from './dialogs/ReviewOrderDialog';
import { currentMarketData } from './utils/MarketData';
import { getUserIdAndBalance } from './utils/UserData';

export default function BuyStockScreen({ navigation }) {
    const route = useRoute();
    const selectedStock = route.params?.stock || {};

    const [orderType, setOrderType] = useState('Limit');
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedQty, setSelectedQty] = useState(null);
    const [unitPrice, setUnitPrice] = useState(Number(selectedStock.price) || 0);
    const [quantity, setQuantity] = useState(0);
    const [estimatedCost, setEstimatedCost] = useState(0);
    const [balance, setBalance] = useState(0);

    const quantities = [100, 500, 1000];

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const [dialogVisible, setDialogVisible] = useState(false);
    const [lastOrderSuccess, setLastOrderSuccess] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredTickers, setFilteredTickers] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);

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

        const filtered = currentMarketData.filter(stock =>
            stock.ticker.toLowerCase().includes(searchQuery.toLowerCase())
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
                <Text style={styles.label}>Search Ticker</Text>
                <TextInput
                    mode="outlined"
                    placeholder="Enter Ticker (e.g., KCB)"
                    value={searchQuery}
                    onChangeText={text => setSearchQuery(text)}
                    style={[styles.input, styles.customInputBorder]}/>

                {showSearchResults && filteredTickers.length > 0 && (
                    <View style={{ marginBottom: 16, backgroundColor: '#f0f0f0', borderRadius: 6 }}>
                        {filteredTickers.map(stock => (
                            <Button
                                key={stock.id}
                                mode="text"
                                onPress={() => {
                                    setSearchQuery(stock.ticker);
                                    setShowSearchResults(false);
                                    navigation.setParams({ stock }); // Update route stock
                                    setUnitPrice(stock.price);
                                }}
                                contentStyle={{ justifyContent: 'flex-start' }}
                                textColor="#1976D2"
                                style={{ paddingVertical: 4, borderBottomWidth: 0.5, borderColor: '#ccc' }}
                            >
                                {stock.ticker} - {stock.category} @ {stock.price} KES
                            </Button>
                        ))}
                    </View>
                )}

                <Text style={styles.header}>Buy {selectedStock.ticker}</Text>
                <Text style={styles.subheader}>{selectedStock.category}</Text>

                <Text style={styles.price}>
                    {selectedStock.price} KES{' '}
                    <Text style={[styles.priceChange, selectedStock.change > 0 ? { color: 'green' } : { color: 'red' }]}> 
                        {selectedStock.change > 0 ? `▲ ${selectedStock.change}` : `▼ ${Math.abs(selectedStock.change)}`} 
                    </Text>
                </Text>

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
                        />
                    }
                >
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
                    style={[styles.input, styles.customInputBorder]}/>

                <Text style={styles.label}>Quantity</Text>
                <TextInput
                    mode="outlined"
                    placeholder="1,000"
                    keyboardType="numeric"
                    value={quantity.toString()}
                    onChangeText={handleQuantityChange}
                    style={[styles.input, styles.customInputBorder]}/>

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
                    disabled={isBuyDisabled}
                    style={styles.reviewButton}
                    labelStyle={{ color: 'white' }}
                    onPress={() => setDialogVisible(true)}>
                    REVIEW ORDER
                </Button>
            </ScrollView>

            <ReviewOrderDialog
                visible={dialogVisible}
                onDismiss={(success) => {
                    setDialogVisible(false);
                    setLastOrderSuccess(success);
                    if(success){
                        setQuantity(0);
                        setSelectedQty(null);
                    }
                }}
                orderDetails={{
                    ticker: selectedStock.ticker,
                    unitPrice,
                    quantity: selectedQty || quantity,
                    orderType,
                    estimatedCost,
                    category: selectedStock.category,
                }}/>
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
