import React, { useEffect, useState } from "react";
import {
  Animated,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { SceneMap } from "react-native-tab-view";
import { CheckBox, Tab, TabView, Text } from "@rneui/themed";
import { Card, ListItem, Button, Icon, Avatar } from "@rneui/themed";
import MessageService, {
  DialogListsResponse,
} from "../../services/MessageService";
import { StackNavigationProp } from "@react-navigation/stack";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { t } from "i18next";
import LogServices from "../../services/LogServices";
export type DialogParamList = {
  Dialog: {} | undefined;
};
export function UserMessangesList(): JSX.Element {
  const navigation = useNavigation<StackNavigationProp<DialogParamList>>();
  const [dialogLists, setDialogLists] = React.useState<DialogListsResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const isFocused = useIsFocused();
  const [index, setIndex] = React.useState(0);
  const [tabIndex, setTabIndex] = useState<number>(0);

  const [routes] = React.useState([
    { key: "first", title: "Private" },
    { key: "second", title: "Public" },
  ]);

  const PrivateMessages = () => (
    <View style={{ flex: 1, marginTop: 5 }}>
      <Card>
        {!(
          dialogLists?.privateMessages && dialogLists?.privateMessages.length
        ) && (
          <Text style={{ textAlign: "center" }}>
            {t("not_message").toString()}
          </Text>
        )}
        {dialogLists?.privateMessages.map((u, i) => {
          let dateStr = u.lastMessage.dateCreate;
          let hours = new Date(Date.parse(dateStr)).getHours();
          let minutes = new Date(Date.parse(dateStr)).getMinutes();
          return (
            <Button
              title={
                <View style={styles.messagePreviewTitle}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.authorName}>{u.userName}</Text>
                    <Text
                      style={{ paddingLeft: 80 }}
                    >{`${hours}:${minutes}`}</Text>
                  </View>
                  <Text>
                    {u.lastMessage.messageText.length > 30
                      ? `${u.lastMessage.messageText.substring(0, 30)}...`
                      : u.lastMessage.messageText}
                  </Text>
                </View>
              }
              key={i}
              type="outline"
              icon={
                u.userPhoto != null ? (
                  <Avatar
                    overlayContainerStyle={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      alignSelf: "center",
                    }}
                    containerStyle={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      marginRight: 10,
                      alignSelf: "center",
                    }}
                    source={{
                      uri: `https://res.cloudinary.com/ltopcloud/image/upload/ar_1:1,c_pad,dn_50,w_1500/${u.userPhoto.photoStr}.jpg`,
                    }}
                    key={`avatar-${i}`}
                  />
                ) : (
                  {
                    name: "user",
                    type: "font-awesome",
                    style: {
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      alignSelf: "center",
                    },
                  }
                )
              }
              iconContainerStyle={styles.iconContainer}
              buttonStyle={styles.button}
              onPress={() => {
                navigation.navigate("Dialog", { dialogId: u.userGuid });
              }}
            />
          );
        })}
      </Card>
    </View>
  );
  const PublicMessages = () => (
    <View style={{ flex: 1, marginTop: 5, marginHorizontal: 15 }}>
      <Card>
        {!(
          dialogLists?.publicMessages && dialogLists?.publicMessages.length
        ) && (
          <Text style={{ textAlign: "center" }}>
            {t("not_message").toString()}
          </Text>
        )}
        {dialogLists?.publicMessages.map((u, i) => {
          return (
            <Button
              title={
                <View style={styles.messagePreviewTitle}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.authorName}>
                      {(u as any).advertName}
                    </Text>
                  </View>
                </View>
              }
              key={i}
              type="outline"
              icon={
                u.userPhoto != null ? (
                  <Avatar
                    overlayContainerStyle={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      alignSelf: "center",
                    }}
                    containerStyle={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      marginRight: 10,
                      alignSelf: "center",
                    }}
                    source={{
                      uri: `https://res.cloudinary.com/ltopcloud/image/upload/ar_1:1,c_pad,dn_50,w_1500/${u.userPhoto.photoStr}.jpg`,
                    }}
                    key={`avatar-${i}`}
                  />
                ) : (
                  {
                    name: "user",
                    type: "font-awesome",
                    style: {
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      alignSelf: "center",
                    },
                  }
                )
              }
              iconContainerStyle={styles.iconContainer}
              buttonStyle={styles.button}
              onPress={() => {
                navigation.navigate("Dialog", { dialogId: u.userGuid });
              }}
            />
          );
        })}
      </Card>
    </View>
  );
  const renderScene = SceneMap({
    first: PrivateMessages,
    second: PublicMessages,
  });
  const renderTabBar = (props: any) => {
    const inputRange = props.navigationState.routes.map(
      (x: string, i: string) => i
    );

    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route: any, i: any) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex: string) =>
              inputIndex === i ? 1 : 0.5
            ),
          });

          return (
            <TouchableOpacity
              key={i}
              style={styles.tabItem}
              onPress={() => setIndex(i)}
            >
              <Animated.Text style={{ opacity }}>{route.title}</Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  // const PrivatePublicTabs = () => {
  //     return (
  //         <TabView
  //             navigationState={{ index, routes }}
  //             renderScene={renderScene}
  //             renderTabBar={renderTabBar}
  //             onIndexChange={setIndex}
  //             style={{ height: 700 }}
  //         />
  //     )
  // }
  const loadMessageLists = async () => {
    LogServices.Log("loadMessageLists", "warning");
    const _dialogLists = await MessageService.getMessangeLists();
    console.log("LAST MESSAGE = ", _dialogLists.privateMessages[0].lastMessage);
    console.log("load message");
    await setDialogLists(_dialogLists);
    console.log("dialogLists", dialogLists);
    setIsLoading(false);
  };

  useEffect(() => {
    loadMessageLists();
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
    <View>
      <ScrollView>
        {/* <PrivatePublicTabs /> */}
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
            title={t("Private").toString()}
            titleStyle={{ fontSize: 12 }}
            icon={{ name: "file-text", type: "font-awesome", color: "white" }}
          />
          <Tab.Item
            title={t("Public").toString()}
            titleStyle={{ fontSize: 12 }}
            icon={{ name: "microchip", type: "font-awesome", color: "white" }}
          />
        </Tab>
        <TabView
          containerStyle={{ height: 800 }}
          value={tabIndex}
          onChange={setTabIndex}
          animationType="spring"
        >
          <TabView.Item style={{ width: "100%" }}>
            <PrivateMessages />
          </TabView.Item>
          <TabView.Item style={{ width: "100%" }}>
            <PublicMessages />
          </TabView.Item>
        </TabView>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 10,
  },
  container: {
    flex: 1,
  },
  fonts: {
    marginBottom: 8,
  },
  authorName: {
    fontWeight: "bold",
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
    borderRadius: 15,
  },
  messagePreviewTitle: {
    justifyContent: "flex-start",
    flexDirection: "column",
    flexWrap: "wrap",
  },
  iconContainer: {
    // paddingRight: 35,
    // left: 20,
  },
  button: {
    justifyContent: "flex-start",
    paddingVertical: 20,
    borderColor: "black",
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
});
