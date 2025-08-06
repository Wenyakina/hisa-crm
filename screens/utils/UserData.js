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
        const portfolioBalance = userDoc.exists() ? userDoc.data().portfolioBalance || 0 : 0;
        const walletBalance = userDoc.exists() ? userDoc.data().walletBalance || 0 : 0;
        const activeBroker = userDoc.exists() ? userDoc.data().activeBroker || 'N/A' : 'N/A';
        const riskMode = userDoc.exists() ? userDoc.data().riskMode || 'Medium' : 'Medium';
        const tradingMode = userDoc.exists() ? userDoc.data().tradingMode || 'Automated' : 'Automated';
        const prevStockVal = userDoc.exists() ? userDoc.data().prevStockVal || 0 : 0;
        const currStockVal = userDoc.exists() ? userDoc.data().currStockVal || 0 : 0;

        return { 
            userId, 
            portfolioBalance, 
            walletBalance, 
            activeBroker,
            riskMode,
            tradingMode,
            prevStockVal,
            currStockVal
        };
    } 
    catch (err) {
        console.error('Failed to load user and balance:', err);
        
        return { 
            userId: null, 
            portfolioBalance: null,
            walletBalance: null,
            activeBroker: null,
            riskMode: null,
            tradingMode: null,
            prevStockVal: null,
            currStockVal: null
        };
    }
};
