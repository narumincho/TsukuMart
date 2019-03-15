(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File === 'function' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[94m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.ac.J === region.ao.J)
	{
		return 'on line ' + region.ac.J;
	}
	return 'on lines ' + region.ac.J + ' through ' + region.ao.J;
}



// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = elm$core$Set$toList(x);
		y = elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = elm$core$Dict$toList(x);
		y = elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = elm$core$Dict$toList(x);
		y = elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? elm$core$Basics$LT : n ? elm$core$Basics$GT : elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === elm$core$Basics$EQ ? 0 : ord === elm$core$Basics$LT ? -1 : 1;
	}));
});


// CREATE

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function(options, string)
{
	var flags = 'g';
	if (options.az) { flags += 'm'; }
	if (options.ah) { flags += 'i'; }

	try
	{
		return elm$core$Maybe$Just(new RegExp(string, flags));
	}
	catch(error)
	{
		return elm$core$Maybe$Nothing;
	}
});


// USE

var _Regex_contains = F2(function(re, string)
{
	return string.match(re) !== null;
});


var _Regex_findAtMost = F3(function(n, re, str)
{
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex == re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch
				? elm$core$Maybe$Just(submatch)
				: elm$core$Maybe$Nothing;
		}
		out.push(A4(elm$regex$Regex$Match, result[0], result.index, number, _List_fromArray(subs)));
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _List_fromArray(out);
});


var _Regex_replaceAtMost = F4(function(n, re, replacer, string)
{
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch
				? elm$core$Maybe$Just(submatch)
				: elm$core$Maybe$Nothing;
		}
		return replacer(A4(elm$regex$Regex$Match, match, arguments[arguments.length - 2], count, _List_fromArray(submatches)));
	}
	return string.replace(re, jsReplacer);
});

var _Regex_splitAtMost = F3(function(n, re, str)
{
	var string = str;
	var out = [];
	var start = re.lastIndex;
	var restoreLastIndex = re.lastIndex;
	while (n--)
	{
		var result = re.exec(string);
		if (!result) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	re.lastIndex = restoreLastIndex;
	return _List_fromArray(out);
});

var _Regex_infinity = Infinity;



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return word
		? elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? elm$core$Maybe$Nothing
		: elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? elm$core$Maybe$Just(n) : elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return elm$core$Maybe$Nothing;
	}
}


