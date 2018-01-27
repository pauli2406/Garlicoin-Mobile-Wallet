var walletAddress;

window.onload = function () {
    getSavedAddresses();
    addAddressOnClick();
};
//PROBLEM mit dem Löschen und SPeichern und auf die andere Seite gehen
function addAddressOnClick() {
    $('#btnAddAddress').click(function () {
        debugger;
        var address = $('#inAddAddress').val();
        var counter = parseInt($('#counter').val());
        var data = {address: address,counter: counter};
        var entries = document.getElementById("address_list").innerHTML;
        document.getElementById("address_list").innerHTML = entries + tmpl("tmpl-transList", data);
        $('#btn_li_'+counter).click(function () {
            walletAddress = address;
            document.location.href = "/wallet.html";
        });
        window.localStorage.setItem(toString(counter),address);
        $('#counter').val(counter +1);
    })
}

function getSavedAddresses() {
    debugger;
    for (i = 0; i < window.localStorage.length; i++) {
        var counter = parseInt($('#counter').val());
        var address = window.localStorage.getItem(i);
        var data = {address: address,counter: counter};
        var entries = document.getElementById("address_list").innerHTML;
        if(!isEmpty(address)) {
            document.getElementById("address_list").innerHTML = entries + tmpl("tmpl-transList", data);
            $('#btn_li_' + counter).click(function () {
                walletAddress = address;
                document.location.href = "/wallet.html";
            });
        }
        $('#counter').val(counter + 1);
    }
    $('#counter').val(window.localStorage.length);
}
function isEmpty(str) {
    return (!str || 0 === str.length);
}