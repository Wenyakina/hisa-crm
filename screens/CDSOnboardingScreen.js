import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

export default function CDSOnboardingScreen({navigation}) {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({ id: '', phone: '', email: '', broker: '', image: null });
    const [submitted, setSubmitted] = useState(false);
    
    const brokers = [
        'ABC Capital', 
        'NCBA Investment Bank', 
        'Genghis Capital', 
        'AIB-AXYS'
    ];

    const handleNext = () => setStep(prev => prev + 1);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1,
        });

        if(!result.canceled){
            setForm({ ...form, image: result.assets[0].uri });
        }
    };

    const handleSubmit = () => {
        setSubmitted(true);
        setTimeout(() => navigation.navigate('Dashboard'), 2000); // Go back after showing message
    };

    const Step1 = () => (
        <>
            <TextInput 
                label="National ID/Passport" 
                value={form.id} onChangeText={text => setForm({ ...form, id: text })} 
                style={styles.input} />
            
            <TextInput 
                label="Phone" 
                value={form.phone} onChangeText={text => setForm({ ...form, phone: text })} 
                style={styles.input} keyboardType="phone-pad" />
            
            <TextInput 
                label="Email" 
                value={form.email} onChangeText={text => setForm({ ...form, email: text })} 
                style={styles.input} keyboardType="email-address" />
            
            <Button 
                mode="contained" 
                onPress={handleNext}>
                Next
            </Button>
        </>
    );

    const Step2 = () => (
        <>
            <Button 
                icon="camera" 
                mode="outlined" 
                onPress={pickImage}>
                Upload ID/Passport
            </Button>
            
            {form.image && <Image source={{ uri: form.image }} style={styles.image} />}
            
            <Button 
                mode="contained" 
                onPress={handleNext} 
                style={styles.input}>
                Next
            </Button>
        </>
    );

    const Step3 = () => (
        <>
            <Text>Select Broker</Text>
            {brokers.map((b, i) => (
            <Button 
                key={i} 
                mode={form.broker === b ? "contained" : "outlined"} 
                onPress={() => setForm({ ...form, broker: b })} 
                style={styles.input}>
                {b}
            </Button>
            ))}
            <Button 
                mode="contained" 
                onPress={handleSubmit}>
                Submit
            </Button>
        </>
    );

    return (
        <View style={styles.container}>
            <Text variant="titleLarge" style={styles.title}>CDS Account Onboarding</Text>

            {!submitted ? (
            <>
                {step === 1 && <Step1 />}
                {step === 2 && <Step2 />}
                {step === 3 && <Step3 />}
            </>
            ) : (
                <Text style={styles.success}>Dormant – Ready for Reactivation {"\n"}Request Submitted ✅</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        padding: 20, 
        justifyContent: 'center'
    },
    input: {
        marginVertical: 10
    },
    title: {
        marginBottom: 20, 
        textAlign: 'center'
    },
    image: {
        width: 200, 
        height: 200, 
        marginVertical: 10, 
        alignSelf: 'center'
    },
    success: {
        textAlign: 'center', 
        fontSize: 18, 
        color: 'green'
    }
});
