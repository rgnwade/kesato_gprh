import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { IntlProvider, addLocaleData } from "react-intl";
import en from "react-intl/locale-data/en";
import fr from "react-intl/locale-data/fr";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

import config from "./config";
import localeData from "./locales/data.json";
import store from "./redux/store";

import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import "./assets/styles/scss/style.scss";

import "popper.js/dist/popper.js";
import "bootstrap/dist/js/bootstrap.js";

addLocaleData([...en, ...fr]);
const language =
  config.defaultLocale ||
  (navigator.languages && navigator.languages[0]) ||
  navigator.language ||
  navigator.userLanguage;
const messages = localeData[config.defaultLanguage] || localeData.en;

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider locale={language} messages={messages}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </IntlProvider>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
