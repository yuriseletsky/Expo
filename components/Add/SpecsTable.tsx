import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputBase,
  View,
} from "react-native";
import {
  ProductSearchResult,
  PropertyList,
  SpecsByProduct,
  UserInfo,
} from "../TypeModels";
import { useTranslation } from "react-i18next";
import CatalogServices from "../../services/CatalogServices";
import { Input } from "@rneui/themed";
import { t } from "i18next";
import { ScreenHeight } from "@rneui/base";
import { styles } from "../styles";

interface SpecTableProps {
  product: ProductSearchResult;
  specs: SpecsByProduct;
  isSelect: boolean;
  handlerSetScecs(result: SpecsByProduct): void;
}
function convertObjectToArray(obj: any): PropertyList[] {
  const result: PropertyList[] = [];
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result.push({ name: key, value: obj[key] });
    }
  }
  return result;
}
export function SpecTable(props: SpecTableProps): JSX.Element {
  const [spec, setSpec] = useState<SpecsByProduct>(props.specs);
  const [isValidReleasedate, setIsValidReleasedate] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      console.log(
        "================GetSpecsByProductID====================",
        props.product
      );
      let specs: SpecsByProduct;
      if (props.product != undefined && props.isSelect) {
        specs = await CatalogServices.GetSpecsByProductID(
          props.product.product.id
        );

        console.log("====================================");
        console.log(specs);
        console.log("====================================");

        setSpec(specs);
        props.handlerSetScecs(specs);
      }
      if (props.specs != undefined) {
        // setSpec(props.specs);
        // props.handlerSetScecs(props.specs);
      }
    })();
  }, [props.product]);

  useEffect(() => {
    props.handlerSetScecs(spec);
  }, [spec]);

  if (spec == undefined) {
    return (
      <>
        <View style={styles.loader}>
          <Text style={{}}>
            <ActivityIndicator size="large" color={"#308ad9"} />
          </Text>
        </View>
      </>
    );
  }

  return (
    <ScrollView
      style={{ zIndex: 2 }}
      automaticallyAdjustKeyboardInsets={true}
      showsVerticalScrollIndicator={true}
      onContentSizeChange={(contentWidth, contentHeight) => {
        // Встановіть потрібні обчислення висоти вмісту і прокрутки тут
      }}
    >
      <View>
        <Input
          label={t("product.details.spec.name").toString()+'*'}
          // placeholder={t('product.details.spec.name').toString()}
          value={spec.product.model}
          leftIconContainerStyle={{}}
          maxLength={256}
          
          onChange={(e) => {
            let tmpSpec = spec;
            tmpSpec.product.model = e.nativeEvent.text;
            setSpec({ ...tmpSpec });
          }}
        />
        <Input
          label={t("product.details.spec.general_brand").toString()+'*'}
          // placeholder={t('product.details.spec.general_brand').toString()}
          value={spec.product.brand}
          leftIconContainerStyle={{}}
          maxLength={256}
          onChange={(e) => {
            let tmpSpec = spec;
            tmpSpec.product.brand = e.nativeEvent.text;
            setSpec({ ...tmpSpec });
          }}
        />

        {/* {spec.date.released != undefined && <Input
                    label={t('product.details.spec.date_released').toString()}
                    //placeholder={t('product.details.spec.date_released').toString()}
                    value={spec.date.released}
                    leftIconContainerStyle={{}}
                    maxLength={256}
                    keyboardType='numeric'
                    onChange={(e) => {
                        if (/^\d{0,4}$/.test(e.nativeEvent.text)) {
                            let tmpSpec = spec;
                            tmpSpec.date.released = e.nativeEvent.text;
                            setSpec({ ...tmpSpec });
                            let dateReleased = parseInt(e.nativeEvent.text);
                            if (dateReleased < 2000 || dateReleased > (new Date()).getFullYear()) {
                                setIsValidReleasedate(false);
                            } else {
                                setIsValidReleasedate(true);
                            }
                        }

                    }}
                />} */}
        {/* {t('product.details.spec.date_released').toString()} */}
        {spec.date.released != undefined &&
          spec.date.released.length > 0 &&
          !isValidReleasedate && (
            <Text
              style={{
                color: "red",
                fontSize: 16,
                marginTop: -20,
                marginLeft: 10,
              }}
            >
              {t("product.details.date_relese_error").toString() +
                new Date().getFullYear()}{" "}
            </Text>
          )}
        {spec.design &&
          spec.design.body &&
          spec.design.body.weight != undefined && (
            <Input
              label={t("product.details.spec.weight").toString()}
              //placeholder={t('product.details.spec.weight').toString()}
              value={spec.design.body.weight}
              leftIconContainerStyle={{}}
              maxLength={256}
              onChange={(e) => {
                let tmpSpec = spec;
                tmpSpec.design.body.weight = e.nativeEvent.text;
                setSpec({ ...tmpSpec });
              }}
            />
          )}
        {spec.date && spec.date.released != undefined && (
          <Input
            label={t("product.details.spec.display_size_inch").toString()}
            //placeholder={t('product.details.spec.display_size_inch').toString()}
            value={spec.display.diagonal}
            leftIconContainerStyle={{}}
            keyboardType="numeric"
            maxLength={256}
            onChange={(e) => {
              let tmpSpec = spec;
              tmpSpec.display.diagonal = e.nativeEvent.text;
              setSpec({ ...tmpSpec });
            }}
          />
        )}
        {spec.display && spec.display.lcd_mode != undefined && (
          <Input
            label={t("product.details.spec.display_type").toString()}
            //placeholder={t('product.details.spec.display_type').toString()}
            value={spec.display.lcd_mode}
            leftIconContainerStyle={{}}
            maxLength={256}
            onChange={(e) => {
              let tmpSpec = spec;
              tmpSpec.display.lcd_mode = e.nativeEvent.text;
              setSpec({ ...tmpSpec });
            }}
          />
        )}
        {spec.camera &&
          spec.camera.back_camera &&
          spec.camera.back_camera.resolution != undefined && (
            <Input
              label={t("product.details.spec.camera_back__mp").toString()}
              //placeholder={t('product.details.spec.camera_back__mp').toString()}
              value={spec.camera.back_camera.resolution}
              leftIconContainerStyle={{}}
              keyboardType="numeric"
              maxLength={256}
              onChange={(e) => {
                let tmpSpec = spec;
                tmpSpec.camera.back_camera.resolution = e.nativeEvent.text;
                setSpec({ ...tmpSpec });
              }}
            />
          )}
        {spec.camera &&
          spec.camera.front_camera &&
          spec.camera.front_camera.resolution != undefined && (
            <Input
              label={t("product.details.spec.camera_front__mp").toString()}
              //placeholder={t('product.details.spec.camera_front__mp').toString()}
              value={spec.camera.front_camera.resolution}
              leftIconContainerStyle={{}}
              keyboardType="numeric"
              maxLength={256}
              onChange={(e) => {
                let tmpSpec = spec;
                tmpSpec.camera.front_camera.resolution = e.nativeEvent.text;
                setSpec({ ...tmpSpec });
              }}
            />
          )}

        {spec.inside &&
          spec.inside.processor &&
          spec.inside.processor &&
          spec.inside.processor &&
          spec.inside.processor.cpu != undefined && (
            <Input
              label={t("product.details.spec.cpu_type").toString()}
              //placeholder={t('product.details.spec.cpu_type').toString()}
              value={spec.inside.processor.cpu}
              leftIconContainerStyle={{}}
              maxLength={256}
              onChange={(e) => {
                let tmpSpec = spec;
                tmpSpec.inside.processor.cpu = e.nativeEvent.text;
                setSpec({ ...tmpSpec });
              }}
            />
          )}

        {spec.inside &&
          spec.inside.battery &&
          spec.inside.battery.cell_i != undefined && (
            <Input
              label={t("product.details.spec.battery_capacity").toString()}
              //placeholder={t('product.details.spec.battery_capacity').toString()}
              value={spec.inside.battery.cell_i}
              leftIconContainerStyle={{}}
              keyboardType="numeric"
              maxLength={256}
              onChange={(e) => {
                let tmpSpec = spec;
                tmpSpec.inside.battery.cell_i = e.nativeEvent.text;
                setSpec({ ...tmpSpec });
              }}
            />
          )}
        {spec.inside &&
          spec.inside.battery &&
          spec.inside.battery.style != undefined && (
            <Input
              label={t("product.details.spec.battery_technology").toString()}
              //placeholder={t('product.details.spec.battery_technology').toString()}
              value={spec.inside.battery.style}
              leftIconContainerStyle={{}}
              maxLength={256}
              onChange={(e) => {
                let tmpSpec = spec;
                tmpSpec.inside.battery.style = e.nativeEvent.text;
                setSpec({ ...tmpSpec });
              }}
            />
          )}
        {spec.inside.software &&
          spec.inside.software &&
          spec.inside.software.os != undefined && (
            <Input
              label={t("product.details.spec.software_os").toString()}
              //placeholder={t('product.details.spec.software_os').toString()}
              value={spec.inside.software.os}
              leftIconContainerStyle={{}}
              maxLength={256}
              onChange={(e) => {
                let tmpSpec = spec;
                tmpSpec.inside.software.os = e.nativeEvent.text;
                setSpec({ ...tmpSpec });
              }}
            />
          )}
        {spec.inside.software &&
          spec.inside.software &&
          spec.inside.software.os_version != undefined && (
            <Input
              label={t("product.details.spec.software_os_version").toString()}
              //placeholder={t('product.details.spec.software_os_version').toString()}
              value={spec.inside.software.os_version}
              leftIconContainerStyle={{}}
              maxLength={256}
              onChange={(e) => {
                let tmpSpec = spec;
                tmpSpec.inside.software.os_version = e.nativeEvent.text;
                setSpec({ ...tmpSpec });
              }}
            />
          )}
        {spec.inside &&
          spec.inside.storage &&
          spec.inside.storage.capacity != undefined && (
            <Input
              label={t("product.details.spec.storage_capacity_gb").toString()}
              //placeholder={t('product.details.spec.storage_capacity_gb').toString()}
              value={spec.inside.storage.capacity}
              leftIconContainerStyle={{}}
              keyboardType="numeric"
              maxLength={256}
              onChange={(e) => {
                let tmpSpec = spec;
                tmpSpec.inside.storage.capacity = e.nativeEvent.text;
                setSpec({ ...tmpSpec });
              }}
            />
          )}
        {spec.inside &&
          spec.inside.ram &&
          spec.inside.ram.capacity != undefined && (
            <Input
              label={t("product.details.spec.ram_capacity_gb").toString()}
              //placeholder={t('product.details.spec.ram_capacity_gb').toString()}
              value={spec.inside.ram.capacity}
              leftIconContainerStyle={{}}
              keyboardType="numeric"
              maxLength={256}
              onChange={(e) => {
                let tmpSpec = spec;
                tmpSpec.inside.ram.capacity = e.nativeEvent.text;
                setSpec({ ...tmpSpec });
              }}
            />
          )}

        {spec.design &&
          spec.design.body &&
          spec.design.body.colors != undefined && (
            <Input
              label={t("product.details.spec.color").toString()}
              //placeholder={t('product.details.spec.color').toString()}
              value={spec.design.body.colors}
              leftIconContainerStyle={{}}
              maxLength={256}
              onChange={(e) => {
                let tmpSpec = spec;
                tmpSpec.design.body.colors = e.nativeEvent.text;
                setSpec({ ...tmpSpec });
              }}
            />
          )}
        <Text style={{ marginBottom: 60 }}></Text>
      </View>
    </ScrollView>
  );
}
