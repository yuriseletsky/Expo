import { CompareData, Filter, FilterList, LaptopsSpec, ProductSearch, ProductSearchResult, ProductType, SmartphonesSpec, SpecsByProduct, TabletSpec } from "../components/TypeModels";
import axios from 'axios';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Platform,
    View,
    ActivityIndicator,
    TouchableOpacity,
    FlatList,
    Keyboard,
} from 'react-native';
import { getToken } from '../components/Storage/Token';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerAsset } from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import LogServices from "./LogServices";
export interface ICatalogData {
    products: ProductType[],
    totalCount: number,
}
let tokenForTechSpec: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImN1c19PUnFMOG1pYzNOejg1bCIsIm1vZXNpZlByaWNpbmdJZCI6InByaWNlXzFNUXF5dkJESWxQbVVQcE1NNWc2RmVvbyIsImlhdCI6MTY5MjAwMzczN30.Jj8o_3ZHHPEGDjO9IO2_F_GdVxj3V5GCUdnwtbrGqzk";

export default class CatalogServices {

    static async GetCurrencyRates(): Promise<[]> {
        const token: string = await getToken();

        let result = axios({
            method: 'get',
            url: `https://ltop.shop/Home/GetCurrencyRates`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        }).then(response => {
            console.log('=================GetCurrencyRates===================-', response.data);
            let dataObj = response.data;
            return dataObj;
        }).catch(function (error) {
            console.log("GetCurrencyRates", error);
            return [];
        });
        return result;
    };

