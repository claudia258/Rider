$(document).ready(function () {
    setInterval(() => {
        caricaRiderPartiti()
    }, 20000);

    paginaTabella = 0;

    $('#buttonList').click(function () {
        showSpinner();
        caricaRiderCreati();
        caricaRiderPartiti();
        $("#pagination").show();
        mostra(true);
    });
    stopSpinner();
});

function caricaRiderCreati() {

    doCall('GET', 'http://212.237.32.76:3002/list', undefined, function (json) {
        buildCreatedTable(json);
        $('.startRider').click(
            function rideOrder() {
                var id = $(this).attr("data-id");
                doCall('GET', 'http://212.237.32.76:3002/start/' + id, undefined, function () {
                    caricaRiderCreati();
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
    }), function () {
        $.notify("Chiamata Fallita Riprovare!", "error");

    }
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

    json = json.sort(function (a, b) {
        json = ordinaByData(json);
    });

    var tableHead = "<tr><td><b>ID</b></td><td><b>Merce</b></td><td><b>Stato</b></td><td><b>Partito</b></td><td><b>Consegnato</b></td></td>";
    table.append(tableHead);

    numeroPagine = Math.ceil(json.length / 10);
    console.log(json.length);
    json.forEach(function (element, i) {
        if ((paginaTabella + i) >= json.length || i >= 10) {
            return false;
        }
            var dataPartenza = new Date(json[paginaTabella + i].startDate).toLocaleString('en-GB', { timeZone: 'UTC' });
            var dataArrivo = new Date(json[paginaTabella + i].endDate).toLocaleString('en-GB', { timeZone: 'UTC' });

            if (json[paginaTabella + i].status == 'CONSEGNA') {
                rider += '<tr><td>' + json[paginaTabella + i]._id + '</td><td>' + json[paginaTabella + i].merce + '</td><td><font color="orange">' + json[paginaTabella + i].status + '</td></font><td>' + dataPartenza + '</td><td><i>IN CONSEGNA</i></td></tr>';
            } else {
                rider += '<tr><td>' + json[paginaTabella + i]._id + '</td><td>' + json[paginaTabella + i].merce + '</td><td><font color="green">' + json[paginaTabella + i].status + '</td></font><td>' + dataPartenza + '</td><td>' + dataArrivo + '</td></tr>';
            }
            table.append(rider);
    });
        $(function () {
            window.pagObj = $('#pagination').twbsPagination({
                totalPages: numeroPagine,
                visiblePages: 5,
                onPageClick: function (event, page) {
                    $("#delivered").empty();
                    paginaTabella = (page - 1) * 10;
                    buildDeliveredTable(json)
                    console.log("cambio pagina");

                }
            }).on('page', function (event, page) {
                console.info(page + ' (from event listening)');
            });
        });
    

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

function ordinaByData(json) {
    return json.sort(function (a, b) {
        return (new Date(b.startDate)) - (new Date(a.startDate));
    });
}

