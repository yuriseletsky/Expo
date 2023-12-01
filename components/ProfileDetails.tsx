import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputBase,
  Image,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { UserInfo, UserModel } from "./TypeModels";
import { useTranslation } from "react-i18next";
import { getToken } from "./Storage/Token";
import UserServices from "../services/UserService";
import { Button, Icon, Input, Overlay } from "@rneui/themed";
import GoogleGeo from "./GoogleGeo";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import * as Location from "expo-location";
import GoogleServices from "../services/GoogleServices";
import LogServices from "../services/LogServices";

export type ProfileDetailsProps = {
  userInfo: UserInfo;
};
export function ProfileDetails(): JSX.Element {
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPhone, setIsValidPhone] = useState(true);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const user: ProfileDetailsProps = useRoute().params as ProfileDetailsProps;
  const userInfo = user.userInfo as UserInfo;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isChangeAddress, setIsChangeAddress] = useState<boolean>(false);
  const [isChangeUser, setIsChangeUser] = useState<boolean>(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);

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
  const [address, setAddress] = useState<string>("");

  const [userDetails, setUserDetails] = useState<UserModel>({
    fullName: "",
    userName: "",
    userGuid: "",
    personGuid: "",
    phoneNumber: "",
    instagram: "",
    facebook: "",
    skype: "",
    description: "",
    addres: "",
    email: "",
    isActive: false,
    isBlocked: false,
    photo:{
      id: 0,
      photoStr: ""
    }
  });
  const isFocused = useIsFocused();
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      await setIsUploadingPhoto(true);
      let resImg = await UserServices.UpdatePhoto(result.assets[0]);
      let newUserDetails: UserModel = await UserServices.GetFullUser();

      setUserDetails(newUserDetails);
      // await setImages(photoArray);
      await setIsUploadingPhoto(false);
    }
  };
  useEffect(() => {
    (async () => {
      const token = await getToken();
      console.log("token", token);
      if (token != "") {
        let newUserDetails: UserModel = await UserServices.GetFullUser();
        console.log("newUserDetails", newUserDetails);
        setUserDetails(newUserDetails);
        setAddress(newUserDetails.addres);
        setIsLoading(false);
      }

      console.log("==================GoogleGeo==================");
      // let { status } = await Location.requestForegroundPermissionsAsync();
      // if (status !== "granted") {
      //   LogServices.Log("Permission to access location was denied", "error");
      //   return;
      // }
      // LogServices.Log("Location ACCESS", "warning");

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
        LogServices.Log(
          "getCurrentPositionAsync location:" + JSON.stringify(location),
          "warning"
        );
      }
      setIsLoading(false);
    })();

    setIsLoading(true);
    (async () => {})();
  }, [isFocused]);
  const changeCity = (city: string) => {
    setUserDetails({ ...userDetails, addres: city });
    setIsChangeUser(true);
    console.log("setIsChangeUser", city);
  };
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
    <View style={styles.container}>
      <Overlay
        animationType="fade"
        // backdropStyle={styles.backdropStyle}
        overlayStyle={{ width: "95%", height: "80%" }}
        fullScreen={false}
        isVisible={isChangeAddress}
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
            setAddress(details?.address_components[0].long_name + "");
            setUserDetails({
              ...userDetails,
              addres: details?.address_components[0].long_name + "",
            });
          }}
          query={{
            key: "AIzaSyBIRJi8byb-jIg9Yij2rl948wB3Qd0Fh5I",
            language: "en",
          }}
        />
        <Button
          style={{}}
          onPress={() => {
            setIsChangeAddress(!isChangeAddress);
          }}
        >
          {t("add.save").toString()}
        </Button>
      </Overlay>
      <ScrollView>
        <View>
          <View>
            <Image
              resizeMode="cover"
              style={styles.photo}
              source={{
                uri: `https://res.cloudinary.com/ltopcloud/image/upload/ar_1:1,c_pad,dn_50,w_1500/${userDetails.photo.photoStr}.jpg`,
              }}
            />
            
            <Button
                containerStyle={{
                  marginBottom: 20,
                  width: "90%",
                  alignSelf: "center",
                }}
                buttonStyle={{
                  backgroundColor: "#308ad9",
                  borderWidth: 2,
                  borderColor: "white",
                  borderRadius: 30,
                  padding: 10,
                }}
                icon={
                  isUploadingPhoto ? (
                    <ActivityIndicator />
                  ) : (
                    <Icon
                      name="upload"
                      type="font-awesome"
                      color="white"
                      size={25}
                      iconStyle={{ marginRight: 10 }}
                    />
                  )
                }
                title={
                  isUploadingPhoto
                    ? t("catalog.loading").toString()
                    : t("profile.upload_photo").toString()
                }
                onPress={async () => {
                  await pickImage();
                }}
              />
          </View>
          <Text style={styles.text}>
            {t("profile.profile_details.username").toString()}
          </Text>
          <Input
            containerStyle={{ height: 50 }}
            inputStyle={{ height: 50 }}
            maxLength={255}
            value={userDetails.fullName}
            leftIconContainerStyle={styles.inputLeftIcon}
            leftIcon={{ type: "font-awesome", name: "user" }}
            onChange={(e) => {
              setUserDetails({
                ...userDetails,
                fullName: e.nativeEvent.text,
                userName: e.nativeEvent.text,
              });
            }}
          />
          <Text style={styles.text}>
            {t("profile.profile_details.email").toString()}
          </Text>
          <Input
            containerStyle={{ height: 50 }}
            inputStyle={{ height: 50 }}
            // disabled={true}
            value={userDetails.email}
            keyboardType="email-address"
            leftIconContainerStyle={styles.inputLeftIcon}
            leftIcon={{ type: "FontAwesome5", name: "email" }}
            onChange={(e) => {
              const regex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
              if (regex.test(e.nativeEvent.text)) {
                setIsValidEmail(true);
              } else {
                setIsValidEmail(false);
              }
              setUserDetails({ ...userDetails, email: e.nativeEvent.text });
            }}
          />
          {!isValidEmail && (
            <Text style={styles.errorText}>
              {t("add.error_email").toString()}
            </Text>
          )}
          <Text style={styles.text}>
            {t("profile.profile_details.phone").toString()}
          </Text>
          <Input
            containerStyle={{ height: 50 }}
            inputStyle={{ height: 50 }}
            value={userDetails.phoneNumber}
            keyboardType={"phone-pad"}
            leftIconContainerStyle={styles.inputLeftIcon}
            leftIcon={{ type: "font-awesome", name: "phone" }}
            onChange={(e) => {
              setUserDetails({
                ...userDetails,
                phoneNumber: e.nativeEvent.text,
              });
            }}
          />
          <Text style={styles.text}>Skype</Text>
          <Input
            containerStyle={{ height: 50 }}
            inputStyle={{ height: 50 }}
            value={userDetails.skype}
            leftIconContainerStyle={styles.inputLeftIcon}
            leftIcon={{ type: "font-awesome", name: "skype" }}
            onChange={(e) => {
              setUserDetails({ ...userDetails, skype: e.nativeEvent.text });
            }}
          />
          <Text style={styles.text}>Facebook</Text>
          <Input
            containerStyle={{ height: 50 }}
            inputStyle={{ height: 50 }}
            value={userDetails.facebook}
            leftIconContainerStyle={styles.inputLeftIcon}
            leftIcon={{ type: "font-awesome", name: "facebook" }}
            onChange={(e) => {
              setUserDetails({ ...userDetails, facebook: e.nativeEvent.text });
            }}
          />
          <Text style={styles.text}>Instagram</Text>
          <Input
            containerStyle={{ height: 50 }}
            inputStyle={{ height: 50 }}
            value={userDetails.instagram}
            leftIconContainerStyle={styles.inputLeftIcon}
            leftIcon={{ type: "font-awesome", name: "instagram" }}
            onChange={(e) => {
              setUserDetails({ ...userDetails, instagram: e.nativeEvent.text });
            }}
          />
          <Text style={styles.text}>
            {t("profile.profile_details.description").toString()}
          </Text>
          <Input
            placeholder={t("add.additional_info").toString()}
            value={userDetails.description}
            maxLength={4000}
            inputContainerStyle={{ height: 150, borderWidth: 1 }}
            multiline={true}
            numberOfLines={5}
            style={{ flexWrap: "wrap" }}
            onChange={(e) => {
              setUserDetails({
                ...userDetails,
                description: e.nativeEvent.text,
              });
            }}
          />
          <View style={{ flexDirection: "row" }}>
            <Input
              // disabled={true}
              editable={false}
              containerStyle={{ width: "50%" }}
              placeholder={t("add.address").toString()}
              maxLength={256}
              value={userDetails.addres}
              leftIconContainerStyle={styles.inputLeftIcon}
              leftIcon={{ type: "entypo", name: "location" }}
              onChange={(e) => {
                // setUser({ ...user, addres: e.nativeEvent.text });
                // setIsChangeUser(true);
                // CatalogServices.GetCity(e.nativeEvent.text);
              }}
            />
            <Button
              buttonStyle={{
                alignSelf: "center",
                borderRadius: 50,
                margin: 10,
              }}
              icon={
                <Icon
                  name="edit"
                  type="font-awesome"
                  color="white"
                  size={25}
                  iconStyle={{ marginLeft: 10 }}
                />
              }
              onPress={() => {
                setIsChangeAddress(!isChangeAddress);
              }}
            >
              {t("add.change_address").toString()}
            </Button>
          </View>
          <GoogleGeo
            userAddress={userDetails.addres}
            isChange={isChangeAddress}
            changeCity={changeCity}
          />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button
          buttonStyle={{
            backgroundColor: "#308ad9",
            borderWidth: 2,
            borderColor: "white",
            borderRadius: 30,
            padding: 10,
            width: "80%",
            alignSelf: "center",
          }}
          iconRight={true}
          icon={
            <Icon
              name="user-edit"
              type="font-awesome-5"
              color="white"
              size={25}
              iconStyle={{ marginLeft: 10 }}
            />
          }
          title={t("profile.profile_details.update_info_btn").toString()}
          onPress={() => {
            UserServices.UpdateUser(userDetails);
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
            }, 600);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  textField: {
    margin: 5,
    padding: 5,
    borderWidth: 1,
    borderRadius: 10,
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  footer: {
    marginBottom: 20,
    borderRadius: 15,
    marginHorizontal: 15,
    color: "black",
    textDecorationLine: "underline",
  },
  text: {
    fontSize: 16,
    lineHeight: 15,
    fontWeight: "bold",
    letterSpacing: 0.25,
    paddingLeft: 10,
    paddingTop: 10,
    // backgroundColor: "#e9ecef"
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textLoading: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    padding: 10,
  },
  inputLeftIcon: {
    width: 40,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
    marginLeft: 10,
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignSelf: "center",
  },
});
