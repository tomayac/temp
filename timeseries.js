/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var el = exports.el = function el(tagName) {
	return document.createElement(tagName);
};

var prettyDate = exports.prettyDate = function prettyDate(YYYY_MM_DD) {
	var _YYYY_MM_DD$split = YYYY_MM_DD.split('_'),
	    _YYYY_MM_DD$split2 = _slicedToArray(_YYYY_MM_DD$split, 3),
	    YYYY = _YYYY_MM_DD$split2[0],
	    MM = _YYYY_MM_DD$split2[1],
	    DD = _YYYY_MM_DD$split2[2];

	var d = new Date(Date.UTC(YYYY, MM - 1, DD));
	return getFullDate(d);
};

var getFullDate = exports.getFullDate = function getFullDate(d) {
	return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
};

var chartExportOptions = exports.chartExportOptions = {
	menuItemDefinitions: {
		showQuery: {
			onclick: function onclick() {
				var _options = this.options,
				    metric = _options.metric,
				    type = _options.type;

				var url = getQueryUrl(metric, type);
				if (!url) {
					console.warn('Unable to get query URL for metric "' + metric + '" and chart type "' + type + '".');
					return;
				}
				window.open(url, '_blank');
			},
			text: 'Show Query'
		}
	},
	buttons: {
		contextButton: {
			menuItems: ['showQuery', 'downloadPNG']
		}
	}
};

// Summarizes a metric by highlighting its primary value, usually the median.
// This function may be called multiple times after page load, for example if the
// visualization range changes the summary value will be updated.
var drawMetricSummary = exports.drawMetricSummary = function drawMetricSummary(options, client, value) {
	var isMedian = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
	var change = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

	var metric = options.metric;
	var summary = getSummaryElement(metric, client);
	if (!summary) {
		return;
	}
	summary.classList.remove('hidden');

	if (!isMedian) {
		var _metric = summary.querySelector('.metric');
		_metric && _metric.classList.add('hidden');
	}

	summary.querySelector('.primary').innerText = value;

	if (change) {
		var changeEl = summary.querySelector('.change');
		changeEl.innerText = formatChange(change);
		changeEl.classList.remove('good', 'bad', 'neutral'); // Reset the classes.
		changeEl.classList.add(getChangeSentiment(change, options));
	}
};

var getQueryUrl = function getQueryUrl(metric, type) {
	var URL_BASE = 'https://cdn.rawgit.com/HTTPArchive/bigquery/master/sql';
	if (type === 'timeseries') {
		return URL_BASE + '/timeseries/' + metric + '.sql';
	}
	if (type === 'histogram') {
		return URL_BASE + '/histograms/' + metric + '.sql';
	}
};

var getSummaryElement = function getSummaryElement(metric, client) {
	return document.querySelector('#' + metric + ' .metric-summary.' + client);
};

var formatChange = function formatChange(change) {
	// Up for non-negative, down for negative.
	return '' + (change >= 0 ? '\u25B2' : '\u25BC') + Math.abs(change).toFixed(1) + '%';
};

