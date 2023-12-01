import React, { Component, useEffect, useState, useRef } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Modal,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    View,
} from 'react-native';
import { Product } from './Product';
import { Filter, FilterList, ProductType } from './TypeModels';
import { createStackNavigator } from '@react-navigation/stack';
import { ProductDetails } from './ProductDetals';
import { Picker } from '@react-native-picker/picker';
import CatalogServices from '../services/CatalogServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { Button, CheckBox, Icon, Overlay, Input } from '@rneui/themed';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { t } from 'i18next';

export interface FilterSidebarProps {
    filterList: FilterList,
    filter: Filter,
    handlerSetFilter(filter: Filter): void,
}
export function FilterSidebar(props: FilterSidebarProps): JSX.Element {
    const [filter, setFilter] = useState<Filter>({ ...props.filter});

    const toggleVendor = (vendor: string) => {
        const isContains = filter.Vendors.includes(vendor);
        if (isContains) {
            const newArray = filter.Vendors.filter((value) => value !== vendor);
            setFilter({ ...filter, Vendors: newArray });
        } else {
            setFilter({ ...filter, Vendors: [...filter.Vendors, vendor] });
        }
    };
    const toggleOS = (os: string) => {
        const isContains = filter.OS.includes(os);
        if (isContains) {
            const newArray = filter.OS.filter((value) => value !== os);
            setFilter({ ...filter, OS: newArray });
        } else {
            setFilter({ ...filter, OS: [...filter.OS, os] });
        }
    };
    const toggleDisplaySize = (size: string) => {
        const isContains = filter.DisplaySize.includes(size);
        if (isContains) {
            const newArray = filter.DisplaySize.filter((value) => value !== size);
            setFilter({ ...filter, DisplaySize: newArray });
        } else {
            setFilter({ ...filter, DisplaySize: [...filter.DisplaySize, size] });
        }
    };
    const toggleDisplayType = (displayType: string) => {
        const isContains = filter.DisplayType.includes(displayType);
        if (isContains) {
            const newArray = filter.DisplayType.filter((value) => value !== displayType);
            setFilter({ ...filter, DisplayType: newArray });
        } else {
            setFilter({ ...filter, DisplayType: [...filter.DisplayType, displayType] });
        }
    };
    const toggleProcessorType = (processorType: string) => {
        const isContains = filter.CPUType.includes(processorType);
        if (isContains) {
            const newArray = filter.CPUType.filter((value) => value !== processorType);
            setFilter({ ...filter, CPUType: newArray });
        } else {
            setFilter({ ...filter, CPUType: [...filter.CPUType, processorType] });
        }
    };
    const toggleNumberOfCores = (numberOfCores: string) => {
        const isContains = filter.CPUNumOfCorse.includes(numberOfCores);
        if (isContains) {
            const newArray = filter.CPUNumOfCorse.filter((value) => value !== numberOfCores);
            setFilter({ ...filter, CPUNumOfCorse: newArray });
        } else {
            setFilter({ ...filter, CPUNumOfCorse: [...filter.CPUNumOfCorse, numberOfCores] });
        }
    };
    const toggleRamCapacity = (ram: string) => {
        const isContains = filter.RAMCapacityList.includes(ram);
        if (isContains) {
            const newArray = filter.RAMCapacityList.filter((value) => value !== ram);
            setFilter({ ...filter, RAMCapacityList: newArray });
        } else {
            setFilter({ ...filter, RAMCapacityList: [...filter.RAMCapacityList, ram] });
        }
    };
    const toggleMemoryCapacity = (memory: string) => {
        const isContains = filter.StorageCapacity.includes(memory);
        if (isContains) {
            const newArray = filter.StorageCapacity.filter((value) => value !== memory);
            setFilter({ ...filter, StorageCapacity: newArray });
        } else {
            setFilter({ ...filter, StorageCapacity: [...filter.StorageCapacity, memory] });
        }
    };
    const toggleColor = (color: string) => {
        const isContains = filter.Color.includes(color);
        if (isContains) {
            const newArray = filter.Color.filter((value) => value !== color);
            setFilter({ ...filter, Color: newArray });
        } else {
            setFilter({ ...filter, Color: [...filter.StorageCapacity, color] });
        }
    };
    const toggleCondition = (status: boolean) => {
        let result = (status == filter.ItNew) ? null : status;
        console.log(result);

        setFilter({ ...filter, ItNew: result });
    };
    // if(props.filterList.VendorsList.length == 0){
    //     return (
    //         <Text>error</Text>
    //     )
    // }
    return (
        <View style={{flex: 1}}>
        <ScrollView style={styles.filterBlock}>
            <View>
                <View style={{ flexDirection: 'row' }}>
                    <Input
                        label={t('filter.min_price').toString()}

                        placeholder={t('filter.min_price').toString()}
                        value={filter.MinPrice}
                        containerStyle={styles.inputConteinerPrice}
                        inputContainerStyle={{ borderBottomWidth: 0 }}
                        inputStyle={styles.inputPrice}
                        labelStyle={styles.inputPriceLabel}
                        onChangeText={value => {
                            if (!value || parseInt(value) < props.filterList.MinPrice) {
                                setFilter({ ...filter, MinPrice: props.filterList.MinPrice.toString() })
                            } else if(parseInt(value) > parseInt(filter.MaxPrice)){
                                setFilter({ ...filter, MinPrice: filter.MaxPrice })
                            }
                             else {
                                setFilter({ ...filter, MinPrice: value })
                            }
                        }}
                        keyboardType='decimal-pad'
                    />
                    <Input
                        label={t('filter.max_price').toString()}
                        placeholder={t('filter.max_price').toString()}
                        value={filter.MaxPrice}
                        containerStyle={styles.inputConteinerPrice}
                        inputContainerStyle={{ borderBottomWidth: 0 }}
                        inputStyle={styles.inputPrice}
                        labelStyle={styles.inputPriceLabel}
                        onChangeText={value => {
                            if (!value || parseInt(value) > props.filterList.MaxPrice) {
                                setFilter({ ...filter, MaxPrice: props.filterList.MaxPrice.toString() })
                            } else if(parseInt(value) < parseInt(filter.MinPrice)){
                                setFilter({ ...filter, MaxPrice: filter.MinPrice })
                            }else {
                                setFilter({ ...filter, MaxPrice: value })

                            }
                        }}
                        keyboardType='decimal-pad'

                    />
                </View>
                <MultiSlider
                    markerContainerStyle={{ paddingLeft: 25 }}
                    trackStyle={{}}//дорожка
                    selectedStyle={{}}//дорожка
                    markerStyle={{ height: 20, width: 20, backgroundColor: "#505050" }}
                    pressedMarkerStyle={{ height: 25, width: 25 }}
                    min={props.filterList.MinPrice}
                    max={props.filterList.MaxPrice}
                    values={[parseInt(filter.MinPrice), parseInt(filter.MaxPrice)]}
                    onValuesChangeFinish={(values) => {
                        setFilter({ ...filter, MinPrice: values[0].toString(), MaxPrice: values[1].toString() });
                    }} />

            </View>
            <View style={styles.checkBoxView}>
                <Text style={{ fontWeight: 'bold', fontSize: 20, padding: 5 }}>{t('filter.condition').toString()}</Text>
                <CheckBox containerStyle={styles.customCheckbox} checked={filter.ItNew == true} title={t('filter.new').toString()} onIconPress={() => {
                    toggleCondition(true)
                }} />
                <CheckBox containerStyle={styles.customCheckbox} checked={filter.ItNew == false} title={t('filter.used').toString()} onIconPress={() => {
                    toggleCondition(false)
                }} />
            </View>
            <View style={styles.checkBoxView}>
                <Text style={{ fontWeight: 'bold', fontSize: 20, padding: 5 }}>{t('filter.vendor').toString()}</Text>
                {props.filterList.VendorsList && props.filterList.VendorsList.length > 0 && props.filterList.VendorsList.map((vendor, index) => (
                    <CheckBox
                        key={vendor + index}
                        title={vendor}
                        containerStyle={styles.customCheckbox}
                        checked={filter.Vendors.includes(vendor)}
                        onIconPress={() => {
                            toggleVendor(vendor)
                        }} />
                ))}
            </View>
            <View style={styles.checkBoxView}>
                <Text style={{ fontWeight: 'bold', fontSize: 20, padding: 5 }}>{t('filter.os').toString()}</Text>
                {props.filterList.OSList && props.filterList.OSList.length > 0 && props.filterList.OSList.map((os, index) => (
                    <CheckBox
                        key={os + index}
                        title={os}
                        containerStyle={styles.customCheckbox}
                        checked={filter.OS.includes(os)}
                        onIconPress={() => {
                            toggleOS(os)
                        }} />
                ))}
            </View>
            <View style={styles.checkBoxView}>
                <Text style={{ fontWeight: 'bold', fontSize: 20, padding: 5 }}>{t('filter.display_size').toString()}</Text>
                {props.filterList.DisplaySize && props.filterList.DisplaySize.length > 0 && props.filterList.DisplaySize.map((size, index) => (
                    <CheckBox
                        key={size + index}
                        title={size}
                        containerStyle={styles.customCheckbox}
                        checked={filter.DisplaySize.includes(size)}
                        onIconPress={() => {
                            toggleDisplaySize(size)
                        }} />
                ))}
            </View>
            <View style={styles.checkBoxView}>
                <Text style={{ fontWeight: 'bold', fontSize: 20, padding: 5 }}>{t('filter.display_type').toString()}</Text>
                {props.filterList.DisplayTypeList && props.filterList.DisplayTypeList.length > 0 && props.filterList.DisplayTypeList.map((type, index) => (
                    <CheckBox
                        key={type + index}
                        title={type}
                        containerStyle={styles.customCheckbox}
                        checked={filter.DisplayType.includes(type)}
                        onIconPress={() => {
                            toggleDisplayType(type)
                        }} />
                ))}
            </View>
            <View style={styles.checkBoxView}>
                <Text style={{ fontWeight: 'bold', fontSize: 20, padding: 5 }}>{t('filter.cpu_type').toString()}</Text>
                {props.filterList.CPUTypeList && props.filterList.CPUTypeList.length > 0 && props.filterList.CPUTypeList.map((type, index) => (
                    <CheckBox
                        key={type + index}
                        title={type}
                        containerStyle={styles.customCheckbox}
                        checked={filter.CPUType.includes(type)}
                        onIconPress={() => {
                            toggleProcessorType(type)
                        }} />
                ))}
            </View>
            {
                props.filterList.CPUNumOfCorseList && props.filterList.CPUNumOfCorseList.length > 0 &&
                <View style={styles.checkBoxView}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, padding: 5 }}>{t('filter.core_count').toString()}</Text>
                    {props.filterList.CPUNumOfCorseList && props.filterList.CPUNumOfCorseList.length > 0 && props.filterList.CPUNumOfCorseList.map((cores, index) => (
                        <CheckBox
                            key={cores + index}
                            title={cores}
                            containerStyle={styles.customCheckbox}
                            checked={filter.CPUNumOfCorse.includes(cores)}
                            onIconPress={() => {
                                toggleNumberOfCores(cores)
                            }} />
                    ))}
                </View>
            }

            <View style={styles.checkBoxView}>
                <Text style={{ fontWeight: 'bold', fontSize: 20, padding: 5 }}>{t('filter.ram_size').toString()}</Text>
                {props.filterList.RAMCapacityList && props.filterList.RAMCapacityList.length > 0 && props.filterList.RAMCapacityList.map((ram, index) => (
                    <CheckBox
                        key={ram + index}
                        title={ram+" GB"}
                        containerStyle={styles.customCheckbox}
                        checked={filter.RAMCapacityList.includes(ram)}
                        onIconPress={() => {
                            toggleRamCapacity(ram)
                        }} />
                ))}
            </View>
            <View style={styles.checkBoxView}>
                <Text style={{ fontWeight: 'bold', fontSize: 20, padding: 5 }}>{t('filter.memory_size').toString()}</Text>
                {props.filterList.StorageCapacityList && props.filterList.StorageCapacityList.length > 0 && props.filterList.StorageCapacityList.map((storage, index) => (
                    <CheckBox
                        key={storage + index}
                        title={storage+" GB"}
                        containerStyle={styles.customCheckbox}
                        checked={filter.StorageCapacity.includes(storage)}
                        onIconPress={() => {
                            toggleMemoryCapacity(storage)
                        }} />
                ))}
            </View>
            <View style={styles.checkBoxView}>
                <Text style={{ fontWeight: 'bold', fontSize: 20, padding: 5 }}>{t('filter.color').toString()}</Text>
                {props.filterList.ColorList && props.filterList.ColorList.length > 0 && props.filterList.ColorList.map((color, index) => (
                    <CheckBox
                        key={color + index}
                        title={color}
                        containerStyle={styles.customCheckbox}
                        checked={filter.Color.includes(color)}
                        onIconPress={() => {
                            toggleColor(color)
                        }} />
                ))}
            </View>
            
        </ScrollView>
            <View style={{ flexDirection:"column"}}>
            <Button
                buttonStyle={{
                    backgroundColor: '#308ad9',
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 30,
                    paddingLeft:10,
                    paddingRight:10,
                }}
                icon={
                    <Icon
                        name="pencil"
                        type="font-awesome"
                        color="white"
                        size={25}
                        iconStyle={{ marginRight: 10 }}
                    />
                }
                title={t('filter.apply').toString()}
                onPress={() => { props.handlerSetFilter(filter) }}
            />
                <Button
                buttonStyle={{
                    backgroundColor: '#e77373',
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 30,
                    paddingLeft:10,
                    paddingRight:10,
                }}
                icon={
                    <Icon
                        name="close"
                        type="font-awesome"
                        color="white"
                        size={25}
                        iconStyle={{ marginRight: 10 }}
                    />
                }
                title={t('filter.clear').toString()}
                onPress={() => { 
                    let newFilter:Filter = {
                        DeviceCategoryId: filter.DeviceCategoryId,
                        Vendors: [],
                        OS: [],
                        DisplaySize: [],
                        DisplayType: [],
                        CPUType: [],
                        CPUNumOfCorse: [],
                        StorageCapacity: [],
                        Color: [],
                        Property: [],
                        MinPrice: props.filterList.MinPrice.toString(),
                        MaxPrice: props.filterList.MaxPrice.toString(),
                        Region: '',
                        Sorting: filter.Sorting,
                        Page: 1,
                        ItNew: undefined,
                        ItList: false,
                        ReqNum: 1,
                        RAMCapacityList: []
                    };
                    setFilter(newFilter);
                    props.handlerSetFilter(newFilter)
                 }}
            />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    filterBlock: {
        flex: 1,
    },
    inputConteinerPrice: {
        flex: 1,
    },
    inputPrice: {
        flex: 1,
        flexShrink: 1,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 5,
        padding: 5,
    },
    inputPriceLabel: {
        textAlign: 'center',
    },
    dropdownItem: {
        fontSize: 25,
    },
    filterButton: {
        flex: 1,
        padding: 5,
        color: '#fff',
    },
    filterButtonText: {
        fontSize: 18,
        flex: 1
    },
    checkBoxView: {
        flex: 1,
    },
    customCheckbox: {
        flex: 1,
        margin: 0,
        marginBottom: -8
    },
});



