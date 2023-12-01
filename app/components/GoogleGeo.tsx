import React, { Ref, forwardRef, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
  TextInput,
} from "react-native";
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { useIsFocused } from "@react-navigation/native";
import GoogleServices from "../services/GoogleServices";
import LogServices from "../services/LogServices";
import { t } from "i18next";
import { Button, Overlay } from "@rneui/themed";

interface GoogleGeo {
  userAddress: string;
  isChange: boolean;
  changeCity(city: string): void;
}
const GoogleGeo = (props: GoogleGeo) => {
  const [address, setAddress] = useState<string>(props.userAddress || "");
  const isFocused = useIsFocused();
  const [location, setLocation] = useState<Location.LocationObject>({
    coords: {
      latitude: 50.449687144577865,
      longitude: 30.536771015765343,
      accuracy: null,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    timestamp: 0,
  });
  const [errorMsg, setErrorMsg] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      console.log("==================GoogleGeo==================");
      // if (status !== 'granted') {
      //     LogServices.Log("Permission to access location was denied", "error")
      //     setErrorMsg('Permission to access location was denied');
      //     return;
      // }
      LogServices.Log("Location ACCESS", "warning");

      if (address != undefined && address.length > 2) {
        let result = await GoogleServices.GeocodeService(address);
        console.log("GoogleServices", result);
        LogServices.Log(
          "GoogleServices.GeocodeService result:" + JSON.stringify(result),
          "warning"
        );

        if (result.city.length > 0) {
          let newLocation: Location.LocationObject = {
            coords: {
              latitude: result.location.lat,
              longitude: result.location.lng,
              altitude: null,
              accuracy: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
            },
            timestamp: 0,
          };
          setLocation(newLocation);
        }
      } else {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          LogServices.Log("Permission to access location was denied", "error");
          setErrorMsg("Permission to access location was denied");
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        LogServices.Log(
          "getCurrentPositionAsync location:" + JSON.stringify(location),
          "warning"
        );
        console.log(
          "getCurrentPositionAsync location:" + JSON.stringify(location)
        );

        let newLocation: Location.LocationObject = {
          coords: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            altitude: null,
            accuracy: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: 0,
        };
        let city = await GoogleServices.GeocodeServiceGetName(
          location.coords.latitude,
          location.coords.longitude
        );
        await setLocation(newLocation);
        await setAddress(city);
        props.changeCity(city);
        LogServices.Log(
          "getCurrentPositionAsync location:" + JSON.stringify(location),
          "warning"
        );
      }
      setIsLoading(false);
    })();
  }, [isFocused]);
  if (isLoading) {
    return (
      <View style={styles.loader}>
        {isLoading && (
          <Text style={styles.textLoading}>
            {t("catalog.loading").toString()} <ActivityIndicator />
          </Text>
        )}
      </View>
    );
  }
  return (
    <View style={{ height: 215, marginBottom: 10 }}>
      <View
        style={{
          display: props.isChange ? "flex" : "none",
          height: 250,
          zIndex: 20,
          flex: 1,
          top: 0,
          position: "absolute",
          width: "100%",
        }}
      >
        <GooglePlacesAutocomplete
          placeholder="Enter Location"
          minLength={2}
          fetchDetails={true}
          listViewDisplayed="auto"
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            console.log("long_name", details?.address_components[0].long_name);
            // console.log("location", details?.geometry.location;
            let newLocation: Location.LocationObject = {
              coords: {
                latitude:
                  details?.geometry.location.lat || location.coords.latitude,
                longitude:
                  details?.geometry.location.lng || location.coords.longitude,
                altitude: null,
                accuracy: null,
                altitudeAccuracy: null,
                heading: null,
                speed: null,
              },
              timestamp: 0,
            };
            setLocation(newLocation);
            props.changeCity(
              details?.address_components[0].long_name || address
            );
          }}
          query={{
            key: "AIzaSyBIRJi8byb-jIg9Yij2rl948wB3Qd0Fh5I",
            language: "en",
          }}
        />
      </View>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
        />
      </MapView>
    </View>
  );
};
export default GoogleGeo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
    zIndex: 1,
  },
  loader: {
    // flex: 1,
    alignItems: "center",
    // justifyContent: 'center',
  },
  textLoading: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    padding: 10,
    alignSelf: "center",
    justifyContent: "center",
  },
});
