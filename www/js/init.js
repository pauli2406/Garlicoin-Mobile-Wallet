window.onload = function () {
    getSavedAddresses();
    addAddressOnClick();
    scanQRCode();
};
function addAddressOnClick() {
    $('#btnAddAddress').click(function () {
        var address = $('#inAddAddress').val();
        var data = {address: address};
        var entries = document.getElementById("address_list").innerHTML;
        document.getElementById("address_list").innerHTML = tmpl("tmpl-transList", data);
        $('#btn_delete').click(function () {
            deleteListEntry();
        });
        $('#btn_goTo').click(function () {
            document.location.href = "wallet.html";
        });
        window.localStorage.setItem("walletAddress",address);
    })
}

function scanQRCode() {
    $('#btnScanQr').click(function () {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                window.localStorage.setItem("walletAddress", result.text);
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
        var address = window.localStorage.getItem("walletAddress");
        var data = {address: address};
        if(!isEmpty(address)) {
            document.getElementById("address_list").innerHTML = tmpl("tmpl-transList", data);
            $('#btn_goTo').click(function () {
                document.location.href = "wallet.html";
            });
            $('#btn_delete').click(function () {
                deleteListEntry();
            });
        }
    }
}

function deleteListEntry() {
    //delete visually
    $("#div_list_item").remove();
    //remove from local storage
    window.localStorage.removeItem("walletAddress");
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}