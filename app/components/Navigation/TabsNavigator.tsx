import React, { useEffect, useState } from 'react';
import {
    Button,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';
import { ProductType } from '../TypeModels';
import { Product } from '../Product';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Profile } from '../Profile';
import { Icon } from '@rneui/themed';
import { Catalog } from '../Catalog';
import { Compare } from '../Compare/Compare';
import { ProductDetails } from '../ProductDetals';
import { Recently } from '../Recently';
import { Add } from '../Add/Add';
import { useTranslation } from 'react-i18next';
import { Favorites } from '../Favorites/Favorites';
import { useRoute } from '@react-navigation/native';
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        paddingLeft: 5,
        paddingRight: 5,
    },
    header: {
        marginTop: 130,
        fontSize: 20,
        textAlign: 'center'
    }
});
const Tab = createBottomTabNavigator();
export function TabsNavigator(): JSX.Element {
    const { t } = useTranslation();
    let params = useRoute().params as {
        product: ProductType;
        rate: number;
        saverate: number;
        valuta: string;
        title: string;
      };
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Tab.Screen name="Home" component={Recently} options={{
                tabBarLabel: t('tabs_navigation.home').toString(),
                tabBarActiveBackgroundColor:"#d5ebff",
                tabBarInactiveBackgroundColor:"white",
                tabBarIcon: ({ color, size }) => (
                    <Icon
                        name='home'
                        type='font-awesome'
                        color='#308ad9'
                    />
                ),
            }} />
            <Tab.Screen name="Catalog" component={Catalog} options={{
                tabBarLabel: t('tabs_navigation.catalog').toString(),
                tabBarActiveBackgroundColor:"#d5ebff",
                tabBarInactiveBackgroundColor:"white",
                tabBarIcon: ({ color, size }) => (
                    <Icon
                        name='list-ul'
                        type='font-awesome'
                        color='#308ad9'
                    />
                ),
            }} />
            <Tab.Screen name="Add" component={Add} options={{
                tabBarLabel: t('tabs_navigation.add').toString(),
                tabBarActiveBackgroundColor:"#d5ebff",
                tabBarInactiveBackgroundColor:"white",
                tabBarIcon: ({ color, size }) => (
                    <Icon
                        name='plus-square-o'
                        type='font-awesome'
                        color='#308ad9'
                    />
                ),
            }} />
            <Tab.Screen name="Favorite" component={Favorites} options={{
                tabBarLabel: t('profile.favorites_btn').toString(),
                tabBarActiveBackgroundColor:"#d5ebff",
                tabBarInactiveBackgroundColor:"white",
                tabBarIcon: ({ color, size }) => (
                    <Icon
                        name='heart-o'
                        type='font-awesome'
                        color='#308ad9'
                    />
                ),
            }} />
            <Tab.Screen name="Compare" component={Compare} options={{
                tabBarLabel: t('tabs_navigation.compare').toString(),
                tabBarActiveBackgroundColor:"#d5ebff",
                tabBarInactiveBackgroundColor:"white",
                tabBarIcon: ({ color, size }) => (
                    <Icon
                        name='balance-scale'
                        type='font-awesome'
                        color='#308ad9'
                    />
                ),
            }} />
            <Tab.Screen name="Profile" component={Profile} options={{
                tabBarLabel: t('tabs_navigation.profile').toString(),
                tabBarActiveBackgroundColor:"#d5ebff",
                tabBarInactiveBackgroundColor:"white",
                tabBarIcon: ({ color, size }) => (
                    <Icon
                        name='user-o'
                        type='font-awesome'
                        color='#308ad9'
                    />
                ),
            }} />
        </Tab.Navigator>
    )
}

