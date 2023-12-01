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
  KeyboardAvoidingView,
} from "react-native";
import { CheckBox, Tab, TabView, Text } from "@rneui/themed";
import {
  BrandsSearch,
  ProductSearchResult,
  ProductSearchResults,
  PropertyList,
  SpecsByProduct,
  UserModel,
  defaultSpec,
} from "../TypeModels";
import { Button, Icon, Input } from "@rneui/themed";
import { styles } from "../styles";
import { Picker } from "@react-native-picker/picker";
import { t } from "i18next";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import UserServices from "../../services/UserService";
import CatalogServices from "../../services/CatalogServices";
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
import { renderImages, validatePhone } from "../../services/helper";
import LogServices from "../../services/LogServices";
import { ScreenHeight } from "@rneui/base";
// import SearchableDropdown from 'react-native-searchable-dropdown';

function filterResults(
  products: ProductSearchResults,
  isSelectProduct: boolean,
  query?: string
): ProductSearchResults {
  if (!query || !products.length) {
    console.log("filterResults empty");
    return [];
  }
  // const regex = new RegExp(`${query.trim().toLocaleLowerCase()}`, 'i');
  // let result = products.filter((item) => {
  //     return item.product.model.toLocaleLowerCase().search(regex) >= 0;
  // });
  // console.log(isSelectProduct,query,'=================filterResults===================',result.length," - ", products.length);
  if (isSelectProduct) {
    products = [products[0]];
  }
  return products;
}

function filterResultsBrands(brands: any[], query?: string): any {
  if (!query || !brands.length) {
    console.log("filterResults empty");
    return [];
  }
  const regex = new RegExp(`${query.trim()}`, "i");
  let result = brands.filter((item) => {
    return item.name.search(regex) >= 0;
  });
  return result;
}

