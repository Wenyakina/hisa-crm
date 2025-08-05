import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

export const getUserIdAndBalance = async () => {
    try {
        const userStr = await AsyncStorage.getItem('user');
        
        if(!userStr)
            return {userId: null, balance: null };

        const userObj = JSON.parse(userStr);
        const userId = userObj?.id;
    
        if(!userId) 
            return { userId: null, balance: null };

        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        const balance = userDoc.exists() ? userDoc.data().portfolioBalance || 0 : 0;

        return { userId, balance };
    } 
    catch (err) {
        console.error('Failed to load user and balance:', err);
        return { userId: null, balance: null };
    }
};