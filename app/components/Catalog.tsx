import React, { Component, useEffect, useState, useRef } from "react";
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
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { Product } from "./Product";
import { Filter, FilterList, ProductType } from "./TypeModels";
import { createStackNavigator } from "@react-navigation/stack";
import { ProductDetails } from "./ProductDetals";
import { Picker } from "@react-native-picker/picker";
import CatalogServices from "../services/CatalogServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { Button, CheckBox, Icon, Overlay } from "@rneui/themed";
import { FilterSidebar } from "./FilterSidebar";
import { useTranslation } from "react-i18next";
import { styles } from "./styles";
import { StatusBar } from "expo-status-bar";

export function Catalog(): JSX.Element {
  const { t } = useTranslation();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filterList, setFilterList] = useState<FilterList>({
    CPUNumOfCorseList: [],
    CPUTypeList: [],
    ColorList: [],
    DisplaySize: [],
    DisplayTypeList: [],
    MaxPrice: 0,
    MinPrice: 0,
    OSList: [],
    PropertiesList: [],
    RAMCapacityList: [],
    StorageCapacityList: [],
    VendorsList: [],
  });
  const [filter, setFilter] = useState<Filter>({
    DeviceCategoryId: "3",
    Vendors: [],
    OS: [],
    DisplaySize: [],
    DisplayType: [],
    CPUType: [],
    CPUNumOfCorse: [],
    StorageCapacity: [],
    Color: [],
    Property: [],
    MinPrice: "0",
    MaxPrice: "0",
    Region: "",
    Sorting: "NewOld",
    Page: 1,
    ItNew: undefined,
    ItList: false,
    ReqNum: 1,
    RAMCapacityList: [],
  });
  const [viewSorting, setViewSorting] = useState<string>(
    t("catalog.sorting.new_to_old").toString()
  );

  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isShowFilters, setIsShowFilters] = useState<boolean>(false);

  const isFocused = useIsFocused();
  const productsListRef = useRef<FlatList>(null);

  const [rates, setRates] = useState<{ [key: string]: number }>({});
  const [valuta, setValuta] = useState<string>("UAH");
  const [isChange, setIsChange] = useState<boolean>(false);

  const loadProducts = async (myFilter: Filter) => {
    console.log("==================loadProducts==================");
    await loadCurrency();
    await loadFilters();
    let catalogData = await CatalogServices.getCatalogData(myFilter);
    let newProducts = catalogData.products;
    const data = await AsyncStorage.getItem(
      `@compareDeviceID_${filter.DeviceCategoryId}`
    );
    let compareList: Array<number> = [];
    if (data != null) {
      compareList = JSON.parse(data);
    }
    compareList.forEach((id) => {
      newProducts
        .filter((item) => item.ID == id)
        .forEach((item) => (item.isCompare = true));
    });
    await setProducts(newProducts);
    await setTotalCount(catalogData.totalCount);
    setIsLoading(false);
  };
  const loadFilters = async (): Promise<boolean> => {
    let filtersData = await CatalogServices.getFilterData(
      filter.DeviceCategoryId
    );
    console.log("filtersData123");
    if (filtersData != false) {
      let filters = filtersData as FilterList;

      setFilterList(filters);
      //   setFilter({
      //     ...filter,
      //     MinPrice: filters.MinPrice.toString(),
      //     MaxPrice: filters.MaxPrice.toString(),
      //   });
      return true;
    } else {
      return false;
    }
  };

  const loadNext = async () => {
    await setFilter({ ...filter, Page: filter.Page + 1 });
    let catalogData = await CatalogServices.getCatalogData(filter);
    let newProducts = catalogData.products;
    const data = await AsyncStorage.getItem(
      `@compareDeviceID_${filter.DeviceCategoryId}`
    );
    let compareList: Array<number> = [];
    if (data != null) {
      compareList = JSON.parse(data);
    }
    compareList.forEach((id) => {
      newProducts
        .filter((item) => item.ID == id)
        .forEach((item) => (item.isCompare = true));
    });
    await setProducts([...products, ...newProducts]);
    // setIsLoading(false);
  };
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
      rates.forEach((item: { ValutaType: string; Rate: number }) => {
        rateObj[item.ValutaType] = item.Rate;
      });
      setRates(rateObj);
      await AsyncStorage.setItem(`@rates`, JSON.stringify(rateObj));
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setProducts([]);
    loadProducts(filter);
    productsListRef.current?.scrollToOffset({ animated: false, offset: 0 });
  }, [filter.DeviceCategoryId, filter.Sorting]);

  useEffect(() => {
    console.log("=================useEffect newValuta===================");
    setIsLoading(true);

    (async () => {
      const newValuta = await AsyncStorage.getItem(`@valuta`);
      if (newValuta && valuta != newValuta) {
        await setProducts([]);
        await loadProducts(filter);
      }
      if (products.length == 0) {
        setIsLoading(true);
        await setFilter({ ...filter, Page: 1 });
        loadProducts(filter);
        loadFilters();
        productsListRef.current?.scrollToOffset({ animated: false, offset: 0 });
      }
      switch (filter.Sorting) {
        case "NewOld":
          setViewSorting(t("catalog.sorting.new_to_old").toString());
          break;
        case "MinMax":
          setViewSorting(t("catalog.sorting.first_cheap").toString());
          break;
        case "MaxMin":
          setViewSorting(t("catalog.sorting.first_expensive").toString());
          break;
        case "AtZ":
          setViewSorting(t("catalog.sorting.a_z").toString());
          break;
        case "ZtA":
          setViewSorting(t("catalog.sorting.z_a").toString());
          break;
        case "MaxPop":
          setViewSorting(t("catalog.sorting.popular").toString());
          break;
      }
      setIsLoading(false);
    })();
  }, [isFocused]);

  const handleLoadMore = async () => {
    console.log("handleLoadMore");
    if (!isLoading) {
      if (products.length < totalCount) {
        await setIsLoading(true);
        await loadNext();
      }
    }
  };

  const toggleOverlay = () => {
    setIsShowFilters(!isShowFilters);
  };
  const applyFilters = async (newFilter: Filter) => {
    setIsLoading(true);
    setProducts([]);
    toggleOverlay();
    console.log("applyFilters");
    console.log(newFilter);
    await setFilter(newFilter);
    console.log("filter");
    console.log(filter);
    console.log(newFilter);
    loadProducts(newFilter);
  };
  return (
    <View style={styles.container}>
      <Picker
        placeholder={t("catalog.category.place_holder").toString()}
        style={styles.categoryRow}
        selectedValue={filter.DeviceCategoryId}
        onValueChange={(itemValue, itemIndex) => {
          setFilter({ ...filter, DeviceCategoryId: itemValue, Page: 1 });
        }}
      >
        <Picker.Item
          style={styles.dropdownItem}
          label={t("catalog.category.tablets").toString()}
          value="1"
        />
        <Picker.Item
          style={styles.dropdownItem}
          label={t("catalog.category.laptop").toString()}
          value="2"
        />
        <Picker.Item
          style={styles.dropdownItem}
          label={t("catalog.category.smartphones").toString()}
          value="3"
        />
      </Picker>
      <View style={styles.containerRow}>
        <View style={styles.dropdown}>
          <Text
            style={{
              fontSize: 16,
              position: "absolute",
              zIndex: 2,
              padding: 2,
              top: 13,
              left: 14,
              backgroundColor: "#F2F2F2",
              width: "70%",
            }}
            numberOfLines={1}
          >
            {viewSorting}
          </Text>
          <Picker
            placeholder={t("catalog.sorting.place_holder").toString()}
            selectedValue={filter.Sorting}
            onValueChange={(itemValue, itemIndex) => {
              console.log("itemValue");

              setFilter({ ...filter, Sorting: itemValue, Page: 1 });
              switch (itemValue) {
                case "NewOld":
                  setViewSorting(t("catalog.sorting.new_to_old").toString());
                  break;
                case "MinMax":
                  setViewSorting(t("catalog.sorting.first_cheap").toString());
                  break;
                case "MaxMin":
                  setViewSorting(
                    t("catalog.sorting.first_expensive").toString()
                  );
                  break;
                case "AtZ":
                  setViewSorting(t("catalog.sorting.a_z").toString());
                  break;
                case "ZtA":
                  setViewSorting(t("catalog.sorting.z_a").toString());
                  break;
                case "MaxPop":
                  setViewSorting(t("catalog.sorting.popular").toString());
                  break;
              }
            }}
          >
            <Picker.Item
              label={t("catalog.sorting_long.new_to_old").toString()}
              value="NewOld"
            />
            <Picker.Item
              label={t("catalog.sorting_long.first_cheap").toString()}
              value="MinMax"
            />
            <Picker.Item
              label={t("catalog.sorting_long.first_expensive").toString()}
              value="MaxMin"
            />
            <Picker.Item
              label={t("catalog.sorting_long.a_z").toString()}
              value="AtZ"
            />
            <Picker.Item
              label={t("catalog.sorting_long.z_a").toString()}
              value="ZtA"
            />
            <Picker.Item
              label={t("catalog.sorting_long.popular").toString()}
              value="MaxPop"
            />
          </Picker>
        </View>
        <View style={styles.filterButton}>
          <Button
            title={
              <>
                <Text style={styles.filterButtonText}>
                  {t("catalog.filter").toString()}{" "}
                </Text>
                <Icon name="filter" type="font-awesome" />
              </>
            }
            radius={"sm"}
            type="solid"
            buttonStyle={{ backgroundColor: "rgba(0, 0, 0, 0.0)" }}
            onMagicTap={toggleOverlay}
            onPress={toggleOverlay}
          ></Button>
        </View>
      </View>
      <Overlay
        animationType="fade"
        backdropStyle={styles.backdropStyle}
        overlayStyle={styles.overlayCustom}
        fullScreen={false}
        isVisible={isShowFilters}
        onBackdropPress={toggleOverlay}
      >
        <FilterSidebar
          filterList={{ ...filterList }}
          filter={filter}
          handlerSetFilter={applyFilters}
        />
      </Overlay>

      <View style={styles.productList}>
        {products.length == 0 && !isLoading && (
          <Text style={{ alignSelf: "center", fontSize: 20 }}>
            {t("catalog.no_found").toString()}
          </Text>
        )}
        {!isLoading && (
          <Text style={{ fontSize: 16, textAlign: "center", top: 1 }}>
            {t("search.total").toString() + totalCount}
          </Text>
        )}

        <FlatList
          ref={productsListRef}
          data={products}
          renderItem={({ item }) => (
            <Product
              key={item.ID}
              product={item}
              rates={rates}
              valuta={valuta}
            />
          )}
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
          ListFooterComponent={
            <View style={[styles.loader, { marginBottom: 20 }]}>
              {isLoading && (
                <Text style={styles.textLoading}>
                  {t("catalog.loading").toString()} <ActivityIndicator />
                </Text>
              )}
            </View>
          }
        />
      </View>
    </View>
  );
}
