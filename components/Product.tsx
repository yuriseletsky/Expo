import React, { useEffect, useState } from 'react';
import {
    Image,
    Pressable,
    Text,
    View,
} from 'react-native';
import { Dialog, Icon } from '@rneui/themed';
import { ProductType } from "./TypeModels"
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import Swiper from 'react-native-swiper';
import { styles } from './styles';
import CatalogServices from '../services/CatalogServices';
// import Gallery from 'react-native-image-gallery';

export type ProductDetailsStackParamList = {
    ProductDetails: { product: ProductType, rate: number, saverate: number, valuta: string } | undefined;
};
export type ProductParamList = {
    product: ProductType;
    rates: { [key: string]: number };
    valuta: string;
};

export function renderButtons(PhotosItem: Array<{ ID: string, PhotoStr: string }>) {
    return PhotosItem.map((item) => {
        return (
            <View key={item.ID + item.PhotoStr} style={styles.slide}>
                < Image
                    resizeMode='cover'
                    style={styles.image}
                    source={{
                        uri: `https://res.cloudinary.com/ltopcloud/image/upload/ar_1:1,c_pad,dn_50,w_1500/${item.PhotoStr}.jpg`,
                    }}
                />
            </View>
        );
    });
}
export function Product(param: ProductParamList): JSX.Element {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<ProductDetailsStackParamList>>();
    const navigationEdit = useNavigation<StackNavigationProp<any>>();
    const [isCompare, setIsCompare] = useState<boolean>((param.product.isCompare == undefined || param.product.isCompare == false) ? false : true);
    const [isFavorite, setIsFavorite] = useState<boolean>((param.product.IsFavorite == undefined || param.product.IsFavorite == false) ? false : true);
    const [rate, setRate] = useState<number>(param.rates[param.valuta]);
    const [saverate, setSaverate] = useState<number>(param.rates[param.product.Valuta]);
    const isFocused = useIsFocused();
    const [visibleDialog, setVisibleDialog] = useState(false);
    const toggleDialog = () => {
        setVisibleDialog(!visibleDialog);
    };
    // const [visibleDialogWish, setVisibleDialogWish] = useState(false);
    // const toggleDialogWish = () => {
    //     setVisibleDialogWish(!visibleDialogWish);
    // };
    const [dialogMessage, setDialogMessage] = useState<string>("");

    useEffect(() => {

    }, [isFocused])
    return (
        <Pressable key={param.product.ID}
            style={styles.productItem}
            onPress={() => {
                navigation.navigate('ProductDetails', { title: param.product.Name, product: { ...param.product, isCompare: isCompare, IsFavorite: isFavorite }, rate: rate, saverate: saverate, valuta: param.valuta })
            }}>
            <Dialog
                overlayStyle={{ backgroundColor: "white" }}
                isVisible={visibleDialog}
                onBackdropPress={toggleDialog}
            >
                <Text>{dialogMessage}</Text>
            </Dialog>

            <View style={styles.productImage}>
                <Swiper style={{}} showsButtons={false} loop={true} autoplay={true} scrollEnabled={true} showsPagination={false}>
                    {renderButtons(param.product.PhotosItem)}
                </Swiper>
            </View>

            <View style={styles.productInfo}>
                <Text style={{ textAlign: 'center', marginTop: 5, fontSize: 20, padding: 4, minWidth: "100%" }} numberOfLines={1}>{param.product.Name}</Text>
                <Text style={{ textAlign: 'center', marginTop: 5, width: "80%", borderRadius: 20, backgroundColor: "#fff6e3", color: "#08762d", fontSize: 20 }} >{(param.product.Price * rate / saverate).toFixed(2) + ' ' + param.valuta}</Text>
                {!param.product.isEdit &&
                    <>
                        <Text style={{ textAlign: 'center', marginTop: 5, fontSize: 18, paddingTop: 5 }} >{t('product.author').toString() + ": "}</Text>
                        <Text style={{ textAlign: 'center', fontSize: 18, overflow: "hidden", paddingLeft: 5, minWidth: "100%" }} numberOfLines={1}>{param.product.Author}</Text>
                    </>
                }
                <View style={{ flexDirection: 'row', position: 'absolute', bottom: 0, right: 0 }}>
                    {!param.product.isEdit &&
                        <>

                            <Icon
                                raised
                                size={20}
                                name='balance-scale'
                                type='font-awesome'
                                color={isCompare ? '#000' : '#999'}
                                onPress={() => {
                                    (async () => {
                                        const data = await AsyncStorage.getItem(`@compareDeviceID_${param.product.CustomDeviceCategory}`);
                                        console.log('================data====================', param.product.CustomDeviceCategory);
                                        // console.log(product);
                                        console.log(data);
                                        let compareList: Array<number> = [];
                                        if (data != null) {
                                            console.log("have");

                                            compareList = JSON.parse(data);
                                        }
                                        let index = compareList.indexOf(param.product.ID);
                                        if (index != -1) {
                                            console.log("remove");

                                            compareList.splice(index, 1);
                                            setIsCompare(false);
                                            param.product.isCompare = false;
                                            setDialogMessage(t('remove_compare').toString());
                                            setVisibleDialog(!visibleDialog);
                                        } else {
                                            console.log("add");
                                            setDialogMessage(t('add_compare').toString());
                                            setVisibleDialog(!visibleDialog);
                                            setIsCompare(true);
                                            param.product.isCompare = true;

                                            compareList.push(param.product.ID);
                                        }
                                        console.log(`@compareDeviceID_${param.product.CustomDeviceCategory}`, compareList);
                                        AsyncStorage.setItem(`@compareDeviceID_${param.product.CustomDeviceCategory}`, JSON.stringify(compareList));
                                        console.log('================end data ====================');

                                    })()
                                }} />
                            <Icon
                                raised
                                size={20}
                                name={isFavorite ? 'heart' : 'heart-o'}
                                type='font-awesome'
                                color='#ffa900'
                                onPress={() => {
                                    (async () => {
                                        const data = await AsyncStorage.getItem(`@favoriteDeviceID_${param.product.DevCatId}`);
                                        let favoriteList: Array<number> = [];
                                        if (data != null) {
                                            favoriteList = JSON.parse(data);
                                        }
                                        let index = favoriteList.indexOf(param.product.ID);
                                        if (isFavorite) {
                                            setIsFavorite(false);
                                            CatalogServices.RemoveFavorite(param.product.ID);
                                            if (index != -1) {
                                                favoriteList.splice(index, 1);
                                            }
                                            setDialogMessage(t('remove_wishlist').toString());
                                            setVisibleDialog(!visibleDialog);
                                        } else {
                                            setDialogMessage(t('add_wishlist').toString());
                                            setVisibleDialog(!visibleDialog);
                                            setIsFavorite(true);
                                            CatalogServices.AddFavorite(param.product.ID);
                                            if (index == -1) {
                                                favoriteList.push(param.product.ID);
                                            }
                                        }
                                        console.log("favoriteList", favoriteList);
                                        AsyncStorage.setItem(`@favoriteDeviceID_${param.product.DevCatId}`, JSON.stringify(favoriteList))
                                    })()
                                }} />
                        </>}
                    {param.product.isEdit &&
                        <Icon
                            raised
                            size={20}
                            name={'edit'}
                            type='font-awesome'
                            color='#000'
                            onPress={() => {
                                (async () => {
                                    let product: ProductType = param.product;
                                    navigationEdit.navigate('Edit', { product })
                                })()
                            }} />}
                </View>
            </View>

        </Pressable>
    )
}