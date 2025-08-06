import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PortfolioScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                
                {/* Market Highlights Section */}
                <View style={styles.portfolioSection}>
                    <View style={styles.secHeader}>
                        <Text style={styles.subtitle}>Portfolio balance</Text>
                        <Text style={styles.balance}>KES 0</Text>
                    </View>

                    <View style={styles.portfolioContent}>

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
});
