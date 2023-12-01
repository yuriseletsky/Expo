import React, { useEffect, useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Button } from '@rneui/base';
import { useTranslation } from 'react-i18next';
import { storeLanguage } from './Storage/Language';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CurrencyBar(): JSX.Element {
    const { i18n } = useTranslation();

    const isFocused = useIsFocused();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentCurrency, setCurrentCurrency] = useState<string>("");


    useEffect(() => {
        console.log('===============isFocused=====================');
        
        (async () => {
            const valuta = await AsyncStorage.getItem(`@valuta`);
            if (!valuta) {
                AsyncStorage.setItem(`@valuta`, "UAH");
                setCurrentCurrency("UAH")

            }else{
                setCurrentCurrency(valuta)
            }
        })()
    }, [isFocused])

    const changeLanguage = async (valuta: string) => {
        AsyncStorage.setItem(`@valuta`, valuta);
        setCurrentCurrency(valuta)
    }


    return (
        <View style={styles.langTab}>
            <Button
                title='₴'
                type='clear'
                titleStyle={styles.langText}
                containerStyle={[styles.langContainer, currentCurrency == "UAH" && styles.active]}
                onPress={async () => {
                    await changeLanguage('UAH');
                }}
            />
            <Button
                title='$'
                type='clear'
                titleStyle={styles.langText}
                containerStyle={[styles.langContainer, currentCurrency == "USD" && styles.active]}
                onPress={async () => {
                    await changeLanguage('USD');
                }}
            />
            <Button
                title='€'
                type='clear'
                titleStyle={styles.langText}
                containerStyle={[styles.langContainer, currentCurrency == "EUR" && styles.active]}
                onPress={async () => {
                    await changeLanguage('EUR');
                }}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    langTab: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: "center",
        marginTop:20,
        marginBottom:20
    },
    langContainer: {
        borderRadius: 15,
        marginRight:10,
        marginLeft:10
    },
    langText: {
        fontSize: 32,
        lineHeight: 36,
        letterSpacing: 0.25,
        fontWeight: 'bold',
    },
    active: {
        backgroundColor: "#aad1f5"
    }
});