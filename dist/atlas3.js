'use strict';

System.register(['./css/atlas3_leafletmap.css!', 'lodash', 'app/plugins/sdk', './js/atlas3_leafletmap.js', './scale', './CustomHover'], function (_export, _context) {
				"use strict";

				var _, MetricsPanelCtrl, LeafletMap, Scale, CustomHover, _createClass, panelDefaults, recentData, tempArray, Atlas3;

				function _classCallCheck(instance, Constructor) {
								if (!(instance instanceof Constructor)) {
												throw new TypeError("Cannot call a class as a function");
								}
				}

				function _possibleConstructorReturn(self, call) {
								if (!self) {
												throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
								}

								return call && (typeof call === "object" || typeof call === "function") ? call : self;
				}

				function _inherits(subClass, superClass) {
								if (typeof superClass !== "function" && superClass !== null) {
												throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
								}

								subClass.prototype = Object.create(superClass && superClass.prototype, {
												constructor: {
																value: subClass,
																enumerable: false,
																writable: true,
																configurable: true
												}
								});
								if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
				}

				return {
								setters: [function (_cssAtlas3_leafletmapCss) {}, function (_lodash) {
												_ = _lodash.default;
								}, function (_appPluginsSdk) {
												MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
								}, function (_jsAtlas3_leafletmapJs) {
												LeafletMap = _jsAtlas3_leafletmapJs.default;
								}, function (_scale) {
												Scale = _scale.Scale;
								}, function (_CustomHover) {
												CustomHover = _CustomHover.CustomHover;
								}],
								execute: function () {
												_createClass = function () {
																function defineProperties(target, props) {
																				for (var i = 0; i < props.length; i++) {
																								var descriptor = props[i];
																								descriptor.enumerable = descriptor.enumerable || false;
																								descriptor.configurable = true;
																								if ("value" in descriptor) descriptor.writable = true;
																								Object.defineProperty(target, descriptor.key, descriptor);
																				}
																}

																return function (Constructor, protoProps, staticProps) {
																				if (protoProps) defineProperties(Constructor.prototype, protoProps);
																				if (staticProps) defineProperties(Constructor, staticProps);
																				return Constructor;
																};
												}();

												panelDefaults = {
																map_tile_url: "http://api.tiles.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token=",
																bing_api_key: "bing api key",
																data: [],
																lat: 33,
																lng: -80,
																scale: 1,
																zoom: 3,
																choices: [],
																name: [],
																mapSrc: [],
																max: [],
																min: [],
																layers: [],
																color: {
																				mode: 'spectrum',
																				cardColor: '#b4ff00',
																				colorScale: 'linear',
																				exponent: 0.5,
																				colorScheme: 'interpolateOranges',
																				fillBackground: false
																},
																legend: {
																				show: true,
																				legend_colors: []
																},
																tooltip: {
																				show: true,
																				showDefault: true,
																				content: ' '
																},
																invert: true,
																to_si: 1000000000,
																scales: ['linear', 'sqrt'],
																colorScheme: 'interpolateRdYlGn',
																rgb_values: [],
																hex_values: [],
																colorModes: ['opacity', 'spectrum'],
																custom_hover: ' '
												};
												tempArray = [];

												_export('Atlas3', Atlas3 = function (_MetricsPanelCtrl) {
																_inherits(Atlas3, _MetricsPanelCtrl);

																function Atlas3($scope, $injector) {
																				_classCallCheck(this, Atlas3);

																				var _this = _possibleConstructorReturn(this, (Atlas3.__proto__ || Object.getPrototypeOf(Atlas3)).call(this, $scope, $injector));

																				_.defaults(_this.panel, panelDefaults);
																				_this.map_holder_id = 'map_' + _this.panel.id;
																				_this.containerDivId = 'container_' + _this.map_holder_id;
																				_this.map_drawn = false;
																				_this.custom_hover = new CustomHover(_this.panel.tooltip.content);
																				_this.scale = new Scale(_this.colorScheme);
																				_this.colorSchemes = _this.scale.getColorSchemes();
																				_this.events.on('data-received', _this.onDataReceived.bind(_this));
																				_this.events.on('data-error', _this.onDataError.bind(_this));
																				_this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));
																				_this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
																				_this.events.on('init-panel-actions', _this.onInitPanelActions.bind(_this));

																				return _this;
																}

																_createClass(Atlas3, [{
																				key: 'onDataReceived',
																				value: function onDataReceived(dataList) {
																								if (!this.map_drawn) {
																												recentData = dataList;
																												this.render();
																												this.map_drawn = true;
																								}

																								recentData = dataList;
																								this.process_data(dataList);
																				}
																}, {
																				key: 'process_data',
																				value: function process_data(dataList) {

																								var self = this;

																								//update with the data!
																								_.forEach(dataList, function (data) {
																												_.forEach(self.panel.layers, function (layer) {
																																//find the link associated with this data

																																if (typeof layer.active !== "function") {
																																				return;
																																}

																																if (layer.topology() === undefined) {
																																				return;
																																}

																																var links = layer.topology().links();

																																var target;
																																var dir;

																																/*		if(data.target.endsWith("AZ")){
                                		    target = data.target.substr(0,data.target.length - 3);
                                		    dir = "AZ";
                                		}else if(data.target.endsWith("ZA")){
                                		    target = data.target.substr(0,data.target.length - 3);
                                		    dir = "ZA";
                                		}else{
                                		    return;
                                		}
                                */

																																//var links = layer.topology().links({linkNames: [target]});
																																var target_links = [];
																																_.forEach(links, function (l) {
																																				_.forEach(l.endpoints, function (ep) {
																																								var str = l.name + " " + ep;
																																								if (data.target == str) {
																																												target_links.push({ link: l, endpoint: ep, full: str });
																																								}
																																				});
																																});

																																var bps;

																																var min;
																																var max;
																																var avg = 0;
																																var total = 0;
																																var interval;

																																//find the last valid value
																																//find the min
																																//find the max
																																//find the average
																																//find the total datapoints
																																for (var i = data.datapoints.length - 1; i >= 0; i--) {
																																				var value = data.datapoints[i][0];
																																				if (value !== undefined && value !== null) {
																																								avg += value;
																																								total += 1;
																																								if (min === undefined) {
																																												min = value;
																																												max = value;
																																								}
																																								if (value < min) {
																																												min = value;
																																								}
																																								if (value > max) {
																																												max = value;
																																								}

																																								if (bps === undefined) {
																																												bps = value;
																																								}
																																				}
																																}

																																if (total > 1) {
																																				var start = data.datapoints[0][1];
																																				var end = data.datapoints[1][1];
																																				interval = start - end;
																																}

																																_.forEach(target_links, function (obj) {
																																				var layer_max = layer.max();
																																				var layer_min = layer.min();

																																				var l = obj.link;

																																				var color_value = (bps - layer_min) / (layer_max - layer_min) * 100;

																																				var lineColor = self.scale.getColor(color_value); //,this.panel.values);

																																				l.lineColor = lineColor;

																																				//check for AZ or ZA based on the endpoint the data was found at!
																																				if (l.endpoints[0] == obj.endpoint) {
																																								l.az.cur = color_value;
																																								l.azLineColor = lineColor;
																																								l.az.max = self.toSI(max);
																																								l.az.min = self.toSI(min);
																																								l.az.avg = self.toSI(avg / total);
																																								l.arrow = 1;
																																				} else {
																																								l.za.cur = color_value;
																																								l.zaLineColor = lineColor;
																																								l.za.max = self.toSI(max);
																																								l.za.min = self.toSI(min);
																																								l.za.avg = self.toSI(avg / total);
																																								l.arrow = 2;
																																				}

																																				if (l.az.cur != null && l.za.cur != null) {
																																								if (l.az.cur > l.za.cur) {
																																												l.lineColor = l.azLineColor;
																																												l.arrow = 1;
																																								} else {
																																												l.lineColor = l.zaLineColor;
																																												l.arrow = 2;
																																								}
																																				}
																																});
																												});
																								});

																								_.forEach(this.panel.layers, function (layer) {
																												if (typeof layer.active !== "function") {
																																return;
																												}
																												layer.update();
																								});
																				}
																}, {
																				key: 'toSI',
																				value: function toSI(num) {
																								if (this.panel.tooltip.showDefault) {
																												this.panel.to_si = panelDefaults.to_si;
																								}
																								if (this.panel.to_si <= 0) {
																												num = num / panelDefaults.to_si;
																								} else {
																												num = num / this.panel.to_si;
																								}
																								return num.toFixed(2);
																				}
																}, {
																				key: 'onDataError',
																				value: function onDataError(err) {
																								this.dataRaw = [];
																				}
																}, {
																				key: 'onInitEditMode',
																				value: function onInitEditMode() {
																								this.addEditorTab('Options', 'public/plugins/worldview/editor.html', 2);
																								this.addEditorTab('Display', 'public/plugins/worldview/display_editor.html', 3);
																								tempArray = this.scale.displayScheme(this.panel.colorScheme, this.panel.invert);
																				}
																}, {
																				key: 'onInitPanelActions',
																				value: function onInitPanelActions(actions) {
																								this.render();
																				}
																}, {
																				key: 'addNewChoice',
																				value: function addNewChoice() {
																								var num = this.panel.choices.length + 1;
																								this.panel.choices.push(num);
																								this.panel.name.push('');
																								this.panel.mapSrc.push('');
																								this.panel.max.push('');
																								this.panel.min.push('');
																				}
																}, {
																				key: 'removeChoice',
																				value: function removeChoice(index) {
																								this.panel.choices.splice(index, 1);
																								this.panel.name.splice(index, 1);
																								this.panel.mapSrc.splice(index, 1);
																								this.panel.max.splice(index, 1);
																								this.panel.min.splice(index, 1);
																				}
																}, {
																				key: 'display',
																				value: function display() {

																								if (this.panel.color.mode == "opacity") this.panel.colors = this.scale.displayOpacity(this.panel.color.cardColor, this.panel.invert, this.panel.color.colorScale);else this.panel.colors = this.scale.displayScheme(this.panel.colorScheme, this.panel.invert);

																								this.panel.rgb_values = this.panel.colors.rgb_values;
																								this.panel.hex_values = this.panel.colors.hex_values;
																				}
																}, {
																				key: 'getHtml',
																				value: function getHtml(htmlContent) {
																								return this.custom_hover.parseHtml(htmlContent);
																				}
																}, {
																				key: 'link',
																				value: function link(scope, elem, attrs, ctrl) {

																								if (ctrl.map_drawn == true) {
																												return;
																								}

																								ctrl.events.on('render', function () {
																												ctrl.display();
																												ctrl.panel.legend.legend_colors = ctrl.panel.hex_values;
																												ctrl.panel.legend.adjLoadLegend = {
																																horizontal: true
																												};
																												var html_content = ctrl.getHtml(ctrl.panel.tooltip.content);
																												ctrl.panel.tooltip.content = html_content;
																												if (ctrl.map_drawn == true) {
																																return;
																												}
																												if (!elem.find('container_map_' + ctrl.panel.id)) {}

																												var map = LeafletMap({ containerId: 'container_map_' + ctrl.panel.id,
																																bing_api_key: ctrl.panel.bing_api_key,
																																map_tile_url: ctrl.panel.map_tile_url,
																																lat: ctrl.panel.lat,
																																lng: ctrl.panel.lng,
																																zoom: ctrl.panel.zoom,
																																tooltip: ctrl.panel.tooltip,
																																legend: ctrl.panel.legend
																												});
																												ctrl.map = map;

																												if (ctrl.map === undefined) {
																																return;
																												}
																												for (var i = 0; i < ctrl.panel.choices.length; i++) {
																																if (ctrl.panel.mapSrc[i] === null || ctrl.panel.mapSrc[i] === undefined) {
																																				return;
																																}
																																var networkLayer = map.addNetworkLayer({
																																				name: ctrl.panel.name[i],
																																				max: ctrl.panel.max[i],
																																				min: ctrl.panel.min[i],
																																				lineWidth: 3.7,
																																				mapSource: ctrl.panel.mapSrc[i]
																																});
																																ctrl.panel.layers.push(networkLayer);
																																networkLayer.onInitComplete(function () {
																																				ctrl.process_data(recentData);
																																});
																												}
																								});
																				}
																}]);

																return Atlas3;
												}(MetricsPanelCtrl));

												_export('Atlas3', Atlas3);

												Atlas3.templateUrl = 'module.html';
								}
				};
});
//# sourceMappingURL=atlas3.js.map
