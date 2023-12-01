import React, { useEffect, useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Button } from '@rneui/base';
import {useTranslation} from 'react-i18next';
import { storeLanguage } from './Storage/Language';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LanguagesBar(): JSX.Element {
    const isFocused = useIsFocused();
    const [language, setLanguage] = useState<string>("");

    const {i18n} = useTranslation(); 
    const changeLanguage = async (lang: string) => {
        setLanguage(lang);
        i18n.changeLanguage(lang);
        await storeLanguage(lang);
    }
    useEffect(() => {
        (async () => {
            const value = await AsyncStorage.getItem('@language_settings');
            if(value){
                setLanguage(value);
                i18n.changeLanguage(value);
            }
            const valuta = await AsyncStorage.getItem(`@valuta`);
            if (!valuta) {
                AsyncStorage.setItem(`@valuta`, "UAH");
            }
        })()
    }, [isFocused])
    return (
        <View style={styles.langTab}>
            <Button
                title='UA'
                type='clear'
                titleStyle={styles.langText}
                containerStyle={[styles.langContainer, language == "ua" && styles.active]}
                onPress={async () => {
                    await changeLanguage('ua');
                }}
            />
            <Text>|</Text>
            <Button
                title='RU'
                type='clear'
                titleStyle={styles.langText}
                containerStyle={[styles.langContainer, language == "ru" && styles.active]}
                onPress={async () => {
                    await changeLanguage('ru');
                }}
            />
            <Text>|</Text>
            <Button
                title='ENG'
                type='clear'
                titleStyle={styles.langText}
                containerStyle={[styles.langContainer, language == "en" && styles.active]}
                onPress={async () => {
                    await changeLanguage('en');
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
        alignSelf:"center"

    },
    langContainer: {
        borderRadius: 15
    },
    langText: {
        fontSize: 16,
        lineHeight: 21,
        letterSpacing: 0.25,
    },
    active: {
        backgroundColor: "#aad1f5"
    }
});