/**************************************Globals*********************************************************************************************/
if(!isEmpty(window.localStorage.getItem("explorer"))){
    var base_uri = window.localStorage.getItem("explorer");
}else{
    var base_uri = "https://garlicinsight.com";
}
/******************************************Crawl Data from the Explorer********************************************************************/

//This only should be a temporary way until a good API is found to get these informations!
function getTableData() {
    var wallet = window.localStorage.getItem("selectedWallet");
    if (base_uri === "https://garlicinsight.com" || base_uri === "https://garlicoinexplorer.com") {
        var url = base_uri + '/insight-grlc-api/addrs/'+wallet+'/txs?from=0&to=25';
        $.ajax({
            url: url,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async:true,
            success: function (result) {
                var wallet = window.localStorage.getItem("selectedWallet");
                var data = {
                    last_txs: [],
                    insight: true,
                    explorerUrl: base_uri
                };

                for(i= 0; i < result.items.length; i++){
                    var amount = "";
                    var timestamp;
                    //Transactions spend GRLC
                    for(n= 0; n < result.items[i].vin.length; n++) {
                        if(result.items[i].vin[n].addr === wallet ){
                            timestamp = moment.unix(result.items[i].time).format("Do MMM YYYY HH:mm:ss");
                            data.last_txs.push({
                                "transactionId": result.items[i].txid,
                                "confirmations": result.items[i].confirmations,
                                "amount": "-" + result.items[i].vin[0].value,
                                "fees": result.items[i].fees,
                                "timestamp": timestamp
                            });
                        }
                    }
                    //Transactions recieved GRLC
                    for(m= 0; m < result.items[i].vout.length; m++) {
                        if (result.items[i].vout[m].scriptPubKey.addresses[0] === wallet) {
                            timestamp = moment.unix(result.items[i].time).format("Do MMM YYYY HH:mm:ss");
                            amount = result.items[i].vout[m].value;
                            data.last_txs.push({
                                "transactionId": result.items[i].txid,
                                "confirmations": result.items[i].confirmations,
                                "amount": "+" + amount,
                                "fees": result.items[i].fees,
                                "timestamp": timestamp
                            });
                        }
                    }

                }
                document.getElementById("transTable").innerHTML = tmpl("tmpl-lastTrans", data);
            },
            error: function (result) {
                throw "Es ist ein Fehler aufgetreten."
            }
        });
    }else {
        $.get(base_uri + '/address/' + wallet, function (response) {
            //Split and substring the data from the crawler to our Array with informations
            var subbed = response.substring(response.indexOf('<th class="hidden-xs">Timestamp</th>') + 1);
            subbed = subbed.substring(subbed.indexOf('<tbody>') + 1);
            subbed = subbed.substring(0, subbed.indexOf('</tbody>'));
            subbed = subbed.substring(subbed.indexOf('href') + 1);
            var dataArray = subbed.split("href=");
            var transId = dataArray[0].substring();
            var data = {
                last_txs: [],
                insight: false,
                explorerUrl: base_uri
            };

            for (i = 0; i < dataArray.length && i < 24; i++) {
                var info = dataArray[i].split(">");
                var transactionId = '';
                var status = '';
                var amount = '';
                var date = '';

                if (!isEmpty(info[1])) {
                    transactionId = info[1].substring(0, info[1].indexOf('</a'));
                }
                if (!isEmpty(info[3])) {
                    status = info[3].substring(info[3].indexOf('<td class="') + 1);
                    status = status.substring(status.indexOf('"') + 1);
                    status = status.substring(0, status.indexOf('"'));
                }
                if (!isEmpty(info[4])) {
                    amount = info[4].substring(0, info[4].indexOf('</td'));
                }
                if (!isEmpty(info[8])) {
                    date = info[8].substring(0, info[8].indexOf('</td'));
                }

                data.last_txs.push({
                    "transactionId": transactionId,
                    "status": status,
                    "amount": amount,
                    "date": date
                });
            }
            //Build the table
            document.getElementById("transTable").innerHTML = tmpl("tmpl-lastTrans", data);
        });
    }
}

/**********************************************************AJAX-Calls********************************************************************/

function getBalance(price, currency) {
    //get current Balance from saved Wallet. Has to be changed if multiple Wallets should be possible
    var walletAddress = window.localStorage.getItem("selectedWallet");
    var url;
    if (base_uri === "https://garlicinsight.com" || base_uri === "https://garlicoinexplorer.com") {
        url = base_uri + '/insight-grlc-api/addr/' + walletAddress;
        balanceAjax(url, price, currency);
    }else{
        url = base_uri + "/ext/getaddress/" + walletAddress;
        balanceAjax(url, price, currency);
    }
}

