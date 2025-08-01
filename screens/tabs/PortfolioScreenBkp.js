import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TITLE_SIZE = 48;

export default function PortfolioScreen({navigation}) {
    const [mode, setMode] = useState("Automated");
    const [risk, setRisk] = useState("Medium");
    const stockData = [
        {name: "Safaricom", change: "↑ 8.1%", label: "Top Gainer"},
        {name: "KCB", change: "↑ 3.4%", label: "Top Gainer"},
        {name: "NCBA", change: "↓ 1.2%", label: "Top Loser"},
        {name: "Vipingo", change: "↑ 5.7%", label: "Top Gainer"},
        {name: "Kakuzi", change: "↓ 0.8%", label: "Top Loser"},
        {name: "Bamburi", change: "↑ 2.3%", label: "Top Gainer"},
    ];
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.secHeader}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>HISA</Text>
                    <TouchableOpacity style={styles.globeIcon}>
                        <Ionicons name="globe-outline" size={TITLE_SIZE * 0.8} color="#102a54" />
                    </TouchableOpacity>
                </View>
                
                <Text style={styles.subtitle}>Portfolio balance</Text>
                <Text style={styles.balance}>KES 100,000</Text>
                <View style={styles.gain}>
                    <Ionicons name="chevron-up" size={18} color="green" />
                    <Text style={styles.gainText}>+5.2%</Text>
                </View>
                <Text style={styles.allTime}>All-time</Text>

                <View style={styles.toggleContainer}>
                    <TouchableOpacity
                        style={[styles.toggleButton, mode === "Manual" && styles.selectedButton]}
                        onPress={() => setMode("Manual")}>
                        <Text style={[styles.toggleText, mode === "Manual" && styles.selectedText]}>Manual</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={[styles.toggleButton, mode === "Automated" && styles.selectedButton]}
                        onPress={() => setMode("Automated")}>
                        <Text style={[styles.toggleText, mode === "Automated" && styles.selectedText]}>Automated</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.secContent}>
                <View style={styles.activeBrokerRow}>
                    <Text style={styles.label}>Active Broker</Text>
                    <View style={styles.activeBroker}>
                        <Text style={styles.activeBrokerLabel}>AIB-AXYS</Text>
                        <Ionicons name="chevron-forward" size={18} color="green" />
                    </View>
                </View>

                <View style={styles.separator} />

                <View style={styles.riskModeRow}>
                    <Text style={styles.label}>Risk Mode</Text>
                    <Text style={styles.riskModeLabel}>Change</Text>
                </View>

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
                                    risk === level && styles.selectedRisk
                                ]}
                                onPress={() => setRisk(level)}>
                                <Text style={risk === level ? styles.selectedText : styles.riskText}>{level}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <TouchableOpacity style={styles.fundButton}>
                    <Text style={styles.fundButtonText}>Fund Account</Text>
                </TouchableOpacity>

                <View style={styles.marketSection}>
                    <Text style={styles.marketTitle}>Today’s Market Highlights</Text>
                    
                    <View style={styles.stockItem}>
                        <View style={styles.stockRow}>
                            <Text style={styles.stockName}>Safaricom</Text>
                            <Text style={styles.stockChange}>↑ 8.1%</Text>
                        </View>
                        <Text style={styles.topGainer}>Top Gainer</Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: 16,
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
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    subtitle: {
        fontSize: 24, 
        marginTop: 24, 
        color: "#465260",
        fontWeight: "300"
    },
    balance: {
        fontSize: 30, 
        color: '#1c242e',
        fontWeight: "bold", 
        marginTop: 5
    },
    gain: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        color: "green",
    },
    gainText: {
        fontSize: 18,
        color: 'green',
        marginLeft: 4,
        fontWeight: "400",
        marginTop: 5
    },
    allTime: {
        fontSize: 17, 
        color: "#5d6d77", 
        marginBottom: 24,
        marginTop: 2
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

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 10,
    },
    label: {
        fontSize: 18, 
        color: "#262c31",
        fontWeight: "600"
    },
    value: {
        fontSize: 18, 
        fontWeight: "400", 
        color: "#515c6e"
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
        fontSize: 16, 
        color: "green", 
        marginTop: 3
    },

    tabBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        position: "absolute",
        bottom: 0,
        backgroundColor: "#fff",
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
        marginBottom: 16,
    },
    stockRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
});
