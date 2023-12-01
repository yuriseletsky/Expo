import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { getToken } from "../Storage/Token";
import UserServices from "../../services/UserService";
import { ProductType } from "../TypeModels";
import { Picker } from "@react-native-picker/picker";
import { styles } from '../styles';
import { t } from "i18next";
import { Product } from "../Product";
import { Profile } from "../Profile";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CatalogServices from "../../services/CatalogServices";

export function Favorites(): JSX.Element {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [sorting, setSorting] = useState<string>("NewOld");
    const [viewSorting, setViewSorting] = useState<string>(t('catalog.sorting.new_to_old').toString());
    const isFocused = useIsFocused();
    const [products, setProducts] = useState<ProductType[]>([]);
    const [rates, setRates] = useState<{ [key: string]: number }>({});
    const [valuta, setValuta] = useState<string>("UAH");

    useEffect(() => {
        (async () => {
            const token = await getToken();
            console.log("isFocused token", token);
            if (token != "") {
                setIsLoading(true);
                await setIsAuthenticated(true);
                await loadCurrency();
                await setProducts([]);
                let favorites: ProductType[] = await UserServices.GetFavorites(sorting);
                console.log("favorites", favorites);
                setProducts(favorites);
                setIsLoading(false);
            } else {
                console.log("setIsAuthenticated");
                setIsAuthenticated(false);
            }
            console.log("==================================================================setIsAuthenticated");
            setIsLoading(false);

        })()
        switch (sorting) {
            case "NewOld":
                setViewSorting(t('catalog.sorting.new_to_old').toString());
                break;
            case "MinMax":
                setViewSorting(t('catalog.sorting.first_cheap').toString());
                break;
            case "MaxMin":
                setViewSorting(t('catalog.sorting.first_expensive').toString());
                break;
            case "AtZ":
                setViewSorting(t('catalog.sorting.a_z').toString());
                break;
            case "ZtA":
                setViewSorting(t('catalog.sorting.z_a').toString());
                break;
            case "MaxPop":
                setViewSorting(t('catalog.sorting.popular').toString());
                break;
        }
    }, [isFocused, isAuthenticated])
    
    const loadCurrency = async () => {
        const valuta = await AsyncStorage.getItem(`@valuta`);
        if (!valuta) {
            AsyncStorage.setItem(`@valuta`, "UAH");
            setValuta("UAH");
        } else {
            setValuta(valuta);
        }

        let rates = await CatalogServices.GetCurrencyRates();
        if (rates) {
            var rateObj: { [key: string]: number } = {};
            rates.forEach((item: { ValutaType: string, Rate: number }) => {
                rateObj[item.ValutaType] = item.Rate;
            })
            setRates(rateObj);
            await AsyncStorage.setItem(`@rates`, JSON.stringify(rateObj));
        }
    }
    // function sortingProducts(array: ProductType[], sortingType: string): ProductType[] {
    //     let newArray: ProductType[] = [];
    //     switch (sortingType) {
    //         case "MinMax":
    //             console.log("MinMax");

    //             newArray = array.sort((a, b) => {
    //                 if (a.Price < b.Price) {
    //                     return 1;
    //                 }
    //                 if (a.Price > b.Price) {
    //                     return -1;
    //                 }
    //                 return 0;
    //             });
    //             return newArray;

    //             break;
    //         case "MaxMin":
    //             console.log("MaxMin");

    //             newArray = array.sort((a, b) => {
    //                 if (a.Price < b.Price) {
    //                     return -1;
    //                 }
    //                 if (a.Price > b.Price) {
    //                     return 1;
    //                 }
    //                 return 0;
    //             });
    //             return newArray;
    //             break;
    //         case "AtZ":
    //             console.log("AtZ");

    //             newArray = array.sort((a, b) => {
    //                 if (a.Name < b.Name) {
    //                     return 1;
    //                 }
    //                 if (a.Name > b.Name) {
    //                     return -1;
    //                 }
    //                 return 0;
    //             });
    //             return newArray;
    //             break;
    //         case "ZtA":
    //             console.log("ZtA");
    //             newArray = array.sort((a, b) => {
    //                 if (a.Name > b.Name) {
    //                     return -1;
    //                 }
    //                 if (a.Name < b.Name) {
    //                     return 1;
    //                 }
    //                 return 0;
    //             });
    //             return newArray;
    //             break;
    //         default:
    //             return newArray;
    //     }
    // }

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            setProducts([]);
            let favorites: ProductType[] = await UserServices.GetFavorites(sorting);
            console.log("favorites2", favorites);
            setProducts(favorites);
            setIsLoading(false);
        })()
        // setProducts(sortingProducts(products, sorting));
    }, [sorting])

    if (isAuthenticated) {
        return (
            <View>
                <View style={[styles.containerRow, { marginTop: 15 }]}>
                    <View style={styles.dropdown}>
                        <Text style={{ fontSize: 16, position: "absolute", zIndex: 2, padding: 2, top: 13, left: 14, backgroundColor: "#F2F2F2", width: "70%" }} numberOfLines={1}>{viewSorting}</Text>
                        <Picker
                            placeholder={t('catalog.sorting.place_holder').toString()}
                            selectedValue={sorting}
                            onValueChange={(itemValue, itemIndex) => {
                                console.log("itemValue");

                                setSorting(itemValue);
                                switch (itemValue) {
                                    case "NewOld":
                                        setViewSorting(t('catalog.sorting.new_to_old').toString());
                                        break;
                                    case "MinMax":
                                        setViewSorting(t('catalog.sorting.first_cheap').toString());
                                        break;
                                    case "MaxMin":
                                        setViewSorting(t('catalog.sorting.first_expensive').toString());
                                        break;
                                    case "AtZ":
                                        setViewSorting(t('catalog.sorting.a_z').toString());
                                        break;
                                    case "ZtA":
                                        setViewSorting(t('catalog.sorting.z_a').toString());
                                        break;
                                    case "MaxPop":
                                        setViewSorting(t('catalog.sorting.popular').toString());
                                        break;
                                }
                            }
                            }>
                            <Picker.Item label={t('catalog.sorting_long.new_to_old').toString()} value="NewOld" />
                            <Picker.Item label={t('catalog.sorting_long.first_cheap').toString()} value="MinMax" />
                            <Picker.Item label={t('catalog.sorting_long.first_expensive').toString()} value="MaxMin" />
                            <Picker.Item label={t('catalog.sorting_long.a_z').toString()} value="AtZ" />
                            <Picker.Item label={t('catalog.sorting_long.z_a').toString()} value="ZtA" />
                            <Picker.Item label={t('catalog.sorting_long.popular').toString()} value="MaxPop" />
                        </Picker>
                    </View>
                </View>
                {(products.length == 0 && !isLoading) &&
                    <>
                        <Text style={{ fontSize: 25, textAlign: "center" }}>{t('favorite.no_ads').toString()}</Text>
                    </>
                }
                <View style={{ marginBottom: 130 }}>
                    <FlatList
                        data={products}
                        renderItem={({ item, index }) => <Product key={item.ID + index} product={item} rates={rates} valuta={valuta} />}
                        onEndReachedThreshold={0.2}
                        ListFooterComponent={
                            <View style={styles.loader}>
                                {isLoading && <Text style={styles.textLoading}>{t('catalog.loading').toString()} <ActivityIndicator /></Text>}
                            </View>
                        }
                    />
                </View>
            </View>
        )
    } else {
        return (
            <Profile callbackSetAutorize={setIsAuthenticated} optionButtons={true} />
        )
    }

}