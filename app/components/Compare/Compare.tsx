import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { createRef, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CompareData, LaptopSpecUniq, LaptopsSpec, ProductType, SmartphonesSpec, SmartphonesSpecUniq, TabletSpec, TabletSpecUniq } from '../TypeModels';
import CatalogServices from '../../services/CatalogServices';
import { Picker } from '@react-native-picker/picker';
import { CompareSmartphones } from './CompareSmartphones';
import { CompareLaptops } from './CompareLaptops';
import { CompareTablets } from './CompareTablets';
import { Button } from '@rneui/themed';
import { CompareHeaderComponent } from './CompareHeaderComponent';
import { getDefaultSmartUniq, getDefaultLaptopUniq, getDefaultTabletUniq, getDiffSmartphones, getDiffLaptop, getDiffTablet } from './CompareFunctions';
import { t } from 'i18next';

export function Compare(): JSX.Element {
  const navigation = useNavigation();

  const [compareListID, setCompareList] = useState<Array<number>>([]);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categoryId, setCategoryId] = useState<string>("1");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [compareOnlyDifferents, setCompareOnlyDifferents] = useState<boolean>(false);
  const [smartphonesSpec, setSmartphonesSpec] = useState<Array<SmartphonesSpec>>([]);
  const [laptopsSpec, setLaptopsSpec] = useState<Array<LaptopsSpec>>([]);
  const [tabletSpec, setTabletSpec] = useState<Array<TabletSpec>>([]);

  const [smartphonesSpecUniq, setTSmartphonesSpecUniq] = useState<SmartphonesSpecUniq>(getDefaultSmartUniq(false));
  const [laptopSpecUniq, setLaptopSpecUniq] = useState<LaptopSpecUniq>(getDefaultLaptopUniq(false));
  const [tabletSpecUniq, setTabletSpecUniq] = useState<TabletSpecUniq>(getDefaultTabletUniq(false));

  const headerFlatListRef = createRef<FlatList>();
  const specFlatListRef = createRef<FlatList>();
  const [isScrollHeader, setIsScrollHeader] = useState<boolean>(false);
  const [isScrollSpecs, setIsScrollSpecs] = useState<boolean>(false);

  const isFocused = useIsFocused();
  const loadComparesId = async () => {
    const data = await AsyncStorage.getItem(`@compareDeviceID_${categoryId}`);
    let compareList: Array<number> = [];
    if (data != null) {
      compareList = JSON.parse(data);
    }
    setCompareList(compareList);
  }
  useEffect(() => {
    loadComparesId()
  }, [isFocused, categoryId]);

  const loadCompares = async () => {
    if (compareListID.length > 0) {
      let catalogData: CompareData = await CatalogServices.getCompare(categoryId, compareListID);
      await setProducts(catalogData.products);
      switch (categoryId) {
        case "1":
          await setTabletSpec(catalogData.specs);
          break;
        case "2":
          await setLaptopsSpec(catalogData.specs);
          break;
        case "3":
          await setSmartphonesSpec(catalogData.specs);
          break;
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    setProducts([]);
    setIsLoading(true)
    loadCompares();
  }, [compareListID]);

  useEffect(() => {
    if (!compareOnlyDifferents) {
      setTSmartphonesSpecUniq(getDefaultSmartUniq(false))
      setTabletSpecUniq(getDefaultTabletUniq(false))
      setLaptopSpecUniq(getDefaultLaptopUniq(false))
    } else {
      console.log("compareOnlyDifferents");

      switch (categoryId) {
        case "1":
          let newDataUniq: TabletSpecUniq = getDiffTablet(tabletSpec)
          setTabletSpecUniq(newDataUniq);
          break;
        case "2":
          let newDataUniq2: LaptopSpecUniq = getDiffLaptop(laptopsSpec)
          setLaptopSpecUniq(newDataUniq2);
          break;
        case "3":
          let newDataUniq3: SmartphonesSpecUniq = getDiffSmartphones(smartphonesSpec)
          setTSmartphonesSpecUniq(newDataUniq3);
          break;
      }

    }

  }, [compareOnlyDifferents]);


  return (
    <View style={{marginTop:10}}>
      <View style={styles.containerRow}>
        <Picker
          itemStyle={styles.dropdownItem}
          style={styles.dropdown}
          selectedValue={categoryId}
          onValueChange={(itemValue, itemIndex) => {
            setIsLoading(true)
            setProducts([]);
            setCategoryId(itemValue);
          }
          }>
          <Picker.Item label={t('catalog.category.tablets').toString()} value="1" />
          <Picker.Item label={t('catalog.category.laptop').toString()} value="2" />
          <Picker.Item label={t('catalog.category.smartphones').toString()} value="3" />
        </Picker>
        {compareOnlyDifferents && <Button
          title={t('compare.all_specs').toString()}
          loading={false}
          loadingProps={{ size: 'small', color: 'white' }}
          buttonStyle={{
            backgroundColor: '#308ad9',
            borderRadius: 5,
          }}
          titleStyle={{ fontSize: 14 }}
          containerStyle={{
            flex: 1,
            height: 40,
            marginVertical: 30,
            marginLeft: 10,
            marginRight: 10,
          }}
          onPress={() => {
            setCompareOnlyDifferents(false);
          }}
        />}
        {!compareOnlyDifferents && <Button
          title={t('compare.only_different').toString()}
          loading={false}
          loadingProps={{ size: 'small', color: 'white' }}
          buttonStyle={{
            backgroundColor: '#308ad9',
            borderRadius: 5,
          }}
          titleStyle={{ fontSize: 14 }}
          containerStyle={{
            flex: 1,
            height: 40,
            marginVertical: 30,
            marginLeft: 10,
            marginRight: 10,
          }}
          onPress={() => {
            console.log("setCompareOnlyDifferents");

            setCompareOnlyDifferents(true)
          }}
        />}
      </View>
      {isLoading &&
        <View style={styles.loader}>
          <Text style={styles.text}><ActivityIndicator size="large" color={"#308ad9"} /></Text>
        </View>
      }
      {(compareListID.length == 0 && !isLoading) &&
        <>
          <Text style={{ fontSize: 25, textAlign: "center" }}>{t('compare.no_ads').toString()}</Text>
        </>
      }
      {!isLoading &&
        <FlatList
          style={{}}
          showsHorizontalScrollIndicator={false}
          ref={headerFlatListRef}
          data={products}
          horizontal={true}
          onScroll={(event) => {
          }}
          renderItem={({ item }) => <CompareHeaderComponent product={item} handlerDelete={loadComparesId} />}
        />
      }

      <ScrollView style={{}}>
        {(categoryId == '1' && !isLoading) &&
          <FlatList
            style={{}}
            ref={specFlatListRef}
            data={products}
            horizontal={true}
            onScroll={(event) => {
              if (!isScrollHeader) {
                setIsScrollSpecs(true);
                (async (x, current) => {
                  current?.scrollToOffset({ offset: x, animated: false });
                })(event.nativeEvent.contentOffset.x, headerFlatListRef.current)
                setIsScrollSpecs(false);
              }
            }}
            renderItem={({ item, index }) => <CompareTablets key={item.ID} product={item} spec={tabletSpec[index]} uniq={tabletSpecUniq} />}
          />}
        {(categoryId == '2' && !isLoading) &&
          <FlatList
            data={products}
            horizontal={true}
            onScroll={(event) => {
              if (!isScrollHeader) {
                setIsScrollSpecs(true);
                (async (x, current) => {
                  current?.scrollToOffset({ offset: x, animated: false });
                })(event.nativeEvent.contentOffset.x, headerFlatListRef.current)
                setIsScrollSpecs(false);
              }
            }}
            renderItem={({ item, index }) => <CompareLaptops key={item.ID} product={item} spec={laptopsSpec[index]} uniq={laptopSpecUniq} />}
          />}
        {(categoryId == '3' && !isLoading) &&
          <FlatList
            data={products}
            horizontal={true}
            onScroll={(event) => {
              if (!isScrollHeader) {
                setIsScrollSpecs(true);
                (async (x, current) => {
                  current?.scrollToOffset({ offset: x, animated: false });
                })(event.nativeEvent.contentOffset.x, headerFlatListRef.current)
                setIsScrollSpecs(false);
              }
            }}
            renderItem={({ item, index }) => <CompareSmartphones key={item.ID} product={item} spec={smartphonesSpec[index]} uniq={smartphonesSpecUniq} />}
          />}
      </ScrollView>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingLeft: 5,
    paddingRight: 5,
  },
  containerRow: {
    flexDirection: "row",
    height: 70
  },
  compareList: {
    // flex: 1,
    // flexDirection: "column",

  },
  dropdown: {
    marginTop: 20,
    flex: 1,
    // backgroundColor: "#308ad9",
    fontSize: 18,
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 1,
    padding: 0,
    height: 30
  },
  dropdownItem: {
    flex: 1,
    color: "white",
    padding: 0,
    borderRadius: 5,
    fontWeight: 'bold',

  },
  loader: {
    textAlign: "center",
    padding: 10,
  },
  text: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 200,
  },
});

