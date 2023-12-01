import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    FlatList,
    // Button,
    LogBox,
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import { Filter, ProductSearch, ProductType } from './TypeModels';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { CheckBox, Icon, Input, Tab, TabView, Text, Button, SearchBar } from '@rneui/themed';
import { Picker } from '@react-native-picker/picker';

import Slider from "react-native-hook-image-slider"
import { SceneMap } from 'react-native-tab-view';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import CatalogServices from '../services/CatalogServices';
import GoogleGeo from './GoogleGeo';
import MessageService from '../services/MessageService';
import { styles } from './styles';
import { t } from 'i18next';
import { StackNavigationProp } from '@react-navigation/stack';
import Swiper from 'react-native-swiper';
import { renderButtons } from './Product';
import { ScreenHeight } from '@rneui/base';
import { SearchItem } from './SearchItem';

export type ProductDetailsStackParamList = {
    ProductDetails: { product: ProductType, rate: number, saverate: number, valuta: string } | undefined;
};

export function Search(): JSX.Element {
    let params = useRoute().params as { searchString: any };
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isEnd, setIsEnd] = useState<boolean>(false);
    const [products, setProducts] = useState<ProductType[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const productsListRef = useRef<FlatList>(null);
    const [page, setPage] = useState<number>(1);
    const navigation = useNavigation<StackNavigationProp<ProductDetailsStackParamList>>();

    const [searchString, setSearchString] = useState<string>("");
    const [viewSorting, setViewSorting] = useState<string>(t('catalog.sorting.new_to_old').toString());
    const [sorting, setSorting] = useState<string>("NewOld");
    const [rates, setRates] = useState<{ [key: string]: number }>({});
    const [valuta, setValuta] = useState<string>("UAH");
    const isFocused = useIsFocused();

    useEffect(() => {
        console.log('==================Search==================');
        if (params.searchString.length > 0) {
            setSearchString(params.searchString);
            (async () => {
                await loadCurrency();
                let data = await CatalogServices.getSearchData(params.searchString);
                await setProducts(data.items as ProductType[]);
                await setTotalCount(data.totalResult);
                setIsLoading(false);

            })();
        }
    }, [isFocused]);

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
    const search = async () => {
        setIsLoading(true);
        setProducts([]);

        console.log("search");
        let data = await CatalogServices.getSearchData(params.searchString);
        if (data.items.length > 0) {
            setPage(1);
            setProducts(data.items);
            console.log('=================data.totalResult===================');
            console.log(data.totalResult);
            setTotalCount(data.totalResult);
            setIsLoading(false);
        } else {
            setIsEnd(true);
            setIsLoading(false);

        }

    }


    const loadNext = async () => {
        console.log("loadNext");
        let data = await CatalogServices.getSearchData(params.searchString, page + 1);
        if (data.items.length > 0) {
            await setPage(page + 1);
            await setProducts([...products, ...data.items]);
            await setIsLoading(false);
        } else {
            await setIsEnd(true);
            await setIsLoading(false);

        }

    }

    const handleLoadMore = async () => {
        console.log('================products.length====================');
        console.log(products.length);
        if (!isLoading && !isEnd) {
            console.log('=================true===================');
            await setIsLoading(true);
            await loadNext();
        }
    };

    return (
        <View style={[{ flex: 1 }]}>
            <View style={{}}>
                <SearchBar
                    style={{ width: "100%", margin: 0, paddingTop: 0, flex: 1, }}
                    containerStyle={{}}
                    placeholder={t('home.search').toString()}
                    keyboardType='web-search'
                    defaultValue={searchString}
                    onChangeText={(query) => {
                        console.log('================onChangeText====================');
                        console.log(query);
                        setSearchString(query);
                    }}
                    onSubmitEditing={search}
                    value={searchString}
                />
            </View>
            <View style={{ flexDirection: "row", paddingLeft: 5, paddingRight: 5, height: 50 }}>

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
                    </Picker>
                </View>

                <Text style={{ fontSize: 16, textAlign: "center", top: 13, }}>{t('search.total').toString() + totalCount}</Text>

            </View>
            <View style={{ paddingLeft: 5, paddingRight: 5, marginBottom: 140 }}>
                <FlatList
                    style={{}}
                    ref={productsListRef}
                    data={products}
                    renderItem={({ item }) =>
                        <SearchItem key={item.ID} product={item} rates={rates} valuta={valuta} />
                    }
                    onEndReachedThreshold={0.3}
                    onEndReached={handleLoadMore}
                    ListFooterComponent={
                        <View style={styles.loader}>
                            {isLoading && <Text style={styles.textLoading}>{t('catalog.loading').toString()} <ActivityIndicator /></Text>}
                        </View>
                    }
                />
            </View>

        </View>
    )
    // return(
    //     <View style={styles.container}>
    //     <View style={styles.containerRow}>
    //         <View style={styles.dropdown}>
    //             <Text style={{ fontSize: 16, position: "absolute", zIndex: 2, padding: 2, top: 13, left: 14, backgroundColor: "#F2F2F2", width: "70%" }} numberOfLines={1}>{viewSorting}</Text>
    //             <Picker
    //                 placeholder={t('catalog.sorting.place_holder').toString()}
    //                 selectedValue={filter.Sorting}
    //                 onValueChange={(itemValue, itemIndex) => {
    //                     console.log("itemValue");

    //                     setFilter({ ...filter, Sorting: itemValue });
    //                     switch (itemValue) {
    //                         case "NewOld":
    //                             setViewSorting(t('catalog.sorting.new_to_old').toString());
    //                             break;
    //                         case "MinMax":
    //                             setViewSorting(t('catalog.sorting.first_cheap').toString());
    //                             break;
    //                         case "MaxMin":
    //                             setViewSorting(t('catalog.sorting.first_expensive').toString());
    //                             break;
    //                         case "AtZ":
    //                             setViewSorting(t('catalog.sorting.a_z').toString());
    //                             break;
    //                         case "ZtA":
    //                             setViewSorting(t('catalog.sorting.z_a').toString());
    //                             break;
    //                         case "MaxPop":
    //                             setViewSorting(t('catalog.sorting.popular').toString());
    //                             break;
    //                     }
    //                 }
    //                 }>
    //                 <Picker.Item label={t('catalog.sorting_long.new_to_old').toString()} value="NewOld" />
    //                 <Picker.Item label={t('catalog.sorting_long.first_cheap').toString()} value="MinMax" />
    //                 <Picker.Item label={t('catalog.sorting_long.first_expensive').toString()} value="MaxMin" />
    //                 <Picker.Item label={t('catalog.sorting_long.a_z').toString()} value="AtZ" />
    //                 <Picker.Item label={t('catalog.sorting_long.z_a').toString()} value="ZtA" />
    //                 <Picker.Item label={t('catalog.sorting_long.popular').toString()} value="MaxPop" />
    //             </Picker>
    //         </View>
    //         <View style={styles.filterButton}>
    //             <Button title={<>
    //                 <Text style={styles.filterButtonText}>{t('catalog.filter').toString()} </Text>
    //                 <Icon
    //                     name='filter'
    //                     type='font-awesome'
    //                 />
    //             </>}
    //                 radius={'sm'}
    //                 type="solid"
    //                 buttonStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.0)' }}
    //                 onMagicTap={toggleOverlay}
    //                 onPress={toggleOverlay}
    //             >
    //             </Button>
    //         </View>
    //     </View>
    //     <Overlay
    //         animationType='fade'
    //         backdropStyle={styles.backdropStyle}
    //         overlayStyle={styles.overlayCustom}
    //         fullScreen={false}
    //         isVisible={isShowFilters}
    //         onBackdropPress={toggleOverlay}>
    //         <FilterSidebar filterList={{ ...filterList }} filter={{ ...filter }} handlerSetFilter={applyFilters} />
    //     </Overlay>


    //     <View style={styles.productList}>
    //         <FlatList
    //             ref={productsListRef}
    //             data={products}
    //             renderItem={({ item }) => <Product key={item.ID} {...item} />}
    //             onEndReachedThreshold={0.2}
    //             onEndReached={handleLoadMore}
    //             ListFooterComponent={
    //                 <View style={styles.loader}>
    //                     {isLoading && <Text style={styles.textLoading}>{t('catalog.loading').toString()} <ActivityIndicator /></Text>}
    //                 </View>
    //             }
    //         />
    //     </View>
    // </View>
    // )
}
