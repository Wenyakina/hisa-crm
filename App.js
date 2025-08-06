import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import BuyStockScreen from './screens/BuyStockScreen';
import MPESAWalletScreen from './screens/MPESAWalletScreen';
import SplashScreen from './screens/SplashScreen';

import HomeScreen from './screens/tabs/HomeScreen';
import MarketScreen from './screens/tabs/MarketScreen';
import PortfolioScreen from './screens/tabs/PortfolioScreen';

// Create navigation stack
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs(){
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#002b5c',
                tabBarInactiveTintColor: '#888',
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if(route.name === 'Home'){
                        iconName = focused ? 'home' : 'home-outline';
                    }
                    else if(route.name === 'Markets'){
                        iconName = focused ? 'trending-up' : 'trending-up-outline';
                    }
                    else if(route.name === 'Portfolio'){
                        iconName = focused ? 'book' : 'book-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}>
            
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Markets" component={MarketScreen} />
            <Tab.Screen name="Portfolio" component={PortfolioScreen} />
        </Tab.Navigator>
    );
}

export default function App(){
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="MPESAWallet" component={MPESAWalletScreen} options={{ headerShown: true, title: 'Fund Account' }} />
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="BuyStock" component={BuyStockScreen} options={{ headerShown: true, title: 'Buy Stock' }} />
                
                <Stack.Screen name="MainApp" component={MainTabs} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
