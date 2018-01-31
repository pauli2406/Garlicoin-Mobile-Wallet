window.onload = function () {
    MobileAccessibility.usePreferredTextZoom(false);
    MobileAccessibility.setTextZoom(75);

    getSavedAddresses();
    addAddressOnClick();
    scanQRCode();
};
function addAddressOnClick() {
    $('#btnAddAddress').click(function () {
        var address = $('#inAddAddress').val();
        var nickname = $('#inNickname').val();
        var saveArray = new Array();
        saveArray.push({address: address,nickname: nickname});
        window.localStorage.setArray(address,saveArray);

        var entries = document.getElementById("address_list").innerHTML;

        var data = {address: address, nickname: nickname};

        document.getElementById("address_list").innerHTML = entries + tmpl("tmpl-transList", data);

        // window.localStorage.setItem(address, address);
    })
}

function scanQRCode() {
    $('#btnScanQr').click(function () {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                var saveArray = new Array();
                var nickname = $('#inNickname').val();
                saveArray.push({address: result.text, nickname: nickname });
                window.localStorage.setItem("selectedWallet", result.text);
                window.localStorage.setArray(result.text,saveArray);
                document.location.href = "wallet.html";
                // window.localStorage.setItem(result.text, result.text);

            },
            function (error) {
                alert("Scanning failed: " + error);
            },
            {
                preferFrontCamera: false, // iOS and Android
                showFlipCameraButton: true, // iOS and Android
                showTorchButton: true, // iOS and Android
                torchOn: false, // Android, launch with the torch switched on (if available)
                saveHistory: true, // Android, save scan history (default false)
                prompt: "Place a barcode with your wallet address inside the scan area", // Android
                resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                formats: "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                disableAnimations: true, // iOS
                disableSuccessBeep: false // iOS and Android
            }
        );
    });
}

function getSavedAddresses() {
    for (i = 0; i < window.localStorage.length; i++) {
        var savedWallets = window.localStorage;
        debugger;
        for (i = 0; i < savedWallets.length; i++) {
            debugger;
            var addr = savedWallets.key(i);
            if (!isEmpty(addr) && (addr.startsWith("G")) || addr.startsWith("g")) {

                debugger;
                var array = window.localStorage.getArray(addr);
                array = array[0];
                var data = {address: array.address, nickname: array.nickname};


                var entries = document.getElementById("address_list").innerHTML;
                document.getElementById("address_list").innerHTML = entries + tmpl("tmpl-transList", data);
                var address = addr;
            }
        }
    }
}

function goTo(id) {
    address = id;
    address = address.substring(address.indexOf('o_') + 2);
    window.localStorage.setItem("selectedWallet", address);
    document.location.href = "wallet.html";
}

function delItem(id) {
    address = id;
    address = address.substring(address.indexOf('l_') + 2);
    deleteListEntry(address);
    window.localStorage.removeItem(address);
}

function deleteListEntry(address) {
    //delete visually
    $("#div_" + address).remove();
    //remove from local storage
    window.localStorage.removeItem(address);
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

Storage.prototype.setArray = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getArray = function(key) {
    return JSON.parse(this.getItem(key))
}