import axios from "axios";
import { ProductType, Transaction, UserModel } from "../components/TypeModels";
import { getToken } from "../components/Storage/Token";
import { StorageAccessFramework } from 'expo-file-system';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useState } from "react";
import { ImagePickerAsset } from "expo-image-picker";
export default class UserServices {
    static async GetFullUser(): Promise<UserModel> {
        const token: string = await getToken();
        let result = axios({
            method: 'get',
            url: `https://ltop.shop/MyOffice/GetFullUser`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        }).then(response => {
            let user: UserModel = response.data;
            console.log("user", user);

            return user;
        }).catch(function (error) {
            console.log("GetFullUser", error);
            return {} as UserModel;
        });
        return result;
    };

    static async UpdateUser(user: UserModel): Promise<boolean> {
        const token: string = await getToken();
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var formdata = new FormData();
        formdata.append('Name', user.userName);
        formdata.append('Email', user.email);
        formdata.append('Phone', user.phoneNumber);
        formdata.append('Skype', user.skype);
        formdata.append('Facebook', user.facebook);
        formdata.append('Instagram', user.instagram);
        formdata.append('Description', user.description);
        formdata.append('Address', user.addres);

        var requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
            redirect: 'follow'
        };

        return fetch("https://ltop.shop/MyOffice/ProfileInfoUpdateMobile", requestOptions)
            .then(response => response.text())
            .then(result => { console.log(result); return true })
            .catch(error => { console.log('error', error); return false });

    };

    static async GetFavorites(sorting?: string): Promise<ProductType[]> {
        const token: string = await getToken();
        let urlParams = "";
        if (sorting) {
            urlParams = `?sort=${sorting}`;
        }
        console.log('===================urlParams=================');
        console.log(urlParams);
        let result = axios({
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://ltop.shop/MyOffice/MyFavoriteMobile' + urlParams,
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }).then(response => {
            console.log("GetFavorites response", response);

            let advertsList: [] = response.data.advertsList;
            if (advertsList == null || advertsList.length == 0) {
                return [];
            }
            let products: ProductType[] = advertsList.map(item => {
                return {
                    ID: item["id"],
                    Author: item["author"],
                    AuthorGuid: item["authorGuid"],
                    Description: item["description"],
                    DevCatId: item["devCatId"],
                    IsFavorite: true || item["isFavorite"],
                    Name: item["name"],
                    PhotosItem: (item["photosItem"] as []).map(image => {
                        return {
                            ID: image["id"],
                            PhotoStr: image["photoStr"]
                        }
                    }),
                    Price: item["price"],
                    Valuta: item["valuta"],
                    isCompare: false,
                    CustomDeviceCategory: item["devCatId"],
                }
            });
            return products;
        }).catch(function (error) {
            console.log("GetFavorites", error);
            return {} as ProductType[];
        });
        return result;
    };

    static async GetMyAdvetrs(): Promise<ProductType[]> {
        const token: string = await getToken();
        let result = axios({
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://ltop.shop/MyOffice/MyAdvertsMobile',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }).then(response => {
            let advertsList: [] = response.data.advertsList;
            let products: ProductType[] = advertsList.map(item => {
                return {
                    ID: item["id"],
                    Author: item["author"],
                    AuthorGuid: item["authorGuid"],
                    Description: item["description"],
                    DevCatId: item["devCatId"],
                    IsFavorite: item["isFavorite"],
                    Name: item["name"],
                    PhotosItem: (item["photosItem"] as []).map(image => {
                        return {
                            ID: image["id"],
                            PhotoStr: image["photoStr"]
                        }
                    }),
                    Price: item["price"],
                    Valuta: item["valuta"],
                    isCompare: false,
                    CustomDeviceCategory: item["devCatId"],
                    isEdit: true,
                }
            });
            return products;
        }).catch(function (error) {
            console.log("GetFavorites", error);
            return {} as ProductType[];
        });
        return result;
    };


    static async GetMyTransactions(): Promise<Transaction[]> {
        const token: string = await getToken();
        let result = axios({
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://ltop.shop/MyOffice/TransactionsMobile',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }).then(response => {
            let transaction: Transaction[] = response.data;
            return transaction;
        }).catch(function (error) {
            console.log("GetMyTransactions", error);
            return [];
        });
        return result;
    };

    static async SendDetailsTransactionToEmail(transactionGuid: string): Promise<boolean> {
        const token: string = await getToken();
        let result = axios({
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://ltop.shop/MyOffice/SendDetailsTransactionToEmail?transactionGuid=${transactionGuid}`,
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }).then(response => {
            return true;
        }).catch(function (error) {
            console.log("GetMyTransactions", error);
            return false;
        });
        return result;
    };

    static async GetPDFTransaction(transactionGuid: string) {
        const [pdfUri, setPdfUri] = useState<string>("");
        const pdfUrl = `https://ltop.shop/MyOffice/GetPDFTemplate?transactionGuid=${transactionGuid}`;
        const token: string = await getToken();
        console.log('================GetPDFTransaction====================');
        let result = axios({
            method: 'get',
            url: pdfUrl,
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }).then(response => {
            console.log('================response.data====================');

        }).catch(function (error) {
            console.log("GetMyTransactions", error);
            return false;
        });

        try {
            const response = await axios.get(pdfUrl, {
                responseType: 'arraybuffer',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Отримайте дані файла та створіть шлях для збереження на пристрої
            const pdfData = response.data;
            console.log('================response.data====================');
            const fileUri = `${FileSystem.documentDirectory}назва_файлу.pdf`;

            // Збережіть PDF файл на пристрої
            await FileSystem.writeAsStringAsync(fileUri, pdfData, {
                encoding: FileSystem.EncodingType.Base64,
            });

            setPdfUri(fileUri);
        } catch (error) {
            console.error('Помилка завантаження PDF файлу:', error);
        }

        // const pdfUrl = `https://ltop.shop/MyOffice/GetPDFTemplate?transactionGuid=${transactionGuid}`;
        // const token: string = await getToken();

        // try {
        //     const headers = {
        //         Authorization: `Bearer ${token}`,
        //     };
        //     const { uri } = await FileSystem.downloadAsync(pdfUrl, FileSystem.DownloadResumable + transactionGuid + '.pdf', { headers });
        //     console.log('1====================================');
        //     console.log(uri);
        //     const asset = await MediaLibrary.createAssetAsync(uri);
        //     console.log('2====================================');
        //     await MediaLibrary.createAlbumAsync('Downloads', asset, false);
        //     console.log('3====================================');
        //     alert('PDF-файл був завантажений та збережений у папці "Downloads".');
        // } catch (error) {
        //     console.error('Помилка під час завантаження або збереження PDF-файлу:', error);
        // }



        //------------------------------------------

        // const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
        // if (permissions.granted) {
        //     FileSystem.downloadAsync(
        //         url,
        //         FileSystem.documentDirectory + 'Download/file.pdf');
        // };

        // let result = axios({
        //     method: 'get',
        //     maxBodyLength: Infinity,
        //     url: `https://ltop.shop/MyOffice/GetPDFTemplate?transactionGuid=${transactionGuid}`,
        //     headers: {
        //         'Authorization': `Bearer ${token}`,
        //         'Content-Type': 'application/octet-stream'
        //     }
        // }).then(response => {
        //     // console.log("download",response);
        //     const blob = new Blob([response.data], { type: 'application/pdf' });
        //     this.savePdf(blob, transactionGuid + '.pdf');
        //     return true;
        // }).catch(function (error) {
        //     console.log("GetMyTransactions", error);
        //     return false;
        // });
        // return result;
    }

    static async UpdatePhoto(image: ImagePickerAsset): Promise<string> {
        const token: string = await getToken();

        let uri = image.uri;
        let type = image.type;
        const formData = new FormData();
        formData.append('file', { uri, name: 'media', type: `image/${type}` } as any);
        return axios({
            method: 'post',
            url: `https://ltop.shop/MyOffice/PhotoEditAsync`,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            },
            transformRequest: (data, headers) => {
                return formData;
            },
        }).then(result => {
            console.log('=================PhotoUploadMobile===================');
            console.log(result);

            return result.data;
        })
            .catch((response) => {
                console.log(response.status, response.statusText);
                response.json().then((json: any) => {
                })
            });
    }
}