GVS = [];
GVS = new function() { // GVS = GPS Visualizer Sandbox
	
	this.Initialize = function() {
		GVS.ajax = new Ajax();
		
		GVS.map_div = $('gmap_div');
		GVS.map_offset = getAbsolutePosition(GVS.map_div); // getAbsolutePosition is in functions.js
		GVS.button_functions = new Array();
		GVS.toolbar_buttons = new Array();
		GVS.toolbar_buttons['pan'] = $('gv_button_pan');
		GVS.toolbar_buttons['add_wpt'] = $('gv_button_add_wpt');
		GVS.toolbar_buttons['add_trk'] = $('gv_button_add_trk');
		// GVS.toolbar_buttons['add_area'] = $('gv_button_add_area'); // leave this commented out
		GVS.toolbar_buttons['save_gpx'] = $('gv_button_save_gpx');
		GVS.toolbar_buttons['save_kml'] = $('gv_button_save_kml');
		GVS.toolbar_buttons['save_txt'] = $('gv_button_save_txt');
		GVS.Setup_Toolbar_Buttons();
		
		GVS.icon_color = 'white';
		GVS.icon_normal = '/leaflet/icons/googlemini/'+GVS.icon_color+'.png';
		GVS.icon_highlighted = '/leaflet/icons/googlemini/pink.png';
		GVS.icon_shadow = '/leaflet/icons/googlemini/shadow.png';
		GVS.wpt_array = new Array(); GVS.wpt_index = 0; GVS.wpt_count = 0;
		GVS.wpt_icon = new L.Icon({
			iconUrl:GVS.icon_normal, iconSize:[12,20], iconAnchor:[6,20], popupAnchor:[0,-20]
		});
		GVS.custom_icons = {
			palette:'images/custom_icons_16.png'
			,directory:'images/custom_icons_16/'
			,size:16
			,list:['Airport','Amusement Park','Anchor','Anchor Prohibited','Animal Tracks','ATV','Bait and Tackle','Ball Park','Bank','Bar','Beach','Beacon','Bell','Big Game','Bike Trail','Blind','Block, Blue','Block, Green','Block, Red','Blood Trail','Boat Ramp','Bowling','Bridge','Building','Buoy, White','Campground','Car','Car Rental','Car Repair','Cemetery','Church','Circle with X','Circle, Blue','Circle, Green','Circle, Red','City (Capitol)','City (Large)','City (Medium)','City (Small)','City Hall','Civil','Coast Guard','Controlled Area','Convenience Store','Cover','Covey','Crossing','Dam','Danger Area','Department Store','Diamond, Blue','Diamond, Green','Diamond, Red','Diver Down Flag 1','Diver Down Flag 2','Dock','Dot','Dot, White','Drinking Water','Dropoff','Exit','Fast Food','Fishing Area','Fishing Hot Spot Facility','Fitness Center','Flag','Flag, Blue','Flag, Green','Flag, Red','Food Source','Forest','Furbearer','Gas Station','Geocache','Geocache Found','Ghost Town','Glider Area','Golf Course','Ground Transportation','Heliport','Horn','Hunting Area','Ice Skating','Information','Letterbox Cache','Levee','Library','Light','Live Theater','Lodge','Lodging','Man Overboard','Marina','Medical Facility','Mile Marker','Military','Mine','Movie Theater','Multi-Cache','Museum','Navaid, Amber','Navaid, Black','Navaid, Blue','Navaid, Green','Navaid, Green-Red','Navaid, Green-White','Navaid, Orange','Navaid, Red','Navaid, Red-Green','Navaid, Red-White','Navaid, Violet','Navaid, White','Navaid, White-Green','Navaid, White-Red','Oil Field','Oval, Blue','Oval, Green','Oval, Red','Parachute Area','Park','Parking Area','Pharmacy','Picnic Area','Pin, Blue','Pin, Green','Pin, Red','Pizza','Police Station','Post Office','Private Field','Puzzle Cache','Radio Beacon','Rectangle, Blue','Rectangle, Green','Rectangle, Red','Reef','Residence','Restaurant','Restricted Area','Restroom','RV Park','Scales','Scenic Area','School','Seaplane Base','Shipwreck','Shopping Center','Short Tower','Shower','Ski Resort','Skiing Area','Skull and Crossbones','Small Game','Soft Field','Square, Blue','Square, Green','Square, Red','Stadium','Stump','Summit','Swimming Area','Tall Tower','Telephone','Toll Booth','TracBack Point','Trail Head','Tree Stand','Treed Quarry','Triangle, Blue','Triangle, Green','Triangle, Red','Truck','Truck Stop','Tunnel','Ultralight Area','Upland Game','Water Hydrant','Water Source','Waterfowl','Waypoint','Waypoint Flag','Weed Bed','Winery','Wrecker','Zoo']
			,anchor:{}
			,custom_anchor:{ 'Flag':[0.3,1], 'Flag, Blue':[0.3,1], 'Flag, Green':[0.3,1], 'Flag, Red':[0.3,1], 'Pin, Blue':[0.05,0.95], 'Pin, Green':[0.05,0.95], 'Pin, Red':[0.05,0.95], 'Golf Course':[0.5,0.7] }
			,palette_index:[], palette_position:[], icon_file:[]
			,last_selected:null, most_recent:[]
		}
		for (i in GVS.custom_icons.list) {
			var sym = GVS.custom_icons.list[i];
			GVS.custom_icons.palette_index[sym] = i;
			GVS.custom_icons.palette_position[sym] = '0px -'+(GVS.custom_icons.size*i)+'px';
			GVS.custom_icons.icon_file[sym] = GVS.custom_icons.directory+sym+'.png';
			GVS.custom_icons.anchor[sym] = (GVS.custom_icons.custom_anchor[sym] && GVS.custom_icons.custom_anchor[sym].length == 2) ? [GVS.custom_icons.size*GVS.custom_icons.custom_anchor[sym][0],GVS.custom_icons.size*GVS.custom_icons.custom_anchor[sym][1]] : [GVS.custom_icons.size*0.5,GVS.custom_icons.size*0.5];
		}
		
		GVS.Setup_Track_Color_Picker();
		GVS.Setup_Marker_Color_Picker();
		
		GVS.trk_array = new Array(); GVS.trk_index = 0; GVS.trk_index_2d = 0; GVS.trk_count = 0; GVS.current_trk_index = null;
		GVS.trk_color = '#ff0000'; GVS.trk_width = 3; GVS.trk_opacity = 0.9;
		// GVS.trk_colors = ['#ff0000','#ff9900','#00cc99','#0000ff','#cc00cc'];
		GVS.area_color = '#9933ff'; GVS.area_width = 2; GVS.area_opacity = 0.9; GVS.area_fill_opacity = 0.2;
		
		GVS.vertex_size = (gvg.mobile_browser) ? 10 : 9;
		GVS.vertex_icon = '<span style="display:block; width:'+GVS.vertex_size+'px; height:'+GVS.vertex_size+'px; background-color:rgb(255,255,255,0.8); border:1px solid black; border-radius:50%;" />';
		GVS.vertex_icon_colorized = function(c) {
			return L.divIcon({ className:'', html:GVS.vertex_icon.replace(/1px solid black/,'1px solid '+c), iconSize:[GVS.vertex_size,GVS.vertex_size]});
		}
		GVS.handle_size = (gvg.mobile_browser) ? 9 : 7;
		GVS.handle_icon = '<span style="display:block; width:'+GVS.handle_size+'px; height:'+GVS.handle_size+'px; background-color:rgb(255,255,255,0.8); border:1px solid black;" />';
		GVS.handle_icon_colorized = function(c) {
			return L.divIcon({ className:'', html:GVS.handle_icon.replace(/1px solid black/,'1px solid '+c), iconSize:[GVS.handle_size,GVS.handle_size]});
		}
		
		GVS.listeners = new Array();
		GVS.info_window = new L.Popup({maxWidth:240});
		GVS.edit_window = new L.Popup({maxWidth:240});
		GVS.query_windows = new Array();
		
		GVS.Map_Click_Closes_Windows();
		GVS.Initialize_Point_Query();
		
		window.onkeypress = function(e) { if (!e) { e = window.event; } if (e.keyCode==27) { GVS.Close_All_Windows(); return false; } }
		if (!self.gvg) { gvg = {}; }
	}
	
	this.Setup_Track_Color_Picker = function() {
		GVS.color_picker_trk = { current_track:null };
		GVS.color_picker_trk.colors = {
			'default':[ '#ff0000','#ff8000','#ffff00','#80ff00','#00ff00','#00ff80','#00ffff','#0080ff','#0000ff','#8000ff','#ff00ff','#ff0080',   '#cc0000','#cc6600','#cccc00','#66cc00','#00cc00','#00cc66','#00cccc','#0066cc','#0000cc','#6600cc','#cc00cc','#cc0066',   '#8c0000','#8c4600','#8c8c00','#468c00','#008c00','#008c46','#008c8c','#00468c','#00008c','#46008c','#8c008c','#8c0046',   '#ffffff','#e8e8e8','#d1d1d1','#b9b9b9','#a2a2a2','#8b8b8b','#747474','#5d5d5d','#464646','#2e2e2e','#171717','#000000' ]
			,'Garmin':[ 'Black','DarkRed','DarkGreen','DarkYellow','DarkBlue','DarkMagenta','DarkCyan','LightGray','DarkGray','Red','Green','Yellow','Blue','Magenta','Cyan','White' ]
		};
		GVS.color_picker_trk.columns = { 'default':12, 'Garmin':8, 'other':4 };
		GVS.color_picker_trk.color_defs = {
			'Garmin':{ 'Black':'#000000', 'DarkRed':'#750a00', 'DarkGreen':'#0A7100', 'DarkYellow':'#929000', 'DarkBlue':'#001073', 'DarkMagenta':'#751874', 'DarkCyan':'#0e9193', 'LightGray':'#cbcbcb', 'DarkGray':'#737373', 'Red':'#fd2500', 'Green':'#22f900', 'Yellow':'#f3f000', 'Blue':'#525fff', 'Magenta':'#fd40ff', 'Cyan':'#22fdff', 'White':'#ffffff', 'Orange':'#ffa500', 'Purple':'#800080' }
		};
		
		if (!GVS.color_picker_trk.html) {
			var tabs = []; var blocks = [];

			for (var p in GVS.color_picker_trk.colors) {
				var cs = GVS.color_picker_trk.colors[p];
				var size = (GVS.color_picker_trk.columns[p] < 12) ? Math.floor(108/GVS.color_picker_trk.columns[p]) : 9;
				var size_css = (size != 9) ? ' width:'+size+'px; height:'+size+'px;' : '';
				var block = '<table id="trk_palette_block:'+p+'" style="display:none;" cellpadding="0" cellspacing="0">';
				for (var x=0; x<cs.length; x++) {
					if (x % GVS.color_picker_trk.columns[p] == 0) { block += '<tr>'; }
					var bg = (GVS.color_picker_trk.color_defs[p] && GVS.color_picker_trk.color_defs[p][ cs[x] ]) ? GVS.color_picker_trk.color_defs[p][ cs[x] ] : cs[x];
					var border_css = (bg == '#ffffff') ? 'border-color:#e8e8e8;' : '';
					var id = 'id="cp:'+p+':'+cs[x].replace(/\#/,'')+'"';
					block += '<td '+id+' class="gv_color_picker_cell" style="background-color:'+bg+'; '+border_css+size_css+'" onclick="GVS.Pick_Track_Color(\''+cs[x]+'\',\''+p+'\')"><!-- --></td>';
					if (x % GVS.color_picker_trk.columns[p] == (GVS.color_picker_trk.columns[p]-1)) { block += '</tr>'; }
				}
				block += '</table>';
				blocks.push(block);
				
				var tab = '<td id="trk_palette_tab:'+p+'" style="height:15px; overflow:hidden; padding:2px; font:10px Verdana,sans-serif; text-align:right; background-color:#ffffff; border:solid 1px black; border-right-color:transparent;">';
				tab += '<a href="javascript:void(0)" onclick="GVS.color_picker_trk.switch_palette(\''+p+'\');" style="text-decoration:none; color:#006600;">'+p+'</a>';
				tab += '</td>';
				tabs.push(tab);
			}
			var rowspan = tabs.length+1;
			var cp_html = '<table cellspacing="0" cellpadding="0" border="0" style="margin-top:8px; border-collapse:collapse; min-height:60px;">';
			cp_html += '<tr valign="middle">';
			cp_html += '<td valign="top" style="overflow:hidden; padding:1px; font:9px Verdana,sans-serif; text-align:left; border:solid 1px transparent; border-right-color:black; border-bottom-color:black;">colors:</td>';
			cp_html += '<td rowspan="'+rowspan+'" style="height:45px; padding:4px; overflow:hidden; border:solid 1px black; border-left-color:transparent;">';
			for (var i=0; i<blocks.length; i++) { cp_html += blocks[i]; }
			cp_html += '</td>';
			cp_html += '</tr>';
			for (var i=0; i<tabs.length; i++) {
				cp_html += '<tr valign="middle">'+tabs[i]+'</tr>';
			}
			cp_html += '</table>';
			
			GVS.color_picker_trk.html = cp_html;
		}
		
		GVS.color_picker_trk.switch_palette = function(new_p) {
			if (!new_p) { new_p = 'default'; }
			for (var p in GVS.color_picker_trk.colors) {
				if (p == new_p) {
					if ($('trk_palette_tab:'+p)) { $('trk_palette_tab:'+p).style.borderRightColor = 'transparent'; $('trk_palette_tab:'+p).style.backgroundColor = '#ffffff'; }
					if ($('trk_palette_block:'+p)) { $('trk_palette_block:'+p).style.display = 'block'; }
				} else {
					if ($('trk_palette_tab:'+p)) { $('trk_palette_tab:'+p).style.borderRightColor = 'black'; $('trk_palette_tab:'+p).style.backgroundColor = '#dddddd'; }
					if ($('trk_palette_block:'+p)) { $('trk_palette_block:'+p).style.display = 'none'; }
				}
			}
		}
	}

	this.Setup_Marker_Color_Picker = function() {
		GVS.color_picker_wpt = { 'current_marker':null, 'open':false };
		GVS.color_picker_wpt.colors = {
			'default':[ '#ff0000','#ff8000','#ffff00','#80ff00','#00ff00','#00ff80','#00ffff','#0080ff','#0000ff','#8000ff','#ff00ff','#ff0080',   '#cc0000','#cc6600','#cccc00','#66cc00','#00cc00','#00cc66','#00cccc','#0066cc','#0000cc','#6600cc','#cc00cc','#cc0066',   '#8c0000','#8c4600','#8c8c00','#468c00','#008c00','#008c46','#008c8c','#00468c','#00008c','#46008c','#8c008c','#8c0046',   '#ffffff','#e8e8e8','#d1d1d1','#b9b9b9','#a2a2a2','#8b8b8b','#747474','#5d5d5d','#464646','#2e2e2e','#000000','none' ]
		};
		GVS.color_picker_wpt.columns = { 'default':12 };
		GVS.color_picker_wpt.color_defs = {
		};
		GVS.color_picker_wpt.last_picked = null;
		if (!GVS.color_picker_wpt.html) {
			var tabs = []; var blocks = [];

			for (var p in GVS.color_picker_wpt.colors) {
				var cs = GVS.color_picker_wpt.colors[p];
				var block = '<table id="wpt_palette_block:'+p+'" style="display:none;" cellpadding="0" cellspacing="0">';
				for (var x=0; x<cs.length; x++) {
					if (x % GVS.color_picker_wpt.columns[p] == 0) { block += '<tr align="center" valign="middle">'; }
					var bg = (GVS.color_picker_wpt.color_defs[p] && GVS.color_picker_wpt.color_defs[p][ cs[x] ]) ? GVS.color_picker_wpt.color_defs[p][ cs[x] ] : cs[x];
					var border_css = (bg == '#ffffff') ? 'border-color:#e8e8e8;' : '';
					var id = 'id="cp:'+p+':'+cs[x].replace(/\#/,'')+'"';
					var content = (bg == 'none') ? '<img src="images/tiny_x.png" width="5" height="5" border="0" style="display:block;">' : '<!-- -->';
					block += '<td '+id+' class="gv_color_picker_cell2" style="background-color:'+bg+'; '+border_css+'" onclick="GVS.Pick_Marker_Color(\''+cs[x]+'\',\''+p+'\')">'+content+'</td>';
					if (x % GVS.color_picker_wpt.columns[p] == (GVS.color_picker_wpt.columns[p]-1)) { block += '</tr>'; }
				}
				block += '</table>';
				blocks.push(block);
				
				var tab = '<td id="wpt_palette_tab:'+p+'" style="height:15px; overflow:hidden; padding:2px; font:10px Verdana,sans-serif; text-align:right; background-color:#ffffff; border:solid 1px black; border-right-color:transparent;">';
				tab += '<a href="javascript:void(0)" onclick="GVS.color_picker_wpt.switch_palette(\''+p+'\');" style="text-decoration:none; color:#006600;">'+p+'</a>';
				tab += '</td>';
				tabs.push(tab);
			}
			var rowspan = tabs.length+1;
			var cp_html = '';
			for (var i=0; i<blocks.length; i++) { cp_html += blocks[i]; }
			GVS.color_picker_wpt.html = cp_html;
		}
		
		GVS.color_picker_wpt.switch_palette = function(new_p) {
			if (!new_p) { new_p = 'default'; }
			for (var p in GVS.color_picker_wpt.colors) {
				if (p == new_p) {
					if ($('wpt_palette_tab:'+p)) { $('wpt_palette_tab:'+p).style.borderRightColor = 'transparent'; $('wpt_palette_tab:'+p).style.backgroundColor = '#ffffff'; }
					if ($('wpt_palette_block:'+p)) { $('wpt_palette_block:'+p).style.display = 'block'; }
				} else {
					if ($('wpt_palette_tab:'+p)) { $('wpt_palette_tab:'+p).style.borderRightColor = 'black'; $('wpt_palette_tab:'+p).style.backgroundColor = '#dddddd'; }
					if ($('wpt_palette_block:'+p)) { $('wpt_palette_block:'+p).style.display = 'none'; }
				}
			}
		}
	}
	
	this.Setup_Toolbar_Buttons = function() {
		
		GVS.button_functions['pan'] = function() {
			GVS.Close_All_Windows();
			GVS.Highlight_Button('pan');
			GVS.Return_To_Idle_State();
		};
		if (GVS.toolbar_buttons['pan']) { GVS.toolbar_buttons['pan'].onclick = GVS.button_functions['pan']; }
		
		GVS.button_functions['add_wpt'] = function() {
				GVS.Close_All_Windows();
				if (GVS.current_operation == 'add_wpt') {
					GVS.Return_To_Idle_State();
				} else {
					GVS.Return_To_Idle_State();
					GVS.Highlight_Button('add_wpt');
					GVS.Add_Markers();
				}
			};
		if (GVS.toolbar_buttons['add_wpt']) { GVS.toolbar_buttons['add_wpt'].onclick = GVS.button_functions['add_wpt']; }
		
		GVS.button_functions['add_trk'] = function() {
			GVS.Close_All_Windows();
			if (GVS.current_operation == 'add_trk' || GVS.current_operation == 'edit_trk') {
				GVS.Return_To_Idle_State();
			} else {
				GVS.Return_To_Idle_State();
				GVS.Highlight_Button('add_trk');
				GVS.Add_Track(false);
			}
		};
		if (GVS.toolbar_buttons['add_trk']) { GVS.toolbar_buttons['add_trk'].onclick = GVS.button_functions['add_trk']; }
		
		GVS.button_functions['add_area'] = function() {
			GVS.Close_All_Windows();
			if (!self.GeographicLib) { GV_Load_JavaScript(gvg.script_directory+'geographiclib.min.js',null,true); }
			if (GVS.current_operation == 'add_area' || GVS.current_operation == 'edit_area') {
				GVS.Return_To_Idle_State();
			} else {
				GVS.Return_To_Idle_State();
				GVS.Highlight_Button('add_trk');
				GVS.Add_Track(true);
			}
		};
		if (GVS.toolbar_buttons['add_area']) { GVS.toolbar_buttons['add_area'].onclick = GVS.button_functions['add_area']; }
		
		GVS.button_functions['save_txt'] = function() {
			GVS.Return_To_Idle_State();
			GVS.Download_Data('txt');
		};
		if (GVS.toolbar_buttons['save_txt']) { GVS.toolbar_buttons['save_txt'].onclick = GVS.button_functions['save_txt']; }
		
		GVS.button_functions['save_gpx'] = function() {
			GVS.Return_To_Idle_State();
			GVS.Download_Data('gpx');
		};
		if (GVS.toolbar_buttons['save_gpx']) { GVS.toolbar_buttons['save_gpx'].onclick = GVS.button_functions['save_gpx']; }
		
		GVS.button_functions['save_kml'] = function() {
			GVS.Return_To_Idle_State();
			GVS.Download_Data('kml');
		};
		if (GVS.toolbar_buttons['save_kml']) { GVS.toolbar_buttons['save_kml'].onclick = GVS.button_functions['save_kml']; }
		
		
		GVS.Highlight_Button('pan');
	}
	
	this.Toggle_Polygon_Button = function(img_id,label_id) {
		if (!$(img_id) || !$(label_id)) { return false; }
		if ($(img_id).src.indexOf('trk') > -1) {
			$(label_id).innerHTML = 'area';
			$(img_id).src = $(img_id).src.replace(/trk/,'area');
			$(img_id).onclick = GVS.button_functions['add_area'];
		} else {
			$(label_id).innerHTML = 'trk';
			$(img_id).src = $(img_id).src.replace(/area/,'trk');
			$(img_id).onclick = GVS.button_functions['add_trk'];
		}
	}
	
	this.Highlight_Button = function(button_id) {
		gmap.getContainer().style.cursor = null;
		GVS.Cursor_Tooltip.Stop();
		for (j in GVS.toolbar_buttons) {
			var old_src = GVS.toolbar_buttons[j].src;
			var new_src;
			if (j == button_id) {
				new_src = old_src.replace(/\/(\w+)\.(png|gif|jpg)$/,"/$1-selected.$2");
				GVS.toolbar_buttons[j].style.borderColor = '#006600';
				GVS.toolbar_buttons[j].style.borderWidth = '2px';
				GVS.toolbar_buttons[j].style.margin = '0px';
			} else {
				new_src = old_src.replace(/\/(\w+)-selected\.(png|gif|jpg)$/,"/$1.$2");
				GVS.toolbar_buttons[j].style.borderColor = '#cccccc';
				GVS.toolbar_buttons[j].style.borderWidth = '1px';
				GVS.toolbar_buttons[j].style.margin = '1px';
			}
			if (new_src != old_src) {
				GVS.toolbar_buttons[j].src = new_src;
			}
		}	
	}
	
	this.Return_To_Idle_State = function() {
		
		GVS.current_operation = null;
		if (GVS.current_trk_index) { GVS.Stop_Editing_Track(); return false; }
		gmap.clearAllEventListeners('click');
		if ($('gv_crosshair') && this.listeners['crosshair_add_marker']) {
			L.DomEvent.off($('gv_crosshair'),'click',this.listeners['crosshair_add_marker']);
		}
		if ($('gv_crosshair')) { $('gv_crosshair').style.pointerEvents = 'none'; }
		gmap.getContainer().style.cursor = null;
		gmap.options.scrollwheelZoom = true; // in case it was disabled in one of the windows
		GVS.Cursor_Tooltip.Stop();
		GVS.Highlight_Button('pan');
		// LEAFLET?? GVS.Map_Click_Closes_Windows();

	}
	
	this.Add_Click_Listener = function (op) {
		if (op == 'add_wpt') {
			// LEAFLET?? gmap.removeEventListener(GVS.listeners[op]);
			GVS.listeners[op] = function(click){GVS.Create_New_Marker(click)};
			gmap.addOneTimeEventListener('click',GVS.listeners[op]);
		}
		else if (op == 'add_trk' || op == 'add_area') {
			// LEAFLET?? gmap.removeEventListener(GVS.listeners[op]);
			GVS.listeners[op] = function(click){GVS.Create_New_Track(click)};
			gmap.addOneTimeEventListener('click',GVS.listeners[op]);
		}
		else if (op == 'edit_trk' || op == 'edit_area') {
			// LEAFLET?? gmap.removeEventListener(GVS.listeners[op]);
			GVS.listeners[op] = function(click){GVS.Edit_Track(GVS.current_trk_index,click)};
			gmap.addOneTimeEventListener('click',GVS.listeners[op]);
		}
	}
	this.Clear_Click_Listener = function() {
		//gmap.clearAllEventListeners('click');
	}
	this.Close_All_Windows = function() {
		if (GVS.info_window) { GVS.info_window.remove(); }
		if (GVS.edit_window) { GVS.edit_window.remove(); }
		gmap.options.scrollwheelZoom = true; // in case it was disabled in one of the windows
	}
	this.Map_Click_Closes_Windows = function() {
		//GVS.listeners['close_windows'] = gmap.addEventListener('click',function(){ GVS.Close_All_Windows(); });
	}
	this.Track_Recent_Icons = function() {
		if ($('wpt_index') && $('wpt_index').value && $('edit_wpt_icon['+$('wpt_index').value+']')) {
			var sym = $('edit_wpt_icon['+$('wpt_index').value+']').value;
			GVS.custom_icons.most_recent.unshift(sym);
			if (sym) { GVS.custom_icons.custom_icon_used = true; }
		}		
	}
	
	this.Add_Markers = function() {
			
		if ($('gv_crosshair')) {
			$('gv_crosshair').style.pointerEvents = 'auto';
			this.listeners['crosshair_add_marker'] = function() { GVS.Create_New_Marker( {latlng:gmap.getCenter()} ); }
			L.DomEvent.on($('gv_crosshair'),'click',this.listeners['crosshair_add_marker']);
		}
		
		gmap.getContainer().style.cursor = 'crosshair';
		GVS.Cursor_Tooltip.tooltip_text = 'click to add a new marker';
		GVS.Cursor_Tooltip.Start();
		
		GVS.current_operation = 'add_wpt';
		GVS.Add_Click_Listener(GVS.current_operation);
		
	}
	this.Create_New_Marker = function(click,opts) {
		var edit = (!opts || (opts && opts.edit)) ? true : false;
		var ll = (opts && opts.position) ? opts.position : click.latlng;
		if (!ll) { return false; }
		var marker_icon_options = CloneArray(GVS.wpt_icon.options);
		var current_icon = (opts && opts.icon) ? opts.icon : ((GVS.custom_icons.last_selected) ? GVS.custom_icons.last_selected : null);
		if (current_icon && GVS.custom_icons.icon_file[current_icon]) { // it's a built-in custom icon
			marker_icon_options.iconUrl = GVS.custom_icons.icon_file[current_icon];
			marker_icon_options.iconSize = [GVS.custom_icons.size,GVS.custom_icons.size];
			marker_icon_options.iconAnchor = GVS.custom_icons.anchor[current_icon];
			marker_icon_options.popupAnchor = [0,-GVS.custom_icons.size*0.5];
		} else if (current_icon && current_icon.toString().match(/^http/)) {
			// it's a remote icon; this may be supported later
		}
		GVS.wpt_index += 1;

		var w = new L.Marker(ll, {icon:L.icon(marker_icon_options), draggable:true});
		w.gvi = {};
		w.gvi.type = 'wpt';
		w.gvi.index = GVS.wpt_index;
		w.gvi.name = (opts && opts.name) ? opts.name : '';
		w.gvi.icon = (current_icon) ? current_icon : '';
		w.gvi.size = w.getIcon().size;
		w.gvi.anchor = w.getIcon().anchor;
		w.gvi.alt = (opts && opts.alt) ? parseFloat(opts.alt) : null;
		w.gvi.alt_source = (opts && opts.alt_source) ? opts.alt_source : null;
		w.gvi.coords = GVS.Marker_Coordinates(w); // sets w.gvi.coords, which is what appears in the info window
		w.options.title = (w.gvi.name) ? w.gvi.name : '';
		if (!w.gvi.icon && !w.gvi.color && GVS.color_picker_wpt.last_picked) { w.gvi.color = GVS.color_picker_wpt.last_picked; }
		w.addTo(gmap);
		
		GVS.wpt_array[GVS.wpt_index] = w;
		GVS.wpt_count += 1;
		
		if (opts && opts.color) {
			GVS.Alter_Marker(GVS.wpt_index,'color',opts.color);
		}
		
		w.on('click', function() {
			GVS.Open_Marker_Info_Window(w.gvi.index);
		});
		w.on('dblclick', function() {
			GVS.Edit_Marker(w.gvi.index);
		});
		w.on('contextmenu', function() {
			GVS.Edit_Marker(w.gvi.index);
		});
		w.on('dragstart', function() {
			if ($('edit_wpt_name['+w.gvi.index+']')) {
				w.gvi.temporary_name = $('edit_wpt_name['+w.gvi.index+']').value;
			}
		});
		w.on('dragend', function() {
			window.setTimeout("GVS.Open_Marker_Edit_Window("+w.gvi.index+")",1); // without the timeout "delay," it wants to open the info window instead of the edit window (because of the "click" event that happened before dragging?)
		});
		w.on('position_changed', function() {
			if (w && w.gvi && w.gvi.alt) { w.gvi.alt = null; } // and then maybe re-lookup the elevation?
			w.gvi.coords = GVS.Marker_Coordinates(w);
		});
		
		GVS.Build_Element_List();
		
		if (edit) {
			GVS.Edit_Marker(w.gvi.index);
		}
		GVS.Add_Click_Listener(GVS.current_operation); // won't do anything if it's not still in "add_wpt" mode
	}
	this.Edit_Marker = function(i) {
		if (GVS.wpt_array[i]) {
			var w = GVS.wpt_array[i];
//alert ('Editing marker #'+i+'...');
			GVS.Open_Marker_Edit_Window(i);
			GVS.wpt_array[i].dragging.enable();
			GVS.draggable_wpt_index = i;
		} else {
			alert ("Edit_Marker: marker #"+i+" does not exist!  (This may be a bug in the Sandbox's code.)");
		}
	}
	this.Alter_Marker = function(i,field,value) {
//alert ('Altering the '+field+' property of marker #'+i+' to become "'+value+'"');
		if (GVS.wpt_array[i] && GVS.wpt_array[i].gvi) {
			var w = GVS.wpt_array[i];
			w.gvi[field] = value;
			if (field == 'name') {
				w._icon.title = value; // Leaflet bug means we have to alter ._icon, which may break in the future
			} else if (field == 'icon') {
				if (value && GVS.custom_icons.icon_file[value]) {
					var new_icon = new L.Icon(CloneArray(w.options.icon.options));
					new_icon.options.iconUrl = GVS.custom_icons.icon_file[value];
					new_icon.options.iconSize = [GVS.custom_icons.size,GVS.custom_icons.size];
					new_icon.options.iconAnchor = [GVS.custom_icons.size*0.5,GVS.custom_icons.size*0.5];
					new_icon.options.popupAnchor = [0,-(GVS.custom_icons.size*0.5)];
					if (GVS.custom_icons.custom_anchor[value]) {
						new_icon.options.iconAnchor = [GVS.custom_icons.size*GVS.custom_icons.custom_anchor[value][0],GVS.custom_icons.size*GVS.custom_icons.custom_anchor[value][1]];
					}
					w.setIcon(new_icon);
					w.gvi.icon = value;
					w.gvi.size = new_icon.options.iconSize;
					w.gvi.anchor = new_icon.options.iconAnchor;
					GVS.color_picker_wpt.last_picked = null;
				} else {
					w.setIcon(GVS.wpt_icon);
					w.gvi.icon = null;
					w.gvi.size = GVS.wpt_icon.options.iconSize;
					w.gvi.anchor = GVS.wpt_icon.options.iconAnchor;
				}
			}
			else if (field == 'color' && !w.gvi.icon) {
				var new_icon = new L.Icon(CloneArray(w.options.icon.options));
				new_icon.options.iconUrl = new_icon.options.iconUrl.replace(/(\w+)\.png$/,value.replace(/\#/,'')+'.png');
				w.setIcon(new_icon);
				if ($('icon_sample['+i+']')) { $('icon_sample['+i+']').style.backgroundImage = "url('"+w.options.icon.options.iconUrl+"')"; }
			}
		} else {
			alert ("Alter_Marker: marker #"+i+" does not exist!  (This may be a bug in the Sandbox's code.)");
		}
	}
	this.Finalize_Marker = function(i) {
		if (GVS.wpt_array[i] && GVS.wpt_array[i].gvi) {
			GVS.Track_Recent_Icons();
			GVS.wpt_array[i].dragging.disable();
			GVS.Open_Marker_Info_Window(i);
			// LEAFLET?? GVS.Map_Click_Closes_Windows();
			GVS.Build_Element_List();
		} else {
			alert ("Finalize_Marker: marker #"+i+" does not exist!  (This may be a bug in the Sandbox's code.)");
		}
	}
	this.Delete_Marker = function(i) {
		if (GVS.wpt_array[i]) {
			GVS.wpt_array[i].remove();
			GVS.wpt_array[i] = null;
			GVS.wpt_count -= 1;
		}
		GVS.Close_All_Windows();
		GVS.Build_Element_List();
	}
	this.Open_Marker_Info_Window = function(i) {
		if (GVS.wpt_array[i]) {
			// LEAFLET?? GVS.Close_All_Windows();
			if ((GVS.draggable_wpt_index || GVS.draggable_wpt_index == '0') && GVS.wpt_array[GVS.draggable_wpt_index] && GVS.draggable_wpt_index != i) { GVS.wpt_array[GVS.draggable_wpt_index].dragging.disable(); }
			var w = GVS.wpt_array[i];
			w.unbindPopup();
			var name = (w.gvi.name) ? '<b>'+w.gvi.name+'</b>' : '[marker '+i+']';
			var iw = new L.Popup({maxWidth:240,autoPan:false});
			iw.setContent(
				'<div style="min-width:190px;">'
				+'<div style="font:11px Verdana;">'+name+'</div>'
				+(w.gvi.desc ? '<div style="font:10px Verdana; padding-top:4px;">'+w.gvi.desc+'</div>' : '')
				+(w.gvi.coords ? '<div style="font:9px Verdana; padding-top:4px;">'+w.gvi.coords+'</div>' : '')
				+'<div style="padding-top:4px;">'
				+'<a href="javascript:void(0)" style="font:9px Verdana;" onclick="GVS.Clear_Click_Listener(); GVS.Edit_Marker('+w.gvi.index+')">[edit]</a>'
				+'&nbsp;&nbsp;<a href="javascript:void(0)" style="font:9px Verdana;" onclick="GVS.Clear_Click_Listener(); GVS.Delete_Marker('+w.gvi.index+')">[delete]</a>'
				+'</div>'
				+'</div>'
			);
			w.bindPopup(iw);
			w.openPopup();
		}
	}
	this.Open_Marker_Edit_Window = function(i) {
		if (GVS.wpt_array[i]) {
			if (GVS.info_window) { GVS.info_window.remove(); }
			if ((GVS.draggable_wpt_index || GVS.draggable_wpt_index == '0') && GVS.wpt_array[GVS.draggable_wpt_index] && GVS.draggable_wpt_index != i) { GVS.wpt_array[GVS.draggable_wpt_index].dragging.disable(); }
			var w = GVS.wpt_array[i];
			w.unbindPopup();
			var edit_box_id = 'edit_wpt_name['+i+']';
			var on_submit = 'GVS.Alter_Marker('+i+',\'name\',$(\'edit_wpt_name['+i+']\').value); GVS.Finalize_Marker('+i+');';
			var name = (w.gvi.temporary_name) ? w.gvi.temporary_name : w.gvi.name;
			w.gvi.temporary_name = '';
			
			var color_menu = GVS.color_picker_wpt.html;
			GVS.color_picker_wpt.current_marker = i;
			
			var icon_src,icon_width,icon_height,icon_position;
			var current_icon = (w.gvi.icon) ? w.gvi.icon : (GVS.custom_icons.last_selected ? GVS.custom_icons.last_selected : '');
			if (current_icon && GVS.custom_icons.icon_file[current_icon]) {
				icon_src = GVS.custom_icons.palette; icon_width = GVS.custom_icons.size; icon_height = GVS.custom_icons.size; icon_position = GVS.custom_icons.palette_position[current_icon];
			} else {
				icon_src = GVS.icon_normal; icon_width = GVS.wpt_icon.options.iconSize.width; icon_height = GVS.wpt_icon.options.iconSize.height; icon_position = '50% 50%';
			}
			var icon_menu = '<table cellspacing="0" cellpadding="0" border="0" style="background:#eeeeee; padding:3px; border:1px inset #ffffff;"><tr valign="middle"><td align="center" style="width:24px; height:24px; overflow:hidden;"><div id="icon_sample['+i+']" style="width:'+icon_width+'px; height:'+icon_height+'px; background-image:url(\''+icon_src+'\'); background-repeat:no-repeat; background-position:'+icon_position+'" /></td>';
			icon_menu += '<td align="left"><select style="margin-left:3px;" id="edit_wpt_icon['+i+']" onchange="GVS.Icon_Menu_Changed('+i+',this.value);" onfocus="gmap.options.scrollwheelZoom = false;" onblur="gmap.options.scrollwheelZoom = true;" tabindex="1002">';
			icon_menu += '<option value="" style="height:'+GVS.wpt_icon.options.iconSize.height+'px; padding-left:'+(GVS.custom_icons.size+2)+'px; background-image:url(\''+GVS.icon_normal+'\'); background-repeat:no-repeat;">[icon]</option>';
			icon_menu += '<option value="">------------------------</option>';
			for (o in GVS.custom_icons.list) {
				var sym = GVS.custom_icons.list[o];
				var sel = (current_icon == sym) ? 'selected' : '';
				icon_menu += '<option value="'+sym+'" style="height:'+GVS.custom_icons.size+'px; padding-left:'+(GVS.custom_icons.size+2)+'px; background-image:url(\''+GVS.custom_icons.palette+'\'); background-repeat:no-repeat; background-position:'+GVS.custom_icons.palette_position[sym]+';" '+sel+'>'+sym+'</option>'; 
			}
			icon_menu += '</select></td>';
			var recent_icons = []; var recent_icons_hash = {}; var j = 0;
			if (GVS.custom_icons.custom_icon_used && current_icon) { recent_icons.push(''); recent_icons_hash[''] = true; } // always put the generic icon first, unless nothing else has ever been used
			while (recent_icons.length < 5 && j < GVS.custom_icons.most_recent.length) {
				var sym = GVS.custom_icons.most_recent[j];
				if (!recent_icons_hash[sym]) { recent_icons.push(sym); recent_icons_hash[sym] = true; }
				j++;
			}
			var recent_icon_list = '<div style="max-width:120px; white-space:nowrap; overflow:hidden;">';
			for (var j=0; j<recent_icons.length; j++) {
				var sym = recent_icons[j];
				var img_src = (sym) ? GVS.custom_icons.icon_file[sym] : GVS.icon_normal;
				var wd = (sym) ? GVS.custom_icons.size : GVS.wpt_icon.options.iconSize.width;
				var ht = (sym) ? GVS.custom_icons.size : GVS.wpt_icon.options.iconSize.height;
				ht = GVS.custom_icons.size;
				recent_icon_list += '<img src="'+img_src+'" height="'+ht+'" style="opacity:0.9; padding-left:3px; padding-right:3px; cursor:pointer;" onclick="GVS.Icon_Menu_Changed('+i+',\''+sym+'\');" onmouseover="this.style.background=\'#cccccc\';" onmouseout="this.style.background=\'none\';" title="'+sym+'">';
			}
			recent_icon_list += '</div>';
			var color_wheel_display = (w.gvi.icon) ? 'none' : 'block';
			icon_menu += '<td><img id="wpt_color_wheel" src="images/color_wheel.png" title="choose a color" style="display:'+color_wheel_display+'; cursor:pointer; background:white; margin-left:2px; padding:2px; border:2px solid #cccccc; border-color:#f8f8f8 #cccccc #bbbbbb #e8e8e8;" onclick="GVS.Marker_Color_Picker(true);" /></td>';
			icon_menu += '</tr>';
			icon_menu += '<tr valign="top"><td></td>';
			icon_menu += '<td align="center" id="most_recent_icon_list" style="padding-left:3px; overflow:hidden;" nowrap>'+recent_icon_list+'</td>';
			icon_menu += '<td></td></tr>';
			if (color_menu) {
				icon_menu += '<tr valign="top"><td></td><td colspan="2" align="center" id="wpt_color_picker" style="padding-left:2px; display:none;">'+color_menu+'</td></tr>';
			}
			icon_menu += '</table>';
			
			var ew = new L.Popup({maxWidth:240});
			ew.setContent( 
				'<div style="min-width:190px;">'
				+'<form name="edit_window_form" action="javascript:void(0)" style="margin:0px; padding:0px;" onsubmit="'+on_submit+'; return false;">' // so that the return key can fire the editing process
				+'<span style="font:11px Verdana;">This marker\'s name:</span><br />'
				+'<div style="text-align:nowrap"><input id="'+edit_box_id+'" type="text" name="edit_name" size="25" value="'+AttributeSafe(name)+'" tabindex="1001" /><input type="button" value="save" onclick="'+on_submit+'" tabindex="1003" /><input id="wpt_index" type="hidden" value="'+i+'" /></div>'
				+(w.gvi.desc ? '<div style="font:9px Verdana; padding-top:4px;">'+w.gvi.desc+'</div>' : '')
				+(icon_menu ? '<div style="font:9px Verdana; padding-top:4px;">'+icon_menu+'</div>' : '')
				+(w.gvi.coords ? '<div style="font:9px Verdana; padding-top:4px;">'+w.gvi.coords+'</div>' : '')
				+'</form>'
				+'</div>'
			);
			
			w.bindPopup(ew);
			w.openPopup();
			
			GVS.Pick_Marker_Color(w.gvi.color,w.gvi.palette);
			GVS.color_picker_wpt.switch_palette(w.gvi.palette);
			GVS.color_picker_wpt.open = false;
			window.setTimeout("if (document.getElementById('"+edit_box_id+"')) { document.getElementById('"+edit_box_id+"').select(); }",200);
		}
	}
	this.Marker_Color_Picker = function(wheel_clicked) {
		var w = GVS.wpt_array[ GVS.color_picker_wpt.current_marker ]; if (!w || !$('wpt_color_picker') || !$('wpt_color_wheel')) { return false; }
		var picker = $('wpt_color_picker'); var wheel = $('wpt_color_wheel');
		var colorizable_icon = (w.gvi.icon) ? false : true;
		if (colorizable_icon) {
			if (wheel_clicked && !GVS.color_picker_wpt.open) {
				picker.style.display = 'block';
				wheel.style.display = 'block'; wheel.style.opacity = 0.5;
				GVS.color_picker_wpt.open = true;
			} else {
				picker.style.display = 'none';
				wheel.style.display = 'block'; wheel.style.opacity = 1.0;
				GVS.color_picker_wpt.open = false;
			}
		} else {
			picker.style.display = 'none';
			wheel.style.display = 'none';
		}
	}
	this.Pick_Marker_Color = function(new_c,new_p) {
		if (GVS.color_picker_wpt.current_marker) {
			var w = GVS.wpt_array[ GVS.color_picker_wpt.current_marker ];
			if (!new_c) { new_c = 'none'; }
			if (!new_p) { new_p = 'default'; }
			var old_c = (w.gvi.color) ? w.gvi.color : 'none';
			var old_p = (w.gvi.palette) ? w.gvi.palette : 'default';
			if (old_c && $('cp:'+old_p+':'+old_c.replace(/\#/,''))) {
				$('cp:'+old_p+':'+old_c.replace(/\#/,'')).style.borderColor = 'transparent';
			}
			if ($('cp:'+new_p+':'+new_c.replace(/\#/,''))) {
				$('cp:'+new_p+':'+new_c.replace(/\#/,'')).style.borderColor = 'black';
			}
			w.gvi.palette = new_p;
			if (new_c == 'none') {
				GVS.Alter_Marker(GVS.color_picker_wpt.current_marker,'color',GVS.icon_color);
				w.gvi.color = null;
			} else {
				new_c = (GVS.color_picker_wpt.color_defs[new_p] && GVS.color_picker_wpt.color_defs[new_p][new_c]) ? GVS.color_picker_wpt.color_defs[new_p][new_c] : new_c;
				GVS.Alter_Marker(GVS.color_picker_wpt.current_marker,'color',new_c);
			}
			GVS.color_picker_wpt.last_picked = w.gvi.color;
			GVS.Build_Element_List();
		}
	}
	this.Icon_Menu_Changed = function(i,sym) {
		if ($('edit_wpt_icon['+i+']') && $('edit_wpt_icon['+i+']').value != sym) { // set the menu in case this was called from somewhere else
			$('edit_wpt_icon['+i+']').value = sym;
		}
		var sample = $('icon_sample['+i+']');
		if(sym && GVS.custom_icons.icon_file[sym]) {
			if (sample) {
				sample.style.backgroundImage = "url('"+GVS.custom_icons.palette+"')";
				sample.style.backgroundPosition = GVS.custom_icons.palette_position[sym];
				sample.style.width = GVS.custom_icons.size+'px';
				sample.style.height = GVS.custom_icons.size+'px';
			}
			if($('element_icon:wpt_array['+i+']')){
				$('element_icon:wpt_array['+i+']').src = GVS.custom_icons.icon_file[sym];
			}
		} else {
			if (sample) {
				sample.style.backgroundImage = "url('"+GVS.icon_normal+"')";
				sample.style.backgroundPosition = '50% 50%';
				sample.style.width = GVS.wpt_icon.options.iconSize.width+'px';
				sample.style.height = GVS.wpt_icon.options.iconSize.height+'px';
			}
			if($('element_icon:wpt_array['+i+']')){
				$('element_icon:wpt_array['+i+']').src=GVS.wpt_icon.options.iconUrl;
			}
		}
		GVS.Alter_Marker(i,'icon',sym);
		GVS.custom_icons.last_selected = sym;
		GVS.Marker_Color_Picker();
		GVS.Pick_Marker_Color('none');
	}
	
	this.Add_Track = function(is_polygon) {
		var shape_name = is_polygon ? 'area' : 'track';
		gmap.getContainer().style.cursor = 'crosshair';
		GVS.Cursor_Tooltip.tooltip_text = 'click to begin a new '+shape_name;
		GVS.Cursor_Tooltip.Start();
		
		GVS.current_operation = is_polygon ? 'add_area' : 'add_trk';
		GVS.Add_Click_Listener(GVS.current_operation);
	}
	this.Create_New_Track = function(click,opts) {
		var quiet = (opts) ? true : false;
		var is_polygon = (GVS.current_operation == 'add_area' || (opts && opts.is_polygon)) ? true : false;
		var shape_name = is_polygon ? 'area' : 'track';
		var t;
		var c = (is_polygon) ? this.area_color : this.trk_color;
		if (this.trk_colors) {
			var ci = GVS.trk_index % this.trk_colors.length; c = this.trk_colors[ci];
		}
		if (opts && opts.color) { c = opts.color; }
		if (c && opts && opts.palette && this.color_picker_trk && this.color_picker_trk.color_defs && this.color_picker_trk.color_defs[opts.palette]) {
			c = this.color_picker_trk.color_defs[opts.palette][opts.color];
		} else if (c.match(/^#[0-9a-f]{6}$/i)) {
			c = c;
		} else if (gvg.named_html_colors && gvg.named_html_colors[c]) {
			c = gvg.named_html_colors[c];
		} else {
			c = (is_polygon) ? this.area_color : this.trk_color;
		}
		var path = (opts && opts.path) ? opts.path : [click.latlng];
		if (is_polygon) {
			t = new L.Polygon(path,{bubblingMouseEvents:false,color:c,weight:this.area_width,opacity:this.area_opacity,fill:true,fillColor:c,fillOpacity:this.area_fill_opacity});
		} else {
			t = new L.Polyline(path,{bubblingMouseEvents:false,color:c,weight:this.trk_width,opacity:this.trk_opacity});
		}
		t.options.clickable = true; t.options.draggable = false;
		t.index = ++GVS.trk_index; if (!is_polygon) { GVS.trk_index_2d++; }
		t.gv_type = (is_polygon) ? 'area' : 'trk';
		t.name = (opts && opts.name) ? opts.name : '';
		if (opts && opts.color) { t.color = opts.color; }
		if (t.color && opts && opts.palette) { t.palette = opts.palette; }
		
		t.addTo(gmap);
		// this.Pick_Track_Color(t.color,t.palette);
		t.vertexes = L.layerGroup(); t.vertex_array = [];
		if (!quiet) { t.vertexes.addTo(gmap); }
		t.handles = L.layerGroup(); t.handle_array = [];
		if (!quiet) { t.handles.addTo(gmap); }
		t.vertex_ids = []; t.vertex_id_hash = {};
		var lls = GVS.Track_Coords(t);
		for (var j=0; j<lls.length; j++) {
			GVS.Add_Vertex(t,lls[j]);
		}
		
		t.on('click', function(click) {
			if ((GVS.current_operation == 'edit_trk' || GVS.current_operation == 'edit_area') && GVS.current_trk_index == t.index) {
				GVS.Open_Track_Edit_Window(t.index,click);
			} else {
				GVS.Open_Track_Info_Window(t.index,click);
			}
		});
		
		GVS.trk_array[GVS.trk_index] = t;
		GVS.trk_count += 1;
		
		GVS.Build_Element_List();
		
		if (quiet) {
			GVS.Update_Track_Info(t);
		} else {
			GVS.current_trk_index = t.index;
			gmap.getContainer().style.cursor = 'crosshair';
			GVS.Cursor_Tooltip.Change_Text('click to add trackpoints, right-click to delete');
			GVS.current_operation = 'edit_'+t.gv_type;
			GVS.Clear_Click_Listener();
			GVS.Add_Click_Listener(GVS.current_operation);
		}
	}
	this.Edit_Track = function(i,click) {
//alert ('arrived in Edit_Track, i = '+i+', click at '+(click?click.latlng:null));
		if (GVS.trk_array[i]) { 
			var t = GVS.trk_array[i];
			if (!click || !click.latlng) {
				GVS.Open_Track_Edit_Window(i,GVS.info_window.last_click);
			}
			GVS.current_operation = 'edit_'+t.gv_type;
			GVS.Cursor_Tooltip.Start();
			if (t.vertex_array.length > 1 && t.info) {
				GVS.Cursor_Tooltip.Change_Text(t.info);
			} else {
				GVS.Cursor_Tooltip.Change_Text('click to add, right-click to delete');
			}
			gmap.getContainer().style.cursor = 'crosshair';
			t.vertexes.addTo(gmap);
			t.handles.addTo(gmap);
			GVS.current_trk_index = t.index;
			if (click && click.latlng) {
				t.addLatLng(click.latlng);
				GVS.Add_Vertex(t,click.latlng);
				GVS.current_trk_index = i;
				GVS.Add_Click_Listener(GVS.current_operation);
			} else {
				GVS.Add_Click_Listener(GVS.current_operation);
			}
			if (!GVS.listeners['trk_click_'+i]) {
				GVS.listeners['trk_click_'+i] = eval("GVS.trk_array["+i+"].on('click',function(click){ GVS.Track_Click("+i+",click); });");
				GVS.listeners['trk_rightclick_'+i] = eval("GVS.trk_array["+i+"].on('contextmenu',function(click){ GVS.Track_Rightclick("+i+",click); });");
			}
		} else {
			alert ("Edit_Track: No track is currently being edited!  (This may be a bug in the Sandbox's code.)");
		}
	}
	this.Add_Vertex = function(t,ll,n) {
		if (!ll) { return false; }
		var c = (t.color) ? t.color : (t.gv_type=='area'?GVS.area_color:GVS.trk_color);
		var v_icon = GVS.vertex_icon_colorized(c);
		var v = L.marker(ll,{draggable:true,autoPan:true,icon:v_icon});
		v.tn = t.index;
		var h_icon = GVS.handle_icon_colorized(c);
		
		if (n) { // a handle was converted, so TWO new handles must be created
//console.log("A n parameter ("+n+") was passed, so two new handles will be created. (Current length of handle_array = "+t.handle_array.length+")");
			v.vn = n;
			for (var i=n; i<t.vertex_array.length; i++) { t.vertex_array[i].vn += 1; }
			t.vertexes.addLayer(v);
			t.vertex_array.splice(n,0,v);
			
			var prev_v = t.vertex_array[n-1];
			var h1 = L.marker(GVS.Midpoint(prev_v,v),{draggable:true,autoPan:true,icon:h_icon,opacity:0.5});
			h1.tn = v.tn; h1.vn = n-1;
			GVS.Add_Handle_Listeners(h1);
			t.handles.addLayer(h1);
			t.handle_array.splice(n-1,0,h1);
			
			var next_v = t.vertex_array[n+1];
			var h2 = L.marker(GVS.Midpoint(next_v,v),{draggable:true,autoPan:true,icon:h_icon,opacity:0.5});
			h2.tn = v.tn; h2.vn = n;
			GVS.Add_Handle_Listeners(h2);
			t.handles.addLayer(h2);
			t.handle_array.splice(n,0,h2);
			
			for (var i=n+1; i<t.handle_array.length; i++) {
				t.handle_array[i].vn += 1;
			}
		} else { // a new point was added to the end; this is simpler
//console.log("No n parameter was passed, so we'll just add a point to the end. (Current length of handle_array = "+t.handle_array.length+")");
			v.vn = t.vertex_array.length; // not length-1 because this vertex hasn't been created yet
			t.vertexes.addLayer(v);
			t.vertex_array.push(v);
			
			if (v.vn > 0) {
				var prev_v = t.vertex_array[v.vn-1];
				var h = L.marker(GVS.Midpoint(prev_v,v),{draggable:true,autoPan:true,icon:h_icon,opacity:0.5});
				h.tn = v.tn; h.vn = v.vn-1;
				GVS.Add_Handle_Listeners(h);
				t.handles.addLayer(h);
				t.handle_array.push(h);
			}
//console.log("After adding a new vertex, there are "+t.handle_array.length+" handles.");
		}
		
		v.on('click',function(click){
//console.log("This vertex's index (v.vn) is "+this.vn); return;
			var lls = GVS.Track_Coords(GVS.trk_array[this.tn]);
			if (v.vn == 0 || v.vn == lls.length-1) { GVS.Stop_Editing_Track(click); }
		});
		v.on('contextmenu',function(){ GVS.Delete_Vertex(this); });
		v.on('drag',function(){ GVS.Move_Vertex(this); });
		v.on('dragend',function(){ GVS.Update_Track_Info(GVS.trk_array[this.tn]); });
		
		GVS.Update_Track_Info(t);
	}
	this.Move_Vertex = function(v) {
		if (!v || !v.getLatLng) { return false; }
		var t = GVS.trk_array[v.tn];
		var lls = GVS.Track_Coords(t);
		lls.splice(v.vn,1,v.getLatLng());
		if (t.gv_type == 'area') { t.setLatLngs([lls]); } else { t.setLatLngs(lls); }
		
		var prev_v = (v.vn > 0) ? t.vertex_array[v.vn-1] : null;
		var next_v = (v.vn < t.vertex_array.length-1) ? t.vertex_array[v.vn+1] : null;
		if (v.vn > 0) {
			t.handle_array[v.vn-1].setLatLng(GVS.Midpoint(v,prev_v));
		}
		if (v.vn < t.vertex_array.length-1) {
			t.handle_array[v.vn].setLatLng(GVS.Midpoint(v,next_v));
		}
	}
	this.Delete_Vertex = function(v) {
		var vn = v.vn;
		var t = GVS.trk_array[v.tn];
		var lls = GVS.Track_Coords(t);
		if (lls.length == 1) { return false; } // can't delete the only remaining point
		lls.splice(vn,1);
		if (t.gv_type == 'area') { t.setLatLngs([lls]); } else { t.setLatLngs(lls); }
		var prev_v = (vn > 0) ? t.vertex_array[v.vn-1] : null;
		var next_v = (vn < t.vertex_array.length-1) ? t.vertex_array[v.vn+1] : null;
		
		if (vn == 0) {
			GVS.Destroy_Handle(t,0);
		} else {
			GVS.Destroy_Handle(t,vn-1);
		}
		GVS.Destroy_Vertex(t,vn);
		
		for (var i=vn; i<t.vertex_array.length; i++) {
			t.vertex_array[i].vn -= 1;
			if (i>0 && i<=t.handle_array.length) {
				t.handle_array[i-1].vn -= 1;
			}
		}
		
		GVS.Move_Vertex(t.vertex_array[vn]); // the point that used to be v.vn+1 is now at v.vn
		
		GVS.Update_Track_Info(t);
	}
	this.Drag_Handle = function(h) {
		if (!h || !h.getLatLng) { return false; }
		var t = GVS.trk_array[h.tn];
		var lls = GVS.Track_Coords(t);
		lls.splice(h.vn+1,0,h.getLatLng());
		if (t.gv_type == 'area') { t.setLatLngs([lls]); } else { t.setLatLngs(lls); }
		
	}
	this.Move_Handle = function(h) {
		if (!h || !h.getLatLng) { return false; }
		var t = GVS.trk_array[h.tn];
		var lls = GVS.Track_Coords(t);
		lls.splice(h.vn+1,1,h.getLatLng());
		if (t.gv_type == 'area') { t.setLatLngs([lls]); } else { t.setLatLngs(lls); }
	}
	this.Convert_Handle_to_Vertex = function(h) {
		if (!h || !h.getLatLng) { return false; }
		var t = GVS.trk_array[h.tn];
		var ll = h.getLatLng(); var vn = h.vn+0;
		t.handles.removeLayer(h); h.remove(); t.handle_array.splice(h.vn,1); h = null;
		GVS.Add_Vertex(t,ll,vn+1);
	}
	this.Destroy_Handle = function(t,j) {
		t.handles.removeLayer(t.handle_array[j]); t.handle_array[j].remove(); t.handle_array[j] = null; t.handle_array.splice(j,1);
	}
	this.Destroy_Vertex = function(t,j) {
		t.vertexes.removeLayer(t.vertex_array[j]); t.vertex_array[j].remove(); t.vertex_array[j] = null; t.vertex_array.splice(j,1);
	}
	this.Add_Handle_Listeners = function(h) {
//h.on('click', function(){ console.log("This handle's vertex number (h.vn) is "+this.vn); });
		h.on('dragstart', function(){ GVS.Drag_Handle(this); });
		h.on('drag',      function(){ GVS.Move_Handle(this); });
		h.on('dragend',   function(){ GVS.Convert_Handle_to_Vertex(this); });
	}
	this.Alter_Track = function(i,field,value) {
//alert ('Altering the '+field+' property of track #'+i+' to become "'+value+'"');
		if (GVS.trk_array[i]) {
			GVS.trk_array[i][field] = value;
			GVS.Open_Track_Info_Window(i,GVS.info_window.last_click);
			// GVS.Map_Click_Closes_Windows();
			GVS.Build_Element_List();
			GVS.Stop_Editing_Track();
		} else {
			alert ("Alter_Track: track #"+i+" does not exist!  (This may be a bug in the Sandbox's code.)");
		}
	}
	this.Delete_Track = function(i) {
		if (GVS.trk_array[i]) {
			GVS.trk_array[i].vertexes.remove();
			GVS.trk_array[i].handles.remove();
			GVS.trk_array[i].remove();
			GVS.trk_array[i] = null;
			GVS.trk_count -= 1;
		}
		GVS.current_trk_index = null;
		GVS.current_operation = null;
		GVS.Close_All_Windows();
		GVS.Build_Element_List();
		GVS.Return_To_Idle_State();
	}
	this.Stop_Editing_Track = function(click) {
		if (!GVS.current_trk_index) { return false; }
		var i = GVS.current_trk_index;
		GVS.trk_array[i].vertexes.remove();
		GVS.trk_array[i].handles.remove();
		if (!GVS.trk_array[i].name && click) { // if the track hasn't been named yet, open the edit window so one can be given
			GVS.Open_Track_Edit_Window(i,click);
		}
		GVS.current_trk_index = null;
		gmap.removeEventListener('click',GVS.listeners['edit_'+GVS.trk_array[i].gv_type]); GVS.listeners['edit_'+GVS.trk_array[i].gv_type] = null;
		//gmap.removeEventListener(GVS.listeners['trk_click_'+i]); GVS.listeners['trk_click_'+i] = null;
		//gmap.removeEventListener(GVS.listeners['trk_rightclick_'+i]); GVS.listeners['trk_rightclick_'+i] = null;
		GVS.Build_Element_List();
		GVS.Return_To_Idle_State();
		// GVS.Open_Track_Edit_Window(i);
	}
	this.Track_Click = function(i,click) {
		if (GVS.trk_array[i] && GVS.trk_array[i].getLatLngs() && click && click.latlng) {
			GVS.info_window.last_click = click;
			GVS.Open_Track_Info_Window(i,click);
		}
	}
	this.Track_Rightclick = function(i,click) {
		GVS.Track_Click(i,click);
	}
	this.Open_Track_Info_Window = function(i,click,stop_editing) {
		if (GVS.trk_array[i]) {
			GVS.Close_All_Windows();
			// GVS.Stop_Editing_Track();
			var t = GVS.trk_array[i];
			var anchor;
			if (click && click.latlng) {
				anchor = click.latlng;
			} else {
				var lls = GVS.Track_Coords(t);
				var vertex = lls[lls.length-1];
				anchor = new L.LatLng(vertex.lat,vertex.lng);
			}
			GVS.info_window.setLatLng(anchor);
			GVS.info_window.last_click = click;
			
			var name = (t.name) ? '<b>'+t.name+'</b>' : '[track '+i+']';
			GVS.info_window.setContent(
				'<div style="min-width:190px;">'
				+'<div style="font:11px Verdana;">'+name+'</div>'
				+(t.desc ? '<div style="font:10px Verdana; padding-top:4px;">'+t.desc+'</div>' : '')
				+(t.info ? '<div style="font:9px Verdana; padding-top:4px;">'+t.info+'</div>' : '')
				+'<div style="padding-top:4px;">'
				+'<a href="javascript:void(0)" style="font:9px Verdana;" onclick="GVS.Return_To_Idle_State(); window.setTimeout(\'GVS.Edit_Track('+t.index+',null)\',100);">[edit]</a>'
				+'&nbsp;&nbsp;<a href="javascript:void(0)" style="font:9px Verdana;" onclick="GVS.Clear_Click_Listener(); GVS.Delete_Track('+t.index+')">[delete]</a>'
				+'</div>'
				+'</div>'
			);
			GVS.info_window.openOn(gmap);
		}
	}
	this.Open_Track_Edit_Window = function(i,click) {
		if (GVS.trk_array[i]) {
			if (GVS.info_window) { GVS.info_window.remove(); }
			var t = GVS.trk_array[i];
			var anchor;
			if (click && click.latlng) {
				anchor = click.latlng;
			} else {
				var lls = GVS.Track_Coords(t);
				anchor = lls[lls.length-1];
			}
			GVS.edit_window.setLatLng(anchor);
			
			var edit_box_id = 'edit_trk_name['+i+']';
			var on_submit = 'GVS.Clear_Click_Listener(); GVS.Alter_Track('+i+',\'name\',$(\'edit_trk_name['+i+']\').value); return false;';
			var name = (t.temporary_name) ? t.temporary_name : t.name;
			t.temporary_name = '';
			GVS.color_picker_trk.current_track = i;
			GVS.edit_window.setContent(
				'<div style="min-width:190px;">'
				+'<form name="edit_window_form" action="javascript:void(0)" style="margin:0px; padding:0px;" onsubmit="'+on_submit+'; return false;">' // so that the return key can fire the editing process
				+'<span style="font:11px Verdana;">This track\'s name:</span><br />'
				+'<div style="text-align:nowrap"><input id="'+edit_box_id+'" type="text" name="edit_name" size="25" value="'+AttributeSafe(name)+'" /><input type="button" value="save" onclick="'+on_submit+'"></div>'
				+(t.desc ? '<div style="font:10px Verdana; padding-top:4px;">'+t.desc+'</div>' : '')
				+'</form>'
				+GVS.color_picker_trk.html
				+'</div>'
			)
			GVS.info_window.last_click = anchor;
			GVS.edit_window.openOn(gmap);
			if (t.color) {
				GVS.Pick_Track_Color(t.color,t.palette);
			}
			GVS.color_picker_trk.switch_palette(t.palette);
			window.setTimeout("if (document.getElementById('"+edit_box_id+"')) { document.getElementById('"+edit_box_id+"').select(); }",200);
			// GVS.Edit_Track(i,null);
		}
	}
	this.Pick_Track_Color = function(new_c,new_p) {
		if (new_c && GVS.color_picker_trk.current_track) {
			var t = GVS.trk_array[ GVS.color_picker_trk.current_track ];
			if (!new_p) { new_p = 'default'; }
			var old_c = t.color;
			var old_p = (t.palette) ? t.palette : 'default';
			if (old_c && $('cp:'+old_p+':'+old_c.replace(/\#/,''))) {
				$('cp:'+old_p+':'+old_c.replace(/\#/,'')).style.borderColor = 'transparent';
			}
			if ($('cp:'+new_p+':'+new_c.replace(/\#/,''))) {
				$('cp:'+new_p+':'+new_c.replace(/\#/,'')).style.borderColor = 'black';
			}
			t.color = new_c; t.palette = new_p;
			new_c = (GVS.color_picker_trk.color_defs[new_p] && GVS.color_picker_trk.color_defs[new_p][new_c]) ? GVS.color_picker_trk.color_defs[new_p][new_c] : new_c;
			t.setStyle({color:new_c,fillColor:new_c});
			if (t.vertexes && t.vertexes.getLayers().length) {
				var icon = GVS.vertex_icon_colorized(new_c);
				t.vertexes.eachLayer(function(vm) { vm.setIcon(icon); });
			}
			if (t.handles && t.handles.getLayers().length) {
				var icon = GVS.handle_icon_colorized(new_c);
				t.handles.eachLayer(function(mm) { mm.setIcon(icon); });
			}
			GVS.Build_Element_List();
		}
	}
	this.Midpoint = function(marker1,marker2) {
		var p1 = gmap.project(marker1.getLatLng()); var p2 = gmap.project(marker2.getLatLng());
		return gmap.unproject(p1.add(p2).divideBy(2));
	}
	this.Track_Coords = function(t) {
		var lls = (t.gv_type=='area') ? t.getLatLngs()[0] : t.getLatLngs();
		return lls;
	}
	
	this.Cursor_Tooltip = {
		tooltip_text:''
		,Start:function() {
			GVS.Cursor_Tooltip.active = true;
			if (!GVS.Cursor_Tooltip.tooltip_div) {
				var IE = document.all?true:false;
				if (!IE) document.captureEvents(Event.MOUSEMOVE)
				GVS.map_div.onmousemove = GVS.Cursor_Tooltip.Follow;
				GVS.map_div.onmouseout = GVS.Cursor_Tooltip.Remove;
				GVS.Cursor_Tooltip.tooltip_div = document.createElement('div');
				GVS.Cursor_Tooltip.tooltip_div.id = 'gv_cursor_tooltip';
				GVS.Cursor_Tooltip.tooltip_div.style.cssText = 'display:none; position:absolute; z-index:999999; white-space:nowrap; border:1px solid #999999; background-color:#dddddd; padding:2px;';
				GVS.map_div.appendChild(GVS.Cursor_Tooltip.tooltip_div);
			}
		}
		,Stop:function() {
			GVS.Cursor_Tooltip.active = false;
			if (GVS.Cursor_Tooltip.tooltip_div) {
				GVS.Cursor_Tooltip.tooltip_div.parentNode.removeChild(GVS.Cursor_Tooltip.tooltip_div);
				GVS.Cursor_Tooltip.tooltip_div = null;
			}
			GVS.map_div.onmousemove = null;
			GVS.map_div.onmouseout = null;
		}
		,Place:function() {
			if (GVS.Cursor_Tooltip.tooltip_text) {
				var div = GVS.Cursor_Tooltip.tooltip_div;
				if (div) {
					div.innerHTML = GVS.Cursor_Tooltip.tooltip_text;
					div.style.display = 'block';
				}
			}
		}
		,Reposition:function(point) {
			GVS.Cursor_Tooltip.active = true;
			if (GVS.Cursor_Tooltip.tooltip_text) {
				var div = GVS.Cursor_Tooltip.tooltip_div;
				if (div) {
					div.innerHTML = GVS.Cursor_Tooltip.tooltip_text;
					div.style.display = 'block';
					div.style.left = point[0]+'px';
					div.style.top = point[1]+'px';
				}
			}
		}
		,Remove:function() {
			GVS.Cursor_Tooltip.active = false;
			var div = GVS.Cursor_Tooltip.tooltip_div;
			if (div) {
				div.style.display = 'none';
			}
		}
		,Change_Text:function(text) {
			GVS.Cursor_Tooltip.tooltip_text = text;
			GVS.Cursor_Tooltip.Place();
		}
		,Follow:function(e) {
			var tempX = 0;
			var tempY = 0;
			var IE = document.all?true:false;
			if (IE) { // grab the x/y positions if browser is IE
				tempX = event.clientX + document.body.scrollLeft;
				tempY = event.clientY + document.body.scrollTop;
				if (document.documentElement) {
					tempY = event.clientY + document.documentElement.scrollTop;
				} else {
					(document.body && document.body.scrollTop);
				}
			} else { // grab the x/y positions if browser is not IE
				tempX = e.pageX; tempY = e.pageY;
			}
			if (tempX < 0) { tempX = 0; } if (tempY < 0) { tempY = 0; }
			var newX = tempX-GVS.map_offset.x+8; var newY = tempY-GVS.map_offset.y+8;
			GVS.Cursor_Tooltip.Reposition([newX,newY]);
		}
	}
	
	this.Marker_Position = function(w) {
		var ll = gmap.wrapLatLng(w.getLatLng());
		return (w && ll) ? (ll.lat.toFixed(6)+','+ll.lng.toFixed(6)) : '';
	}
	this.Marker_Elevation = function(w) {
		return (w && w.gvi && w.gvi.alt) ? parseFloat(w.gvi.alt).toFixed(0)+'m ('+(parseFloat(w.gvi.alt)*3.28084).toFixed(0)+'ft)' : '';
	}
	this.Marker_Coordinates = function(w) {
		var coords = 'Lat,Lon: '+'<span style="font:10px Verdana" id="wpt_coordinates" ondblclick="SelectText(\'wpt_coordinates\')">'+GVS.Marker_Position(w)+'</span>';
		var ele = GVS.Marker_Elevation(w); if (ele) { coords += '<br/>Elevation: '+ele; }
		return coords;
	}
	
	this.Update_Track_Info = function(t) {
		if (t.vertex_array.length <= 1) { return false; }
		t.info = 'Length: '+GVS.Track_Length(t);
		if (t.gv_type == 'area') {
			var area = GVS.Track_Area(t); if (area) { t.info += '<br/>Area: '+area; }
		}
		if (gvg.mobile_browser) {
			GVS.Cursor_Tooltip.Stop();
			if ($('trk_info_row['+t.index+']')) { $('trk_info_row['+t.index+']').style.display=''; $('trk_info_cell['+t.index+']').innerHTML=t.info; }
		} else if (GVS.Cursor_Tooltip.active) {
			GVS.Cursor_Tooltip.Change_Text(t.info);
		}
	}
	this.Track_Length = function(t) {
		if (t && t.getLatLngs().length > 0) {
			var m = 0;
			var lls = GVS.Track_Coords(t);
			for(var i=1; i<lls.length; i++) {
				var segment_distance = gmap.distance(lls[i-1],lls[i]);
				m += segment_distance;
			}
			
			m = SignificantishDigits(m,4);
			var km = SignificantishDigits(m/1000,4);
			var ft = SignificantishDigits(m*3.28084,4);
			var mi = SignificantishDigits(m/1609.344,4);
			if (m < 1) {
				return '';
			} else if (m < 200) {
				return (m+' m ('+ft+' ft)');
			} else {
				return (km+' km ('+mi+' mi)');
			}
		} else {
			return '';
		}
	}
	this.Track_Area = function(t) {
		if (t && t.getLatLngs() && self.GeographicLib) {
			var pg = GeographicLib.Geodesic.WGS84.Polygon();
			for (var i=0; i<t.getLatLngs()[0].length; i++) { var ll = t.getLatLngs()[0][i]; pg.AddPoint(ll.lat,ll.lng); }
			var pg_numbers = pg.Compute(false,true);
			var sqm = Math.abs(pg_numbers.area);
			sqm = SignificantishDigits(sqm,4,100000,5);
			var sqkm = SignificantishDigits(sqm/1000000,4,100000,5);
			var sqft = SignificantishDigits(sqm*10.76391,4,100000,5);
			var sqmi = SignificantishDigits(sqm/2589988.11,4,100000,5);
			if (sqm < 1) {
				return '';
			} else if (sqm < 10000) {
				return (sqm+' sq.m ('+sqft+' sq.ft)');
			} else {
				return (sqkm+' sq.km ('+sqmi+' sq.mi)');
			}
		} else {
			return '';
		}
	}
	
	this.Highlight_Icon = function (i,opts) {
		var w = GVS.wpt_array[i];
		if (w && w.getIcon()) {
			var icon = w.getIcon();
			if(opts.url) { icon.url = opts.url; }
			if(opts.anchor) { icon.anchor = opts.anchor; }
			if(opts.scale && w.gvi && w.gvi.size) {
				icon.size = [w.gvi.size.width*opts.scale,w.gvi.size.height*opts.scale];
				icon.scaledSize = [w.gvi.size.width*opts.scale,w.gvi.size.height*opts.scale];
				icon.anchor = [w.gvi.anchor[0]*opts.scale,w.gvi.anchor[1]*opts.scale];
			}
			w.setIcon(icon);
			w.shape = null;
		}
	}
	
	this.Build_Element_List = function() {
		if (!$('gv_elements_list')) { return false; }
		var html = '';
		html += '<table cellspacing="0" cellpadding="2" border="0">';
		if (GVS.trk_array && GVS.trk_array.length) {
			for (var i=1; i<GVS.trk_array.length; i++) { // start at 1 because 0 was skipped
				var t = GVS.trk_array[i];
				if (t && t.gv_type) {
					var is_polygon = (t.gv_type == 'area') ? true : false;
					var weight = is_polygon ? this.area_width : this.trk_width;
					var shape_name = is_polygon ? 'area' : 'track';
					var name = (t.name) ? t.name : '['+shape_name+' '+i+']';
					var onclick = 'if (GVS.current_operation == \'edit_trk\') { GVS.Open_Track_Edit_Window('+i+',null); } else { GVS.Open_Track_Info_Window('+i+',null); GVS.Autozoom(GVS.trk_array['+i+'],-1); }';
					var onmouseover = 'GVS.trk_array['+i+'].setStyle({weight:'+(weight*2)+'});';
					var onmouseout = 'GVS.trk_array['+i+'].setStyle({weight:'+weight+'});';
					var c = (t.color) ? t.color : (is_polygon ? this.area_color : this.trk_color);
					if (t.palette && t.palette != 'default' && GVS.color_picker_trk.color_defs[t.palette] && GVS.color_picker_trk.color_defs[t.palette][c]) {
						c = GVS.color_picker_trk.color_defs[t.palette][c];
					}
					html += '<tr valign="top">';
					html += '<td align="center"><img src="images/'+t.gv_type+'-reverse.png" style="background-color:'+c+'; cursor:pointer;" onclick="'+onclick+'" onmouseover="'+onmouseover+'" onmouseout="'+onmouseout+'"></td>';
					html += '<td align="left" width="99%" style="padding-bottom:4px;"><a href="javascript:void(0)" style="text-decoration:none; font:11px Verdana; cursor:pointer;" onclick="'+onclick+'" onmouseover="'+onmouseover+'" onmouseout="'+onmouseout+'">'+name+'</td>';
					html += '<td align="left"><img src="images/delete.png" style="cursor:pointer" title="Delete this track" onclick="GVS.Delete_Track('+i+');" onmouseover="this.src=\'images/delete-over.png\';" onmouseout="this.src=\'images/delete.png\';"></td>';
					html += '</tr>';
					html += '<tr valign="top" style="display:none;" id="trk_info_row['+i+']"><td colspan="3" id="trk_info_cell['+i+']" style="font-size:10px;"></td></tr>';
				}
			}
		}
		if (GVS.wpt_array && GVS.wpt_array.length) {
			for (var i=1; i<GVS.wpt_array.length; i++) { // start at 1 because 0 was skipped
				var w = GVS.wpt_array[i];
				if (w && w.gvi.type) {
					var name = (w.gvi.name) ? w.gvi.name : '[marker '+i+']';
					var onclick = "gmap.setView(GVS.wpt_array["+i+"].getLatLng()); GVS.Open_Marker_Info_Window("+i+");";
					var onmouseover = "GVS.Element_List_Mouseover("+i+",true);";
					var onmouseout = "GVS.Element_List_Mouseover("+i+",false);";
					html += '<tr valign="top">';
					html += '<td align="center"><img src="'+w.options.icon.options.iconUrl+'" id="element_icon:wpt_array['+i+']" style="cursor:pointer" onclick="'+onclick+'" onmouseover="'+onmouseover+'" onmouseout="'+onmouseout+'"></td>';
					html += '<td align="left" width="99%" style="padding-bottom:4px;"><a href="javascript:void(0)" style="text-decoration:none; font:11px Verdana; cursor:pointer;" onclick="'+onclick+'" onmouseover="'+onmouseover+'" onmouseout="'+onmouseout+'">'+name+'</td>';
					html += '<td align="left"><img src="images/delete.png" style="cursor:pointer" title="Delete this element" onclick="GVS.Delete_Marker('+i+');" onmouseover="this.src=\'images/delete-over.png\';" onmouseout="this.src=\'images/delete.png\';"></td>';
					html += '</tr>';
				}
			}
		}
		html += '</table>';
		$('gv_elements_list').innerHTML = html;
	}
	
	this.Element_List_Mouseover = function(x,over) {
		var w = GVS.wpt_array[x];
		var highlighted_scale = 1.3;
		if (w.gvi.icon && GVS.custom_icons.icon_file[w.gvi.icon]) {
			if (over) {
				GVS.Highlight_Icon(x,{scale:highlighted_scale});
			} else {
				GVS.Highlight_Icon(x,{scale:1});
			}
		} else {
			if (over) {
				GVS.Highlight_Icon(x,{scale:highlighted_scale});
			} else {
				GVS.Highlight_Icon(x,{scale:1});
			}
		}
	}
	
	this.Autozoom = function(elements,adjustment) {
		var adjustment = (adjustment) ? adjustment : 0;
		var bounds = new L.LatLngBounds();
		if (elements && (elements.getLatLngs || elements.getLatLng)) { // just one item
			elements = [ elements ];
		} else if (!elements) {
			elements = [];
			if (GVS.trk_array && GVS.trk_array.length) {
				for (var i=1; i<GVS.trk_array.length; i++) { elements.push(GVS.trk_array[i]); }
			}
			if (GVS.wpt_array && GVS.wpt_array.length) {
				for (var i=1; i<GVS.wpt_array.length; i++) { elements.push(GVS.wpt_array[i]); }
			}
		}
		if (elements.length) {
			for (var i=0; i<elements.length; i++) {
				var e = elements[i];
				if (e && e.getLatLngs) {
					var lls = GVS.Track_Coords(e);
					for (var j=0; j<lls.length; j++) {
						bounds.extend(lls[j]);
					}
				} else if (e && e.getLatLng) {
					bounds.extend(e.getLatLng());
				}
			}
		}
		if (bounds && bounds.getNorthEast() && bounds.getSouthWest()) {
			if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
				gmap.setView(bounds.getNorthEast(),9);
			} else {
//alert(adjustment);
				// var z = getBoundsZoomLevel(bounds); gmap.setView(bounds.getCenter(),z+adjustment);
				gmap.fitBounds(bounds,{padding:[100,100]});
			}
		}
	}
	
	this.Toggle = function(id,showhide) {
		if ($(id)) {
			if (showhide === false) { // hide
				$(id).style.display = 'none';
			} else if (showhide === true) {
				$(id).style.display = 'block';
			} else {
				$(id).style.display = ($(id).style.display == 'none') ? 'block' : 'none';
			}
		}
	}
	
	this.Initialize_Point_Query = function() {
		GVS.listeners['point_query'] = gmap.addEventListener('contextmenu',function(click){
			GVS.Point_Query(click,null);
		});
	}
	this.Point_Query = function(click,name,desc) {
		if (!click || !click.latlng) { return false; }
		if (!name) { name = ''; }
		var coords = click.latlng.lat.toFixed(6)+', '+click.latlng.lng.toFixed(6);
		var qw = new L.Popup({maxWidth:240,autoClose:false,closeOnClick:false});
		GVS.query_windows.push(qw);
		var wn = GVS.query_windows.length-1;
		qw.gvi = { 'lat':click.latlng.lat, 'lon':click.latlng.lng, 'name':name, 'desc':desc };
		qw.setLatLng(click.latlng);
		qw.setContent(
			'<table cellspacing="0" cellpadding="0" border="0"><tr valign="top"><td rowspan="3"><img class="gv_save_button" src="'+GVS.icon_normal+'" title="Save as waypoint" onclick="GVS.query_windows['+wn+'].remove(); GVS.Create_New_Marker(null,{ \'edit\':true, \'position\':new L.LatLng(GVS.query_windows['+wn+'].gvi.lat,GVS.query_windows['+wn+'].gvi.lon), \'alt\':GVS.query_windows['+wn+'].gvi.alt, \'name\':GVS.query_windows['+wn+'].gvi.name, \'alt_source\':GVS.query_windows['+wn+'].gvi.alt_source });"></td>'
			+'<td style="font:11px Verdana,sans-serif; font-weight:bold;">'+name+'</td></tr>'
			+'<tr valign="top"><td style="font:11px Verdana,sans-serif;">'+coords+'</td></tr>'
			+'<tr valign="top"><td style="font:11px Verdana,sans-serif; margin-top:4px; min-width:160px;" id="gv_query_window_elevation['+wn+']">&nbsp;</td></tr>'
			+'</tr></table>'
			+'<div style="font:10px Verdana,sans-serif; margin-top:6px;"><a href="javascript:void(0)" onclick="GVS.Close_Query_Windows()">[close all]</div>'
		);
		qw.openOn(gmap);
		// window.setTimeout('GVS.Initialize_Point_Query()',100); // prevent double event firings by delaying it
		GVS.elevation_script = new JSONscriptRequest( 'elevation2020.js?'+'coords='+uri_escape(coords)+'&wn='+wn+'&callback='+uri_escape('GVS.Point_Query_Callback(<elev>,<source>,<wn!>)') );
		GVS.elevation_script.buildScriptTag(); // Build the dynamic script tag
		GVS.elevation_script.addScriptTag(); // Add the script tag to the page, let it do its thing
	}
	this.Point_Query_Callback = function(elev,source,wn) { // wn = window number
		if ($('gv_query_window_elevation['+wn+']') && elev !== null && elev.toString().match(/\d/)) {
			$('gv_query_window_elevation['+wn+']').innerHTML = 'Elevation: '+parseFloat(elev).toFixed(0)+'m ('+(parseFloat(elev)*3.28084).toFixed(0)+'ft)';
			GVS.query_windows[wn].gvi.alt = parseFloat(elev);
			GVS.query_windows[wn].gvi.alt_source = 'DEM';
		}
		GVS.elevation_script.removeScriptTag(); // Clean it up
	}
	this.Close_Query_Windows = function() {
		for (var i=0; i<GVS.query_windows.length; i++) {
			GVS.query_windows[i].remove();
		}
		GVS.query_windows = [];
	}

	this.Build_Post_Query = function(format) {
		var query = 'format='+format;
		var n = 0;
		var fields = {'lat':1,'lon':1,'name':1};
		for (var i=1; i<GVS.wpt_array.length; i++) { // start at 1 because 0 was skipped
			var w = GVS.wpt_array[i];
			if (w && w.gvi && w.gvi.type) {
				if (w.gvi.name && w.gvi.name != '') { query += "&wpt["+n+"][name]="+uri_escape(w.gvi.name.toString()); fields.name = 1; }
				if (w.gvi.desc && w.gvi.desc != '') { query += "&wpt["+n+"][desc]="+uri_escape(w.gvi.desc.toString()); fields.desc = 1; }
				if (w.gvi.icon && w.gvi.icon != '') { query += "&wpt["+n+"][icon]="+uri_escape(w.gvi.icon.toString()); fields.icon = 1; }
				if (w.gvi.color && w.gvi.color != '') { query += "&wpt["+n+"][color]="+uri_escape(w.gvi.color.toString()); fields.color = 1; }
				if (w.gvi.color && w.gvi.color != '' && w.gvi.palette && w.gvi.palette != '') { query += "&wpt["+n+"][palette]="+uri_escape(w.gvi.palette.toString()); fields.palette = 1; }
				query += "&wpt["+n+"][lat]="+w.getLatLng().lat.toFixed(7);
				query += "&wpt["+n+"][lon]="+gmap.wrapLatLng(w.getLatLng()).lng.toFixed(7);
				if (w.gvi.alt) { query += "&wpt["+n+"][alt]="+w.gvi.alt.toFixed(1); fields.alt = 1; }
				n += 1;
			}
		}
		n = 0;
		for (var i=1; i<GVS.trk_array.length; i++) { // start at 1 because 0 was skipped
			var t = GVS.trk_array[i];
			if (t && t.gv_type && t.getLatLngs() && t.getLatLngs().length > 0) {
				query += "&trk["+n+"][type]="+t.gv_type;
				if (t.name && t.name != '') { query += "&trk["+n+"][name]="+uri_escape(t.name.toString()); fields.name = 1; }
				var desc = (t.desc && t.desc != '') ? t.desc.toString() : ((t.info && t.info != '') ? t.info.toString() : '');
				if (desc) { query += "&trk["+n+"][desc]="+uri_escape(desc); fields.desc = 1; }
				if (t.color && t.color != '') { query += "&trk["+n+"][color]="+uri_escape(t.color.toString()); fields.color = 1; }
				if (t.color && t.color != '' && t.palette && t.palette != '') { query += "&trk["+n+"][palette]="+uri_escape(t.palette.toString()); fields.palette = 1; }
				if (t.gv_type == 'area') { fields.fill_opacity = 1; }
				query += "&trk["+n+"][trkpts]=";
				var lls = GVS.Track_Coords(t);
				var pt_count = lls.length;
				for(j=0; j<pt_count; j++) {
					var p = gmap.wrapLatLng(lls[j]);
					query += p.lat.toFixed(7)+','+p.lng.toFixed(7);
					if (p.alt) { query += ','+p.alt.toFixed(3); fields.alt = 1; }
					if (j<(pt_count-1)) { query += ';'; }
				}
				n += 1;
			}
		}
		for (var f in fields) {
			if (fields[f]) {
				query += '&fields['+f+']=1';
			}
		}
		if ($('add_timestamps') && $('add_timestamps').value) {
			query += '&fields[time]=1';
			query += '&add_timestamps='+$('add_timestamps').value;
		}
		return query;
	}
	
	this.Download_Data = function(format) {
		if (GVS.wpt_count > 0 || GVS.trk_count > 0) {
			var query = GVS.Build_Post_Query(format);
			GVS.ajax.doPost('save.php', query, GVS.saveCallback, 'text');
		} else {
			alert ("There's nothing to download!  Add some markers and/or tracks to the map first.");
		}
	}
	
	this.saveCallback = function(file) {
		var url = 'download_file.php?file='+file;
		if ($('download_iframe')) {
			$('download_iframe').style.height = '2.25em';
			$('download_iframe').src = url;
		} else {
			window.open (url,'download_window','status=0,toolbar=0,location=0,menubar=0,resizable=1,width=200,height=50');
		}
	}
	
	this.collapseElement = function(id) {
		if ($(id) && $(id).style) { $(id).style.height = '0px'; }
	}
	this.hideIframe = function(id) {
		if ($(id) && $(id).style) { $(id).style.display = 'none'; }
		if ($(id) && $(id).src) { $(id).src = ''; }
	}
	
	this.Import_Uploaded_Data = function(js_filename) {
		GVS.json_script = new JSONscriptRequest(js_filename);
		GVS.json_script.buildScriptTag(); // Build the dynamic script tag
		GVS.json_script.addScriptTag(); // Add the script tag to the page
		
	}
	
	this.Draw_Imported_Data = function(data) {
		GVS.Return_To_Idle_State();
		var new_element_count = 0;
		var selected_icon = GVS.custom_icons.last_selected;
		GVS.custom_icons.last_selected = null;
		if (data.gpx) {
			if (data.gpx.trk) {
				data.gpx.trk = (data.gpx.trk.length) ? data.gpx.trk : [ data.gpx.trk ];
				for (var t=0; t<data.gpx.trk.length; t++) {
					var trk = data.gpx.trk[t];
					var poly = (trk.fill_opacity && parseFloat(trk.fill_opacity) > 0) ? true : false;
					var trk_name = (trk.name) ? trk.name : '[track]';
					var trk_color = null; var trk_palette = null;
					if (trk.extensions && trk.extensions.line && trk.extensions.line.color) {
						if (trk.extensions.line.color.match(/^\#?[0-9a-f]{6}$/i)) {
							trk_color = '#'+trk.extensions.line.color.replace(/\#/g,'');
						} else if (gvg.named_html_colors && gvg.named_html_colors[trk.extensions.line.color]) {
							trk_color = gvg.named_html_colors[trk.extensions.line.color];
						}
					}
					if (trk.extensions && trk.extensions['gpxx:TrackExtension'] && trk.extensions['gpxx:TrackExtension']['gpxx:DisplayColor']) {
						var c = trk.extensions['gpxx:TrackExtension']['gpxx:DisplayColor'];
						if (GVS.color_picker_trk.color_defs['Garmin'][c]) {
							trk_color = GVS.color_picker_trk.color_defs['Garmin'][c];
							trk_palette = 'Garmin'; trk_color = c;
						}
					}
					if (trk.trkseg) {
						trk.trkseg = (trk.trkseg.length) ? trk.trkseg : [ trk.trkseg ];
						for (var ts=0; ts<trk.trkseg.length; ts++) {
							var trkseg = trk.trkseg[ts];
							var seg_name = trk_name; seg_name += (trk.trkseg.length > 1) ? ' '+(ts+1) : '';
							var path = [];
							if (trkseg.trkpt) {
								trkseg.trkpt = (trkseg.trkpt.length) ? trkseg.trkpt : [ trkseg.trkpt ];
								for (var tp=0; tp<trkseg.trkpt.length; tp++) {
									if (trkseg.trkpt[tp].lat != '' && trkseg.trkpt[tp].lon != '') {
										if (trkseg.trkpt[tp].ele != '') {
											path.push(new L.LatLng(trkseg.trkpt[tp].lat,trkseg.trkpt[tp].lon,trkseg.trkpt[tp].ele));
										} else {
											path.push(new L.LatLng(trkseg.trkpt[tp].lat,trkseg.trkpt[tp].lon));
										}
									}
								}
							}
							GVS.Create_New_Track(null,{ name:seg_name, path:path, color:trk_color, palette:trk_palette, is_polygon:poly });
							new_element_count++;
						}
					}
				}
			}
			if (data.gpx.wpt) {
				data.gpx.wpt = (data.gpx.wpt.length) ? data.gpx.wpt : [ data.gpx.wpt ];
				for (var w=0; w<data.gpx.wpt.length; w++) {
					var wpt = data.gpx.wpt[w];
					var name = (wpt.name) ? wpt.name : '[marker]';
					var sym = (wpt.sym) ? wpt.sym.replace(/^https?:\/\/\w+\.gpsvisualizer\.com\/leaflet\/icons\/garmin\/\w+\//,'').replace(/_/g,' ').replace(/\.png$/,'') : '';
					var color = (wpt.color) ? wpt.color : '';
					sym = (GVS.custom_icons.icon_file[sym]) ? sym : '';
					if (wpt.lat != '' && wpt.lon != '') {
						if (wpt.ele != '') {
							GVS.Create_New_Marker(null,{ 'name':wpt.name, 'icon':sym, 'color':color, 'position':new L.LatLng(wpt.lat,wpt.lon,wpt.ele) });
						} else {
							GVS.Create_New_Marker(null,{ 'name':wpt.name, 'icon':sym, 'color':color, 'position':new L.LatLng(wpt.lat,wpt.lon) });
						}
						new_element_count++;
					}
				}
			}
		}
		if (new_element_count > 0) { GVS.Autozoom(null,-1); }
		GVS.custom_icons.last_selected = selected_icon;
	}
	
}








function Sandbox_Create_Center_Marker(coords) {
	var marker_pattern = new RegExp('[&\\?\#](marker)=([^&]+)','i');
	if (window.location.toString().match(marker_pattern)) {
		var match = marker_pattern.exec(window.location.toString());
		if (match && match[2] && (coords || gmap.getCenter())) {
			var click = (coords) ? { latlng:coords } : { latlng:gmap.getCenter() };
			GVS.Create_New_Marker(click,{name:uri_unescape(match[2])});
			GVS.Open_Marker_Info_Window(GVS.wpt_index);
		}
	}
}

function Sandbox_Current_URL() {
	var url = document.location.toString().replace(/\/[\?\#].*$/,'/');
	var type_menu = $('gv_maptype_selector'); var type = type_menu[type_menu.selectedIndex].value;
	if (gvg.bg[type] == gvg.bg['GV_OSM_RELIEF']) { type = 'o'; }
	else if (gvg.bg[type] == gvg.bg['GV_STREET']) { type = 'm'; }
	else if (gvg.bg[type] == gvg.bg['GV_HYBRID']) { type = 'h'; }
	else if (gvg.bg[type] == gvg.bg['GV_SATELLITE']) { type = 's'; }
	else if (gvg.bg[type] == gvg.bg['GV_TERRAIN']) { type = 'p'; }
	else if (gvg.bg[type] == gvg.bg['GV_TOPO_US']) { type = 't'; }
	else if (gvg.bg[type] == gvg.bg['US_CALTOPO_USGS_RELIEF']) { type = 'tr'; }
	else if (gvg.bg[type] == gvg.bg['US_CALTOPO_USFS']) { type = 'usfs'; }
	else if (gvg.bg[type] == gvg.bg['US_CALTOPO_USFS_RELIEF']) { type = 'usfsr'; }
	else if (gvg.bg[type] == gvg.bg['NAIP_AERIAL']) { type = 'naip'; }
	else if (gvg.bg[type] == gvg.bg['GV_TOPO_WORLD']) { type = 'tw'; }
	else if (gvg.bg[type] == gvg.bg['GV_TOPO_CA']) { type = 'tc'; }
	else if (gvg.bg[type] == gvg.bg['GV_TOPO_EU']) { type = 'te'; }
	else if (gvg.bg[type] == gvg.bg['GV_OSM']) { type = 'osm'; }
	else if (gvg.bg[type] == gvg.bg['GV_OSM2']) { type = 'osm2'; }
	else if (gvg.bg[type] == gvg.bg['GV_OCM']) { type = 'ocm'; }
	else if (gvg.bg[type] == gvg.bg['GV_TRANSIT']) { type = 'pt'; }
	else if (gvg.bg[type] == gvg.bg['YAHOO_AERIAL']) { type = 'ya'; }
	else if (gvg.bg[type] == gvg.bg['YAHOO_MAP']) { type = 'ym'; }
	else if (gvg.bg[type] == gvg.bg['YAHOO_HYBRID']) { type = 'yh'; }
	url += '?bg='+type;
	url += '&z='+gmap.getZoom();
	url += '&c='+parseFloat(gmap.getCenter().lat.toFixed(6))+','+parseFloat(gmap.getCenter().lng.toFixed(6));
	url += '&marker=';
	return url;
}

function Sandbox_Other_API_URL() {
	var url = Sandbox_Current_URL();
	url = url.replace(/\bapi=\w+&?/,'');
	url += (url.match(/\?/)) ? '&api=g' : '?api=g';
	return url;
}

function Sandbox_Show_Link() {
	var url = Sandbox_Current_URL();
	var window_html = "<div style='width:300px; font:11px Verdana;'>";
	window_html += "<p style='margin-bottom:8px;'>The following URL will take you back to this viewport; note that any tracks or waypoints you've added will not be included.</p>";
	window_html += "<p style='margin-bottom:8px;'>(If you want to add a marker in the center of the map, add <tt>&marker=MARKER_NAME</tt> to the URL.)</p>";
	window_html += '<input id="gv_sandbox_url_box" name="gv_sandbox_url_box_input" type="text" size=40 value="'+url.replace(/"/g,"&quot;")+'" onchange="Sandbox_Update_Shortener_Links()">';
	window_html += "<p style='margin-top:8px;'>Shortened URL: ";
	window_html += "<a id='isgd_link' target='blank' style='font:10px Verdana' href='http://is.gd/create.php?url="+uri_escape(url)+"' onclick='Sandbox_Update_Shortener_Links()'>is.gd<"+"/a>";
	// window_html += ", <a target='blank' style='font:10px Verdana' href='http://bit.ly/?url="+uri_escape(url)+"'>bit.ly<"+"/a>";
	window_html += ", <a id='tinyurl_link' target='blank' style='font:10px Verdana' href='http://tinyurl.com/create.php?url="+uri_escape(url)+"' onclick='Sandbox_Update_Shortener_Links()'>tinyurl.com<"+"/a>";
	window_html += "</p>";
	window_html += "</div>";
	var sandbox_link_window = new L.Popup().setContent(window_html).setLatLng(gmap.getCenter()).openOn(gmap);
	window.setTimeout('if ($("gv_sandbox_url_box")) { $("gv_sandbox_url_box").focus(); $("gv_sandbox_url_box").select(); }',100);
}
function Sandbox_Update_Shortener_Links() {
	if ($('gv_sandbox_url_box') && $('gv_sandbox_url_box').value) {
		var url = $('gv_sandbox_url_box').value;
		if ($('isgd_link')) { $('isgd_link').href = "http://is.gd/create.php?url="+uri_escape(url); }
		if ($('tinyurl_link')) { $('tinyurl_link').href = "http://tinyurl.com/create.php?url="+uri_escape(url); }
	}
}

function uri_escape(text) {
	text = escape(text);
	text = text.replace(/\//g,"%2F");
	text = text.replace(/\?/g,"%3F");
	text = text.replace(/=/g,"%3D");
	text = text.replace(/&/g,"%26");
	text = text.replace(/@/g,"%40");
	text = text.replace(/\#/g,"%23");
	text = text.replace(/\+/g,"%2B");
	return (text);
}
function uri_unescape(text) {
	text = text.replace(/\+/g,' ');
	text = unescape(text);
	return (text);
}

function AttributeSafe(text) {
	text = text.toString().replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/\>/g,'&gt;').replace(/\</g,'&lt;');
	return text;
}
function CData(text) {
	if (text.match(/(&|"|<|>)/)) {
		text = '<![CDATA['+text+']]>';
	}
	return text;
}
function $(id) {
	return (document.getElementById(id));
}
