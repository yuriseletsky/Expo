import React, { useState } from 'react';
import {
    Button,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
} from 'react-native';
import { Icon } from '@rneui/themed';
import { LaptopsSpec, ProductType, SmartphonesSpec, SmartphonesSpecUniq, TabletSpec } from "../TypeModels"
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { t } from 'i18next';

export type ProductDetailsStackParamList = {
    product: ProductType;
    spec: SmartphonesSpec;
    uniq: SmartphonesSpecUniq;
};
export function CompareSmartphones(props: ProductDetailsStackParamList): JSX.Element {
    const navigation = useNavigation<StackNavigationProp<ProductDetailsStackParamList>>();
    if (props.spec == undefined) {
        return (<></>)
    }
    return (
        <View key={props.product.ID} style={styles.productItem}>
            <View style={styles.productInfo}>
                <Text style={styles.fieldName} >{t('product.author').toString()}</Text>
                <Text style={styles.fieldValue} numberOfLines={5} >{props.product.Author ? props.product.Author : '-'}</Text>
            </View>
            <View style={styles.productInfo}>
                <Text style={styles.fieldName} >{t('product.price').toString()}</Text>
                <Text style={styles.fieldValue} numberOfLines={5} >{props.product.Price ? props.product.Price : '-'}</Text>
            </View>

            {!props.uniq.general_brand &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.general_brand').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.general_brand ? props.spec.general_brand : '-'}</Text>
                </View>}
            {!props.uniq.name &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.name').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.name ? props.spec.name : '-'}</Text>
                </View>
            }{!props.uniq.mpn &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.mpn').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.mpn ? props.spec.mpn : '-'}</Text>
                </View>
            }{!props.uniq.info &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.info').toString()}</Text>
                    <Text style={styles.fieldValueMultiline} numberOfLines={5} >{props.spec.info ? props.spec.info : '-'}</Text>
                </View>
            }{!props.uniq.battery_capacity &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.battery_capacity').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.battery_capacity ? props.spec.battery_capacity : '-'}</Text>
                </View>
            }
            {!props.uniq.battery_technology &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.battery_technology').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.battery_technology ? props.spec.battery_technology : '-'}</Text>
                </View>}
            {!props.uniq.camera_back__mp &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.camera_back__mp').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.camera_back__mp ? props.spec.camera_back__mp : '-'}</Text>
                </View>}
            {!props.uniq.camera_front__mp &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.camera_front__mp').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.camera_front__mp ? props.spec.camera_front__mp : '-'}</Text>
                </View>
            }{!props.uniq.cpu_type &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.cpu_type').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.cpu_type ? props.spec.cpu_type : '-'}</Text>
                </View>
            }{!props.uniq.cpu_number_of_cores &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.cpu_number_of_cores').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.cpu_number_of_cores ? props.spec.cpu_number_of_cores : '-'}</Text>
                </View>
            }{!props.uniq.display_size_inch &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.display_size_inch').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.display_size_inch ? props.spec.display_size_inch : '-'}</Text>
                </View>
            }{!props.uniq.display_type &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.display_type').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.display_type ? props.spec.display_type : '-'}</Text>
                </View>
            }{!props.uniq.general_year &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.general_year').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.general_year ? props.spec.general_year : '-'}</Text>
                </View>
            }{!props.uniq.software_os &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.software_os').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.software_os ? props.spec.software_os : '-'}</Text>
                </View>
            }{!props.uniq.storage_capacity_gb &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.storage_capacity_gb').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.storage_capacity_gb ? props.spec.storage_capacity_gb : '-'}</Text>
                </View>
            }{!props.uniq.ram_capacity_gb &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.ram_capacity_gb').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.ram_capacity_gb ? props.spec.ram_capacity_gb : '-'}</Text>
                </View>
            }{!props.uniq.color &&
                <View >
                    <Text style={styles.fieldName} >{t('product.details.spec.color').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.color ? props.spec.color : '-'}</Text>
                </View>
            }
        </View >
    )
}

const styles = StyleSheet.create({
    productItem: {
        flex: 1,
        flexDirection: "column",
        width: 250,
        textAlign: "center",
        marginBottom: 510,
    },
    productImage: {
        width: "95%",
        height: 200,
        marginBottom: 20,
    },
    productInfo: {
        flex: 1,
    },
    productControls: {
        flex: 1
    },
    fieldName: {
        textAlign: "center",
        backgroundColor: "#e0e0e0"
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