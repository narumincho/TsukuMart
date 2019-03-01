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
	if (region.U.F === region.ac.F)
	{
		return 'on line ' + region.U.F;
	}
	return 'on lines ' + region.U.F + ' through ' + region.ac.F;
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
	if (options.aj) { flags += 'm'; }
	if (options.Z) { flags += 'i'; }

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
		impl.aU,
		impl.bb,
		impl.a8,
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
			callback(toTask(request.ae.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done(elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done(elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.ae.b, xhr)); });
		elm$core$Maybe$isJust(request.ba) && _Http_track(router, xhr, request.ba.a);

		try {
			xhr.open(request.aX, request.aC, true);
		} catch (e) {
			return done(elm$http$Http$BadUrl_(request.aC));
		}

		_Http_configureRequest(xhr, request);

		request.Y.a && xhr.setRequestHeader('Content-Type', request.Y.a);
		xhr.send(request.Y.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.aO; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.a9.a || 0;
	xhr.responseType = request.ae.d;
	xhr.withCredentials = request.w;
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
		aC: xhr.responseURL,
		az: xhr.status,
		a6: xhr.statusText,
		aO: _Http_parseHeaders(xhr.getAllResponseHeaders())
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
			a5: event.loaded,
			T: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2(elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, elm$http$Http$Receiving({
			a2: event.loaded,
			T: event.lengthComputable ? elm$core$Maybe$Just(event.total) : elm$core$Maybe$Nothing
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
		p: func(record.p),
		V: record.V,
		S: record.S
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
		var message = !tag ? value : tag < 3 ? value.a : value.p;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.V;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.S) && event.preventDefault(),
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
		impl.aU,
		impl.bb,
		impl.a8,
		function(sendToApp, initialModel) {
			var view = impl.bc;
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
		impl.aU,
		impl.bb,
		impl.a8,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.G && impl.G(sendToApp)
			var view = impl.bc;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.Y);
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
	var onUrlChange = impl.a_;
	var onUrlRequest = impl.a$;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		G: function(sendToApp)
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
							&& curr.as === next.as
							&& curr.ag === next.ag
							&& curr.ap.a === next.ap.a
						)
							? elm$browser$Browser$Internal(next)
							: elm$browser$Browser$External(href)
					));
				}
			});
		},
		aU: function(flags)
		{
			return A3(impl.aU, flags, _Browser_getUrl(), key);
		},
		bc: impl.bc,
		bb: impl.bb,
		a8: impl.a8
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
		? { aP: 'hidden', aH: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { aP: 'mozHidden', aH: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { aP: 'msHidden', aH: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { aP: 'webkitHidden', aH: 'webkitvisibilitychange' }
		: { aP: 'hidden', aH: 'visibilitychange' };
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
		ay: _Browser_getScene(),
		aD: {
			O: _Browser_window.pageXOffset,
			P: _Browser_window.pageYOffset,
			D: _Browser_doc.documentElement.clientWidth,
			y: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		D: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
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
			ay: {
				D: node.scrollWidth,
				y: node.scrollHeight
			},
			aD: {
				O: node.scrollLeft,
				P: node.scrollTop,
				D: node.clientWidth,
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
			ay: _Browser_getScene(),
			aD: {
				O: x,
				P: y,
				D: _Browser_doc.documentElement.clientWidth,
				y: _Browser_doc.documentElement.clientHeight
			},
			aL: {
				O: x + rect.left,
				P: y + rect.top,
				D: rect.width,
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
var author$project$Main$MenuNotOpenedYet = 0;
var author$project$Main$Model = elm$core$Basics$identity;
var author$project$Main$PageHome = function (a) {
	return {$: 0, a: a};
};
var author$project$Main$Recommend = function (a) {
	return {$: 1, a: a};
};
var author$project$Goods$Goods = elm$core$Basics$identity;
var author$project$Goods$LikeNew = 0;
var elm$core$Basics$False = 1;
var elm$core$Basics$identity = function (x) {
	return x;
};
var author$project$Goods$none = {aI: false, aJ: 0, aK: '説明文', aQ: 0, aV: '場所', aY: '仮', a1: 99};
var author$project$Main$ExhibitionPage = elm$core$Basics$identity;
var author$project$Main$Like = 0;
var author$project$Main$LogInPage = function (a) {
	return {$: 0, a: a};
};
var author$project$Main$PageExhibition = function (a) {
	return {$: 6, a: a};
};
var author$project$Main$PageExhibitionItemList = {$: 4};
var author$project$Main$PageGoods = function (a) {
	return {$: 8, a: a};
};
var author$project$Main$PageLikeAndHistory = function (a) {
	return {$: 3, a: a};
};
var author$project$Main$PageLogIn = function (a) {
	return {$: 2, a: a};
};
var author$project$Main$PagePurchaseItemList = {$: 5};
var author$project$Main$PageSignUp = function (a) {
	return {$: 1, a: a};
};
var author$project$Main$UserSignUpPageStudentHasSAddress = function (a) {
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
		return {aT: index, aW: match, aZ: number, a7: submatches};
	});
var elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var elm$regex$Regex$fromString = function (string) {
	return A2(
		elm$regex$Regex$fromStringWith,
		{Z: false, aj: false},
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
				return $.aW;
			},
			elm$core$Basics$identity),
		elm$core$List$head(
			A2(
				elm$regex$Regex$find,
				author$project$EmailAddress$emailRegex,
				elm$core$String$fromList(charList))));
};
var author$project$Main$AEEmailAddress = function (a) {
	return {$: 2, a: a};
};
var author$project$Main$AENone = {$: 0};
var author$project$Main$AEStudentId = function (a) {
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
var author$project$Main$analysisStudentIdOrEmailAddress = function (string) {
	var charList = elm$core$String$toList(
		elm$core$String$trim(string));
	var _n0 = author$project$StudentId$fromCharList(charList);
	if (!_n0.$) {
		var studentId = _n0.a;
		return author$project$Main$AEStudentId(studentId);
	} else {
		var _n1 = author$project$EmailAddress$fromCharList(charList);
		if (!_n1.$) {
			var emailAddress = _n1.a;
			return author$project$Main$AEEmailAddress(emailAddress);
		} else {
			return author$project$Main$AENone;
		}
	}
};
var author$project$Main$AEmailButIsNotTsukuba = {$: 4};
var author$project$Main$ANone = {$: 0};
var author$project$Main$APartStudentId = function (a) {
	return {$: 3, a: a};
};
var author$project$Main$ASAddress = function (a) {
	return {$: 2, a: a};
};
var author$project$Main$AStudentId = function (a) {
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
var author$project$Main$analysisStudentIdOrSAddress = function (string) {
	var charList = elm$core$String$toList(
		elm$core$String$trim(string));
	var _n0 = author$project$StudentId$fromCharList(charList);
	if (!_n0.$) {
		var studentId = _n0.a;
		return author$project$Main$AStudentId(studentId);
	} else {
		var _n1 = author$project$StudentId$partStudentIdFromCharList(charList);
		if (!_n1.$) {
			var partStudentId = _n1.a;
			return author$project$Main$APartStudentId(partStudentId);
		} else {
			var _n2 = author$project$SAddress$fromCharList(charList);
			if (!_n2.$) {
				var sAddress = _n2.a;
				return author$project$Main$ASAddress(sAddress);
			} else {
				var _n3 = author$project$EmailAddress$fromCharList(charList);
				if (!_n3.$) {
					return author$project$Main$AEmailButIsNotTsukuba;
				} else {
					return author$project$Main$ANone;
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
var elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var elm$url$Url$Parser$Parser = elm$core$Basics$identity;
var elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {s: frag, u: params, r: unvisited, n: value, v: visited};
	});
var elm$url$Url$Parser$mapState = F2(
	function (func, _n0) {
		var visited = _n0.v;
		var unvisited = _n0.r;
		var params = _n0.u;
		var frag = _n0.s;
		var value = _n0.n;
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
			var visited = _n1.v;
			var unvisited = _n1.r;
			var params = _n1.u;
			var frag = _n1.s;
			var value = _n1.n;
			return A2(
				elm$core$List$map,
				elm$url$Url$Parser$mapState(value),
				parseArg(
					A5(elm$url$Url$Parser$State, visited, unvisited, params, frag, subValue)));
		};
	});
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
var elm$url$Url$Parser$s = function (str) {
	return function (_n0) {
		var visited = _n0.v;
		var unvisited = _n0.r;
		var params = _n0.u;
		var frag = _n0.s;
		var value = _n0.n;
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
var elm$url$Url$Parser$top = function (state) {
	return _List_fromArray(
		[state]);
};
var author$project$Main$urlParser = function (beforePageMaybe) {
	return elm$url$Url$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				elm$url$Url$Parser$map,
				author$project$Main$PageHome(
					author$project$Main$Recommend(
						{M: true})),
				elm$url$Url$Parser$top),
				A2(
				elm$url$Url$Parser$map,
				author$project$Main$PageHome(
					author$project$Main$Recommend(
						{M: true})),
				elm$url$Url$Parser$s('index.html')),
				A2(
				elm$url$Url$Parser$map,
				author$project$Main$PageSignUp(
					author$project$Main$UserSignUpPageStudentHasSAddress(
						{
							g: author$project$Password$passwordFromString(''),
							H: author$project$Main$analysisStudentIdOrSAddress('')
						})),
				elm$url$Url$Parser$s('user-signup')),
				A2(
				elm$url$Url$Parser$map,
				author$project$Main$PageLogIn(
					author$project$Main$LogInPage(
						{
							ak: beforePageMaybe,
							g: elm$core$Maybe$Nothing,
							W: author$project$Main$analysisStudentIdOrEmailAddress('')
						})),
				elm$url$Url$Parser$s('user-login')),
				A2(
				elm$url$Url$Parser$map,
				author$project$Main$PageLikeAndHistory(0),
				elm$url$Url$Parser$s('like-history')),
				A2(
				elm$url$Url$Parser$map,
				author$project$Main$PageExhibitionItemList,
				elm$url$Url$Parser$s('exhibition-item')),
				A2(
				elm$url$Url$Parser$map,
				author$project$Main$PagePurchaseItemList,
				elm$url$Url$Parser$s('purchase-item')),
				A2(
				elm$url$Url$Parser$map,
				author$project$Main$PageExhibition(
					{aK: '', aR: _List_Nil, a1: elm$core$Maybe$Nothing, f: ''}),
				elm$url$Url$Parser$s('exhibition')),
				A2(
				elm$url$Url$Parser$map,
				author$project$Main$PageGoods(author$project$Goods$none),
				A2(
					elm$url$Url$Parser$slash,
					elm$url$Url$Parser$s('goods'),
					elm$url$Url$Parser$s('00000000')))
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
			var _n1 = state.r;
			if (!_n1.b) {
				return elm$core$Maybe$Just(state.n);
			} else {
				if ((_n1.a === '') && (!_n1.b.b)) {
					return elm$core$Maybe$Just(state.n);
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
					elm$url$Url$Parser$preparePath(url.an),
					elm$url$Url$Parser$prepareQuery(url.at),
					url.af,
					elm$core$Basics$identity)));
	});
var author$project$Main$urlToPage = F2(
	function (url, beforePageMaybe) {
		return A2(
			elm$core$Maybe$withDefault,
			author$project$Main$PageHome(
				author$project$Main$Recommend(
					{M: false})),
			A2(
				elm$url$Url$Parser$parse,
				author$project$Main$urlParser(beforePageMaybe),
				url));
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
		return _Utils_Tuple2(
			{
				ah: key,
				k: elm$core$Maybe$Just(0),
				a: A2(author$project$Main$urlToPage, url, elm$core$Maybe$Nothing)
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
var elm$json$Json$Decode$int = _Json_decodeInt;
var author$project$Main$toNarrowScreenMode = _Platform_incomingPort('toNarrowScreenMode', elm$json$Json$Decode$int);
var author$project$Main$toWideScreenMode = _Platform_incomingPort('toWideScreenMode', elm$json$Json$Decode$int);
var elm$core$Basics$always = F2(
	function (a, _n0) {
		return a;
	});
var elm$core$Platform$Sub$batch = _Platform_batch;
var author$project$Main$subscription = function (_n0) {
	var menuState = _n0.k;
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
var author$project$Api$logInJson = function (_n0) {
	var emailAddress = _n0.ab;
	var pass = _n0.am;
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
var author$project$Api$LogInError = 5;
var author$project$Api$LogInErrorBadUrl = 2;
var author$project$Api$LogInErrorNetworkError = 4;
var author$project$Api$LogInErrorTimeout = 3;
var author$project$Api$LogInOk = elm$core$Basics$identity;
var author$project$Api$Token = elm$core$Basics$identity;
var elm$json$Json$Decode$field = _Json_decodeField;
var elm$json$Json$Decode$map2 = _Json_map2;
var author$project$Api$logInResponseBodyDecoder = A3(
	elm$json$Json$Decode$map2,
	F2(
		function (access, refresh) {
			return elm$core$Result$Ok(
				{aF: access, a3: refresh});
		}),
	A2(elm$json$Json$Decode$field, 'access', elm$json$Json$Decode$string),
	A2(elm$json$Json$Decode$field, 'refresh', elm$json$Json$Decode$string));
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
var author$project$Api$logInResponseToResult = function (response) {
	switch (response.$) {
		case 0:
			return elm$core$Result$Err(2);
		case 1:
			return elm$core$Result$Err(3);
		case 2:
			return elm$core$Result$Err(4);
		case 3:
			var body = response.b;
			return A2(
				elm$core$Result$withDefault,
				elm$core$Result$Err(5),
				A2(elm$json$Json$Decode$decodeString, author$project$Api$logInResponseBodyDecoder, body));
		default:
			var body = response.b;
			return A2(
				elm$core$Result$withDefault,
				elm$core$Result$Err(5),
				A2(elm$json$Json$Decode$decodeString, author$project$Api$logInResponseBodyDecoder, body));
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
var elm$http$Http$jsonBody = function (value) {
	return A2(
		_Http_pair,
		'application/json',
		A2(elm$json$Json$Encode$encode, 0, value));
};
var elm$http$Http$Request = function (a) {
	return {$: 1, a: a};
};
var elm$core$Task$succeed = _Scheduler_succeed;
var elm$http$Http$State = F2(
	function (reqs, subs) {
		return {av: reqs, aA: subs};
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
							var _n4 = req.ba;
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
			A3(elm$http$Http$updateReqs, router, cmds, state.av));
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
					state.aA)));
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
					w: r.w,
					Y: r.Y,
					ae: A2(_Http_mapExpect, func, r.ae),
					aO: r.aO,
					aX: r.aX,
					a9: r.a9,
					ba: r.ba,
					aC: r.aC
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
			{w: false, Y: r.Y, ae: r.ae, aO: r.aO, aX: r.aX, a9: r.a9, ba: r.ba, aC: r.aC}));
};
var elm$http$Http$post = function (r) {
	return elm$http$Http$request(
		{Y: r.Y, ae: r.ae, aO: _List_Nil, aX: 'POST', a9: elm$core$Maybe$Nothing, ba: elm$core$Maybe$Nothing, aC: r.aC});
};
var author$project$Api$logIn = F2(
	function (logInData, msg) {
		return elm$http$Http$post(
			{
				Y: elm$http$Http$jsonBody(
					author$project$Api$logInJson(logInData)),
				ae: A2(elm$http$Http$expectStringResponse, msg, author$project$Api$logInResponseToResult),
				aC: 'http://tsukumart.com/auth/token/'
			});
	});
var author$project$Api$signUpJson = function (_n0) {
	var emailAddress = _n0.ab;
	var pass = _n0.am;
	var image = _n0.aR;
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
			}()));
};
var author$project$Api$SignUpError = 4;
var author$project$Api$SignUpErrorBadUrl = 1;
var author$project$Api$SignUpErrorNetworkError = 3;
var author$project$Api$SignUpErrorTimeout = 2;
var author$project$Api$ConfirmToken = elm$core$Basics$identity;
var author$project$Api$SignUpErrorAlreadySignUp = 0;
var author$project$Api$SignUpResponseOk = elm$core$Basics$identity;
var elm$json$Json$Decode$map = _Json_map1;
var elm$json$Json$Decode$oneOf = _Json_oneOf;
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
				if (reason === 'Email already exists') {
					return elm$core$Result$Err(0);
				} else {
					return elm$core$Result$Err(4);
				}
			},
			A2(elm$json$Json$Decode$field, 'reason', elm$json$Json$Decode$string))
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
				elm$core$Result$Err(4),
				A2(elm$json$Json$Decode$decodeString, author$project$Api$signUpResponseBodyDecoder, body));
		default:
			var body = response.b;
			return A2(
				elm$core$Result$withDefault,
				elm$core$Result$Err(4),
				A2(elm$json$Json$Decode$decodeString, author$project$Api$signUpResponseBodyDecoder, body));
	}
};
var author$project$Api$signUp = F2(
	function (signUpData, msg) {
		return elm$http$Http$post(
			{
				Y: elm$http$Http$jsonBody(
					author$project$Api$signUpJson(signUpData)),
				ae: A2(elm$http$Http$expectStringResponse, msg, author$project$Api$signUpResponseToResult),
				aC: 'http://tsukumart.com/auth/signup/'
			});
	});
var author$project$Main$LogInResponse = function (a) {
	return {$: 11, a: a};
};
var author$project$Main$MenuClose = 1;
var author$project$Main$MenuOpen = 2;
var author$project$Main$PageSendSignUpEmail = F2(
	function (a, b) {
		return {$: 7, a: a, b: b};
	});
var author$project$Main$SignUpConfirmResponse = function (a) {
	return {$: 10, a: a};
};
var author$project$Main$SignUpResponse = function (a) {
	return {$: 9, a: a};
};
var author$project$Main$UserSignUpPageNewStudent = function (a) {
	return {$: 1, a: a};
};
var author$project$Main$analysisEmailAddress = function (string) {
	return author$project$EmailAddress$fromCharList(
		elm$core$String$toList(
			elm$core$String$trim(string)));
};
var author$project$Main$exhibitionImageChange = _Platform_outgoingPort('exhibitionImageChange', elm$json$Json$Encode$string);
var author$project$Main$signUpConfirmResponseToResult = function (response) {
	switch (response.$) {
		case 0:
			return elm$core$Result$Err(0);
		case 1:
			return elm$core$Result$Err(0);
		case 2:
			return elm$core$Result$Err(0);
		case 3:
			return elm$core$Result$Err(0);
		default:
			return elm$core$Result$Ok(0);
	}
};
var author$project$Main$studentImageChange = _Platform_outgoingPort('studentImageChange', elm$json$Json$Encode$string);
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
		return {af: fragment, ag: host, an: path, ap: port_, as: protocol, at: query};
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
var elm$core$Result$toMaybe = function (result) {
	if (!result.$) {
		var v = result.a;
		return elm$core$Maybe$Just(v);
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var elm$http$Http$emptyBody = _Http_emptyBody;
var elm$http$Http$Header = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var elm$http$Http$header = elm$http$Http$Header;
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
		var _n0 = url.as;
		if (!_n0) {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		elm$url$Url$addPrefixed,
		'#',
		url.af,
		A3(
			elm$url$Url$addPrefixed,
			'?',
			url.at,
			_Utils_ap(
				A2(
					elm$url$Url$addPort,
					url.ap,
					_Utils_ap(http, url.ag)),
				url.an)));
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
						var _n2 = rec.k;
						if (!_n2.$) {
							return _Utils_update(
								rec,
								{
									k: elm$core$Maybe$Just(2)
								});
						} else {
							return rec;
						}
					}(),
					elm$core$Platform$Cmd$none);
			case 2:
				return _Utils_Tuple2(
					function () {
						var _n3 = rec.k;
						if (!_n3.$) {
							return _Utils_update(
								rec,
								{
									k: elm$core$Maybe$Just(1)
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
						{k: elm$core$Maybe$Nothing}),
					elm$core$Platform$Cmd$none);
			case 4:
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{
							k: elm$core$Maybe$Just(0)
						}),
					elm$core$Platform$Cmd$none);
			case 5:
				var url = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{
							k: function () {
								var _n4 = rec.k;
								if ((!_n4.$) && (_n4.a === 2)) {
									var _n5 = _n4.a;
									return elm$core$Maybe$Just(1);
								} else {
									return rec.k;
								}
							}(),
							a: A2(
								author$project$Main$urlToPage,
								url,
								elm$core$Maybe$Just(rec.a))
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
							rec.ah,
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
							a: A2(author$project$Main$PageSendSignUpEmail, signUpData.ab, elm$core$Maybe$Nothing)
						}),
					A2(author$project$Api$signUp, signUpData, author$project$Main$SignUpResponse));
			case 8:
				var logInData = msg.a;
				return _Utils_Tuple2(
					function () {
						var _n7 = rec.a;
						if ((_n7.$ === 2) && (!_n7.a.$)) {
							var nextPage = _n7.a.a.ak;
							if (!nextPage.$) {
								var next = nextPage.a;
								return _Utils_update(
									rec,
									{a: next});
							} else {
								return rec;
							}
						} else {
							return rec;
						}
					}(),
					A2(author$project$Api$logIn, logInData, author$project$Main$LogInResponse));
			case 9:
				var response = msg.a;
				return _Utils_Tuple2(
					function () {
						var _n9 = rec.a;
						if (_n9.$ === 7) {
							var emailAddress = _n9.a;
							return _Utils_update(
								rec,
								{
									a: A2(
										author$project$Main$PageSendSignUpEmail,
										emailAddress,
										elm$core$Maybe$Just(response))
								});
						} else {
							return rec;
						}
					}(),
					elm$core$Platform$Cmd$none);
			case 11:
				return _Utils_Tuple2(rec, elm$core$Platform$Cmd$none);
			case 10:
				return _Utils_Tuple2(rec, elm$core$Platform$Cmd$none);
			case 12:
				var string = msg.a;
				return _Utils_Tuple2(
					function () {
						var _n10 = rec.a;
						_n10$3:
						while (true) {
							switch (_n10.$) {
								case 1:
									if (!_n10.a.$) {
										var r = _n10.a.a;
										return _Utils_update(
											rec,
											{
												a: author$project$Main$PageSignUp(
													author$project$Main$UserSignUpPageStudentHasSAddress(
														_Utils_update(
															r,
															{
																H: author$project$Main$analysisStudentIdOrSAddress(string)
															})))
											});
									} else {
										var r = _n10.a.a;
										return _Utils_update(
											rec,
											{
												a: author$project$Main$PageSignUp(
													author$project$Main$UserSignUpPageNewStudent(
														_Utils_update(
															r,
															{
																ab: author$project$Main$analysisEmailAddress(string)
															})))
											});
									}
								case 2:
									if (!_n10.a.$) {
										var r = _n10.a.a;
										return _Utils_update(
											rec,
											{
												a: author$project$Main$PageLogIn(
													author$project$Main$LogInPage(
														_Utils_update(
															r,
															{
																W: author$project$Main$analysisStudentIdOrEmailAddress(string)
															})))
											});
									} else {
										break _n10$3;
									}
								default:
									break _n10$3;
							}
						}
						return rec;
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
						var _n11 = rec.a;
						_n11$2:
						while (true) {
							switch (_n11.$) {
								case 1:
									if (_n11.a.$ === 1) {
										var r = _n11.a.a;
										return _Utils_update(
											rec,
											{
												a: author$project$Main$PageSignUp(
													author$project$Main$UserSignUpPageNewStudent(
														_Utils_update(
															r,
															{
																N: elm$core$Maybe$Just(urlString)
															})))
											});
									} else {
										break _n11$2;
									}
								case 6:
									var r = _n11.a;
									return _Utils_update(
										rec,
										{
											a: author$project$Main$PageExhibition(
												_Utils_update(
													r,
													{
														aR: _List_fromArray(
															[urlString])
													}))
										});
								default:
									break _n11$2;
							}
						}
						return rec;
					}(),
					elm$core$Platform$Cmd$none);
			case 16:
				var urlStringList = msg.a;
				return _Utils_Tuple2(
					function () {
						var _n12 = rec.a;
						if (_n12.$ === 6) {
							var r = _n12.a;
							return _Utils_update(
								rec,
								{
									a: author$project$Main$PageExhibition(
										_Utils_update(
											r,
											{aR: urlStringList}))
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
						var _n13 = rec.a;
						_n13$3:
						while (true) {
							switch (_n13.$) {
								case 1:
									if (_n13.a.$ === 1) {
										var r = _n13.a.a;
										return _Utils_update(
											rec,
											{
												a: author$project$Main$PageSignUp(
													author$project$Main$UserSignUpPageNewStudent(
														_Utils_update(
															r,
															{
																g: author$project$Password$passwordFromString(string)
															})))
											});
									} else {
										var r = _n13.a.a;
										return _Utils_update(
											rec,
											{
												a: author$project$Main$PageSignUp(
													author$project$Main$UserSignUpPageStudentHasSAddress(
														_Utils_update(
															r,
															{
																g: author$project$Password$passwordFromString(string)
															})))
											});
									}
								case 2:
									if (!_n13.a.$) {
										var r = _n13.a.a;
										return _Utils_update(
											rec,
											{
												a: author$project$Main$PageLogIn(
													author$project$Main$LogInPage(
														_Utils_update(
															r,
															{
																g: elm$core$Result$toMaybe(
																	author$project$Password$passwordFromString(string))
															})))
											});
									} else {
										break _n13$3;
									}
								default:
									break _n13$3;
							}
						}
						return rec;
					}(),
					elm$core$Platform$Cmd$none);
			default:
				var _n14 = rec.a;
				if (((_n14.$ === 7) && (!_n14.b.$)) && (!_n14.b.a.$)) {
					var token = _n14.b.a.a;
					return _Utils_Tuple2(
						rec,
						elm$http$Http$request(
							{
								Y: elm$http$Http$emptyBody,
								ae: A2(elm$http$Http$expectStringResponse, author$project$Main$SignUpConfirmResponse, author$project$Main$signUpConfirmResponseToResult),
								aO: _List_fromArray(
									[
										A2(elm$http$Http$header, 'Authorization', 'Bearer ' + token)
									]),
								aX: 'POST',
								a9: elm$core$Maybe$Nothing,
								ba: elm$core$Maybe$Nothing,
								aC: 'http://tsukumart.com/auth/signup/confirm/'
							}));
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
				elm$svg$Svg$Attributes$xlinkHref('assets/logoBird.png'),
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
			elm$html$Html$Attributes$src('assets/menu.svg'),
			elm$html$Html$Attributes$alt('メニュー'),
			author$project$Main$headerButton,
			elm$html$Html$Events$onClick(author$project$Main$OpenMenu)
		]),
	_List_Nil);
var author$project$Main$notificationsButton = A2(
	elm$html$Html$img,
	_List_fromArray(
		[
			elm$html$Html$Attributes$src('assets/notifications.svg'),
			elm$html$Html$Attributes$alt('通知'),
			author$project$Main$headerButton
		]),
	_List_Nil);
var author$project$Main$searchButton = A2(
	elm$html$Html$img,
	_List_fromArray(
		[
			elm$html$Html$Attributes$src('assets/search.svg'),
			elm$html$Html$Attributes$alt('探す'),
			author$project$Main$headerButton
		]),
	_List_Nil);
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
							elm$html$Html$Attributes$href('/')
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
var author$project$Main$Free = {$: 2};
var author$project$Main$History = 1;
var author$project$Main$Recent = {$: 0};
var author$project$Main$TabMulti = function (a) {
	return {$: 0, a: a};
};
var author$project$Main$TabNone = {$: 2};
var author$project$Main$TabSingle = function (a) {
	return {$: 1, a: a};
};
var author$project$Main$ChangePage = function (a) {
	return {$: 0, a: a};
};
var author$project$Main$firstElementIndex = F2(
	function (a, list) {
		if (!list.b) {
			return elm$core$Maybe$Nothing;
		} else {
			var x = list.a;
			var xs = list.b;
			return _Utils_eq(x, a) ? elm$core$Maybe$Just(0) : A2(
				elm$core$Maybe$map,
				elm$core$Basics$add(1),
				A2(author$project$Main$firstElementIndex, a, xs));
		}
	});
var elm$html$Html$div = _VirtualDom_node('div');
var elm$html$Html$text = elm$virtual_dom$VirtualDom$text;
var author$project$Main$mainTabItem = F3(
	function (isSelected, label, clickEventMaybe) {
		if (isSelected) {
			return A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('mainTab-item-select')
					]),
				_List_fromArray(
					[
						elm$html$Html$text(label)
					]));
		} else {
			if (!clickEventMaybe.$) {
				var clickEvent = clickEventMaybe.a;
				return A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('mainTab-item'),
							elm$html$Html$Events$onClick(clickEvent)
						]),
					_List_fromArray(
						[
							elm$html$Html$text(label)
						]));
			} else {
				return A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('mainTab-item')
						]),
					_List_fromArray(
						[
							elm$html$Html$text(label)
						]));
			}
		}
	});
var elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var elm$html$Html$Attributes$style = elm$virtual_dom$VirtualDom$style;
var author$project$Main$mainTabSelectLine = F2(
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
var author$project$Main$mainTabItemList = F2(
	function (selectedPage, tabData) {
		switch (tabData.$) {
			case 0:
				var tabList = tabData.a;
				return _Utils_ap(
					A2(
						elm$core$List$map,
						function (_n1) {
							var tab = _n1.a;
							var label = _n1.b;
							return A3(
								author$project$Main$mainTabItem,
								_Utils_eq(tab, selectedPage),
								label,
								elm$core$Maybe$Just(
									author$project$Main$ChangePage(tab)));
						},
						tabList),
					_List_fromArray(
						[
							A2(
							author$project$Main$mainTabSelectLine,
							A2(
								elm$core$Maybe$withDefault,
								0,
								A2(
									author$project$Main$firstElementIndex,
									selectedPage,
									A2(elm$core$List$map, elm$core$Tuple$first, tabList))),
							elm$core$List$length(tabList))
						]));
			case 1:
				var label = tabData.a;
				return _List_fromArray(
					[
						A3(author$project$Main$mainTabItem, true, label, elm$core$Maybe$Nothing),
						A2(author$project$Main$mainTabSelectLine, 0, 1)
					]);
			default:
				return _List_Nil;
		}
	});
var author$project$Main$tabTypeToCount = function (tabType) {
	switch (tabType.$) {
		case 0:
			var list = tabType.a;
			return elm$core$List$length(list);
		case 1:
			return 1;
		default:
			return 0;
	}
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
var author$project$Main$mainTab = F2(
	function (page, wideScreenMode) {
		var tabData = function () {
			switch (page.$) {
				case 0:
					return author$project$Main$TabMulti(
						_List_fromArray(
							[
								_Utils_Tuple2(
								author$project$Main$PageHome(author$project$Main$Recent),
								'新着'),
								_Utils_Tuple2(
								author$project$Main$PageHome(
									author$project$Main$Recommend(
										{M: true})),
								'おすすめ'),
								_Utils_Tuple2(
								author$project$Main$PageHome(author$project$Main$Free),
								'0円')
							]));
				case 3:
					return author$project$Main$TabMulti(
						_List_fromArray(
							[
								_Utils_Tuple2(
								author$project$Main$PageLikeAndHistory(0),
								'いいね'),
								_Utils_Tuple2(
								author$project$Main$PageLikeAndHistory(1),
								'閲覧履歴')
							]));
				case 5:
					return author$project$Main$TabSingle('購入した商品');
				case 4:
					return author$project$Main$TabSingle('出品した商品');
				case 1:
					return author$project$Main$TabSingle('新規登録');
				case 2:
					return author$project$Main$TabSingle('ログイン');
				case 6:
					return author$project$Main$TabSingle('商品の情報を入力');
				case 7:
					return author$project$Main$TabNone;
				default:
					return author$project$Main$TabNone;
			}
		}();
		return A2(
			elm$html$Html$div,
			_Utils_ap(
				_List_fromArray(
					[
						elm$html$Html$Attributes$classList(
						_List_fromArray(
							[
								_Utils_Tuple2('mainTab', true),
								_Utils_Tuple2('mainTab-wide', wideScreenMode)
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
										author$project$Main$tabTypeToCount(tabData),
										'1fr'))),
								A2(elm$html$Html$Attributes$style, 'height', '3rem')
							]);
					}
				}()),
			A2(author$project$Main$mainTabItemList, page, tabData));
	});
