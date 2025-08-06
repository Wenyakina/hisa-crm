import { StyleSheet, Text, View } from 'react-native';

export default function PortfolioScreen({navigation}) {
    return (
        <View style={styles.container}>
            <Text>Portfolio Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
});