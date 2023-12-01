import axios from "axios";
import { Advert, PropertyList, UserModel } from "../components/TypeModels";
import { getToken } from "../components/Storage/Token";

export default class DeclarationServices {

    static async GetAdvertData(step?: number): Promise<Advert> {
        const token: string = await getToken();
        let params = step ? { step: step } : {};

        let config = {
            method: 'get',
            url: 'https://ltop.shop/Declaration/CheckUserOnStepMobile',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            params: params,
            // data: data
        };

        return axios.request(config)
            .then((response) => {
                console.log("CheckUserOnStepMobile");
                console.log(JSON.stringify(response.data));
                return response.data;
            })
            .catch((error) => {
                console.log("GetAdvertData", error);
            });

    };
    static async GetAdvertById(id: number): Promise<any> {
        try {
            return axios.get(`https://ltop.shop/Product/GetExtendAdvertMobile/${id}`)
                .then((response) => {
                    return response.data.extendAdvert;
                }, (error) => {
                    console.log(error);
                });
        } catch (error) {
            console.log('================GetAdvertById error====================');
            console.log(error);
            console.log('====================================');
        }
    }
    static async AddTechSpecAdvert(specs: PropertyList[], model: string, categoryId: number, modelId?: string): Promise<boolean> {
        const token: string = await getToken();
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var formdata = new FormData();
        formdata.append('Model', model);
        formdata.append('ModelId', modelId ? modelId : "");
        formdata.append('DeviceCategoryId', categoryId.toString());
        // formdata.append('Model', user.phoneNumber);
        // formdata.append('Region', user.skype);
        // formdata.append('OtherInformation', user.facebook);
        specs.forEach((el, index) => {
            formdata.append(`PropertyList[${index}].Name`, el.name)
            formdata.append(`PropertyList[${index}].Value`, el.value)
        })

        var requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
        };

        return fetch("https://ltop.shop/Declaration/TechnicalSpecifications", requestOptions)
            .then(response => response.text())
            .then(result => { console.log(result); return true })
            .catch(error => { console.log('EditTechSpecAdvert', error); return false });
    };

    static async EditTechSpecAdvert(specs: PropertyList[], id: string, category: string): Promise<boolean> {
        const token: string = await getToken();
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var formdata = new FormData();
        formdata.append('AdvertId', id);
        formdata.append('DeviceCategoryId', category);
        // formdata.append('Model', user.phoneNumber);
        // formdata.append('Region', user.skype);
        // formdata.append('OtherInformation', user.facebook);
        specs.forEach((el, index) => {
            formdata.append(`PropertyList[${index}].Name`, el.name)
            formdata.append(`PropertyList[${index}].Value`, el.value)
        })

        var requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
        };

        return fetch("https://ltop.shop/EditAdvert/TechnicalSpecifications", requestOptions)
            .then(response => response.text())
            .then(result => { console.log(result); return true })
            .catch(error => { console.log('EditTechSpecAdvert', error); return false });
    };
    static async EditAnnouncementAdvert(id: string, name: string, isNew: string, price: string, valuta: string, description: string): Promise<boolean> {
        const token: string = await getToken();
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var formdata = new FormData();
        formdata.append('AdvertId', id);
        formdata.append('Name', name);
        let condition = isNew == "new" ? "True" : "false";
        formdata.append('IsNew', condition);
        formdata.append('Price', price);
        let currency = valuta == "UAH" ? "1" : valuta == "EUR" ? "3" : "2";
        formdata.append('Valuta', currency);
        formdata.append('Description', description);

        var requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
        };

        return fetch("https://ltop.shop/EditAdvert/Announcement", requestOptions)
            .then(response => response.text())
            .then(result => { console.log(result); return true })
            .catch(error => { console.log('EditAnnouncementAdvert', error); return false });
    };

    static async DeletePhotosAdvert(idPhoto: string): Promise<boolean> {
        const token: string = await getToken();
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
        };

        return fetch(`https://ltop.shop/EditAdvert/DeleteDevicePhotoAsync/${idPhoto}?${idPhoto}`, requestOptions)
            .then(response => response.text())
            .then(result => { console.log(result); return true })
            .catch(error => { console.log('DeletePhotosAdvert', error); return false });
    };


    static async EditUserAdvert(user: UserModel, advertId: number): Promise<boolean> {
        const token: string = await getToken();
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var formdata = new FormData();
        formdata.append('AdvertId', advertId.toString());
        formdata.append('Name', user.userName);
        formdata.append('Phone', user.phoneNumber);
        formdata.append('Email', user.email);
        formdata.append('Region', user.addres);
        formdata.append('OtherInformation', user.description);
        console.log('================user====================');
        console.log(user);
        console.log(formdata);
        console.log('====================================');
        var requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
        };

        return fetch("https://ltop.shop/EditAdvert", requestOptions)
            .then(response => {
                console.log("response status ", response.status);

                return response.text();
            })
            .then(result => { return true })
            .catch(error => { console.log('error ProfileInfoUpdateMobile'); return false });
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
            .catch(error => { console.log('ProfileInfoUpdateMobile', error); return false });

    };

    static async UpdateDeclarationUser(user: UserModel): Promise<boolean> {

        const token: string = await getToken();
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + token);

        let data = new FormData();
        data.append('Name', user.userName);
        data.append('Phone', user.phoneNumber);
        data.append('Email', user.email);
        data.append('Region', user.addres);
        data.append('OtherInformation', user.description);
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: data,
        };

        return fetch("https://ltop.shop/Declaration", requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log("UpdateDeclarationUser true");
                return true;
            })
            .catch(error => {
                console.log("UpdateDeclarationUser err", error);
                return false;
            });
    }

    
}