var author$project$Main$exhibitButton = A2(
	elm$html$Html$a,
	_List_fromArray(
		[
			elm$html$Html$Attributes$class('exhibitButton'),
			elm$html$Html$Attributes$href('/exhibition')
		]),
	_List_fromArray(
		[
			elm$html$Html$text('出品')
		]));
var elm$html$Html$input = _VirtualDom_node('input');
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
									elm$html$Html$Attributes$src('assets/add_a_photo.svg'),
									elm$html$Html$Attributes$class('exhibitionView-photo-icon')
								]),
							_List_Nil)
						]);
				}
			}()));
};
var author$project$Main$exhibitionView = function (_n0) {
	var title = _n0.f;
	var description = _n0.aK;
	var price = _n0.a1;
	var image = _n0.aR;
	return A2(
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
			]));
};
var author$project$Main$invalidLinkErrorMsg = A2(
	elm$html$Html$div,
	_List_fromArray(
		[
			elm$html$Html$Attributes$class('invalidLinkErrorMsg')
		]),
	_List_fromArray(
		[
			elm$html$Html$text('指定したページが見つからないのでホームに移動しました')
		]));
var author$project$Main$itemImage = A2(
	elm$html$Html$img,
	_List_fromArray(
		[
			elm$html$Html$Attributes$class('itemImage'),
			elm$html$Html$Attributes$src('assets/itemDummy.png')
		]),
	_List_Nil);
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
var author$project$Main$item = function (_n0) {
	var title = _n0.f;
	var price = _n0.a1;
	var like = _n0.i;
	return A2(
		elm$html$Html$a,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('item'),
				elm$html$Html$Attributes$href('/goods/00000000')
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
					{i: 1, a1: 300, f: '冷蔵庫'},
					{i: 5, a1: 100, f: '洗濯機'},
					{i: 99, a1: 10, f: '時計'},
					{i: 5, a1: 100, f: '掃除機'},
					{i: 9, a1: 200, f: '自転車'},
					{i: 99, a1: 10, f: 'マンガ'},
					{i: 99, a1: 10, f: 'ゲーム'},
					{i: 5, a1: 100, f: '絵本'},
					{i: 2, a1: 1000, f: '棚'},
					{i: 2, a1: 1000, f: 'いす'},
					{i: 20, a1: 300, f: 'バッテリー'},
					{i: 10, a1: 20, f: '教科書'}
				])));
};
var author$project$Main$SendConfirmToken = {$: 18};
var author$project$Main$signUpResultToString = F2(
	function (emailAddress, signUpResult) {
		if (!signUpResult.$) {
			var token = signUpResult.a;
			return _List_fromArray(
				[
					elm$html$Html$text(
					'送信完了。' + (author$project$EmailAddress$toString(emailAddress) + ('にメールを送信しました。届いたメールのリンクをクリックして認証をしてください' + ('token = \"' + (token + '\"'))))),
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Events$onClick(author$project$Main$SendConfirmToken),
							A2(elm$html$Html$Attributes$style, 'border', 'solid 2px black')
						]),
					_List_fromArray(
						[
							elm$html$Html$text('confirm_tokenを送信')
						]))
				]);
		} else {
			switch (signUpResult.a) {
				case 0:
					var _n1 = signUpResult.a;
					return _List_fromArray(
						[
							elm$html$Html$text('すでにあなたは登録されています')
						]);
				case 1:
					var _n2 = signUpResult.a;
					return _List_fromArray(
						[
							elm$html$Html$text('正しいURLが指定されなかった')
						]);
				case 2:
					var _n3 = signUpResult.a;
					return _List_fromArray(
						[
							elm$html$Html$text('タイムアウトエラー。回線が混雑しています')
						]);
				case 3:
					var _n4 = signUpResult.a;
					return _List_fromArray(
						[
							elm$html$Html$text('ネットワークエラー。接続が切れている可能性があります')
						]);
				default:
					var _n5 = signUpResult.a;
					return _List_fromArray(
						[
							elm$html$Html$text('サーバーの回答を理解することができませんでした')
						]);
			}
		}
	});
