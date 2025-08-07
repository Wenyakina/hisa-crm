import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { db } from '../../firebaseConfig';
import { getUserDoc } from '../utils/UserData';

export default function ReviewSellDialog({ visible, onDismiss, sellDetails = {} }) {
    const [isLoading, setIsLoading] = useState(false);

    const {
        ticker = '',
        unitPrice = 0,
        quantity = 0,
        estimatedRevenue = 0
    } = sellDetails;

    const isValid = ticker && quantity > 0 && unitPrice > 0 && estimatedRevenue > 0;

    const handleConfirm = async () => {
        if (!isValid) {
            console.error('Invalid sell order details.');
            return onDismiss(false);
        }

        try {
            setIsLoading(true);

            const userDoc = await getUserDoc();
            if (!userDoc) {
                console.error("User document not found.");
                return onDismiss(false);
            }

            const userRef = doc(db, 'users', userDoc.id);
            const currentOrders = userDoc.orders || [];
            const matchingOrder = currentOrders.find(order => order.ticker === ticker);

            if (!matchingOrder || matchingOrder.quantity < quantity) {
                console.error('Not enough shares to sell.');
                return onDismiss(false);
            }

            const updatedOrders = currentOrders.map(order => {
                if (order.ticker === ticker) {
                    const newQty = order.quantity - quantity;
                    return newQty > 0 ? { ...order, quantity: newQty } : null;
                }
                return order;
            }).filter(Boolean);

            const updatedWalletBalance = (userDoc.walletBalance || 0) + estimatedRevenue;
            const updatedPortfolioBalance = (userDoc.portfolioBalance || 0) - estimatedRevenue;

            const sellOrderData = {
                ticker,
                unitPrice,
                quantity,
                estimatedRevenue,
                timestamp: new Date().toISOString()
            };

            await updateDoc(userRef, {
                orders: updatedOrders,
                walletBalance: updatedWalletBalance,
                portfolioBalance: updatedPortfolioBalance,
                trades: arrayUnion(sellOrderData)
            });

            onDismiss(true);
        } catch (error) {
            console.error('Error completing sell order:', error);
            onDismiss(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={() => onDismiss(false)}
        >
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.title}>Review Sell Order</Text>

                    {isValid ? (
                        <>
                            <View style={styles.row}>
                                <Text style={styles.label}>Ticker:</Text>
                                <Text style={styles.value}>{ticker}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Quantity:</Text>
                                <Text style={styles.value}>{quantity}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Unit Price:</Text>
                                <Text style={styles.value}>{unitPrice.toLocaleString()} KES</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Estimated Revenue:</Text>
                                <Text style={styles.value}>{estimatedRevenue.toLocaleString()} KES</Text>
                            </View>
                        </>
                    ) : (
                        <Text style={styles.errorText}>
                            Missing sell order details. Please try again.
                        </Text>
                    )}

                    <View style={styles.actions}>
                        <Button
                            mode="text"
                            onPress={() => onDismiss(false)}
                            disabled={isLoading}
                            style={styles.cancelBtn}
                            textColor="#444"
                        >
                            Cancel
                        </Button>

                        <Button
                            mode="contained"
                            onPress={handleConfirm}
                            disabled={!isValid || isLoading}
                            loading={isLoading}
                            style={styles.confirmBtn}
                        >
                            {isLoading ? 'Processing...' : 'Confirm Sale'}
                        </Button>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    content: {
        padding: 20,
        paddingBottom: 60,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#e0e0e0',
    },
    label: {
        fontSize: 16,
        color: '#444',
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
    },
    actions: {
        marginTop: 40,
    },
    confirmBtn: {
        backgroundColor: '#1976D2',
        marginBottom: 20,
        paddingVertical: 10,
    },
    cancelBtn: {
        paddingVertical: 10,
    },
});
