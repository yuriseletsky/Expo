import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { getToken } from "./Storage/Token";
import UserServices from "./../services/UserService";
import { ProductType } from "./TypeModels";
import { Picker } from "@react-native-picker/picker";
import { styles } from './styles';
import { t } from "i18next";
import { Product } from "./Product";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CatalogServices from "../services/CatalogServices";

export function MyAnnouncements(): JSX.Element {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [sorting, setSorting] = useState<string>("MinMax");
    const isFocused = useIsFocused();
    const [products, setProducts] = useState<ProductType[]>([]);
    const [rates, setRates] = useState<{ [key: string]: number }>({});
    const [valuta, setValuta] = useState<string>("UAH");

    useEffect(() => {
        (async () => {
            await loadCurrency();
            let myAdverts: ProductType[] = await UserServices.GetMyAdvetrs();
            console.log("GetMyAdvetrs", myAdverts);
            setProducts(myAdverts);
            setIsLoading(false);

        })()
        console.log('==================MyAnnouncements log==================');

    }, [isFocused])
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
    function sortingProducts(array: ProductType[], sortingType: string): ProductType[] {
        let newArray: ProductType[] = [];
        switch (sortingType) {
            case "MinMax":
                console.log("MinMax");

                newArray = array.sort((a, b) => {
                    if (a.Price < b.Price) {
                        return 1;
                    }
                    if (a.Price > b.Price) {
                        return -1;
                    }
                    return 0;
                });
                return newArray;

                break;
            case "MaxMin":
                console.log("MaxMin");

                newArray = array.sort((a, b) => {
                    if (a.Price < b.Price) {
                        return -1;
                    }
                    if (a.Price > b.Price) {
                        return 1;
                    }
                    return 0;
                });
                return newArray;
                break;
            case "AtZ":
                console.log("AtZ");

                newArray = array.sort((a, b) => {
                    if (a.Name < b.Name) {
                        return 1;
                    }
                    if (a.Name > b.Name) {
                        return -1;
                    }
                    return 0;
                });
                return newArray;
                break;
            case "ZtA":
                console.log("ZtA");
                newArray = array.sort((a, b) => {
                    if (a.Name > b.Name) {
                        return -1;
                    }
                    if (a.Name < b.Name) {
                        return 1;
                    }
                    return 0;
                });
                return newArray;
                break;
            default:
                return newArray;
        }
    }

    useEffect(() => {
        setProducts(sortingProducts(products, sorting));
    }, [sorting])

    if (isLoading) {
        return (
            <View style={styles.loader}>
                {isLoading && <Text style={styles.textLoading}>{t('catalog.loading').toString()} <ActivityIndicator /></Text>}
            </View>
        )
    }
    return (
        <View>
            <View style={{}}>
                <Picker
                    placeholder={t('catalog.sorting.place_holder').toString()}
                    selectedValue={sorting}
                    onValueChange={(itemValue, itemIndex) => {
                        setSorting(itemValue);

                    }
                    }>
                    {/* <Picker.Item label={t('catalog.sorting.new_to_old').toString()} value="NewOld" /> */}
                    <Picker.Item label={t('catalog.sorting.first_cheap').toString()} value="MinMax" />
                    <Picker.Item label={t('catalog.sorting.first_expensive').toString()} value="MaxMin" />
                    <Picker.Item label={t('catalog.sorting.a_z').toString()} value="AtZ" />
                    <Picker.Item label={t('catalog.sorting.z_a').toString()} value="ZtA" />
                </Picker>
            </View>
            <View style={{ marginBottom: 100 }}>
                <FlatList
                    data={products}
                    renderItem={({ item, index }) => <Product key={item.ID + index + sorting} product={item} rates={rates} valuta={valuta} />}
                    onEndReachedThreshold={0.2}
                />
            </View>
        </View>
    )
}