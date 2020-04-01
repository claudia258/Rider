$(document).ready(function () {
    setInterval(() => {
        caricaRiderPartiti()
    }, 20000);

    $('#buttonList').click(function () {
        caricaRiderCreati();
        caricaRiderPartiti();
        mostra(true);
    });
});




function caricaRiderCreati() {

    doCall('GET', 'http://212.237.32.76:3002/list', undefined, function (json) {
        buildCreatedTable(json);
        $('.startRider').click(
            function rideOrder() {
                var id = $(this).attr("data-id");
                doCall('GET', 'http://212.237.32.76:3002/start/' + id, undefined, function () {
                    caricaRiderPartiti();
                }, function () {
                    $.notify("Chiamata Fallita Riprovare!", "error");
                });
            });
    }, function () {
        $.notify("Chiamata Fallita Riprovare!", "error");
    });
}



function caricaRiderPartiti() {
    doCall('GET', 'http://212.237.32.76:3002/status', undefined, function (json) {
        buildDeliveredTable(json);
    }, function () {
        $.notify("Chiamata Fallita Riprovare!", "error");
    });
}

function buildCreatedTable(json) {
    var table = $('#created');
    var rider = '';

    table.empty();
    var tableHead = "<tr><td><b>ID</b></td><td><b>Merce</b></td><td><b>Stato</b></td><td><b></b></td></td>";
    table.append(tableHead);
    json.forEach(element => {
        rider += '<tr><td>' + element._id + '</td><td>' + element.merce + '</td><td><font color="red">' + element.status + '</td></font><td><button data-id="' + element._id + '" class="btn btn-sm btn-info startRider" style="width: 100px;" type="submit">Ride</button></td></tr>';
    });
    table.append(rider);
}

function buildDeliveredTable(json) {
    var table = $('#delivered');
    var rider = '';

    table.empty();
    var tableHead = "<tr><td><b>ID</b></td><td><b>Merce</b></td><td><b>Stato</b></td><td><b>Partito</b></td><td><b>Consegnato</b></td></td>";
    table.append(tableHead);

    json.forEach(element => {
        var dataPartenza = new Date(element.startDate).toLocaleString('en-GB', { timeZone: 'UTC' });
        var dataArrivo = new Date(element.endDate).toLocaleString('en-GB', { timeZone: 'UTC' });

        if (element.status == 'CONSEGNA') {
            rider += '<tr><td>' + element._id + '</td><td>' + element.merce + '</td><td><font color="orange">' + element.status + '</td></font><td>' + dataPartenza + '</td><td><i>IN CONSEGNA</i></td></tr>';
        } else {
            rider += '<tr><td>' + element._id + '</td><td>' + element.merce + '</td><td><font color="green">' + element.status + '</td></font><td>' + dataPartenza + '</td><td>' + dataArrivo + '</td></tr>';
        }
    });
           
    table.append(rider);
}

//Utility
function doCall(typeRequest, urlPath, parametri, callbackOnSuccess, callbackOnError) {

    $.ajax({
        type: typeRequest,
        url: urlPath,
        data: parametri,
        success: callbackOnSuccess,
        error: callbackOnError
    });
}

function mostra(show) {
    if (show) {
        $("table#created").show();
        $("table#delivered").show();
        $("div#titoleCreati").show();
        $("div#titolePartiti").show();
        $("div#titole").hide();
        $("#buttonList").hide();
    }
    else {
        $("table#created").hide();
        $("table#delivered").hide();
        $("div#titoleCreati").hide();
        $("div#titolePartiti").hide();
        $("div#titole").show();
        $("#buttonList").show();
    }
}


