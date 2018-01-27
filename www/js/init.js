window.onload = function () {
    getSavedAddresses();
    addAddressOnClick();
};
function addAddressOnClick() {
    $('#btnAddAddress').click(function () {
        debugger;
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