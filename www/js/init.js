window.onload = function () {
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        checkTextZoom();
        getSavedAddresses();
        addAddressOnClick();
        scanQRCode();
        saveSelectedExplorer();
    }
};


function checkTextZoom() {
//change the Text Zoom to 75% to remve rezising issues
    if(window.MobileAccessibility){
        window.MobileAccessibility.setTextZoom(75);
    }
}


function saveSelectedExplorer() {
//save the selected explorer in the localStorage
    $('#explorerSelect').on('change', function() {
        window.localStorage.setItem("explorer",this.value);
    })
}

function addAddressOnClick() {
//Save and add a new address list element
    $('#btnAddAddress').click(function () {
        var address = $('#inAddAddress').val();
        var nickname = $('#inNickname').val();
        var saveArray = new Array();
        saveArray.push({address: address,nickname: nickname});
        window.localStorage.setArray(address,saveArray);
        var entries = document.getElementById("address_list").innerHTML;
        var data = {address: address, nickname: nickname};
        document.getElementById("address_list").innerHTML = entries + tmpl("tmpl-transList", data);
    })
}

function scanQRCode() {
//scan a QR-Code, save the address, if nickname is set save the nickname too. Change view to the wallet
    $('#btnScanQr').click(function () {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                if(!result.cancelled) {
                    var saveArray = new Array();
                    var nickname = $('#inNickname').val();
                    saveArray.push({address: result.text, nickname: nickname});
                    window.localStorage.setItem("selectedWallet", result.text);
                    window.localStorage.setArray(result.text, saveArray);
                    document.location.href = "wallet.html";
                }

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
//retrieve all saved addresses from the local storage and add them to the list
    for (i = 0; i < window.localStorage.length; i++) {
        var savedWallets = window.localStorage;
        for (i = 0; i < savedWallets.length; i++) {
            var addr = savedWallets.key(i);
            if (!isEmpty(addr) && (addr.startsWith("G")) || addr.startsWith("g")) {
                var array = window.localStorage.getArray(addr);
                array = array[0];
                var data = {address: array.address, nickname: array.nickname};
                var entries = document.getElementById("address_list").innerHTML;
                document.getElementById("address_list").innerHTML = entries + tmpl("tmpl-transList", data);
                var address = addr;
            }
        }
    }

    if(!isEmpty(window.localStorage.getItem("explorer"))){
        //temporary fix for new update.
        debugger;
        if(window.localStorage.getItem("explorer") === "https://garlicinsight.com/insight-grlc-api/"){
            window.localStorage.setItem("explorer","https://garlicinsight.com");
        }

        //defaul set the official one if none is selected
        if(isEmpty($('#explorerSelect').val())){
            window.localStorage.setItem("explorer","https://garlicinsight.com");
        }
        //preselect saved Explorer.
        $("#explorerSelect").val(window.localStorage.getItem("explorer")).change();
    }
}

//Functions for the list elements
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


//UTILS
function isEmpty(str) {
    return (!str || 0 === str.length);
}

Storage.prototype.setArray = function(key, obj) {
   return this.setItem(key, JSON.stringify(obj))
};
Storage.prototype.getArray = function(key) {
    return JSON.parse(this.getItem(key))
};