    static async getCatalogData(filter: Filter): Promise<ICatalogData> {
        const token: string = await getToken();

        let result = axios({
            method: 'post',
            url: `https://ltop.shop/Product/FilteResultMobile`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            data: JSON.stringify(filter),
        }).then(response => {
            let dataObj = JSON.parse(response.data);
            let catalogData: ICatalogData = {
                products: dataObj.ResultList,
                totalCount: dataObj.TotalCount
            };
            catalogData.products.forEach(item => {
                item.CustomDeviceCategory = parseInt(filter.DeviceCategoryId);
            })
            console.log('================getCatalogData FilteResultMobile====================');
            console.log(catalogData);
            console.log('====================================');
            return catalogData;
        }).catch(function (error) {
            console.log("getCatalogData", error);
            return {} as ICatalogData;
        });
        return result;
    };
    static async getCompare(categoryId: string, productsIds: number[]): Promise<CompareData> {
        const token: string = await getToken();

        let result = axios({
            method: 'post',
            url: `https://ltop.shop/Product/CompareResult?DevCatId=${categoryId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            data: JSON.stringify(productsIds),
        }).then(response => {
            let resultData: CompareData;
            let dataObj = JSON.parse(response.data);
            let list: ProductType[] = (dataObj.Adverts as []).map(item => {
                let newItem: ProductType = item;
                console.log("item[PhotosItem] = ", item["PhotosItem"]);

                return { ...newItem, PhotosItem: item["PhotosItem"] != null ? [{ ID: item["PhotosItem"]["ID"], PhotoStr: item["PhotosItem"]["PhotoStr"] }] : [] }
            })
            let spec: any;
            switch (categoryId) {
                case "1":
                    spec = dataObj.Tablets;
                    break;
                case "2":
                    spec = dataObj.Laptops;
                    break;
                case "3":
                    spec = dataObj.Smartphones;
                    break;
            }
            list.forEach(item => {
                item.CustomDeviceCategory = parseInt(categoryId);
            })
            resultData = { products: list, specs: spec };
            return resultData;
        }).catch(function (error) {
            console.log("getCompare ", error);
            return {} as CompareData;
        });
        return result;
    }
    static async getFilterData(categoryId: string): Promise<FilterList | boolean> {
        const token: string = await getToken();
        let result = axios({
            method: 'post',
            url: `https://ltop.shop/Product/GetFilterDataList?DevCatId=${categoryId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        }).then(response => {
            let list: FilterList = JSON.parse(response.data);
            console.log('================getFilterData====================');
            console.log(list);
            console.log('====================================');
            return list;
        }).catch(function (error) {
            console.log("getFilterData", error);
            return false;
        });
        return result;
    }
    static async getSearchData(searchString: string, page: number = 1): Promise<{ items: ProductType[], totalResult: number }> {
        const token: string = await getToken();
        let result = axios({
            method: 'get',
            url: `https://ltop.shop/Product/SearchMobile?q=${searchString}&page=${page}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        }).then(async response => {
            let list: ProductType[] = [];
            if (response.data.adverts && response.data.adverts.length > 0) {
                list = (response.data.adverts as any[]).map(item => {
                    let photos: Array<{ ID: string, PhotoStr: string }> = [];
                    if (item.photosItem) {
                        photos = [{ ID: item.photosItem.id, PhotoStr: item.photosItem.photoStr }]
                    }
                    let product: ProductType = {
                        ID: item.id,
                        Author: item.author ? item.author : "",
                        AuthorGuid: item.authorGuid,
                        Description: item.description ? item.description : "",
                        DevCatId: 0,
                        IsFavorite: false,
                        Name: item.name,
                        PhotosItem: photos,
                        Price: item.price,
                        Valuta: item.valuta,
                        CustomDeviceCategory: 0
                    }
                    return product;
                })
            }

            console.log('==================getSearchData==================');
            console.log(response.data);

            return { items: list, totalResult: response.data.totalResultItem };
        }).catch(function (error) {
            console.log("getSearchData", error);
            LogServices.Log("getSearchData " + error, "error")
            return { items: [], totalResult: 0 };
        });

        return result;
    }

    static async GetRecently(count: number = 10): Promise<ProductType[] | string> {
        const token: string = await getToken();
        let result = axios({
            method: 'get',
            url: `https://ltop.shop/Home/GetLastAdvertList?count=${count}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        }).then(async response => {
            let list: ProductType[] = response.data;
            const dataTablet = await AsyncStorage.getItem(`@compareDeviceID_1`);
            const dataLaptop = await AsyncStorage.getItem(`@compareDeviceID_2`);
            const dataSmartphone = await AsyncStorage.getItem(`@compareDeviceID_3`);
            console.log('====================================');
            console.log("dataTablet ", dataTablet);
            console.log("dataLaptop ", dataLaptop);
            console.log("dataSmartphone ", dataSmartphone);
            console.log('====================================');

            list.forEach(item => {
                switch (item.DevCatId) {
                    case 1:
                        let compareListTablet: Array<number> = [];
                        if (dataTablet != null) {
                            compareListTablet = JSON.parse(dataTablet);
                        }
                        compareListTablet.forEach(id => {
                            list.filter(item => item.ID == id).forEach(item => item.isCompare = true)
                        });
                        break;
                    case 2:
                        let compareListLaptop: Array<number> = [];
                        if (dataLaptop != null) {
                            compareListLaptop = JSON.parse(dataLaptop);
                        }
                        compareListLaptop.forEach(id => {
                            list.filter(item => item.ID == id).forEach(item => item.isCompare = true)
                        });
                        break;
                    case 3:
                        let compareListSmartphone: Array<number> = [];
                        if (dataSmartphone != null) {
                            compareListSmartphone = JSON.parse(dataSmartphone);
                        }
                        compareListSmartphone.forEach(id => {
                            list.filter(item => item.ID == id).forEach(item => item.isCompare = true)
                        });
                        break;
                    default:
                        break;
                }
            })
            list.forEach(item => {
                item.CustomDeviceCategory = item.DevCatId;
            })
            console.log('===============list=====================');
            console.log(list);

            return list;
        }).catch(function (error) {
            console.log("GetRecently", error);
            return "error";
        });

        return result;
    }

    static async AddFavorite(id: number) {
        console.log("AddFavorite: ", id);
        const token: string = await getToken();
        axios({
            method: 'get',
            url: `https://ltop.shop/MyOffice/AddFavorite/${id}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },

        }).then(response => {
            console.log("AddFavorite success", response);

        }).catch(function (error) {
            console.log("AddFavorite CatalogServices", error);
        });
    }
    static async RemoveFavorite(id: number) {
        console.log("RemoveFavorite: ", id);
        const token: string = await getToken();
        axios({
            method: 'get',
            url: `https://ltop.shop/MyOffice/RemoveFavorite/${id}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        }).then(response => {
            console.log(response);

        }).catch(function (error) {
            console.log("RemoveFavorite", error);
            return {} as ProductType[];
        });
    }

    static async GetModelByName(name: string, category: string): Promise<ProductSearchResult[]> {
        console.log("GetModelByName name category", name + " " + category);
        var myHeaders = new Headers();

        myHeaders.append("Authorization", `Bearer ${tokenForTechSpec}`)
        var formdata = new FormData();
        formdata.append("category", category);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
        };