var author$project$Main$sendSignUpEmailView = F2(
	function (emailAddress, signUpResultMaybe) {
		return _List_fromArray(
			[
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('signUp-resultMsg')
					]),
				function () {
					if (!signUpResultMaybe.$) {
						var signUpResult = signUpResultMaybe.a;
						return A2(author$project$Main$signUpResultToString, emailAddress, signUpResult);
					} else {
						return _List_fromArray(
							[
								elm$html$Html$text('新規登録の情報を送信中')
							]);
					}
				}())
			]);
	});
var author$project$Main$forgotPasswordView = _List_fromArray(
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
var author$project$Main$getLogInData = F2(
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
								ab: author$project$EmailAddress$fromSAddress(
									author$project$SAddress$fromStundetId(studentId)),
								am: password
							});
					case 2:
						var emailAddress = _n0.a.a;
						var password = _n0.b.a;
						return elm$core$Maybe$Just(
							{ab: emailAddress, am: password});
					default:
						break _n0$2;
				}
			} else {
				break _n0$2;
			}
		}
		return elm$core$Maybe$Nothing;
	});
var author$project$Main$LogIn = function (a) {
	return {$: 8, a: a};
};
var elm$html$Html$button = _VirtualDom_node('button');
var elm$html$Html$Attributes$disabled = elm$html$Html$Attributes$boolProperty('disabled');
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
var author$project$Main$logInButton = function (logInDataMaybe) {
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
									elm$html$Html$Events$stopPropagationOn,
									'click',
									elm$json$Json$Decode$succeed(
										_Utils_Tuple2(
											author$project$Main$LogIn(logInData),
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
var author$project$Main$InputStudentIdOrEmailAddress = function (a) {
	return {$: 12, a: a};
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
var author$project$Main$logInIdView = function (analysisStudentIdOrEmailAddressResult) {
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
						elm$html$Html$Events$onInput(author$project$Main$InputStudentIdOrEmailAddress)
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
var author$project$Main$ForgotPassword = {$: 1};
var author$project$Main$InputPassword = function (a) {
	return {$: 17, a: a};
};
var elm$html$Html$span = _VirtualDom_node('span');
var elm$html$Html$Attributes$minlength = function (n) {
	return A2(
		_VirtualDom_attribute,
		'minLength',
		elm$core$String$fromInt(n));
};
var author$project$Main$logInPasswordView = A2(
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
							author$project$Main$ChangePage(
								author$project$Main$PageLogIn(author$project$Main$ForgotPassword)))
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
					elm$html$Html$Events$onInput(author$project$Main$InputPassword)
				]),
			_List_Nil)
		]));
