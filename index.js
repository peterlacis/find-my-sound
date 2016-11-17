/*jshint esversion:6*/

var express = require("express");
var bodyParser = require("body-parser");
var sessions = require ("express-session");
var mongoose = require("mongoose");

var app = express();

const PORT = process.env.PORT || 5000;

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost", function(err) {
	if (err && err.message.indexOf("ECONNREFUSED") !== -1) {
		console.log("Unable to connect to mongodb!");
		console.log("How about to remember to run the database first!");
	} else if (err) {
		console.log(err);
	}
});

var AmpSchema  = require('./schema/amp_schema.js');
var Amp = mongoose.model("Amp", AmpSchema);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.get("/", (request, response) => {
	response.sendFile(__dirname + "/frontend/index.html");
});

app.get("/amp", (req, res) => {
	res.sendFile(__dirname + "/frontend/amp.html");
});

app.get("/all_amps", (req, res) => {

	Amp.find(function (err, amps) {
	  if (err) {
		res.send("Request denied");
	  	return console.log(err);
	  }
		res.send(amps);
	});

});

// powers the search functionality
app.get("/amps", (req, res) => {
	if (typeof req.query.query != 'undefined') {
		var input = req.query.query.toLowerCase();
		var inputArr = input.split(" ");
		Amp.find(
			{ $or: [
				{"amp_model":new RegExp(inputArr[0],'i')},
				{"amp_manufacturer":new RegExp(inputArr[0],'i')},
				{"amp_style":new RegExp(inputArr[0],'i')},
				{"wattage": parseInt(inputArr[0]) || -1 },
				{"features":new RegExp(inputArr[0],'i')},
				{"best_music_genre_served":new RegExp(inputArr[0],'i')},
				{"sounds_like_players":new RegExp(inputArr[0],'i')},
				{"price_point_new":parseInt(inputArr[0]) || -1 },
				{"price_point_used":parseInt(inputArr[0]) || -1 },


				// {"_id": inputArr[0]}

			]


		}, function(err,results){
			if (err) {
				console.log(err);
				res.status(500);
				res.send(err);
				return;
			}
			if (results) {
				res.send(results);
			} else {
				res.send("No amps for you!");
			}
		});
	} else {
		// send everything (no filter set)
		Amp.find((err, amps) => res.send(amps));
	}
});

// powers the amp detail query lookup functionality
app.get("/ampdetail", (req, res) => {
	if (typeof req.query.query != 'undefined') {
		var input = req.query.query.toLowerCase();
		var inputArr = input.split(" ");
		Amp.find(

			{"_id": inputArr[0]}

		, function(err,results){
			if (err) {
				console.log(err);
				res.status(500);
				res.send(err);
				return;
			}
			if (results) {
				res.send(results);
			} else {
				res.send("No amps for you!");
			}
		});
	} else {
		// send everything (no filter set)
		Amp.find((err, amps) => res.send(amps));
	}
});

// posting a NEW amp
app.post("/add_amp", (req, res) => {
	var amp = new Amp({
        amp_model: req.body.amp_model,
		amp_manufacturer: req.body.amp_manufacturer,
		amp_style: req.body.amp_style,
        wattage: req.body.wattage,
        features: req.body.features,
		image: req.body.image,
		video: req.body.video,
        foot_switchable: req.body.foot_switchable,
        number_of_channels: req.body.number_of_channels,
        midi_capable: req.body.midi_capable,
        has_clean: req.body.has_clean,
        sounds_like_players: req.body.sounds_like_players,
        percussive: req.body.percussive,
        percussive_level_amount: req.body.percussive_level_amount,
        feel_overall: req.body.feel_overall,
        feel_low_end: req.body.feel_low_end,
        feel_high_end: req.body.feel_high_end,
        feel_rating: req.body.feel_rating,
        compression_level: req.body.compression_level,
        compression_level_amount: req.body.compression_level_amount,
        dynamic_feel_punch_vs_compression: req.body.dynamic_feel_punch_vs_compression,
        easy_to_play: req.body.easy_to_play,
        easy_to_play_amount: req.body.easy_to_play_amount,
        sound_good_low_volume: req.body.sound_good_low_volume,
        preferred_speaker_combination: req.body.preferred_speaker_combination,
        best_music_genre_served: req.body.best_music_genre_served,
        price_point_new: req.body.price_point_new,
        price_point_used: req.body.price_point_used,
        popularity: req.body.popularity,
        boutique: req.body.boutique,
        rarity: req.body.rarity,
        year_introduced: req.body.year_introduced,
        image: req.body.image,
        di_capable: req.body.di_capable,
        power_scaling: req.body.power_scaling,
        has_variac: req.body.has_variac,
        has_switchable_wattage: req.body.has_switchable_wattage,
        gain_rating: req.body.gain_rating,
        eq_frustration_level: req.body.eq_frustration_level,
        house_friendly: req.body.house_friendly,
        overall_value_for_price_point: req.body.overall_value_for_price_point,
        clarity: req.body.clarity,
        note_articulation: req.body.note_articulation,
        sparkle: req.body.sparkle,
        fx_loop_serial: req.body.fx_loop_serial,
        fx_loop_parallel: req.body.fx_loop_parallel,
        has_line_out: req.body.has_line_out,
        has_resonance_or_depth: req.body.has_resonance_or_depth,
        eq_voicing: req.body.eq_voicing,
        tone_stack: req.body.tone_stack
	});

	amp.save(function (err) {
	  if (err) {
	    console.log(err);
	    res.send("There was an error saving your amp!");
	  } else {
	    res.send("amp saved!");
	  }
	});
});

