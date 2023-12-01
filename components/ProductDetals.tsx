import React, { useEffect, useState } from "react";
import {
  Animated,
  FlatList,
  // Button,
  LogBox,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { ProductType } from "./TypeModels";
import { useIsFocused, useRoute } from "@react-navigation/native";
import {
  CheckBox,
  Icon,
  Input,
  Tab,
  TabView,
  Text,
  Button,
} from "@rneui/themed";

import Slider from "react-native-hook-image-slider";
import { SceneMap } from "react-native-tab-view";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import CatalogServices from "../services/CatalogServices";
import GoogleGeo from "./GoogleGeo";
import MessageService from "../services/MessageService";
// import Gallery from 'react-native-image-gallery';
// import Gallery from 'react-native-awesome-gallery';
// import Gallery from 'react-native-image-gallery';
import ImageView from "react-native-image-viewing";
import Swiper from "react-native-swiper";
import { Dialog, ScreenWidth } from "@rneui/base";
import { getToken } from "./Storage/Token";
import { Profile } from "./Profile";

export type MyProps = {
  product: ProductType;
};
export type Prop = {
  name: string;
  value: string;
};
export type ExtendProductInfo = {
  id: number;
  price: number;
  valua: string;
  adAddres: string;
  adDescription: string;
  adEmail: string;
  adName: string;
  adPhone: string;
  author: string;
  authorGuid: string;
  isNew: string;
  name: string;
  description: boolean;
  device: {
    propertiesList: Prop[];
  };
};
export function ProductDetails(): JSX.Element {
  const [index, setIndex] = useState(0);
  const [visible, setIsVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState<number>(0);

  // const { id, name } = this.props.route.params;
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [isPublicMessage, setIsPublicMessage] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<string>("");
  let params = useRoute().params as {
    product: ProductType;
    rate: number;
    saverate: number;
    valuta: string;
    title: string;
  };
  const [product, setProduct] = useState<ProductType>(params.product);
  const [extendProductInfo, setExtendProductInfo] =
    useState<ExtendProductInfo>();

  const { t } = useTranslation();
  const [productDescription, setProductDescription] = useState<string>("");
  const [deviceSpecifications, setDeviceSpecifications] = useState<Prop[]>([]);
  const [valuta, setValuta] = useState<string>(params.valuta);
  const [rate, setRate] = useState<number>(params.rate);
  const [saverate, setSaverate] = useState<number>(params.saverate);
  const isFocused = useIsFocused();
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const toggleDialog = () => {
    setVisibleDialog(!visibleDialog);
  };
  const [visibleDialogWish, setVisibleDialogWish] = useState(false);
  const toggleDialogWish = () => {
    setVisibleDialogWish(!visibleDialogWish);
  };
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isCompare, setIsCompare] = useState<boolean>(
    product.isCompare == undefined || product.isCompare == false ? false : true
  );

  const imagesFull = product.PhotosItem.map((photo: any) => {
    return {
      uri: `https://res.cloudinary.com/ltopcloud/image/upload/${photo.PhotoStr}.jpg`,
    };
  });

  const getExtendInfo = async () => {
    try {
      axios
        .get(`https://ltop.shop/Product/GetExtendAdvertMobile/${product.ID}`)
        .then(
          (response) => {
            return response.data.extendAdvert;
          },
          (error) => {
            console.log("================getExtendInfo====================");
            console.log(error);
          }
        )
        .then(async (extendAdvert) => {
          if (extendAdvert != undefined) {
            await setExtendProductInfo(extendAdvert);
            console.log("propertiesList", extendAdvert.device.propertiesList);
            console.log("('================adAddres", extendAdvert.adAddres);
            await setDeviceSpecifications(extendAdvert.device.propertiesList);
            await setProductDescription(extendAdvert.description);
            console.log("deviceSpecifications", deviceSpecifications);
            setIsLoading(false);
          }
        });
    } catch (error) {
      console.log("================error====================");
      console.log(error);
      console.log("====================================");
    }
  };
  const Description = () => (
    <ScrollView style={{ flex: 1, marginTop: 5, marginHorizontal: 15 }}>
      <View style={{ height: 300, marginBottom: 10 }}>
        <Dialog
          overlayStyle={{ backgroundColor: "white" }}
          isVisible={visibleDialogWish}
          onBackdropPress={toggleDialogWish}
        >
          <Text>{t("add_wishlist").toString()}</Text>
        </Dialog>
        <Dialog
          overlayStyle={{ backgroundColor: "white" }}
          isVisible={visibleDialog}
          onBackdropPress={toggleDialog}
        >
          <Text>{t("add_compare").toString()}</Text>
        </Dialog>
        <Swiper
          style={{}}
          showsButtons={false}
          loop={true}
          autoplay={true}
          autoplayTimeout={4}
          paginationStyle={{
            position: "absolute",
            bottom: -10,
            marginBottom: -5,
          }}
          dotStyle={{}}
          activeDotStyle={{ backgroundColor: "#58a5df", height: 10, width: 10 }}
          scrollEnabled={true}
        >
          {product.PhotosItem.map((item, index) => {
            return (
              <View key={item.ID + item.PhotoStr} style={styles.slide}>
                <Pressable
                  onPress={() => {
                    setImageIndex(index);
                    setIsVisible(true);
                  }}
                >
                  <Image
                    resizeMode="cover"
                    style={styles.image}
                    source={{
                      uri: `https://res.cloudinary.com/ltopcloud/image/upload/ar_1:1,c_pad,dn_50,w_1500/${item.PhotoStr}.jpg`,
                    }}
                  />
                </Pressable>
              </View>
            );
          })}
        </Swiper>
        <ImageView
          backgroundColor="#fefefe"
          images={imagesFull}
          imageIndex={imageIndex}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
        />
        <View
          style={{
            flexDirection: "row",
            position: "absolute",
            bottom: 0,
            right: 0,
          }}
        >
          <Icon
            raised
            size={20}
            name="balance-scale"
            type="font-awesome"
            color={isCompare ? "#000" : "#999"}
            onPress={() => {
              (async () => {
                const data = await AsyncStorage.getItem(
                  `@compareDeviceID_${product.CustomDeviceCategory}`
                );
                let compareList: Array<number> = [];
                if (data != null) {
                  compareList = JSON.parse(data);
                }
                let index = compareList.indexOf(product.ID);
                if (index != -1) {
                  compareList.splice(index, 1);
                  setIsCompare(false);
                } else {
                  setVisibleDialog(!visibleDialog);

                  setIsCompare(true);
                  compareList.push(product.ID);
                }
                console.log(
                  `@compareDeviceID_${product.CustomDeviceCategory}`,
                  compareList
                );
                AsyncStorage.setItem(
                  `@compareDeviceID_${product.CustomDeviceCategory}`,
                  JSON.stringify(compareList)
                );
              })();
            }}
          />
          <Icon
            raised
            size={20}
            name={product.IsFavorite ? "heart" : "heart-o"}
            type="font-awesome"
            color="#ffa900"
            onPress={() => {
              (async () => {
                const data = await AsyncStorage.getItem(
                  `@favoriteDeviceID_${product.DevCatId}`
                );
                let favoriteList: Array<number> = [];
                if (data != null) {
                  favoriteList = JSON.parse(data);
                }
                let index = favoriteList.indexOf(product.ID);
                if (product.IsFavorite) {
                  setProduct({ ...product, IsFavorite: false });
                  CatalogServices.RemoveFavorite(product.ID);
                  if (index != -1) {
                    favoriteList.splice(index, 1);
                  }
                } else {
                  setVisibleDialogWish(!visibleDialogWish);

                  setProduct({ ...product, IsFavorite: true });
                  CatalogServices.AddFavorite(product.ID);
                  if (index == -1) {
                    favoriteList.push(product.ID);
                  }
                }
                console.log("favoriteList", favoriteList);
                AsyncStorage.setItem(
                  `@favoriteDeviceID_${product.DevCatId}`,
                  JSON.stringify(favoriteList)
                );
              })();
            }}
          />
        </View>
      </View>
      <Text style={{ alignSelf: "center", padding: 5, fontSize: 20 }}>
        {product.Name}
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
        {((product.Price * rate) / saverate).toFixed(2) + " " + valuta}
      </Text>
      <View
        style={{ display: "flex", flexDirection: "row", alignSelf: "center" }}
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
          {t("product.author").toString()}: {product.Author}
        </Text>
      </View>
      {productDescription != "" ? (
        <Text style={styles.text}>{productDescription}</Text>
      ) : (
        <Text style={styles.text}>
          {t("product.details.no_description").toString()}
        </Text>
      )}
    </ScrollView>
  );
  const Specifications = () => (
    <ScrollView>
      {deviceSpecifications.map((item, index) => (
        <View
          key={index + item.name}
          style={{ display: "flex", flexDirection: "row" }}
        >
          <Text
            style={[styles.tableCell, index % 2 ? styles.tableCellOdd : {}]}
          >
            {t(`product.details.spec.${item.name}`).toString()}
          </Text>
          <Text
            style={[styles.tableCell, index % 2 ? styles.tableCellOdd : {}]}
          >
            {item.value}
            {item.name.slice(-2).toLowerCase() == "gb" ? " GB" : ""}
            {item.name == "battery_capacity" ? " мА" : ""}
          </Text>
        </View>
      ))}
    </ScrollView>
  );

  useEffect(() => {
    getExtendInfo();
  }, [isFocused]);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token != "") {
        await setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    })();
  }, [isFocused, isAuthenticated]);

  if (isLoading) {
    return (
      <View style={{ alignSelf: "center" }}>
        {isLoading && (
          <Text>
            {t("catalog.loading").toString()} <ActivityIndicator />
          </Text>
        )}
      </View>
    );
  }
  return (
    <View key={product.ID} style={styles.productItem}>
      <Tab
        buttonStyle={{ width: "100%", margin: 0 }}
        containerStyle={{ width: "100%", margin: 0 }}
        value={tabIndex}
        onChange={(e) => setTabIndex(e)}
        indicatorStyle={{
          backgroundColor: "#1c82d100",
          height: 3,
        }}
        style={{ backgroundColor: "#58a5df" }}
        variant="primary"
      >
        <Tab.Item
          title={t("product.details.description").toString()}
          buttonStyle={{ height: 55, padding: 0, width: "110%", margin: 0 }}
          titleStyle={{ fontSize: 13, padding: 0, width: "120%", margin: 0 }}
          // icon={{ name: 'file-text', type: 'font-awesome', color: 'white' }}
        />
        <Tab.Item
          title={t("product.details.specifications").toString()}
          buttonStyle={{ height: 55, padding: 0, width: "100%", margin: 0 }}
          titleStyle={{ fontSize: 13, padding: 0, width: "170%", margin: 0 }}
          // icon={{ name: 'microchip', type: 'font-awesome', color: 'white' }}
        />
        <Tab.Item
          title={t("add.about_the_author").toString()}
          buttonStyle={{ height: 55, padding: 0, width: "100%", margin: 0 }}
          titleStyle={{ fontSize: 13, padding: 0, width: "120%", margin: 0 }}
          // icon={{ name: 'info', type: 'font-awesome', color: 'white' }}
        />
        <Tab.Item
          title={t("product.details.write_author").toString()}
          buttonStyle={{ height: 55, padding: 0, width: "100%", margin: 0 }}
          titleStyle={{ fontSize: 13, padding: 0, width: "120%", margin: 0 }}
          // icon={{ name: 'chat', type: 'Entypo', color: 'white' }}
        />
      </Tab>
      <TabView
        containerStyle={{ height: 1500 }}
        value={tabIndex}
        onChange={setTabIndex}
        animationType="spring"
      >
        <TabView.Item style={{ width: "100%" }}>
          <Description />
        </TabView.Item>
        <TabView.Item style={{ width: "100%" }}>
          <Specifications />
        </TabView.Item>
        <TabView.Item style={{ width: "100%" }}>
          <ScrollView style={{}}>
            <Input
              editable={false}
              label={t("add.nickname").toString()}
              value={extendProductInfo?.adName}
              leftIconContainerStyle={{}}
              // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
              onChange={(e) => {
                console.log(e.nativeEvent.text);
              }}
            />
            <Input
              editable={false}
              label={t("add.phone").toString()}
              value={extendProductInfo?.adPhone}
              leftIconContainerStyle={{}}
              // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
              onChange={(e) => {
                console.log(e.nativeEvent.text);
              }}
            />
            <Input
              editable={false}
              label={t("add.email").toString()}
              value={extendProductInfo?.adEmail}
              leftIconContainerStyle={{}}
              // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
              onChange={(e) => {
                console.log(e.nativeEvent.text);
              }}
            />
            <Input
              editable={false}
              label={t("add.additional_info").toString()}
              value={extendProductInfo?.adDescription}
              leftIconContainerStyle={{}}
              // leftIcon={{ type: 'font-awesome', name: 'address-card-o' }}
              onChange={(e) => {
                console.log(e.nativeEvent.text);
              }}
            />
            {extendProductInfo?.adAddres &&
              extendProductInfo?.adAddres.length > 2 && (
                <GoogleGeo
                  userAddress={extendProductInfo?.adAddres + ""}
                  isChange={false}
                  changeCity={() => {}}
                />
              )}
          </ScrollView>
        </TabView.Item>
        <TabView.Item style={{ width: "100%" }}>
          {isAuthenticated ? (
            <ScrollView
              key={"key" + product.AuthorGuid}
              style={{ marginHorizontal: 5 }}
            >
              <Text style={{ ...styles.authorText, marginLeft: 10 }}>
                {t("product.details.message").toString()}
              </Text>
              <TextInput
                style={styles.textField}
                multiline={true}
                numberOfLines={4}
                onChangeText={setNewMessage}
                value={newMessage}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <CheckBox
                  checked={isPublicMessage}
                  onPress={() => {
                    setIsPublicMessage(!isPublicMessage);
                  }}
                  title={t("product.details.is_public_message").toString()}
                  containerStyle={{ backgroundColor: "transparent" }}
                />

                <Button
                  radius={"sm"}
                  type="solid"
                  containerStyle={[styles.button]}
                  onPress={async () => {
                    let res = await MessageService.AdvertNewMessage(
                      product.ID.toString(),
                      newMessage,
                      isPublicMessage
                    );
                    setNewMessage("");
                    console.log("Send message", res);
                  }}
                >
                  {t("product.details.send_btn").toString() + " "}
                  <Icon name="send" type="font-awesome" color="white" />
                </Button>
              </View>
            </ScrollView>
          ) : (
            <Profile callbackSetAutorize={setIsAuthenticated} optionButtons={false} />
          )}
        </TabView.Item>
      </TabView>
    </View>
  );
}

