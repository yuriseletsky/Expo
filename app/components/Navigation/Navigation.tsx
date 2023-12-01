import { NavigationContainer } from "@react-navigation/native";
import { TabsNavigator } from "./TabsNavigator";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Compare } from "../Compare/Compare";
import { Profile } from "../Profile";
import { Icon } from "@rneui/themed";
import { createStackNavigator } from "@react-navigation/stack";
import { Authorized } from "../Authorized";
import { ProfileDetails } from "../ProfileDetails";
import { ProductDetails } from "../ProductDetals";
import { Registration } from "../Registration";
import { UserMessangesList } from "../Messanges/UserMessangesList";
import { Dialog } from "../Messanges/Dialog";
import { MyAnnouncements } from "../MyAnnouncements";
import { Favorites } from "../Favorites/Favorites";
import { TransactionHistory } from "../TransactionHistory";
import { Edit } from "../Edit/Edit";
import { Search } from "../Search";
import { CardTitle } from "@rneui/base/dist/Card/Card.Title";
import { useTranslation } from "react-i18next";

const Stack = createStackNavigator();
export function Navigation(): JSX.Element {
  const { t } = useTranslation();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Root"
          component={TabsNavigator}
          options={{
            headerShown: false,
            title: t("tabs_navigation.home").toString(),
          }}
        />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetails}
          options={({ route }) => ({ title: route.params.title })}
        />
        <Stack.Screen
          name="Registration"
          component={Registration}
          options={({ route }) => ({
            title: t("registration_title").toString(),
          })}
        />
        <Stack.Screen
          name="ProfileDetails"
          component={ProfileDetails}
          options={({ route }) => ({
            title: t("profile_details_title").toString(),
          })}
        />
        <Stack.Screen
          name="Compare"
          component={Compare}
          options={({ route }) => ({ title: t("compare_title").toString() })}
        />
        <Stack.Screen
          name="Favorites"
          component={Favorites}
          options={({ route }) => ({ title: t("favorites_title").toString() })}
        />
        <Stack.Screen name="UserMessangesList" 
        component={UserMessangesList} 
        options={({ route }) => ({ title: t("messages_title").toString() })}
        />
        <Stack.Screen
          name="MyAnnouncements"
          component={MyAnnouncements}
          options={({ route }) => ({
            title: t("my_announcement_title").toString(),
          })}
        />
        <Stack.Screen
          name="TransactionHistory"
          component={TransactionHistory}
          options={({ route }) => ({
            title: t("transaction.title").toString(),
          })}
        />
        <Stack.Screen name="Dialog" component={Dialog} />
        <Stack.Screen
          name="Edit"
          component={Edit}
          options={({ route }) => ({ title: t("edit_title").toString() })}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={({ route }) => ({ title: t("home.search").toString() })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
