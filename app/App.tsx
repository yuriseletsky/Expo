import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Profile } from './components/Profile';
import { Compare } from './components/Compare/Compare';
import { Navigation } from './components/Navigation/Navigation';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './components/Translations/en.json'
import ua from './components/Translations/ua.json'
import ru from './components/Translations/ru.json'
//import { getLanguage } from './components/Storage/Language';
const resources = {
  en: {
    translation: en,
  },
  ua: {
    translation: ua,
  },
  ru: {
    translation: ru,
  }
};
i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'ua',
  compatibilityJSON: 'v3',
  interpolation: {
    escapeValue: false
  }
});


export default function App() {

  // let lang = 'en';
  // React.useEffect(() => {
  //   getLanguage().then((settings) => {
  //     if (settings != "") {
  //       console.log("settings", settings);
  //       lang = settings;
  //     }
  //     return lang;
  //   }).then(async ln => {
  //     await i18n.use(initReactI18next).init({
  //       resources,
  //       lng: `${ln}`,
  //       fallbackLng: 'ua',
  //       compatibilityJSON: 'v3',
  //       interpolation: {
  //         escapeValue: false
  //       }
  //     });
  //   })
  // }, [])
  return (
    <Navigation />
  );
}