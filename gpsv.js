
function $(id) {
	return (document.getElementById(id));
}

function ExamplePopup(url,w,h) {
	window.open(url,'_blank','width='+(w+16)+',height='+(h+16)+',toolbar=no,location=no,status=no,menubar=no,resizable=yes,scrollbars=no');
}

function BackgroundSamplePopup(bg_map,place) {
	window.open('background_examples.cgi?bg_map='+bg_map+'&place='+place,'bg_ex','width=750,height=450,toolbar=no,location=no,status=no,menubar=no,resizable=yes,scrollbars=yes');
}

function HelpPopup(feature) {
	window.open('/help.html' + '#' + feature,'help','width=640,height=500').focus();
}

function FilePopup(url,windowname,w,h) {
	window.open(url,windowname,'width='+w+',height='+h+',toolbar=no,location=no,status=no,menubar=yes,resizable=yes,scrollbars=yes');
}
function GetAnAPIKey(source) {
	window.open('https://www.gpsvisualizer.com/misc/api_key.html#'+source,'key_instructions','width=500,height=520,toolbar=no,location=no,status=no,menubar=no,resizable=yes,scrollbars=yes');
	return;
}

function Onload_Test() {
	alert('the page has loaded.');
}
function Add_Scroll_Arrows() {
	if (!self.MOBILE) { return false; }
	if ($('header_strip')) {
		$('header_strip').style.overflowX = 'auto';
	}
	var divs = document.getElementsByClassName('scrolling_container'); if (!divs.length) { return false; }
	for (var i=0; i<divs.length; i++) {
		var max = document.documentElement.clientWidth-16; // d.dE.cW = width inside scrollbars
		divs[i].id = 'scrolling_container_'+i;
		divs[i].style.overflow = 'auto'; // just to make sure
		var sw = divs[i].scrollWidth;
		if (!$('scroll_note_'+i)) {
			var note = document.createElement('div'); note.id = 'scroll_note_'+i; note.className = 'scroll_note';
			note.innerHTML = '<img src="/images/scroll_arrow.png" id="scroll_arrow_'+i+'" style="opacity:1; transition:opacity 0.5s; cursor:pointer;" width="40" height="7" onclick="$(\'scrolling_container_'+i+'\').scrollLeft = '+sw+';" />';
			note.style.display = 'none';
			divs[i].parentNode.insertBefore(note,divs[i].nextSibling);
		}
		divs[i].setAttribute('onscroll','Adjust_Scroll_Arrow(this,'+max+','+i+');');
//console.log(divs[i].id+": sw/max = "+sw+"/"+max);
		if (sw > max) {
			divs[i].className = 'scrolling_container overflowing';
			if ($('scroll_note_'+i)) { $('scroll_note_'+i).style.display = 'block'; }
		} else {
			divs[i].className = 'scrolling_container';
			if ($('scroll_note_'+i)) { $('scroll_note_'+i).style.display = 'none'; }
		}
	}
}
function Adjust_Scroll_Arrow(div,max,i) {
	if (!$('scroll_arrow_'+i)) { return false; }
	if(div.scrollLeft >= (div.scrollWidth-max-2)) { $('scroll_arrow_'+i).style.opacity = 0; }
	else { $('scroll_arrow_'+i).style.opacity = 1; }
}
function Balance_Home_Links() {
	if (!$('home_links1') || !$('home_links2')) { return false; }
	var hl1 = $('home_links1'); var hl2 = $('home_links2');
	if (hl1.offsetTop != hl2.offsetTop) { // they don't fit, so they're stacked vertically
		var w1 = hl1.getBoundingClientRect().width;
		var w2 = hl2.getBoundingClientRect().width;
		var wider = (w1 > w2) ? w1 : w2;
		hl1.style.width = wider+'px'; hl1.style.marginLeft = 0; hl1.style.marginRight = 0;
		hl2.style.width = wider+'px'; hl2.style.marginLeft = 0; hl2.style.marginRight = 0;
	} else {
		hl1.style.width = '';
		hl2.style.width = ''; hl2.style.marginLeft = '15px';
	}
}
function ChangeFormTarget(theForm) {
	if (!theForm) { return false; }
	if (navigator && navigator.userAgent && navigator.userAgent.match(/Windows NT.*rv:11|Edge\/1[23]/)) { // IE11 and Edge12/13 fail to upload files when targeting a new window
		theForm.target = '_top';
		if ($('new_window_checkbox')) { $('new_window_checkbox').checked = false; }
		if ($('new_window_span')) { $('new_window_span').style.display = 'none'; }
	}
	if (theForm && $('new_window_checkbox')) {
		theForm.target = ($('new_window_checkbox').checked) ? '_blank' : '_top';
	}
}

