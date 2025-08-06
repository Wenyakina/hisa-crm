import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../firebaseConfig';

export default function SplashScreen({ navigation }) {
    const [textWidth, setTextWidth] = useState(0);
    const [pinModalVisible, setPinModalVisible] = useState(false);
    const [registrationVisible, setRegistrationVisible] = useState(false);
    const [pin, setPin] = useState(['', '', '', '']);
    const [userForm, setUserForm] = useState({
        name: '', 
        pin: '',
        email: '',
        phone: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const refs = [useRef(), useRef(), useRef(), useRef()];
    const shakeAnimation = useRef(new Animated.Value(0)).current;
    const registrationShakeAnimation = useRef(new Animated.Value(0)).current;

    const handleChange = (text, index) => {
        if(/^\d?$/.test(text)){
            const newPin = [...pin];
            newPin[index] = text;
            setPin(newPin);
      
            if(text && index < 3) 
                refs[index + 1].current.focus();
        }
    };
    
    const shake = () => {
        Animated.sequence([
            Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 6, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };
    
    const saveUser = async () => {
        const { name, pin, email, phone } = userForm;
    
        if(!name || !email || !phone || pin.length !== 4) 
            return;

        try{
            setIsSaving(true);

            // check if PIN already exists
            const q = query(collection(db, 'users'), where('pin', '==', pin));
            const snapshot = await getDocs(q);
            
            if(!snapshot.empty){
                alert('PIN already exists. Try a different one.');
                return;
            }

            const docRef = await addDoc(collection(db, 'users'), { 
                name, 
                pin, 
                email, 
                phone, 
                portfolioBalance: 0,
                walletBalance: 0
            });
            await AsyncStorage.setItem('user', JSON.stringify({ id: docRef.id, pin }));
            
            setRegistrationVisible(false);
            navigation.navigate('MainApp');
        } 
        catch(err){
            console.error(err);
        }
        finally {
            setIsSaving(false);
        }
    };
    
    const verifyPin = async () => {
        try {
            setIsVerifying(true);
            const enteredPin = pin.join('');
            
            const q = query(collection(db, 'users'), where('pin', '==', enteredPin));
            const snapshot = await getDocs(q);
            
            if(!snapshot.empty){
                const userDoc = snapshot.docs[0];
                await AsyncStorage.setItem('user', JSON.stringify({ id: userDoc.id, pin: enteredPin }));
                setPinModalVisible(false);
                navigation.navigate('MainApp');
            }
            else{
                shake();
                setPin(['', '', '', '']);
                refs[0].current.focus();
            }
        }
        catch(err){
            console.error(err);
            shake();
        }
        finally{
            setIsVerifying(false);
        }
    };
    
    const isPinComplete = pin.every((d) => d !== '');
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Image source={require('../assets/images/splash_bg_1.png')} style={styles.image} resizeMode="contain" />
                <Text style={styles.title}>Welcome to</Text>
                <Text style={styles.brand} onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}>HISA Technologies</Text>
                <Text style={styles.subtitle}>Free and Ready to Go</Text>
                <TouchableOpacity 
                    onPress={() => {
                        setPin(['', '', '', '']);
                        setPinModalVisible(true);
                    }} 
                    style={[styles.button, { width: textWidth }]}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </View>
            
            {/* Registration Modal */}
            <Modal visible={registrationVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={() => setRegistrationVisible(false)} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Create Your Account</Text>
                        <TextInput
                            placeholder="Name"
                            value={userForm.name}
                            onChangeText={(text) => setUserForm({ ...userForm, name: text })}
                            style={styles.input}/>
                        <TextInput
                            placeholder="Email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={userForm.email}
                            onChangeText={(text) => setUserForm({ ...userForm, email: text })}
                            style={styles.input}/>
                        <TextInput
                            placeholder="Phone Number"
                            keyboardType="phone-pad"
                            value={userForm.phone}
                            onChangeText={(text) => setUserForm({ ...userForm, phone: text })}
                            style={styles.input}/>
                        <TextInput
                            placeholder="4-digit PIN"
                            keyboardType="numeric"
                            maxLength={4}
                            secureTextEntry
                            value={userForm.pin}
                            onChangeText={(text) => {
                                const numeric = text.replace(/[^0-9]/g, '');
                                setUserForm({ ...userForm, pin: numeric });
                            }}
                            style={styles.input}/>
                        <TouchableOpacity
                            onPress={saveUser}
                            style={[styles.button, { width: '100%', flexDirection: 'row', justifyContent: 'center' }]}>
                            {isSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Continue</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            
            {/* PIN Modal */}
            <Modal visible={pinModalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <Animated.View style={styles.modalContent}>
                        <TouchableOpacity onPress={() => setPinModalVisible(false)} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                        
                        <Text style={styles.modalTitle}>Enter PIN</Text>
                        <Animated.View style={[styles.pinContainer, { transform: [{ translateX: shakeAnimation }] }]}>
                            {pin.map((digit, i) => (
                            <TextInput
                                key={i}
                                ref={refs[i]}
                                style={styles.pinInput}
                                keyboardType="numeric"
                                maxLength={1}
                                value={digit}
                                secureTextEntry
                                caretHidden
                                onChangeText={(text) => handleChange(text, i)}
                                onKeyPress={({ nativeEvent }) => {
                                    if (nativeEvent.key === 'Backspace' && pin[i] === '' && i > 0) {
                                    refs[i - 1].current.focus();
                                    const newPin = [...pin];
                                    newPin[i - 1] = '';
                                    setPin(newPin);
                                    }
                                }}/>
                            ))}
                        </Animated.View>
                        <TouchableOpacity
                            onPress={verifyPin}
                            disabled={!isPinComplete}
                            style={[styles.button, {
                                width: 140,
                                marginTop: 8,
                                opacity: isPinComplete ? 1 : 0.4,
                                flexDirection: 'row',
                                justifyContent: 'center'
                            }]}>
                            {isVerifying ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Continue</Text>}
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                setPinModalVisible(false);
                                setUserForm({ ...userForm, pin: pin.join('') });
                                setRegistrationVisible(true);
                            }}>
                            <Text style={{ color: '#12295c', marginTop: 10, textDecorationLine: 'underline' }}>
                                Create Profile
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#fff'
    },
    content: {
        flex: 1, 
        padding: 24, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    image: {
        width: 180, 
        height: 180, 
        marginBottom: 20
    },
    title: {
        fontSize: 28, 
        fontWeight: '500', 
        color: '#000', 
        textAlign: 'center'
    },
    brand: {
        fontSize: 32, 
        fontWeight: 'bold', 
        color: '#000', 
        marginBottom: 5, 
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 16, 
        color: '#666', 
        marginBottom: 35, 
        textAlign: 'center'
    },
    subtitle2: {
        fontSize: 16, 
        color: '#666', 
        marginTop: 20, 
        textAlign: 'center'
    },
    button: {
        backgroundColor: '#12295c', 
        paddingVertical: 12, 
        borderRadius: 8, 
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff', 
        fontSize: 16, 
        fontWeight: '500'
    },
    pinContainer: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 16
    },
    pinInput: {
        borderWidth: 2,
        borderColor: '#12295c',
        borderRadius: 24,
        width: 48,
        height: 48,
        textAlign: 'center',
        fontSize: 25,
        marginHorizontal: 2,
        backgroundColor: '#fff',
        padding: 0,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        width: '80%',
        padding: 24,
        borderRadius: 12,
        alignItems: 'center',
        maxWidth: 300,
    },
    modalTitle: { 
        fontSize: 20, 
        fontWeight: '600', 
        marginBottom: 16
    },
    closeButton: { 
        position: 'absolute', 
        top: 12, 
        right: 12, 
        padding: 4, 
        zIndex: 1
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        fontSize: 14,
        width: '100%',
    },
});
