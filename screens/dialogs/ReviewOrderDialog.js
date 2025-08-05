import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { db } from '../../firebaseConfig';
import { getUserIdAndBalance } from '../utils/UserData';

export default function ReviewOrderDialog({ visible, onDismiss, orderDetails }) {
    const {
        ticker,
        unitPrice,
        quantity,
        orderType,
        estimatedCost,
        category,
    } = orderDetails;

    const handleConfirm = async () => {
        const { userId } = await getUserIdAndBalance();

        const orderData = {
            ticker,
            unitPrice,
            quantity,
            orderType,
            estimatedCost,
            category,
            timestamp: new Date().toISOString()
        };

        const saveKey = orderType === 'Market' ? 'trades' : 'orders';

        try {
            const userRef = doc(db, 'users', userId);

            await updateDoc(userRef, {
                [saveKey]: arrayUnion(orderData),
            });

            onDismiss(true);
        } 
        catch (error) {
            console.error('Error saving order:', error);
            onDismiss(false); // Pass false to indicate error
        }
    };

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={() => onDismiss(false)}>
                <Dialog.Title>Review Order</Dialog.Title>
                <Dialog.Content>
                <Text>Ticker: {ticker}</Text>
                <Text>Order Type: {orderType}</Text>
                <Text>Quantity: {quantity}</Text>
                <Text>Unit Price: {unitPrice} KES</Text>
                <Text>Estimated Cost: {estimatedCost.toLocaleString()} KES</Text>
                <Text>Category: {category}</Text>
                </Dialog.Content>
                <Dialog.Actions>
                <Button onPress={() => onDismiss(false)}>Cancel</Button>
                <Button onPress={handleConfirm}>Confirm</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

