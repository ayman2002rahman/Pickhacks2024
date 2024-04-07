import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'

// Screens
import HomeScreen from './screens/HomeScreen'
import ContactsScreen from './pages/ContactsScreen'
import AddressScreen from "./pages/AddressScreen";

// Screen names
const homeName = 'Home';
const contactsName = 'Contacts';
const addressName = 'Address';

const Tab = createBottomTabNavigator();

export default function MainContainer() {
    return(
        <NavigationContainer>
            <Tab.NavigationContainer
                initialRouteName={homeName}
                screenOptions={({route}) => ({
                    tabBarIcon: ({focused, color, size}) => {
                        let iconName;
                        let routeName = route.name;
                        if (routeName == homeName) {
                            iconName = focused ? 'home' : 'home-outline'
                        } else if (routeName == contactsName) {
                            iconName = focused ? 'list' : 'list-outline'
                        } else if (routeName == addressName) {
                            iconName = focused ? 'settings' : 'settings-outline'
                        }

                        return <Ionicons name={iconName} size={size} color={color}/>
                    },
                })}>

                <Tab.Screen name={homeName} component={HomeScreen}/>

            </Tab.NavigationContainer>
        </NavigationContainer>
    );
}