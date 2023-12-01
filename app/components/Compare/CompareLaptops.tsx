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
import { LaptopSpecUniq, LaptopsSpec, ProductType, SmartphonesSpec, TabletSpec } from "../TypeModels"
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { t } from 'i18next';

export type ProductDetailsStackParamList = {
    product: ProductType;
    spec: LaptopsSpec;
    uniq: LaptopSpecUniq;

};
export function CompareLaptops(props: ProductDetailsStackParamList): JSX.Element {
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
                </View>
            }
            <View style={styles.productInfo}>
                <Text style={styles.fieldName} >{t('product.details.spec.model').toString()}</Text>
                <Text style={styles.fieldValue} numberOfLines={5} >{props.product.Name ? props.product.Name : '-'}</Text>
            </View>
            {!props.uniq.mpn &&
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
            }{!props.uniq.camera_type &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.camera_type').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.camera_type ? props.spec.camera_type : '-'}</Text>
                </View>
            }{!props.uniq.camera_front_mp &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.camera_front__mp').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.camera_front_mp ? props.spec.camera_front_mp : '-'}</Text>
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
            }{!props.uniq.generation &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.generation').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.generation ? props.spec.generation : '-'}</Text>
                </View>
            }{!props.uniq.display_hd_type &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.display_hd_type').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.display_hd_type ? props.spec.display_hd_type : '-'}</Text>
                </View>
            }{!props.uniq.display_size_inch &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.display_size_inch').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.display_size_inch ? props.spec.display_size_inch : '-'}</Text>
                </View>
            }{!props.uniq.display_technology &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.display_technology').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.display_technology ? props.spec.display_technology : '-'}</Text>
                </View>
            }{!props.uniq.general_year &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.general_year').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.general_year ? props.spec.general_year : '-'}</Text>
                </View>
            }{!props.uniq.bluetooth_version &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.bluetooth_version').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.bluetooth_version ? props.spec.bluetooth_version : '-'}</Text>
                </View>
            }{!props.uniq.storage_type &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.storage_type').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.storage_type ? props.spec.storage_type : '-'}</Text>
                </View>
            }{!props.uniq.ssd_capacity_gb &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.ssd_capacity_gb').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.ssd_capacity_gb ? props.spec.ssd_capacity_gb : '-'}</Text>
                </View>
            }{!props.uniq.software_os &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.software_os').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.software_os ? props.spec.software_os : '-'}</Text>
                </View>
            }{!props.uniq.number_of_hdmi &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.number_of_hdmi').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.number_of_hdmi ? props.spec.number_of_hdmi : '-'}</Text>
                </View>
            }{!props.uniq.number_of_usb_ports &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.number_of_usb_ports').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.number_of_usb_ports ? props.spec.number_of_usb_ports : '-'}</Text>
                </View>
            }{!props.uniq.type_ram &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.type_ram').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.type_ram ? props.spec.type_ram : '-'}</Text>
                </View>
            }{!props.uniq.ram_capacity_gb &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.ram_capacity_gb').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.ram_capacity_gb ? props.spec.ram_capacity_gb : '-'}</Text>
                </View>
            }{!props.uniq.max_ram_capacity_gb &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.max_ram_capacity_gb').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.max_ram_capacity_gb ? props.spec.max_ram_capacity_gb : '-'}</Text>
                </View>
            }{!props.uniq.color &&
                <View style={styles.productInfo}>
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
        height: 200
    },
    productInfo: {
        flex: 3,
    },
    productControls: {
        flex: 1
    },
    fieldName: {
        textAlign: "center",
        backgroundColor: "#e0e0e0"
    },
    fieldValue: {
        flex: 1,
        padding: 5,
        textAlign: "center",

    },
    fieldValueMultiline: {
        padding: 5,
        textAlign: "center",
        height: 100,
    }

});