const styles = StyleSheet.create({
  productItem: {
    flex: 1,
    flexDirection: "column",
    paddingBottom: 5,
    height: 200,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    padding: 10,
  },
  button: {
    width: "33%",
    alignSelf: "flex-end",
    margin: 10,
    borderRadius: 5,
  },
  specificationHead: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    padding: 10,
  },
  specificationText: {
    fontSize: 16,
    padding: 5,
  },
  textField: {
    margin: 5,
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
  authorText: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.25,
    padding: 10,
  },
  productImage: {
    marginHorizontal: 10,
    borderRadius: 5,
    flex: 2.5,
    height: "100%",
  },
  productInfo: {
    flex: 1,
  },
  productControls: {
    display: "flex",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "black",
    // flex: 1,
    // alignSelf: 'flex-end'
  },
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    // paddingTop: StatusBar.currentHeight,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    // padding: 16,
    marginTop: 10,
    marginHorizontal: 10,
  },
  tableCell: {
    width: "50%",
    fontSize: 16,
    padding: 10,
  },
  tableCellOdd: {
    backgroundColor: "#e0e0e0",
  },
  tableCellHead: {
    width: "50%",
    fontSize: 20,
    padding: 10,
  },
  image: {
    flex: 1,
    width: ScreenWidth,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
