import { StyleSheet, Text, View } from 'react-native';

export default function LearnScreen({navigation}) {
    return (
        <View style={styles.container}>
            <Text>Markets Screen</Text>
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