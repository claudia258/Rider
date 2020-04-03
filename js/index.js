let host = 'http://212.237.32.76:3002/';
var paginaTabella = 1;
var indiceTabella = 0;
var elementiMostrati = 10;

$(document).ready(function () {
    setInterval(() => {
        caricaRiderPartiti(elementiMostrati)
    }, 20000);

    $('#buttonList').click(function () {
        showSpinner();
        elementi();
        caricaRiderCreati();
        caricaRiderPartiti(elementiMostrati);
        mostra(true);
        stopSpinner();
    });
});

function caricaRiderCreati() {

    doCall('GET', host+'list', undefined, function (json) {
        buildCreatedTable(json);
        $('.startRider').click(function () {
            rideOrder();
        })
    }, function () {
        $.notify("Chiamata Fallita Riprovare!", "error");
    });
}

function rideOrder() {
    var id = $('.startRider').attr("data-id");
    doCall('GET', host+'start/' + id, undefined, function () {
        caricaRiderCreati();
        caricaRiderPartiti(elementiMostrati);
    }, function () {
        $.notify("Chiamata Fallita Riprovare!", "error");
    });
}

function caricaRiderPartiti(elementiMostrati) {
    doCall('GET', host+'status', undefined, function (json) {
        buildDeliveredTable(json, elementiMostrati);
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

function buildDeliveredTable(json, elementiMostrati) {
    var table = $('#delivered');
    table.empty();
    json = json.sort(function (a, b) {
        json = ordinaByData(json);
    });
    var tableHead = "<tr><td><b>ID</b></td><td><b>Merce</b></td><td><b>Stato</b></td><td><b>Partito</b></td><td><b>Consegnato</b></td></td>";
    table.append(tableHead);

    json.forEach(function (element, i) {
        var rider = '';
        if ((indiceTabella + i) >= json.length || i >= elementiMostrati) {
            return false;
        }
        var dataPartenza = new Date(json[indiceTabella + i].startDate).toLocaleString('en-GB', { timeZone: 'UTC' });
        var dataArrivo = new Date(json[indiceTabella + i].endDate).toLocaleString('en-GB', { timeZone: 'UTC' });
        if (json[indiceTabella + i].status == 'CONSEGNA') {
            rider += '<tr><td>' + json[indiceTabella + i]._id + '</td><td>' + json[indiceTabella + i].merce + '</td><td><font color="orange">' + json[indiceTabella + i].status + '</td></font><td>' + dataPartenza + '</td><td><i>IN CONSEGNA</i></td></tr>';
        } else {
            rider += '<tr><td>' + json[indiceTabella + i]._id + '</td><td>' + json[indiceTabella + i].merce + '</td><td><font color="green">' + json[indiceTabella + i].status + '</td></font><td>' + dataPartenza + '</td><td>' + dataArrivo + '</td></tr>';
        }
        table.append(rider);
    });
    pagination(json, elementiMostrati);
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
        $("#pagination").show();
        $("#selezionaElementi").show();
    }
    else {
        $("table#created").hide();
        $("table#delivered").hide();
        $("div#titoleCreati").hide();
        $("div#titolePartiti").hide();
        $("div#titole").show();
        $("#buttonList").show();
        $("#pagination").hide();
        $("#selezionaElementi").hide();
    }
}

function ordinaByData(json) {
    return json.sort(function (a, b) {
        return (new Date(b.startDate)) - (new Date(a.startDate));
    });
}

function elementi(){
    var tendina = $("#numeroElementi");
    var option = '';

    $.each(new Array(10), function(i){
        option += '<option value=' + (i+1)*10 + '>' + (i+1)*10 + '</option>';
    });
    tendina.append(option);
    mostraElementi();
}

function mostraElementi (){
    $("#numeroElementi").change(function(){
       elementiMostrati =  $('#numeroElementi').find(":selected").val();
        caricaRiderPartiti(elementiMostrati);
    })

}

function pagination(json, elementiMostrati){
    var numeroPagine = Math.ceil(json.length / elementiMostrati);
    $(function () {
        window.pagObj = $('#pagination').twbsPagination({
            totalPages: numeroPagine,
            visiblePages: 5,
            initiateStartPageClick: false,
            startPage: paginaTabella,
            onPageClick: function (event, page) {
                $("#delivered").empty();
                paginaTabella = page;
                indiceTabella = (paginaTabella - 1) * elementiMostrati;
                buildDeliveredTable(json, elementiMostrati)
            }
        });
    });
}