var author$project$Main$orLabel = A2(
	elm$html$Html$div,
	_List_fromArray(
		[
			elm$html$Html$Attributes$class('logIn-orLabel')
		]),
	_List_fromArray(
		[
			elm$html$Html$text('or')
		]));
var author$project$Main$signUpButton = A2(
	elm$html$Html$a,
	_List_fromArray(
		[
			elm$html$Html$Attributes$class('logIn-signInButton'),
			elm$html$Html$Attributes$href('/user-signup')
		]),
	_List_fromArray(
		[
			elm$html$Html$text('新規登録')
		]));
var elm$html$Html$form = _VirtualDom_node('form');
var author$project$Main$logInView = F2(
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
								author$project$Main$logInIdView(analysisStudentIdOrEmailAddressResult),
								author$project$Main$logInPasswordView,
								author$project$Main$logInButton(
								A2(author$project$Main$getLogInData, analysisStudentIdOrEmailAddressResult, password))
							])),
						author$project$Main$orLabel,
						A2(
						elm$html$Html$div,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('logIn-group')
							]),
						_List_fromArray(
							[author$project$Main$signUpButton]))
					]))
			]);
	});
var author$project$Main$userLogInView = function (logInPage) {
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
					var studentIdOrEmailAddress = logInPage.a.W;
					var password = logInPage.a.g;
					return A2(author$project$Main$logInView, studentIdOrEmailAddress, password);
				} else {
					return author$project$Main$forgotPasswordView;
				}
			}())
		]);
};
var author$project$Main$getSignUpData = function (userSignUpPage) {
	if (!userSignUpPage.$) {
		var studentIdOrTsukubaEmailAddress = userSignUpPage.a.H;
		var password = userSignUpPage.a.g;
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
								ab: author$project$EmailAddress$fromSAddress(
									author$project$SAddress$fromStundetId(studentId)),
								aR: elm$core$Maybe$Nothing,
								am: pass
							});
					case 2:
						var sAddress = _n1.a.a;
						var pass = _n1.b.a;
						return elm$core$Maybe$Just(
							{
								ab: author$project$EmailAddress$fromSAddress(sAddress),
								aR: elm$core$Maybe$Nothing,
								am: pass
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
		var emailAddress = userSignUpPage.a.ab;
		var password = userSignUpPage.a.g;
		var imageUrl = userSignUpPage.a.N;
		var _n2 = _Utils_Tuple3(emailAddress, password, imageUrl);
		if (((!_n2.a.$) && (!_n2.b.$)) && (!_n2.c.$)) {
			var address = _n2.a.a;
			var pass = _n2.b.a;
			var image = _n2.c.a;
			return elm$core$Maybe$Just(
				{
					ab: address,
					aR: elm$core$Maybe$Just(image),
					am: pass
				});
		} else {
			return elm$core$Maybe$Nothing;
		}
	}
};
var author$project$Main$InputStudentImage = function (a) {
	return {$: 13, a: a};
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
var elm$core$String$concat = function (strings) {
	return A2(elm$core$String$join, '', strings);
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
var author$project$Main$passwordForm = function (passwordResult) {
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
						elm$html$Html$Events$onInput(author$project$Main$InputPassword)
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
var author$project$Main$newStudentFormList = F3(
	function (emailAddress, imageUrlMaybe, password) {
		return _List_fromArray(
			[
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
								elm$html$Html$Events$onInput(author$project$Main$InputStudentIdOrEmailAddress)
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
					])),
				author$project$Main$passwordForm(password),
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
									author$project$Main$InputStudentImage('signUpImage')))
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
					]))
			]);
	});
