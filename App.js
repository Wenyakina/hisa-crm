import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import AIAutopilotScreen from './screens/AIAutopilotScreen';
import BuyStockScreen from './screens/BuyStockScreen';
import CDSOnboardingScreen from './screens/CDSOnboardingScreen';
import DashboardScreen from './screens/DashboardScreen';
import MPESAWalletScreen from './screens/MPESAWalletScreen';
import SplashScreen from './screens/SplashScreen';

import LearnScreen from './screens/tabs/LearnScreen';
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
                    else if(route.name === 'Learn'){
                        iconName = focused ? 'book' : 'book-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}>
            
            <Tab.Screen name="Home" component={PortfolioScreen} />
            <Tab.Screen name="Markets" component={MarketScreen} />
            <Tab.Screen name="Learn" component={LearnScreen} />
        </Tab.Navigator>
    );
}

export default function App(){
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Dashboard" component={DashboardScreen} />
                <Stack.Screen name="CDSOnboarding" component={CDSOnboardingScreen} />
                <Stack.Screen name="AIAutopilot" component={AIAutopilotScreen} />
                <Stack.Screen name="MPESAWallet" component={MPESAWalletScreen} options={{ headerShown: true, title: 'Fund Account' }} />
                <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="BuyStock" component={BuyStockScreen} options={{ headerShown: true, title: 'Buy Stock' }} />
                
                <Stack.Screen name="MainApp" component={MainTabs} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
