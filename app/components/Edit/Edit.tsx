import React, {
  useEffect,
  MutableRefObject,
  useState,
  memo,
  useCallback,
  useRef,
} from "react";
import Autocomplete from "react-native-autocomplete-input";

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
  LogBox,
} from "react-native";
import { CheckBox, Tab, TabView, Text } from "@rneui/themed";
import {
  ProductSearchResult,
  ProductSearchResults,
  ProductType,
  PropertyList,
  SpecsByProduct,
  UserModel,
} from "../TypeModels";
import { Button, Icon, Input } from "@rneui/themed";
import { styles } from "../styles";
import { Picker } from "@react-native-picker/picker";
import { t } from "i18next";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import UserServices from "../../services/UserService";
import CatalogServices from "../../services/CatalogServices";
import SelectDevice, { filterResults } from "./SelectDevice";
import * as Device from "expo-device";
import { SpecTable } from "./SpecsTable";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerAsset } from "expo-image-picker";
import Swiper from "react-native-swiper";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GooglePay } from "react-native-google-pay";
import { StackNavigationProp } from "@react-navigation/stack";
import GoogleGeo from "../GoogleGeo";
import DeclarationServices from "../../services/DeclarationServices";
import { Profile } from "../Profile";
import { getToken } from "../Storage/Token";
import { renderImages } from "../../services/helper";

