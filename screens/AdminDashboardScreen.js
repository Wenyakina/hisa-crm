import { Dimensions, ScrollView, StyleSheet } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Card, Divider, Text } from 'react-native-paper';

export default function AdminDashboardScreen({navigation}) {
    const brokers = [
        {
            name: 'ABC Capital', 
            count: 8, 
            color: '#FF6384'
        },
        {
            name: 'Genghis Capital', 
            count: 5, 
            color: '#36A2EB'
        },
        {
            name: 'NCBA Investment Bank', 
            count: 3, 
            color: '#FFCE56'
        },
    ];

    const autopilotStocks = [
        {
            name: 'Safaricom', 
            count: 12
        },
        {
            name: 'KCB Bank', 
            count: 9
        },
        {
            name: 'EABL', 
            count: 5
        },
    ];
    
    return (
        <ScrollView style={styles.container}>
            <Text variant="headlineSmall" style={styles.header}>Admin Dashboard</Text>
            
            <Card style={styles.card}>
                <Card.Content>
                    <Text>Total Signups: 35</Text>
                    <Text>CDS Requests: 22</Text>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium">Preferred Brokers</Text>
                    
                    <PieChart
                        data={brokers.map(b => ({
                            name: b.name,
                            population: b.count,
                            color: b.color,
                            legendFontColor: "#333",
                            legendFontSize: 12
                        }))}
                        width={Dimensions.get('window').width - 60}
                        height={180}
                        chartConfig={{
                            backgroundColor: "#fff",
                            backgroundGradientFrom: "#fff",
                            backgroundGradientTo: "#fff",
                            decimalPlaces: 0,
                            color: () => "#0a66c2",
                            labelColor: () => "#000",
                        }}
                        accessor={"population"}
                        backgroundColor={"transparent"}
                        paddingLeft={"10"}
                    />
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium">Top Autopilot Stocks</Text>
                    <LineChart
                        data={{
                            labels: autopilotStocks.map(s => s.name),
                            datasets: [{ data: autopilotStocks.map(s => s.count) }]
                        }}
                        width={Dimensions.get('window').width - 60}
                        height={180}
                        chartConfig={{
                            backgroundGradientFrom: "#fff",
                            backgroundGradientTo: "#fff",
                            color: () => "#0a66c2",
                            labelColor: () => "#333",
                            decimalPlaces: 0
                        }}
                        bezier
                        style={{ borderRadius: 8 }}
                    />
                </Card.Content>
            </Card>

            <Divider style={{ marginVertical: 16 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        padding: 16
    },
    header: {
        textAlign: 'center', 
        marginBottom: 20
    },
    card: {
        marginBottom: 20
    },
});
