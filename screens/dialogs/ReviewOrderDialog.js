import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../firebaseConfig';
import { getUserIdAndBalance } from '../utils/UserData';

export default function ReviewOrderDialog({ visible, onDismiss, orderDetails }) {
    const [loading, setLoading] = useState(false);

    const {
        ticker,
        unitPrice,
        quantity,
        orderType,
        estimatedCost
    } = orderDetails;

    const handleConfirm = async () => {
        setLoading(true);
        
        try {
            const { userId, walletBalance, portfolioBalance } = await getUserIdAndBalance();

            const orderData = {
                ticker,
                unitPrice,
                quantity,
                orderType,
                estimatedCost,
                timestamp: new Date().toISOString()
            };

            const saveKey = orderType === 'Market' ? 'trades' : 'orders';
            const userRef = doc(db, 'users', userId);
            const updatedWalletBalance = walletBalance - estimatedCost;

            const newPortfolioBalance = portfolioBalance + (quantity * unitPrice);

            await updateDoc(userRef, {
                [saveKey]: arrayUnion(orderData),
                walletBalance: updatedWalletBalance,
                portfolioBalance: newPortfolioBalance
            });

            setLoading(false);
            onDismiss(true);
        } 
        catch (error) {
            console.error('Error saving order and updating wallet balance:', error);
            setLoading(false);
            onDismiss(false);
        }
    };


    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={() => onDismiss(false)}>
            <View style={styles.container}>
                <Text style={styles.title}>Review Your Order</Text>

                <View style={styles.detailRow}>
                    <Text style={styles.label}>Ticker:</Text>
                    <Text style={styles.value}>{ticker}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.label}>Order Type:</Text>
                    <Text style={styles.value}>{orderType}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.label}>Quantity:</Text>
                    <Text style={styles.value}>{quantity}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.label}>Unit Price:</Text>
                    <Text style={styles.value}>{unitPrice.toLocaleString()} KES</Text>
                </View>

                <View style={styles.detailRow}>
                    <Text style={styles.label}>Estimated Cost:</Text>
                    <Text style={styles.value}>{estimatedCost.toLocaleString()} KES</Text>
                </View>

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={[styles.button, styles.cancel]} onPress={() => onDismiss(false)} disabled={loading}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.confirm, loading && { opacity: 0.6 }]}
                        onPress={handleConfirm}
                        disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Confirm</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#121619',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        color: '#606060',
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 40,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
    },
    cancel: {
        backgroundColor: '#999',
    },
    confirm: {
        backgroundColor: '#1976D2',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
