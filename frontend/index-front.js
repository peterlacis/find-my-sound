$(document).ready(function () {
	$('#homeAddAmp').on('click', function() {
		window.location.href = "/amp";
	});
	$('#homeAmpButton').on("click", function() {
		window.location.href = "/";
	});
	$('.displayTitle').on('click', function() {
		$('.contentRow').show();
		$('.displayRow').hide();
	});

	$.get("/all_amps", function(response) {
		$.each(response, function(key, amp) {
			$('#generateNote').prepend(createNote(amp));
		});
		$('#searchResults').show();
	});

	// content of note card when clicked
	function handleNoteClick(evt) {
		var target = $(evt.target);
		target = target.parents('.noteContainerContainer');
		var parentTarget = target.parents('.contentRow').siblings('.displayRow');
		var noteObj = {
			"amp_model": target.find('.amp_model').text(),
			"amp_manufacturer": target.find('.amp_manufacturer').text(),
			"amp_style" : target.find('.amp_style').text(),
			"wattage" : target.find('.wattage').text(),
			"features": target.find('.features').text(),
			"image": target.find('.image').html()

		};

		// Content of lables
		parentTarget.find('.amp_model').text(noteObj.amp_model);
		// if (noteObj.description) {
		// parentTarget.find('.amp_manufacturer').text(noteObj.amp_manufacturer);}
		parentTarget.find('.amp_manufacturer').text(noteObj.amp_manufacturer);
		parentTarget.find('.amp_style').text(noteObj.amp_style);
		parentTarget.find('.wattage').text(noteObj.wattage);
		parentTarget.find('.features').text(noteObj.features);
		parentTarget.find('.image').html(noteObj.image);

		$('.contentRow').hide();
		$('.displayRow').show();
		window.scrollTo(0, 0);
	}

	function createNote(amp) {
		var newNoteDiv = $('#template').clone(true, true);
		newNoteDiv.removeAttr("id");
		newNoteDiv.find('.amp_model').text("Model: " + amp.amp_model);
		newNoteDiv.find('.noteContainer').click(handleNoteClick);
		newNoteDiv.find('.amp_manufacturer').text("Manufacturer: " + amp.amp_manufacturer);
		newNoteDiv.find('.amp_style').text("Style: " + amp.amp_style);
		newNoteDiv.find('.wattage').text("Wattage: " + amp.wattage);
		newNoteDiv.find('.features').text("Features: " + amp.features);
		newNoteDiv.find('.image').html("<img src='" + amp.image + "'>");


		newNoteDiv.show();
		return newNoteDiv;
	}

	// NEW CODE FOR SEARCH-FORM

	$('#search-form').submit(function(execute) {
		execute.preventDefault();
		var value = $('.search-query').val();
		$('#generateNote').empty();

			$.get("/amps?query=" + value, function(response){
					$.each(response, function(key, response) {
						$('#generateNote').prepend(createNote(response));
					});

					$('#searchResults').show();

				});
			});



});
