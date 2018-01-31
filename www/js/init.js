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
        var data = {address: address};
        var entries = document.getElementById("address_list").innerHTML;
        document.getElementById("address_list").innerHTML = entries + tmpl("tmpl-transList", data);
        window.localStorage.setItem(address, address);
    })
}

function scanQRCode() {
    $('#btnScanQr').click(function () {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                window.localStorage.setItem(result.text, result.text);
                window.localStorage.setItem("selectedWallet", result.text);
                document.location.href = "wallet.html";
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
        for (i = 0; i < savedWallets.length; i++) {
            var addr = savedWallets.key(i);
            if (!isEmpty(addr) && (addr.startsWith("G")) || addr.startsWith("g")) {
                var data = {address: addr};
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