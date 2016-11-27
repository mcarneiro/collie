var css = require('css');
var format = require('util').format;
var assert = require('assert');
var file = require('fs').readFileSync;
var rules = css.parse(file('./example/css/example.css').toString()).stylesheet.rules;
var curr;

function selector(name, index, parent) {
	return (parent || rules).filter(function(val) {
		return val.selectors && val.selectors.indexOf(name) >= 0;
	})[index || 0] || {};
}

function media(name, index) {
	return rules.filter(function(val) {
		return val.media && val.media.indexOf(name) >= 0;
	})[index || 0] || {};
}

function property(rule, name, index, parent) {
	if (typeof rule === 'string') {
		rule = selector(rule, index, parent);
	}
	return ((rule.declarations || []).filter(function(val) {
			return val.property === name;
		})[index || 0] || {}).value;
}

function isEqual(actual, expected, message) {
	assert.equal(actual, expected, format(message + '\n current: %s, expected: %s', actual, expected));
}

/////////////
// DEFAULT //
/////////////

isEqual(
	property('.example-default', 'margin-left'),
	'-10px',
	'Default example must have the default negative margin-left of -10px');

isEqual(
	property('.example-default > .col', 'float'),
	'left',
	'Default example uses float technique');

isEqual(
	property('.example-default > .col', 'width'),
	'calc(50% - 10px)',
	'Default example has 2 columns and 10px gutter');

isEqual(
	property('.example-default > .col', 'margin-left'),
	'10px',
	'Default example 10px margin-left');

isEqual(
	property('.example-default:after', 'clear'),
	'both',
	'Default example is float and must have the clearfix technique');

///////////
// 3 COL //
///////////

isEqual(
	property('.example-3col > .col', 'width'),
	'calc(33.33333333333333% - 10px)',
	'3 col example has 1/3 width');

//////////////////
// INLINE-BLOCK //
//////////////////

isEqual(
	property('.example-ib', 'margin-top'),
	'-10px',
	'Inline-block example has negative margin-top of gutter');

isEqual(
	property('.example-ib', 'font-size'),
	'0',
	'Inline-block holder has font-size: 0;');

isEqual(
	property('.example-ib > .col', 'font-size'),
	'16px',
	'Inline-block column reset to default font-size value');

isEqual(
	property('.example-ib > .col', 'display'),
	'inline-block',
	'Inline-block column should have display: inline-block');

isEqual(
	property('.example-ib > .col', 'margin-top'),
	'10px',
	'Inline-block column should have gutter applied on margin-top as well');

///////////////////
// DISPLAY TABLE //
///////////////////

isEqual(
	property('.example-tb-auto > .row-w', 'display'),
	'table',
	'Table technique must have an extra wrapper (row-w) with display table on it');

isEqual(
	property('.example-tb-auto > .row-w > .col', 'display'),
	'table-cell',
	'Table column should have display: table-cell');

isEqual(
	property('.example-tb-auto > .row-w > .col', 'box-sizing'),
	'border-box',
	'Table column should have box-sizing border-box');

isEqual(
	property('.example-tb-auto > .row-w > .col', 'padding-left'),
	'10px',
	'Table column should have gutter applied on padding');

//////////////////
// CUSTOM SIZES //
//////////////////

isEqual(
	property('.example-custom-sizes .module-a-wrapper', 'width'),
	'calc(20% - 10px)',
	'Custom sizes example should have the size applied with calc');

isEqual(
	property('.example-custom-sizes-gutter', 'margin-left'),
	'-20px',
	'Custom gutter example should have the gutter value as negative margin-left on wrapper');

isEqual(
	property('.example-custom-sizes-gutter > .col', 'margin-left'),
	'20px',
	'Custom gutter example should have the gutter value as margin-left on columns');

////////////////
// RESPONSIVE //
////////////////

curr = media('(max-width: 649px)', 0).rules;
isEqual(
	property('.example-max-width', 'margin-top', 0, curr),
	'0',
	'Max-width example resets margin-top of the holder');

isEqual(
	property('.example-max-width > .col', 'float', 0, curr),
	'none',
	'Max-width example resets the float of the column');

isEqual(
	property('.example-max-width > .col', 'display', 0, curr),
	'block',
	'Max-width example resets the display of the column');

isEqual(
	property('.example-max-width > .col', 'margin-top', 0, curr),
	'10px',
	'Max-width example sets the margin-top to gutter value');

isEqual(
	property('.example-max-width > .col:first-child', 'margin-top', 0, curr),
	'0',
	'Max-width example resets the margin-top of the first column');

///////////////////
// GLOBAL PARAMS //
///////////////////

isEqual(
	property('.example-global-params > .custom-col', 'margin-left'),
	'20px',
	'Global params example should have custom gutter by default (with custom col name)');

isEqual(
	property('.example-global-params > .custom-col', 'font-size'),
	'20px',
	'Global params example should have custom reset font-size by default');

isEqual(
	property('.example-global-params > .custom-col', 'display'),
	'inline-block',
	'Global params example should have custom type by default');

isEqual(
	property('.example-global-params > .custom-col', 'display'),
	'inline-block',
	'Global params example should have custom type by default');

isEqual(
	property('.example-global-params-tb > .custom-row', 'display'),
	'table',
	'Global params example should have custom type by default (with custom row name)');

isEqual(
	property('.example-global-params-reset > .col', 'float'),
	'left',
	'Reseted global params example should have type back to default configuration (with default col name)');

isEqual(
	property('.example-global-params-reset > .col', 'margin-left'),
	'10px',
	'Reseted global params example should have gutter back to default configuration');

isEqual(
	property('.example-global-params-reset-tb > .row-w', 'display'),
	'table',
	'Reseted global params example should have row-name back to detault configuration');

isEqual(
	property('.example-global-params-reset-ib > .col', 'font-size'),
	'16px',
	'Reseted global params example should have inline-block font size back to detault configuration');