        return fetch(`https://api.techspecs.io/v4/product/search?query=${name}`, requestOptions)
            .then(response => response.json())
            .then(response => {
                console.log("response GetModelByName", response.data.items.length);
                let items = response.data.items as ProductSearchResult[];
                if (items) {
                    let idMap: Map<string, ProductSearchResult> = new Map<string, ProductSearchResult>();
                    const filteredList = items.filter(item => {
                        if (!idMap.get(item.product.model)) {
                            idMap.set(item.product.model, item);
                            return true;
                        }
                        return false
                    });
                    items = filteredList;
                }
                console.log("response GetModelByName uniq", items.length);

                return items;
            }).catch(function (error) {
                console.log("CatalogServices GetModelByName", error);
                return {} as ProductSearchResult[];
            });


    }

    static async GetSpecsByProductID(productId: string, categoryId?: number): Promise<SpecsByProduct> {
        const token: string = await getToken();
        return axios({
            method: 'get',
            url: `https://api.techspecs.io/v4/product/detail?productId=${productId}`,
            headers: {
                'Authorization': `Bearer ${tokenForTechSpec}`
            },
        }).then(response => {
            let specs: SpecsByProduct = response.data.data.items[0];
            return specs;
        }).catch(function (error) {
            console.warn("GetSpecsByProductID", error);
            console.warn("productId", productId);
            return {} as SpecsByProduct;
        });
    }

    static async GetAllBrands(category: string): Promise<any> {
        const token: string = await getToken();
        return axios({
            method: 'get',
            url: `https://api.techspecs.io/v4/all/brands?category=${category}`,
            headers: {
                'Authorization': `Bearer ${tokenForTechSpec}`
            },
        }).then(response => {
            let arrBrand: Array<any> = response.data.data.items;
            let items = arrBrand.map((item, index) => {
                return { id: index, name: item.brand }
            })
            return items;
        }).catch(function (error) {
            console.warn("GetSpecsByProductID", error);
            return {} as SpecsByProduct;
        });
    }
    static async GetAllProducts(category: string, brand: string): Promise<any> {
        const token: string = await getToken();
        return axios({
            method: 'get',
            url: `https://api.techspecs.io/v4/all/brands?category=${category}`,
            headers: {
                'Authorization': `Bearer ${tokenForTechSpec}`
            },
        }).then(response => {
            let arrBrand: Array<any> = response.data.data.items;
            let items = arrBrand.map((item, index) => {
                return { id: index, name: item.brand }
            })
            return items;
        }).catch(function (error) {
            console.warn("GetSpecsByProductID", error);
            return {} as SpecsByProduct;
        });
    }

    static async UploadFile(image: ImagePickerAsset): Promise<string> {
        const token: string = await getToken();

        let uri = image.uri;
        let type = image.type;
        const formData = new FormData();
        formData.append('file', { uri, name: 'media', type: `image/${type}` } as any);
        return axios({
            method: 'post',
            url: `https://ltop.shop/Declaration/FileUploadMobile`,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            },
            transformRequest: (data, headers) => {
                return formData;
            },
        }).then(result => {
            console.log('=================FileUploadMobile===================');
            console.log(result);

            return result.data;
        })
            .catch((response) => {
                console.log(response.status, response.statusText);
                response.json().then((json: any) => {
                })
            });
    }

    static async GetExistPhoto(): Promise<{ ID: number, PhotoStr: string }[]> {
        const token: string = await getToken();

        let config = {
            method: 'get',
            url: 'https://ltop.shop/Declaration/GetExistPhoto',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };

        return axios.request(config)
            .then((response) => {
                console.log("GetExistPhoto");
                console.log(response.data);
                return response.data;
            })
            .catch((error) => {
                console.log("GetExistPhoto", error);
            });

    };

    static async DeleteImage(id: number): Promise<boolean> {
        const token: string = await getToken();
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        let data = new FormData();
        data.append('id', id.toString());
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: data,
        };

        return fetch(`https://ltop.shop/Declaration/DeleteDevicePhotoAsync/${id}`, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(`delete imgID ${id} = ${result}`);
                return true;
            })
            .catch(error => {
                console.log("UpdateDeclarationUser err", error);
                return false;
            });
    }



}