var getChangeSentiment = function getChangeSentiment(change, options) {
	// If a metric goes down, is that good or bad?
	var sentiments = ['good', 'bad'];
	if (options.downIsBad) {
		sentiments.reverse();
	} else if (options.downIsNeutral) {
		return 'neutral';
	}

	change = +change.toFixed(1);
	if (change < 0) {
		return sentiments[0];
	}
	if (change > 0) {
		return sentiments[1];
	}
	return 'neutral';
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OPACITY = 0.4;
var RGBA = ['rgba(4, 199, 253, ' + OPACITY + ')', 'rgba(166, 42, 164, ' + OPACITY + ')', 'rgba(18, 174, 248, ' + OPACITY + ')', 'rgba(132, 36, 134, ' + OPACITY + ')'];
var HEX = ['#04c7fd', '#a62aa4', '#12aef8', '#842486'];

var Colors = exports.Colors = function () {
	function Colors() {
		_classCallCheck(this, Colors);
	}

	_createClass(Colors, null, [{
		key: 'getAll',
		value: function getAll() {
			var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { rgba: false },
			    rgba = _ref.rgba;

			if (rgba) {
				return RGBA;
			}

			return HEX;
		}
	}, {
		key: 'DESKTOP',
		get: function get() {
			return HEX[0];
		}
	}, {
		key: 'MOBILE',
		get: function get() {
			return HEX[1];
		}
	}, {
		key: 'WEBPAGETEST',
		get: function get() {
			return '#000000';
		}
	}]);

	return Colors;
}();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Metric = exports.Metric = function () {
	function Metric(options) {
		var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

		_classCallCheck(this, Metric);

		this.options = options;

		if (wholeNumber.has(options.type)) {
			value = Math.round(value);
		}
		this.value = value;
	}

	_createClass(Metric, [{
		key: 'toString',
		value: function toString() {
			var type = this.options.type;
			if (this.options.singular && this.value === 1) {
				type = this.options.singular;
			}
			return '' + this.value + (noLeadingSpace.has(type) ? '' : ' ') + type;
		}
	}]);

	return Metric;
}();

// Whitelist of units that directly follow the value (eg "10%").
// Otherwise, the unit is preceded by a space (eg "10 KB").


var noLeadingSpace = new Set(['%']);

// Whitelist of units for which values should appear as whole numbers (eg "2 requests").
// Otherwise, the values would appear as floats (eg "2.0 requests").
var wholeNumber = new Set(['Connections', 'Requests']);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Changelog = function () {
	function Changelog() {
		_classCallCheck(this, Changelog);
	}

	_createClass(Changelog, null, [{
		key: 'URL',
		get: function get() {
			return '/static/json/changelog.json';
		}
	}]);

	return Changelog;
}();

exports.default = Changelog;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = debounce;
// https://gist.github.com/beaucharman/1f93fdd7c72860736643d1ab274fee1a
function debounce(callback, wait) {
	var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this;

	var timeout = null;
	var callbackArgs = null;

	var later = function later() {
		return callback.apply(context, callbackArgs);
	};

	return function () {
		callbackArgs = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

/***/ }),
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _changelog = __webpack_require__(3);

var _changelog2 = _interopRequireDefault(_changelog);

var _colors = __webpack_require__(1);

var _debounce = __webpack_require__(4);

var _debounce2 = _interopRequireDefault(_debounce);

var _metric = __webpack_require__(2);

var _utils = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function timeseries(metric, options, start, end) {
	var dataUrl = 'https://cdn.httparchive.org/reports/' + (options.lens ? options.lens.id + '/' : '') + metric + '.json';
	options.chartId = metric + '-chart';
	options.tableId = metric + '-table';
	options.metric = metric;

	fetch(dataUrl).then(function (response) {
		return response.text();
	}).then(function (jsonStr) {
		return JSON.parse(jsonStr);
	}).then(function (data) {
		return data.sort(function (a, b) {
			return a.date < b.date ? -1 : 1;
		});
	}).then(function (data) {
		var _start$split = start.split('_'),
		    _start$split2 = _slicedToArray(_start$split, 3),
		    YYYY = _start$split2[0],
		    MM = _start$split2[1],
		    DD = _start$split2[2];

		options.min = Date.UTC(YYYY, MM - 1, DD);

		var _end$split = end.split('_');

		var _end$split2 = _slicedToArray(_end$split, 3);

		YYYY = _end$split2[0];
		MM = _end$split2[1];
		DD = _end$split2[2];

		options.max = Date.UTC(YYYY, MM - 1, DD);

		// Ensure null values are filtered out.
		data = data.filter(function (o) {
			return getUnformattedPrimaryMetric(o, options) !== null;
		});

		drawTimeseries(data, options);
		drawTimeseriesTable(data, options, [options.min, options.max]);
	});
}

function drawSummary(data, options, start, end) {
	var desktop = data.filter(function (o) {
		return isDesktop(o) && o.timestamp >= start && o.timestamp <= end;
	}).map(toNumeric);
	var mobile = data.filter(function (o) {
		return isMobile(o) && o.timestamp >= start && o.timestamp <= end;
	}).map(toNumeric);

	drawClientSummary(desktop, options, 'desktop');
	drawClientSummary(mobile, options, 'mobile');
}

function drawClientSummary(data, options, client) {
	if (!data.length) {
		return;
	}

	var value = getSummary(data, options);
	// Assume the metric is not the median if the options have custom fields.
	var isMedian = !(options.timeseries && options.timeseries.fields);
	var change = getChange(data, options);

	(0, _utils.drawMetricSummary)(options, client, value, isMedian, change);
}

function getSummary(data, options) {
	var o = data[data.length - 1];
	var summary = getPrimaryMetric(o, options);
	var metric = new _metric.Metric(options, summary);

	return metric.toString();
}

function getChange(data, options) {
	if (data.length < 2) {
		return;
	}

	var oldestIndex = void 0;

	for (var i = 0; i < data.length; i++) {
		if (getPrimaryMetric(data[i], options) > 0) {
			oldestIndex = i;
			break;
		}
	}

	if (oldestIndex === undefined) {
		return;
	}

	var oldest = getPrimaryMetric(data[oldestIndex], options);
	var latest = getPrimaryMetric(data[data.length - 1], options);

	return (latest - oldest) * 100 / oldest;
}

function getPrimaryMetric(o, options) {
	var field = getPrimaryFieldName(o, options);
	var primaryMetric = getUnformattedPrimaryMetric(o, options);
	var formatter = formatters[field];
	if (formatter) {
		return formatter(primaryMetric);
	}
	return primaryMetric;
}

function getPrimaryFieldName(o, options) {
	if (options.timeseries && options.timeseries.fields) {
		return options.timeseries.fields[0];
	}

	return 'p50';
}

function getUnformattedPrimaryMetric(o, options) {
	var field = getPrimaryFieldName(o, options);
	return o[field];
}

function drawTimeseries(data, options) {
	data = data.map(toNumeric);
	var desktop = data.filter(isDesktop);
	var mobile = data.filter(isMobile);

	var series = [];
	if (desktop.length) {
		if (options.timeseries && options.timeseries.fields) {
			options.timeseries.fields.forEach(function (field) {
				series.push(getLineSeries('Desktop', desktop.map(function (o) {
					return [o.timestamp, o[field]];
				}), _colors.Colors.DESKTOP));
			});
		} else {
			series.push(getLineSeries('Desktop', desktop.map(toLine), _colors.Colors.DESKTOP));
			series.push(getAreaSeries('Desktop', desktop.map(toIQR), _colors.Colors.DESKTOP));
		}
	}
	if (mobile.length) {
		if (options.timeseries && options.timeseries.fields) {
			options.timeseries.fields.forEach(function (field) {
				series.push(getLineSeries('Mobile', mobile.map(function (o) {
					return [o.timestamp, o[field]];
				}), _colors.Colors.MOBILE));
			});
		} else {
			series.push(getLineSeries('Mobile', mobile.map(toLine), _colors.Colors.MOBILE));
			series.push(getAreaSeries('Mobile', mobile.map(toIQR), _colors.Colors.MOBILE));
		}
	}

	if (!series.length) {
		console.error('No timeseries data to draw', data, options);
		return;
	}

	getFlagSeries().then(function (flagSeries) {
		return series.push(flagSeries);
	})
	// If the getFlagSeries request fails (503), catch so we can still draw the chart
	.catch(console.error).then(function (_) {
		return drawChart(options, series);
	});
}
var redrawTimeseriesTable = {};
function drawTimeseriesTable(data, options) {
	var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [-Infinity, Infinity],
	    _ref2 = _slicedToArray(_ref, 2),
	    start = _ref2[0],
	    end = _ref2[1];

	start = Math.floor(start);
	end = Math.floor(end);
	if (!redrawTimeseriesTable[options.metric]) {
		// Return a curried function to redraw the table given start/end times.
		redrawTimeseriesTable[options.metric] = (0, _debounce2.default)(function (dateRange) {
			return drawTimeseriesTable(data, options, dateRange);
		}, 100);
	}

	drawSummary(data, options, start, end);

	var cols = DEFAULT_COLS.concat(DEFAULT_FIELDS);
	if (options.timeseries && options.timeseries.fields) {
		cols = DEFAULT_COLS.concat(options.timeseries.fields);
	}

	Promise.resolve(zip(data)).then(function (data) {
		var table = document.getElementById(options.tableId);
		Array.from(table.children).forEach(function (child) {
			return table.removeChild(child);
		});

		var frag = document.createDocumentFragment();
		var thead = (0, _utils.el)('thead');

		if (!options.timeseries || !options.timeseries.fields) {
			var trMeta = (0, _utils.el)('tr');
			trMeta.classList.add('meta-row');
			DEFAULT_COLS.map(function (col) {
				return (0, _utils.el)('th');
			}).forEach(function (th) {
				return trMeta.appendChild(th);
			});
			var th = (0, _utils.el)('th');
			th.classList.add('text-center');
			th.setAttribute('colspan', cols.length - DEFAULT_COLS.length);
			th.textContent = 'Percentile' + (th.colspan === 1 ? '' : 's');
			trMeta.appendChild(th);
			thead.appendChild(trMeta);
		}

		var tr = (0, _utils.el)('tr');
		cols.map(function (col) {
			var th = (0, _utils.el)('th');
			th.textContent = col;
			return th;
		}).forEach(function (th) {
			return tr.appendChild(th);
		});
		thead.appendChild(tr);
		frag.appendChild(thead);

		var tbody = (0, _utils.el)('tbody');
		data.forEach(function (_ref3) {
			var _ref4 = _slicedToArray(_ref3, 2),
			    date = _ref4[0],
			    arr = _ref4[1];

			if (date < start || date > end) {
				return;
			}

			arr.forEach(function (o, i) {
				return tbody.appendChild(toRow(o, i, arr.length, cols));
			});
		});
		frag.appendChild(tbody);
		table.appendChild(frag);
	});
}

var isDesktop = function isDesktop(o) {
	return o.client == 'desktop';
};
var isMobile = function isMobile(o) {
	return o.client == 'mobile';
};
var toNumeric = function toNumeric(_ref5) {
	var client = _ref5.client,
	    date = _ref5.date,
	    other = _objectWithoutProperties(_ref5, ['client', 'date']);

	return Object.entries(other).reduce(function (o, _ref6) {
		var _ref7 = _slicedToArray(_ref6, 2),
		    k = _ref7[0],
		    v = _ref7[1];

		o[k] = +v;
		return o;
	}, { client: client });
};
var toIQR = function toIQR(o) {
	return [o.timestamp, o.p25, o.p75];
};
var toLine = function toLine(o) {
	return [o.timestamp, o.p50];
};
var getLineSeries = function getLineSeries(name, data, color) {
	return {
		name: name,
		type: 'line',
		data: data,
		color: color,
		zIndex: 1,
		marker: {
			enabled: false
		}
	};
};
var getAreaSeries = function getAreaSeries(name, data, color) {
	var opacity = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.1;
	return {
		name: name,
		type: 'areasplinerange',
		linkedTo: ':previous',
		data: data,
		lineWidth: 0,
		color: color,
		fillOpacity: opacity,
		zIndex: 0,
		marker: {
			enabled: false,
			states: {
				hover: {
					enabled: false
				}
			}
		}
	};
};
var flags = {};
var changelog = null;
var loadChangelog = function loadChangelog() {
	if (!changelog) {
		changelog = fetch(_changelog2.default.URL).then(function (response) {
			return response.json();
		});
	}

	return changelog;
};
var getFlagSeries = function getFlagSeries() {
	return loadChangelog().then(function (data) {
		data.forEach(function (change) {
			flags[+change.date] = {
				title: change.title,
				desc: change.desc
			};
		});
		return {
			type: 'flags',
			name: 'Changelog',
			data: data.map(function (change, i) {
				return {
					x: change.date,
					title: String.fromCharCode(65 + i % 26)
				};
			}),
			color: '#90b1b6',
			y: 25,
			showInLegend: false
		};
	});
};

function drawChart(options, series) {
	var chart = Highcharts.stockChart(options.chartId, {
		metric: options.metric,
		type: 'timeseries',
		chart: {
			zoomType: 'x'
		},
		title: {
			text: '' + (options.lens ? options.lens.name + ': ' : '') + ('Timeseries of ' + options.name)
		},
		subtitle: {
			text: 'Source: <a href="http://httparchive.org">httparchive.org</a>',
			useHTML: true
		},
		legend: {
			enabled: true
		},
		tooltip: {
			crosshairs: true,
			shared: true,
			useHTML: true,
			borderColor: 'rgba(247,247,247,0.85)',
			formatter: function formatter() {
				function getChangelog(changelog) {
					if (!changelog) return '';
					return '<p class="changelog">' + changelog.title + '</p>';
				}

				var changelog = flags[this.x];
				var tooltip = '<p style="font-size: smaller; text-align: center;">' + Highcharts.dateFormat('%b %e, %Y', this.x) + '</p>';

				// Handle changelog tooltips first.
				if (!this.points) {
					return tooltip + ' ' + getChangelog(changelog);
				}

				function getRow(points) {
					if (!points.length) return '';
					var label = void 0;
					var data = void 0;
					if (options.timeseries && options.timeseries.fields) {
						label = points[0].series.name;
						var formatter = formatters[options.timeseries.fields[0]];
						if (formatter) {
							data = formatter(points[0].point.y);
						} else {
							data = points[0].point.y.toFixed(1);
						}
					} else {
						var _points = _slicedToArray(points, 1),
						    median = _points[0];

						label = 'Median ' + median.series.name;
						data = median.point.y.toFixed(1);
					}
					var metric = new _metric.Metric(options, data);
					return '<td>\n\t\t\t\t\t\t<p style="text-transform: uppercase; font-size: 10px;">\n\t\t\t\t\t\t\t' + label + '\n\t\t\t\t\t\t</p>\n\t\t\t\t\t\t<p style="color: ' + points[0].series.color + '; font-size: 20px;">\n\t\t\t\t\t\t\t' + metric.toString() + '\n\t\t\t\t\t\t</p>\n\t\t\t\t\t</td>';
				}
				var desktop = this.points.filter(function (o) {
					return o.series.name == 'Desktop';
				});
				var mobile = this.points.filter(function (o) {
					return o.series.name == 'Mobile';
				});
				return tooltip + '\n\t\t\t\t<table cellpadding="5" style="text-align: center;">\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t' + getRow(desktop) + '\n\t\t\t\t\t\t' + getRow(mobile) + '\n\t\t\t\t\t</tr>\n\t\t\t\t</table>\n\t\t\t\t' + getChangelog(changelog);
			}
		},
		rangeSelector: {
			buttons: [{
				type: 'month',
				count: 1,
				text: '1m'
			}, {
				type: 'month',
				count: 3,
				text: '3m'
			}, {
				type: 'month',
				count: 6,
				text: '6m'
			}, {
				type: 'ytd',
				text: 'YTD'
			}, {
				type: 'year',
				count: 1,
				text: '1y'
			}, {
				type: 'year',
				count: 3,
				text: '3y'
			}, {
				type: 'all',
				text: 'All'
			}]
		},
		xAxis: {
			type: 'datetime',
			events: {
				setExtremes: function setExtremes(e) {
					return redrawTimeseriesTable[options.metric]([e.min, e.max]);
				}
			},
			min: options.min,
			max: options.max
		},
		yAxis: {
			title: {
				text: '' + options.name + (options.redundant ? '' : ' (' + options.type + ')')
			},
			opposite: false,
			min: 0
		},
		series: series,
		credits: false,
		exporting: _utils.chartExportOptions
	});
	chart.drawBenchmark = function (name, value, color) {
		chart.yAxis[0].update({
			plotLines: [{
				value: value,
				color: color,
				dashStyle: 'dash',
				width: 2,
				label: {
					text: name
				}
			}]
		});
	};
	window.charts = window.charts || {};
	window.charts[options.metric] = chart;
}

var DEFAULT_FIELDS = ['p10', 'p25', 'p50', 'p75', 'p90'];
var DEFAULT_COLS = ['date', 'client'];
var toFixed = function toFixed(value) {
	return parseFloat(value).toFixed(1);
};
var formatters = {
	date: _utils.prettyDate,
	p10: toFixed,
	p25: toFixed,
	p50: toFixed,
	p75: toFixed,
	p90: toFixed,
	percent: toFixed,
	urls: function urls(value) {
		return parseInt(value).toLocaleString();
	}
};

var zip = function zip(data) {
	var dates = {};
	data.forEach(function (o) {
		var row = dates[o.timestamp];
		if (row) {
			row.push(o);
			row.sort(function (a, b) {
				return a.client == 'desktop' ? -1 : 1;
			});
			return;
		}
		dates[o.timestamp] = [o];
	});
	return Object.entries(dates).sort(function (_ref8, _ref9) {
		var _ref11 = _slicedToArray(_ref8, 1),
		    a = _ref11[0];

		var _ref10 = _slicedToArray(_ref9, 1),
		    b = _ref10[0];

		return a > b ? -1 : 1;
	});
};

var toRow = function toRow(o, i, n, cols) {
	var row = (0, _utils.el)('tr');
	cols.map(function (col) {
		var td = (0, _utils.el)('td');
		var text = o[col];
		var formatter = formatters[col];
		if (formatter) {
			text = formatter(o[col]);
		}
		td.textContent = text;
		return td;
	}).forEach(function (td) {
		return td && row.appendChild(td);
	});
	return row;
};

// Export directly to global scope for use by Jinja template.
window.timeseries = timeseries;

/***/ })
/******/ ]);