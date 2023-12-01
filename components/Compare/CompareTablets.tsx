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
import { LaptopsSpec, ProductType, SmartphonesSpec, TabletSpec, TabletSpecUniq } from "../TypeModels"
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { t } from 'i18next';

export type ProductDetailsStackParamList = {
    product: ProductType;
    spec: TabletSpec;
    uniq: TabletSpecUniq;

};
export function CompareTablets(props: ProductDetailsStackParamList): JSX.Element {
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
            {!props.uniq.brand &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.general_brand').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.brand ? props.spec.brand : '-'}</Text>
                </View>
            }{!props.uniq.name &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.model').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.name ? props.spec.name : '-'}</Text>
                </View>
            }{!props.uniq.mpn &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.mpn').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.mpn ? props.spec.mpn : '-'}</Text>
                </View>
            }{!props.uniq.date_released &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.date_released').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.date_released ? props.spec.date_released : '-'}</Text>
                </View>
            }{!props.uniq.weight &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.weight').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.weight ? props.spec.weight : '-'}</Text>
                </View>
            }{!props.uniq.display_diagonal &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.display_size_inch').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.display_diagonal ? props.spec.display_diagonal : '-'}</Text>
                </View>
            }{!props.uniq.display_type &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.display_type').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.display_type ? props.spec.display_type : '-'}</Text>
                </View>
            }{!props.uniq.back_camera &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.camera_back__mp').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.back_camera ? props.spec.back_camera : '-'}</Text>
                </View>
            }{!props.uniq.front_camera &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.camera_front__mp').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.front_camera ? props.spec.front_camera : '-'}</Text>
                </View>
            }{!props.uniq.software_os &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >OS{t('product.details.spec.software_os').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.software_os ? props.spec.software_os : '-'}</Text>
                </View>
            }{!props.uniq.software_os_version &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.software_os_version').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.software_os_version ? props.spec.software_os_version : '-'}</Text>
                </View>
            }{!props.uniq.processor_cpu &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.cpu').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.processor_cpu ? props.spec.processor_cpu : '-'}</Text>
                </View>
            }{!props.uniq.ram_capacity &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.ram_capacity_gb').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.ram_capacity ? props.spec.ram_capacity : '-'}</Text>
                </View>
            }{!props.uniq.storage_capacity &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.storage_capacity_gb').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.storage_capacity ? props.spec.storage_capacity : '-'}</Text>
                </View>
            }{!props.uniq.battery_type &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.battery_technology').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.battery_type ? props.spec.battery_type : '-'}</Text>
                </View>
            }{!props.uniq.battery_capacity &&
                <View style={styles.productInfo}>
                    <Text style={styles.fieldName} >{t('product.details.spec.battery_capacity').toString()}</Text>
                    <Text style={styles.fieldValue} numberOfLines={5} >{props.spec.battery_capacity ? props.spec.battery_capacity : '-'}</Text>
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

    }

});