var author$project$Main$sAddressSelectView = function (userSignUpPage) {
	var leftSelect = function () {
		if (!userSignUpPage.$) {
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
									_Utils_Tuple2('signUp-select-item', true),
									_Utils_Tuple2('signUp-select-itemSelect', leftSelect)
								])),
							A2(elm$html$Html$Attributes$style, 'border-radius', '.4rem 0 0 .4rem')
						]),
					function () {
						if (!userSignUpPage.$) {
							return _List_Nil;
						} else {
							var password = userSignUpPage.a.g;
							return _List_fromArray(
								[
									elm$html$Html$Events$onClick(
									author$project$Main$ChangePage(
										author$project$Main$PageSignUp(
											author$project$Main$UserSignUpPageStudentHasSAddress(
												{
													g: password,
													H: author$project$Main$analysisStudentIdOrSAddress('')
												}))))
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
									_Utils_Tuple2('signUp-select-item', true),
									_Utils_Tuple2('signUp-select-itemSelect', !leftSelect)
								])),
							A2(elm$html$Html$Attributes$style, 'border-radius', '0 .4rem .4rem 0')
						]),
					function () {
						if (!userSignUpPage.$) {
							var password = userSignUpPage.a.g;
							return _List_fromArray(
								[
									elm$html$Html$Events$onClick(
									author$project$Main$ChangePage(
										author$project$Main$PageSignUp(
											author$project$Main$UserSignUpPageNewStudent(
												{
													ab: author$project$EmailAddress$fromCharList(_List_Nil),
													N: elm$core$Maybe$Nothing,
													g: password
												}))))
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
var author$project$Main$sAddressView = function (userSignUpPage) {
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
				author$project$Main$sAddressSelectView(userSignUpPage)
			]));
};
var author$project$Main$SignUp = function (a) {
	return {$: 7, a: a};
};
var author$project$Main$signUpSubmitButton = function (signUpDataMaybe) {
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
							_Utils_eq(signUpDataMaybe, elm$core$Maybe$Nothing))
						]),
					function () {
						if (!signUpDataMaybe.$) {
							var signUpData = signUpDataMaybe.a;
							return _List_fromArray(
								[
									A2(
									elm$html$Html$Events$stopPropagationOn,
									'click',
									elm$json$Json$Decode$succeed(
										_Utils_Tuple2(
											author$project$Main$SignUp(signUpData),
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
var author$project$Main$studentHasSAddressFormList = F2(
	function (analysisStudentIdOrEmailAddressResult, password) {
		return _Utils_ap(
			_List_fromArray(
				[
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
									elm$html$Html$Events$onInput(author$project$Main$InputStudentIdOrEmailAddress)
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
						]))
				]),
			_List_fromArray(
				[
					author$project$Main$passwordForm(password)
				]));
	});
var author$project$Main$userSignUpView = function (userSignUpPage) {
	return _List_fromArray(
		[
			A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('signUpContainer')
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$form,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('signUp')
						]),
					_Utils_ap(
						_List_fromArray(
							[
								author$project$Main$sAddressView(userSignUpPage)
							]),
						_Utils_ap(
							function () {
								if (!userSignUpPage.$) {
									var studentIdOrTsukubaEmailAddress = userSignUpPage.a.H;
									var password = userSignUpPage.a.g;
									return A2(author$project$Main$studentHasSAddressFormList, studentIdOrTsukubaEmailAddress, password);
								} else {
									var emailAddress = userSignUpPage.a.ab;
									var imageUrl = userSignUpPage.a.N;
									var password = userSignUpPage.a.g;
									return A3(author$project$Main$newStudentFormList, emailAddress, imageUrl, password);
								}
							}(),
							_List_fromArray(
								[
									author$project$Main$signUpSubmitButton(
									author$project$Main$getSignUpData(userSignUpPage))
								]))))
				]))
		]);
};
var author$project$Main$mainView = F2(
	function (page, isWideScreenMode) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('mainView', true),
							_Utils_Tuple2('mainView-wide', isWideScreenMode)
						]))
				]),
			function () {
				_n0$6:
				while (true) {
					switch (page.$) {
						case 6:
							var exhibitionState = page.a;
							return _List_fromArray(
								[
									author$project$Main$exhibitionView(exhibitionState)
								]);
						case 1:
							var userPage = page.a;
							return author$project$Main$userSignUpView(userPage);
						case 2:
							var logInPage = page.a;
							return author$project$Main$userLogInView(logInPage);
						case 0:
							if (page.a.$ === 1) {
								var valid = page.a.a.M;
								return valid ? _List_fromArray(
									[
										author$project$Main$itemList(isWideScreenMode),
										author$project$Main$exhibitButton
									]) : _List_fromArray(
									[
										author$project$Main$invalidLinkErrorMsg,
										author$project$Main$itemList(isWideScreenMode),
										author$project$Main$exhibitButton
									]);
							} else {
								break _n0$6;
							}
						case 7:
							var emailAddress = page.a;
							var response = page.b;
							return A2(author$project$Main$sendSignUpEmailView, emailAddress, response);
						case 8:
							return _List_fromArray(
								[
									elm$html$Html$text('アイテム詳細ページ')
								]);
						default:
							break _n0$6;
					}
				}
				return _List_fromArray(
					[
						author$project$Main$itemList(isWideScreenMode),
						author$project$Main$exhibitButton
					]);
			}());
	});
