import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { doc, updateDoc } from 'firebase/firestore';
import { useCallback, useState } from "react";
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from '../../firebaseConfig';
import { marketData } from '../utils/MarketData';
import { getUserIdAndBalance } from '../utils/UserData';

const TITLE_SIZE = 48;

export default function HomeScreen({ navigation }) {
    const [mode, setMode] = useState("Automated");
    const [risk, setRisk] = useState("Medium");
    const [userId, setUserId] = useState(null);
    const [portfolioBalance, setPortfolioBalance] = useState(0);
    const [walletBalance, setWalletBalance] = useState(0);
    const [activeBroker, setActiveBroker] = useState("N/A");
    const [brokerModalVisible, setBrokerModalVisible] = useState(false);

    const [refreshing, setRefreshing] = useState(false);

    const stockData = marketData;

    const loadData = async () => {
        const { 
            userId, 
            portfolioBalance, 
            walletBalance, 
            activeBroker,
            riskMode,
            tradingMode,
            prevStockVal,
            currStockVal
        } = await getUserIdAndBalance();

        setUserId(userId);
        setPortfolioBalance(portfolioBalance);
        setWalletBalance(walletBalance);
        setActiveBroker(activeBroker);
        setMode(tradingMode);
        setRisk(riskMode);
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const updateActiveBrokerInFirestore = async (ticker) => {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                activeBroker: ticker
            });

            console.log('Active broker updated to:', ticker);
        } 
        catch (err) {
            console.error('Failed to update active broker:', err);
        }
    };

    const updateTradingModeInFirestore = async (newMode) => {
        try {
            const userRef = doc(db, 'users', userId);
            
            await updateDoc(userRef, {
                tradingMode: newMode
            });

            console.log('Trading mode updated to:', newMode);
        } 
        catch (err) {
            console.error('Failed to update trading mode:', err);
        }
    };

    const updateRiskModeInFirestore = async (newRiskMode) => {
        try {
            const userRef = doc(db, 'users', userId);
            
            await updateDoc(userRef, {
                riskMode: newRiskMode
            });

            console.log('Risk mode updated to:', newRiskMode);
        } 
        catch (err) {
            console.error('Failed to update risk mode:', err);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View style={styles.contentWrapper}>
                    <View style={styles.secHeader}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>HISA</Text>
                            <TouchableOpacity style={styles.globeIcon}>
                                <Ionicons name="globe-outline" size={TITLE_SIZE * 0.8} color="#102a54" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.balancesRow}>
                            {/* Portfolio Balance */}
                            <View style={styles.balanceColumn}>
                                <Text style={styles.balanceLabelWallet}>Portfolio Balance</Text>
                                <Text style={styles.balanceAmountWallet}>
                                    KES {portfolioBalance.toLocaleString()}
                                </Text>

                                <View style={styles.gain}>
                                    <Ionicons name="chevron-up" size={14} color="green" />
                                    <Text style={styles.gainText}>+5.2%</Text>
                                </View>
                            </View>

                            {/* Wallet Balance */}
                            <View style={styles.balanceColumn}>
                                <Text style={styles.balanceLabel}>Wallet Balance</Text>
                                <Text style={styles.balanceAmount}>KES {walletBalance.toLocaleString()}</Text>
                                <View style={styles.gain}>
                                    <Text style={styles.gainTextNoText}>&quot;&quot;</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.toggleContainer}>
                            <TouchableOpacity
                                style={[styles.toggleButton, mode === "Manual" && styles.selectedButton]}
                                onPress={async () => {
                                    setMode("Manual");
                                    await updateTradingModeInFirestore("Manual");
                                }}>
                                <Text style={[styles.toggleText, mode === "Manual" && styles.selectedText]}>Manual</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.toggleButton, mode === "Automated" && styles.selectedButton]}
                                onPress={async () => {
                                    setMode("Automated");
                                    await updateTradingModeInFirestore("Automated");
                                }}>
                                <Text style={[styles.toggleText, mode === "Automated" && styles.selectedText]}>Automated</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    
                    <View style={styles.secContent}>
                        <TouchableOpacity
                            style={styles.activeBrokerRow}
                            onPress={() => setBrokerModalVisible(true)}>
                            <Text style={styles.label}>Active Broker</Text>
                            <View style={styles.activeBroker}>
                                <Text style={styles.activeBrokerLabel}>{activeBroker}</Text>
                                <Ionicons name="chevron-forward" size={18} color="green" />
                            </View>
                        </TouchableOpacity>
                        
                        <View style={styles.separator} />

                        {mode === 'Automated' && (
                        <View style={styles.riskModeRow}>
                            <Text style={styles.label}>Risk Mode</Text>
                            <Text style={styles.riskModeLabel}>{risk}</Text>
                        </View>
                        )}

                        {mode === 'Automated' && (
                        <View style={styles.riskContainer}>
                            {["Low", "Medium", "High"].map((level, index) => {
                                const isFirst = index === 0;
                                const isMiddle = index === 1;
                                const isLast = index === 2;

                                return (
                                    <TouchableOpacity
                                        key={level}
                                        style={[
                                            styles.riskButton,
                                            isFirst && styles.firstRiskButton,
                                            isMiddle && styles.middleRiskButton,
                                            isLast && styles.lastRiskButton,
                                            risk === level && styles.selectedRisk,
                                        ]}
                                        onPress={async () => {
                                            setRisk(level);
                                            await updateRiskModeInFirestore(level);
                                        }}>
                                        <Text style={risk === level ? styles.selectedText : styles.riskText}>{level}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        )}
                        
                        {mode === 'Manual' && (
                        <View style={styles.tradeButtonsContainer}>
                            <TouchableOpacity
                                style={[styles.tradeButton, { backgroundColor: '#43a047' }]} // Red for Buy
                                onPress={() => navigation.navigate('BuyStock')}>
                                <Text style={styles.tradeButtonText}>Buy Stock</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.tradeButton, { backgroundColor: '#e53935' }]} // Green for Sell
                                onPress={() => navigation.navigate('SellStock')}>
                                <Text style={styles.tradeButtonText}>Sell Stock</Text>
                            </TouchableOpacity>
                        </View>
                        )}

                        <TouchableOpacity style={styles.fundButton} onPress={() => navigation.navigate('MPESAWallet')}>
                            <Text style={styles.fundButtonText}>Fund Account</Text>
                        </TouchableOpacity>

                        <View style={styles.marketSection}>
                            <Text style={styles.marketTitle}>Today&apos;s Market Highlights</Text>
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
                </View>
            </ScrollView>

            {brokerModalVisible && (
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Select Active Broker</Text>
                    <ScrollView>
                        {marketData.map((stock) => (
                        <TouchableOpacity
                            key={stock.id}
                            style={styles.brokerOption}
                            onPress={async () => {
                                setActiveBroker(stock.ticker);
                                setBrokerModalVisible(false);
                                await updateActiveBrokerInFirestore(stock.ticker);
                            }}>
                            <Text style={styles.brokerText}>{stock.name}</Text>
                        </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <TouchableOpacity
                        style={styles.modalCloseButton}
                        onPress={() => setBrokerModalVisible(false)}>
                        <Text style={styles.modalCloseText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: "#fff"
    },
    titleContainer: {
        position: 'relative',
        width: '100%',
        alignItems: 'center',
        marginTop: 26,
    },
    title: {
        fontSize: TITLE_SIZE,
        color: '#102a54',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    globeIcon: {
        position: 'absolute',
        right: 0,
        top: '10%',
        padding: 4,
    },
    gain: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 0,
        color: "green",
    },
    gainText: {
        fontSize: 14,
        color: 'green',
        marginLeft: 4,
        fontWeight: "400",
        marginTop: 5
    },
    toggleContainer: {
        flexDirection: "row", 
        width: '100%',
        marginBottom: 20
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 14,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    selectedButton: {
        backgroundColor: "#3399ff"
    },
    toggleText: {
        fontSize: 16
    },
    selectedText: {
        color: "#fff", fontWeight: "bold"
    },
    label: {
        fontSize: 18, 
        color: "#262c31",
        fontWeight: "600"
    },
    riskContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e8e9f0',
    },
    riskButton: {
        flex: 1,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        alignItems: 'center'
    },
    firstRiskButton: {
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    },
    middleRiskButton: {
        borderRadius: 0,
    },
    lastRiskButton: {
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
    },
    selectedRisk: {
        backgroundColor: "#3399ff"
    },
    riskText: {
        fontSize: 16, color: "#333"
    },
    fundButton: {
        backgroundColor: "#002b5c",
        paddingVertical: 14,
        borderRadius: 12,
        marginVertical: 20,
        width: '100%',
        alignItems: 'center',
    },
    fundButtonText: {
        color: "#fff", 
        fontSize: 18
    },
    marketSection: {
        width: '100%',
        alignItems: 'flex-start',
        marginTop: 0
    },
    marketTitle: {
        fontSize: 20, 
        fontWeight: "500"
    },
    stockName: {
        fontSize: 18, 
        fontWeight: "500", 
        marginTop: 8
    },
    topGainer: {
        fontSize: 14, 
        color: "#555"
    },
    stockChange: {
        fontSize: 18, 
        color: "green", 
        marginTop: 5
    },
    secHeader: {
        width: "100%",
        paddingHorizontal: 16,
        alignItems: 'center',
        backgroundColor: "#e3f6ff"
    },
    secContent: {
        width: "100%",
        paddingHorizontal: 16,
        alignItems: 'center',
        marginTop: 0
    },
    activeBroker: {
        flexDirection: 'row',
        alignItems: 'center',
        color: "#a6aeb7",
    },
    activeBrokerLabel: {
        fontSize: 18, 
        fontWeight: "400", 
        color: "#1f2730",
        marginEnd: 4
    },
    activeBrokerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 16,
        marginBottom: 16
    },
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: '#e9edf5',
    },
    riskModeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 16,
        marginBottom: 8
    },
    riskModeLabel: {
        fontSize: 18, 
        fontWeight: "400", 
        color: "#1f2730"
    },
    stockItem: {
        width: '100%',
        marginBottom: 0,
    },
    stockRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    scrollContainer: {
        paddingBottom: 40,
    },
    contentWrapper: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    tradeButtonsContainer: {
        marginTop: 24,
        flexDirection: "row", 
        width: '100%',
    },
    tradeButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    tradeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    balancesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 24,
        paddingHorizontal: 16,
        width: '100%',
    },
    balanceColumn: {
        flex: 1,
        alignItems: 'center',
    },
    balanceLabel: {
        fontSize: 16,
        color: '#224e41',
        marginBottom: 0,
        textAlign: 'center',
    },
    balanceAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#224e41',
        textAlign: 'center',
    },
    gainTextNoText: {
        fontSize: 14,
        color: '#e3f6ff',
        marginLeft: 4,
        fontWeight: "400",
        marginTop: 5
    },
    balanceAmountWallet: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#7e0001',
        textAlign: 'center',
    },
    balanceLabelWallet: {
        fontSize: 16,
        color: '#7e0001',
        marginBottom: 0,
        textAlign: 'center',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        maxHeight: '60%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '400',
        marginBottom: 12,
        textAlign: 'center',
    },
    brokerOption: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    brokerText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
    modalCloseButton: {
        marginTop: 16,
        paddingVertical: 12,
        backgroundColor: '#102a54',
        borderRadius: 8,
    },
    modalCloseText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    separatorMarketHighlight: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 8,
        marginTop: 16,
        marginBottom: 8
    },
});
