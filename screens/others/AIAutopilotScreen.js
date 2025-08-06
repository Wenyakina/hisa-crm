import { Dimensions, ScrollView, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Card, Text } from 'react-native-paper';

const suggestions = [
    {
        stock: 'Safaricom',
        action: 'Buy',
        reason: 'Strong upward momentum',
        chartData: [
            100, 
            110, 
            115, 
            125, 
            130, 
            140
        ],
        result: {
            entry: 'KES 100', 
            exit: 'KES 140', 
            gain: 'KES +40', 
            duration: '2 weeks'
        }
    },
    {
        stock: 'KCB Bank',
        action: 'Sell',
        reason: 'Profit-taking signal',
        chartData: [
            160, 
            150, 
            145, 
            140, 
            135, 
            130
        ],
        result: {
            entry: 'KES 160', 
            exit: 'KES 130', 
            gain: 'KES -30', 
            duration: '1 week'
        }
    }
];

export default function AIAutopilotScreen({navigation}) {
    return (
        <ScrollView style={styles.container}>
            <Text variant="headlineSmall" style={styles.header}>AI Autopilot Suggestions</Text>

            {suggestions.map((s, index) => (
            <Card key={index} style={styles.card}>
                <Card.Content>
                    <Text variant="titleMedium">{s.action} {s.stock}</Text>
                    <Text style={styles.reason}>{s.reason}</Text>

                    <LineChart
                        data={{
                            labels: [
                                'Day 1', 
                                'Day 2', 
                                'Day 3', 
                                'Day 4', 
                                'Day 5', 
                                'Now'
                            ],
                            datasets: [
                                {
                                    data: s.chartData
                                }
                            ]
                        }}
                        width={Dimensions.get('window').width - 60}
                        height={180}
                        chartConfig={{
                            backgroundGradientFrom: "#fff",
                            backgroundGradientTo: "#fff",
                            decimalPlaces: 0,
                            color: () => `#0a66c2`,
                            labelColor: () => `#333`,
                        }}
                        bezier
                        style={{ marginVertical: 12, borderRadius: 8 }} />

                    <Text>Entry: {s.result.entry}</Text>
                    <Text>Exit: {s.result.exit}</Text>
                    <Text>Gain/Loss: {s.result.gain}</Text>
                    <Text>Duration: {s.result.duration}</Text>
                </Card.Content>
            </Card>
            ))}
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
    reason: {
        fontStyle: 'italic', 
        color: 'gray', 
        marginBottom: 10
    }
});
