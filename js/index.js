$(document).ready(function () {
    setInterval(() => {
        caricaRiderPartiti()
    }, 20000);

    $('#buttonList').click(function () {
        showSpinner();
        caricaRiderCreati();
        caricaRiderPartiti();
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
        $(function() {
            $('.pagination').show();
            paginateTable('#delivered', 10);
            
          });
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

    json = json.sort(function (a, b) {
        json = ordinaByData(json);
    });

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

function ordinaByData(json) {
    return json.sort(function (a, b) {
        return (new Date(b.startDate)) - (new Date(a.startDate));
    });
}

function paginateTable(table, pages) {

    var $table = $(table);
    var $rows = $('tbody > tr', $table);
    var numPages = Math.ceil($rows.length / pages) - 1;
    var current = 0;

    var $nav = $('ul', 'div.wrapper-paging');
    var $back = $nav.find('li:first-child a');
    var $next = $nav.find('li:last-child a');

    $nav.find('a.paging-this strong').text(current + 1);
    $nav.find('a.paging-this span').text(numPages + 1);
    $back
        .addClass('paging-disabled')
        .click(function () {
            pagination('<');
        });
    $next.click(function () {
        pagination('>');
    });

    $rows.hide().slice(0, pages).show();

    var pagination = function (direction) {
        var reveal = function (current) {
            $back.removeClass('paging-disabled');
            $next.removeClass('paging-disabled');

            $rows.hide().slice(0 * 10, 0 * 10 + 10).show();

            $nav.find('a.paging-this strong').text(current + 1);
        };

        if (direction == '<') {
            if (current > 1) {
                reveal(current -= 1);
            }
            else if (current == 1) {
                reveal(current -= 1);
                $back.addClass('paging-disabled');
            }
        } else {
            if (current < numPages - 1) {
                reveal(current += 1);
            }
            else if (current == numPages - 1) {
                reveal(current += 1);
                $next.addClass('paging-disabled');
            }
        }
    }
}


