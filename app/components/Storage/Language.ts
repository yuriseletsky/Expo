import AsyncStorage from '@react-native-async-storage/async-storage';
export const getLanguage = async (): Promise<string> => {
    try {
        const value = await AsyncStorage.getItem('@language_settings')
        if (value !== null) {
            return value;
        }
    } catch (e) {
        console.log(e);
    }
    
    return "";
}

export const storeLanguage = async (value: string) => {
    try {
        await AsyncStorage.setItem('@language_settings', value)
    } catch (e) {
        console.log(e);
    }
}