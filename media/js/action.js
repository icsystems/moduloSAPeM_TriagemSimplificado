(function($){
	$.fn.writePortugueseDate = function(){
		var element = $(this[0]);
		var mydate=new Date()
		var year=mydate.getYear()
		if (year<2000)
		year += (year < 1900) ? 1900 : 0
		var day=mydate.getDay()
		var month=mydate.getMonth()
		var daym=mydate.getDate()
		if (daym<10)
		daym="0"+daym
		var dayarray=new Array(
			"Domingo",
			"Segunda-feira",
			"Terça-feira",
			"Quarta-feira",
			"Quinta-feira",
			"Sexta-feira",
			"Sábado"
		);
		var montharray=new Array(
			"de Janeiro de ",
			"de Fevereiro de ",
			"de Março de ",
			"de Abril de ",
			"de Maio de ",
			"de Junho de",
			"de Julho de ",
			"de Agosto de ",
			"de Setembro de ",
			"de Outubro de ",
			"de Novembro de ",
			"de Dezembro de "
		);
		var msg = dayarray[day]+", "+daym+" "+montharray[month]+year;
		element.val(msg);
	};
})(jQuery);


function calculateAge(dateStr){
	var data = new Date();
	var arrayData = dateStr.split('/');
	var ano = parseInt(arrayData[2]);
	var mes = parseInt(arrayData[1],10);
	var dia = parseInt(arrayData[0],10);
	var mesAtual = data.getMonth() + 1;
	var diaAtual = data.getDate();
	var anoAtual = data.getFullYear();
	var idade = anoAtual - ano;
	if (mesAtual < mes) idade--;
	if (mes == mesAtual && diaAtual < dia) idade--;
	return idade;
}

