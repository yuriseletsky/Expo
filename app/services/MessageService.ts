import axios from "axios";
import { getToken } from "../components/Storage/Token";
import LogServices from "./LogServices";
export type OpenedDialogResponse = {
    dialog: {
        companionUser: {
            userGuid: string,
            userName: string,
            userEmail: string,
            userSkype: string,
            userInstagram: string,
            userFacebook: string,
            userPhoto?: {
                ID: number,
                photoStr: string
            },
        },
        messagesList: PrivateMessange[]
    }
}
export type PrivateMessange = {
    messageText: string,
    dateCreate: string,
    title: string,
    advert: {
        ID: number,
        Name: string
    },
    isMainUser: boolean
}
export type DialogList = {
    userGuid: string,
    userName: string,
    userPhoto: {
        ID: number,
        photoStr: string
    },
    email: string,
    newMessage: number,
    lastMessage: PrivateMessange
}
export type DialogListsResponse = {
    privateMessages: DialogList[],
    publicMessages: DialogList[]
}
export default class MessageService {
    static async getMessangeLists(): Promise<DialogListsResponse> {
        const token: string = await getToken();
        let resp = await axios.get(`https://ltop.shop/MyOffice/MessageMobile`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            })
            .then((response) => {
                return response.data;
            }, (error) => {
                LogServices.Log("getMessangeLists " + error, "error")
                console.log(error);
                return {} as DialogListsResponse;
            }).then((MessageLists: DialogListsResponse) => {
                console.log("MessageLists ", MessageLists);
                LogServices.Log("getMessangeLists " + JSON.stringify(MessageLists), "warning")
                return MessageLists;
            });
        return resp;
    }
    static async getDialog(dialogId: string) {
        const token: string = await getToken();
        let resp = await axios.get(`https://ltop.shop/MyOffice/DialogMobile?id=${dialogId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            })
            .then((response) => {
                return response.data;
            }, (error) => {
                console.log(error);
                return {};
            }).then((OpenedDialog: OpenedDialogResponse) => {
                console.log(OpenedDialog);
                return OpenedDialog;
            });
        return resp;
    }
    static async AdvertNewMessage(AdvertId: string, Message: string, IsPublic: boolean): Promise<boolean> {
        const token: string = await getToken();

        const FormData = require('form-data');
        let data = new FormData();
        data.append('AdvertId', AdvertId);
        data.append('Message', Message);
        data.append('IsPublic', IsPublic);
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://ltop.shop/Product/MessageFromAdvertPageMobile',
            headers: {
                'Authorization': 'Bearer ' + token,
            },
            data: data
        };

        var myHeaders = new Headers();
        myHeaders.append("Authorization", 'Bearer ' + token)
        var formdata = new FormData();
        formdata.append("AdvertId", "296");
        formdata.append("Message", Message);
        formdata.append("IsPublic", IsPublic);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata,
        };

        return fetch("https://ltop.shop/Product/MessageFromAdvertPageMobile", requestOptions)
            .then(response => response.json())
            .then((response) => {
                console.log('================AdvertNewMessage====================');
                console.log(token);
                console.log(response.success);
                return true;
            })
            .catch((error) => {
                console.log('================AdvertNewMessage error====================');
                console.log(AdvertId);
                console.log(Message);
                console.log(error);
                return false;
            });
    }
    static async postNewMessage(message: string, sendToPerson: string) {
        const token: string = await getToken();
        const messageObj = {
            Message: message,
            SendToPersonID: sendToPerson,
            SendFromUserID: ""
        };
        const newMessageRequest = new Request('https://ltop.shop/MyOffice/NewMessageMobile', {
            method: 'POST',
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(messageObj)
        });
        fetch(newMessageRequest)
            .then((response) => {
                return response.json();
            }).then((code) => {
                console.log("response code", code);
            })
    }
    static async potNewMessageFromAdvertPage() {
        const token: string = await getToken();
    }
}