export function Edit(): JSX.Element {
  let params = useRoute().params as { product: ProductType };
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const MAX_COUNT_PHOTO_UPLOAD = 20;
  const [step, setStep] = useState<number>(1);
  const [advertId, setAdvertId] = useState<number>(0);
  const [refresh, setRefresh] = useState<boolean>(true);

  // one step
  const [user, setUser] = useState<UserModel>({
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
  });
  const [isChangeAddress, setIsChangeAddress] = useState<boolean>(false);
  const [isChangeUser, setIsChangeUser] = useState<boolean>(false);

  // two step
  const [category, setCategory] = useState<string>("1"); // dont use
  const [query, setQuery] = useState<string>(
    "" + Device.brand + " " + Device.designName + " " + Device.modelName
  );
  const [allModels, setAllModels] = useState<ProductSearchResults>([]);
  const [model, setModel] = useState<ProductSearchResult>();
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPhone, setIsValidPhone] = useState(true);

  const [specs, setSpecs] = useState<Array<PropertyList>>([]);
  // three step
  const [images, setImages] = useState<ImagePickerAsset[]>([]);
  const [advertTitle, setAdvertTitle] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [condition, setCondition] = useState<string>("used");
  const [currency, setCurrency] = useState<string>("UAH");
  const [infoAdvert, setInfoAdvert] = useState<string>("");
  const [imagesStr, setImagesStr] = useState<
    { id: string; photoStr: string }[]
  >([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<boolean>(false);

  // four step
  const [tabIndex, setTabIndex] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isLoadingSearch = !allModels.length;

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    if (images.length < MAX_COUNT_PHOTO_UPLOAD - 1) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        await setIsUploadingPhoto(true);
        console.log("images", images);
        let resImg = await CatalogServices.UploadFile(result.assets[0]);
        console.log("URL=========== ", resImg);
        // await setImagesStr([...imagesStr, resImg]);
        if (images != undefined) {
          await setImages([...images, ...result.assets]);
        } else {
          await setImages(result.assets);
        }
        await setIsUploadingPhoto(false);
      }
    }
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token != "") {
        await setIsAuthenticated(true);
        let advert = await DeclarationServices.GetAdvertById(params.product.ID);
        console.log(
          "================GetAdvertById propertiesList===================="
        );
        console.log(JSON.stringify(advert));
        console.log("================GetAdvertById====================");
        setAdvertId(params.product.ID);
        setUser({
          fullName: advert.author,
          userName: advert.adName,
          userGuid: "",
          personGuid: "",
          phoneNumber: advert.adPhone,
          instagram: "",
          facebook: "",
          skype: "",
          description: advert.adDescription,
          addres: advert.adAddres,
          email: advert.adEmail,
          isActive: false,
          isBlocked: false,
        });

        setSpecs(advert.device.propertiesList);
        setImagesStr(advert.device.photosList);
        let newImages: ImagePickerAsset[] = [];
        advert.device.photosList.forEach((el: { photoStr: any }) => {
          newImages.push({
            uri: `https://res.cloudinary.com/ltopcloud/image/upload//ar_1:1,c_pad,dn_50,w_1500/${el.photoStr}.jpg`,
            height: 400,
            width: 400,
          });
          el.photoStr;
        });
        setImages(newImages);
        setAdvertTitle(advert.name);
        setCondition(advert.isNew ? "new" : "used");
        setCurrency(advert.valuta);
        setPrice(advert.price.toString());
        setInfoAdvert(advert.description);
      } else {
        console.log("setIsAuthenticated false");
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    })();
  }, [isFocused, isAuthenticated]);

  const changeCity = (city: string) => {
    setUser({ ...user, addres: city });
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

  if (isAuthenticated) {
    return (
      <>
        {/* {isLoading &&
                    <View style={styles.loader}>
                        {isLoading && <Text style={styles.textLoading}>{t('catalog.loading').toString()} <ActivityIndicator /></Text>}
                    </View>
                } */}
        {step == 1 && !isLoading && (
          <View style={{ marginTop: 40, flex: 1 }}>
            <ScrollView>
              <Input
                containerStyle={{ height: 50 }}
                inputStyle={{ height: 50 }}
                // disabled={true}
                placeholder={t("add.email").toString()}
                value={user.email}
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
                  setUser({ ...user, email: e.nativeEvent.text });
                  setIsChangeUser(true);
                }}
              />
              {!isValidEmail && (
                <Text style={stylesCustom.errorText}>
                  {t("add.error_email").toString()}
                </Text>
              )}

              <Input
                containerStyle={{ height: 50 }}
                inputStyle={{ height: 50 }}
                placeholder={t("add.nickname").toString()}
                value={user.userName}
                leftIconContainerStyle={styles.inputLeftIcon}
                leftIcon={{ type: "font-awesome", name: "user" }}
                maxLength={255}
                onChange={(e) => {
                  setUser({
                    ...user,
                    userName: e.nativeEvent.text,
                    fullName: e.nativeEvent.text,
                  });
                  setIsChangeUser(true);
                }}
              />
              <Input
                containerStyle={{ height: 50 }}
                inputStyle={{ height: 50 }}
                placeholder={t("add.phone").toString()}
                value={user.phoneNumber}
                keyboardType={"phone-pad"}
                leftIconContainerStyle={styles.inputLeftIcon}
                leftIcon={{ type: "font-awesome", name: "phone" }}
                onChange={(e) => {
                  setUser({ ...user, phoneNumber: e.nativeEvent.text });
                  setIsChangeUser(true);
                }}
              />
              <View style={{}}>
                <Input
                  placeholder={t("add.additional_info").toString()}
                  value={user.description}
                  leftIconContainerStyle={styles.inputLeftIcon}
                  maxLength={4000}
                  inputContainerStyle={{ height: 150, borderWidth: 1 }}
                  multiline={true}
                  numberOfLines={5}
                  style={{ flexWrap: "wrap" }}
                  leftIcon={{ type: "font-awesome", name: "info" }}
                  onChange={(e) => {
                    setUser({ ...user, description: e.nativeEvent.text });
                    setIsChangeUser(true);
                  }}
                />
                <View style={{ flexDirection: "row" }}>
                  <Input
                    // disabled={true}
                    editable={false}
                    containerStyle={{ width: "50%" }}
                    placeholder={t("add.address").toString()}
                    value={user.addres}
                    maxLength={256}
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
                  userAddress={user.addres}
                  isChange={isChangeAddress}
                  changeCity={changeCity}
                />
              </View>
            </ScrollView>

            <Button
              buttonStyle={{
                backgroundColor: "#308ad9",
                borderWidth: 2,
                borderColor: "white",
                borderRadius: 30,
                marginTop: 5,
                marginBottom: 5,
                padding: 10,
                width: "50%",
                alignSelf: "center",
              }}
              iconRight={true}
              icon={
                <Icon
                  name="arrow-right"
                  type="font-awesome"
                  color="white"
                  size={25}
                  iconStyle={{ marginLeft: 10 }}
                />
              }
              title={
                isChangeUser
                  ? t("add.save").toString() + " & " + t("add.next").toString()
                  : t("add.next").toString()
              }
              onPress={() => {
                DeclarationServices.EditUserAdvert(user, advertId);
                setStep(step + 1);
                setIsChangeUser(false);
                setIsChangeAddress(false);
              }}
            />
          </View>
        )}
        {step == 2 && !isLoading && (
          <View style={{ flexDirection: "column", flex: 1, display: "flex" }}>
            <View style={{ backgroundColor: "#cecece" }}>
              <Picker
                placeholder={t("catalog.category.place_holder").toString()}
                style={[stylesCustom.categoryRow, {}]}
                selectedValue={category}
                onValueChange={(itemValue, itemIndex) => {
                  setCategory(itemValue);
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
            </View>
            <View style={{ flex: 1 }}>
              <SafeAreaView style={stylesCustom.saveView}>
                <View style={styles.container}>
                  <View style={stylesCustom.descriptionContainer}>
                    {specs && (
                      <SpecTable spec={specs} handlerSetScecs={setSpecs} />
                    )}
                  </View>
                </View>
              </SafeAreaView>
            </View>

            <View
              style={{
                width: "90%",
                flexDirection: "row",
                alignSelf: "center",
              }}
            >
              <Button
                containerStyle={{ flex: 1 }}
                buttonStyle={{
                  backgroundColor: "#308ad9",
                  borderWidth: 2,
                  borderColor: "white",
                  borderRadius: 30,
                  padding: 10,
                }}
                icon={
                  <Icon
                    name="arrow-left"
                    type="font-awesome"
                    color="white"
                    size={25}
                    iconStyle={{ marginRight: 10 }}
                  />
                }
                title={t("add.prev").toString()}
                onPress={() => {
                  setStep(step - 1);
                }}
              />
              <Button
                containerStyle={{ flex: 1 }}
                disabled={specs == undefined}
                buttonStyle={{
                  backgroundColor: "#308ad9",
                  borderWidth: 2,
                  borderColor: "white",
                  borderRadius: 30,
                  padding: 10,
                }}
                iconRight={true}
                icon={
                  <Icon
                    name="arrow-right"
                    type="font-awesome"
                    color="white"
                    size={25}
                    iconStyle={{ marginLeft: 10 }}
                  />
                }
                title={t("add.next").toString()}
                onPress={() => {
                  DeclarationServices.EditTechSpecAdvert(
                    specs,
                    advertId.toString(),
                    category
                  );
                  setStep(step + 1);
                }}
              />
            </View>
          </View>
        )}
        {step == 3 && !isLoading && (
          <View style={{ marginTop: 40, flex: 1 }}>
            <ScrollView>
              <View style={{}}>
                {!(imagesStr == undefined) && (
                  <FlatList
                    horizontal={true}
                    data={imagesStr}
                    extraData={refresh}
                    keyExtractor={(item, index) => item.id.toString()}
                    renderItem={({ item, index }) => {
                      return (
                        <View>
                          <Image
                            resizeMode="cover"
                            style={{ width: 120, height: 120, margin: 5 }}
                            source={{
                              uri: `https://res.cloudinary.com/ltopcloud/image/upload//ar_1:1,c_pad,dn_50,w_1500/${item.photoStr}.jpg`,
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
                              <Icon
                                name="remove"
                                type="font-awesome"
                                color="white"
                                size={25}
                                iconStyle={{ marginRight: 10 }}
                              />
                            }
                            title={t("add.remove").toString()}
                            onPress={async () => {
                              console.log("remove", item);
                              let result =
                                await DeclarationServices.DeletePhotosAdvert(
                                  item.id
                                );
                              console.log("result", result);
                              if (result) {
                                let findIndex = imagesStr.findIndex(
                                  (el) => el.id == item.id
                                );
                                if (findIndex > -1) {
                                  let newArr = imagesStr;
                                  newArr.splice(findIndex, 1);
                                  await setImagesStr(newArr);
                                  setRefresh(!refresh);
                                }
                              }
                            }}
                          />
                        </View>
                      );
                    }}
                  />
                )}
              </View>

              <Button
                disabled={images.length >= MAX_COUNT_PHOTO_UPLOAD}
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
                    : t("add.add_photo").toString()
                }
                onPress={() => {
                  pickImage();
                }}
              />

              <Input
                label={t("add.advert_title").toString()}
                placeholder={t("add.advert_title").toString()}
                value={advertTitle}
                defaultValue={"value"}
                leftIconContainerStyle={{}}
                leftIcon={{ type: "font-awesome", name: "address-card-o" }}
                onChange={(e) => {
                  setAdvertTitle(e.nativeEvent.text);
                }}
              />
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#8a95a0",
                    paddingLeft: 10,
                  }}
                >
                  {t("add.condition").toString()}
                </Text>
                <View style={{ flexDirection: "row" }}>
                  <CheckBox
                    title={t("add.used").toString()}
                    containerStyle={{ backgroundColor: "transparent" }}
                    checked={condition === "used"}
                    onPress={() => setCondition("used")}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                  />
                  <CheckBox
                    title={t("add.new").toString()}
                    containerStyle={{ backgroundColor: "transparent" }}
                    checked={condition === "new"}
                    onPress={() => setCondition("new")}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                  />
                </View>
                {/* <View style={{ borderTopWidth: 0.5, marginLeft: 10, marginRight: 10, borderBottomColor: "#8a95a0", marginBottom: 20 }}></View> */}
              </View>
              <View style={{ flexDirection: "row" }}>
                <Input
                  keyboardType={"phone-pad"}
                  containerStyle={{ flex: 1 }}
                  label={t("add.price").toString()}
                  placeholder={t("add.price").toString()}
                  value={price}
                  leftIconContainerStyle={{}}
                  leftIcon={{ type: "font-awesome", name: "money" }}
                  onChange={(e) => {
                    setPrice(e.nativeEvent.text);
                  }}
                />
                <Picker
                  placeholder={t("add.condition").toString()}
                  style={[{ flex: 1 }]}
                  selectedValue={currency}
                  onValueChange={(itemValue, itemIndex) => {
                    console.log("setSetCondition", itemValue);
                    setCurrency(itemValue);
                  }}
                >
                  <Picker.Item
                    style={{ fontWeight: "900" }}
                    label="UAH"
                    value="UAH"
                  />
                  <Picker.Item
                    style={{ fontWeight: "900" }}
                    label="USD"
                    value="USD"
                  />
                  <Picker.Item
                    style={{ fontWeight: "900" }}
                    label="EUR"
                    value="EUR"
                  />
                </Picker>
              </View>

              <Input
                placeholder={t("add.description").toString()}
                value={infoAdvert}
                leftIconContainerStyle={styles.inputLeftIcon}
                maxLength={4000}
                inputContainerStyle={{ height: 150, borderWidth: 1 }}
                multiline={true}
                numberOfLines={5}
                style={{ flexWrap: "wrap" }}
                leftIcon={{ type: "font-awesome", name: "info" }}
                onChange={(e) => {
                  setInfoAdvert(e.nativeEvent.text);
                }}
              />
            </ScrollView>
            <View
              style={{
                width: "90%",
                flexDirection: "row",
                alignSelf: "center",
              }}
            >
              <Button
                containerStyle={{ flex: 1 }}
                buttonStyle={{
                  backgroundColor: "#308ad9",
                  borderWidth: 2,
                  borderColor: "white",
                  borderRadius: 30,
                  padding: 10,
                }}
                icon={
                  <Icon
                    name="arrow-left"
                    type="font-awesome"
                    color="white"
                    size={25}
                    iconStyle={{ marginRight: 10 }}
                  />
                }
                title={t("add.prev").toString()}
                onPress={() => {
                  setStep(step - 1);
                }}
              />
              <Button
                containerStyle={{ flex: 1 }}
                buttonStyle={{
                  backgroundColor: "#308ad9",
                  borderWidth: 2,
                  borderColor: "white",
                  borderRadius: 30,
                  padding: 10,
                }}
                iconRight={true}
                icon={
                  <Icon
                    name="arrow-right"
                    type="font-awesome"
                    color="white"
                    size={25}
                    iconStyle={{ marginLeft: 10 }}
                  />
                }
                title={t("add.next").toString()}
                onPress={() => {
                  DeclarationServices.EditAnnouncementAdvert(
                    advertId.toString(),
                    advertTitle,
                    condition,
                    price,
                    currency,
                    infoAdvert
                  );
                  setStep(step + 1);
                }}
              />
            </View>
          </View>
        )}
        {step == 4 && !isLoading && (
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, alignSelf: "center", marginTop: 40 }}>
              {t("add.publication").toString()}
            </Text>
            <ScrollView style={{}}>
              <View style={{ height: 300 }}>
                <Swiper
                  style={{}}
                  showsButtons={false}
                  loop={true}
                  autoplay={true}
                  scrollEnabled={true}
                >
                  {imagesStr !== undefined && renderImages(images)}
                </Swiper>
              </View>
              <Text style={{ alignSelf: "center", padding: 5, fontSize: 20 }}>
                {advertTitle}
              </Text>
              <Text
                style={{
                  alignSelf: "center",
                  textAlign: "center",
                  marginTop: 5,
                  width: "80%",
                  borderRadius: 20,
                  backgroundColor: "#fff6e3",
                  color: "#08762d",
                  fontSize: 20,
                }}
              >
                {price + " " + currency}
              </Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignSelf: "center",
                }}
              >
                <Icon
                  style={{
                    marginTop: 10,
                    marginLeft: 10,
                  }}
                  name="user-o"
                  type="font-awesome"
                ></Icon>
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 5,
                    fontSize: 18,
                    padding: 5,
                  }}
                >
                  {t("product.author").toString()}: {user.fullName}
                </Text>
              </View>
              <Tab
                value={tabIndex}
                onChange={(e) => setTabIndex(e)}
                indicatorStyle={{
                  backgroundColor: "white",
                  height: 3,
                }}
                variant="primary"
              >
                <Tab.Item
                  title={t("product.details.description").toString()}
                  titleStyle={{ fontSize: 12 }}
                  icon={{
                    name: "file-text",
                    type: "font-awesome",
                    color: "white",
                  }}
                />
                <Tab.Item
                  title={t("product.details.specifications").toString()}
                  titleStyle={{ fontSize: 12 }}
                  icon={{
                    name: "microchip",
                    type: "font-awesome",
                    color: "white",
                  }}
                />
                <Tab.Item
                  title={t("add.about_the_author").toString()}
                  titleStyle={{ fontSize: 12 }}
                  icon={{ name: "chat", type: "Entypo", color: "white" }}
                />
              </Tab>
              <TabView
                containerStyle={{ height: 800 }}
                value={tabIndex}
                onChange={setTabIndex}
                animationType="spring"
              >
                <TabView.Item style={{ width: "100%" }}>
                  <Text style={{ padding: 5, fontSize: 18 }}>{infoAdvert}</Text>
                </TabView.Item>
                <TabView.Item style={{ width: "100%" }}>
                  {specs && (
                    <SpecTable
                      spec={specs}
                      handlerSetScecs={setSpecs}
                      editable={false}
                    />
                  )}
                </TabView.Item>
                <TabView.Item style={{ width: "100%" }}>
                  <View style={{}}>
                    <Input
                      editable={false}
                      label={t("add.nickname").toString()}
                      value={user.fullName}
                      leftIconContainerStyle={{}}
                      // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                      onChange={(e) => {
                        console.log(e.nativeEvent.text);
                      }}
                    />
                    <Input
                      editable={false}
                      label={t("add.phone").toString()}
                      value={user.phoneNumber}
                      leftIconContainerStyle={{}}
                      // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                      onChange={(e) => {
                        console.log(e.nativeEvent.text);
                      }}
                    />
                    <Input
                      editable={false}
                      label={t("add.email").toString()}
                      value={user.email}
                      keyboardType="email-address"
                      leftIconContainerStyle={{}}
                      // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                      onChange={(e) => {
                        console.log(e.nativeEvent.text);
                      }}
                    />
                    <Input
                      editable={false}
                      label={t("add.additional_info").toString()}
                      value={user.description}
                      leftIconContainerStyle={{}}
                      // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                      onChange={(e) => {
                        console.log(e.nativeEvent.text);
                      }}
                    />
                  </View>
                </TabView.Item>
              </TabView>
            </ScrollView>
            <View style={{ flexDirection: "row" }}>
              <Button
                containerStyle={{ flex: 1 }}
                buttonStyle={{
                  backgroundColor: "#308ad9",
                  borderWidth: 2,
                  borderColor: "white",
                  borderRadius: 30,
                  padding: 10,
                }}
                icon={
                  <Icon
                    name="arrow-left"
                    type="font-awesome"
                    color="white"
                    size={25}
                    iconStyle={{ marginRight: 10 }}
                  />
                }
                title={t("add.prev").toString()}
                onPress={() => {
                  setStep(step - 1);
                }}
              />
              <Button
                containerStyle={{ flex: 1 }}
                buttonStyle={{
                  backgroundColor: "#308ad9",
                  borderWidth: 2,
                  borderColor: "white",
                  borderRadius: 30,
                  padding: 10,
                }}
                iconRight={true}
                icon={
                  <Icon
                    name="arrow-right"
                    type="font-awesome"
                    color="white"
                    size={25}
                    iconStyle={{ marginLeft: 10 }}
                  />
                }
                title={t("add.go_to_payment").toString()}
                onPress={() => {
                  setStep(step + 1);
                }}
              />
            </View>
          </View>
        )}
        {step == 5 && !isLoading && (
          <View style={{ marginTop: 40 }}>
            <Text>Payment</Text>
            <View
              style={{
                width: "90%",
                flexDirection: "row",
                alignSelf: "center",
              }}
            >
              <Button
                containerStyle={{ flex: 1 }}
                buttonStyle={{
                  backgroundColor: "#308ad9",
                  borderWidth: 2,
                  borderColor: "white",
                  borderRadius: 30,
                  padding: 10,
                }}
                icon={
                  <Icon
                    name="arrow-left"
                    type="font-awesome"
                    color="white"
                    size={25}
                    iconStyle={{ marginRight: 10 }}
                  />
                }
                title={t("add.prev").toString()}
                onPress={() => {
                  setStep(step - 1);
                }}
              />
              <Button
                containerStyle={{ flex: 1 }}
                buttonStyle={{
                  backgroundColor: "#308ad9",
                  borderWidth: 2,
                  borderColor: "white",
                  borderRadius: 30,
                  padding: 10,
                }}
                iconRight={true}
                icon={
                  <Icon
                    name="arrow-right"
                    type="font-awesome"
                    color="white"
                    size={25}
                    iconStyle={{ marginLeft: 10 }}
                  />
                }
                title={t("add.next").toString()}
                onPress={() => {
                  console.log("send request");
                }}
              />
            </View>
          </View>
        )}
      </>
    );
  } else {
    return (
      <Profile callbackSetAutorize={setIsAuthenticated} optionButtons={true} />
    );
  }
}

const stylesCustom = StyleSheet.create({
  saveView: {
    height: "100%",
  },
  categoryRow: {
    flexDirection: "row",
    paddingLeft: 5,
    paddingRight: 5,
    height: 50,
    marginBottom: 10,
  },
  container: {
    position: "relative",
    flex: 1,
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
    padding: 5,
  },
  descriptionContainer: {
    // flex: 2,
    // marginTop: 20,
  },
  infoText: {
    textAlign: "center",
  },
  autocompleteContainer: {
    // Hack required to make the autocomplete
    // work on Andrdoid
    flex: 1,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1,
    padding: 5,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
    marginLeft: 10,
  },
});

export default SelectDevice;