function balanceAjax(url, price, currency) {
    $.ajax({
        url: url,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async:true,
        success: function (result) {
            balance = result.balance;
            balance = precisionRound(balance, 4);
            if (currency !== "BTC") {
                value = precisionRound(balance * parseFloat(price), 2);
            } else {
                value = precisionRound(balance * parseFloat(price), 6);
            }
            var finalResult = {
                currency: currency,
                price: value,
                balance: balance
            };
            document.getElementById("totalBalance").innerHTML = tmpl("tmpl-totalBalance", finalResult);
        },
        error: function (result) {
            throw "Es ist ein Fehler aufgetreten."
        }
    });
}

function getBlockDifficulty() {
    //get current Difficulty from the explorer API
    var url;
    if (base_uri === "https://garlicinsight.com" || base_uri === "https://garlicoinexplorer.com") {
        url = base_uri + '/insight-grlc-api/status?q=getDifficulty';
        $.ajax({
            url: url,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (data) {
                data.difficulty = precisionRound(data.difficulty, 2);
                document.getElementById("blockDiff").innerHTML = tmpl("tmpl-blockDiff", data.difficulty);
            },
            error: function (data) {
                throw "Es ist ein Fehler aufgetreten."
            }
        });
    }else {
        url = base_uri + "/api/getdifficulty";
        $.ajax({
            url: url,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (data) {
                data = precisionRound(data, 2);
                document.getElementById("blockDiff").innerHTML = tmpl("tmpl-blockDiff", data);
            },
            error: function (data) {
                throw "Es ist ein Fehler aufgetreten."
            }
        });
    }
}

function getBlockcount() {
    //get current Blockcount from the explorer API
    var url;
    if (base_uri === "https://garlicinsight.com" || base_uri === "https://garlicoinexplorer.com") {
        url = base_uri + '/insight-grlc-api/status?q=getInfo';
        $.ajax({
            url: url,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (data) {
                document.getElementById("blockCount").innerHTML = tmpl("tmpl-blockCount", data.info.blocks);
            },
            error: function (data) {
                throw "Es ist ein Fehler aufgetreten."
            }
        });
    }else {
        url = base_uri + "/api/getblockcount";
        $.ajax({
            url: url,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            success: function (data) {
                document.getElementById("blockCount").innerHTML = tmpl("tmpl-blockCount", data);
            },
            error: function (data) {
                throw "Es ist ein Fehler aufgetreten."
            }
        });
    }
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
    $.ajax({
        url: url,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async:true,
        success: function (data) {
            var priceSpan;
            var price_eur;
            var day_volume_eur;
            var price_btc;
            var day_volume_btc;
            var price_usd;
            var day_volume_usd;
            if(parseFloat(data[0].percent_change_24h)< 0){
                color = "red";
            }else{
                color = "green";
            }
            if (currency === "EUR") {
                price_eur = (parseFloat(precisionRound(data[0].price_eur, 2))).formatMoney(2);
                day_volume_eur = (parseFloat(data[0]["24h_volume_eur"])).formatMoney(2);
            } else if (currency === "BTC") {
                price_btc = parseFloat(data[0].price_btc, 6);
                day_volume_btc = (parseFloat(data[0]["24h_volume_btc"])).formatMoney(2);
            } else {
                price_usd = (parseFloat(precisionRound(data[0].price_usd, 2))).formatMoney(2);
                day_volume_usd = (parseFloat(data[0]["24h_volume_usd"])).formatMoney(2);
            }
            var result = {
                currency: currency,
                pricePerUsd: price_usd,
                totalValue: data[0].price_usd,
                price_btc: precisionRound(price_btc, 6),
                volume_btc: day_volume_btc,
                price_eur: price_eur,
                volume_eur: day_volume_eur,
                rank: data[0].rank,
                volume_usd: day_volume_usd,
                percent_change_color: color,
                percent_change_1h: data[0].percent_change_1h,
                percent_change_24h: data[0].percent_change_24h
            };
            //build the balance infobox
            if (currency === "EUR") {
                getBalance(price_eur, currency);
            } else if (currency === "BTC") {
                getBalance(price_btc, currency);
            } else {
                getBalance(price_usd, currency);
            }
            //Fill the Infobox with the current Rank and add the template
            document.getElementById("rankField").innerHTML = tmpl("tmpl-rank", data[0].rank);
            document.getElementById("GarlicValue").innerHTML = tmpl("tmpl-GarlicValue", result);
        },
        error: function (data) {
            throw "Es ist ein Fehler aufgetreten."
        }
    });
}

/**********************************************************UTILS*************************************************************************/
function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

Number.prototype.formatMoney = function(c, d, t){
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

/*****************************************************************************************************************************************/


window.onload = function () {
    getCurrencyValue();
    getTableData();
    getBlockDifficulty();
    getBlockcount();
    $('#reloadTrans').click(function () {
        getData();
    });
    PullToRefresh.init({
        onRefresh: function () {
            window.location.reload();
        }
    });

};