/**_UNUSED/
function _Json_errorToString(error)
{
	return elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? elm$core$Result$Ok(value)
		: (value instanceof String)
			? elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return (elm$core$Result$isOk(result)) ? result : elm$core$Result$Err(A2(elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return (elm$core$Result$isOk(result)) ? result : elm$core$Result$Err(A2(elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!elm$core$Result$isOk(result))
					{
						return elm$core$Result$Err(A2(elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return elm$core$Result$Ok(elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if (elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return elm$core$Result$Err(elm$json$Json$Decode$OneOf(elm$core$List$reverse(errors)));

		case 1:
			return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!elm$core$Result$isOk(result))
		{
			return elm$core$Result$Err(A2(elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2(elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return elm$core$Result$Err(A2(elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.a4,
		impl.bi,
		impl.bh,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	result = init(result.a);
	var model = result.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		result = A2(update, msg, model);
		stepper(model = result.a, viewMetadata);
		_Platform_dispatchEffects(managers, result.b, subscriptions(model));
	}

	_Platform_dispatchEffects(managers, result.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				p: bag.n,
				q: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.q)
		{
			x = temp.p(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		r: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		r: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].r;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}



// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.x.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done(elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done(elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.x.b, xhr)); });
		elm$core$Maybe$isJust(request.aT) && _Http_track(router, xhr, request.aT.a);

		try {
			xhr.open(request.ax, request.D, true);
		} catch (e) {
			return done(elm$http$Http$BadUrl_(request.D));
		}

		_Http_configureRequest(xhr, request);

		request.H.a && xhr.setRequestHeader('Content-Type', request.H.a);
		xhr.send(request.H.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.ar; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.aS.a || 0;
	xhr.responseType = request.x.d;
	xhr.withCredentials = request.v;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? elm$http$Http$GoodStatus_ : elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		D: xhr.responseURL,
		aP: xhr.status,
		bf: xhr.statusText,
		ar: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return elm$core$Dict$empty;
	}

	var headers = elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3(elm$core$Dict$update, key, function(oldValue) {
				return elm$core$Maybe$Just(elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2(elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, elm$http$Http$Sending({
			be: event.loaded,
			ab: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2(elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, elm$http$Http$Receiving({
			bb: event.loaded,
			ab: event.lengthComputable ? elm$core$Maybe$Just(event.total) : elm$core$Maybe$Nothing
		}))));
	});
}



// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2(elm$json$Json$Decode$map, func, handler.a)
				:
			A3(elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		r: func(record.r),
		ad: record.ad,
		_: record._
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.r;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.ad;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value._) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.a4,
		impl.bi,
		impl.bh,
		function(sendToApp, initialModel) {
			var view = impl.bj;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.a4,
		impl.bi,
		impl.bh,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.K && impl.K(sendToApp)
			var view = impl.bj;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.H);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.f) && (_VirtualDom_doc.title = title = doc.f);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.a8;
	var onUrlRequest = impl.a9;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		K: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.aI === next.aI
							&& curr.as === next.as
							&& curr.aE.a === next.aE.a
						)
							? elm$browser$Browser$Internal(next)
							: elm$browser$Browser$External(href)
					));
				}
			});
		},
		a4: function(flags)
		{
			return A3(impl.a4, flags, _Browser_getUrl(), key);
		},
		bj: impl.bj,
		bi: impl.bi,
		bh: impl.bh
	});
}

function _Browser_getUrl()
{
	return elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return elm$core$Result$isOk(result) ? elm$core$Maybe$Just(result.a) : elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { a0: 'hidden', aY: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { a0: 'mozHidden', aY: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { a0: 'msHidden', aY: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { a0: 'webkitHidden', aY: 'webkitvisibilitychange' }
		: { a0: 'hidden', aY: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail(elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		aO: _Browser_getScene(),
		aV: {
			V: _Browser_window.pageXOffset,
			W: _Browser_window.pageYOffset,
			F: _Browser_doc.documentElement.clientWidth,
			y: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		F: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		y: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			aO: {
				F: node.scrollWidth,
				y: node.scrollHeight
			},
			aV: {
				V: node.scrollLeft,
				W: node.scrollTop,
				F: node.clientWidth,
				y: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			aO: _Browser_getScene(),
			aV: {
				V: x,
				W: y,
				F: _Browser_doc.documentElement.clientWidth,
				y: _Browser_doc.documentElement.clientHeight
			},
			aZ: {
				V: x + rect.left,
				W: y + rect.top,
				F: rect.width,
				y: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2(elm$core$Task$perform, elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});
var author$project$Main$UrlChange = function (a) {
	return {$: 5, a: a};
};
var author$project$Main$UrlRequest = function (a) {
	return {$: 6, a: a};
};
var author$project$Main$LogInStateNone = {$: 1};
var author$project$Main$MenuNotOpenedYet = 0;
var author$project$Main$Model = elm$core$Basics$identity;
var author$project$Main$HomePageRecommend = 1;
var author$project$Main$PageHome = function (a) {
	return {$: 0, a: a};
};
var author$project$Goods$Goods = elm$core$Basics$identity;
var author$project$Goods$LikeNew = 1;
var elm$core$Basics$False = 1;
var elm$core$Basics$identity = function (x) {
	return x;
};
var author$project$Goods$none = {aj: false, ak: 1, an: '説明文', a1: 'id', at: 'data:image/jpeg;base64,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', av: 3, aw: '場所', aA: '仮', aF: 99};
var author$project$Main$ExhibitionPage = elm$core$Basics$identity;
var author$project$Main$Like = 0;
var author$project$Main$PageExhibition = function (a) {
	return {$: 6, a: a};
};
var author$project$Main$PageExhibitionGoodsList = {$: 4};
var author$project$Main$PageGoods = function (a) {
	return {$: 7, a: a};
};
var author$project$Main$PageLikeAndHistory = function (a) {
	return {$: 3, a: a};
};
var author$project$Main$PageLogIn = function (a) {
	return {$: 2, a: a};
};
var author$project$Main$PagePurchaseGoodsList = {$: 5};
var author$project$Main$PageSignUp = function (a) {
	return {$: 1, a: a};
};
var author$project$Main$PageSiteMapXml = {$: 8};
var author$project$Page$LogIn$LogInPage = function (a) {
	return {$: 0, a: a};
};
var author$project$EmailAddress$EmailAddress = elm$core$Basics$identity;
var elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var elm$core$Maybe$Nothing = {$: 1};
var elm$core$Basics$EQ = 1;
var elm$core$Basics$LT = 0;
var elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var elm$core$Array$foldr = F3(
	function (func, baseCase, _n0) {
		var tree = _n0.c;
		var tail = _n0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3(elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3(elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			elm$core$Elm$JsArray$foldr,
			helper,
			A3(elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var elm$core$List$cons = _List_cons;
var elm$core$Array$toList = function (array) {
	return A3(elm$core$Array$foldr, elm$core$List$cons, _List_Nil, array);
};
var elm$core$Basics$GT = 2;
var elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3(elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var elm$core$Dict$toList = function (dict) {
	return A3(
		elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var elm$core$Dict$keys = function (dict) {
	return A3(
		elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2(elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var elm$core$Set$toList = function (_n0) {
	var dict = _n0;
	return elm$core$Dict$keys(dict);
};
var elm$regex$Regex$Match = F4(
	function (match, index, number, submatches) {
		return {a3: index, a6: match, a7: number, bg: submatches};
	});
var elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var elm$regex$Regex$fromString = function (string) {
	return A2(
		elm$regex$Regex$fromStringWith,
		{ah: false, az: false},
		string);
};
var elm$regex$Regex$never = _Regex_never;
var author$project$EmailAddress$emailRegex = A2(
	elm$core$Maybe$withDefault,
	elm$regex$Regex$never,
	elm$regex$Regex$fromString('^[a-zA-Z0-9.!#$%&\'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'));
var elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return elm$core$Maybe$Just(x);
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return elm$core$Maybe$Just(
				f(value));
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var elm$core$String$fromList = _String_fromList;
var elm$regex$Regex$find = _Regex_findAtMost(_Regex_infinity);
var author$project$EmailAddress$fromCharList = function (charList) {
	return A2(
		elm$core$Maybe$map,
		A2(
			elm$core$Basics$composeR,
			function ($) {
				return $.a6;
			},
			elm$core$Basics$identity),
		elm$core$List$head(
			A2(
				elm$regex$Regex$find,
				author$project$EmailAddress$emailRegex,
				elm$core$String$fromList(charList))));
};
var author$project$Page$LogIn$AEEmailAddress = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$LogIn$AENone = {$: 0};
var author$project$Page$LogIn$AEStudentId = function (a) {
	return {$: 1, a: a};
};
var author$project$StudentId$StudentId = F7(
	function (a, b, c, d, e, f, g) {
		return {$: 0, a: a, b: b, c: c, d: d, e: e, f: f, g: g};
	});
var author$project$StudentId$D0 = 0;
var author$project$StudentId$D1 = 1;
var author$project$StudentId$D2 = 2;
var author$project$StudentId$D3 = 3;
var author$project$StudentId$D4 = 4;
var author$project$StudentId$D5 = 5;
var author$project$StudentId$D6 = 6;
var author$project$StudentId$D7 = 7;
var author$project$StudentId$D8 = 8;
var author$project$StudentId$D9 = 9;
var author$project$StudentId$digitFromChar = function (_char) {
	switch (_char) {
		case '0':
			return elm$core$Maybe$Just(0);
		case '０':
			return elm$core$Maybe$Just(0);
		case '1':
			return elm$core$Maybe$Just(1);
		case '１':
			return elm$core$Maybe$Just(1);
		case '2':
			return elm$core$Maybe$Just(2);
		case '２':
			return elm$core$Maybe$Just(2);
		case '3':
			return elm$core$Maybe$Just(3);
		case '３':
			return elm$core$Maybe$Just(3);
		case '4':
			return elm$core$Maybe$Just(4);
		case '４':
			return elm$core$Maybe$Just(4);
		case '5':
			return elm$core$Maybe$Just(5);
		case '５':
			return elm$core$Maybe$Just(5);
		case '6':
			return elm$core$Maybe$Just(6);
		case '６':
			return elm$core$Maybe$Just(6);
		case '7':
			return elm$core$Maybe$Just(7);
		case '７':
			return elm$core$Maybe$Just(7);
		case '8':
			return elm$core$Maybe$Just(8);
		case '８':
			return elm$core$Maybe$Just(8);
		case '9':
			return elm$core$Maybe$Just(9);
		case '９':
			return elm$core$Maybe$Just(9);
		default:
			return elm$core$Maybe$Nothing;
	}
};
var elm$core$Basics$add = _Basics_add;
var elm$core$Basics$gt = _Utils_gt;
var elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var elm$core$List$reverse = function (list) {
	return A3(elm$core$List$foldl, elm$core$List$cons, _List_Nil, list);
};
var elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							elm$core$List$foldl,
							fn,
							acc,
							elm$core$List$reverse(r4)) : A4(elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4(elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var author$project$StudentId$fromCharListNo20Head = function (charList) {
	var _n0 = A2(elm$core$List$map, author$project$StudentId$digitFromChar, charList);
	if ((((((((((((((_n0.b && (!_n0.a.$)) && _n0.b.b) && (!_n0.b.a.$)) && _n0.b.b.b) && (!_n0.b.b.a.$)) && _n0.b.b.b.b) && (!_n0.b.b.b.a.$)) && _n0.b.b.b.b.b) && (!_n0.b.b.b.b.a.$)) && _n0.b.b.b.b.b.b) && (!_n0.b.b.b.b.b.a.$)) && _n0.b.b.b.b.b.b.b) && (!_n0.b.b.b.b.b.b.a.$)) && (!_n0.b.b.b.b.b.b.b.b)) {
		var i0 = _n0.a.a;
		var _n1 = _n0.b;
		var i1 = _n1.a.a;
		var _n2 = _n1.b;
		var i2 = _n2.a.a;
		var _n3 = _n2.b;
		var i3 = _n3.a.a;
		var _n4 = _n3.b;
		var i4 = _n4.a.a;
		var _n5 = _n4.b;
		var i5 = _n5.a.a;
		var _n6 = _n5.b;
		var i6 = _n6.a.a;
		return elm$core$Maybe$Just(
			A7(author$project$StudentId$StudentId, i0, i1, i2, i3, i4, i5, i6));
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var elm$core$Basics$True = 0;
var author$project$StudentId$is20 = F2(
	function (c0, c1) {
		var _n0 = _Utils_Tuple2(
			author$project$StudentId$digitFromChar(c0),
			author$project$StudentId$digitFromChar(c1));
		if ((((!_n0.a.$) && (_n0.a.a === 2)) && (!_n0.b.$)) && (!_n0.b.a)) {
			var _n1 = _n0.a.a;
			var _n2 = _n0.b.a;
			return true;
		} else {
			return false;
		}
	});
var author$project$StudentId$fromCharList = function (charList) {
	if (charList.b && charList.b.b) {
		var h0 = charList.a;
		var _n1 = charList.b;
		var h1 = _n1.a;
		var hs = _n1.b;
		return A2(author$project$StudentId$is20, h0, h1) ? author$project$StudentId$fromCharListNo20Head(hs) : elm$core$Maybe$Nothing;
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var elm$core$String$foldr = _String_foldr;
var elm$core$String$toList = function (string) {
	return A3(elm$core$String$foldr, elm$core$List$cons, _List_Nil, string);
};
var elm$core$String$trim = _String_trim;
var author$project$Page$LogIn$analysisStudentIdOrEmailAddress = function (string) {
	var charList = elm$core$String$toList(
		elm$core$String$trim(string));
	var _n0 = author$project$StudentId$fromCharList(charList);
	if (!_n0.$) {
		var studentId = _n0.a;
		return author$project$Page$LogIn$AEStudentId(studentId);
	} else {
		var _n1 = author$project$EmailAddress$fromCharList(charList);
		if (!_n1.$) {
			var emailAddress = _n1.a;
			return author$project$Page$LogIn$AEEmailAddress(emailAddress);
		} else {
			return author$project$Page$LogIn$AENone;
		}
	}
};
var author$project$Page$LogIn$initModel = author$project$Page$LogIn$LogInPage(
	{
		Z: elm$core$Maybe$Nothing,
		ae: author$project$Page$LogIn$analysisStudentIdOrEmailAddress('')
	});
var author$project$Page$SignUp$Normal = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$SignUp$StudentHasSAddress = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$SignUp$UniversitySchool = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$SignUp$UniversitySchoolNone = {$: 0};
var author$project$Page$SignUp$AEmailButIsNotTsukuba = {$: 4};
var author$project$Page$SignUp$ANone = {$: 0};
var author$project$Page$SignUp$APartStudentId = function (a) {
	return {$: 3, a: a};
};
var author$project$Page$SignUp$ASAddress = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$SignUp$AStudentId = function (a) {
	return {$: 1, a: a};
};
var author$project$SAddress$SAddress = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var elm$core$Basics$and = _Basics_and;
var elm$core$Basics$eq = _Utils_equal;
var elm$core$Basics$neq = _Utils_notEqual;
var elm$core$Basics$or = _Basics_or;
var elm$core$Basics$le = _Utils_le;
var elm$core$Char$toCode = _Char_toCode;
var elm$core$Char$isDigit = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var elm$core$Char$isLower = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var elm$core$Char$isUpper = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var elm$core$Char$isAlphaNum = function (_char) {
	return elm$core$Char$isLower(_char) || (elm$core$Char$isUpper(_char) || elm$core$Char$isDigit(_char));
};
var elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var elm$core$Basics$not = _Basics_not;
var elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			elm$core$List$any,
			A2(elm$core$Basics$composeL, elm$core$Basics$not, isOkay),
			list);
	});
var elm$core$Basics$lt = _Utils_lt;
var elm$core$Basics$negate = function (n) {
	return -n;
};
var elm$core$String$slice = _String_slice;
var elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3(elm$core$String$slice, 0, -n, string);
	});
var elm$core$String$length = _String_length;
var elm$core$String$right = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(
			elm$core$String$slice,
			-n,
			elm$core$String$length(string),
			string);
	});
var elm$core$String$toLower = _String_toLower;
var author$project$SAddress$fromCharList = function (charList) {
	if ((((((((charList.b && charList.b.b) && charList.b.b.b) && charList.b.b.b.b) && charList.b.b.b.b.b) && charList.b.b.b.b.b.b) && charList.b.b.b.b.b.b.b) && charList.b.b.b.b.b.b.b.b) && charList.b.b.b.b.b.b.b.b.b) {
		var s = charList.a;
		var _n1 = charList.b;
		var i0 = _n1.a;
		var _n2 = _n1.b;
		var i1 = _n2.a;
		var _n3 = _n2.b;
		var i2 = _n3.a;
		var _n4 = _n3.b;
		var i3 = _n4.a;
		var _n5 = _n4.b;
		var i4 = _n5.a;
		var _n6 = _n5.b;
		var i5 = _n6.a;
		var _n7 = _n6.b;
		var i6 = _n7.a;
		var _n8 = _n7.b;
		var at = _n8.a;
		var rest = _n8.b;
		if (((s === 's') || (s === 'S')) && (at === '@')) {
			var _n9 = author$project$StudentId$fromCharListNo20Head(
				_List_fromArray(
					[i0, i1, i2, i3, i4, i5, i6]));
			if (!_n9.$) {
				var studentId = _n9.a;
				var restString = elm$core$String$fromList(rest);
				return ((elm$core$String$toLower(
					A2(elm$core$String$right, 14, restString)) === '.tsukuba.ac.jp') && ((A2(elm$core$String$dropRight, 14, restString) !== '') && A2(
					elm$core$List$all,
					elm$core$Char$isAlphaNum,
					elm$core$String$toList(
						A2(elm$core$String$dropRight, 14, restString))))) ? elm$core$Maybe$Just(
					A2(
						author$project$SAddress$SAddress,
						studentId,
						elm$core$String$toLower(
							A2(elm$core$String$dropRight, 14, restString)))) : elm$core$Maybe$Nothing;
			} else {
				return elm$core$Maybe$Nothing;
			}
		} else {
			return elm$core$Maybe$Nothing;
		}
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var author$project$StudentId$P0 = {$: 0};
var author$project$StudentId$P1 = function (a) {
	return {$: 1, a: a};
};
var author$project$StudentId$P2 = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var author$project$StudentId$P3 = F3(
	function (a, b, c) {
		return {$: 3, a: a, b: b, c: c};
	});
var author$project$StudentId$P4 = F4(
	function (a, b, c, d) {
		return {$: 4, a: a, b: b, c: c, d: d};
	});
var author$project$StudentId$P5 = F5(
	function (a, b, c, d, e) {
		return {$: 5, a: a, b: b, c: c, d: d, e: e};
	});
var author$project$StudentId$P6 = F6(
	function (a, b, c, d, e, f) {
		return {$: 6, a: a, b: b, c: c, d: d, e: e, f: f};
	});
var author$project$StudentId$partStudentIdFromCharList = function (charList) {
	if (charList.b && charList.b.b) {
		var h0 = charList.a;
		var _n1 = charList.b;
		var h1 = _n1.a;
		var hs = _n1.b;
		if (A2(author$project$StudentId$is20, h0, h1)) {
			var _n2 = A2(elm$core$List$map, author$project$StudentId$digitFromChar, hs);
			_n2$7:
			while (true) {
				if (!_n2.b) {
					return elm$core$Maybe$Just(author$project$StudentId$P0);
				} else {
					if (!_n2.a.$) {
						if (!_n2.b.b) {
							var i0 = _n2.a.a;
							return elm$core$Maybe$Just(
								author$project$StudentId$P1(i0));
						} else {
							if (!_n2.b.a.$) {
								if (!_n2.b.b.b) {
									var i0 = _n2.a.a;
									var _n3 = _n2.b;
									var i1 = _n3.a.a;
									return elm$core$Maybe$Just(
										A2(author$project$StudentId$P2, i0, i1));
								} else {
									if (!_n2.b.b.a.$) {
										if (!_n2.b.b.b.b) {
											var i0 = _n2.a.a;
											var _n4 = _n2.b;
											var i1 = _n4.a.a;
											var _n5 = _n4.b;
											var i2 = _n5.a.a;
											return elm$core$Maybe$Just(
												A3(author$project$StudentId$P3, i0, i1, i2));
										} else {
											if (!_n2.b.b.b.a.$) {
												if (!_n2.b.b.b.b.b) {
													var i0 = _n2.a.a;
													var _n6 = _n2.b;
													var i1 = _n6.a.a;
													var _n7 = _n6.b;
													var i2 = _n7.a.a;
													var _n8 = _n7.b;
													var i3 = _n8.a.a;
													return elm$core$Maybe$Just(
														A4(author$project$StudentId$P4, i0, i1, i2, i3));
												} else {
													if (!_n2.b.b.b.b.a.$) {
														if (!_n2.b.b.b.b.b.b) {
															var i0 = _n2.a.a;
															var _n9 = _n2.b;
															var i1 = _n9.a.a;
															var _n10 = _n9.b;
															var i2 = _n10.a.a;
															var _n11 = _n10.b;
															var i3 = _n11.a.a;
															var _n12 = _n11.b;
															var i4 = _n12.a.a;
															return elm$core$Maybe$Just(
																A5(author$project$StudentId$P5, i0, i1, i2, i3, i4));
														} else {
															if ((!_n2.b.b.b.b.b.a.$) && (!_n2.b.b.b.b.b.b.b)) {
																var i0 = _n2.a.a;
																var _n13 = _n2.b;
																var i1 = _n13.a.a;
																var _n14 = _n13.b;
																var i2 = _n14.a.a;
																var _n15 = _n14.b;
																var i3 = _n15.a.a;
																var _n16 = _n15.b;
																var i4 = _n16.a.a;
																var _n17 = _n16.b;
																var i5 = _n17.a.a;
																return elm$core$Maybe$Just(
																	A6(author$project$StudentId$P6, i0, i1, i2, i3, i4, i5));
															} else {
																break _n2$7;
															}
														}
													} else {
														break _n2$7;
													}
												}
											} else {
												break _n2$7;
											}
										}
									} else {
										break _n2$7;
									}
								}
							} else {
								break _n2$7;
							}
						}
					} else {
						break _n2$7;
					}
				}
			}
			return elm$core$Maybe$Nothing;
		} else {
			return elm$core$Maybe$Nothing;
		}
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var author$project$Page$SignUp$analysisStudentIdOrSAddress = function (string) {
	var charList = elm$core$String$toList(
		elm$core$String$trim(string));
	var _n0 = author$project$StudentId$fromCharList(charList);
	if (!_n0.$) {
		var studentId = _n0.a;
		return author$project$Page$SignUp$AStudentId(studentId);
	} else {
		var _n1 = author$project$StudentId$partStudentIdFromCharList(charList);
		if (!_n1.$) {
			var partStudentId = _n1.a;
			return author$project$Page$SignUp$APartStudentId(partStudentId);
		} else {
			var _n2 = author$project$SAddress$fromCharList(charList);
			if (!_n2.$) {
				var sAddress = _n2.a;
				return author$project$Page$SignUp$ASAddress(sAddress);
			} else {
				var _n3 = author$project$EmailAddress$fromCharList(charList);
				if (!_n3.$) {
					return author$project$Page$SignUp$AEmailButIsNotTsukuba;
				} else {
					return author$project$Page$SignUp$ANone;
				}
			}
		}
	}
};
var author$project$Password$EAllNumberAndLengthError = function (a) {
	return {$: 4, a: a};
};
var author$project$Password$EAllNumberError = {$: 0};
var author$project$Password$EInvalidAndLengthError = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var author$project$Password$EInvalidCharError = function (a) {
	return {$: 1, a: a};
};
var author$project$Password$ELengthError = function (a) {
	return {$: 2, a: a};
};
var author$project$Password$Password = elm$core$Basics$identity;
var author$project$Password$InvalidCharError = elm$core$Basics$identity;
var author$project$Password$Ampersand = 67;
var author$project$Password$Apostrophe = 68;
var author$project$Password$Asterisk = 71;
var author$project$Password$CircumflexAccent = 87;
var author$project$Password$Colon = 77;
var author$project$Password$Comma = 73;
var author$project$Password$CommercialAt = 83;
var author$project$Password$DollarSign = 65;
var author$project$Password$EqualsSign = 80;
var author$project$Password$ExclamationMark = 62;
var author$project$Password$FullStop = 75;
var author$project$Password$GraveAccent = 89;
var author$project$Password$GreaterThanSign = 81;
var author$project$Password$HyphenMinus = 74;
var author$project$Password$LeftCurlyBracket = 90;
var author$project$Password$LeftParenthesis = 69;
var author$project$Password$LeftSquareBracket = 84;
var author$project$Password$LessThanSign = 79;
var author$project$Password$LowLine = 88;
var author$project$Password$NumberSign = 64;
var author$project$Password$P0 = 52;
var author$project$Password$P1 = 53;
var author$project$Password$P2 = 54;
var author$project$Password$P3 = 55;
var author$project$Password$P4 = 56;
var author$project$Password$P5 = 57;
var author$project$Password$P6 = 58;
var author$project$Password$P7 = 59;
var author$project$Password$P8 = 60;
var author$project$Password$P9 = 61;
var author$project$Password$PA = 26;
var author$project$Password$PB = 27;
var author$project$Password$PC = 28;
var author$project$Password$PD = 29;
var author$project$Password$PE = 30;
var author$project$Password$PF = 31;
var author$project$Password$PG = 32;
var author$project$Password$PH = 33;
var author$project$Password$PI = 34;
var author$project$Password$PJ = 35;
var author$project$Password$PK = 36;
var author$project$Password$PL = 37;
var author$project$Password$PM = 38;
var author$project$Password$PN = 39;
var author$project$Password$PO = 40;
var author$project$Password$PP = 41;
var author$project$Password$PQ = 42;
var author$project$Password$PR = 43;
var author$project$Password$PS = 44;
var author$project$Password$PT = 45;
var author$project$Password$PU = 46;
var author$project$Password$PV = 47;
var author$project$Password$PW = 48;
var author$project$Password$PX = 49;
var author$project$Password$PY = 50;
var author$project$Password$PZ = 51;
var author$project$Password$Pa = 0;
var author$project$Password$Pb = 1;
var author$project$Password$Pc = 2;
var author$project$Password$Pd = 3;
var author$project$Password$Pe = 4;
var author$project$Password$PercentSign = 66;
var author$project$Password$Pf = 5;
var author$project$Password$Pg = 6;
var author$project$Password$Ph = 7;
var author$project$Password$Pi = 8;
var author$project$Password$Pj = 9;
var author$project$Password$Pk = 10;
var author$project$Password$Pl = 11;
var author$project$Password$PlusSign = 72;
var author$project$Password$Pm = 12;
var author$project$Password$Pn = 13;
var author$project$Password$Po = 14;
var author$project$Password$Pp = 15;
var author$project$Password$Pq = 16;
var author$project$Password$Pr = 17;
var author$project$Password$Ps = 18;
var author$project$Password$Pt = 19;
var author$project$Password$Pu = 20;
var author$project$Password$Pv = 21;
var author$project$Password$Pw = 22;
var author$project$Password$Px = 23;
var author$project$Password$Py = 24;
var author$project$Password$Pz = 25;
var author$project$Password$QuestionMark = 82;
var author$project$Password$QuotationMark = 63;
var author$project$Password$ReverseSolidus = 85;
var author$project$Password$RightCurlyBracket = 92;
var author$project$Password$RightParenthesis = 70;
var author$project$Password$RightSquareBracket = 86;
var author$project$Password$Semicolon = 78;
var author$project$Password$Solidus = 76;
var author$project$Password$Tilde = 93;
var author$project$Password$VerticalLine = 91;
var author$project$Password$passwordCharFromChar = function (_char) {
	switch (_char) {
		case '!':
			return elm$core$Maybe$Just(62);
		case '！':
			return elm$core$Maybe$Just(62);
		case '\"':
			return elm$core$Maybe$Just(63);
		case '”':
			return elm$core$Maybe$Just(63);
		case '#':
			return elm$core$Maybe$Just(64);
		case '＃':
			return elm$core$Maybe$Just(64);
		case '$':
			return elm$core$Maybe$Just(65);
		case '＄':
			return elm$core$Maybe$Just(65);
		case '%':
			return elm$core$Maybe$Just(66);
		case '％':
			return elm$core$Maybe$Just(66);
		case '&':
			return elm$core$Maybe$Just(67);
		case '＆':
			return elm$core$Maybe$Just(67);
		case '\'':
			return elm$core$Maybe$Just(68);
		case '’':
			return elm$core$Maybe$Just(68);
		case '(':
			return elm$core$Maybe$Just(69);
		case '（':
			return elm$core$Maybe$Just(69);
		case ')':
			return elm$core$Maybe$Just(70);
		case '）':
			return elm$core$Maybe$Just(70);
		case '*':
			return elm$core$Maybe$Just(71);
		case '＊':
			return elm$core$Maybe$Just(71);
		case '+':
			return elm$core$Maybe$Just(72);
		case '＋':
			return elm$core$Maybe$Just(72);
		case ',':
			return elm$core$Maybe$Just(73);
		case '、':
			return elm$core$Maybe$Just(73);
		case '，':
			return elm$core$Maybe$Just(73);
		case '-':
			return elm$core$Maybe$Just(74);
		case 'ー':
			return elm$core$Maybe$Just(74);
		case '.':
			return elm$core$Maybe$Just(75);
		case '．':
			return elm$core$Maybe$Just(75);
		case '/':
			return elm$core$Maybe$Just(76);
		case '／':
			return elm$core$Maybe$Just(76);
		case ':':
			return elm$core$Maybe$Just(77);
		case '：':
			return elm$core$Maybe$Just(77);
		case ';':
			return elm$core$Maybe$Just(78);
		case '；':
			return elm$core$Maybe$Just(78);
		case '<':
			return elm$core$Maybe$Just(79);
		case '＜':
			return elm$core$Maybe$Just(79);
		case '=':
			return elm$core$Maybe$Just(80);
		case '＝':
			return elm$core$Maybe$Just(80);
		case '>':
			return elm$core$Maybe$Just(81);
		case '＞':
			return elm$core$Maybe$Just(81);
		case '?':
			return elm$core$Maybe$Just(82);
		case '？':
			return elm$core$Maybe$Just(82);
		case '@':
			return elm$core$Maybe$Just(83);
		case '＠':
			return elm$core$Maybe$Just(83);
		case '[':
			return elm$core$Maybe$Just(84);
		case '［':
			return elm$core$Maybe$Just(84);
		case '\\':
			return elm$core$Maybe$Just(85);
		case '￥':
			return elm$core$Maybe$Just(85);
		case ']':
			return elm$core$Maybe$Just(86);
		case '］':
			return elm$core$Maybe$Just(86);
		case '^':
			return elm$core$Maybe$Just(87);
		case '＾':
			return elm$core$Maybe$Just(87);
		case '_':
			return elm$core$Maybe$Just(88);
		case '＿':
			return elm$core$Maybe$Just(88);
		case '`':
			return elm$core$Maybe$Just(89);
		case '{':
			return elm$core$Maybe$Just(90);
		case '｛':
			return elm$core$Maybe$Just(90);
		case '|':
			return elm$core$Maybe$Just(91);
		case '｜':
			return elm$core$Maybe$Just(91);
		case '}':
			return elm$core$Maybe$Just(92);
		case '｝':
			return elm$core$Maybe$Just(92);
		case '~':
			return elm$core$Maybe$Just(93);
		case '～':
			return elm$core$Maybe$Just(93);
		case 'a':
			return elm$core$Maybe$Just(0);
		case 'ａ':
			return elm$core$Maybe$Just(0);
		case 'b':
			return elm$core$Maybe$Just(1);
		case 'ｂ':
			return elm$core$Maybe$Just(1);
		case 'c':
			return elm$core$Maybe$Just(2);
		case 'ｃ':
			return elm$core$Maybe$Just(2);
		case 'd':
			return elm$core$Maybe$Just(3);
		case 'ｄ':
			return elm$core$Maybe$Just(3);
		case 'e':
			return elm$core$Maybe$Just(4);
		case 'ｅ':
			return elm$core$Maybe$Just(4);
		case 'f':
			return elm$core$Maybe$Just(5);
		case 'ｆ':
			return elm$core$Maybe$Just(5);
		case 'g':
			return elm$core$Maybe$Just(6);
		case 'ｇ':
			return elm$core$Maybe$Just(6);
		case 'h':
			return elm$core$Maybe$Just(7);
		case 'ｈ':
			return elm$core$Maybe$Just(7);
		case 'i':
			return elm$core$Maybe$Just(8);
		case 'ｉ':
			return elm$core$Maybe$Just(8);
		case 'j':
			return elm$core$Maybe$Just(9);
		case 'ｊ':
			return elm$core$Maybe$Just(9);
		case 'k':
			return elm$core$Maybe$Just(10);
		case 'ｋ':
			return elm$core$Maybe$Just(10);
		case 'l':
			return elm$core$Maybe$Just(11);
		case 'ｌ':
			return elm$core$Maybe$Just(11);
		case 'm':
			return elm$core$Maybe$Just(12);
		case 'ｍ':
			return elm$core$Maybe$Just(12);
		case 'n':
			return elm$core$Maybe$Just(13);
		case 'ｎ':
			return elm$core$Maybe$Just(13);
		case 'o':
			return elm$core$Maybe$Just(14);
		case 'ｏ':
			return elm$core$Maybe$Just(14);
		case 'p':
			return elm$core$Maybe$Just(15);
		case 'ｐ':
			return elm$core$Maybe$Just(15);
		case 'q':
			return elm$core$Maybe$Just(16);
		case 'ｑ':
			return elm$core$Maybe$Just(16);
		case 'r':
			return elm$core$Maybe$Just(17);
		case 'ｒ':
			return elm$core$Maybe$Just(17);
		case 's':
			return elm$core$Maybe$Just(18);
		case 'ｓ':
			return elm$core$Maybe$Just(18);
		case 't':
			return elm$core$Maybe$Just(19);
		case 'ｔ':
			return elm$core$Maybe$Just(19);
		case 'u':
			return elm$core$Maybe$Just(20);
		case 'ｕ':
			return elm$core$Maybe$Just(20);
		case 'v':
			return elm$core$Maybe$Just(21);
		case 'ｖ':
			return elm$core$Maybe$Just(21);
		case 'w':
			return elm$core$Maybe$Just(22);
		case 'ｗ':
			return elm$core$Maybe$Just(22);
		case 'x':
			return elm$core$Maybe$Just(23);
		case 'ｘ':
			return elm$core$Maybe$Just(23);
		case 'y':
			return elm$core$Maybe$Just(24);
		case 'ｙ':
			return elm$core$Maybe$Just(24);
		case 'z':
			return elm$core$Maybe$Just(25);
		case 'ｚ':
			return elm$core$Maybe$Just(25);
		case 'A':
			return elm$core$Maybe$Just(26);
		case 'Ａ':
			return elm$core$Maybe$Just(26);
		case 'B':
			return elm$core$Maybe$Just(27);
		case 'Ｂ':
			return elm$core$Maybe$Just(27);
		case 'C':
			return elm$core$Maybe$Just(28);
		case 'Ｃ':
			return elm$core$Maybe$Just(28);
		case 'D':
			return elm$core$Maybe$Just(29);
		case 'Ｄ':
			return elm$core$Maybe$Just(29);
		case 'E':
			return elm$core$Maybe$Just(30);
		case 'Ｅ':
			return elm$core$Maybe$Just(30);
		case 'F':
			return elm$core$Maybe$Just(31);
		case 'Ｆ':
			return elm$core$Maybe$Just(31);
		case 'G':
			return elm$core$Maybe$Just(32);
		case 'Ｇ':
			return elm$core$Maybe$Just(32);
		case 'H':
			return elm$core$Maybe$Just(33);
		case 'Ｈ':
			return elm$core$Maybe$Just(33);
		case 'I':
			return elm$core$Maybe$Just(34);
		case 'Ｉ':
			return elm$core$Maybe$Just(34);
		case 'J':
			return elm$core$Maybe$Just(35);
		case 'Ｊ':
			return elm$core$Maybe$Just(35);
		case 'K':
			return elm$core$Maybe$Just(36);
		case 'Ｋ':
			return elm$core$Maybe$Just(36);
		case 'L':
			return elm$core$Maybe$Just(37);
		case 'Ｌ':
			return elm$core$Maybe$Just(37);
		case 'M':
			return elm$core$Maybe$Just(38);
		case 'Ｍ':
			return elm$core$Maybe$Just(38);
		case 'N':
			return elm$core$Maybe$Just(39);
		case 'Ｎ':
			return elm$core$Maybe$Just(39);
		case 'O':
			return elm$core$Maybe$Just(40);
		case 'Ｏ':
			return elm$core$Maybe$Just(40);
		case 'P':
			return elm$core$Maybe$Just(41);
		case 'Ｐ':
			return elm$core$Maybe$Just(41);
		case 'Q':
			return elm$core$Maybe$Just(42);
		case 'Ｑ':
			return elm$core$Maybe$Just(42);
		case 'R':
			return elm$core$Maybe$Just(43);
		case 'Ｒ':
			return elm$core$Maybe$Just(43);
		case 'S':
			return elm$core$Maybe$Just(44);
		case 'Ｓ':
			return elm$core$Maybe$Just(44);
		case 'T':
			return elm$core$Maybe$Just(45);
		case 'Ｔ':
			return elm$core$Maybe$Just(45);
		case 'U':
			return elm$core$Maybe$Just(46);
		case 'Ｕ':
			return elm$core$Maybe$Just(46);
		case 'V':
			return elm$core$Maybe$Just(47);
		case 'Ｖ':
			return elm$core$Maybe$Just(47);
		case 'W':
			return elm$core$Maybe$Just(48);
		case 'Ｗ':
			return elm$core$Maybe$Just(48);
		case 'X':
			return elm$core$Maybe$Just(49);
		case 'Ｘ':
			return elm$core$Maybe$Just(49);
		case 'Y':
			return elm$core$Maybe$Just(50);
		case 'Ｙ':
			return elm$core$Maybe$Just(50);
		case 'Z':
			return elm$core$Maybe$Just(51);
		case 'Ｚ':
			return elm$core$Maybe$Just(51);
		case '0':
			return elm$core$Maybe$Just(52);
		case '０':
			return elm$core$Maybe$Just(52);
		case '1':
			return elm$core$Maybe$Just(53);
		case '１':
			return elm$core$Maybe$Just(53);
		case '2':
			return elm$core$Maybe$Just(54);
		case '２':
			return elm$core$Maybe$Just(54);
		case '3':
			return elm$core$Maybe$Just(55);
		case '３':
			return elm$core$Maybe$Just(55);
		case '4':
			return elm$core$Maybe$Just(56);
		case '４':
			return elm$core$Maybe$Just(56);
		case '5':
			return elm$core$Maybe$Just(57);
		case '５':
			return elm$core$Maybe$Just(57);
		case '6':
			return elm$core$Maybe$Just(58);
		case '６':
			return elm$core$Maybe$Just(58);
		case '7':
			return elm$core$Maybe$Just(59);
		case '７':
			return elm$core$Maybe$Just(59);
		case '8':
			return elm$core$Maybe$Just(60);
		case '８':
			return elm$core$Maybe$Just(60);
		case '9':
			return elm$core$Maybe$Just(61);
		case '９':
			return elm$core$Maybe$Just(61);
		default:
			return elm$core$Maybe$Nothing;
	}
};
var elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var elm$core$Dict$Black = 1;
var elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var elm$core$Basics$compare = _Utils_compare;
var elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var elm$core$Dict$Red = 0;
var elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _n1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _n3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5(elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5(elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _n5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _n6 = left.d;
				var _n7 = _n6.a;
				var llK = _n6.b;
				var llV = _n6.c;
				var llLeft = _n6.d;
				var llRight = _n6.e;
				var lRight = left.e;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5(elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5(elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5(elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5(elm$core$Dict$RBNode_elm_builtin, 0, key, value, elm$core$Dict$RBEmpty_elm_builtin, elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _n1 = A2(elm$core$Basics$compare, key, nKey);
			switch (_n1) {
				case 0:
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3(elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5(elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3(elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _n0 = A3(elm$core$Dict$insertHelp, key, value, dict);
		if ((_n0.$ === -1) && (!_n0.a)) {
			var _n1 = _n0.a;
			var k = _n0.b;
			var v = _n0.c;
			var l = _n0.d;
			var r = _n0.e;
			return A5(elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _n0;
			return x;
		}
	});
var elm$core$Set$Set_elm_builtin = elm$core$Basics$identity;
var elm$core$Set$insert = F2(
	function (key, _n0) {
		var dict = _n0;
		return A3(elm$core$Dict$insert, key, 0, dict);
	});
var elm$core$Dict$singleton = F2(
	function (key, value) {
		return A5(elm$core$Dict$RBNode_elm_builtin, 1, key, value, elm$core$Dict$RBEmpty_elm_builtin, elm$core$Dict$RBEmpty_elm_builtin);
	});
var elm$core$Set$singleton = function (key) {
	return A2(elm$core$Dict$singleton, key, 0);
};
var author$project$Password$charListToPasswordCharList = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		var _n1 = _Utils_Tuple2(
			author$project$Password$passwordCharFromChar(x),
			author$project$Password$charListToPasswordCharList(xs));
		if (!_n1.a.$) {
			if (!_n1.b.$) {
				var pChar = _n1.a.a;
				var passwordCharList = _n1.b.a;
				return elm$core$Result$Ok(
					A2(elm$core$List$cons, pChar, passwordCharList));
			} else {
				var invalidCharSet = _n1.b.a;
				return elm$core$Result$Err(invalidCharSet);
			}
		} else {
			if (!_n1.b.$) {
				var _n2 = _n1.a;
				return elm$core$Result$Err(
					elm$core$Set$singleton(x));
			} else {
				var _n3 = _n1.a;
				var invalidCharSet = _n1.b.a;
				return elm$core$Result$Err(
					A2(elm$core$Set$insert, x, invalidCharSet));
			}
		}
	} else {
		return elm$core$Result$Ok(_List_Nil);
	}
};
var author$project$Password$Long = 1;
var author$project$Password$Short = 0;
var author$project$Password$lengthErrorFromLength = function (length) {
	return (length < 9) ? elm$core$Maybe$Just(0) : ((50 < length) ? elm$core$Maybe$Just(1) : elm$core$Maybe$Nothing);
};
var author$project$Password$passwordCharIsNumber = function (passwordChar) {
	switch (passwordChar) {
		case 52:
			return true;
		case 53:
			return true;
		case 54:
			return true;
		case 55:
			return true;
		case 56:
			return true;
		case 57:
			return true;
		case 58:
			return true;
		case 59:
			return true;
		case 60:
			return true;
		case 61:
			return true;
		default:
			return false;
	}
};
var elm$core$List$length = function (xs) {
	return A3(
		elm$core$List$foldl,
		F2(
			function (_n0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var author$project$Password$passwordFromString = function (string) {
	var charList = elm$core$String$toList(
		elm$core$String$trim(string));
	var result = author$project$Password$charListToPasswordCharList(charList);
	if (!result.$) {
		var passwordCharList = result.a;
		if ((!_Utils_eq(passwordCharList, _List_Nil)) && A2(elm$core$List$all, author$project$Password$passwordCharIsNumber, passwordCharList)) {
			var _n1 = author$project$Password$lengthErrorFromLength(
				elm$core$List$length(passwordCharList));
			if (!_n1.$) {
				var lengthError = _n1.a;
				return elm$core$Result$Err(
					author$project$Password$EAllNumberAndLengthError(lengthError));
			} else {
				return elm$core$Result$Err(author$project$Password$EAllNumberError);
			}
		} else {
			var _n2 = author$project$Password$lengthErrorFromLength(
				elm$core$List$length(passwordCharList));
			if (!_n2.$) {
				var lengthError = _n2.a;
				return elm$core$Result$Err(
					author$project$Password$ELengthError(lengthError));
			} else {
				return elm$core$Result$Ok(passwordCharList);
			}
		}
	} else {
		var invalidCharError = result.a;
		var _n3 = author$project$Password$lengthErrorFromLength(
			elm$core$List$length(charList));
		if (!_n3.$) {
			var lengthError = _n3.a;
			return elm$core$Result$Err(
				A2(author$project$Password$EInvalidAndLengthError, invalidCharError, lengthError));
		} else {
			return elm$core$Result$Err(
				author$project$Password$EInvalidCharError(invalidCharError));
		}
	}
};
var author$project$Page$SignUp$initModel = author$project$Page$SignUp$Normal(
	{
		k: author$project$Page$SignUp$StudentHasSAddress(
			{
				Z: author$project$Password$passwordFromString(''),
				L: author$project$Page$SignUp$analysisStudentIdOrSAddress('')
			}),
		aU: author$project$Page$SignUp$UniversitySchool(author$project$Page$SignUp$UniversitySchoolNone)
	});
var elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var elm$url$Url$Parser$Parser = elm$core$Basics$identity;
var elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {q: frag, t: params, p: unvisited, m: value, u: visited};
	});
var elm$url$Url$Parser$s = function (str) {
	return function (_n0) {
		var visited = _n0.u;
		var unvisited = _n0.p;
		var params = _n0.t;
		var frag = _n0.q;
		var value = _n0.m;
		if (!unvisited.b) {
			return _List_Nil;
		} else {
			var next = unvisited.a;
			var rest = unvisited.b;
			return _Utils_eq(next, str) ? _List_fromArray(
				[
					A5(
					elm$url$Url$Parser$State,
					A2(elm$core$List$cons, next, visited),
					rest,
					params,
					frag,
					value)
				]) : _List_Nil;
		}
	};
};
var author$project$SiteMap$exhibitionGoodsParser = elm$url$Url$Parser$s('exhibition-item');
var author$project$SiteMap$exhibitionParser = elm$url$Url$Parser$s('exhibition');
var elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3(elm$core$List$foldr, elm$core$List$cons, ys, xs);
		}
	});
var elm$core$List$concat = function (lists) {
	return A3(elm$core$List$foldr, elm$core$List$append, _List_Nil, lists);
};
var elm$core$List$concatMap = F2(
	function (f, list) {
		return elm$core$List$concat(
			A2(elm$core$List$map, f, list));
	});
var elm$url$Url$Parser$slash = F2(
	function (_n0, _n1) {
		var parseBefore = _n0;
		var parseAfter = _n1;
		return function (state) {
			return A2(
				elm$core$List$concatMap,
				parseAfter,
				parseBefore(state));
		};
	});
var elm$url$Url$Parser$custom = F2(
	function (tipe, stringToSomething) {
		return function (_n0) {
			var visited = _n0.u;
			var unvisited = _n0.p;
			var params = _n0.t;
			var frag = _n0.q;
			var value = _n0.m;
			if (!unvisited.b) {
				return _List_Nil;
			} else {
				var next = unvisited.a;
				var rest = unvisited.b;
				var _n2 = stringToSomething(next);
				if (!_n2.$) {
					var nextValue = _n2.a;
					return _List_fromArray(
						[
							A5(
							elm$url$Url$Parser$State,
							A2(elm$core$List$cons, next, visited),
							rest,
							params,
							frag,
							value(nextValue))
						]);
				} else {
					return _List_Nil;
				}
			}
		};
	});
var elm$url$Url$Parser$string = A2(elm$url$Url$Parser$custom, 'STRING', elm$core$Maybe$Just);
var author$project$SiteMap$goodsParser = A2(
	elm$url$Url$Parser$slash,
	elm$url$Url$Parser$s('goods'),
	elm$url$Url$Parser$string);
var elm$url$Url$Parser$top = function (state) {
	return _List_fromArray(
		[state]);
};
var author$project$SiteMap$homeParser = elm$url$Url$Parser$top;
var author$project$SiteMap$likeHistoryParser = elm$url$Url$Parser$s('like-history');
var author$project$SiteMap$logInParser = elm$url$Url$Parser$s('user-login');
var author$project$SiteMap$purchaseGoodsParser = elm$url$Url$Parser$s('purchase-item');
var author$project$SiteMap$signUpParser = elm$url$Url$Parser$s('user-signup');
var author$project$SiteMap$siteMapParser = elm$url$Url$Parser$s('sitemap');
var elm$url$Url$Parser$mapState = F2(
	function (func, _n0) {
		var visited = _n0.u;
		var unvisited = _n0.p;
		var params = _n0.t;
		var frag = _n0.q;
		var value = _n0.m;
		return A5(
			elm$url$Url$Parser$State,
			visited,
			unvisited,
			params,
			frag,
			func(value));
	});
var elm$url$Url$Parser$map = F2(
	function (subValue, _n0) {
		var parseArg = _n0;
		return function (_n1) {
			var visited = _n1.u;
			var unvisited = _n1.p;
			var params = _n1.t;
			var frag = _n1.q;
			var value = _n1.m;
			return A2(
				elm$core$List$map,
				elm$url$Url$Parser$mapState(value),
				parseArg(
					A5(elm$url$Url$Parser$State, visited, unvisited, params, frag, subValue)));
		};
	});
var elm$url$Url$Parser$oneOf = function (parsers) {
	return function (state) {
		return A2(
			elm$core$List$concatMap,
			function (_n0) {
				var parser = _n0;
				return parser(state);
			},
			parsers);
	};
};
var author$project$Main$urlParser = function (beforePageMaybe) {
	return elm$url$Url$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				elm$url$Url$Parser$map,
				author$project$Main$PageHome(1),
				author$project$SiteMap$homeParser),
				A2(
				elm$url$Url$Parser$map,
				author$project$Main$PageSignUp(author$project$Page$SignUp$initModel),
				author$project$SiteMap$signUpParser),
				A2(
				elm$url$Url$Parser$map,
				author$project$Main$PageLogIn(
					_Utils_Tuple2(author$project$Page$LogIn$initModel, beforePageMaybe)),
				author$project$SiteMap$logInParser),
				A2(
				elm$url$Url$Parser$map,
				author$project$Main$PageLikeAndHistory(0),
				author$project$SiteMap$likeHistoryParser),
				A2(elm$url$Url$Parser$map, author$project$Main$PageExhibitionGoodsList, author$project$SiteMap$exhibitionGoodsParser),
				A2(elm$url$Url$Parser$map, author$project$Main$PagePurchaseGoodsList, author$project$SiteMap$purchaseGoodsParser),
				A2(
				elm$url$Url$Parser$map,
				author$project$Main$PageExhibition(
					{an: '', at: _List_Nil, aF: elm$core$Maybe$Nothing, f: ''}),
				author$project$SiteMap$exhibitionParser),
				A2(
				elm$url$Url$Parser$map,
				function (_n0) {
					return author$project$Main$PageGoods(author$project$Goods$none);
				},
				author$project$SiteMap$goodsParser),
				A2(elm$url$Url$Parser$map, author$project$Main$PageSiteMapXml, author$project$SiteMap$siteMapParser)
			]));
};
var elm$url$Url$Parser$getFirstMatch = function (states) {
	getFirstMatch:
	while (true) {
		if (!states.b) {
			return elm$core$Maybe$Nothing;
		} else {
			var state = states.a;
			var rest = states.b;
			var _n1 = state.p;
			if (!_n1.b) {
				return elm$core$Maybe$Just(state.m);
			} else {
				if ((_n1.a === '') && (!_n1.b.b)) {
					return elm$core$Maybe$Just(state.m);
				} else {
					var $temp$states = rest;
					states = $temp$states;
					continue getFirstMatch;
				}
			}
		}
	}
};
var elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var elm$url$Url$Parser$removeFinalEmpty = function (segments) {
	if (!segments.b) {
		return _List_Nil;
	} else {
		if ((segments.a === '') && (!segments.b.b)) {
			return _List_Nil;
		} else {
			var segment = segments.a;
			var rest = segments.b;
			return A2(
				elm$core$List$cons,
				segment,
				elm$url$Url$Parser$removeFinalEmpty(rest));
		}
	}
};
var elm$url$Url$Parser$preparePath = function (path) {
	var _n0 = A2(elm$core$String$split, '/', path);
	if (_n0.b && (_n0.a === '')) {
		var segments = _n0.b;
		return elm$url$Url$Parser$removeFinalEmpty(segments);
	} else {
		var segments = _n0;
		return elm$url$Url$Parser$removeFinalEmpty(segments);
	}
};
var elm$core$Dict$empty = elm$core$Dict$RBEmpty_elm_builtin;
var elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _n1 = A2(elm$core$Basics$compare, targetKey, key);
				switch (_n1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n1 = dict.d;
			var lClr = _n1.a;
			var lK = _n1.b;
			var lV = _n1.c;
			var lLeft = _n1.d;
			var lRight = _n1.e;
			var _n2 = dict.e;
			var rClr = _n2.a;
			var rK = _n2.b;
			var rV = _n2.c;
			var rLeft = _n2.d;
			var _n3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _n2.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5(elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n4 = dict.d;
			var lClr = _n4.a;
			var lK = _n4.b;
			var lV = _n4.c;
			var lLeft = _n4.d;
			var lRight = _n4.e;
			var _n5 = dict.e;
			var rClr = _n5.a;
			var rK = _n5.b;
			var rV = _n5.c;
			var rLeft = _n5.d;
			var rRight = _n5.e;
			if (clr === 1) {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n1 = dict.d;
			var lClr = _n1.a;
			var lK = _n1.b;
			var lV = _n1.c;
			var _n2 = _n1.d;
			var _n3 = _n2.a;
			var llK = _n2.b;
			var llV = _n2.c;
			var llLeft = _n2.d;
			var llRight = _n2.e;
			var lRight = _n1.e;
			var _n4 = dict.e;
			var rClr = _n4.a;
			var rK = _n4.b;
			var rV = _n4.c;
			var rLeft = _n4.d;
			var rRight = _n4.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5(elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5(elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _n5 = dict.d;
			var lClr = _n5.a;
			var lK = _n5.b;
			var lV = _n5.c;
			var lLeft = _n5.d;
			var lRight = _n5.e;
			var _n6 = dict.e;
			var rClr = _n6.a;
			var rK = _n6.b;
			var rV = _n6.c;
			var rLeft = _n6.d;
			var rRight = _n6.e;
			if (clr === 1) {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5(elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5(elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _n1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5(elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_n2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _n3 = right.a;
							var _n4 = right.d;
							var _n5 = _n4.a;
							return elm$core$Dict$moveRedRight(dict);
						} else {
							break _n2$2;
						}
					} else {
						var _n6 = right.a;
						var _n7 = right.d;
						return elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _n2$2;
				}
			}
			return dict;
		}
	});
var elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _n3 = lLeft.a;
				return A5(
					elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					elm$core$Dict$removeMin(left),
					right);
			} else {
				var _n4 = elm$core$Dict$moveRedLeft(dict);
				if (_n4.$ === -1) {
					var nColor = _n4.a;
					var nKey = _n4.b;
					var nValue = _n4.c;
					var nLeft = _n4.d;
					var nRight = _n4.e;
					return A5(
						elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _n4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _n6 = lLeft.a;
						return A5(
							elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2(elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _n7 = elm$core$Dict$moveRedLeft(dict);
						if (_n7.$ === -1) {
							var nColor = _n7.a;
							var nKey = _n7.b;
							var nValue = _n7.c;
							var nLeft = _n7.d;
							var nRight = _n7.e;
							return A5(
								elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2(elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2(elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7(elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _n1 = elm$core$Dict$getMin(right);
				if (_n1.$ === -1) {
					var minKey = _n1.b;
					var minValue = _n1.c;
					return A5(
						elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						elm$core$Dict$removeMin(right));
				} else {
					return elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2(elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var elm$core$Dict$remove = F2(
	function (key, dict) {
		var _n0 = A2(elm$core$Dict$removeHelp, key, dict);
		if ((_n0.$ === -1) && (!_n0.a)) {
			var _n1 = _n0.a;
			var k = _n0.b;
			var v = _n0.c;
			var l = _n0.d;
			var r = _n0.e;
			return A5(elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _n0;
			return x;
		}
	});
var elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _n0 = alter(
			A2(elm$core$Dict$get, targetKey, dictionary));
		if (!_n0.$) {
			var value = _n0.a;
			return A3(elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2(elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var elm$url$Url$percentDecode = _Url_percentDecode;
var elm$url$Url$Parser$addToParametersHelp = F2(
	function (value, maybeList) {
		if (maybeList.$ === 1) {
			return elm$core$Maybe$Just(
				_List_fromArray(
					[value]));
		} else {
			var list = maybeList.a;
			return elm$core$Maybe$Just(
				A2(elm$core$List$cons, value, list));
		}
	});
var elm$url$Url$Parser$addParam = F2(
	function (segment, dict) {
		var _n0 = A2(elm$core$String$split, '=', segment);
		if ((_n0.b && _n0.b.b) && (!_n0.b.b.b)) {
			var rawKey = _n0.a;
			var _n1 = _n0.b;
			var rawValue = _n1.a;
			var _n2 = elm$url$Url$percentDecode(rawKey);
			if (_n2.$ === 1) {
				return dict;
			} else {
				var key = _n2.a;
				var _n3 = elm$url$Url$percentDecode(rawValue);
				if (_n3.$ === 1) {
					return dict;
				} else {
					var value = _n3.a;
					return A3(
						elm$core$Dict$update,
						key,
						elm$url$Url$Parser$addToParametersHelp(value),
						dict);
				}
			}
		} else {
			return dict;
		}
	});
var elm$url$Url$Parser$prepareQuery = function (maybeQuery) {
	if (maybeQuery.$ === 1) {
		return elm$core$Dict$empty;
	} else {
		var qry = maybeQuery.a;
		return A3(
			elm$core$List$foldr,
			elm$url$Url$Parser$addParam,
			elm$core$Dict$empty,
			A2(elm$core$String$split, '&', qry));
	}
};
var elm$url$Url$Parser$parse = F2(
	function (_n0, url) {
		var parser = _n0;
		return elm$url$Url$Parser$getFirstMatch(
			parser(
				A5(
					elm$url$Url$Parser$State,
					_List_Nil,
					elm$url$Url$Parser$preparePath(url.aC),
					elm$url$Url$Parser$prepareQuery(url.aJ),
					url.aq,
					elm$core$Basics$identity)));
	});
var author$project$Main$urlToPage = F2(
	function (url, beforePageMaybe) {
		return A2(
			elm$core$Maybe$withDefault,
			_Utils_Tuple2(
				author$project$Main$PageHome(1),
				elm$core$Maybe$Just('指定したページが見つからないのでホームに移動しました')),
			A2(
				elm$core$Maybe$map,
				function (page) {
					return _Utils_Tuple2(page, elm$core$Maybe$Nothing);
				},
				A2(
					elm$url$Url$Parser$parse,
					author$project$Main$urlParser(beforePageMaybe),
					url)));
	});
var elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var elm$core$Array$branchFactor = 32;
var elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var elm$core$Basics$ceiling = _Basics_ceiling;
var elm$core$Basics$fdiv = _Basics_fdiv;
var elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var elm$core$Basics$toFloat = _Basics_toFloat;
var elm$core$Array$shiftStep = elm$core$Basics$ceiling(
	A2(elm$core$Basics$logBase, 2, elm$core$Array$branchFactor));
var elm$core$Elm$JsArray$empty = _JsArray_empty;
var elm$core$Array$empty = A4(elm$core$Array$Array_elm_builtin, 0, elm$core$Array$shiftStep, elm$core$Elm$JsArray$empty, elm$core$Elm$JsArray$empty);
var elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _n0 = A2(elm$core$Elm$JsArray$initializeFromList, elm$core$Array$branchFactor, nodes);
			var node = _n0.a;
			var remainingNodes = _n0.b;
			var newAcc = A2(
				elm$core$List$cons,
				elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var elm$core$Tuple$first = function (_n0) {
	var x = _n0.a;
	return x;
};
var elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = elm$core$Basics$ceiling(nodeListSize / elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2(elm$core$Elm$JsArray$initializeFromList, elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2(elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var elm$core$Basics$floor = _Basics_floor;
var elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var elm$core$Basics$mul = _Basics_mul;
var elm$core$Basics$sub = _Basics_sub;
var elm$core$Elm$JsArray$length = _JsArray_length;
var elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.b) {
			return A4(
				elm$core$Array$Array_elm_builtin,
				elm$core$Elm$JsArray$length(builder.d),
				elm$core$Array$shiftStep,
				elm$core$Elm$JsArray$empty,
				builder.d);
		} else {
			var treeLen = builder.b * elm$core$Array$branchFactor;
			var depth = elm$core$Basics$floor(
				A2(elm$core$Basics$logBase, elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? elm$core$List$reverse(builder.e) : builder.e;
			var tree = A2(elm$core$Array$treeFromBuilder, correctNodeList, builder.b);
			return A4(
				elm$core$Array$Array_elm_builtin,
				elm$core$Elm$JsArray$length(builder.d) + treeLen,
				A2(elm$core$Basics$max, 5, depth * elm$core$Array$shiftStep),
				tree,
				builder.d);
		}
	});
var elm$core$Basics$idiv = _Basics_idiv;
var elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					elm$core$Array$builderToArray,
					false,
					{e: nodeList, b: (len / elm$core$Array$branchFactor) | 0, d: tail});
			} else {
				var leaf = elm$core$Array$Leaf(
					A3(elm$core$Elm$JsArray$initialize, elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2(elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var elm$core$Basics$remainderBy = _Basics_remainderBy;
var elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return elm$core$Array$empty;
		} else {
			var tailLen = len % elm$core$Array$branchFactor;
			var tail = A3(elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - elm$core$Array$branchFactor;
			return A5(elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var elm$core$Basics$append = _Utils_append;
var elm$core$Char$isAlpha = function (_char) {
	return elm$core$Char$isLower(_char) || elm$core$Char$isUpper(_char);
};
var elm$core$List$map2 = _List_map2;
var elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2(elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var elm$core$List$range = F2(
	function (lo, hi) {
		return A3(elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			elm$core$List$map2,
			f,
			A2(
				elm$core$List$range,
				0,
				elm$core$List$length(xs) - 1),
			xs);
	});
var elm$core$String$all = _String_all;
var elm$core$String$fromInt = _String_fromNumber;
var elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var elm$core$String$uncons = _String_uncons;
var elm$json$Json$Decode$indent = function (str) {
	return A2(
		elm$core$String$join,
		'\n    ',
		A2(elm$core$String$split, '\n', str));
};
var elm$json$Json$Encode$encode = _Json_encode;
var elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + (elm$core$String$fromInt(i + 1) + (') ' + elm$json$Json$Decode$indent(
			elm$json$Json$Decode$errorToString(error))));
	});
var elm$json$Json$Decode$errorToString = function (error) {
	return A2(elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _n1 = elm$core$String$uncons(f);
						if (_n1.$ === 1) {
							return false;
						} else {
							var _n2 = _n1.a;
							var _char = _n2.a;
							var rest = _n2.b;
							return elm$core$Char$isAlpha(_char) && A2(elm$core$String$all, elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2(elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + (elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2(elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									elm$core$String$join,
									'',
									elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										elm$core$String$join,
										'',
										elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + (elm$core$String$fromInt(
								elm$core$List$length(errors)) + ' ways:'));
							return A2(
								elm$core$String$join,
								'\n\n',
								A2(
									elm$core$List$cons,
									introduction,
									A2(elm$core$List$indexedMap, elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								elm$core$String$join,
								'',
								elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + (elm$json$Json$Decode$indent(
						A2(elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var elm$core$Platform$Cmd$batch = _Platform_batch;
var elm$core$Platform$Cmd$none = elm$core$Platform$Cmd$batch(_List_Nil);
var author$project$Main$init = F3(
	function (_n0, url, key) {
		var _n1 = A2(author$project$Main$urlToPage, url, elm$core$Maybe$Nothing);
		var page = _n1.a;
		var messageMaybe = _n1.b;
		return _Utils_Tuple2(
			{
				au: key,
				z: author$project$Main$LogInStateNone,
				i: elm$core$Maybe$Just(0),
				r: messageMaybe,
				a: page
			},
			elm$core$Platform$Cmd$none);
	});
var author$project$Main$ReceiveImageDataUrl = function (a) {
	return {$: 15, a: a};
};
var author$project$Main$ReceiveImageDataUrlMulti = function (a) {
	return {$: 16, a: a};
};
var author$project$Main$ToNarrowScreenMode = {$: 4};
var author$project$Main$ToWideScreenMode = {$: 3};
var elm$json$Json$Decode$string = _Json_decodeString;
var author$project$Main$receiveImageDataUrl = _Platform_incomingPort('receiveImageDataUrl', elm$json$Json$Decode$string);
var elm$json$Json$Decode$list = _Json_decodeList;
var author$project$Main$receiveImageDataUrlMulti = _Platform_incomingPort(
	'receiveImageDataUrlMulti',
	elm$json$Json$Decode$list(elm$json$Json$Decode$string));
var elm$json$Json$Decode$null = _Json_decodeNull;
var author$project$Main$toNarrowScreenMode = _Platform_incomingPort(
	'toNarrowScreenMode',
	elm$json$Json$Decode$null(0));
var author$project$Main$toWideScreenMode = _Platform_incomingPort(
	'toWideScreenMode',
	elm$json$Json$Decode$null(0));
var elm$core$Basics$always = F2(
	function (a, _n0) {
		return a;
	});
var elm$core$Platform$Sub$batch = _Platform_batch;
var author$project$Main$subscription = function (_n0) {
	var menuState = _n0.i;
	return elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				author$project$Main$receiveImageDataUrl(author$project$Main$ReceiveImageDataUrl),
				author$project$Main$receiveImageDataUrlMulti(author$project$Main$ReceiveImageDataUrlMulti),
				function () {
				if (!menuState.$) {
					return author$project$Main$toWideScreenMode(
						elm$core$Basics$always(author$project$Main$ToWideScreenMode));
				} else {
					return author$project$Main$toNarrowScreenMode(
						elm$core$Basics$always(author$project$Main$ToNarrowScreenMode));
				}
			}()
			]));
};
var author$project$Api$debugDeleteAllUserResponseToResult = function (response) {
	switch (response.$) {
		case 0:
			return elm$core$Result$Err(0);
		case 1:
			return elm$core$Result$Err(0);
		case 2:
			return elm$core$Result$Err(0);
		case 3:
			return elm$core$Result$Ok(0);
		default:
			return elm$core$Result$Ok(0);
	}
};
var elm$core$Maybe$isJust = function (maybe) {
	if (!maybe.$) {
		return true;
	} else {
		return false;
	}
};
var elm$core$Platform$sendToApp = _Platform_sendToApp;
var elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var elm$core$Result$map = F2(
	function (func, ra) {
		if (!ra.$) {
			var a = ra.a;
			return elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return elm$core$Result$Err(e);
		}
	});
var elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var elm$http$Http$BadUrl_ = function (a) {
	return {$: 0, a: a};
};
var elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var elm$http$Http$NetworkError_ = {$: 2};
var elm$http$Http$Receiving = function (a) {
	return {$: 1, a: a};
};
var elm$http$Http$Sending = function (a) {
	return {$: 0, a: a};
};
var elm$http$Http$Timeout_ = {$: 1};
var elm$http$Http$expectStringResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'',
			elm$core$Basics$identity,
			A2(elm$core$Basics$composeR, toResult, toMsg));
	});
var elm$http$Http$emptyBody = _Http_emptyBody;
var elm$http$Http$Request = function (a) {
	return {$: 1, a: a};
};
var elm$core$Task$succeed = _Scheduler_succeed;
var elm$http$Http$State = F2(
	function (reqs, subs) {
		return {aL: reqs, aQ: subs};
	});
var elm$http$Http$init = elm$core$Task$succeed(
	A2(elm$http$Http$State, elm$core$Dict$empty, _List_Nil));
var elm$core$Task$andThen = _Scheduler_andThen;
var elm$core$Process$kill = _Scheduler_kill;
var elm$core$Process$spawn = _Scheduler_spawn;
var elm$http$Http$updateReqs = F3(
	function (router, cmds, reqs) {
		updateReqs:
		while (true) {
			if (!cmds.b) {
				return elm$core$Task$succeed(reqs);
			} else {
				var cmd = cmds.a;
				var otherCmds = cmds.b;
				if (!cmd.$) {
					var tracker = cmd.a;
					var _n2 = A2(elm$core$Dict$get, tracker, reqs);
					if (_n2.$ === 1) {
						var $temp$router = router,
							$temp$cmds = otherCmds,
							$temp$reqs = reqs;
						router = $temp$router;
						cmds = $temp$cmds;
						reqs = $temp$reqs;
						continue updateReqs;
					} else {
						var pid = _n2.a;
						return A2(
							elm$core$Task$andThen,
							function (_n3) {
								return A3(
									elm$http$Http$updateReqs,
									router,
									otherCmds,
									A2(elm$core$Dict$remove, tracker, reqs));
							},
							elm$core$Process$kill(pid));
					}
				} else {
					var req = cmd.a;
					return A2(
						elm$core$Task$andThen,
						function (pid) {
							var _n4 = req.aT;
							if (_n4.$ === 1) {
								return A3(elm$http$Http$updateReqs, router, otherCmds, reqs);
							} else {
								var tracker = _n4.a;
								return A3(
									elm$http$Http$updateReqs,
									router,
									otherCmds,
									A3(elm$core$Dict$insert, tracker, pid, reqs));
							}
						},
						elm$core$Process$spawn(
							A3(
								_Http_toTask,
								router,
								elm$core$Platform$sendToApp(router),
								req)));
				}
			}
		}
	});
var elm$http$Http$onEffects = F4(
	function (router, cmds, subs, state) {
		return A2(
			elm$core$Task$andThen,
			function (reqs) {
				return elm$core$Task$succeed(
					A2(elm$http$Http$State, reqs, subs));
			},
			A3(elm$http$Http$updateReqs, router, cmds, state.aL));
	});
var elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _n0 = f(mx);
		if (!_n0.$) {
			var x = _n0.a;
			return A2(elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			elm$core$List$foldr,
			elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			elm$core$Task$andThen,
			function (a) {
				return A2(
					elm$core$Task$andThen,
					function (b) {
						return elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var elm$core$Task$sequence = function (tasks) {
	return A3(
		elm$core$List$foldr,
		elm$core$Task$map2(elm$core$List$cons),
		elm$core$Task$succeed(_List_Nil),
		tasks);
};
var elm$http$Http$maybeSend = F4(
	function (router, desiredTracker, progress, _n0) {
		var actualTracker = _n0.a;
		var toMsg = _n0.b;
		return _Utils_eq(desiredTracker, actualTracker) ? elm$core$Maybe$Just(
			A2(
				elm$core$Platform$sendToApp,
				router,
				toMsg(progress))) : elm$core$Maybe$Nothing;
	});
var elm$http$Http$onSelfMsg = F3(
	function (router, _n0, state) {
		var tracker = _n0.a;
		var progress = _n0.b;
		return A2(
			elm$core$Task$andThen,
			function (_n1) {
				return elm$core$Task$succeed(state);
			},
			elm$core$Task$sequence(
				A2(
					elm$core$List$filterMap,
					A3(elm$http$Http$maybeSend, router, tracker, progress),
					state.aQ)));
	});
var elm$http$Http$Cancel = function (a) {
	return {$: 0, a: a};
};
var elm$http$Http$cmdMap = F2(
	function (func, cmd) {
		if (!cmd.$) {
			var tracker = cmd.a;
			return elm$http$Http$Cancel(tracker);
		} else {
			var r = cmd.a;
			return elm$http$Http$Request(
				{
					v: r.v,
					H: r.H,
					x: A2(_Http_mapExpect, func, r.x),
					ar: r.ar,
					ax: r.ax,
					aS: r.aS,
					aT: r.aT,
					D: r.D
				});
		}
	});
var elm$http$Http$MySub = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var elm$http$Http$subMap = F2(
	function (func, _n0) {
		var tracker = _n0.a;
		var toMsg = _n0.b;
		return A2(
			elm$http$Http$MySub,
			tracker,
			A2(elm$core$Basics$composeR, toMsg, func));
	});
_Platform_effectManagers['Http'] = _Platform_createManager(elm$http$Http$init, elm$http$Http$onEffects, elm$http$Http$onSelfMsg, elm$http$Http$cmdMap, elm$http$Http$subMap);
var elm$http$Http$command = _Platform_leaf('Http');
var elm$http$Http$subscription = _Platform_leaf('Http');
var elm$http$Http$request = function (r) {
	return elm$http$Http$command(
		elm$http$Http$Request(
			{v: false, H: r.H, x: r.x, ar: r.ar, ax: r.ax, aS: r.aS, aT: r.aT, D: r.D}));
};
var elm$http$Http$get = function (r) {
	return elm$http$Http$request(
		{H: elm$http$Http$emptyBody, x: r.x, ar: _List_Nil, ax: 'GET', aS: elm$core$Maybe$Nothing, aT: elm$core$Maybe$Nothing, D: r.D});
};
var author$project$Api$debugDeleteAllUser = function (msg) {
	return elm$http$Http$get(
		{
			x: A2(elm$http$Http$expectStringResponse, msg, author$project$Api$debugDeleteAllUserResponseToResult),
			D: 'http://api.tsukumart.com/v1/debug/user/delete/?all=true'
		});
};
var author$project$Api$UserProfile = elm$core$Basics$identity;
var author$project$School$DHuman = function (a) {
	return {$: 2, a: a};
};
var author$project$School$DHumcul = function (a) {
	return {$: 0, a: a};
};
var author$project$School$DInfo = function (a) {
	return {$: 5, a: a};
};
var author$project$School$DLife = function (a) {
	return {$: 3, a: a};
};
var author$project$School$DMed = function (a) {
	return {$: 6, a: a};
};
var author$project$School$DSocint = function (a) {
	return {$: 1, a: a};
};
var author$project$School$DSse = function (a) {
	return {$: 4, a: a};
};
var author$project$School$HumanDisability = 2;
var author$project$School$HumanEducation = 0;
var author$project$School$HumanPsyche = 1;
var author$project$School$HumculCulture = 1;
var author$project$School$HumculHumanity = 0;
var author$project$School$HumculJapanese = 2;
var author$project$School$InfoCoins = 0;
var author$project$School$InfoKlis = 2;
var author$project$School$InfoMast = 1;
var author$project$School$LifeBiol = 0;
var author$project$School$LifeBres = 1;
var author$project$School$LifeEarth = 2;
var author$project$School$MedMed = 0;
var author$project$School$MedMs = 2;
var author$project$School$MedNurse = 1;
var author$project$School$SocintCis = 1;
var author$project$School$SocintSocial = 0;
var author$project$School$SseChem = 2;
var author$project$School$SseCoens = 3;
var author$project$School$SseEsys = 4;
var author$project$School$SseMath = 0;
var author$project$School$SsePandps = 5;
var author$project$School$SsePhys = 1;
var author$project$School$departmentAllValue = function (school) {
	switch (school) {
		case 0:
			return A2(
				elm$core$List$map,
				author$project$School$DHumcul,
				_List_fromArray(
					[0, 1, 2]));
		case 1:
			return A2(
				elm$core$List$map,
				author$project$School$DSocint,
				_List_fromArray(
					[0, 1]));
		case 2:
			return A2(
				elm$core$List$map,
				author$project$School$DHuman,
				_List_fromArray(
					[0, 1, 2]));
		case 3:
			return A2(
				elm$core$List$map,
				author$project$School$DLife,
				_List_fromArray(
					[0, 1, 2]));
		case 4:
			return A2(
				elm$core$List$map,
				author$project$School$DSse,
				_List_fromArray(
					[0, 1, 2, 3, 4, 5]));
		case 5:
			return A2(
				elm$core$List$map,
				author$project$School$DInfo,
				_List_fromArray(
					[0, 1, 2]));
		case 6:
			return A2(
				elm$core$List$map,
				author$project$School$DMed,
				_List_fromArray(
					[0, 1, 2]));
		case 7:
			return _List_Nil;
		default:
			return _List_Nil;
	}
};
var author$project$School$SAandd = 7;
var author$project$School$SSport = 8;
var author$project$School$humanDepartmentToIdString = function (department) {
	switch (department) {
		case 0:
			return 'education';
		case 1:
			return 'psyche';
		default:
			return 'disability';
	}
};
var author$project$School$humculDepartmentToIdString = function (department) {
	switch (department) {
		case 0:
			return 'humanity';
		case 1:
			return 'culture';
		default:
			return 'japanese';
	}
};
var author$project$School$infoDepartmentToIdString = function (department) {
	switch (department) {
		case 0:
			return 'coins';
		case 1:
			return 'mast';
		default:
			return 'klis';
	}
};
var author$project$School$lifeDepartmentToIdString = function (department) {
	switch (department) {
		case 0:
			return 'biol';
		case 1:
			return 'bres';
		default:
			return 'earth';
	}
};
var author$project$School$medDepartmentToIdString = function (department) {
	switch (department) {
		case 0:
			return 'med';
		case 1:
			return 'nurse';
		default:
			return 'ms';
	}
};
var author$project$School$schoolToIdString = function (school) {
	switch (school) {
		case 0:
			return 'humcul';
		case 1:
			return 'socint';
		case 2:
			return 'human';
		case 3:
			return 'life';
		case 4:
			return 'sse';
		case 5:
			return 'info';
		case 6:
			return 'med';
		case 7:
			return 'aandd';
		default:
			return 'sport';
	}
};
var author$project$School$socintDepartmentToIdString = function (department) {
	if (!department) {
		return 'social';
	} else {
		return 'cis';
	}
};
var author$project$School$sseDepartmentToIdString = function (department) {
	switch (department) {
		case 0:
			return 'math';
		case 1:
			return 'phys';
		case 2:
			return 'chem';
		case 3:
			return 'coens';
		case 4:
			return 'esys';
		default:
			return 'pandps';
	}
};
var author$project$School$departmentToIdString = function (department) {
	switch (department.$) {
		case 0:
			var d = department.a;
			return author$project$School$humculDepartmentToIdString(d);
		case 1:
			var d = department.a;
			return author$project$School$socintDepartmentToIdString(d);
		case 2:
			var d = department.a;
			return author$project$School$humanDepartmentToIdString(d);
		case 3:
			var d = department.a;
			return author$project$School$lifeDepartmentToIdString(d);
		case 4:
			var d = department.a;
			return author$project$School$sseDepartmentToIdString(d);
		case 5:
			var d = department.a;
			return author$project$School$infoDepartmentToIdString(d);
		case 6:
			var d = department.a;
			return author$project$School$medDepartmentToIdString(d);
		case 7:
			return author$project$School$schoolToIdString(7);
		default:
			return author$project$School$schoolToIdString(8);
	}
};
var author$project$School$departmentFromIdStringLoop = F2(
	function (idString, departmentList) {
		departmentFromIdStringLoop:
		while (true) {
			if (departmentList.b) {
				var x = departmentList.a;
				var xs = departmentList.b;
				if (_Utils_eq(
					author$project$School$departmentToIdString(x),
					idString)) {
					return elm$core$Maybe$Just(x);
				} else {
					var $temp$idString = idString,
						$temp$departmentList = xs;
					idString = $temp$idString;
					departmentList = $temp$departmentList;
					continue departmentFromIdStringLoop;
				}
			} else {
				return elm$core$Maybe$Nothing;
			}
		}
	});
var author$project$School$SHuman = 2;
var author$project$School$SHumcul = 0;
var author$project$School$SInfo = 5;
var author$project$School$SLife = 3;
var author$project$School$SMed = 6;
var author$project$School$SSocint = 1;
var author$project$School$SSse = 4;
var author$project$School$schoolAllValue = _List_fromArray(
	[0, 1, 2, 3, 4, 5, 6, 7, 8]);
var author$project$School$departmentFromIdString = function (idString) {
	return A2(
		author$project$School$departmentFromIdStringLoop,
		idString,
		A2(elm$core$List$concatMap, author$project$School$departmentAllValue, author$project$School$schoolAllValue));
};
var elm$json$Json$Decode$field = _Json_decodeField;
var elm$json$Json$Decode$map2 = _Json_map2;
var author$project$Api$getUserProfileResponeBodyDecoder = A3(
	elm$json$Json$Decode$map2,
	F2(
		function (introduction, departmentIdString) {
			var _n0 = author$project$School$departmentFromIdString(departmentIdString);
			if (!_n0.$) {
				var department = _n0.a;
				return elm$core$Result$Ok(
					{I: department, a5: introduction});
			} else {
				return elm$core$Result$Err(0);
			}
		}),
	A2(elm$json$Json$Decode$field, 'introduction', elm$json$Json$Decode$string),
	A2(elm$json$Json$Decode$field, 'department', elm$json$Json$Decode$string));
var elm$core$Result$withDefault = F2(
	function (def, result) {
		if (!result.$) {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var elm$json$Json$Decode$decodeString = _Json_runOnString;
var author$project$Api$getUserProfileResponseToResult = function (response) {
	switch (response.$) {
		case 3:
			var body = response.b;
			return A2(
				elm$core$Result$withDefault,
				elm$core$Result$Err(0),
				A2(elm$json$Json$Decode$decodeString, author$project$Api$getUserProfileResponeBodyDecoder, body));
		case 4:
			var body = response.b;
			return A2(
				elm$core$Result$withDefault,
				elm$core$Result$Err(0),
				A2(elm$json$Json$Decode$decodeString, author$project$Api$getUserProfileResponeBodyDecoder, body));
		default:
			return elm$core$Result$Err(0);
	}
};
var elm$http$Http$Header = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var elm$http$Http$header = elm$http$Http$Header;
var author$project$Api$tokenToHeader = function (token) {
	return A2(elm$http$Http$header, 'Authorization', 'Bearer ' + token);
};
var author$project$Api$getUserProfile = F2(
	function (token, msg) {
		return elm$http$Http$request(
			{
				H: elm$http$Http$emptyBody,
				x: A2(elm$http$Http$expectStringResponse, msg, author$project$Api$getUserProfileResponseToResult),
				ar: _List_fromArray(
					[
						author$project$Api$tokenToHeader(token)
					]),
				ax: 'GET',
				aS: elm$core$Maybe$Nothing,
				aT: elm$core$Maybe$Nothing,
				D: 'http://api.tsukumart.com/v1/currentuser/profile/'
			});
	});
var author$project$EmailAddress$toString = function (_n0) {
	var string = _n0;
	return elm$core$String$toLower(string);
};
var author$project$Password$passwordCharToString = function (passwordChar) {
	switch (passwordChar) {
		case 0:
			return 'a';
		case 1:
			return 'b';
		case 2:
			return 'c';
		case 3:
			return 'd';
		case 4:
			return 'e';
		case 5:
			return 'f';
		case 6:
			return 'g';
		case 7:
			return 'h';
		case 8:
			return 'i';
		case 9:
			return 'j';
		case 10:
			return 'k';
		case 11:
			return 'l';
		case 12:
			return 'm';
		case 13:
			return 'n';
		case 14:
			return 'o';
		case 15:
			return 'p';
		case 16:
			return 'q';
		case 17:
			return 'r';
		case 18:
			return 's';
		case 19:
			return 't';
		case 20:
			return 'u';
		case 21:
			return 'v';
		case 22:
			return 'w';
		case 23:
			return 'x';
		case 24:
			return 'y';
		case 25:
			return 'z';
		case 26:
			return 'A';
		case 27:
			return 'B';
		case 28:
			return 'C';
		case 29:
			return 'D';
		case 30:
			return 'E';
		case 31:
			return 'F';
		case 32:
			return 'G';
		case 33:
			return 'H';
		case 34:
			return 'I';
		case 35:
			return 'J';
		case 36:
			return 'K';
		case 37:
			return 'L';
		case 38:
			return 'M';
		case 39:
			return 'N';
		case 40:
			return 'O';
		case 41:
			return 'P';
		case 42:
			return 'Q';
		case 43:
			return 'R';
		case 44:
			return 'S';
		case 45:
			return 'T';
		case 46:
			return 'U';
		case 47:
			return 'V';
		case 48:
			return 'W';
		case 49:
			return 'X';
		case 50:
			return 'Y';
		case 51:
			return 'Z';
		case 52:
			return '0';
		case 53:
			return '1';
		case 54:
			return '2';
		case 55:
			return '3';
		case 56:
			return '4';
		case 57:
			return '5';
		case 58:
			return '6';
		case 59:
			return '7';
		case 60:
			return '8';
		case 61:
			return '9';
		case 62:
			return '!';
		case 63:
			return '\"';
		case 64:
			return '#';
		case 65:
			return '$';
		case 66:
			return '%';
		case 67:
			return '&';
		case 68:
			return '\'';
		case 69:
			return '(';
		case 70:
			return ')';
		case 71:
			return '*';
		case 72:
			return '+';
		case 73:
			return ',';
		case 74:
			return '-';
		case 75:
			return '.';
		case 76:
			return '/';
		case 77:
			return ':';
		case 78:
			return ';';
		case 79:
			return '<';
		case 80:
			return '=';
		case 81:
			return '>';
		case 82:
			return '?';
		case 83:
			return '@';
		case 84:
			return '[';
		case 85:
			return '\\';
		case 86:
			return ']';
		case 87:
			return '^';
		case 88:
			return '_';
		case 89:
			return '`';
		case 90:
			return '{';
		case 91:
			return '|';
		case 92:
			return '}';
		default:
			return '~';
	}
};
var author$project$Password$toString = function (_n0) {
	var list = _n0;
	return elm$core$String$fromList(
		A2(elm$core$List$map, author$project$Password$passwordCharToString, list));
};
var elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			elm$core$List$foldl,
			F2(
				function (_n0, obj) {
					var k = _n0.a;
					var v = _n0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var elm$json$Json$Encode$string = _Json_wrap;
var author$project$Api$logInRequestToJson = function (_n0) {
	var emailAddress = _n0.Q;
	var pass = _n0.T;
	return elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'email',
				elm$json$Json$Encode$string(
					author$project$EmailAddress$toString(emailAddress))),
				_Utils_Tuple2(
				'password',
				elm$json$Json$Encode$string(
					author$project$Password$toString(pass)))
			]));
};
var author$project$Api$LogInError = 1;
var author$project$Api$LogInErrorNoConfirmOrMistakePasswordOrEmail = 0;
var author$project$Api$LogInResponseOk = elm$core$Basics$identity;
var elm$json$Json$Decode$map = _Json_map1;
var elm$json$Json$Decode$oneOf = _Json_oneOf;
var author$project$Api$logInResponseBodyDecoder = elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A3(
			elm$json$Json$Decode$map2,
			F2(
				function (access, refresh) {
					return elm$core$Result$Ok(
						{af: access, aa: refresh});
				}),
			A2(elm$json$Json$Decode$field, 'access', elm$json$Json$Decode$string),
			A2(elm$json$Json$Decode$field, 'refresh', elm$json$Json$Decode$string)),
			A2(
			elm$json$Json$Decode$map,
			function (e) {
				return (e === 'No active confirmed account found with the given credentials') ? elm$core$Result$Err(0) : elm$core$Result$Err(1);
			},
			A2(elm$json$Json$Decode$field, 'non_field_errors', elm$json$Json$Decode$string))
		]));
var author$project$Api$logInResponseToResult = function (response) {
	switch (response.$) {
		case 3:
			var body = response.b;
			return A2(
				elm$core$Result$withDefault,
				elm$core$Result$Err(1),
				A2(elm$json$Json$Decode$decodeString, author$project$Api$logInResponseBodyDecoder, body));
		case 4:
			var body = response.b;
			return A2(
				elm$core$Result$withDefault,
				elm$core$Result$Err(1),
				A2(elm$json$Json$Decode$decodeString, author$project$Api$logInResponseBodyDecoder, body));
		default:
			return elm$core$Result$Err(1);
	}
};
var elm$http$Http$jsonBody = function (value) {
	return A2(
		_Http_pair,
		'application/json',
		A2(elm$json$Json$Encode$encode, 0, value));
};
var elm$http$Http$post = function (r) {
	return elm$http$Http$request(
		{H: r.H, x: r.x, ar: _List_Nil, ax: 'POST', aS: elm$core$Maybe$Nothing, aT: elm$core$Maybe$Nothing, D: r.D});
};
var author$project$Api$logIn = F2(
	function (logInData, msg) {
		return elm$http$Http$post(
			{
				H: elm$http$Http$jsonBody(
					author$project$Api$logInRequestToJson(logInData)),
				x: A2(elm$http$Http$expectStringResponse, msg, author$project$Api$logInResponseToResult),
				D: 'http://api.tsukumart.com/auth/token/'
			});
	});
var author$project$Api$logInResponseErrorToString = function (logInResponseError) {
	if (!logInResponseError) {
		return '認証をしていないか、メールアドレスかパスワードが間違っています';
	} else {
		return '予期せぬエラーでログインすることができませんでした';
	}
};
var author$project$Api$universityToSimpleRecord = function (universityData) {
	switch (universityData.$) {
		case 0:
			var schoolAndDepartment = universityData.a;
			return {
				I: elm$core$Maybe$Just(schoolAndDepartment),
				R: elm$core$Maybe$Nothing
			};
		case 1:
			var graduate = universityData.a;
			var schoolAndDepartment = universityData.b;
			return {
				I: elm$core$Maybe$Just(schoolAndDepartment),
				R: elm$core$Maybe$Just(graduate)
			};
		default:
			var graduate = universityData.a;
			return {
				I: elm$core$Maybe$Nothing,
				R: elm$core$Maybe$Just(graduate)
			};
	}
};
var author$project$School$graduateToIdString = function (graduate) {
	switch (graduate) {
		case 0:
			return 'education';
		case 1:
			return 'hass';
		case 2:
			return 'gabs';
		case 3:
			return 'pas';
		case 4:
			return 'sie';
		case 5:
			return 'life';
		case 6:
			return 'chs';
		case 7:
			return 'slis';
		default:
			return 'global';
	}
};
var author$project$Api$signUpJson = function (_n0) {
	var emailAddress = _n0.Q;
	var pass = _n0.T;
	var image = _n0.at;
	var university = _n0.aU;
	var _n1 = author$project$Api$universityToSimpleRecord(university);
	var graduate = _n1.R;
	var department = _n1.I;
	return elm$json$Json$Encode$object(
		_Utils_ap(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'email',
					elm$json$Json$Encode$string(
						author$project$EmailAddress$toString(emailAddress))),
					_Utils_Tuple2(
					'password',
					elm$json$Json$Encode$string(
						author$project$Password$toString(pass)))
				]),
			_Utils_ap(
				function () {
					if (!image.$) {
						var imageDataUrl = image.a;
						return _List_fromArray(
							[
								_Utils_Tuple2(
								'image',
								elm$json$Json$Encode$string(imageDataUrl))
							]);
					} else {
						return _List_Nil;
					}
				}(),
				_Utils_ap(
					function () {
						if (!graduate.$) {
							var g = graduate.a;
							return _List_fromArray(
								[
									_Utils_Tuple2(
									'graduate',
									elm$json$Json$Encode$string(
										author$project$School$graduateToIdString(g)))
								]);
						} else {
							return _List_Nil;
						}
					}(),
					function () {
						if (!department.$) {
							var d = department.a;
							return _List_fromArray(
								[
									_Utils_Tuple2(
									'department',
									elm$json$Json$Encode$string(
										author$project$School$departmentToIdString(d)))
								]);
						} else {
							return _List_Nil;
						}
					}()))));
};
var author$project$Api$SignUpError = 5;
var author$project$Api$SignUpErrorBadUrl = 1;
var author$project$Api$SignUpErrorNetworkError = 3;
var author$project$Api$SignUpErrorTimeout = 2;
var author$project$Api$SignUpErrorAlreadySignUp = 0;
var author$project$Api$SignUpInvalidData = 4;
var author$project$Api$SignUpResponseOk = elm$core$Basics$identity;
var author$project$Api$signUpResponseBodyDecoder = elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A2(
			elm$json$Json$Decode$map,
			function (token) {
				return elm$core$Result$Ok(token);
			},
			A2(elm$json$Json$Decode$field, 'confirm_token', elm$json$Json$Decode$string)),
			A2(
			elm$json$Json$Decode$map,
			function (reason) {
				switch (reason) {
					case 'email exists':
						return elm$core$Result$Err(0);
					case 'invalid data':
						return elm$core$Result$Err(4);
					default:
						return elm$core$Result$Err(5);
				}
			},
			A2(elm$json$Json$Decode$field, 'error', elm$json$Json$Decode$string))
		]));
var author$project$Api$signUpResponseToResult = function (response) {
	switch (response.$) {
		case 0:
			return elm$core$Result$Err(1);
		case 1:
			return elm$core$Result$Err(2);
		case 2:
			return elm$core$Result$Err(3);
		case 3:
			var body = response.b;
			return A2(
				elm$core$Result$withDefault,
				elm$core$Result$Err(5),
				A2(elm$json$Json$Decode$decodeString, author$project$Api$signUpResponseBodyDecoder, body));
		default:
			var body = response.b;
			return A2(
				elm$core$Result$withDefault,
				elm$core$Result$Err(5),
				A2(elm$json$Json$Decode$decodeString, author$project$Api$signUpResponseBodyDecoder, body));
	}
};
var author$project$Api$signUp = F2(
	function (signUpData, msg) {
		return elm$http$Http$post(
			{
				H: elm$http$Http$jsonBody(
					author$project$Api$signUpJson(signUpData)),
				x: A2(elm$http$Http$expectStringResponse, msg, author$project$Api$signUpResponseToResult),
				D: 'http://api.tsukumart.com/auth/signup/'
			});
	});
var author$project$Api$confirmTokenToHeader = function (token) {
	return A2(elm$http$Http$header, 'Authorization', 'Bearer ' + token);
};
var author$project$Api$SignUpConfirmResponseError = 1;
var author$project$Api$SignUpConfirmResponseOk = 0;
var author$project$Api$SignUpConfirmResponseErrorAlreadyConfirmed = 0;
var author$project$Api$signUpConfirmResponseDecoder = elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A2(
			elm$json$Json$Decode$map,
			function (ok) {
				if (ok === 'confirmed') {
					return elm$core$Result$Err(0);
				} else {
					return elm$core$Result$Err(1);
				}
			},
			A2(elm$json$Json$Decode$field, 'ok', elm$json$Json$Decode$string))
		]));
var author$project$Api$signUpConfirmResponseToResult = function (response) {
	switch (response.$) {
		case 0:
			return elm$core$Result$Err(1);
		case 1:
			return elm$core$Result$Err(1);
		case 2:
			return elm$core$Result$Err(1);
		case 3:
			var body = response.b;
			return A2(
				elm$core$Result$withDefault,
				elm$core$Result$Err(1),
				A2(elm$json$Json$Decode$decodeString, author$project$Api$signUpConfirmResponseDecoder, body));
		default:
			return elm$core$Result$Ok(0);
	}
};
var author$project$Api$signUpConfirm = F2(
	function (_n0, msg) {
		var confirmToken = _n0.al;
		return elm$http$Http$request(
			{
				H: elm$http$Http$emptyBody,
				x: A2(elm$http$Http$expectStringResponse, msg, author$project$Api$signUpConfirmResponseToResult),
				ar: _List_fromArray(
					[
						author$project$Api$confirmTokenToHeader(confirmToken)
					]),
				ax: 'POST',
				aS: elm$core$Maybe$Nothing,
				aT: elm$core$Maybe$Nothing,
				D: 'http://api.tsukumart.com/auth/signup/confirm/'
			});
	});
var author$project$Main$DeleteAllUserResponse = function (a) {
	return {$: 20, a: a};
};
var author$project$Main$GetUserProfileResponse = function (a) {
	return {$: 21, a: a};
};
var author$project$Main$LogInResponse = function (a) {
	return {$: 11, a: a};
};
var author$project$Main$LogInStateOk = function (a) {
	return {$: 0, a: a};
};
var author$project$Main$MenuClose = 1;
var author$project$Main$MenuOpen = 2;
var author$project$Main$SignUpConfirmResponse = function (a) {
	return {$: 10, a: a};
};
var author$project$Main$SignUpResponse = function (a) {
	return {$: 9, a: a};
};
var author$project$Main$exhibitionImageChange = _Platform_outgoingPort('exhibitionImageChange', elm$json$Json$Encode$string);
var author$project$Main$studentImageChange = _Platform_outgoingPort('studentImageChange', elm$json$Json$Encode$string);
var author$project$Page$LogIn$InputPassword = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$LogIn$InputStudentIdOrEmailAddress = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$LogIn$ForgotPassword = {$: 1};
var elm$core$Result$toMaybe = function (result) {
	if (!result.$) {
		var v = result.a;
		return elm$core$Maybe$Just(v);
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var author$project$Page$LogIn$update = F2(
	function (msg, model) {
		if (!msg.$) {
			var string = msg.a;
			if (!model.$) {
				var r = model.a;
				return author$project$Page$LogIn$LogInPage(
					_Utils_update(
						r,
						{
							Z: elm$core$Result$toMaybe(
								author$project$Password$passwordFromString(string))
						}));
			} else {
				return author$project$Page$LogIn$ForgotPassword;
			}
		} else {
			var string = msg.a;
			if (!model.$) {
				var r = model.a;
				return author$project$Page$LogIn$LogInPage(
					_Utils_update(
						r,
						{
							ae: author$project$Page$LogIn$analysisStudentIdOrEmailAddress(string)
						}));
			} else {
				return author$project$Page$LogIn$ForgotPassword;
			}
		}
	});
var author$project$Page$SignUp$DeleteUserAll = function (a) {
	return {$: 3, a: a};
};
var author$project$Page$SignUp$InputPassword = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$SignUp$InputStudentIdOrEmailAddress = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$SignUp$ReceiveImageDataUrl = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$SignUp$SignUpResponse = function (a) {
	return {$: 4, a: a};
};
var author$project$Page$SignUp$SentConfirmTokenError = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$SignUp$sentConfirmTokenInitModel = author$project$Page$SignUp$SentConfirmTokenError(elm$core$Maybe$Nothing);
var author$project$Page$SignUp$sentConfirmTokenModel = function (signUpResponseError) {
	return author$project$Page$SignUp$SentConfirmTokenError(
		elm$core$Maybe$Just(signUpResponseError));
};
var author$project$Page$SignUp$SentSingUpData = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var author$project$Page$SignUp$sentSignUpDataInitModel = function (emailAddress) {
	return A2(author$project$Page$SignUp$SentSingUpData, emailAddress, elm$core$Maybe$Nothing);
};
var author$project$Page$SignUp$DeletedAllUser = function (a) {
	return {$: 3, a: a};
};
var author$project$Page$SignUp$NewStudent = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$SignUp$analysisEmailAddress = function (string) {
	return author$project$EmailAddress$fromCharList(
		elm$core$String$toList(
			elm$core$String$trim(string)));
};
var author$project$Page$SignUp$update = F2(
	function (msg, model) {
		switch (model.$) {
			case 0:
				var sAddressAndPassword = model.a.k;
				var university = model.a.aU;
				switch (msg.$) {
					case 0:
						var string = msg.a;
						if (!sAddressAndPassword.$) {
							var r = sAddressAndPassword.a;
							return author$project$Page$SignUp$Normal(
								{
									k: author$project$Page$SignUp$StudentHasSAddress(
										_Utils_update(
											r,
											{
												L: author$project$Page$SignUp$analysisStudentIdOrSAddress(string)
											})),
									aU: university
								});
						} else {
							var r = sAddressAndPassword.a;
							return author$project$Page$SignUp$Normal(
								{
									k: author$project$Page$SignUp$NewStudent(
										_Utils_update(
											r,
											{
												Q: author$project$Page$SignUp$analysisEmailAddress(string)
											})),
									aU: university
								});
						}
					case 1:
						var dataUrlString = msg.a;
						if (sAddressAndPassword.$ === 1) {
							var r = sAddressAndPassword.a;
							return author$project$Page$SignUp$Normal(
								{
									k: author$project$Page$SignUp$NewStudent(
										_Utils_update(
											r,
											{
												S: elm$core$Maybe$Just(dataUrlString)
											})),
									aU: university
								});
						} else {
							return author$project$Page$SignUp$Normal(
								{k: sAddressAndPassword, aU: university});
						}
					case 2:
						var string = msg.a;
						return author$project$Page$SignUp$Normal(
							{
								k: function () {
									if (sAddressAndPassword.$ === 1) {
										var r = sAddressAndPassword.a;
										return author$project$Page$SignUp$NewStudent(
											_Utils_update(
												r,
												{
													Z: author$project$Password$passwordFromString(string)
												}));
									} else {
										var r = sAddressAndPassword.a;
										return author$project$Page$SignUp$StudentHasSAddress(
											_Utils_update(
												r,
												{
													Z: author$project$Password$passwordFromString(string)
												}));
									}
								}(),
								aU: university
							});
					case 3:
						var response = msg.a;
						return author$project$Page$SignUp$DeletedAllUser(
							function () {
								if (!response.$) {
									return true;
								} else {
									return false;
								}
							}());
					default:
						return model;
				}
			case 3:
				return model;
			case 1:
				var emailAddress = model.a;
				if (msg.$ === 4) {
					var response = msg.a;
					return A2(
						author$project$Page$SignUp$SentSingUpData,
						emailAddress,
						elm$core$Maybe$Just(response));
				} else {
					return model;
				}
			default:
				var maybe = model.a;
				return model;
		}
	});
var elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var elm$browser$Browser$Dom$NotFound = elm$core$Basics$identity;
var elm$core$Basics$never = function (_n0) {
	never:
	while (true) {
		var nvr = _n0;
		var $temp$_n0 = nvr;
		_n0 = $temp$_n0;
		continue never;
	}
};
var elm$core$Task$Perform = elm$core$Basics$identity;
var elm$core$Task$init = elm$core$Task$succeed(0);
var elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			elm$core$Task$andThen,
			function (a) {
				return elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var elm$core$Task$spawnCmd = F2(
	function (router, _n0) {
		var task = _n0;
		return _Scheduler_spawn(
			A2(
				elm$core$Task$andThen,
				elm$core$Platform$sendToApp(router),
				task));
	});
var elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			elm$core$Task$map,
			function (_n0) {
				return 0;
			},
			elm$core$Task$sequence(
				A2(
					elm$core$List$map,
					elm$core$Task$spawnCmd(router),
					commands)));
	});
var elm$core$Task$onSelfMsg = F3(
	function (_n0, _n1, _n2) {
		return elm$core$Task$succeed(0);
	});
var elm$core$Task$cmdMap = F2(
	function (tagger, _n0) {
		var task = _n0;
		return A2(elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager(elm$core$Task$init, elm$core$Task$onEffects, elm$core$Task$onSelfMsg, elm$core$Task$cmdMap);
var elm$core$Task$command = _Platform_leaf('Task');
var elm$core$Task$perform = F2(
	function (toMessage, task) {
		return elm$core$Task$command(
			A2(elm$core$Task$map, toMessage, task));
	});
var elm$json$Json$Decode$succeed = _Json_succeed;
var elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			elm$core$String$slice,
			n,
			elm$core$String$length(string),
			string);
	});
var elm$core$String$startsWith = _String_startsWith;
var elm$url$Url$Http = 0;
var elm$url$Url$Https = 1;
var elm$core$String$indexes = _String_indexes;
var elm$core$String$isEmpty = function (string) {
	return string === '';
};
var elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(elm$core$String$slice, 0, n, string);
	});
var elm$core$String$contains = _String_contains;
var elm$core$String$toInt = _String_toInt;
var elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {aq: fragment, as: host, aC: path, aE: port_, aI: protocol, aJ: query};
	});
var elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if (elm$core$String$isEmpty(str) || A2(elm$core$String$contains, '@', str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, ':', str);
			if (!_n0.b) {
				return elm$core$Maybe$Just(
					A6(elm$url$Url$Url, protocol, str, elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_n0.b.b) {
					var i = _n0.a;
					var _n1 = elm$core$String$toInt(
						A2(elm$core$String$dropLeft, i + 1, str));
					if (_n1.$ === 1) {
						return elm$core$Maybe$Nothing;
					} else {
						var port_ = _n1;
						return elm$core$Maybe$Just(
							A6(
								elm$url$Url$Url,
								protocol,
								A2(elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return elm$core$Maybe$Nothing;
				}
			}
		}
	});
var elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '/', str);
			if (!_n0.b) {
				return A5(elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _n0.a;
				return A5(
					elm$url$Url$chompBeforePath,
					protocol,
					A2(elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '?', str);
			if (!_n0.b) {
				return A4(elm$url$Url$chompBeforeQuery, protocol, elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _n0.a;
				return A4(
					elm$url$Url$chompBeforeQuery,
					protocol,
					elm$core$Maybe$Just(
						A2(elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if (elm$core$String$isEmpty(str)) {
			return elm$core$Maybe$Nothing;
		} else {
			var _n0 = A2(elm$core$String$indexes, '#', str);
			if (!_n0.b) {
				return A3(elm$url$Url$chompBeforeFragment, protocol, elm$core$Maybe$Nothing, str);
			} else {
				var i = _n0.a;
				return A3(
					elm$url$Url$chompBeforeFragment,
					protocol,
					elm$core$Maybe$Just(
						A2(elm$core$String$dropLeft, i + 1, str)),
					A2(elm$core$String$left, i, str));
			}
		}
	});
var elm$url$Url$fromString = function (str) {
	return A2(elm$core$String$startsWith, 'http://', str) ? A2(
		elm$url$Url$chompAfterProtocol,
		0,
		A2(elm$core$String$dropLeft, 7, str)) : (A2(elm$core$String$startsWith, 'https://', str) ? A2(
		elm$url$Url$chompAfterProtocol,
		1,
		A2(elm$core$String$dropLeft, 8, str)) : elm$core$Maybe$Nothing);
};
var elm$browser$Browser$Navigation$load = _Browser_load;
var elm$browser$Browser$Navigation$pushUrl = _Browser_pushUrl;
var elm$url$Url$addPort = F2(
	function (maybePort, starter) {
		if (maybePort.$ === 1) {
			return starter;
		} else {
			var port_ = maybePort.a;
			return starter + (':' + elm$core$String$fromInt(port_));
		}
	});
var elm$url$Url$addPrefixed = F3(
	function (prefix, maybeSegment, starter) {
		if (maybeSegment.$ === 1) {
			return starter;
		} else {
			var segment = maybeSegment.a;
			return _Utils_ap(
				starter,
				_Utils_ap(prefix, segment));
		}
	});
var elm$url$Url$toString = function (url) {
	var http = function () {
		var _n0 = url.aI;
		if (!_n0) {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		elm$url$Url$addPrefixed,
		'#',
		url.aq,
		A3(
			elm$url$Url$addPrefixed,
			'?',
			url.aJ,
			_Utils_ap(
				A2(
					elm$url$Url$addPort,
					url.aE,
					_Utils_ap(http, url.as)),
				url.aC)));
};
var author$project$Main$update = F2(
	function (msg, _n0) {
		var rec = _n0;
		switch (msg.$) {
			case 0:
				var page = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{a: page}),
					elm$core$Platform$Cmd$none);
			case 1:
				return _Utils_Tuple2(
					function () {
						var _n2 = rec.i;
						if (!_n2.$) {
							return _Utils_update(
								rec,
								{
									i: elm$core$Maybe$Just(2)
								});
						} else {
							return rec;
						}
					}(),
					elm$core$Platform$Cmd$none);
			case 2:
				return _Utils_Tuple2(
					function () {
						var _n3 = rec.i;
						if (!_n3.$) {
							return _Utils_update(
								rec,
								{
									i: elm$core$Maybe$Just(1)
								});
						} else {
							return rec;
						}
					}(),
					elm$core$Platform$Cmd$none);
			case 3:
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{i: elm$core$Maybe$Nothing}),
					elm$core$Platform$Cmd$none);
			case 4:
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{
							i: elm$core$Maybe$Just(0)
						}),
					elm$core$Platform$Cmd$none);
			case 5:
				var url = msg.a;
				var _n4 = A2(
					author$project$Main$urlToPage,
					url,
					elm$core$Maybe$Just(rec.a));
				var newPage = _n4.a;
				var messageMaybe = _n4.b;
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{
							i: function () {
								var _n5 = rec.i;
								if ((!_n5.$) && (_n5.a === 2)) {
									var _n6 = _n5.a;
									return elm$core$Maybe$Just(1);
								} else {
									return rec.i;
								}
							}(),
							r: messageMaybe,
							a: newPage
						}),
					elm$core$Platform$Cmd$none);
			case 6:
				var urlRequest = msg.a;
				if (!urlRequest.$) {
					var url = urlRequest.a;
					return _Utils_Tuple2(
						A2(
							author$project$Main$update,
							author$project$Main$UrlChange(url),
							rec).a,
						A2(
							elm$browser$Browser$Navigation$pushUrl,
							rec.au,
							elm$url$Url$toString(url)));
				} else {
					var string = urlRequest.a;
					return _Utils_Tuple2(
						rec,
						elm$browser$Browser$Navigation$load(string));
				}
			case 7:
				var signUpData = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{
							a: author$project$Main$PageSignUp(
								author$project$Page$SignUp$sentSignUpDataInitModel(signUpData.Q))
						}),
					A2(author$project$Api$signUp, signUpData, author$project$Main$SignUpResponse));
			case 8:
				var logInData = msg.a;
				return _Utils_Tuple2(
					rec,
					A2(author$project$Api$logIn, logInData, author$project$Main$LogInResponse));
			case 9:
				var response = msg.a;
				return _Utils_Tuple2(
					function () {
						var _n8 = rec.a;
						if (_n8.$ === 1) {
							var singUpPageModel = _n8.a;
							return _Utils_update(
								rec,
								{
									a: author$project$Main$PageSignUp(
										A2(
											author$project$Page$SignUp$update,
											author$project$Page$SignUp$SignUpResponse(response),
											singUpPageModel))
								});
						} else {
							return rec;
						}
					}(),
					elm$core$Platform$Cmd$none);
			case 11:
				var logInResponse = msg.a;
				if (!logInResponse.$) {
					var access = logInResponse.a.af;
					var refresh = logInResponse.a.aa;
					return _Utils_Tuple2(
						function () {
							var pageMaybe = function () {
								var _n11 = rec.a;
								if (_n11.$ === 2) {
									if (!_n11.a.b.$) {
										var _n12 = _n11.a;
										var p = _n12.b.a;
										return elm$core$Maybe$Just(p);
									} else {
										var _n13 = _n11.a;
										var _n14 = _n13.b;
										return elm$core$Maybe$Just(
											author$project$Main$PageHome(1));
									}
								} else {
									return elm$core$Maybe$Nothing;
								}
							}();
							if (!pageMaybe.$) {
								var newPage = pageMaybe.a;
								return _Utils_update(
									rec,
									{
										z: author$project$Main$LogInStateOk(
											{af: access, U: elm$core$Maybe$Nothing, aa: refresh}),
										r: elm$core$Maybe$Just('ログインしました'),
										a: newPage
									});
							} else {
								return _Utils_update(
									rec,
									{
										z: author$project$Main$LogInStateOk(
											{af: access, U: elm$core$Maybe$Nothing, aa: refresh}),
										r: elm$core$Maybe$Just('ログインしました')
									});
							}
						}(),
						A2(author$project$Api$getUserProfile, access, author$project$Main$GetUserProfileResponse));
				} else {
					var logInResponseError = logInResponse.a;
					return _Utils_Tuple2(
						_Utils_update(
							rec,
							{
								r: elm$core$Maybe$Just(
									author$project$Api$logInResponseErrorToString(logInResponseError))
							}),
						elm$core$Platform$Cmd$none);
				}
			case 10:
				var response = msg.a;
				return _Utils_Tuple2(
					function () {
						if (!response.$) {
							return _Utils_update(
								rec,
								{
									r: elm$core$Maybe$Just('新規登録できました'),
									a: author$project$Main$PageHome(1)
								});
						} else {
							var e = response.a;
							return _Utils_update(
								rec,
								{
									a: author$project$Main$PageSignUp(
										author$project$Page$SignUp$sentConfirmTokenModel(e))
								});
						}
					}(),
					elm$core$Platform$Cmd$none);
			case 12:
				var string = msg.a;
				return _Utils_Tuple2(
					function () {
						var _n16 = rec.a;
						switch (_n16.$) {
							case 1:
								var signUpModel = _n16.a;
								return _Utils_update(
									rec,
									{
										a: author$project$Main$PageSignUp(
											A2(
												author$project$Page$SignUp$update,
												author$project$Page$SignUp$InputStudentIdOrEmailAddress(string),
												signUpModel))
									});
							case 2:
								var _n17 = _n16.a;
								var logInModel = _n17.a;
								var pageMaybe = _n17.b;
								return _Utils_update(
									rec,
									{
										a: author$project$Main$PageLogIn(
											_Utils_Tuple2(
												A2(
													author$project$Page$LogIn$update,
													author$project$Page$LogIn$InputStudentIdOrEmailAddress(string),
													logInModel),
												pageMaybe))
									});
							default:
								return rec;
						}
					}(),
					elm$core$Platform$Cmd$none);
			case 13:
				var idString = msg.a;
				return _Utils_Tuple2(
					rec,
					author$project$Main$studentImageChange(idString));
			case 14:
				var idString = msg.a;
				return _Utils_Tuple2(
					rec,
					author$project$Main$exhibitionImageChange(idString));
			case 15:
				var urlString = msg.a;
				return _Utils_Tuple2(
					function () {
						var _n18 = rec.a;
						switch (_n18.$) {
							case 1:
								var signUpModel = _n18.a;
								return _Utils_update(
									rec,
									{
										a: author$project$Main$PageSignUp(
											A2(
												author$project$Page$SignUp$update,
												author$project$Page$SignUp$ReceiveImageDataUrl(urlString),
												signUpModel))
									});
							case 6:
								var r = _n18.a;
								return _Utils_update(
									rec,
									{
										a: author$project$Main$PageExhibition(
											_Utils_update(
												r,
												{
													at: _List_fromArray(
														[urlString])
												}))
									});
							default:
								return rec;
						}
					}(),
					elm$core$Platform$Cmd$none);
			case 16:
				var urlStringList = msg.a;
				return _Utils_Tuple2(
					function () {
						var _n19 = rec.a;
						if (_n19.$ === 6) {
							var r = _n19.a;
							return _Utils_update(
								rec,
								{
									a: author$project$Main$PageExhibition(
										_Utils_update(
											r,
											{at: urlStringList}))
								});
						} else {
							return rec;
						}
					}(),
					elm$core$Platform$Cmd$none);
			case 17:
				var string = msg.a;
				return _Utils_Tuple2(
					function () {
						var _n20 = rec.a;
						switch (_n20.$) {
							case 1:
								var signUpModel = _n20.a;
								return _Utils_update(
									rec,
									{
										a: author$project$Main$PageSignUp(
											A2(
												author$project$Page$SignUp$update,
												author$project$Page$SignUp$InputPassword(string),
												signUpModel))
									});
							case 2:
								var _n21 = _n20.a;
								var logInModel = _n21.a;
								var pageMaybe = _n21.b;
								return _Utils_update(
									rec,
									{
										a: author$project$Main$PageLogIn(
											_Utils_Tuple2(
												A2(
													author$project$Page$LogIn$update,
													author$project$Page$LogIn$InputPassword(string),
													logInModel),
												pageMaybe))
									});
							default:
								return rec;
						}
					}(),
					elm$core$Platform$Cmd$none);
			case 18:
				var token = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{
							a: author$project$Main$PageSignUp(author$project$Page$SignUp$sentConfirmTokenInitModel)
						}),
					A2(
						author$project$Api$signUpConfirm,
						{al: token},
						author$project$Main$SignUpConfirmResponse));
			case 19:
				return _Utils_Tuple2(
					rec,
					author$project$Api$debugDeleteAllUser(author$project$Main$DeleteAllUserResponse));
			case 20:
				var response = msg.a;
				var _n22 = rec.a;
				if (_n22.$ === 1) {
					var signUpModel = _n22.a;
					return _Utils_Tuple2(
						_Utils_update(
							rec,
							{
								a: author$project$Main$PageSignUp(
									A2(
										author$project$Page$SignUp$update,
										author$project$Page$SignUp$DeleteUserAll(response),
										signUpModel))
							}),
						elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(rec, elm$core$Platform$Cmd$none);
				}
			default:
				var response = msg.a;
				var _n23 = _Utils_Tuple2(response, rec.z);
				if ((!_n23.a.$) && (!_n23.b.$)) {
					var profile = _n23.a.a;
					var r = _n23.b.a;
					return _Utils_Tuple2(
						_Utils_update(
							rec,
							{
								z: author$project$Main$LogInStateOk(
									_Utils_update(
										r,
										{
											U: elm$core$Maybe$Just(profile)
										}))
							}),
						elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(rec, elm$core$Platform$Cmd$none);
				}
		}
	});
var elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var author$project$Main$logoSubTextFontColor = elm$svg$Svg$Attributes$fill('#ffe2a6');
var elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var elm$svg$Svg$path = elm$svg$Svg$trustedNode('path');
var elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var author$project$Main$logoSubText = _List_fromArray(
	[
		A2(
		elm$svg$Svg$path,
		_List_fromArray(
			[
				elm$svg$Svg$Attributes$d('M45.47,34.08a9.23,9.23,0,0,1,.8,1.56.62.62,0,0,1,0,.18.5.5,0,0,1-.42.46l-.24,0a.49.49,0,0,1-.51-.34,9.9,9.9,0,0,0-.89-1.89h-.88A13.18,13.18,0,0,1,42,35.85a.76.76,0,0,1-.54.28.65.65,0,0,1-.41-.16.61.61,0,0,1-.21-.44.53.53,0,0,1,.18-.41,9.3,9.3,0,0,0,2.16-3.36.52.52,0,0,1,.51-.34l.26,0c.29.1.42.24.42.46a.65.65,0,0,1-.07.29c-.11.27-.22.55-.35.83h3.73c.28,0,.47.18.47.53a.46.46,0,0,1-.47.52Zm-3.77,4.1c-.29,0-.45-.25-.45-.57s.16-.55.45-.55h4.88c.29,0,.45.22.45.55s-.16.57-.45.57H44.69v4.43c.56-.19,1.09-.39,1.55-.58a.57.57,0,0,1,.27-.07.45.45,0,0,1,.43.3.67.67,0,0,1,0,.24.65.65,0,0,1-.43.62,34.44,34.44,0,0,1-4.91,1.61h-.18a.54.54,0,0,1-.55-.48,1,1,0,0,1,0-.22.48.48,0,0,1,.43-.52A20.06,20.06,0,0,0,43.47,43V38.18Zm11.85,6.29c0,.32.13.39.5.39s.57-.12.67-.43a5.5,5.5,0,0,0,.18-1.51c0-.34.23-.48.54-.48h0A.48.48,0,0,1,56,43a7.18,7.18,0,0,1-.29,2c-.23.68-.6,1-1.75,1-1.32,0-1.6-.27-1.6-1.18V37.89c0-.33-.14-.43-.48-.43H49.42c-.32,0-.48.1-.48.43,0,4.72-.67,6.64-2.51,8.28a.88.88,0,0,1-.55.23.61.61,0,0,1-.44-.19.68.68,0,0,1-.21-.48.52.52,0,0,1,.23-.42c1.87-1.56,2.29-3.18,2.29-7.62,0-.93.42-1.3,1.35-1.3h3.1c.94,0,1.35.37,1.35,1.3ZM49.78,34.1a8.8,8.8,0,0,1-1.09,1.59.67.67,0,0,1-.5.28.64.64,0,0,1-.39-.15.5.5,0,0,1-.21-.4.71.71,0,0,1,.17-.43,8.45,8.45,0,0,0,1.73-3.18.5.5,0,0,1,.52-.39l.24,0a.52.52,0,0,1,.37.73,7.71,7.71,0,0,1-.32.86h4.89c.29,0,.47.17.47.52s-.18.54-.47.54H52.4a7.5,7.5,0,0,1,.68,1.36.61.61,0,0,1,0,.17.47.47,0,0,1-.42.45.82.82,0,0,1-.21,0,.59.59,0,0,1-.56-.37,8.78,8.78,0,0,0-.76-1.64ZM50,38.94a.67.67,0,0,1,.52.33,14.25,14.25,0,0,1,1.33,2.65.77.77,0,0,1,.07.32.59.59,0,0,1-.36.54.67.67,0,0,1-.28.08.55.55,0,0,1-.49-.42,15.31,15.31,0,0,0-1.28-2.64.54.54,0,0,1-.11-.32.5.5,0,0,1,.31-.46A.6.6,0,0,1,50,38.94Z'),
				elm$svg$Svg$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$Main$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		elm$svg$Svg$path,
		_List_fromArray(
			[
				elm$svg$Svg$Attributes$d('M60.47,41.18a.7.7,0,0,1,0,.25A24.41,24.41,0,0,1,58.16,46a.63.63,0,0,1-.52.27.72.72,0,0,1-.42-.13.55.55,0,0,1-.29-.5.65.65,0,0,1,.11-.36A20,20,0,0,0,59.23,41a.56.56,0,0,1,.54-.39.71.71,0,0,1,.7.61ZM60.32,38a.59.59,0,0,1-.14.37.63.63,0,0,1-.49.24.69.69,0,0,1-.46-.18,16.21,16.21,0,0,0-2-1.59.52.52,0,0,1-.23-.44.73.73,0,0,1,.13-.39.69.69,0,0,1,.5-.26.64.64,0,0,1,.33.1,14,14,0,0,1,2.16,1.64A.74.74,0,0,1,60.32,38ZM61,34a.57.57,0,0,1-.16.41.64.64,0,0,1-.47.23.71.71,0,0,1-.52-.25A13.88,13.88,0,0,0,58,32.83a.51.51,0,0,1-.23-.42A.69.69,0,0,1,57.9,32a.76.76,0,0,1,.52-.25.67.67,0,0,1,.36.12,12.26,12.26,0,0,1,2,1.69A.64.64,0,0,1,61,34Zm2.1,4.73c-.2,3.48-.81,5.59-1.82,7.23a.66.66,0,0,1-.54.35.78.78,0,0,1-.36-.1.54.54,0,0,1-.3-.49.67.67,0,0,1,.13-.39c1.26-2,1.7-4.22,1.7-9.07V34.91a1.29,1.29,0,0,1,1.46-1.46H66V31.86c0-.31.22-.47.6-.47s.6.16.6.47v1.59h3.46c.78,0,1.2.39,1.2,1a1.55,1.55,0,0,1-.1.54,6.33,6.33,0,0,1-1,1.76.71.71,0,0,1-.56.3.6.6,0,0,1-.35-.11.53.53,0,0,1-.25-.42.63.63,0,0,1,.13-.36,6.22,6.22,0,0,0,.78-1.22.27.27,0,0,0,0-.16c0-.11-.09-.16-.31-.16h-3v3.07h2.52a1,1,0,0,1,1.1,1,1.82,1.82,0,0,1-.14.66,12,12,0,0,1-2.62,3.77,12.69,12.69,0,0,0,3.59,2,.61.61,0,0,1,.41.57.86.86,0,0,1,0,.27.66.66,0,0,1-.59.41.68.68,0,0,1-.29-.07,13.35,13.35,0,0,1-4-2.35,14.08,14.08,0,0,1-4,2.39.69.69,0,0,1-.31.06.6.6,0,0,1-.54-.37.7.7,0,0,1-.05-.25.61.61,0,0,1,.44-.56,14,14,0,0,0,3.64-2.07,13.4,13.4,0,0,1-2.63-4.34Zm3-1.1V34.59H63.72c-.44,0-.6.13-.6.63v1.22c0,.42,0,.83,0,1.22Zm-1.11,1.1a10.4,10.4,0,0,0,2.31,3.59,8.91,8.91,0,0,0,2.23-3.15.74.74,0,0,0,0-.23c0-.14-.08-.21-.26-.21Z'),
				elm$svg$Svg$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$Main$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		elm$svg$Svg$path,
		_List_fromArray(
			[
				elm$svg$Svg$Attributes$d('M81.31,36.59a12.32,12.32,0,0,0,2.54,5,12.09,12.09,0,0,0,4.09,3.17.58.58,0,0,1,.38.55.87.87,0,0,1-.13.44.67.67,0,0,1-.59.34.85.85,0,0,1-.4-.1,13.17,13.17,0,0,1-4.33-3.55,12.81,12.81,0,0,1-2.14-4.16,11.82,11.82,0,0,1-1.16,3,11.28,11.28,0,0,1-5.23,4.8,1.07,1.07,0,0,1-.32.08.66.66,0,0,1-.6-.41.68.68,0,0,1-.1-.36.59.59,0,0,1,.36-.53,9.6,9.6,0,0,0,4.82-4.28,10.87,10.87,0,0,0,1.25-4H74c-.32,0-.5-.3-.5-.65s.18-.62.5-.62h5.88c.07-.91.1-2,.1-3.15,0-.39.28-.56.67-.56s.65.2.65.56c0,1.13,0,2.17-.12,3.15h6.44c.32,0,.5.27.5.62s-.18.65-.5.65Z'),
				elm$svg$Svg$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$Main$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		elm$svg$Svg$path,
		_List_fromArray(
			[
				elm$svg$Svg$Attributes$d('M103.91,44.68c.3,0,.47.24.47.6s-.17.58-.47.58H90.13c-.29,0-.45-.24-.45-.58s.16-.6.45-.6h6.39V40.57H92.21c-.29,0-.48-.25-.48-.59s.19-.58.48-.58h4.31V36h-3.8a15.92,15.92,0,0,1-1.89,3,.64.64,0,0,1-.47.24.67.67,0,0,1-.47-.19.57.57,0,0,1-.23-.44.81.81,0,0,1,.18-.46,15,15,0,0,0,2.84-5.63.53.53,0,0,1,.54-.41l.23,0a.59.59,0,0,1,.5.54.3.3,0,0,1,0,.16,16.39,16.39,0,0,1-.7,1.95h3.3V32c0-.31.28-.5.65-.5s.67.19.67.5v2.86h5.47c.29,0,.46.23.46.59s-.17.58-.46.58H97.84v3.4h4.61c.29,0,.47.24.47.58s-.18.59-.47.59H97.84v4.11Z'),
				elm$svg$Svg$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$Main$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		elm$svg$Svg$path,
		_List_fromArray(
			[
				elm$svg$Svg$Attributes$d('M109,40.57c-.92,0-1.36-.38-1.36-1.27v-3c0-.89.44-1.27,1.36-1.27h3.82V33.94h-6.11c-.27,0-.45-.2-.45-.54s.18-.52.45-.52h6.11v-1c0-.28.25-.46.6-.46s.59.18.59.46v1h6.43c.28,0,.46.18.46.52s-.18.54-.46.54h-6.43V35h4.14c.91,0,1.35.38,1.35,1.29v3c0,.89-.44,1.27-1.35,1.27h-.61v1h2.92c.28,0,.44.21.44.52s-.16.56-.44.56h-2.92v2.45c0,.94-.54,1.35-1.78,1.35a9,9,0,0,1-1.56-.15.49.49,0,0,1-.47-.53.56.56,0,0,1,0-.17.48.48,0,0,1,.5-.45h.18a5.69,5.69,0,0,0,1.19.13c.58,0,.71-.09.71-.52V42.7h-9.65c-.28,0-.44-.23-.44-.56s.16-.52.44-.52h9.65v-1Zm.41-4.62c-.37,0-.57.13-.57.51v.79h4V36Zm-.57,2.21v.94c0,.39.2.51.57.51h3.41V38.16Zm3.58,6.6a.59.59,0,0,1,.14.37.54.54,0,0,1-.21.43.7.7,0,0,1-.45.17.58.58,0,0,1-.43-.17,13.28,13.28,0,0,0-1.72-1.6.4.4,0,0,1-.19-.34.54.54,0,0,1,.19-.39.72.72,0,0,1,.46-.18.74.74,0,0,1,.42.15A15.33,15.33,0,0,1,112.46,44.76Zm5.88-7.51v-.79c0-.38-.2-.51-.57-.51h-3.72v1.3Zm-.57,2.36c.37,0,.57-.12.57-.51v-.94h-4.29v1.45Z'),
				elm$svg$Svg$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$Main$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		elm$svg$Svg$path,
		_List_fromArray(
			[
				elm$svg$Svg$Attributes$d('M124.87,41.1A11.46,11.46,0,0,1,123.5,46a.61.61,0,0,1-.55.34.76.76,0,0,1-.36-.1.65.65,0,0,1-.37-.56.56.56,0,0,1,.1-.33c1.2-1.79,1.41-4.32,1.44-8.37,0-1,0-2.16,0-3.52,0-1,.48-1.4,1.45-1.4H135c1,0,1.45.4,1.45,1.4V44.76c0,1-.62,1.53-1.94,1.53a11.21,11.21,0,0,1-2-.17.51.51,0,0,1-.47-.53.46.46,0,0,1,0-.2.5.5,0,0,1,.49-.45h.16a8.09,8.09,0,0,0,1.61.18c.75,0,.89-.13.89-.66V41.1h-4.74v4.44c0,.29-.26.45-.64.45s-.6-.16-.6-.45V41.1Zm.16-4a1.1,1.1,0,0,0,0,.25c0,.91,0,1.77-.06,2.57h4.27V37.15ZM129.22,36V33.25h-3.64c-.36,0-.52.1-.52.49,0,.85,0,1.59,0,2.29Zm6-2.29c0-.39-.14-.49-.5-.49h-4.24V36h4.74Zm0,3.41h-4.74V40h4.74Z'),
				elm$svg$Svg$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$Main$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		elm$svg$Svg$path,
		_List_fromArray(
			[
				elm$svg$Svg$Attributes$d('M146.93,34c-1.66.18-3.36.31-5.05.36h0a.55.55,0,0,1-.6-.59.53.53,0,0,1,.53-.6,39.31,39.31,0,0,0,10.35-1.43.8.8,0,0,1,.31-.07.54.54,0,0,1,.54.41,1,1,0,0,1,0,.28.58.58,0,0,1-.47.57,36.9,36.9,0,0,1-4.34.89v2.62h5.26c.28,0,.46.24.46.58a.51.51,0,0,1-.46.57H148.2v2.44h6a.52.52,0,0,1,.47.58c0,.33-.19.6-.47.6h-6v3.38c0,1.21-.52,1.66-2.18,1.66a9.73,9.73,0,0,1-2-.19.57.57,0,0,1-.46-.61.36.36,0,0,1,0-.14.5.5,0,0,1,.52-.49.44.44,0,0,1,.16,0,10.05,10.05,0,0,0,1.68.18c.84,0,1-.12,1-.67V41.23h-6.34a.52.52,0,0,1-.47-.58c0-.34.18-.6.47-.6h6.34V37.61h-5.57c-.3,0-.46-.24-.46-.57s.16-.58.46-.58h5.57Z'),
				elm$svg$Svg$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$Main$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		elm$svg$Svg$path,
		_List_fromArray(
			[
				elm$svg$Svg$Attributes$d('M159.29,41.18a1.29,1.29,0,0,1,0,.25,21.92,21.92,0,0,1-1.92,4.63.65.65,0,0,1-.55.31.73.73,0,0,1-.36-.1.58.58,0,0,1-.32-.52.74.74,0,0,1,.1-.37A19.32,19.32,0,0,0,158.07,41a.55.55,0,0,1,.54-.42.91.91,0,0,1,.23,0A.53.53,0,0,1,159.29,41.18ZM159.5,38a.54.54,0,0,1-.14.37.62.62,0,0,1-.51.25.66.66,0,0,1-.43-.18,14.59,14.59,0,0,0-2-1.5.48.48,0,0,1-.22-.44.75.75,0,0,1,.13-.39.66.66,0,0,1,.5-.24.76.76,0,0,1,.33.08,13,13,0,0,1,2.14,1.55A.62.62,0,0,1,159.5,38Zm.44-4.45a.73.73,0,0,1,.2.48.57.57,0,0,1-.16.41.6.6,0,0,1-.46.21.75.75,0,0,1-.52-.23,13.47,13.47,0,0,0-1.85-1.59.57.57,0,0,1-.21-.45.65.65,0,0,1,.13-.39.68.68,0,0,1,.52-.25.57.57,0,0,1,.35.12A13.39,13.39,0,0,1,159.94,33.55Zm10.76-.83c.29,0,.44.24.44.55s-.15.59-.44.59h-8.35c-.41,0-.57.14-.57.58,0,1.8-.05,4.32-.23,6.11a14.86,14.86,0,0,1-1.48,5.38.75.75,0,0,1-.63.39.8.8,0,0,1-.26,0,.62.62,0,0,1-.34-.55.61.61,0,0,1,.1-.34,12.91,12.91,0,0,0,1.41-5c.18-1.85.23-4.19.23-6.21A1.27,1.27,0,0,1,162,32.72h3.06v-.86c0-.33.24-.49.61-.49s.62.16.62.49v.86Zm-8.21,8.5c-.29,0-.43-.21-.43-.52s.14-.52.43-.52h6.2c.71,0,1.08.39,1.08.87a1.28,1.28,0,0,1-.26.74A10,10,0,0,1,167.35,44a12.42,12.42,0,0,0,3.42,1.31.53.53,0,0,1,.47.54.44.44,0,0,1,0,.16.52.52,0,0,1-.55.46,1.29,1.29,0,0,1-.25,0,14,14,0,0,1-4.06-1.77,14.48,14.48,0,0,1-4.47,1.76h-.16a.55.55,0,0,1-.58-.4.33.33,0,0,1,0-.18.53.53,0,0,1,.46-.54,12.84,12.84,0,0,0,3.85-1.35,9.7,9.7,0,0,1-2.16-2.69ZM169,38c0,.84-.4,1.17-1.23,1.17h-2.71c-.85,0-1.26-.33-1.26-1.17v-1.4h-1.3c-.24,0-.4-.21-.4-.5s.16-.51.4-.51h1.3v-.91c0-.29.25-.45.56-.45s.55.16.55.45v.91h3v-.91c0-.29.19-.45.55-.45s.55.16.55.45v.91h1.55c.29,0,.42.18.42.51s-.13.5-.42.5H169Zm-4.55,3.25a7.07,7.07,0,0,0,1.95,2.09,9.14,9.14,0,0,0,1.87-1.69.41.41,0,0,0,.12-.24c0-.1-.08-.16-.25-.16Zm.46-4.65v1.2c0,.29.15.39.44.39h2.11c.29,0,.44-.08.44-.39v-1.2Z'),
				elm$svg$Svg$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$Main$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		elm$svg$Svg$path,
		_List_fromArray(
			[
				elm$svg$Svg$Attributes$d('M176.94,32.83v.05c-.08,2.39-.21,5.27-.21,7.87,0,1.52.19,2.37.71,2.87a3.46,3.46,0,0,0,2.47.68,4.75,4.75,0,0,0,3.48-1.39,7.78,7.78,0,0,0,1.72-3.24.66.66,0,0,1,.62-.55.8.8,0,0,1,.26.05.68.68,0,0,1,.5.67.71.71,0,0,1-.05.27,8.84,8.84,0,0,1-2.16,3.9,6.14,6.14,0,0,1-4.4,1.72,4.73,4.73,0,0,1-3.46-1.12c-.75-.73-1.09-1.78-1.09-3.85,0-2.52.08-5.52.19-7.91a.66.66,0,0,1,.7-.68h0A.62.62,0,0,1,176.94,32.83Z'),
				elm$svg$Svg$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$Main$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		elm$svg$Svg$path,
		_List_fromArray(
			[
				elm$svg$Svg$Attributes$d('M200.46,33.22a1.82,1.82,0,0,1,1.56.59,1.75,1.75,0,0,1,.34,1.17,3.64,3.64,0,0,1,0,.45c-.7,4.94-4.11,8.65-9.5,10a1,1,0,0,1-.3.05.59.59,0,0,1-.61-.46,1.17,1.17,0,0,1,0-.26.7.7,0,0,1,.52-.68c4.68-1.23,7.87-4.31,8.4-8.68a1,1,0,0,0,0-.24c0-.42-.21-.54-.71-.54h-9.48c-.37,0-.58-.29-.58-.7a.6.6,0,0,1,.58-.68Z'),
				elm$svg$Svg$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$Main$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		elm$svg$Svg$path,
		_List_fromArray(
			[
				elm$svg$Svg$Attributes$d('M208.41,40.08a.66.66,0,0,1-.74.67.65.65,0,0,1-.73-.65V33a.66.66,0,0,1,.73-.66c.44,0,.74.22.74.65ZM215,33a.65.65,0,0,1,.7-.68c.44,0,.77.22.77.65v5.29c0,2.44-.62,4.15-2,5.37a9.68,9.68,0,0,1-5,2.08h-.12a.71.71,0,0,1-.73-.57,1.15,1.15,0,0,1,0-.18.62.62,0,0,1,.58-.64,8.2,8.2,0,0,0,4.29-1.78c1.06-1,1.51-2.36,1.51-4.47Z'),
				elm$svg$Svg$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$Main$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		elm$svg$Svg$path,
		_List_fromArray(
			[
				elm$svg$Svg$Attributes$d('M222.12,39.82a.61.61,0,0,1-.64-.7.65.65,0,0,1,.65-.73h12.34a.65.65,0,0,1,.65.73.61.61,0,0,1-.64.7Z'),
				elm$svg$Svg$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$Main$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		elm$svg$Svg$path,
		_List_fromArray(
			[
				elm$svg$Svg$Attributes$d('M238.4,34.94c-.35,0-.56-.3-.56-.68a.63.63,0,0,1,.56-.7h11a1.67,1.67,0,0,1,1.43.6,1.41,1.41,0,0,1,.28.86,2.36,2.36,0,0,1-.33,1.15,17,17,0,0,1-5.6,5.67,27.46,27.46,0,0,1,1.9,2.38.67.67,0,0,1,.13.42.86.86,0,0,1-.36.67.76.76,0,0,1-.4.13.78.78,0,0,1-.64-.38,38.65,38.65,0,0,0-5.6-6.4.63.63,0,0,1-.25-.47.62.62,0,0,1,.28-.49.63.63,0,0,1,.44-.18.86.86,0,0,1,.52.21,35.2,35.2,0,0,1,3.08,3,14.49,14.49,0,0,0,5-5,1,1,0,0,0,.15-.45c0-.26-.2-.39-.61-.39Z'),
				elm$svg$Svg$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$Main$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		elm$svg$Svg$path,
		_List_fromArray(
			[
				elm$svg$Svg$Attributes$d('M254.61,39.82a.61.61,0,0,1-.64-.7.65.65,0,0,1,.65-.73H267a.65.65,0,0,1,.65.73c0,.44-.23.7-.63.7Z'),
				elm$svg$Svg$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$Main$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		elm$svg$Svg$path,
		_List_fromArray(
			[
				elm$svg$Svg$Attributes$d('M280.2,36.1c-.15,4.81-2.37,8.2-6.62,9.73a1.25,1.25,0,0,1-.32.05.65.65,0,0,1-.62-.39.83.83,0,0,1-.08-.32.67.67,0,0,1,.49-.64c3.54-1.31,5.56-4,5.74-8.43h-4.93a11.61,11.61,0,0,1-2.73,3.25.8.8,0,0,1-.5.19.66.66,0,0,1-.47-.21.71.71,0,0,1-.21-.5.7.7,0,0,1,.27-.55,12.16,12.16,0,0,0,3.3-4.72,8.71,8.71,0,0,0,.45-1.22.65.65,0,0,1,.61-.48l.21,0a.63.63,0,0,1,.53.6.92.92,0,0,1,0,.16,14.11,14.11,0,0,1-.88,2.16h9a.56.56,0,0,1,.62.64c0,.4-.19.65-.6.65Z'),
				elm$svg$Svg$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$Main$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		elm$svg$Svg$path,
		_List_fromArray(
			[
				elm$svg$Svg$Attributes$d('M288.82,36.11a.58.58,0,0,1,.54.35,22,22,0,0,1,1.35,3.36c0,.1,0,.16,0,.24a.55.55,0,0,1-.45.54.91.91,0,0,1-.26,0,.56.56,0,0,1-.57-.41,22.2,22.2,0,0,0-1.3-3.3.38.38,0,0,1-.07-.22.59.59,0,0,1,.42-.54A.73.73,0,0,1,288.82,36.11Zm9.57.31v.12a11.85,11.85,0,0,1-2,5.83,9.46,9.46,0,0,1-5.46,3.45h-.18a.57.57,0,0,1-.58-.44,1,1,0,0,1,0-.24.54.54,0,0,1,.45-.54,8.45,8.45,0,0,0,4.78-3,11.28,11.28,0,0,0,1.75-5.26.55.55,0,0,1,.61-.5h.08C298.18,35.87,298.39,36.07,298.39,36.42Zm-6.15-1a.62.62,0,0,1,.55.36,17.56,17.56,0,0,1,1.27,3.32.86.86,0,0,1,0,.16.57.57,0,0,1-.44.55,1.18,1.18,0,0,1-.27,0,.53.53,0,0,1-.56-.37,19.17,19.17,0,0,0-1.21-3.22.44.44,0,0,1-.07-.24.6.6,0,0,1,.42-.52A.66.66,0,0,1,292.24,35.46Z'),
				elm$svg$Svg$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$Main$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		elm$svg$Svg$path,
		_List_fromArray(
			[
				elm$svg$Svg$Attributes$d('M307.18,45.3c0,.43-.31.61-.71.61s-.72-.18-.72-.61V32.67c0-.44.28-.62.72-.62s.71.18.71.64v4.17a48.46,48.46,0,0,1,7.93,2.91.71.71,0,0,1,.44.68.94.94,0,0,1-.06.36.7.7,0,0,1-.65.47.81.81,0,0,1-.34-.08,44.76,44.76,0,0,0-7.32-2.89Z'),
				elm$svg$Svg$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$Main$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		elm$svg$Svg$path,
		_List_fromArray(
			[
				elm$svg$Svg$Attributes$d('M321.72,32.72a.6.6,0,0,1,.68-.62.64.64,0,0,1,.72.62V35.3h5.31V32.72a.59.59,0,0,1,.67-.62.63.63,0,0,1,.71.62V35.3h2.49a.57.57,0,0,1,.62.64.58.58,0,0,1-.6.65h-2.51v1.73A8.1,8.1,0,0,1,328.63,43a7.37,7.37,0,0,1-4.81,2.86.82.82,0,0,1-.21,0,.59.59,0,0,1-.64-.51,1,1,0,0,1,0-.17c0-.33.21-.54.58-.61a6.24,6.24,0,0,0,3.93-2.37,7.07,7.07,0,0,0,1-4.14V36.59h-5.31v4c0,.41-.31.62-.72.62s-.68-.21-.68-.62v-4h-2.5a.58.58,0,0,1-.6-.65.56.56,0,0,1,.62-.62h2.48Z'),
				elm$svg$Svg$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$Main$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		elm$svg$Svg$path,
		_List_fromArray(
			[
				elm$svg$Svg$Attributes$d('M335.84,39.82c-.41,0-.63-.26-.63-.7a.64.64,0,0,1,.65-.73h12.33a.65.65,0,0,1,.65.73c0,.44-.23.7-.63.7Z'),
				elm$svg$Svg$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$Main$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		elm$svg$Svg$path,
		_List_fromArray(
			[
				elm$svg$Svg$Attributes$d('M354.47,41.75c0,2.1.36,2.23,3.56,2.23a29.87,29.87,0,0,0,5-.42.68.68,0,0,1,.2,0,.59.59,0,0,1,.61.59v.11a.67.67,0,0,1-.6.7,32.55,32.55,0,0,1-5.51.39c-3.94,0-4.63-.6-4.63-3.67V33.17c0-.44.31-.61.7-.61s.7.17.7.61v4.41A22.33,22.33,0,0,0,362.11,35a.79.79,0,0,1,.41-.11.71.71,0,0,1,.6.36.76.76,0,0,1,.11.4.67.67,0,0,1-.34.59,23.62,23.62,0,0,1-8.42,2.71Zm8-9.93a.53.53,0,0,1,.42.18,10.81,10.81,0,0,1,1.4,1.82.83.83,0,0,1,.11.43.5.5,0,0,1-.53.45.44.44,0,0,1-.43-.28,11.24,11.24,0,0,0-1.28-1.77.57.57,0,0,1-.16-.39A.48.48,0,0,1,362.52,31.82Zm1.93-.84a.61.61,0,0,1,.44.19A9.71,9.71,0,0,1,366.22,33a.8.8,0,0,1,.1.4.49.49,0,0,1-.5.46.47.47,0,0,1-.43-.26,10.21,10.21,0,0,0-1.21-1.73.48.48,0,0,1-.2-.42A.49.49,0,0,1,364.45,31Z'),
				elm$svg$Svg$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$Main$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		elm$svg$Svg$path,
		_List_fromArray(
			[
				elm$svg$Svg$Attributes$d('M369.4,34.59c-.39,0-.6-.28-.6-.72a.59.59,0,0,1,.6-.65l8.28-.08a1.41,1.41,0,0,1,1.65,1.46,3,3,0,0,1-.18.95,15.14,15.14,0,0,1-2.58,4.22,28.82,28.82,0,0,1,4.52,4,.94.94,0,0,1,.23.57.81.81,0,0,1-.22.52.74.74,0,0,1-.56.24.77.77,0,0,1-.59-.26,27.33,27.33,0,0,0-4.29-4.1,18.12,18.12,0,0,1-6.87,4.51,1.36,1.36,0,0,1-.39.08.6.6,0,0,1-.61-.41.82.82,0,0,1,0-.28.73.73,0,0,1,.48-.69A18.31,18.31,0,0,0,374,40.49a13.86,13.86,0,0,0,3.68-5.29,1.53,1.53,0,0,0,.08-.35c0-.25-.18-.36-.59-.36Z'),
				elm$svg$Svg$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$Main$logoSubTextFontColor
			]),
		_List_Nil)
	]);
var elm$svg$Svg$ellipse = elm$svg$Svg$trustedNode('ellipse');
var elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var elm$svg$Svg$Attributes$rx = _VirtualDom_attribute('rx');
var elm$svg$Svg$Attributes$ry = _VirtualDom_attribute('ry');
var author$project$Main$tsukuBirdShadow = A2(
	elm$svg$Svg$ellipse,
	_List_fromArray(
		[
			elm$svg$Svg$Attributes$cx('383.22'),
			elm$svg$Svg$Attributes$cy('93.55'),
			elm$svg$Svg$Attributes$rx('39.04'),
			elm$svg$Svg$Attributes$ry('18.08'),
			elm$svg$Svg$Attributes$fill('#999')
		]),
	_List_Nil);
var elm$svg$Svg$image = elm$svg$Svg$trustedNode('image');
var elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var elm$svg$Svg$Attributes$xlinkHref = function (value) {
	return A3(
		_VirtualDom_attributeNS,
		'http://www.w3.org/1999/xlink',
		'xlink:href',
		_VirtualDom_noJavaScriptUri(value));
};
var author$project$Main$tsukuBird = _List_fromArray(
	[
		author$project$Main$tsukuBirdShadow,
		A2(
		elm$svg$Svg$image,
		_List_fromArray(
			[
				elm$svg$Svg$Attributes$xlinkHref('/assets/logoBird.png'),
				elm$svg$Svg$Attributes$width('370'),
				elm$svg$Svg$Attributes$height('320'),
				elm$svg$Svg$Attributes$transform('translate(307.49) scale(0.36)')
			]),
		_List_Nil)
	]);
var author$project$Main$tsukuMartFontColor = elm$svg$Svg$Attributes$fill('#fff4d8');
var author$project$Main$tsukuMartCharacters = _List_fromArray(
	[
		A2(
		elm$svg$Svg$path,
		_List_fromArray(
			[
				elm$svg$Svg$Attributes$d('M41.91,75.12c0-5.66,3.52-11.1,10.79-11.1,3.52,0,7.88-.15,12.63-.15,17.44,0,39.47,2.22,39.47,23.18,0,18.9-22.26,28.39-24.78,28.39-2,0-3.6-1.23-3.6-2.76,0-3.21,7.27-5.43,7.27-13,0-7.12-8-13.31-19.82-13.31-2.68,0-8.72.84-10.4.84C45.89,87.21,41.91,81.09,41.91,75.12Z'),
				elm$svg$Svg$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$Main$tsukuMartFontColor
			]),
		_List_Nil),
		A2(
		elm$svg$Svg$path,
		_List_fromArray(
			[
				elm$svg$Svg$Attributes$d('M117.81,88.83c0-6.34,7.47-4.15,19.24-27.25A12.81,12.81,0,0,1,149,54.19c7.32,0,14.79,5.43,14.79,12.45,0,3.24-1.51,6.79-5.44,10.34-5.2,4.68-11.47,10.79-13.73,12.45s-1.81,4.3-.68,6c9.58,13.73,12.45,15.77,12.45,19.09,0,2.57-2.11,4.15-4.68,4.15-6.94,0-9.05-9.73-31.39-25.28A5.55,5.55,0,0,1,117.81,88.83Z'),
				elm$svg$Svg$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$Main$tsukuMartFontColor
			]),
		_List_Nil),
		A2(
		elm$svg$Svg$path,
		_List_fromArray(
			[
				elm$svg$Svg$Attributes$d('M221.66,100.25a79.24,79.24,0,0,1,6.36,7.94c1.18,1.73,2.6,5.27-.47,5.27a8.49,8.49,0,0,1-3.54-1.18c-8.09-4.49-19.18-7-23.82-7.71s-5.73-3.06-2.9-6a27.75,27.75,0,0,0,6.13-8.73c1.41-3.3,3.85-3.3,6.37-1.1,1.33,1.18,3.61,3.23,6.28,5.82,1.42-3.38,2.21-6.45,2.44-6.92,1.1-2.67-4.48-2.12-6.84-2.12a135,135,0,0,0-17.37,1.1C189.5,87.36,183,90.19,183,83c0-3.06-1.26-9.27-3.07-11.55-2.75-3.46-1.57-8.57,4.25-8.57a10.87,10.87,0,0,1,2.12.15c6.21,1,44.42,1.42,52,.48,5.9-.71,10.06,3.45,6.45,7.62a53,53,0,0,0-5.27,7.39A90.93,90.93,0,0,1,221.66,100.25Z'),
				elm$svg$Svg$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$Main$tsukuMartFontColor
			]),
		_List_Nil),
		A2(
		elm$svg$Svg$path,
		_List_fromArray(
			[
				elm$svg$Svg$Attributes$d('M257.82,89.71a26.73,26.73,0,0,0-.71-6.6c-.95-3.69-.87-7.47,4-7.47a12.21,12.21,0,0,1,2.2.24c5.66.86,28.69,1.26,37.26.47,7.78-.87,4.09,8.41,4.09,14,0,1.81.39,3,.39,4.56,0,3.38-3.06,4.8-5.89,4.4-9.52-1.18-24.61-2-35.62-.47-3.3.47-6-1.1-6-4.79C257.58,92.62,257.82,91.13,257.82,89.71Z'),
				elm$svg$Svg$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$Main$tsukuMartFontColor
			]),
		_List_Nil),
		A2(
		elm$svg$Svg$path,
		_List_fromArray(
			[
				elm$svg$Svg$Attributes$d('M345.07,65c-.94,1.41-1.8,6.29-2.59,12.34,6.6.55,14.07.71,19.89-.55,3.77-.71,7.15-.08,7.15,3.3A8,8,0,0,1,369,83a25.75,25.75,0,0,0-1.81,8.73c0,3.53-1.88,4.87-5.5,3.85a43.92,43.92,0,0,0-8.41-.55c-3.62,0-7.94.16-12.26.31-.16,3-.24,5.9-.24,8.42s.08,4.87.24,6.52c.15,1.34,1.57,2.75,1.57,4.48,0,2.83-3.93,3.38-8.33,3.38-4,0-7.79-.31-7.79-3.54a29.62,29.62,0,0,0,.24-3.93c-.94-10.53-5.5-44-6.92-46.38A10.23,10.23,0,0,1,318,59.53c0-4.64,7.86-2.83,11.79-2.83,3.15,0,6.45-.16,11.64-.16C348.3,56.54,347.75,60.94,345.07,65Z'),
				elm$svg$Svg$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$Main$tsukuMartFontColor
			]),
		_List_Nil)
	]);
var elm$svg$Svg$svg = elm$svg$Svg$trustedNode('svg');
var elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var elm$svg$Svg$text = elm$virtual_dom$VirtualDom$text;
var elm$svg$Svg$title = elm$svg$Svg$trustedNode('title');
var elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var author$project$Main$logo = A2(
	elm$svg$Svg$svg,
	_List_fromArray(
		[
			elm$svg$Svg$Attributes$class('logo'),
			elm$svg$Svg$Attributes$viewBox('0 0 440.08 114.67')
		]),
	_Utils_ap(
		_List_fromArray(
			[
				A2(
				elm$svg$Svg$title,
				_List_Nil,
				_List_fromArray(
					[
						elm$svg$Svg$text('つくマートのロゴ')
					]))
			]),
		_Utils_ap(
			author$project$Main$tsukuMartCharacters,
			_Utils_ap(author$project$Main$tsukuBird, author$project$Main$logoSubText))));
var author$project$Main$OpenMenu = {$: 1};
var elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			elm$json$Json$Encode$string(string));
	});
var elm$html$Html$Attributes$class = elm$html$Html$Attributes$stringProperty('className');
var author$project$Main$headerButton = elm$html$Html$Attributes$class('headerButton');
var elm$html$Html$img = _VirtualDom_node('img');
var elm$html$Html$Attributes$alt = elm$html$Html$Attributes$stringProperty('alt');
var elm$html$Html$Attributes$src = function (url) {
	return A2(
		elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			elm$virtual_dom$VirtualDom$on,
			event,
			elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var elm$html$Html$Events$onClick = function (msg) {
	return A2(
		elm$html$Html$Events$on,
		'click',
		elm$json$Json$Decode$succeed(msg));
};
var author$project$Main$menuButton = A2(
	elm$html$Html$img,
	_List_fromArray(
		[
			elm$html$Html$Attributes$src('/assets/menu.svg'),
			elm$html$Html$Attributes$alt('メニュー'),
			author$project$Main$headerButton,
			elm$html$Html$Events$onClick(author$project$Main$OpenMenu)
		]),
	_List_Nil);
var author$project$Main$notificationsButton = A2(
	elm$html$Html$img,
	_List_fromArray(
		[
			elm$html$Html$Attributes$src('/assets/notifications.svg'),
			elm$html$Html$Attributes$alt('通知'),
			author$project$Main$headerButton
		]),
	_List_Nil);
var author$project$Main$searchButton = A2(
	elm$html$Html$img,
	_List_fromArray(
		[
			elm$html$Html$Attributes$src('/assets/search.svg'),
			elm$html$Html$Attributes$alt('探す'),
			author$project$Main$headerButton
		]),
	_List_Nil);
var author$project$SiteMap$homeUrl = '/';
var elm$html$Html$a = _VirtualDom_node('a');
var elm$html$Html$h1 = _VirtualDom_node('h1');
var elm$html$Html$header = _VirtualDom_node('header');
var elm$html$Html$Attributes$href = function (url) {
	return A2(
		elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var author$project$Main$header = function (wideMode) {
	return A2(
		elm$html$Html$header,
		_List_Nil,
		_Utils_ap(
			wideMode ? _List_Nil : _List_fromArray(
				[author$project$Main$menuButton]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$a,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('h1Link'),
							elm$html$Html$Attributes$href(author$project$SiteMap$homeUrl)
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$h1,
							_List_Nil,
							_List_fromArray(
								[author$project$Main$logo]))
						])),
					author$project$Main$searchButton,
					author$project$Main$notificationsButton
				])));
};
var author$project$Main$ChangePage = function (a) {
	return {$: 0, a: a};
};
var elm$html$Html$div = _VirtualDom_node('div');
var elm$html$Html$input = _VirtualDom_node('input');
var elm$html$Html$text = elm$virtual_dom$VirtualDom$text;
var elm$html$Html$Attributes$type_ = elm$html$Html$Attributes$stringProperty('type');
var elm$html$Html$Attributes$value = elm$html$Html$Attributes$stringProperty('value');
var author$project$Main$exhibitionViewItemPrice = function (price) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('exhibitionView-itemPrice')
			]),
		_List_fromArray(
			[
				elm$html$Html$text('販売価格 (0～100万円)'),
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('exhibitionView-itemPrice-input')
					]),
				_List_fromArray(
					[
						A2(
						elm$html$Html$input,
						_Utils_ap(
							_List_fromArray(
								[
									elm$html$Html$Attributes$type_('number'),
									elm$html$Html$Attributes$class('exhibitionView-itemPrice-input-input')
								]),
							function () {
								if (!price.$) {
									var p = price.a;
									return _List_fromArray(
										[
											elm$html$Html$Attributes$value(
											elm$core$String$fromInt(p))
										]);
								} else {
									return _List_Nil;
								}
							}()),
						_List_Nil),
						elm$html$Html$text('円')
					]))
			]));
};
var elm$html$Html$h2 = _VirtualDom_node('h2');
var elm$html$Html$textarea = _VirtualDom_node('textarea');
var elm$html$Html$Attributes$maxlength = function (n) {
	return A2(
		_VirtualDom_attribute,
		'maxlength',
		elm$core$String$fromInt(n));
};
var elm$html$Html$Attributes$placeholder = elm$html$Html$Attributes$stringProperty('placeholder');
var author$project$Main$exhibitionViewItemTitleAndDescription = A2(
	elm$html$Html$div,
	_List_fromArray(
		[
			elm$html$Html$Attributes$class('exhibitionView-itemTitleAndDescription')
		]),
	_List_fromArray(
		[
			A2(
			elm$html$Html$h2,
			_List_Nil,
			_List_fromArray(
				[
					elm$html$Html$text('商品名と説明')
				])),
			A2(
			elm$html$Html$input,
			_List_fromArray(
				[
					elm$html$Html$Attributes$placeholder('商品名(40文字まで)'),
					elm$html$Html$Attributes$class('exhibitionView-itemTitle'),
					elm$html$Html$Attributes$maxlength(40)
				]),
			_List_Nil),
			A2(
			elm$html$Html$textarea,
			_List_fromArray(
				[
					elm$html$Html$Attributes$placeholder('商品の説明'),
					elm$html$Html$Attributes$class('exhibitionView-itemDescription')
				]),
			_List_Nil)
		]));
var author$project$Main$InputExhibitionImage = function (a) {
	return {$: 14, a: a};
};
var elm$html$Html$Attributes$accept = elm$html$Html$Attributes$stringProperty('accept');
var elm$html$Html$Attributes$id = elm$html$Html$Attributes$stringProperty('id');
var elm$json$Json$Encode$bool = _Json_wrap;
var elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			elm$json$Json$Encode$bool(bool));
	});
var elm$html$Html$Attributes$multiple = elm$html$Html$Attributes$boolProperty('multiple');
var author$project$Main$exhibitionViewPhoto = function (imageUrlList) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('exhibitionView-photo')
			]),
		_Utils_ap(
			_List_fromArray(
				[
					A2(
					elm$html$Html$input,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('exhibitionView-photo-input'),
							elm$html$Html$Attributes$id('exhibitionView-photo-input'),
							elm$html$Html$Attributes$type_('file'),
							elm$html$Html$Attributes$multiple(true),
							elm$html$Html$Attributes$accept('image/png,image/jpeg'),
							A2(
							elm$html$Html$Events$on,
							'change',
							elm$json$Json$Decode$succeed(
								author$project$Main$InputExhibitionImage('exhibitionView-photo-input')))
						]),
					_List_Nil)
				]),
			function () {
				if (imageUrlList.b) {
					return A2(
						elm$core$List$map,
						function (imageUrl) {
							return A2(
								elm$html$Html$img,
								_List_fromArray(
									[
										elm$html$Html$Attributes$src(imageUrl),
										elm$html$Html$Attributes$class('exhibitionView-photo-image')
									]),
								_List_Nil);
						},
						imageUrlList);
				} else {
					return _List_fromArray(
						[
							A2(
							elm$html$Html$img,
							_List_fromArray(
								[
									elm$html$Html$Attributes$src('/assets/add_a_photo.svg'),
									elm$html$Html$Attributes$class('exhibitionView-photo-icon')
								]),
							_List_Nil)
						]);
				}
			}()));
};
var author$project$Tab$Single = function (a) {
	return {$: 1, a: a};
};
var author$project$Main$exhibitionView = function (_n0) {
	var title = _n0.f;
	var description = _n0.an;
	var price = _n0.aF;
	var image = _n0.at;
	return _Utils_Tuple2(
		author$project$Tab$Single('商品の情報を入力'),
		_List_fromArray(
			[
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('exhibitionView')
					]),
				_List_fromArray(
					[
						author$project$Main$exhibitionViewPhoto(image),
						author$project$Main$exhibitionViewItemTitleAndDescription,
						author$project$Main$exhibitionViewItemPrice(price)
					]))
			]));
};
var author$project$Goods$getComplete = function (_n0) {
	var complete = _n0.aj;
	return complete;
};
var author$project$Goods$getCondition = function (_n0) {
	var condition = _n0.ak;
	return condition;
};
var author$project$Goods$getDescription = function (_n0) {
	var description = _n0.an;
	return description;
};
var author$project$Goods$getImage = function (_n0) {
	var image = _n0.at;
	return image;
};
var author$project$Goods$getLike = function (_n0) {
	var like = _n0.av;
	return like;
};
var author$project$Goods$getLocation = function (_n0) {
	var location = _n0.aw;
	return location;
};
var author$project$Goods$getName = function (_n0) {
	var name = _n0.aA;
	return name;
};
var author$project$Goods$getPrice = function (_n0) {
	var price = _n0.aF;
	return price;
};
var author$project$Main$goodsViewCondition = function (condition) {
	return A2(
		elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				elm$html$Html$text(
				'商品の状態' + function () {
					switch (condition) {
						case 0:
							return '新品・未使用';
						case 1:
							return 'ほぼ未使用';
						case 2:
							return '目立った傷や汚れなし';
						case 3:
							return '多少の傷や汚れあり';
						case 4:
							return '目立つ傷や汚れあり';
						default:
							return '状態が悪い・ジャンク';
					}
				}())
			]));
};
var author$project$Main$goodsViewDescription = function (description) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('goods-description')
			]),
		_List_fromArray(
			[
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('goods-description-label')
					]),
				_List_fromArray(
					[
						elm$html$Html$text('商品の説明')
					])),
				A2(
				elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						elm$html$Html$text(description)
					]))
			]));
};
var author$project$Main$goodsViewImage = function (dataUrl) {
	return A2(
		elm$html$Html$img,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('goods-image'),
				elm$html$Html$Attributes$src(dataUrl)
			]),
		_List_Nil);
};
var author$project$Main$goodsViewLike = function (likeCount) {
	return A2(
		elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				elm$html$Html$text(
				elm$core$String$fromInt(likeCount))
			]));
};
var author$project$Main$goodsViewLocation = function (location) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('goods-location')
			]),
		_List_fromArray(
			[
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('goods-location-label')
					]),
				_List_fromArray(
					[
						elm$html$Html$text('取引場所')
					])),
				A2(
				elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						elm$html$Html$text(location)
					]))
			]));
};
var author$project$Main$goodsViewName = function (name) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('goods-name')
			]),
		_List_fromArray(
			[
				elm$html$Html$text(name)
			]));
};
var elm$core$Basics$modBy = _Basics_modBy;
var elm$core$String$cons = _String_cons;
var elm$core$String$fromChar = function (_char) {
	return A2(elm$core$String$cons, _char, '');
};
var elm$core$Bitwise$and = _Bitwise_and;
var elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3(elm$core$String$repeatHelp, n, chunk, '');
	});
var elm$core$String$padLeft = F3(
	function (n, _char, string) {
		return _Utils_ap(
			A2(
				elm$core$String$repeat,
				n - elm$core$String$length(string),
				elm$core$String$fromChar(_char)),
			string);
	});
var elm$core$Tuple$mapFirst = F2(
	function (func, _n0) {
		var x = _n0.a;
		var y = _n0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var elm$core$Tuple$mapSecond = F2(
	function (func, _n0) {
		var x = _n0.a;
		var y = _n0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var author$project$Main$priceToString = function (price) {
	return A2(
		elm$core$String$join,
		',',
		function (_n0) {
			var a = _n0.a;
			var b = _n0.b;
			return A2(elm$core$List$cons, a, b);
		}(
			A2(
				elm$core$Tuple$mapSecond,
				elm$core$List$map(
					A2(
						elm$core$Basics$composeR,
						elm$core$String$fromInt,
						A2(elm$core$String$padLeft, 3, '0'))),
				A2(
					elm$core$Tuple$mapFirst,
					elm$core$String$fromInt,
					(price < 1000) ? _Utils_Tuple2(price, _List_Nil) : ((price < 1000000) ? _Utils_Tuple2(
						(price / 1000) | 0,
						_List_fromArray(
							[
								A2(elm$core$Basics$modBy, 1000, price)
							])) : _Utils_Tuple2(
						(price / 1000000) | 0,
						_List_fromArray(
							[
								A2(elm$core$Basics$modBy, 1000, (price / 1000) | 0),
								A2(elm$core$Basics$modBy, 1000, price)
							]))))))) + '円';
};
var elm$html$Html$button = _VirtualDom_node('button');
var author$project$Main$goodsViewPriceAndBuyButton = function (price) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('goods-priceAndBuyButton')
			]),
		_List_fromArray(
			[
				A2(
				elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						elm$html$Html$text(
						author$project$Main$priceToString(price))
					])),
				A2(
				elm$html$Html$button,
				_List_Nil,
				_List_fromArray(
					[
						elm$html$Html$text('購入手続きへ')
					]))
			]));
};
var author$project$Main$goodsView = function (goods) {
	return _List_fromArray(
		[
			A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('goodsContainer')
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('goods')
						]),
					_List_fromArray(
						[
							author$project$Main$goodsViewImage(
							author$project$Goods$getImage(goods)),
							author$project$Main$goodsViewName(
							author$project$Goods$getName(goods)),
							author$project$Main$goodsViewLike(
							author$project$Goods$getLike(goods)),
							author$project$Main$goodsViewDescription(
							author$project$Goods$getDescription(goods)),
							author$project$Main$goodsViewPriceAndBuyButton(
							author$project$Goods$getPrice(goods)),
							author$project$Main$goodsViewCondition(
							author$project$Goods$getCondition(goods)),
							author$project$Main$goodsViewLocation(
							author$project$Goods$getLocation(goods)),
							A2(
							elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									elm$html$Html$text(
									author$project$Goods$getComplete(goods) ? '売却済み' : 'まだ売れていない')
								]))
						]))
				]))
		]);
};
var author$project$Main$HomePageFree = 2;
var author$project$Main$HomePageRecent = 0;
var author$project$SiteMap$exhibitionUrl = '/exhibition';
var author$project$Main$exhibitButton = A2(
	elm$html$Html$a,
	_List_fromArray(
		[
			elm$html$Html$Attributes$class('exhibitButton'),
			elm$html$Html$Attributes$href(author$project$SiteMap$exhibitionUrl)
		]),
	_List_fromArray(
		[
			elm$html$Html$text('出品')
		]));
var author$project$Main$itemImage = A2(
	elm$html$Html$img,
	_List_fromArray(
		[
			elm$html$Html$Attributes$class('itemImage'),
			elm$html$Html$Attributes$src('/assets/itemDummy.png')
		]),
	_List_Nil);
var author$project$SiteMap$goodsUrl = function (goodsId) {
	return '/goods/' + goodsId;
};
var author$project$Main$item = function (_n0) {
	var title = _n0.f;
	var price = _n0.aF;
	var like = _n0.av;
	return A2(
		elm$html$Html$a,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('item'),
				elm$html$Html$Attributes$href(
				author$project$SiteMap$goodsUrl('id'))
			]),
		_List_fromArray(
			[
				author$project$Main$itemImage,
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('itemTitle')
					]),
				_List_fromArray(
					[
						elm$html$Html$text(title)
					])),
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('itemPrice')
					]),
				_List_fromArray(
					[
						elm$html$Html$text(
						author$project$Main$priceToString(price))
					])),
				A2(
				elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						elm$html$Html$text(
						'いいね' + elm$core$String$fromInt(like))
					]))
			]));
};
var elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var elm$html$Html$Attributes$style = elm$virtual_dom$VirtualDom$style;
var author$project$Main$itemList = function (isWideMode) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				A2(elm$html$Html$Attributes$style, 'display', 'grid'),
				A2(
				elm$html$Html$Attributes$style,
				'grid-template-columns',
				isWideMode ? '33.3% 33.4% 33.3%' : '50% 50%')
			]),
		A2(
			elm$core$List$map,
			author$project$Main$item,
			_List_fromArray(
				[
					{av: 1, aF: 300, f: '冷蔵庫'},
					{av: 5, aF: 100, f: '洗濯機'},
					{av: 99, aF: 10, f: '時計'},
					{av: 5, aF: 100, f: '掃除機'},
					{av: 9, aF: 200, f: '自転車'},
					{av: 99, aF: 10, f: 'マンガ'},
					{av: 99, aF: 10, f: 'ゲーム'},
					{av: 5, aF: 100, f: '絵本'},
					{av: 2, aF: 1000, f: '棚'},
					{av: 2, aF: 1000, f: 'いす'},
					{av: 20, aF: 300, f: 'バッテリー'},
					{av: 10, aF: 20, f: '教科書'}
				])));
};
var author$project$Tab$Multi = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var author$project$Main$homeView = F2(
	function (isWideScreenMode, subPage) {
		return _Utils_Tuple2(
			A2(
				author$project$Tab$Multi,
				_List_fromArray(
					[
						_Utils_Tuple2(0, '新着'),
						_Utils_Tuple2(1, 'おすすめ'),
						_Utils_Tuple2(2, '0円')
					]),
				function () {
					switch (subPage) {
						case 0:
							return 0;
						case 1:
							return 1;
						default:
							return 2;
					}
				}()),
			_List_fromArray(
				[
					author$project$Main$itemList(isWideScreenMode),
					author$project$Main$exhibitButton
				]));
	});
var author$project$Main$History = 1;
var author$project$Main$likeAndHistoryView = F2(
	function (isWideScreenMode, likeAndHistory) {
		return _Utils_Tuple2(
			A2(
				author$project$Tab$Multi,
				_List_fromArray(
					[
						_Utils_Tuple2(0, 'いいね'),
						_Utils_Tuple2(1, '閲覧履歴')
					]),
				function () {
					if (!likeAndHistory) {
						return 0;
					} else {
						return 1;
					}
				}()),
			_List_fromArray(
				[
					author$project$Main$itemList(isWideScreenMode)
				]));
	});
var author$project$Main$InputPassword = function (a) {
	return {$: 17, a: a};
};
var author$project$Main$InputStudentIdOrEmailAddress = function (a) {
	return {$: 12, a: a};
};
var author$project$Main$LogIn = function (a) {
	return {$: 8, a: a};
};
var author$project$Main$logInPageEmitToMsg = F2(
	function (pageMaybe, emit) {
		switch (emit.$) {
			case 0:
				var model = emit.a;
				return author$project$Main$ChangePage(
					author$project$Main$PageLogIn(
						_Utils_Tuple2(model, pageMaybe)));
			case 1:
				var string = emit.a;
				return author$project$Main$InputStudentIdOrEmailAddress(string);
			case 2:
				var string = emit.a;
				return author$project$Main$InputPassword(string);
			default:
				var record = emit.a;
				return author$project$Main$LogIn(record);
		}
	});
var author$project$Main$DeleteAllUser = {$: 19};
var author$project$Main$SendConfirmToken = function (a) {
	return {$: 18, a: a};
};
var author$project$Main$SignUp = function (a) {
	return {$: 7, a: a};
};
var author$project$Main$signUpPageEmitToMsg = function (emit) {
	switch (emit.$) {
		case 0:
			var model = emit.a;
			return author$project$Main$ChangePage(
				author$project$Main$PageSignUp(model));
		case 1:
			var string = emit.a;
			return author$project$Main$InputStudentIdOrEmailAddress(string);
		case 2:
			var string = emit.a;
			return author$project$Main$InputExhibitionImage(string);
		case 3:
			var string = emit.a;
			return author$project$Main$InputPassword(string);
		case 4:
			var record = emit.a;
			return author$project$Main$SignUp(record);
		case 5:
			var token = emit.a;
			return author$project$Main$SendConfirmToken(token);
		default:
			return author$project$Main$DeleteAllUser;
	}
};
var author$project$SiteMap$urlNode = function (string) {
	return '  <url>\n' + ('    <loc>http://tsukumart.com' + (string + ('</loc>\n' + '  </url>\n')));
};
var elm$core$String$concat = function (strings) {
	return A2(elm$core$String$join, '', strings);
};
var author$project$SiteMap$siteMapXml = elm$core$String$concat(
	_Utils_ap(
		_List_fromArray(
			['<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n', '<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n']),
		_Utils_ap(
			A2(
				elm$core$List$map,
				author$project$SiteMap$urlNode,
				_Utils_ap(
					_List_fromArray(
						[author$project$SiteMap$homeUrl]),
					_List_fromArray(
						[
							author$project$SiteMap$goodsUrl('sampleId')
						]))),
			_List_fromArray(
				['</urlset>\n']))));
var author$project$Main$siteMapXmlView = _Utils_Tuple2(
	author$project$Tab$Single('sitemap.xml'),
	_List_fromArray(
		[
			A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					A2(elm$html$Html$Attributes$style, 'white-space', 'pre-wrap')
				]),
			_List_fromArray(
				[
					elm$html$Html$text(author$project$SiteMap$siteMapXml)
				]))
		]));
var author$project$Page$LogIn$forgotPasswordView = _List_fromArray(
	[
		elm$html$Html$text('パスワードを忘れたら。登録している学籍番号かメールアドレスを入力してください。パスワードを再発行します。')
	]);
var author$project$StudentId$digitToChar = function (i) {
	switch (i) {
		case 0:
			return '0';
		case 1:
			return '1';
		case 2:
			return '2';
		case 3:
			return '3';
		case 4:
			return '4';
		case 5:
			return '5';
		case 6:
			return '6';
		case 7:
			return '7';
		case 8:
			return '8';
		default:
			return '9';
	}
};
var author$project$StudentId$toString = function (_n0) {
	var i0 = _n0.a;
	var i1 = _n0.b;
	var i2 = _n0.c;
	var i3 = _n0.d;
	var i4 = _n0.e;
	var i5 = _n0.f;
	var i6 = _n0.g;
	return elm$core$String$fromList(
		A2(
			elm$core$List$map,
			author$project$StudentId$digitToChar,
			_List_fromArray(
				[i0, i1, i2, i3, i4, i5, i6])));
};
var author$project$SAddress$toEmailAddressString = function (_n0) {
	var studentId = _n0.a;
	var subDomain = _n0.b;
	return 's' + (author$project$StudentId$toString(studentId) + ('@' + (subDomain + '.tsukuba.ac.jp')));
};
var author$project$EmailAddress$fromSAddress = function (sAddress) {
	return author$project$SAddress$toEmailAddressString(sAddress);
};
var author$project$SAddress$fromStundetId = function (studentId) {
	return A2(author$project$SAddress$SAddress, studentId, 's');
};
var author$project$Page$LogIn$getLogInData = F2(
	function (studentIdOrEmailAddress, passwordMaybe) {
		var _n0 = _Utils_Tuple2(studentIdOrEmailAddress, passwordMaybe);
		_n0$2:
		while (true) {
			if (!_n0.b.$) {
				switch (_n0.a.$) {
					case 1:
						var studentId = _n0.a.a;
						var password = _n0.b.a;
						return elm$core$Maybe$Just(
							{
								Q: author$project$EmailAddress$fromSAddress(
									author$project$SAddress$fromStundetId(studentId)),
								T: password
							});
					case 2:
						var emailAddress = _n0.a.a;
						var password = _n0.b.a;
						return elm$core$Maybe$Just(
							{Q: emailAddress, T: password});
					default:
						break _n0$2;
				}
			} else {
				break _n0$2;
			}
		}
		return elm$core$Maybe$Nothing;
	});
var author$project$Page$LogIn$EmitLogIn = function (a) {
	return {$: 3, a: a};
};
var elm$html$Html$Attributes$disabled = elm$html$Html$Attributes$boolProperty('disabled');
var elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 2, a: a};
};
var elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			elm$virtual_dom$VirtualDom$on,
			event,
			elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var author$project$Page$LogIn$logInButton = function (logInDataMaybe) {
	return A2(
		elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				elm$html$Html$button,
				_Utils_ap(
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('logIn-logInButton'),
							elm$html$Html$Attributes$disabled(
							_Utils_eq(logInDataMaybe, elm$core$Maybe$Nothing))
						]),
					function () {
						if (!logInDataMaybe.$) {
							var logInData = logInDataMaybe.a;
							return _List_fromArray(
								[
									A2(
									elm$html$Html$Events$preventDefaultOn,
									'click',
									elm$json$Json$Decode$succeed(
										_Utils_Tuple2(
											author$project$Page$LogIn$EmitLogIn(logInData),
											true)))
								]);
						} else {
							return _List_Nil;
						}
					}()),
				_List_fromArray(
					[
						elm$html$Html$text('ログイン')
					]))
			]));
};
var author$project$Page$LogIn$EmitInputStudentIdOrEmailAddress = function (a) {
	return {$: 1, a: a};
};
var author$project$StudentId$toStringWith20 = function (studentId) {
	return '20' + author$project$StudentId$toString(studentId);
};
var elm$html$Html$label = _VirtualDom_node('label');
var elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var elm$html$Html$Attributes$attribute = elm$virtual_dom$VirtualDom$attribute;
var elm$html$Html$Attributes$for = elm$html$Html$Attributes$stringProperty('htmlFor');
var elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			elm$virtual_dom$VirtualDom$on,
			event,
			elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3(elm$core$List$foldr, elm$json$Json$Decode$field, decoder, fields);
	});
var elm$html$Html$Events$targetValue = A2(
	elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	elm$json$Json$Decode$string);
var elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			elm$json$Json$Decode$map,
			elm$html$Html$Events$alwaysStop,
			A2(elm$json$Json$Decode$map, tagger, elm$html$Html$Events$targetValue)));
};
var author$project$Page$LogIn$logInIdView = function (analysisStudentIdOrEmailAddressResult) {
	return A2(
		elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				elm$html$Html$label,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('logIn-subTitle'),
						elm$html$Html$Attributes$for('logInId')
					]),
				_List_fromArray(
					[
						elm$html$Html$text('学籍番号かメールアドレス')
					])),
				A2(
				elm$html$Html$input,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('logIn-input'),
						elm$html$Html$Attributes$id('logInId'),
						A2(elm$html$Html$Attributes$attribute, 'autocomplete', 'email'),
						elm$html$Html$Events$onInput(author$project$Page$LogIn$EmitInputStudentIdOrEmailAddress)
					]),
				_List_Nil),
				A2(
				elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						elm$html$Html$text(
						function () {
							switch (analysisStudentIdOrEmailAddressResult.$) {
								case 0:
									return '';
								case 1:
									var studentId = analysisStudentIdOrEmailAddressResult.a;
									return '学籍番号' + author$project$StudentId$toStringWith20(studentId);
								default:
									var emailAddress = analysisStudentIdOrEmailAddressResult.a;
									return 'メールアドレス' + author$project$EmailAddress$toString(emailAddress);
							}
						}())
					]))
			]));
};
var author$project$Page$LogIn$EmitChangePage = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$LogIn$EmitInputPassword = function (a) {
	return {$: 2, a: a};
};
var elm$html$Html$span = _VirtualDom_node('span');
var elm$html$Html$Attributes$minlength = function (n) {
	return A2(
		_VirtualDom_attribute,
		'minLength',
		elm$core$String$fromInt(n));
};
var author$project$Page$LogIn$logInPasswordView = A2(
	elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			elm$html$Html$label,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('logIn-subTitle'),
					elm$html$Html$Attributes$for('logInPassword')
				]),
			_List_fromArray(
				[
					elm$html$Html$text('パスワード'),
					A2(
					elm$html$Html$span,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('logIn-subTitle-forgotPassword'),
							elm$html$Html$Events$onClick(
							author$project$Page$LogIn$EmitChangePage(author$project$Page$LogIn$ForgotPassword))
						]),
					_List_fromArray(
						[
							elm$html$Html$text('パスワードを忘れた')
						]))
				])),
			A2(
			elm$html$Html$input,
			_List_fromArray(
				[
					elm$html$Html$Attributes$type_('password'),
					elm$html$Html$Attributes$class('logIn-input'),
					elm$html$Html$Attributes$id('logInPassword'),
					elm$html$Html$Attributes$minlength(9),
					elm$html$Html$Attributes$maxlength(50),
					A2(elm$html$Html$Attributes$attribute, 'autocomplete', 'current-password'),
					elm$html$Html$Events$onInput(author$project$Page$LogIn$EmitInputPassword)
				]),
			_List_Nil)
		]));
var author$project$Page$LogIn$orLabel = A2(
	elm$html$Html$div,
	_List_fromArray(
		[
			elm$html$Html$Attributes$class('logIn-orLabel')
		]),
	_List_fromArray(
		[
			elm$html$Html$text('or')
		]));
var author$project$SiteMap$signUpUrl = '/user-signup';
var author$project$Page$LogIn$signUpButton = A2(
	elm$html$Html$a,
	_List_fromArray(
		[
			elm$html$Html$Attributes$class('logIn-signInButton'),
			elm$html$Html$Attributes$href(author$project$SiteMap$signUpUrl)
		]),
	_List_fromArray(
		[
			elm$html$Html$text('新規登録')
		]));
var elm$html$Html$form = _VirtualDom_node('form');
var author$project$Page$LogIn$logInView = F2(
	function (analysisStudentIdOrEmailAddressResult, password) {
		return _List_fromArray(
			[
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('logIn')
					]),
				_List_fromArray(
					[
						A2(
						elm$html$Html$form,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('logIn-group')
							]),
						_List_fromArray(
							[
								author$project$Page$LogIn$logInIdView(analysisStudentIdOrEmailAddressResult),
								author$project$Page$LogIn$logInPasswordView,
								author$project$Page$LogIn$logInButton(
								A2(author$project$Page$LogIn$getLogInData, analysisStudentIdOrEmailAddressResult, password))
							])),
						author$project$Page$LogIn$orLabel,
						A2(
						elm$html$Html$div,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('logIn-group')
							]),
						_List_fromArray(
							[author$project$Page$LogIn$signUpButton]))
					]))
			]);
	});
var author$project$Page$LogIn$view = function (logInPage) {
	return _List_fromArray(
		[
			A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('logIn-Container')
				]),
			function () {
				if (!logInPage.$) {
					var studentIdOrEmailAddress = logInPage.a.ae;
					var password = logInPage.a.Z;
					return A2(author$project$Page$LogIn$logInView, studentIdOrEmailAddress, password);
				} else {
					return author$project$Page$LogIn$forgotPasswordView;
				}
			}())
		]);
};
var author$project$Page$SignUp$EmitChangePage = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$SignUp$EmitDeleteUserAll = {$: 6};
var author$project$Page$SignUp$getSignUpRequestEmailAddressAndPasswordAndImage = function (sAddressAndPassword) {
	if (!sAddressAndPassword.$) {
		var studentIdOrTsukubaEmailAddress = sAddressAndPassword.a.L;
		var password = sAddressAndPassword.a.Z;
		var _n1 = _Utils_Tuple2(studentIdOrTsukubaEmailAddress, password);
		_n1$2:
		while (true) {
			if (!_n1.b.$) {
				switch (_n1.a.$) {
					case 1:
						var studentId = _n1.a.a;
						var pass = _n1.b.a;
						return elm$core$Maybe$Just(
							{
								Q: author$project$EmailAddress$fromSAddress(
									author$project$SAddress$fromStundetId(studentId)),
								at: elm$core$Maybe$Nothing,
								Z: pass
							});
					case 2:
						var sAddress = _n1.a.a;
						var pass = _n1.b.a;
						return elm$core$Maybe$Just(
							{
								Q: author$project$EmailAddress$fromSAddress(sAddress),
								at: elm$core$Maybe$Nothing,
								Z: pass
							});
					default:
						break _n1$2;
				}
			} else {
				break _n1$2;
			}
		}
		return elm$core$Maybe$Nothing;
	} else {
		var emailAddress = sAddressAndPassword.a.Q;
		var password = sAddressAndPassword.a.Z;
		var imageUrl = sAddressAndPassword.a.S;
		var _n2 = _Utils_Tuple3(emailAddress, password, imageUrl);
		if (((!_n2.a.$) && (!_n2.b.$)) && (!_n2.c.$)) {
			var address = _n2.a.a;
			var pass = _n2.b.a;
			var image = _n2.c.a;
			return elm$core$Maybe$Just(
				{
					Q: address,
					at: elm$core$Maybe$Just(image),
					Z: pass
				});
		} else {
			return elm$core$Maybe$Nothing;
		}
	}
};
var author$project$Api$UniversityGraduateFromNotTsukuba = function (a) {
	return {$: 2, a: a};
};
var author$project$Api$UniversityGraduateFromTsukuba = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var author$project$Api$UniversitySchool = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$SignUp$getSignUpRequestUniversity = function (universitySelect) {
	_n0$3:
	while (true) {
		if (!universitySelect.$) {
			if (universitySelect.a.$ === 2) {
				var schoolAndDepartment = universitySelect.a.a;
				return elm$core$Maybe$Just(
					author$project$Api$UniversitySchool(schoolAndDepartment));
			} else {
				break _n0$3;
			}
		} else {
			if (!universitySelect.a.a.$) {
				if (!universitySelect.a.b.$) {
					if (universitySelect.a.b.a.$ === 2) {
						var _n1 = universitySelect.a;
						var graduate = _n1.a.a;
						var schoolAndDepartment = _n1.b.a.a;
						return elm$core$Maybe$Just(
							A2(author$project$Api$UniversityGraduateFromTsukuba, graduate, schoolAndDepartment));
					} else {
						break _n0$3;
					}
				} else {
					var _n2 = universitySelect.a;
					var graduate = _n2.a.a;
					var _n3 = _n2.b;
					return elm$core$Maybe$Just(
						author$project$Api$UniversityGraduateFromNotTsukuba(graduate));
				}
			} else {
				break _n0$3;
			}
		}
	}
	return elm$core$Maybe$Nothing;
};
var author$project$Page$SignUp$getSignUpRequest = F2(
	function (sAddressAndPassword, university) {
		var _n0 = _Utils_Tuple2(
			author$project$Page$SignUp$getSignUpRequestEmailAddressAndPasswordAndImage(sAddressAndPassword),
			author$project$Page$SignUp$getSignUpRequestUniversity(university));
		if ((!_n0.a.$) && (!_n0.b.$)) {
			var emailAddress = _n0.a.a.Q;
			var password = _n0.a.a.Z;
			var image = _n0.a.a.at;
			var universityData = _n0.b.a;
			return elm$core$Maybe$Just(
				{Q: emailAddress, at: image, T: password, aU: universityData});
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var author$project$Page$SignUp$EmitInputStudentIdOrEmailAddress = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$SignUp$EmitInputStudentImage = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$SignUp$EmitInputPassword = function (a) {
	return {$: 3, a: a};
};
var author$project$Password$allNumberErrorMessage = '数字のみは不可';
var author$project$Password$invalidCharErrorMessage = function (_n0) {
	var charSet = _n0;
	return '使えない文字' + (elm$core$String$fromList(
		elm$core$Set$toList(charSet)) + 'が含まれています。使える文字は英数字と記号(!\"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~)です。');
};
var author$project$Password$lengthErrorMessage = function (lengthError) {
	return function () {
		if (!lengthError) {
			return '文字数が足りません。';
		} else {
			return '文字数が多いです。';
		}
	}() + '文字数は9文字以上50文字以内である必要があります。';
};
var author$project$Password$errorMessage = function (error) {
	return elm$core$String$concat(
		function () {
			switch (error.$) {
				case 0:
					return _List_fromArray(
						[author$project$Password$allNumberErrorMessage]);
				case 1:
					var invalidCharError = error.a;
					return _List_fromArray(
						[
							author$project$Password$invalidCharErrorMessage(invalidCharError)
						]);
				case 2:
					var lengthError = error.a;
					return _List_fromArray(
						[
							author$project$Password$lengthErrorMessage(lengthError)
						]);
				case 3:
					var invalidCharError = error.a;
					var lengthError = error.b;
					return _List_fromArray(
						[
							author$project$Password$invalidCharErrorMessage(invalidCharError),
							author$project$Password$lengthErrorMessage(lengthError)
						]);
				default:
					var lengthError = error.a;
					return _List_fromArray(
						[
							author$project$Password$lengthErrorMessage(lengthError),
							author$project$Password$allNumberErrorMessage
						]);
			}
		}());
};
var author$project$Page$SignUp$passwordForm = function (passwordResult) {
	return A2(
		elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				elm$html$Html$label,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('signUp-label'),
						elm$html$Html$Attributes$for('password')
					]),
				_List_fromArray(
					[
						elm$html$Html$text('パスワード')
					])),
				A2(
				elm$html$Html$input,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('signUp-input'),
						elm$html$Html$Attributes$id('password'),
						elm$html$Html$Attributes$type_('password'),
						elm$html$Html$Attributes$minlength(9),
						elm$html$Html$Attributes$maxlength(50),
						A2(elm$html$Html$Attributes$attribute, 'autocomplete', 'new-password'),
						elm$html$Html$Events$onInput(author$project$Page$SignUp$EmitInputPassword)
					]),
				_List_Nil),
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('signUp-description')
					]),
				_List_fromArray(
					[
						elm$html$Html$text(
						function () {
							if (!passwordResult.$) {
								var password = passwordResult.a;
								return author$project$Password$toString(password);
							} else {
								var error = passwordResult.a;
								return author$project$Password$errorMessage(error);
							}
						}())
					]))
			]));
};
var author$project$Page$SignUp$newStudentForm = F3(
	function (emailAddress, imageUrlMaybe, password) {
		return _List_fromArray(
			[
				_Utils_Tuple2(
				'addressForm',
				A2(
					elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							elm$html$Html$label,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('signUp-label'),
									elm$html$Html$Attributes$for('signUpEmail')
								]),
							_List_fromArray(
								[
									elm$html$Html$text('登録用メールアドレス')
								])),
							A2(
							elm$html$Html$input,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('signUp-input'),
									elm$html$Html$Attributes$type_('email'),
									elm$html$Html$Attributes$id('signUpEmail'),
									A2(elm$html$Html$Attributes$attribute, 'autocomplete', 'email'),
									elm$html$Html$Events$onInput(author$project$Page$SignUp$EmitInputStudentIdOrEmailAddress)
								]),
							_List_Nil),
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('signUp-description')
								]),
							_List_fromArray(
								[
									elm$html$Html$text(
									function () {
										if (!emailAddress.$) {
											var address = emailAddress.a;
											return author$project$EmailAddress$toString(address) + 'に登録メールを送信します';
										} else {
											return 'メールアドレスを入力してください';
										}
									}())
								]))
						]))),
				_Utils_Tuple2(
				'passwordEmail',
				author$project$Page$SignUp$passwordForm(password)),
				_Utils_Tuple2(
				'cardImage',
				A2(
					elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							elm$html$Html$label,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('signUp-label'),
									elm$html$Html$Attributes$for('signUpImage')
								]),
							_List_fromArray(
								[
									elm$html$Html$text('学生証の写真')
								])),
							A2(
							elm$html$Html$input,
							_List_fromArray(
								[
									elm$html$Html$Attributes$type_('file'),
									elm$html$Html$Attributes$accept('image/png, image/jpeg'),
									elm$html$Html$Attributes$class('signUp-input'),
									elm$html$Html$Attributes$id('signUpImage'),
									A2(elm$html$Html$Attributes$attribute, 'autocomplete', 'studentIdImage'),
									A2(
									elm$html$Html$Events$on,
									'change',
									elm$json$Json$Decode$succeed(
										author$project$Page$SignUp$EmitInputStudentImage('signUpImage')))
								]),
							_List_Nil),
							A2(
							elm$html$Html$img,
							_Utils_ap(
								_List_fromArray(
									[
										elm$html$Html$Attributes$class('signUp-image')
									]),
								function () {
									if (!imageUrlMaybe.$) {
										var imageUrl = imageUrlMaybe.a;
										return _List_fromArray(
											[
												elm$html$Html$Attributes$src(imageUrl)
											]);
									} else {
										return _List_Nil;
									}
								}()),
							_List_Nil)
						])))
			]);
	});
var elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2(elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var elm$core$Tuple$second = function (_n0) {
	var y = _n0.b;
	return y;
};
var elm$html$Html$Attributes$classList = function (classes) {
	return elm$html$Html$Attributes$class(
		A2(
			elm$core$String$join,
			' ',
			A2(
				elm$core$List$map,
				elm$core$Tuple$first,
				A2(elm$core$List$filter, elm$core$Tuple$second, classes))));
};
var author$project$Page$SignUp$sAddressSelectView = function (userSignUpSAddressAndPassword) {
	var leftSelect = function () {
		if (!userSignUpSAddressAndPassword.$) {
			return true;
		} else {
			return false;
		}
	}();
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('signUp-select')
			]),
		_List_fromArray(
			[
				A2(
				elm$html$Html$div,
				_Utils_ap(
					_List_fromArray(
						[
							elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2('signUp-select-item', !leftSelect),
									_Utils_Tuple2('signUp-select-itemSelect', leftSelect)
								])),
							A2(elm$html$Html$Attributes$style, 'border-radius', '.4rem 0 0 .4rem')
						]),
					function () {
						if (!userSignUpSAddressAndPassword.$) {
							return _List_Nil;
						} else {
							var password = userSignUpSAddressAndPassword.a.Z;
							return _List_fromArray(
								[
									elm$html$Html$Events$onClick(
									author$project$Page$SignUp$StudentHasSAddress(
										{
											Z: password,
											L: author$project$Page$SignUp$analysisStudentIdOrSAddress('')
										}))
								]);
						}
					}()),
				_List_fromArray(
					[
						elm$html$Html$text('持っている')
					])),
				A2(
				elm$html$Html$div,
				_Utils_ap(
					_List_fromArray(
						[
							elm$html$Html$Attributes$classList(
							_List_fromArray(
								[
									_Utils_Tuple2('signUp-select-item', leftSelect),
									_Utils_Tuple2('signUp-select-itemSelect', !leftSelect)
								])),
							A2(elm$html$Html$Attributes$style, 'border-radius', '0 .4rem .4rem 0')
						]),
					function () {
						if (!userSignUpSAddressAndPassword.$) {
							var password = userSignUpSAddressAndPassword.a.Z;
							return _List_fromArray(
								[
									elm$html$Html$Events$onClick(
									author$project$Page$SignUp$NewStudent(
										{
											Q: author$project$EmailAddress$fromCharList(_List_Nil),
											S: elm$core$Maybe$Nothing,
											Z: password
										}))
								]);
						} else {
							return _List_Nil;
						}
					}()),
				_List_fromArray(
					[
						elm$html$Html$text('持っていない')
					]))
			]));
};
var author$project$Page$SignUp$sAddressView = function (userSignUpSAddressAndPassword) {
	return A2(
		elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				elm$html$Html$label,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('signUp-label')
					]),
				_List_fromArray(
					[
						elm$html$Html$text('sアドを')
					])),
				author$project$Page$SignUp$sAddressSelectView(userSignUpSAddressAndPassword)
			]));
};
var author$project$Page$SignUp$EmitSignUp = function (a) {
	return {$: 4, a: a};
};
var author$project$Page$SignUp$signUpSubmitButton = function (signUpRequestMaybe) {
	return A2(
		elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				elm$html$Html$button,
				_Utils_ap(
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('signUp-signUpButton'),
							elm$html$Html$Attributes$disabled(
							_Utils_eq(signUpRequestMaybe, elm$core$Maybe$Nothing))
						]),
					function () {
						if (!signUpRequestMaybe.$) {
							var signUpRequest = signUpRequestMaybe.a;
							return _List_fromArray(
								[
									A2(
									elm$html$Html$Events$stopPropagationOn,
									'click',
									elm$json$Json$Decode$succeed(
										_Utils_Tuple2(
											author$project$Page$SignUp$EmitSignUp(signUpRequest),
											true)))
								]);
						} else {
							return _List_Nil;
						}
					}()),
				_List_fromArray(
					[
						elm$html$Html$text('新規登録')
					]))
			]));
};
var author$project$Page$SignUp$UniversityGraduate = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$SignUp$UniversityGraduateSelect = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var author$project$Page$SignUp$signUpUniversityViewGraduateYesNoTsukuba = function (leftSelect) {
	return A2(
		elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				elm$html$Html$label,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('signUp-label')
					]),
				_List_fromArray(
					[
						elm$html$Html$text('院進前の所属')
					])),
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('signUp-select')
					]),
				_List_fromArray(
					[
						A2(
						elm$html$Html$div,
						_Utils_ap(
							_List_fromArray(
								[
									elm$html$Html$Attributes$classList(
									_List_fromArray(
										[
											_Utils_Tuple2('signUp-select-item', !leftSelect),
											_Utils_Tuple2('signUp-select-itemSelect', leftSelect)
										])),
									A2(elm$html$Html$Attributes$style, 'border-radius', '.4rem 0 0 .4rem')
								]),
							leftSelect ? _List_Nil : _List_fromArray(
								[
									elm$html$Html$Events$onClick(0)
								])),
						_List_fromArray(
							[
								elm$html$Html$text('筑波大学に所属していた')
							])),
						A2(
						elm$html$Html$div,
						_Utils_ap(
							_List_fromArray(
								[
									elm$html$Html$Attributes$classList(
									_List_fromArray(
										[
											_Utils_Tuple2('signUp-select-item', leftSelect),
											_Utils_Tuple2('signUp-select-itemSelect', !leftSelect)
										])),
									A2(elm$html$Html$Attributes$style, 'border-radius', '0 .4rem .4rem 0')
								]),
							leftSelect ? _List_fromArray(
								[
									elm$html$Html$Events$onClick(0)
								]) : _List_Nil),
						_List_fromArray(
							[
								elm$html$Html$text('筑波大学に所属していなかった')
							]))
					]))
			]));
};
var author$project$Page$SignUp$UniversitySchoolSelectSchool = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$SignUp$UniversitySchoolSelectSchoolAndDepartment = function (a) {
	return {$: 2, a: a};
};
var elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _n0 = A2(elm$core$Elm$JsArray$initializeFromList, elm$core$Array$branchFactor, list);
			var jsArray = _n0.a;
			var remainingItems = _n0.b;
			if (_Utils_cmp(
				elm$core$Elm$JsArray$length(jsArray),
				elm$core$Array$branchFactor) < 0) {
				return A2(
					elm$core$Array$builderToArray,
					true,
					{e: nodeList, b: nodeListSize, d: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					elm$core$List$cons,
					elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return elm$core$Array$empty;
	} else {
		return A3(elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var elm$core$Array$bitMask = 4294967295 >>> (32 - elm$core$Array$shiftStep);
var elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = elm$core$Array$bitMask & (index >>> shift);
			var _n0 = A2(elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_n0.$) {
				var subTree = _n0.a;
				var $temp$shift = shift - elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _n0.a;
				return A2(elm$core$Elm$JsArray$unsafeGet, elm$core$Array$bitMask & index, values);
			}
		}
	});
var elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var elm$core$Basics$ge = _Utils_ge;
var elm$core$Array$get = F2(
	function (index, _n0) {
		var len = _n0.a;
		var startShift = _n0.b;
		var tree = _n0.c;
		var tail = _n0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			elm$core$Array$tailIndex(len)) > -1) ? elm$core$Maybe$Just(
			A2(elm$core$Elm$JsArray$unsafeGet, elm$core$Array$bitMask & index, tail)) : elm$core$Maybe$Just(
			A3(elm$core$Array$getHelp, startShift, index, tree)));
	});
var elm$json$Json$Decode$int = _Json_decodeInt;
var author$project$Page$SignUp$selectDepartmentDecoder = function (school) {
	return A2(
		elm$json$Json$Decode$map,
		function (index) {
			return A2(
				elm$core$Array$get,
				index - 1,
				elm$core$Array$fromList(
					author$project$School$departmentAllValue(school)));
		},
		A2(
			elm$json$Json$Decode$at,
			_List_fromArray(
				['target', 'selectedIndex']),
			elm$json$Json$Decode$int));
};
var author$project$School$humanDepartmentToJapaneseString = function (department) {
	switch (department) {
		case 0:
			return '教育学類';
		case 1:
			return '心理学類';
		default:
			return '障害科学類';
	}
};
var author$project$School$humculDepartmentToJapaneseString = function (department) {
	switch (department) {
		case 0:
			return '人文学類';
		case 1:
			return '比較文化学類';
		default:
			return '日本語・日本文化学類';
	}
};
var author$project$School$infoDepartmentToJapaneseString = function (department) {
	switch (department) {
		case 0:
			return '情報科学類';
		case 1:
			return '情報メディア創成学類';
		default:
			return '知識情報・図書館科学類';
	}
};
var author$project$School$lifeDepartmentToJapanseString = function (department) {
	switch (department) {
		case 0:
			return '生物学類';
		case 1:
			return '生物資源学類';
		default:
			return '地球学類';
	}
};
var author$project$School$medDepartmentToJapaneseString = function (department) {
	switch (department) {
		case 0:
			return '医学類';
		case 1:
			return '看護学類';
		default:
			return '医療科学類';
	}
};
var author$project$School$schoolToJapaneseString = function (school) {
	switch (school) {
		case 0:
			return '人文・文化学群';
		case 1:
			return '社会・国際学群';
		case 2:
			return '人間学群';
		case 3:
			return '生命環境学群';
		case 4:
			return '理工学群';
		case 5:
			return '情報学群';
		case 6:
			return '医学群';
		case 7:
			return '芸術専門学群';
		default:
			return '体育専門学群';
	}
};
var author$project$School$socintDepartmentToJapaneseString = function (department) {
	if (!department) {
		return '社会学類';
	} else {
		return '国際総合学類';
	}
};
var author$project$School$sseDepartmentToJapaneseString = function (department) {
	switch (department) {
		case 0:
			return '数学類';
		case 1:
			return '物理学類';
		case 2:
			return '化学類';
		case 3:
			return '応用理工学類';
		case 4:
			return '工学システム学類';
		default:
			return '社会工学類';
	}
};
var author$project$School$schoolAndDepartmentToJapaneseString = function (schoolAndDepartment) {
	return function (_n1) {
		var s = _n1.a;
		var d = _n1.b;
		return {
			I: d,
			bd: author$project$School$schoolToJapaneseString(s)
		};
	}(
		function () {
			switch (schoolAndDepartment.$) {
				case 0:
					var humculDepartment = schoolAndDepartment.a;
					return _Utils_Tuple2(
						0,
						elm$core$Maybe$Just(
							author$project$School$humculDepartmentToJapaneseString(humculDepartment)));
				case 1:
					var socintDepartment = schoolAndDepartment.a;
					return _Utils_Tuple2(
						1,
						elm$core$Maybe$Just(
							author$project$School$socintDepartmentToJapaneseString(socintDepartment)));
				case 2:
					var humanDepartment = schoolAndDepartment.a;
					return _Utils_Tuple2(
						2,
						elm$core$Maybe$Just(
							author$project$School$humanDepartmentToJapaneseString(humanDepartment)));
				case 3:
					var lifeDepartment = schoolAndDepartment.a;
					return _Utils_Tuple2(
						3,
						elm$core$Maybe$Just(
							author$project$School$lifeDepartmentToJapanseString(lifeDepartment)));
				case 4:
					var sseDepartment = schoolAndDepartment.a;
					return _Utils_Tuple2(
						4,
						elm$core$Maybe$Just(
							author$project$School$sseDepartmentToJapaneseString(sseDepartment)));
				case 5:
					var infoDepartment = schoolAndDepartment.a;
					return _Utils_Tuple2(
						5,
						elm$core$Maybe$Just(
							author$project$School$infoDepartmentToJapaneseString(infoDepartment)));
				case 6:
					var medDepartment = schoolAndDepartment.a;
					return _Utils_Tuple2(
						6,
						elm$core$Maybe$Just(
							author$project$School$medDepartmentToJapaneseString(medDepartment)));
				case 7:
					return _Utils_Tuple2(7, elm$core$Maybe$Nothing);
				default:
					return _Utils_Tuple2(8, elm$core$Maybe$Nothing);
			}
		}());
};
var author$project$School$departmentToJapaneseString = A2(
	elm$core$Basics$composeR,
	author$project$School$schoolAndDepartmentToJapaneseString,
	function ($) {
		return $.I;
	});
var elm$html$Html$option = _VirtualDom_node('option');
var elm$html$Html$select = _VirtualDom_node('select');
var author$project$Page$SignUp$signUpUniversityViewSelectDepartment = function (school) {
	var _n0 = author$project$School$departmentAllValue(school);
	if (!_n0.b) {
		return elm$core$Maybe$Nothing;
	} else {
		var departmentList = _n0;
		return elm$core$Maybe$Just(
			A2(
				elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						elm$html$Html$label,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('signUp-label'),
								elm$html$Html$Attributes$for('signUp-selectDepartment')
							]),
						_List_fromArray(
							[
								elm$html$Html$text('学類')
							])),
						A2(
						elm$html$Html$select,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('signUp-menu'),
								elm$html$Html$Attributes$id('signUp-selectDepartment'),
								A2(
								elm$html$Html$Events$on,
								'change',
								author$project$Page$SignUp$selectDepartmentDecoder(school))
							]),
						_Utils_ap(
							_List_fromArray(
								[
									A2(
									elm$html$Html$option,
									_List_Nil,
									_List_fromArray(
										[
											elm$html$Html$text('--選択してください--')
										]))
								]),
							A2(
								elm$core$List$map,
								function (s) {
									return A2(
										elm$html$Html$option,
										_List_Nil,
										_List_fromArray(
											[
												elm$html$Html$text(
												A2(
													elm$core$Maybe$withDefault,
													'?',
													author$project$School$departmentToJapaneseString(s)))
											]));
								},
								departmentList)))
					])));
	}
};
var author$project$Page$SignUp$selectSchoolDecoder = A2(
	elm$json$Json$Decode$map,
	function (index) {
		return A2(
			elm$core$Array$get,
			index - 1,
			elm$core$Array$fromList(author$project$School$schoolAllValue));
	},
	A2(
		elm$json$Json$Decode$at,
		_List_fromArray(
			['target', 'selectedIndex']),
		elm$json$Json$Decode$int));
var author$project$Page$SignUp$signUpUniversityViewSelectSchool = A2(
	elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			elm$html$Html$label,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('signUp-label'),
					elm$html$Html$Attributes$for('signUp-selectSchool')
				]),
			_List_fromArray(
				[
					elm$html$Html$text('学群')
				])),
			A2(
			elm$html$Html$select,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('signUp-menu'),
					elm$html$Html$Attributes$id('signUp-selectSchool'),
					A2(elm$html$Html$Events$on, 'change', author$project$Page$SignUp$selectSchoolDecoder)
				]),
			_Utils_ap(
				_List_fromArray(
					[
						A2(
						elm$html$Html$option,
						_List_Nil,
						_List_fromArray(
							[
								elm$html$Html$text('--選択してください--')
							]))
					]),
				A2(
					elm$core$List$map,
					function (s) {
						return A2(
							elm$html$Html$option,
							_List_Nil,
							_List_fromArray(
								[
									elm$html$Html$text(
									author$project$School$schoolToJapaneseString(s))
								]));
					},
					author$project$School$schoolAllValue)))
		]));
var author$project$School$departmentToSchool = function (schoolAndDepartment) {
	switch (schoolAndDepartment.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		case 3:
			return 3;
		case 4:
			return 4;
		case 5:
			return 5;
		case 6:
			return 6;
		case 7:
			return 7;
		default:
			return 8;
	}
};
var author$project$School$DAandd = {$: 7};
var author$project$School$DSport = {$: 8};
var author$project$School$schoolToOnlyOneDepartment = function (school) {
	switch (school) {
		case 7:
			return elm$core$Maybe$Just(author$project$School$DAandd);
		case 8:
			return elm$core$Maybe$Just(author$project$School$DSport);
		default:
			return elm$core$Maybe$Nothing;
	}
};
var elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var elm$html$Html$map = elm$virtual_dom$VirtualDom$map;
var author$project$Page$SignUp$signUpUniversityViewSchool = function (schoolSelect) {
	var schoolView = _Utils_Tuple2(
		'selectSchool',
		A2(
			elm$html$Html$map,
			function (m) {
				if (!m.$) {
					var school = m.a;
					var _n6 = author$project$School$schoolToOnlyOneDepartment(school);
					if (!_n6.$) {
						var schoolAndDepartment = _n6.a;
						return author$project$Page$SignUp$UniversitySchoolSelectSchoolAndDepartment(schoolAndDepartment);
					} else {
						return author$project$Page$SignUp$UniversitySchoolSelectSchool(school);
					}
				} else {
					return author$project$Page$SignUp$UniversitySchoolNone;
				}
			},
			author$project$Page$SignUp$signUpUniversityViewSelectSchool));
	var departmentSelectView = function (school) {
		var _n3 = author$project$Page$SignUp$signUpUniversityViewSelectDepartment(school);
		if (!_n3.$) {
			var v = _n3.a;
			return elm$core$Maybe$Just(
				_Utils_Tuple2(
					's=' + author$project$School$schoolToIdString(school),
					A2(
						elm$html$Html$map,
						function (m) {
							if (!m.$) {
								var z = m.a;
								return author$project$Page$SignUp$UniversitySchoolSelectSchoolAndDepartment(z);
							} else {
								return author$project$Page$SignUp$UniversitySchoolSelectSchool(school);
							}
						},
						v)));
		} else {
			return elm$core$Maybe$Nothing;
		}
	};
	switch (schoolSelect.$) {
		case 0:
			return _List_fromArray(
				[schoolView]);
		case 1:
			var school = schoolSelect.a;
			var _n1 = departmentSelectView(school);
			if (!_n1.$) {
				var departV = _n1.a;
				return _List_fromArray(
					[schoolView, departV]);
			} else {
				return _List_fromArray(
					[schoolView]);
			}
		default:
			var department = schoolSelect.a;
			var _n2 = departmentSelectView(
				author$project$School$departmentToSchool(department));
			if (!_n2.$) {
				var departV = _n2.a;
				return _List_fromArray(
					[schoolView, departV]);
			} else {
				return _List_fromArray(
					[schoolView]);
			}
	}
};
var author$project$School$GChs = 6;
var author$project$School$GEducation = 0;
var author$project$School$GGabs = 2;
var author$project$School$GGlobal = 8;
var author$project$School$GHass = 1;
var author$project$School$GLife = 5;
var author$project$School$GPas = 3;
var author$project$School$GSie = 4;
var author$project$School$GSlis = 7;
var author$project$School$graduateAllValue = _List_fromArray(
	[0, 1, 2, 3, 4, 5, 6, 7, 8]);
var author$project$Page$SignUp$selectGraduateDecoder = A2(
	elm$json$Json$Decode$map,
	function (index) {
		return A2(
			elm$core$Array$get,
			index - 1,
			elm$core$Array$fromList(author$project$School$graduateAllValue));
	},
	A2(
		elm$json$Json$Decode$at,
		_List_fromArray(
			['target', 'selectedIndex']),
		elm$json$Json$Decode$int));
var author$project$School$graduateToJapaneseString = function (gradate) {
	switch (gradate) {
		case 0:
			return '教育研究科';
		case 1:
			return '人文社会科学研究科';
		case 2:
			return 'ビジネス科学研究科';
		case 3:
			return '数理物質科学研究科';
		case 4:
			return 'システム情報工学研究科';
		case 5:
			return '生命環境科学研究科';
		case 6:
			return '人間総合科学研究科';
		case 7:
			return '図書館情報メディア研究科';
		default:
			return 'グローバル研究院';
	}
};
var author$project$Page$SignUp$signUpUniversityViewSelectGraduate = A2(
	elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			elm$html$Html$label,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('signUp-label'),
					elm$html$Html$Attributes$for('signUp-selectGraduate')
				]),
			_List_fromArray(
				[
					elm$html$Html$text('研究科')
				])),
			A2(
			elm$html$Html$select,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('signUp-menu'),
					elm$html$Html$Attributes$id('signUp-selectGraduate'),
					A2(elm$html$Html$Events$on, 'change', author$project$Page$SignUp$selectGraduateDecoder)
				]),
			_Utils_ap(
				_List_fromArray(
					[
						A2(
						elm$html$Html$option,
						_List_Nil,
						_List_fromArray(
							[
								elm$html$Html$text('--選択してください--')
							]))
					]),
				A2(
					elm$core$List$map,
					function (s) {
						return A2(
							elm$html$Html$option,
							_List_Nil,
							_List_fromArray(
								[
									elm$html$Html$text(
									author$project$School$graduateToJapaneseString(s))
								]));
					},
					author$project$School$graduateAllValue)))
		]));
var author$project$Page$SignUp$signUpUniversityViewGraduate = function (univAndGraduateSelect) {
	var _n0 = univAndGraduateSelect;
	var graduateSelect = _n0.a;
	var schoolSelect = _n0.b;
	return _Utils_ap(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'selectGraduate',
				A2(
					elm$html$Html$map,
					function (g) {
						return A2(author$project$Page$SignUp$UniversityGraduateSelect, g, schoolSelect);
					},
					author$project$Page$SignUp$signUpUniversityViewSelectGraduate)),
				_Utils_Tuple2(
				'tsukubaUniversitySchoolOrNo',
				A2(
					elm$html$Html$map,
					elm$core$Basics$always(
						A2(
							author$project$Page$SignUp$UniversityGraduateSelect,
							graduateSelect,
							function () {
								if (!schoolSelect.$) {
									return elm$core$Maybe$Nothing;
								} else {
									return elm$core$Maybe$Just(author$project$Page$SignUp$UniversitySchoolNone);
								}
							}())),
					author$project$Page$SignUp$signUpUniversityViewGraduateYesNoTsukuba(
						!_Utils_eq(schoolSelect, elm$core$Maybe$Nothing))))
			]),
		function () {
			if (!schoolSelect.$) {
				var school = schoolSelect.a;
				return A2(
					elm$core$List$map,
					elm$core$Tuple$mapSecond(
						elm$html$Html$map(
							function (s) {
								return A2(
									author$project$Page$SignUp$UniversityGraduateSelect,
									graduateSelect,
									elm$core$Maybe$Just(s));
							})),
					author$project$Page$SignUp$signUpUniversityViewSchool(school));
			} else {
				return _List_Nil;
			}
		}());
};
var author$project$Page$SignUp$signUpUniversityViewSchoolOrGraduate = function (university) {
	var leftSelect = function () {
		if (!university.$) {
			return true;
		} else {
			return false;
		}
	}();
	return A2(
		elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				elm$html$Html$label,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('signUp-label')
					]),
				_List_fromArray(
					[
						elm$html$Html$text('所属')
					])),
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('signUp-select')
					]),
				_List_fromArray(
					[
						A2(
						elm$html$Html$div,
						_Utils_ap(
							_List_fromArray(
								[
									elm$html$Html$Attributes$classList(
									_List_fromArray(
										[
											_Utils_Tuple2('signUp-select-item', !leftSelect),
											_Utils_Tuple2('signUp-select-itemSelect', leftSelect)
										])),
									A2(elm$html$Html$Attributes$style, 'border-radius', '.4rem 0 0 .4rem')
								]),
							function () {
								if (!university.$) {
									return _List_Nil;
								} else {
									return _List_fromArray(
										[
											elm$html$Html$Events$onClick(
											author$project$Page$SignUp$UniversitySchool(author$project$Page$SignUp$UniversitySchoolNone))
										]);
								}
							}()),
						_List_fromArray(
							[
								elm$html$Html$text('学群生')
							])),
						A2(
						elm$html$Html$div,
						_Utils_ap(
							_List_fromArray(
								[
									elm$html$Html$Attributes$classList(
									_List_fromArray(
										[
											_Utils_Tuple2('signUp-select-item', leftSelect),
											_Utils_Tuple2('signUp-select-itemSelect', !leftSelect)
										])),
									A2(elm$html$Html$Attributes$style, 'border-radius', '0 .4rem .4rem 0')
								]),
							function () {
								if (!university.$) {
									return _List_fromArray(
										[
											elm$html$Html$Events$onClick(
											author$project$Page$SignUp$UniversityGraduate(
												A2(
													author$project$Page$SignUp$UniversityGraduateSelect,
													elm$core$Maybe$Nothing,
													elm$core$Maybe$Just(author$project$Page$SignUp$UniversitySchoolNone))))
										]);
								} else {
									return _List_Nil;
								}
							}()),
						_List_fromArray(
							[
								elm$html$Html$text('院生')
							]))
					]))
			]));
};
var author$project$Page$SignUp$signUpUniversityView = function (signUpSchool) {
	return _Utils_ap(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'schoolOrGraduate',
				author$project$Page$SignUp$signUpUniversityViewSchoolOrGraduate(signUpSchool))
			]),
		function () {
			if (!signUpSchool.$) {
				var schoolSelect = signUpSchool.a;
				return A2(
					elm$core$List$map,
					elm$core$Tuple$mapSecond(
						elm$html$Html$map(author$project$Page$SignUp$UniversitySchool)),
					author$project$Page$SignUp$signUpUniversityViewSchool(schoolSelect));
			} else {
				var graduateSelect = signUpSchool.a;
				return A2(
					elm$core$List$map,
					elm$core$Tuple$mapSecond(
						elm$html$Html$map(author$project$Page$SignUp$UniversityGraduate)),
					author$project$Page$SignUp$signUpUniversityViewGraduate(graduateSelect));
			}
		}());
};
var elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2(elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var elm$core$List$repeat = F2(
	function (n, value) {
		return A3(elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2(elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var elm$core$List$takeTailRec = F2(
	function (n, list) {
		return elm$core$List$reverse(
			A3(elm$core$List$takeReverse, n, list, _List_Nil));
	});
var elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _n0 = _Utils_Tuple2(n, list);
			_n0$1:
			while (true) {
				_n0$5:
				while (true) {
					if (!_n0.b.b) {
						return list;
					} else {
						if (_n0.b.b.b) {
							switch (_n0.a) {
								case 1:
									break _n0$1;
								case 2:
									var _n2 = _n0.b;
									var x = _n2.a;
									var _n3 = _n2.b;
									var y = _n3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_n0.b.b.b.b) {
										var _n4 = _n0.b;
										var x = _n4.a;
										var _n5 = _n4.b;
										var y = _n5.a;
										var _n6 = _n5.b;
										var z = _n6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _n0$5;
									}
								default:
									if (_n0.b.b.b.b && _n0.b.b.b.b.b) {
										var _n7 = _n0.b;
										var x = _n7.a;
										var _n8 = _n7.b;
										var y = _n8.a;
										var _n9 = _n8.b;
										var z = _n9.a;
										var _n10 = _n9.b;
										var w = _n10.a;
										var tl = _n10.b;
										return (ctr > 1000) ? A2(
											elm$core$List$cons,
											x,
											A2(
												elm$core$List$cons,
												y,
												A2(
													elm$core$List$cons,
													z,
													A2(
														elm$core$List$cons,
														w,
														A2(elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											elm$core$List$cons,
											x,
											A2(
												elm$core$List$cons,
												y,
												A2(
													elm$core$List$cons,
													z,
													A2(
														elm$core$List$cons,
														w,
														A3(elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _n0$5;
									}
							}
						} else {
							if (_n0.a === 1) {
								break _n0$1;
							} else {
								break _n0$5;
							}
						}
					}
				}
				return list;
			}
			var _n1 = _n0.b;
			var x = _n1.a;
			return _List_fromArray(
				[x]);
		}
	});
var elm$core$List$take = F2(
	function (n, list) {
		return A3(elm$core$List$takeFast, 0, n, list);
	});
var author$project$StudentId$listGrow = F2(
	function (length, list) {
		var listLength = elm$core$List$length(list);
		return (_Utils_cmp(length, listLength) < 0) ? A2(
			elm$core$List$map,
			elm$core$Maybe$Just,
			A2(elm$core$List$take, length, list)) : _Utils_ap(
			A2(elm$core$List$map, elm$core$Maybe$Just, list),
			A2(elm$core$List$repeat, length - listLength, elm$core$Maybe$Nothing));
	});
var author$project$StudentId$partStudentIdToString = function (partStudentId) {
	return elm$core$String$fromList(
		A2(
			elm$core$List$map,
			function (numMaybe) {
				return A2(
					elm$core$Maybe$withDefault,
					'?',
					A2(elm$core$Maybe$map, author$project$StudentId$digitToChar, numMaybe));
			},
			A2(
				author$project$StudentId$listGrow,
				7,
				function () {
					switch (partStudentId.$) {
						case 0:
							return _List_Nil;
						case 1:
							var i0 = partStudentId.a;
							return _List_fromArray(
								[i0]);
						case 2:
							var i0 = partStudentId.a;
							var i1 = partStudentId.b;
							return _List_fromArray(
								[i0, i1]);
						case 3:
							var i0 = partStudentId.a;
							var i1 = partStudentId.b;
							var i2 = partStudentId.c;
							return _List_fromArray(
								[i0, i1, i2]);
						case 4:
							var i0 = partStudentId.a;
							var i1 = partStudentId.b;
							var i2 = partStudentId.c;
							var i3 = partStudentId.d;
							return _List_fromArray(
								[i0, i1, i2, i3]);
						case 5:
							var i0 = partStudentId.a;
							var i1 = partStudentId.b;
							var i2 = partStudentId.c;
							var i3 = partStudentId.d;
							var i4 = partStudentId.e;
							return _List_fromArray(
								[i0, i1, i2, i3, i4]);
						default:
							var i0 = partStudentId.a;
							var i1 = partStudentId.b;
							var i2 = partStudentId.c;
							var i3 = partStudentId.d;
							var i4 = partStudentId.e;
							var i5 = partStudentId.f;
							return _List_fromArray(
								[i0, i1, i2, i3, i4, i5]);
					}
				}())));
};
var author$project$StudentId$partStudentIdToStringWith20 = function (partStudentId) {
	return '20' + author$project$StudentId$partStudentIdToString(partStudentId);
};
var author$project$Page$SignUp$studentHasSAddressFormList = F2(
	function (analysisStudentIdOrEmailAddressResult, password) {
		return _List_fromArray(
			[
				_Utils_Tuple2(
				'sAddressFrom',
				A2(
					elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							elm$html$Html$label,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('signUp-label'),
									elm$html$Html$Attributes$for('signUpStudentIdOrTsukubaEmail')
								]),
							_List_fromArray(
								[
									elm$html$Html$text('学籍番号か ～@～.tsukuba.ac.jpのメールアドレス')
								])),
							A2(
							elm$html$Html$input,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('signUp-input'),
									elm$html$Html$Attributes$id('signUpStudentIdOrTsukubaEmail'),
									A2(elm$html$Html$Attributes$attribute, 'autocomplete', 'username'),
									elm$html$Html$Events$onInput(author$project$Page$SignUp$EmitInputStudentIdOrEmailAddress)
								]),
							_List_Nil),
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('signUp-description')
								]),
							_List_fromArray(
								[
									elm$html$Html$text(
									function () {
										switch (analysisStudentIdOrEmailAddressResult.$) {
											case 0:
												return '学籍番号は20から始まる9桁の数字、筑波大学のメールアドレスはs1234567@s.tsukuba.ac.jpのような形のメールアドレス';
											case 1:
												var studentId = analysisStudentIdOrEmailAddressResult.a;
												return '学籍番号 ' + (author$project$StudentId$toStringWith20(studentId) + (' ' + (author$project$EmailAddress$toString(
													author$project$EmailAddress$fromSAddress(
														author$project$SAddress$fromStundetId(studentId))) + 'にメールを送信します')));
											case 3:
												var partStudentId = analysisStudentIdOrEmailAddressResult.a;
												return '学籍番号 ' + author$project$StudentId$partStudentIdToStringWith20(partStudentId);
											case 2:
												var sAddress = analysisStudentIdOrEmailAddressResult.a;
												return '筑波大学のメールアドレス ' + author$project$SAddress$toEmailAddressString(sAddress);
											default:
												return '筑波大学のメールアドレスではありません';
										}
									}())
								]))
						]))),
				_Utils_Tuple2(
				'sAddressPassword',
				author$project$Page$SignUp$passwordForm(password))
			]);
	});
var elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var elm$html$Html$Keyed$node = elm$virtual_dom$VirtualDom$keyedNode;
var author$project$Page$SignUp$normalView = F2(
	function (sAddressAndPassword, university) {
		return A3(
			elm$html$Html$Keyed$node,
			'form',
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('signUp')
				]),
			_Utils_ap(
				_List_fromArray(
					[
						_Utils_Tuple2(
						's_or_nos',
						A2(
							elm$html$Html$map,
							function (s) {
								return author$project$Page$SignUp$EmitChangePage(
									author$project$Page$SignUp$Normal(
										{k: s, aU: university}));
							},
							author$project$Page$SignUp$sAddressView(sAddressAndPassword)))
					]),
				_Utils_ap(
					function () {
						if (!sAddressAndPassword.$) {
							var studentIdOrTsukubaEmailAddress = sAddressAndPassword.a.L;
							var password = sAddressAndPassword.a.Z;
							return A2(author$project$Page$SignUp$studentHasSAddressFormList, studentIdOrTsukubaEmailAddress, password);
						} else {
							var emailAddress = sAddressAndPassword.a.Q;
							var imageUrl = sAddressAndPassword.a.S;
							var password = sAddressAndPassword.a.Z;
							return A3(author$project$Page$SignUp$newStudentForm, emailAddress, imageUrl, password);
						}
					}(),
					_Utils_ap(
						A2(
							elm$core$List$map,
							elm$core$Tuple$mapSecond(
								elm$html$Html$map(
									function (s) {
										return author$project$Page$SignUp$EmitChangePage(
											author$project$Page$SignUp$Normal(
												{k: sAddressAndPassword, aU: s}));
									})),
							author$project$Page$SignUp$signUpUniversityView(university)),
						_Utils_ap(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'submit',
									author$project$Page$SignUp$signUpSubmitButton(
										A2(author$project$Page$SignUp$getSignUpRequest, sAddressAndPassword, university)))
								]),
							_List_fromArray(
								[
									_Utils_Tuple2(
									'deleteAllUser',
									A2(
										elm$html$Html$button,
										_List_fromArray(
											[
												A2(
												elm$html$Html$Events$preventDefaultOn,
												'click',
												elm$json$Json$Decode$succeed(
													_Utils_Tuple2(author$project$Page$SignUp$EmitDeleteUserAll, true)))
											]),
										_List_fromArray(
											[
												elm$html$Html$text('すべてのユーザーを削除')
											])))
								]))))));
	});
var author$project$Page$SignUp$sentConfirmTokenView = function (signUpResponseErrorMaybe) {
	return elm$html$Html$text(
		function () {
			if (!signUpResponseErrorMaybe.$) {
				if (!signUpResponseErrorMaybe.a) {
					var _n1 = signUpResponseErrorMaybe.a;
					return 'すでにこの認証トークンは送られています';
				} else {
					var _n2 = signUpResponseErrorMaybe.a;
					return '認証トークン送信に予期せぬエラーが発生しました';
				}
			} else {
				return '認証トークン送信中……';
			}
		}());
};
var author$project$Page$SignUp$EmitSendConfirmToken = function (a) {
	return {$: 5, a: a};
};
var author$project$Page$SignUp$signUpResultToString = F2(
	function (emailAddress, signUpResult) {
		if (!signUpResult.$) {
			var token = signUpResult.a;
			return A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('signUp')
					]),
				_List_fromArray(
					[
						elm$html$Html$text(
						'送信完了。' + (author$project$EmailAddress$toString(emailAddress) + ('にメールを送信しました。届いたメールのリンクをクリックして認証をしてください' + ('token = \"' + (token + '\"'))))),
						A2(
						elm$html$Html$div,
						_List_fromArray(
							[
								elm$html$Html$Events$onClick(
								author$project$Page$SignUp$EmitSendConfirmToken(token)),
								A2(elm$html$Html$Attributes$style, 'border', 'solid 2px black'),
								A2(elm$html$Html$Attributes$style, 'padding', '4px')
							]),
						_List_fromArray(
							[
								elm$html$Html$text('confirm_tokenを送信')
							]))
					]));
		} else {
			switch (signUpResult.a) {
				case 0:
					var _n1 = signUpResult.a;
					return A2(
						elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								elm$html$Html$text('すでにあなたは登録されています')
							]));
				case 1:
					var _n2 = signUpResult.a;
					return A2(
						elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								elm$html$Html$text('正しいURLが指定されなかった')
							]));
				case 2:
					var _n3 = signUpResult.a;
					return A2(
						elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								elm$html$Html$text('タイムアウトエラー。回線が混雑しています')
							]));
				case 3:
					var _n4 = signUpResult.a;
					return A2(
						elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								elm$html$Html$text('ネットワークエラー。接続が切れている可能性があります')
							]));
				case 4:
					var _n5 = signUpResult.a;
					return A2(
						elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								elm$html$Html$text('不正なリクエストをした疑いがあります')
							]));
				default:
					var _n6 = signUpResult.a;
					return A2(
						elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								elm$html$Html$text('サーバーの回答を理解することができませんでした')
							]));
			}
		}
	});
var author$project$Page$SignUp$sentSingUpDataView = F2(
	function (emailAddress, signUpResultMaybe) {
		if (!signUpResultMaybe.$) {
			var signUpResult = signUpResultMaybe.a;
			return A2(author$project$Page$SignUp$signUpResultToString, emailAddress, signUpResult);
		} else {
			return A2(
				elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						elm$html$Html$text('新規登録の情報を送信中')
					]));
		}
	});
var author$project$Page$SignUp$view = function (userSignUpPage) {
	var _n0 = function () {
		switch (userSignUpPage.$) {
			case 0:
				var sAddressAndPassword = userSignUpPage.a.k;
				var university = userSignUpPage.a.aU;
				return _Utils_Tuple2(
					'新規登録',
					A2(author$project$Page$SignUp$normalView, sAddressAndPassword, university));
			case 1:
				var emailAddress = userSignUpPage.a;
				var maybe = userSignUpPage.b;
				return _Utils_Tuple2(
					'新規登録情報の送信',
					A2(author$project$Page$SignUp$sentSingUpDataView, emailAddress, maybe));
			case 2:
				var signUpConfirmResponseErrorMaybe = userSignUpPage.a;
				return _Utils_Tuple2(
					'認証トークンの送信',
					author$project$Page$SignUp$sentConfirmTokenView(signUpConfirmResponseErrorMaybe));
			default:
				var result = userSignUpPage.a;
				return _Utils_Tuple2(
					'すべてのユーザーの削除',
					elm$html$Html$text(
						'すべてのユーザーの削除処理を' + (result ? '成功した' : '失敗した')));
		}
	}();
	var tabText = _n0.a;
	var mainView = _n0.b;
	return _Utils_Tuple2(
		author$project$Tab$Single(tabText),
		_List_fromArray(
			[
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('signUpContainer')
					]),
				_List_fromArray(
					[mainView]))
			]));
};
var author$project$Tab$None = {$: 2};
var author$project$Tab$map = F2(
	function (f, tab) {
		switch (tab.$) {
			case 0:
				var list = tab.a;
				var selectIndex = tab.b;
				return A2(
					author$project$Tab$Multi,
					A2(
						elm$core$List$map,
						elm$core$Tuple$mapFirst(f),
						list),
					selectIndex);
			case 1:
				var string = tab.a;
				return author$project$Tab$Single(string);
			default:
				return author$project$Tab$None;
		}
	});
var author$project$Tab$itemView = F3(
	function (isSelected, label, clickEventMaybe) {
		return A2(
			elm$html$Html$div,
			function () {
				if (isSelected) {
					return _List_fromArray(
						[
							elm$html$Html$Attributes$class('mainTab-item-select')
						]);
				} else {
					if (!clickEventMaybe.$) {
						var clickEvent = clickEventMaybe.a;
						return _List_fromArray(
							[
								elm$html$Html$Attributes$class('mainTab-item'),
								elm$html$Html$Events$onClick(clickEvent)
							]);
					} else {
						return _List_fromArray(
							[
								elm$html$Html$Attributes$class('mainTab-item')
							]);
					}
				}
			}(),
			_List_fromArray(
				[
					elm$html$Html$text(label)
				]));
	});
var author$project$Tab$selectLineView = F2(
	function (index, count) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('mainTab-selectLineArea')
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('mainTab-selectLine'),
							A2(
							elm$html$Html$Attributes$style,
							'left',
							'calc( 100% /' + (elm$core$String$fromInt(count) + (' * ' + (elm$core$String$fromInt(index) + ')')))),
							A2(
							elm$html$Html$Attributes$style,
							'width',
							'calc( 100% / ' + (elm$core$String$fromInt(count) + ')'))
						]),
					_List_Nil)
				]));
	});
var author$project$Tab$toCount = function (tab) {
	switch (tab.$) {
		case 0:
			var list = tab.a;
			return elm$core$List$length(list);
		case 1:
			return 1;
		default:
			return 0;
	}
};
var author$project$Tab$view = F2(
	function (isWideScreenMode, tabData) {
		return A2(
			elm$html$Html$div,
			_Utils_ap(
				_List_fromArray(
					[
						elm$html$Html$Attributes$classList(
						_List_fromArray(
							[
								_Utils_Tuple2('mainTab', true),
								_Utils_Tuple2('mainTab-wide', isWideScreenMode)
							]))
					]),
				function () {
					if (tabData.$ === 2) {
						return _List_fromArray(
							[
								A2(elm$html$Html$Attributes$style, 'height', '0')
							]);
					} else {
						return _List_fromArray(
							[
								A2(
								elm$html$Html$Attributes$style,
								'grid-template-columns',
								A2(
									elm$core$String$join,
									' ',
									A2(
										elm$core$List$repeat,
										author$project$Tab$toCount(tabData),
										'1fr'))),
								A2(elm$html$Html$Attributes$style, 'height', '3rem')
							]);
					}
				}()),
			function () {
				switch (tabData.$) {
					case 0:
						var tabList = tabData.a;
						var selectIndex = tabData.b;
						return _Utils_ap(
							A2(
								elm$core$List$indexedMap,
								F2(
									function (index, _n2) {
										var tab = _n2.a;
										var label = _n2.b;
										return A3(
											author$project$Tab$itemView,
											_Utils_eq(index, selectIndex),
											label,
											elm$core$Maybe$Just(tab));
									}),
								tabList),
							_List_fromArray(
								[
									A2(
									author$project$Tab$selectLineView,
									selectIndex,
									elm$core$List$length(tabList))
								]));
					case 1:
						var label = tabData.a;
						return _List_fromArray(
							[
								A3(author$project$Tab$itemView, true, label, elm$core$Maybe$Nothing),
								A2(author$project$Tab$selectLineView, 0, 1)
							]);
					default:
						return _List_Nil;
				}
			}());
	});
var author$project$Main$mainViewAndMainTab = F2(
	function (page, isWideScreenMode) {
		var _n0 = function () {
			switch (page.$) {
				case 0:
					var subPage = page.a;
					return A2(
						elm$core$Tuple$mapFirst,
						author$project$Tab$map(author$project$Main$PageHome),
						A2(author$project$Main$homeView, isWideScreenMode, subPage));
				case 6:
					var subPage = page.a;
					return A2(
						elm$core$Tuple$mapFirst,
						author$project$Tab$map(elm$core$Basics$never),
						author$project$Main$exhibitionView(subPage));
				case 3:
					var subPage = page.a;
					return A2(
						elm$core$Tuple$mapFirst,
						author$project$Tab$map(author$project$Main$PageLikeAndHistory),
						A2(author$project$Main$likeAndHistoryView, isWideScreenMode, subPage));
				case 5:
					return _Utils_Tuple2(
						author$project$Tab$Single('購入した商品'),
						_List_fromArray(
							[
								author$project$Main$itemList(isWideScreenMode)
							]));
				case 4:
					return _Utils_Tuple2(
						author$project$Tab$Single('出品した商品'),
						_List_fromArray(
							[
								author$project$Main$itemList(isWideScreenMode)
							]));
				case 1:
					var signUpPageModel = page.a;
					return function (_n2) {
						var t = _n2.a;
						var v = _n2.b;
						return _Utils_Tuple2(
							A2(author$project$Tab$map, elm$core$Basics$never, t),
							A2(
								elm$core$List$map,
								elm$html$Html$map(author$project$Main$signUpPageEmitToMsg),
								v));
					}(
						author$project$Page$SignUp$view(signUpPageModel));
				case 2:
					var _n3 = page.a;
					var logInPageModel = _n3.a;
					var pageMaybe = _n3.b;
					return _Utils_Tuple2(
						author$project$Tab$Single('ログイン'),
						A2(
							elm$core$List$map,
							elm$html$Html$map(
								author$project$Main$logInPageEmitToMsg(pageMaybe)),
							author$project$Page$LogIn$view(logInPageModel)));
				case 7:
					var goods = page.a;
					return _Utils_Tuple2(
						author$project$Tab$None,
						author$project$Main$goodsView(goods));
				default:
					return A2(
						elm$core$Tuple$mapFirst,
						author$project$Tab$map(elm$core$Basics$never),
						author$project$Main$siteMapXmlView);
			}
		}();
		var tabData = _n0.a;
		var mainView = _n0.b;
		return _List_fromArray(
			[
				A2(
				elm$html$Html$map,
				author$project$Main$ChangePage,
				A2(author$project$Tab$view, isWideScreenMode, tabData)),
				A2(
				elm$html$Html$div,
				function () {
					if (tabData.$ === 2) {
						return _List_fromArray(
							[
								elm$html$Html$Attributes$classList(
								_List_fromArray(
									[
										_Utils_Tuple2('mainView-noMainTab', true),
										_Utils_Tuple2('mainView-wide-noMainTab', isWideScreenMode)
									]))
							]);
					} else {
						return _List_fromArray(
							[
								elm$html$Html$Attributes$classList(
								_List_fromArray(
									[
										_Utils_Tuple2('mainView', true),
										_Utils_Tuple2('mainView-wide', isWideScreenMode)
									]))
							]);
					}
				}(),
				mainView)
			]);
	});
var author$project$Main$CloseMenu = {$: 2};
var author$project$SiteMap$logInUrl = '/user-login';
var author$project$Main$menuAccount = function (logInState) {
	if (!logInState.$) {
		var profile = logInState.a.U;
		return _List_fromArray(
			[
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('menu-noLogin')
					]),
				_List_fromArray(
					[
						elm$html$Html$text('ログイン済み')
					])),
				A2(
				elm$html$Html$div,
				_List_Nil,
				function () {
					if (!profile.$) {
						var introduction = profile.a.a5;
						var department = profile.a.I;
						return _Utils_ap(
							_List_fromArray(
								[
									A2(
									elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											elm$html$Html$text('紹介文:' + introduction)
										])),
									A2(
									elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											elm$html$Html$text(
											'学群:' + author$project$School$schoolToJapaneseString(
												author$project$School$departmentToSchool(department)))
										]))
								]),
							function () {
								var _n2 = author$project$School$departmentToJapaneseString(department);
								if (!_n2.$) {
									var departmentText = _n2.a;
									return _List_fromArray(
										[
											A2(
											elm$html$Html$div,
											_List_Nil,
											_List_fromArray(
												[
													elm$html$Html$text('学類:' + departmentText)
												]))
										]);
								} else {
									return _List_Nil;
								}
							}());
					} else {
						return _List_Nil;
					}
				}())
			]);
	} else {
		return _List_fromArray(
			[
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('menu-noLogin')
					]),
				_List_fromArray(
					[
						elm$html$Html$text('ログインしていません')
					])),
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('menu-logInsignUpButtonContainer')
					]),
				_List_fromArray(
					[
						A2(
						elm$html$Html$a,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('menu-logInButton'),
								elm$html$Html$Attributes$href(author$project$SiteMap$logInUrl)
							]),
						_List_fromArray(
							[
								elm$html$Html$text('ログイン')
							])),
						A2(
						elm$html$Html$a,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('menu-signUpButton'),
								elm$html$Html$Attributes$href(author$project$SiteMap$signUpUrl)
							]),
						_List_fromArray(
							[
								elm$html$Html$text('新規登録')
							]))
					]))
			]);
	}
};
var author$project$SiteMap$exhibitionGoodsUrl = '/exhibition-item';
var author$project$SiteMap$likeHistoryUrl = '/like-history';
var author$project$SiteMap$purchaseGoodsUrl = '/purchase-item';
var author$project$Main$menuMain = function (logInState) {
	return _List_fromArray(
		[
			A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('menu-account')
				]),
			author$project$Main$menuAccount(logInState)),
			A2(
			elm$html$Html$a,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('menu-item'),
					elm$html$Html$Attributes$href(author$project$SiteMap$homeUrl)
				]),
			_List_fromArray(
				[
					elm$html$Html$text('ホーム')
				])),
			A2(
			elm$html$Html$a,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('menu-item'),
					elm$html$Html$Attributes$href(author$project$SiteMap$likeHistoryUrl)
				]),
			_List_fromArray(
				[
					elm$html$Html$text('いいね・閲覧した商品')
				])),
			A2(
			elm$html$Html$a,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('menu-item'),
					elm$html$Html$Attributes$href(author$project$SiteMap$exhibitionGoodsUrl)
				]),
			_List_fromArray(
				[
					elm$html$Html$text('出品した商品')
				])),
			A2(
			elm$html$Html$a,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('menu-item'),
					elm$html$Html$Attributes$href(author$project$SiteMap$purchaseGoodsUrl)
				]),
			_List_fromArray(
				[
					elm$html$Html$text('購入した商品')
				]))
		]);
};
var author$project$Main$menuView = F2(
	function (logInState, menuStateMaybe) {
		if (!menuStateMaybe.$) {
			var menuState = menuStateMaybe.a;
			return A3(
				elm$html$Html$Keyed$node,
				'div',
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('menu')
					]),
				function () {
					switch (menuState) {
						case 0:
							return _List_Nil;
						case 2:
							return _List_fromArray(
								[
									_Utils_Tuple2(
									'os',
									A2(
										elm$html$Html$div,
										_List_fromArray(
											[
												elm$html$Html$Attributes$class('menu-shadow menu-shadow-appear'),
												elm$html$Html$Events$onClick(author$project$Main$CloseMenu)
											]),
										_List_Nil)),
									_Utils_Tuple2(
									'om',
									A2(
										elm$html$Html$div,
										_List_fromArray(
											[
												elm$html$Html$Attributes$class('menu-list menu-list-open')
											]),
										author$project$Main$menuMain(logInState)))
								]);
						default:
							return _List_fromArray(
								[
									_Utils_Tuple2(
									'cs',
									A2(
										elm$html$Html$div,
										_List_fromArray(
											[
												elm$html$Html$Attributes$class('menu-shadow menu-shadow-disappear')
											]),
										_List_Nil)),
									_Utils_Tuple2(
									'cm',
									A2(
										elm$html$Html$div,
										_List_fromArray(
											[
												elm$html$Html$Attributes$class('menu-list menu-list-close')
											]),
										author$project$Main$menuMain(logInState)))
								]);
					}
				}());
		} else {
			return A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('menu-wide')
					]),
				author$project$Main$menuMain(logInState));
		}
	});
var author$project$Main$messageView = function (message) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('message')
			]),
		_List_fromArray(
			[
				elm$html$Html$text(message)
			]));
};
var author$project$Main$view = function (_n0) {
	var page = _n0.a;
	var menuState = _n0.i;
	var message = _n0.r;
	var logInState = _n0.z;
	var isWideScreen = _Utils_eq(menuState, elm$core$Maybe$Nothing);
	return {
		H: _Utils_ap(
			_List_fromArray(
				[
					author$project$Main$header(isWideScreen),
					A2(author$project$Main$menuView, logInState, menuState)
				]),
			_Utils_ap(
				A2(author$project$Main$mainViewAndMainTab, page, isWideScreen),
				function () {
					if (!message.$) {
						var m = message.a;
						return _List_fromArray(
							[
								author$project$Main$messageView(m)
							]);
					} else {
						return _List_Nil;
					}
				}())),
		f: 'つくマート'
	};
};
var elm$browser$Browser$application = _Browser_application;
var author$project$Main$main = elm$browser$Browser$application(
	{a4: author$project$Main$init, a8: author$project$Main$UrlChange, a9: author$project$Main$UrlRequest, bh: author$project$Main$subscription, bi: author$project$Main$update, bj: author$project$Main$view});
_Platform_export({'Main':{'init':author$project$Main$main(
	elm$json$Json$Decode$succeed(0))(0)}});}(this));