// posting an EDIT to an amp
app.post("/edit_amp", (req, res) => {
	console.log(req.body);
	// var amp = Amp({
	// 	_id: req.body._id,
	// 	amp_model: req.body.amp_model,
	// 	amp_manufacturer: req.body.amp_manufacturer,
	// 	amp_style: req.body.amp_style,
	// 	wattage: req.body.wattage,
	// 	features: req.body.features,
	// 	image: req.body.image
	//
	// });

	Amp.findOneAndUpdate(

		{
			_id: req.body._id},
		{
			amp_model: req.body.amp_model,
			amp_manufacturer: req.body.amp_manufacturer,
			amp_style: req.body.amp_style,
			wattage: req.body.wattage,
			features: req.body.features,
			image: req.body.image,
			video: req.body.video,
	        foot_switchable: req.body.foot_switchable,
	        number_of_channels: req.body.number_of_channels,
	        midi_capable: req.body.midi_capable,
	        has_clean: req.body.has_clean,
	        sounds_like_players: req.body.sounds_like_players,
	        percussive: req.body.percussive,
	        percussive_level_amount: req.body.percussive_level_amount,
	        feel_overall: req.body.feel_overall,
	        feel_low_end: req.body.feel_low_end,
	        feel_high_end: req.body.feel_high_end,
	        feel_rating: req.body.feel_rating,
	        compression_level: req.body.compression_level,
	        compression_level_amount: req.body.compression_level_amount,
	        dynamic_feel_punch_vs_compression: req.body.dynamic_feel_punch_vs_compression,
	        easy_to_play: req.body.easy_to_play,
	        easy_to_play_amount: req.body.easy_to_play_amount,
	        sound_good_low_volume: req.body.sound_good_low_volume,
	        preferred_speaker_combination: req.body.preferred_speaker_combination,
	        best_music_genre_served: req.body.best_music_genre_served,
	        price_point_new: req.body.price_point_new,
	        price_point_used: req.body.price_point_used,
	        popularity: req.body.popularity,
	        boutique: req.body.boutique,
	        rarity: req.body.rarity,
	        year_introduced: req.body.year_introduced,
	        image: req.body.image,
	        di_capable: req.body.di_capable,
	        power_scaling: req.body.power_scaling,
	        has_variac: req.body.has_variac,
	        has_switchable_wattage: req.body.has_switchable_wattage,
	        gain_rating: req.body.gain_rating,
	        eq_frustration_level: req.body.eq_frustration_level,
	        house_friendly: req.body.house_friendly,
	        overall_value_for_price_point: req.body.overall_value_for_price_point,
	        clarity: req.body.clarity,
	        note_articulation: req.body.note_articulation,
	        sparkle: req.body.sparkle,
	        fx_loop_serial: req.body.fx_loop_serial,
	        fx_loop_parallel: req.body.fx_loop_parallel,
	        has_line_out: req.body.has_line_out,
	        has_resonance_or_depth: req.body.has_resonance_or_depth,
	        eq_voicing: req.body.eq_voicing,
	        tone_stack: req.body.tone_stack
		},

			{new: true},
	(err, data) => {

	  if (err) {
	    console.log(err);
	    res.send("There was an error saving your amp!");

	  } else {
	    res.send("amp saved!");
	  }

	});
});

app.use(express.static('frontend'));

app.use((req, res, next) => {
	res.status(404);
	res.send("404 There is nothing for you to see here.  Please move along.");
});

app.use((req, res, next) => {
	res.status(500);
	res.send("500 Server Error. Time for new tubes.");
});


app.listen(PORT, () => {
	console.log("server started at port " + PORT);
});