function confirmRedirect(url,text) {
	if(confirm("Would you like to go to "+text+"?")){
		window.location = url;
	} else {
		return false;
	}
}
function confirmRedirectSubmit(url,text,formname) {
	if(confirm("Would you like to go to "+text+"?")){
		document.forms.main.action = url;
		document.forms.main.target = '_top';
		document.forms.main.form.value = formname;
		document.getElementById('data_input').name='form.data';
		document.forms.main.submit();
	} else {
		return false;
	}
}

function Check_For_API_Key(theForm) {
	if (theForm.remote_data && theForm.remote_data.value) {
		var url = theForm.remote_data.value;
		if ( (url.match(/google\.\w\w/) && url.match(/\/maps\/dir\//)) || url.match(/\/goo\.gl\/maps\//) ) {
			Show('google_api_key_row');
			if (!theForm.google_api_key || !theForm.google_api_key.value) {
				alert("Due to dramatic reductions in Google's quotas, you can no longer convert Google directions URLs unless you supply your own API key.  See https://www.gpsvisualizer.com/misc/google_api_keys.html for more information.");
				if (theForm.google_api_key){ theForm.google_api_key.focus(); }
				return false;
			} else if (theForm.google_api_key && !theForm.google_api_key.value.match(/^\s*[\w_-]+\s*$/)) {
				alert("You have not entered a valid Google API key. Visit https://www.gpsvisualizer.com/misc/google_api_keys.html for instructions on getting a key.");
				theForm.google_api_key.focus(); theForm.google_api_key.select();
				return false;
			}
		}
	}
	return true;
}
function Show_API_Key_Box(theForm) {
	if (!theForm && document.forms && document.forms.main) { theForm = document.forms.main; }
	if (theForm && theForm.remote_data) {
		if (theForm.remote_data.value.match(/\bgoogle\.\w\w|\bgoo\.gl\/maps\//)){
			Show('google_api_key_row');
			if (theForm.google_api_key && !theForm.google_api_key.value) {
				theForm.google_api_key.focus();
			}
		}
	}
}
function Validate_Map_Form(theForm) {
	if (theForm.data && theForm.data.value && !Validate_Data_Box(theForm.data)) { return false; }
	if (theForm.dynamic_data && theForm.dynamic_data.value && !Validate_Dynamic_URL(theForm.dynamic_data.value)) { return false; }
	if (!Check_For_API_Key(theForm)) { return false; }
	return true;
}
function Validate_Convert_Form(theForm) {
	if (theForm.data && theForm.data.value && !Validate_Data_Box(theForm.data)) { return false; }
	if (!Check_For_API_Key(theForm)) { return false; }
	return true;
}
function Validate_URL_Box(url_box) {
	/*
	if (url_box.value.match(/google\./i)) {
		if (!confirm("FYI: On June 25, Google removed the ability to directly convert driving directions URLs to coordinates; a temporary solution is in place, but there are no guarantees.  Routes with more than 10 points (including 'drag points') definitely will not work. \n\n[Click 'OK' to try anyway, or 'Cancel' to return to the input form.]")) {
			return false;
		}
	}
	*/
	return true;
}
function Validate_Data_Box(data_box) {
	if (data_box.value.match(/[a-z0-9]/i) && !data_box.value.match(/\b(lati?|latt?itude?|long?|lng|long?t?itude?|street|add?ress?e?1?|city|town|plaats|ville|state|province|nation|country|zip|zipcode|postal|post ?code|code ?postale?|airports?|eastings?|northings?|utm.?east\w*|utm.?north\w*)\b/i)) {
		if (!confirm('You\'ve entered some text into the \'data\' box, but it doesn\'t appear to have a valid header row on it and may produce an error.  Continue anyway?')) {
			return false;
		}
	}
	return true;
}
function Validate_Dynamic_URL(url) {
	if (!dynamic_url_alert_presented && url && url.match(/google\..*spreadsheets.*pubhtml/) && !url.match(/gid=/)) {
		dynamic_url_alert_presented = true;
		//if (!confirm("If your Google Drive spreadsheet file has more than one worksheet (or ever HAS had more than one sheet), GPS Visualizer may not be able to read your data using the 'public' link that you provided.  To be certain, you should copy the URL that shows up in your browser's location bar when you're viewing the spreadsheet; it will contain the following parameter: '#gid=[some_number]'.")) {
		//	return false;
		//}
	}
	return true;
}
dynamic_url_alert_presented = false;

function ChangeHTMLFormThumbnail(theForm) {
	if ($('form_thumbnail') && theForm && theForm.format && theForm.format.value) {
		$('form_thumbnail').src = $('form_thumbnail').src.replace(/form_thumb_(google|leaflet)\.jpg/,'form_thumb_'+theForm.format.value+'.jpg');
	}
}

function ChangeHTMLFormAction(theForm) {
	if (theForm && theForm.format && theForm.format.value) {
		theForm.action = theForm.action.replace(/output_(leaflet|google)/,'output_'+theForm.format.value);
	}
}

function AdjustHTMLMapList(theForm) {
	var format = theForm.format.value;
	var selected_bg = theForm.bg_map.value;
	var defaultMap = [];
	for (var i=0; i<theForm.bg_map.options.length; i++) {
		if (theForm.bg_map.options[i].value == 'google_openstreetmap') { defaultMap['leaflet'] = i; }
	}
	for (var i=0; i<theForm.bg_map.options.length; i++) {
		var bg = theForm.bg_map.options[i].value;
		if (format == 'leaflet' && bg.match(/^google_(map|aerial|satellite|hybrid|physical|terrain)$/)) {
			if (bg == selected_bg) { theForm.bg_map.selectedIndex = defaultMap['leaflet']; }
			HideMenuItem(theForm.bg_map,i);	
		} else {
			ShowMenuItem(theForm.bg_map,i);	
		}
	}
}

function FilterMapList(theForm) {
	var format = theForm.format.value;
	var mapCount = theForm.bg_map.options.length;
	var defaultMap = [];
	for (i = 0; i < mapCount; i++) {
		// if (theForm.bg_map.options[i].value == 'demis') { defaultMap['jpg'] = i; defaultMap['jpeg'] = i; defaultMap['png'] = i; defaultMap['svg'] = i; }
		if (theForm.bg_map.options[i].value == 'google_hybrid') { defaultMap['google'] = i; }
		else if (theForm.bg_map.options[i].value == 'yahoo_hybrid') { defaultMap['yahoo'] = i; }
	}
	for (j = 0; j < mapCount; j++) {
		var txt = theForm.bg_map.options[j].text;
		var val = theForm.bg_map.options[j].value;
		var last = txt.substring(txt.length-1,txt.length);
		if (!format) {
			ShowMenuItem(theForm.bg_map,j);
		} else if (format == 'google') {
			if (val.indexOf('google') > -1 || val.indexOf('modis_daily') > -1 || val == 'usgs_topo' || val == 'usgs_aerial' || val == 'bluemarble' || val == 'landsat' || val == 'nrcan_toporama' || val == 'nrcan_toporama2' || val == 'natatlas_county_outlines' || val == 'naip_aerial') { ShowMenuItem(theForm.bg_map,j); }
			else { HideMenuItem(theForm.bg_map,j); }
		} else if (format.indexOf('yahoo') > -1) {
			if (val.indexOf('yahoo') > -1) { ShowMenuItem(theForm.bg_map,j); }
			else { HideMenuItem(theForm.bg_map,j); }
		} else if (format == 'googleearth') {
			if (j == 0) { ShowMenuItem(theForm.bg_map,j); }
			else { HideMenuItem(theForm.bg_map,j); }
			theForm.bg_map.selectedIndex = 0;
		} else if (format == 'svg') {
			if (val.indexOf('google') > -1 || val.indexOf('yahoo') > -1) { HideMenuItem(theForm.bg_map,j); }
			else { ShowMenuItem(theForm.bg_map,j); }	
		} else { // PNG or JPEG
			if (val.indexOf('_tiles') > -1 || val.indexOf('google') > -1 || val.indexOf('yahoo') > -1 || val == 'tiger') { HideMenuItem(theForm.bg_map,j); }
			else { ShowMenuItem(theForm.bg_map,j); }	
		}
	}
	if (!bg_map_changed && defaultMap[format] != null && theForm.bg_map.selectedIndex == 0) { theForm.bg_map.selectedIndex = defaultMap[format]; }
	if (theForm.bg_map.options[theForm.bg_map.selectedIndex].disabled) {
		if (format == 'google') { theForm.bg_map.selectedIndex = defaultMap['google']; }
		else if (format.indexOf('yahoo') > -1) { theForm.bg_map.selectedIndex = defaultMap['yahoo']; }
		else { theForm.bg_map.selectedIndex = defaultMap['normal']; }
	}
}

function CheckForDisabledMapSelection(theForm) {
	var defaultMap = [];
	for (i = 0; i < theForm.bg_map.options.length; i++) {
		if (theForm.bg_map.options[i].value == 'demis') { defaultMap['svg'] = defaultMap['jpg'] = defaultMap['png'] = i; }
		else if (theForm.bg_map.options[i].value == 'google_hybrid') { defaultMap['google'] = i; }
	}
	if (theForm.bg_map.options[theForm.bg_map.selectedIndex].disabled) {
		theForm.bg_map.selectedIndex = defaultMap[theForm.format.value];
	}
	if (theForm.bg_map.options[theForm.bg_map.selectedIndex].value.indexOf('google') > -1) {
		if (theForm.format && theForm.format.value != 'google') {
			theForm.bg_map.selectedIndex = defaultMap[theForm.format.value]
		}
	}
}
function HideMenuItem(theMenu,i) {
	theMenu.options[i].disabled = true; theMenu.options[i].style.display = 'none';
}
function ShowMenuItem(theMenu,i) {
	theMenu.options[i].disabled = false; theMenu.options[i].style.display = '';
}

function ChangeExampleIcon(icon_menu_id,color_menu_id,example_id,custom_id) {
	if (!$(example_id) || !$(icon_menu_id) || !$(icon_menu_id).value) { return; }
	var icon = $(icon_menu_id).value;
	var color = ($(color_menu_id) && $(color_menu_id).value) ? $(color_menu_id).value : 'red';
	var rot = (icon.match(/^(arrow|wedge)/) && !icon_menu_id.match(/googleearth/)) ? '-r000' : '';
	if ($(example_id)){
		if(icon == 'custom'){
			if ($(custom_id) && $(custom_id).value && $(custom_id).value.toString().match(/^http/)) {
				$(example_id).innerHTML = '<img src="'+$(custom_id).value+'" style="margin:0px auto; max-height:64px;" />';
			} else {
				$(example_id).innerHTML = '';
			}
		} else if (icon_menu_id.match(/googleearth/)) {
			$(example_id).innerHTML = '<img src="/google_earth/icons/'+icon+'.png" style="margin:0px auto;" />';
		} else {
			$(example_id).innerHTML = '<img src="/google_maps/icons/'+icon+'/'+color+rot+'.png" style="margin:0px auto;" />';
		}
	}
}

function GPSBabel_FilterFormats(theForm,theMenu) {
	var type = '['+theForm.type.value.toUpperCase()+']';
	for (j = 0; j < theMenu.length; j++) {
		var txt = theMenu.options[j].text;
		if (txt.indexOf(type) > -1) {
			theMenu.options[j].disabled = false;
		} else {
			if (j == theMenu.selectedIndex) { theMenu.selectedIndex = 0; }
			theMenu.options[j].disabled = true;
		}
	}
}

function GPSBabel_ShowOptions(theMenu) {
	var code = theMenu.value;
	for (j = 0; j < (theMenu.length); j++) {
		var c = theMenu.options[j].value;
		if (c == code) {
			if ($(c+':options')) { Show(c+':options'); }
		} else {
			if ($(c+':options')) { Hide(c+':options'); }
		}
	}
}

function Show(id) {
	if (document.getElementById && document.getElementById(id)) { document.getElementById(id).style.display = ''; }
	else if (document.all && document.all.id) { document.all.id.style.display = ''; }
	else if (document.id) { document.id.style.display = ''; }
}
function Hide(id) {
	if (document.getElementById && document.getElementById(id)) { document.getElementById(id).style.display = 'none'; }
	else if (document.all && document.all.id) { document.all.id.style.display = 'none'; }
	else if (document.id) { document.id.style.display = 'none'; }
}
function Toggle(id) {
	if (document.getElementById && document.getElementById(id)) { currentVisibility = document.getElementById(id).style.display; }
	else if (document.all && document.all.id) { currentVisibility = document.all.id.style.display; }
	else if (document.id) { currentVisibility = document.id.style.display; }
	if (currentVisibility == 'none') { Show(id); }
	else { Hide(id); }
}
function Slide_Open(id) {
	if (document.getElementById && document.getElementById(id)) {
		if (document.getElementById(id).classList && document.getElementById(id).classList.replace) {
			document.getElementById(id).classList.replace('slider_closed','slider_open');
		} else {
			document.getElementById(id).className = document.getElementById(id).className.replace(/slider_closed/,'slider_open');
		}
	}
}
function Slide_Closed(id) {
	if (document.getElementById && document.getElementById(id)) {
		if (document.getElementById(id).classList) {
			document.getElementById(id).classList.replace('slider_open','slider_closed');
		} else {
			document.getElementById(id).className = document.getElementById(id).className.replace(/slider_open/,'slider_closed');
		}
	}
}

function getRadioByValue(radioButtonOrGroup,value) {
	if (!radioButtonOrGroup.length) { // single button
		if (radioButtonOrGroup.value == value) {
			return radioButtonOrGroup;
		} else {
			return null;
		}
	} else {
		for (var b = 0; b < radioButtonOrGroup.length; b++) {
			if (radioButtonOrGroup[b].value == value) {
				return radioButtonOrGroup[b];
			}
		}
		return null;
	}
}

function Check_URL_For_Advanced_Options(pattern,advanced_id,advanced_link_id) {
	if(document.location.href.toString().match(pattern) && $(advanced_id)) {
		Show(advanced_id);
		if (advanced_link_id && $(advanced_link_id)) {
			$(advanced_link_id).innerHTML = $(advanced_link_id).innerHTML.replace(/show/,'hide').replace(/\[\+\]/,'[&#8211;]');
		}
	}
}

function Check_URL_For_Highlighting() {
	var hl_pattern = new RegExp('\\bhighlight=([^&]+)','i');
	var hl_match = hl_pattern.exec(document.location.href.toString());
	if (hl_match) {
		var parameters = hl_match[1].split(',');
		for (var p=0; p<parameters.length; p++) {
			Highlight_Div(parameters[p],true);
		}
	}
}

function Highlight_Div(div,scroll) {
	if (typeof(div) == 'string') {
		if (document.getElementById(div)) {
			div = document.getElementById(div);
		} else {
			var list = document.getElementsByName(div);
			div = list[0];
		}
		if (div && div.type && (div.type=='checkbox' || div.type=='radio')) {
			div = div.parentNode;
		}
	}
	if (div) {
		var existing_border = div.style.border;
		div.style.border = '3px solid red';
		var onclick = div.getAttribute('onclick');
		div.setAttribute('onclick',"this.style.border='"+existing_border+"'; "+onclick);
		div.focus(); div.blur();
		var tag_bounds = div.getBoundingClientRect(); // returns .top, .bottom, .left, .right
		if (scroll) {
			window.scrollTo(0,tag_bounds.top-window.innerHeight/2);
		}
	} else {
		return false;
	}
}

function Track_Statistics_Warning(whence) {
	if (whence) { whence.blur(); }
	var msg = '<p style="margin-bottom:0.5em;">WARNING: GPS altitude data can be very inaccurate; therefore, the elevation gain/loss statistics that are calculated from your track data may be off by a considerable amount.  There are three ways you can potentially correct these errors:</p> ';
	msg += '<ol> ';
	msg += '<li style="margin-bottom:0.5em;">Have GPS Visualizer replace your GPS elevations with <a target="_blank" href="/elevation">DEM (Digital Elevation Model)</a> data.</li> ';
	msg += '<li style="margin-bottom:0.5em;">Set the "elevation threshold" to 5m or 10m to reduce vertical noise.</li> ';
	msg += '<li style="margin-bottom:0.5em;">Set the "trackpoint distance threshold" to reduce horizontal noise (recommended for rough terrain).</li> ';
	msg += '</ol> ';
	msg += '<p style="margin-bottom:0.5em;">For more information, read the <a target="_blank" href="/tutorials/elevation_gain.html">Elevation Gain Tutorial</a>.</a></p> ';
	msg += '<input type="button" style="display:block; margin:1em auto 0em auto; font-size:1.1em; cursor:pointer;" value="OK" onclick="Close_Modal_Window()" id="modal_ok_button" /> ';
	Highlight_Div('add_elevation',false);
	Highlight_Div('trk_distance_threshold',false);
	Highlight_Div('trk_elevation_threshold',false);
	Create_Modal_Window(msg);
	if ($('modal_ok_button')) { $('modal_ok_button').focus(); }
}

function Create_Modal_Window(html,x,y,ht,wd) {
	modal_div = document.createElement('div'); modal_div.id = 'gv_modal_window';
	modal_div.style.cssText = 'display:none; position:fixed; z-index:999999; padding-top:100px; left:0; top:0; width:100%; height:100%; overflow:auto; background-color:#999999; background-color:rgba(0,0,0,0.4);';
	modal_div.innerHTML = '<div class="modal-content" style="background-color:white; margin:auto; padding:16px; border:1px solid #666666; width:60%; min-height:150px;"><span class="close" style="float:right; color:#aaaaaa; font-size:20px; font-weight:bold; cursor:pointer; margin:0px 0px 8px 8px;" onmouseover="this.style.color=\'#cc0000\'" onmouseout="this.style.color=\'#aaaaaa\'" onclick="Close_Modal_Window();"><sup>&times;</sup></span>'+html+'</div>';
	document.body.appendChild(modal_div);
    modal_div.style.display = 'block';
	window.onclick = function(event){
		if(event.target==modal_div){Close_Modal_Window();}
	}
	document.onkeydown = ProcessKeydown;
}
function Close_Modal_Window() {
	if (modal_div) {
		modal_div.style.display = 'none';
		modal_div.parentNode.removeChild(modal_div);
		document.onkeydown = null;
	}
}

function ProcessKeydown(e) {
	e = e || window.event;
	if (('key' in e && e.key == "Escape") || ('keyCode' in e && e.keyCode == 27)) {
		Close_Modal_Window();
		document.onkeydown = null;
	}
}


function Reset_File_Input(input_id) {
	if (input_id && $(input_id) && $(input_id).type == 'file') {
		var attr = {
			name:$(input_id).name
			,multiple:$(input_id).multiple
			,onchange:$(input_id).onchange
			,css_text:$(input_id).style.cssText
		};
		var container = $(input_id).parentNode;
		
		container.removeChild($(input_id));
		var file_box = document.createElement('input');
		file_box.id = input_id;
		file_box.name = attr['name'];
		file_box.multiple = attr['multiple'];
		file_box.onchange = attr['onchange'];
		file_box.style.cssText = attr['css_text'];
		file_box.type = 'file';
		container.appendChild(file_box);
	}
}

function List_Uploaded_Files(input_id,list_id) { // trigger this with onchange in the <input type="file"> tag
	//get the input and list (<ol> or <ul> tag)
	var input = document.getElementById(input_id);
	var list = document.getElementById(list_id);
	while (list.hasChildNodes()) { list.removeChild(list.firstChild); }
	for (var x = 0; x < input.files.length; x++) {
		var li = document.createElement('li');
		li.innerHTML = input.files[x].name;
		list.append(li);
	}
}

function Load_JavaScript(url,callback) {
	gv_script_count = (self.gv_script_count) ? gv_script_count+1 : 1;
	var tag = document.createElement("script");
	tag.setAttribute("type", "text/javascript");
	tag.setAttribute("src", url);
	tag.setAttribute("id", 'gv_custom_script'+gv_script_count);
	var where = (document.getElementsByTagName('head')) ? 'head' : 'body';
	if (!self.gv_script_callback) { gv_script_callback = []; }
	if (callback) { gv_script_callback[gv_script_count] = callback; } // then, "eval(gv_script_callback[gv_script_count])" can go in the bottom of the script that's loaded
	document.getElementsByTagName(where).item(0).appendChild(tag);
}

function Store_Form_Defaults(form_name) {
	if (document.forms[form_name]) {
		if (!self.form_defaults) { form_defaults = []; }
		form_defaults[form_name] = [];
		for(i=0; i<document.forms[form_name].length; i++) {
			var e = document.forms[form_name][i];
			var v = (e.type != 'checkbox' || e.checked) ? e.value : null;
			form_defaults[ form_name ][ e.name ] = v;
		}
	}
}

function Save_Form_Settings(cookie_id,form_name) {
	if (document.forms[form_name]) {
		var form_data = '';
		for(i=0;i<document.forms[form_name].length;i++) {
			var e = document.forms[form_name][i];
			if (e.type != 'file' && e.name != 'data' && e.name != 'remote_data' && e.name != 'dynamic_data' && (e.type != 'checkbox' || e.checked) && (e.type != 'radio' || e.checked)) {
				form_data += encodeURIComponent(e.name)+"="+encodeURIComponent(e.value)+"&";
			}
		}
		//alert(form_data);
		Set_Form_Cookie(encodeURIComponent(cookie_id),form_data);
		alert('The current settings in this input form have been saved as a cookie in your Web browser. (FYI, you can also save specific configurations by bookmarking the "Return to input form" link on the output page after you process your data.)');
		return true;
	} else {
		return false;
	}
}
function Load_Form_Settings(cookie_id,form_name) {
	if (document.forms[form_name]) {
		var cookie = getCookie(cookie_id);
		if (cookie !== false) {
			if (self.form_defaults && form_defaults[form_name]) { // reset the form but leave file inputs alone
				for (var n in form_defaults[form_name]) {
					if (document.forms[form_name][n]) {
						var widget = document.forms[form_name][n];
						var default_value = form_defaults[form_name][n];
						if (widget.type == 'checkbox') {
							widget.checked = (widget.value == default_value) ? true : false;
						} else if (widget.type != 'file' && widget.value != default_value) {
							widget.value = default_value;
							if (widget.onchange) { widget.onchange(); }
						}
					}
				}
			} else {
				document.forms[form_name].reset(); // simple but brutal
			}
			var kv_pairs = cookie.split('&');
			for(var i=0; i<kv_pairs.length; i++) {
				var kv = kv_pairs[i].split('=');
				var k = decodeURIComponent(kv[0]);
				var v = decodeURIComponent(kv[1]);
				if (k && document.forms[form_name][k]) {
					var widget = document.forms[form_name][k];
					if (widget.type == 'checkbox') {
						if (widget.value == v) { widget.checked = true; }
					} else if (widget.type != 'file') {
						widget.value = v;
						if (widget.onchange) { widget.onchange(); }
					}
				}
			}
			gv_form_settings_loaded = true;
			return true;
		}
	}
	return false;
}

function Set_Form_Cookie(name,value) {
	var url = "/setcookie.js";
	var params = encodeURIComponent(name)+'='+encodeURIComponent(value);
	var http = new XMLHttpRequest();
	http.open('POST',url,true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.setRequestHeader("Content-length", params.length);
	http.setRequestHeader("Connection", "close");
	http.onreadystatechange = function() {//Call a function when the state changes.
		if(http.readyState == 4 && http.status == 200) {
			// do something with the results of the POST request
		}
	}
	http.send(params);
}

function getCookie(cookie_name) {
	var name = cookie_name + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') { c = c.substring(1); }
		if (c.indexOf(name) == 0) { return c.substring(name.length, c.length); }
	}
	return false;
}
function clearKeyCookie(key) {
	var url = "/clearcookie.js";
	var params = 'key='+encodeURIComponent(key);
	var http = new XMLHttpRequest();
	http.open('POST',url,true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.setRequestHeader("Content-length", params.length);
	http.setRequestHeader("Connection", "close");
	http.send(params);
}

bg_map_changed = false;