export function Add(): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  // const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const MAX_COUNT_PHOTO_UPLOAD = 20;
  const [step, setStep] = useState<number>(0);
  const [advertId, setAdvertId] = useState<number>(0);
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
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [isValidPhone, setIsValidPhone] = useState(true);
  const [isChangeAddress, setIsChangeAddress] = useState<boolean>(false);
  const [isChangeUser, setIsChangeUser] = useState<boolean>(false);
  const [isVaidFirstStep, setIsVaidFirstStep] = useState<boolean>(false);

  // two step
  const [isVaidTwoStep, setIsVaidTwoStep] = useState<boolean>(false);

  const [category, setCategory] = useState<string>("Tablets"); // dont use
  const [brands, setBrands] = useState<{ name: string; id: number }[]>([]); // dont use
  // const [query, setQuery] = useState<string>('' + Device.brand + " " + Device.designName );
  const [query, setQuery] = useState<string>("");
  const [isFocusAutocomplete, setIsFocusAutocomplete] =
    useState<boolean>(false);
  const [isSelectProduct, setIsSelectProduct] = useState<boolean>(false);
  const [queryBrands, setQueryBrands] = useState<string>("");
  const [tmpQuery, setTmpQuery] = useState<string>(
    "" + Device.brand + " " + Device.designName + " " + Device.modelName
  );
  const [allModels, setAllModels] = useState<ProductSearchResults>([]);
  const [model, setModel] = useState<ProductSearchResult>();
  const [specs, setSpecs] = useState<SpecsByProduct>(defaultSpec); //for create from api
  const [isNew, setIsNew] = useState<boolean>(true); //for create from api
  const [isLoadingSpec, setIsLoadingSpec] = useState<boolean>(false);

  // three step
  const [isValidPrice, setIsValidPrice] = useState(false);
  const [isValidTitle, setIsValidTitle] = useState(false);

  const [images, setImages] = useState<{ ID: number; PhotoStr: string }[]>([]);
  const [advertTitle, setAdvertTitle] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [condition, setCondition] = useState<string>("used");
  const [currency, setCurrency] = useState<string>("UAH");
  const [infoAdvert, setInfoAdvert] = useState<string>("");
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
        let photoArray = await CatalogServices.GetExistPhoto();

        console.log("URL=========== ", resImg);
        await setImages(photoArray);
        await setIsUploadingPhoto(false);
      }
    }
  };

  // search
  const queriedProducts = React.useMemo(
    () => filterResults(allModels, isSelectProduct, query),
    [allModels, query]
  );
  const queriedBrands = React.useMemo(
    () => filterResultsBrands(brands, queryBrands),
    [brands, queryBrands]
  );
  const GetModelsByName = (name: string, category: string) => {
    (async () => {
      let result: ProductSearchResult[] = await CatalogServices.GetModelByName(
        name,
        category
      );
      if (result != undefined) {
        await setAllModels(result);
        setIsLoadingSpec(false);
      }
    })();
  };

  const suggestions: ProductSearchResults = React.useMemo(() => {
    return queriedProducts.length === 1 &&
      queriedProducts[0].product.model.toLowerCase() === query.toLowerCase()
      ? []
      : queriedProducts;
  }, [queriedProducts, query]);

  useEffect(() => {
    if (query.length >= 3) {
      GetModelsByName(query, category);
    }
  }, [query]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    switch (step) {
      case 1:
        console.log("load step 1", step);
        (async () => {
          let advert = await DeclarationServices.GetAdvertData(step);
          if (advert.data.advertId != null && advert.data.name != null) {
            await setUser({
              ...user,
              email: advert.data.email,
              fullName: advert.data.name,
              phoneNumber: advert.data.phone,
              addres: advert.data.region,
              description: advert.data.otherInformation,
            });
          } else {
            let newUser: UserModel = await UserServices.GetFullUser();
            await setUser({
              ...user,
              email: newUser.email,
              fullName: newUser.fullName,
              phoneNumber: newUser.phoneNumber,
              addres: newUser.addres,
              description: newUser.description,
            });
          }
        })();
        break;

      case 2:
        console.log("load step 2", step);
        (async () => {
          let advert = await DeclarationServices.GetAdvertData(step);
          LogServices.Log(
            "DeclarationServices.GetAdvertData:" + JSON.stringify(advert.data),
            "warning"
          );

          if (
            advert.data != null &&
            advert.data != undefined &&
            advert.data.advertId != null
          ) {
            switch (advert.data.deviceCategoryId.toString()) {
              case "1":
                setCategory("Tablets");
                break;
              case "2":
                setCategory("Laptops");
                break;
              case "3":
                setCategory("Smartphones");
                break;
            }
            let propses: PropertyList[] = advert.data.propertyList;

            let formatRes: SpecsByProduct = {
              No: {
                FM_Radio: "",
                Flash: "",
                GPS: "",
                SIM_Frequencies: "",
                SIM_II_Frequencies: "",
              },
              camera: {
                back_camera: {
                  focus: "",
                  image_format: "",
                  resolution:
                    propses.find((obj) => obj.name === "camera_back__mp")
                      ?.value + "",
                  "resolution_(h_x_w)": "",
                  sensor: "",
                  video_format: "",
                  video_resolution: "",
                  zoom: "",
                },
                front_camera: {
                  image_format: "",
                  resolution:
                    propses.find((obj) => obj.name === "camera_front__mp")
                      ?.value + "",
                  "resolution_(h_x_w)": "",
                  sensor: "",
                  video_format: "",
                  video_resolution: "",
                },
              },
              date: { released: "" },
              design: {
                body: {
                  colors:
                    propses.find((obj) => obj.name === "color")?.value + "",
                  height: "",
                  thickness: "",
                  weight: "",
                  width: "",
                },
                keyboard: { design: "" },
              },
              display: {
                bezel_width: "",
                color_depth: "",
                diagonal:
                  propses.find((obj) => obj.name === "display_size_inch")
                    ?.value + "",
                glass: "",
                height: "",
                illumination: "",
                lcd_mode:
                  propses.find((obj) => obj.name === "display_type")?.value +
                  "",
                number_of_colors: "",
                pixel_density: "",
                pixel_size: "",
                "resolution_(h_x_w)": "",
                screen_to_body_ratio: "",
                subpixels: "",
                touch_screen_type: "",
                width: "",
              },
              image: { back: "", front: "" },
              inside: {
                audio: { channel: "", microphone: "", output: "" },
                battery: {
                  cell_i:
                    propses.find((obj) => obj.name === "battery_capacity")
                      ?.value + "",
                  style:
                    propses.find((obj) => obj.name === "battery_technology")
                      ?.value + "",
                },
                cellular: { generation: "", sim_type: "" },
                location: { additional_features: "" },
                port: { usb_features: "", usb_type: "", usb_version: "" },
                processor: { cpu: "", cpu_clock_speed: "", gpu: "" },
                ram: {
                  capacity:
                    propses.find((obj) => obj.name === "ram_capacity_gb")
                      ?.value + "",
                  type: "",
                },
                software: {
                  os:
                    propses.find((obj) => obj.name === "software_os")?.value +
                    "",
                  os_version: "",
                },
                storage: {
                  capacity:
                    propses.find((obj) => obj.name === "storage_capacity_gb")
                      ?.value + "",
                  expansion: "",
                  type: "",
                },
                wireless: { bluetooth_version: "", experiences: "", wifi: "" },
              },
              product: {
                brand:
                  propses.find((obj) => obj.name === "general_brand")?.value +
                  "",
                category: "",
                id: "",
                manufacturer:
                  propses.find((obj) => obj.name === "general_year")?.value +
                  "",
                model: propses.find((obj) => obj.name === "name")?.value + "",
              },
            };
            setSpecs(formatRes);
            if (advert.data.model) {
              setQuery(advert.data.model);
              setTmpQuery(advert.data.model);
            }
            setIsNew(false);
          }
        })();
        break;
      case 3:
        console.log("load step 3", step);
        (async () => {
          let photoArray = await CatalogServices.GetExistPhoto();

          console.log("photoArray=========== ", photoArray);
          await setImages(photoArray);
        })();
        break;
      case 4:
        console.log("load step 4", step);

        break;
      case 5:
        console.log("load step 5", step);

        break;
    }
  }, [step]);

  const isFocused = useIsFocused();
  useEffect(() => {
    (async () => {
      let items = await CatalogServices.GetAllBrands(category);
      setBrands(items);
      const token = await getToken();
      console.log("isFocused token", token);
      if (token != "") {
        await setIsAuthenticated(true);
        let advert = await DeclarationServices.GetAdvertData();

        if (advert == undefined || advert.step == 0) {
          let user: UserModel = await UserServices.GetFullUser();
          await setUser(user);
          setStep(1);
        } else {
          setStep(advert.step);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    })();
  }, [isFocused, isAuthenticated]);

  useEffect(() => {
    let isVaid = true;
    if (!isValidEmail) {
      isVaid = isValidEmail;
    }
    if (!isValidPhone) {
      isVaid = isValidPhone;
    }
    if (user.fullName.length < 2) {
      isVaid = false;
    }
    if (user.addres.length < 2) {
      isVaid = false;
    }
    setIsVaidFirstStep(isVaid);
  }, [user]);

  const changeCity = (city: string) => {
    setUser({ ...user, addres: city });
    setIsChangeUser(true);
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
  const checkStepTwoValid = (): boolean => {
    if (
      specs.product.model != undefined &&
      specs.product.model.length > 2 &&
      specs.product.brand != undefined &&
      specs.product.brand.length > 0
    ) {
      return false;
    }
    return true;
  };

  const CustomSetSpec = async (spec: SpecsByProduct) => {
    console.log("=================CunstomSetSpec===================");
    await setSpecs(spec);
  };

  if (isAuthenticated) {
    return (
      <>
        {/* {isLoading &&
                    <View style={styles.loader}>
                        {isLoading && <Text style={styles.textLoading}>{t('catalog.loading').toString()} <ActivityIndicator /></Text>}
                    </View>
                }  */}
        {step == 1 && !isLoading && (
          <View style={{ marginTop: 40, flex: 1 }}>
            <View>
              {!isChangeAddress && (
                <>
                  <Input
                    containerStyle={{ height: 50 }}
                    inputStyle={{ height: 50 }}
                    // disabled={true}
                    placeholder={t("add.email").toString()}
                    value={user.email}
                    leftIconContainerStyle={styles.inputLeftIcon}
                    leftIcon={{ type: "FontAwesome5", name: "email" }}
                    keyboardType="email-address"
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
                    value={user.fullName}
                    leftIconContainerStyle={styles.inputLeftIcon}
                    leftIcon={{ type: "font-awesome", name: "user" }}
                    maxLength={255}
                    onChange={(e) => {
                      setUser({
                        ...user,
                        fullName: e.nativeEvent.text,
                        userName: e.nativeEvent.text,
                      });
                      setIsChangeUser(true);
                    }}
                  />
                  {!user.fullName && (
                    <Text style={stylesCustom.errorText}>
                      {t("add.error_name").toString()}
                    </Text>
                  )}
                  <Input
                    containerStyle={{ height: 50 }}
                    inputStyle={{ height: 50 }}
                    placeholder={t("add.phone").toString()}
                    value={user.phoneNumber}
                    keyboardType={"phone-pad"}
                    leftIconContainerStyle={styles.inputLeftIcon}
                    leftIcon={{ type: "font-awesome", name: "phone" }}
                    onChange={(e) => {
                      let isValid = validatePhone(e.nativeEvent.text);

                      const regex = /^\+?\d{0,12}$/;
                      // const regex = /^\d{10}$/;
                      if (
                        regex.test(e.nativeEvent.text) ||
                        e.nativeEvent.text.length == 0
                      ) {
                        setUser({ ...user, phoneNumber: e.nativeEvent.text });
                        setIsValidPhone(isValid);

                        setIsChangeUser(true);
                      }
                    }}
                  />
                  {!isValidPhone && (
                    <Text style={stylesCustom.errorText}>
                      {t("add.error_phone").toString()}
                    </Text>
                  )}
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
                </>
              )}
              <View style={{}}>
                <View style={{ flexDirection: "row" }}>
                  {!isChangeAddress && (
                    <Input
                      // disabled={true}
                      editable={false}
                      containerStyle={{ width: "50%" }}
                      placeholder={t("add.address").toString()}
                      maxLength={256}
                      value={user.addres}
                      leftIconContainerStyle={styles.inputLeftIcon}
                      leftIcon={{ type: "entypo", name: "location" }}
                      onChange={(e) => {
                        // setUser({ ...user, addres: e.nativeEvent.text });
                        // setIsChangeUser(true);
                        // CatalogServices.GetCity(e.nativeEvent.text);
                      }}
                    />
                  )}
                  {!isChangeAddress && (
                    <Button
                      buttonStyle={{
                        alignSelf: "center",
                        borderRadius: 50,
                        marginTop: 10,
                        minWidth: "50%",
                      }}
                      icon={
                        <Icon
                          name={isChangeAddress ? "save" : "edit"}
                          type="font-awesome"
                          color="white"
                          size={25}
                          iconStyle={{ marginRight: 5 }}
                        />
                      }
                      onPress={() => {
                        setIsChangeAddress(!isChangeAddress);
                      }}
                    >
                      {isChangeAddress
                        ? t("add.save").toString()
                        : t("add.change_address").toString()}
                    </Button>
                  )}
                </View>

                {user.addres.length > 3 && (
                  <GoogleGeo
                    userAddress={user.addres}
                    isChange={isChangeAddress}
                    changeCity={changeCity}
                  />
                )}
              </View>
            </View>
            {isChangeAddress && (
              <Button
                buttonStyle={{
                  alignSelf: "center",
                  borderRadius: 50,
                  marginTop: 10,
                  minWidth: "80%",
                }}
                icon={
                  <Icon
                    name={isChangeAddress ? "save" : "edit"}
                    type="font-awesome"
                    color="white"
                    size={25}
                    iconStyle={{ marginRight: 5 }}
                  />
                }
                onPress={() => {
                  setIsChangeAddress(!isChangeAddress);
                }}
              >
                {t("add.change_address").toString()}
              </Button>
            )}
            {!isChangeAddress && (
              <View
                style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}
              >
                <Button
                  disabled={!isVaidFirstStep}
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
                      ? t("add.save").toString() +
                        " & " +
                        t("add.next").toString()
                      : t("add.next").toString()
                  }
                  onPress={async () => {
                    await DeclarationServices.UpdateDeclarationUser(user);
                    await setStep(step + 1);
                    setIsChangeUser(false);
                    setIsChangeAddress(false);
                  }}
                />
              </View>
            )}
          </View>
        )}
        {step == 2 && !isLoading && (
          <View style={{ flex: 1 }}>
            <View style={{ marginBottom: 20 }}>
              <Picker
                placeholder={t("catalog.category.place_holder").toString()}
                style={[styles.categoryRow, {}]}
                selectedValue={category}
                onValueChange={(itemValue, itemIndex) => {
                  setCategory(itemValue);
                }}
              >
                <Picker.Item
                  style={styles.dropdownItem}
                  label={t("catalog.category.tablets").toString()}
                  value="Tablets"
                />
                <Picker.Item
                  style={styles.dropdownItem}
                  label={t("catalog.category.laptop").toString()}
                  value="Laptops"
                />
                <Picker.Item
                  style={styles.dropdownItem}
                  label={t("catalog.category.smartphones").toString()}
                  value="Smartphones"
                />
              </Picker>
            </View>

            {
              <View style={{ zIndex: 2, marginBottom: 50 }}>
                <SafeAreaView style={{ height: "100%" }}>
                  <View style={styles.container}>
                    <View style={stylesCustom.autocompleteContainer}>
                      <Autocomplete
                        editable={!isLoading}
                        autoCorrect={true}
                        data={suggestions}
                        value={query}
                        onChangeText={(e) => {
                          setIsSelectProduct(false);
                          setQuery(e);
                        }}
                        onBlur={() => {
                          setIsFocusAutocomplete(false);
                        }}
                        onFocus={() => {
                          setIsFocusAutocomplete(true);
                        }}
                        placeholder={t("add.enter_the_name_device").toString()}
                        inputContainerStyle={{ backgroundColor: "blue" }}
                        flatListProps={{
                          keyboardShouldPersistTaps: "always",
                          keyExtractor: (el: ProductSearchResult) => {
                            return el.product.id;
                          },
                          renderItem: ({ item, index }) => (
                            <>
                              {isFocusAutocomplete && (
                                <TouchableOpacity
                                  onPress={() => {
                                    setQuery(item.product.model);
                                    setIsSelectProduct(true);
                                    setIsLoadingSpec(true);
                                    Keyboard.dismiss();
                                  }}
                                >
                                  <Text
                                    style={[
                                      stylesCustom.itemText,
                                      {
                                        backgroundColor:
                                          index % 2 == 0 ? "#f0f0f0" : "#fff",
                                        zIndex: 4,
                                      },
                                    ]}
                                  >
                                    {item.product.model}
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </>
                          ),
                        }}
                      />
                    </View>

                    <View style={[stylesCustom.descriptionContainer, {}]}>
                      {isLoadingSpec ? (
                        <View style={styles.loader}>
                          <Text style={{}}>
                            <ActivityIndicator size="large" color={"#308ad9"} />
                          </Text>
                        </View>
                      ) : (
                        <SpecTable
                          product={queriedProducts[0]}
                          specs={specs}
                          handlerSetScecs={CustomSetSpec}
                          isSelect={isSelectProduct}
                        />
                      )}
                    </View>
                  </View>
                </SafeAreaView>
              </View>
            }

            <View
              style={{
                zIndex: 3,
                width: "90%",
                flexDirection: "row",
                alignSelf: "center",
                position: "absolute",
                bottom: 5,
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
                disabled={checkStepTwoValid()}
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
                  let props: PropertyList[] = [];

                  let catId = "3";
                  switch (category) {
                    case "Tablets":
                      catId = "1";
                      break;
                    case "Laptops":
                      catId = "2";
                      break;
                    case "Smartphones":
                      catId = "3";
                      break;
                  }

                  DeclarationServices.EditTechSpecAdvert(
                    props,
                    advertId.toString(),
                    catId
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
                {!(images == undefined) && (
                  <SafeAreaView style={{}}>
                    <FlatList
                      horizontal={true}
                      data={images}
                      renderItem={({ item }) => {
                        return (
                          <View>
                            <Image
                              resizeMode="cover"
                              style={{ width: 120, height: 120, margin: 5 }}
                              // source={Image.resolveAssetSource(item)}
                              source={{
                                uri: `https://res.cloudinary.com/ltopcloud/image/upload/${item.PhotoStr}.jpg`,
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
                                let newImages = images.filter(
                                  (image) => image.ID != item.ID
                                );
                                await CatalogServices.DeleteImage(item.ID);
                                await setImages(newImages);
                              }}
                            />
                          </View>
                        );
                      }}
                      keyExtractor={(item) => item.PhotoStr}
                    />
                  </SafeAreaView>
                )}
                {/* <Pressable style={{ width: 200, height: 50, alignItems: 'center', alignSelf:"center", backgroundColor: "gray", justifyContent: 'center', borderRadius:20}} onPress={pickImage}>
                                <Text style={{ color: "#fff" }}>Add</Text>
                                <Text style={{ color: "#fff" }}>Photo</Text>
                            </Pressable> */}
              </View>
              {/* start test */}
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
                onPress={async () => {
                  await pickImage();
                }}
              />

              <Input
                label={t("add.advert_title").toString()}
                placeholder={t("add.advert_title").toString()}
                value={advertTitle}
                maxLength={256}
                defaultValue={specs?.product.model}
                leftIconContainerStyle={{}}
                leftIcon={{ type: "font-awesome", name: "address-card-o" }}
                onChangeText={async (e) => {
                  await setAdvertTitle(e);
                  if (e.length < 3) {
                    setIsValidTitle(false);
                  } else {
                    setIsValidTitle(true);
                  }
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
                  maxLength={8}
                  leftIconContainerStyle={{}}
                  leftIcon={{ type: "font-awesome", name: "money" }}
                  onChangeText={async (e) => {
                    var regex = /^\d+(\.\d{1,2})?$|^\d$/;
                    if (e.length == 0 || !regex.test(e)) {
                      setIsValidPrice(false);
                    } else {
                      setIsValidPrice(true);
                    }
                    await setPrice(e);
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
              {!isValidPrice && (
                <Text
                  style={{
                    color: "red",
                    fontSize: 16,
                    marginTop: -30,
                    marginLeft: 10,
                  }}
                >
                  {t("product.details.date_price").toString()}{" "}
                </Text>
              )}

              <Input
                placeholder={t("add.description").toString()}
                value={infoAdvert}
                leftIconContainerStyle={styles.inputLeftIcon}
                maxLength={2000}
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
            {/* END VIEW */}
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
                disabled={!(images.length && isValidPrice && isValidTitle)}
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
                  {images !== undefined && renderImages(images)}
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
                  {specs != undefined && (
                    <View style={{}}>
                      <Input
                        editable={false}
                        label={t("product.details.spec.name").toString()}
                        placeholder={t("product.details.spec.name").toString()}
                        value={specs.product.model}
                        leftIconContainerStyle={{}}
                        onChange={(e) => {
                          console.log(e.nativeEvent.text);
                        }}
                      />
                      {/* <Input
                                        disabled={true}
                    label={t('product.details.spec.name').toString()}
                    placeholder='Бренд'
                    value={specs.product.mnp}
                    leftIconContainerStyle={{}}
                    // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                    onChange={(e) => {
                        console.log(e.nativeEvent.text);

                    }}
                /> */}
                      <Input
                        editable={false}
                        label={t(
                          "product.details.spec.general_brand"
                        ).toString()}
                        placeholder={t(
                          "product.details.spec.general_brand"
                        ).toString()}
                        value={specs.product.brand}
                        leftIconContainerStyle={{}}
                        // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                        onChange={(e) => {
                          console.log(e.nativeEvent.text);
                        }}
                      />
                      <Input
                        editable={false}
                        label={t(
                          "product.details.spec.date_released"
                        ).toString()}
                        placeholder={t(
                          "product.details.spec.date_released"
                        ).toString()}
                        value={specs.date.released}
                        leftIconContainerStyle={{}}
                        // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                        onChange={(e) => {
                          console.log(e.nativeEvent.text);
                        }}
                      />
                      <Input
                        editable={false}
                        label={t("product.details.spec.weight").toString()}
                        placeholder={t(
                          "product.details.spec.weight"
                        ).toString()}
                        value={specs.design.body.weight}
                        leftIconContainerStyle={{}}
                        // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                        onChange={(e) => {
                          console.log(e.nativeEvent.text);
                        }}
                      />
                      <Input
                        editable={false}
                        label={t(
                          "product.details.spec.display_size_inch"
                        ).toString()}
                        placeholder={t(
                          "product.details.spec.display_size_inch"
                        ).toString()}
                        value={specs.display.diagonal}
                        leftIconContainerStyle={{}}
                        // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                        onChange={(e) => {
                          console.log(e.nativeEvent.text);
                        }}
                      />
                      <Input
                        editable={false}
                        label={t(
                          "product.details.spec.display_type"
                        ).toString()}
                        placeholder={t(
                          "product.details.spec.display_type"
                        ).toString()}
                        value={specs.display.lcd_mode}
                        leftIconContainerStyle={{}}
                        // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                        onChange={(e) => {
                          console.log(e.nativeEvent.text);
                        }}
                      />
                      <Input
                        editable={false}
                        label={t(
                          "product.details.spec.camera_back__mp"
                        ).toString()}
                        placeholder={t(
                          "product.details.spec.camera_back__mp"
                        ).toString()}
                        value={specs.camera.back_camera.resolution}
                        leftIconContainerStyle={{}}
                        // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                        onChange={(e) => {
                          console.log(e.nativeEvent.text);
                        }}
                      />
                      <Input
                        editable={false}
                        label={t(
                          "product.details.spec.camera_front__mp"
                        ).toString()}
                        placeholder={t(
                          "product.details.spec.camera_front__mp"
                        ).toString()}
                        value={specs.camera.front_camera.resolution}
                        leftIconContainerStyle={{}}
                        // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                        onChange={(e) => {
                          console.log(e.nativeEvent.text);
                        }}
                      />
                      <Input
                        editable={false}
                        label={t("product.details.spec.software_os").toString()}
                        placeholder={t(
                          "product.details.spec.software_os"
                        ).toString()}
                        value={specs.inside.software.os}
                        leftIconContainerStyle={{}}
                        // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                        onChange={(e) => {
                          console.log(e.nativeEvent.text);
                        }}
                      />
                      <Input
                        editable={false}
                        label={t(
                          "product.details.spec.software_os_version"
                        ).toString()}
                        placeholder={t(
                          "product.details.spec.software_os_version"
                        ).toString()}
                        value={specs.inside.software.os_version}
                        leftIconContainerStyle={{}}
                        // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                        onChange={(e) => {
                          console.log(e.nativeEvent.text);
                        }}
                      />
                      <Input
                        editable={false}
                        label={t("product.details.spec.cpu_type").toString()}
                        placeholder={t(
                          "product.details.spec.cpu_type"
                        ).toString()}
                        value={specs.inside.processor.cpu}
                        leftIconContainerStyle={{}}
                        // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                        onChange={(e) => {
                          console.log(e.nativeEvent.text);
                        }}
                      />
                      <Input
                        editable={false}
                        label={t(
                          "product.details.spec.ram_capacity_gb"
                        ).toString()}
                        placeholder={t(
                          "product.details.spec.ram_capacity_gb"
                        ).toString()}
                        value={specs.inside.ram.capacity}
                        leftIconContainerStyle={{}}
                        // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                        onChange={(e) => {
                          console.log(e.nativeEvent.text);
                        }}
                      />
                      <Input
                        editable={false}
                        label={t(
                          "product.details.spec.storage_capacity_gb"
                        ).toString()}
                        placeholder={t(
                          "product.details.spec.storage_capacity_gb"
                        ).toString()}
                        value={specs.inside.storage.capacity}
                        leftIconContainerStyle={{}}
                        // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                        onChange={(e) => {
                          console.log(e.nativeEvent.text);
                        }}
                      />
                      <Input
                        editable={false}
                        label={t(
                          "product.details.spec.battery_capacity"
                        ).toString()}
                        placeholder={t(
                          "product.details.spec.battery_capacity"
                        ).toString()}
                        value={specs.inside.battery.cell_i}
                        leftIconContainerStyle={{}}
                        // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                        onChange={(e) => {
                          console.log(e.nativeEvent.text);
                        }}
                      />
                      <Input
                        editable={false}
                        label={t(
                          "product.details.spec.battery_technology"
                        ).toString()}
                        placeholder={t(
                          "product.details.spec.battery_technology"
                        ).toString()}
                        value={specs.inside.battery.style}
                        leftIconContainerStyle={{}}
                        // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                        onChange={(e) => {
                          console.log(e.nativeEvent.text);
                        }}
                      />
                      <Input
                        editable={false}
                        label={t("product.details.spec.color").toString()}
                        placeholder={t("product.details.spec.color").toString()}
                        value={specs.design.body.colors}
                        leftIconContainerStyle={{}}
                        // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
                        onChange={(e) => {
                          console.log(e.nativeEvent.text);
                        }}
                      />
                    </View>
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
    // flex:1,
    height: 610,
  },
  container: {
    position: "relative",
    flex: 1,
    // Android requiers padding to avoid overlapping
    // with content and autocomplete
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
    flex: 2,
    marginTop: 50,
    backgroundColor: "white",
  },
  infoText: {
    textAlign: "center",
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 2,
    padding: 5,
    flexDirection: "row",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
    marginLeft: 10,
  },
});
