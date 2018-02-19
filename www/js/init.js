var base_uri;
if (!isEmpty(window.localStorage.getItem("explorer"))) {
    base_uri = window.localStorage.getItem("explorer");
} else {
    base_uri = "https://garlicinsight.com";
}
window.onload = function () {
    document.addEventListener("deviceready", onDeviceReady, false);

    function onDeviceReady() {
        window.localStorage.setItem("totalGrlc", 0);
        checkTextZoom();
        getSavedAddresses();
        addAddressOnClick();
        scanQRCode();
        saveSelectedExplorer();
        renameWallet();
        saveSelectedCurrency();
        calculateTotal();
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
        window.location.reload();
    })
}

function saveSelectedCurrency() {
//save the selected explorer in the localStorage
    $('#explorerSelectCurrency').on('change', function () {
        window.localStorage.setItem("currency", this.value);
        window.location.reload();
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
        window.location.reload();
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
            }
        }
    }
    if(!isEmpty(window.localStorage.getItem("explorer"))){
        //temporary fix for new update.
        if(window.localStorage.getItem("explorer") === "https://garlicinsight.com/insight-grlc-api/"){
            window.localStorage.setItem("explorer","https://garlicinsight.com");
        } else if (window.localStorage.getItem("explorer") === "http://garlicoinexplorer.us.to") {
            window.localStorage.setItem("explorer", "https://garlicoinexplorer.com");
        }
        //use the official Explorer if none is selected
        if(isEmpty($('#explorerSelect').val())){
            window.localStorage.setItem("explorer","https://garlicinsight.com");
        }
        //preselect saved Explorer.
        $("#explorerSelect").val(window.localStorage.getItem("explorer")).change();
    }
    if (isEmpty(window.localStorage.getItem("currency"))) {
        window.localStorage.setItem("currency", "USD");
    }
    $("#explorerSelectCurrency").val(window.localStorage.getItem("currency")).change();


}
//Functions for the list elements
function goTo(id) {
    address = id;
    address = address.substring(address.indexOf('o_') + 2);
    window.localStorage.setItem("selectedWallet", address);
    document.location.href = "wallet.html";
}

function openRenameModal(id) {
    address = id;
    address = address.substring(address.indexOf('e_') + 2);
    walletname = $('#'+address+'_nickname').text();
    $('#addressRenamed').val(address);
    $('#oldName').val(walletname);
}

function renameWallet() {
    $("#btnRenameWallet").click(function() {
        newName = $('#inRenameName').val();
        address =  $('#addressRenamed').val();
        var saveArray = new Array();
        saveArray.push({address: address, nickname: newName});
        window.localStorage.setArray(address, saveArray);
        window.location.reload();
    });
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

function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};


function calculateTotal() {
    $.when(getCurrencyValue()).done(function (a1) {
        // $('#calcTotal').show().click(function () {
        //     getTotalValue();
        // });
        getTotalValue();
    });
}

function getCurrencyValue() {
    var currency = window.localStorage.getItem("currency");
    var url;
    if (currency === "USD") {
        url = "https://api.coinmarketcap.com/v1/ticker/garlicoin/";
    } else if (currency === "EUR") {
        url = "https://api.coinmarketcap.com/v1/ticker/garlicoin/?convert=EUR";
    } else if (currency === "BTC") {
        url = "https://api.coinmarketcap.com/v1/ticker/garlicoin/?convert=BTC";
    } else {
        url = "https://api.coinmarketcap.com/v1/ticker/garlicoin/";
    }
    $('#calcTotal').hide();
    return $.ajax({
        url: url,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (data) {
            var price = 0;
            if (currency === "EUR") {
                price = (parseFloat(precisionRound(data[0].price_eur, 2))).formatMoney(2);
            } else if (currency === "BTC") {
                price = parseFloat(data[0].price_btc, 6);
            } else {
                price = (parseFloat(precisionRound(data[0].price_usd, 2))).formatMoney(2);
            }
            var result = {
                currency: currency,
                price: price
            };
            window.localStorage.setItem("coin_value", result.price);
        },
        error: function (data) {
            throw "Es ist ein Fehler aufgetreten."
        }
    });
}


function getTotalValue() {
    var totalAmountGRLC = 0;
    for (i = 0; i < window.localStorage.length; i++) {
        var savedWallets = window.localStorage;
        for (i = 0; i < savedWallets.length; i++) {
            var addr = savedWallets.key(i);
            if (!isEmpty(addr) && (addr.startsWith("G")) || addr.startsWith("g")) {
                var array = window.localStorage.getArray(addr);
                array = array[0];
                $.when(getBalance(array.address)).done(function (a2) {
                });
            }
        }
    }

    $(document).ajaxStop(function () {
        var currency = window.localStorage.getItem("currency");
        var value = window.localStorage.getItem("coin_value");
        totalAmountGRLC = window.localStorage.getItem("totalGrlc");
        var price
        if (currency == "BTC") {
            price = precisionRound(parseFloat(value) * parseFloat(totalAmountGRLC), 6);
        } else {
            price = precisionRound(parseFloat(value) * parseFloat(totalAmountGRLC), 2);
        }
        var data = {totalGrlc: totalAmountGRLC, totalWorth: price, currency: currency};
        document.getElementById("totalValue").innerHTML = tmpl("tmpl-totalValue", data);
        window.localStorage.setItem("totalValue", 0);
        window.localStorage.setItem("totalGrlc", 0);
    });
}

function getBalance(address) {
    var url;
    if (base_uri === "https://garlicinsight.com" || base_uri === "https://garlicoinexplorer.com") {
        url = base_uri + '/insight-grlc-api/addr/' + address + "?noTxList=1";
        return $.ajax({
            url: url,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (result) {
                var balance = result.balance;
                balance = precisionRound(balance, 4);
                var totalAmount = window.localStorage.getItem("totalGrlc");
                var total = parseFloat(totalAmount) + balance;
                window.localStorage.setItem("totalGrlc", total);
            },
            error: function (result) {
                throw "Es ist ein Fehler aufgetreten."
            }
        });
    } else {
        url = base_uri + "/ext/getbalance/" + address;
        return $.ajax({
            url: url,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (result) {
                var balance = precisionRound(result, 4);
                var totalAmount = window.localStorage.getItem("totalGrlc");
                var total = parseFloat(totalAmount) + balance;
                window.localStorage.setItem("totalGrlc", total);
            },
            error: function (result) {
                throw "Es ist ein Fehler aufgetreten."
            }
        });
    }
}