var author$project$Main$CloseMenu = {$: 2};
var author$project$Main$menuMain = _List_fromArray(
	[
		A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('menu-account')
			]),
		_List_fromArray(
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
								elm$html$Html$Attributes$href('/user-login')
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
								elm$html$Html$Attributes$href('/user-signup')
							]),
						_List_fromArray(
							[
								elm$html$Html$text('新規登録')
							]))
					]))
			])),
		A2(
		elm$html$Html$a,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('menu-item'),
				elm$html$Html$Attributes$href('/')
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
				elm$html$Html$Attributes$href('/like-history')
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
				elm$html$Html$Attributes$href('exhibition-item')
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
				elm$html$Html$Attributes$href('purchase-item')
			]),
		_List_fromArray(
			[
				elm$html$Html$text('購入した商品')
			]))
	]);
var elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var elm$html$Html$Keyed$node = elm$virtual_dom$VirtualDom$keyedNode;
var author$project$Main$menuView = function (menuStateMaybe) {
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
									author$project$Main$menuMain))
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
									author$project$Main$menuMain))
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
			author$project$Main$menuMain);
	}
};
var author$project$Main$view = function (_n0) {
	var page = _n0.a;
	var menuState = _n0.k;
	var isWideScreen = _Utils_eq(menuState, elm$core$Maybe$Nothing);
	return {
		Y: _List_fromArray(
			[
				author$project$Main$header(isWideScreen),
				A2(author$project$Main$mainTab, page, isWideScreen),
				author$project$Main$menuView(menuState),
				A2(author$project$Main$mainView, page, isWideScreen)
			]),
		f: 'つくマート'
	};
};
var elm$browser$Browser$application = _Browser_application;
var author$project$Main$main = elm$browser$Browser$application(
	{aU: author$project$Main$init, a_: author$project$Main$UrlChange, a$: author$project$Main$UrlRequest, a8: author$project$Main$subscription, bb: author$project$Main$update, bc: author$project$Main$view});
_Platform_export({'Main':{'init':author$project$Main$main(
	elm$json$Json$Decode$succeed(0))(0)}});}(this));