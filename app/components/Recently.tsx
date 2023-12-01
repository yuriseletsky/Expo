import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Button,
    FlatList,
    Image,
    Linking,
    SafeAreaView,
    ScrollView,

    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';
import { ProductType } from './TypeModels';
import { Product } from './Product';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Profile } from './Profile';
import { Icon, Overlay } from '@rneui/themed';
import { Compare } from './Compare/Compare';
import { ProductDetails } from './ProductDetals';
import CatalogServices from '../services/CatalogServices';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SearchBar } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import { StackNavigationProp } from '@react-navigation/stack';


export function Recently(): JSX.Element {
    const { t } = useTranslation();
    const isFocused = useIsFocused();
    const [products, setProducts] = useState<ProductType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isServerError, setServerIsError] = useState<boolean>(false);
    const [searchString, setSearchString] = useState<string>("");
    const navigationSearch = useNavigation<StackNavigationProp<any>>();
    const [rates, setRates] = useState<{ [key: string]: number }>({});
    const [valuta, setValuta] = useState<string>("UAH");
    const [isChange, setIsChange] = useState<boolean>(false);
    const {i18n} = useTranslation(); 

    useEffect(() => {
        //CatalogServices.GetAllBrands("Smartphones");
       
        (async () => {
            const value = await AsyncStorage.getItem('@language_settings');
            if(value){
                i18n.changeLanguage(value);
            }
            const newValuta = await AsyncStorage.getItem(`@valuta`);
            if (!newValuta) {
                AsyncStorage.setItem(`@valuta`, "UAH");
                await setValuta("UAH");
            } else {
                if (valuta != newValuta) {
                    await setIsChange(!isChange);
                    setProducts([]);
                    setIsLoading(true);
                }
                await setValuta(newValuta);
            }

            let rates = await CatalogServices.GetCurrencyRates();
            if (rates) {
                var rateObj: { [key: string]: number } = {};
                rates.forEach((item: { ValutaType: string, Rate: number }) => {
                    rateObj[item.ValutaType] = item.Rate;
                })
                await setRates(rateObj);
                await AsyncStorage.setItem(`@rates`, JSON.stringify(rateObj));
            }
            if (products.length == 0) {
                (async () => {
                    let rates = await CatalogServices.GetCurrencyRates();
                    console.log("rates = ", rates);

                    let items = await CatalogServices.GetRecently(12);
                    if ((typeof items) == "string") {
                        setServerIsError(true);
                    } else {
                        await setProducts(items as ProductType[]);
                    }
                })();
            }
        })();

    }, [isFocused]);

    useEffect(() => {
        (async ()=>{
            let items = await CatalogServices.GetRecently(12);
            if ((typeof items) == "string") {
                setServerIsError(true);
            } else {
                await setProducts(items as ProductType[]);
                setIsLoading(false);
            }
        })()

    }, [isChange])

    if (isServerError) {
        return (
            <Overlay
                animationType='fade'
                backdropStyle={styles.backdropStyle}
                overlayStyle={{}}
                fullScreen={false}
                isVisible={true}
            >
                <Text style={{ fontSize: 20, textAlign: 'center' }}>{t('errors.server_unavailable').toString()}</Text>
                <Text style={{ fontSize: 20, textAlign: 'center' }}>{t('errors.please_try_later').toString()}</Text>
            </Overlay>
        )
    }
    // if (isLoading) {
    //     <View style={styles.container}>
    //         <View style={styles.loader}>
    //             {isLoading && <Text style={styles.textLoading}>{t('catalog.loading').toString()} <ActivityIndicator /></Text>}
    //         </View>
    //     </View>
    // }
    return (
        <View>
            <StatusBar style="dark" />
            <View style={{ height: 150 }}>
                <SearchBar
                    style={{ width: "100%", margin: 0, paddingTop: 0, flex: 1, }}
                    containerStyle={{ paddingTop: 22 }}
                    placeholder={t('home.search').toString()}
                    keyboardType='web-search'
                    onChangeText={(query) => {
                        console.log('================onChangeText====================');
                        console.log(query);
                        setSearchString(query)
                    }}
                    onSubmitEditing={(e) => {
                        console.log('=================onSubmitEditing===================');
                        console.log(e);
                        navigationSearch.navigate('Search', { searchString })
                    }}
                    value={searchString}
                />

                <Text style={[styles.header]}>{t('home.recentlyAdded_lbl').toString()}</Text>
                <View style={{ position: 'absolute', right: 20, top: 100 }}>
                    <Icon
                        size={30}
                        name='send'
                        type='font-awesome'
                        color={'#46a1dc'}
                        containerStyle={{}}
                        iconStyle={{}}
                        onPress={async () => {
                            const supported = await Linking.canOpenURL("https://t.me/LtopSupport");
                            if (supported) {
                                await Linking.openURL("https://t.me/LtopSupport");
                            } else {
                            }
                        }} />
                </View>

            </View>
            <View style={styles.productList}>
                <FlatList
                    data={products}
                    renderItem={({ item }) => <Product key={item.ID} product={item} rates={rates} valuta={valuta} />}
                    ListFooterComponent={
                        <View style={[styles.loader, {marginBottom:160}]}>
                            {isLoading && <Text style={styles.textLoading}>{t('catalog.loading').toString()} <ActivityIndicator /></Text>}
                        </View>
                    }
                />
            </View>
            {/* <View style={styles.container}>
                {elemets}
                {isLoading &&
                    <View style={styles.loader}>
                        <Text style={styles.textLoading}>{t('catalog.loading').toString()} <ActivityIndicator /></Text>
                    </View>
                }
            </View> */}
        </View>
    )
}

