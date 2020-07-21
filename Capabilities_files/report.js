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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
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
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _colors = __webpack_require__(1);

var _metric = __webpack_require__(2);

var _utils = __webpack_require__(0);

var _webpagetest = __webpack_require__(11);

var _webpagetest2 = _interopRequireDefault(_webpagetest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Report = function () {
	function Report(report, viz) {
		_classCallCheck(this, Report);

		console.log('Report', report, viz);
		this.report = report;
		this.viz = viz;
		this.baseUrl = report.url;
		this.lens = report.lens && report.lens.id;
		this.startDate = report.startDate;
		this.endDate = report.endDate;
		this.view = report.view;

		this.bindChangeListener('lens');
		this.bindChangeListener('startDate');
		this.bindChangeListener('endDate');
		this.bindUpdateListener();
		this.bindTableVisibilityToggle();
		this.permalink = document.getElementById('permalink');

		this.bindPermalinkClick();
		this.updatePermalink();
		this.makeDatesPretty();
		this.bindViewToggle();
		this.bindGridExpansion();
		this.expandPreselectedMetric();
	}

	_createClass(Report, [{
		key: 'bindChangeListener',
		value: function bindChangeListener(id) {
			var _this = this;

			document.getElementById(id).addEventListener('change', function (e) {
				_this[id] = e.target.value;
				_this.updatePermalink();
			});
		}
	}, {
		key: 'bindUpdateListener',
		value: function bindUpdateListener() {
			var _this2 = this;

			document.getElementById('update').addEventListener('click', function (_) {
				// TODO: Consider using history.replaceState on field changes instead.
				location.href = _this2.permalink.value;
			});
		}
	}, {
		key: 'bindTableVisibilityToggle',
		value: function bindTableVisibilityToggle() {
			document.body.addEventListener('click', function (e) {
				if (!e.target.classList.contains('show-hide')) {
					return;
				}

				var isHidden = e.target.innerText.startsWith('Show');
				Array.from(e.target.parentNode.querySelectorAll('table')).forEach(function (table) {
					table.classList.toggle('hidden', !isHidden);
				});
				e.target.innerText = e.target.innerText.replace(isHidden ? 'Show' : 'Hide', isHidden ? 'Hide' : 'Show');
			});
		}
	}, {
		key: 'isLatest',
		value: function isLatest(date) {
			return this.report.dates[0] === date;
		}
	}, {
		key: 'isEarliest',
		value: function isEarliest(date) {
			return this.report.dates[this.report.dates.length - 1] === date;
		}
	}, {
		key: 'isOneYearAgo',
		value: function isOneYearAgo(date) {
			return this.report.dates[23] === date;
		}
	}, {
		key: 'getDateUrlAlias',
		value: function getDateUrlAlias(date) {
			if (this.isLatest(date)) {
				return 'latest';
			} else if (this.isEarliest(date)) {
				return 'earliest';
			}

			return date;
		}
	}, {
		key: 'bindPermalinkClick',
		value: function bindPermalinkClick() {
			var _this3 = this;

			this.permalink.addEventListener('click', function (_) {
				_this3.permalink.select();
			});
		}
	}, {
		key: 'updatePermalink',
		value: function updatePermalink() {
			var url = new URL(this.baseUrl);
			var lens = this.lens;

			// TODO: Change subdomain.
			if (lens) {
				url.searchParams.set('lens', lens);
			} else {
				url.searchParams.delete('lens');
			}

			if (this.isOneYearAgo(this.startDate) && this.isLatest(this.endDate)) {
				this.permalink.value = url.toString();
				return;
			}

			var start = this.getDateUrlAlias(this.startDate);
			var end = this.getDateUrlAlias(this.endDate);

			if (start === end) {
				url.searchParams.append('start', start);
			} else {
				url.searchParams.append('start', start);
				if (end) {
					url.searchParams.append('end', end);
				}
			}

			url.searchParams.set('view', this.view);

			this.permalink.value = url.toString();
		}
	}, {
		key: 'makeDatesPretty',
		value: function makeDatesPretty() {
			Array.from(document.querySelectorAll('.yyyy_mm_dd')).forEach(function (option) {
				var date = (0, _utils.prettyDate)(option.innerText.trim());
				option.innerText = date;
			});
		}
	}, {
		key: 'bindViewToggle',
		value: function bindViewToggle() {
			var _this4 = this;

			var reportMetrics = document.getElementById('report-metrics');
			var gridBtn = document.getElementById('grid-view');
			var listBtn = document.getElementById('list-view');

			var toggleView = function toggleView(view) {
				if (view === _this4.view) {
					return;
				}

				var url = new URL(location.href);
				_this4.view = view;

				reportMetrics.classList.toggle('grid-view', view === 'grid');
				gridBtn.classList.toggle('alt', view === 'grid');
				listBtn.classList.toggle('alt', view !== 'grid');

				url.searchParams.set('view', view);

				if (view === 'list') {
					// The viz will need to be repainted to maximize the width.
					// We can trigger this with a window resize event.
					_this4.triggerResize();
				} else {
					// Expand any metric whose ID is in the URL hash.
					_this4.expandPreselectedMetric({ scrollIntoView: false });
				}
				window.history.replaceState({}, '', url.toString());
				_this4.updatePermalink();
			};

			gridBtn.addEventListener('click', function () {
				return toggleView('grid');
			});
			listBtn.addEventListener('click', function () {
				return toggleView('list');
			});
		}
	}, {
		key: 'triggerResize',
		value: function triggerResize() {
			window.dispatchEvent(new Event('resize'));
		}
	}, {
		key: 'toggleMetricExpansion',
		value: function toggleMetricExpansion(metricId) {
			var metric = document.getElementById(metricId);
			if (!metric) {
				return;
			}
			metric.classList.toggle('expanded');
			this.triggerResize();
		}
	}, {
		key: 'bindGridExpansion',
		value: function bindGridExpansion() {
			var _this5 = this;

			var gridExpanderSelector = '.grid-expansion, .metric-header a';
			Array.from(document.querySelectorAll(gridExpanderSelector)).forEach(function (btn) {
				var metricId = btn.dataset.metric;
				btn.addEventListener('click', function (e) {
					_this5.toggleMetricExpansion(metricId);
				});
			});
		}
	}, {
		key: 'expandPreselectedMetric',
		value: function expandPreselectedMetric() {
			var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { scrollIntoView: true };

			if (this.view !== 'grid') {
				return;
			}

			var anchorMetricId = location.hash.substr(1);
			if (!anchorMetricId) {
				return;
			}

			var metric = document.getElementById(anchorMetricId);
			if (!metric) {
				return;
			}
			this.toggleMetricExpansion(anchorMetricId);
			if (options.scrollIntoView) {
				requestAnimationFrame(function () {
					return metric.scrollIntoView();
				});
			}
		}
	}, {
		key: 'getWPT',
		value: function getWPT(wptId) {
			var _this6 = this;

			var wpt = new _webpagetest2.default(wptId);
			wpt.fetchResults().then(function (results) {
				var metrics = wpt.getMetrics(_this6.report);
				Object.entries(metrics).forEach(function (_ref) {
					var _ref2 = _slicedToArray(_ref, 2),
					    metric = _ref2[0],
					    value = _ref2[1];

					var options = _this6.report.metrics.find(function (m) {
						return m.id === metric;
					});
					options.metric = metric;
					var m = new _metric.Metric(options, value.toFixed(1));
					(0, _utils.drawMetricSummary)(options, 'webpagetest', m.toString());
					if (window.charts && charts[metric]) {
						var chart = charts[metric];
						chart.drawBenchmark('WebPageTest', value, _colors.Colors.WEBPAGETEST);
					}
				});
			}).catch(function (e) {
				console.error('Error getting WebPageTest results.', e);
			});
		}
	}]);

	return Report;
}();

window.Report = Report;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CONFIG_KEY = 'wpt';
var METRICS_DELIM = '$';

var WPT = function () {
	function WPT(id) {
		_classCallCheck(this, WPT);

		this.id = id;
	}

	_createClass(WPT, [{
		key: 'fetchResults',
		value: function fetchResults() {
			var _this = this;

			var url = 'https://www.webpagetest.org/result/' + this.id + '/?f=json';
			return fetch(url).then(function (r) {
				return r.text();
			}).then(function (r) {
				var results = JSON.parse(r);

				if (results.statusCode !== 200) {
					return Promise.reject(results.statusText);
				}

				_this.results = results.data;

				return _this.results;
			});
		}
	}, {
		key: 'getMetrics',
		value: function getMetrics(report) {
			var _this2 = this;

			return report.metrics.reduce(function (o, metric) {
				var wptConfig = metric[CONFIG_KEY];
				if (!wptConfig) {
					return o;
				}

				try {
					o[metric.id] = _this2.extractMetric(wptConfig);
				} catch (e) {
					console.error(e);
				}
				return o;
			}, {});
		}
	}, {
		key: 'extractMetric',
		value: function extractMetric(_ref) {
			var path = _ref.path,
			    scale = _ref.scale;

			var properties = path.split(METRICS_DELIM);
			var value = properties.reduce(function (results, property) {
				if (!(property in results)) {
					throw 'Unable to parse ' + path + ' in WebPageTest results';
				}

				return results[property];
			}, this.results);
			if (scale) {
				value = +value * scale;
			}
			return value;
		}
	}]);

	return WPT;
}();

exports.default = WPT;

/***/ })
/******/ ]);