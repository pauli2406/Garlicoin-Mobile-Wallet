/**************************************Globals*********************************************************************************************/
var base_uri = window.localStorage.getItem("explorer");


/******************************************Crawl Data from the Explorer********************************************************************/

//This only should be a temporary way until a good API is found to get these informations!
function getData() {
    var wallet = window.localStorage.getItem("selectedWallet");
    $.get(base_uri+'/address/' + wallet, function (response) {
        //Split and substring the data from the crawler to our Array with informations
        var subbed = response.substring(response.indexOf('<th class="hidden-xs">Timestamp</th>') + 1);
        subbed = subbed.substring(subbed.indexOf('<tbody>') + 1);
        subbed = subbed.substring(0, subbed.indexOf('</tbody>'));
        subbed = subbed.substring(subbed.indexOf('href') + 1);
        var dataArray = subbed.split("href=");
        var transId = dataArray[0].substring();
        var data = {
            last_txs: []
        };

        for (i = 0; i < dataArray.length && i < 24; i++) {
            var info = dataArray[i].split(">");
            var transactionId = '';
            var status = '';
            var amount = '';
            var date = '';

            if (!isEmpty(info[1])) {
                transactionId = info[1].substring(0, info[1].indexOf('</a'));
                //for mobile it is too long so cut it to 8 digit
                transactionId = transactionId.substring(0, 10);
                transactionId = transactionId + '..';
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

//Not used for now. Limited to 25 transactions
function addPagination() {
    var totalRows = $('#transTable').find('tbody tr:has(td)').length;
    var recordPerPage = 10;
    var totalPages = Math.ceil(totalRows / recordPerPage);
    var $pages = $('<div id="pages"></div>');
    for (i = 0; i < totalPages; i++) {
        $('<span class="pageNumber">&nbsp;' + (i + 1) + '</span>').appendTo($pages);
    }
    $pages.appendTo('#transTable');

    $('.pageNumber').hover(
        function () {
            $(this).addClass('focus');
        },
        function () {
            $(this).removeClass('focus');
        }
    );

    $('table').find('tbody tr:has(td)').hide();
    var tr = $('table tbody tr:has(td)');
    for (var i = 0; i <= recordPerPage - 1; i++) {
        $(tr[i]).show();
    }
    $('span').click(function (event) {
        $('#transTable').find('tbody tr:has(td)').hide();
        var nBegin = ($(this).text() - 1) * recordPerPage;
        var nEnd = $(this).text() * recordPerPage - 1;
        for (var i = nBegin; i <= nEnd; i++) {
            $(tr[i]).show();
        }
    });
}

/**********************************************************AJAX-Calls********************************************************************/

function getBalance(usdPrice) {
    //get current Balance from saved Wallet. Has to be changed if multiple Wallets should be possible
    var walletAddress = window.localStorage.getItem("selectedWallet");
    var url = base_uri + "/ext/getaddress/" + walletAddress;
    $.ajax({
        url: url,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async:true,
        success: function (result) {
            balance = result.balance;
            balance = precisionRound(balance, 4);
            value = precisionRound(balance * usdPrice,2);

            var result = {
                priceInUsd: value,
                balance: balance
            };
            document.getElementById("totalBalance").innerHTML = tmpl("tmpl-totalBalance", result);
        },
        error: function (result) {
            throw "Es ist ein Fehler aufgetreten."
        }
    });
}

function getBlockDifficulty() {
    //get current Difficulty from the explorer API
    var url = base_uri + "/api/getdifficulty";
    $.ajax({
        url: url,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async:true,
        success: function (data) {
            data = precisionRound(data, 2);
            document.getElementById("blockDiff").innerHTML = tmpl("tmpl-blockDiff", data);
        },
        error: function (data) {
            throw "Es ist ein Fehler aufgetreten."
        }
    });
}

function getBlockcount() {
    //get current Blockcount from the explorer API
    var url = base_uri + "/api/getblockcount";
    $.ajax({
        url: url,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async:true,
        success: function (data) {
            document.getElementById("blockCount").innerHTML = tmpl("tmpl-blockCount", data);
        },
        error: function (data) {
            throw "Es ist ein Fehler aufgetreten."
        }
    });
}

function getUsdValue() {
    //get current USD Value from coinmarketcap
    var url = "https://api.coinmarketcap.com/v1/ticker/garlicoin/";
    $.ajax({
        url: url,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async:true,
        success: function (data) {
            var priceSpan;
            if(parseFloat(data[0].percent_change_24h)< 0){
                color = "red";
            }else{
                color = "green";
            }
            var result = {
                pricePerUsd: (parseFloat(precisionRound(data[0].price_usd,2))).formatMoney(2),
                totalValue: data[0].price_usd,
                price_btc: data[0].price_btc,
                rank: data[0].rank,
                volume_usd: (parseFloat(data[0]["24h_volume_usd"])).formatMoney(2),
                percent_change_color: color,
                percent_change_1h: data[0].percent_change_1h,
                percent_change_24h: data[0].percent_change_24h
            };

            //build the balance infobox
            getBalance(data[0].price_usd);

            //Fill the Infobox with the current Rank and add the template
            document.getElementById("rankField").innerHTML = tmpl("tmpl-rank", data[0].rank);
            document.getElementById("usdValue").innerHTML = tmpl("tmpl-usdValue", result);
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
        d = d == undefined ? "," : d,
        t = t == undefined ? "." : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

/*****************************************************************************************************************************************/


window.onload = function () {
    getUsdValue();
    getData();
    getBlockDifficulty();
    getBlockcount();
    $('#reloadTrans').click(function () {
        getData();
    });
};