/******************************************Crawl Data from the Explorer********************************************************************/
function getData() {
    var wallet = "GNCHqdF3U3ib2vsQLyZWbodGeaWyk7y5uC";
    $.get('https://explorer.grlc-bakery.fun/address/' + wallet, function (response) {
        //Get the wanted result with substring and co
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
        document.getElementById("transTable").innerHTML = tmpl("tmpl-lastTrans", data);
        // addPagination();
    });
}

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

function getBalance() {
    var walletAddress = "GNCHqdF3U3ib2vsQLyZWbodGeaWyk7y5uC";
    var url = "https://explorer.grlc-bakery.fun/ext/getaddress/" + walletAddress;
    $.ajax({
        url: url,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            balance = result.balance;
            balance = precisionRound(balance, 4);
            document.getElementById("totalBalance").innerHTML = tmpl("tmpl-totalBalance", balance);
        },
        error: function (result) {
            throw "Es ist ein Fehler aufgetreten."
        }
    });
}

function getBlockDifficulty() {
    var url = "https://explorer.grlc-bakery.fun/api/getdifficulty";
    $.ajax({
        url: url,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
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
    var url = "https://explorer.grlc-bakery.fun/api/getblockcount";
    $.ajax({
        url: url,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            document.getElementById("blockCount").innerHTML = tmpl("tmpl-blockCount", data);
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

/*****************************************************************************************************************************************/


window.onload = function () {
    getData();
    getBlockDifficulty();
    getBlockcount();
    getBalance();
    $('#reloadTrans').click(function () {
        getData();
    });
    $('#testBtn').click(function () {
        var ref = cordova.InAppBrowser.open('http://apache.org', '_blank', 'hidden=yes');
        ref.show();
    })
};