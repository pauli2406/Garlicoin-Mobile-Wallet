cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-device.device",
      "file": "plugins/cordova-plugin-device/www/device.js",
      "pluginId": "cordova-plugin-device",
      "clobbers": [
        "device"
      ]
    },
    {
      "id": "cordova-plugin-dialogs.notification",
      "file": "plugins/cordova-plugin-dialogs/www/notification.js",
      "pluginId": "cordova-plugin-dialogs",
      "merges": [
        "navigator.notification"
      ]
    },
    {
      "id": "cordova-plugin-dialogs.notification_android",
      "file": "plugins/cordova-plugin-dialogs/www/android/notification.js",
      "pluginId": "cordova-plugin-dialogs",
      "merges": [
        "navigator.notification"
      ]
    },
    {
      "id": "cordova-plugin-inappbrowser.inappbrowser",
      "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
      "pluginId": "cordova-plugin-inappbrowser",
      "clobbers": [
        "cordova.InAppBrowser.open"
      ]
    },
    {
      "id": "cordova-plugin-listpicker.ListPicker",
      "file": "plugins/cordova-plugin-listpicker/www/ListPicker.js",
      "pluginId": "cordova-plugin-listpicker",
      "clobbers": [
        "window.plugins.listpicker"
      ]
    },
    {
      "id": "cordova-plugin-network-information.network",
      "file": "plugins/cordova-plugin-network-information/www/network.js",
      "pluginId": "cordova-plugin-network-information",
      "clobbers": [
        "navigator.connection"
      ]
    },
    {
      "id": "cordova-plugin-network-information.Connection",
      "file": "plugins/cordova-plugin-network-information/www/Connection.js",
      "pluginId": "cordova-plugin-network-information",
      "clobbers": [
        "Connection"
      ]
    },
    {
      "id": "cordova-plugin-statusbar.statusbar",
      "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
      "pluginId": "cordova-plugin-statusbar",
      "clobbers": [
        "window.StatusBar"
      ]
    },
    {
      "id": "phonegap-plugin-barcodescanner.BarcodeScanner",
      "file": "plugins/phonegap-plugin-barcodescanner/www/barcodescanner.js",
      "pluginId": "phonegap-plugin-barcodescanner",
      "clobbers": [
        "cordova.plugins.barcodeScanner"
      ]
    },
    {
      "id": "phonegap-plugin-mobile-accessibility.mobile-accessibility",
      "file": "plugins/phonegap-plugin-mobile-accessibility/www/mobile-accessibility.js",
      "pluginId": "phonegap-plugin-mobile-accessibility",
      "clobbers": [
        "window.MobileAccessibility"
      ]
    },
    {
      "id": "phonegap-plugin-mobile-accessibility.MobileAccessibilityNotifications",
      "file": "plugins/phonegap-plugin-mobile-accessibility/www/MobileAccessibilityNotifications.js",
      "pluginId": "phonegap-plugin-mobile-accessibility",
      "clobbers": [
        "MobileAccessibilityNotifications"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-console": "1.1.0",
    "cordova-plugin-device": "2.0.4-dev",
    "cordova-plugin-dialogs": "2.0.2",
    "cordova-plugin-inappbrowser": "5.0.0",
    "cordova-plugin-listpicker": "2.2.2",
    "cordova-plugin-network-information": "3.0.0-dev",
    "cordova-plugin-statusbar": "2.4.3",
    "cordova-plugin-whitelist": "1.2.2",
    "phonegap-plugin-barcodescanner": "8.1.0",
    "phonegap-plugin-mobile-accessibility": "1.0.5-dev"
  };
});