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
import { ProductDetailsStackParamList, ProductParamList, renderButtons } from './Product';
import { ScreenHeight } from '@rneui/base';


export function SearchItem(param: ProductParamList): JSX.Element {
    const [rate, setRate] = useState<number>(param.rates[param.valuta]);
    const [saverate, setSaverate] = useState<number>(param.rates[param.product.Valuta]);
    const navigation = useNavigation<StackNavigationProp<ProductDetailsStackParamList>>();

    return (
        <Pressable key={param.product.ID}
            style={styles.productItem}
            onPress={() => {
                navigation.navigate('ProductDetails', { product: param.product, rate: rate, saverate: saverate, valuta: param.valuta })
                console.log('================navigation====================');
            }}>
            <View style={styles.productImage}>
                <Swiper style={{}} showsButtons={false} loop={true} autoplay={true} scrollEnabled={true}>
                    {renderButtons(param.product.PhotosItem)}
                </Swiper>
            </View>
            <View style={styles.productInfo}>
                <Text style={{ textAlign: 'center', marginTop: 5, fontSize: 20, padding: 4, minWidth: "100%" }} numberOfLines={1}>{param.product.Name}</Text>
                <Text style={{ textAlign: 'center', marginTop: 5, width: "80%", borderRadius: 20, backgroundColor: "#fff6e3", color: "#08762d", fontSize: 20 }} >{(param.product.Price * rate / saverate).toFixed(2) + ' ' + param.valuta}</Text>
            </View>

        </Pressable>
    )
}