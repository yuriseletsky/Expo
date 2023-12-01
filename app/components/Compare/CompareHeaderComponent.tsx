import React, { useState } from 'react';
import {
    Button,
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { Icon } from '@rneui/themed';
import { LaptopsSpec, ProductType, SmartphonesSpec, SmartphonesSpecUniq, TabletSpec } from "../TypeModels"
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CompareHeaderComponentProps {
    product: ProductType;
    handlerDelete: () => void;
}
export function CompareHeaderComponent(props: CompareHeaderComponentProps): JSX.Element {
    return (
        <View key={props.product.ID + "header"} style={styles.productItem}>
            <View style={{ flex: 0, flexDirection: 'row' }}>

                <ImageBackground source={{ uri: props.product.PhotosItem[0] == null ? "https://ltop.shop/Content/images/ImageNotFound.jpg" : 'https://res.cloudinary.com/ltopcloud/image/upload/' + props.product.PhotosItem[0].PhotoStr + '.jpg' }} resizeMode="cover"
                    style={{ width: "100%", flexDirection: 'row-reverse', height: 200, }}>
                    <Icon
                        raised
                        reverse
                        size={18}
                        name='close'
                        type='font-awesome'
                        style={{
                            width: 38,
                            height: 38,
                        }}

                        color="#f44336"
                        onPress={() => {
                            console.log("product ", props.product);
                            console.log("remove ", props.product.ID, " cat: ", props.product.CustomDeviceCategory);
                            (async () => {
                                const data = await AsyncStorage.getItem(`@compareDeviceID_${props.product.CustomDeviceCategory}`);
                                let compareList: Array<number> = [];
                                if (data != null) {
                                    compareList = JSON.parse(data);
                                }
                                let index = compareList.indexOf(props.product.ID);
                                compareList.splice(index, 1);
                                AsyncStorage.setItem(`@compareDeviceID_${props.product.CustomDeviceCategory}`, JSON.stringify(compareList))
                                props.handlerDelete();
                            })()
                        }} />
                </ImageBackground>

                <View style={{ flexDirection: "column" }}>
                </View>
            </View>
            <Text style={styles.productName}>{props.product.Name}</Text>
            <Text style={styles.productPrice}>{props.product.Price + " " + props.product.Valuta}</Text>
        </View >
    )
}

const styles = StyleSheet.create({
    productItem: {
        flex: 1,
        flexDirection: "column",
        width: 250,
        textAlign: "center",
        height: 440,
        zIndex: 10,
        alignItems: "center"
    },
    productImage: {
        width: "100%",
        height: 200,
        margin: 5,
        flex: 1,
    },
    productInfo: {
        width: "95%",
        flex: 1,
        flexDirection: "row",
        borderBottomColor: "#e0e0e0",
        borderBottomWidth: 1,

    },
    productName: {
        textAlign: "center",
        fontSize: 16,
        padding: 5,
        fontWeight: 'bold',
        height: 50,
    },
    productPrice: {
        textAlign: "center",
        fontSize: 20,
        padding: 5,
        fontWeight: 'bold',
        width: "80%",
        backgroundColor: "#fff6e3",
        borderRadius: 20,
        color: "#08762d"
    },
    productControls: {
        flex: 1
    },
    fieldName: {
        width: 100,
        backgroundColor: "#e0e0e0",

    },
    fieldValue: {
        padding: 5,
        textAlign: "center",
    },
    fieldValueMultiline: {
        padding: 5,
        textAlign: "center",
        height: 100,
    }

});