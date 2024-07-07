//	Open indicated section. Hash to allow linking to separate tabs. If no hash, go to overview
function openHash() {
	var hash = window.location.hash.substring(1); // hash part of url without the first letter (#)
	var splitHash = hash.split('?');
	var tabHash = splitHash[0];
	var issueHash = hash.split('=')[1];

  $("section > section").hide();
	$('.section-subnav li a').removeClass('active');

  if( tabHash !== '' ) {
		$("#"+tabHash).show();
		$('.section-subnav li a[href="#' + tabHash + '"]').addClass('active');
	} else {
		$("#overview").show();
		$('.section-subnav li a[href="#overview"]').addClass('active');
	}
	if(issueHash) {
		document.getElementById(issueHash).scrollIntoView();
	}
}

//	LocalStorage
var formValues = JSON.parse(localStorage.getItem('formValues')) || {};
var $checkboxes = $("#results :checkbox");

function updateStorage(){
  $checkboxes.each(function(){
    formValues[this.id] = this.checked;
  });

  localStorage.setItem("formValues", JSON.stringify(formValues));
}

function showHide( btn, type ) {
	$('#filter-set button').removeClass('active');
	$(btn).addClass('active');

	switch (type) {
		case 'fail':
			$('#results .report-card, #results h3').hide();
			$('#results .failed').show();
			break;
		case 'pass':
			$('#results .report-card, #results h3').hide();
			$('#results .passed').show();
			break;
		default:
			$('#results .report-card, #results h3').show();
	}
}

function setOnClick() {
	/*	Hide location lists */
	$('#results .locationList').hide();

		/*	Hide Explanation lists */
	$('#resources .explanationList').hide();


	//	List Toggle Functionality
	$('#results .listToggle').on('click', function() {
		var myList = $(this).next('.locationList');
		if ( myList.is(":visible") ) {
			myList.hide();
			$(this).html("<span class='icon-GizmoPlus'></span> Show Locations");
		} else {
			myList.show();
			$(this).html("<span class='icon-GizmoMinus'></span> Hide Locations");
		}

		return false;
	});

	//	Explanation Toggle Functionality
	$('#resources .listToggle').on('click', function() {
		var myList = $(this).next('.explanationList');

		if ( myList.is(":visible") ) {
			myList.hide();
			$(this).html("<span class='icon-GizmoPlus'></span> Why is this important?");
		} else {
			myList.show();
			$(this).html("<span class='icon-GizmoMinus'></span> Why is this important?");
		}

		return false;
	});
}

//	On Load functions *****************************************************

$( document ).ready(function() {
	/* 	Open first page */
	openHash();

	// Set checkboxes from localStorage
	$.each(formValues, function(key, value) {
	  $("#" + key).prop('checked', value);
	});

	$(window).on("hashchange", function(){
		openHash();
	});

	/*	Sub Nav Active State */
	$('.section-subnav ul > li a').each(function(){
		if ($(this).attr("href") == window.location.pathname){
				$(this).addClass("active");
		}
	});

	//	Filter Button Functionality
	$('#results #showFail').on('click', function() {
		showHide(this, 'fail');
		return false;
	});
	$('#results #showPass').on('click', function() {
		showHide(this, 'pass');
		return false;
	});
	$('#results #showAll').on('click', function() {
		showHide(this, 'all');
		return false;
	});

	//	Save Progress Functionality
	$('#results .saveStorage').on('click', function() {
		updateStorage();

		$(this).text('Saved').attr("disabled","disabled");
	});

	setOnClick();
});