//After page is loaded set actions
$(document).ready(function(){

/*------------------------------------ Edition ------------------------------------------*/
	//Make the urlbase (necessary case SAPeM migrate to another server)
	var urlString = $(location).attr('href');
	var urlArray = urlString.split('/');
	var indexToRunUrlString = 0; 
	var urlbase = '';
	for (indexToRunUrlString in urlArray)
		if (urlArray[indexToRunUrlString] == 'sapem')
			var indexToRecord = indexToRunUrlString;
	for (indexToRunUrlString in urlArray.slice(0,parseInt(indexToRecord,10) + 1))
		if (indexToRunUrlString == 0)
			urlbase += urlArray[indexToRunUrlString];
		else
			urlbase += '/' + urlArray[indexToRunUrlString];
	urlbase += '/';

	if (urlString.search("edit") != -1){
		var fichaId = urlArray[urlArray.length-2];
		var url = urlbase + 'ficha/' + fichaId + '/';
		$.ajax({
			type: 'POST',
			url: url,
			dataType: "html",
			success: function(text){
				if (window.DOMParser)
				{
					parser=new DOMParser();
					xml=parser.parseFromString(text,"text/xml");
				}else{ // Internet Explorer
					xml=new ActiveXObject("Microsoft.XMLDOM");
					xml.async="false";
					xml.loadXML(text);
				}
				if (xml.getElementsByTagName('error')[0] == undefined){
					var elements = xml.getElementsByTagName('documento')[0].childNodes;
					if (urlString.search("edit") != -1){
					//Edit
						var elements = xml.getElementsByTagName('documento')[0].childNodes;
						$(elements).each(function(){
								var el = $(this).get(0);
								if($(el)[0].nodeType == xml.ELEMENT_NODE){
								var tagname = $(el)[0].tagName;
								idDiv = $('#'+tagname).parent().attr('id');
								//console.log(tagname + ' : ' + $(el).text());
								var hlcolor = '#FFF8C6';
								$('#'+tagname).val($(el).text());
								$('#'+tagname).change();
							}
						});
					}
				}
			}
		});
	}
/*---------------------------------------------------------------------------------------*/
/*------------------------------------ Score  -------------------------------------------*/
	$.fn.countPoints = function(){

		//Define variables
		var points = 0;
		var sexo = $('#sexo').val();
		var idade = parseInt($('#idade').val(),10);
		var dorToracica = $('#dorToracica').val();
		var tosse = $('#tosse').val();
		var expectoracao = $('#expectoracao').val();
		var hempotise = $('#hemoptoico').val();
		var sudoreseNoturna = $('#sudorese').val();
		var febre = $('#febre').val();

		//Emagrecimento
		var emagrecimento = false;
		var pesoHabitual = parseInt($('#pesoHabitual').val(),10);
		var pesoAtual = parseInt($('#pesoAtual').val(),10);

		if (pesoHabitual < 70){
			if ((pesoHabitual - pesoAtual) > 3)
				emagrecimento = true;
		}else{
			if ((pesoHabitual - pesoAtual) > 5)
				emagrecimento = true;
		}

		//Count points
		if (sexo == 'masculino')
			points += 1;
		if (idade < 59)
			points += 1;
		if (dorToracica == 'sim')
			points += 2;
		if (tosse == 'menos2semanas')
			points += 1;
		else if (tosse == 'mais2semanas')
			points += 2;
		if (expectoracao == 'menos2semanas')
			points += 1;
		else if (expectoracao == 'mais2semanas')
			points += 2;
		if (hempotise == 'sim')
			points += 6;
		if (sudoreseNoturna == 'sim')
			points += 2;
		if (febre == 'sim')
			points += 2;
		if (emagrecimento)
			points += 2;
		return points;
	};
	$.fn.defineMessage = function(points){
		$('#fieldsetResultadoTriagem').show();
		$(this).html('');
		if (points >= 8){
			$(this).html('<b>Suspeito de TB. Marcar no horário de TB.</b>');
		}else{
			$(this).html('<b>Não suspeito de TB. Marcar no horário de pneumo geral.</b>');
		}
	};
	$.fn.cleanMessage = function(){
		$(this).html('');
		$('#fieldsetResultadoTriagem').hide();
	};
	$.fn.showRequiredMessage = function(){
		var id = $(this).attr('id');
		var capitalizeId = id.charAt(0).toUpperCase() + id.substring(1);
		var divId = $('#divErro'+ capitalizeId);
		var pId = $('#erro' + capitalizeId);
		divId.removeClass('secondary');
		divId.show();
		pId.html('<b>Esse campo é requerido</b>');
	};
	$.fn.cleanRequiredMessage = function(){
		var id = $(this).attr('id');
		var capitalizeId = id.charAt(0).toUpperCase() + id.substring(1);
		var divId = $('#divErro'+ capitalizeId);
		var pId = $('#erro' + capitalizeId);
		divId.addClass('secondary');
		divId.hide();
		pId.html('');
	};
/*---------------------------------------------------------------------------------------*/
	var hlcolor = '#FFF8C6';
	var d = new Date()
	var cYear = d.getFullYear();
/*-------------------------------------- CSS --------------------------------------------*/
	$('#resultadoTriagem').css('padding','15px');
	$('#resultadoTriagem').css('width','650px');
	$('#resultadoTriagem').css('font-size','14px');
	$('#resultadoTriagem').css('color','red');

	$('.erro').css('margin-left','310px');
	$('.erro').css('color','red');
/*---------------------------------------------------------------------------------------*/
/*------------------------------  Data Quality -------------------------------------*/
	//Disables enter
	$("#form_triagemGuadalupe").keypress(function(e) {
		if (e.which == 13) {
			return false;
		}
	});

	//Disables stranges chars for input fields

	$('.text').keypress(function(e){
		if((e.which > 32 && e.which < 65)||
			(e.which > 90 && e.which < 97)||
			(e.which > 122 && e.which < 127)||
			(e.which > 127 && e.which < 192)){
		return false;
		}
	});
	$('.data').datepicker({
		dateFormat: 'dd/mm/yy',
		monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
		monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Aug','Set','Out','Nov','Dez'],
		maxDate: '+0d',
		changeMonth: true,
		changeYear: true,
		maxDate : '+0y',
		minDate : '-130y',
		yearRange : '-130:+130',
		dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
	});
	$('#cep').keypress(function(e){
		if((e.which > 31 && e.which < 48)||(e.which > 57)){
			return false;
		}
	});
	$('.number').keypress(function(e){
		if((e.which > 31 && e.which < 48)||(e.which > 57)){
			return false;
		}
	});
	$('#data_consulta').writePortugueseDate();
/*----------------------------------------------------------------------------------*/
/*----------------------------------- Adress Logic ---------------------------------*/
	//Fill States in 'Estado' selectbox
	//Implementadonuma próxima versão
	/*$.ajax({
		url: './cgi-bin/autocomplete.py',
		data:({service:'state'}),
		dataType : 'json',
		cache: false,
		success : function(data){
			$.each(data.suggestions, function(i, item){
				$('#estado').append($('<option>'+item+'</option>' )
					.val(item)
				);
			});
		},
		error: function(XMLHttpRequest, textStatus, errorThrown){
			console.log(textStatus);
			console.log(errorThrown);
		}
	});*/

	//Autocomplete features
	var ajaxOpt;
	//Set options
	ajaxOpt = {
		serviceUrl:'./cgi-bin/autocomplete.py',
		noCache: true
	};
	//autocomplete triggers
	ac_city = $('#cidade').autocomplete(ajaxOpt);
	ac_city.setOptions({params: {service:'city', state:function(){ return $('#estado').val()}}});

	ac_neighborhood = $('#bairro').autocomplete(ajaxOpt);
	ac_neighborhood.setOptions({params: {service:'neighborhood', city:function(){ return $('#cidade').val()}}});

	ac_street = $('#endereco').autocomplete(ajaxOpt);
	ac_street.setOptions({params: {service:'street', city:function(){ return $('#cidade').val()}}});

	$('#cep').keyup(function() {
		var cepForm = $(this).val();
		var format = '#####-###';
		var i = cepForm.length;
		var output = format.substring(0,1);
		var text   = format.substring(i)
		if (text.substring(0,1) != output) $(this).val(cepForm + text.substring(0,1))
		if (cepForm.length == 9){
			$.getJSON('./cgi-bin/autocomplete.py?service=cep&query=' + cepForm, function(json){
				$('#estado').val(json.state);
				$('#cidade').val(json.city);
				$('#endereco').val(json.street);
			});
		}
	});
/*----------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------*/
	//hide secondary fields
	$('div.secondary').css('display', 'none');
	$('*', 'div.secondary').each(function(){
		if($(this)[0].nodeName == 'SELECT' || $(this)[0].nodeName == 'INPUT' )
			$(this).attr('disabled', 'disabled');
	});

/*----------------------------------------------------------------------------------*/
/*------------------------------- Form logics --------------------------------------*/
	//The sintoms and the message do not appear until result of baar exams are definied
	$('.sintomas').each(function(){
			$(this).attr('disabled',true);
	});
	$('#data_nascimento').attr('disabled',false);
	$('#idade').attr('disabled',false);
	$('#fieldsetResultadoTriagem').hide();

	//Idade autocomplete
	$('#data_nascimento').change(function(){
		$('#idade').val(calculateAge($(this).val()));
	});

	//If the elements that belong to 'sintomas' class are changed,
	//it will verify if the elements are empty and if they all
	//have a value, show the message
	$('.sintomas').change(function(){
		var points = parseInt($().countPoints(),10);
		var sintomasBoolean = (	$('#pesoHabitual').val() != '' &&
								$('#pesoAtual').val() != '' &&
								$('#idade').val() != '' &&
								$('#dorToracica').val() != '' &&
								$('#tosse').val() != '' &&
								$('#expectoracao').val() != '' &&
								$('#hemoptoico').val() != '' &&
								$('#sudorese').val() != '' &&
								$('#febre').val() != '' &&
								$('#sexo').val() != ''
								);
		if (points >= 8)
			$('#resultadoTriagem').defineMessage(points);
		else
			if (sintomasBoolean)
				$('#resultadoTriagem').defineMessage(points);
			else
				$('#resultadoTriagem').cleanMessage();
	});
	$('#primeiroExameBaar').change(function(){
		var resultadosPreenchidos = ($('#primeiroExameBaar').val() != '' && $('#segundoExameBaar').val() != '');
		if (resultadosPreenchidos){
			$('#divFrasesAjudaSintomas').hide();
			if ( ($('#primeiroExameBaar').val() == 'positivo') && ($('#segundoExameBaar').val() == 'positivo')){
				$('.sintomas').each(function(){
					$(this).attr('disabled',true);
				});
				$('#fieldsetResultadoTriagem').show();
				$('#resultadoTriagem').html('<b>Iniciar o tratamento para TB e marcar consulta com o médico em turno de TB.</b>');
			}else{
				$('#resultadoTriagem').cleanMessage();
				$('.sintomas').each(function(){
					$(this).removeAttr('disabled');
				});
				$('#fieldsetResultadoTriagem').hide();
			}
		}else{
			$('#divFrasesAjudaSintomas').show();
			$('.sintomas').each(function(){
				$(this).attr('disabled',true);
			});
		}
	});
	$('#segundoExameBaar').change(function(){
		var resultadosPreenchidos = ($('#primeiroExameBaar').val() != '' && $('#segundoExameBaar').val() != '');
		if (resultadosPreenchidos){
			$('#divFrasesAjudaSintomas').hide();
			if ( ($('#primeiroExameBaar').val() == 'positivo') && ($('#segundoExameBaar').val() == 'positivo')){
				$('.sintomas').each(function(){
					$(this).attr('disabled',true);
				});
				$('#fieldsetResultadoTriagem').show();
				$('#resultadoTriagem').html('<b>Iniciar o tratamento para TB e marcar consulta com o médico em turno de TB.</b>');
			}else{
				$('#resultadoTriagem').cleanMessage();
				$('.sintomas').each(function(){
					$(this).removeAttr('disabled');
				});
				$('#fieldsetResultadoTriagem').hide();
			}
		}else{
			$('#divFrasesAjudaSintomas').show();
			$('.sintomas').each(function(){
				$(this).attr('disabled',true);
			});
		}
	});
/*----------------------------------------------------------------------------------*/
/*----------------------------------- Validate -------------------------------------*/
	$('#form_triagemGuadalupe').submit(function(){
		var existEmptyField = false;
		$('.required:input').each(function(){
			if ($(this).val() == '' && $(this).attr('disabled') != true){
				$(this).showRequiredMessage();
				existEmptyField = true;
			}else{
				$(this).cleanRequiredMessage();
			}
		});
		if (existEmptyField)
			return false;
	});
	$('.required').change(function(){
		$('.required:input').each(function(){
			if ($(this).val() != '' || $(this).attr('disabled') == true){
				$(this).cleanRequiredMessage();
				return;
			}
		});
	});
	//$('#form_triagemGuadalupe').validate();
/*----------------------------------------------------------------------------------*/

});
