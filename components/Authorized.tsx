import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Icon, Button } from '@rneui/base';
import { getToken, removeToken } from './Storage/Token';
import { UserInfo } from './TypeModels';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { storeLanguage } from './Storage/Language';
import LanguagesBar from './LaguagesBar';
import { Compare } from './Compare/Compare';
import { Overlay } from '@rneui/themed';
import LogServices from '../services/LogServices';
import CurrencyBar from './CurrencyBar';
export type IAutorizedParam = {
    LogoutCallback: () => Promise<void>
}
export type ProfileDetailsParamList = {
    ProfileDetails: {} | undefined;
    UserMessangesList: {} | undefined;
    MyAnnouncements: {} | undefined;
    Compare: {} | undefined;
    Favorites: {} | undefined;
    TransactionHistory: {} | undefined;
};
export function Authorized(options: IAutorizedParam): JSX.Element {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<ProfileDetailsParamList>>();
    const [userInfo, setUserInfo] = useState<UserInfo>({ fullName: "", email: "", phoneNumber: "" });
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const isFocused = useIsFocused();

    const getProfile = async () => {
        const token: string = await getToken();
        try {
            console.log(`Bearer ${token}`);
            const getProfileRequest = new Request('https://ltop.shop/Account/GetCurrentUserInfoMobile', {
                method: 'GET',
                mode: 'cors',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            fetch(getProfileRequest)
                .then((response) => {
                    console.log("response", response.status);
                    return response.json();
                }).then((userInfo: UserInfo) => {
                    setUserInfo(userInfo);
                    setIsLoading(false);
                }).catch((reason) => {
                    console.log("getProfile catch" + token + " " + reason, "error");
                    LogServices.Log("getProfile catch" + token + " " + reason, "error");
                    removeToken();
                });
        } catch (error) {
            console.log("getProfile", error);
        }
    }
    useEffect(() => {
        getProfile();
    }, [])

    if (isLoading) {
        return (
            <View style={styles.loader}>
                {isLoading && <Text style={styles.textLoading}>{t('catalog.loading').toString()} <ActivityIndicator /></Text>}
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Image
                        style={styles.logo}
                        source={require('../content/images/logo.png')} />
                    <LanguagesBar />
                </View>
                <CurrencyBar />
                <Button
                    title={userInfo.fullName == "" ? "..." : userInfo.fullName}
                    titleStyle={styles.text}
                    type='outline'
                    icon={{
                        name: 'user-o',
                        type: 'font-awesome'
                    }}
                    iconContainerStyle={styles.iconContainer}
                    buttonStyle={styles.button}
                    onPress={() => {
                        navigation.navigate("ProfileDetails", { userInfo })
                    }}
                />
                <Button
                    title={t('profile.my_announcements_btn').toString()}
                    titleStyle={styles.text}
                    type='outline'
                    icon={{
                        name: 'outbox',
                        type: 'material'
                    }}
                    iconContainerStyle={styles.iconContainer}
                    buttonStyle={styles.button}
                    onPress={() => {
                        navigation.navigate("MyAnnouncements")
                    }}
                />
                <Button
                    title={t('profile.messages_btn').toString()}
                    titleStyle={styles.text}
                    type='outline'
                    icon={{
                        name: 'envelope-o',
                        type: 'font-awesome'
                    }}
                    iconContainerStyle={styles.iconContainer}
                    buttonStyle={styles.button}
                    onPress={() => {
                        navigation.navigate("UserMessangesList")
                    }}
                />
                <Button
                    title={t('profile.favorites_btn').toString()}
                    type='outline'
                    titleStyle={styles.text}
                    icon={{
                        name: 'heart-o',
                        type: 'font-awesome'
                    }}
                    iconContainerStyle={styles.iconContainer}
                    buttonStyle={styles.button}
                    onPress={() => {
                        navigation.navigate("Favorites")
                    }}
                />
                <Button
                    title={t('profile.compare_btn').toString()}
                    type='outline'
                    titleStyle={styles.text}
                    icon={{
                        name: 'refresh',
                        type: 'font-awesome'
                    }}
                    iconContainerStyle={styles.iconContainer}
                    buttonStyle={styles.button}
                    onPress={() => {
                        navigation.navigate("Compare")
                    }}
                />
                <Button
                    title={t('profile.transaction_history_btn').toString()}
                    type='outline'
                    titleStyle={styles.text}
                    icon={{
                        name: 'book',
                        type: 'font-awesome'
                    }}
                    iconContainerStyle={styles.iconContainer}
                    buttonStyle={styles.button}
                    onPress={() => {
                        navigation.navigate("TransactionHistory")
                    }}
                />
                <Button
                    title={t('profile.logout_btn').toString()}
                    type='outline'
                    titleStyle={styles.text}
                    icon={{
                        name: 'sign-out',
                        type: 'font-awesome'
                    }}
                    iconContainerStyle={styles.iconContainer}
                    buttonStyle={styles.button}
                    onPress={async () => {
                        await options.LogoutCallback()
                    }}
                />
            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        display: 'flex',
        flexDirection: 'row'
    },
    langTab: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 'auto',
        marginRight: 20
    },
    buttonContainer: {
        flexDirection: 'row'
    },
    tinyLogo: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
    button: {
        justifyContent: 'flex-start',
        paddingVertical: 20,
        //elevation: 1,
        //borderRadius: 1,
        borderColor: 'black'
    },
    iconContainer: {
        paddingRight: 35,
        left: 20,
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        letterSpacing: 0.25,
        color: 'black',
        //fontWeight: 'bold',
        //padding: 10,
    },
    logo: {
        width: 160,
        height: 80,
        //alignSelf: 'center',
        marginLeft: 30
    },
    langContainer: {
        borderRadius: 15
    },
    langText: {
        fontSize: 16,
        lineHeight: 21,
        letterSpacing: 0.25,
    },
    loader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textLoading: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        padding: 10
    },
});