import axios from "axios";
import { Location } from "../components/TypeModels";
type LocationAndCity = {
    location: Location,
    city: string
}
export default class GoogleServices {
    static async GeocodeService(address: string): Promise<LocationAndCity> {
        console.log('==============GeocodeService 123======================');
        console.log(address);
        console.log('====================================');

        let config = {
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBIRJi8byb-jIg9Yij2rl948wB3Qd0Fh5I`,
            headers: {}
        };
        console.log('==================googleapis==================');
        console.log(address);
        return axios.request(config)
            .then((response: {
                status: any; data: any;
            }) => {
                let data = response.data.results[0];
                console.log('==================googleapis response==================');
                console.log(response.status);
                if (data == undefined) {
                    console.log('==================googleapis undefined==================');
                    return { location: { lat: 0, lng: 0 }, city: "NotFound" };
                } else {
                    let location: Location = data.geometry.location;
                    let city: string = data.address_components[0].short_name;
                    let result: LocationAndCity = { city: city, location: location }
                    return result;
                }

            })
            .catch((error: any) => {
                console.log("GoogleServices add", address, " error ", error);
                let result: LocationAndCity = { city: "", location: { lat: 0, lng: 0 } }
                return result;
            });
    }

    static async GeocodeServiceGetName(latitude: number, longitude: number): Promise<string> {
        let config = {
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBIRJi8byb-jIg9Yij2rl948wB3Qd0Fh5I`,
            headers: {}
        };
        return axios.request(config)
            .then((response: { data: any; }) => {
                let city: string = response.data.results[0].address_components[1].short_name;
                return city;
            })
            .catch((error: any) => {
                console.log("GeocodeServiceGetName", error);
                return "";
            });
    }
}