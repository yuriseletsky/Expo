import Autocomplete from 'react-native-autocomplete-input';
import React, { useEffect, useState } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    SafeAreaView
} from 'react-native';
import { ProductSearchResult, ProductSearchResults } from '../TypeModels';
import CatalogServices from '../../services/CatalogServices';
import { SpecTable } from './SpecsTable';
import { t } from 'i18next';
import { Button } from '@rneui/themed';

type SelectDeviceProps = {
    deviceName: string;
};
export function filterResults(products: ProductSearchResults, query?: string): ProductSearchResults {
    if (!query || !products.length) {
        console.log("filterResults empty");

        return [];
    }
    const regex = new RegExp(`${query.trim()}`, 'i');

    // return products.filter((item) => {
    //     // console.log( item.product.model + item.product.version);

    //     return (item.product.model + item.product.version).search(regex) >= 0;
    // });
    // return products.filter((item) => { return item.product.model.search(regex) >= 0 || item.product.version.search(regex) >= 0});
    let result = products.filter((item) => {
        // console.log(item.product.model, " ", query);

        return item.product.model.search(regex) >= 0;
    });
    // console.log("products", products);
    // console.log("query", query);
    // console.log("result", result);

    return result;
}



function SelectDevice(props: SelectDeviceProps): React.ReactElement {
    const [allModels, setAllModels] = useState<ProductSearchResults>([]);
    const [query, setQuery] = useState(props.deviceName);
    const isLoading = !allModels.length;

    const queriedProducts = React.useMemo(
        () => filterResults(allModels, query),
        [allModels, query]
    );
    const GetModelsByName = (name: string, category: string) => {
        (async () => {
            let result: ProductSearchResult[] = await CatalogServices.GetModelByName(name, category);
            setTimeout(() => {
                console.log("GetModelsByName", name);
                setAllModels(result);
            }, 500)
        })()
    }

    const suggestions: ProductSearchResults = React.useMemo(
        () => {
            // if (queriedMovies[0] != undefined) {
            //     console.log("queriedMovies.length ", queriedMovies.length);
            //     console.log("queriedMovies ", queriedMovies[0].product.model.toLowerCase());
            //     console.log("query.toLowerCase() ", query.toLowerCase());
            // }


            return (
                queriedProducts.length === 1 && (queriedProducts[0].product.model.toLowerCase() === query.toLowerCase())
                    ? []
                    : queriedProducts
            );
        },
        [queriedProducts, query]
    );

    const placeholder = isLoading ? t('add.loading').toString() : t('add.enter_the_name_device').toString();
    useEffect(() => {
        GetModelsByName("Lenovo", "Tablets")
    }, [query]);


    return (
        <SafeAreaView style={styles.saveView}>
            <View style={styles.container}>
                <View style={styles.autocompleteContainer}>
                    <Autocomplete
                        editable={!isLoading}
                        autoCorrect={true}
                        data={suggestions}
                        value={query}
                        onChangeText={setQuery}
                        placeholder={placeholder}
                        inputContainerStyle={{ backgroundColor: "blue" }}//field 

                        flatListProps={{
                            keyboardShouldPersistTaps: 'always',
                            keyExtractor: (el: ProductSearchResult) => { return el.product.id },
                            renderItem: ({ item, index }) => (
                                <TouchableOpacity onPress={() => {
                                    setQuery(item.product.model);
                                    // item.product.

                                    console.log("setQuery", index);
                                }}>
                                    <Text style={[styles.itemText, { backgroundColor: (index % 2 == 0) ? "#f0f0f0" : "#fff" }]}>{item.product.model}</Text>
                                </TouchableOpacity>
                            ),
                        }}
                    />
                    {/* <Button onPress={() => {
                        console.log("Search");

                    }}>Search</Button> */}
                </View>

                <View style={styles.descriptionContainer}>
                    {queriedProducts.length && (queriedProducts[0].product.model == query) ? (
                        <SpecTable {...queriedProducts[0]} />
                    ) : (
                        <Text style={styles.infoText}>{t('add.device_not_selected').toString()}</Text>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    saveView: {
        // flex:1,
        height: 610,
    },
    container: {
        position: 'relative',
        flex: 1,
        // Android requiers padding to avoid overlapping
        // with content and autocomplete
        paddingTop: 50,
        ...Platform.select({
            android: {
                marginTop: 25,
            },
            default: {
                marginTop: 0,
            },
        }),
    },
    itemText: {
        fontSize: 20,
        margin: 2,
        padding: 5
    },
    descriptionContainer: {
        flex: 2,
        marginTop: 20,
    },
    infoText: {
        textAlign: 'center',
    },
    autocompleteContainer: {
        // Hack required to make the autocomplete
        // work on Andrdoid
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1,
        padding: 5,
    },
});

export default SelectDevice;
