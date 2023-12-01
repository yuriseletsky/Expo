import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    Button,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TextInputBase,
    View,
} from 'react-native';
import { ProductSearchResult, PropertyList, SpecsByProduct, UserInfo } from '../TypeModels';
import { useTranslation } from 'react-i18next';
import CatalogServices from '../../services/CatalogServices';
import { Input } from '@rneui/themed';
import { t } from 'i18next';

interface SpecTableProps {
    spec: PropertyList[];
    editable?: boolean;
    handlerSetScecs(result: PropertyList[]): void;
}
export function SpecTable(props: SpecTableProps): JSX.Element {
    const [spec, setSpec] = useState<Array<PropertyList>>(props.spec);

    if (spec == undefined) {
        return (
            <>
                <Text>Undefined</Text>
            </>
        )
    }

    return (
        <ScrollView style={{ zIndex: 3 }}>
            <View>
                {spec.map((element, index, arr) =>
                    <Input
                        editable={props.editable}
                        key={element.name + index}
                        label={t(`product.details.spec.${element.name}`).toString()}
                        placeholder={t(`product.details.spec.${element.name}`).toString()}
                        defaultValue={element ? element.value : ""}
                        leftIconContainerStyle={{}}
                        onChangeText={(e) => {
                            arr[index].value = e;

                            console.log("spec2", e);
                            console.log("spec3", arr);
                            setSpec(arr);
                            props.handlerSetScecs(arr);
                        }}
                    />)}
                {/* <Input
                    label={t('product.details.spec.name').toString()}
                    placeholder={t('product.details.spec.name').toString()}
                    value={spec.product.model}
                    leftIconContainerStyle={{}}
                    // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                    onChange={(e) => {
                        console.log(e.nativeEvent.text);

                    }}
                />
               
                <Input
                    label={t('product.details.spec.general_brand').toString()}
                    placeholder={t('product.details.spec.general_brand').toString()}
                    value={spec.product.brand}
                    leftIconContainerStyle={{}}
                    // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                    onChange={(e) => {
                        console.log(e.nativeEvent.text);

                    }}
                />
                <Input
                    label={t('product.details.spec.date_released').toString()}
                    placeholder={t('product.details.spec.date_released').toString()}
                    value={spec.date.released}
                    leftIconContainerStyle={{}}
                    // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                    onChange={(e) => {
                        console.log(e.nativeEvent.text);

                    }}
                />
                <Input
                    label={t('product.details.spec.weight').toString()}
                    placeholder={t('product.details.spec.weight').toString()}
                    value={spec.design.body.weight}
                    leftIconContainerStyle={{}}
                    // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                    onChange={(e) => {
                        console.log(e.nativeEvent.text);

                    }}
                />
                <Input
                    label={t('product.details.spec.display_size_inch').toString()}
                    placeholder={t('product.details.spec.display_size_inch').toString()}
                    value={spec.display.diagonal}
                    leftIconContainerStyle={{}}
                    // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                    onChange={(e) => {
                        console.log(e.nativeEvent.text);

                    }}
                />
                <Input
                    label={t('product.details.spec.display_type').toString()}
                    placeholder={t('product.details.spec.display_type').toString()}
                    value={spec.display.lcd_mode}
                    leftIconContainerStyle={{}}
                    // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                    onChange={(e) => {
                        console.log(e.nativeEvent.text);
                    }}
                />
                <Input
                    label={t('product.details.spec.camera_back__mp').toString()}
                    placeholder={t('product.details.spec.camera_back__mp').toString()}
                    value={spec.camera.back_camera.resolution}
                    leftIconContainerStyle={{}}
                    // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                    onChange={(e) => {
                        console.log(e.nativeEvent.text);
                    }}
                />
                <Input
                    label={t('product.details.spec.camera_front__mp').toString()}
                    placeholder={t('product.details.spec.camera_front__mp').toString()}
                    value={spec.camera.front_camera.resolution}
                    leftIconContainerStyle={{}}
                    // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                    onChange={(e) => {
                        console.log(e.nativeEvent.text);

                    }}
                />
                <Input
                    label={t('product.details.spec.software_os').toString()}
                    placeholder={t('product.details.spec.software_os').toString()}
                    value={spec.inside.software.os}
                    leftIconContainerStyle={{}}
                    // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                    onChange={(e) => {
                        console.log(e.nativeEvent.text);

                    }}
                />
                <Input
                    label={t('product.details.spec.software_os_version').toString()}
                    placeholder={t('product.details.spec.software_os_version').toString()}
                    value={spec.inside.software.os_version}
                    leftIconContainerStyle={{}}
                    // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                    onChange={(e) => {
                        console.log(e.nativeEvent.text);

                    }}
                />
                <Input
                    label={t('product.details.spec.cpu_type').toString()}
                    placeholder={t('product.details.spec.cpu_type').toString()}
                    value={spec.inside.processor.cpu}
                    leftIconContainerStyle={{}}
                    // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                    onChange={(e) => {
                        console.log(e.nativeEvent.text);

                    }}
                />
                <Input
                    label={t('product.details.spec.ram_capacity_gb').toString()}
                    placeholder={t('product.details.spec.ram_capacity_gb').toString()}
                    value={spec.inside.ram.capacity}
                    leftIconContainerStyle={{}}
                    // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                    onChange={(e) => {
                        console.log(e.nativeEvent.text);

                    }}
                />
                <Input
                    label={t('product.details.spec.storage_capacity_gb').toString()}
                    placeholder={t('product.details.spec.storage_capacity_gb').toString()}
                    value={spec.inside.storage.capacity}
                    leftIconContainerStyle={{}}
                    // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                    onChange={(e) => {
                        console.log(e.nativeEvent.text);

                    }}
                />
                <Input
                    label={t('product.details.spec.battery_capacity').toString()}
                    placeholder={t('product.details.spec.battery_capacity').toString()}
                    value={spec.inside.battery.cell_i}
                    leftIconContainerStyle={{}}
                    // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                    onChange={(e) => {
                        console.log(e.nativeEvent.text);

                    }}
                />
                <Input
                    label={t('product.details.spec.battery_technology').toString()}
                    placeholder={t('product.details.spec.battery_technology').toString()}
                    value={spec.inside.battery.style}
                    leftIconContainerStyle={{}}
                    // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                    onChange={(e) => {
                        console.log(e.nativeEvent.text);

                    }}
                />
                <Input
                    label={t('product.details.spec.color').toString()}
                    placeholder={t('product.details.spec.color').toString()}
                    value={spec.design.body.color}
                    leftIconContainerStyle={{}}
                    // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                    onChange={(e) => {
                        console.log(e.nativeEvent.text);

                    }}
                /> */}
                {/* <Text> {JSON.stringify(spec)}</Text> */}
            </View>

        </ScrollView>
    )
}