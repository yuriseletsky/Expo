import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const tokenContext = createContext("");

export const getToken = async (): Promise<string> => {
    try {
        const value = await AsyncStorage.getItem('@access_token')
        if (value !== null) {
            //console.log("readed token: ", value);
            return value;
        }
    } catch (e) {
        console.log(e);
    }
    
    return "";
}

export const storeToken = async (value: string) => {
    try {
        await AsyncStorage.setItem('@access_token', value)
    } catch (e) {
        console.log(e);
    }
    //const token = await getToken();
    //console.log("readed token: ", token);
}

export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem('@access_token');
    } catch (e) {
        console.log(e);
    }
}
