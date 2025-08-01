import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LandingScreen({navigation}) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>HISA TECHNOLOGIES</Text>
            <Text style={styles.tagline}>Technology for Smarter Investing in Africa</Text>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 20, 
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 28, 
        fontWeight: 'bold', 
        marginBottom: 10
    },
    tagline: {
        fontSize: 16, 
        color: '#777', 
        textAlign: 'center', 
        marginBottom: 40
    },
    button: {
        backgroundColor: '#0a66c2', 
        paddingVertical: 12, 
        paddingHorizontal: 30, 
        borderRadius: 8
    },
    buttonText: {
        color: '#fff', 
        fontSize: 16
    }
});
