 $( document ).ready(function() {
        setInterval(() => {
            caricaRiderPartiti()
        }, 20000);

        $('#buttonList').click(function(){
            caricaRider();
         });
 });




function caricaRider(){
    
    doCall('GET', 'http://212.237.32.76:3002/list', undefined, function(json){
        caricaRiderPartiti();    
        buildCreatedTable(json);
        $('.startRider').click(
            function rideOrder(){
            var id = $(this).attr("data-id");
            doCall('GET', 'http://212.237.32.76:3002/start/'+id, undefined, function(){
            caricaRiderPartiti();   
            }, function(){
                window.alert("Chiamata Fallita, Riprovare");
            });
        });
    }, function(){
        window.alert("Chiamata Fallita, Riprovare");
    });
}



function caricaRiderPartiti(){
    doCall('GET', 'http://212.237.32.76:3002/status', undefined, function(json){
        buildDeliveredTable(json);
    }, function(){
        window.alert("Chiamata Fallita, Riprovare");
    });
}

function buildCreatedTable(json){
    var table = $('#created');
    var rider = '';

    table.empty();
    var tableHead = "<tr><td><b>ID</b></td><td><b>Merce</b></td><td><b>Stato</b></td><td><b></b></td></td>";
    table.append(tableHead);
    
    $.each(json, function(i,item){
		rider += '<tr><td>'+item._id+'</td><td>'+item.merce+'</td><td><font color="red">'+item.status+'</td></font><td><button data-id="'+item._id+'" class="btn btn-sm btn-info startRider" style="width: 100px;" type="submit">Ride</button></td></tr>';
    });
	table.append(rider);
}

function buildDeliveredTable(json){
    var table = $('#delivered');
    var rider = '';

    table.empty();
    var tableHead = "<tr><td><b>ID</b></td><td><b>Merce</b></td><td><b>Stato</b></td><td><b>Partito</b></td><td><b>Consegnato</b></td></td>";
    table.append(tableHead);
    
    $.each(json, function(i,item){
        if(item.status == 'CONSEGNA'){
        rider += '<tr><td>'+item._id+'</td><td>'+item.merce+'</td><td><font color="orange">'+item.status+'</td></font><td>'+item.startDate+'</td><td>In consegna</td></tr>';
        }else{
        rider += '<tr><td>'+item._id+'</td><td>'+item.merce+'</td><td><font color="green">'+item.status+'</td></font><td>'+item.startDate+'</td><td>'+item.endDate+'</td></tr>';
        }
    });
	table.append(rider);
}

//Utility
function doCall(typeRequest, urlPath, parametri, callbackOnSuccess, callbackOnError) {

	$.ajax({
		type : typeRequest, 
		url : urlPath, 
		data : parametri, 
		success : callbackOnSuccess,
		error: callbackOnError
	});
}

