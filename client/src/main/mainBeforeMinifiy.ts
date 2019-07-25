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
	if (region.cc.aZ === region.cK.aZ)
	{
		return 'on line ' + region.cc.aZ;
	}
	return 'on lines ' + region.cc.aZ + ' through ' + region.cK.aZ;
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
		impl.d4,
		impl.ev,
		impl.er,
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
			callback(toTask(request.z.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done(elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done(elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.z.b, xhr)); });
		elm$core$Maybe$isJust(request.C) && _Http_track(router, xhr, request.C.a);

		try {
			xhr.open(request.c2, request.dE, true);
		} catch (e) {
			return done(elm$http$Http$BadUrl_(request.dE));
		}

		_Http_configureRequest(xhr, request);

		request.bg.a && xhr.setRequestHeader('Content-Type', request.bg.a);
		xhr.send(request.bg.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.cR; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.dy.a || 0;
	xhr.responseType = request.z.d;
	xhr.withCredentials = request.al;
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
		dE: xhr.responseURL,
		dt: xhr.status,
		ep: xhr.statusText,
		cR: _Http_parseHeaders(xhr.getAllResponseHeaders())
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
			en: event.loaded,
			eo: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2(elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, elm$http$Http$Receiving({
			eg: event.loaded,
			eo: event.lengthComputable ? elm$core$Maybe$Just(event.total) : elm$core$Maybe$Nothing
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
		w: func(record.w),
		du: record.du,
		da: record.da
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
		var message = !tag ? value : tag < 3 ? value.a : value.w;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.du;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.da) && event.preventDefault(),
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
		impl.d4,
		impl.ev,
		impl.er,
		function(sendToApp, initialModel) {
			var view = impl.ez;
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
		impl.d4,
		impl.ev,
		impl.er,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.a4 && impl.a4(sendToApp)
			var view = impl.ez;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.bg);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.bD) && (_VirtualDom_doc.title = title = doc.bD);
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
	var onUrlChange = impl.eb;
	var onUrlRequest = impl.ec;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		a4: function(sendToApp)
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
							&& curr.a2 === next.a2
							&& curr.bm === next.bm
							&& curr.a_.a === next.a_.a
						)
							? elm$browser$Browser$Internal(next)
							: elm$browser$Browser$External(href)
					));
				}
			});
		},
		d4: function(flags)
		{
			return A3(impl.d4, flags, _Browser_getUrl(), key);
		},
		ez: impl.ez,
		ev: impl.ev,
		er: impl.er
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
		? { d$: 'hidden', dP: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { d$: 'mozHidden', dP: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { d$: 'msHidden', dP: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { d$: 'webkitHidden', dP: 'webkitvisibilitychange' }
		: { d$: 'hidden', dP: 'visibilitychange' };
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
		dl: _Browser_getScene(),
		dG: {
			bE: _Browser_window.pageXOffset,
			bF: _Browser_window.pageYOffset,
			aM: _Browser_doc.documentElement.clientWidth,
			ax: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		aM: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		ax: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
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
			dl: {
				aM: node.scrollWidth,
				ax: node.scrollHeight
			},
			dG: {
				bE: node.scrollLeft,
				bF: node.scrollTop,
				aM: node.clientWidth,
				ax: node.clientHeight
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
			dl: _Browser_getScene(),
			dG: {
				bE: x,
				bF: y,
				aM: _Browser_doc.documentElement.clientWidth,
				ax: _Browser_doc.documentElement.clientHeight
			},
			dX: {
				bE: x + rect.left,
				bF: y + rect.top,
				aM: rect.width,
				ax: rect.height
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


function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2(elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}


// CREATE

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function(options, string)
{
	var flags = 'g';
	if (options.c5) { flags += 'm'; }
	if (options.cz) { flags += 'i'; }

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
	return {$: 2, a: a};
};
var author$project$Main$UrlRequest = function (a) {
	return {$: 3, a: a};
};
var elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var elm$core$Array$branchFactor = 32;
var elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var elm$core$Basics$EQ = 1;
var elm$core$Basics$GT = 2;
var elm$core$Basics$LT = 0;
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
var elm$core$List$cons = _List_cons;
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
var elm$core$Array$toList = function (array) {
	return A3(elm$core$Array$foldr, elm$core$List$cons, _List_Nil, array);
};
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
var elm$core$Basics$eq = _Utils_equal;
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
var elm$core$Basics$add = _Basics_add;
var elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var elm$core$Basics$floor = _Basics_floor;
var elm$core$Basics$gt = _Utils_gt;
var elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var elm$core$Basics$mul = _Basics_mul;
var elm$core$Basics$sub = _Basics_sub;
var elm$core$Elm$JsArray$length = _JsArray_length;
var elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.q) {
			return A4(
				elm$core$Array$Array_elm_builtin,
				elm$core$Elm$JsArray$length(builder.s),
				elm$core$Array$shiftStep,
				elm$core$Elm$JsArray$empty,
				builder.s);
		} else {
			var treeLen = builder.q * elm$core$Array$branchFactor;
			var depth = elm$core$Basics$floor(
				A2(elm$core$Basics$logBase, elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? elm$core$List$reverse(builder.t) : builder.t;
			var tree = A2(elm$core$Array$treeFromBuilder, correctNodeList, builder.q);
			return A4(
				elm$core$Array$Array_elm_builtin,
				elm$core$Elm$JsArray$length(builder.s) + treeLen,
				A2(elm$core$Basics$max, 5, depth * elm$core$Array$shiftStep),
				tree,
				builder.s);
		}
	});
var elm$core$Basics$False = 1;
var elm$core$Basics$idiv = _Basics_idiv;
var elm$core$Basics$lt = _Utils_lt;
var elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					elm$core$Array$builderToArray,
					false,
					{t: nodeList, q: (len / elm$core$Array$branchFactor) | 0, s: tail});
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
var elm$core$Basics$le = _Utils_le;
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
var elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var elm$core$Maybe$Nothing = {$: 1};
var elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var elm$core$Basics$True = 0;
var elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
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
var elm$core$Basics$and = _Basics_and;
var elm$core$Basics$append = _Utils_append;
var elm$core$Basics$or = _Basics_or;
var elm$core$Char$toCode = _Char_toCode;
var elm$core$Char$isLower = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var elm$core$Char$isUpper = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var elm$core$Char$isAlpha = function (_char) {
	return elm$core$Char$isLower(_char) || elm$core$Char$isUpper(_char);
};
var elm$core$Char$isDigit = function (_char) {
	var code = elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var elm$core$Char$isAlphaNum = function (_char) {
	return elm$core$Char$isLower(_char) || (elm$core$Char$isUpper(_char) || elm$core$Char$isDigit(_char));
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
var elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
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
var elm$json$Json$Decode$map2 = _Json_map2;
var NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom = elm$json$Json$Decode$map2(elm$core$Basics$apR);
var elm$json$Json$Decode$field = _Json_decodeField;
var NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required = F3(
	function (key, valDecoder, decoder) {
		return A2(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2(elm$json$Json$Decode$field, key, valDecoder),
			decoder);
	});
var author$project$Api$Field = elm$core$Basics$identity;
var author$project$Api$GraphQLString = function (a) {
	return {$: 0, a: a};
};
var author$project$Api$Mutation = function (a) {
	return {$: 0, a: a};
};
var author$project$Api$Token = elm$core$Basics$identity;
var elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var elm$core$Dict$empty = elm$core$Dict$RBEmpty_elm_builtin;
var elm$core$Basics$compare = _Utils_compare;
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
var elm$core$Dict$Black = 1;
var elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
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
var elm$http$Http$jsonBody = function (value) {
	return A2(
		_Http_pair,
		'application/json',
		A2(elm$json$Json$Encode$encode, 0, value));
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
var author$project$Api$graphQlRequestBody = function (queryOrMutation) {
	return elm$http$Http$jsonBody(
		elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'query',
					elm$json$Json$Encode$string(queryOrMutation))
				])));
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
var elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var elm$json$Json$Decode$int = _Json_decodeInt;
var elm$json$Json$Decode$list = _Json_decodeList;
var elm$json$Json$Decode$map = _Json_map1;
var elm$json$Json$Decode$string = _Json_decodeString;
var elm$json$Json$Decode$succeed = _Json_succeed;
var author$project$Api$graphQLErrorResponseDecoderWithoutToken = A2(
	elm$json$Json$Decode$map,
	elm$core$String$join(',\n'),
	A2(
		elm$json$Json$Decode$field,
		'errors',
		elm$json$Json$Decode$list(
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'locations',
				elm$json$Json$Decode$list(
					A3(
						NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'column',
						elm$json$Json$Decode$int,
						A3(
							NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'line',
							elm$json$Json$Decode$int,
							elm$json$Json$Decode$succeed(elm$core$Tuple$pair)))),
				A3(
					NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'message',
					elm$json$Json$Decode$string,
					elm$json$Json$Decode$succeed(
						F2(
							function (message, lineAndColumnList) {
								return 'message ' + (message + (' at ' + A2(
									elm$core$String$join,
									',',
									A2(
										elm$core$List$map,
										function (_n0) {
											var line = _n0.a;
											var column = _n0.b;
											return elm$core$String$fromInt(line) + (':' + elm$core$String$fromInt(column));
										},
										lineAndColumnList))));
							})))))));
var elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
			var v = result.a;
			return elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return elm$core$Result$Err(
				f(e));
		}
	});
var elm$json$Json$Decode$decodeString = _Json_runOnString;
var author$project$Api$graphQlResponseDecoderWithoutToken = F2(
	function (decoder, response) {
		switch (response.$) {
			case 0:
				return elm$core$Result$Err('BadURL');
			case 1:
				return elm$core$Result$Err('Timeout');
			case 2:
				return elm$core$Result$Err('NetworkError');
			case 3:
				var body = response.b;
				var _n1 = A2(elm$json$Json$Decode$decodeString, author$project$Api$graphQLErrorResponseDecoderWithoutToken, body);
				if (!_n1.$) {
					var message = _n1.a;
					return elm$core$Result$Err(message);
				} else {
					var decodeError = _n1.a;
					return elm$core$Result$Err(
						elm$json$Json$Decode$errorToString(decodeError));
				}
			default:
				var body = response.b;
				return A2(
					elm$core$Result$mapError,
					elm$json$Json$Decode$errorToString,
					A2(
						elm$json$Json$Decode$decodeString,
						A2(elm$json$Json$Decode$field, 'data', decoder),
						body));
		}
	});
var elm$core$String$fromFloat = _String_fromNumber;
var author$project$Api$graphQLValueToString = function (graphQLValue) {
	switch (graphQLValue.$) {
		case 0:
			var string = graphQLValue.a;
			return A2(
				elm$json$Json$Encode$encode,
				0,
				elm$json$Json$Encode$string(string));
		case 1:
			var string = graphQLValue.a;
			return string;
		case 2:
			var _int = graphQLValue.a;
			return elm$core$String$fromInt(_int);
		case 3:
			var _float = graphQLValue.a;
			return elm$core$String$fromFloat(_float);
		case 4:
			var object = graphQLValue.a;
			return '{' + (A2(
				elm$core$String$join,
				', ',
				A2(
					elm$core$List$map,
					function (_n1) {
						var argsName = _n1.a;
						var argsValue = _n1.b;
						return argsName + (': ' + author$project$Api$graphQLValueToString(argsValue));
					},
					object)) + '}');
		case 5:
			var list = graphQLValue.a;
			return '[' + (A2(
				elm$core$String$join,
				', ',
				A2(elm$core$List$map, author$project$Api$graphQLValueToString, list)) + ']');
		default:
			return 'null';
	}
};
var author$project$Api$fieldToString = function (_n0) {
	var name = _n0.a;
	var args = _n0.b;
	var _return = _n0.c;
	return _Utils_ap(
		name,
		_Utils_ap(
			_Utils_eq(args, _List_Nil) ? '' : ('(' + (A2(
				elm$core$String$join,
				', ',
				A2(
					elm$core$List$map,
					function (_n1) {
						var argsName = _n1.a;
						var argsValue = _n1.b;
						return argsName + (': ' + author$project$Api$graphQLValueToString(argsValue));
					},
					args)) + ')')),
			_Utils_eq(_return, _List_Nil) ? '' : (' {\n' + (A2(
				elm$core$String$join,
				'\n',
				A2(elm$core$List$map, author$project$Api$fieldToString, _return)) + '\n}'))));
};
var author$project$Api$queryToString = function (query) {
	if (!query.$) {
		var fieldList = query.a;
		return 'mutation {\n' + (A2(
			elm$core$String$join,
			'\n',
			A2(elm$core$List$map, author$project$Api$fieldToString, fieldList)) + '}');
	} else {
		var fieldList = query.a;
		return '{\n' + (A2(
			elm$core$String$join,
			'\n',
			A2(elm$core$List$map, author$project$Api$fieldToString, fieldList)) + '}');
	}
};
var elm$core$Basics$identity = function (x) {
	return x;
};
var elm$http$Http$stringResolver = A2(_Http_expect, '', elm$core$Basics$identity);
var elm$core$Task$fail = _Scheduler_fail;
var elm$core$Task$succeed = _Scheduler_succeed;
var elm$http$Http$resultToTask = function (result) {
	if (!result.$) {
		var a = result.a;
		return elm$core$Task$succeed(a);
	} else {
		var x = result.a;
		return elm$core$Task$fail(x);
	}
};
var elm$http$Http$task = function (r) {
	return A3(
		_Http_toTask,
		0,
		elm$http$Http$resultToTask,
		{al: false, bg: r.bg, z: r.dj, cR: r.cR, c2: r.c2, dy: r.dy, C: elm$core$Maybe$Nothing, dE: r.dE});
};
var author$project$Api$graphQlApiRequestTaskWithoutToken = F2(
	function (query, responseDecoder) {
		return elm$http$Http$task(
			{
				bg: author$project$Api$graphQlRequestBody(
					author$project$Api$queryToString(query)),
				cR: _List_Nil,
				c2: 'POST',
				dj: elm$http$Http$stringResolver(
					author$project$Api$graphQlResponseDecoderWithoutToken(responseDecoder)),
				dy: elm$core$Maybe$Nothing,
				dE: 'https://asia-northeast1-tsukumart-f0971.cloudfunctions.net/api'
			});
	});
var author$project$Api$graphQlTokenRefreshTask = function (refresh) {
	return A2(
		author$project$Api$graphQlApiRequestTaskWithoutToken,
		author$project$Api$Mutation(
			_List_fromArray(
				[
					{
					b: _List_fromArray(
						[
							_Utils_Tuple2(
							'refreshToken',
							author$project$Api$GraphQLString(refresh))
						]),
					a: 'getAccessTokenAndUpdateRefreshToken',
					c: _List_fromArray(
						[
							{b: _List_Nil, a: 'refreshToken', c: _List_Nil},
							{b: _List_Nil, a: 'accessToken', c: _List_Nil}
						])
				}
				])),
		A2(
			elm$json$Json$Decode$field,
			'getAccessTokenAndUpdateRefreshToken',
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'accessToken',
				elm$json$Json$Decode$string,
				A3(
					NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'refreshToken',
					elm$json$Json$Decode$string,
					elm$json$Json$Decode$succeed(
						F2(
							function (refreshToken, accessToken) {
								return {bG: accessToken, b6: refreshToken};
							}))))));
};
var elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var elm$core$Task$Perform = elm$core$Basics$identity;
var elm$core$Task$andThen = _Scheduler_andThen;
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
var elm$core$Task$onError = _Scheduler_onError;
var elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return elm$core$Task$command(
			A2(
				elm$core$Task$onError,
				A2(
					elm$core$Basics$composeL,
					A2(elm$core$Basics$composeL, elm$core$Task$succeed, resultToMessage),
					elm$core$Result$Err),
				A2(
					elm$core$Task$andThen,
					A2(
						elm$core$Basics$composeL,
						A2(elm$core$Basics$composeL, elm$core$Task$succeed, resultToMessage),
						elm$core$Result$Ok),
					task)));
	});
var author$project$Api$tokenRefresh = F2(
	function (accessToken, callBack) {
		return A2(
			elm$core$Task$attempt,
			callBack,
			author$project$Api$graphQlTokenRefreshTask(accessToken));
	});
var author$project$Data$LogInState$None = {$: 0};
var author$project$Main$AddLogMessage = function (a) {
	return {$: 4, a: a};
};
var author$project$Main$GetNowTime = function (a) {
	return {$: 17, a: a};
};
var author$project$Main$LogInResponse = function (a) {
	return {$: 5, a: a};
};
var author$project$Main$Model = elm$core$Basics$identity;
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
var elm$core$Task$perform = F2(
	function (toMessage, task) {
		return elm$core$Task$command(
			A2(elm$core$Task$map, toMessage, task));
	});
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
var elm$core$String$length = _String_length;
var elm$core$String$slice = _String_slice;
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
		return {cP: fragment, bm: host, c8: path, a_: port_, a2: protocol, ef: query};
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
var elm$browser$Browser$Navigation$replaceUrl = _Browser_replaceUrl;
var elm$core$Basics$always = F2(
	function (a, _n0) {
		return a;
	});
var elm$core$Platform$Cmd$batch = _Platform_batch;
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
		var _n0 = url.a2;
		if (!_n0) {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		elm$url$Url$addPrefixed,
		'#',
		url.cP,
		A3(
			elm$url$Url$addPrefixed,
			'?',
			url.ef,
			_Utils_ap(
				A2(
					elm$url$Url$addPort,
					url.a_,
					_Utils_ap(http, url.bm)),
				url.c8)));
};
var author$project$Main$logInResponseCmd = F3(
	function (token, key, url) {
		return elm$core$Platform$Cmd$batch(
			_List_fromArray(
				[
					A2(
					elm$core$Task$perform,
					elm$core$Basics$always(
						author$project$Main$LogInResponse(
							elm$core$Result$Ok(token))),
					elm$core$Task$succeed(0)),
					A2(
					elm$browser$Browser$Navigation$replaceUrl,
					key,
					elm$url$Url$toString(
						_Utils_update(
							url,
							{ef: elm$core$Maybe$Nothing})))
				]));
	});
var author$project$Main$PageHome = function (a) {
	return {$: 0, a: a};
};
var author$project$Api$Query = function (a) {
	return {$: 1, a: a};
};
var author$project$Api$graphQlApiRequestWithoutToken = F3(
	function (query, responseDecoder, callBack) {
		return A2(
			elm$core$Task$attempt,
			callBack,
			A2(author$project$Api$graphQlApiRequestTaskWithoutToken, query, responseDecoder));
	});
var author$project$Api$enumErrorMsg = F4(
	function (idString, idName, all, toString) {
		return 'I can\'t understand \"' + (idString + ('\" in ' + (idName + ('.' + ('expect \"' + (A2(
			elm$core$String$join,
			'\" or \"',
			A2(elm$core$List$map, toString, all)) + '\".'))))));
	});
var author$project$Data$Category$ApplianceCommunication = 19;
var author$project$Data$Category$ApplianceHumidity = 13;
var author$project$Data$Category$ApplianceLight = 14;
var author$project$Data$Category$ApplianceMicrowave = 9;
var author$project$Data$Category$ApplianceOther = 20;
var author$project$Data$Category$AppliancePc = 18;
var author$project$Data$Category$ApplianceRefrigerator = 8;
var author$project$Data$Category$ApplianceSmartphone = 17;
var author$project$Data$Category$ApplianceSpeaker = 16;
var author$project$Data$Category$ApplianceTemperature = 12;
var author$project$Data$Category$ApplianceTv = 15;
var author$project$Data$Category$ApplianceVacuum = 11;
var author$project$Data$Category$ApplianceWashing = 10;
var author$project$Data$Category$BookBook = 25;
var author$project$Data$Category$BookComic = 26;
var author$project$Data$Category$BookOther = 27;
var author$project$Data$Category$BookTextbook = 24;
var author$project$Data$Category$FashionLadies = 22;
var author$project$Data$Category$FashionMens = 21;
var author$project$Data$Category$FashionOther = 23;
var author$project$Data$Category$FoodBeverage = 33;
var author$project$Data$Category$FoodFood = 32;
var author$project$Data$Category$FoodOther = 34;
var author$project$Data$Category$FurnitureBed = 3;
var author$project$Data$Category$FurnitureChair = 1;
var author$project$Data$Category$FurnitureChest = 2;
var author$project$Data$Category$FurnitureCurtain = 5;
var author$project$Data$Category$FurnitureKitchen = 4;
var author$project$Data$Category$FurnitureMat = 6;
var author$project$Data$Category$FurnitureOther = 7;
var author$project$Data$Category$FurnitureTable = 0;
var author$project$Data$Category$HobbyAccessory = 41;
var author$project$Data$Category$HobbyArt = 40;
var author$project$Data$Category$HobbyCamera = 37;
var author$project$Data$Category$HobbyDaily = 42;
var author$project$Data$Category$HobbyDisc = 35;
var author$project$Data$Category$HobbyGame = 38;
var author$project$Data$Category$HobbyHandmade = 43;
var author$project$Data$Category$HobbyInstrument = 36;
var author$project$Data$Category$HobbyOther = 44;
var author$project$Data$Category$HobbySport = 39;
var author$project$Data$Category$VehicleBicycle = 28;
var author$project$Data$Category$VehicleBike = 29;
var author$project$Data$Category$VehicleCar = 30;
var author$project$Data$Category$VehicleOther = 31;
var author$project$Data$Category$all = _List_fromArray(
	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44]);
var author$project$Data$Category$fromIdString = function (id) {
	switch (id) {
		case 'furnitureTable':
			return elm$core$Maybe$Just(0);
		case 'furnitureChair':
			return elm$core$Maybe$Just(1);
		case 'furnitureChest':
			return elm$core$Maybe$Just(2);
		case 'furnitureBed':
			return elm$core$Maybe$Just(3);
		case 'furnitureKitchen':
			return elm$core$Maybe$Just(4);
		case 'furnitureCurtain':
			return elm$core$Maybe$Just(5);
		case 'furnitureMat':
			return elm$core$Maybe$Just(6);
		case 'furnitureOther':
			return elm$core$Maybe$Just(7);
		case 'applianceRefrigerator':
			return elm$core$Maybe$Just(8);
		case 'applianceMicrowave':
			return elm$core$Maybe$Just(9);
		case 'applianceWashing':
			return elm$core$Maybe$Just(10);
		case 'applianceVacuum':
			return elm$core$Maybe$Just(11);
		case 'applianceTemperature':
			return elm$core$Maybe$Just(12);
		case 'applianceHumidity':
			return elm$core$Maybe$Just(13);
		case 'applianceLight':
			return elm$core$Maybe$Just(14);
		case 'applianceTv':
			return elm$core$Maybe$Just(15);
		case 'applianceSpeaker':
			return elm$core$Maybe$Just(16);
		case 'applianceSmartphone':
			return elm$core$Maybe$Just(17);
		case 'appliancePc':
			return elm$core$Maybe$Just(18);
		case 'applianceCommunication':
			return elm$core$Maybe$Just(19);
		case 'applianceOther':
			return elm$core$Maybe$Just(20);
		case 'fashionMens':
			return elm$core$Maybe$Just(21);
		case 'fashionLadies':
			return elm$core$Maybe$Just(22);
		case 'fashionOther':
			return elm$core$Maybe$Just(23);
		case 'bookTextbook':
			return elm$core$Maybe$Just(24);
		case 'bookBook':
			return elm$core$Maybe$Just(25);
		case 'bookComic':
			return elm$core$Maybe$Just(26);
		case 'bookOther':
			return elm$core$Maybe$Just(27);
		case 'vehicleBicycle':
			return elm$core$Maybe$Just(28);
		case 'vehicleBike':
			return elm$core$Maybe$Just(29);
		case 'vehicleCar':
			return elm$core$Maybe$Just(30);
		case 'vehicleOther':
			return elm$core$Maybe$Just(31);
		case 'foodFood':
			return elm$core$Maybe$Just(32);
		case 'foodBeverage':
			return elm$core$Maybe$Just(33);
		case 'foodOther':
			return elm$core$Maybe$Just(34);
		case 'hobbyDisc':
			return elm$core$Maybe$Just(35);
		case 'hobbyInstrument':
			return elm$core$Maybe$Just(36);
		case 'hobbyCamera':
			return elm$core$Maybe$Just(37);
		case 'hobbyGame':
			return elm$core$Maybe$Just(38);
		case 'hobbySport':
			return elm$core$Maybe$Just(39);
		case 'hobbyArt':
			return elm$core$Maybe$Just(40);
		case 'hobbyAccessory':
			return elm$core$Maybe$Just(41);
		case 'hobbyDaily':
			return elm$core$Maybe$Just(42);
		case 'hobbyHandmade':
			return elm$core$Maybe$Just(43);
		case 'hobbyOther':
			return elm$core$Maybe$Just(44);
		default:
			return elm$core$Maybe$Nothing;
	}
};
var author$project$Data$Category$toIdString = function (subCategory) {
	switch (subCategory) {
		case 0:
			return 'furnitureTable';
		case 1:
			return 'furnitureChair';
		case 2:
			return 'furnitureChest';
		case 3:
			return 'furnitureBed';
		case 4:
			return 'furnitureKitchen';
		case 5:
			return 'furnitureCurtain';
		case 6:
			return 'furnitureMat';
		case 7:
			return 'furnitureOther';
		case 8:
			return 'applianceRefrigerator';
		case 9:
			return 'applianceMicrowave';
		case 10:
			return 'applianceWashing';
		case 11:
			return 'applianceVacuum';
		case 12:
			return 'applianceTemperature';
		case 13:
			return 'applianceHumidity';
		case 14:
			return 'applianceLight';
		case 15:
			return 'applianceTv';
		case 16:
			return 'applianceSpeaker';
		case 17:
			return 'applianceSmartphone';
		case 18:
			return 'appliancePc';
		case 19:
			return 'applianceCommunication';
		case 20:
			return 'applianceOther';
		case 21:
			return 'fashionMens';
		case 22:
			return 'fashionLadies';
		case 23:
			return 'fashionOther';
		case 24:
			return 'bookTextbook';
		case 25:
			return 'bookBook';
		case 26:
			return 'bookComic';
		case 27:
			return 'bookOther';
		case 28:
			return 'vehicleBicycle';
		case 29:
			return 'vehicleBike';
		case 30:
			return 'vehicleCar';
		case 31:
			return 'vehicleOther';
		case 32:
			return 'foodFood';
		case 33:
			return 'foodBeverage';
		case 34:
			return 'foodOther';
		case 35:
			return 'hobbyDisc';
		case 36:
			return 'hobbyInstrument';
		case 37:
			return 'hobbyCamera';
		case 38:
			return 'hobbyGame';
		case 39:
			return 'hobbySport';
		case 40:
			return 'hobbyArt';
		case 41:
			return 'hobbyAccessory';
		case 42:
			return 'hobbyDaily';
		case 43:
			return 'hobbyHandmade';
		default:
			return 'hobbyOther';
	}
};
var elm$json$Json$Decode$andThen = _Json_andThen;
var elm$json$Json$Decode$fail = _Json_fail;
var author$project$Api$categoryDecoder = A2(
	elm$json$Json$Decode$andThen,
	function (idString) {
		var _n0 = author$project$Data$Category$fromIdString(idString);
		if (!_n0.$) {
			var category = _n0.a;
			return elm$json$Json$Decode$succeed(category);
		} else {
			return elm$json$Json$Decode$fail(
				A4(author$project$Api$enumErrorMsg, idString, 'category', author$project$Data$Category$all, author$project$Data$Category$toIdString));
		}
	},
	elm$json$Json$Decode$string);
var author$project$Data$ImageId$ImageId = elm$core$Basics$identity;
var author$project$Data$ImageId$fromString = elm$core$Basics$identity;
var author$project$Api$imageIdDecoder = A2(
	elm$json$Json$Decode$map,
	function (string) {
		return author$project$Data$ImageId$fromString(string);
	},
	elm$json$Json$Decode$string);
var author$project$Data$Product$Selling = 0;
var author$project$Data$Product$SoldOut = 2;
var author$project$Data$Product$Trading = 1;
var author$project$Data$Product$statusAll = _List_fromArray(
	[0, 1, 2]);
var author$project$Data$Product$statusToIdString = function (status) {
	switch (status) {
		case 0:
			return 'selling';
		case 1:
			return 'trading';
		default:
			return 'soldOut';
	}
};
var author$project$Data$Product$statusFromIdStringLoop = F2(
	function (idString, statusList) {
		statusFromIdStringLoop:
		while (true) {
			if (statusList.b) {
				var x = statusList.a;
				var xs = statusList.b;
				if (_Utils_eq(
					author$project$Data$Product$statusToIdString(x),
					idString)) {
					return elm$core$Maybe$Just(x);
				} else {
					var $temp$idString = idString,
						$temp$statusList = xs;
					idString = $temp$idString;
					statusList = $temp$statusList;
					continue statusFromIdStringLoop;
				}
			} else {
				return elm$core$Maybe$Nothing;
			}
		}
	});
var author$project$Data$Product$statusFromIdString = function (idString) {
	return A2(author$project$Data$Product$statusFromIdStringLoop, idString, author$project$Data$Product$statusAll);
};
var author$project$Api$productStatusDecoder = A2(
	elm$json$Json$Decode$andThen,
	function (idString) {
		var _n0 = author$project$Data$Product$statusFromIdString(idString);
		if (!_n0.$) {
			var status = _n0.a;
			return elm$json$Json$Decode$succeed(status);
		} else {
			return elm$json$Json$Decode$fail(
				A4(author$project$Api$enumErrorMsg, idString, 'status', author$project$Data$Product$statusAll, author$project$Data$Product$statusToIdString));
		}
	},
	elm$json$Json$Decode$string);
var author$project$Data$Product$Id = elm$core$Basics$identity;
var author$project$Data$Product$Product = elm$core$Basics$identity;
var author$project$Data$Product$fromApi = function (rec) {
	return {bJ: rec.bJ, aa: rec.aa, c1: rec.c1, a: rec.a, b4: rec.b4, cd: rec.cd, et: rec.et};
};
var author$project$Api$productDecoder = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'likedCount',
	elm$json$Json$Decode$int,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'thumbnailImageId',
		author$project$Api$imageIdDecoder,
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'status',
			author$project$Api$productStatusDecoder,
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'category',
				author$project$Api$categoryDecoder,
				A3(
					NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'price',
					elm$json$Json$Decode$int,
					A3(
						NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'name',
						elm$json$Json$Decode$string,
						A3(
							NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'id',
							elm$json$Json$Decode$string,
							elm$json$Json$Decode$succeed(
								F7(
									function (id, name, price, category, status, thumbnailImageId, likedCount) {
										return author$project$Data$Product$fromApi(
											{bJ: category, aa: id, c1: likedCount, a: name, b4: price, cd: status, et: thumbnailImageId});
									})))))))));
var author$project$Api$productReturn = _List_fromArray(
	[
		{b: _List_Nil, a: 'id', c: _List_Nil},
		{b: _List_Nil, a: 'name', c: _List_Nil},
		{b: _List_Nil, a: 'price', c: _List_Nil},
		{b: _List_Nil, a: 'category', c: _List_Nil},
		{b: _List_Nil, a: 'status', c: _List_Nil},
		{b: _List_Nil, a: 'thumbnailImageId', c: _List_Nil},
		{b: _List_Nil, a: 'likedCount', c: _List_Nil}
	]);
var author$project$Api$getFreeProductList = function (callBack) {
	return A3(
		author$project$Api$graphQlApiRequestWithoutToken,
		author$project$Api$Query(
			_List_fromArray(
				[
					{b: _List_Nil, a: 'productFreeAll', c: author$project$Api$productReturn}
				])),
		A2(
			elm$json$Json$Decode$field,
			'productFreeAll',
			elm$json$Json$Decode$list(author$project$Api$productDecoder)),
		callBack);
};
var author$project$Api$getRecentProductList = function (callBack) {
	return A3(
		author$project$Api$graphQlApiRequestWithoutToken,
		author$project$Api$Query(
			_List_fromArray(
				[
					{b: _List_Nil, a: 'productRecentAll', c: author$project$Api$productReturn}
				])),
		A2(
			elm$json$Json$Decode$field,
			'productRecentAll',
			elm$json$Json$Decode$list(author$project$Api$productDecoder)),
		callBack);
};
var author$project$Api$getRecommendProductList = function (callBack) {
	return A3(
		author$project$Api$graphQlApiRequestWithoutToken,
		author$project$Api$Query(
			_List_fromArray(
				[
					{b: _List_Nil, a: 'productRecommendAll', c: author$project$Api$productReturn}
				])),
		A2(
			elm$json$Json$Decode$field,
			'productRecommendAll',
			elm$json$Json$Decode$list(author$project$Api$productDecoder)),
		callBack);
};
var author$project$Main$PageMsg = function (a) {
	return {$: 16, a: a};
};
var author$project$Main$PageMsgHome = function (a) {
	return {$: 0, a: a};
};
var author$project$Api$GetData = function (a) {
	return {$: 0, a: a};
};
var author$project$Api$JwtExpired = {$: 1};
var author$project$Api$batchError = function (list) {
	if (!list.b) {
		return elm$core$Result$Err('空のエラー');
	} else {
		if (!list.a.$) {
			return elm$core$Result$Ok(0);
		} else {
			var message = list.a.a;
			var xs = list.b;
			var _n1 = author$project$Api$batchError(xs);
			if (!_n1.$) {
				return elm$core$Result$Ok(0);
			} else {
				var messageJoined = _n1.a;
				return elm$core$Result$Err(message + (',\n' + messageJoined));
			}
		}
	}
};
var author$project$Api$graphQLErrorResponseDecoderWithToken = A2(
	elm$json$Json$Decode$map,
	author$project$Api$batchError,
	A2(
		elm$json$Json$Decode$field,
		'errors',
		elm$json$Json$Decode$list(
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'locations',
				elm$json$Json$Decode$list(
					A3(
						NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'column',
						elm$json$Json$Decode$int,
						A3(
							NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'line',
							elm$json$Json$Decode$int,
							elm$json$Json$Decode$succeed(elm$core$Tuple$pair)))),
				A3(
					NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'message',
					elm$json$Json$Decode$string,
					elm$json$Json$Decode$succeed(
						F2(
							function (message, lineAndColumnList) {
								return (message === 'jwt expired') ? elm$core$Result$Ok(0) : elm$core$Result$Err(
									'message ' + (message + (' at ' + A2(
										elm$core$String$join,
										',',
										A2(
											elm$core$List$map,
											function (_n0) {
												var line = _n0.a;
												var column = _n0.b;
												return elm$core$String$fromInt(line) + (':' + elm$core$String$fromInt(column));
											},
											lineAndColumnList)))));
							})))))));
var author$project$Api$graphQlResponseDecoderWithToken = F2(
	function (decoder, response) {
		switch (response.$) {
			case 0:
				return elm$core$Result$Err('BadURL');
			case 1:
				return elm$core$Result$Err('Timeout');
			case 2:
				return elm$core$Result$Err('NetworkError');
			case 3:
				var body = response.b;
				var _n1 = A2(elm$json$Json$Decode$decodeString, author$project$Api$graphQLErrorResponseDecoderWithToken, body);
				if (!_n1.$) {
					if (!_n1.a.$) {
						return elm$core$Result$Ok(author$project$Api$JwtExpired);
					} else {
						var message = _n1.a.a;
						return elm$core$Result$Err(message);
					}
				} else {
					var decodeError = _n1.a;
					return elm$core$Result$Err(
						elm$json$Json$Decode$errorToString(decodeError));
				}
			default:
				var body = response.b;
				var _n2 = A2(
					elm$json$Json$Decode$decodeString,
					A2(elm$json$Json$Decode$field, 'data', decoder),
					body);
				if (!_n2.$) {
					var a = _n2.a;
					return elm$core$Result$Ok(
						author$project$Api$GetData(a));
				} else {
					var decodeError = _n2.a;
					return elm$core$Result$Err(
						elm$json$Json$Decode$errorToString(decodeError));
				}
		}
	});
var author$project$Api$graphQlApiRequestTaskWithToken = F3(
	function (token, query, responseDecoder) {
		return elm$http$Http$task(
			{
				bg: author$project$Api$graphQlRequestBody(
					author$project$Api$queryToString(
						query(token))),
				cR: _List_Nil,
				c2: 'POST',
				dj: elm$http$Http$stringResolver(
					author$project$Api$graphQlResponseDecoderWithToken(responseDecoder)),
				dy: elm$core$Maybe$Nothing,
				dE: 'https://asia-northeast1-tsukumart-f0971.cloudfunctions.net/api'
			});
	});
var author$project$Api$tokenGetRefreshTokenAsString = function (_n0) {
	var refresh = _n0.b6;
	return refresh;
};
var author$project$Api$graphQlResultToTask = F4(
	function (token, query, responseDecoder, result) {
		if (result.$ === 1) {
			return A2(
				elm$core$Task$andThen,
				function (newToken) {
					return A2(
						author$project$Api$graphQlApiRequestTaskWithoutToken,
						query(newToken),
						responseDecoder);
				},
				author$project$Api$graphQlTokenRefreshTask(
					author$project$Api$tokenGetRefreshTokenAsString(token)));
		} else {
			var a = result.a;
			return elm$core$Task$succeed(a);
		}
	});
var author$project$Api$graphQlApiRequestWithToken = F4(
	function (query, responseDecoder, token, callBack) {
		return A2(
			elm$core$Task$attempt,
			callBack,
			A2(
				elm$core$Task$andThen,
				A3(author$project$Api$graphQlResultToTask, token, query, responseDecoder),
				A3(author$project$Api$graphQlApiRequestTaskWithToken, token, query, responseDecoder)));
	});
var author$project$Api$productOnlyLikeCountDecoder = A2(elm$json$Json$Decode$field, 'likedCount', elm$json$Json$Decode$int);
var author$project$Api$productOnlyLikeCountReturn = _List_fromArray(
	[
		{b: _List_Nil, a: 'likedCount', c: _List_Nil}
	]);
var author$project$Api$tokenGetAccessTokenAsString = function (_n0) {
	var access = _n0.bG;
	return access;
};
var author$project$Data$Product$idToString = function (_n0) {
	var id = _n0;
	return id;
};
var author$project$Api$likeProduct = function (productId) {
	return A2(
		author$project$Api$graphQlApiRequestWithToken,
		function (token) {
			return author$project$Api$Mutation(
				_List_fromArray(
					[
						{
						b: _List_fromArray(
							[
								_Utils_Tuple2(
								'accessToken',
								author$project$Api$GraphQLString(
									author$project$Api$tokenGetAccessTokenAsString(token))),
								_Utils_Tuple2(
								'productId',
								author$project$Api$GraphQLString(
									author$project$Data$Product$idToString(productId)))
							]),
						a: 'likeProduct',
						c: author$project$Api$productOnlyLikeCountReturn
					}
					]));
		},
		A2(elm$json$Json$Decode$field, 'likeProduct', author$project$Api$productOnlyLikeCountDecoder));
};
var author$project$Api$unlikeProduct = F2(
	function (productId, callBack) {
		return A3(
			author$project$Api$graphQlApiRequestWithToken,
			function (token) {
				return author$project$Api$Mutation(
					_List_fromArray(
						[
							{
							b: _List_fromArray(
								[
									_Utils_Tuple2(
									'accessToken',
									author$project$Api$GraphQLString(
										author$project$Api$tokenGetAccessTokenAsString(token))),
									_Utils_Tuple2(
									'productId',
									author$project$Api$GraphQLString(
										author$project$Data$Product$idToString(productId)))
								]),
							a: 'unlikeProduct',
							c: author$project$Api$productOnlyLikeCountReturn
						}
						]));
			},
			A2(elm$json$Json$Decode$field, 'unlikeProduct', author$project$Api$productOnlyLikeCountDecoder),
			callBack);
	});
var author$project$Main$LikeProductResponse = F2(
	function (a, b) {
		return {$: 12, a: a, b: b};
	});
var author$project$Main$UnlikeProductResponse = F2(
	function (a, b) {
		return {$: 13, a: a, b: b};
	});
var author$project$Main$elementScrollIntoView = _Platform_outgoingPort('elementScrollIntoView', elm$json$Json$Encode$string);
var author$project$Main$productListEmissionToCmd = function (emission) {
	switch (emission.$) {
		case 0:
			var token = emission.a;
			var id = emission.b;
			return A3(
				author$project$Api$likeProduct,
				id,
				token,
				author$project$Main$LikeProductResponse(id));
		case 1:
			var token = emission.a;
			var id = emission.b;
			return A3(
				author$project$Api$unlikeProduct,
				id,
				token,
				author$project$Main$UnlikeProductResponse(id));
		default:
			var idString = emission.a;
			return author$project$Main$elementScrollIntoView(idString);
	}
};
var author$project$Page$Home$GetFreeProductsResponse = function (a) {
	return {$: 3, a: a};
};
var author$project$Page$Home$GetRecentProductsResponse = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$Home$GetRecommendProductsResponse = function (a) {
	return {$: 2, a: a};
};
var elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var author$project$Main$homePageEmissionToCmd = function (emission) {
	switch (emission.$) {
		case 0:
			return author$project$Api$getRecentProductList(
				A2(
					elm$core$Basics$composeR,
					author$project$Page$Home$GetRecentProductsResponse,
					A2(elm$core$Basics$composeR, author$project$Main$PageMsgHome, author$project$Main$PageMsg)));
		case 1:
			return author$project$Api$getRecommendProductList(
				A2(
					elm$core$Basics$composeR,
					author$project$Page$Home$GetRecommendProductsResponse,
					A2(elm$core$Basics$composeR, author$project$Main$PageMsgHome, author$project$Main$PageMsg)));
		case 2:
			return author$project$Api$getFreeProductList(
				A2(
					elm$core$Basics$composeR,
					author$project$Page$Home$GetFreeProductsResponse,
					A2(elm$core$Basics$composeR, author$project$Main$PageMsgHome, author$project$Main$PageMsg)));
		case 3:
			var e = emission.a;
			return author$project$Main$productListEmissionToCmd(e);
		default:
			var log = emission.a;
			return A2(
				elm$core$Task$perform,
				elm$core$Basics$always(
					author$project$Main$AddLogMessage(log)),
				elm$core$Task$succeed(0));
	}
};
var author$project$Main$mapPageModel = F3(
	function (modelFunc, emissionListFunc, _n0) {
		var eachPageMsg = _n0.a;
		var eachPageEmissionList = _n0.b;
		return _Utils_Tuple2(
			modelFunc(eachPageMsg),
			elm$core$Platform$Cmd$batch(
				A2(elm$core$List$map, emissionListFunc, eachPageEmissionList)));
	});
var author$project$Page$Component$ProductList$EmissionScrollIntoView = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$Component$ProductList$Model = elm$core$Basics$identity;
var author$project$Page$Component$ProductList$productIdString = function (productId) {
	return 'product-' + author$project$Data$Product$idToString(productId);
};
var elm$core$Set$Set_elm_builtin = elm$core$Basics$identity;
var elm$core$Set$empty = elm$core$Dict$empty;
var author$project$Page$Component$ProductList$initModel = function (productIdMaybe) {
	return _Utils_Tuple2(
		{R: elm$core$Set$empty},
		function () {
			if (!productIdMaybe.$) {
				var id = productIdMaybe.a;
				return _List_fromArray(
					[
						author$project$Page$Component$ProductList$EmissionScrollIntoView(
						author$project$Page$Component$ProductList$productIdString(id))
					]);
			} else {
				return _List_Nil;
			}
		}());
};
var author$project$Page$Home$EmissionGetRecommendProducts = {$: 1};
var author$project$Page$Home$EmissionProducts = function (a) {
	return {$: 3, a: a};
};
var author$project$Page$Home$Model = elm$core$Basics$identity;
var author$project$Page$Home$TabRecommend = 1;
var author$project$Page$Home$initModel = function (productIdMaybe) {
	var _n0 = author$project$Page$Component$ProductList$initModel(productIdMaybe);
	var productListModel = _n0.a;
	var emissionList = _n0.b;
	return _Utils_Tuple2(
		{aw: elm$core$Maybe$Nothing, a1: productListModel, aD: elm$core$Maybe$Nothing, aE: elm$core$Maybe$Nothing, a5: 1},
		_Utils_ap(
			_List_fromArray(
				[author$project$Page$Home$EmissionGetRecommendProducts]),
			A2(elm$core$List$map, author$project$Page$Home$EmissionProducts, emissionList)));
};
var elm$core$Tuple$mapSecond = F2(
	function (func, _n0) {
		var x = _n0.a;
		var y = _n0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var author$project$Main$pageNotFound = A2(
	elm$core$Tuple$mapSecond,
	function (c) {
		return elm$core$Platform$Cmd$batch(
			_List_fromArray(
				[
					c,
					A2(
					elm$core$Task$perform,
					elm$core$Basics$identity,
					elm$core$Task$succeed(
						author$project$Main$AddLogMessage('指定したページが見つからないのでホームに移動しました')))
				]));
	},
	A3(
		author$project$Main$mapPageModel,
		author$project$Main$PageHome,
		author$project$Main$homePageEmissionToCmd,
		author$project$Page$Home$initModel(elm$core$Maybe$Nothing)));
var author$project$Main$PageAbout = function (a) {
	return {$: 16, a: a};
};
var author$project$Main$PageBoughtProducts = function (a) {
	return {$: 6, a: a};
};
var author$project$Main$PageCommentedProducts = function (a) {
	return {$: 9, a: a};
};
var author$project$Main$PageExhibition = function (a) {
	return {$: 10, a: a};
};
var author$project$Main$PageHistory = function (a) {
	return {$: 4, a: a};
};
var author$project$Main$PageLikedProducts = function (a) {
	return {$: 3, a: a};
};
var author$project$Main$PageLogIn = function (a) {
	return {$: 2, a: a};
};
var author$project$Main$PageNotification = function (a) {
	return {$: 15, a: a};
};
var author$project$Main$PageProduct = function (a) {
	return {$: 11, a: a};
};
var author$project$Main$PageSearch = function (a) {
	return {$: 14, a: a};
};
var author$project$Main$PageSignUp = function (a) {
	return {$: 1, a: a};
};
var author$project$Main$PageSoldProducts = function (a) {
	return {$: 5, a: a};
};
var author$project$Main$PageTrade = function (a) {
	return {$: 12, a: a};
};
var author$project$Main$PageTradesInPast = function (a) {
	return {$: 8, a: a};
};
var author$project$Main$PageTradesInProgress = function (a) {
	return {$: 7, a: a};
};
var author$project$Main$PageUser = function (a) {
	return {$: 13, a: a};
};
var author$project$Api$getBoughtProductList = A2(
	author$project$Api$graphQlApiRequestWithToken,
	function (token) {
		return author$project$Api$Query(
			_List_fromArray(
				[
					{
					b: _List_fromArray(
						[
							_Utils_Tuple2(
							'accessToken',
							author$project$Api$GraphQLString(
								author$project$Api$tokenGetAccessTokenAsString(token)))
						]),
					a: 'userPrivate',
					c: _List_fromArray(
						[
							{b: _List_Nil, a: 'boughtProductAll', c: author$project$Api$productReturn}
						])
				}
				]));
	},
	A2(
		elm$json$Json$Decode$field,
		'userPrivate',
		A2(
			elm$json$Json$Decode$field,
			'boughtProductAll',
			elm$json$Json$Decode$list(author$project$Api$productDecoder))));
var author$project$Main$PageMsgBoughtProducts = function (a) {
	return {$: 4, a: a};
};
var author$project$Api$GraphQLEnum = function (a) {
	return {$: 1, a: a};
};
var author$project$Api$logInOrSignUpUrlResponseToResult = A2(
	elm$json$Json$Decode$andThen,
	function (urlString) {
		var _n0 = elm$url$Url$fromString(urlString);
		if (!_n0.$) {
			var url = _n0.a;
			return elm$json$Json$Decode$succeed(url);
		} else {
			return elm$json$Json$Decode$fail('url');
		}
	},
	A2(elm$json$Json$Decode$field, 'getLogInUrl', elm$json$Json$Decode$string));
var author$project$Api$logInOrSignUpUrlRequest = F2(
	function (service, callBack) {
		return A3(
			author$project$Api$graphQlApiRequestWithoutToken,
			author$project$Api$Mutation(
				_List_fromArray(
					[
						{
						b: _List_fromArray(
							[
								_Utils_Tuple2(
								'service',
								author$project$Api$GraphQLEnum(
									function () {
										switch (service) {
											case 0:
												return 'google';
											case 1:
												return 'gitHub';
											case 2:
												return 'twitter';
											default:
												return 'line';
										}
									}()))
							]),
						a: 'getLogInUrl',
						c: _List_Nil
					}
					])),
			author$project$Api$logInOrSignUpUrlResponseToResult,
			callBack);
	});
var author$project$Main$LogInOrSignUpUrlResponse = function (a) {
	return {$: 18, a: a};
};
var author$project$Main$logInEmissionToCmd = function (emission) {
	var service = emission;
	return A2(author$project$Api$logInOrSignUpUrlRequest, service, author$project$Main$LogInOrSignUpUrlResponse);
};
var author$project$Page$BoughtProducts$GetProductsResponse = function (a) {
	return {$: 0, a: a};
};
var author$project$Main$boughtProductsPageEmissionToCmd = function (emission) {
	switch (emission.$) {
		case 0:
			var token = emission.a;
			return A2(
				author$project$Api$getBoughtProductList,
				token,
				A2(
					elm$core$Basics$composeR,
					author$project$Page$BoughtProducts$GetProductsResponse,
					A2(elm$core$Basics$composeR, author$project$Main$PageMsgBoughtProducts, author$project$Main$PageMsg)));
		case 1:
			var e = emission.a;
			return author$project$Main$logInEmissionToCmd(e);
		case 2:
			var e = emission.a;
			return author$project$Main$productListEmissionToCmd(e);
		default:
			var log = emission.a;
			return A2(
				elm$core$Task$perform,
				elm$core$Basics$always(
					author$project$Main$AddLogMessage(log)),
				elm$core$Task$succeed(0));
	}
};
var author$project$Api$getCommentedProductList = A2(
	author$project$Api$graphQlApiRequestWithToken,
	function (token) {
		return author$project$Api$Query(
			_List_fromArray(
				[
					{
					b: _List_fromArray(
						[
							_Utils_Tuple2(
							'accessToken',
							author$project$Api$GraphQLString(
								author$project$Api$tokenGetAccessTokenAsString(token)))
						]),
					a: 'userPrivate',
					c: _List_fromArray(
						[
							{b: _List_Nil, a: 'commentedProductAll', c: author$project$Api$productReturn}
						])
				}
				]));
	},
	A2(
		elm$json$Json$Decode$field,
		'userPrivate',
		A2(
			elm$json$Json$Decode$field,
			'commentedProductAll',
			elm$json$Json$Decode$list(author$project$Api$productDecoder))));
var author$project$Main$PageMsgCommentedProducts = function (a) {
	return {$: 7, a: a};
};
var author$project$Page$CommentedProducts$GetProductsResponse = function (a) {
	return {$: 0, a: a};
};
var author$project$Main$commentedProductsEmissionToCmd = function (emission) {
	switch (emission.$) {
		case 0:
			var token = emission.a;
			return A2(
				author$project$Api$getCommentedProductList,
				token,
				A2(
					elm$core$Basics$composeR,
					author$project$Page$CommentedProducts$GetProductsResponse,
					A2(elm$core$Basics$composeR, author$project$Main$PageMsgCommentedProducts, author$project$Main$PageMsg)));
		case 1:
			var e = emission.a;
			return author$project$Main$logInEmissionToCmd(e);
		case 2:
			var e = emission.a;
			return author$project$Main$productListEmissionToCmd(e);
		default:
			var log = emission.a;
			return A2(
				elm$core$Task$perform,
				elm$core$Basics$always(
					author$project$Main$AddLogMessage(log)),
				elm$core$Task$succeed(0));
	}
};
var author$project$Api$GraphQLInt = function (a) {
	return {$: 2, a: a};
};
var author$project$Api$GraphQLList = function (a) {
	return {$: 5, a: a};
};
var author$project$Data$Product$ConditionAcceptable = 4;
var author$project$Data$Product$ConditionGood = 3;
var author$project$Data$Product$ConditionJunk = 5;
var author$project$Data$Product$ConditionLikeNew = 1;
var author$project$Data$Product$ConditionNew = 0;
var author$project$Data$Product$ConditionVeryGood = 2;
var author$project$Data$Product$conditionAll = _List_fromArray(
	[0, 1, 2, 3, 4, 5]);
var author$project$Data$Product$conditionToIdString = function (condition) {
	switch (condition) {
		case 0:
			return 'new';
		case 1:
			return 'likeNew';
		case 2:
			return 'veryGood';
		case 3:
			return 'good';
		case 4:
			return 'acceptable';
		default:
			return 'junk';
	}
};
var author$project$Data$Product$conditionFromStringLoop = F2(
	function (idString, conditionList) {
		conditionFromStringLoop:
		while (true) {
			if (conditionList.b) {
				var x = conditionList.a;
				var xs = conditionList.b;
				if (_Utils_eq(
					author$project$Data$Product$conditionToIdString(x),
					idString)) {
					return elm$core$Maybe$Just(x);
				} else {
					var $temp$idString = idString,
						$temp$conditionList = xs;
					idString = $temp$idString;
					conditionList = $temp$conditionList;
					continue conditionFromStringLoop;
				}
			} else {
				return elm$core$Maybe$Nothing;
			}
		}
	});
var author$project$Data$Product$conditionFromIdString = function (idString) {
	return A2(author$project$Data$Product$conditionFromStringLoop, idString, author$project$Data$Product$conditionAll);
};
var author$project$Api$conditionDecoder = A2(
	elm$json$Json$Decode$andThen,
	function (idString) {
		var _n0 = author$project$Data$Product$conditionFromIdString(idString);
		if (!_n0.$) {
			var condition = _n0.a;
			return elm$json$Json$Decode$succeed(condition);
		} else {
			return elm$json$Json$Decode$fail(
				A4(author$project$Api$enumErrorMsg, idString, 'condition', author$project$Data$Product$conditionAll, author$project$Data$Product$conditionToIdString));
		}
	},
	elm$json$Json$Decode$string);
var elm$json$Json$Decode$float = _Json_decodeFloat;
var elm$time$Time$Posix = elm$core$Basics$identity;
var elm$time$Time$millisToPosix = elm$core$Basics$identity;
var author$project$Api$dateTimeDecoder = A2(
	elm$json$Json$Decode$map,
	A2(elm$core$Basics$composeR, elm$core$Basics$floor, elm$time$Time$millisToPosix),
	elm$json$Json$Decode$float);
var author$project$Api$imageIdsDecoder = A2(
	elm$json$Json$Decode$andThen,
	function (list) {
		if (!list.b) {
			return elm$json$Json$Decode$fail('imageIds length is 0');
		} else {
			var x = list.a;
			var xs = list.b;
			return elm$json$Json$Decode$succeed(
				_Utils_Tuple2(
					author$project$Data$ImageId$fromString(x),
					A2(elm$core$List$map, author$project$Data$ImageId$fromString, xs)));
		}
	},
	elm$json$Json$Decode$list(elm$json$Json$Decode$string));
var author$project$Data$User$WithName = elm$core$Basics$identity;
var author$project$Data$User$Id = elm$core$Basics$identity;
var author$project$Data$User$idFromString = elm$core$Basics$identity;
var author$project$Data$User$withNameFromApi = function (_n0) {
	var id = _n0.aa;
	var displayName = _n0.Y;
	var imageId = _n0.bR;
	return {
		Y: displayName,
		aa: author$project$Data$User$idFromString(id),
		bR: imageId
	};
};
var author$project$Api$userWithNameDecoder = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'imageId',
	author$project$Api$imageIdDecoder,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'displayName',
		elm$json$Json$Decode$string,
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'id',
			elm$json$Json$Decode$string,
			elm$json$Json$Decode$succeed(
				F3(
					function (id, displayName, imageId) {
						return author$project$Data$User$withNameFromApi(
							{Y: displayName, aa: id, bR: imageId});
					})))));
var author$project$Data$Product$ProductDetail = elm$core$Basics$identity;
var author$project$Data$Product$detailFromApi = function (rec) {
	return {bJ: rec.bJ, bK: elm$core$Maybe$Nothing, cD: rec.cD, aS: rec.aS, cH: rec.cH, aa: rec.aa, d1: rec.d1, c1: rec.c1, a: rec.a, b4: rec.b4, dn: rec.dn, cd: rec.cd};
};
var author$project$Api$productDetailDecoder = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'createdAt',
	author$project$Api$dateTimeDecoder,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'seller',
		author$project$Api$userWithNameDecoder,
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'likedCount',
			elm$json$Json$Decode$int,
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'imageIds',
				author$project$Api$imageIdsDecoder,
				A3(
					NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'status',
					author$project$Api$productStatusDecoder,
					A3(
						NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'category',
						author$project$Api$categoryDecoder,
						A3(
							NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'condition',
							author$project$Api$conditionDecoder,
							A3(
								NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'price',
								elm$json$Json$Decode$int,
								A3(
									NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
									'description',
									elm$json$Json$Decode$string,
									A3(
										NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
										'name',
										elm$json$Json$Decode$string,
										A3(
											NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
											'id',
											elm$json$Json$Decode$string,
											elm$json$Json$Decode$succeed(
												function (id) {
													return function (name) {
														return function (description) {
															return function (price) {
																return function (condition) {
																	return function (category) {
																		return function (status) {
																			return function (imageIds) {
																				return function (likedCount) {
																					return function (seller) {
																						return function (createdAt) {
																							return author$project$Data$Product$detailFromApi(
																								{bJ: category, cD: condition, aS: createdAt, cH: description, aa: id, d1: imageIds, c1: likedCount, a: name, b4: price, dn: seller, cd: status});
																						};
																					};
																				};
																			};
																		};
																	};
																};
															};
														};
													};
												}))))))))))));
var author$project$Api$userWithNameReturn = _List_fromArray(
	[
		{b: _List_Nil, a: 'id', c: _List_Nil},
		{b: _List_Nil, a: 'displayName', c: _List_Nil},
		{b: _List_Nil, a: 'imageId', c: _List_Nil}
	]);
var author$project$Api$productDetailReturn = _List_fromArray(
	[
		{b: _List_Nil, a: 'id', c: _List_Nil},
		{b: _List_Nil, a: 'name', c: _List_Nil},
		{b: _List_Nil, a: 'description', c: _List_Nil},
		{b: _List_Nil, a: 'price', c: _List_Nil},
		{b: _List_Nil, a: 'condition', c: _List_Nil},
		{b: _List_Nil, a: 'category', c: _List_Nil},
		{b: _List_Nil, a: 'status', c: _List_Nil},
		{b: _List_Nil, a: 'imageIds', c: _List_Nil},
		{b: _List_Nil, a: 'likedCount', c: _List_Nil},
		{b: _List_Nil, a: 'seller', c: author$project$Api$userWithNameReturn},
		{b: _List_Nil, a: 'createdAt', c: _List_Nil}
	]);
var author$project$Api$sellProduct = function (_n0) {
	var request = _n0;
	return A2(
		author$project$Api$graphQlApiRequestWithToken,
		function (token) {
			return author$project$Api$Mutation(
				_List_fromArray(
					[
						{
						b: _List_fromArray(
							[
								_Utils_Tuple2(
								'accessToken',
								author$project$Api$GraphQLString(
									author$project$Api$tokenGetAccessTokenAsString(token))),
								_Utils_Tuple2(
								'name',
								author$project$Api$GraphQLString(request.a)),
								_Utils_Tuple2(
								'price',
								author$project$Api$GraphQLInt(request.b4)),
								_Utils_Tuple2(
								'description',
								author$project$Api$GraphQLString(request.cH)),
								_Utils_Tuple2(
								'images',
								author$project$Api$GraphQLList(
									A2(elm$core$List$map, author$project$Api$GraphQLString, request.d2))),
								_Utils_Tuple2(
								'condition',
								author$project$Api$GraphQLEnum(
									author$project$Data$Product$conditionToIdString(request.cD))),
								_Utils_Tuple2(
								'category',
								author$project$Api$GraphQLEnum(
									author$project$Data$Category$toIdString(request.bJ)))
							]),
						a: 'sellProduct',
						c: author$project$Api$productDetailReturn
					}
					]));
		},
		A2(elm$json$Json$Decode$field, 'sellProduct', author$project$Api$productDetailDecoder));
};
var author$project$Main$SellProductResponse = function (a) {
	return {$: 11, a: a};
};
var author$project$Main$addEventListenerForProductImages = _Platform_outgoingPort(
	'addEventListenerForProductImages',
	function ($) {
		return elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'inputId',
					elm$json$Json$Encode$string($.cY)),
					_Utils_Tuple2(
					'labelId',
					elm$json$Json$Encode$string($.c0))
				]));
	});
var elm$json$Json$Encode$int = _Json_wrap;
var author$project$Main$changeSelectedIndex = _Platform_outgoingPort(
	'changeSelectedIndex',
	function ($) {
		return elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'id',
					elm$json$Json$Encode$string($.aa)),
					_Utils_Tuple2(
					'index',
					elm$json$Json$Encode$int($.aW))
				]));
	});
var author$project$Main$replaceText = _Platform_outgoingPort(
	'replaceText',
	function ($) {
		return elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'id',
					elm$json$Json$Encode$string($.aa)),
					_Utils_Tuple2(
					'text',
					elm$json$Json$Encode$string($.cf))
				]));
	});
var author$project$Main$productEditorEmissionToCmd = function (emission) {
	switch (emission.$) {
		case 0:
			var record = emission.a;
			return author$project$Main$addEventListenerForProductImages(record);
		case 1:
			var id = emission.a.aa;
			var text = emission.a.cf;
			return author$project$Main$replaceText(
				{aa: id, cf: text});
		default:
			var id = emission.a.aa;
			var index = emission.a.aW;
			return author$project$Main$changeSelectedIndex(
				{aa: id, aW: index});
	}
};
var author$project$Main$exhibitionPageEmissionToCmd = function (emission) {
	switch (emission.$) {
		case 0:
			var e = emission.a;
			return author$project$Main$logInEmissionToCmd(e);
		case 1:
			var _n1 = emission.a;
			var token = _n1.a;
			var request = _n1.b;
			return A3(author$project$Api$sellProduct, request, token, author$project$Main$SellProductResponse);
		default:
			var e = emission.a;
			return author$project$Main$productEditorEmissionToCmd(e);
	}
};
var author$project$Api$getHistoryViewProducts = A2(
	author$project$Api$graphQlApiRequestWithToken,
	function (token) {
		return author$project$Api$Query(
			_List_fromArray(
				[
					{
					b: _List_fromArray(
						[
							_Utils_Tuple2(
							'accessToken',
							author$project$Api$GraphQLString(
								author$project$Api$tokenGetAccessTokenAsString(token)))
						]),
					a: 'userPrivate',
					c: _List_fromArray(
						[
							{b: _List_Nil, a: 'historyViewProductAll', c: author$project$Api$productReturn}
						])
				}
				]));
	},
	A2(
		elm$json$Json$Decode$field,
		'userPrivate',
		A2(
			elm$json$Json$Decode$field,
			'historyViewProductAll',
			elm$json$Json$Decode$list(author$project$Api$productDecoder))));
var author$project$Main$PageMsgHistory = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$History$GetProductsResponse = function (a) {
	return {$: 0, a: a};
};
var author$project$Main$historyEmissionToCmd = function (emission) {
	switch (emission.$) {
		case 0:
			var token = emission.a;
			return A2(
				author$project$Api$getHistoryViewProducts,
				token,
				A2(
					elm$core$Basics$composeR,
					author$project$Page$History$GetProductsResponse,
					A2(elm$core$Basics$composeR, author$project$Main$PageMsgHistory, author$project$Main$PageMsg)));
		case 1:
			var e = emission.a;
			return author$project$Main$logInEmissionToCmd(e);
		case 2:
			var e = emission.a;
			return author$project$Main$productListEmissionToCmd(e);
		default:
			var log = emission.a;
			return A2(
				elm$core$Task$perform,
				elm$core$Basics$always(
					author$project$Main$AddLogMessage(log)),
				elm$core$Task$succeed(0));
	}
};
var author$project$Api$getLikedProducts = A2(
	author$project$Api$graphQlApiRequestWithToken,
	function (token) {
		return author$project$Api$Query(
			_List_fromArray(
				[
					{
					b: _List_fromArray(
						[
							_Utils_Tuple2(
							'accessToken',
							author$project$Api$GraphQLString(
								author$project$Api$tokenGetAccessTokenAsString(token)))
						]),
					a: 'userPrivate',
					c: _List_fromArray(
						[
							{b: _List_Nil, a: 'likedProductAll', c: author$project$Api$productReturn}
						])
				}
				]));
	},
	A2(
		elm$json$Json$Decode$field,
		'userPrivate',
		A2(
			elm$json$Json$Decode$field,
			'likedProductAll',
			elm$json$Json$Decode$list(author$project$Api$productDecoder))));
var author$project$Main$PageMsgLikedProducts = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$LikedProducts$GetProductsResponse = function (a) {
	return {$: 0, a: a};
};
var author$project$Main$likedProductsEmissionToCmd = function (emission) {
	switch (emission.$) {
		case 0:
			var token = emission.a;
			return A2(
				author$project$Api$getLikedProducts,
				token,
				A2(
					elm$core$Basics$composeR,
					author$project$Page$LikedProducts$GetProductsResponse,
					A2(elm$core$Basics$composeR, author$project$Main$PageMsgLikedProducts, author$project$Main$PageMsg)));
		case 1:
			var e = emission.a;
			return author$project$Main$logInEmissionToCmd(e);
		case 2:
			var e = emission.a;
			return author$project$Main$productListEmissionToCmd(e);
		default:
			var log = emission.a;
			return A2(
				elm$core$Task$perform,
				elm$core$Basics$always(
					author$project$Main$AddLogMessage(log)),
				elm$core$Task$succeed(0));
	}
};
var author$project$PageLocation$Home = {$: 0};
var author$project$PageLocation$aboutPath = 'about';
var author$project$PageLocation$aboutPrivacyPolicyPath = 'privacy-policy';
var elm$url$Url$Builder$toQueryPair = function (_n0) {
	var key = _n0.a;
	var value = _n0.b;
	return key + ('=' + value);
};
var elm$url$Url$Builder$toQuery = function (parameters) {
	if (!parameters.b) {
		return '';
	} else {
		return '?' + A2(
			elm$core$String$join,
			'&',
			A2(elm$core$List$map, elm$url$Url$Builder$toQueryPair, parameters));
	}
};
var elm$url$Url$Builder$absolute = F2(
	function (pathSegments, parameters) {
		return '/' + (A2(elm$core$String$join, '/', pathSegments) + elm$url$Url$Builder$toQuery(parameters));
	});
var author$project$PageLocation$aboutPrivacyPolicyUrl = A2(
	elm$url$Url$Builder$absolute,
	_List_fromArray(
		[author$project$PageLocation$aboutPath, author$project$PageLocation$aboutPrivacyPolicyPath]),
	_List_Nil);
var author$project$PageLocation$aboutUrl = A2(
	elm$url$Url$Builder$absolute,
	_List_fromArray(
		[author$project$PageLocation$aboutPath]),
	_List_Nil);
var author$project$PageLocation$boughtProductsPath = _List_fromArray(
	['bought-products']);
var author$project$PageLocation$boughtProductsUrl = A2(elm$url$Url$Builder$absolute, author$project$PageLocation$boughtProductsPath, _List_Nil);
var author$project$PageLocation$commentedProductsPath = _List_fromArray(
	['commented-products']);
var author$project$PageLocation$commentedProductsUrl = A2(elm$url$Url$Builder$absolute, author$project$PageLocation$commentedProductsPath, _List_Nil);
var author$project$PageLocation$exhibitionPath = _List_fromArray(
	['exhibition']);
var author$project$PageLocation$exhibitionConfirmPath = _Utils_ap(
	author$project$PageLocation$exhibitionPath,
	_List_fromArray(
		['confirm']));
var author$project$PageLocation$exhibitionConfirmUrl = A2(elm$url$Url$Builder$absolute, author$project$PageLocation$exhibitionConfirmPath, _List_Nil);
var author$project$PageLocation$exhibitionUrl = A2(elm$url$Url$Builder$absolute, author$project$PageLocation$exhibitionPath, _List_Nil);
var author$project$PageLocation$historyPath = _List_fromArray(
	['history']);
var author$project$PageLocation$historyUrl = A2(elm$url$Url$Builder$absolute, author$project$PageLocation$historyPath, _List_Nil);
var author$project$PageLocation$homePath = _List_Nil;
var author$project$PageLocation$homeUrl = A2(elm$url$Url$Builder$absolute, author$project$PageLocation$homePath, _List_Nil);
var author$project$PageLocation$likedProductsPath = _List_fromArray(
	['liked-products']);
var author$project$PageLocation$likedProductsUrl = A2(elm$url$Url$Builder$absolute, author$project$PageLocation$likedProductsPath, _List_Nil);
var author$project$PageLocation$logInPath = _List_fromArray(
	['login']);
var author$project$PageLocation$logInUrl = A2(elm$url$Url$Builder$absolute, author$project$PageLocation$logInPath, _List_Nil);
var author$project$PageLocation$notificationPath = 'notification';
var author$project$PageLocation$notificationUrl = A2(
	elm$url$Url$Builder$absolute,
	_List_fromArray(
		[author$project$PageLocation$notificationPath]),
	_List_Nil);
var author$project$PageLocation$productUrl = function (productId) {
	return A2(
		elm$url$Url$Builder$absolute,
		_List_fromArray(
			[
				'product',
				author$project$Data$Product$idToString(productId)
			]),
		_List_Nil);
};
var author$project$PageLocation$searchPath = _List_fromArray(
	['search']);
var elm$url$Url$percentEncode = _Url_percentEncode;
var author$project$PageLocation$searchUrl = function (condition) {
	return A2(
		elm$url$Url$Builder$absolute,
		function () {
			if (!condition.$) {
				return author$project$PageLocation$searchPath;
			} else {
				var text = condition.a;
				return _Utils_ap(
					author$project$PageLocation$searchPath,
					_List_fromArray(
						[
							'#text=' + elm$url$Url$percentEncode(text)
						]));
			}
		}(),
		_List_Nil);
};
var author$project$Data$User$idToString = function (_n0) {
	var id = _n0;
	return id;
};
var author$project$PageLocation$soldProductsPath = 'sold-products';
var author$project$PageLocation$soldProductsUrl = function (userId) {
	return A2(
		elm$url$Url$Builder$absolute,
		_List_fromArray(
			[
				author$project$PageLocation$soldProductsPath,
				author$project$Data$User$idToString(userId)
			]),
		_List_Nil);
};
var author$project$Data$Trade$idToString = function (_n0) {
	var string = _n0;
	return string;
};
var author$project$PageLocation$tradeUrl = function (id) {
	return A2(
		elm$url$Url$Builder$absolute,
		_List_fromArray(
			[
				'trade',
				author$project$Data$Trade$idToString(id)
			]),
		_List_Nil);
};
var author$project$PageLocation$tradedProductsPath = _List_fromArray(
	['traded-products']);
var author$project$PageLocation$tradedProductsUrl = A2(elm$url$Url$Builder$absolute, author$project$PageLocation$tradedProductsPath, _List_Nil);
var author$project$PageLocation$tradingProductsPath = _List_fromArray(
	['treading-products']);
var author$project$PageLocation$tradingProductsUrl = A2(elm$url$Url$Builder$absolute, author$project$PageLocation$tradingProductsPath, _List_Nil);
var author$project$PageLocation$userUrl = function (userId) {
	return A2(
		elm$url$Url$Builder$absolute,
		_List_fromArray(
			[
				'user',
				author$project$Data$User$idToString(userId)
			]),
		_List_Nil);
};
var author$project$PageLocation$toUrlAsString = function (location) {
	switch (location.$) {
		case 0:
			return author$project$PageLocation$homeUrl;
		case 1:
			return author$project$PageLocation$logInUrl;
		case 2:
			return author$project$PageLocation$likedProductsUrl;
		case 3:
			return author$project$PageLocation$historyUrl;
		case 4:
			var id = location.a;
			return author$project$PageLocation$soldProductsUrl(id);
		case 5:
			return author$project$PageLocation$boughtProductsUrl;
		case 6:
			return author$project$PageLocation$tradingProductsUrl;
		case 7:
			return author$project$PageLocation$tradedProductsUrl;
		case 8:
			return author$project$PageLocation$commentedProductsUrl;
		case 9:
			return author$project$PageLocation$exhibitionUrl;
		case 10:
			return author$project$PageLocation$exhibitionConfirmUrl;
		case 11:
			var id = location.a;
			return author$project$PageLocation$productUrl(id);
		case 12:
			var id = location.a;
			return author$project$PageLocation$tradeUrl(id);
		case 13:
			var id = location.a;
			return author$project$PageLocation$userUrl(id);
		case 14:
			var condition = location.a;
			return author$project$PageLocation$searchUrl(condition);
		case 15:
			return author$project$PageLocation$notificationUrl;
		case 16:
			return author$project$PageLocation$aboutUrl;
		default:
			return author$project$PageLocation$aboutPrivacyPolicyUrl;
	}
};
var elm$browser$Browser$Navigation$pushUrl = _Browser_pushUrl;
var author$project$Main$logInPageEmissionToCmd = F2(
	function (key, emission) {
		if (!emission.$) {
			var e = emission.a;
			return author$project$Main$logInEmissionToCmd(e);
		} else {
			return A2(
				elm$browser$Browser$Navigation$pushUrl,
				key,
				author$project$PageLocation$toUrlAsString(author$project$PageLocation$Home));
		}
	});
var elm$core$Platform$Cmd$none = elm$core$Platform$Cmd$batch(_List_Nil);
var author$project$Main$notificationEmissionToCmd = function (emission) {
	return elm$core$Platform$Cmd$none;
};
var author$project$Data$Product$Comment = elm$core$Basics$identity;
var author$project$Data$Product$commentFromApi = elm$core$Basics$identity;
var author$project$Api$productCommentDecoder = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'createdAt',
	author$project$Api$dateTimeDecoder,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'speaker',
		author$project$Api$userWithNameDecoder,
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'body',
			elm$json$Json$Decode$string,
			elm$json$Json$Decode$succeed(
				F3(
					function (body, speaker, createdAt) {
						return author$project$Data$Product$commentFromApi(
							{bg: body, aS: createdAt, ds: speaker});
					})))));
var author$project$Api$productCommentReturn = _List_fromArray(
	[
		{b: _List_Nil, a: 'body', c: _List_Nil},
		{b: _List_Nil, a: 'speaker', c: author$project$Api$userWithNameReturn},
		{b: _List_Nil, a: 'createdAt', c: _List_Nil}
	]);
var author$project$Api$addProductComment = F2(
	function (productId, commentBody) {
		return A2(
			author$project$Api$graphQlApiRequestWithToken,
			function (t) {
				return author$project$Api$Mutation(
					_List_fromArray(
						[
							{
							b: _List_fromArray(
								[
									_Utils_Tuple2(
									'accessToken',
									author$project$Api$GraphQLString(
										author$project$Api$tokenGetAccessTokenAsString(t))),
									_Utils_Tuple2(
									'productId',
									author$project$Api$GraphQLString(
										author$project$Data$Product$idToString(productId))),
									_Utils_Tuple2(
									'body',
									author$project$Api$GraphQLString(commentBody))
								]),
							a: 'addProductComment',
							c: _List_fromArray(
								[
									{b: _List_Nil, a: 'comments', c: author$project$Api$productCommentReturn}
								])
						}
						]));
			},
			A2(
				elm$json$Json$Decode$field,
				'addProductComment',
				A2(
					elm$json$Json$Decode$field,
					'comments',
					elm$json$Json$Decode$list(author$project$Api$productCommentDecoder))));
	});
var author$project$Api$deleteProduct = F2(
	function (token, productId) {
		return elm$core$Platform$Cmd$none;
	});
var author$project$Api$getProduct = F2(
	function (id, callBack) {
		return A3(
			author$project$Api$graphQlApiRequestWithoutToken,
			author$project$Api$Query(
				_List_fromArray(
					[
						{
						b: _List_fromArray(
							[
								_Utils_Tuple2(
								'productId',
								author$project$Api$GraphQLString(
									author$project$Data$Product$idToString(id)))
							]),
						a: 'product',
						c: author$project$Api$productDetailReturn
					}
					])),
			A2(elm$json$Json$Decode$field, 'product', author$project$Api$productDetailDecoder),
			callBack);
	});
var author$project$Api$getProductComments = F2(
	function (productId, callBack) {
		return A3(
			author$project$Api$graphQlApiRequestWithoutToken,
			author$project$Api$Query(
				_List_fromArray(
					[
						{
						b: _List_fromArray(
							[
								_Utils_Tuple2(
								'productId',
								author$project$Api$GraphQLString(
									author$project$Data$Product$idToString(productId)))
							]),
						a: 'product',
						c: _List_fromArray(
							[
								{b: _List_Nil, a: 'comments', c: author$project$Api$productCommentReturn}
							])
					}
					])),
			A2(
				elm$json$Json$Decode$field,
				'product',
				A2(
					elm$json$Json$Decode$field,
					'comments',
					elm$json$Json$Decode$list(author$project$Api$productCommentDecoder))),
			callBack);
	});
var author$project$Api$markProductInHistory = function (productId) {
	return A2(
		author$project$Api$graphQlApiRequestWithToken,
		function (token) {
			return author$project$Api$Mutation(
				_List_fromArray(
					[
						{
						b: _List_fromArray(
							[
								_Utils_Tuple2(
								'accessToken',
								author$project$Api$GraphQLString(
									author$project$Api$tokenGetAccessTokenAsString(token))),
								_Utils_Tuple2(
								'productId',
								author$project$Api$GraphQLString(
									author$project$Data$Product$idToString(productId)))
							]),
						a: 'markProductInHistory',
						c: author$project$Api$productDetailReturn
					}
					]));
		},
		A2(elm$json$Json$Decode$field, 'markProductInHistory', author$project$Api$productDetailDecoder));
};
var elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3(elm$core$List$foldr, elm$json$Json$Decode$field, decoder, fields);
	});
var NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt = F3(
	function (path, valDecoder, decoder) {
		return A2(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2(elm$json$Json$Decode$at, path, valDecoder),
			decoder);
	});
var author$project$Data$Trade$Id = elm$core$Basics$identity;
var author$project$Data$Trade$Trade = elm$core$Basics$identity;
var author$project$Data$Trade$fromApi = function (rec) {
	return {cx: rec.cx, aS: rec.aS, aa: rec.aa, de: rec.de, dn: rec.dn, dD: rec.dD};
};
var author$project$Api$tradeDecoder = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'updateAt',
	author$project$Api$dateTimeDecoder,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'createdAt',
		author$project$Api$dateTimeDecoder,
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'buyer',
			author$project$Api$userWithNameDecoder,
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
				_List_fromArray(
					['product', 'seller']),
				author$project$Api$userWithNameDecoder,
				A3(
					NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'product',
					author$project$Api$productDecoder,
					A3(
						NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'id',
						elm$json$Json$Decode$string,
						elm$json$Json$Decode$succeed(
							F6(
								function (id, product, seller, buyer, createdAt, updateAt) {
									return author$project$Data$Trade$fromApi(
										{cx: buyer, aS: createdAt, aa: id, de: product, dn: seller, dD: updateAt});
								}))))))));
var author$project$Api$tradeReturn = _List_fromArray(
	[
		{b: _List_Nil, a: 'id', c: _List_Nil},
		{
		b: _List_Nil,
		a: 'product',
		c: _Utils_ap(
			author$project$Api$productReturn,
			_List_fromArray(
				[
					{b: _List_Nil, a: 'seller', c: author$project$Api$userWithNameReturn}
				]))
	},
		{b: _List_Nil, a: 'buyer', c: author$project$Api$userWithNameReturn},
		{b: _List_Nil, a: 'createdAt', c: _List_Nil},
		{b: _List_Nil, a: 'updateAt', c: _List_Nil}
	]);
var author$project$Api$startTrade = function (productId) {
	return A2(
		author$project$Api$graphQlApiRequestWithToken,
		function (token) {
			return author$project$Api$Mutation(
				_List_fromArray(
					[
						{
						b: _List_fromArray(
							[
								_Utils_Tuple2(
								'accessToken',
								author$project$Api$GraphQLString(
									author$project$Api$tokenGetAccessTokenAsString(token))),
								_Utils_Tuple2(
								'productId',
								author$project$Api$GraphQLString(
									author$project$Data$Product$idToString(productId)))
							]),
						a: 'startTrade',
						c: author$project$Api$tradeReturn
					}
					]));
		},
		A2(elm$json$Json$Decode$field, 'startTrade', author$project$Api$tradeDecoder));
};
var author$project$Api$updateProduct = F4(
	function (accessToken, productId, editProductRequest, callBack) {
		return elm$core$Platform$Cmd$none;
	});
var author$project$Data$Trade$getId = function (_n0) {
	var id = _n0.aa;
	return id;
};
var author$project$Main$PageMsgProduct = function (a) {
	return {$: 13, a: a};
};
var author$project$Page$Product$GetCommentListResponse = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$Product$GetProductResponse = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$Product$TradeStartResponse = function (a) {
	return {$: 7, a: a};
};
var author$project$Page$Product$UpdateProductDataResponse = function (a) {
	return {$: 16, a: a};
};
var author$project$PageLocation$Trade = function (a) {
	return {$: 12, a: a};
};
var elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var elm$time$Time$customZone = elm$time$Time$Zone;
var elm$time$Time$here = _Time_here(0);
var elm$time$Time$now = _Time_now(elm$time$Time$millisToPosix);
var author$project$Main$productPageEmissionToCmd = F2(
	function (key, emission) {
		switch (emission.$) {
			case 0:
				var productId = emission.a.bw;
				return A2(
					author$project$Api$getProduct,
					productId,
					A2(
						elm$core$Basics$composeR,
						author$project$Page$Product$GetProductResponse,
						A2(elm$core$Basics$composeR, author$project$Main$PageMsgProduct, author$project$Main$PageMsg)));
			case 1:
				var productId = emission.a.bw;
				var token = emission.a.dz;
				return A3(
					author$project$Api$markProductInHistory,
					productId,
					token,
					A2(
						elm$core$Basics$composeR,
						author$project$Page$Product$GetProductResponse,
						A2(elm$core$Basics$composeR, author$project$Main$PageMsgProduct, author$project$Main$PageMsg)));
			case 2:
				var productId = emission.a.bw;
				return A2(
					author$project$Api$getProductComments,
					productId,
					A2(
						elm$core$Basics$composeR,
						author$project$Page$Product$GetCommentListResponse,
						A2(elm$core$Basics$composeR, author$project$Main$PageMsgProduct, author$project$Main$PageMsg)));
			case 3:
				var token = emission.a;
				var productId = emission.b.bw;
				var comment = emission.c;
				return A4(
					author$project$Api$addProductComment,
					productId,
					comment,
					token,
					A2(
						elm$core$Basics$composeR,
						author$project$Page$Product$GetCommentListResponse,
						A2(elm$core$Basics$composeR, author$project$Main$PageMsgProduct, author$project$Main$PageMsg)));
			case 4:
				var token = emission.a;
				var id = emission.b;
				return A3(
					author$project$Api$likeProduct,
					id,
					token,
					author$project$Main$LikeProductResponse(id));
			case 5:
				var token = emission.a;
				var id = emission.b;
				return A3(
					author$project$Api$unlikeProduct,
					id,
					token,
					author$project$Main$UnlikeProductResponse(id));
			case 6:
				var token = emission.a;
				var id = emission.b;
				return A3(
					author$project$Api$startTrade,
					id,
					token,
					A2(
						elm$core$Basics$composeR,
						author$project$Page$Product$TradeStartResponse,
						A2(elm$core$Basics$composeR, author$project$Main$PageMsgProduct, author$project$Main$PageMsg)));
			case 7:
				var log = emission.a;
				return A2(
					elm$core$Task$perform,
					elm$core$Basics$always(
						author$project$Main$AddLogMessage(log)),
					elm$core$Task$succeed(0));
			case 8:
				return A2(
					elm$core$Task$attempt,
					author$project$Main$GetNowTime,
					A3(elm$core$Task$map2, elm$core$Tuple$pair, elm$time$Time$now, elm$time$Time$here));
			case 9:
				var token = emission.a;
				var productId = emission.b;
				return A2(author$project$Api$deleteProduct, token, productId);
			case 10:
				var trade = emission.a;
				return A2(
					elm$browser$Browser$Navigation$pushUrl,
					key,
					author$project$PageLocation$toUrlAsString(
						author$project$PageLocation$Trade(
							author$project$Data$Trade$getId(trade))));
			case 11:
				var e = emission.a;
				return author$project$Main$productEditorEmissionToCmd(e);
			case 12:
				var token = emission.a;
				var productId = emission.b;
				var requestData = emission.c;
				return A4(
					author$project$Api$updateProduct,
					token,
					productId,
					requestData,
					A2(
						elm$core$Basics$composeR,
						author$project$Page$Product$UpdateProductDataResponse,
						A2(elm$core$Basics$composeR, author$project$Main$PageMsgProduct, author$project$Main$PageMsg)));
			default:
				var idAndText = emission.a;
				return author$project$Main$replaceText(idAndText);
		}
	});
var author$project$Main$searchPageEmissionToCmd = function (emission) {
	var idAndText = emission;
	return author$project$Main$replaceText(idAndText);
};
var author$project$Api$GraphQLNull = {$: 6};
var author$project$Api$sendConfirmEmailRequestBody = A2(
	elm$json$Json$Decode$andThen,
	function (result) {
		return (result === 'ok') ? elm$json$Json$Decode$succeed(0) : elm$json$Json$Decode$fail('okでなかった');
	},
	A2(elm$json$Json$Decode$field, 'sendConformEmail', elm$json$Json$Decode$string));
var author$project$Api$GraphQLObject = function (a) {
	return {$: 4, a: a};
};
var author$project$Data$University$departmentToIdString = function (department) {
	switch (department) {
		case 0:
			return 'humanity';
		case 1:
			return 'culture';
		case 2:
			return 'japanese';
		case 3:
			return 'social';
		case 4:
			return 'cis';
		case 5:
			return 'education';
		case 6:
			return 'psyche';
		case 7:
			return 'disability';
		case 8:
			return 'biol';
		case 9:
			return 'bres';
		case 10:
			return 'earth';
		case 11:
			return 'math';
		case 12:
			return 'phys';
		case 13:
			return 'chem';
		case 14:
			return 'coens';
		case 15:
			return 'esys';
		case 16:
			return 'pandps';
		case 17:
			return 'coins';
		case 18:
			return 'mast';
		case 19:
			return 'klis';
		case 20:
			return 'med';
		case 21:
			return 'nurse';
		case 22:
			return 'ms';
		case 23:
			return 'aandd';
		default:
			return 'sport';
	}
};
var author$project$Data$University$graduateToIdString = function (graduate) {
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
var author$project$Api$universityToGraphQLValue = function (university) {
	return author$project$Api$GraphQLObject(
		function () {
			switch (university.$) {
				case 0:
					var graduate = university.a;
					var schoolAndDepartment = university.b;
					return _List_fromArray(
						[
							_Utils_Tuple2(
							'graduate',
							author$project$Api$GraphQLEnum(
								author$project$Data$University$graduateToIdString(graduate))),
							_Utils_Tuple2(
							'schoolAndDepartment',
							author$project$Api$GraphQLEnum(
								author$project$Data$University$departmentToIdString(schoolAndDepartment)))
						]);
				case 1:
					var graduate = university.a;
					return _List_fromArray(
						[
							_Utils_Tuple2(
							'graduate',
							author$project$Api$GraphQLEnum(
								author$project$Data$University$graduateToIdString(graduate)))
						]);
				default:
					var schoolAndDepartment = university.a;
					return _List_fromArray(
						[
							_Utils_Tuple2(
							'schoolAndDepartment',
							author$project$Api$GraphQLEnum(
								author$project$Data$University$departmentToIdString(schoolAndDepartment)))
						]);
			}
		}());
};
var elm$core$String$toLower = _String_toLower;
var author$project$Data$EmailAddress$toString = function (_n0) {
	var string = _n0;
	return elm$core$String$toLower(string);
};
var author$project$Api$sendConfirmEmail = F2(
	function (_n0, callBack) {
		var sendEmailToken = _n0.$7;
		var displayName = _n0.Y;
		var image = _n0.bn;
		var university = _n0.bb;
		var emailAddress = _n0.cJ;
		return A3(
			author$project$Api$graphQlApiRequestWithoutToken,
			author$project$Api$Mutation(
				_List_fromArray(
					[
						{
						b: _List_fromArray(
							[
								_Utils_Tuple2(
								'sendEmailToken',
								author$project$Api$GraphQLString(sendEmailToken)),
								_Utils_Tuple2(
								'displayName',
								author$project$Api$GraphQLString(displayName)),
								_Utils_Tuple2(
								'image',
								function () {
									if (!image.$) {
										var dataUrl = image.a;
										return author$project$Api$GraphQLString(dataUrl);
									} else {
										return author$project$Api$GraphQLNull;
									}
								}()),
								_Utils_Tuple2(
								'university',
								author$project$Api$universityToGraphQLValue(university)),
								_Utils_Tuple2(
								'email',
								author$project$Api$GraphQLString(
									author$project$Data$EmailAddress$toString(emailAddress)))
							]),
						a: 'sendConformEmail',
						c: _List_Nil
					}
					])),
			author$project$Api$sendConfirmEmailRequestBody,
			callBack);
	});
var author$project$Main$SignUpConfirmResponse = function (a) {
	return {$: 7, a: a};
};
var author$project$Main$addEventListenerForUserImage = _Platform_outgoingPort(
	'addEventListenerForUserImage',
	function ($) {
		return elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'inputId',
					elm$json$Json$Encode$string($.cY)),
					_Utils_Tuple2(
					'labelId',
					elm$json$Json$Encode$string($.c0))
				]));
	});
var author$project$Main$universityEmissionToCmd = function (emission) {
	var id = emission.aa;
	var index = emission.aW;
	return author$project$Main$changeSelectedIndex(
		{aa: id, aW: index});
};
var author$project$Main$signUpPageEmissionToCmd = function (emission) {
	switch (emission.$) {
		case 0:
			var idRecord = emission.a;
			return author$project$Main$addEventListenerForUserImage(idRecord);
		case 3:
			var idAndText = emission.a;
			return author$project$Main$replaceText(idAndText);
		case 1:
			var signUpRequest = emission.a;
			return A2(author$project$Api$sendConfirmEmail, signUpRequest, author$project$Main$SignUpConfirmResponse);
		case 2:
			var e = emission.a;
			return author$project$Main$universityEmissionToCmd(e);
		default:
			var log = emission.a;
			return A2(
				elm$core$Task$perform,
				elm$core$Basics$always(
					author$project$Main$AddLogMessage(log)),
				elm$core$Task$succeed(0));
	}
};
var author$project$Api$getSoldProductList = F2(
	function (userId, callBack) {
		return A3(
			author$project$Api$graphQlApiRequestWithoutToken,
			author$project$Api$Query(
				_List_fromArray(
					[
						{
						b: _List_fromArray(
							[
								_Utils_Tuple2(
								'userId',
								author$project$Api$GraphQLString(
									author$project$Data$User$idToString(userId)))
							]),
						a: 'user',
						c: _List_fromArray(
							[
								{b: _List_Nil, a: 'soldProductAll', c: author$project$Api$productReturn}
							])
					}
					])),
			A2(
				elm$json$Json$Decode$field,
				'user',
				A2(
					elm$json$Json$Decode$field,
					'soldProductAll',
					elm$json$Json$Decode$list(author$project$Api$productDecoder))),
			callBack);
	});
var author$project$Main$PageMsgSoldProducts = function (a) {
	return {$: 3, a: a};
};
var author$project$Page$SoldProducts$GetSoldProductListResponse = function (a) {
	return {$: 0, a: a};
};
var author$project$Main$soldProductsPageEmissionToCmd = function (emission) {
	switch (emission.$) {
		case 0:
			var userId = emission.a;
			return A2(
				author$project$Api$getSoldProductList,
				userId,
				A2(
					elm$core$Basics$composeR,
					author$project$Page$SoldProducts$GetSoldProductListResponse,
					A2(elm$core$Basics$composeR, author$project$Main$PageMsgSoldProducts, author$project$Main$PageMsg)));
		case 1:
			var e = emission.a;
			return author$project$Main$productListEmissionToCmd(e);
		default:
			var log = emission.a;
			return A2(
				elm$core$Task$perform,
				elm$core$Basics$always(
					author$project$Main$AddLogMessage(log)),
				elm$core$Task$succeed(0));
	}
};
var author$project$Data$Trade$Buyer = 1;
var author$project$Data$Trade$Seller = 0;
var author$project$Api$tradeSpeakerDecoder = A2(
	elm$json$Json$Decode$andThen,
	function (id) {
		switch (id) {
			case 'seller':
				return elm$json$Json$Decode$succeed(0);
			case 'buyer':
				return elm$json$Json$Decode$succeed(1);
			default:
				return elm$json$Json$Decode$fail('sellerかbuyer以外のspeakerを受け取ってしまった');
		}
	},
	elm$json$Json$Decode$string);
var author$project$Data$Trade$Comment = elm$core$Basics$identity;
var author$project$Api$tradeCommentDecoder = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'createdAt',
	author$project$Api$dateTimeDecoder,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'speaker',
		author$project$Api$tradeSpeakerDecoder,
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'body',
			elm$json$Json$Decode$string,
			elm$json$Json$Decode$succeed(
				F3(
					function (body, speaker, createdAt) {
						return {bg: body, aS: createdAt, ds: speaker};
					})))));
var author$project$Data$Trade$CancelByBuyer = 4;
var author$project$Data$Trade$CancelBySeller = 3;
var author$project$Data$Trade$Finish = 5;
var author$project$Data$Trade$InProgress = 0;
var author$project$Data$Trade$WaitBuyerFinish = 2;
var author$project$Data$Trade$WaitSellerFinish = 1;
var author$project$Data$Trade$statusFromIdString = function (string) {
	switch (string) {
		case 'inProgress':
			return elm$core$Maybe$Just(0);
		case 'waitSellerFinish':
			return elm$core$Maybe$Just(1);
		case 'waitBuyerFinish':
			return elm$core$Maybe$Just(2);
		case 'cancelBySeller':
			return elm$core$Maybe$Just(3);
		case 'cancelByBuyer':
			return elm$core$Maybe$Just(4);
		case 'finish':
			return elm$core$Maybe$Just(5);
		default:
			return elm$core$Maybe$Nothing;
	}
};
var author$project$Api$tradeStatusDecoder = A2(
	elm$json$Json$Decode$andThen,
	function (id) {
		var _n0 = author$project$Data$Trade$statusFromIdString(id);
		if (!_n0.$) {
			var status = _n0.a;
			return elm$json$Json$Decode$succeed(status);
		} else {
			return elm$json$Json$Decode$fail('取引の状態(' + (id + ')を理解できなかった'));
		}
	},
	elm$json$Json$Decode$string);
var author$project$Data$Trade$TradeDetail = elm$core$Basics$identity;
var author$project$Data$Trade$detailFromApi = function (rec) {
	return {cx: rec.cx, dR: rec.dR, aS: rec.aS, aa: rec.aa, de: rec.de, cd: rec.cd, dD: rec.dD};
};
var author$project$Api$tradeDetailDecoder = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'status',
	author$project$Api$tradeStatusDecoder,
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'comment',
		elm$json$Json$Decode$list(author$project$Api$tradeCommentDecoder),
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'updateAt',
			author$project$Api$dateTimeDecoder,
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'createdAt',
				author$project$Api$dateTimeDecoder,
				A3(
					NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'buyer',
					author$project$Api$userWithNameDecoder,
					A3(
						NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'product',
						author$project$Api$productDetailDecoder,
						A3(
							NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'id',
							elm$json$Json$Decode$string,
							elm$json$Json$Decode$succeed(
								F7(
									function (id, product, buyer, createdAt, updateAt, comments, status) {
										return author$project$Data$Trade$detailFromApi(
											{cx: buyer, dR: comments, aS: createdAt, aa: id, de: product, cd: status, dD: updateAt});
									})))))))));
var author$project$Api$tradeCommentReturn = _List_fromArray(
	[
		{b: _List_Nil, a: 'body', c: _List_Nil},
		{b: _List_Nil, a: 'speaker', c: _List_Nil},
		{b: _List_Nil, a: 'createdAt', c: _List_Nil}
	]);
var author$project$Api$tradeDetailReturn = _List_fromArray(
	[
		{b: _List_Nil, a: 'id', c: _List_Nil},
		{b: _List_Nil, a: 'product', c: author$project$Api$productDetailReturn},
		{b: _List_Nil, a: 'buyer', c: author$project$Api$userWithNameReturn},
		{b: _List_Nil, a: 'createdAt', c: _List_Nil},
		{b: _List_Nil, a: 'updateAt', c: _List_Nil},
		{b: _List_Nil, a: 'status', c: _List_Nil},
		{b: _List_Nil, a: 'comment', c: author$project$Api$tradeCommentReturn}
	]);
var author$project$Api$addTradeComment = F2(
	function (tradeId, body) {
		return A2(
			author$project$Api$graphQlApiRequestWithToken,
			function (token) {
				return author$project$Api$Mutation(
					_List_fromArray(
						[
							{
							b: _List_fromArray(
								[
									_Utils_Tuple2(
									'accessToken',
									author$project$Api$GraphQLString(
										author$project$Api$tokenGetAccessTokenAsString(token))),
									_Utils_Tuple2(
									'tradeId',
									author$project$Api$GraphQLString(
										author$project$Data$Trade$idToString(tradeId))),
									_Utils_Tuple2(
									'body',
									author$project$Api$GraphQLString(body))
								]),
							a: 'addTradeComment',
							c: author$project$Api$tradeDetailReturn
						}
						]));
			},
			A2(elm$json$Json$Decode$field, 'addTradeComment', author$project$Api$tradeDetailDecoder));
	});
var author$project$Api$cancelTrade = function (tradeId) {
	return A2(
		author$project$Api$graphQlApiRequestWithToken,
		function (token) {
			return author$project$Api$Mutation(
				_List_fromArray(
					[
						{
						b: _List_fromArray(
							[
								_Utils_Tuple2(
								'accessToken',
								author$project$Api$GraphQLString(
									author$project$Api$tokenGetAccessTokenAsString(token))),
								_Utils_Tuple2(
								'tradeId',
								author$project$Api$GraphQLString(
									author$project$Data$Trade$idToString(tradeId)))
							]),
						a: 'cancelTrade',
						c: author$project$Api$tradeDetailReturn
					}
					]));
		},
		A2(elm$json$Json$Decode$field, 'cancelTrade', author$project$Api$tradeDetailDecoder));
};
var author$project$Api$finishTrade = function (tradeId) {
	return A2(
		author$project$Api$graphQlApiRequestWithToken,
		function (token) {
			return author$project$Api$Mutation(
				_List_fromArray(
					[
						{
						b: _List_fromArray(
							[
								_Utils_Tuple2(
								'accessToken',
								author$project$Api$GraphQLString(
									author$project$Api$tokenGetAccessTokenAsString(token))),
								_Utils_Tuple2(
								'tradeId',
								author$project$Api$GraphQLString(
									author$project$Data$Trade$idToString(tradeId)))
							]),
						a: 'finishTrade',
						c: author$project$Api$tradeDetailReturn
					}
					]));
		},
		A2(elm$json$Json$Decode$field, 'finishTrade', author$project$Api$tradeDetailDecoder));
};
var author$project$Api$getTradeDetail = function (id) {
	return A2(
		author$project$Api$graphQlApiRequestWithToken,
		function (token) {
			return author$project$Api$Query(
				_List_fromArray(
					[
						{
						b: _List_fromArray(
							[
								_Utils_Tuple2(
								'accessToken',
								author$project$Api$GraphQLString(
									author$project$Api$tokenGetAccessTokenAsString(token))),
								_Utils_Tuple2(
								'tradeId',
								author$project$Api$GraphQLString(
									author$project$Data$Trade$idToString(id)))
							]),
						a: 'trade',
						c: author$project$Api$tradeDetailReturn
					}
					]));
		},
		A2(elm$json$Json$Decode$field, 'trade', author$project$Api$tradeDetailDecoder));
};
var author$project$Main$PageMsgTrade = function (a) {
	return {$: 15, a: a};
};
var author$project$Page$Trade$AddCommentResponse = function (a) {
	return {$: 6, a: a};
};
var author$project$Page$Trade$CancelTradeResponse = function (a) {
	return {$: 5, a: a};
};
var author$project$Page$Trade$FinishTradeResponse = function (a) {
	return {$: 4, a: a};
};
var author$project$Page$Trade$TradeDetailResponse = function (a) {
	return {$: 7, a: a};
};
var author$project$Main$tradePageEmissionToCmd = function (emission) {
	switch (emission.$) {
		case 0:
			return A2(
				elm$core$Task$attempt,
				author$project$Main$GetNowTime,
				A3(elm$core$Task$map2, elm$core$Tuple$pair, elm$time$Time$now, elm$time$Time$here));
		case 1:
			var token = emission.a;
			var id = emission.b;
			return A3(
				author$project$Api$getTradeDetail,
				id,
				token,
				A2(
					elm$core$Basics$composeR,
					author$project$Page$Trade$TradeDetailResponse,
					A2(elm$core$Basics$composeR, author$project$Main$PageMsgTrade, author$project$Main$PageMsg)));
		case 2:
			var token = emission.a;
			var id = emission.b;
			var string = emission.c;
			return A4(
				author$project$Api$addTradeComment,
				id,
				string,
				token,
				A2(
					elm$core$Basics$composeR,
					author$project$Page$Trade$AddCommentResponse,
					A2(elm$core$Basics$composeR, author$project$Main$PageMsgTrade, author$project$Main$PageMsg)));
		case 5:
			var log = emission.a;
			return A2(
				elm$core$Task$perform,
				elm$core$Basics$always(
					author$project$Main$AddLogMessage(log)),
				elm$core$Task$succeed(0));
		case 6:
			var idAndText = emission.a;
			return author$project$Main$replaceText(idAndText);
		case 3:
			var token = emission.a;
			var id = emission.b;
			return A3(
				author$project$Api$finishTrade,
				id,
				token,
				A2(
					elm$core$Basics$composeR,
					author$project$Page$Trade$FinishTradeResponse,
					A2(elm$core$Basics$composeR, author$project$Main$PageMsgTrade, author$project$Main$PageMsg)));
		default:
			var token = emission.a;
			var id = emission.b;
			return A3(
				author$project$Api$cancelTrade,
				id,
				token,
				A2(
					elm$core$Basics$composeR,
					author$project$Page$Trade$CancelTradeResponse,
					A2(elm$core$Basics$composeR, author$project$Main$PageMsgTrade, author$project$Main$PageMsg)));
	}
};
var author$project$Api$getTradedProductList = A2(
	author$project$Api$graphQlApiRequestWithToken,
	function (token) {
		return author$project$Api$Query(
			_List_fromArray(
				[
					{
					b: _List_fromArray(
						[
							_Utils_Tuple2(
							'accessToken',
							author$project$Api$GraphQLString(
								author$project$Api$tokenGetAccessTokenAsString(token)))
						]),
					a: 'userPrivate',
					c: _List_fromArray(
						[
							{b: _List_Nil, a: 'tradedAll', c: author$project$Api$tradeReturn}
						])
				}
				]));
	},
	A2(
		elm$json$Json$Decode$field,
		'userPrivate',
		A2(
			elm$json$Json$Decode$field,
			'tradedAll',
			elm$json$Json$Decode$list(author$project$Api$tradeDecoder))));
var author$project$Main$PageMsgTradesInPast = function (a) {
	return {$: 6, a: a};
};
var author$project$Page$TradesInPast$GetTradesResponse = function (a) {
	return {$: 0, a: a};
};
var author$project$Main$tradedProductsEmissionToCmd = function (emission) {
	switch (emission.$) {
		case 0:
			var token = emission.a;
			return A2(
				author$project$Api$getTradedProductList,
				token,
				A2(
					elm$core$Basics$composeR,
					author$project$Page$TradesInPast$GetTradesResponse,
					A2(elm$core$Basics$composeR, author$project$Main$PageMsgTradesInPast, author$project$Main$PageMsg)));
		case 1:
			var e = emission.a;
			return author$project$Main$logInEmissionToCmd(e);
		default:
			var log = emission.a;
			return A2(
				elm$core$Task$perform,
				elm$core$Basics$always(
					author$project$Main$AddLogMessage(log)),
				elm$core$Task$succeed(0));
	}
};
var author$project$Api$getTradingProductList = A2(
	author$project$Api$graphQlApiRequestWithToken,
	function (token) {
		return author$project$Api$Query(
			_List_fromArray(
				[
					{
					b: _List_fromArray(
						[
							_Utils_Tuple2(
							'accessToken',
							author$project$Api$GraphQLString(
								author$project$Api$tokenGetAccessTokenAsString(token)))
						]),
					a: 'userPrivate',
					c: _List_fromArray(
						[
							{b: _List_Nil, a: 'tradingAll', c: author$project$Api$tradeReturn}
						])
				}
				]));
	},
	A2(
		elm$json$Json$Decode$field,
		'userPrivate',
		A2(
			elm$json$Json$Decode$field,
			'tradingAll',
			elm$json$Json$Decode$list(author$project$Api$tradeDecoder))));
var author$project$Main$PageMsgTradesInProgress = function (a) {
	return {$: 5, a: a};
};
var author$project$Page$TradesInProgress$GetProductsResponse = function (a) {
	return {$: 0, a: a};
};
var author$project$Main$tradingProductsEmissionToCmd = function (emission) {
	switch (emission.$) {
		case 0:
			var token = emission.a;
			return A2(
				author$project$Api$getTradingProductList,
				token,
				A2(
					elm$core$Basics$composeR,
					author$project$Page$TradesInProgress$GetProductsResponse,
					A2(elm$core$Basics$composeR, author$project$Main$PageMsgTradesInProgress, author$project$Main$PageMsg)));
		case 1:
			var e = emission.a;
			return author$project$Main$logInEmissionToCmd(e);
		default:
			var log = emission.a;
			return A2(
				elm$core$Task$perform,
				elm$core$Basics$always(
					author$project$Main$AddLogMessage(log)),
				elm$core$Task$succeed(0));
	}
};
var author$project$Data$University$GraduateNoTsukuba = function (a) {
	return {$: 1, a: a};
};
var author$project$Data$University$GraduateTsukuba = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var author$project$Data$University$NotGraduate = function (a) {
	return {$: 2, a: a};
};
var author$project$Data$University$DAandd = 23;
var author$project$Data$University$DBiol = 8;
var author$project$Data$University$DBres = 9;
var author$project$Data$University$DChem = 13;
var author$project$Data$University$DCis = 4;
var author$project$Data$University$DCoens = 14;
var author$project$Data$University$DCoins = 17;
var author$project$Data$University$DCulture = 1;
var author$project$Data$University$DDisability = 7;
var author$project$Data$University$DEarth = 10;
var author$project$Data$University$DEducation = 5;
var author$project$Data$University$DEsys = 15;
var author$project$Data$University$DHumanity = 0;
var author$project$Data$University$DJapanese = 2;
var author$project$Data$University$DKlis = 19;
var author$project$Data$University$DMast = 18;
var author$project$Data$University$DMath = 11;
var author$project$Data$University$DMed = 20;
var author$project$Data$University$DMs = 22;
var author$project$Data$University$DNurse = 21;
var author$project$Data$University$DPandps = 16;
var author$project$Data$University$DPhys = 12;
var author$project$Data$University$DPsyche = 6;
var author$project$Data$University$DSocial = 3;
var author$project$Data$University$DSport = 24;
var author$project$Data$University$departmentAll = _List_fromArray(
	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]);
var author$project$Data$University$departmentFromIdStringLoop = F2(
	function (idString, departmentList) {
		departmentFromIdStringLoop:
		while (true) {
			if (departmentList.b) {
				var x = departmentList.a;
				var xs = departmentList.b;
				if (_Utils_eq(
					author$project$Data$University$departmentToIdString(x),
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
var author$project$Data$University$departmentFromIdString = function (idString) {
	return A2(author$project$Data$University$departmentFromIdStringLoop, idString, author$project$Data$University$departmentAll);
};
var author$project$Data$University$GChs = 6;
var author$project$Data$University$GEducation = 0;
var author$project$Data$University$GGabs = 2;
var author$project$Data$University$GGlobal = 8;
var author$project$Data$University$GHass = 1;
var author$project$Data$University$GLife = 5;
var author$project$Data$University$GPas = 3;
var author$project$Data$University$GSie = 4;
var author$project$Data$University$GSlis = 7;
var author$project$Data$University$graduateAllValue = _List_fromArray(
	[0, 1, 2, 3, 4, 5, 6, 7, 8]);
var author$project$Data$University$graduateFromIdStringLoop = F2(
	function (idString, graduateList) {
		graduateFromIdStringLoop:
		while (true) {
			if (graduateList.b) {
				var x = graduateList.a;
				var xs = graduateList.b;
				if (_Utils_eq(
					author$project$Data$University$graduateToIdString(x),
					idString)) {
					return elm$core$Maybe$Just(x);
				} else {
					var $temp$idString = idString,
						$temp$graduateList = xs;
					idString = $temp$idString;
					graduateList = $temp$graduateList;
					continue graduateFromIdStringLoop;
				}
			} else {
				return elm$core$Maybe$Nothing;
			}
		}
	});
var author$project$Data$University$graduateFromIdString = function (idString) {
	return A2(author$project$Data$University$graduateFromIdStringLoop, idString, author$project$Data$University$graduateAllValue);
};
var elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var author$project$Data$University$universityFromIdString = function (_n0) {
	var graduateMaybe = _n0.d_;
	var departmentMaybe = _n0.dW;
	var _n1 = _Utils_Tuple2(
		A2(elm$core$Maybe$andThen, author$project$Data$University$departmentFromIdString, departmentMaybe),
		A2(elm$core$Maybe$andThen, author$project$Data$University$graduateFromIdString, graduateMaybe));
	if (!_n1.a.$) {
		if (!_n1.b.$) {
			var department = _n1.a.a;
			var graduate = _n1.b.a;
			return elm$core$Maybe$Just(
				A2(author$project$Data$University$GraduateTsukuba, graduate, department));
		} else {
			var department = _n1.a.a;
			var _n3 = _n1.b;
			return elm$core$Maybe$Just(
				author$project$Data$University$NotGraduate(department));
		}
	} else {
		if (!_n1.b.$) {
			var _n2 = _n1.a;
			var graduate = _n1.b.a;
			return elm$core$Maybe$Just(
				author$project$Data$University$GraduateNoTsukuba(graduate));
		} else {
			var _n4 = _n1.a;
			var _n5 = _n1.b;
			return elm$core$Maybe$Nothing;
		}
	}
};
var author$project$Data$User$WithProfile = elm$core$Basics$identity;
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
var author$project$Data$User$withProfileFromApi = function (_n0) {
	var id = _n0.aa;
	var displayName = _n0.Y;
	var imageId = _n0.bR;
	var introduction = _n0.bS;
	var university = _n0.bb;
	return A2(
		elm$core$Maybe$map,
		function (u) {
			return {
				Y: displayName,
				aa: author$project$Data$User$idFromString(id),
				bR: imageId,
				bS: introduction,
				bb: u
			};
		},
		university);
};
var elm$json$Json$Decode$null = _Json_decodeNull;
var elm$json$Json$Decode$oneOf = _Json_oneOf;
var elm$json$Json$Decode$nullable = function (decoder) {
	return elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				elm$json$Json$Decode$null(elm$core$Maybe$Nothing),
				A2(elm$json$Json$Decode$map, elm$core$Maybe$Just, decoder)
			]));
};
var author$project$Api$userWithProfileDecoder = A2(
	elm$json$Json$Decode$andThen,
	function (userMaybe) {
		if (!userMaybe.$) {
			var user = userMaybe.a;
			return elm$json$Json$Decode$succeed(user);
		} else {
			return elm$json$Json$Decode$fail('invalid university');
		}
	},
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
		_List_fromArray(
			['university', 'graduate']),
		elm$json$Json$Decode$nullable(elm$json$Json$Decode$string),
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt,
			_List_fromArray(
				['university', 'schoolAndDepartment']),
			elm$json$Json$Decode$nullable(elm$json$Json$Decode$string),
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'introduction',
				elm$json$Json$Decode$string,
				A3(
					NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'imageId',
					author$project$Api$imageIdDecoder,
					A3(
						NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'displayName',
						elm$json$Json$Decode$string,
						A3(
							NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'id',
							elm$json$Json$Decode$string,
							elm$json$Json$Decode$succeed(
								F6(
									function (id, displayName, imageId, introduction, schoolAndDepartment, graduate) {
										return author$project$Data$User$withProfileFromApi(
											{
												Y: displayName,
												aa: id,
												bR: imageId,
												bS: introduction,
												bb: author$project$Data$University$universityFromIdString(
													{dW: schoolAndDepartment, d_: graduate})
											});
									})))))))));
var author$project$Api$userWithProfileReturn = _List_fromArray(
	[
		{b: _List_Nil, a: 'id', c: _List_Nil},
		{b: _List_Nil, a: 'displayName', c: _List_Nil},
		{b: _List_Nil, a: 'imageId', c: _List_Nil},
		{b: _List_Nil, a: 'introduction', c: _List_Nil},
		{
		b: _List_Nil,
		a: 'university',
		c: _List_fromArray(
			[
				{b: _List_Nil, a: 'schoolAndDepartment', c: _List_Nil},
				{b: _List_Nil, a: 'graduate', c: _List_Nil}
			])
	}
	]);
var author$project$Api$getUserProfile = F2(
	function (userId, callBack) {
		return A3(
			author$project$Api$graphQlApiRequestWithoutToken,
			author$project$Api$Query(
				_List_fromArray(
					[
						{
						b: _List_fromArray(
							[
								_Utils_Tuple2(
								'userId',
								author$project$Api$GraphQLString(
									author$project$Data$User$idToString(userId)))
							]),
						a: 'user',
						c: author$project$Api$userWithProfileReturn
					}
					])),
			A2(elm$json$Json$Decode$field, 'user', author$project$Api$userWithProfileDecoder),
			callBack);
	});
var author$project$Api$nullableGraphQLValue = F2(
	function (func, maybe) {
		if (!maybe.$) {
			var a = maybe.a;
			return func(a);
		} else {
			return author$project$Api$GraphQLNull;
		}
	});
var author$project$Api$updateProfile = function (_n0) {
	var displayName = _n0.Y;
	var introduction = _n0.bS;
	var image = _n0.bn;
	var university = _n0.bb;
	return A2(
		author$project$Api$graphQlApiRequestWithToken,
		function (token) {
			return author$project$Api$Mutation(
				_List_fromArray(
					[
						{
						b: _List_fromArray(
							[
								_Utils_Tuple2(
								'accessToken',
								author$project$Api$GraphQLString(
									author$project$Api$tokenGetAccessTokenAsString(token))),
								_Utils_Tuple2(
								'displayName',
								author$project$Api$GraphQLString(displayName)),
								_Utils_Tuple2(
								'image',
								A2(author$project$Api$nullableGraphQLValue, author$project$Api$GraphQLString, image)),
								_Utils_Tuple2(
								'introduction',
								author$project$Api$GraphQLString(introduction)),
								_Utils_Tuple2(
								'university',
								author$project$Api$universityToGraphQLValue(university))
							]),
						a: 'updateProfile',
						c: author$project$Api$userWithProfileReturn
					}
					]));
		},
		A2(elm$json$Json$Decode$field, 'updateProfile', author$project$Api$userWithProfileDecoder));
};
var author$project$Main$ChangeProfileResponse = function (a) {
	return {$: 14, a: a};
};
var author$project$Main$LogOut = {$: 6};
var author$project$Main$PageMsgUser = function (a) {
	return {$: 14, a: a};
};
var elm$json$Json$Encode$null = _Json_encodeNull;
var author$project$Main$deleteRefreshTokenAndAllFromLocalStorage = _Platform_outgoingPort(
	'deleteRefreshTokenAndAllFromLocalStorage',
	function ($) {
		return elm$json$Json$Encode$null;
	});
var author$project$Page$User$MsgUserProfileResponse = function (a) {
	return {$: 8, a: a};
};
var author$project$Main$userPageEmissionToCmd = function (emission) {
	switch (emission.$) {
		case 1:
			var token = emission.a;
			var profile = emission.b;
			return A3(author$project$Api$updateProfile, profile, token, author$project$Main$ChangeProfileResponse);
		case 2:
			var idAndText = emission.a;
			return author$project$Main$replaceText(idAndText);
		case 3:
			var e = emission.a;
			return author$project$Main$universityEmissionToCmd(e);
		case 4:
			return elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						author$project$Main$deleteRefreshTokenAndAllFromLocalStorage(0),
						A2(
						elm$core$Task$perform,
						elm$core$Basics$always(author$project$Main$LogOut),
						elm$core$Task$succeed(0))
					]));
		case 0:
			var userId = emission.a;
			return A2(
				author$project$Api$getUserProfile,
				userId,
				A2(
					elm$core$Basics$composeR,
					author$project$Page$User$MsgUserProfileResponse,
					A2(elm$core$Basics$composeR, author$project$Main$PageMsgUser, author$project$Main$PageMsg)));
		default:
			var log = emission.a;
			return A2(
				elm$core$Task$perform,
				elm$core$Basics$always(
					author$project$Main$AddLogMessage(log)),
				elm$core$Task$succeed(0));
	}
};
var author$project$Page$About$About = 0;
var author$project$Page$About$aboutModel = 0;
var author$project$Page$About$PrivacyPolicy = 1;
var author$project$Page$About$privacyPolicyModel = 1;
var author$project$Data$LogInState$getToken = function (logInState) {
	switch (logInState.$) {
		case 0:
			return elm$core$Maybe$Nothing;
		case 1:
			var token = logInState.a;
			return elm$core$Maybe$Just(token);
		default:
			var token = logInState.a.dz;
			return elm$core$Maybe$Just(token);
	}
};
var author$project$Page$BoughtProducts$EmissionByProductList = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$BoughtProducts$EmissionGetPurchaseProducts = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$BoughtProducts$Loading = {$: 0};
var author$project$Page$BoughtProducts$Model = elm$core$Basics$identity;
var author$project$Page$Component$LogIn$Model = elm$core$Basics$identity;
var author$project$Page$Component$LogIn$initModel = elm$core$Maybe$Nothing;
var author$project$Page$BoughtProducts$initModel = F2(
	function (productIdMaybe, logInState) {
		var _n0 = author$project$Page$Component$ProductList$initModel(productIdMaybe);
		var productListModel = _n0.a;
		var productListEmissions = _n0.b;
		return _Utils_Tuple2(
			{bq: author$project$Page$Component$LogIn$initModel, ae: author$project$Page$BoughtProducts$Loading, a0: productListModel},
			_Utils_ap(
				function () {
					var _n1 = author$project$Data$LogInState$getToken(logInState);
					if (!_n1.$) {
						var accessToken = _n1.a;
						return _List_fromArray(
							[
								author$project$Page$BoughtProducts$EmissionGetPurchaseProducts(accessToken)
							]);
					} else {
						return _List_Nil;
					}
				}(),
				A2(elm$core$List$map, author$project$Page$BoughtProducts$EmissionByProductList, productListEmissions)));
	});
var author$project$Page$CommentedProducts$EmissionByProductList = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$CommentedProducts$EmissionGetCommentedProducts = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$CommentedProducts$Loading = {$: 0};
var author$project$Page$CommentedProducts$Model = elm$core$Basics$identity;
var author$project$Page$CommentedProducts$initModel = F2(
	function (goodIdMaybe, logInState) {
		var _n0 = author$project$Page$Component$ProductList$initModel(goodIdMaybe);
		var productListModel = _n0.a;
		var emissionList = _n0.b;
		return _Utils_Tuple2(
			{bq: author$project$Page$Component$LogIn$initModel, ae: author$project$Page$CommentedProducts$Loading, a0: productListModel},
			_Utils_ap(
				function () {
					var _n1 = author$project$Data$LogInState$getToken(logInState);
					if (!_n1.$) {
						var accessToken = _n1.a;
						return _List_fromArray(
							[
								author$project$Page$CommentedProducts$EmissionGetCommentedProducts(accessToken)
							]);
					} else {
						return _List_Nil;
					}
				}(),
				A2(elm$core$List$map, author$project$Page$CommentedProducts$EmissionByProductList, emissionList)));
	});
var author$project$Page$Component$ProductEditor$CategoryNone = {$: 0};
var author$project$Page$Component$ProductEditor$EmissionAddEventListenerForProductImages = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$Component$ProductEditor$Model = elm$core$Basics$identity;
var author$project$Page$Component$ProductEditor$photoAddInputId = 'exhibition-photo-input';
var author$project$Page$Component$ProductEditor$photoAddLabelId = 'exhibition-photo-addLabel';
var author$project$Page$Component$ProductEditor$initModelBlank = _Utils_Tuple2(
	{o: _List_Nil, K: _List_Nil, bJ: author$project$Page$Component$ProductEditor$CategoryNone, cD: elm$core$Maybe$Nothing, M: elm$core$Set$empty, cH: '', a: '', b4: elm$core$Maybe$Nothing},
	_List_fromArray(
		[
			author$project$Page$Component$ProductEditor$EmissionAddEventListenerForProductImages(
			{cY: author$project$Page$Component$ProductEditor$photoAddInputId, c0: author$project$Page$Component$ProductEditor$photoAddLabelId})
		]));
var author$project$Page$Exhibition$EditPage = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$Exhibition$EmissionByProductEditor = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$Exhibition$Model = elm$core$Basics$identity;
var author$project$Page$Exhibition$initModel = function () {
	var _n0 = author$project$Page$Component$ProductEditor$initModelBlank;
	var editorModel = _n0.a;
	var editorEmission = _n0.b;
	return _Utils_Tuple2(
		{
			br: author$project$Page$Component$LogIn$initModel,
			i: author$project$Page$Exhibition$EditPage(editorModel)
		},
		A2(elm$core$List$map, author$project$Page$Exhibition$EmissionByProductEditor, editorEmission));
}();
var author$project$Page$History$EmissionByProductList = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$History$EmissionGetHistoryProducts = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$History$Loading = {$: 0};
var author$project$Page$History$Model = elm$core$Basics$identity;
var author$project$Page$History$initModel = F2(
	function (goodIdMaybe, logInState) {
		var _n0 = author$project$Page$Component$ProductList$initModel(goodIdMaybe);
		var productListModel = _n0.a;
		var emissionList = _n0.b;
		return _Utils_Tuple2(
			{bq: author$project$Page$Component$LogIn$initModel, ae: author$project$Page$History$Loading, a0: productListModel},
			_Utils_ap(
				function () {
					var _n1 = author$project$Data$LogInState$getToken(logInState);
					if (!_n1.$) {
						var accessToken = _n1.a;
						return _List_fromArray(
							[
								author$project$Page$History$EmissionGetHistoryProducts(accessToken)
							]);
					} else {
						return _List_Nil;
					}
				}(),
				A2(elm$core$List$map, author$project$Page$History$EmissionByProductList, emissionList)));
	});
var author$project$Page$LikedProducts$EmissionByProductList = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$LikedProducts$EmissionGetLikedProducts = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$LikedProducts$Loading = {$: 0};
var author$project$Page$LikedProducts$Model = elm$core$Basics$identity;
var author$project$Page$LikedProducts$initModel = F2(
	function (goodIdMaybe, logInState) {
		var _n0 = author$project$Page$Component$ProductList$initModel(goodIdMaybe);
		var productListModel = _n0.a;
		var productListEmissions = _n0.b;
		return _Utils_Tuple2(
			{bq: author$project$Page$Component$LogIn$initModel, ae: author$project$Page$LikedProducts$Loading, a0: productListModel},
			_Utils_ap(
				function () {
					var _n1 = author$project$Data$LogInState$getToken(logInState);
					if (!_n1.$) {
						var accessToken = _n1.a;
						return _List_fromArray(
							[
								author$project$Page$LikedProducts$EmissionGetLikedProducts(accessToken)
							]);
					} else {
						return _List_Nil;
					}
				}(),
				A2(elm$core$List$map, author$project$Page$LikedProducts$EmissionByProductList, productListEmissions)));
	});
var author$project$Page$LogIn$Model = elm$core$Basics$identity;
var author$project$Page$LogIn$initModel = _Utils_Tuple2(author$project$Page$Component$LogIn$initModel, _List_Nil);
var author$project$Page$Notification$Model = 0;
var author$project$Page$Notification$initModel = _Utils_Tuple2(0, _List_Nil);
var author$project$Page$Product$EmissionGetProduct = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$Product$EmissionGetProductAndMarkHistory = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$Product$Loading = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$Product$initModel = F2(
	function (logInState, id) {
		return _Utils_Tuple2(
			author$project$Page$Product$Loading(id),
			function () {
				var _n0 = author$project$Data$LogInState$getToken(logInState);
				if (!_n0.$) {
					var accessToken = _n0.a;
					return _List_fromArray(
						[
							author$project$Page$Product$EmissionGetProductAndMarkHistory(
							{bw: id, dz: accessToken})
						]);
				} else {
					return _List_fromArray(
						[
							author$project$Page$Product$EmissionGetProduct(
							{bw: id})
						]);
				}
			}());
	});
var author$project$Page$Search$Condition = elm$core$Basics$identity;
var author$project$Page$Search$EmissionReplaceElementText = elm$core$Basics$identity;
var author$project$Page$Search$textAreaId = 'search-text';
var author$project$Page$Search$initModel = function (condition) {
	return _Utils_Tuple2(
		condition,
		function () {
			if (!condition.$) {
				return _List_Nil;
			} else {
				var text = condition.a;
				return _List_fromArray(
					[
						{aa: author$project$Page$Search$textAreaId, cf: text}
					]);
			}
		}());
};
var author$project$Page$Component$University$EmissionChangeSelectedIndex = elm$core$Basics$identity;
var author$project$Page$Component$University$School = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$Component$University$SchoolNone = {$: 0};
var author$project$Page$Component$University$schoolSelectId = 'signUp-selectSchool';
var author$project$Page$Component$University$initModelNone = _Utils_Tuple2(
	author$project$Page$Component$University$School(author$project$Page$Component$University$SchoolNone),
	_List_fromArray(
		[
			{aa: author$project$Page$Component$University$schoolSelectId, aW: 0}
		]));
var author$project$Page$SignUp$EmissionAddEventListenerForUserImage = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$SignUp$EmissionByUniversity = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$SignUp$EmissionReplaceElementText = function (a) {
	return {$: 3, a: a};
};
var author$project$Page$SignUp$Normal = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$SignUp$ServiceImage = function (a) {
	return {$: 0, a: a};
};
var author$project$Data$EmailAddress$EmailAddress = elm$core$Basics$identity;
var elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var elm$regex$Regex$Match = F4(
	function (match, index, number, submatches) {
		return {aW: index, d7: match, ea: number, eq: submatches};
	});
var elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var elm$regex$Regex$fromString = function (string) {
	return A2(
		elm$regex$Regex$fromStringWith,
		{cz: false, c5: false},
		string);
};
var elm$regex$Regex$never = _Regex_never;
var author$project$Data$EmailAddress$emailRegex = A2(
	elm$core$Maybe$withDefault,
	elm$regex$Regex$never,
	elm$regex$Regex$fromString('^[a-zA-Z0-9.!#$%&\'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'));
var elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return elm$core$Maybe$Just(x);
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var elm$regex$Regex$find = _Regex_findAtMost(_Regex_infinity);
var author$project$Data$EmailAddress$fromString = A2(
	elm$core$Basics$composeR,
	elm$regex$Regex$find(author$project$Data$EmailAddress$emailRegex),
	A2(
		elm$core$Basics$composeR,
		elm$core$List$head,
		elm$core$Maybe$map(
			A2(
				elm$core$Basics$composeR,
				function ($) {
					return $.d7;
				},
				elm$core$Basics$identity))));
var elm$core$String$fromList = _String_fromList;
var author$project$Data$EmailAddress$fromCharList = A2(elm$core$Basics$composeR, elm$core$String$fromList, author$project$Data$EmailAddress$fromString);
var author$project$Data$SAddress$SAddress = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var author$project$Data$StudentId$StudentId = F7(
	function (a, b, c, d, e, f, g) {
		return {$: 0, a: a, b: b, c: c, d: d, e: e, f: f, g: g};
	});
var author$project$Data$StudentId$D0 = 0;
var author$project$Data$StudentId$D1 = 1;
var author$project$Data$StudentId$D2 = 2;
var author$project$Data$StudentId$D3 = 3;
var author$project$Data$StudentId$D4 = 4;
var author$project$Data$StudentId$D5 = 5;
var author$project$Data$StudentId$D6 = 6;
var author$project$Data$StudentId$D7 = 7;
var author$project$Data$StudentId$D8 = 8;
var author$project$Data$StudentId$D9 = 9;
var author$project$Data$StudentId$digitFromChar = function (_char) {
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
var author$project$Data$StudentId$fromCharListNo20Head = function (charList) {
	var _n0 = A2(elm$core$List$map, author$project$Data$StudentId$digitFromChar, charList);
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
			A7(author$project$Data$StudentId$StudentId, i0, i1, i2, i3, i4, i5, i6));
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var elm$core$Basics$neq = _Utils_notEqual;
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
var elm$core$Basics$negate = function (n) {
	return -n;
};
var elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3(elm$core$String$slice, 0, -n, string);
	});
var elm$core$String$right = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(
			elm$core$String$slice,
			-n,
			elm$core$String$length(string),
			string);
	});
var elm$core$String$foldr = _String_foldr;
var elm$core$String$toList = function (string) {
	return A3(elm$core$String$foldr, elm$core$List$cons, _List_Nil, string);
};
var author$project$Data$SAddress$fromCharList = function (charList) {
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
			var _n9 = author$project$Data$StudentId$fromCharListNo20Head(
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
						author$project$Data$SAddress$SAddress,
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
var author$project$Data$StudentId$is20 = F2(
	function (c0, c1) {
		var _n0 = _Utils_Tuple2(
			author$project$Data$StudentId$digitFromChar(c0),
			author$project$Data$StudentId$digitFromChar(c1));
		if ((((!_n0.a.$) && (_n0.a.a === 2)) && (!_n0.b.$)) && (!_n0.b.a)) {
			var _n1 = _n0.a.a;
			var _n2 = _n0.b.a;
			return true;
		} else {
			return false;
		}
	});
var author$project$Data$StudentId$fromCharList = function (charList) {
	if (charList.b && charList.b.b) {
		var h0 = charList.a;
		var _n1 = charList.b;
		var h1 = _n1.a;
		var hs = _n1.b;
		return A2(author$project$Data$StudentId$is20, h0, h1) ? author$project$Data$StudentId$fromCharListNo20Head(hs) : elm$core$Maybe$Nothing;
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var author$project$Data$StudentId$P0 = {$: 0};
var author$project$Data$StudentId$P1 = function (a) {
	return {$: 1, a: a};
};
var author$project$Data$StudentId$P2 = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var author$project$Data$StudentId$P3 = F3(
	function (a, b, c) {
		return {$: 3, a: a, b: b, c: c};
	});
var author$project$Data$StudentId$P4 = F4(
	function (a, b, c, d) {
		return {$: 4, a: a, b: b, c: c, d: d};
	});
var author$project$Data$StudentId$P5 = F5(
	function (a, b, c, d, e) {
		return {$: 5, a: a, b: b, c: c, d: d, e: e};
	});
var author$project$Data$StudentId$P6 = F6(
	function (a, b, c, d, e, f) {
		return {$: 6, a: a, b: b, c: c, d: d, e: e, f: f};
	});
var author$project$Data$StudentId$partStudentIdFromCharList = function (charList) {
	if (charList.b && charList.b.b) {
		var h0 = charList.a;
		var _n1 = charList.b;
		var h1 = _n1.a;
		var hs = _n1.b;
		if (A2(author$project$Data$StudentId$is20, h0, h1)) {
			var _n2 = A2(elm$core$List$map, author$project$Data$StudentId$digitFromChar, hs);
			_n2$7:
			while (true) {
				if (!_n2.b) {
					return elm$core$Maybe$Just(author$project$Data$StudentId$P0);
				} else {
					if (!_n2.a.$) {
						if (!_n2.b.b) {
							var i0 = _n2.a.a;
							return elm$core$Maybe$Just(
								author$project$Data$StudentId$P1(i0));
						} else {
							if (!_n2.b.a.$) {
								if (!_n2.b.b.b) {
									var i0 = _n2.a.a;
									var _n3 = _n2.b;
									var i1 = _n3.a.a;
									return elm$core$Maybe$Just(
										A2(author$project$Data$StudentId$P2, i0, i1));
								} else {
									if (!_n2.b.b.a.$) {
										if (!_n2.b.b.b.b) {
											var i0 = _n2.a.a;
											var _n4 = _n2.b;
											var i1 = _n4.a.a;
											var _n5 = _n4.b;
											var i2 = _n5.a.a;
											return elm$core$Maybe$Just(
												A3(author$project$Data$StudentId$P3, i0, i1, i2));
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
														A4(author$project$Data$StudentId$P4, i0, i1, i2, i3));
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
																A5(author$project$Data$StudentId$P5, i0, i1, i2, i3, i4));
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
																	A6(author$project$Data$StudentId$P6, i0, i1, i2, i3, i4, i5));
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
var author$project$Page$SignUp$AEmailButIsNotTsukuba = function (a) {
	return {$: 4, a: a};
};
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
var elm$core$String$trim = _String_trim;
var author$project$Page$SignUp$analysisStudentIdOrSAddress = function (string) {
	var charList = elm$core$String$toList(
		elm$core$String$trim(string));
	var _n0 = author$project$Data$StudentId$fromCharList(charList);
	if (!_n0.$) {
		var studentId = _n0.a;
		return author$project$Page$SignUp$AStudentId(studentId);
	} else {
		var _n1 = author$project$Data$StudentId$partStudentIdFromCharList(charList);
		if (!_n1.$) {
			var partStudentId = _n1.a;
			return author$project$Page$SignUp$APartStudentId(partStudentId);
		} else {
			var _n2 = author$project$Data$SAddress$fromCharList(charList);
			if (!_n2.$) {
				var sAddress = _n2.a;
				return author$project$Page$SignUp$ASAddress(sAddress);
			} else {
				var _n3 = author$project$Data$EmailAddress$fromCharList(charList);
				if (!_n3.$) {
					var emailAddress = _n3.a;
					return author$project$Page$SignUp$AEmailButIsNotTsukuba(emailAddress);
				} else {
					return author$project$Page$SignUp$ANone;
				}
			}
		}
	}
};
var author$project$Page$SignUp$displayNameFormId = 'displayNameForm';
var author$project$Page$SignUp$imageInputId = 'image-input';
var author$project$Page$SignUp$imageLabelId = 'image-label';
var author$project$Page$SignUp$initModel = function (_n0) {
	var name = _n0.a;
	var imageId = _n0.bR;
	var sendEmailToken = _n0.$7;
	var _n1 = author$project$Page$Component$University$initModelNone;
	var universityModel = _n1.a;
	var universityEmissions = _n1.b;
	return _Utils_Tuple2(
		author$project$Page$SignUp$Normal(
			{
				bn: author$project$Page$SignUp$ServiceImage(imageId),
				bZ: name,
				bz: author$project$Page$SignUp$analysisStudentIdOrSAddress(''),
				$7: sendEmailToken,
				bb: universityModel
			}),
		_Utils_ap(
			_List_fromArray(
				[
					author$project$Page$SignUp$EmissionAddEventListenerForUserImage(
					{cY: author$project$Page$SignUp$imageInputId, c0: author$project$Page$SignUp$imageLabelId}),
					author$project$Page$SignUp$EmissionReplaceElementText(
					{aa: author$project$Page$SignUp$displayNameFormId, cf: name})
				]),
			A2(elm$core$List$map, author$project$Page$SignUp$EmissionByUniversity, universityEmissions)));
};
var author$project$Page$SoldProducts$EmissionByProductList = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$SoldProducts$EmissionGetSoldProducts = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$SoldProducts$Loading = {$: 0};
var author$project$Page$SoldProducts$Model = elm$core$Basics$identity;
var author$project$Page$SoldProducts$initModel = F2(
	function (userId, productIdMaybe) {
		var _n0 = author$project$Page$Component$ProductList$initModel(productIdMaybe);
		var productListModel = _n0.a;
		var emissionList = _n0.b;
		return _Utils_Tuple2(
			{ae: author$project$Page$SoldProducts$Loading, a0: productListModel, ex: userId},
			_Utils_ap(
				_List_fromArray(
					[
						author$project$Page$SoldProducts$EmissionGetSoldProducts(userId)
					]),
				A2(elm$core$List$map, author$project$Page$SoldProducts$EmissionByProductList, emissionList)));
	});
var author$project$Page$Trade$CheckTrader = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$Trade$EmissionGetTradeDetail = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var author$project$Page$Trade$initModelFromId = F2(
	function (logInState, id) {
		return _Utils_Tuple2(
			author$project$Page$Trade$CheckTrader(id),
			function () {
				var _n0 = author$project$Data$LogInState$getToken(logInState);
				if (!_n0.$) {
					var token = _n0.a;
					return _List_fromArray(
						[
							A2(author$project$Page$Trade$EmissionGetTradeDetail, token, id)
						]);
				} else {
					return _List_Nil;
				}
			}());
	});
var author$project$Page$TradesInPast$EmissionGetTradedProducts = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$TradesInPast$Loading = {$: 0};
var author$project$Page$TradesInPast$Model = elm$core$Basics$identity;
var author$project$Page$TradesInPast$initModel = F2(
	function (goodIdMaybe, logInState) {
		return _Utils_Tuple2(
			{bq: author$project$Page$Component$LogIn$initModel, ae: author$project$Page$TradesInPast$Loading},
			function () {
				var _n0 = author$project$Data$LogInState$getToken(logInState);
				if (!_n0.$) {
					var accessToken = _n0.a;
					return _List_fromArray(
						[
							author$project$Page$TradesInPast$EmissionGetTradedProducts(accessToken)
						]);
				} else {
					return _List_Nil;
				}
			}());
	});
var author$project$Page$TradesInProgress$EmissionGetTradingProducts = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$TradesInProgress$Loading = {$: 0};
var author$project$Page$TradesInProgress$Model = elm$core$Basics$identity;
var author$project$Page$TradesInProgress$initModel = F2(
	function (goodIdMaybe, logInState) {
		return _Utils_Tuple2(
			{bq: author$project$Page$Component$LogIn$initModel, ae: author$project$Page$TradesInProgress$Loading},
			function () {
				var _n0 = author$project$Data$LogInState$getToken(logInState);
				if (!_n0.$) {
					var accessToken = _n0.a;
					return _List_fromArray(
						[
							author$project$Page$TradesInProgress$EmissionGetTradingProducts(accessToken)
						]);
				} else {
					return _List_Nil;
				}
			}());
	});
var author$project$Data$User$withNameGetId = function (_n0) {
	var id = _n0.aa;
	return id;
};
var author$project$Page$User$EmissionGetUserProfile = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$User$LoadingWithUserId = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$User$LoadingWithUserIdAndName = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$User$initModelFromId = F2(
	function (logInState, userId) {
		if (logInState.$ === 2) {
			var userWithName = logInState.a.dF;
			return _Utils_eq(
				author$project$Data$User$withNameGetId(userWithName),
				userId) ? _Utils_Tuple2(
				author$project$Page$User$LoadingWithUserIdAndName(userWithName),
				_List_fromArray(
					[
						author$project$Page$User$EmissionGetUserProfile(userId)
					])) : _Utils_Tuple2(
				author$project$Page$User$LoadingWithUserId(userId),
				_List_fromArray(
					[
						author$project$Page$User$EmissionGetUserProfile(userId)
					]));
		} else {
			return _Utils_Tuple2(
				author$project$Page$User$LoadingWithUserId(userId),
				_List_fromArray(
					[
						author$project$Page$User$EmissionGetUserProfile(userId)
					]));
		}
	});
var author$project$Main$urlParserInitResultToPageAndCmd = F3(
	function (key, logInState, page) {
		switch (page.$) {
			case 0:
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageHome,
					author$project$Main$homePageEmissionToCmd,
					author$project$Page$Home$initModel(elm$core$Maybe$Nothing));
			case 1:
				var name = page.a.a;
				var imageId = page.a.bR;
				var sendEmailToken = page.a.$7;
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageSignUp,
					author$project$Main$signUpPageEmissionToCmd,
					author$project$Page$SignUp$initModel(
						{bR: imageId, a: name, $7: sendEmailToken}));
			case 2:
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageLogIn,
					author$project$Main$logInPageEmissionToCmd(key),
					author$project$Page$LogIn$initModel);
			case 3:
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageLikedProducts,
					author$project$Main$likedProductsEmissionToCmd,
					A2(author$project$Page$LikedProducts$initModel, elm$core$Maybe$Nothing, logInState));
			case 4:
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageHistory,
					author$project$Main$historyEmissionToCmd,
					A2(author$project$Page$History$initModel, elm$core$Maybe$Nothing, logInState));
			case 5:
				var userId = page.a;
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageSoldProducts,
					author$project$Main$soldProductsPageEmissionToCmd,
					A2(author$project$Page$SoldProducts$initModel, userId, elm$core$Maybe$Nothing));
			case 6:
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageBoughtProducts,
					author$project$Main$boughtProductsPageEmissionToCmd,
					A2(author$project$Page$BoughtProducts$initModel, elm$core$Maybe$Nothing, logInState));
			case 7:
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageTradesInProgress,
					author$project$Main$tradingProductsEmissionToCmd,
					A2(author$project$Page$TradesInProgress$initModel, elm$core$Maybe$Nothing, logInState));
			case 8:
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageTradesInPast,
					author$project$Main$tradedProductsEmissionToCmd,
					A2(author$project$Page$TradesInPast$initModel, elm$core$Maybe$Nothing, logInState));
			case 9:
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageCommentedProducts,
					author$project$Main$commentedProductsEmissionToCmd,
					A2(author$project$Page$CommentedProducts$initModel, elm$core$Maybe$Nothing, logInState));
			case 10:
				return A3(author$project$Main$mapPageModel, author$project$Main$PageExhibition, author$project$Main$exhibitionPageEmissionToCmd, author$project$Page$Exhibition$initModel);
			case 11:
				var productId = page.a;
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageProduct,
					author$project$Main$productPageEmissionToCmd(key),
					A2(author$project$Page$Product$initModel, logInState, productId));
			case 12:
				var tradeId = page.a;
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageTrade,
					author$project$Main$tradePageEmissionToCmd,
					A2(author$project$Page$Trade$initModelFromId, logInState, tradeId));
			case 13:
				var userId = page.a;
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageUser,
					author$project$Main$userPageEmissionToCmd,
					A2(author$project$Page$User$initModelFromId, logInState, userId));
			case 14:
				var condition = page.a;
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageSearch,
					author$project$Main$searchPageEmissionToCmd,
					author$project$Page$Search$initModel(condition));
			case 15:
				return A3(author$project$Main$mapPageModel, author$project$Main$PageNotification, author$project$Main$notificationEmissionToCmd, author$project$Page$Notification$initModel);
			case 16:
				return _Utils_Tuple2(
					author$project$Main$PageAbout(author$project$Page$About$aboutModel),
					elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(
					author$project$Main$PageAbout(author$project$Page$About$privacyPolicyModel),
					elm$core$Platform$Cmd$none);
		}
	});
var author$project$Main$urlParserInit = F3(
	function (logInState, key, page) {
		if (!page.$) {
			var p = page.a;
			return A3(author$project$Main$urlParserInitResultToPageAndCmd, key, logInState, p);
		} else {
			return author$project$Main$pageNotFound;
		}
	});
var author$project$PageLocation$InitHome = {$: 0};
var RomanErnst$erl$Erl$extractProtocol = function (str) {
	var parts = A2(elm$core$String$split, '://', str);
	var _n0 = elm$core$List$length(parts);
	if (_n0 === 1) {
		return '';
	} else {
		return A2(
			elm$core$Maybe$withDefault,
			'',
			elm$core$List$head(parts));
	}
};
var elm$regex$Regex$findAtMost = _Regex_findAtMost;
var RomanErnst$erl$Erl$extractPort = function (str) {
	var res = A2(
		elm$core$Maybe$withDefault,
		_List_Nil,
		A2(
			elm$core$Maybe$map,
			function (rx) {
				return A3(elm$regex$Regex$findAtMost, 1, rx, str);
			},
			elm$regex$Regex$fromString(':\\d+')));
	return function (result) {
		if (!result.$) {
			var port_ = result.a;
			return port_;
		} else {
			var _n1 = RomanErnst$erl$Erl$extractProtocol(str);
			switch (_n1) {
				case 'http':
					return 80;
				case 'https':
					return 443;
				case 'ftp':
					return 21;
				case 'sftp':
					return 22;
				default:
					return 0;
			}
		}
	}(
		elm$core$String$toInt(
			A2(
				elm$core$String$dropLeft,
				1,
				A2(
					elm$core$Maybe$withDefault,
					'',
					elm$core$List$head(
						A2(
							elm$core$List$map,
							function ($) {
								return $.d7;
							},
							res))))));
};
var RomanErnst$erl$Erl$leftFromOrSame = F2(
	function (delimiter, str) {
		var parts = A2(elm$core$String$split, delimiter, str);
		return A2(
			elm$core$Maybe$withDefault,
			'',
			elm$core$List$head(parts));
	});
var RomanErnst$erl$Erl$rightFromOrSame = F2(
	function (delimiter, str) {
		var parts = A2(elm$core$String$split, delimiter, str);
		return A2(
			elm$core$Maybe$withDefault,
			'',
			elm$core$List$head(
				elm$core$List$reverse(parts)));
	});
var RomanErnst$erl$Erl$extractHost = function (str) {
	if (A2(elm$core$String$contains, '//', str)) {
		return A2(
			RomanErnst$erl$Erl$leftFromOrSame,
			':',
			A2(
				RomanErnst$erl$Erl$leftFromOrSame,
				'/',
				A2(RomanErnst$erl$Erl$rightFromOrSame, '//', str)));
	} else {
		var matches = function (s) {
			return A2(
				elm$core$Maybe$withDefault,
				_List_Nil,
				A2(
					elm$core$Maybe$map,
					function (rx) {
						return A3(elm$regex$Regex$findAtMost, 1, rx, s);
					},
					elm$regex$Regex$fromString('((\\w|-)+\\.)+(\\w|-)+')));
		};
		return A2(
			elm$core$Maybe$withDefault,
			'',
			A2(
				elm$core$Maybe$map,
				function ($) {
					return $.d7;
				},
				elm$core$List$head(
					matches(
						A2(
							RomanErnst$erl$Erl$leftFromOrSame,
							'/',
							A2(RomanErnst$erl$Erl$rightFromOrSame, '//', str))))));
	}
};
var elm$regex$Regex$replaceAtMost = _Regex_replaceAtMost;
var RomanErnst$erl$Erl$extractPath = function (str) {
	var replace = F2(
		function (maybeRegex, s) {
			return A2(
				elm$core$Maybe$withDefault,
				s,
				A2(
					elm$core$Maybe$map,
					function (rx) {
						return A4(
							elm$regex$Regex$replaceAtMost,
							1,
							rx,
							function (_n0) {
								return '';
							},
							s);
					},
					maybeRegex));
		});
	var host_ = RomanErnst$erl$Erl$extractHost(str);
	return A2(
		replace,
		elm$regex$Regex$fromString(':\\d+'),
		A2(
			replace,
			elm$regex$Regex$fromString(host_),
			A2(
				RomanErnst$erl$Erl$leftFromOrSame,
				'#',
				A2(
					RomanErnst$erl$Erl$leftFromOrSame,
					'?',
					A2(RomanErnst$erl$Erl$rightFromOrSame, '//', str)))));
};
var elm$regex$Regex$contains = _Regex_contains;
var RomanErnst$erl$Erl$hasLeadingSlashFromAll = function (str) {
	return A2(
		elm$core$Maybe$withDefault,
		false,
		A2(
			elm$core$Maybe$map,
			function (rx) {
				return A2(
					elm$regex$Regex$contains,
					rx,
					RomanErnst$erl$Erl$extractPath(str));
			},
			elm$regex$Regex$fromString('^/')));
};
var RomanErnst$erl$Erl$hasTrailingSlashFromAll = function (str) {
	return A2(
		elm$core$Maybe$withDefault,
		false,
		A2(
			elm$core$Maybe$map,
			function (rx) {
				return A2(
					elm$regex$Regex$contains,
					rx,
					RomanErnst$erl$Erl$extractPath(str));
			},
			elm$regex$Regex$fromString('/$')));
};
var elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var RomanErnst$erl$Erl$extractHash = function (str) {
	return A2(
		elm$core$Maybe$withDefault,
		'',
		elm$core$List$head(
			A2(
				elm$core$List$drop,
				1,
				A2(elm$core$String$split, '#', str))));
};
var RomanErnst$erl$Erl$hashFromAll = function (str) {
	return RomanErnst$erl$Erl$extractHash(str);
};
var RomanErnst$erl$Erl$parseHost = function (str) {
	return A2(elm$core$String$split, '.', str);
};
var RomanErnst$erl$Erl$host = function (str) {
	return RomanErnst$erl$Erl$parseHost(
		RomanErnst$erl$Erl$extractHost(str));
};
var RomanErnst$erl$Erl$notEmpty = function (str) {
	return !elm$core$String$isEmpty(str);
};
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
var elm$url$Url$percentDecode = _Url_percentDecode;
var RomanErnst$erl$Erl$parsePath = function (str) {
	return A2(
		elm$core$List$map,
		elm$core$Maybe$withDefault(''),
		A2(
			elm$core$List$map,
			elm$url$Url$percentDecode,
			A2(
				elm$core$List$filter,
				RomanErnst$erl$Erl$notEmpty,
				A2(elm$core$String$split, '/', str))));
};
var RomanErnst$erl$Erl$pathFromAll = function (str) {
	return RomanErnst$erl$Erl$parsePath(
		RomanErnst$erl$Erl$extractPath(str));
};
var RomanErnst$erl$Erl$extractQuery = function (str) {
	return A2(
		elm$core$Maybe$withDefault,
		'',
		elm$core$List$head(
			A2(
				elm$core$String$split,
				'#',
				A2(
					elm$core$Maybe$withDefault,
					'',
					elm$core$List$head(
						A2(
							elm$core$List$drop,
							1,
							A2(elm$core$String$split, '?', str)))))));
};
var RomanErnst$erl$Erl$queryStringElementToTuple = function (element) {
	var splitted = A2(elm$core$String$split, '=', element);
	var second = A2(
		elm$core$Maybe$withDefault,
		'',
		elm$core$List$head(
			A2(elm$core$List$drop, 1, splitted)));
	var secondDecoded = A2(
		elm$core$Maybe$withDefault,
		'',
		elm$url$Url$percentDecode(second));
	var first = A2(
		elm$core$Maybe$withDefault,
		'',
		elm$core$List$head(splitted));
	var firstDecoded = A2(
		elm$core$Maybe$withDefault,
		'',
		elm$url$Url$percentDecode(first));
	return _Utils_Tuple2(firstDecoded, secondDecoded);
};
var RomanErnst$erl$Erl$parseQuery = function (queryString) {
	var splitted = A2(elm$core$String$split, '&', queryString);
	return elm$core$String$isEmpty(queryString) ? _List_Nil : A2(elm$core$List$map, RomanErnst$erl$Erl$queryStringElementToTuple, splitted);
};
var RomanErnst$erl$Erl$queryFromAll = function (all) {
	return RomanErnst$erl$Erl$parseQuery(
		RomanErnst$erl$Erl$extractQuery(all));
};
var RomanErnst$erl$Erl$parse = function (str) {
	return {
		bk: RomanErnst$erl$Erl$hasLeadingSlashFromAll(str),
		bl: RomanErnst$erl$Erl$hasTrailingSlashFromAll(str),
		cQ: RomanErnst$erl$Erl$hashFromAll(str),
		bm: RomanErnst$erl$Erl$host(str),
		b3: '',
		c8: RomanErnst$erl$Erl$pathFromAll(str),
		a_: RomanErnst$erl$Erl$extractPort(str),
		a2: RomanErnst$erl$Erl$extractProtocol(str),
		ef: RomanErnst$erl$Erl$queryFromAll(str),
		ci: ''
	};
};
var author$project$Api$makeToken = function (_n0) {
	var accessToken = _n0.dK;
	var refreshToken = _n0.eh;
	return {bG: accessToken, b6: refreshToken};
};
var author$project$PageLocation$InitAbout = {$: 16};
var author$project$PageLocation$InitAboutPrivacyPolicy = {$: 17};
var author$project$PageLocation$InitBoughtProducts = {$: 6};
var author$project$PageLocation$InitCommentedProducts = {$: 9};
var author$project$PageLocation$InitExhibition = {$: 10};
var author$project$PageLocation$InitHistory = {$: 4};
var author$project$PageLocation$InitLikedProducts = {$: 3};
var author$project$PageLocation$InitLogIn = {$: 2};
var author$project$PageLocation$InitNotification = {$: 15};
var author$project$PageLocation$InitProduct = function (a) {
	return {$: 11, a: a};
};
var author$project$PageLocation$InitSearch = function (a) {
	return {$: 14, a: a};
};
var author$project$PageLocation$InitSignUp = function (a) {
	return {$: 1, a: a};
};
var author$project$PageLocation$InitSoldProducts = function (a) {
	return {$: 5, a: a};
};
var author$project$PageLocation$InitTrade = function (a) {
	return {$: 12, a: a};
};
var author$project$PageLocation$InitTradedProducts = {$: 8};
var author$project$PageLocation$InitTradingProducts = {$: 7};
var author$project$PageLocation$InitUser = function (a) {
	return {$: 13, a: a};
};
var author$project$PageLocation$aboutParser = function (path) {
	return _Utils_eq(
		path,
		_List_fromArray(
			[author$project$PageLocation$aboutPath])) ? elm$core$Maybe$Just(0) : elm$core$Maybe$Nothing;
};
var author$project$PageLocation$aboutPrivacyPolicyParser = function (path) {
	return _Utils_eq(
		path,
		_List_fromArray(
			[author$project$PageLocation$aboutPath, author$project$PageLocation$aboutPrivacyPolicyPath])) ? elm$core$Maybe$Just(0) : elm$core$Maybe$Nothing;
};
var author$project$PageLocation$boughtProductsParser = function (path) {
	return _Utils_eq(path, author$project$PageLocation$boughtProductsPath) ? elm$core$Maybe$Just(0) : elm$core$Maybe$Nothing;
};
var author$project$PageLocation$commentedProductsParser = function (path) {
	return _Utils_eq(path, author$project$PageLocation$commentedProductsPath) ? elm$core$Maybe$Just(0) : elm$core$Maybe$Nothing;
};
var author$project$PageLocation$exhibitionParser = function (path) {
	return _Utils_eq(path, author$project$PageLocation$exhibitionPath) ? elm$core$Maybe$Just(0) : elm$core$Maybe$Nothing;
};
var author$project$PageLocation$historyParser = function (path) {
	return _Utils_eq(path, author$project$PageLocation$historyPath) ? elm$core$Maybe$Just(0) : elm$core$Maybe$Nothing;
};
var author$project$PageLocation$homeParser = function (path) {
	return _Utils_eq(path, author$project$PageLocation$homePath) ? elm$core$Maybe$Just(0) : elm$core$Maybe$Nothing;
};
var author$project$PageLocation$likedProductsParser = function (path) {
	return _Utils_eq(path, author$project$PageLocation$likedProductsPath) ? elm$core$Maybe$Just(0) : elm$core$Maybe$Nothing;
};
var author$project$PageLocation$logInParser = function (path) {
	return _Utils_eq(path, author$project$PageLocation$logInPath) ? elm$core$Maybe$Just(0) : elm$core$Maybe$Nothing;
};
var author$project$PageLocation$notificationParser = function (path) {
	return _Utils_eq(
		path,
		_List_fromArray(
			[author$project$PageLocation$notificationPath])) ? elm$core$Maybe$Just(0) : elm$core$Maybe$Nothing;
};
var author$project$PageLocation$oneOf = function (list) {
	oneOf:
	while (true) {
		if (list.b) {
			if (!list.a.$) {
				var x = list.a.a;
				return elm$core$Maybe$Just(x);
			} else {
				var _n1 = list.a;
				var xs = list.b;
				var $temp$list = xs;
				list = $temp$list;
				continue oneOf;
			}
		} else {
			return elm$core$Maybe$Nothing;
		}
	}
};
var author$project$PageLocation$parserMap = F3(
	function (f, parser, path) {
		return A2(
			elm$core$Maybe$map,
			f,
			parser(path));
	});
var author$project$Data$Product$idFromString = elm$core$Basics$identity;
var author$project$PageLocation$productParser = function (path) {
	if (((path.b && (path.a === 'product')) && path.b.b) && (!path.b.b.b)) {
		var _n1 = path.b;
		var productIdString = _n1.a;
		return elm$core$Maybe$Just(
			author$project$Data$Product$idFromString(productIdString));
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var author$project$Data$SearchCondition$ByText = function (a) {
	return {$: 1, a: a};
};
var author$project$Data$SearchCondition$None = {$: 0};
var author$project$PageLocation$searchParser = F2(
	function (fragment, path) {
		return _Utils_eq(path, author$project$PageLocation$searchPath) ? elm$core$Maybe$Just(
			function () {
				var _n0 = A2(elm$core$Dict$get, 'text', fragment);
				if (!_n0.$) {
					var text = _n0.a;
					return author$project$Data$SearchCondition$ByText(text);
				} else {
					return author$project$Data$SearchCondition$None;
				}
			}()) : elm$core$Maybe$Nothing;
	});
var author$project$PageLocation$signUpParser = F2(
	function (fragment, path) {
		var _n0 = _Utils_Tuple2(
			path,
			_Utils_Tuple3(
				A2(elm$core$Dict$get, 'sendEmailToken', fragment),
				A2(elm$core$Dict$get, 'name', fragment),
				A2(elm$core$Dict$get, 'imageId', fragment)));
		if (((((_n0.a.b && (_n0.a.a === 'signup')) && (!_n0.a.b.b)) && (!_n0.b.a.$)) && (!_n0.b.b.$)) && (!_n0.b.c.$)) {
			var _n1 = _n0.a;
			var _n2 = _n0.b;
			var sendEmailToken = _n2.a.a;
			var name = _n2.b.a;
			var imageId = _n2.c.a;
			return elm$core$Maybe$Just(
				{
					bR: author$project$Data$ImageId$fromString(imageId),
					a: name,
					$7: sendEmailToken
				});
		} else {
			var _n3 = _n0.b;
			return elm$core$Maybe$Nothing;
		}
	});
var author$project$PageLocation$soldProductsParser = function (path) {
	if ((path.b && path.b.b) && (!path.b.b.b)) {
		var p = path.a;
		var _n1 = path.b;
		var userId = _n1.a;
		return _Utils_eq(p, author$project$PageLocation$soldProductsPath) ? elm$core$Maybe$Just(
			author$project$Data$User$idFromString(userId)) : elm$core$Maybe$Nothing;
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var author$project$Data$Trade$idFromString = elm$core$Basics$identity;
var author$project$PageLocation$tradeParser = function (path) {
	if (((path.b && (path.a === 'trade')) && path.b.b) && (!path.b.b.b)) {
		var _n1 = path.b;
		var idString = _n1.a;
		return elm$core$Maybe$Just(
			author$project$Data$Trade$idFromString(idString));
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var author$project$PageLocation$tradedProductsParser = function (path) {
	return _Utils_eq(path, author$project$PageLocation$tradedProductsPath) ? elm$core$Maybe$Just(0) : elm$core$Maybe$Nothing;
};
var author$project$PageLocation$tradingProductsParser = function (path) {
	return _Utils_eq(path, author$project$PageLocation$tradingProductsPath) ? elm$core$Maybe$Just(0) : elm$core$Maybe$Nothing;
};
var author$project$PageLocation$userParser = function (path) {
	if (((path.b && (path.a === 'user')) && path.b.b) && (!path.b.b.b)) {
		var _n1 = path.b;
		var userId = _n1.a;
		return elm$core$Maybe$Just(
			author$project$Data$User$idFromString(userId));
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var elm$core$Dict$fromList = function (assocs) {
	return A3(
		elm$core$List$foldl,
		F2(
			function (_n0, dict) {
				var key = _n0.a;
				var value = _n0.b;
				return A3(elm$core$Dict$insert, key, value, dict);
			}),
		elm$core$Dict$empty,
		assocs);
};
var author$project$PageLocation$initFromUrl = function (url) {
	var _n0 = RomanErnst$erl$Erl$parse(
		elm$url$Url$toString(url));
	var path = _n0.c8;
	var hash = _n0.cQ;
	var fragmentDict = elm$core$Dict$fromList(
		RomanErnst$erl$Erl$parse('?' + hash).ef);
	return _Utils_Tuple2(
		function () {
			var _n1 = _Utils_Tuple2(
				A2(elm$core$Dict$get, 'refreshToken', fragmentDict),
				A2(elm$core$Dict$get, 'accessToken', fragmentDict));
			if ((!_n1.a.$) && (!_n1.b.$)) {
				var refreshToken = _n1.a.a;
				var accessToken = _n1.b.a;
				return elm$core$Maybe$Just(
					author$project$Api$makeToken(
						{dK: accessToken, eh: refreshToken}));
			} else {
				return elm$core$Maybe$Nothing;
			}
		}(),
		author$project$PageLocation$oneOf(
			A2(
				elm$core$List$map,
				function (f) {
					return f(path);
				},
				_List_fromArray(
					[
						A2(
						author$project$PageLocation$parserMap,
						elm$core$Basics$always(author$project$PageLocation$InitHome),
						author$project$PageLocation$homeParser),
						A2(
						author$project$PageLocation$parserMap,
						author$project$PageLocation$InitSignUp,
						author$project$PageLocation$signUpParser(fragmentDict)),
						A2(
						author$project$PageLocation$parserMap,
						elm$core$Basics$always(author$project$PageLocation$InitLogIn),
						author$project$PageLocation$logInParser),
						A2(
						author$project$PageLocation$parserMap,
						elm$core$Basics$always(author$project$PageLocation$InitLikedProducts),
						author$project$PageLocation$likedProductsParser),
						A2(
						author$project$PageLocation$parserMap,
						elm$core$Basics$always(author$project$PageLocation$InitHistory),
						author$project$PageLocation$historyParser),
						A2(author$project$PageLocation$parserMap, author$project$PageLocation$InitSoldProducts, author$project$PageLocation$soldProductsParser),
						A2(
						author$project$PageLocation$parserMap,
						elm$core$Basics$always(author$project$PageLocation$InitBoughtProducts),
						author$project$PageLocation$boughtProductsParser),
						A2(
						author$project$PageLocation$parserMap,
						elm$core$Basics$always(author$project$PageLocation$InitTradingProducts),
						author$project$PageLocation$tradingProductsParser),
						A2(
						author$project$PageLocation$parserMap,
						elm$core$Basics$always(author$project$PageLocation$InitTradedProducts),
						author$project$PageLocation$tradedProductsParser),
						A2(
						author$project$PageLocation$parserMap,
						elm$core$Basics$always(author$project$PageLocation$InitCommentedProducts),
						author$project$PageLocation$commentedProductsParser),
						A2(
						author$project$PageLocation$parserMap,
						elm$core$Basics$always(author$project$PageLocation$InitExhibition),
						author$project$PageLocation$exhibitionParser),
						A2(author$project$PageLocation$parserMap, author$project$PageLocation$InitProduct, author$project$PageLocation$productParser),
						A2(author$project$PageLocation$parserMap, author$project$PageLocation$InitTrade, author$project$PageLocation$tradeParser),
						A2(author$project$PageLocation$parserMap, author$project$PageLocation$InitUser, author$project$PageLocation$userParser),
						A2(
						author$project$PageLocation$parserMap,
						author$project$PageLocation$InitSearch,
						author$project$PageLocation$searchParser(fragmentDict)),
						A2(
						author$project$PageLocation$parserMap,
						elm$core$Basics$always(author$project$PageLocation$InitNotification),
						author$project$PageLocation$notificationParser),
						A2(
						author$project$PageLocation$parserMap,
						elm$core$Basics$always(author$project$PageLocation$InitAbout),
						author$project$PageLocation$aboutParser),
						A2(
						author$project$PageLocation$parserMap,
						elm$core$Basics$always(author$project$PageLocation$InitAboutPrivacyPolicy),
						author$project$PageLocation$aboutPrivacyPolicyParser)
					]))));
};
var author$project$PageLocation$initToUrlAsString = function (location) {
	switch (location.$) {
		case 0:
			return author$project$PageLocation$homeUrl;
		case 1:
			return author$project$PageLocation$homeUrl;
		case 2:
			return author$project$PageLocation$logInUrl;
		case 3:
			return author$project$PageLocation$likedProductsUrl;
		case 4:
			return author$project$PageLocation$historyUrl;
		case 5:
			var id = location.a;
			return author$project$PageLocation$soldProductsUrl(id);
		case 6:
			return author$project$PageLocation$boughtProductsUrl;
		case 7:
			return author$project$PageLocation$tradingProductsUrl;
		case 8:
			return author$project$PageLocation$tradedProductsUrl;
		case 9:
			return author$project$PageLocation$commentedProductsUrl;
		case 10:
			return author$project$PageLocation$exhibitionUrl;
		case 11:
			var id = location.a;
			return author$project$PageLocation$productUrl(id);
		case 12:
			var id = location.a;
			return author$project$PageLocation$tradeUrl(id);
		case 13:
			var id = location.a;
			return author$project$PageLocation$userUrl(id);
		case 14:
			var condition = location.a;
			return author$project$PageLocation$searchUrl(condition);
		case 15:
			return author$project$PageLocation$notificationUrl;
		case 16:
			return author$project$PageLocation$aboutUrl;
		default:
			return author$project$PageLocation$aboutPrivacyPolicyUrl;
	}
};
var author$project$Main$init = F3(
	function (_n0, url, key) {
		var refreshToken = _n0.eh;
		var _n1 = author$project$PageLocation$initFromUrl(url);
		var accessTokenAndRefreshTokenByUrl = _n1.a;
		var page = _n1.b;
		var _n2 = A3(author$project$Main$urlParserInit, author$project$Data$LogInState$None, key, page);
		var newPage = _n2.a;
		var cmd = _n2.b;
		return _Utils_Tuple2(
			{B: key, k: author$project$Data$LogInState$None, w: elm$core$Maybe$Nothing, d9: false, b$: elm$core$Maybe$Nothing, i: newPage, bd: false},
			elm$core$Platform$Cmd$batch(
				_Utils_ap(
					function () {
						var _n3 = _Utils_Tuple2(accessTokenAndRefreshTokenByUrl, refreshToken);
						if (!_n3.a.$) {
							var accessTokenAndRefreshToken = _n3.a.a;
							return _List_fromArray(
								[
									A3(author$project$Main$logInResponseCmd, accessTokenAndRefreshToken, key, url),
									A2(
									elm$core$Task$perform,
									elm$core$Basics$always(
										author$project$Main$AddLogMessage('ログイン中')),
									elm$core$Task$succeed(0)),
									A2(
									elm$browser$Browser$Navigation$replaceUrl,
									key,
									author$project$PageLocation$initToUrlAsString(
										A2(elm$core$Maybe$withDefault, author$project$PageLocation$InitHome, page)))
								]);
						} else {
							if (!_n3.b.$) {
								var _n4 = _n3.a;
								var refreshTokenString = _n3.b.a;
								return _List_fromArray(
									[
										A2(author$project$Api$tokenRefresh, refreshTokenString, author$project$Main$LogInResponse),
										A2(
										elm$core$Task$perform,
										elm$core$Basics$always(
											author$project$Main$AddLogMessage('ログイン中')),
										elm$core$Task$succeed(0))
									]);
							} else {
								var _n5 = _n3.a;
								var _n6 = _n3.b;
								return _List_Nil;
							}
						}
					}(),
					_List_fromArray(
						[
							cmd,
							A2(
							elm$core$Task$attempt,
							author$project$Main$GetNowTime,
							A3(elm$core$Task$map2, elm$core$Tuple$pair, elm$time$Time$now, elm$time$Time$here))
						]))));
	});
var author$project$Main$ReceiveProductImages = function (a) {
	return {$: 8, a: a};
};
var author$project$Main$ReceiveUserImage = function (a) {
	return {$: 9, a: a};
};
var author$project$Main$ToNarrowScreenMode = {$: 1};
var author$project$Main$ToWideScreenMode = {$: 0};
var author$project$Main$receiveProductImages = _Platform_incomingPort(
	'receiveProductImages',
	elm$json$Json$Decode$list(elm$json$Json$Decode$string));
var author$project$Main$receiveUserImage = _Platform_incomingPort('receiveUserImage', elm$json$Json$Decode$string);
var author$project$Main$toNarrowScreenMode = _Platform_incomingPort(
	'toNarrowScreenMode',
	elm$json$Json$Decode$null(0));
var author$project$Main$toWideScreenMode = _Platform_incomingPort(
	'toWideScreenMode',
	elm$json$Json$Decode$null(0));
var elm$core$Platform$Sub$batch = _Platform_batch;
var author$project$Main$subscription = function (_n0) {
	var wideScreen = _n0.bd;
	return elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				author$project$Main$receiveProductImages(author$project$Main$ReceiveProductImages),
				author$project$Main$receiveUserImage(author$project$Main$ReceiveUserImage),
				wideScreen ? author$project$Main$toNarrowScreenMode(
				elm$core$Basics$always(author$project$Main$ToNarrowScreenMode)) : author$project$Main$toWideScreenMode(
				elm$core$Basics$always(author$project$Main$ToWideScreenMode))
			]));
};
var author$project$Api$profileAndLikedProductsIdDecoder = A3(
	NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'likedProductAll',
	elm$json$Json$Decode$list(
		A2(elm$json$Json$Decode$field, 'id', elm$json$Json$Decode$string)),
	A3(
		NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'imageId',
		author$project$Api$imageIdDecoder,
		A3(
			NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'displayName',
			elm$json$Json$Decode$string,
			A3(
				NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'id',
				elm$json$Json$Decode$string,
				elm$json$Json$Decode$succeed(
					F4(
						function (id, displayName, imageId, likedProductIds) {
							return _Utils_Tuple2(
								author$project$Data$User$withNameFromApi(
									{Y: displayName, aa: id, bR: imageId}),
								A2(elm$core$List$map, author$project$Data$Product$idFromString, likedProductIds));
						}))))));
var author$project$Api$getMyNameAndLikedProductsId = A2(
	author$project$Api$graphQlApiRequestWithToken,
	function (t) {
		return author$project$Api$Query(
			_List_fromArray(
				[
					{
					b: _List_fromArray(
						[
							_Utils_Tuple2(
							'accessToken',
							author$project$Api$GraphQLString(
								author$project$Api$tokenGetAccessTokenAsString(t)))
						]),
					a: 'userPrivate',
					c: _List_fromArray(
						[
							{b: _List_Nil, a: 'id', c: _List_Nil},
							{b: _List_Nil, a: 'displayName', c: _List_Nil},
							{b: _List_Nil, a: 'imageId', c: _List_Nil},
							{
							b: _List_Nil,
							a: 'likedProductAll',
							c: _List_fromArray(
								[
									{b: _List_Nil, a: 'id', c: _List_Nil}
								])
						}
						])
				}
				]));
	},
	A2(elm$json$Json$Decode$field, 'userPrivate', author$project$Api$profileAndLikedProductsIdDecoder));
var author$project$Data$LogInState$LoadingProfile = function (a) {
	return {$: 1, a: a};
};
var author$project$Data$LogInState$Ok = function (a) {
	return {$: 2, a: a};
};
var author$project$Data$LogInState$addUserWithNameAndLikedProductIds = F2(
	function (_n0, logInState) {
		var userWithName = _n0.a;
		var likedProductIds = _n0.b;
		switch (logInState.$) {
			case 0:
				return author$project$Data$LogInState$None;
			case 1:
				var token = logInState.a;
				return author$project$Data$LogInState$Ok(
					{S: likedProductIds, dz: token, dF: userWithName});
			default:
				var rec = logInState.a;
				return author$project$Data$LogInState$Ok(
					_Utils_update(
						rec,
						{S: likedProductIds, dF: userWithName}));
		}
	});
var elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var author$project$Data$LogInState$likeProduct = F2(
	function (id, logInState) {
		if (logInState.$ === 2) {
			var rec = logInState.a;
			return author$project$Data$LogInState$Ok(
				_Utils_update(
					rec,
					{
						S: A2(elm$core$List$member, id, rec.S) ? rec.S : A2(elm$core$List$cons, id, rec.S)
					}));
		} else {
			return logInState;
		}
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
var author$project$Data$LogInState$unlikeProduct = F2(
	function (id, logInState) {
		if (logInState.$ === 2) {
			var rec = logInState.a;
			return author$project$Data$LogInState$Ok(
				_Utils_update(
					rec,
					{
						S: A2(
							elm$core$List$filterMap,
							function (i) {
								return _Utils_eq(i, id) ? elm$core$Maybe$Nothing : elm$core$Maybe$Just(i);
							},
							rec.S)
					}));
		} else {
			return logInState;
		}
	});
var author$project$Data$LogInState$updateWithName = F2(
	function (userWithName, logInState) {
		if (logInState.$ === 2) {
			var rec = logInState.a;
			return author$project$Data$LogInState$Ok(
				_Utils_update(
					rec,
					{dF: userWithName}));
		} else {
			return logInState;
		}
	});
var author$project$Data$User$withProfileToWithName = function (_n0) {
	var rec = _n0;
	return {Y: rec.Y, aa: rec.aa, bR: rec.bR};
};
var author$project$Main$GetMyProfileAndLikedProductIdsResponse = function (a) {
	return {$: 10, a: a};
};
var author$project$Data$Product$detailGetId = function (_n0) {
	var id = _n0.aa;
	return id;
};
var author$project$Data$Product$getId = function (_n0) {
	var id = _n0.aa;
	return id;
};
var author$project$Page$Product$getProductId = function (model) {
	switch (model.$) {
		case 0:
			var productId = model.a;
			return productId;
		case 1:
			var product = model.a;
			return author$project$Data$Product$getId(product);
		case 2:
			var product = model.a.de;
			return author$project$Data$Product$detailGetId(product);
		case 3:
			var beforeProduct = model.a.aQ;
			return author$project$Data$Product$detailGetId(beforeProduct);
		default:
			var product = model.a.de;
			return author$project$Data$Product$detailGetId(product);
	}
};
var author$project$Main$getProductId = function (page) {
	if (page.$ === 11) {
		var productModel = page.a;
		return elm$core$Maybe$Just(
			author$project$Page$Product$getProductId(productModel));
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var author$project$Main$saveRefreshTokenToLocalStorage = _Platform_outgoingPort('saveRefreshTokenToLocalStorage', elm$json$Json$Encode$string);
var author$project$Page$BoughtProducts$MsgByProductList = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$BoughtProducts$EmissionAddLogMessage = function (a) {
	return {$: 3, a: a};
};
var author$project$Page$BoughtProducts$EmissionByLogIn = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$BoughtProducts$Error = {$: 2};
var author$project$Page$BoughtProducts$Normal = function (a) {
	return {$: 1, a: a};
};
var author$project$Data$Product$updateById = F3(
	function (id, f, list) {
		if (list.b) {
			var x = list.a;
			var xs = list.b;
			return _Utils_eq(
				author$project$Data$Product$getId(x),
				id) ? A2(
				elm$core$List$cons,
				f(x),
				A3(author$project$Data$Product$updateById, id, f, xs)) : A2(
				elm$core$List$cons,
				x,
				A3(author$project$Data$Product$updateById, id, f, xs));
		} else {
			return _List_Nil;
		}
	});
var author$project$Data$Product$updateLikedCount = F2(
	function (likedCount, _n0) {
		var rec = _n0;
		return _Utils_update(
			rec,
			{c1: likedCount});
	});
var author$project$Page$BoughtProducts$updateLikedCount = F3(
	function (likedCount, id, normalModel) {
		switch (normalModel.$) {
			case 0:
				return author$project$Page$BoughtProducts$Loading;
			case 1:
				var products = normalModel.a;
				return author$project$Page$BoughtProducts$Normal(
					A3(
						author$project$Data$Product$updateById,
						id,
						author$project$Data$Product$updateLikedCount(likedCount),
						products));
			default:
				return author$project$Page$BoughtProducts$Error;
		}
	});
var author$project$Page$Component$LogIn$EmissionLogInOrSignUp = elm$core$Basics$identity;
var author$project$Page$Component$LogIn$update = F2(
	function (msg, _n0) {
		var service = msg;
		return _Utils_Tuple2(
			elm$core$Maybe$Just(service),
			_List_fromArray(
				[service]));
	});
var author$project$Page$Component$ProductList$EmissionLike = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var author$project$Page$Component$ProductList$EmissionUnlike = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var elm$core$Set$insert = F2(
	function (key, _n0) {
		var dict = _n0;
		return A3(elm$core$Dict$insert, key, 0, dict);
	});
var elm$core$Set$remove = F2(
	function (key, _n0) {
		var dict = _n0;
		return A2(elm$core$Dict$remove, key, dict);
	});
var author$project$Page$Component$ProductList$update = F2(
	function (msg, _n0) {
		var rec = _n0;
		switch (msg.$) {
			case 0:
				var token = msg.a;
				var productId = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{
							R: A2(
								elm$core$Set$insert,
								author$project$Data$Product$idToString(productId),
								rec.R)
						}),
					_List_fromArray(
						[
							A2(author$project$Page$Component$ProductList$EmissionLike, token, productId)
						]));
			case 1:
				var token = msg.a;
				var productId = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{
							R: A2(
								elm$core$Set$insert,
								author$project$Data$Product$idToString(productId),
								rec.R)
						}),
					_List_fromArray(
						[
							A2(author$project$Page$Component$ProductList$EmissionUnlike, token, productId)
						]));
			default:
				var productId = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{
							R: A2(
								elm$core$Set$remove,
								author$project$Data$Product$idToString(productId),
								rec.R)
						}),
					_List_Nil);
		}
	});
var author$project$Page$BoughtProducts$update = F2(
	function (msg, _n0) {
		var rec = _n0;
		switch (msg.$) {
			case 0:
				var result = msg.a;
				if (!result.$) {
					var products = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							rec,
							{
								ae: author$project$Page$BoughtProducts$Normal(products)
							}),
						_List_Nil);
				} else {
					var errorMessage = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							rec,
							{ae: author$project$Page$BoughtProducts$Error}),
						_List_fromArray(
							[
								author$project$Page$BoughtProducts$EmissionAddLogMessage('商品の取得に失敗 ' + errorMessage)
							]));
				}
			case 1:
				var logInOrSignUpMsg = msg.a;
				var _n3 = A2(author$project$Page$Component$LogIn$update, logInOrSignUpMsg, rec.bq);
				var newModel = _n3.a;
				var emissionList = _n3.b;
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{bq: newModel}),
					A2(elm$core$List$map, author$project$Page$BoughtProducts$EmissionByLogIn, emissionList));
			default:
				var productListMsg = msg.a;
				var _n4 = A2(author$project$Page$Component$ProductList$update, productListMsg, rec.a0);
				var newModel = _n4.a;
				var emissions = _n4.b;
				return _Utils_Tuple2(
					function () {
						if ((productListMsg.$ === 2) && (!productListMsg.b.$)) {
							var id = productListMsg.a;
							var likedCount = productListMsg.b.a;
							return _Utils_update(
								rec,
								{
									ae: A3(author$project$Page$BoughtProducts$updateLikedCount, likedCount, id, rec.ae),
									a0: newModel
								});
						} else {
							return _Utils_update(
								rec,
								{a0: newModel});
						}
					}(),
					A2(elm$core$List$map, author$project$Page$BoughtProducts$EmissionByProductList, emissions));
		}
	});
var author$project$Page$Component$ProductList$UpdateLikedCountResponse = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var author$project$Page$History$MsgByProductList = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$History$EmissionAddLogMessage = function (a) {
	return {$: 3, a: a};
};
var author$project$Page$History$EmissionByLogIn = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$History$Error = {$: 2};
var author$project$Page$History$Normal = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$History$updateLikedCount = F3(
	function (likedCount, id, normalModel) {
		switch (normalModel.$) {
			case 0:
				return author$project$Page$History$Loading;
			case 1:
				var products = normalModel.a;
				return author$project$Page$History$Normal(
					A3(
						author$project$Data$Product$updateById,
						id,
						author$project$Data$Product$updateLikedCount(likedCount),
						products));
			default:
				return author$project$Page$History$Error;
		}
	});
var author$project$Page$History$update = F2(
	function (msg, _n0) {
		var rec = _n0;
		switch (msg.$) {
			case 0:
				var result = msg.a;
				if (!result.$) {
					var products = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							rec,
							{
								ae: author$project$Page$History$Normal(products)
							}),
						_List_Nil);
				} else {
					var errorMessage = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							rec,
							{ae: author$project$Page$History$Error}),
						_List_fromArray(
							[
								author$project$Page$History$EmissionAddLogMessage('閲覧履歴の取得に失敗 ' + errorMessage)
							]));
				}
			case 1:
				var logInOrSignUpMsg = msg.a;
				var _n3 = A2(author$project$Page$Component$LogIn$update, logInOrSignUpMsg, rec.bq);
				var newModel = _n3.a;
				var emissionList = _n3.b;
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{bq: newModel}),
					A2(elm$core$List$map, author$project$Page$History$EmissionByLogIn, emissionList));
			default:
				var productListMsg = msg.a;
				var _n4 = A2(author$project$Page$Component$ProductList$update, productListMsg, rec.a0);
				var newModel = _n4.a;
				var emissionList = _n4.b;
				return _Utils_Tuple2(
					function () {
						if ((productListMsg.$ === 2) && (!productListMsg.b.$)) {
							var id = productListMsg.a;
							var likedCount = productListMsg.b.a;
							return _Utils_update(
								rec,
								{
									ae: A3(author$project$Page$History$updateLikedCount, likedCount, id, rec.ae),
									a0: newModel
								});
						} else {
							return _Utils_update(
								rec,
								{a0: newModel});
						}
					}(),
					A2(elm$core$List$map, author$project$Page$History$EmissionByProductList, emissionList));
		}
	});
var author$project$Page$Home$MsgByProductList = function (a) {
	return {$: 4, a: a};
};
var author$project$Page$Home$EmissionAddLogMessage = function (a) {
	return {$: 4, a: a};
};
var author$project$Page$Home$EmissionGetFreeProducts = {$: 2};
var author$project$Page$Home$EmissionGetRecentProducts = {$: 0};
var author$project$Page$Home$update = F2(
	function (msg, _n0) {
		var rec = _n0;
		switch (msg.$) {
			case 0:
				var tabSelect = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{a5: tabSelect}),
					function () {
						switch (tabSelect) {
							case 0:
								return _List_fromArray(
									[author$project$Page$Home$EmissionGetRecentProducts]);
							case 1:
								return _List_fromArray(
									[author$project$Page$Home$EmissionGetRecommendProducts]);
							default:
								return _List_fromArray(
									[author$project$Page$Home$EmissionGetFreeProducts]);
						}
					}());
			case 1:
				var result = msg.a;
				if (!result.$) {
					var goodList = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							rec,
							{
								aD: elm$core$Maybe$Just(goodList)
							}),
						_List_Nil);
				} else {
					var errorMessage = result.a;
					return _Utils_Tuple2(
						rec,
						_List_fromArray(
							[
								author$project$Page$Home$EmissionAddLogMessage(errorMessage)
							]));
				}
			case 2:
				var result = msg.a;
				if (!result.$) {
					var goodList = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							rec,
							{
								aE: elm$core$Maybe$Just(goodList)
							}),
						_List_Nil);
				} else {
					var errorMessage = result.a;
					return _Utils_Tuple2(
						rec,
						_List_fromArray(
							[
								author$project$Page$Home$EmissionAddLogMessage(errorMessage)
							]));
				}
			case 3:
				var result = msg.a;
				if (!result.$) {
					var goodList = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							rec,
							{
								aw: elm$core$Maybe$Just(goodList)
							}),
						_List_Nil);
				} else {
					var errorMessage = result.a;
					return _Utils_Tuple2(
						rec,
						_List_fromArray(
							[
								author$project$Page$Home$EmissionAddLogMessage(errorMessage)
							]));
				}
			default:
				var productListMsg = msg.a;
				var _n6 = A2(author$project$Page$Component$ProductList$update, productListMsg, rec.a1);
				var newModel = _n6.a;
				var emissionList = _n6.b;
				return _Utils_Tuple2(
					function () {
						if ((productListMsg.$ === 2) && (!productListMsg.b.$)) {
							var id = productListMsg.a;
							var likedCount = productListMsg.b.a;
							var likeFunc = elm$core$Maybe$map(
								A2(
									author$project$Data$Product$updateById,
									id,
									author$project$Data$Product$updateLikedCount(likedCount)));
							return _Utils_update(
								rec,
								{
									aw: likeFunc(rec.aw),
									a1: newModel,
									aD: likeFunc(rec.aD),
									aE: likeFunc(rec.aE)
								});
						} else {
							return _Utils_update(
								rec,
								{a1: newModel});
						}
					}(),
					A2(elm$core$List$map, author$project$Page$Home$EmissionProducts, emissionList));
		}
	});
var author$project$Page$LikedProducts$MsgByProductList = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$LikedProducts$EmissionAddLogMessage = function (a) {
	return {$: 3, a: a};
};
var author$project$Page$LikedProducts$EmissionByLogIn = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$LikedProducts$Error = {$: 2};
var author$project$Page$LikedProducts$Normal = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$LikedProducts$updateLikedCount = F3(
	function (likedCount, id, normalModel) {
		switch (normalModel.$) {
			case 0:
				return author$project$Page$LikedProducts$Loading;
			case 1:
				var products = normalModel.a;
				return author$project$Page$LikedProducts$Normal(
					A3(
						author$project$Data$Product$updateById,
						id,
						author$project$Data$Product$updateLikedCount(likedCount),
						products));
			default:
				return author$project$Page$LikedProducts$Error;
		}
	});
var author$project$Page$LikedProducts$update = F2(
	function (msg, _n0) {
		var rec = _n0;
		switch (msg.$) {
			case 0:
				var result = msg.a;
				if (!result.$) {
					var products = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							rec,
							{
								ae: author$project$Page$LikedProducts$Normal(products)
							}),
						_List_Nil);
				} else {
					var errorMessage = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							rec,
							{ae: author$project$Page$LikedProducts$Error}),
						_List_fromArray(
							[
								author$project$Page$LikedProducts$EmissionAddLogMessage('いいねした商品の取得に失敗 ' + errorMessage)
							]));
				}
			case 1:
				var logInOrSignUpMsg = msg.a;
				var _n3 = A2(author$project$Page$Component$LogIn$update, logInOrSignUpMsg, rec.bq);
				var newModel = _n3.a;
				var emissionList = _n3.b;
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{bq: newModel}),
					A2(elm$core$List$map, author$project$Page$LikedProducts$EmissionByLogIn, emissionList));
			default:
				var productListMsg = msg.a;
				var _n4 = A2(author$project$Page$Component$ProductList$update, productListMsg, rec.a0);
				var newModel = _n4.a;
				var emissionList = _n4.b;
				return _Utils_Tuple2(
					function () {
						if ((productListMsg.$ === 2) && (!productListMsg.b.$)) {
							var id = productListMsg.a;
							var likedCount = productListMsg.b.a;
							return _Utils_update(
								rec,
								{
									ae: A3(author$project$Page$LikedProducts$updateLikedCount, likedCount, id, rec.ae),
									a0: newModel
								});
						} else {
							return _Utils_update(
								rec,
								{a0: newModel});
						}
					}(),
					A2(elm$core$List$map, author$project$Page$LikedProducts$EmissionByProductList, emissionList));
		}
	});
var author$project$Page$Product$LikeResponse = function (a) {
	return {$: 4, a: a};
};
var author$project$Data$Product$detailUpdateLikedCount = F2(
	function (likedCount, _n0) {
		var rec = _n0;
		return _Utils_update(
			rec,
			{c1: likedCount});
	});
var author$project$Data$Product$setCommentList = F2(
	function (commentList, _n0) {
		var rec = _n0;
		return _Utils_update(
			rec,
			{
				bK: elm$core$Maybe$Just(commentList)
			});
	});
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
					{t: nodeList, q: nodeListSize, s: jsArray});
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
var elm$core$Bitwise$and = _Bitwise_and;
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
var author$project$Utility$getAt = F2(
	function (index, list) {
		return A2(
			elm$core$Array$get,
			index,
			elm$core$Array$fromList(list));
	});
var author$project$Data$Product$conditionFromIndex = function (index) {
	return A2(author$project$Utility$getAt, index, author$project$Data$Product$conditionAll);
};
var elm$core$Dict$member = F2(
	function (key, dict) {
		var _n0 = A2(elm$core$Dict$get, key, dict);
		if (!_n0.$) {
			return true;
		} else {
			return false;
		}
	});
var elm$core$Set$member = F2(
	function (key, _n0) {
		var dict = _n0;
		return A2(elm$core$Dict$member, key, dict);
	});
var author$project$Page$Component$ProductEditor$beforeImageAddDeleteIndex = F4(
	function (index, beforeImageIdLength, deleteAt, offset) {
		beforeImageAddDeleteIndex:
		while (true) {
			if (_Utils_cmp(offset, beforeImageIdLength) < 1) {
				if (A2(elm$core$Set$member, offset, deleteAt)) {
					var $temp$index = index,
						$temp$beforeImageIdLength = beforeImageIdLength,
						$temp$deleteAt = deleteAt,
						$temp$offset = offset + 1;
					index = $temp$index;
					beforeImageIdLength = $temp$beforeImageIdLength;
					deleteAt = $temp$deleteAt;
					offset = $temp$offset;
					continue beforeImageAddDeleteIndex;
				} else {
					if (!index) {
						return elm$core$Maybe$Just(
							A2(elm$core$Set$insert, offset, deleteAt));
					} else {
						var $temp$index = index - 1,
							$temp$beforeImageIdLength = beforeImageIdLength,
							$temp$deleteAt = deleteAt,
							$temp$offset = offset + 1;
						index = $temp$index;
						beforeImageIdLength = $temp$beforeImageIdLength;
						deleteAt = $temp$deleteAt;
						offset = $temp$offset;
						continue beforeImageAddDeleteIndex;
					}
				}
			} else {
				return elm$core$Maybe$Nothing;
			}
		}
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
var author$project$Utility$removeAt = F2(
	function (index, list) {
		return _Utils_ap(
			A2(elm$core$List$take, index, list),
			A2(elm$core$List$drop, index + 1, list));
	});
var elm$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			if (dict.$ === -2) {
				return n;
			} else {
				var left = dict.d;
				var right = dict.e;
				var $temp$n = A2(elm$core$Dict$sizeHelp, n + 1, right),
					$temp$dict = left;
				n = $temp$n;
				dict = $temp$dict;
				continue sizeHelp;
			}
		}
	});
var elm$core$Dict$size = function (dict) {
	return A2(elm$core$Dict$sizeHelp, 0, dict);
};
var elm$core$Set$size = function (_n0) {
	var dict = _n0;
	return elm$core$Dict$size(dict);
};
var author$project$Page$Component$ProductEditor$imageDeleteAt = F2(
	function (index, _n0) {
		var beforeImageIdLength = _n0.cr;
		var addImages = _n0.o;
		var deleteIndex = _n0.aT;
		var _n1 = A4(author$project$Page$Component$ProductEditor$beforeImageAddDeleteIndex, index, beforeImageIdLength, deleteIndex, 0);
		if (!_n1.$) {
			var newDeleteIndex = _n1.a;
			return {o: addImages, aT: newDeleteIndex};
		} else {
			return {
				o: A2(
					author$project$Utility$removeAt,
					index - (beforeImageIdLength - elm$core$Set$size(deleteIndex)),
					addImages),
				aT: deleteIndex
			};
		}
	});
var author$project$Data$Category$groupToCategoryList = function (category) {
	switch (category) {
		case 0:
			return _List_fromArray(
				[0, 1, 2, 3, 4, 5, 6, 7]);
		case 1:
			return _List_fromArray(
				[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
		case 2:
			return _List_fromArray(
				[21, 22, 23]);
		case 3:
			return _List_fromArray(
				[24, 25, 26, 27]);
		case 4:
			return _List_fromArray(
				[28, 29, 30, 31]);
		case 5:
			return _List_fromArray(
				[32, 33, 34]);
		default:
			return _List_fromArray(
				[35, 36, 37, 38, 39, 40, 41, 42, 43, 44]);
	}
};
var author$project$Data$Category$fromIndexInGroup = F2(
	function (group, index) {
		return A2(
			author$project$Utility$getAt,
			index,
			author$project$Data$Category$groupToCategoryList(group));
	});
var author$project$Data$Category$Appliance = 1;
var author$project$Data$Category$Book = 3;
var author$project$Data$Category$Fashion = 2;
var author$project$Data$Category$Food = 5;
var author$project$Data$Category$Furniture = 0;
var author$project$Data$Category$Hobby = 6;
var author$project$Data$Category$Vehicle = 4;
var author$project$Data$Category$groupFromCategory = function (subCategory) {
	switch (subCategory) {
		case 0:
			return 0;
		case 1:
			return 0;
		case 2:
			return 0;
		case 3:
			return 0;
		case 4:
			return 0;
		case 5:
			return 0;
		case 6:
			return 0;
		case 7:
			return 0;
		case 8:
			return 1;
		case 9:
			return 1;
		case 10:
			return 1;
		case 11:
			return 1;
		case 12:
			return 1;
		case 13:
			return 1;
		case 14:
			return 1;
		case 15:
			return 1;
		case 16:
			return 1;
		case 17:
			return 1;
		case 18:
			return 1;
		case 19:
			return 1;
		case 20:
			return 1;
		case 21:
			return 2;
		case 22:
			return 2;
		case 23:
			return 2;
		case 24:
			return 3;
		case 25:
			return 3;
		case 26:
			return 3;
		case 27:
			return 3;
		case 28:
			return 4;
		case 29:
			return 4;
		case 30:
			return 4;
		case 31:
			return 4;
		case 32:
			return 5;
		case 33:
			return 5;
		case 34:
			return 5;
		case 35:
			return 6;
		case 36:
			return 6;
		case 37:
			return 6;
		case 38:
			return 6;
		case 39:
			return 6;
		case 40:
			return 6;
		case 41:
			return 6;
		case 42:
			return 6;
		case 43:
			return 6;
		default:
			return 6;
	}
};
var author$project$Page$Component$ProductEditor$CategoryGroupSelect = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$Component$ProductEditor$CategorySelect = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$Component$ProductEditor$selectCategory = F2(
	function (index, categorySelect) {
		switch (categorySelect.$) {
			case 0:
				return author$project$Page$Component$ProductEditor$CategoryNone;
			case 1:
				var group = categorySelect.a;
				var _n1 = A2(
					elm$core$Maybe$andThen,
					author$project$Data$Category$fromIndexInGroup(group),
					index);
				if (!_n1.$) {
					var category = _n1.a;
					return author$project$Page$Component$ProductEditor$CategorySelect(category);
				} else {
					return author$project$Page$Component$ProductEditor$CategoryGroupSelect(group);
				}
			default:
				var category = categorySelect.a;
				var _n2 = A2(
					elm$core$Maybe$andThen,
					author$project$Data$Category$fromIndexInGroup(
						author$project$Data$Category$groupFromCategory(category)),
					index);
				if (!_n2.$) {
					var newCategory = _n2.a;
					return author$project$Page$Component$ProductEditor$CategorySelect(newCategory);
				} else {
					return author$project$Page$Component$ProductEditor$CategoryGroupSelect(
						author$project$Data$Category$groupFromCategory(category));
				}
		}
	});
var author$project$Data$Category$groupAll = _List_fromArray(
	[0, 1, 2, 3, 4, 5, 6]);
var author$project$Data$Category$groupFromIndex = function (index) {
	return A2(author$project$Utility$getAt, index, author$project$Data$Category$groupAll);
};
var author$project$Page$Component$ProductEditor$selectCategoryGroup = F2(
	function (index, categorySelect) {
		var _n0 = A2(elm$core$Maybe$andThen, author$project$Data$Category$groupFromIndex, index);
		if (!_n0.$) {
			var group = _n0.a;
			switch (categorySelect.$) {
				case 0:
					return author$project$Page$Component$ProductEditor$CategoryGroupSelect(group);
				case 1:
					return author$project$Page$Component$ProductEditor$CategoryGroupSelect(group);
				default:
					var category = categorySelect.a;
					return _Utils_eq(
						author$project$Data$Category$groupFromCategory(category),
						group) ? categorySelect : author$project$Page$Component$ProductEditor$CategoryGroupSelect(group);
			}
		} else {
			return author$project$Page$Component$ProductEditor$CategoryNone;
		}
	});
var author$project$Page$Component$ProductEditor$update = F2(
	function (msg, _n0) {
		var rec = _n0;
		return _Utils_Tuple2(
			function () {
				switch (msg.$) {
					case 0:
						var nameString = msg.a;
						return _Utils_update(
							rec,
							{a: nameString});
					case 1:
						var descriptionString = msg.a;
						return _Utils_update(
							rec,
							{cH: descriptionString});
					case 2:
						var priceString = msg.a;
						return _Utils_update(
							rec,
							{
								b4: A2(
									elm$core$Maybe$andThen,
									function (price) {
										return ((0 <= price) && (price <= 1000000)) ? elm$core$Maybe$Just(price) : elm$core$Maybe$Nothing;
									},
									elm$core$String$toInt(priceString))
							});
					case 3:
						var index = msg.a;
						return _Utils_update(
							rec,
							{
								cD: A2(elm$core$Maybe$andThen, author$project$Data$Product$conditionFromIndex, index)
							});
					case 4:
						var index = msg.a;
						return _Utils_update(
							rec,
							{
								bJ: A2(author$project$Page$Component$ProductEditor$selectCategoryGroup, index, rec.bJ)
							});
					case 5:
						var index = msg.a;
						return _Utils_update(
							rec,
							{
								bJ: A2(author$project$Page$Component$ProductEditor$selectCategory, index, rec.bJ)
							});
					case 6:
						var index = msg.a;
						var _n2 = A2(
							author$project$Page$Component$ProductEditor$imageDeleteAt,
							index,
							{
								o: rec.o,
								cr: elm$core$List$length(rec.K),
								aT: rec.M
							});
						var addImages = _n2.o;
						var deleteIndex = _n2.aT;
						return _Utils_update(
							rec,
							{o: addImages, M: deleteIndex});
					default:
						var dataUrlList = msg.a;
						return _Utils_update(
							rec,
							{
								o: _Utils_ap(rec.o, dataUrlList)
							});
				}
			}(),
			_List_Nil);
	});
var author$project$Page$Product$Confirm = function (a) {
	return {$: 4, a: a};
};
var author$project$Page$Product$Edit = function (a) {
	return {$: 3, a: a};
};
var author$project$Page$Product$EmissionAddComment = F3(
	function (a, b, c) {
		return {$: 3, a: a, b: b, c: c};
	});
var author$project$Page$Product$EmissionAddLogMessage = function (a) {
	return {$: 7, a: a};
};
var author$project$Page$Product$EmissionByProductEditor = function (a) {
	return {$: 11, a: a};
};
var author$project$Page$Product$EmissionDelete = F2(
	function (a, b) {
		return {$: 9, a: a, b: b};
	});
var author$project$Page$Product$EmissionGetCommentList = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$Product$EmissionJumpToTradePage = function (a) {
	return {$: 10, a: a};
};
var author$project$Page$Product$EmissionLike = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var author$project$Page$Product$EmissionReplaceElementText = function (a) {
	return {$: 13, a: a};
};
var author$project$Page$Product$EmissionTradeStart = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var author$project$Page$Product$EmissionUnLike = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var author$project$Page$Product$EmissionUpdateNowTime = {$: 8};
var author$project$Page$Product$EmissionUpdateProductData = F3(
	function (a, b, c) {
		return {$: 12, a: a, b: b, c: c};
	});
var author$project$Page$Product$MsgBackToViewMode = {$: 13};
var author$project$Page$Product$Normal = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$Product$commentTextAreaId = 'comment-text-area';
var elm$core$Tuple$mapBoth = F3(
	function (funcA, funcB, _n0) {
		var x = _n0.a;
		var y = _n0.b;
		return _Utils_Tuple2(
			funcA(x),
			funcB(y));
	});
var author$project$Page$Product$update = F2(
	function (msg, model) {
		update:
		while (true) {
			switch (msg.$) {
				case 0:
					var productsResult = msg.a;
					var _n1 = _Utils_Tuple2(model, productsResult);
					if (!_n1.b.$) {
						switch (_n1.a.$) {
							case 0:
								var product = _n1.b.a;
								return _Utils_Tuple2(
									author$project$Page$Product$Normal(
										{aq: '', L: false, D: false, de: product}),
									_List_fromArray(
										[
											author$project$Page$Product$EmissionGetCommentList(
											{
												bw: author$project$Data$Product$detailGetId(product)
											}),
											author$project$Page$Product$EmissionUpdateNowTime
										]));
							case 1:
								var product = _n1.b.a;
								return _Utils_Tuple2(
									author$project$Page$Product$Normal(
										{aq: '', L: false, D: false, de: product}),
									_List_fromArray(
										[
											author$project$Page$Product$EmissionGetCommentList(
											{
												bw: author$project$Data$Product$detailGetId(product)
											}),
											author$project$Page$Product$EmissionUpdateNowTime
										]));
							case 2:
								var rec = _n1.a.a;
								var product = _n1.b.a;
								return _Utils_Tuple2(
									author$project$Page$Product$Normal(
										_Utils_update(
											rec,
											{de: product})),
									_List_fromArray(
										[
											author$project$Page$Product$EmissionGetCommentList(
											{
												bw: author$project$Data$Product$detailGetId(product)
											}),
											author$project$Page$Product$EmissionUpdateNowTime
										]));
							default:
								return _Utils_Tuple2(
									model,
									_List_fromArray(
										[
											author$project$Page$Product$EmissionAddLogMessage('画面がNormalでないときに商品情報を受け取ってしまった')
										]));
						}
					} else {
						var text = _n1.b.a;
						return _Utils_Tuple2(
							model,
							_List_fromArray(
								[
									author$project$Page$Product$EmissionAddLogMessage('商品情報の取得に失敗しました ' + text)
								]));
					}
				case 1:
					var commentListResult = msg.a;
					var _n2 = _Utils_Tuple2(model, commentListResult);
					if (!_n2.b.$) {
						if (_n2.a.$ === 2) {
							var rec = _n2.a.a;
							var commentList = _n2.b.a;
							return _Utils_Tuple2(
								author$project$Page$Product$Normal(
									_Utils_update(
										rec,
										{
											aq: '',
											L: false,
											de: A2(author$project$Data$Product$setCommentList, commentList, rec.de)
										})),
								_List_fromArray(
									[
										author$project$Page$Product$EmissionReplaceElementText(
										{aa: author$project$Page$Product$commentTextAreaId, cf: ''}),
										author$project$Page$Product$EmissionUpdateNowTime
									]));
						} else {
							return _Utils_Tuple2(
								model,
								_List_fromArray(
									[
										author$project$Page$Product$EmissionAddLogMessage('画面がNormalでないときにコメントを受け取ってしまった')
									]));
						}
					} else {
						var text = _n2.b.a;
						return _Utils_Tuple2(
							model,
							_List_fromArray(
								[
									author$project$Page$Product$EmissionAddLogMessage('コメント取得に失敗しました ' + text)
								]));
					}
				case 2:
					var token = msg.a;
					var id = msg.b;
					return _Utils_Tuple2(
						function () {
							if (model.$ === 2) {
								var rec = model.a;
								return author$project$Page$Product$Normal(
									_Utils_update(
										rec,
										{D: true}));
							} else {
								return model;
							}
						}(),
						_List_fromArray(
							[
								A2(author$project$Page$Product$EmissionLike, token, id)
							]));
				case 3:
					var token = msg.a;
					var id = msg.b;
					return _Utils_Tuple2(
						function () {
							if (model.$ === 2) {
								var rec = model.a;
								return author$project$Page$Product$Normal(
									_Utils_update(
										rec,
										{D: true}));
							} else {
								return model;
							}
						}(),
						_List_fromArray(
							[
								A2(author$project$Page$Product$EmissionUnLike, token, id)
							]));
				case 4:
					var result = msg.a;
					var _n5 = _Utils_Tuple2(result, model);
					if (!_n5.a.$) {
						if (_n5.b.$ === 2) {
							var likedCount = _n5.a.a;
							var rec = _n5.b.a;
							return _Utils_Tuple2(
								author$project$Page$Product$Normal(
									_Utils_update(
										rec,
										{
											D: false,
											de: A2(author$project$Data$Product$detailUpdateLikedCount, likedCount, rec.de)
										})),
								_List_Nil);
						} else {
							return _Utils_Tuple2(
								model,
								_List_fromArray(
									[
										author$project$Page$Product$EmissionAddLogMessage('画面がNormalでないときにいいねの結果を受け取ってしまった')
									]));
						}
					} else {
						var text = _n5.a.a;
						return _Utils_Tuple2(
							model,
							_List_fromArray(
								[
									author$project$Page$Product$EmissionAddLogMessage('いいねをするのに失敗 ' + text)
								]));
					}
				case 5:
					var result = msg.a;
					var _n6 = _Utils_Tuple2(result, model);
					if (!_n6.a.$) {
						if (_n6.b.$ === 2) {
							var likedCount = _n6.a.a;
							var rec = _n6.b.a;
							return _Utils_Tuple2(
								author$project$Page$Product$Normal(
									_Utils_update(
										rec,
										{
											D: false,
											de: A2(author$project$Data$Product$detailUpdateLikedCount, likedCount, rec.de)
										})),
								_List_Nil);
						} else {
							return _Utils_Tuple2(
								model,
								_List_fromArray(
									[
										author$project$Page$Product$EmissionAddLogMessage('画面がNormalでないときにいいねを外すの結果を受け取ってしまった')
									]));
						}
					} else {
						var text = _n6.a.a;
						return _Utils_Tuple2(
							model,
							_List_fromArray(
								[
									author$project$Page$Product$EmissionAddLogMessage('いいねを外すのに失敗 ' + text)
								]));
					}
				case 6:
					var token = msg.a;
					var productId = msg.b;
					return _Utils_Tuple2(
						model,
						_List_fromArray(
							[
								A2(author$project$Page$Product$EmissionTradeStart, token, productId)
							]));
				case 7:
					var result = msg.a;
					return _Utils_Tuple2(
						model,
						function () {
							if (!result.$) {
								var trade = result.a;
								return _List_fromArray(
									[
										author$project$Page$Product$EmissionAddLogMessage('取引開始'),
										author$project$Page$Product$EmissionJumpToTradePage(trade)
									]);
							} else {
								var text = result.a;
								return _List_fromArray(
									[
										author$project$Page$Product$EmissionAddLogMessage('取引開始を失敗しました ' + text)
									]);
							}
						}());
				case 8:
					return _Utils_Tuple2(
						function () {
							if (model.$ === 2) {
								var product = model.a.de;
								return author$project$Page$Product$Confirm(
									{de: product});
							} else {
								return model;
							}
						}(),
						_List_Nil);
				case 9:
					var string = msg.a;
					if (model.$ === 2) {
						var rec = model.a;
						return _Utils_Tuple2(
							author$project$Page$Product$Normal(
								_Utils_update(
									rec,
									{aq: string})),
							_List_Nil);
					} else {
						return _Utils_Tuple2(model, _List_Nil);
					}
				case 10:
					var token = msg.a;
					if (model.$ === 2) {
						var rec = model.a;
						return _Utils_Tuple2(
							author$project$Page$Product$Normal(
								_Utils_update(
									rec,
									{L: true})),
							_List_fromArray(
								[
									A3(
									author$project$Page$Product$EmissionAddComment,
									token,
									{
										bw: author$project$Data$Product$detailGetId(rec.de)
									},
									rec.aq)
								]));
					} else {
						return _Utils_Tuple2(model, _List_Nil);
					}
				case 11:
					var token = msg.a;
					var productId = msg.b;
					return _Utils_Tuple2(
						model,
						_List_fromArray(
							[
								A2(author$project$Page$Product$EmissionDelete, token, productId)
							]));
				case 12:
					if (model.$ === 2) {
						var product = model.a.de;
						return _Utils_Tuple2(model, _List_Nil);
					} else {
						return _Utils_Tuple2(model, _List_Nil);
					}
				case 13:
					if (model.$ === 3) {
						var beforeProduct = model.a.aQ;
						return _Utils_Tuple2(
							author$project$Page$Product$Normal(
								{aq: '', L: false, D: false, de: beforeProduct}),
							_List_fromArray(
								[
									author$project$Page$Product$EmissionGetProduct(
									{
										bw: author$project$Data$Product$detailGetId(beforeProduct)
									})
								]));
					} else {
						return _Utils_Tuple2(model, _List_Nil);
					}
				case 14:
					var productEditorMsg = msg.a;
					if (model.$ === 3) {
						var r = model.a;
						return A3(
							elm$core$Tuple$mapBoth,
							function (editorModel) {
								return author$project$Page$Product$Edit(
									_Utils_update(
										r,
										{b5: editorModel}));
							},
							elm$core$List$map(author$project$Page$Product$EmissionByProductEditor),
							A2(author$project$Page$Component$ProductEditor$update, productEditorMsg, r.b5));
					} else {
						return _Utils_Tuple2(model, _List_Nil);
					}
				case 15:
					var token = msg.a;
					var productId = msg.b;
					var requestData = msg.c;
					return _Utils_Tuple2(
						model,
						_List_fromArray(
							[
								A3(author$project$Page$Product$EmissionUpdateProductData, token, productId, requestData)
							]));
				default:
					var result = msg.a;
					if (!result.$) {
						var $temp$msg = author$project$Page$Product$MsgBackToViewMode,
							$temp$model = model;
						msg = $temp$msg;
						model = $temp$model;
						continue update;
					} else {
						var text = result.a;
						return _Utils_Tuple2(
							model,
							_List_fromArray(
								[
									author$project$Page$Product$EmissionAddLogMessage('商品の編集に失敗しました ' + text)
								]));
					}
			}
		}
	});
var author$project$Page$SoldProducts$MsgByProductList = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$SoldProducts$EmissionAddLogMessage = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$SoldProducts$Error = {$: 2};
var author$project$Page$SoldProducts$Normal = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$SoldProducts$updateLikedCount = F3(
	function (likedCount, id, normalModel) {
		switch (normalModel.$) {
			case 0:
				return author$project$Page$SoldProducts$Loading;
			case 1:
				var products = normalModel.a;
				return author$project$Page$SoldProducts$Normal(
					A3(
						author$project$Data$Product$updateById,
						id,
						author$project$Data$Product$updateLikedCount(likedCount),
						products));
			default:
				return author$project$Page$SoldProducts$Error;
		}
	});
var author$project$Page$SoldProducts$update = F2(
	function (msg, _n0) {
		var rec = _n0;
		if (!msg.$) {
			var result = msg.a;
			if (!result.$) {
				var soldProductList = result.a;
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{
							ae: author$project$Page$SoldProducts$Normal(soldProductList)
						}),
					_List_Nil);
			} else {
				var errorMessage = result.a;
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{ae: author$project$Page$SoldProducts$Error}),
					_List_fromArray(
						[
							author$project$Page$SoldProducts$EmissionAddLogMessage(errorMessage)
						]));
			}
		} else {
			var productListMsg = msg.a;
			var _n3 = A2(author$project$Page$Component$ProductList$update, productListMsg, rec.a0);
			var newModel = _n3.a;
			var emissionList = _n3.b;
			return _Utils_Tuple2(
				function () {
					if ((productListMsg.$ === 2) && (!productListMsg.b.$)) {
						var id = productListMsg.a;
						var likedCount = productListMsg.b.a;
						return _Utils_update(
							rec,
							{
								ae: A3(author$project$Page$SoldProducts$updateLikedCount, likedCount, id, rec.ae),
								a0: newModel
							});
					} else {
						return _Utils_update(
							rec,
							{a0: newModel});
					}
				}(),
				A2(elm$core$List$map, author$project$Page$SoldProducts$EmissionByProductList, emissionList));
		}
	});
var author$project$Main$updateLikedCountInEachPageProduct = F4(
	function (key, productId, result, page) {
		var productListMsg = A2(author$project$Page$Component$ProductList$UpdateLikedCountResponse, productId, result);
		switch (page.$) {
			case 0:
				var msg = page.a;
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageHome,
					author$project$Main$homePageEmissionToCmd,
					A2(
						author$project$Page$Home$update,
						author$project$Page$Home$MsgByProductList(productListMsg),
						msg));
			case 3:
				var msg = page.a;
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageLikedProducts,
					author$project$Main$likedProductsEmissionToCmd,
					A2(
						author$project$Page$LikedProducts$update,
						author$project$Page$LikedProducts$MsgByProductList(productListMsg),
						msg));
			case 4:
				var msg = page.a;
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageHistory,
					author$project$Main$historyEmissionToCmd,
					A2(
						author$project$Page$History$update,
						author$project$Page$History$MsgByProductList(productListMsg),
						msg));
			case 5:
				var msg = page.a;
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageSoldProducts,
					author$project$Main$soldProductsPageEmissionToCmd,
					A2(
						author$project$Page$SoldProducts$update,
						author$project$Page$SoldProducts$MsgByProductList(productListMsg),
						msg));
			case 6:
				var msg = page.a;
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageBoughtProducts,
					author$project$Main$boughtProductsPageEmissionToCmd,
					A2(
						author$project$Page$BoughtProducts$update,
						author$project$Page$BoughtProducts$MsgByProductList(productListMsg),
						msg));
			case 11:
				var msg = page.a;
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageProduct,
					author$project$Main$productPageEmissionToCmd(key),
					A2(
						author$project$Page$Product$update,
						author$project$Page$Product$LikeResponse(result),
						msg));
			default:
				return _Utils_Tuple2(page, elm$core$Platform$Cmd$none);
		}
	});
var author$project$Page$CommentedProducts$EmissionAddLogMessage = function (a) {
	return {$: 3, a: a};
};
var author$project$Page$CommentedProducts$EmissionByLogIn = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$CommentedProducts$Error = {$: 2};
var author$project$Page$CommentedProducts$Normal = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$CommentedProducts$updateLikedCount = F3(
	function (likedCount, id, normalModel) {
		switch (normalModel.$) {
			case 0:
				return author$project$Page$CommentedProducts$Loading;
			case 1:
				var products = normalModel.a;
				return author$project$Page$CommentedProducts$Normal(
					A3(
						author$project$Data$Product$updateById,
						id,
						author$project$Data$Product$updateLikedCount(likedCount),
						products));
			default:
				return author$project$Page$CommentedProducts$Error;
		}
	});
var author$project$Page$CommentedProducts$update = F2(
	function (msg, _n0) {
		var rec = _n0;
		switch (msg.$) {
			case 0:
				var result = msg.a;
				if (!result.$) {
					var products = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							rec,
							{
								ae: author$project$Page$CommentedProducts$Normal(products)
							}),
						_List_Nil);
				} else {
					var errorMessage = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							rec,
							{ae: author$project$Page$CommentedProducts$Error}),
						_List_fromArray(
							[
								author$project$Page$CommentedProducts$EmissionAddLogMessage('コメントした商品の取得に失敗 ' + errorMessage)
							]));
				}
			case 1:
				var logInOrSignUpMsg = msg.a;
				var _n3 = A2(author$project$Page$Component$LogIn$update, logInOrSignUpMsg, rec.bq);
				var newModel = _n3.a;
				var emissionList = _n3.b;
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{bq: newModel}),
					A2(elm$core$List$map, author$project$Page$CommentedProducts$EmissionByLogIn, emissionList));
			default:
				var productListMsg = msg.a;
				var _n4 = A2(author$project$Page$Component$ProductList$update, productListMsg, rec.a0);
				var newModel = _n4.a;
				var emissionList = _n4.b;
				return _Utils_Tuple2(
					function () {
						if ((productListMsg.$ === 2) && (!productListMsg.b.$)) {
							var id = productListMsg.a;
							var likedCount = productListMsg.b.a;
							return _Utils_update(
								rec,
								{
									ae: A3(author$project$Page$CommentedProducts$updateLikedCount, likedCount, id, rec.ae),
									a0: newModel
								});
						} else {
							return _Utils_update(
								rec,
								{a0: newModel});
						}
					}(),
					A2(elm$core$List$map, author$project$Page$CommentedProducts$EmissionByProductList, emissionList));
		}
	});
var author$project$Utility$getFirstIndex = F2(
	function (element, list) {
		if (list.b) {
			var x = list.a;
			var xs = list.b;
			return _Utils_eq(element, x) ? elm$core$Maybe$Just(0) : A2(
				elm$core$Maybe$map,
				elm$core$Basics$add(1),
				A2(author$project$Utility$getFirstIndex, element, xs));
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var author$project$Data$Category$groupToIndex = function (group) {
	return A2(
		elm$core$Maybe$withDefault,
		0,
		A2(author$project$Utility$getFirstIndex, group, author$project$Data$Category$groupAll));
};
var author$project$Data$Category$toIndexInGroup = function (subCategory) {
	return A2(
		elm$core$Maybe$withDefault,
		0,
		A2(
			author$project$Utility$getFirstIndex,
			subCategory,
			author$project$Data$Category$groupToCategoryList(
				author$project$Data$Category$groupFromCategory(subCategory))));
};
var author$project$Data$Product$conditionToIndex = function (condition) {
	return A2(
		elm$core$Maybe$withDefault,
		0,
		A2(author$project$Utility$getFirstIndex, condition, author$project$Data$Product$conditionAll));
};
var author$project$Page$Component$ProductEditor$EmissionChangeSelectedIndex = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$Component$ProductEditor$EmissionReplaceText = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$Component$ProductEditor$categoryGroupSelectId = 'select-category-group';
var author$project$Page$Component$ProductEditor$categorySelectId = 'select-category';
var author$project$Page$Component$ProductEditor$conditionSelectId = 'exhibition-selectCondition';
var author$project$Page$Component$ProductEditor$descriptionEditorId = 'exhibition-description';
var author$project$Page$Component$ProductEditor$nameEditorId = 'exhibition-name';
var author$project$Page$Component$ProductEditor$priceEditorId = 'exhibition-price';
var author$project$Page$Component$ProductEditor$initModelFromSellRequestData = function (_n0) {
	var rec = _n0;
	return _Utils_Tuple2(
		{
			o: rec.d2,
			K: _List_Nil,
			bJ: author$project$Page$Component$ProductEditor$CategorySelect(rec.bJ),
			cD: elm$core$Maybe$Just(rec.cD),
			M: elm$core$Set$empty,
			cH: rec.cH,
			a: rec.a,
			b4: elm$core$Maybe$Just(rec.b4)
		},
		_List_fromArray(
			[
				author$project$Page$Component$ProductEditor$EmissionAddEventListenerForProductImages(
				{cY: author$project$Page$Component$ProductEditor$photoAddInputId, c0: author$project$Page$Component$ProductEditor$photoAddLabelId}),
				author$project$Page$Component$ProductEditor$EmissionReplaceText(
				{aa: author$project$Page$Component$ProductEditor$nameEditorId, cf: rec.a}),
				author$project$Page$Component$ProductEditor$EmissionReplaceText(
				{aa: author$project$Page$Component$ProductEditor$descriptionEditorId, cf: rec.cH}),
				author$project$Page$Component$ProductEditor$EmissionReplaceText(
				{
					aa: author$project$Page$Component$ProductEditor$priceEditorId,
					cf: elm$core$String$fromInt(rec.b4)
				}),
				author$project$Page$Component$ProductEditor$EmissionChangeSelectedIndex(
				{
					aa: author$project$Page$Component$ProductEditor$conditionSelectId,
					aW: author$project$Data$Product$conditionToIndex(rec.cD) + 1
				}),
				author$project$Page$Component$ProductEditor$EmissionChangeSelectedIndex(
				{
					aa: author$project$Page$Component$ProductEditor$categoryGroupSelectId,
					aW: author$project$Data$Category$groupToIndex(
						author$project$Data$Category$groupFromCategory(rec.bJ)) + 1
				}),
				author$project$Page$Component$ProductEditor$EmissionChangeSelectedIndex(
				{
					aa: author$project$Page$Component$ProductEditor$categorySelectId,
					aW: author$project$Data$Category$toIndexInGroup(rec.bJ) + 1
				})
			]));
};
var author$project$Page$Exhibition$ConfirmPage = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$Exhibition$EmissionSellProducts = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$Exhibition$updateWhenLogIn = F2(
	function (msg, page) {
		if (!page.$) {
			var productEditorModel = page.a;
			switch (msg.$) {
				case 0:
					var _n2 = msg.a;
					var request = _n2.b;
					return _Utils_Tuple2(
						author$project$Page$Exhibition$ConfirmPage(
							{b7: request, cb: false}),
						_List_Nil);
				case 4:
					var m = msg.a;
					return A3(
						elm$core$Tuple$mapBoth,
						author$project$Page$Exhibition$EditPage,
						elm$core$List$map(author$project$Page$Exhibition$EmissionByProductEditor),
						A2(author$project$Page$Component$ProductEditor$update, m, productEditorModel));
				default:
					return _Utils_Tuple2(
						author$project$Page$Exhibition$EditPage(productEditorModel),
						_List_Nil);
			}
		} else {
			var rec = page.a;
			switch (msg.$) {
				case 3:
					var data = msg.a;
					return _Utils_Tuple2(
						author$project$Page$Exhibition$ConfirmPage(
							_Utils_update(
								rec,
								{cb: true})),
						_List_fromArray(
							[
								author$project$Page$Exhibition$EmissionSellProducts(data)
							]));
				case 1:
					return A3(
						elm$core$Tuple$mapBoth,
						author$project$Page$Exhibition$EditPage,
						elm$core$List$map(author$project$Page$Exhibition$EmissionByProductEditor),
						author$project$Page$Component$ProductEditor$initModelFromSellRequestData(rec.b7));
				default:
					return _Utils_Tuple2(
						author$project$Page$Exhibition$ConfirmPage(rec),
						_List_Nil);
			}
		}
	});
var author$project$Page$Exhibition$EmissionLogInOrSignUp = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$Exhibition$updateWhenNoLogIn = F2(
	function (msg, _n0) {
		var rec = _n0;
		if (msg.$ === 2) {
			var m = msg.a;
			var exEmission = _List_Nil;
			return A3(
				elm$core$Tuple$mapBoth,
				function (logInModel) {
					return _Utils_update(
						rec,
						{br: logInModel});
				},
				function (e) {
					return _Utils_ap(
						A2(elm$core$List$map, author$project$Page$Exhibition$EmissionLogInOrSignUp, e),
						exEmission);
				},
				A2(author$project$Page$Component$LogIn$update, m, rec.br));
		} else {
			return _Utils_Tuple2(rec, _List_Nil);
		}
	});
var elm$core$Tuple$mapFirst = F2(
	function (func, _n0) {
		var x = _n0.a;
		var y = _n0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var author$project$Page$Exhibition$update = F3(
	function (logInState, msg, _n0) {
		var rec = _n0;
		if (!logInState.$) {
			return A2(author$project$Page$Exhibition$updateWhenNoLogIn, msg, rec);
		} else {
			return A2(
				elm$core$Tuple$mapFirst,
				function (p) {
					return _Utils_update(
						rec,
						{i: p});
				},
				A2(author$project$Page$Exhibition$updateWhenLogIn, msg, rec.i));
		}
	});
var author$project$Page$LogIn$LogInOrSignUpEmission = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$LogIn$update = F2(
	function (msg, _n0) {
		var logInOrSignUpModel = _n0;
		var logInOrSignUpMsg = msg;
		return A3(
			elm$core$Tuple$mapBoth,
			elm$core$Basics$identity,
			function (e) {
				return A2(elm$core$List$map, author$project$Page$LogIn$LogInOrSignUpEmission, e);
			},
			A2(author$project$Page$Component$LogIn$update, logInOrSignUpMsg, logInOrSignUpModel));
	});
var author$project$Page$Notification$update = F2(
	function (msg, model) {
		return _Utils_Tuple2(model, _List_Nil);
	});
var author$project$Page$Search$update = F2(
	function (msg, model) {
		return _Utils_Tuple2(model, _List_Nil);
	});
var author$project$Data$University$graduateFromIndex = function (index) {
	return A2(author$project$Utility$getAt, index, author$project$Data$University$graduateAllValue);
};
var author$project$Page$Component$University$GraduateNoTsukuba = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$Component$University$GraduateTsukuba = function (a) {
	return {$: 1, a: a};
};
var author$project$Data$University$schoolToDepartmentList = function (school) {
	switch (school) {
		case 0:
			return _List_fromArray(
				[0, 1, 2]);
		case 1:
			return _List_fromArray(
				[3, 4]);
		case 2:
			return _List_fromArray(
				[5, 6, 7]);
		case 3:
			return _List_fromArray(
				[8, 9, 10]);
		case 4:
			return _List_fromArray(
				[11, 12, 13, 14, 15, 16]);
		case 5:
			return _List_fromArray(
				[17, 18, 19]);
		case 6:
			return _List_fromArray(
				[20, 21, 22]);
		case 7:
			return _List_Nil;
		default:
			return _List_Nil;
	}
};
var author$project$Data$University$departmentFromIndexInSchool = F2(
	function (school, index) {
		return A2(
			author$project$Utility$getAt,
			index,
			author$project$Data$University$schoolToDepartmentList(school));
	});
var author$project$Data$University$SAandd = 7;
var author$project$Data$University$SHuman = 2;
var author$project$Data$University$SHumcul = 0;
var author$project$Data$University$SInfo = 5;
var author$project$Data$University$SLife = 3;
var author$project$Data$University$SMed = 6;
var author$project$Data$University$SSocint = 1;
var author$project$Data$University$SSport = 8;
var author$project$Data$University$SSse = 4;
var author$project$Data$University$schoolFromDepartment = function (schoolAndDepartment) {
	switch (schoolAndDepartment) {
		case 0:
			return 0;
		case 1:
			return 0;
		case 2:
			return 0;
		case 3:
			return 1;
		case 4:
			return 1;
		case 5:
			return 2;
		case 6:
			return 2;
		case 7:
			return 2;
		case 8:
			return 3;
		case 9:
			return 3;
		case 10:
			return 3;
		case 11:
			return 4;
		case 12:
			return 4;
		case 13:
			return 4;
		case 14:
			return 4;
		case 15:
			return 4;
		case 16:
			return 4;
		case 17:
			return 5;
		case 18:
			return 5;
		case 19:
			return 5;
		case 20:
			return 6;
		case 21:
			return 6;
		case 22:
			return 6;
		case 23:
			return 7;
		default:
			return 8;
	}
};
var author$project$Page$Component$University$SchoolSchool = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$Component$University$SchoolSchoolAndDepartment = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$Component$University$selectDepartment = F2(
	function (index, schoolSelect) {
		switch (schoolSelect.$) {
			case 0:
				return author$project$Page$Component$University$SchoolNone;
			case 1:
				var school = schoolSelect.a;
				var _n1 = A2(
					elm$core$Maybe$andThen,
					author$project$Data$University$departmentFromIndexInSchool(school),
					index);
				if (!_n1.$) {
					var department = _n1.a;
					return author$project$Page$Component$University$SchoolSchoolAndDepartment(department);
				} else {
					return author$project$Page$Component$University$SchoolSchool(school);
				}
			default:
				var schoolAndDepartment = schoolSelect.a;
				var _n2 = A2(
					elm$core$Maybe$andThen,
					author$project$Data$University$departmentFromIndexInSchool(
						author$project$Data$University$schoolFromDepartment(schoolAndDepartment)),
					index);
				if (!_n2.$) {
					var department = _n2.a;
					return author$project$Page$Component$University$SchoolSchoolAndDepartment(department);
				} else {
					return author$project$Page$Component$University$SchoolSchool(
						author$project$Data$University$schoolFromDepartment(schoolAndDepartment));
				}
		}
	});
var author$project$Data$University$schoolAll = _List_fromArray(
	[0, 1, 2, 3, 4, 5, 6, 7, 8]);
var author$project$Data$University$schoolFromIndex = function (index) {
	return A2(author$project$Utility$getAt, index, author$project$Data$University$schoolAll);
};
var author$project$Page$Component$University$selectSchool = F2(
	function (index, schoolSelect) {
		var _n0 = A2(elm$core$Maybe$andThen, author$project$Data$University$schoolFromIndex, index);
		if (!_n0.$) {
			var school = _n0.a;
			switch (schoolSelect.$) {
				case 0:
					return author$project$Page$Component$University$SchoolSchool(school);
				case 1:
					return author$project$Page$Component$University$SchoolSchool(school);
				default:
					var schoolAndDepartment = schoolSelect.a;
					return _Utils_eq(
						author$project$Data$University$schoolFromDepartment(schoolAndDepartment),
						school) ? schoolSelect : author$project$Page$Component$University$SchoolSchool(school);
			}
		} else {
			return author$project$Page$Component$University$SchoolNone;
		}
	});
var author$project$Page$Component$University$update = F2(
	function (msg, model) {
		return _Utils_Tuple2(
			function () {
				var _n0 = _Utils_Tuple2(msg, model);
				_n0$11:
				while (true) {
					switch (_n0.b.$) {
						case 2:
							switch (_n0.a.$) {
								case 1:
									var _n3 = _n0.a;
									return author$project$Page$Component$University$School(author$project$Page$Component$University$SchoolNone);
								case 2:
									var _n4 = _n0.a;
									var graduate = _n0.b.a;
									return author$project$Page$Component$University$GraduateTsukuba(
										{bP: graduate, b9: author$project$Page$Component$University$SchoolNone});
								case 4:
									var index = _n0.a.a;
									return author$project$Page$Component$University$GraduateNoTsukuba(
										A2(elm$core$Maybe$andThen, author$project$Data$University$graduateFromIndex, index));
								default:
									break _n0$11;
							}
						case 0:
							switch (_n0.a.$) {
								case 0:
									var _n1 = _n0.a;
									var schoolSelect = _n0.b.a;
									return author$project$Page$Component$University$GraduateTsukuba(
										{bP: elm$core$Maybe$Nothing, b9: schoolSelect});
								case 5:
									var index = _n0.a.a;
									var school = _n0.b.a;
									return author$project$Page$Component$University$School(
										A2(author$project$Page$Component$University$selectSchool, index, school));
								case 6:
									var index = _n0.a.a;
									var school = _n0.b.a;
									return author$project$Page$Component$University$School(
										A2(author$project$Page$Component$University$selectDepartment, index, school));
								default:
									break _n0$11;
							}
						default:
							switch (_n0.a.$) {
								case 1:
									var _n2 = _n0.a;
									var school = _n0.b.a.b9;
									return author$project$Page$Component$University$School(school);
								case 3:
									var _n5 = _n0.a;
									var graduate = _n0.b.a.bP;
									return author$project$Page$Component$University$GraduateNoTsukuba(graduate);
								case 4:
									var index = _n0.a.a;
									var rec = _n0.b.a;
									return author$project$Page$Component$University$GraduateTsukuba(
										_Utils_update(
											rec,
											{
												bP: A2(elm$core$Maybe$andThen, author$project$Data$University$graduateFromIndex, index)
											}));
								case 5:
									var index = _n0.a.a;
									var rec = _n0.b.a;
									return author$project$Page$Component$University$GraduateTsukuba(
										_Utils_update(
											rec,
											{
												b9: A2(author$project$Page$Component$University$selectSchool, index, rec.b9)
											}));
								case 6:
									var index = _n0.a.a;
									var rec = _n0.b.a;
									return author$project$Page$Component$University$GraduateTsukuba(
										_Utils_update(
											rec,
											{
												b9: A2(author$project$Page$Component$University$selectDepartment, index, rec.b9)
											}));
								default:
									break _n0$11;
							}
					}
				}
				return model;
			}(),
			_List_Nil);
	});
var author$project$Page$SignUp$CustomizeImage = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$SignUp$EmissionAddLogMessage = function (a) {
	return {$: 4, a: a};
};
var author$project$Page$SignUp$EmissionSignUp = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$SignUp$Sending = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$SignUp$Sent = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$SignUp$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var string = msg.a;
				return _Utils_Tuple2(
					function () {
						if (!model.$) {
							var rec = model.a;
							return author$project$Page$SignUp$Normal(
								_Utils_update(
									rec,
									{
										bz: author$project$Page$SignUp$analysisStudentIdOrSAddress(string)
									}));
						} else {
							return model;
						}
					}(),
					_List_Nil);
			case 1:
				var dataUrl = msg.a;
				return _Utils_Tuple2(
					function () {
						var _n2 = _Utils_Tuple2(model, dataUrl);
						if (!_n2.a.$) {
							var rec = _n2.a.a;
							var imageDataUrl = _n2.b;
							return author$project$Page$SignUp$Normal(
								_Utils_update(
									rec,
									{
										bn: author$project$Page$SignUp$CustomizeImage(imageDataUrl)
									}));
						} else {
							return model;
						}
					}(),
					_List_Nil);
			case 2:
				var sAddressOrStudentId = msg.a;
				return _Utils_Tuple2(
					function () {
						if (!model.$) {
							var rec = model.a;
							return author$project$Page$SignUp$Normal(
								_Utils_update(
									rec,
									{bz: sAddressOrStudentId}));
						} else {
							return model;
						}
					}(),
					_List_Nil);
			case 3:
				var universityMsg = msg.a;
				if (!model.$) {
					var rec = model.a;
					var _n5 = A2(author$project$Page$Component$University$update, universityMsg, rec.bb);
					var universityModel = _n5.a;
					var universityEmissions = _n5.b;
					return _Utils_Tuple2(
						author$project$Page$SignUp$Normal(
							_Utils_update(
								rec,
								{bb: universityModel})),
						A2(elm$core$List$map, author$project$Page$SignUp$EmissionByUniversity, universityEmissions));
				} else {
					return _Utils_Tuple2(model, _List_Nil);
				}
			case 4:
				var string = msg.a;
				return _Utils_Tuple2(
					function () {
						if (!model.$) {
							var rec = model.a;
							return author$project$Page$SignUp$Normal(
								_Utils_update(
									rec,
									{
										bZ: elm$core$String$trim(string)
									}));
						} else {
							return model;
						}
					}(),
					_List_Nil);
			case 5:
				var signUpRequest = msg.a;
				return _Utils_Tuple2(
					author$project$Page$SignUp$Sending(
						{cJ: signUpRequest.cJ}),
					_List_fromArray(
						[
							author$project$Page$SignUp$EmissionSignUp(signUpRequest)
						]));
			default:
				var result = msg.a;
				var _n7 = _Utils_Tuple2(model, result);
				if (!_n7.b.$) {
					if (_n7.a.$ === 1) {
						var emailAddress = _n7.a.a.cJ;
						return _Utils_Tuple2(
							author$project$Page$SignUp$Sent(
								{cJ: emailAddress}),
							_List_Nil);
					} else {
						return _Utils_Tuple2(model, _List_Nil);
					}
				} else {
					var string = _n7.b.a;
					return _Utils_Tuple2(
						model,
						_List_fromArray(
							[
								author$project$Page$SignUp$EmissionAddLogMessage(string)
							]));
				}
		}
	});
var author$project$Data$Trade$detailGetId = function (_n0) {
	var id = _n0.aa;
	return id;
};
var author$project$Data$Trade$detailGetStatus = function (_n0) {
	var status = _n0.cd;
	return status;
};
var author$project$Page$Trade$Cancel = 2;
var author$project$Page$Trade$Comment = 0;
var author$project$Page$Trade$EmissionAddComment = F3(
	function (a, b, c) {
		return {$: 2, a: a, b: b, c: c};
	});
var author$project$Page$Trade$EmissionAddLogMessage = function (a) {
	return {$: 5, a: a};
};
var author$project$Page$Trade$EmissionCancelTrade = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var author$project$Page$Trade$EmissionFinishTrade = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var author$project$Page$Trade$EmissionReplaceElementText = function (a) {
	return {$: 6, a: a};
};
var author$project$Page$Trade$EmissionUpdateNowTime = {$: 0};
var author$project$Page$Trade$Finish = 1;
var author$project$Page$Trade$Main = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$Trade$commentTextAreaId = 'comment-text-area';
var author$project$Page$Trade$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var string = msg.a;
				if (model.$ === 2) {
					var rec = model.a;
					return _Utils_Tuple2(
						author$project$Page$Trade$Main(
							_Utils_update(
								rec,
								{ar: string})),
						_List_Nil);
				} else {
					return _Utils_Tuple2(model, _List_Nil);
				}
			case 1:
				var token = msg.a;
				if (model.$ === 2) {
					var rec = model.a;
					var _n3 = rec.cb;
					if (!_n3.$) {
						return _Utils_Tuple2(
							model,
							_List_fromArray(
								[
									author$project$Page$Trade$EmissionAddLogMessage('同時に複数のリクエストをすることはできません')
								]));
					} else {
						return _Utils_Tuple2(
							author$project$Page$Trade$Main(
								_Utils_update(
									rec,
									{
										cb: elm$core$Maybe$Just(0)
									})),
							_List_fromArray(
								[
									A3(
									author$project$Page$Trade$EmissionAddComment,
									token,
									author$project$Data$Trade$detailGetId(rec.V),
									rec.ar)
								]));
					}
				} else {
					return _Utils_Tuple2(model, _List_Nil);
				}
			case 2:
				var token = msg.a;
				if (model.$ === 2) {
					var rec = model.a;
					var _n5 = rec.cb;
					if (!_n5.$) {
						return _Utils_Tuple2(
							model,
							_List_fromArray(
								[
									author$project$Page$Trade$EmissionAddLogMessage('同時に複数のリクエストをすることはできません')
								]));
					} else {
						return _Utils_Tuple2(
							author$project$Page$Trade$Main(
								_Utils_update(
									rec,
									{
										cb: elm$core$Maybe$Just(1)
									})),
							_List_fromArray(
								[
									A2(
									author$project$Page$Trade$EmissionFinishTrade,
									token,
									author$project$Data$Trade$detailGetId(rec.V))
								]));
					}
				} else {
					return _Utils_Tuple2(model, _List_Nil);
				}
			case 3:
				var token = msg.a;
				if (model.$ === 2) {
					var rec = model.a;
					var _n7 = rec.cb;
					if (!_n7.$) {
						return _Utils_Tuple2(
							model,
							_List_fromArray(
								[
									author$project$Page$Trade$EmissionAddLogMessage('同時に複数のリクエストをすることはできません')
								]));
					} else {
						return _Utils_Tuple2(
							author$project$Page$Trade$Main(
								_Utils_update(
									rec,
									{
										cb: elm$core$Maybe$Just(2)
									})),
							_List_fromArray(
								[
									A2(
									author$project$Page$Trade$EmissionCancelTrade,
									token,
									author$project$Data$Trade$detailGetId(rec.V))
								]));
					}
				} else {
					return _Utils_Tuple2(model, _List_Nil);
				}
			case 4:
				var result = msg.a;
				if (!result.$) {
					var trade = result.a;
					return _Utils_Tuple2(
						author$project$Page$Trade$Main(
							{ar: '', cb: elm$core$Maybe$Nothing, V: trade}),
						_List_fromArray(
							[
								author$project$Page$Trade$EmissionReplaceElementText(
								{aa: author$project$Page$Trade$commentTextAreaId, cf: ''}),
								author$project$Page$Trade$EmissionAddLogMessage(
								function () {
									var _n9 = author$project$Data$Trade$detailGetStatus(trade);
									if (_n9 === 5) {
										return '取引を完了しました';
									} else {
										return '相手の回答を待ちます';
									}
								}())
							]));
				} else {
					var errMsg = result.a;
					return _Utils_Tuple2(
						function () {
							if (model.$ === 2) {
								var rec = model.a;
								return author$project$Page$Trade$Main(
									_Utils_update(
										rec,
										{cb: elm$core$Maybe$Nothing}));
							} else {
								return model;
							}
						}(),
						_List_fromArray(
							[
								author$project$Page$Trade$EmissionAddLogMessage('取引の完了に失敗 ' + errMsg)
							]));
				}
			case 5:
				var result = msg.a;
				if (!result.$) {
					var trade = result.a;
					return _Utils_Tuple2(
						author$project$Page$Trade$Main(
							{ar: '', cb: elm$core$Maybe$Nothing, V: trade}),
						_List_fromArray(
							[
								author$project$Page$Trade$EmissionReplaceElementText(
								{aa: author$project$Page$Trade$commentTextAreaId, cf: ''}),
								author$project$Page$Trade$EmissionAddLogMessage('取引をキャンセルしました'),
								author$project$Page$Trade$EmissionUpdateNowTime
							]));
				} else {
					var errMsg = result.a;
					return _Utils_Tuple2(
						function () {
							if (model.$ === 2) {
								var rec = model.a;
								return author$project$Page$Trade$Main(
									_Utils_update(
										rec,
										{cb: elm$core$Maybe$Nothing}));
							} else {
								return model;
							}
						}(),
						_List_fromArray(
							[
								author$project$Page$Trade$EmissionAddLogMessage('取引のキャンセルに失敗 ' + errMsg)
							]));
				}
			case 6:
				var result = msg.a;
				if (!result.$) {
					var trade = result.a;
					return _Utils_Tuple2(
						author$project$Page$Trade$Main(
							{ar: '', cb: elm$core$Maybe$Nothing, V: trade}),
						_List_fromArray(
							[
								author$project$Page$Trade$EmissionReplaceElementText(
								{aa: author$project$Page$Trade$commentTextAreaId, cf: ''}),
								author$project$Page$Trade$EmissionUpdateNowTime
							]));
				} else {
					var errMsg = result.a;
					return _Utils_Tuple2(
						function () {
							if (model.$ === 2) {
								var rec = model.a;
								return author$project$Page$Trade$Main(
									_Utils_update(
										rec,
										{cb: elm$core$Maybe$Nothing}));
							} else {
								return model;
							}
						}(),
						_List_fromArray(
							[
								author$project$Page$Trade$EmissionAddLogMessage('コメントの追加に失敗 ' + errMsg)
							]));
				}
			default:
				var result = msg.a;
				if (!result.$) {
					var trade = result.a;
					return _Utils_Tuple2(
						author$project$Page$Trade$Main(
							{ar: '', cb: elm$core$Maybe$Nothing, V: trade}),
						_List_fromArray(
							[
								author$project$Page$Trade$EmissionReplaceElementText(
								{aa: author$project$Page$Trade$commentTextAreaId, cf: ''}),
								author$project$Page$Trade$EmissionUpdateNowTime
							]));
				} else {
					var errMsg = result.a;
					return _Utils_Tuple2(
						function () {
							if (model.$ === 2) {
								var rec = model.a;
								return author$project$Page$Trade$Main(
									_Utils_update(
										rec,
										{cb: elm$core$Maybe$Nothing}));
							} else {
								return model;
							}
						}(),
						_List_fromArray(
							[
								author$project$Page$Trade$EmissionAddLogMessage('取引の情報の取得に失敗 ' + errMsg)
							]));
				}
		}
	});
var author$project$Page$TradesInPast$EmissionAddLogMessage = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$TradesInPast$EmissionByLogIn = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$TradesInPast$Error = {$: 2};
var author$project$Page$TradesInPast$Normal = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$TradesInPast$update = F2(
	function (msg, _n0) {
		var rec = _n0;
		if (!msg.$) {
			var result = msg.a;
			if (!result.$) {
				var products = result.a;
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{
							ae: author$project$Page$TradesInPast$Normal(products)
						}),
					_List_Nil);
			} else {
				var errorMessage = result.a;
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{ae: author$project$Page$TradesInPast$Error}),
					_List_fromArray(
						[
							author$project$Page$TradesInPast$EmissionAddLogMessage('取引した商品の取得に失敗 ' + errorMessage)
						]));
			}
		} else {
			var logInOrSignUpMsg = msg.a;
			var _n3 = A2(author$project$Page$Component$LogIn$update, logInOrSignUpMsg, rec.bq);
			var newModel = _n3.a;
			var emissionList = _n3.b;
			return _Utils_Tuple2(
				_Utils_update(
					rec,
					{bq: newModel}),
				A2(elm$core$List$map, author$project$Page$TradesInPast$EmissionByLogIn, emissionList));
		}
	});
var author$project$Page$TradesInProgress$EmissionAddLogMessage = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$TradesInProgress$EmissionByLogIn = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$TradesInProgress$Error = {$: 2};
var author$project$Page$TradesInProgress$Normal = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$TradesInProgress$update = F2(
	function (msg, _n0) {
		var rec = _n0;
		if (!msg.$) {
			var result = msg.a;
			if (!result.$) {
				var products = result.a;
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{
							ae: author$project$Page$TradesInProgress$Normal(products)
						}),
					_List_Nil);
			} else {
				var errorMessage = result.a;
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{ae: author$project$Page$TradesInProgress$Error}),
					_List_fromArray(
						[
							author$project$Page$TradesInProgress$EmissionAddLogMessage('取引中の商品の取得に失敗 ' + errorMessage)
						]));
			}
		} else {
			var logInOrSignUpMsg = msg.a;
			var _n3 = A2(author$project$Page$Component$LogIn$update, logInOrSignUpMsg, rec.bq);
			var newModel = _n3.a;
			var emissionList = _n3.b;
			return _Utils_Tuple2(
				_Utils_update(
					rec,
					{bq: newModel}),
				A2(elm$core$List$map, author$project$Page$TradesInProgress$EmissionByLogIn, emissionList));
		}
	});
var author$project$Page$User$Edit = function (a) {
	return {$: 3, a: a};
};
var author$project$Page$User$EmissionAddLogMessage = function (a) {
	return {$: 5, a: a};
};
var author$project$Page$User$EmissionByUniversity = function (a) {
	return {$: 3, a: a};
};
var author$project$Page$User$EmissionChangeProfile = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var author$project$Page$User$EmissionLogOut = {$: 4};
var author$project$Page$User$Normal = function (a) {
	return {$: 2, a: a};
};
var author$project$Data$User$withProfileGetDisplayName = function (_n0) {
	var displayName = _n0.Y;
	return displayName;
};
var author$project$Data$User$withProfileGetIntroduction = function (_n0) {
	var introduction = _n0.bS;
	return introduction;
};
var author$project$Data$User$withProfileGetUniversity = function (_n0) {
	var university = _n0.bb;
	return university;
};
var author$project$Data$University$departmentToIndexInSchool = function (department) {
	return A2(
		elm$core$Maybe$withDefault,
		0,
		A2(
			author$project$Utility$getFirstIndex,
			department,
			author$project$Data$University$schoolToDepartmentList(
				author$project$Data$University$schoolFromDepartment(department))));
};
var author$project$Data$University$graduateToIndex = function (graduate) {
	return A2(
		elm$core$Maybe$withDefault,
		0,
		A2(author$project$Utility$getFirstIndex, graduate, author$project$Data$University$graduateAllValue));
};
var author$project$Data$University$schoolToIndex = function (school) {
	return A2(
		elm$core$Maybe$withDefault,
		0,
		A2(author$project$Utility$getFirstIndex, school, author$project$Data$University$schoolAll));
};
var author$project$Page$Component$University$departmentSelectId = 'signUp-selectDepartment';
var author$project$Page$Component$University$graduateSelectId = 'signUp-selectGraduate';
var author$project$Page$Component$University$initModelFromUniversity = function (university) {
	switch (university.$) {
		case 0:
			var graduate = university.a;
			var schoolAndDepartment = university.b;
			return _Utils_Tuple2(
				author$project$Page$Component$University$GraduateTsukuba(
					{
						bP: elm$core$Maybe$Just(graduate),
						b9: author$project$Page$Component$University$SchoolSchoolAndDepartment(schoolAndDepartment)
					}),
				_List_fromArray(
					[
						{
						aa: author$project$Page$Component$University$graduateSelectId,
						aW: author$project$Data$University$graduateToIndex(graduate) + 1
					},
						{
						aa: author$project$Page$Component$University$schoolSelectId,
						aW: author$project$Data$University$schoolToIndex(
							author$project$Data$University$schoolFromDepartment(schoolAndDepartment)) + 1
					},
						{
						aa: author$project$Page$Component$University$departmentSelectId,
						aW: author$project$Data$University$departmentToIndexInSchool(schoolAndDepartment) + 1
					}
					]));
		case 1:
			var graduate = university.a;
			return _Utils_Tuple2(
				author$project$Page$Component$University$GraduateNoTsukuba(
					elm$core$Maybe$Just(graduate)),
				_List_fromArray(
					[
						{
						aa: author$project$Page$Component$University$graduateSelectId,
						aW: author$project$Data$University$graduateToIndex(graduate) + 1
					}
					]));
		default:
			var schoolAndDepartment = university.a;
			return _Utils_Tuple2(
				author$project$Page$Component$University$School(
					author$project$Page$Component$University$SchoolSchoolAndDepartment(schoolAndDepartment)),
				_List_fromArray(
					[
						{
						aa: author$project$Page$Component$University$schoolSelectId,
						aW: author$project$Data$University$schoolToIndex(
							author$project$Data$University$schoolFromDepartment(schoolAndDepartment)) + 1
					},
						{
						aa: author$project$Page$Component$University$departmentSelectId,
						aW: author$project$Data$University$departmentToIndexInSchool(schoolAndDepartment) + 1
					}
					]));
	}
};
var author$project$Page$User$EmissionReplaceElementText = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$User$introductionEditorId = 'introduction-editor';
var author$project$Page$User$nickNameEditorId = 'nickname-editor';
var author$project$Page$User$toEditMode = function (userWithProfile) {
	var introduction = author$project$Data$User$withProfileGetIntroduction(userWithProfile);
	var displayName = author$project$Data$User$withProfileGetDisplayName(userWithProfile);
	var _n0 = author$project$Page$Component$University$initModelFromUniversity(
		author$project$Data$User$withProfileGetUniversity(userWithProfile));
	var universityModel = _n0.a;
	var universityEmissions = _n0.b;
	return _Utils_Tuple2(
		author$project$Page$User$Edit(
			{bf: userWithProfile, Y: displayName, bS: introduction, bb: universityModel}),
		_Utils_ap(
			_List_fromArray(
				[
					author$project$Page$User$EmissionReplaceElementText(
					{aa: author$project$Page$User$nickNameEditorId, cf: displayName}),
					author$project$Page$User$EmissionReplaceElementText(
					{aa: author$project$Page$User$introductionEditorId, cf: introduction})
				]),
			A2(elm$core$List$map, author$project$Page$User$EmissionByUniversity, universityEmissions)));
};
var author$project$Page$User$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				if (model.$ === 2) {
					var userWithProfile = model.a;
					return author$project$Page$User$toEditMode(userWithProfile);
				} else {
					return _Utils_Tuple2(model, _List_Nil);
				}
			case 1:
				var nickName = msg.a;
				return _Utils_Tuple2(
					function () {
						if (model.$ === 3) {
							var r = model.a;
							return author$project$Page$User$Edit(
								_Utils_update(
									r,
									{
										Y: elm$core$String$trim(nickName)
									}));
						} else {
							return model;
						}
					}(),
					_List_Nil);
			case 2:
				var introduction = msg.a;
				return _Utils_Tuple2(
					function () {
						if (model.$ === 3) {
							var r = model.a;
							return author$project$Page$User$Edit(
								_Utils_update(
									r,
									{bS: introduction}));
						} else {
							return model;
						}
					}(),
					_List_Nil);
			case 3:
				var componentMsg = msg.a;
				if (model.$ === 3) {
					var r = model.a;
					var _n5 = A2(author$project$Page$Component$University$update, componentMsg, r.bb);
					var componentModel = _n5.a;
					var componentEmittions = _n5.b;
					return _Utils_Tuple2(
						author$project$Page$User$Edit(
							_Utils_update(
								r,
								{bb: componentModel})),
						A2(elm$core$List$map, author$project$Page$User$EmissionByUniversity, componentEmittions));
				} else {
					return _Utils_Tuple2(model, _List_Nil);
				}
			case 4:
				return _Utils_Tuple2(
					function () {
						if (model.$ === 3) {
							var before = model.a.bf;
							return author$project$Page$User$Normal(before);
						} else {
							return model;
						}
					}(),
					_List_Nil);
			case 5:
				var token = msg.a;
				var profile = msg.b;
				return _Utils_Tuple2(
					model,
					_List_fromArray(
						[
							A2(author$project$Page$User$EmissionChangeProfile, token, profile)
						]));
			case 6:
				var result = msg.a;
				if (!result.$) {
					var profile = result.a;
					return _Utils_Tuple2(
						author$project$Page$User$Normal(profile),
						_List_fromArray(
							[
								author$project$Page$User$EmissionAddLogMessage('ユーザー情報を更新しました')
							]));
				} else {
					return _Utils_Tuple2(
						model,
						_List_fromArray(
							[
								author$project$Page$User$EmissionAddLogMessage('ユーザー情報を更新に失敗しました')
							]));
				}
			case 7:
				return _Utils_Tuple2(
					model,
					_List_fromArray(
						[author$project$Page$User$EmissionLogOut]));
			default:
				var result = msg.a;
				var _n8 = _Utils_Tuple2(model, result);
				if (!_n8.b.$) {
					switch (_n8.a.$) {
						case 0:
							var profile = _n8.b.a;
							return _Utils_Tuple2(
								author$project$Page$User$Normal(profile),
								_List_Nil);
						case 1:
							var profile = _n8.b.a;
							return _Utils_Tuple2(
								author$project$Page$User$Normal(profile),
								_List_Nil);
						default:
							return _Utils_Tuple2(model, _List_Nil);
					}
				} else {
					var string = _n8.b.a;
					return _Utils_Tuple2(
						model,
						_List_fromArray(
							[
								author$project$Page$User$EmissionAddLogMessage('ユーザー情報の取得に失敗しました ' + string)
							]));
				}
		}
	});
var author$project$Main$updatePageMsg = F2(
	function (pageMsg, _n0) {
		var rec = _n0;
		var _n1 = _Utils_Tuple2(pageMsg, rec.i);
		_n1$16:
		while (true) {
			switch (_n1.a.$) {
				case 0:
					if (!_n1.b.$) {
						var msg = _n1.a.a;
						var model = _n1.b.a;
						return A3(
							author$project$Main$mapPageModel,
							author$project$Main$PageHome,
							author$project$Main$homePageEmissionToCmd,
							A2(author$project$Page$Home$update, msg, model));
					} else {
						break _n1$16;
					}
				case 1:
					if (_n1.b.$ === 3) {
						var msg = _n1.a.a;
						var model = _n1.b.a;
						return A3(
							author$project$Main$mapPageModel,
							author$project$Main$PageLikedProducts,
							author$project$Main$likedProductsEmissionToCmd,
							A2(author$project$Page$LikedProducts$update, msg, model));
					} else {
						break _n1$16;
					}
				case 2:
					if (_n1.b.$ === 4) {
						var msg = _n1.a.a;
						var model = _n1.b.a;
						return A3(
							author$project$Main$mapPageModel,
							author$project$Main$PageHistory,
							author$project$Main$historyEmissionToCmd,
							A2(author$project$Page$History$update, msg, model));
					} else {
						break _n1$16;
					}
				case 3:
					if (_n1.b.$ === 5) {
						var msg = _n1.a.a;
						var model = _n1.b.a;
						return A3(
							author$project$Main$mapPageModel,
							author$project$Main$PageSoldProducts,
							author$project$Main$soldProductsPageEmissionToCmd,
							A2(author$project$Page$SoldProducts$update, msg, model));
					} else {
						break _n1$16;
					}
				case 4:
					if (_n1.b.$ === 6) {
						var msg = _n1.a.a;
						var model = _n1.b.a;
						return A3(
							author$project$Main$mapPageModel,
							author$project$Main$PageBoughtProducts,
							author$project$Main$boughtProductsPageEmissionToCmd,
							A2(author$project$Page$BoughtProducts$update, msg, model));
					} else {
						break _n1$16;
					}
				case 5:
					if (_n1.b.$ === 7) {
						var msg = _n1.a.a;
						var model = _n1.b.a;
						return A3(
							author$project$Main$mapPageModel,
							author$project$Main$PageTradesInProgress,
							author$project$Main$tradingProductsEmissionToCmd,
							A2(author$project$Page$TradesInProgress$update, msg, model));
					} else {
						break _n1$16;
					}
				case 6:
					if (_n1.b.$ === 8) {
						var msg = _n1.a.a;
						var model = _n1.b.a;
						return A3(
							author$project$Main$mapPageModel,
							author$project$Main$PageTradesInPast,
							author$project$Main$tradedProductsEmissionToCmd,
							A2(author$project$Page$TradesInPast$update, msg, model));
					} else {
						break _n1$16;
					}
				case 7:
					if (_n1.b.$ === 9) {
						var msg = _n1.a.a;
						var model = _n1.b.a;
						return A3(
							author$project$Main$mapPageModel,
							author$project$Main$PageCommentedProducts,
							author$project$Main$commentedProductsEmissionToCmd,
							A2(author$project$Page$CommentedProducts$update, msg, model));
					} else {
						break _n1$16;
					}
				case 8:
					if (_n1.b.$ === 2) {
						var msg = _n1.a.a;
						var model = _n1.b.a;
						return A3(
							author$project$Main$mapPageModel,
							author$project$Main$PageLogIn,
							author$project$Main$logInPageEmissionToCmd(rec.B),
							A2(author$project$Page$LogIn$update, msg, model));
					} else {
						break _n1$16;
					}
				case 9:
					if (_n1.b.$ === 10) {
						var msg = _n1.a.a;
						var model = _n1.b.a;
						return A3(
							author$project$Main$mapPageModel,
							author$project$Main$PageExhibition,
							author$project$Main$exhibitionPageEmissionToCmd,
							A3(author$project$Page$Exhibition$update, rec.k, msg, model));
					} else {
						break _n1$16;
					}
				case 10:
					if (_n1.b.$ === 1) {
						var msg = _n1.a.a;
						var model = _n1.b.a;
						return A3(
							author$project$Main$mapPageModel,
							author$project$Main$PageSignUp,
							author$project$Main$signUpPageEmissionToCmd,
							A2(author$project$Page$SignUp$update, msg, model));
					} else {
						break _n1$16;
					}
				case 11:
					if (_n1.b.$ === 14) {
						var msg = _n1.a.a;
						var model = _n1.b.a;
						return A3(
							author$project$Main$mapPageModel,
							author$project$Main$PageSearch,
							author$project$Main$searchPageEmissionToCmd,
							A2(author$project$Page$Search$update, msg, model));
					} else {
						break _n1$16;
					}
				case 12:
					if (_n1.b.$ === 15) {
						var msg = _n1.a.a;
						var model = _n1.b.a;
						return A3(
							author$project$Main$mapPageModel,
							author$project$Main$PageNotification,
							author$project$Main$notificationEmissionToCmd,
							A2(author$project$Page$Notification$update, msg, model));
					} else {
						break _n1$16;
					}
				case 14:
					if (_n1.b.$ === 13) {
						var msg = _n1.a.a;
						var model = _n1.b.a;
						return A3(
							author$project$Main$mapPageModel,
							author$project$Main$PageUser,
							author$project$Main$userPageEmissionToCmd,
							A2(author$project$Page$User$update, msg, model));
					} else {
						break _n1$16;
					}
				case 13:
					if (_n1.b.$ === 11) {
						var msg = _n1.a.a;
						var model = _n1.b.a;
						return A3(
							author$project$Main$mapPageModel,
							author$project$Main$PageProduct,
							author$project$Main$productPageEmissionToCmd(rec.B),
							A2(author$project$Page$Product$update, msg, model));
					} else {
						break _n1$16;
					}
				default:
					if (_n1.b.$ === 12) {
						var msg = _n1.a.a;
						var model = _n1.b.a;
						return A3(
							author$project$Main$mapPageModel,
							author$project$Main$PageTrade,
							author$project$Main$tradePageEmissionToCmd,
							A2(author$project$Page$Trade$update, msg, model));
					} else {
						break _n1$16;
					}
			}
		}
		return _Utils_Tuple2(rec.i, elm$core$Platform$Cmd$none);
	});
var author$project$Data$Product$searchFromId = F2(
	function (id, list) {
		searchFromId:
		while (true) {
			if (list.b) {
				var x = list.a;
				var xs = list.b;
				if (_Utils_eq(
					author$project$Data$Product$getId(x),
					id)) {
					return elm$core$Maybe$Just(x);
				} else {
					var $temp$id = id,
						$temp$list = xs;
					id = $temp$id;
					list = $temp$list;
					continue searchFromId;
				}
			} else {
				return elm$core$Maybe$Nothing;
			}
		}
	});
var author$project$Page$BoughtProducts$getAllProducts = function (_n0) {
	var normal = _n0.ae;
	if (normal.$ === 1) {
		var products = normal.a;
		return products;
	} else {
		return _List_Nil;
	}
};
var author$project$Page$CommentedProducts$getAllProducts = function (_n0) {
	var normal = _n0.ae;
	if (normal.$ === 1) {
		var products = normal.a;
		return products;
	} else {
		return _List_Nil;
	}
};
var author$project$Page$History$getAllProducts = function (_n0) {
	var normal = _n0.ae;
	if (normal.$ === 1) {
		var products = normal.a;
		return products;
	} else {
		return _List_Nil;
	}
};
var author$project$Page$Home$getAllProducts = function (_n0) {
	var rec = _n0;
	return A2(
		elm$core$Maybe$withDefault,
		_List_Nil,
		function () {
			var _n1 = rec.a5;
			switch (_n1) {
				case 0:
					return rec.aD;
				case 1:
					return rec.aE;
				default:
					return rec.aw;
			}
		}());
};
var author$project$Page$LikedProducts$getAllProducts = function (_n0) {
	var normal = _n0.ae;
	if (normal.$ === 1) {
		var products = normal.a;
		return products;
	} else {
		return _List_Nil;
	}
};
var author$project$Data$Product$fromDetail = function (_n0) {
	var rec = _n0;
	return {bJ: rec.bJ, aa: rec.aa, c1: rec.c1, a: rec.a, b4: rec.b4, cd: rec.cd, et: rec.d1.a};
};
var author$project$Page$Product$getProduct = function (model) {
	switch (model.$) {
		case 0:
			return elm$core$Maybe$Nothing;
		case 1:
			var product = model.a;
			return elm$core$Maybe$Just(product);
		case 2:
			var product = model.a.de;
			return elm$core$Maybe$Just(
				author$project$Data$Product$fromDetail(product));
		case 3:
			var beforeProduct = model.a.aQ;
			return elm$core$Maybe$Just(
				author$project$Data$Product$fromDetail(beforeProduct));
		default:
			var product = model.a.de;
			return elm$core$Maybe$Just(
				author$project$Data$Product$fromDetail(product));
	}
};
var author$project$Page$SoldProducts$getAllProducts = function (_n0) {
	var normal = _n0.ae;
	if (normal.$ === 1) {
		var products = normal.a;
		return products;
	} else {
		return _List_Nil;
	}
};
var author$project$Data$Trade$getProduct = function (_n0) {
	var product = _n0.de;
	return product;
};
var author$project$Page$TradesInPast$getAllTrades = function (_n0) {
	var normal = _n0.ae;
	if (normal.$ === 1) {
		var trades = normal.a;
		return trades;
	} else {
		return _List_Nil;
	}
};
var author$project$Page$TradesInPast$getAllProducts = A2(
	elm$core$Basics$composeR,
	author$project$Page$TradesInPast$getAllTrades,
	elm$core$List$map(author$project$Data$Trade$getProduct));
var author$project$Page$TradesInProgress$getAllTrades = function (_n0) {
	var normal = _n0.ae;
	if (normal.$ === 1) {
		var trades = normal.a;
		return trades;
	} else {
		return _List_Nil;
	}
};
var author$project$Page$TradesInProgress$getAllProducts = A2(
	elm$core$Basics$composeR,
	author$project$Page$TradesInProgress$getAllTrades,
	elm$core$List$map(author$project$Data$Trade$getProduct));
var author$project$Main$getProductFromPage = F2(
	function (productId, pageModel) {
		return A2(
			author$project$Data$Product$searchFromId,
			productId,
			function () {
				switch (pageModel.$) {
					case 0:
						var model = pageModel.a;
						return author$project$Page$Home$getAllProducts(model);
					case 3:
						var model = pageModel.a;
						return author$project$Page$LikedProducts$getAllProducts(model);
					case 4:
						var model = pageModel.a;
						return author$project$Page$History$getAllProducts(model);
					case 5:
						var model = pageModel.a;
						return author$project$Page$SoldProducts$getAllProducts(model);
					case 6:
						var model = pageModel.a;
						return author$project$Page$BoughtProducts$getAllProducts(model);
					case 7:
						var model = pageModel.a;
						return author$project$Page$TradesInProgress$getAllProducts(model);
					case 8:
						var model = pageModel.a;
						return author$project$Page$TradesInPast$getAllProducts(model);
					case 9:
						var model = pageModel.a;
						return author$project$Page$CommentedProducts$getAllProducts(model);
					case 11:
						var model = pageModel.a;
						var _n1 = author$project$Page$Product$getProduct(model);
						if (!_n1.$) {
							var product = _n1.a;
							return _List_fromArray(
								[product]);
						} else {
							return _List_Nil;
						}
					default:
						return _List_Nil;
				}
			}());
	});
var author$project$Data$Trade$searchFromId = F2(
	function (id, list) {
		searchFromId:
		while (true) {
			if (list.b) {
				var x = list.a;
				var xs = list.b;
				if (_Utils_eq(
					author$project$Data$Trade$getId(x),
					id)) {
					return elm$core$Maybe$Just(x);
				} else {
					var $temp$id = id,
						$temp$list = xs;
					id = $temp$id;
					list = $temp$list;
					continue searchFromId;
				}
			} else {
				return elm$core$Maybe$Nothing;
			}
		}
	});
var author$project$Main$getTradeFromPage = F2(
	function (tradeId, pageModel) {
		return A2(
			author$project$Data$Trade$searchFromId,
			tradeId,
			function () {
				switch (pageModel.$) {
					case 7:
						var model = pageModel.a;
						return author$project$Page$TradesInProgress$getAllTrades(model);
					case 8:
						var model = pageModel.a;
						return author$project$Page$TradesInPast$getAllTrades(model);
					default:
						return _List_Nil;
				}
			}());
	});
var author$project$Data$User$searchFromId = F2(
	function (id, list) {
		searchFromId:
		while (true) {
			if (list.b) {
				var x = list.a;
				var xs = list.b;
				if (_Utils_eq(
					author$project$Data$User$withNameGetId(x),
					id)) {
					return elm$core$Maybe$Just(x);
				} else {
					var $temp$id = id,
						$temp$list = xs;
					id = $temp$id;
					list = $temp$list;
					continue searchFromId;
				}
			} else {
				return elm$core$Maybe$Nothing;
			}
		}
	});
var author$project$Data$Product$commentGetSpeaker = function (_n0) {
	var speaker = _n0.ds;
	return speaker;
};
var author$project$Data$Product$detailGetCommentList = function (_n0) {
	var commentList = _n0.bK;
	return commentList;
};
var author$project$Data$Product$detailGetSeller = function (_n0) {
	var seller = _n0.dn;
	return seller;
};
var author$project$Page$Product$productGetUser = function (product) {
	return A2(
		elm$core$List$cons,
		author$project$Data$Product$detailGetSeller(product),
		A2(
			elm$core$List$map,
			author$project$Data$Product$commentGetSpeaker,
			A2(
				elm$core$Maybe$withDefault,
				_List_Nil,
				author$project$Data$Product$detailGetCommentList(product))));
};
var author$project$Page$Product$getUser = function (model) {
	switch (model.$) {
		case 0:
			return _List_Nil;
		case 1:
			return _List_Nil;
		case 2:
			var product = model.a.de;
			return author$project$Page$Product$productGetUser(product);
		case 3:
			var beforeProduct = model.a.aQ;
			return author$project$Page$Product$productGetUser(beforeProduct);
		default:
			var product = model.a.de;
			return author$project$Page$Product$productGetUser(product);
	}
};
var author$project$Page$User$getUser = function (model) {
	switch (model.$) {
		case 0:
			return _List_Nil;
		case 1:
			var withName = model.a;
			return _List_fromArray(
				[withName]);
		case 2:
			var withProfile = model.a;
			return _List_fromArray(
				[
					author$project$Data$User$withProfileToWithName(withProfile)
				]);
		default:
			var before = model.a.bf;
			return _List_fromArray(
				[
					author$project$Data$User$withProfileToWithName(before)
				]);
	}
};
var author$project$Main$getUserFromPage = F2(
	function (userId, pageModel) {
		return A2(
			author$project$Data$User$searchFromId,
			userId,
			function () {
				switch (pageModel.$) {
					case 11:
						var model = pageModel.a;
						return author$project$Page$Product$getUser(model);
					case 13:
						var model = pageModel.a;
						return author$project$Page$User$getUser(model);
					default:
						return _List_Nil;
				}
			}());
	});
var author$project$Page$Exhibition$BackToEditPage = {$: 1};
var author$project$Api$SellProductRequest = elm$core$Basics$identity;
var author$project$Page$Component$ProductEditor$imagesCheck = function (images) {
	var length = elm$core$List$length(images);
	return (length < 1) ? elm$core$Maybe$Just('画像は1枚以上必要です') : ((4 < length) ? elm$core$Maybe$Just('画像は4枚以内でなければいけません') : elm$core$Maybe$Nothing);
};
var author$project$Page$Component$ProductEditor$nameCheck = function (name) {
	var nameLength = elm$core$String$length(
		elm$core$String$trim(name));
	return (nameLength < 1) ? elm$core$Maybe$Just('商品名は1文字以上でないといけません') : ((40 < nameLength) ? elm$core$Maybe$Just('商品名は40文字以内でないといけません') : elm$core$Maybe$Nothing);
};
var author$project$Page$Component$ProductEditor$priceCheck = function (priceMaybe) {
	if (!priceMaybe.$) {
		var price = priceMaybe.a;
		return (price < 0) ? elm$core$Result$Err('価格は正の値で入力してください') : ((1000000 < price) ? elm$core$Result$Err('価格は100万円以下でないといけません') : elm$core$Result$Ok(price));
	} else {
		return elm$core$Result$Err('0 ～ 100万円の価格を入力してください');
	}
};
var author$project$Page$Component$ProductEditor$toSoldRequest = function (_n0) {
	var rec = _n0;
	var _n1 = _Utils_Tuple3(
		author$project$Page$Component$ProductEditor$priceCheck(rec.b4),
		rec.cD,
		rec.bJ);
	if (((!_n1.a.$) && (!_n1.b.$)) && (_n1.c.$ === 2)) {
		var price = _n1.a.a;
		var condition = _n1.b.a;
		var category = _n1.c.a;
		return (_Utils_eq(
			author$project$Page$Component$ProductEditor$nameCheck(rec.a),
			elm$core$Maybe$Nothing) && _Utils_eq(
			author$project$Page$Component$ProductEditor$imagesCheck(rec.o),
			elm$core$Maybe$Nothing)) ? elm$core$Maybe$Just(
			{bJ: category, cD: condition, cH: rec.cH, d2: rec.o, a: rec.a, b4: price}) : elm$core$Maybe$Nothing;
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var author$project$Page$Exhibition$ToConfirmPage = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$Exhibition$toConfirmPageMsgFromModel = F2(
	function (logInState, _n0) {
		var rec = _n0;
		var _n1 = _Utils_Tuple2(
			rec.i,
			author$project$Data$LogInState$getToken(logInState));
		if ((!_n1.a.$) && (!_n1.b.$)) {
			var editModel = _n1.a.a;
			var token = _n1.b.a;
			return A2(
				elm$core$Maybe$map,
				function (request) {
					return author$project$Page$Exhibition$ToConfirmPage(
						_Utils_Tuple2(token, request));
				},
				author$project$Page$Component$ProductEditor$toSoldRequest(editModel));
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var author$project$Page$Product$WaitNewData = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$Product$initModelFromProduct = F2(
	function (logInState, product) {
		return _Utils_Tuple2(
			author$project$Page$Product$WaitNewData(product),
			function () {
				var _n0 = author$project$Data$LogInState$getToken(logInState);
				if (!_n0.$) {
					var accessToken = _n0.a;
					return _List_fromArray(
						[
							author$project$Page$Product$EmissionGetProductAndMarkHistory(
							{
								bw: author$project$Data$Product$getId(product),
								dz: accessToken
							})
						]);
				} else {
					return _List_fromArray(
						[
							author$project$Page$Product$EmissionGetProduct(
							{
								bw: author$project$Data$Product$getId(product)
							})
						]);
				}
			}());
	});
var author$project$Page$Trade$Loading = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$Trade$initModelFromTrade = F2(
	function (logInState, trade) {
		return _Utils_Tuple2(
			author$project$Page$Trade$Loading(trade),
			function () {
				var _n0 = author$project$Data$LogInState$getToken(logInState);
				if (!_n0.$) {
					var token = _n0.a;
					return _List_fromArray(
						[
							A2(
							author$project$Page$Trade$EmissionGetTradeDetail,
							token,
							author$project$Data$Trade$getId(trade))
						]);
				} else {
					return _List_Nil;
				}
			}());
	});
var author$project$Page$User$initModelWithName = function (userWithNameInit) {
	return _Utils_Tuple2(
		author$project$Page$User$LoadingWithUserIdAndName(userWithNameInit),
		_List_fromArray(
			[
				author$project$Page$User$EmissionGetUserProfile(
				author$project$Data$User$withNameGetId(userWithNameInit))
			]));
};
var author$project$Main$urlParserResultToPageAndCmd = F2(
	function (_n0, result) {
		var rec = _n0;
		switch (result.$) {
			case 0:
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageHome,
					author$project$Main$homePageEmissionToCmd,
					author$project$Page$Home$initModel(
						author$project$Main$getProductId(rec.i)));
			case 1:
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageLogIn,
					author$project$Main$logInPageEmissionToCmd(rec.B),
					author$project$Page$LogIn$initModel);
			case 2:
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageLikedProducts,
					author$project$Main$likedProductsEmissionToCmd,
					A2(
						author$project$Page$LikedProducts$initModel,
						author$project$Main$getProductId(rec.i),
						rec.k));
			case 3:
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageHistory,
					author$project$Main$historyEmissionToCmd,
					A2(
						author$project$Page$History$initModel,
						author$project$Main$getProductId(rec.i),
						rec.k));
			case 4:
				var userId = result.a;
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageSoldProducts,
					author$project$Main$soldProductsPageEmissionToCmd,
					A2(
						author$project$Page$SoldProducts$initModel,
						userId,
						author$project$Main$getProductId(rec.i)));
			case 5:
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageBoughtProducts,
					author$project$Main$boughtProductsPageEmissionToCmd,
					A2(
						author$project$Page$BoughtProducts$initModel,
						author$project$Main$getProductId(rec.i),
						rec.k));
			case 6:
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageTradesInProgress,
					author$project$Main$tradingProductsEmissionToCmd,
					A2(
						author$project$Page$TradesInProgress$initModel,
						author$project$Main$getProductId(rec.i),
						rec.k));
			case 7:
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageTradesInPast,
					author$project$Main$tradedProductsEmissionToCmd,
					A2(
						author$project$Page$TradesInPast$initModel,
						author$project$Main$getProductId(rec.i),
						rec.k));
			case 8:
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageCommentedProducts,
					author$project$Main$commentedProductsEmissionToCmd,
					A2(
						author$project$Page$CommentedProducts$initModel,
						author$project$Main$getProductId(rec.i),
						rec.k));
			case 9:
				var _n2 = rec.i;
				if (_n2.$ === 10) {
					var exhibitionModel = _n2.a;
					return A3(
						author$project$Main$mapPageModel,
						author$project$Main$PageExhibition,
						author$project$Main$exhibitionPageEmissionToCmd,
						A3(author$project$Page$Exhibition$update, rec.k, author$project$Page$Exhibition$BackToEditPage, exhibitionModel));
				} else {
					return A3(author$project$Main$mapPageModel, author$project$Main$PageExhibition, author$project$Main$exhibitionPageEmissionToCmd, author$project$Page$Exhibition$initModel);
				}
			case 10:
				var _n3 = rec.i;
				if (_n3.$ === 10) {
					var pageModel = _n3.a;
					var _n4 = A2(author$project$Page$Exhibition$toConfirmPageMsgFromModel, rec.k, pageModel);
					if (!_n4.$) {
						var msg = _n4.a;
						return A3(
							author$project$Main$mapPageModel,
							author$project$Main$PageExhibition,
							author$project$Main$exhibitionPageEmissionToCmd,
							A3(author$project$Page$Exhibition$update, rec.k, msg, pageModel));
					} else {
						return _Utils_Tuple2(
							author$project$Main$PageExhibition(pageModel),
							elm$core$Platform$Cmd$none);
					}
				} else {
					return _Utils_Tuple2(rec.i, elm$core$Platform$Cmd$none);
				}
			case 11:
				var productId = result.a;
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageProduct,
					author$project$Main$productPageEmissionToCmd(rec.B),
					function () {
						var _n5 = A2(author$project$Main$getProductFromPage, productId, rec.i);
						if (!_n5.$) {
							var product = _n5.a;
							return A2(author$project$Page$Product$initModelFromProduct, rec.k, product);
						} else {
							return A2(author$project$Page$Product$initModel, rec.k, productId);
						}
					}());
			case 12:
				var tradeId = result.a;
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageTrade,
					author$project$Main$tradePageEmissionToCmd,
					function () {
						var _n6 = A2(author$project$Main$getTradeFromPage, tradeId, rec.i);
						if (!_n6.$) {
							var trade = _n6.a;
							return A2(author$project$Page$Trade$initModelFromTrade, rec.k, trade);
						} else {
							return A2(author$project$Page$Trade$initModelFromId, rec.k, tradeId);
						}
					}());
			case 13:
				var userId = result.a;
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageUser,
					author$project$Main$userPageEmissionToCmd,
					function () {
						var _n7 = A2(author$project$Main$getUserFromPage, userId, rec.i);
						if (!_n7.$) {
							var userWithName = _n7.a;
							return author$project$Page$User$initModelWithName(userWithName);
						} else {
							return A2(author$project$Page$User$initModelFromId, rec.k, userId);
						}
					}());
			case 14:
				var condition = result.a;
				return A3(
					author$project$Main$mapPageModel,
					author$project$Main$PageSearch,
					author$project$Main$searchPageEmissionToCmd,
					author$project$Page$Search$initModel(condition));
			case 15:
				return A3(author$project$Main$mapPageModel, author$project$Main$PageNotification, author$project$Main$notificationEmissionToCmd, author$project$Page$Notification$initModel);
			case 16:
				return _Utils_Tuple2(
					author$project$Main$PageAbout(author$project$Page$About$aboutModel),
					elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(
					author$project$Main$PageAbout(author$project$Page$About$privacyPolicyModel),
					elm$core$Platform$Cmd$none);
		}
	});
var author$project$PageLocation$About = {$: 16};
var author$project$PageLocation$AboutPrivacyPolicy = {$: 17};
var author$project$PageLocation$BoughtProducts = {$: 5};
var author$project$PageLocation$CommentedProducts = {$: 8};
var author$project$PageLocation$Exhibition = {$: 9};
var author$project$PageLocation$ExhibitionConfirm = {$: 10};
var author$project$PageLocation$History = {$: 3};
var author$project$PageLocation$LikedProducts = {$: 2};
var author$project$PageLocation$LogIn = {$: 1};
var author$project$PageLocation$Notification = {$: 15};
var author$project$PageLocation$Product = function (a) {
	return {$: 11, a: a};
};
var author$project$PageLocation$Search = function (a) {
	return {$: 14, a: a};
};
var author$project$PageLocation$SoldProducts = function (a) {
	return {$: 4, a: a};
};
var author$project$PageLocation$TradedProducts = {$: 7};
var author$project$PageLocation$TradingProducts = {$: 6};
var author$project$PageLocation$User = function (a) {
	return {$: 13, a: a};
};
var author$project$PageLocation$exhibitionConfirmParser = function (path) {
	return _Utils_eq(path, author$project$PageLocation$exhibitionConfirmPath) ? elm$core$Maybe$Just(0) : elm$core$Maybe$Nothing;
};
var author$project$PageLocation$fromUrl = function (url) {
	var _n0 = RomanErnst$erl$Erl$parse(
		elm$url$Url$toString(url));
	var path = _n0.c8;
	var hash = _n0.cQ;
	var fragmentDict = elm$core$Dict$fromList(
		RomanErnst$erl$Erl$parse('?' + hash).ef);
	return author$project$PageLocation$oneOf(
		A2(
			elm$core$List$map,
			function (f) {
				return f(path);
			},
			_List_fromArray(
				[
					A2(
					author$project$PageLocation$parserMap,
					elm$core$Basics$always(author$project$PageLocation$Home),
					author$project$PageLocation$homeParser),
					A2(
					author$project$PageLocation$parserMap,
					elm$core$Basics$always(author$project$PageLocation$LogIn),
					author$project$PageLocation$logInParser),
					A2(
					author$project$PageLocation$parserMap,
					elm$core$Basics$always(author$project$PageLocation$LikedProducts),
					author$project$PageLocation$likedProductsParser),
					A2(
					author$project$PageLocation$parserMap,
					elm$core$Basics$always(author$project$PageLocation$History),
					author$project$PageLocation$historyParser),
					A2(author$project$PageLocation$parserMap, author$project$PageLocation$SoldProducts, author$project$PageLocation$soldProductsParser),
					A2(
					author$project$PageLocation$parserMap,
					elm$core$Basics$always(author$project$PageLocation$BoughtProducts),
					author$project$PageLocation$boughtProductsParser),
					A2(
					author$project$PageLocation$parserMap,
					elm$core$Basics$always(author$project$PageLocation$TradingProducts),
					author$project$PageLocation$tradingProductsParser),
					A2(
					author$project$PageLocation$parserMap,
					elm$core$Basics$always(author$project$PageLocation$TradedProducts),
					author$project$PageLocation$tradedProductsParser),
					A2(
					author$project$PageLocation$parserMap,
					elm$core$Basics$always(author$project$PageLocation$CommentedProducts),
					author$project$PageLocation$commentedProductsParser),
					A2(
					author$project$PageLocation$parserMap,
					elm$core$Basics$always(author$project$PageLocation$Exhibition),
					author$project$PageLocation$exhibitionParser),
					A2(
					author$project$PageLocation$parserMap,
					elm$core$Basics$always(author$project$PageLocation$ExhibitionConfirm),
					author$project$PageLocation$exhibitionConfirmParser),
					A2(author$project$PageLocation$parserMap, author$project$PageLocation$Product, author$project$PageLocation$productParser),
					A2(author$project$PageLocation$parserMap, author$project$PageLocation$Trade, author$project$PageLocation$tradeParser),
					A2(author$project$PageLocation$parserMap, author$project$PageLocation$User, author$project$PageLocation$userParser),
					A2(
					author$project$PageLocation$parserMap,
					author$project$PageLocation$Search,
					author$project$PageLocation$searchParser(fragmentDict)),
					A2(
					author$project$PageLocation$parserMap,
					elm$core$Basics$always(author$project$PageLocation$Notification),
					author$project$PageLocation$notificationParser),
					A2(
					author$project$PageLocation$parserMap,
					elm$core$Basics$always(author$project$PageLocation$About),
					author$project$PageLocation$aboutParser),
					A2(
					author$project$PageLocation$parserMap,
					elm$core$Basics$always(author$project$PageLocation$AboutPrivacyPolicy),
					author$project$PageLocation$aboutPrivacyPolicyParser)
				])));
};
var author$project$Main$urlParser = F2(
	function (_n0, url) {
		var rec = _n0;
		var _n1 = function () {
			var _n2 = author$project$PageLocation$fromUrl(url);
			if (!_n2.$) {
				var urlParserResult = _n2.a;
				return A2(author$project$Main$urlParserResultToPageAndCmd, rec, urlParserResult);
			} else {
				return author$project$Main$pageNotFound;
			}
		}();
		var page = _n1.a;
		var emissions = _n1.b;
		return _Utils_Tuple2(
			_Utils_update(
				rec,
				{i: page}),
			emissions);
	});
var author$project$Page$Component$ProductEditor$InputImageList = function (a) {
	return {$: 7, a: a};
};
var author$project$Page$Exhibition$MsgByProductEditor = function (a) {
	return {$: 4, a: a};
};
var author$project$Page$Product$MsgByProductEditor = function (a) {
	return {$: 14, a: a};
};
var author$project$Page$SignUp$ReceiveUserImage = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$User$MsgChangeProfileResponse = function (a) {
	return {$: 6, a: a};
};
var elm$browser$Browser$Navigation$back = F2(
	function (key, n) {
		return A2(_Browser_go, key, -n);
	});
var elm$browser$Browser$Navigation$load = _Browser_load;
var author$project$Main$update = F2(
	function (msg, _n0) {
		var rec = _n0;
		switch (msg.$) {
			case 0:
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{bd: true}),
					elm$core$Platform$Cmd$none);
			case 1:
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{bd: false}),
					elm$core$Platform$Cmd$none);
			case 2:
				var url = msg.a;
				return A2(author$project$Main$urlParser, rec, url);
			case 3:
				var urlRequest = msg.a;
				return _Utils_Tuple2(
					rec,
					function () {
						if (!urlRequest.$) {
							var url = urlRequest.a;
							return A2(
								elm$browser$Browser$Navigation$pushUrl,
								rec.B,
								elm$url$Url$toString(url));
						} else {
							var urlString = urlRequest.a;
							return elm$browser$Browser$Navigation$load(urlString);
						}
					}());
			case 4:
				var logMessage = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{
							w: elm$core$Maybe$Just(logMessage)
						}),
					elm$core$Platform$Cmd$none);
			case 6:
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{
							k: author$project$Data$LogInState$None,
							w: elm$core$Maybe$Just('ログアウトしました')
						}),
					elm$core$Platform$Cmd$none);
			case 5:
				var result = msg.a;
				if (!result.$) {
					var token = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							rec,
							{
								k: author$project$Data$LogInState$LoadingProfile(token),
								w: elm$core$Maybe$Just('ログインしました')
							}),
						elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2(author$project$Api$getMyNameAndLikedProductsId, token, author$project$Main$GetMyProfileAndLikedProductIdsResponse),
									author$project$Main$saveRefreshTokenToLocalStorage(
									author$project$Api$tokenGetRefreshTokenAsString(token))
								])));
				} else {
					var string = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							rec,
							{
								w: elm$core$Maybe$Just('ログインに失敗しました' + string)
							}),
						elm$core$Platform$Cmd$none);
				}
			case 7:
				var response = msg.a;
				if (!response.$) {
					var _n5 = author$project$Page$Home$initModel(
						author$project$Main$getProductId(rec.i));
					var newModel = _n5.a;
					var emissions = _n5.b;
					return _Utils_Tuple2(
						_Utils_update(
							rec,
							{
								w: elm$core$Maybe$Just('新規登録完了'),
								i: author$project$Main$PageHome(newModel)
							}),
						elm$core$Platform$Cmd$batch(
							_Utils_ap(
								_List_fromArray(
									[
										A2(
										elm$browser$Browser$Navigation$pushUrl,
										rec.B,
										author$project$PageLocation$toUrlAsString(author$project$PageLocation$Home))
									]),
								A2(elm$core$List$map, author$project$Main$homePageEmissionToCmd, emissions))));
				} else {
					var e = response.a;
					return _Utils_Tuple2(rec, elm$core$Platform$Cmd$none);
				}
			case 8:
				var dataUrlList = msg.a;
				var _n6 = rec.i;
				switch (_n6.$) {
					case 10:
						var exhibitionPageModel = _n6.a;
						var _n7 = A3(
							author$project$Page$Exhibition$update,
							rec.k,
							author$project$Page$Exhibition$MsgByProductEditor(
								author$project$Page$Component$ProductEditor$InputImageList(dataUrlList)),
							exhibitionPageModel);
						var newModel = _n7.a;
						var emissions = _n7.b;
						return _Utils_Tuple2(
							_Utils_update(
								rec,
								{
									i: author$project$Main$PageExhibition(newModel)
								}),
							elm$core$Platform$Cmd$batch(
								A2(elm$core$List$map, author$project$Main$exhibitionPageEmissionToCmd, emissions)));
					case 11:
						var productPageModel = _n6.a;
						var _n8 = A2(
							author$project$Page$Product$update,
							author$project$Page$Product$MsgByProductEditor(
								author$project$Page$Component$ProductEditor$InputImageList(dataUrlList)),
							productPageModel);
						var newModel = _n8.a;
						var emissions = _n8.b;
						return _Utils_Tuple2(
							_Utils_update(
								rec,
								{
									i: author$project$Main$PageProduct(newModel)
								}),
							elm$core$Platform$Cmd$batch(
								A2(
									elm$core$List$map,
									author$project$Main$productPageEmissionToCmd(rec.B),
									emissions)));
					default:
						return _Utils_Tuple2(rec, elm$core$Platform$Cmd$none);
				}
			case 9:
				var image = msg.a;
				var _n9 = rec.i;
				if (_n9.$ === 1) {
					var pageModel = _n9.a;
					var _n10 = A2(
						author$project$Page$SignUp$update,
						author$project$Page$SignUp$ReceiveUserImage(image),
						pageModel);
					var newModel = _n10.a;
					var emissionList = _n10.b;
					return _Utils_Tuple2(
						_Utils_update(
							rec,
							{
								i: author$project$Main$PageSignUp(newModel)
							}),
						elm$core$Platform$Cmd$batch(
							A2(elm$core$List$map, author$project$Main$signUpPageEmissionToCmd, emissionList)));
				} else {
					return _Utils_Tuple2(rec, elm$core$Platform$Cmd$none);
				}
			case 16:
				var pageMsg = msg.a;
				var _n11 = A2(author$project$Main$updatePageMsg, pageMsg, rec);
				var pageModel = _n11.a;
				var cmd = _n11.b;
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{i: pageModel}),
					cmd);
			case 10:
				var response = msg.a;
				return _Utils_Tuple2(
					function () {
						if (!response.$) {
							var userWithProfile = response.a;
							return _Utils_update(
								rec,
								{
									k: A2(author$project$Data$LogInState$addUserWithNameAndLikedProductIds, userWithProfile, rec.k)
								});
						} else {
							var string = response.a;
							return _Utils_update(
								rec,
								{
									w: elm$core$Maybe$Just('プロフィール情報の取得に失敗しました' + string)
								});
						}
					}(),
					elm$core$Platform$Cmd$none);
			case 11:
				var response = msg.a;
				return _Utils_Tuple2(
					function () {
						if (!response.$) {
							var productDetail = response.a;
							return _Utils_update(
								rec,
								{
									w: elm$core$Maybe$Just('出品しました')
								});
						} else {
							var errorMessage = response.a;
							return _Utils_update(
								rec,
								{
									w: elm$core$Maybe$Just('出品できませんでした ' + errorMessage)
								});
						}
					}(),
					elm$core$Platform$Cmd$none);
			case 12:
				var id = msg.a;
				var response = msg.b;
				var _n14 = A4(author$project$Main$updateLikedCountInEachPageProduct, rec.B, id, response, rec.i);
				var page = _n14.a;
				var cmd = _n14.b;
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{
							k: A2(author$project$Data$LogInState$likeProduct, id, rec.k),
							i: page
						}),
					cmd);
			case 13:
				var id = msg.a;
				var response = msg.b;
				var _n15 = A4(author$project$Main$updateLikedCountInEachPageProduct, rec.B, id, response, rec.i);
				var page = _n15.a;
				var cmd = _n15.b;
				return _Utils_Tuple2(
					_Utils_update(
						rec,
						{
							k: A2(author$project$Data$LogInState$unlikeProduct, id, rec.k),
							i: page
						}),
					cmd);
			case 14:
				var response = msg.a;
				if (!response.$) {
					var newProfile = response.a;
					var _n17 = rec.i;
					if (_n17.$ === 13) {
						var profileModel = _n17.a;
						var _n18 = A2(
							author$project$Page$User$update,
							author$project$Page$User$MsgChangeProfileResponse(response),
							profileModel);
						var newModel = _n18.a;
						var emissions = _n18.b;
						return _Utils_Tuple2(
							_Utils_update(
								rec,
								{
									k: A2(
										author$project$Data$LogInState$updateWithName,
										author$project$Data$User$withProfileToWithName(newProfile),
										rec.k),
									i: author$project$Main$PageUser(newModel)
								}),
							elm$core$Platform$Cmd$batch(
								A2(elm$core$List$map, author$project$Main$userPageEmissionToCmd, emissions)));
					} else {
						return _Utils_Tuple2(rec, elm$core$Platform$Cmd$none);
					}
				} else {
					var text = response.a;
					return _Utils_Tuple2(
						_Utils_update(
							rec,
							{
								w: elm$core$Maybe$Just('プロフィール更新に失敗しました ' + text)
							}),
						elm$core$Platform$Cmd$none);
				}
			case 15:
				return _Utils_Tuple2(
					rec,
					A2(elm$browser$Browser$Navigation$back, rec.B, 1));
			case 17:
				var result = msg.a;
				if (!result.$) {
					var posixAndZone = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							rec,
							{
								b$: elm$core$Maybe$Just(posixAndZone)
							}),
						elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							rec,
							{
								w: elm$core$Maybe$Just('時間の取得に失敗しました')
							}),
						elm$core$Platform$Cmd$none);
				}
			default:
				var result = msg.a;
				if (!result.$) {
					var url = result.a;
					return _Utils_Tuple2(
						rec,
						elm$browser$Browser$Navigation$load(
							elm$url$Url$toString(url)));
				} else {
					var string = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							rec,
							{
								w: elm$core$Maybe$Just('ログイン用のURL取得に失敗' + string)
							}),
						elm$core$Platform$Cmd$none);
				}
		}
	});
var author$project$BasicParts$Home = 0;
var author$project$BasicParts$Notification = 2;
var author$project$BasicParts$Search = 1;
var author$project$BasicParts$User = 3;
var rtfeldman$elm_css$Css$Preprocess$ApplyStyles = function (a) {
	return {$: 6, a: a};
};
var rtfeldman$elm_css$Css$batch = rtfeldman$elm_css$Css$Preprocess$ApplyStyles;
var rtfeldman$elm_css$Css$Structure$Compatible = 0;
var rtfeldman$elm_css$Css$block = {p: 0, ey: 'block'};
var rtfeldman$elm_css$Css$Preprocess$AppendProperty = function (a) {
	return {$: 0, a: a};
};
var rtfeldman$elm_css$Css$property = F2(
	function (key, value) {
		return rtfeldman$elm_css$Css$Preprocess$AppendProperty(key + (':' + value));
	});
var rtfeldman$elm_css$Css$prop1 = F2(
	function (key, arg) {
		return A2(rtfeldman$elm_css$Css$property, key, arg.ey);
	});
var rtfeldman$elm_css$Css$display = rtfeldman$elm_css$Css$prop1('display');
var author$project$Page$Style$displayGridAndGap = function (gap) {
	var block = rtfeldman$elm_css$Css$block;
	return rtfeldman$elm_css$Css$batch(
		_Utils_ap(
			_List_fromArray(
				[
					rtfeldman$elm_css$Css$display(
					_Utils_update(
						block,
						{ey: 'grid'}))
				]),
			(!gap) ? _List_Nil : _List_fromArray(
				[
					A2(
					rtfeldman$elm_css$Css$property,
					'gap',
					elm$core$String$fromInt(gap) + 'px')
				])));
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
var rtfeldman$elm_css$Css$backgroundColor = function (c) {
	return A2(rtfeldman$elm_css$Css$property, 'background-color', c.ey);
};
var rtfeldman$elm_css$Css$bottom = rtfeldman$elm_css$Css$prop1('bottom');
var rtfeldman$elm_css$Css$fixed = {aP: 0, a$: 0, bB: 0, ey: 'fixed'};
var rtfeldman$elm_css$Css$height = rtfeldman$elm_css$Css$prop1('height');
var rtfeldman$elm_css$Css$PercentageUnits = 0;
var rtfeldman$elm_css$Css$Internal$lengthConverter = F3(
	function (units, unitLabel, numericValue) {
		return {
			ck: 0,
			cy: 0,
			at: 0,
			u: 0,
			aY: 0,
			ay: 0,
			Q: 0,
			az: 0,
			aA: 0,
			ab: 0,
			ac: 0,
			H: 0,
			U: numericValue,
			aI: 0,
			aK: unitLabel,
			ba: units,
			ey: _Utils_ap(
				elm$core$String$fromFloat(numericValue),
				unitLabel)
		};
	});
var rtfeldman$elm_css$Css$pct = A2(rtfeldman$elm_css$Css$Internal$lengthConverter, 0, '%');
var rtfeldman$elm_css$Css$position = rtfeldman$elm_css$Css$prop1('position');
var rtfeldman$elm_css$Css$PxUnits = 0;
var rtfeldman$elm_css$Css$px = A2(rtfeldman$elm_css$Css$Internal$lengthConverter, 0, 'px');
var rtfeldman$elm_css$Css$cssFunction = F2(
	function (funcName, args) {
		return funcName + ('(' + (A2(elm$core$String$join, ', ', args) + ')'));
	});
var rtfeldman$elm_css$Css$rgb = F3(
	function (r, g, b) {
		return {
			aO: 1,
			aR: b,
			dQ: 0,
			aV: g,
			a3: r,
			ey: A2(
				rtfeldman$elm_css$Css$cssFunction,
				'rgb',
				A2(
					elm$core$List$map,
					elm$core$String$fromInt,
					_List_fromArray(
						[r, g, b])))
		};
	});
var rtfeldman$elm_css$Css$width = rtfeldman$elm_css$Css$prop1('width');
var rtfeldman$elm_css$Css$UnitlessInteger = 0;
var rtfeldman$elm_css$Css$zero = {aY: 0, ay: 0, Q: 0, az: 0, aA: 0, ab: 0, ac: 0, ea: 0, U: 0, bv: 0, aK: '', ba: 0, ey: '0'};
var rtfeldman$elm_css$VirtualDom$Styled$Node = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var rtfeldman$elm_css$VirtualDom$Styled$node = rtfeldman$elm_css$VirtualDom$Styled$Node;
var rtfeldman$elm_css$Html$Styled$node = rtfeldman$elm_css$VirtualDom$Styled$node;
var rtfeldman$elm_css$Html$Styled$div = rtfeldman$elm_css$Html$Styled$node('div');
var elm$virtual_dom$VirtualDom$property = F2(
	function (key, value) {
		return A2(
			_VirtualDom_property,
			_VirtualDom_noInnerHtmlOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var rtfeldman$elm_css$VirtualDom$Styled$Attribute = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var Skinney$murmur3$Murmur3$HashData = F4(
	function (shift, seed, hash, charsProcessed) {
		return {ao: charsProcessed, cQ: hash, ag: seed, aF: shift};
	});
var Skinney$murmur3$Murmur3$c1 = 3432918353;
var Skinney$murmur3$Murmur3$c2 = 461845907;
var Skinney$murmur3$Murmur3$multiplyBy = F2(
	function (b, a) {
		return ((a & 65535) * b) + ((((a >>> 16) * b) & 65535) << 16);
	});
var elm$core$Bitwise$or = _Bitwise_or;
var Skinney$murmur3$Murmur3$rotlBy = F2(
	function (b, a) {
		return (a << b) | (a >>> (32 - b));
	});
var elm$core$Bitwise$xor = _Bitwise_xor;
var Skinney$murmur3$Murmur3$finalize = function (data) {
	var acc = data.cQ ? (data.ag ^ A2(
		Skinney$murmur3$Murmur3$multiplyBy,
		Skinney$murmur3$Murmur3$c2,
		A2(
			Skinney$murmur3$Murmur3$rotlBy,
			15,
			A2(Skinney$murmur3$Murmur3$multiplyBy, Skinney$murmur3$Murmur3$c1, data.cQ)))) : data.ag;
	var h0 = acc ^ data.ao;
	var h1 = A2(Skinney$murmur3$Murmur3$multiplyBy, 2246822507, h0 ^ (h0 >>> 16));
	var h2 = A2(Skinney$murmur3$Murmur3$multiplyBy, 3266489909, h1 ^ (h1 >>> 13));
	return (h2 ^ (h2 >>> 16)) >>> 0;
};
var Skinney$murmur3$Murmur3$mix = F2(
	function (h1, k1) {
		return A2(
			Skinney$murmur3$Murmur3$multiplyBy,
			5,
			A2(
				Skinney$murmur3$Murmur3$rotlBy,
				13,
				h1 ^ A2(
					Skinney$murmur3$Murmur3$multiplyBy,
					Skinney$murmur3$Murmur3$c2,
					A2(
						Skinney$murmur3$Murmur3$rotlBy,
						15,
						A2(Skinney$murmur3$Murmur3$multiplyBy, Skinney$murmur3$Murmur3$c1, k1))))) + 3864292196;
	});
var Skinney$murmur3$Murmur3$hashFold = F2(
	function (c, data) {
		var res = data.cQ | ((255 & elm$core$Char$toCode(c)) << data.aF);
		var _n0 = data.aF;
		if (_n0 === 24) {
			return {
				ao: data.ao + 1,
				cQ: 0,
				ag: A2(Skinney$murmur3$Murmur3$mix, data.ag, res),
				aF: 0
			};
		} else {
			return {ao: data.ao + 1, cQ: res, ag: data.ag, aF: data.aF + 8};
		}
	});
var elm$core$String$foldl = _String_foldl;
var Skinney$murmur3$Murmur3$hashString = F2(
	function (seed, str) {
		return Skinney$murmur3$Murmur3$finalize(
			A3(
				elm$core$String$foldl,
				Skinney$murmur3$Murmur3$hashFold,
				A4(Skinney$murmur3$Murmur3$HashData, 0, seed, 0, 0),
				str));
	});
var elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var elm$core$String$cons = _String_cons;
var rtfeldman$elm_css$Css$Preprocess$stylesheet = function (snippets) {
	return {cB: elm$core$Maybe$Nothing, cU: _List_Nil, c6: _List_Nil, dq: snippets};
};
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
var rtfeldman$elm_css$Css$Preprocess$unwrapSnippet = function (_n0) {
	var declarations = _n0;
	return declarations;
};
var elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return elm$core$Maybe$Just(xs);
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors = function (declarations) {
	collectSelectors:
	while (true) {
		if (!declarations.b) {
			return _List_Nil;
		} else {
			if (!declarations.a.$) {
				var _n1 = declarations.a.a;
				var firstSelector = _n1.a;
				var otherSelectors = _n1.b;
				var rest = declarations.b;
				return _Utils_ap(
					A2(elm$core$List$cons, firstSelector, otherSelectors),
					rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors(rest));
			} else {
				var rest = declarations.b;
				var $temp$declarations = rest;
				declarations = $temp$declarations;
				continue collectSelectors;
			}
		}
	}
};
var rtfeldman$elm_css$Css$Preprocess$Resolve$last = function (list) {
	last:
	while (true) {
		if (!list.b) {
			return elm$core$Maybe$Nothing;
		} else {
			if (!list.b.b) {
				var singleton = list.a;
				return elm$core$Maybe$Just(singleton);
			} else {
				var rest = list.b;
				var $temp$list = rest;
				list = $temp$list;
				continue last;
			}
		}
	}
};
var rtfeldman$elm_css$Css$Preprocess$Resolve$lastDeclaration = function (declarations) {
	lastDeclaration:
	while (true) {
		if (!declarations.b) {
			return elm$core$Maybe$Nothing;
		} else {
			if (!declarations.b.b) {
				var x = declarations.a;
				return elm$core$Maybe$Just(
					_List_fromArray(
						[x]));
			} else {
				var xs = declarations.b;
				var $temp$declarations = xs;
				declarations = $temp$declarations;
				continue lastDeclaration;
			}
		}
	}
};
var rtfeldman$elm_css$Css$Preprocess$Resolve$oneOf = function (maybes) {
	oneOf:
	while (true) {
		if (!maybes.b) {
			return elm$core$Maybe$Nothing;
		} else {
			var maybe = maybes.a;
			var rest = maybes.b;
			if (maybe.$ === 1) {
				var $temp$maybes = rest;
				maybes = $temp$maybes;
				continue oneOf;
			} else {
				return maybe;
			}
		}
	}
};
var rtfeldman$elm_css$Css$Structure$FontFeatureValues = function (a) {
	return {$: 9, a: a};
};
var rtfeldman$elm_css$Css$Preprocess$Resolve$resolveFontFeatureValues = function (tuples) {
	var expandTuples = function (tuplesToExpand) {
		if (!tuplesToExpand.b) {
			return _List_Nil;
		} else {
			var properties = tuplesToExpand.a;
			var rest = tuplesToExpand.b;
			return A2(
				elm$core$List$cons,
				properties,
				expandTuples(rest));
		}
	};
	var newTuples = expandTuples(tuples);
	return _List_fromArray(
		[
			rtfeldman$elm_css$Css$Structure$FontFeatureValues(newTuples)
		]);
};
var rtfeldman$elm_css$Css$Structure$DocumentRule = F5(
	function (a, b, c, d, e) {
		return {$: 3, a: a, b: b, c: c, d: d, e: e};
	});
var rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule = F5(
	function (str1, str2, str3, str4, declaration) {
		if (!declaration.$) {
			var structureStyleBlock = declaration.a;
			return A5(rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4, structureStyleBlock);
		} else {
			return declaration;
		}
	});
var rtfeldman$elm_css$Css$Structure$MediaRule = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var rtfeldman$elm_css$Css$Structure$SupportsRule = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule = F2(
	function (mediaQueries, declaration) {
		switch (declaration.$) {
			case 0:
				var structureStyleBlock = declaration.a;
				return A2(
					rtfeldman$elm_css$Css$Structure$MediaRule,
					mediaQueries,
					_List_fromArray(
						[structureStyleBlock]));
			case 1:
				var newMediaQueries = declaration.a;
				var structureStyleBlocks = declaration.b;
				return A2(
					rtfeldman$elm_css$Css$Structure$MediaRule,
					_Utils_ap(mediaQueries, newMediaQueries),
					structureStyleBlocks);
			case 2:
				var str = declaration.a;
				var declarations = declaration.b;
				return A2(
					rtfeldman$elm_css$Css$Structure$SupportsRule,
					str,
					A2(
						elm$core$List$map,
						rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule(mediaQueries),
						declarations));
			case 3:
				var str1 = declaration.a;
				var str2 = declaration.b;
				var str3 = declaration.c;
				var str4 = declaration.d;
				var structureStyleBlock = declaration.e;
				return A5(rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4, structureStyleBlock);
			case 4:
				return declaration;
			case 5:
				return declaration;
			case 6:
				return declaration;
			case 7:
				return declaration;
			case 8:
				return declaration;
			default:
				return declaration;
		}
	});
var rtfeldman$elm_css$Css$Structure$CounterStyle = function (a) {
	return {$: 8, a: a};
};
var rtfeldman$elm_css$Css$Structure$FontFace = function (a) {
	return {$: 5, a: a};
};
var rtfeldman$elm_css$Css$Structure$Keyframes = function (a) {
	return {$: 6, a: a};
};
var rtfeldman$elm_css$Css$Structure$PageRule = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var rtfeldman$elm_css$Css$Structure$Selector = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var rtfeldman$elm_css$Css$Structure$StyleBlock = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration = function (a) {
	return {$: 0, a: a};
};
var rtfeldman$elm_css$Css$Structure$Viewport = function (a) {
	return {$: 7, a: a};
};
var rtfeldman$elm_css$Css$Structure$mapLast = F2(
	function (update, list) {
		if (!list.b) {
			return list;
		} else {
			if (!list.b.b) {
				var only = list.a;
				return _List_fromArray(
					[
						update(only)
					]);
			} else {
				var first = list.a;
				var rest = list.b;
				return A2(
					elm$core$List$cons,
					first,
					A2(rtfeldman$elm_css$Css$Structure$mapLast, update, rest));
			}
		}
	});
var rtfeldman$elm_css$Css$Structure$withPropertyAppended = F2(
	function (property, _n0) {
		var firstSelector = _n0.a;
		var otherSelectors = _n0.b;
		var properties = _n0.c;
		return A3(
			rtfeldman$elm_css$Css$Structure$StyleBlock,
			firstSelector,
			otherSelectors,
			_Utils_ap(
				properties,
				_List_fromArray(
					[property])));
	});
var rtfeldman$elm_css$Css$Structure$appendProperty = F2(
	function (property, declarations) {
		if (!declarations.b) {
			return declarations;
		} else {
			if (!declarations.b.b) {
				switch (declarations.a.$) {
					case 0:
						var styleBlock = declarations.a.a;
						return _List_fromArray(
							[
								rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
								A2(rtfeldman$elm_css$Css$Structure$withPropertyAppended, property, styleBlock))
							]);
					case 1:
						var _n1 = declarations.a;
						var mediaQueries = _n1.a;
						var styleBlocks = _n1.b;
						return _List_fromArray(
							[
								A2(
								rtfeldman$elm_css$Css$Structure$MediaRule,
								mediaQueries,
								A2(
									rtfeldman$elm_css$Css$Structure$mapLast,
									rtfeldman$elm_css$Css$Structure$withPropertyAppended(property),
									styleBlocks))
							]);
					default:
						return declarations;
				}
			} else {
				var first = declarations.a;
				var rest = declarations.b;
				return A2(
					elm$core$List$cons,
					first,
					A2(rtfeldman$elm_css$Css$Structure$appendProperty, property, rest));
			}
		}
	});
var rtfeldman$elm_css$Css$Structure$appendToLastSelector = F2(
	function (f, styleBlock) {
		if (!styleBlock.b.b) {
			var only = styleBlock.a;
			var properties = styleBlock.c;
			return _List_fromArray(
				[
					A3(rtfeldman$elm_css$Css$Structure$StyleBlock, only, _List_Nil, properties),
					A3(
					rtfeldman$elm_css$Css$Structure$StyleBlock,
					f(only),
					_List_Nil,
					_List_Nil)
				]);
		} else {
			var first = styleBlock.a;
			var rest = styleBlock.b;
			var properties = styleBlock.c;
			var newRest = A2(elm$core$List$map, f, rest);
			var newFirst = f(first);
			return _List_fromArray(
				[
					A3(rtfeldman$elm_css$Css$Structure$StyleBlock, first, rest, properties),
					A3(rtfeldman$elm_css$Css$Structure$StyleBlock, newFirst, newRest, _List_Nil)
				]);
		}
	});
var rtfeldman$elm_css$Css$Structure$applyPseudoElement = F2(
	function (pseudo, _n0) {
		var sequence = _n0.a;
		var selectors = _n0.b;
		return A3(
			rtfeldman$elm_css$Css$Structure$Selector,
			sequence,
			selectors,
			elm$core$Maybe$Just(pseudo));
	});
var rtfeldman$elm_css$Css$Structure$appendPseudoElementToLastSelector = F2(
	function (pseudo, styleBlock) {
		return A2(
			rtfeldman$elm_css$Css$Structure$appendToLastSelector,
			rtfeldman$elm_css$Css$Structure$applyPseudoElement(pseudo),
			styleBlock);
	});
var rtfeldman$elm_css$Css$Structure$CustomSelector = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var rtfeldman$elm_css$Css$Structure$TypeSelectorSequence = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence = function (a) {
	return {$: 1, a: a};
};
var rtfeldman$elm_css$Css$Structure$appendRepeatable = F2(
	function (selector, sequence) {
		switch (sequence.$) {
			case 0:
				var typeSelector = sequence.a;
				var list = sequence.b;
				return A2(
					rtfeldman$elm_css$Css$Structure$TypeSelectorSequence,
					typeSelector,
					_Utils_ap(
						list,
						_List_fromArray(
							[selector])));
			case 1:
				var list = sequence.a;
				return rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence(
					_Utils_ap(
						list,
						_List_fromArray(
							[selector])));
			default:
				var str = sequence.a;
				var list = sequence.b;
				return A2(
					rtfeldman$elm_css$Css$Structure$CustomSelector,
					str,
					_Utils_ap(
						list,
						_List_fromArray(
							[selector])));
		}
	});
var rtfeldman$elm_css$Css$Structure$appendRepeatableWithCombinator = F2(
	function (selector, list) {
		if (!list.b) {
			return _List_Nil;
		} else {
			if (!list.b.b) {
				var _n1 = list.a;
				var combinator = _n1.a;
				var sequence = _n1.b;
				return _List_fromArray(
					[
						_Utils_Tuple2(
						combinator,
						A2(rtfeldman$elm_css$Css$Structure$appendRepeatable, selector, sequence))
					]);
			} else {
				var first = list.a;
				var rest = list.b;
				return A2(
					elm$core$List$cons,
					first,
					A2(rtfeldman$elm_css$Css$Structure$appendRepeatableWithCombinator, selector, rest));
			}
		}
	});
var rtfeldman$elm_css$Css$Structure$appendRepeatableSelector = F2(
	function (repeatableSimpleSelector, selector) {
		if (!selector.b.b) {
			var sequence = selector.a;
			var pseudoElement = selector.c;
			return A3(
				rtfeldman$elm_css$Css$Structure$Selector,
				A2(rtfeldman$elm_css$Css$Structure$appendRepeatable, repeatableSimpleSelector, sequence),
				_List_Nil,
				pseudoElement);
		} else {
			var firstSelector = selector.a;
			var tuples = selector.b;
			var pseudoElement = selector.c;
			return A3(
				rtfeldman$elm_css$Css$Structure$Selector,
				firstSelector,
				A2(rtfeldman$elm_css$Css$Structure$appendRepeatableWithCombinator, repeatableSimpleSelector, tuples),
				pseudoElement);
		}
	});
var rtfeldman$elm_css$Css$Structure$appendRepeatableToLastSelector = F2(
	function (selector, styleBlock) {
		return A2(
			rtfeldman$elm_css$Css$Structure$appendToLastSelector,
			rtfeldman$elm_css$Css$Structure$appendRepeatableSelector(selector),
			styleBlock);
	});
var rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock = F2(
	function (update, declarations) {
		_n0$12:
		while (true) {
			if (!declarations.b) {
				return declarations;
			} else {
				if (!declarations.b.b) {
					switch (declarations.a.$) {
						case 0:
							var styleBlock = declarations.a.a;
							return A2(
								elm$core$List$map,
								rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration,
								update(styleBlock));
						case 1:
							if (declarations.a.b.b) {
								if (!declarations.a.b.b.b) {
									var _n1 = declarations.a;
									var mediaQueries = _n1.a;
									var _n2 = _n1.b;
									var styleBlock = _n2.a;
									return _List_fromArray(
										[
											A2(
											rtfeldman$elm_css$Css$Structure$MediaRule,
											mediaQueries,
											update(styleBlock))
										]);
								} else {
									var _n3 = declarations.a;
									var mediaQueries = _n3.a;
									var _n4 = _n3.b;
									var first = _n4.a;
									var rest = _n4.b;
									var _n5 = A2(
										rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock,
										update,
										_List_fromArray(
											[
												A2(rtfeldman$elm_css$Css$Structure$MediaRule, mediaQueries, rest)
											]));
									if ((_n5.b && (_n5.a.$ === 1)) && (!_n5.b.b)) {
										var _n6 = _n5.a;
										var newMediaQueries = _n6.a;
										var newStyleBlocks = _n6.b;
										return _List_fromArray(
											[
												A2(
												rtfeldman$elm_css$Css$Structure$MediaRule,
												newMediaQueries,
												A2(elm$core$List$cons, first, newStyleBlocks))
											]);
									} else {
										var newDeclarations = _n5;
										return newDeclarations;
									}
								}
							} else {
								break _n0$12;
							}
						case 2:
							var _n7 = declarations.a;
							var str = _n7.a;
							var nestedDeclarations = _n7.b;
							return _List_fromArray(
								[
									A2(
									rtfeldman$elm_css$Css$Structure$SupportsRule,
									str,
									A2(rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock, update, nestedDeclarations))
								]);
						case 3:
							var _n8 = declarations.a;
							var str1 = _n8.a;
							var str2 = _n8.b;
							var str3 = _n8.c;
							var str4 = _n8.d;
							var styleBlock = _n8.e;
							return A2(
								elm$core$List$map,
								A4(rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4),
								update(styleBlock));
						case 4:
							var _n9 = declarations.a;
							return declarations;
						case 5:
							return declarations;
						case 6:
							return declarations;
						case 7:
							return declarations;
						case 8:
							return declarations;
						default:
							return declarations;
					}
				} else {
					break _n0$12;
				}
			}
		}
		var first = declarations.a;
		var rest = declarations.b;
		return A2(
			elm$core$List$cons,
			first,
			A2(rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock, update, rest));
	});
var rtfeldman$elm_css$Css$Structure$styleBlockToMediaRule = F2(
	function (mediaQueries, declaration) {
		if (!declaration.$) {
			var styleBlock = declaration.a;
			return A2(
				rtfeldman$elm_css$Css$Structure$MediaRule,
				mediaQueries,
				_List_fromArray(
					[styleBlock]));
		} else {
			return declaration;
		}
	});
var rtfeldman$elm_css$Hash$murmurSeed = 15739;
var elm$core$Basics$modBy = _Basics_modBy;
var rtfeldman$elm_hex$Hex$unsafeToDigit = function (num) {
	unsafeToDigit:
	while (true) {
		switch (num) {
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
			case 9:
				return '9';
			case 10:
				return 'a';
			case 11:
				return 'b';
			case 12:
				return 'c';
			case 13:
				return 'd';
			case 14:
				return 'e';
			case 15:
				return 'f';
			default:
				var $temp$num = num;
				num = $temp$num;
				continue unsafeToDigit;
		}
	}
};
var rtfeldman$elm_hex$Hex$unsafePositiveToDigits = F2(
	function (digits, num) {
		unsafePositiveToDigits:
		while (true) {
			if (num < 16) {
				return A2(
					elm$core$List$cons,
					rtfeldman$elm_hex$Hex$unsafeToDigit(num),
					digits);
			} else {
				var $temp$digits = A2(
					elm$core$List$cons,
					rtfeldman$elm_hex$Hex$unsafeToDigit(
						A2(elm$core$Basics$modBy, 16, num)),
					digits),
					$temp$num = (num / 16) | 0;
				digits = $temp$digits;
				num = $temp$num;
				continue unsafePositiveToDigits;
			}
		}
	});
var rtfeldman$elm_hex$Hex$toString = function (num) {
	return elm$core$String$fromList(
		(num < 0) ? A2(
			elm$core$List$cons,
			'-',
			A2(rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, -num)) : A2(rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, num));
};
var rtfeldman$elm_css$Hash$fromString = function (str) {
	return A2(
		elm$core$String$cons,
		'_',
		rtfeldman$elm_hex$Hex$toString(
			A2(Skinney$murmur3$Murmur3$hashString, rtfeldman$elm_css$Hash$murmurSeed, str)));
};
var rtfeldman$elm_css$Css$Preprocess$Resolve$applyNestedStylesToLast = F4(
	function (nestedStyles, rest, f, declarations) {
		var withoutParent = function (decls) {
			return A2(
				elm$core$Maybe$withDefault,
				_List_Nil,
				elm$core$List$tail(decls));
		};
		var nextResult = A2(
			rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
			rest,
			A2(
				elm$core$Maybe$withDefault,
				_List_Nil,
				rtfeldman$elm_css$Css$Preprocess$Resolve$lastDeclaration(declarations)));
		var newDeclarations = function () {
			var _n14 = _Utils_Tuple2(
				elm$core$List$head(nextResult),
				rtfeldman$elm_css$Css$Preprocess$Resolve$last(declarations));
			if ((!_n14.a.$) && (!_n14.b.$)) {
				var nextResultParent = _n14.a.a;
				var originalParent = _n14.b.a;
				return _Utils_ap(
					A2(
						elm$core$List$take,
						elm$core$List$length(declarations) - 1,
						declarations),
					_List_fromArray(
						[
							(!_Utils_eq(originalParent, nextResultParent)) ? nextResultParent : originalParent
						]));
			} else {
				return declarations;
			}
		}();
		var insertStylesToNestedDecl = function (lastDecl) {
			return elm$core$List$concat(
				A2(
					rtfeldman$elm_css$Css$Structure$mapLast,
					rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles(nestedStyles),
					A2(
						elm$core$List$map,
						elm$core$List$singleton,
						A2(rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock, f, lastDecl))));
		};
		var initialResult = A2(
			elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				elm$core$Maybe$map,
				insertStylesToNestedDecl,
				rtfeldman$elm_css$Css$Preprocess$Resolve$lastDeclaration(declarations)));
		return _Utils_ap(
			newDeclarations,
			_Utils_ap(
				withoutParent(initialResult),
				withoutParent(nextResult)));
	});
var rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles = F2(
	function (styles, declarations) {
		if (!styles.b) {
			return declarations;
		} else {
			switch (styles.a.$) {
				case 0:
					var property = styles.a.a;
					var rest = styles.b;
					return A2(
						rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
						rest,
						A2(rtfeldman$elm_css$Css$Structure$appendProperty, property, declarations));
				case 1:
					var _n4 = styles.a;
					var selector = _n4.a;
					var nestedStyles = _n4.b;
					var rest = styles.b;
					return A4(
						rtfeldman$elm_css$Css$Preprocess$Resolve$applyNestedStylesToLast,
						nestedStyles,
						rest,
						rtfeldman$elm_css$Css$Structure$appendRepeatableToLastSelector(selector),
						declarations);
				case 2:
					var _n5 = styles.a;
					var selectorCombinator = _n5.a;
					var snippets = _n5.b;
					var rest = styles.b;
					var chain = F2(
						function (_n9, _n10) {
							var originalSequence = _n9.a;
							var originalTuples = _n9.b;
							var originalPseudoElement = _n9.c;
							var newSequence = _n10.a;
							var newTuples = _n10.b;
							var newPseudoElement = _n10.c;
							return A3(
								rtfeldman$elm_css$Css$Structure$Selector,
								originalSequence,
								_Utils_ap(
									originalTuples,
									A2(
										elm$core$List$cons,
										_Utils_Tuple2(selectorCombinator, newSequence),
										newTuples)),
								rtfeldman$elm_css$Css$Preprocess$Resolve$oneOf(
									_List_fromArray(
										[newPseudoElement, originalPseudoElement])));
						});
					var expandDeclaration = function (declaration) {
						switch (declaration.$) {
							case 0:
								var _n7 = declaration.a;
								var firstSelector = _n7.a;
								var otherSelectors = _n7.b;
								var nestedStyles = _n7.c;
								var newSelectors = A2(
									elm$core$List$concatMap,
									function (originalSelector) {
										return A2(
											elm$core$List$map,
											chain(originalSelector),
											A2(elm$core$List$cons, firstSelector, otherSelectors));
									},
									rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors(declarations));
								var newDeclarations = function () {
									if (!newSelectors.b) {
										return _List_Nil;
									} else {
										var first = newSelectors.a;
										var remainder = newSelectors.b;
										return _List_fromArray(
											[
												rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
												A3(rtfeldman$elm_css$Css$Structure$StyleBlock, first, remainder, _List_Nil))
											]);
									}
								}();
								return A2(rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, nestedStyles, newDeclarations);
							case 1:
								var mediaQueries = declaration.a;
								var styleBlocks = declaration.b;
								return A2(rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule, mediaQueries, styleBlocks);
							case 2:
								var str = declaration.a;
								var otherSnippets = declaration.b;
								return A2(rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule, str, otherSnippets);
							case 3:
								var str1 = declaration.a;
								var str2 = declaration.b;
								var str3 = declaration.c;
								var str4 = declaration.d;
								var styleBlock = declaration.e;
								return A2(
									elm$core$List$map,
									A4(rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule, str1, str2, str3, str4),
									rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
							case 4:
								var str = declaration.a;
								var properties = declaration.b;
								return _List_fromArray(
									[
										A2(rtfeldman$elm_css$Css$Structure$PageRule, str, properties)
									]);
							case 5:
								var properties = declaration.a;
								return _List_fromArray(
									[
										rtfeldman$elm_css$Css$Structure$FontFace(properties)
									]);
							case 6:
								var properties = declaration.a;
								return _List_fromArray(
									[
										rtfeldman$elm_css$Css$Structure$Viewport(properties)
									]);
							case 7:
								var properties = declaration.a;
								return _List_fromArray(
									[
										rtfeldman$elm_css$Css$Structure$CounterStyle(properties)
									]);
							default:
								var tuples = declaration.a;
								return rtfeldman$elm_css$Css$Preprocess$Resolve$resolveFontFeatureValues(tuples);
						}
					};
					return elm$core$List$concat(
						_Utils_ap(
							_List_fromArray(
								[
									A2(rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, rest, declarations)
								]),
							A2(
								elm$core$List$map,
								expandDeclaration,
								A2(elm$core$List$concatMap, rtfeldman$elm_css$Css$Preprocess$unwrapSnippet, snippets))));
				case 3:
					var _n11 = styles.a;
					var pseudoElement = _n11.a;
					var nestedStyles = _n11.b;
					var rest = styles.b;
					return A4(
						rtfeldman$elm_css$Css$Preprocess$Resolve$applyNestedStylesToLast,
						nestedStyles,
						rest,
						rtfeldman$elm_css$Css$Structure$appendPseudoElementToLastSelector(pseudoElement),
						declarations);
				case 5:
					var str = styles.a.a;
					var rest = styles.b;
					var name = rtfeldman$elm_css$Hash$fromString(str);
					var newProperty = 'animation-name:' + name;
					var newDeclarations = A2(
						rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
						rest,
						A2(rtfeldman$elm_css$Css$Structure$appendProperty, newProperty, declarations));
					return A2(
						elm$core$List$append,
						newDeclarations,
						_List_fromArray(
							[
								rtfeldman$elm_css$Css$Structure$Keyframes(
								{dT: str, a: name})
							]));
				case 4:
					var _n12 = styles.a;
					var mediaQueries = _n12.a;
					var nestedStyles = _n12.b;
					var rest = styles.b;
					var extraDeclarations = function () {
						var _n13 = rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors(declarations);
						if (!_n13.b) {
							return _List_Nil;
						} else {
							var firstSelector = _n13.a;
							var otherSelectors = _n13.b;
							return A2(
								elm$core$List$map,
								rtfeldman$elm_css$Css$Structure$styleBlockToMediaRule(mediaQueries),
								A2(
									rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
									nestedStyles,
									elm$core$List$singleton(
										rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
											A3(rtfeldman$elm_css$Css$Structure$StyleBlock, firstSelector, otherSelectors, _List_Nil)))));
						}
					}();
					return _Utils_ap(
						A2(rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, rest, declarations),
						extraDeclarations);
				default:
					var otherStyles = styles.a.a;
					var rest = styles.b;
					return A2(
						rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
						_Utils_ap(otherStyles, rest),
						declarations);
			}
		}
	});
var rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock = function (_n2) {
	var firstSelector = _n2.a;
	var otherSelectors = _n2.b;
	var styles = _n2.c;
	return A2(
		rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
		styles,
		_List_fromArray(
			[
				rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
				A3(rtfeldman$elm_css$Css$Structure$StyleBlock, firstSelector, otherSelectors, _List_Nil))
			]));
};
var rtfeldman$elm_css$Css$Preprocess$Resolve$extract = function (snippetDeclarations) {
	if (!snippetDeclarations.b) {
		return _List_Nil;
	} else {
		var first = snippetDeclarations.a;
		var rest = snippetDeclarations.b;
		return _Utils_ap(
			rtfeldman$elm_css$Css$Preprocess$Resolve$toDeclarations(first),
			rtfeldman$elm_css$Css$Preprocess$Resolve$extract(rest));
	}
};
var rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule = F2(
	function (mediaQueries, styleBlocks) {
		var handleStyleBlock = function (styleBlock) {
			return A2(
				elm$core$List$map,
				rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule(mediaQueries),
				rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
		};
		return A2(elm$core$List$concatMap, handleStyleBlock, styleBlocks);
	});
var rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule = F2(
	function (str, snippets) {
		var declarations = rtfeldman$elm_css$Css$Preprocess$Resolve$extract(
			A2(elm$core$List$concatMap, rtfeldman$elm_css$Css$Preprocess$unwrapSnippet, snippets));
		return _List_fromArray(
			[
				A2(rtfeldman$elm_css$Css$Structure$SupportsRule, str, declarations)
			]);
	});
var rtfeldman$elm_css$Css$Preprocess$Resolve$toDeclarations = function (snippetDeclaration) {
	switch (snippetDeclaration.$) {
		case 0:
			var styleBlock = snippetDeclaration.a;
			return rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock);
		case 1:
			var mediaQueries = snippetDeclaration.a;
			var styleBlocks = snippetDeclaration.b;
			return A2(rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule, mediaQueries, styleBlocks);
		case 2:
			var str = snippetDeclaration.a;
			var snippets = snippetDeclaration.b;
			return A2(rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule, str, snippets);
		case 3:
			var str1 = snippetDeclaration.a;
			var str2 = snippetDeclaration.b;
			var str3 = snippetDeclaration.c;
			var str4 = snippetDeclaration.d;
			var styleBlock = snippetDeclaration.e;
			return A2(
				elm$core$List$map,
				A4(rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule, str1, str2, str3, str4),
				rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
		case 4:
			var str = snippetDeclaration.a;
			var properties = snippetDeclaration.b;
			return _List_fromArray(
				[
					A2(rtfeldman$elm_css$Css$Structure$PageRule, str, properties)
				]);
		case 5:
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					rtfeldman$elm_css$Css$Structure$FontFace(properties)
				]);
		case 6:
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					rtfeldman$elm_css$Css$Structure$Viewport(properties)
				]);
		case 7:
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					rtfeldman$elm_css$Css$Structure$CounterStyle(properties)
				]);
		default:
			var tuples = snippetDeclaration.a;
			return rtfeldman$elm_css$Css$Preprocess$Resolve$resolveFontFeatureValues(tuples);
	}
};
var rtfeldman$elm_css$Css$Preprocess$Resolve$toStructure = function (_n0) {
	var charset = _n0.cB;
	var imports = _n0.cU;
	var namespaces = _n0.c6;
	var snippets = _n0.dq;
	var declarations = rtfeldman$elm_css$Css$Preprocess$Resolve$extract(
		A2(elm$core$List$concatMap, rtfeldman$elm_css$Css$Preprocess$unwrapSnippet, snippets));
	return {cB: charset, dU: declarations, cU: imports, c6: namespaces};
};
var rtfeldman$elm_css$Css$Structure$compactHelp = F2(
	function (declaration, _n0) {
		var keyframesByName = _n0.a;
		var declarations = _n0.b;
		switch (declaration.$) {
			case 0:
				var _n2 = declaration.a;
				var properties = _n2.c;
				return elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2(elm$core$List$cons, declaration, declarations));
			case 1:
				var styleBlocks = declaration.b;
				return A2(
					elm$core$List$all,
					function (_n3) {
						var properties = _n3.c;
						return elm$core$List$isEmpty(properties);
					},
					styleBlocks) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2(elm$core$List$cons, declaration, declarations));
			case 2:
				var otherDeclarations = declaration.b;
				return elm$core$List$isEmpty(otherDeclarations) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2(elm$core$List$cons, declaration, declarations));
			case 3:
				return _Utils_Tuple2(
					keyframesByName,
					A2(elm$core$List$cons, declaration, declarations));
			case 4:
				var properties = declaration.b;
				return elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2(elm$core$List$cons, declaration, declarations));
			case 5:
				var properties = declaration.a;
				return elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2(elm$core$List$cons, declaration, declarations));
			case 6:
				var record = declaration.a;
				return elm$core$String$isEmpty(record.dT) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					A3(elm$core$Dict$insert, record.a, record.dT, keyframesByName),
					declarations);
			case 7:
				var properties = declaration.a;
				return elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2(elm$core$List$cons, declaration, declarations));
			case 8:
				var properties = declaration.a;
				return elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2(elm$core$List$cons, declaration, declarations));
			default:
				var tuples = declaration.a;
				return A2(
					elm$core$List$all,
					function (_n4) {
						var properties = _n4.b;
						return elm$core$List$isEmpty(properties);
					},
					tuples) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2(elm$core$List$cons, declaration, declarations));
		}
	});
var rtfeldman$elm_css$Css$Structure$withKeyframeDeclarations = F2(
	function (keyframesByName, compactedDeclarations) {
		return A2(
			elm$core$List$append,
			A2(
				elm$core$List$map,
				function (_n0) {
					var name = _n0.a;
					var decl = _n0.b;
					return rtfeldman$elm_css$Css$Structure$Keyframes(
						{dT: decl, a: name});
				},
				elm$core$Dict$toList(keyframesByName)),
			compactedDeclarations);
	});
var rtfeldman$elm_css$Css$Structure$compactStylesheet = function (_n0) {
	var charset = _n0.cB;
	var imports = _n0.cU;
	var namespaces = _n0.c6;
	var declarations = _n0.dU;
	var _n1 = A3(
		elm$core$List$foldr,
		rtfeldman$elm_css$Css$Structure$compactHelp,
		_Utils_Tuple2(elm$core$Dict$empty, _List_Nil),
		declarations);
	var keyframesByName = _n1.a;
	var compactedDeclarations = _n1.b;
	var finalDeclarations = A2(rtfeldman$elm_css$Css$Structure$withKeyframeDeclarations, keyframesByName, compactedDeclarations);
	return {cB: charset, dU: finalDeclarations, cU: imports, c6: namespaces};
};
var rtfeldman$elm_css$Css$Structure$Output$charsetToString = function (charset) {
	return A2(
		elm$core$Maybe$withDefault,
		'',
		A2(
			elm$core$Maybe$map,
			function (str) {
				return '@charset \"' + (str + '\"');
			},
			charset));
};
var rtfeldman$elm_css$Css$Structure$Output$mediaExpressionToString = function (expression) {
	return '(' + (expression.cN + (A2(
		elm$core$Maybe$withDefault,
		'',
		A2(
			elm$core$Maybe$map,
			elm$core$Basics$append(': '),
			expression.ey)) + ')'));
};
var rtfeldman$elm_css$Css$Structure$Output$mediaTypeToString = function (mediaType) {
	switch (mediaType) {
		case 0:
			return 'print';
		case 1:
			return 'screen';
		default:
			return 'speech';
	}
};
var rtfeldman$elm_css$Css$Structure$Output$mediaQueryToString = function (mediaQuery) {
	var prefixWith = F3(
		function (str, mediaType, expressions) {
			return str + (' ' + A2(
				elm$core$String$join,
				' and ',
				A2(
					elm$core$List$cons,
					rtfeldman$elm_css$Css$Structure$Output$mediaTypeToString(mediaType),
					A2(elm$core$List$map, rtfeldman$elm_css$Css$Structure$Output$mediaExpressionToString, expressions))));
		});
	switch (mediaQuery.$) {
		case 0:
			var expressions = mediaQuery.a;
			return A2(
				elm$core$String$join,
				' and ',
				A2(elm$core$List$map, rtfeldman$elm_css$Css$Structure$Output$mediaExpressionToString, expressions));
		case 1:
			var mediaType = mediaQuery.a;
			var expressions = mediaQuery.b;
			return A3(prefixWith, 'only', mediaType, expressions);
		case 2:
			var mediaType = mediaQuery.a;
			var expressions = mediaQuery.b;
			return A3(prefixWith, 'not', mediaType, expressions);
		default:
			var str = mediaQuery.a;
			return str;
	}
};
var rtfeldman$elm_css$Css$Structure$Output$importMediaQueryToString = F2(
	function (name, mediaQuery) {
		return '@import \"' + (name + (rtfeldman$elm_css$Css$Structure$Output$mediaQueryToString(mediaQuery) + '\"'));
	});
var rtfeldman$elm_css$Css$Structure$Output$importToString = function (_n0) {
	var name = _n0.a;
	var mediaQueries = _n0.b;
	return A2(
		elm$core$String$join,
		'\n',
		A2(
			elm$core$List$map,
			rtfeldman$elm_css$Css$Structure$Output$importMediaQueryToString(name),
			mediaQueries));
};
var rtfeldman$elm_css$Css$Structure$Output$namespaceToString = function (_n0) {
	var prefix = _n0.a;
	var str = _n0.b;
	return '@namespace ' + (prefix + ('\"' + (str + '\"')));
};
var rtfeldman$elm_css$Css$Structure$Output$spaceIndent = '    ';
var rtfeldman$elm_css$Css$Structure$Output$indent = function (str) {
	return _Utils_ap(rtfeldman$elm_css$Css$Structure$Output$spaceIndent, str);
};
var rtfeldman$elm_css$Css$Structure$Output$noIndent = '';
var rtfeldman$elm_css$Css$Structure$Output$emitProperty = function (str) {
	return str + ';';
};
var rtfeldman$elm_css$Css$Structure$Output$emitProperties = function (properties) {
	return A2(
		elm$core$String$join,
		'\n',
		A2(
			elm$core$List$map,
			A2(elm$core$Basics$composeL, rtfeldman$elm_css$Css$Structure$Output$indent, rtfeldman$elm_css$Css$Structure$Output$emitProperty),
			properties));
};
var elm$core$String$append = _String_append;
var rtfeldman$elm_css$Css$Structure$Output$pseudoElementToString = function (_n0) {
	var str = _n0;
	return '::' + str;
};
var rtfeldman$elm_css$Css$Structure$Output$combinatorToString = function (combinator) {
	switch (combinator) {
		case 0:
			return '+';
		case 1:
			return '~';
		case 2:
			return '>';
		default:
			return '';
	}
};
var rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString = function (repeatableSimpleSelector) {
	switch (repeatableSimpleSelector.$) {
		case 0:
			var str = repeatableSimpleSelector.a;
			return '.' + str;
		case 1:
			var str = repeatableSimpleSelector.a;
			return '#' + str;
		case 2:
			var str = repeatableSimpleSelector.a;
			return ':' + str;
		default:
			var str = repeatableSimpleSelector.a;
			return '[' + (str + ']');
	}
};
var rtfeldman$elm_css$Css$Structure$Output$simpleSelectorSequenceToString = function (simpleSelectorSequence) {
	switch (simpleSelectorSequence.$) {
		case 0:
			var str = simpleSelectorSequence.a;
			var repeatableSimpleSelectors = simpleSelectorSequence.b;
			return A2(
				elm$core$String$join,
				'',
				A2(
					elm$core$List$cons,
					str,
					A2(elm$core$List$map, rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString, repeatableSimpleSelectors)));
		case 1:
			var repeatableSimpleSelectors = simpleSelectorSequence.a;
			return elm$core$List$isEmpty(repeatableSimpleSelectors) ? '*' : A2(
				elm$core$String$join,
				'',
				A2(elm$core$List$map, rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString, repeatableSimpleSelectors));
		default:
			var str = simpleSelectorSequence.a;
			var repeatableSimpleSelectors = simpleSelectorSequence.b;
			return A2(
				elm$core$String$join,
				'',
				A2(
					elm$core$List$cons,
					str,
					A2(elm$core$List$map, rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString, repeatableSimpleSelectors)));
	}
};
var rtfeldman$elm_css$Css$Structure$Output$selectorChainToString = function (_n0) {
	var combinator = _n0.a;
	var sequence = _n0.b;
	return A2(
		elm$core$String$join,
		' ',
		_List_fromArray(
			[
				rtfeldman$elm_css$Css$Structure$Output$combinatorToString(combinator),
				rtfeldman$elm_css$Css$Structure$Output$simpleSelectorSequenceToString(sequence)
			]));
};
var rtfeldman$elm_css$Css$Structure$Output$selectorToString = function (_n0) {
	var simpleSelectorSequence = _n0.a;
	var chain = _n0.b;
	var pseudoElement = _n0.c;
	var segments = A2(
		elm$core$List$cons,
		rtfeldman$elm_css$Css$Structure$Output$simpleSelectorSequenceToString(simpleSelectorSequence),
		A2(elm$core$List$map, rtfeldman$elm_css$Css$Structure$Output$selectorChainToString, chain));
	var pseudoElementsString = A2(
		elm$core$String$join,
		'',
		_List_fromArray(
			[
				A2(
				elm$core$Maybe$withDefault,
				'',
				A2(elm$core$Maybe$map, rtfeldman$elm_css$Css$Structure$Output$pseudoElementToString, pseudoElement))
			]));
	return A2(
		elm$core$String$append,
		A2(
			elm$core$String$join,
			' ',
			A2(
				elm$core$List$filter,
				A2(elm$core$Basics$composeL, elm$core$Basics$not, elm$core$String$isEmpty),
				segments)),
		pseudoElementsString);
};
var rtfeldman$elm_css$Css$Structure$Output$prettyPrintStyleBlock = F2(
	function (indentLevel, _n0) {
		var firstSelector = _n0.a;
		var otherSelectors = _n0.b;
		var properties = _n0.c;
		var selectorStr = A2(
			elm$core$String$join,
			', ',
			A2(
				elm$core$List$map,
				rtfeldman$elm_css$Css$Structure$Output$selectorToString,
				A2(elm$core$List$cons, firstSelector, otherSelectors)));
		return A2(
			elm$core$String$join,
			'',
			_List_fromArray(
				[
					selectorStr,
					' {\n',
					indentLevel,
					rtfeldman$elm_css$Css$Structure$Output$emitProperties(properties),
					'\n',
					indentLevel,
					'}'
				]));
	});
var rtfeldman$elm_css$Css$Structure$Output$prettyPrintDeclaration = function (decl) {
	switch (decl.$) {
		case 0:
			var styleBlock = decl.a;
			return A2(rtfeldman$elm_css$Css$Structure$Output$prettyPrintStyleBlock, rtfeldman$elm_css$Css$Structure$Output$noIndent, styleBlock);
		case 1:
			var mediaQueries = decl.a;
			var styleBlocks = decl.b;
			var query = A2(
				elm$core$String$join,
				',\n',
				A2(elm$core$List$map, rtfeldman$elm_css$Css$Structure$Output$mediaQueryToString, mediaQueries));
			var blocks = A2(
				elm$core$String$join,
				'\n\n',
				A2(
					elm$core$List$map,
					A2(
						elm$core$Basics$composeL,
						rtfeldman$elm_css$Css$Structure$Output$indent,
						rtfeldman$elm_css$Css$Structure$Output$prettyPrintStyleBlock(rtfeldman$elm_css$Css$Structure$Output$spaceIndent)),
					styleBlocks));
			return '@media ' + (query + (' {\n' + (blocks + '\n}')));
		case 2:
			return 'TODO';
		case 3:
			return 'TODO';
		case 4:
			return 'TODO';
		case 5:
			return 'TODO';
		case 6:
			var name = decl.a.a;
			var declaration = decl.a.dT;
			return '@keyframes ' + (name + (' {\n' + (declaration + '\n}')));
		case 7:
			return 'TODO';
		case 8:
			return 'TODO';
		default:
			return 'TODO';
	}
};
var rtfeldman$elm_css$Css$Structure$Output$prettyPrint = function (_n0) {
	var charset = _n0.cB;
	var imports = _n0.cU;
	var namespaces = _n0.c6;
	var declarations = _n0.dU;
	return A2(
		elm$core$String$join,
		'\n\n',
		A2(
			elm$core$List$filter,
			A2(elm$core$Basics$composeL, elm$core$Basics$not, elm$core$String$isEmpty),
			_List_fromArray(
				[
					rtfeldman$elm_css$Css$Structure$Output$charsetToString(charset),
					A2(
					elm$core$String$join,
					'\n',
					A2(elm$core$List$map, rtfeldman$elm_css$Css$Structure$Output$importToString, imports)),
					A2(
					elm$core$String$join,
					'\n',
					A2(elm$core$List$map, rtfeldman$elm_css$Css$Structure$Output$namespaceToString, namespaces)),
					A2(
					elm$core$String$join,
					'\n\n',
					A2(elm$core$List$map, rtfeldman$elm_css$Css$Structure$Output$prettyPrintDeclaration, declarations))
				])));
};
var rtfeldman$elm_css$Css$Preprocess$Resolve$compileHelp = function (sheet) {
	return rtfeldman$elm_css$Css$Structure$Output$prettyPrint(
		rtfeldman$elm_css$Css$Structure$compactStylesheet(
			rtfeldman$elm_css$Css$Preprocess$Resolve$toStructure(sheet)));
};
var rtfeldman$elm_css$Css$Preprocess$Resolve$compile = function (styles) {
	return A2(
		elm$core$String$join,
		'\n\n',
		A2(elm$core$List$map, rtfeldman$elm_css$Css$Preprocess$Resolve$compileHelp, styles));
};
var rtfeldman$elm_css$Css$Preprocess$Snippet = elm$core$Basics$identity;
var rtfeldman$elm_css$Css$Preprocess$StyleBlock = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var rtfeldman$elm_css$Css$Preprocess$StyleBlockDeclaration = function (a) {
	return {$: 0, a: a};
};
var rtfeldman$elm_css$VirtualDom$Styled$makeSnippet = F2(
	function (styles, sequence) {
		var selector = A3(rtfeldman$elm_css$Css$Structure$Selector, sequence, _List_Nil, elm$core$Maybe$Nothing);
		return _List_fromArray(
			[
				rtfeldman$elm_css$Css$Preprocess$StyleBlockDeclaration(
				A3(rtfeldman$elm_css$Css$Preprocess$StyleBlock, selector, _List_Nil, styles))
			]);
	});
var rtfeldman$elm_css$VirtualDom$Styled$murmurSeed = 15739;
var rtfeldman$elm_css$VirtualDom$Styled$getClassname = function (styles) {
	return elm$core$List$isEmpty(styles) ? 'unstyled' : A2(
		elm$core$String$cons,
		'_',
		rtfeldman$elm_hex$Hex$toString(
			A2(
				Skinney$murmur3$Murmur3$hashString,
				rtfeldman$elm_css$VirtualDom$Styled$murmurSeed,
				rtfeldman$elm_css$Css$Preprocess$Resolve$compile(
					elm$core$List$singleton(
						rtfeldman$elm_css$Css$Preprocess$stylesheet(
							elm$core$List$singleton(
								A2(
									rtfeldman$elm_css$VirtualDom$Styled$makeSnippet,
									styles,
									rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence(_List_Nil)))))))));
};
var rtfeldman$elm_css$Html$Styled$Internal$css = function (styles) {
	var classname = rtfeldman$elm_css$VirtualDom$Styled$getClassname(styles);
	var classProperty = A2(
		elm$virtual_dom$VirtualDom$property,
		'className',
		elm$json$Json$Encode$string(classname));
	return A3(rtfeldman$elm_css$VirtualDom$Styled$Attribute, classProperty, styles, classname);
};
var rtfeldman$elm_css$Html$Styled$Attributes$css = rtfeldman$elm_css$Html$Styled$Internal$css;
var author$project$BasicParts$bottomNavigationContainer = function (item) {
	return A2(
		rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				rtfeldman$elm_css$Html$Styled$Attributes$css(
				_List_fromArray(
					[
						author$project$Page$Style$displayGridAndGap(0),
						A2(
						rtfeldman$elm_css$Css$property,
						'grid-template-columns',
						A2(
							elm$core$String$join,
							' ',
							A2(
								elm$core$List$repeat,
								elm$core$List$length(item),
								'1fr'))),
						rtfeldman$elm_css$Css$height(
						rtfeldman$elm_css$Css$px(64)),
						rtfeldman$elm_css$Css$position(rtfeldman$elm_css$Css$fixed),
						rtfeldman$elm_css$Css$bottom(rtfeldman$elm_css$Css$zero),
						rtfeldman$elm_css$Css$width(
						rtfeldman$elm_css$Css$pct(100)),
						rtfeldman$elm_css$Css$backgroundColor(
						A3(rtfeldman$elm_css$Css$rgb, 81, 33, 130))
					]))
			]),
		item);
};
var rtfeldman$elm_css$Css$Internal$property = F2(
	function (key, value) {
		return rtfeldman$elm_css$Css$Preprocess$AppendProperty(key + (':' + value));
	});
var rtfeldman$elm_css$Css$Internal$getOverloadedProperty = F3(
	function (functionName, desiredKey, style) {
		getOverloadedProperty:
		while (true) {
			switch (style.$) {
				case 0:
					var str = style.a;
					var key = A2(
						elm$core$Maybe$withDefault,
						'',
						elm$core$List$head(
							A2(elm$core$String$split, ':', str)));
					return A2(rtfeldman$elm_css$Css$Internal$property, desiredKey, key);
				case 1:
					var selector = style.a;
					return A2(rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-selector'));
				case 2:
					var combinator = style.a;
					return A2(rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-combinator'));
				case 3:
					var pseudoElement = style.a;
					return A2(rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-pseudo-element setter'));
				case 4:
					return A2(rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-media-query'));
				case 5:
					return A2(rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-keyframes'));
				default:
					if (!style.a.b) {
						return A2(rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-empty-Style'));
					} else {
						if (!style.a.b.b) {
							var _n1 = style.a;
							var only = _n1.a;
							var $temp$functionName = functionName,
								$temp$desiredKey = desiredKey,
								$temp$style = only;
							functionName = $temp$functionName;
							desiredKey = $temp$desiredKey;
							style = $temp$style;
							continue getOverloadedProperty;
						} else {
							var _n2 = style.a;
							var first = _n2.a;
							var rest = _n2.b;
							var $temp$functionName = functionName,
								$temp$desiredKey = desiredKey,
								$temp$style = rtfeldman$elm_css$Css$Preprocess$ApplyStyles(rest);
							functionName = $temp$functionName;
							desiredKey = $temp$desiredKey;
							style = $temp$style;
							continue getOverloadedProperty;
						}
					}
			}
		}
	});
var rtfeldman$elm_css$Css$Internal$IncompatibleUnits = 0;
var rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty = A3(rtfeldman$elm_css$Css$Internal$lengthConverter, 0, '', 0);
var rtfeldman$elm_css$Css$alignItems = function (fn) {
	return A3(
		rtfeldman$elm_css$Css$Internal$getOverloadedProperty,
		'alignItems',
		'align-items',
		fn(rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty));
};
var rtfeldman$elm_css$Css$center = rtfeldman$elm_css$Css$prop1('center');
var rtfeldman$elm_css$Css$color = function (c) {
	return A2(rtfeldman$elm_css$Css$property, 'color', c.ey);
};
var rtfeldman$elm_css$Css$row = {bO: 0, aU: 0, ey: 'row'};
var rtfeldman$elm_css$Css$column = _Utils_update(
	rtfeldman$elm_css$Css$row,
	{ey: 'column'});
var rtfeldman$elm_css$Css$displayFlex = A2(rtfeldman$elm_css$Css$property, 'display', 'flex');
var rtfeldman$elm_css$Css$flexDirection = rtfeldman$elm_css$Css$prop1('flex-direction');
var rtfeldman$elm_css$Css$justifyContent = function (fn) {
	return A3(
		rtfeldman$elm_css$Css$Internal$getOverloadedProperty,
		'justifyContent',
		'justify-content',
		fn(rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty));
};
var rtfeldman$elm_css$Css$none = {am: 0, cv: 0, x: 0, f: 0, p: 0, d0: 0, cW: 0, bU: 0, aA: 0, ab: 0, H: 0, h: 0, g: 0, b_: 0, bv: 0, ee: 0, F: 0, bx: 0, ek: 0, aH: 0, ai: 0, A: 0, n: 0, ew: 0, ey: 'none'};
var rtfeldman$elm_css$Css$textDecoration = rtfeldman$elm_css$Css$prop1('text-decoration');
var author$project$BasicParts$bottomNavigationStyle = function (select) {
	return _List_fromArray(
		[
			rtfeldman$elm_css$Css$displayFlex,
			rtfeldman$elm_css$Css$justifyContent(rtfeldman$elm_css$Css$center),
			rtfeldman$elm_css$Css$alignItems(rtfeldman$elm_css$Css$center),
			rtfeldman$elm_css$Css$flexDirection(rtfeldman$elm_css$Css$column),
			rtfeldman$elm_css$Css$color(
			select ? A3(rtfeldman$elm_css$Css$rgb, 255, 255, 255) : A3(rtfeldman$elm_css$Css$rgb, 170, 170, 170)),
			rtfeldman$elm_css$Css$textDecoration(rtfeldman$elm_css$Css$none)
		]);
};
var rtfeldman$elm_css$Css$fill = rtfeldman$elm_css$Css$prop1('fill');
var rtfeldman$elm_css$Html$Styled$a = rtfeldman$elm_css$Html$Styled$node('a');
var elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var rtfeldman$elm_css$VirtualDom$Styled$Unstyled = function (a) {
	return {$: 4, a: a};
};
var rtfeldman$elm_css$VirtualDom$Styled$text = function (str) {
	return rtfeldman$elm_css$VirtualDom$Styled$Unstyled(
		elm$virtual_dom$VirtualDom$text(str));
};
var rtfeldman$elm_css$Html$Styled$text = rtfeldman$elm_css$VirtualDom$Styled$text;
var rtfeldman$elm_css$VirtualDom$Styled$property = F2(
	function (key, value) {
		return A3(
			rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2(elm$virtual_dom$VirtualDom$property, key, value),
			_List_Nil,
			'');
	});
var rtfeldman$elm_css$Html$Styled$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			rtfeldman$elm_css$VirtualDom$Styled$property,
			key,
			elm$json$Json$Encode$string(string));
	});
var rtfeldman$elm_css$Html$Styled$Attributes$href = function (url) {
	return A2(rtfeldman$elm_css$Html$Styled$Attributes$stringProperty, 'href', url);
};
var author$project$BasicParts$bottomNavigationItem = F4(
	function (select, linkMaybe, iconMaybe, text) {
		return function () {
			if (!linkMaybe.$) {
				var link = linkMaybe.a;
				return rtfeldman$elm_css$Html$Styled$a(
					_List_fromArray(
						[
							rtfeldman$elm_css$Html$Styled$Attributes$css(
							author$project$BasicParts$bottomNavigationStyle(select)),
							rtfeldman$elm_css$Html$Styled$Attributes$href(
							author$project$PageLocation$toUrlAsString(link))
						]));
			} else {
				return rtfeldman$elm_css$Html$Styled$div(
					_List_fromArray(
						[
							rtfeldman$elm_css$Html$Styled$Attributes$css(
							author$project$BasicParts$bottomNavigationStyle(select))
						]));
			}
		}()(
			function () {
				if (!iconMaybe.$) {
					var icon = iconMaybe.a;
					return _List_fromArray(
						[
							icon(
							_List_fromArray(
								[
									rtfeldman$elm_css$Css$width(
									rtfeldman$elm_css$Css$px(32)),
									rtfeldman$elm_css$Css$height(
									rtfeldman$elm_css$Css$px(32)),
									rtfeldman$elm_css$Css$fill(
									select ? A3(rtfeldman$elm_css$Css$rgb, 255, 255, 255) : A3(rtfeldman$elm_css$Css$rgb, 170, 170, 170))
								])),
							rtfeldman$elm_css$Html$Styled$text(text)
						]);
				} else {
					return _List_fromArray(
						[
							rtfeldman$elm_css$Html$Styled$text(text)
						]);
				}
			}());
	});
var author$project$Data$User$withNameGetImageId = function (_n0) {
	var imageId = _n0.bR;
	return imageId;
};
var rtfeldman$elm_css$VirtualDom$Styled$NodeNS = F4(
	function (a, b, c, d) {
		return {$: 1, a: a, b: b, c: c, d: d};
	});
var rtfeldman$elm_css$VirtualDom$Styled$nodeNS = rtfeldman$elm_css$VirtualDom$Styled$NodeNS;
var rtfeldman$elm_css$Svg$Styled$node = rtfeldman$elm_css$VirtualDom$Styled$nodeNS('http://www.w3.org/2000/svg');
var rtfeldman$elm_css$Svg$Styled$path = rtfeldman$elm_css$Svg$Styled$node('path');
var rtfeldman$elm_css$Svg$Styled$svg = rtfeldman$elm_css$Svg$Styled$node('svg');
var elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var rtfeldman$elm_css$Svg$Styled$Internal$css = function (styles) {
	var classname = rtfeldman$elm_css$VirtualDom$Styled$getClassname(styles);
	var classAttribute = A2(elm$virtual_dom$VirtualDom$attribute, 'class', classname);
	return A3(rtfeldman$elm_css$VirtualDom$Styled$Attribute, classAttribute, styles, classname);
};
var rtfeldman$elm_css$Svg$Styled$Attributes$css = rtfeldman$elm_css$Svg$Styled$Internal$css;
var rtfeldman$elm_css$VirtualDom$Styled$attribute = F2(
	function (key, value) {
		return A3(
			rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2(elm$virtual_dom$VirtualDom$attribute, key, value),
			_List_Nil,
			'');
	});
var rtfeldman$elm_css$Svg$Styled$Attributes$d = rtfeldman$elm_css$VirtualDom$Styled$attribute('d');
var rtfeldman$elm_css$Svg$Styled$Attributes$viewBox = rtfeldman$elm_css$VirtualDom$Styled$attribute('viewBox');
var author$project$Icon$home = function (styleList) {
	return A2(
		rtfeldman$elm_css$Svg$Styled$svg,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 24 24'),
				rtfeldman$elm_css$Svg$Styled$Attributes$css(styleList)
			]),
		_List_fromArray(
			[
				A2(
				rtfeldman$elm_css$Svg$Styled$path,
				_List_fromArray(
					[
						rtfeldman$elm_css$Svg$Styled$Attributes$d('M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z')
					]),
				_List_Nil)
			]));
};
var author$project$Icon$notifications = function (styleList) {
	return A2(
		rtfeldman$elm_css$Svg$Styled$svg,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 24 24'),
				rtfeldman$elm_css$Svg$Styled$Attributes$css(styleList)
			]),
		_List_fromArray(
			[
				A2(
				rtfeldman$elm_css$Svg$Styled$path,
				_List_fromArray(
					[
						rtfeldman$elm_css$Svg$Styled$Attributes$d('M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29c-.63.63-.19 1.71.7 1.71h13.17c.89 0 1.34-1.08.71-1.71L18 16z')
					]),
				_List_Nil)
			]));
};
var author$project$Icon$search = function (styleList) {
	return A2(
		rtfeldman$elm_css$Svg$Styled$svg,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 24 24'),
				rtfeldman$elm_css$Svg$Styled$Attributes$css(styleList)
			]),
		_List_fromArray(
			[
				A2(
				rtfeldman$elm_css$Svg$Styled$path,
				_List_fromArray(
					[
						rtfeldman$elm_css$Svg$Styled$Attributes$d('M15.5 14h-.79l-.28-.27c1.2-1.4 1.82-3.31 1.48-5.34-.47-2.78-2.79-5-5.59-5.34-4.23-.52-7.79 3.04-7.27 7.27.34 2.8 2.56 5.12 5.34 5.59 2.03.34 3.94-.28 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z')
					]),
				_List_Nil)
			]));
};
var author$project$Data$ImageId$toUrlString = function (_n0) {
	var id = _n0;
	return 'https://asia-northeast1-tsukumart-f0971.cloudfunctions.net/image/' + id;
};
var rtfeldman$elm_css$Css$borderRadius = rtfeldman$elm_css$Css$prop1('border-radius');
var rtfeldman$elm_css$Css$flexShrink = rtfeldman$elm_css$Css$prop1('flex-shrink');
var rtfeldman$elm_css$Css$int = function (val) {
	return {
		P: 0,
		bo: 0,
		ac: 0,
		H: 0,
		ea: 0,
		bt: 0,
		U: val,
		aK: '',
		ba: 0,
		ey: elm$core$String$fromInt(val)
	};
};
var rtfeldman$elm_css$Css$padding = rtfeldman$elm_css$Css$prop1('padding');
var rtfeldman$elm_css$Html$Styled$img = rtfeldman$elm_css$Html$Styled$node('img');
var elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var elm$virtual_dom$VirtualDom$keyedNodeNS = F2(
	function (namespace, tag) {
		return A2(
			_VirtualDom_keyedNodeNS,
			namespace,
			_VirtualDom_noScript(tag));
	});
var elm$virtual_dom$VirtualDom$nodeNS = function (tag) {
	return _VirtualDom_nodeNS(
		_VirtualDom_noScript(tag));
};
var rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles = F2(
	function (_n0, styles) {
		var newStyles = _n0.b;
		var classname = _n0.c;
		return elm$core$List$isEmpty(newStyles) ? styles : A3(elm$core$Dict$insert, classname, newStyles, styles);
	});
var rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute = function (_n0) {
	var val = _n0.a;
	return val;
};
var rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml = F2(
	function (_n6, _n7) {
		var key = _n6.a;
		var html = _n6.b;
		var pairs = _n7.a;
		var styles = _n7.b;
		switch (html.$) {
			case 4:
				var vdom = html.a;
				return _Utils_Tuple2(
					A2(
						elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					styles);
			case 0:
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3(elm$core$List$foldl, rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _n9 = A3(
					elm$core$List$foldl,
					rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _n9.a;
				var finalStyles = _n9.b;
				var vdom = A3(
					elm$virtual_dom$VirtualDom$node,
					elemType,
					A2(elm$core$List$map, rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
			case 1:
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3(elm$core$List$foldl, rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _n10 = A3(
					elm$core$List$foldl,
					rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _n10.a;
				var finalStyles = _n10.b;
				var vdom = A4(
					elm$virtual_dom$VirtualDom$nodeNS,
					ns,
					elemType,
					A2(elm$core$List$map, rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
			case 2:
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3(elm$core$List$foldl, rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _n11 = A3(
					elm$core$List$foldl,
					rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _n11.a;
				var finalStyles = _n11.b;
				var vdom = A3(
					elm$virtual_dom$VirtualDom$keyedNode,
					elemType,
					A2(elm$core$List$map, rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
			default:
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3(elm$core$List$foldl, rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _n12 = A3(
					elm$core$List$foldl,
					rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _n12.a;
				var finalStyles = _n12.b;
				var vdom = A4(
					elm$virtual_dom$VirtualDom$keyedNodeNS,
					ns,
					elemType,
					A2(elm$core$List$map, rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
		}
	});
var rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml = F2(
	function (html, _n0) {
		var nodes = _n0.a;
		var styles = _n0.b;
		switch (html.$) {
			case 4:
				var vdomNode = html.a;
				return _Utils_Tuple2(
					A2(elm$core$List$cons, vdomNode, nodes),
					styles);
			case 0:
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3(elm$core$List$foldl, rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _n2 = A3(
					elm$core$List$foldl,
					rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _n2.a;
				var finalStyles = _n2.b;
				var vdomNode = A3(
					elm$virtual_dom$VirtualDom$node,
					elemType,
					A2(elm$core$List$map, rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(elm$core$List$cons, vdomNode, nodes),
					finalStyles);
			case 1:
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3(elm$core$List$foldl, rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _n3 = A3(
					elm$core$List$foldl,
					rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _n3.a;
				var finalStyles = _n3.b;
				var vdomNode = A4(
					elm$virtual_dom$VirtualDom$nodeNS,
					ns,
					elemType,
					A2(elm$core$List$map, rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(elm$core$List$cons, vdomNode, nodes),
					finalStyles);
			case 2:
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3(elm$core$List$foldl, rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _n4 = A3(
					elm$core$List$foldl,
					rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _n4.a;
				var finalStyles = _n4.b;
				var vdomNode = A3(
					elm$virtual_dom$VirtualDom$keyedNode,
					elemType,
					A2(elm$core$List$map, rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(elm$core$List$cons, vdomNode, nodes),
					finalStyles);
			default:
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3(elm$core$List$foldl, rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _n5 = A3(
					elm$core$List$foldl,
					rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _n5.a;
				var finalStyles = _n5.b;
				var vdomNode = A4(
					elm$virtual_dom$VirtualDom$keyedNodeNS,
					ns,
					elemType,
					A2(elm$core$List$map, rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties),
					elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(elm$core$List$cons, vdomNode, nodes),
					finalStyles);
		}
	});
var elm$core$Dict$singleton = F2(
	function (key, value) {
		return A5(elm$core$Dict$RBNode_elm_builtin, 1, key, value, elm$core$Dict$RBEmpty_elm_builtin, elm$core$Dict$RBEmpty_elm_builtin);
	});
var rtfeldman$elm_css$VirtualDom$Styled$stylesFromPropertiesHelp = F2(
	function (candidate, properties) {
		stylesFromPropertiesHelp:
		while (true) {
			if (!properties.b) {
				return candidate;
			} else {
				var _n1 = properties.a;
				var styles = _n1.b;
				var classname = _n1.c;
				var rest = properties.b;
				if (elm$core$String$isEmpty(classname)) {
					var $temp$candidate = candidate,
						$temp$properties = rest;
					candidate = $temp$candidate;
					properties = $temp$properties;
					continue stylesFromPropertiesHelp;
				} else {
					var $temp$candidate = elm$core$Maybe$Just(
						_Utils_Tuple2(classname, styles)),
						$temp$properties = rest;
					candidate = $temp$candidate;
					properties = $temp$properties;
					continue stylesFromPropertiesHelp;
				}
			}
		}
	});
var rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties = function (properties) {
	var _n0 = A2(rtfeldman$elm_css$VirtualDom$Styled$stylesFromPropertiesHelp, elm$core$Maybe$Nothing, properties);
	if (_n0.$ === 1) {
		return elm$core$Dict$empty;
	} else {
		var _n1 = _n0.a;
		var classname = _n1.a;
		var styles = _n1.b;
		return A2(elm$core$Dict$singleton, classname, styles);
	}
};
var rtfeldman$elm_css$Css$Structure$ClassSelector = function (a) {
	return {$: 0, a: a};
};
var rtfeldman$elm_css$VirtualDom$Styled$snippetFromPair = function (_n0) {
	var classname = _n0.a;
	var styles = _n0.b;
	return A2(
		rtfeldman$elm_css$VirtualDom$Styled$makeSnippet,
		styles,
		rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence(
			_List_fromArray(
				[
					rtfeldman$elm_css$Css$Structure$ClassSelector(classname)
				])));
};
var rtfeldman$elm_css$VirtualDom$Styled$toDeclaration = function (dict) {
	return rtfeldman$elm_css$Css$Preprocess$Resolve$compile(
		elm$core$List$singleton(
			rtfeldman$elm_css$Css$Preprocess$stylesheet(
				A2(
					elm$core$List$map,
					rtfeldman$elm_css$VirtualDom$Styled$snippetFromPair,
					elm$core$Dict$toList(dict)))));
};
var rtfeldman$elm_css$VirtualDom$Styled$toStyleNode = function (styles) {
	return A3(
		elm$virtual_dom$VirtualDom$node,
		'style',
		_List_Nil,
		elm$core$List$singleton(
			elm$virtual_dom$VirtualDom$text(
				rtfeldman$elm_css$VirtualDom$Styled$toDeclaration(styles))));
};
var rtfeldman$elm_css$VirtualDom$Styled$unstyle = F3(
	function (elemType, properties, children) {
		var unstyledProperties = A2(elm$core$List$map, rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
		var _n0 = A3(
			elm$core$List$foldl,
			rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			children);
		var childNodes = _n0.a;
		var styles = _n0.b;
		var styleNode = rtfeldman$elm_css$VirtualDom$Styled$toStyleNode(styles);
		return A3(
			elm$virtual_dom$VirtualDom$node,
			elemType,
			unstyledProperties,
			A2(
				elm$core$List$cons,
				styleNode,
				elm$core$List$reverse(childNodes)));
	});
var rtfeldman$elm_css$VirtualDom$Styled$containsKey = F2(
	function (key, pairs) {
		containsKey:
		while (true) {
			if (!pairs.b) {
				return false;
			} else {
				var _n1 = pairs.a;
				var str = _n1.a;
				var rest = pairs.b;
				if (_Utils_eq(key, str)) {
					return true;
				} else {
					var $temp$key = key,
						$temp$pairs = rest;
					key = $temp$key;
					pairs = $temp$pairs;
					continue containsKey;
				}
			}
		}
	});
var rtfeldman$elm_css$VirtualDom$Styled$getUnusedKey = F2(
	function (_default, pairs) {
		getUnusedKey:
		while (true) {
			if (!pairs.b) {
				return _default;
			} else {
				var _n1 = pairs.a;
				var firstKey = _n1.a;
				var rest = pairs.b;
				var newKey = '_' + firstKey;
				if (A2(rtfeldman$elm_css$VirtualDom$Styled$containsKey, newKey, rest)) {
					var $temp$default = newKey,
						$temp$pairs = rest;
					_default = $temp$default;
					pairs = $temp$pairs;
					continue getUnusedKey;
				} else {
					return newKey;
				}
			}
		}
	});
var rtfeldman$elm_css$VirtualDom$Styled$toKeyedStyleNode = F2(
	function (allStyles, keyedChildNodes) {
		var styleNodeKey = A2(rtfeldman$elm_css$VirtualDom$Styled$getUnusedKey, '_', keyedChildNodes);
		var finalNode = rtfeldman$elm_css$VirtualDom$Styled$toStyleNode(allStyles);
		return _Utils_Tuple2(styleNodeKey, finalNode);
	});
var rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyed = F3(
	function (elemType, properties, keyedChildren) {
		var unstyledProperties = A2(elm$core$List$map, rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
		var _n0 = A3(
			elm$core$List$foldl,
			rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			keyedChildren);
		var keyedChildNodes = _n0.a;
		var styles = _n0.b;
		var keyedStyleNode = A2(rtfeldman$elm_css$VirtualDom$Styled$toKeyedStyleNode, styles, keyedChildNodes);
		return A3(
			elm$virtual_dom$VirtualDom$keyedNode,
			elemType,
			unstyledProperties,
			A2(
				elm$core$List$cons,
				keyedStyleNode,
				elm$core$List$reverse(keyedChildNodes)));
	});
var rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyedNS = F4(
	function (ns, elemType, properties, keyedChildren) {
		var unstyledProperties = A2(elm$core$List$map, rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
		var _n0 = A3(
			elm$core$List$foldl,
			rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			keyedChildren);
		var keyedChildNodes = _n0.a;
		var styles = _n0.b;
		var keyedStyleNode = A2(rtfeldman$elm_css$VirtualDom$Styled$toKeyedStyleNode, styles, keyedChildNodes);
		return A4(
			elm$virtual_dom$VirtualDom$keyedNodeNS,
			ns,
			elemType,
			unstyledProperties,
			A2(
				elm$core$List$cons,
				keyedStyleNode,
				elm$core$List$reverse(keyedChildNodes)));
	});
var rtfeldman$elm_css$VirtualDom$Styled$unstyleNS = F4(
	function (ns, elemType, properties, children) {
		var unstyledProperties = A2(elm$core$List$map, rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
		var initialStyles = rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
		var _n0 = A3(
			elm$core$List$foldl,
			rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			children);
		var childNodes = _n0.a;
		var styles = _n0.b;
		var styleNode = rtfeldman$elm_css$VirtualDom$Styled$toStyleNode(styles);
		return A4(
			elm$virtual_dom$VirtualDom$nodeNS,
			ns,
			elemType,
			unstyledProperties,
			A2(
				elm$core$List$cons,
				styleNode,
				elm$core$List$reverse(childNodes)));
	});
var rtfeldman$elm_css$VirtualDom$Styled$toUnstyled = function (vdom) {
	switch (vdom.$) {
		case 4:
			var plainNode = vdom.a;
			return plainNode;
		case 0:
			var elemType = vdom.a;
			var properties = vdom.b;
			var children = vdom.c;
			return A3(rtfeldman$elm_css$VirtualDom$Styled$unstyle, elemType, properties, children);
		case 1:
			var ns = vdom.a;
			var elemType = vdom.b;
			var properties = vdom.c;
			var children = vdom.d;
			return A4(rtfeldman$elm_css$VirtualDom$Styled$unstyleNS, ns, elemType, properties, children);
		case 2:
			var elemType = vdom.a;
			var properties = vdom.b;
			var children = vdom.c;
			return A3(rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyed, elemType, properties, children);
		default:
			var ns = vdom.a;
			var elemType = vdom.b;
			var properties = vdom.c;
			var children = vdom.d;
			return A4(rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyedNS, ns, elemType, properties, children);
	}
};
var rtfeldman$elm_css$Html$Styled$toUnstyled = rtfeldman$elm_css$VirtualDom$Styled$toUnstyled;
var rtfeldman$elm_css$Html$Styled$Attributes$src = function (url) {
	return A2(rtfeldman$elm_css$Html$Styled$Attributes$stringProperty, 'src', url);
};
var author$project$Page$Style$userImage = F2(
	function (size, imageId) {
		return rtfeldman$elm_css$Html$Styled$toUnstyled(
			A2(
				rtfeldman$elm_css$Html$Styled$img,
				_List_fromArray(
					[
						rtfeldman$elm_css$Html$Styled$Attributes$css(
						_List_fromArray(
							[
								rtfeldman$elm_css$Css$display(rtfeldman$elm_css$Css$block),
								rtfeldman$elm_css$Css$width(
								rtfeldman$elm_css$Css$px(size)),
								rtfeldman$elm_css$Css$height(
								rtfeldman$elm_css$Css$px(size)),
								rtfeldman$elm_css$Css$borderRadius(
								rtfeldman$elm_css$Css$pct(50)),
								rtfeldman$elm_css$Css$flexShrink(
								rtfeldman$elm_css$Css$int(0)),
								rtfeldman$elm_css$Css$padding(
								rtfeldman$elm_css$Css$px(4))
							])),
						rtfeldman$elm_css$Html$Styled$Attributes$src(
						author$project$Data$ImageId$toUrlString(imageId))
					]),
				_List_Nil));
	});
var rtfeldman$elm_css$VirtualDom$Styled$unstyledNode = rtfeldman$elm_css$VirtualDom$Styled$Unstyled;
var rtfeldman$elm_css$Html$Styled$fromUnstyled = rtfeldman$elm_css$VirtualDom$Styled$unstyledNode;
var author$project$BasicParts$bottomNavigation = F2(
	function (logInState, select) {
		return rtfeldman$elm_css$Html$Styled$toUnstyled(
			function () {
				switch (logInState.$) {
					case 0:
						return author$project$BasicParts$bottomNavigationContainer(
							_List_fromArray(
								[
									A4(
									author$project$BasicParts$bottomNavigationItem,
									!select,
									elm$core$Maybe$Just(author$project$PageLocation$Home),
									elm$core$Maybe$Just(author$project$Icon$home),
									'ホーム'),
									A4(
									author$project$BasicParts$bottomNavigationItem,
									select === 1,
									elm$core$Maybe$Just(
										author$project$PageLocation$Search(author$project$Data$SearchCondition$None)),
									elm$core$Maybe$Just(author$project$Icon$search),
									'検索'),
									A4(
									author$project$BasicParts$bottomNavigationItem,
									select === 3,
									elm$core$Maybe$Just(author$project$PageLocation$LogIn),
									elm$core$Maybe$Nothing,
									'ログイン')
								]));
					case 1:
						return author$project$BasicParts$bottomNavigationContainer(
							_List_fromArray(
								[
									A4(
									author$project$BasicParts$bottomNavigationItem,
									!select,
									elm$core$Maybe$Just(author$project$PageLocation$Home),
									elm$core$Maybe$Just(author$project$Icon$home),
									'ホーム'),
									A4(
									author$project$BasicParts$bottomNavigationItem,
									select === 1,
									elm$core$Maybe$Just(
										author$project$PageLocation$Search(author$project$Data$SearchCondition$None)),
									elm$core$Maybe$Just(author$project$Icon$search),
									'検索'),
									A4(
									author$project$BasicParts$bottomNavigationItem,
									select === 2,
									elm$core$Maybe$Just(author$project$PageLocation$Notification),
									elm$core$Maybe$Just(author$project$Icon$notifications),
									'通知'),
									A4(
									author$project$BasicParts$bottomNavigationItem,
									select === 3,
									elm$core$Maybe$Just(author$project$PageLocation$LogIn),
									elm$core$Maybe$Nothing,
									'ユーザー')
								]));
					default:
						var userWithName = logInState.a.dF;
						return author$project$BasicParts$bottomNavigationContainer(
							_List_fromArray(
								[
									A4(
									author$project$BasicParts$bottomNavigationItem,
									!select,
									elm$core$Maybe$Just(author$project$PageLocation$Home),
									elm$core$Maybe$Just(author$project$Icon$home),
									'ホーム'),
									A4(
									author$project$BasicParts$bottomNavigationItem,
									select === 1,
									elm$core$Maybe$Just(
										author$project$PageLocation$Search(author$project$Data$SearchCondition$None)),
									elm$core$Maybe$Just(author$project$Icon$search),
									'検索'),
									A4(
									author$project$BasicParts$bottomNavigationItem,
									select === 2,
									elm$core$Maybe$Just(author$project$PageLocation$Notification),
									elm$core$Maybe$Just(author$project$Icon$notifications),
									'通知'),
									A4(
									author$project$BasicParts$bottomNavigationItem,
									select === 3,
									elm$core$Maybe$Just(
										author$project$PageLocation$User(
											author$project$Data$User$withNameGetId(userWithName))),
									elm$core$Maybe$Just(
										elm$core$Basics$always(
											rtfeldman$elm_css$Html$Styled$fromUnstyled(
												A2(
													author$project$Page$Style$userImage,
													32,
													author$project$Data$User$withNameGetImageId(userWithName))))),
									'ユーザー')
								]));
				}
			}());
	});
var rtfeldman$elm_css$Css$Preprocess$ExtendSelector = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var rtfeldman$elm_css$Css$Structure$PseudoClassSelector = function (a) {
	return {$: 2, a: a};
};
var rtfeldman$elm_css$Css$pseudoClass = function (_class) {
	return rtfeldman$elm_css$Css$Preprocess$ExtendSelector(
		rtfeldman$elm_css$Css$Structure$PseudoClassSelector(_class));
};
var rtfeldman$elm_css$Css$hover = rtfeldman$elm_css$Css$pseudoClass('hover');
var rtfeldman$elm_css$Css$rgba = F4(
	function (r, g, b, alpha) {
		return {
			aO: alpha,
			aR: b,
			dQ: 0,
			aV: g,
			a3: r,
			ey: A2(
				rtfeldman$elm_css$Css$cssFunction,
				'rgba',
				_Utils_ap(
					A2(
						elm$core$List$map,
						elm$core$String$fromInt,
						_List_fromArray(
							[r, g, b])),
					_List_fromArray(
						[
							elm$core$String$fromFloat(alpha)
						])))
		};
	});
var author$project$BasicParts$hoverCss = rtfeldman$elm_css$Css$hover(
	_List_fromArray(
		[
			rtfeldman$elm_css$Css$backgroundColor(
			A4(rtfeldman$elm_css$Css$rgba, 0, 0, 0, 0.4))
		]));
var rtfeldman$elm_css$Css$cursor = rtfeldman$elm_css$Css$prop1('cursor');
var rtfeldman$elm_css$Css$pointer = {f: 0, ey: 'pointer'};
var elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var rtfeldman$elm_css$VirtualDom$Styled$on = F2(
	function (eventName, handler) {
		return A3(
			rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2(elm$virtual_dom$VirtualDom$on, eventName, handler),
			_List_Nil,
			'');
	});
var rtfeldman$elm_css$Html$Styled$Events$on = F2(
	function (event, decoder) {
		return A2(
			rtfeldman$elm_css$VirtualDom$Styled$on,
			event,
			elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var rtfeldman$elm_css$Html$Styled$Events$onClick = function (msg) {
	return A2(
		rtfeldman$elm_css$Html$Styled$Events$on,
		'click',
		elm$json$Json$Decode$succeed(msg));
};
var rtfeldman$elm_css$Svg$Styled$Attributes$fill = rtfeldman$elm_css$VirtualDom$Styled$attribute('fill');
var author$project$BasicParts$backArrow = A2(
	rtfeldman$elm_css$Html$Styled$div,
	_List_fromArray(
		[
			rtfeldman$elm_css$Html$Styled$Attributes$css(
			_List_fromArray(
				[
					rtfeldman$elm_css$Css$width(
					rtfeldman$elm_css$Css$px(32)),
					rtfeldman$elm_css$Css$height(
					rtfeldman$elm_css$Css$px(32)),
					rtfeldman$elm_css$Css$padding(
					rtfeldman$elm_css$Css$px(16)),
					rtfeldman$elm_css$Css$cursor(rtfeldman$elm_css$Css$pointer),
					author$project$BasicParts$hoverCss
				])),
			rtfeldman$elm_css$Html$Styled$Events$onClick(0)
		]),
	_List_fromArray(
		[
			A2(
			rtfeldman$elm_css$Svg$Styled$svg,
			_List_fromArray(
				[
					rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 24 24')
				]),
			_List_fromArray(
				[
					A2(
					rtfeldman$elm_css$Svg$Styled$path,
					_List_fromArray(
						[
							rtfeldman$elm_css$Svg$Styled$Attributes$d('M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z'),
							rtfeldman$elm_css$Svg$Styled$Attributes$fill('white')
						]),
					_List_Nil)
				]))
		]));
var author$project$Page$Style$primaryColor = A3(rtfeldman$elm_css$Css$rgb, 115, 63, 167);
var rtfeldman$elm_css$Css$borderBox = {bH: 0, bh: 0, ey: 'border-box'};
var rtfeldman$elm_css$Css$prop4 = F5(
	function (key, argA, argB, argC, argD) {
		return A2(
			rtfeldman$elm_css$Css$property,
			key,
			A2(
				elm$core$String$join,
				' ',
				_List_fromArray(
					[argA.ey, argB.ey, argC.ey, argD.ey])));
	});
var rtfeldman$elm_css$Css$boxShadow4 = rtfeldman$elm_css$Css$prop4('box-shadow');
var rtfeldman$elm_css$Css$boxSizing = rtfeldman$elm_css$Css$prop1('box-sizing');
var rtfeldman$elm_css$Css$zIndex = rtfeldman$elm_css$Css$prop1('z-index');
var rtfeldman$elm_css$Html$Styled$header = rtfeldman$elm_css$Html$Styled$node('header');
var author$project$BasicParts$header = A2(
	elm$core$Basics$composeR,
	rtfeldman$elm_css$Html$Styled$header(
		_List_fromArray(
			[
				rtfeldman$elm_css$Html$Styled$Attributes$css(
				_List_fromArray(
					[
						rtfeldman$elm_css$Css$displayFlex,
						rtfeldman$elm_css$Css$backgroundColor(author$project$Page$Style$primaryColor),
						A4(
						rtfeldman$elm_css$Css$boxShadow4,
						rtfeldman$elm_css$Css$zero,
						rtfeldman$elm_css$Css$px(2),
						rtfeldman$elm_css$Css$px(4),
						A4(rtfeldman$elm_css$Css$rgba, 0, 0, 0, 0.18)),
						rtfeldman$elm_css$Css$position(rtfeldman$elm_css$Css$fixed),
						rtfeldman$elm_css$Css$width(
						rtfeldman$elm_css$Css$pct(100)),
						rtfeldman$elm_css$Css$padding(rtfeldman$elm_css$Css$zero),
						rtfeldman$elm_css$Css$boxSizing(rtfeldman$elm_css$Css$borderBox),
						rtfeldman$elm_css$Css$zIndex(
						rtfeldman$elm_css$Css$int(2))
					]))
			])),
	rtfeldman$elm_css$Html$Styled$toUnstyled);
var author$project$BasicParts$logoSubTextFontColor = rtfeldman$elm_css$Svg$Styled$Attributes$fill('#ffe2a6');
var rtfeldman$elm_css$Svg$Styled$Attributes$transform = rtfeldman$elm_css$VirtualDom$Styled$attribute('transform');
var author$project$BasicParts$logoSubText = _List_fromArray(
	[
		A2(
		rtfeldman$elm_css$Svg$Styled$path,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$d('M45.47,34.08a9.23,9.23,0,0,1,.8,1.56.62.62,0,0,1,0,.18.5.5,0,0,1-.42.46l-.24,0a.49.49,0,0,1-.51-.34,9.9,9.9,0,0,0-.89-1.89h-.88A13.18,13.18,0,0,1,42,35.85a.76.76,0,0,1-.54.28.65.65,0,0,1-.41-.16.61.61,0,0,1-.21-.44.53.53,0,0,1,.18-.41,9.3,9.3,0,0,0,2.16-3.36.52.52,0,0,1,.51-.34l.26,0c.29.1.42.24.42.46a.65.65,0,0,1-.07.29c-.11.27-.22.55-.35.83h3.73c.28,0,.47.18.47.53a.46.46,0,0,1-.47.52Zm-3.77,4.1c-.29,0-.45-.25-.45-.57s.16-.55.45-.55h4.88c.29,0,.45.22.45.55s-.16.57-.45.57H44.69v4.43c.56-.19,1.09-.39,1.55-.58a.57.57,0,0,1,.27-.07.45.45,0,0,1,.43.3.67.67,0,0,1,0,.24.65.65,0,0,1-.43.62,34.44,34.44,0,0,1-4.91,1.61h-.18a.54.54,0,0,1-.55-.48,1,1,0,0,1,0-.22.48.48,0,0,1,.43-.52A20.06,20.06,0,0,0,43.47,43V38.18Zm11.85,6.29c0,.32.13.39.5.39s.57-.12.67-.43a5.5,5.5,0,0,0,.18-1.51c0-.34.23-.48.54-.48h0A.48.48,0,0,1,56,43a7.18,7.18,0,0,1-.29,2c-.23.68-.6,1-1.75,1-1.32,0-1.6-.27-1.6-1.18V37.89c0-.33-.14-.43-.48-.43H49.42c-.32,0-.48.1-.48.43,0,4.72-.67,6.64-2.51,8.28a.88.88,0,0,1-.55.23.61.61,0,0,1-.44-.19.68.68,0,0,1-.21-.48.52.52,0,0,1,.23-.42c1.87-1.56,2.29-3.18,2.29-7.62,0-.93.42-1.3,1.35-1.3h3.1c.94,0,1.35.37,1.35,1.3ZM49.78,34.1a8.8,8.8,0,0,1-1.09,1.59.67.67,0,0,1-.5.28.64.64,0,0,1-.39-.15.5.5,0,0,1-.21-.4.71.71,0,0,1,.17-.43,8.45,8.45,0,0,0,1.73-3.18.5.5,0,0,1,.52-.39l.24,0a.52.52,0,0,1,.37.73,7.71,7.71,0,0,1-.32.86h4.89c.29,0,.47.17.47.52s-.18.54-.47.54H52.4a7.5,7.5,0,0,1,.68,1.36.61.61,0,0,1,0,.17.47.47,0,0,1-.42.45.82.82,0,0,1-.21,0,.59.59,0,0,1-.56-.37,8.78,8.78,0,0,0-.76-1.64ZM50,38.94a.67.67,0,0,1,.52.33,14.25,14.25,0,0,1,1.33,2.65.77.77,0,0,1,.07.32.59.59,0,0,1-.36.54.67.67,0,0,1-.28.08.55.55,0,0,1-.49-.42,15.31,15.31,0,0,0-1.28-2.64.54.54,0,0,1-.11-.32.5.5,0,0,1,.31-.46A.6.6,0,0,1,50,38.94Z'),
				rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$BasicParts$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		rtfeldman$elm_css$Svg$Styled$path,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$d('M60.47,41.18a.7.7,0,0,1,0,.25A24.41,24.41,0,0,1,58.16,46a.63.63,0,0,1-.52.27.72.72,0,0,1-.42-.13.55.55,0,0,1-.29-.5.65.65,0,0,1,.11-.36A20,20,0,0,0,59.23,41a.56.56,0,0,1,.54-.39.71.71,0,0,1,.7.61ZM60.32,38a.59.59,0,0,1-.14.37.63.63,0,0,1-.49.24.69.69,0,0,1-.46-.18,16.21,16.21,0,0,0-2-1.59.52.52,0,0,1-.23-.44.73.73,0,0,1,.13-.39.69.69,0,0,1,.5-.26.64.64,0,0,1,.33.1,14,14,0,0,1,2.16,1.64A.74.74,0,0,1,60.32,38ZM61,34a.57.57,0,0,1-.16.41.64.64,0,0,1-.47.23.71.71,0,0,1-.52-.25A13.88,13.88,0,0,0,58,32.83a.51.51,0,0,1-.23-.42A.69.69,0,0,1,57.9,32a.76.76,0,0,1,.52-.25.67.67,0,0,1,.36.12,12.26,12.26,0,0,1,2,1.69A.64.64,0,0,1,61,34Zm2.1,4.73c-.2,3.48-.81,5.59-1.82,7.23a.66.66,0,0,1-.54.35.78.78,0,0,1-.36-.1.54.54,0,0,1-.3-.49.67.67,0,0,1,.13-.39c1.26-2,1.7-4.22,1.7-9.07V34.91a1.29,1.29,0,0,1,1.46-1.46H66V31.86c0-.31.22-.47.6-.47s.6.16.6.47v1.59h3.46c.78,0,1.2.39,1.2,1a1.55,1.55,0,0,1-.1.54,6.33,6.33,0,0,1-1,1.76.71.71,0,0,1-.56.3.6.6,0,0,1-.35-.11.53.53,0,0,1-.25-.42.63.63,0,0,1,.13-.36,6.22,6.22,0,0,0,.78-1.22.27.27,0,0,0,0-.16c0-.11-.09-.16-.31-.16h-3v3.07h2.52a1,1,0,0,1,1.1,1,1.82,1.82,0,0,1-.14.66,12,12,0,0,1-2.62,3.77,12.69,12.69,0,0,0,3.59,2,.61.61,0,0,1,.41.57.86.86,0,0,1,0,.27.66.66,0,0,1-.59.41.68.68,0,0,1-.29-.07,13.35,13.35,0,0,1-4-2.35,14.08,14.08,0,0,1-4,2.39.69.69,0,0,1-.31.06.6.6,0,0,1-.54-.37.7.7,0,0,1-.05-.25.61.61,0,0,1,.44-.56,14,14,0,0,0,3.64-2.07,13.4,13.4,0,0,1-2.63-4.34Zm3-1.1V34.59H63.72c-.44,0-.6.13-.6.63v1.22c0,.42,0,.83,0,1.22Zm-1.11,1.1a10.4,10.4,0,0,0,2.31,3.59,8.91,8.91,0,0,0,2.23-3.15.74.74,0,0,0,0-.23c0-.14-.08-.21-.26-.21Z'),
				rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$BasicParts$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		rtfeldman$elm_css$Svg$Styled$path,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$d('M81.31,36.59a12.32,12.32,0,0,0,2.54,5,12.09,12.09,0,0,0,4.09,3.17.58.58,0,0,1,.38.55.87.87,0,0,1-.13.44.67.67,0,0,1-.59.34.85.85,0,0,1-.4-.1,13.17,13.17,0,0,1-4.33-3.55,12.81,12.81,0,0,1-2.14-4.16,11.82,11.82,0,0,1-1.16,3,11.28,11.28,0,0,1-5.23,4.8,1.07,1.07,0,0,1-.32.08.66.66,0,0,1-.6-.41.68.68,0,0,1-.1-.36.59.59,0,0,1,.36-.53,9.6,9.6,0,0,0,4.82-4.28,10.87,10.87,0,0,0,1.25-4H74c-.32,0-.5-.3-.5-.65s.18-.62.5-.62h5.88c.07-.91.1-2,.1-3.15,0-.39.28-.56.67-.56s.65.2.65.56c0,1.13,0,2.17-.12,3.15h6.44c.32,0,.5.27.5.62s-.18.65-.5.65Z'),
				rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$BasicParts$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		rtfeldman$elm_css$Svg$Styled$path,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$d('M103.91,44.68c.3,0,.47.24.47.6s-.17.58-.47.58H90.13c-.29,0-.45-.24-.45-.58s.16-.6.45-.6h6.39V40.57H92.21c-.29,0-.48-.25-.48-.59s.19-.58.48-.58h4.31V36h-3.8a15.92,15.92,0,0,1-1.89,3,.64.64,0,0,1-.47.24.67.67,0,0,1-.47-.19.57.57,0,0,1-.23-.44.81.81,0,0,1,.18-.46,15,15,0,0,0,2.84-5.63.53.53,0,0,1,.54-.41l.23,0a.59.59,0,0,1,.5.54.3.3,0,0,1,0,.16,16.39,16.39,0,0,1-.7,1.95h3.3V32c0-.31.28-.5.65-.5s.67.19.67.5v2.86h5.47c.29,0,.46.23.46.59s-.17.58-.46.58H97.84v3.4h4.61c.29,0,.47.24.47.58s-.18.59-.47.59H97.84v4.11Z'),
				rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$BasicParts$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		rtfeldman$elm_css$Svg$Styled$path,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$d('M109,40.57c-.92,0-1.36-.38-1.36-1.27v-3c0-.89.44-1.27,1.36-1.27h3.82V33.94h-6.11c-.27,0-.45-.2-.45-.54s.18-.52.45-.52h6.11v-1c0-.28.25-.46.6-.46s.59.18.59.46v1h6.43c.28,0,.46.18.46.52s-.18.54-.46.54h-6.43V35h4.14c.91,0,1.35.38,1.35,1.29v3c0,.89-.44,1.27-1.35,1.27h-.61v1h2.92c.28,0,.44.21.44.52s-.16.56-.44.56h-2.92v2.45c0,.94-.54,1.35-1.78,1.35a9,9,0,0,1-1.56-.15.49.49,0,0,1-.47-.53.56.56,0,0,1,0-.17.48.48,0,0,1,.5-.45h.18a5.69,5.69,0,0,0,1.19.13c.58,0,.71-.09.71-.52V42.7h-9.65c-.28,0-.44-.23-.44-.56s.16-.52.44-.52h9.65v-1Zm.41-4.62c-.37,0-.57.13-.57.51v.79h4V36Zm-.57,2.21v.94c0,.39.2.51.57.51h3.41V38.16Zm3.58,6.6a.59.59,0,0,1,.14.37.54.54,0,0,1-.21.43.7.7,0,0,1-.45.17.58.58,0,0,1-.43-.17,13.28,13.28,0,0,0-1.72-1.6.4.4,0,0,1-.19-.34.54.54,0,0,1,.19-.39.72.72,0,0,1,.46-.18.74.74,0,0,1,.42.15A15.33,15.33,0,0,1,112.46,44.76Zm5.88-7.51v-.79c0-.38-.2-.51-.57-.51h-3.72v1.3Zm-.57,2.36c.37,0,.57-.12.57-.51v-.94h-4.29v1.45Z'),
				rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$BasicParts$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		rtfeldman$elm_css$Svg$Styled$path,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$d('M124.87,41.1A11.46,11.46,0,0,1,123.5,46a.61.61,0,0,1-.55.34.76.76,0,0,1-.36-.1.65.65,0,0,1-.37-.56.56.56,0,0,1,.1-.33c1.2-1.79,1.41-4.32,1.44-8.37,0-1,0-2.16,0-3.52,0-1,.48-1.4,1.45-1.4H135c1,0,1.45.4,1.45,1.4V44.76c0,1-.62,1.53-1.94,1.53a11.21,11.21,0,0,1-2-.17.51.51,0,0,1-.47-.53.46.46,0,0,1,0-.2.5.5,0,0,1,.49-.45h.16a8.09,8.09,0,0,0,1.61.18c.75,0,.89-.13.89-.66V41.1h-4.74v4.44c0,.29-.26.45-.64.45s-.6-.16-.6-.45V41.1Zm.16-4a1.1,1.1,0,0,0,0,.25c0,.91,0,1.77-.06,2.57h4.27V37.15ZM129.22,36V33.25h-3.64c-.36,0-.52.1-.52.49,0,.85,0,1.59,0,2.29Zm6-2.29c0-.39-.14-.49-.5-.49h-4.24V36h4.74Zm0,3.41h-4.74V40h4.74Z'),
				rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$BasicParts$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		rtfeldman$elm_css$Svg$Styled$path,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$d('M146.93,34c-1.66.18-3.36.31-5.05.36h0a.55.55,0,0,1-.6-.59.53.53,0,0,1,.53-.6,39.31,39.31,0,0,0,10.35-1.43.8.8,0,0,1,.31-.07.54.54,0,0,1,.54.41,1,1,0,0,1,0,.28.58.58,0,0,1-.47.57,36.9,36.9,0,0,1-4.34.89v2.62h5.26c.28,0,.46.24.46.58a.51.51,0,0,1-.46.57H148.2v2.44h6a.52.52,0,0,1,.47.58c0,.33-.19.6-.47.6h-6v3.38c0,1.21-.52,1.66-2.18,1.66a9.73,9.73,0,0,1-2-.19.57.57,0,0,1-.46-.61.36.36,0,0,1,0-.14.5.5,0,0,1,.52-.49.44.44,0,0,1,.16,0,10.05,10.05,0,0,0,1.68.18c.84,0,1-.12,1-.67V41.23h-6.34a.52.52,0,0,1-.47-.58c0-.34.18-.6.47-.6h6.34V37.61h-5.57c-.3,0-.46-.24-.46-.57s.16-.58.46-.58h5.57Z'),
				rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$BasicParts$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		rtfeldman$elm_css$Svg$Styled$path,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$d('M159.29,41.18a1.29,1.29,0,0,1,0,.25,21.92,21.92,0,0,1-1.92,4.63.65.65,0,0,1-.55.31.73.73,0,0,1-.36-.1.58.58,0,0,1-.32-.52.74.74,0,0,1,.1-.37A19.32,19.32,0,0,0,158.07,41a.55.55,0,0,1,.54-.42.91.91,0,0,1,.23,0A.53.53,0,0,1,159.29,41.18ZM159.5,38a.54.54,0,0,1-.14.37.62.62,0,0,1-.51.25.66.66,0,0,1-.43-.18,14.59,14.59,0,0,0-2-1.5.48.48,0,0,1-.22-.44.75.75,0,0,1,.13-.39.66.66,0,0,1,.5-.24.76.76,0,0,1,.33.08,13,13,0,0,1,2.14,1.55A.62.62,0,0,1,159.5,38Zm.44-4.45a.73.73,0,0,1,.2.48.57.57,0,0,1-.16.41.6.6,0,0,1-.46.21.75.75,0,0,1-.52-.23,13.47,13.47,0,0,0-1.85-1.59.57.57,0,0,1-.21-.45.65.65,0,0,1,.13-.39.68.68,0,0,1,.52-.25.57.57,0,0,1,.35.12A13.39,13.39,0,0,1,159.94,33.55Zm10.76-.83c.29,0,.44.24.44.55s-.15.59-.44.59h-8.35c-.41,0-.57.14-.57.58,0,1.8-.05,4.32-.23,6.11a14.86,14.86,0,0,1-1.48,5.38.75.75,0,0,1-.63.39.8.8,0,0,1-.26,0,.62.62,0,0,1-.34-.55.61.61,0,0,1,.1-.34,12.91,12.91,0,0,0,1.41-5c.18-1.85.23-4.19.23-6.21A1.27,1.27,0,0,1,162,32.72h3.06v-.86c0-.33.24-.49.61-.49s.62.16.62.49v.86Zm-8.21,8.5c-.29,0-.43-.21-.43-.52s.14-.52.43-.52h6.2c.71,0,1.08.39,1.08.87a1.28,1.28,0,0,1-.26.74A10,10,0,0,1,167.35,44a12.42,12.42,0,0,0,3.42,1.31.53.53,0,0,1,.47.54.44.44,0,0,1,0,.16.52.52,0,0,1-.55.46,1.29,1.29,0,0,1-.25,0,14,14,0,0,1-4.06-1.77,14.48,14.48,0,0,1-4.47,1.76h-.16a.55.55,0,0,1-.58-.4.33.33,0,0,1,0-.18.53.53,0,0,1,.46-.54,12.84,12.84,0,0,0,3.85-1.35,9.7,9.7,0,0,1-2.16-2.69ZM169,38c0,.84-.4,1.17-1.23,1.17h-2.71c-.85,0-1.26-.33-1.26-1.17v-1.4h-1.3c-.24,0-.4-.21-.4-.5s.16-.51.4-.51h1.3v-.91c0-.29.25-.45.56-.45s.55.16.55.45v.91h3v-.91c0-.29.19-.45.55-.45s.55.16.55.45v.91h1.55c.29,0,.42.18.42.51s-.13.5-.42.5H169Zm-4.55,3.25a7.07,7.07,0,0,0,1.95,2.09,9.14,9.14,0,0,0,1.87-1.69.41.41,0,0,0,.12-.24c0-.1-.08-.16-.25-.16Zm.46-4.65v1.2c0,.29.15.39.44.39h2.11c.29,0,.44-.08.44-.39v-1.2Z'),
				rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$BasicParts$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		rtfeldman$elm_css$Svg$Styled$path,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$d('M176.94,32.83v.05c-.08,2.39-.21,5.27-.21,7.87,0,1.52.19,2.37.71,2.87a3.46,3.46,0,0,0,2.47.68,4.75,4.75,0,0,0,3.48-1.39,7.78,7.78,0,0,0,1.72-3.24.66.66,0,0,1,.62-.55.8.8,0,0,1,.26.05.68.68,0,0,1,.5.67.71.71,0,0,1-.05.27,8.84,8.84,0,0,1-2.16,3.9,6.14,6.14,0,0,1-4.4,1.72,4.73,4.73,0,0,1-3.46-1.12c-.75-.73-1.09-1.78-1.09-3.85,0-2.52.08-5.52.19-7.91a.66.66,0,0,1,.7-.68h0A.62.62,0,0,1,176.94,32.83Z'),
				rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$BasicParts$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		rtfeldman$elm_css$Svg$Styled$path,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$d('M200.46,33.22a1.82,1.82,0,0,1,1.56.59,1.75,1.75,0,0,1,.34,1.17,3.64,3.64,0,0,1,0,.45c-.7,4.94-4.11,8.65-9.5,10a1,1,0,0,1-.3.05.59.59,0,0,1-.61-.46,1.17,1.17,0,0,1,0-.26.7.7,0,0,1,.52-.68c4.68-1.23,7.87-4.31,8.4-8.68a1,1,0,0,0,0-.24c0-.42-.21-.54-.71-.54h-9.48c-.37,0-.58-.29-.58-.7a.6.6,0,0,1,.58-.68Z'),
				rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$BasicParts$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		rtfeldman$elm_css$Svg$Styled$path,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$d('M208.41,40.08a.66.66,0,0,1-.74.67.65.65,0,0,1-.73-.65V33a.66.66,0,0,1,.73-.66c.44,0,.74.22.74.65ZM215,33a.65.65,0,0,1,.7-.68c.44,0,.77.22.77.65v5.29c0,2.44-.62,4.15-2,5.37a9.68,9.68,0,0,1-5,2.08h-.12a.71.71,0,0,1-.73-.57,1.15,1.15,0,0,1,0-.18.62.62,0,0,1,.58-.64,8.2,8.2,0,0,0,4.29-1.78c1.06-1,1.51-2.36,1.51-4.47Z'),
				rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$BasicParts$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		rtfeldman$elm_css$Svg$Styled$path,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$d('M222.12,39.82a.61.61,0,0,1-.64-.7.65.65,0,0,1,.65-.73h12.34a.65.65,0,0,1,.65.73.61.61,0,0,1-.64.7Z'),
				rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$BasicParts$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		rtfeldman$elm_css$Svg$Styled$path,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$d('M238.4,34.94c-.35,0-.56-.3-.56-.68a.63.63,0,0,1,.56-.7h11a1.67,1.67,0,0,1,1.43.6,1.41,1.41,0,0,1,.28.86,2.36,2.36,0,0,1-.33,1.15,17,17,0,0,1-5.6,5.67,27.46,27.46,0,0,1,1.9,2.38.67.67,0,0,1,.13.42.86.86,0,0,1-.36.67.76.76,0,0,1-.4.13.78.78,0,0,1-.64-.38,38.65,38.65,0,0,0-5.6-6.4.63.63,0,0,1-.25-.47.62.62,0,0,1,.28-.49.63.63,0,0,1,.44-.18.86.86,0,0,1,.52.21,35.2,35.2,0,0,1,3.08,3,14.49,14.49,0,0,0,5-5,1,1,0,0,0,.15-.45c0-.26-.2-.39-.61-.39Z'),
				rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$BasicParts$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		rtfeldman$elm_css$Svg$Styled$path,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$d('M254.61,39.82a.61.61,0,0,1-.64-.7.65.65,0,0,1,.65-.73H267a.65.65,0,0,1,.65.73c0,.44-.23.7-.63.7Z'),
				rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$BasicParts$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		rtfeldman$elm_css$Svg$Styled$path,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$d('M280.2,36.1c-.15,4.81-2.37,8.2-6.62,9.73a1.25,1.25,0,0,1-.32.05.65.65,0,0,1-.62-.39.83.83,0,0,1-.08-.32.67.67,0,0,1,.49-.64c3.54-1.31,5.56-4,5.74-8.43h-4.93a11.61,11.61,0,0,1-2.73,3.25.8.8,0,0,1-.5.19.66.66,0,0,1-.47-.21.71.71,0,0,1-.21-.5.7.7,0,0,1,.27-.55,12.16,12.16,0,0,0,3.3-4.72,8.71,8.71,0,0,0,.45-1.22.65.65,0,0,1,.61-.48l.21,0a.63.63,0,0,1,.53.6.92.92,0,0,1,0,.16,14.11,14.11,0,0,1-.88,2.16h9a.56.56,0,0,1,.62.64c0,.4-.19.65-.6.65Z'),
				rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$BasicParts$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		rtfeldman$elm_css$Svg$Styled$path,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$d('M288.82,36.11a.58.58,0,0,1,.54.35,22,22,0,0,1,1.35,3.36c0,.1,0,.16,0,.24a.55.55,0,0,1-.45.54.91.91,0,0,1-.26,0,.56.56,0,0,1-.57-.41,22.2,22.2,0,0,0-1.3-3.3.38.38,0,0,1-.07-.22.59.59,0,0,1,.42-.54A.73.73,0,0,1,288.82,36.11Zm9.57.31v.12a11.85,11.85,0,0,1-2,5.83,9.46,9.46,0,0,1-5.46,3.45h-.18a.57.57,0,0,1-.58-.44,1,1,0,0,1,0-.24.54.54,0,0,1,.45-.54,8.45,8.45,0,0,0,4.78-3,11.28,11.28,0,0,0,1.75-5.26.55.55,0,0,1,.61-.5h.08C298.18,35.87,298.39,36.07,298.39,36.42Zm-6.15-1a.62.62,0,0,1,.55.36,17.56,17.56,0,0,1,1.27,3.32.86.86,0,0,1,0,.16.57.57,0,0,1-.44.55,1.18,1.18,0,0,1-.27,0,.53.53,0,0,1-.56-.37,19.17,19.17,0,0,0-1.21-3.22.44.44,0,0,1-.07-.24.6.6,0,0,1,.42-.52A.66.66,0,0,1,292.24,35.46Z'),
				rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$BasicParts$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		rtfeldman$elm_css$Svg$Styled$path,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$d('M307.18,45.3c0,.43-.31.61-.71.61s-.72-.18-.72-.61V32.67c0-.44.28-.62.72-.62s.71.18.71.64v4.17a48.46,48.46,0,0,1,7.93,2.91.71.71,0,0,1,.44.68.94.94,0,0,1-.06.36.7.7,0,0,1-.65.47.81.81,0,0,1-.34-.08,44.76,44.76,0,0,0-7.32-2.89Z'),
				rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$BasicParts$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		rtfeldman$elm_css$Svg$Styled$path,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$d('M321.72,32.72a.6.6,0,0,1,.68-.62.64.64,0,0,1,.72.62V35.3h5.31V32.72a.59.59,0,0,1,.67-.62.63.63,0,0,1,.71.62V35.3h2.49a.57.57,0,0,1,.62.64.58.58,0,0,1-.6.65h-2.51v1.73A8.1,8.1,0,0,1,328.63,43a7.37,7.37,0,0,1-4.81,2.86.82.82,0,0,1-.21,0,.59.59,0,0,1-.64-.51,1,1,0,0,1,0-.17c0-.33.21-.54.58-.61a6.24,6.24,0,0,0,3.93-2.37,7.07,7.07,0,0,0,1-4.14V36.59h-5.31v4c0,.41-.31.62-.72.62s-.68-.21-.68-.62v-4h-2.5a.58.58,0,0,1-.6-.65.56.56,0,0,1,.62-.62h2.48Z'),
				rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$BasicParts$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		rtfeldman$elm_css$Svg$Styled$path,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$d('M335.84,39.82c-.41,0-.63-.26-.63-.7a.64.64,0,0,1,.65-.73h12.33a.65.65,0,0,1,.65.73c0,.44-.23.7-.63.7Z'),
				rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$BasicParts$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		rtfeldman$elm_css$Svg$Styled$path,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$d('M354.47,41.75c0,2.1.36,2.23,3.56,2.23a29.87,29.87,0,0,0,5-.42.68.68,0,0,1,.2,0,.59.59,0,0,1,.61.59v.11a.67.67,0,0,1-.6.7,32.55,32.55,0,0,1-5.51.39c-3.94,0-4.63-.6-4.63-3.67V33.17c0-.44.31-.61.7-.61s.7.17.7.61v4.41A22.33,22.33,0,0,0,362.11,35a.79.79,0,0,1,.41-.11.71.71,0,0,1,.6.36.76.76,0,0,1,.11.4.67.67,0,0,1-.34.59,23.62,23.62,0,0,1-8.42,2.71Zm8-9.93a.53.53,0,0,1,.42.18,10.81,10.81,0,0,1,1.4,1.82.83.83,0,0,1,.11.43.5.5,0,0,1-.53.45.44.44,0,0,1-.43-.28,11.24,11.24,0,0,0-1.28-1.77.57.57,0,0,1-.16-.39A.48.48,0,0,1,362.52,31.82Zm1.93-.84a.61.61,0,0,1,.44.19A9.71,9.71,0,0,1,366.22,33a.8.8,0,0,1,.1.4.49.49,0,0,1-.5.46.47.47,0,0,1-.43-.26,10.21,10.21,0,0,0-1.21-1.73.48.48,0,0,1-.2-.42A.49.49,0,0,1,364.45,31Z'),
				rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$BasicParts$logoSubTextFontColor
			]),
		_List_Nil),
		A2(
		rtfeldman$elm_css$Svg$Styled$path,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$d('M369.4,34.59c-.39,0-.6-.28-.6-.72a.59.59,0,0,1,.6-.65l8.28-.08a1.41,1.41,0,0,1,1.65,1.46,3,3,0,0,1-.18.95,15.14,15.14,0,0,1-2.58,4.22,28.82,28.82,0,0,1,4.52,4,.94.94,0,0,1,.23.57.81.81,0,0,1-.22.52.74.74,0,0,1-.56.24.77.77,0,0,1-.59-.26,27.33,27.33,0,0,0-4.29-4.1,18.12,18.12,0,0,1-6.87,4.51,1.36,1.36,0,0,1-.39.08.6.6,0,0,1-.61-.41.82.82,0,0,1,0-.28.73.73,0,0,1,.48-.69A18.31,18.31,0,0,0,374,40.49a13.86,13.86,0,0,0,3.68-5.29,1.53,1.53,0,0,0,.08-.35c0-.25-.18-.36-.59-.36Z'),
				rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$BasicParts$logoSubTextFontColor
			]),
		_List_Nil)
	]);
var rtfeldman$elm_css$Svg$Styled$ellipse = rtfeldman$elm_css$Svg$Styled$node('ellipse');
var rtfeldman$elm_css$Svg$Styled$Attributes$cx = rtfeldman$elm_css$VirtualDom$Styled$attribute('cx');
var rtfeldman$elm_css$Svg$Styled$Attributes$cy = rtfeldman$elm_css$VirtualDom$Styled$attribute('cy');
var rtfeldman$elm_css$Svg$Styled$Attributes$rx = rtfeldman$elm_css$VirtualDom$Styled$attribute('rx');
var rtfeldman$elm_css$Svg$Styled$Attributes$ry = rtfeldman$elm_css$VirtualDom$Styled$attribute('ry');
var author$project$BasicParts$tsukuBirdShadow = A2(
	rtfeldman$elm_css$Svg$Styled$ellipse,
	_List_fromArray(
		[
			rtfeldman$elm_css$Svg$Styled$Attributes$cx('383.22'),
			rtfeldman$elm_css$Svg$Styled$Attributes$cy('93.55'),
			rtfeldman$elm_css$Svg$Styled$Attributes$rx('39.04'),
			rtfeldman$elm_css$Svg$Styled$Attributes$ry('18.08'),
			rtfeldman$elm_css$Svg$Styled$Attributes$fill('#999')
		]),
	_List_Nil);
var rtfeldman$elm_css$Svg$Styled$image = rtfeldman$elm_css$Svg$Styled$node('image');
var rtfeldman$elm_css$Svg$Styled$Attributes$height = rtfeldman$elm_css$VirtualDom$Styled$attribute('height');
var rtfeldman$elm_css$Svg$Styled$Attributes$width = rtfeldman$elm_css$VirtualDom$Styled$attribute('width');
var elm$virtual_dom$VirtualDom$attributeNS = F3(
	function (namespace, key, value) {
		return A3(
			_VirtualDom_attributeNS,
			namespace,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var rtfeldman$elm_css$VirtualDom$Styled$attributeNS = F3(
	function (namespace, key, value) {
		return A3(
			rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A3(elm$virtual_dom$VirtualDom$attributeNS, namespace, key, value),
			_List_Nil,
			'');
	});
var rtfeldman$elm_css$Svg$Styled$Attributes$xlinkHref = function (value) {
	return A3(rtfeldman$elm_css$VirtualDom$Styled$attributeNS, 'http://www.w3.org/1999/xlink', 'xlink:href', value);
};
var author$project$BasicParts$tsukuBird = _List_fromArray(
	[
		author$project$BasicParts$tsukuBirdShadow,
		A2(
		rtfeldman$elm_css$Svg$Styled$image,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$xlinkHref('/assets/logo_bird.png'),
				rtfeldman$elm_css$Svg$Styled$Attributes$width('370'),
				rtfeldman$elm_css$Svg$Styled$Attributes$height('320'),
				rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(307.49) scale(0.36)')
			]),
		_List_Nil)
	]);
var author$project$BasicParts$tsukuMartFontColor = rtfeldman$elm_css$Svg$Styled$Attributes$fill('#fff4d8');
var author$project$BasicParts$tsukuMartCharacters = _List_fromArray(
	[
		A2(
		rtfeldman$elm_css$Svg$Styled$path,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$d('M41.91,75.12c0-5.66,3.52-11.1,10.79-11.1,3.52,0,7.88-.15,12.63-.15,17.44,0,39.47,2.22,39.47,23.18,0,18.9-22.26,28.39-24.78,28.39-2,0-3.6-1.23-3.6-2.76,0-3.21,7.27-5.43,7.27-13,0-7.12-8-13.31-19.82-13.31-2.68,0-8.72.84-10.4.84C45.89,87.21,41.91,81.09,41.91,75.12Z'),
				rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$BasicParts$tsukuMartFontColor
			]),
		_List_Nil),
		A2(
		rtfeldman$elm_css$Svg$Styled$path,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$d('M117.81,88.83c0-6.34,7.47-4.15,19.24-27.25A12.81,12.81,0,0,1,149,54.19c7.32,0,14.79,5.43,14.79,12.45,0,3.24-1.51,6.79-5.44,10.34-5.2,4.68-11.47,10.79-13.73,12.45s-1.81,4.3-.68,6c9.58,13.73,12.45,15.77,12.45,19.09,0,2.57-2.11,4.15-4.68,4.15-6.94,0-9.05-9.73-31.39-25.28A5.55,5.55,0,0,1,117.81,88.83Z'),
				rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$BasicParts$tsukuMartFontColor
			]),
		_List_Nil),
		A2(
		rtfeldman$elm_css$Svg$Styled$path,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$d('M221.66,100.25a79.24,79.24,0,0,1,6.36,7.94c1.18,1.73,2.6,5.27-.47,5.27a8.49,8.49,0,0,1-3.54-1.18c-8.09-4.49-19.18-7-23.82-7.71s-5.73-3.06-2.9-6a27.75,27.75,0,0,0,6.13-8.73c1.41-3.3,3.85-3.3,6.37-1.1,1.33,1.18,3.61,3.23,6.28,5.82,1.42-3.38,2.21-6.45,2.44-6.92,1.1-2.67-4.48-2.12-6.84-2.12a135,135,0,0,0-17.37,1.1C189.5,87.36,183,90.19,183,83c0-3.06-1.26-9.27-3.07-11.55-2.75-3.46-1.57-8.57,4.25-8.57a10.87,10.87,0,0,1,2.12.15c6.21,1,44.42,1.42,52,.48,5.9-.71,10.06,3.45,6.45,7.62a53,53,0,0,0-5.27,7.39A90.93,90.93,0,0,1,221.66,100.25Z'),
				rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$BasicParts$tsukuMartFontColor
			]),
		_List_Nil),
		A2(
		rtfeldman$elm_css$Svg$Styled$path,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$d('M257.82,89.71a26.73,26.73,0,0,0-.71-6.6c-.95-3.69-.87-7.47,4-7.47a12.21,12.21,0,0,1,2.2.24c5.66.86,28.69,1.26,37.26.47,7.78-.87,4.09,8.41,4.09,14,0,1.81.39,3,.39,4.56,0,3.38-3.06,4.8-5.89,4.4-9.52-1.18-24.61-2-35.62-.47-3.3.47-6-1.1-6-4.79C257.58,92.62,257.82,91.13,257.82,89.71Z'),
				rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$BasicParts$tsukuMartFontColor
			]),
		_List_Nil),
		A2(
		rtfeldman$elm_css$Svg$Styled$path,
		_List_fromArray(
			[
				rtfeldman$elm_css$Svg$Styled$Attributes$d('M345.07,65c-.94,1.41-1.8,6.29-2.59,12.34,6.6.55,14.07.71,19.89-.55,3.77-.71,7.15-.08,7.15,3.3A8,8,0,0,1,369,83a25.75,25.75,0,0,0-1.81,8.73c0,3.53-1.88,4.87-5.5,3.85a43.92,43.92,0,0,0-8.41-.55c-3.62,0-7.94.16-12.26.31-.16,3-.24,5.9-.24,8.42s.08,4.87.24,6.52c.15,1.34,1.57,2.75,1.57,4.48,0,2.83-3.93,3.38-8.33,3.38-4,0-7.79-.31-7.79-3.54a29.62,29.62,0,0,0,.24-3.93c-.94-10.53-5.5-44-6.92-46.38A10.23,10.23,0,0,1,318,59.53c0-4.64,7.86-2.83,11.79-2.83,3.15,0,6.45-.16,11.64-.16C348.3,56.54,347.75,60.94,345.07,65Z'),
				rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
				author$project$BasicParts$tsukuMartFontColor
			]),
		_List_Nil)
	]);
var rtfeldman$elm_css$Svg$Styled$text = rtfeldman$elm_css$VirtualDom$Styled$text;
var rtfeldman$elm_css$Svg$Styled$title = rtfeldman$elm_css$Svg$Styled$node('title');
var author$project$BasicParts$logo = A2(
	rtfeldman$elm_css$Svg$Styled$svg,
	_List_fromArray(
		[
			rtfeldman$elm_css$Svg$Styled$Attributes$css(
			_List_fromArray(
				[
					rtfeldman$elm_css$Css$height(
					rtfeldman$elm_css$Css$px(48)),
					rtfeldman$elm_css$Css$display(rtfeldman$elm_css$Css$block),
					rtfeldman$elm_css$Css$padding(
					rtfeldman$elm_css$Css$px(8))
				])),
			rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 440.08 114.67')
		]),
	_Utils_ap(
		_List_fromArray(
			[
				A2(
				rtfeldman$elm_css$Svg$Styled$title,
				_List_Nil,
				_List_fromArray(
					[
						rtfeldman$elm_css$Svg$Styled$text('つくマートのロゴ クリックしてホームに戻る')
					]))
			]),
		_Utils_ap(
			author$project$BasicParts$tsukuMartCharacters,
			_Utils_ap(author$project$BasicParts$tsukuBird, author$project$BasicParts$logoSubText))));
var rtfeldman$elm_css$Css$flexGrow = rtfeldman$elm_css$Css$prop1('flex-grow');
var rtfeldman$elm_css$Css$margin = rtfeldman$elm_css$Css$prop1('margin');
var rtfeldman$elm_css$Html$Styled$h1 = rtfeldman$elm_css$Html$Styled$node('h1');
var author$project$BasicParts$headerWithBackArrow = author$project$BasicParts$header(
	_List_fromArray(
		[
			author$project$BasicParts$backArrow,
			A2(
			rtfeldman$elm_css$Html$Styled$a,
			_List_fromArray(
				[
					rtfeldman$elm_css$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							rtfeldman$elm_css$Css$flexGrow(
							rtfeldman$elm_css$Css$int(1)),
							author$project$BasicParts$hoverCss
						])),
					rtfeldman$elm_css$Html$Styled$Attributes$href(
					author$project$PageLocation$toUrlAsString(author$project$PageLocation$Home))
				]),
			_List_fromArray(
				[
					A2(
					rtfeldman$elm_css$Html$Styled$h1,
					_List_fromArray(
						[
							rtfeldman$elm_css$Html$Styled$Attributes$css(
							_List_fromArray(
								[
									rtfeldman$elm_css$Css$margin(rtfeldman$elm_css$Css$zero)
								]))
						]),
					_List_fromArray(
						[author$project$BasicParts$logo]))
				]))
		]));
var author$project$BasicParts$None = {$: 2};
var author$project$BasicParts$isTabNone = function (tab) {
	return _Utils_eq(tab, author$project$BasicParts$None);
};
var author$project$BasicParts$menuIconStyle = _List_fromArray(
	[
		rtfeldman$elm_css$Css$width(
		rtfeldman$elm_css$Css$px(32)),
		rtfeldman$elm_css$Css$height(
		rtfeldman$elm_css$Css$px(32)),
		rtfeldman$elm_css$Css$padding(
		rtfeldman$elm_css$Css$px(8)),
		rtfeldman$elm_css$Css$fill(
		A3(rtfeldman$elm_css$Css$rgb, 0, 0, 0))
	]);
var elm$html$Html$a = _VirtualDom_node('a');
var elm$html$Html$div = _VirtualDom_node('div');
var elm$html$Html$text = elm$virtual_dom$VirtualDom$text;
var elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			elm$json$Json$Encode$string(string));
	});
var elm$html$Html$Attributes$class = elm$html$Html$Attributes$stringProperty('className');
var elm$html$Html$Attributes$href = function (url) {
	return A2(
		elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var elm$html$Html$Attributes$style = elm$virtual_dom$VirtualDom$style;
var author$project$BasicParts$subMenuItem = F2(
	function (linkMaybe, text) {
		return function () {
			if (!linkMaybe.$) {
				var link = linkMaybe.a;
				return elm$html$Html$a(
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('menu-item'),
							elm$html$Html$Attributes$href(
							author$project$PageLocation$toUrlAsString(link)),
							A2(elm$html$Html$Attributes$style, 'padding', '4px 0px 4px 52px'),
							A2(elm$html$Html$Attributes$style, 'font-size', '1.3rem')
						]));
			} else {
				return elm$html$Html$div(
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('menu-item'),
							A2(elm$html$Html$Attributes$style, 'padding', '4px 0px 4px 52px'),
							A2(elm$html$Html$Attributes$style, 'font-size', '1.3rem')
						]));
			}
		}()(
			_List_fromArray(
				[
					elm$html$Html$text(text)
				]));
	});
var author$project$Icon$information = function (styleList) {
	return rtfeldman$elm_css$Html$Styled$toUnstyled(
		A2(
			rtfeldman$elm_css$Svg$Styled$svg,
			_List_fromArray(
				[
					rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 24 24'),
					rtfeldman$elm_css$Svg$Styled$Attributes$css(styleList)
				]),
			_List_fromArray(
				[
					A2(
					rtfeldman$elm_css$Svg$Styled$path,
					_List_fromArray(
						[
							rtfeldman$elm_css$Svg$Styled$Attributes$d('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z')
						]),
					_List_Nil)
				])));
};
var author$project$Icon$infinite = function () {
	var a = rtfeldman$elm_css$Css$int(0);
	return _Utils_update(
		a,
		{ey: 'infinite'});
}();
var rtfeldman$elm_css$Css$animationDuration = function (arg) {
	return A2(rtfeldman$elm_css$Css$prop1, 'animation-duration', arg);
};
var rtfeldman$elm_css$Css$animationIterationCount = function (arg) {
	return A2(rtfeldman$elm_css$Css$prop1, 'animation-iteration-count', arg);
};
var rtfeldman$elm_css$Css$Preprocess$WithKeyframes = function (a) {
	return {$: 5, a: a};
};
var rtfeldman$elm_css$Css$animationName = function (arg) {
	return ((arg.ey === 'none') || ((arg.ey === 'inherit') || ((arg.ey === 'unset') || (arg.ey === 'initial')))) ? A2(rtfeldman$elm_css$Css$prop1, 'animation-name', arg) : rtfeldman$elm_css$Css$Preprocess$WithKeyframes(arg.ey);
};
var rtfeldman$elm_css$Css$prop3 = F4(
	function (key, argA, argB, argC) {
		return A2(
			rtfeldman$elm_css$Css$property,
			key,
			A2(
				elm$core$String$join,
				' ',
				_List_fromArray(
					[argA.ey, argB.ey, argC.ey])));
	});
var rtfeldman$elm_css$Css$border3 = rtfeldman$elm_css$Css$prop3('border');
var rtfeldman$elm_css$Css$borderRightColor = function (c) {
	return A2(rtfeldman$elm_css$Css$property, 'border-right-color', c.ey);
};
var rtfeldman$elm_css$Css$rotate = function (_n0) {
	var value = _n0.ey;
	return {
		n: 0,
		ey: A2(
			rtfeldman$elm_css$Css$cssFunction,
			'rotate',
			_List_fromArray(
				[value]))
	};
};
var rtfeldman$elm_css$Css$sec = function (amount) {
	return {
		cI: 0,
		ey: elm$core$String$fromFloat(amount) + 's'
	};
};
var rtfeldman$elm_css$Css$solid = {x: 0, ah: 0, ey: 'solid'};
var rtfeldman$elm_css$Css$transparent = {dQ: 0, ey: 'transparent'};
var rtfeldman$elm_css$Css$angleConverter = F2(
	function (suffix, angleVal) {
		return {
			dN: 0,
			G: 0,
			ey: _Utils_ap(
				elm$core$String$fromFloat(angleVal),
				suffix)
		};
	});
var rtfeldman$elm_css$Css$turn = rtfeldman$elm_css$Css$angleConverter('turn');
var rtfeldman$elm_css$Css$Internal$printKeyframeSelector = function (_n0) {
	var percentage = _n0.a;
	var properties = _n0.b;
	var propertiesStr = A2(
		elm$core$String$join,
		'',
		A2(
			elm$core$List$map,
			function (_n1) {
				var prop = _n1;
				return prop + ';';
			},
			properties));
	var percentageStr = elm$core$String$fromInt(percentage) + '%';
	return percentageStr + (' {' + (propertiesStr + '}'));
};
var rtfeldman$elm_css$Css$Internal$compileKeyframes = function (tuples) {
	return A2(
		elm$core$String$join,
		'\n\n',
		A2(elm$core$List$map, rtfeldman$elm_css$Css$Internal$printKeyframeSelector, tuples));
};
var rtfeldman$elm_css$Css$Animations$keyframes = function (tuples) {
	return elm$core$List$isEmpty(tuples) ? {bU: 0, b_: 0, ey: 'none'} : {
		bU: 0,
		b_: 0,
		ey: rtfeldman$elm_css$Css$Internal$compileKeyframes(tuples)
	};
};
var rtfeldman$elm_css$Css$Internal$Property = elm$core$Basics$identity;
var rtfeldman$elm_css$Css$Animations$transform = function (values) {
	return elm$core$List$isEmpty(values) ? 'transform:none' : ('transform:' + A2(
		elm$core$String$join,
		' ',
		A2(
			elm$core$List$map,
			function ($) {
				return $.ey;
			},
			values)));
};
var author$project$Icon$loading = function (_n0) {
	var size = _n0.eo;
	var color = _n0.dQ;
	return A2(
		rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				rtfeldman$elm_css$Html$Styled$Attributes$css(
				_List_fromArray(
					[
						rtfeldman$elm_css$Css$borderRadius(
						rtfeldman$elm_css$Css$pct(50)),
						rtfeldman$elm_css$Css$width(
						rtfeldman$elm_css$Css$px(size)),
						rtfeldman$elm_css$Css$height(
						rtfeldman$elm_css$Css$px(size)),
						A3(
						rtfeldman$elm_css$Css$border3,
						rtfeldman$elm_css$Css$px(3),
						rtfeldman$elm_css$Css$solid,
						color),
						rtfeldman$elm_css$Css$borderRightColor(rtfeldman$elm_css$Css$transparent),
						rtfeldman$elm_css$Css$animationName(
						rtfeldman$elm_css$Css$Animations$keyframes(
							_List_fromArray(
								[
									_Utils_Tuple2(
									100,
									_List_fromArray(
										[
											rtfeldman$elm_css$Css$Animations$transform(
											_List_fromArray(
												[
													rtfeldman$elm_css$Css$rotate(
													rtfeldman$elm_css$Css$turn(1))
												]))
										]))
								]))),
						rtfeldman$elm_css$Css$animationIterationCount(author$project$Icon$infinite),
						rtfeldman$elm_css$Css$animationDuration(
						rtfeldman$elm_css$Css$sec(0.6)),
						A2(rtfeldman$elm_css$Css$property, 'animation-timing-function', 'linear')
					]))
			]),
		_List_Nil);
};
var author$project$BasicParts$menuLogInStateLoadingProfile = _List_fromArray(
	[
		A2(
		elm$html$Html$a,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('menu-item'),
				elm$html$Html$Attributes$href(
				author$project$PageLocation$toUrlAsString(author$project$PageLocation$Home))
			]),
		_List_fromArray(
			[
				rtfeldman$elm_css$Html$Styled$toUnstyled(
				author$project$Icon$home(author$project$BasicParts$menuIconStyle)),
				elm$html$Html$text('ホーム')
			])),
		A2(
		elm$html$Html$a,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('menu-item'),
				elm$html$Html$Attributes$href(
				author$project$PageLocation$toUrlAsString(
					author$project$PageLocation$Search(author$project$Data$SearchCondition$None)))
			]),
		_List_fromArray(
			[
				rtfeldman$elm_css$Html$Styled$toUnstyled(
				author$project$Icon$search(author$project$BasicParts$menuIconStyle)),
				elm$html$Html$text('検索')
			])),
		A2(
		elm$html$Html$a,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('menu-item'),
				elm$html$Html$Attributes$href(
				author$project$PageLocation$toUrlAsString(author$project$PageLocation$Notification))
			]),
		_List_fromArray(
			[
				rtfeldman$elm_css$Html$Styled$toUnstyled(
				author$project$Icon$notifications(author$project$BasicParts$menuIconStyle)),
				elm$html$Html$text('通知')
			])),
		A2(
		elm$html$Html$a,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('menu-item')
			]),
		_List_fromArray(
			[
				elm$html$Html$text('プロフィール情報を読み込み中'),
				rtfeldman$elm_css$Html$Styled$toUnstyled(
				author$project$Icon$loading(
					{
						dQ: A3(rtfeldman$elm_css$Css$rgb, 0, 0, 0),
						eo: 48
					}))
			])),
		A2(
		author$project$BasicParts$subMenuItem,
		elm$core$Maybe$Just(author$project$PageLocation$LikedProducts),
		'いいねした商品'),
		A2(
		author$project$BasicParts$subMenuItem,
		elm$core$Maybe$Just(author$project$PageLocation$History),
		'閲覧した商品'),
		A2(
		author$project$BasicParts$subMenuItem,
		elm$core$Maybe$Just(author$project$PageLocation$BoughtProducts),
		'購入した商品'),
		A2(author$project$BasicParts$subMenuItem, elm$core$Maybe$Nothing, '出品した商品'),
		A2(
		author$project$BasicParts$subMenuItem,
		elm$core$Maybe$Just(author$project$PageLocation$TradingProducts),
		'進行中の取引'),
		A2(
		author$project$BasicParts$subMenuItem,
		elm$core$Maybe$Just(author$project$PageLocation$TradedProducts),
		'過去にした取引'),
		A2(
		author$project$BasicParts$subMenuItem,
		elm$core$Maybe$Just(author$project$PageLocation$CommentedProducts),
		'コメントをした商品'),
		A2(
		elm$html$Html$a,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('menu-item'),
				elm$html$Html$Attributes$href(
				author$project$PageLocation$toUrlAsString(author$project$PageLocation$About))
			]),
		_List_fromArray(
			[
				author$project$Icon$information(author$project$BasicParts$menuIconStyle),
				elm$html$Html$text('つくマートについて')
			]))
	]);
var author$project$BasicParts$menuLogInStateNone = _List_fromArray(
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
						elm$html$Html$Attributes$class('menu-logInSignUpButtonContainer')
					]),
				_List_fromArray(
					[
						A2(
						elm$html$Html$a,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('menu-logInButton'),
								elm$html$Html$Attributes$href(
								author$project$PageLocation$toUrlAsString(author$project$PageLocation$LogIn))
							]),
						_List_fromArray(
							[
								elm$html$Html$text('ログイン / 新規登録')
							]))
					]))
			])),
		A2(
		elm$html$Html$a,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('menu-item'),
				elm$html$Html$Attributes$href(
				author$project$PageLocation$toUrlAsString(author$project$PageLocation$Home))
			]),
		_List_fromArray(
			[
				rtfeldman$elm_css$Html$Styled$toUnstyled(
				author$project$Icon$home(author$project$BasicParts$menuIconStyle)),
				elm$html$Html$text('ホーム')
			])),
		A2(
		elm$html$Html$a,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('menu-item'),
				elm$html$Html$Attributes$href(
				author$project$PageLocation$toUrlAsString(
					author$project$PageLocation$Search(author$project$Data$SearchCondition$None)))
			]),
		_List_fromArray(
			[
				rtfeldman$elm_css$Html$Styled$toUnstyled(
				author$project$Icon$search(author$project$BasicParts$menuIconStyle)),
				elm$html$Html$text('検索')
			])),
		A2(
		elm$html$Html$a,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('menu-item'),
				elm$html$Html$Attributes$href(
				author$project$PageLocation$toUrlAsString(author$project$PageLocation$About))
			]),
		_List_fromArray(
			[
				author$project$Icon$information(author$project$BasicParts$menuIconStyle),
				elm$html$Html$text('つくマートについて')
			]))
	]);
var author$project$Data$User$withNameGetDisplayName = function (_n0) {
	var displayName = _n0.Y;
	return displayName;
};
var author$project$BasicParts$menuLogInStateOk = function (userWithName) {
	return _List_fromArray(
		[
			A2(
			elm$html$Html$a,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('menu-item'),
					elm$html$Html$Attributes$href(
					author$project$PageLocation$toUrlAsString(author$project$PageLocation$Home))
				]),
			_List_fromArray(
				[
					rtfeldman$elm_css$Html$Styled$toUnstyled(
					author$project$Icon$home(author$project$BasicParts$menuIconStyle)),
					elm$html$Html$text('ホーム')
				])),
			A2(
			elm$html$Html$a,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('menu-item'),
					elm$html$Html$Attributes$href(
					author$project$PageLocation$toUrlAsString(
						author$project$PageLocation$Search(author$project$Data$SearchCondition$None)))
				]),
			_List_fromArray(
				[
					rtfeldman$elm_css$Html$Styled$toUnstyled(
					author$project$Icon$search(author$project$BasicParts$menuIconStyle)),
					elm$html$Html$text('検索')
				])),
			A2(
			elm$html$Html$a,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('menu-item'),
					elm$html$Html$Attributes$href(
					author$project$PageLocation$toUrlAsString(author$project$PageLocation$Notification))
				]),
			_List_fromArray(
				[
					rtfeldman$elm_css$Html$Styled$toUnstyled(
					author$project$Icon$notifications(author$project$BasicParts$menuIconStyle)),
					elm$html$Html$text('通知')
				])),
			A2(
			elm$html$Html$a,
			_List_fromArray(
				[
					elm$html$Html$Attributes$href(
					author$project$PageLocation$toUrlAsString(
						author$project$PageLocation$User(
							author$project$Data$User$withNameGetId(userWithName)))),
					elm$html$Html$Attributes$class('menu-item')
				]),
			_List_fromArray(
				[
					A2(
					author$project$Page$Style$userImage,
					40,
					author$project$Data$User$withNameGetImageId(userWithName)),
					A2(
					elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							elm$html$Html$text(
							author$project$Data$User$withNameGetDisplayName(userWithName))
						]))
				])),
			A2(
			author$project$BasicParts$subMenuItem,
			elm$core$Maybe$Just(author$project$PageLocation$LikedProducts),
			'いいねした商品'),
			A2(
			author$project$BasicParts$subMenuItem,
			elm$core$Maybe$Just(author$project$PageLocation$History),
			'閲覧した商品'),
			A2(
			author$project$BasicParts$subMenuItem,
			elm$core$Maybe$Just(author$project$PageLocation$BoughtProducts),
			'購入した商品'),
			A2(
			author$project$BasicParts$subMenuItem,
			elm$core$Maybe$Just(
				author$project$PageLocation$SoldProducts(
					author$project$Data$User$withNameGetId(userWithName))),
			'出品した商品'),
			A2(
			author$project$BasicParts$subMenuItem,
			elm$core$Maybe$Just(author$project$PageLocation$TradingProducts),
			'進行中の取引'),
			A2(
			author$project$BasicParts$subMenuItem,
			elm$core$Maybe$Just(author$project$PageLocation$TradedProducts),
			'過去にした取引'),
			A2(
			author$project$BasicParts$subMenuItem,
			elm$core$Maybe$Just(author$project$PageLocation$CommentedProducts),
			'コメントをした商品'),
			A2(
			elm$html$Html$a,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('menu-item'),
					elm$html$Html$Attributes$href(
					author$project$PageLocation$toUrlAsString(author$project$PageLocation$About))
				]),
			_List_fromArray(
				[
					author$project$Icon$information(author$project$BasicParts$menuIconStyle),
					elm$html$Html$text('つくマートについて')
				]))
		]);
};
var author$project$BasicParts$menu = function (logInState) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('menu')
			]),
		function () {
			switch (logInState.$) {
				case 0:
					return author$project$BasicParts$menuLogInStateNone;
				case 1:
					return author$project$BasicParts$menuLogInStateLoadingProfile;
				default:
					var userWithName = logInState.a.dF;
					return author$project$BasicParts$menuLogInStateOk(userWithName);
			}
		}());
};
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
var author$project$BasicParts$itemView = F3(
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
								A2(elm$html$Html$Attributes$style, '-webkit-tap-highlight-color', 'transparent'),
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
var author$project$BasicParts$selectLineView = F2(
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
var author$project$BasicParts$toCount = function (tab) {
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
var author$project$BasicParts$tabView = F2(
	function (isWideScreen, tabData) {
		return A2(
			elm$html$Html$div,
			A2(
				elm$core$List$cons,
				elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('mainTab', true),
							_Utils_Tuple2('mainTab-wide', isWideScreen)
						])),
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
										author$project$BasicParts$toCount(tabData),
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
										var label = _n2.a;
										var msg = _n2.b;
										return A3(
											author$project$BasicParts$itemView,
											_Utils_eq(index, selectIndex),
											label,
											elm$core$Maybe$Just(msg));
									}),
								tabList),
							_List_fromArray(
								[
									A2(
									author$project$BasicParts$selectLineView,
									selectIndex,
									elm$core$List$length(tabList))
								]));
					case 1:
						var label = tabData.a;
						return _List_fromArray(
							[
								A3(author$project$BasicParts$itemView, true, label, elm$core$Maybe$Nothing),
								A2(author$project$BasicParts$selectLineView, 0, 1)
							]);
					default:
						return _List_Nil;
				}
			}());
	});
var author$project$Main$HistoryBack = {$: 15};
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
var author$project$Main$PageMsgExhibition = function (a) {
	return {$: 9, a: a};
};
var author$project$Main$PageMsgLogIn = function (a) {
	return {$: 8, a: a};
};
var author$project$Main$PageMsgNotification = function (a) {
	return {$: 12, a: a};
};
var author$project$Main$PageMsgSearch = function (a) {
	return {$: 11, a: a};
};
var author$project$Main$PageMsgSignUp = function (a) {
	return {$: 10, a: a};
};
var author$project$BasicParts$Multi = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var author$project$BasicParts$Single = function (a) {
	return {$: 1, a: a};
};
var author$project$BasicParts$tabMap = F2(
	function (f, tab) {
		switch (tab.$) {
			case 0:
				var list = tab.a;
				var selectIndex = tab.b;
				return A2(
					author$project$BasicParts$Multi,
					A2(
						elm$core$List$map,
						elm$core$Tuple$mapSecond(f),
						list),
					selectIndex);
			case 1:
				var string = tab.a;
				return author$project$BasicParts$Single(string);
			default:
				return author$project$BasicParts$None;
		}
	});
var elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var elm$html$Html$map = elm$virtual_dom$VirtualDom$map;
var author$project$Main$mapPageData = F2(
	function (f, _n0) {
		var title = _n0.bD;
		var tab = _n0.ce;
		var html = _n0.bQ;
		var bottomNavigation = _n0.bI;
		return {
			bI: bottomNavigation,
			bQ: A2(
				elm$core$List$map,
				elm$html$Html$map(f),
				html),
			ce: A2(author$project$BasicParts$tabMap, f, tab),
			bD: function () {
				if (!title.$) {
					var titleText = title.a;
					return titleText + ' | つくマート';
				} else {
					return 'つくマート';
				}
			}()
		};
	});
var author$project$BasicParts$tabNone = author$project$BasicParts$None;
var author$project$Page$About$view = function (model) {
	if (!model) {
		return {
			bI: elm$core$Maybe$Nothing,
			bQ: _List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('container')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									elm$html$Html$text('つくマートについて'),
									A2(
									elm$html$Html$a,
									_List_fromArray(
										[
											elm$html$Html$Attributes$href(author$project$PageLocation$aboutPrivacyPolicyUrl),
											elm$html$Html$Attributes$class('mainButton')
										]),
									_List_fromArray(
										[
											elm$html$Html$text('プライバシーポリシー')
										]))
								]))
						]))
				]),
			ce: author$project$BasicParts$tabNone,
			bD: 'つくマートについて'
		};
	} else {
		return {
			bI: elm$core$Maybe$Nothing,
			bQ: _List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('container')
						]),
					_List_fromArray(
						[
							elm$html$Html$text('プライバシーポリシー')
						]))
				]),
			ce: author$project$BasicParts$tabNone,
			bD: 'プライバシーポリシー'
		};
	}
};
var author$project$BasicParts$tabSingle = author$project$BasicParts$Single;
var author$project$Page$BoughtProducts$MsgByLogIn = function (a) {
	return {$: 1, a: a};
};
var author$project$Data$SocialLoginService$serviceName = function (service) {
	switch (service) {
		case 0:
			return 'Google';
		case 1:
			return 'GitHub';
		case 2:
			return 'Twitter';
		default:
			return 'LINE';
	}
};
var author$project$Data$SocialLoginService$GitHub = 1;
var author$project$Data$SocialLoginService$Google = 0;
var author$project$Data$SocialLoginService$Twitter = 2;
var author$project$Icon$serviceAttributes = _List_fromArray(
	[
		rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 20 20'),
		rtfeldman$elm_css$Svg$Styled$Attributes$css(
		_List_fromArray(
			[
				rtfeldman$elm_css$Css$width(
				rtfeldman$elm_css$Css$px(40)),
				rtfeldman$elm_css$Css$height(
				rtfeldman$elm_css$Css$px(40)),
				rtfeldman$elm_css$Css$padding(
				rtfeldman$elm_css$Css$px(6))
			]))
	]);
var rtfeldman$elm_css$Svg$Styled$Attributes$stroke = rtfeldman$elm_css$VirtualDom$Styled$attribute('stroke');
var author$project$Icon$gitHub = A2(
	rtfeldman$elm_css$Svg$Styled$svg,
	author$project$Icon$serviceAttributes,
	_List_fromArray(
		[
			A2(
			rtfeldman$elm_css$Svg$Styled$path,
			_List_fromArray(
				[
					rtfeldman$elm_css$Svg$Styled$Attributes$d('M10 0C4.476 0 0 4.477 0 10c0 4.418 2.865 8.166 6.84 9.49.5.09.68-.218.68-.483 0-.237-.007-.866-.012-1.7-2.782.603-3.37-1.34-3.37-1.34-.454-1.157-1.11-1.464-1.11-1.464-.907-.62.07-.608.07-.608 1.003.07 1.53 1.03 1.53 1.03.893 1.53 2.342 1.087 2.912.83.09-.645.35-1.085.634-1.335-2.22-.253-4.555-1.11-4.555-4.943 0-1.09.39-1.984 1.03-2.683-.105-.253-.448-1.27.096-2.647 0 0 .84-.268 2.75 1.026C8.294 4.95 9.15 4.84 10 4.836c.85.004 1.705.115 2.504.337 1.91-1.294 2.747-1.026 2.747-1.026.548 1.377.204 2.394.1 2.647.64.7 1.03 1.592 1.03 2.683 0 3.842-2.34 4.687-4.566 4.935.36.308.678.92.678 1.852 0 1.336-.01 2.415-.01 2.743 0 .267.18.578.687.48C17.14 18.163 20 14.417 20 10c0-5.522-4.478-10-10-10'),
					rtfeldman$elm_css$Svg$Styled$Attributes$stroke('none'),
					rtfeldman$elm_css$Svg$Styled$Attributes$fill('#000000')
				]),
			_List_Nil)
		]));
var author$project$Icon$google = A2(
	rtfeldman$elm_css$Svg$Styled$svg,
	author$project$Icon$serviceAttributes,
	_List_fromArray(
		[
			A2(
			rtfeldman$elm_css$Svg$Styled$path,
			_List_fromArray(
				[
					rtfeldman$elm_css$Svg$Styled$Attributes$d('M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z'),
					rtfeldman$elm_css$Svg$Styled$Attributes$stroke('none'),
					rtfeldman$elm_css$Svg$Styled$Attributes$fill('rgb(66,133,244)')
				]),
			_List_Nil),
			A2(
			rtfeldman$elm_css$Svg$Styled$path,
			_List_fromArray(
				[
					rtfeldman$elm_css$Svg$Styled$Attributes$d('M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z'),
					rtfeldman$elm_css$Svg$Styled$Attributes$stroke('none'),
					rtfeldman$elm_css$Svg$Styled$Attributes$fill('rgb(52,168,83)')
				]),
			_List_Nil),
			A2(
			rtfeldman$elm_css$Svg$Styled$path,
			_List_fromArray(
				[
					rtfeldman$elm_css$Svg$Styled$Attributes$d('M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 0 0 0 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z'),
					rtfeldman$elm_css$Svg$Styled$Attributes$stroke('none'),
					rtfeldman$elm_css$Svg$Styled$Attributes$fill('rgb(251,188,5)')
				]),
			_List_Nil),
			A2(
			rtfeldman$elm_css$Svg$Styled$path,
			_List_fromArray(
				[
					rtfeldman$elm_css$Svg$Styled$Attributes$d('M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z'),
					rtfeldman$elm_css$Svg$Styled$Attributes$stroke('none'),
					rtfeldman$elm_css$Svg$Styled$Attributes$fill('rgb(234,67,53)')
				]),
			_List_Nil)
		]));
var author$project$Icon$twitter = A2(
	rtfeldman$elm_css$Svg$Styled$svg,
	author$project$Icon$serviceAttributes,
	_List_fromArray(
		[
			A2(
			rtfeldman$elm_css$Svg$Styled$path,
			_List_fromArray(
				[
					rtfeldman$elm_css$Svg$Styled$Attributes$d('M20 3.924c-.736.326-1.527.547-2.357.646.848-.508 1.498-1.312 1.804-2.27-.792.47-1.67.812-2.605.996C16.092 2.498 15.027 2 13.847 2 11.58 2 9.743 3.837 9.743 6.103c0 .322.037.635.107.935-3.41-.17-6.434-1.804-8.458-4.287-.352.61-.555 1.314-.555 2.066 0 1.423.724 2.68 1.825 3.415-.672-.02-1.305-.206-1.858-.513v.052c0 1.987 1.414 3.645 3.29 4.022-.344.096-.706.146-1.08.146-.265 0-.522-.026-.772-.074.522 1.63 2.037 2.818 3.833 2.85C4.67 15.81 2.9 16.468.98 16.468c-.332 0-.66-.02-.98-.057 1.816 1.166 3.973 1.846 6.29 1.846 7.547 0 11.674-6.253 11.674-11.675 0-.18-.004-.355-.01-.53.8-.58 1.496-1.3 2.046-2.125'),
					rtfeldman$elm_css$Svg$Styled$Attributes$stroke('none'),
					rtfeldman$elm_css$Svg$Styled$Attributes$fill('rgb(85,172,238)')
				]),
			_List_Nil)
		]));
var author$project$Data$SocialLoginService$Line = 3;
var author$project$Page$Component$LogIn$LogInOrSignUpRequest = elm$core$Basics$identity;
var rtfeldman$elm_css$Css$bold = {P: 0, ey: 'bold'};
var rtfeldman$elm_css$Css$fontWeight = function (_n0) {
	var value = _n0.ey;
	return A2(rtfeldman$elm_css$Css$property, 'font-weight', value);
};
var author$project$Page$Component$LogIn$logInButtonText = function (text) {
	return A2(
		rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				rtfeldman$elm_css$Html$Styled$Attributes$css(
				_List_fromArray(
					[
						rtfeldman$elm_css$Css$flexGrow(
						rtfeldman$elm_css$Css$int(1)),
						rtfeldman$elm_css$Css$fontWeight(rtfeldman$elm_css$Css$bold)
					]))
			]),
		_List_fromArray(
			[
				rtfeldman$elm_css$Html$Styled$text(text)
			]));
};
var rtfeldman$elm_css$Css$active = rtfeldman$elm_css$Css$pseudoClass('active');
var rtfeldman$elm_css$Css$prop2 = F3(
	function (key, argA, argB) {
		return A2(
			rtfeldman$elm_css$Css$property,
			key,
			A2(
				elm$core$String$join,
				' ',
				_List_fromArray(
					[argA.ey, argB.ey])));
	});
var rtfeldman$elm_css$Css$border2 = rtfeldman$elm_css$Css$prop2('border');
var rtfeldman$elm_css$Css$borderRight3 = rtfeldman$elm_css$Css$prop3('border-right');
var rtfeldman$elm_css$Css$withPrecedingHash = function (str) {
	return A2(elm$core$String$startsWith, '#', str) ? str : A2(elm$core$String$cons, '#', str);
};
var rtfeldman$elm_css$Css$erroneousHex = function (str) {
	return {
		aO: 1,
		aR: 0,
		dQ: 0,
		aV: 0,
		a3: 0,
		ey: rtfeldman$elm_css$Css$withPrecedingHash(str)
	};
};
var elm$core$Basics$pow = _Basics_pow;
var elm$core$String$fromChar = function (_char) {
	return A2(elm$core$String$cons, _char, '');
};
var rtfeldman$elm_hex$Hex$fromStringHelp = F3(
	function (position, chars, accumulated) {
		fromStringHelp:
		while (true) {
			if (!chars.b) {
				return elm$core$Result$Ok(accumulated);
			} else {
				var _char = chars.a;
				var rest = chars.b;
				switch (_char) {
					case '0':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated;
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '1':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + A2(elm$core$Basics$pow, 16, position);
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '2':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (2 * A2(elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '3':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (3 * A2(elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '4':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (4 * A2(elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '5':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (5 * A2(elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '6':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (6 * A2(elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '7':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (7 * A2(elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '8':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (8 * A2(elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '9':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (9 * A2(elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'a':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (10 * A2(elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'b':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (11 * A2(elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'c':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (12 * A2(elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'd':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (13 * A2(elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'e':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (14 * A2(elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'f':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (15 * A2(elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					default:
						var nonHex = _char;
						return elm$core$Result$Err(
							elm$core$String$fromChar(nonHex) + ' is not a valid hexadecimal character.');
				}
			}
		}
	});
var rtfeldman$elm_hex$Hex$fromString = function (str) {
	if (elm$core$String$isEmpty(str)) {
		return elm$core$Result$Err('Empty strings are not valid hexadecimal strings.');
	} else {
		var result = function () {
			if (A2(elm$core$String$startsWith, '-', str)) {
				var list = A2(
					elm$core$Maybe$withDefault,
					_List_Nil,
					elm$core$List$tail(
						elm$core$String$toList(str)));
				return A2(
					elm$core$Result$map,
					elm$core$Basics$negate,
					A3(
						rtfeldman$elm_hex$Hex$fromStringHelp,
						elm$core$List$length(list) - 1,
						list,
						0));
			} else {
				return A3(
					rtfeldman$elm_hex$Hex$fromStringHelp,
					elm$core$String$length(str) - 1,
					elm$core$String$toList(str),
					0);
			}
		}();
		var formatError = function (err) {
			return A2(
				elm$core$String$join,
				' ',
				_List_fromArray(
					['\"' + (str + '\"'), 'is not a valid hexadecimal string because', err]));
		};
		return A2(elm$core$Result$mapError, formatError, result);
	}
};
var rtfeldman$elm_css$Css$validHex = F5(
	function (str, _n0, _n1, _n2, _n3) {
		var r1 = _n0.a;
		var r2 = _n0.b;
		var g1 = _n1.a;
		var g2 = _n1.b;
		var b1 = _n2.a;
		var b2 = _n2.b;
		var a1 = _n3.a;
		var a2 = _n3.b;
		var toResult = A2(
			elm$core$Basics$composeR,
			elm$core$String$fromList,
			A2(elm$core$Basics$composeR, elm$core$String$toLower, rtfeldman$elm_hex$Hex$fromString));
		var results = _Utils_Tuple2(
			_Utils_Tuple2(
				toResult(
					_List_fromArray(
						[r1, r2])),
				toResult(
					_List_fromArray(
						[g1, g2]))),
			_Utils_Tuple2(
				toResult(
					_List_fromArray(
						[b1, b2])),
				toResult(
					_List_fromArray(
						[a1, a2]))));
		if ((((!results.a.a.$) && (!results.a.b.$)) && (!results.b.a.$)) && (!results.b.b.$)) {
			var _n5 = results.a;
			var red = _n5.a.a;
			var green = _n5.b.a;
			var _n6 = results.b;
			var blue = _n6.a.a;
			var alpha = _n6.b.a;
			return {
				aO: alpha / 255,
				aR: blue,
				dQ: 0,
				aV: green,
				a3: red,
				ey: rtfeldman$elm_css$Css$withPrecedingHash(str)
			};
		} else {
			return rtfeldman$elm_css$Css$erroneousHex(str);
		}
	});
var rtfeldman$elm_css$Css$hex = function (str) {
	var withoutHash = A2(elm$core$String$startsWith, '#', str) ? A2(elm$core$String$dropLeft, 1, str) : str;
	var _n0 = elm$core$String$toList(withoutHash);
	_n0$4:
	while (true) {
		if ((_n0.b && _n0.b.b) && _n0.b.b.b) {
			if (!_n0.b.b.b.b) {
				var r = _n0.a;
				var _n1 = _n0.b;
				var g = _n1.a;
				var _n2 = _n1.b;
				var b = _n2.a;
				return A5(
					rtfeldman$elm_css$Css$validHex,
					str,
					_Utils_Tuple2(r, r),
					_Utils_Tuple2(g, g),
					_Utils_Tuple2(b, b),
					_Utils_Tuple2('f', 'f'));
			} else {
				if (!_n0.b.b.b.b.b) {
					var r = _n0.a;
					var _n3 = _n0.b;
					var g = _n3.a;
					var _n4 = _n3.b;
					var b = _n4.a;
					var _n5 = _n4.b;
					var a = _n5.a;
					return A5(
						rtfeldman$elm_css$Css$validHex,
						str,
						_Utils_Tuple2(r, r),
						_Utils_Tuple2(g, g),
						_Utils_Tuple2(b, b),
						_Utils_Tuple2(a, a));
				} else {
					if (_n0.b.b.b.b.b.b) {
						if (!_n0.b.b.b.b.b.b.b) {
							var r1 = _n0.a;
							var _n6 = _n0.b;
							var r2 = _n6.a;
							var _n7 = _n6.b;
							var g1 = _n7.a;
							var _n8 = _n7.b;
							var g2 = _n8.a;
							var _n9 = _n8.b;
							var b1 = _n9.a;
							var _n10 = _n9.b;
							var b2 = _n10.a;
							return A5(
								rtfeldman$elm_css$Css$validHex,
								str,
								_Utils_Tuple2(r1, r2),
								_Utils_Tuple2(g1, g2),
								_Utils_Tuple2(b1, b2),
								_Utils_Tuple2('f', 'f'));
						} else {
							if (_n0.b.b.b.b.b.b.b.b && (!_n0.b.b.b.b.b.b.b.b.b)) {
								var r1 = _n0.a;
								var _n11 = _n0.b;
								var r2 = _n11.a;
								var _n12 = _n11.b;
								var g1 = _n12.a;
								var _n13 = _n12.b;
								var g2 = _n13.a;
								var _n14 = _n13.b;
								var b1 = _n14.a;
								var _n15 = _n14.b;
								var b2 = _n15.a;
								var _n16 = _n15.b;
								var a1 = _n16.a;
								var _n17 = _n16.b;
								var a2 = _n17.a;
								return A5(
									rtfeldman$elm_css$Css$validHex,
									str,
									_Utils_Tuple2(r1, r2),
									_Utils_Tuple2(g1, g2),
									_Utils_Tuple2(b1, b2),
									_Utils_Tuple2(a1, a2));
							} else {
								break _n0$4;
							}
						}
					} else {
						break _n0$4;
					}
				}
			}
		} else {
			break _n0$4;
		}
	}
	return rtfeldman$elm_css$Css$erroneousHex(str);
};
var rtfeldman$elm_css$Html$Styled$button = rtfeldman$elm_css$Html$Styled$node('button');
var author$project$Page$Component$LogIn$logInButtonLine = A2(
	rtfeldman$elm_css$Html$Styled$button,
	_List_fromArray(
		[
			rtfeldman$elm_css$Html$Styled$Events$onClick(3),
			rtfeldman$elm_css$Html$Styled$Attributes$css(
			_List_fromArray(
				[
					rtfeldman$elm_css$Css$backgroundColor(
					rtfeldman$elm_css$Css$hex('#00c300')),
					rtfeldman$elm_css$Css$borderRadius(
					rtfeldman$elm_css$Css$px(4)),
					A2(rtfeldman$elm_css$Css$border2, rtfeldman$elm_css$Css$zero, rtfeldman$elm_css$Css$none),
					rtfeldman$elm_css$Css$color(
					A3(rtfeldman$elm_css$Css$rgb, 255, 255, 255)),
					rtfeldman$elm_css$Css$displayFlex,
					rtfeldman$elm_css$Css$alignItems(rtfeldman$elm_css$Css$center),
					rtfeldman$elm_css$Css$padding(rtfeldman$elm_css$Css$zero),
					rtfeldman$elm_css$Css$cursor(rtfeldman$elm_css$Css$pointer),
					rtfeldman$elm_css$Css$hover(
					_List_fromArray(
						[
							rtfeldman$elm_css$Css$backgroundColor(
							rtfeldman$elm_css$Css$hex('#00e000'))
						])),
					rtfeldman$elm_css$Css$active(
					_List_fromArray(
						[
							rtfeldman$elm_css$Css$backgroundColor(
							rtfeldman$elm_css$Css$hex('#00b300'))
						]))
				]))
		]),
	_List_fromArray(
		[
			A2(
			rtfeldman$elm_css$Html$Styled$img,
			_List_fromArray(
				[
					rtfeldman$elm_css$Html$Styled$Attributes$src('/assets/line_icon120.png'),
					rtfeldman$elm_css$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							rtfeldman$elm_css$Css$width(
							rtfeldman$elm_css$Css$px(44)),
							rtfeldman$elm_css$Css$height(
							rtfeldman$elm_css$Css$px(44)),
							A3(
							rtfeldman$elm_css$Css$borderRight3,
							rtfeldman$elm_css$Css$px(1),
							rtfeldman$elm_css$Css$solid,
							rtfeldman$elm_css$Css$hex('#00b300')),
							rtfeldman$elm_css$Css$padding(
							rtfeldman$elm_css$Css$px(4)),
							rtfeldman$elm_css$Css$hover(
							_List_fromArray(
								[
									rtfeldman$elm_css$Css$borderRightColor(
									rtfeldman$elm_css$Css$hex('#00c900'))
								])),
							rtfeldman$elm_css$Css$hover(
							_List_fromArray(
								[
									rtfeldman$elm_css$Css$borderRightColor(
									rtfeldman$elm_css$Css$hex('#009800'))
								]))
						]))
				]),
			_List_Nil),
			author$project$Page$Component$LogIn$logInButtonText('LINEでログイン')
		]));
var author$project$Page$Component$LogIn$logInButtonNoLine = F2(
	function (icon, service) {
		return A2(
			rtfeldman$elm_css$Html$Styled$button,
			_List_fromArray(
				[
					rtfeldman$elm_css$Html$Styled$Events$onClick(service),
					rtfeldman$elm_css$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							rtfeldman$elm_css$Css$backgroundColor(
							A3(rtfeldman$elm_css$Css$rgb, 221, 221, 221)),
							rtfeldman$elm_css$Css$borderRadius(
							rtfeldman$elm_css$Css$px(4)),
							A2(rtfeldman$elm_css$Css$border2, rtfeldman$elm_css$Css$zero, rtfeldman$elm_css$Css$none),
							rtfeldman$elm_css$Css$color(
							A3(rtfeldman$elm_css$Css$rgb, 17, 17, 17)),
							rtfeldman$elm_css$Css$displayFlex,
							rtfeldman$elm_css$Css$alignItems(rtfeldman$elm_css$Css$center),
							rtfeldman$elm_css$Css$padding(rtfeldman$elm_css$Css$zero),
							rtfeldman$elm_css$Css$cursor(rtfeldman$elm_css$Css$pointer),
							rtfeldman$elm_css$Css$hover(
							_List_fromArray(
								[
									rtfeldman$elm_css$Css$backgroundColor(
									A3(rtfeldman$elm_css$Css$rgb, 238, 238, 238))
								])),
							rtfeldman$elm_css$Css$active(
							_List_fromArray(
								[
									rtfeldman$elm_css$Css$backgroundColor(
									A3(rtfeldman$elm_css$Css$rgb, 204, 204, 204))
								]))
						]))
				]),
			_List_fromArray(
				[
					icon,
					author$project$Page$Component$LogIn$logInButtonText(
					author$project$Data$SocialLoginService$serviceName(service) + 'でログイン')
				]));
	});
var author$project$Page$Component$LogIn$serviceLogInButtonListView = _List_fromArray(
	[
		A2(author$project$Page$Component$LogIn$logInButtonNoLine, author$project$Icon$google, 0),
		A2(author$project$Page$Component$LogIn$logInButtonNoLine, author$project$Icon$gitHub, 1),
		A2(author$project$Page$Component$LogIn$logInButtonNoLine, author$project$Icon$twitter, 2),
		author$project$Page$Component$LogIn$logInButtonLine
	]);
var author$project$Page$Component$LogIn$view = function (_n0) {
	var waitLogInUrl = _n0;
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('logIn')
			]),
		_List_fromArray(
			[
				rtfeldman$elm_css$Html$Styled$toUnstyled(
				A2(
					rtfeldman$elm_css$Html$Styled$div,
					_List_fromArray(
						[
							rtfeldman$elm_css$Html$Styled$Attributes$css(
							_List_fromArray(
								[
									author$project$Page$Style$displayGridAndGap(24),
									rtfeldman$elm_css$Css$padding(
									rtfeldman$elm_css$Css$px(24))
								]))
						]),
					_Utils_ap(
						_List_fromArray(
							[
								A2(
								rtfeldman$elm_css$Html$Styled$div,
								_List_Nil,
								_List_fromArray(
									[
										rtfeldman$elm_css$Html$Styled$text('ログイン/新規登録するためには以下のどれかのアカウントが必要です')
									]))
							]),
						function () {
							if (!waitLogInUrl.$) {
								var service = waitLogInUrl.a;
								return _List_fromArray(
									[
										A2(
										rtfeldman$elm_css$Html$Styled$div,
										_List_Nil,
										_List_fromArray(
											[
												rtfeldman$elm_css$Html$Styled$text(
												author$project$Data$SocialLoginService$serviceName(service) + 'のログイン画面へのURLを取得中')
											])),
										author$project$Icon$loading(
										{
											dQ: A3(rtfeldman$elm_css$Css$rgb, 0, 0, 0),
											eo: 64
										})
									]);
							} else {
								return author$project$Page$Component$LogIn$serviceLogInButtonListView;
							}
						}())))
			]));
};
var elm$html$Html$img = _VirtualDom_node('img');
var elm$html$Html$Attributes$alt = elm$html$Html$Attributes$stringProperty('alt');
var elm$html$Html$Attributes$src = function (url) {
	return A2(
		elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var author$project$Page$Component$ProductList$emptyView = A2(
	elm$html$Html$div,
	_List_fromArray(
		[
			elm$html$Html$Attributes$class('container')
		]),
	_List_fromArray(
		[
			A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('productList-zero')
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$img,
					_List_fromArray(
						[
							elm$html$Html$Attributes$src('/assets/logo_bird.png'),
							elm$html$Html$Attributes$class('productList-zeroImage'),
							elm$html$Html$Attributes$alt('ざんねん。商品がありません')
						]),
					_List_Nil),
					elm$html$Html$text('ここに表示する商品がありません')
				]))
		]));
var author$project$Data$Product$getName = function (_n0) {
	var name = _n0.a;
	return name;
};
var author$project$Data$Product$getPrice = function (_n0) {
	var price = _n0.b4;
	return price;
};
var author$project$Data$Product$getStatus = function (_n0) {
	var status = _n0.cd;
	return status;
};
var author$project$Data$Product$getThumbnailImageUrl = function (_n0) {
	var thumbnailImageId = _n0.et;
	return author$project$Data$ImageId$toUrlString(thumbnailImageId);
};
var author$project$Page$Component$ProductList$itemImage = F2(
	function (name, url) {
		return A2(
			elm$html$Html$img,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('productList-image'),
					A2(elm$html$Html$Attributes$style, 'grid-column', '1 / 2'),
					A2(elm$html$Html$Attributes$style, 'grid-row', '1 / 2'),
					elm$html$Html$Attributes$src(url),
					elm$html$Html$Attributes$alt(name + 'の画像')
				]),
			_List_Nil);
	});
var author$project$Data$Product$getLikedCount = function (_n0) {
	var likedCount = _n0.c1;
	return likedCount;
};
var author$project$Page$Component$ProductList$Like = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var author$project$Page$Component$ProductList$UnLike = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var elm$html$Html$span = _VirtualDom_node('span');
var author$project$Page$Component$ProductList$itemLikeBody = function (count) {
	return _List_fromArray(
		[
			elm$html$Html$text('いいね'),
			A2(
			elm$html$Html$span,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('productList-like-number')
				]),
			_List_fromArray(
				[
					elm$html$Html$text(
					elm$core$String$fromInt(count))
				]))
		]);
};
var elm$html$Html$button = _VirtualDom_node('button');
var elm$json$Json$Encode$bool = _Json_wrap;
var elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			elm$json$Json$Encode$bool(bool));
	});
var elm$html$Html$Attributes$disabled = elm$html$Html$Attributes$boolProperty('disabled');
var elm$virtual_dom$VirtualDom$Custom = function (a) {
	return {$: 3, a: a};
};
var elm$html$Html$Events$custom = F2(
	function (event, decoder) {
		return A2(
			elm$virtual_dom$VirtualDom$on,
			event,
			elm$virtual_dom$VirtualDom$Custom(decoder));
	});
var author$project$Page$Component$ProductList$itemLike = F3(
	function (logInState, sending, product) {
		if (sending) {
			return A2(
				elm$html$Html$button,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('productList-like'),
						elm$html$Html$Attributes$disabled(true),
						A2(elm$html$Html$Attributes$style, 'padding', '8px 24px')
					]),
				_List_fromArray(
					[
						rtfeldman$elm_css$Html$Styled$toUnstyled(
						author$project$Icon$loading(
							{
								dQ: A3(rtfeldman$elm_css$Css$rgb, 255, 255, 255),
								eo: 20
							}))
					]));
		} else {
			if (logInState.$ === 2) {
				var likedProductIds = logInState.a.S;
				var token = logInState.a.dz;
				return A2(
					elm$core$List$member,
					author$project$Data$Product$getId(product),
					likedProductIds) ? A2(
					elm$html$Html$button,
					_List_fromArray(
						[
							A2(
							elm$html$Html$Events$custom,
							'click',
							elm$json$Json$Decode$succeed(
								{
									w: A2(
										author$project$Page$Component$ProductList$UnLike,
										token,
										author$project$Data$Product$getId(product)),
									da: true,
									du: true
								})),
							elm$html$Html$Attributes$class('productList-liked'),
							elm$html$Html$Attributes$class('productList-like')
						]),
					author$project$Page$Component$ProductList$itemLikeBody(
						author$project$Data$Product$getLikedCount(product))) : A2(
					elm$html$Html$button,
					_List_fromArray(
						[
							A2(
							elm$html$Html$Events$custom,
							'click',
							elm$json$Json$Decode$succeed(
								{
									w: A2(
										author$project$Page$Component$ProductList$Like,
										token,
										author$project$Data$Product$getId(product)),
									da: true,
									du: true
								})),
							elm$html$Html$Attributes$class('productList-like')
						]),
					author$project$Page$Component$ProductList$itemLikeBody(
						author$project$Data$Product$getLikedCount(product)));
			} else {
				return A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('productList-like-noLogIn')
						]),
					author$project$Page$Component$ProductList$itemLikeBody(
						author$project$Data$Product$getLikedCount(product)));
			}
		}
	});
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
var author$project$Data$Product$priceToStringWithoutYen = function (price) {
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
							])))))));
};
var author$project$Page$Component$ProductList$itemPrice = function (price) {
	return A2(
		elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				elm$html$Html$span,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('productList-price')
					]),
				_List_fromArray(
					[
						elm$html$Html$text(
						author$project$Data$Product$priceToStringWithoutYen(price))
					])),
				elm$html$Html$text('円')
			]));
};
var author$project$Page$Component$ProductList$soldOutBar = A2(
	elm$html$Html$div,
	_List_fromArray(
		[
			A2(elm$html$Html$Attributes$style, 'grid-column', '1 / 2'),
			A2(elm$html$Html$Attributes$style, 'grid-row', '1 / 2'),
			A2(elm$html$Html$Attributes$style, 'overflow', 'hidden')
		]),
	_List_fromArray(
		[
			A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					A2(elm$html$Html$Attributes$style, 'background-color', 'red'),
					A2(elm$html$Html$Attributes$style, 'color', '#fff'),
					A2(elm$html$Html$Attributes$style, 'transform', 'translate(-73px, 42px) rotate(315deg)'),
					A2(elm$html$Html$Attributes$style, 'width', '256px'),
					A2(elm$html$Html$Attributes$style, 'font-size', '1.5rem'),
					A2(elm$html$Html$Attributes$style, 'text-align', 'center')
				]),
			_List_fromArray(
				[
					elm$html$Html$text('うりきれ')
				]))
		]));
var elm$html$Html$Attributes$id = elm$html$Html$Attributes$stringProperty('id');
var author$project$Page$Component$ProductList$item = F3(
	function (logInState, sending, product) {
		return A2(
			elm$html$Html$a,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('productList-item'),
					elm$html$Html$Attributes$href(
					author$project$PageLocation$toUrlAsString(
						author$project$PageLocation$Product(
							author$project$Data$Product$getId(product)))),
					elm$html$Html$Attributes$id(
					author$project$Page$Component$ProductList$productIdString(
						author$project$Data$Product$getId(product)))
				]),
			_Utils_ap(
				_List_fromArray(
					[
						A2(
						author$project$Page$Component$ProductList$itemImage,
						author$project$Data$Product$getName(product),
						author$project$Data$Product$getThumbnailImageUrl(product))
					]),
				_Utils_ap(
					function () {
						var _n0 = author$project$Data$Product$getStatus(product);
						if (_n0 === 2) {
							return _List_fromArray(
								[author$project$Page$Component$ProductList$soldOutBar]);
						} else {
							return _List_Nil;
						}
					}(),
					_List_fromArray(
						[
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('productList-name')
								]),
							_List_fromArray(
								[
									elm$html$Html$text(
									author$project$Data$Product$getName(product))
								])),
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('productList-priceAndLike')
								]),
							_List_fromArray(
								[
									A3(author$project$Page$Component$ProductList$itemLike, logInState, sending, product),
									author$project$Page$Component$ProductList$itemPrice(
									author$project$Data$Product$getPrice(product))
								]))
						]))));
	});
var author$project$Page$Component$ProductList$listView = F4(
	function (sending, logInState, isWideMode, _n0) {
		var product = _n0.a;
		var productList = _n0.b;
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
				function (p) {
					return A3(
						author$project$Page$Component$ProductList$item,
						logInState,
						A2(
							elm$core$Set$member,
							author$project$Data$Product$idToString(
								author$project$Data$Product$getId(p)),
							sending),
						p);
				},
				A2(elm$core$List$cons, product, productList)));
	});
var author$project$Page$Component$ProductList$view = F4(
	function (_n0, logInState, isWideMode, productList) {
		var likeUpdating = _n0.R;
		if (!productList.$) {
			if (!productList.a.b) {
				return author$project$Page$Component$ProductList$emptyView;
			} else {
				var _n2 = productList.a;
				var x = _n2.a;
				var xs = _n2.b;
				return A4(
					author$project$Page$Component$ProductList$listView,
					likeUpdating,
					logInState,
					isWideMode,
					_Utils_Tuple2(x, xs));
			}
		} else {
			return A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('container')
					]),
				_List_fromArray(
					[
						A2(
						elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								elm$html$Html$text('読み込み中'),
								rtfeldman$elm_css$Html$Styled$toUnstyled(
								author$project$Icon$loading(
									{
										dQ: A3(rtfeldman$elm_css$Css$rgb, 0, 0, 0),
										eo: 48
									}))
							]))
					]));
		}
	});
var author$project$Page$BoughtProducts$view = F3(
	function (logInState, isWideScreen, _n0) {
		var rec = _n0;
		return {
			bI: elm$core$Maybe$Nothing,
			bQ: function () {
				if (!logInState.$) {
					return _List_fromArray(
						[
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('container')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											elm$html$Html$text('ログインか新規登録をして、購入した商品一覧機能を使えるようにしよう!')
										])),
									A2(
									elm$html$Html$map,
									author$project$Page$BoughtProducts$MsgByLogIn,
									author$project$Page$Component$LogIn$view(rec.bq))
								]))
						]);
				} else {
					return _List_fromArray(
						[
							A2(
							elm$html$Html$map,
							author$project$Page$BoughtProducts$MsgByProductList,
							A4(
								author$project$Page$Component$ProductList$view,
								rec.a0,
								logInState,
								isWideScreen,
								function () {
									var _n2 = rec.ae;
									switch (_n2.$) {
										case 0:
											return elm$core$Maybe$Nothing;
										case 1:
											var products = _n2.a;
											return elm$core$Maybe$Just(products);
										default:
											return elm$core$Maybe$Just(_List_Nil);
									}
								}()))
						]);
				}
			}(),
			ce: author$project$BasicParts$tabSingle('購入した商品'),
			bD: elm$core$Maybe$Just('購入した商品')
		};
	});
var author$project$Page$CommentedProducts$MsgByLogIn = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$CommentedProducts$MsgByProductList = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$CommentedProducts$view = F3(
	function (logInState, isWideScreen, _n0) {
		var rec = _n0;
		return {
			bI: elm$core$Maybe$Nothing,
			bQ: function () {
				if (!logInState.$) {
					return _List_fromArray(
						[
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('container')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											elm$html$Html$text('ログインか新規登録をして、いいねと閲覧履歴を使えるようにしよう!')
										])),
									A2(
									elm$html$Html$map,
									author$project$Page$CommentedProducts$MsgByLogIn,
									author$project$Page$Component$LogIn$view(rec.bq))
								]))
						]);
				} else {
					return _List_fromArray(
						[
							A2(
							elm$html$Html$map,
							author$project$Page$CommentedProducts$MsgByProductList,
							A4(
								author$project$Page$Component$ProductList$view,
								rec.a0,
								logInState,
								isWideScreen,
								function () {
									var _n2 = rec.ae;
									switch (_n2.$) {
										case 0:
											return elm$core$Maybe$Nothing;
										case 1:
											var products = _n2.a;
											return elm$core$Maybe$Just(products);
										default:
											return elm$core$Maybe$Just(_List_Nil);
									}
								}()))
						]);
				}
			}(),
			ce: author$project$BasicParts$tabSingle('コメントした商品'),
			bD: elm$core$Maybe$Just('コメントした商品')
		};
	});
var author$project$Data$Category$groupToJapaneseString = function (group) {
	switch (group) {
		case 0:
			return '家具';
		case 1:
			return '電化製品・電子機器';
		case 2:
			return 'ファッション';
		case 3:
			return '教科書・本';
		case 4:
			return '自転車・車両';
		case 5:
			return '食料品';
		default:
			return 'ホビー・雑貨';
	}
};
var author$project$Data$Category$toJapaneseString = function (category) {
	return author$project$Data$Category$groupToJapaneseString(
		author$project$Data$Category$groupFromCategory(category)) + (' / ' + function () {
		switch (category) {
			case 0:
				return '机';
			case 1:
				return 'イス';
			case 2:
				return 'タンス・棚';
			case 3:
				return '寝具';
			case 4:
				return '食器・調理器具';
			case 5:
				return 'カーテン';
			case 6:
				return 'マット・カーペット';
			case 7:
				return 'その他';
			case 8:
				return '冷蔵庫';
			case 9:
				return '電子レンジ';
			case 10:
				return '洗濯機';
			case 11:
				return '掃除機';
			case 12:
				return '冷暖房・扇風機';
			case 13:
				return '加湿器・除湿機';
			case 14:
				return '照明・ライト';
			case 15:
				return 'TV・ディスプレイ・プロジェクター';
			case 16:
				return 'スピーカー';
			case 17:
				return 'スマホ・タブレット';
			case 18:
				return 'パソコン';
			case 19:
				return 'Wi-Fi ルーター・通信機器';
			case 20:
				return 'その他';
			case 21:
				return 'メンズ';
			case 22:
				return 'レディース';
			case 23:
				return 'その他';
			case 24:
				return '教科書';
			case 25:
				return '本';
			case 26:
				return '漫画';
			case 27:
				return 'その他';
			case 28:
				return '自転車';
			case 29:
				return 'バイク';
			case 30:
				return '自動車';
			case 31:
				return 'その他';
			case 32:
				return '食料';
			case 33:
				return '飲料';
			case 34:
				return 'その他';
			case 35:
				return 'CD・DVD';
			case 36:
				return '楽器';
			case 37:
				return 'カメラ';
			case 38:
				return 'ゲーム';
			case 39:
				return 'スポーツ';
			case 40:
				return '美術・芸術品';
			case 41:
				return '雑貨・小物';
			case 42:
				return '日用品';
			case 43:
				return 'ハンドメイド';
			default:
				return 'その他';
		}
	}());
};
var author$project$Data$Product$conditionToJapaneseString = function (condition) {
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
};
var author$project$Data$Product$priceToString = function (price) {
	return author$project$Data$Product$priceToStringWithoutYen(price) + '円';
};
var author$project$Page$Exhibition$SellProduct = function (a) {
	return {$: 3, a: a};
};
var author$project$Page$Exhibition$confirmViewImage = function (images) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('exhibition-photo-cardList-container')
			]),
		_List_fromArray(
			[
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('exhibition-photo-cardList')
					]),
				A2(
					elm$core$List$map,
					function (dataUrl) {
						return A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('exhibition-photo-card')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$img,
									_List_fromArray(
										[
											elm$html$Html$Attributes$src(dataUrl),
											elm$html$Html$Attributes$class('exhibition-photo-card-image')
										]),
									_List_Nil)
								]));
					},
					images))
			]));
};
var author$project$Page$Style$labelStyle = rtfeldman$elm_css$Css$batch(
	_List_fromArray(
		[
			rtfeldman$elm_css$Css$backgroundColor(
			A3(rtfeldman$elm_css$Css$rgb, 221, 221, 221))
		]));
var author$project$Page$Style$titleAndContent = F2(
	function (title, content) {
		return rtfeldman$elm_css$Html$Styled$toUnstyled(
			A2(
				rtfeldman$elm_css$Html$Styled$div,
				_List_fromArray(
					[
						rtfeldman$elm_css$Html$Styled$Attributes$css(
						_List_fromArray(
							[
								author$project$Page$Style$displayGridAndGap(4)
							]))
					]),
				_List_fromArray(
					[
						A2(
						rtfeldman$elm_css$Html$Styled$div,
						_List_fromArray(
							[
								rtfeldman$elm_css$Html$Styled$Attributes$css(
								_List_fromArray(
									[author$project$Page$Style$labelStyle]))
							]),
						_List_fromArray(
							[
								rtfeldman$elm_css$Html$Styled$text(title)
							])),
						rtfeldman$elm_css$Html$Styled$fromUnstyled(content)
					])));
	});
var author$project$Page$Exhibition$confirmView = F3(
	function (accessToken, _n0, sending) {
		var requestData = _n0;
		return _Utils_Tuple2(
			'出品 確認',
			A2(
				elm$core$List$indexedMap,
				F2(
					function (index, a) {
						return _Utils_Tuple2(
							elm$core$String$fromInt(index),
							a);
					}),
				_Utils_ap(
					_List_fromArray(
						[
							author$project$Page$Exhibition$confirmViewImage(requestData.d2),
							A2(
							author$project$Page$Style$titleAndContent,
							'商品名',
							A2(
								elm$html$Html$span,
								_List_Nil,
								_List_fromArray(
									[
										elm$html$Html$text(requestData.a)
									]))),
							A2(
							author$project$Page$Style$titleAndContent,
							'説明文',
							A2(
								elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										elm$html$Html$text(requestData.cH)
									]))),
							A2(
							author$project$Page$Style$titleAndContent,
							'値段',
							A2(
								elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										elm$html$Html$text(
										author$project$Data$Product$priceToString(requestData.b4))
									]))),
							A2(
							author$project$Page$Style$titleAndContent,
							'カテゴリー',
							A2(
								elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										elm$html$Html$text(
										author$project$Data$Category$toJapaneseString(requestData.bJ))
									]))),
							A2(
							author$project$Page$Style$titleAndContent,
							'状態',
							A2(
								elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										elm$html$Html$text(
										author$project$Data$Product$conditionToJapaneseString(requestData.cD))
									])))
						]),
					sending ? _List_fromArray(
						[
							A2(
							elm$html$Html$button,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('mainButton'),
									elm$html$Html$Attributes$class('mainButton-disabled'),
									elm$html$Html$Attributes$disabled(true)
								]),
							_List_fromArray(
								[
									rtfeldman$elm_css$Html$Styled$toUnstyled(
									author$project$Icon$loading(
										{
											dQ: A3(rtfeldman$elm_css$Css$rgb, 255, 255, 255),
											eo: 24
										}))
								]))
						]) : _List_fromArray(
						[
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('exhibition-confirm-msg')
								]),
							_List_fromArray(
								[
									elm$html$Html$text('この商品を出品します。よろしいですか?')
								])),
							A2(
							elm$html$Html$button,
							_List_fromArray(
								[
									elm$html$Html$Events$onClick(
									author$project$Page$Exhibition$SellProduct(
										_Utils_Tuple2(accessToken, requestData))),
									elm$html$Html$Attributes$class('mainButton')
								]),
							_List_fromArray(
								[
									elm$html$Html$text('出品する')
								]))
						]))));
	});
var author$project$Page$Component$ProductEditor$SelectCategoryGroup = function (a) {
	return {$: 4, a: a};
};
var rtfeldman$elm_css$Html$Styled$label = rtfeldman$elm_css$Html$Styled$node('label');
var rtfeldman$elm_css$Html$Styled$Attributes$for = rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('htmlFor');
var author$project$Page$Style$formItem = F3(
	function (title, idString, content) {
		return A2(
			rtfeldman$elm_css$Html$Styled$div,
			_List_fromArray(
				[
					rtfeldman$elm_css$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							author$project$Page$Style$displayGridAndGap(4)
						]))
				]),
			A2(
				elm$core$List$cons,
				A2(
					rtfeldman$elm_css$Html$Styled$label,
					_List_fromArray(
						[
							rtfeldman$elm_css$Html$Styled$Attributes$css(
							_List_fromArray(
								[author$project$Page$Style$labelStyle])),
							rtfeldman$elm_css$Html$Styled$Attributes$for(idString)
						]),
					_List_fromArray(
						[
							rtfeldman$elm_css$Html$Styled$text(title)
						])),
				content));
	});
var rtfeldman$elm_css$Html$Styled$option = rtfeldman$elm_css$Html$Styled$node('option');
var author$project$Page$Style$blankOption = A2(
	rtfeldman$elm_css$Html$Styled$option,
	_List_Nil,
	_List_fromArray(
		[
			rtfeldman$elm_css$Html$Styled$text('--選択してください--')
		]));
var author$project$Page$Style$selectDecoder = A2(
	elm$json$Json$Decode$map,
	function (index) {
		if (!index) {
			return elm$core$Maybe$Nothing;
		} else {
			var x = index;
			return elm$core$Maybe$Just(x - 1);
		}
	},
	A2(
		elm$json$Json$Decode$at,
		_List_fromArray(
			['target', 'selectedIndex']),
		elm$json$Json$Decode$int));
var rtfeldman$elm_css$Css$fontSize = rtfeldman$elm_css$Css$prop1('font-size');
var rtfeldman$elm_css$Html$Styled$select = rtfeldman$elm_css$Html$Styled$node('select');
var rtfeldman$elm_css$Html$Styled$Attributes$id = rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('id');
var author$project$Page$Style$select = F2(
	function (id, labelList) {
		return A2(
			rtfeldman$elm_css$Html$Styled$select,
			_List_fromArray(
				[
					rtfeldman$elm_css$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							rtfeldman$elm_css$Css$display(rtfeldman$elm_css$Css$block),
							rtfeldman$elm_css$Css$width(
							rtfeldman$elm_css$Css$pct(100)),
							rtfeldman$elm_css$Css$height(
							rtfeldman$elm_css$Css$px(64)),
							A3(
							rtfeldman$elm_css$Css$border3,
							rtfeldman$elm_css$Css$px(1),
							rtfeldman$elm_css$Css$solid,
							A3(rtfeldman$elm_css$Css$rgb, 204, 204, 204)),
							rtfeldman$elm_css$Css$boxSizing(rtfeldman$elm_css$Css$borderBox),
							rtfeldman$elm_css$Css$borderRadius(
							rtfeldman$elm_css$Css$px(8)),
							rtfeldman$elm_css$Css$fontSize(
							rtfeldman$elm_css$Css$px(24))
						])),
					rtfeldman$elm_css$Html$Styled$Attributes$id(id),
					A2(rtfeldman$elm_css$Html$Styled$Events$on, 'change', author$project$Page$Style$selectDecoder)
				]),
			A2(
				elm$core$List$cons,
				author$project$Page$Style$blankOption,
				A2(
					elm$core$List$map,
					function (s) {
						return A2(
							rtfeldman$elm_css$Html$Styled$option,
							_List_Nil,
							_List_fromArray(
								[
									rtfeldman$elm_css$Html$Styled$text(s)
								]));
					},
					labelList)));
	});
var rtfeldman$elm_css$VirtualDom$Styled$KeyedNode = F3(
	function (a, b, c) {
		return {$: 2, a: a, b: b, c: c};
	});
var rtfeldman$elm_css$VirtualDom$Styled$KeyedNodeNS = F4(
	function (a, b, c, d) {
		return {$: 3, a: a, b: b, c: c, d: d};
	});
var elm$virtual_dom$VirtualDom$mapAttribute = _VirtualDom_mapAttribute;
var rtfeldman$elm_css$VirtualDom$Styled$mapAttribute = F2(
	function (transform, _n0) {
		var prop = _n0.a;
		var styles = _n0.b;
		var classname = _n0.c;
		return A3(
			rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2(elm$virtual_dom$VirtualDom$mapAttribute, transform, prop),
			styles,
			classname);
	});
var rtfeldman$elm_css$VirtualDom$Styled$map = F2(
	function (transform, vdomNode) {
		switch (vdomNode.$) {
			case 0:
				var elemType = vdomNode.a;
				var properties = vdomNode.b;
				var children = vdomNode.c;
				return A3(
					rtfeldman$elm_css$VirtualDom$Styled$Node,
					elemType,
					A2(
						elm$core$List$map,
						rtfeldman$elm_css$VirtualDom$Styled$mapAttribute(transform),
						properties),
					A2(
						elm$core$List$map,
						rtfeldman$elm_css$VirtualDom$Styled$map(transform),
						children));
			case 1:
				var ns = vdomNode.a;
				var elemType = vdomNode.b;
				var properties = vdomNode.c;
				var children = vdomNode.d;
				return A4(
					rtfeldman$elm_css$VirtualDom$Styled$NodeNS,
					ns,
					elemType,
					A2(
						elm$core$List$map,
						rtfeldman$elm_css$VirtualDom$Styled$mapAttribute(transform),
						properties),
					A2(
						elm$core$List$map,
						rtfeldman$elm_css$VirtualDom$Styled$map(transform),
						children));
			case 2:
				var elemType = vdomNode.a;
				var properties = vdomNode.b;
				var children = vdomNode.c;
				return A3(
					rtfeldman$elm_css$VirtualDom$Styled$KeyedNode,
					elemType,
					A2(
						elm$core$List$map,
						rtfeldman$elm_css$VirtualDom$Styled$mapAttribute(transform),
						properties),
					A2(
						elm$core$List$map,
						function (_n1) {
							var key = _n1.a;
							var child = _n1.b;
							return _Utils_Tuple2(
								key,
								A2(rtfeldman$elm_css$VirtualDom$Styled$map, transform, child));
						},
						children));
			case 3:
				var ns = vdomNode.a;
				var elemType = vdomNode.b;
				var properties = vdomNode.c;
				var children = vdomNode.d;
				return A4(
					rtfeldman$elm_css$VirtualDom$Styled$KeyedNodeNS,
					ns,
					elemType,
					A2(
						elm$core$List$map,
						rtfeldman$elm_css$VirtualDom$Styled$mapAttribute(transform),
						properties),
					A2(
						elm$core$List$map,
						function (_n2) {
							var key = _n2.a;
							var child = _n2.b;
							return _Utils_Tuple2(
								key,
								A2(rtfeldman$elm_css$VirtualDom$Styled$map, transform, child));
						},
						children));
			default:
				var vdom = vdomNode.a;
				return rtfeldman$elm_css$VirtualDom$Styled$Unstyled(
					A2(elm$virtual_dom$VirtualDom$map, transform, vdom));
		}
	});
var rtfeldman$elm_css$Html$Styled$map = rtfeldman$elm_css$VirtualDom$Styled$map;
var author$project$Page$Component$ProductEditor$selectCategoryGroupView = function (categoryGroup) {
	return _Utils_Tuple2(
		'selectCategoryGroup',
		A2(
			rtfeldman$elm_css$Html$Styled$map,
			author$project$Page$Component$ProductEditor$SelectCategoryGroup,
			A3(
				author$project$Page$Style$formItem,
				'カテゴリ グループ',
				author$project$Page$Component$ProductEditor$categoryGroupSelectId,
				_List_fromArray(
					[
						A2(
						author$project$Page$Style$select,
						author$project$Page$Component$ProductEditor$categoryGroupSelectId,
						A2(elm$core$List$map, author$project$Data$Category$groupToJapaneseString, author$project$Data$Category$groupAll))
					]))));
};
var author$project$Data$Category$groupToIdString = function (group) {
	switch (group) {
		case 0:
			return 'furniture';
		case 1:
			return 'appliance';
		case 2:
			return 'fashion';
		case 3:
			return 'book';
		case 4:
			return 'vehicle';
		case 5:
			return 'food';
		default:
			return 'hobby';
	}
};
var author$project$Page$Component$ProductEditor$SelectCategory = function (a) {
	return {$: 5, a: a};
};
var author$project$Page$Component$ProductEditor$selectCategoryView = F2(
	function (group, category) {
		return _Utils_Tuple2(
			'selectCategory' + author$project$Data$Category$groupToIdString(group),
			A2(
				rtfeldman$elm_css$Html$Styled$map,
				author$project$Page$Component$ProductEditor$SelectCategory,
				A3(
					author$project$Page$Style$formItem,
					'カテゴリ',
					author$project$Page$Component$ProductEditor$categorySelectId,
					_List_fromArray(
						[
							A2(
							author$project$Page$Style$select,
							author$project$Page$Component$ProductEditor$categorySelectId,
							A2(
								elm$core$List$map,
								author$project$Data$Category$toJapaneseString,
								author$project$Data$Category$groupToCategoryList(group)))
						]))));
	});
var rtfeldman$elm_css$VirtualDom$Styled$keyedNode = rtfeldman$elm_css$VirtualDom$Styled$KeyedNode;
var rtfeldman$elm_css$Html$Styled$Keyed$node = rtfeldman$elm_css$VirtualDom$Styled$keyedNode;
var author$project$Page$Component$ProductEditor$categoryView = function (categorySelect) {
	return A3(
		rtfeldman$elm_css$Html$Styled$Keyed$node,
		'div',
		_List_Nil,
		function () {
			switch (categorySelect.$) {
				case 0:
					return _List_fromArray(
						[
							author$project$Page$Component$ProductEditor$selectCategoryGroupView(elm$core$Maybe$Nothing)
						]);
				case 1:
					var group = categorySelect.a;
					return _List_fromArray(
						[
							author$project$Page$Component$ProductEditor$selectCategoryGroupView(
							elm$core$Maybe$Just(group)),
							A2(author$project$Page$Component$ProductEditor$selectCategoryView, group, elm$core$Maybe$Nothing)
						]);
				default:
					var category = categorySelect.a;
					return _List_fromArray(
						[
							author$project$Page$Component$ProductEditor$selectCategoryGroupView(
							elm$core$Maybe$Just(
								author$project$Data$Category$groupFromCategory(category))),
							A2(
							author$project$Page$Component$ProductEditor$selectCategoryView,
							author$project$Data$Category$groupFromCategory(category),
							elm$core$Maybe$Just(category))
						]);
			}
		}());
};
var author$project$Page$Component$ProductEditor$SelectCondition = function (a) {
	return {$: 3, a: a};
};
var author$project$Page$Component$ProductEditor$conditionView = function (condition) {
	return A2(
		rtfeldman$elm_css$Html$Styled$map,
		author$project$Page$Component$ProductEditor$SelectCondition,
		A3(
			author$project$Page$Style$formItem,
			'商品の状態',
			author$project$Page$Component$ProductEditor$conditionSelectId,
			_List_fromArray(
				[
					A2(
					author$project$Page$Style$select,
					author$project$Page$Component$ProductEditor$conditionSelectId,
					A2(elm$core$List$map, author$project$Data$Product$conditionToJapaneseString, author$project$Data$Product$conditionAll))
				])));
};
var author$project$Page$Component$ProductEditor$InputDescription = function (a) {
	return {$: 1, a: a};
};
var rtfeldman$elm_css$Html$Styled$textarea = rtfeldman$elm_css$Html$Styled$node('textarea');
var rtfeldman$elm_css$Html$Styled$Attributes$class = rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('className');
var rtfeldman$elm_css$Html$Styled$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var rtfeldman$elm_css$Html$Styled$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			rtfeldman$elm_css$VirtualDom$Styled$on,
			event,
			elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var rtfeldman$elm_css$Html$Styled$Events$targetValue = A2(
	elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	elm$json$Json$Decode$string);
var rtfeldman$elm_css$Html$Styled$Events$onInput = function (tagger) {
	return A2(
		rtfeldman$elm_css$Html$Styled$Events$stopPropagationOn,
		'input',
		A2(
			elm$json$Json$Decode$map,
			rtfeldman$elm_css$Html$Styled$Events$alwaysStop,
			A2(elm$json$Json$Decode$map, tagger, rtfeldman$elm_css$Html$Styled$Events$targetValue)));
};
var author$project$Page$Component$ProductEditor$descriptionView = A3(
	author$project$Page$Style$formItem,
	'商品の説明',
	author$project$Page$Component$ProductEditor$descriptionEditorId,
	_List_fromArray(
		[
			A2(
			rtfeldman$elm_css$Html$Styled$textarea,
			_List_fromArray(
				[
					rtfeldman$elm_css$Html$Styled$Attributes$class('form-textarea'),
					rtfeldman$elm_css$Html$Styled$Attributes$id(author$project$Page$Component$ProductEditor$descriptionEditorId),
					rtfeldman$elm_css$Html$Styled$Events$onInput(author$project$Page$Component$ProductEditor$InputDescription)
				]),
			_List_Nil)
		]));
var author$project$Page$Component$ProductEditor$imageCount = function (_n0) {
	var addImagesLength = _n0.cl;
	var deleteIndexSize = _n0.cG;
	var beforeImageIdsLength = _n0.cs;
	return (beforeImageIdsLength - deleteIndexSize) + addImagesLength;
};
var author$project$Page$Component$ProductEditor$InputName = function (a) {
	return {$: 0, a: a};
};
var rtfeldman$elm_css$Html$Styled$input = rtfeldman$elm_css$Html$Styled$node('input');
var rtfeldman$elm_css$Html$Styled$Attributes$maxlength = function (n) {
	return A2(
		rtfeldman$elm_css$VirtualDom$Styled$attribute,
		'maxlength',
		elm$core$String$fromInt(n));
};
var rtfeldman$elm_css$Html$Styled$Attributes$placeholder = rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('placeholder');
var author$project$Page$Component$ProductEditor$nameView = function (name) {
	return A3(
		author$project$Page$Style$formItem,
		'商品名',
		author$project$Page$Component$ProductEditor$nameEditorId,
		_Utils_ap(
			_List_fromArray(
				[
					A2(
					rtfeldman$elm_css$Html$Styled$input,
					_List_fromArray(
						[
							rtfeldman$elm_css$Html$Styled$Attributes$placeholder('40文字まで'),
							rtfeldman$elm_css$Html$Styled$Attributes$class('form-input'),
							rtfeldman$elm_css$Html$Styled$Attributes$id(author$project$Page$Component$ProductEditor$nameEditorId),
							rtfeldman$elm_css$Html$Styled$Attributes$maxlength(40),
							rtfeldman$elm_css$Html$Styled$Events$onInput(author$project$Page$Component$ProductEditor$InputName)
						]),
					_List_Nil)
				]),
			function () {
				var _n0 = author$project$Page$Component$ProductEditor$nameCheck(name);
				if (!_n0.$) {
					var errorMsg = _n0.a;
					return _List_fromArray(
						[
							rtfeldman$elm_css$Html$Styled$text(errorMsg)
						]);
				} else {
					return _List_Nil;
				}
			}()));
};
var rtfeldman$elm_css$Svg$Styled$circle = rtfeldman$elm_css$Svg$Styled$node('circle');
var rtfeldman$elm_css$Svg$Styled$Attributes$r = rtfeldman$elm_css$VirtualDom$Styled$attribute('r');
var author$project$Icon$photo = A2(
	rtfeldman$elm_css$Svg$Styled$svg,
	_List_fromArray(
		[
			rtfeldman$elm_css$Svg$Styled$Attributes$css(
			_List_fromArray(
				[
					rtfeldman$elm_css$Css$width(
					rtfeldman$elm_css$Css$px(112)),
					rtfeldman$elm_css$Css$height(
					rtfeldman$elm_css$Css$px(112))
				])),
			rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 24 24')
		]),
	_List_fromArray(
		[
			A2(
			rtfeldman$elm_css$Svg$Styled$path,
			_List_fromArray(
				[
					rtfeldman$elm_css$Svg$Styled$Attributes$d('M3 8c0 .55.45 1 1 1s1-.45 1-1V6h2c.55 0 1-.45 1-1s-.45-1-1-1H5V2c0-.55-.45-1-1-1s-1 .45-1 1v2H1c-.55 0-1 .45-1 1s.45 1 1 1h2v2z')
				]),
			_List_Nil),
			A2(
			rtfeldman$elm_css$Svg$Styled$circle,
			_List_fromArray(
				[
					rtfeldman$elm_css$Svg$Styled$Attributes$cx('13'),
					rtfeldman$elm_css$Svg$Styled$Attributes$cy('14'),
					rtfeldman$elm_css$Svg$Styled$Attributes$r('3')
				]),
			_List_Nil),
			A2(
			rtfeldman$elm_css$Svg$Styled$path,
			_List_fromArray(
				[
					rtfeldman$elm_css$Svg$Styled$Attributes$d('M21 6h-3.17l-1.24-1.35c-.37-.41-.91-.65-1.47-.65h-6.4c.17.3.28.63.28 1 0 1.1-.9 2-2 2H6v1c0 1.1-.9 2-2 2-.37 0-.7-.11-1-.28V20c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z')
				]),
			_List_Nil)
		]));
var rtfeldman$elm_css$Html$Styled$Attributes$accept = rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('accept');
var rtfeldman$elm_css$Html$Styled$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			rtfeldman$elm_css$VirtualDom$Styled$property,
			key,
			elm$json$Json$Encode$bool(bool));
	});
var rtfeldman$elm_css$Html$Styled$Attributes$multiple = rtfeldman$elm_css$Html$Styled$Attributes$boolProperty('multiple');
var rtfeldman$elm_css$Html$Styled$Attributes$type_ = rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('type');
var author$project$Page$Component$ProductEditor$photoAdd = A2(
	rtfeldman$elm_css$Html$Styled$div,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			rtfeldman$elm_css$Html$Styled$label,
			_List_fromArray(
				[
					rtfeldman$elm_css$Html$Styled$Attributes$class('exhibition-photo-add'),
					rtfeldman$elm_css$Html$Styled$Attributes$id(author$project$Page$Component$ProductEditor$photoAddLabelId),
					rtfeldman$elm_css$Html$Styled$Attributes$for(author$project$Page$Component$ProductEditor$photoAddInputId)
				]),
			_List_fromArray(
				[author$project$Icon$photo])),
			A2(
			rtfeldman$elm_css$Html$Styled$input,
			_List_fromArray(
				[
					rtfeldman$elm_css$Html$Styled$Attributes$id(author$project$Page$Component$ProductEditor$photoAddInputId),
					rtfeldman$elm_css$Html$Styled$Attributes$type_('file'),
					rtfeldman$elm_css$Html$Styled$Attributes$multiple(true),
					rtfeldman$elm_css$Html$Styled$Attributes$accept('image/*')
				]),
			_List_Nil)
		]));
var rtfeldman$elm_css$Css$absolute = {a$: 0, ey: 'absolute'};
var rtfeldman$elm_css$Css$right = rtfeldman$elm_css$Css$prop1('right');
var rtfeldman$elm_css$Css$top = rtfeldman$elm_css$Css$prop1('top');
var rtfeldman$elm_css$Svg$Styled$line = rtfeldman$elm_css$Svg$Styled$node('line');
var rtfeldman$elm_css$Svg$Styled$Attributes$x1 = rtfeldman$elm_css$VirtualDom$Styled$attribute('x1');
var rtfeldman$elm_css$Svg$Styled$Attributes$x2 = rtfeldman$elm_css$VirtualDom$Styled$attribute('x2');
var rtfeldman$elm_css$Svg$Styled$Attributes$y1 = rtfeldman$elm_css$VirtualDom$Styled$attribute('y1');
var rtfeldman$elm_css$Svg$Styled$Attributes$y2 = rtfeldman$elm_css$VirtualDom$Styled$attribute('y2');
var rtfeldman$elm_css$Svg$Styled$Events$onClick = function (msg) {
	return A2(
		rtfeldman$elm_css$Html$Styled$Events$on,
		'click',
		elm$json$Json$Decode$succeed(msg));
};
var author$project$Icon$delete = A2(
	rtfeldman$elm_css$Svg$Styled$svg,
	_List_fromArray(
		[
			rtfeldman$elm_css$Svg$Styled$Attributes$css(
			_List_fromArray(
				[
					rtfeldman$elm_css$Css$width(
					rtfeldman$elm_css$Css$px(32)),
					rtfeldman$elm_css$Css$height(
					rtfeldman$elm_css$Css$px(32)),
					rtfeldman$elm_css$Css$position(rtfeldman$elm_css$Css$absolute),
					rtfeldman$elm_css$Css$right(
					rtfeldman$elm_css$Css$px(8)),
					rtfeldman$elm_css$Css$top(
					rtfeldman$elm_css$Css$px(8)),
					rtfeldman$elm_css$Css$fill(
					A3(rtfeldman$elm_css$Css$rgb, 0, 0, 0)),
					rtfeldman$elm_css$Css$cursor(rtfeldman$elm_css$Css$pointer),
					rtfeldman$elm_css$Css$hover(
					_List_fromArray(
						[
							rtfeldman$elm_css$Css$fill(
							A3(rtfeldman$elm_css$Css$rgb, 68, 68, 68))
						]))
				])),
			rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 10 10'),
			rtfeldman$elm_css$Svg$Styled$Events$onClick(0)
		]),
	_List_fromArray(
		[
			A2(
			rtfeldman$elm_css$Svg$Styled$circle,
			_List_fromArray(
				[
					rtfeldman$elm_css$Svg$Styled$Attributes$cx('5'),
					rtfeldman$elm_css$Svg$Styled$Attributes$cy('5'),
					rtfeldman$elm_css$Svg$Styled$Attributes$r('5'),
					rtfeldman$elm_css$Svg$Styled$Attributes$stroke('none')
				]),
			_List_Nil),
			A2(
			rtfeldman$elm_css$Svg$Styled$line,
			_List_fromArray(
				[
					rtfeldman$elm_css$Svg$Styled$Attributes$x1('3'),
					rtfeldman$elm_css$Svg$Styled$Attributes$y1('3'),
					rtfeldman$elm_css$Svg$Styled$Attributes$x2('7'),
					rtfeldman$elm_css$Svg$Styled$Attributes$y2('7'),
					rtfeldman$elm_css$Svg$Styled$Attributes$stroke('white')
				]),
			_List_Nil),
			A2(
			rtfeldman$elm_css$Svg$Styled$line,
			_List_fromArray(
				[
					rtfeldman$elm_css$Svg$Styled$Attributes$x1('7'),
					rtfeldman$elm_css$Svg$Styled$Attributes$y1('3'),
					rtfeldman$elm_css$Svg$Styled$Attributes$x2('3'),
					rtfeldman$elm_css$Svg$Styled$Attributes$y2('7'),
					rtfeldman$elm_css$Svg$Styled$Attributes$stroke('white')
				]),
			_List_Nil)
		]));
var author$project$Page$Component$ProductEditor$DeleteImage = function (a) {
	return {$: 6, a: a};
};
var author$project$Page$Component$ProductEditor$photoImage = F2(
	function (index, dataUrl) {
		return A2(
			rtfeldman$elm_css$Html$Styled$div,
			_List_fromArray(
				[
					rtfeldman$elm_css$Html$Styled$Attributes$class('exhibition-photo-card')
				]),
			_List_fromArray(
				[
					A2(
					rtfeldman$elm_css$Html$Styled$map,
					elm$core$Basics$always(
						author$project$Page$Component$ProductEditor$DeleteImage(index)),
					author$project$Icon$delete),
					A2(
					rtfeldman$elm_css$Html$Styled$img,
					_List_fromArray(
						[
							rtfeldman$elm_css$Html$Styled$Attributes$src(dataUrl),
							rtfeldman$elm_css$Html$Styled$Attributes$class('exhibition-photo-card-image')
						]),
					_List_Nil)
				]));
	});
var author$project$Page$Component$ProductEditor$toImageUrlList = function (_n0) {
	var addImages = _n0.o;
	var deleteAt = _n0.cF;
	var beforeImageIds = _n0.K;
	return _Utils_ap(
		elm$core$List$concat(
			A2(
				elm$core$List$indexedMap,
				F2(
					function (index, image) {
						return A2(elm$core$Set$member, index, deleteAt) ? _List_Nil : _List_fromArray(
							[image]);
					}),
				addImages)),
		A2(elm$core$List$map, author$project$Data$ImageId$toUrlString, beforeImageIds));
};
var author$project$Page$Component$ProductEditor$photoCardList = function (rec) {
	return A2(
		rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				rtfeldman$elm_css$Html$Styled$Attributes$class('exhibition-photo-cardList-container')
			]),
		_List_fromArray(
			[
				A2(
				rtfeldman$elm_css$Html$Styled$div,
				_List_fromArray(
					[
						rtfeldman$elm_css$Html$Styled$Attributes$class('exhibition-photo-cardList')
					]),
				A2(
					elm$core$List$indexedMap,
					author$project$Page$Component$ProductEditor$photoImage,
					author$project$Page$Component$ProductEditor$toImageUrlList(rec)))
			]));
};
var author$project$Page$Component$ProductEditor$InputPrice = function (a) {
	return {$: 2, a: a};
};
var rtfeldman$elm_css$Html$Styled$span = rtfeldman$elm_css$Html$Styled$node('span');
var rtfeldman$elm_css$Html$Styled$Attributes$max = rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('max');
var rtfeldman$elm_css$Html$Styled$Attributes$min = rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('min');
var rtfeldman$elm_css$VirtualDom$Styled$style = F2(
	function (key, val) {
		return A3(
			rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2(elm$virtual_dom$VirtualDom$style, key, val),
			_List_Nil,
			'');
	});
var rtfeldman$elm_css$Html$Styled$Attributes$style = rtfeldman$elm_css$VirtualDom$Styled$style;
var author$project$Page$Component$ProductEditor$priceView = function (priceMaybe) {
	return A3(
		author$project$Page$Style$formItem,
		'販売価格',
		author$project$Page$Component$ProductEditor$priceEditorId,
		_List_fromArray(
			[
				A2(
				rtfeldman$elm_css$Html$Styled$div,
				_List_fromArray(
					[
						rtfeldman$elm_css$Html$Styled$Attributes$class('exhibition-itemPrice-input')
					]),
				_List_fromArray(
					[
						A2(
						rtfeldman$elm_css$Html$Styled$input,
						_List_fromArray(
							[
								rtfeldman$elm_css$Html$Styled$Attributes$type_('number'),
								rtfeldman$elm_css$Html$Styled$Attributes$class('exhibition-itemPrice-input-input'),
								rtfeldman$elm_css$Html$Styled$Attributes$id(author$project$Page$Component$ProductEditor$priceEditorId),
								rtfeldman$elm_css$Html$Styled$Attributes$placeholder('0 ～ 1000000'),
								rtfeldman$elm_css$Html$Styled$Attributes$min('0'),
								rtfeldman$elm_css$Html$Styled$Attributes$max('1000000'),
								rtfeldman$elm_css$Html$Styled$Events$onInput(author$project$Page$Component$ProductEditor$InputPrice)
							]),
						_List_Nil),
						A2(
						rtfeldman$elm_css$Html$Styled$span,
						_List_fromArray(
							[
								A2(rtfeldman$elm_css$Html$Styled$Attributes$style, 'font-size', '1.5rem')
							]),
						_List_fromArray(
							[
								rtfeldman$elm_css$Html$Styled$text('円')
							]))
					])),
				A2(
				rtfeldman$elm_css$Html$Styled$div,
				_List_fromArray(
					[
						rtfeldman$elm_css$Html$Styled$Attributes$class('exhibition-priceView')
					]),
				_List_fromArray(
					[
						rtfeldman$elm_css$Html$Styled$text(
						function () {
							if (!priceMaybe.$) {
								var price = priceMaybe.a;
								return author$project$Data$Product$priceToString(price);
							} else {
								return '0 ～ 100万円の価格を入力してください';
							}
						}())
					]))
			]));
};
var author$project$Page$Component$ProductEditor$view = function (_n0) {
	var rec = _n0;
	return A2(
		elm$core$List$map,
		elm$core$Tuple$mapSecond(rtfeldman$elm_css$Html$Styled$toUnstyled),
		_Utils_ap(
			(4 <= author$project$Page$Component$ProductEditor$imageCount(
				{
					cl: elm$core$List$length(rec.o),
					cs: elm$core$List$length(rec.K),
					cG: elm$core$Set$size(rec.M)
				})) ? _List_Nil : _List_fromArray(
				[
					_Utils_Tuple2('photoAdd', author$project$Page$Component$ProductEditor$photoAdd)
				]),
			_List_fromArray(
				[
					_Utils_Tuple2(
					'photoCardList',
					author$project$Page$Component$ProductEditor$photoCardList(
						{o: rec.o, K: rec.K, cF: rec.M})),
					_Utils_Tuple2(
					'name',
					author$project$Page$Component$ProductEditor$nameView(rec.a)),
					_Utils_Tuple2('description', author$project$Page$Component$ProductEditor$descriptionView),
					_Utils_Tuple2(
					'price',
					author$project$Page$Component$ProductEditor$priceView(rec.b4)),
					_Utils_Tuple2(
					'condition',
					author$project$Page$Component$ProductEditor$conditionView(rec.cD)),
					_Utils_Tuple2(
					'category',
					author$project$Page$Component$ProductEditor$categoryView(rec.bJ))
				])));
};
var author$project$Page$Exhibition$toConformPageButton = function (available) {
	return available ? A2(
		elm$html$Html$a,
		_List_fromArray(
			[
				elm$html$Html$Attributes$href(
				author$project$PageLocation$toUrlAsString(author$project$PageLocation$ExhibitionConfirm)),
				elm$html$Html$Attributes$class('mainButton')
			]),
		_List_fromArray(
			[
				elm$html$Html$text('出品確認画面へ')
			])) : A2(
		elm$html$Html$button,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('mainButton'),
				elm$html$Html$Attributes$class('mainButton-disabled'),
				elm$html$Html$Attributes$disabled(true)
			]),
		_List_fromArray(
			[
				elm$html$Html$text('出品確認画面へ')
			]));
};
var author$project$Page$Exhibition$editView = function (productEditorModel) {
	return _Utils_Tuple2(
		'商品の情報を入力',
		_Utils_ap(
			A2(
				elm$core$List$map,
				elm$core$Tuple$mapSecond(
					elm$html$Html$map(author$project$Page$Exhibition$MsgByProductEditor)),
				author$project$Page$Component$ProductEditor$view(productEditorModel)),
			_List_fromArray(
				[
					_Utils_Tuple2(
					'conform',
					author$project$Page$Exhibition$toConformPageButton(
						!_Utils_eq(
							author$project$Page$Component$ProductEditor$toSoldRequest(productEditorModel),
							elm$core$Maybe$Nothing)))
				])));
};
var author$project$Page$Exhibition$LogInOrSignUpMsg = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$Exhibition$logInStateNoneView = function (model) {
	return _Utils_Tuple2(
		'出品画面',
		_List_fromArray(
			[
				_Utils_Tuple2(
				'logIn',
				A2(
					elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							elm$html$Html$text('ログインして商品を出品しよう')
						]))),
				_Utils_Tuple2(
				'logInComp',
				A2(
					elm$html$Html$map,
					author$project$Page$Exhibition$LogInOrSignUpMsg,
					author$project$Page$Component$LogIn$view(model)))
			]));
};
var elm$html$Html$Keyed$node = elm$virtual_dom$VirtualDom$keyedNode;
var author$project$Page$Exhibition$view = F2(
	function (logInState, _n0) {
		var page = _n0.i;
		var logInOrSignUpModel = _n0.br;
		var _n1 = function () {
			var _n2 = author$project$Data$LogInState$getToken(logInState);
			if (!_n2.$) {
				var accessToken = _n2.a;
				if (!page.$) {
					var editModel = page.a;
					return author$project$Page$Exhibition$editView(editModel);
				} else {
					var request = page.a.b7;
					var sending = page.a.cb;
					return A3(author$project$Page$Exhibition$confirmView, accessToken, request, sending);
				}
			} else {
				return author$project$Page$Exhibition$logInStateNoneView(logInOrSignUpModel);
			}
		}();
		var tabText = _n1.a;
		var body = _n1.b;
		return {
			bI: elm$core$Maybe$Nothing,
			bQ: _List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('container')
						]),
					_List_fromArray(
						[
							A3(
							elm$html$Html$Keyed$node,
							'div',
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('exhibition')
								]),
							body)
						]))
				]),
			ce: author$project$BasicParts$tabSingle(tabText),
			bD: elm$core$Maybe$Just('出品')
		};
	});
var author$project$Page$History$MsgByLogIn = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$History$view = F3(
	function (logInState, isWideScreen, _n0) {
		var rec = _n0;
		return {
			bI: elm$core$Maybe$Nothing,
			bQ: function () {
				if (!logInState.$) {
					return _List_fromArray(
						[
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('container')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											elm$html$Html$text('ログインか新規登録をして、いいねと閲覧履歴を使えるようにしよう!')
										])),
									A2(
									elm$html$Html$map,
									author$project$Page$History$MsgByLogIn,
									author$project$Page$Component$LogIn$view(rec.bq))
								]))
						]);
				} else {
					return _List_fromArray(
						[
							A2(
							elm$html$Html$map,
							author$project$Page$History$MsgByProductList,
							A4(
								author$project$Page$Component$ProductList$view,
								rec.a0,
								logInState,
								isWideScreen,
								function () {
									var _n2 = rec.ae;
									switch (_n2.$) {
										case 0:
											return elm$core$Maybe$Nothing;
										case 1:
											var products = _n2.a;
											return elm$core$Maybe$Just(products);
										default:
											return elm$core$Maybe$Just(_List_Nil);
									}
								}()))
						]);
				}
			}(),
			ce: author$project$BasicParts$tabSingle('閲覧履歴'),
			bD: elm$core$Maybe$Just('いいね・閲覧した商品')
		};
	});
var author$project$BasicParts$tabMulti = function (_n0) {
	var textAndMsgList = _n0.es;
	var selectIndex = _n0.em;
	return A2(author$project$BasicParts$Multi, textAndMsgList, selectIndex);
};
var author$project$Page$Home$SelectTab = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$Home$TabFree = 2;
var author$project$Page$Home$TabRecent = 0;
var author$project$Page$Home$exhibitButton = A2(
	elm$html$Html$a,
	_List_fromArray(
		[
			elm$html$Html$Attributes$class('exhibitionButton'),
			elm$html$Html$Attributes$href(
			author$project$PageLocation$toUrlAsString(author$project$PageLocation$Exhibition))
		]),
	_List_fromArray(
		[
			elm$html$Html$text('出品')
		]));
var author$project$Page$Home$view = F3(
	function (logInState, isWideScreen, _n0) {
		var rec = _n0;
		return {
			bI: elm$core$Maybe$Just(0),
			bQ: _Utils_ap(
				_List_fromArray(
					[
						A2(
						elm$html$Html$map,
						author$project$Page$Home$MsgByProductList,
						A4(
							author$project$Page$Component$ProductList$view,
							rec.a1,
							logInState,
							isWideScreen,
							function () {
								var _n1 = rec.a5;
								switch (_n1) {
									case 0:
										return rec.aD;
									case 1:
										return rec.aE;
									default:
										return rec.aw;
								}
							}()))
					]),
				function () {
					var _n2 = author$project$Data$LogInState$getToken(logInState);
					if (!_n2.$) {
						return _List_fromArray(
							[author$project$Page$Home$exhibitButton]);
					} else {
						return _List_Nil;
					}
				}()),
			ce: author$project$BasicParts$tabMulti(
				{
					em: function () {
						var _n3 = rec.a5;
						switch (_n3) {
							case 0:
								return 0;
							case 1:
								return 1;
							default:
								return 2;
						}
					}(),
					es: _List_fromArray(
						[
							_Utils_Tuple2(
							'新着',
							author$project$Page$Home$SelectTab(0)),
							_Utils_Tuple2(
							'おすすめ',
							author$project$Page$Home$SelectTab(1)),
							_Utils_Tuple2(
							'0円',
							author$project$Page$Home$SelectTab(2))
						])
				}),
			bD: elm$core$Maybe$Nothing
		};
	});
var author$project$Page$LikedProducts$MsgByLogIn = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$LikedProducts$view = F3(
	function (logInState, isWideScreen, _n0) {
		var rec = _n0;
		return {
			bI: elm$core$Maybe$Nothing,
			bQ: function () {
				if (!logInState.$) {
					return _List_fromArray(
						[
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('container')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											elm$html$Html$text('ログインか新規登録をして、いいねと閲覧履歴を使えるようにしよう!')
										])),
									A2(
									elm$html$Html$map,
									author$project$Page$LikedProducts$MsgByLogIn,
									author$project$Page$Component$LogIn$view(rec.bq))
								]))
						]);
				} else {
					return _List_fromArray(
						[
							A2(
							elm$html$Html$map,
							author$project$Page$LikedProducts$MsgByProductList,
							A4(
								author$project$Page$Component$ProductList$view,
								rec.a0,
								logInState,
								isWideScreen,
								function () {
									var _n2 = rec.ae;
									switch (_n2.$) {
										case 0:
											return elm$core$Maybe$Nothing;
										case 1:
											var products = _n2.a;
											return elm$core$Maybe$Just(products);
										default:
											return elm$core$Maybe$Just(_List_Nil);
									}
								}()))
						]);
				}
			}(),
			ce: author$project$BasicParts$tabSingle('いいねした商品'),
			bD: elm$core$Maybe$Just('いいねした商品')
		};
	});
var author$project$Page$LogIn$Msg = elm$core$Basics$identity;
var author$project$Page$LogIn$view = function (_n0) {
	var logInOrSignUpModel = _n0;
	return {
		bI: elm$core$Maybe$Just(3),
		bQ: _List_fromArray(
			[
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('container')
					]),
				_List_fromArray(
					[
						A2(
						elm$html$Html$map,
						elm$core$Basics$identity,
						author$project$Page$Component$LogIn$view(logInOrSignUpModel))
					]))
			]),
		ce: author$project$BasicParts$tabSingle('ログイン'),
		bD: elm$core$Maybe$Just('ログイン')
	};
};
var author$project$Page$Notification$view = function (model) {
	return {
		bI: elm$core$Maybe$Just(2),
		bQ: _List_fromArray(
			[
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('notification')
					]),
				_List_fromArray(
					[
						elm$html$Html$text('通知。まだ作り途中')
					]))
			]),
		ce: author$project$BasicParts$tabSingle('通知'),
		bD: elm$core$Maybe$Just('通知')
	};
};
var author$project$Data$Product$detailGetCondition = function (_n0) {
	var condition = _n0.cD;
	return condition;
};
var author$project$Data$Product$detailGetDescription = function (_n0) {
	var description = _n0.cH;
	return description;
};
var author$project$Data$Product$detailGetImageUrls = function (_n0) {
	var imageIds = _n0.d1;
	return A2(
		elm$core$List$map,
		author$project$Data$ImageId$toUrlString,
		A2(elm$core$List$cons, imageIds.a, imageIds.b));
};
var author$project$Data$Product$detailGetName = function (_n0) {
	var name = _n0.a;
	return name;
};
var author$project$Api$UpdateProductRequest = elm$core$Basics$identity;
var author$project$Page$Component$ProductEditor$toUpdateRequest = function (_n0) {
	var rec = _n0;
	var _n1 = _Utils_Tuple3(rec.b4, rec.cD, rec.bJ);
	if (((!_n1.a.$) && (!_n1.b.$)) && (_n1.c.$ === 2)) {
		var price = _n1.a.a;
		var condition = _n1.b.a;
		var category = _n1.c.a;
		return (_Utils_eq(
			author$project$Page$Component$ProductEditor$nameCheck(rec.a),
			elm$core$Maybe$Nothing) && _Utils_eq(
			author$project$Page$Component$ProductEditor$imagesCheck(rec.o),
			elm$core$Maybe$Nothing)) ? elm$core$Maybe$Just(
			{dL: rec.o, cD: condition, dV: rec.M, cH: rec.cH, a: rec.a, b4: price}) : elm$core$Maybe$Nothing;
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var author$project$Page$Product$conditionView = function (condition) {
	return A2(
		author$project$Page$Style$titleAndContent,
		'商品の状態',
		A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('product-condition')
				]),
			_List_fromArray(
				[
					elm$html$Html$text(
					author$project$Data$Product$conditionToJapaneseString(condition))
				])));
};
var author$project$Page$Product$descriptionView = function (description) {
	return A2(
		author$project$Page$Style$titleAndContent,
		'商品の説明',
		A2(
			elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					elm$html$Html$text(description)
				])));
};
var author$project$Page$Product$UpdateProductData = F3(
	function (a, b, c) {
		return {$: 15, a: a, b: b, c: c};
	});
var author$project$Page$Product$editOkCancelButton = F3(
	function (token, productId, requestDataMaybe) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('profile-editButtonArea')
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$button,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('profile-editCancelButton'),
							elm$html$Html$Events$onClick(author$project$Page$Product$MsgBackToViewMode)
						]),
					_List_fromArray(
						[
							elm$html$Html$text('キャンセル')
						])),
					A2(
					elm$html$Html$button,
					_Utils_ap(
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('profile-editOkButton')
							]),
						function () {
							if (!requestDataMaybe.$) {
								var requestDate = requestDataMaybe.a;
								return _List_fromArray(
									[
										elm$html$Html$Events$onClick(
										A3(author$project$Page$Product$UpdateProductData, token, productId, requestDate)),
										elm$html$Html$Attributes$disabled(false)
									]);
							} else {
								return _List_fromArray(
									[
										elm$html$Html$Attributes$disabled(true)
									]);
							}
						}()),
					_List_fromArray(
						[
							elm$html$Html$text('変更する')
						]))
				]));
	});
var author$project$Data$Product$detailGetCategory = function (_n0) {
	var category = _n0.bJ;
	return category;
};
var author$project$Data$Product$detailGetCreatedAt = function (_n0) {
	var createdAt = _n0.aS;
	return createdAt;
};
var author$project$Data$Product$detailGetLikedCount = function (_n0) {
	var likedCount = _n0.c1;
	return likedCount;
};
var author$project$Data$Product$detailGetStatus = function (_n0) {
	var status = _n0.cd;
	return status;
};
var author$project$Page$Product$categoryView = function (category) {
	return A2(
		author$project$Page$Style$titleAndContent,
		'カテゴリー',
		A2(
			elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					elm$html$Html$text(
					author$project$Data$Category$toJapaneseString(category))
				])));
};
var author$project$Data$LogInState$getMyUserId = function (logInState) {
	switch (logInState.$) {
		case 0:
			return elm$core$Maybe$Nothing;
		case 1:
			return elm$core$Maybe$Nothing;
		default:
			var userWithName = logInState.a.dF;
			return elm$core$Maybe$Just(
				author$project$Data$User$withNameGetId(userWithName));
	}
};
var author$project$Data$Product$commentGetBody = function (_n0) {
	var body = _n0.bg;
	return body;
};
var author$project$Data$Product$commentGetCreatedAt = function (_n0) {
	var createdAt = _n0.aS;
	return createdAt;
};
var author$project$Data$DateTime$monthToString = function (month) {
	switch (month) {
		case 0:
			return '1';
		case 1:
			return '2';
		case 2:
			return '3';
		case 3:
			return '4';
		case 4:
			return '5';
		case 5:
			return '6';
		case 6:
			return '7';
		case 7:
			return '8';
		case 8:
			return '9';
		case 9:
			return '10';
		case 10:
			return '11';
		default:
			return '12';
	}
};
var elm$core$String$concat = function (strings) {
	return A2(elm$core$String$join, '', strings);
};
var author$project$Data$DateTime$toStringHelper = function (_n0) {
	var year = _n0.dJ;
	var month = _n0.c4;
	var day = _n0.cE;
	var hour = _n0.cT;
	var minute = _n0.c3;
	var second = _n0.dm;
	return elm$core$String$concat(
		_List_fromArray(
			[
				A3(
				elm$core$String$padLeft,
				4,
				'0',
				elm$core$String$fromInt(year)),
				'/',
				A3(
				elm$core$String$padLeft,
				2,
				'0',
				author$project$Data$DateTime$monthToString(month)),
				'/',
				A3(
				elm$core$String$padLeft,
				2,
				'0',
				elm$core$String$fromInt(day)),
				' ',
				A3(
				elm$core$String$padLeft,
				2,
				'0',
				elm$core$String$fromInt(hour)),
				':',
				A3(
				elm$core$String$padLeft,
				2,
				'0',
				elm$core$String$fromInt(minute)),
				':',
				A3(
				elm$core$String$padLeft,
				2,
				'0',
				elm$core$String$fromInt(second))
			]));
};
var elm$time$Time$flooredDiv = F2(
	function (numerator, denominator) {
		return elm$core$Basics$floor(numerator / denominator);
	});
var elm$time$Time$posixToMillis = function (_n0) {
	var millis = _n0;
	return millis;
};
var elm$time$Time$toAdjustedMinutesHelp = F3(
	function (defaultOffset, posixMinutes, eras) {
		toAdjustedMinutesHelp:
		while (true) {
			if (!eras.b) {
				return posixMinutes + defaultOffset;
			} else {
				var era = eras.a;
				var olderEras = eras.b;
				if (_Utils_cmp(era.cc, posixMinutes) < 0) {
					return posixMinutes + era.e;
				} else {
					var $temp$defaultOffset = defaultOffset,
						$temp$posixMinutes = posixMinutes,
						$temp$eras = olderEras;
					defaultOffset = $temp$defaultOffset;
					posixMinutes = $temp$posixMinutes;
					eras = $temp$eras;
					continue toAdjustedMinutesHelp;
				}
			}
		}
	});
var elm$time$Time$toAdjustedMinutes = F2(
	function (_n0, time) {
		var defaultOffset = _n0.a;
		var eras = _n0.b;
		return A3(
			elm$time$Time$toAdjustedMinutesHelp,
			defaultOffset,
			A2(
				elm$time$Time$flooredDiv,
				elm$time$Time$posixToMillis(time),
				60000),
			eras);
	});
var elm$time$Time$toCivil = function (minutes) {
	var rawDay = A2(elm$time$Time$flooredDiv, minutes, 60 * 24) + 719468;
	var era = (((rawDay >= 0) ? rawDay : (rawDay - 146096)) / 146097) | 0;
	var dayOfEra = rawDay - (era * 146097);
	var yearOfEra = ((((dayOfEra - ((dayOfEra / 1460) | 0)) + ((dayOfEra / 36524) | 0)) - ((dayOfEra / 146096) | 0)) / 365) | 0;
	var dayOfYear = dayOfEra - (((365 * yearOfEra) + ((yearOfEra / 4) | 0)) - ((yearOfEra / 100) | 0));
	var mp = (((5 * dayOfYear) + 2) / 153) | 0;
	var month = mp + ((mp < 10) ? 3 : (-9));
	var year = yearOfEra + (era * 400);
	return {
		cE: (dayOfYear - ((((153 * mp) + 2) / 5) | 0)) + 1,
		c4: month,
		dJ: year + ((month <= 2) ? 1 : 0)
	};
};
var elm$time$Time$toDay = F2(
	function (zone, time) {
		return elm$time$Time$toCivil(
			A2(elm$time$Time$toAdjustedMinutes, zone, time)).cE;
	});
var elm$time$Time$toHour = F2(
	function (zone, time) {
		return A2(
			elm$core$Basics$modBy,
			24,
			A2(
				elm$time$Time$flooredDiv,
				A2(elm$time$Time$toAdjustedMinutes, zone, time),
				60));
	});
var elm$time$Time$toMinute = F2(
	function (zone, time) {
		return A2(
			elm$core$Basics$modBy,
			60,
			A2(elm$time$Time$toAdjustedMinutes, zone, time));
	});
var elm$time$Time$Apr = 3;
var elm$time$Time$Aug = 7;
var elm$time$Time$Dec = 11;
var elm$time$Time$Feb = 1;
var elm$time$Time$Jan = 0;
var elm$time$Time$Jul = 6;
var elm$time$Time$Jun = 5;
var elm$time$Time$Mar = 2;
var elm$time$Time$May = 4;
var elm$time$Time$Nov = 10;
var elm$time$Time$Oct = 9;
var elm$time$Time$Sep = 8;
var elm$time$Time$toMonth = F2(
	function (zone, time) {
		var _n0 = elm$time$Time$toCivil(
			A2(elm$time$Time$toAdjustedMinutes, zone, time)).c4;
		switch (_n0) {
			case 1:
				return 0;
			case 2:
				return 1;
			case 3:
				return 2;
			case 4:
				return 3;
			case 5:
				return 4;
			case 6:
				return 5;
			case 7:
				return 6;
			case 8:
				return 7;
			case 9:
				return 8;
			case 10:
				return 9;
			case 11:
				return 10;
			default:
				return 11;
		}
	});
var elm$time$Time$toSecond = F2(
	function (_n0, time) {
		return A2(
			elm$core$Basics$modBy,
			60,
			A2(
				elm$time$Time$flooredDiv,
				elm$time$Time$posixToMillis(time),
				1000));
	});
var elm$time$Time$toYear = F2(
	function (zone, time) {
		return elm$time$Time$toCivil(
			A2(elm$time$Time$toAdjustedMinutes, zone, time)).dJ;
	});
var author$project$Data$DateTime$toString = F2(
	function (posix, zone) {
		return author$project$Data$DateTime$toStringHelper(
			{
				cE: A2(elm$time$Time$toDay, zone, posix),
				cT: A2(elm$time$Time$toHour, zone, posix),
				c3: A2(elm$time$Time$toMinute, zone, posix),
				c4: A2(elm$time$Time$toMonth, zone, posix),
				dm: A2(elm$time$Time$toSecond, zone, posix),
				dJ: A2(elm$time$Time$toYear, zone, posix)
			});
	});
var elm$time$Time$utc = A2(elm$time$Time$Zone, 0, _List_Nil);
var justinmimbs$time_extra$Time$Extra$Day = 11;
var justinmimbs$time_extra$Time$Extra$Hour = 12;
var justinmimbs$time_extra$Time$Extra$Minute = 13;
var justinmimbs$time_extra$Time$Extra$Month = 2;
var justinmimbs$time_extra$Time$Extra$Second = 14;
var elm$core$Basics$truncate = _Basics_truncate;
var justinmimbs$time_extra$Time$Extra$Millisecond = 15;
var justinmimbs$time_extra$Time$Extra$Week = 3;
var justinmimbs$date$Date$Day = 11;
var justinmimbs$date$Date$Friday = 8;
var justinmimbs$date$Date$Monday = 4;
var justinmimbs$date$Date$Month = 2;
var justinmimbs$date$Date$Quarter = 1;
var justinmimbs$date$Date$Saturday = 9;
var justinmimbs$date$Date$Sunday = 10;
var justinmimbs$date$Date$Thursday = 7;
var justinmimbs$date$Date$Tuesday = 5;
var justinmimbs$date$Date$Wednesday = 6;
var justinmimbs$date$Date$Week = 3;
var justinmimbs$date$Date$Year = 0;
var elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var justinmimbs$date$Date$RD = elm$core$Basics$identity;
var justinmimbs$date$Date$isLeapYear = function (y) {
	return ((!A2(elm$core$Basics$modBy, 4, y)) && A2(elm$core$Basics$modBy, 100, y)) || (!A2(elm$core$Basics$modBy, 400, y));
};
var justinmimbs$date$Date$daysBeforeMonth = F2(
	function (y, m) {
		var leapDays = justinmimbs$date$Date$isLeapYear(y) ? 1 : 0;
		switch (m) {
			case 0:
				return 0;
			case 1:
				return 31;
			case 2:
				return 59 + leapDays;
			case 3:
				return 90 + leapDays;
			case 4:
				return 120 + leapDays;
			case 5:
				return 151 + leapDays;
			case 6:
				return 181 + leapDays;
			case 7:
				return 212 + leapDays;
			case 8:
				return 243 + leapDays;
			case 9:
				return 273 + leapDays;
			case 10:
				return 304 + leapDays;
			default:
				return 334 + leapDays;
		}
	});
var justinmimbs$date$Date$floorDiv = F2(
	function (a, b) {
		return elm$core$Basics$floor(a / b);
	});
var justinmimbs$date$Date$daysBeforeYear = function (y1) {
	var y = y1 - 1;
	var leapYears = (A2(justinmimbs$date$Date$floorDiv, y, 4) - A2(justinmimbs$date$Date$floorDiv, y, 100)) + A2(justinmimbs$date$Date$floorDiv, y, 400);
	return (365 * y) + leapYears;
};
var justinmimbs$date$Date$daysInMonth = F2(
	function (y, m) {
		switch (m) {
			case 0:
				return 31;
			case 1:
				return justinmimbs$date$Date$isLeapYear(y) ? 29 : 28;
			case 2:
				return 31;
			case 3:
				return 30;
			case 4:
				return 31;
			case 5:
				return 30;
			case 6:
				return 31;
			case 7:
				return 31;
			case 8:
				return 30;
			case 9:
				return 31;
			case 10:
				return 30;
			default:
				return 31;
		}
	});
var justinmimbs$date$Date$fromCalendarDate = F3(
	function (y, m, d) {
		return (justinmimbs$date$Date$daysBeforeYear(y) + A2(justinmimbs$date$Date$daysBeforeMonth, y, m)) + A3(
			elm$core$Basics$clamp,
			1,
			A2(justinmimbs$date$Date$daysInMonth, y, m),
			d);
	});
var justinmimbs$date$Date$fromPosix = F2(
	function (zone, posix) {
		return A3(
			justinmimbs$date$Date$fromCalendarDate,
			A2(elm$time$Time$toYear, zone, posix),
			A2(elm$time$Time$toMonth, zone, posix),
			A2(elm$time$Time$toDay, zone, posix));
	});
var elm$time$Time$Fri = 4;
var elm$time$Time$Mon = 0;
var elm$time$Time$Sat = 5;
var elm$time$Time$Sun = 6;
var elm$time$Time$Thu = 3;
var elm$time$Time$Tue = 1;
var elm$time$Time$Wed = 2;
var justinmimbs$date$Date$weekdayNumber = function (_n0) {
	var rd = _n0;
	var _n1 = A2(elm$core$Basics$modBy, 7, rd);
	if (!_n1) {
		return 7;
	} else {
		var n = _n1;
		return n;
	}
};
var justinmimbs$date$Date$weekdayToNumber = function (wd) {
	switch (wd) {
		case 0:
			return 1;
		case 1:
			return 2;
		case 2:
			return 3;
		case 3:
			return 4;
		case 4:
			return 5;
		case 5:
			return 6;
		default:
			return 7;
	}
};
var justinmimbs$date$Date$daysSincePreviousWeekday = F2(
	function (wd, date) {
		return A2(
			elm$core$Basics$modBy,
			7,
			(justinmimbs$date$Date$weekdayNumber(date) + 7) - justinmimbs$date$Date$weekdayToNumber(wd));
	});
var justinmimbs$date$Date$firstOfMonth = F2(
	function (y, m) {
		return (justinmimbs$date$Date$daysBeforeYear(y) + A2(justinmimbs$date$Date$daysBeforeMonth, y, m)) + 1;
	});
var justinmimbs$date$Date$firstOfYear = function (y) {
	return justinmimbs$date$Date$daysBeforeYear(y) + 1;
};
var justinmimbs$date$Date$monthToNumber = function (m) {
	switch (m) {
		case 0:
			return 1;
		case 1:
			return 2;
		case 2:
			return 3;
		case 3:
			return 4;
		case 4:
			return 5;
		case 5:
			return 6;
		case 6:
			return 7;
		case 7:
			return 8;
		case 8:
			return 9;
		case 9:
			return 10;
		case 10:
			return 11;
		default:
			return 12;
	}
};
var justinmimbs$date$Date$numberToMonth = function (mn) {
	var _n0 = A2(elm$core$Basics$max, 1, mn);
	switch (_n0) {
		case 1:
			return 0;
		case 2:
			return 1;
		case 3:
			return 2;
		case 4:
			return 3;
		case 5:
			return 4;
		case 6:
			return 5;
		case 7:
			return 6;
		case 8:
			return 7;
		case 9:
			return 8;
		case 10:
			return 9;
		case 11:
			return 10;
		default:
			return 11;
	}
};
var justinmimbs$date$Date$toCalendarDateHelp = F3(
	function (y, m, d) {
		toCalendarDateHelp:
		while (true) {
			var monthDays = A2(justinmimbs$date$Date$daysInMonth, y, m);
			var mn = justinmimbs$date$Date$monthToNumber(m);
			if ((mn < 12) && (_Utils_cmp(d, monthDays) > 0)) {
				var $temp$y = y,
					$temp$m = justinmimbs$date$Date$numberToMonth(mn + 1),
					$temp$d = d - monthDays;
				y = $temp$y;
				m = $temp$m;
				d = $temp$d;
				continue toCalendarDateHelp;
			} else {
				return {cE: d, c4: m, dJ: y};
			}
		}
	});
var justinmimbs$date$Date$divWithRemainder = F2(
	function (a, b) {
		return _Utils_Tuple2(
			A2(justinmimbs$date$Date$floorDiv, a, b),
			A2(elm$core$Basics$modBy, b, a));
	});
var justinmimbs$date$Date$year = function (_n0) {
	var rd = _n0;
	var _n1 = A2(justinmimbs$date$Date$divWithRemainder, rd, 146097);
	var n400 = _n1.a;
	var r400 = _n1.b;
	var _n2 = A2(justinmimbs$date$Date$divWithRemainder, r400, 36524);
	var n100 = _n2.a;
	var r100 = _n2.b;
	var _n3 = A2(justinmimbs$date$Date$divWithRemainder, r100, 1461);
	var n4 = _n3.a;
	var r4 = _n3.b;
	var _n4 = A2(justinmimbs$date$Date$divWithRemainder, r4, 365);
	var n1 = _n4.a;
	var r1 = _n4.b;
	var n = (!r1) ? 0 : 1;
	return ((((n400 * 400) + (n100 * 100)) + (n4 * 4)) + n1) + n;
};
var justinmimbs$date$Date$toOrdinalDate = function (_n0) {
	var rd = _n0;
	var y = justinmimbs$date$Date$year(rd);
	return {
		b1: rd - justinmimbs$date$Date$daysBeforeYear(y),
		dJ: y
	};
};
var justinmimbs$date$Date$toCalendarDate = function (_n0) {
	var rd = _n0;
	var date = justinmimbs$date$Date$toOrdinalDate(rd);
	return A3(justinmimbs$date$Date$toCalendarDateHelp, date.dJ, 0, date.b1);
};
var justinmimbs$date$Date$month = A2(
	elm$core$Basics$composeR,
	justinmimbs$date$Date$toCalendarDate,
	function ($) {
		return $.c4;
	});
var justinmimbs$date$Date$monthToQuarter = function (m) {
	return ((justinmimbs$date$Date$monthToNumber(m) + 2) / 3) | 0;
};
var justinmimbs$date$Date$quarter = A2(elm$core$Basics$composeR, justinmimbs$date$Date$month, justinmimbs$date$Date$monthToQuarter);
var justinmimbs$date$Date$quarterToMonth = function (q) {
	return justinmimbs$date$Date$numberToMonth((q * 3) - 2);
};
var justinmimbs$date$Date$floor = F2(
	function (interval, date) {
		var rd = date;
		switch (interval) {
			case 0:
				return justinmimbs$date$Date$firstOfYear(
					justinmimbs$date$Date$year(date));
			case 1:
				return A2(
					justinmimbs$date$Date$firstOfMonth,
					justinmimbs$date$Date$year(date),
					justinmimbs$date$Date$quarterToMonth(
						justinmimbs$date$Date$quarter(date)));
			case 2:
				return A2(
					justinmimbs$date$Date$firstOfMonth,
					justinmimbs$date$Date$year(date),
					justinmimbs$date$Date$month(date));
			case 3:
				return rd - A2(justinmimbs$date$Date$daysSincePreviousWeekday, 0, date);
			case 4:
				return rd - A2(justinmimbs$date$Date$daysSincePreviousWeekday, 0, date);
			case 5:
				return rd - A2(justinmimbs$date$Date$daysSincePreviousWeekday, 1, date);
			case 6:
				return rd - A2(justinmimbs$date$Date$daysSincePreviousWeekday, 2, date);
			case 7:
				return rd - A2(justinmimbs$date$Date$daysSincePreviousWeekday, 3, date);
			case 8:
				return rd - A2(justinmimbs$date$Date$daysSincePreviousWeekday, 4, date);
			case 9:
				return rd - A2(justinmimbs$date$Date$daysSincePreviousWeekday, 5, date);
			case 10:
				return rd - A2(justinmimbs$date$Date$daysSincePreviousWeekday, 6, date);
			default:
				return date;
		}
	});
var justinmimbs$date$Date$toRataDie = function (_n0) {
	var rd = _n0;
	return rd;
};
var justinmimbs$time_extra$Time$Extra$dateToMillis = function (date) {
	var daysSinceEpoch = justinmimbs$date$Date$toRataDie(date) - 719163;
	return daysSinceEpoch * 86400000;
};
var elm$time$Time$toMillis = F2(
	function (_n0, time) {
		return A2(
			elm$core$Basics$modBy,
			1000,
			elm$time$Time$posixToMillis(time));
	});
var justinmimbs$time_extra$Time$Extra$timeFromClock = F4(
	function (hour, minute, second, millisecond) {
		return (((hour * 3600000) + (minute * 60000)) + (second * 1000)) + millisecond;
	});
var justinmimbs$time_extra$Time$Extra$timeFromPosix = F2(
	function (zone, posix) {
		return A4(
			justinmimbs$time_extra$Time$Extra$timeFromClock,
			A2(elm$time$Time$toHour, zone, posix),
			A2(elm$time$Time$toMinute, zone, posix),
			A2(elm$time$Time$toSecond, zone, posix),
			A2(elm$time$Time$toMillis, zone, posix));
	});
var justinmimbs$time_extra$Time$Extra$toOffset = F2(
	function (zone, posix) {
		var millis = elm$time$Time$posixToMillis(posix);
		var localMillis = justinmimbs$time_extra$Time$Extra$dateToMillis(
			A2(justinmimbs$date$Date$fromPosix, zone, posix)) + A2(justinmimbs$time_extra$Time$Extra$timeFromPosix, zone, posix);
		return ((localMillis - millis) / 60000) | 0;
	});
var justinmimbs$time_extra$Time$Extra$posixFromDateTime = F3(
	function (zone, date, time) {
		var millis = justinmimbs$time_extra$Time$Extra$dateToMillis(date) + time;
		var offset0 = A2(
			justinmimbs$time_extra$Time$Extra$toOffset,
			zone,
			elm$time$Time$millisToPosix(millis));
		var posix1 = elm$time$Time$millisToPosix(millis - (offset0 * 60000));
		var offset1 = A2(justinmimbs$time_extra$Time$Extra$toOffset, zone, posix1);
		if (_Utils_eq(offset0, offset1)) {
			return posix1;
		} else {
			var posix2 = elm$time$Time$millisToPosix(millis - (offset1 * 60000));
			var offset2 = A2(justinmimbs$time_extra$Time$Extra$toOffset, zone, posix2);
			return _Utils_eq(offset1, offset2) ? posix2 : posix1;
		}
	});
var justinmimbs$time_extra$Time$Extra$floorDate = F3(
	function (dateInterval, zone, posix) {
		return A3(
			justinmimbs$time_extra$Time$Extra$posixFromDateTime,
			zone,
			A2(
				justinmimbs$date$Date$floor,
				dateInterval,
				A2(justinmimbs$date$Date$fromPosix, zone, posix)),
			0);
	});
var justinmimbs$time_extra$Time$Extra$floor = F3(
	function (interval, zone, posix) {
		switch (interval) {
			case 15:
				return posix;
			case 14:
				return A3(
					justinmimbs$time_extra$Time$Extra$posixFromDateTime,
					zone,
					A2(justinmimbs$date$Date$fromPosix, zone, posix),
					A4(
						justinmimbs$time_extra$Time$Extra$timeFromClock,
						A2(elm$time$Time$toHour, zone, posix),
						A2(elm$time$Time$toMinute, zone, posix),
						A2(elm$time$Time$toSecond, zone, posix),
						0));
			case 13:
				return A3(
					justinmimbs$time_extra$Time$Extra$posixFromDateTime,
					zone,
					A2(justinmimbs$date$Date$fromPosix, zone, posix),
					A4(
						justinmimbs$time_extra$Time$Extra$timeFromClock,
						A2(elm$time$Time$toHour, zone, posix),
						A2(elm$time$Time$toMinute, zone, posix),
						0,
						0));
			case 12:
				return A3(
					justinmimbs$time_extra$Time$Extra$posixFromDateTime,
					zone,
					A2(justinmimbs$date$Date$fromPosix, zone, posix),
					A4(
						justinmimbs$time_extra$Time$Extra$timeFromClock,
						A2(elm$time$Time$toHour, zone, posix),
						0,
						0,
						0));
			case 11:
				return A3(justinmimbs$time_extra$Time$Extra$floorDate, 11, zone, posix);
			case 2:
				return A3(justinmimbs$time_extra$Time$Extra$floorDate, 2, zone, posix);
			case 0:
				return A3(justinmimbs$time_extra$Time$Extra$floorDate, 0, zone, posix);
			case 1:
				return A3(justinmimbs$time_extra$Time$Extra$floorDate, 1, zone, posix);
			case 3:
				return A3(justinmimbs$time_extra$Time$Extra$floorDate, 3, zone, posix);
			case 4:
				return A3(justinmimbs$time_extra$Time$Extra$floorDate, 4, zone, posix);
			case 5:
				return A3(justinmimbs$time_extra$Time$Extra$floorDate, 5, zone, posix);
			case 6:
				return A3(justinmimbs$time_extra$Time$Extra$floorDate, 6, zone, posix);
			case 7:
				return A3(justinmimbs$time_extra$Time$Extra$floorDate, 7, zone, posix);
			case 8:
				return A3(justinmimbs$time_extra$Time$Extra$floorDate, 8, zone, posix);
			case 9:
				return A3(justinmimbs$time_extra$Time$Extra$floorDate, 9, zone, posix);
			default:
				return A3(justinmimbs$time_extra$Time$Extra$floorDate, 10, zone, posix);
		}
	});
var justinmimbs$time_extra$Time$Extra$toFractionalDay = F2(
	function (zone, posix) {
		return A2(justinmimbs$time_extra$Time$Extra$timeFromPosix, zone, posix) / 86400000;
	});
var justinmimbs$time_extra$Time$Extra$toMonths = F2(
	function (zone, posix) {
		var wholeMonths = (12 * (A2(elm$time$Time$toYear, zone, posix) - 1)) + (justinmimbs$date$Date$monthToNumber(
			A2(elm$time$Time$toMonth, zone, posix)) - 1);
		var fractionalMonth = (A2(elm$time$Time$toDay, zone, posix) + A2(justinmimbs$time_extra$Time$Extra$toFractionalDay, zone, posix)) / 100;
		return wholeMonths + fractionalMonth;
	});
var justinmimbs$time_extra$Time$Extra$toRataDieMoment = F2(
	function (zone, posix) {
		return justinmimbs$date$Date$toRataDie(
			A2(justinmimbs$date$Date$fromPosix, zone, posix)) + A2(justinmimbs$time_extra$Time$Extra$toFractionalDay, zone, posix);
	});
var justinmimbs$time_extra$Time$Extra$diff = F4(
	function (interval, zone, posix1, posix2) {
		diff:
		while (true) {
			switch (interval) {
				case 15:
					return elm$time$Time$posixToMillis(posix2) - elm$time$Time$posixToMillis(posix1);
				case 14:
					return (A4(justinmimbs$time_extra$Time$Extra$diff, 15, zone, posix1, posix2) / 1000) | 0;
				case 13:
					return (A4(justinmimbs$time_extra$Time$Extra$diff, 15, zone, posix1, posix2) / 60000) | 0;
				case 12:
					return (A4(justinmimbs$time_extra$Time$Extra$diff, 15, zone, posix1, posix2) / 3600000) | 0;
				case 11:
					return (A2(justinmimbs$time_extra$Time$Extra$toRataDieMoment, zone, posix2) - A2(justinmimbs$time_extra$Time$Extra$toRataDieMoment, zone, posix1)) | 0;
				case 2:
					return (A2(justinmimbs$time_extra$Time$Extra$toMonths, zone, posix2) - A2(justinmimbs$time_extra$Time$Extra$toMonths, zone, posix1)) | 0;
				case 0:
					return (A4(justinmimbs$time_extra$Time$Extra$diff, 2, zone, posix1, posix2) / 12) | 0;
				case 1:
					return (A4(justinmimbs$time_extra$Time$Extra$diff, 2, zone, posix1, posix2) / 3) | 0;
				case 3:
					return (A4(justinmimbs$time_extra$Time$Extra$diff, 11, zone, posix1, posix2) / 7) | 0;
				default:
					var weekday = interval;
					var $temp$interval = 3,
						$temp$zone = zone,
						$temp$posix1 = A3(justinmimbs$time_extra$Time$Extra$floor, weekday, zone, posix1),
						$temp$posix2 = A3(justinmimbs$time_extra$Time$Extra$floor, weekday, zone, posix2);
					interval = $temp$interval;
					zone = $temp$zone;
					posix1 = $temp$posix1;
					posix2 = $temp$posix2;
					continue diff;
			}
		}
	});
var author$project$Data$DateTime$toDiffString = F2(
	function (nowMaybe, createdTime) {
		if (!nowMaybe.$) {
			var _n1 = nowMaybe.a;
			var nowPosix = _n1.a;
			var zone = _n1.b;
			if (!A4(justinmimbs$time_extra$Time$Extra$diff, 2, zone, createdTime, nowPosix)) {
				var diffSecond = A4(justinmimbs$time_extra$Time$Extra$diff, 14, zone, createdTime, nowPosix);
				var diffMinute = A4(justinmimbs$time_extra$Time$Extra$diff, 13, zone, createdTime, nowPosix);
				var diffHour = A4(justinmimbs$time_extra$Time$Extra$diff, 12, zone, createdTime, nowPosix);
				var diffDay = A4(justinmimbs$time_extra$Time$Extra$diff, 11, zone, createdTime, nowPosix);
				return diffDay ? (elm$core$String$fromInt(diffDay) + '日前') : (diffHour ? (elm$core$String$fromInt(diffHour) + '時間前') : (diffMinute ? (elm$core$String$fromInt(diffMinute) + '分前') : (elm$core$String$fromInt(diffSecond) + '秒前')));
			} else {
				return A2(author$project$Data$DateTime$toString, createdTime, zone);
			}
		} else {
			return A2(author$project$Data$DateTime$toString, createdTime, elm$time$Time$utc) + '(UTC)';
		}
	});
var rtfeldman$elm_css$Svg$Styled$polygon = rtfeldman$elm_css$Svg$Styled$node('polygon');
var rtfeldman$elm_css$Svg$Styled$toUnstyled = rtfeldman$elm_css$VirtualDom$Styled$toUnstyled;
var rtfeldman$elm_css$Svg$Styled$Attributes$class = rtfeldman$elm_css$VirtualDom$Styled$attribute('class');
var rtfeldman$elm_css$Svg$Styled$Attributes$points = rtfeldman$elm_css$VirtualDom$Styled$attribute('points');
var author$project$Page$Component$Comment$commentTriangleLeft = function (isMine) {
	return rtfeldman$elm_css$Svg$Styled$toUnstyled(
		A2(
			rtfeldman$elm_css$Svg$Styled$svg,
			_Utils_ap(
				_List_fromArray(
					[
						rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 10 10'),
						rtfeldman$elm_css$Svg$Styled$Attributes$class('product-comment-text-triangle')
					]),
				isMine ? _List_fromArray(
					[
						rtfeldman$elm_css$Svg$Styled$Attributes$class('product-comment-text-triangle-mine')
					]) : _List_Nil),
			_List_fromArray(
				[
					A2(
					rtfeldman$elm_css$Svg$Styled$polygon,
					_List_fromArray(
						[
							rtfeldman$elm_css$Svg$Styled$Attributes$points('10 0 0 0 10 10')
						]),
					_List_Nil)
				])));
};
var author$project$Page$Component$Comment$commentTriangleRight = function (isMine) {
	return rtfeldman$elm_css$Svg$Styled$toUnstyled(
		A2(
			rtfeldman$elm_css$Svg$Styled$svg,
			_Utils_ap(
				_List_fromArray(
					[
						rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 10 10'),
						rtfeldman$elm_css$Svg$Styled$Attributes$class('product-comment-text-triangle')
					]),
				isMine ? _List_fromArray(
					[
						rtfeldman$elm_css$Svg$Styled$Attributes$class('product-comment-text-triangle-mine')
					]) : _List_Nil),
			_List_fromArray(
				[
					A2(
					rtfeldman$elm_css$Svg$Styled$polygon,
					_List_fromArray(
						[
							rtfeldman$elm_css$Svg$Styled$Attributes$points('0 0 10 0 0 10')
						]),
					_List_Nil)
				])));
};
var author$project$Page$Component$Comment$commentView = F2(
	function (nowMaybe, comment) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('product-comment')
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$a,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class(
							comment.aX ? 'product-comment-sellerName' : 'product-comment-name'),
							elm$html$Html$Attributes$href(
							author$project$PageLocation$toUrlAsString(
								author$project$PageLocation$User(
									author$project$Data$User$withNameGetId(comment.ch))))
						]),
					_List_fromArray(
						[
							A2(
							author$project$Page$Style$userImage,
							48,
							author$project$Data$User$withNameGetImageId(comment.ch)),
							elm$html$Html$text(
							author$project$Data$User$withNameGetDisplayName(comment.ch))
						])),
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class(
							comment.aX ? 'product-comment-sellerBox' : 'product-comment-box')
						]),
					_Utils_ap(
						comment.aX ? _List_fromArray(
							[
								author$project$Page$Component$Comment$commentTriangleLeft(comment.bT)
							]) : _List_Nil,
						_Utils_ap(
							_List_fromArray(
								[
									A2(
									elm$html$Html$div,
									_List_fromArray(
										[
											elm$html$Html$Attributes$classList(
											_List_fromArray(
												[
													_Utils_Tuple2('product-comment-text', true),
													_Utils_Tuple2('product-comment-text-mine', comment.bT),
													_Utils_Tuple2('product-comment-text-seller', comment.aX)
												]))
										]),
									_List_fromArray(
										[
											elm$html$Html$text(comment.bg)
										]))
								]),
							comment.aX ? _List_Nil : _List_fromArray(
								[
									author$project$Page$Component$Comment$commentTriangleRight(comment.bT)
								])))),
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('product-comment-time')
						]),
					_List_fromArray(
						[
							elm$html$Html$text(
							A2(author$project$Data$DateTime$toDiffString, nowMaybe, comment.aS))
						]))
				]));
	});
var author$project$Page$Component$Comment$view = F2(
	function (nowMaybe, commentListMaybe) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('product-commentList')
				]),
			function () {
				if (!commentListMaybe.$) {
					var comments = commentListMaybe.a;
					return A2(
						elm$core$List$map,
						author$project$Page$Component$Comment$commentView(nowMaybe),
						elm$core$List$reverse(comments));
				} else {
					return _List_fromArray(
						[
							elm$html$Html$text('コメント読み込み中'),
							rtfeldman$elm_css$Html$Styled$toUnstyled(
							author$project$Icon$loading(
								{
									dQ: A3(rtfeldman$elm_css$Css$rgb, 0, 0, 0),
									eo: 48
								}))
						]);
				}
			}());
	});
var author$project$Page$Product$InputComment = function (a) {
	return {$: 9, a: a};
};
var author$project$Page$Product$SendComment = function (a) {
	return {$: 10, a: a};
};
var elm$html$Html$textarea = _VirtualDom_node('textarea');
var elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			elm$virtual_dom$VirtualDom$on,
			event,
			elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
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
var author$project$Page$Product$commentInputArea = F2(
	function (sending, token) {
		return A2(
			elm$html$Html$div,
			_List_Nil,
			_Utils_ap(
				_List_fromArray(
					[
						A2(
						elm$html$Html$textarea,
						_List_fromArray(
							[
								elm$html$Html$Events$onInput(author$project$Page$Product$InputComment),
								elm$html$Html$Attributes$class('form-textarea'),
								elm$html$Html$Attributes$id(author$project$Page$Product$commentTextAreaId)
							]),
						_List_Nil)
					]),
				sending ? _List_fromArray(
					[
						A2(
						elm$html$Html$button,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('product-comment-sendButton'),
								elm$html$Html$Attributes$disabled(true)
							]),
						_List_fromArray(
							[
								rtfeldman$elm_css$Html$Styled$toUnstyled(
								author$project$Icon$loading(
									{
										dQ: A3(rtfeldman$elm_css$Css$rgb, 0, 0, 0),
										eo: 24
									}))
							]))
					]) : _List_fromArray(
					[
						A2(
						elm$html$Html$button,
						_List_fromArray(
							[
								elm$html$Html$Events$onClick(
								author$project$Page$Product$SendComment(token)),
								elm$html$Html$Attributes$class('product-comment-sendButton')
							]),
						_List_fromArray(
							[
								elm$html$Html$text('コメントを送信')
							]))
					])));
	});
var author$project$Page$Product$commentListView = F5(
	function (commentSending, nowMaybe, sellerId, logInState, commentListMaybe) {
		return A2(
			elm$html$Html$div,
			_List_Nil,
			_Utils_ap(
				function () {
					var _n0 = author$project$Data$LogInState$getToken(logInState);
					if (!_n0.$) {
						var token = _n0.a;
						return _List_fromArray(
							[
								A2(author$project$Page$Product$commentInputArea, commentSending, token)
							]);
					} else {
						return _List_Nil;
					}
				}(),
				_List_fromArray(
					[
						A2(
						author$project$Page$Component$Comment$view,
						nowMaybe,
						A2(
							elm$core$Maybe$map,
							elm$core$List$map(
								function (comment) {
									return {
										bg: author$project$Data$Product$commentGetBody(comment),
										aS: author$project$Data$Product$commentGetCreatedAt(comment),
										bT: _Utils_eq(
											elm$core$Maybe$Just(
												author$project$Data$User$withNameGetId(
													author$project$Data$Product$commentGetSpeaker(comment))),
											author$project$Data$LogInState$getMyUserId(logInState)),
										aX: _Utils_eq(
											author$project$Data$User$withNameGetId(
												author$project$Data$Product$commentGetSpeaker(comment)),
											sellerId),
										ch: author$project$Data$Product$commentGetSpeaker(comment)
									};
								}),
							commentListMaybe))
					])));
	});
var author$project$Page$Product$createdAtView = F2(
	function (nowMaybe, createdAt) {
		return A2(
			author$project$Page$Style$titleAndContent,
			'出品日時',
			A2(
				elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						elm$html$Html$text(
						A2(author$project$Data$DateTime$toDiffString, nowMaybe, createdAt))
					])));
	});
var author$project$Icon$deleteGarbageCan = function (styleList) {
	return rtfeldman$elm_css$Html$Styled$toUnstyled(
		A2(
			rtfeldman$elm_css$Svg$Styled$svg,
			_List_fromArray(
				[
					rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 24 24'),
					rtfeldman$elm_css$Svg$Styled$Attributes$css(styleList)
				]),
			_List_fromArray(
				[
					A2(
					rtfeldman$elm_css$Svg$Styled$path,
					_List_fromArray(
						[
							rtfeldman$elm_css$Svg$Styled$Attributes$d('M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z')
						]),
					_List_Nil)
				])));
};
var author$project$Page$Product$Delete = F2(
	function (a, b) {
		return {$: 11, a: a, b: b};
	});
var author$project$Page$Product$deleteView = F2(
	function (productId, token) {
		return A2(
			elm$html$Html$button,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('product-deleteButton'),
					elm$html$Html$Events$onClick(
					A2(author$project$Page$Product$Delete, token, productId))
				]),
			_List_fromArray(
				[
					author$project$Icon$deleteGarbageCan(
					_List_fromArray(
						[
							rtfeldman$elm_css$Css$width(
							rtfeldman$elm_css$Css$px(32)),
							rtfeldman$elm_css$Css$height(
							rtfeldman$elm_css$Css$px(32)),
							rtfeldman$elm_css$Css$fill(
							A3(rtfeldman$elm_css$Css$rgb, 238, 238, 238))
						])),
					elm$html$Html$text('削除する')
				]));
	});
var author$project$Icon$edit = function (styleList) {
	return rtfeldman$elm_css$Html$Styled$toUnstyled(
		A2(
			rtfeldman$elm_css$Svg$Styled$svg,
			_List_fromArray(
				[
					rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 24 24'),
					rtfeldman$elm_css$Svg$Styled$Attributes$css(styleList)
				]),
			_List_fromArray(
				[
					A2(
					rtfeldman$elm_css$Svg$Styled$path,
					_List_fromArray(
						[
							rtfeldman$elm_css$Svg$Styled$Attributes$d('M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1c-.1.1-.15.22-.15.36zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z')
						]),
					_List_Nil)
				])));
};
var author$project$Page$Product$EditProduct = {$: 12};
var author$project$Page$Product$editButton = A2(
	elm$html$Html$button,
	_List_fromArray(
		[
			elm$html$Html$Attributes$class('subButton'),
			elm$html$Html$Events$onClick(author$project$Page$Product$EditProduct)
		]),
	_List_fromArray(
		[
			author$project$Icon$edit(
			_List_fromArray(
				[
					rtfeldman$elm_css$Css$width(
					rtfeldman$elm_css$Css$px(32)),
					rtfeldman$elm_css$Css$height(
					rtfeldman$elm_css$Css$px(32))
				])),
			elm$html$Html$text('編集する')
		]));
var author$project$Page$Product$imageView = function (url) {
	return A2(
		elm$html$Html$img,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('product-image'),
				elm$html$Html$Attributes$src(url)
			]),
		_List_Nil);
};
var author$project$Page$Product$productsViewImage = function (urlList) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('product-imageListContainer')
			]),
		_List_fromArray(
			[
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('product-imageList')
					]),
				A2(elm$core$List$map, author$project$Page$Product$imageView, urlList))
			]));
};
var author$project$Page$Product$Like = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var author$project$Page$Product$UnLike = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var author$project$Page$Product$itemLikeBody = function (count) {
	return _List_fromArray(
		[
			elm$html$Html$text('いいね'),
			A2(
			elm$html$Html$span,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('product-like-number')
				]),
			_List_fromArray(
				[
					elm$html$Html$text(
					elm$core$String$fromInt(count))
				]))
		]);
};
var author$project$Page$Product$likeButton = F4(
	function (logInState, sending, likedCount, id) {
		if (sending) {
			return A2(
				elm$html$Html$button,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('product-like'),
						elm$html$Html$Attributes$disabled(true)
					]),
				_List_fromArray(
					[
						rtfeldman$elm_css$Html$Styled$toUnstyled(
						author$project$Icon$loading(
							{
								dQ: A3(rtfeldman$elm_css$Css$rgb, 255, 255, 255),
								eo: 20
							}))
					]));
		} else {
			if (logInState.$ === 2) {
				var likedProductIds = logInState.a.S;
				var token = logInState.a.dz;
				return A2(elm$core$List$member, id, likedProductIds) ? A2(
					elm$html$Html$button,
					_List_fromArray(
						[
							elm$html$Html$Events$onClick(
							A2(author$project$Page$Product$UnLike, token, id)),
							elm$html$Html$Attributes$class('product-liked'),
							elm$html$Html$Attributes$class('product-like')
						]),
					author$project$Page$Product$itemLikeBody(likedCount)) : A2(
					elm$html$Html$button,
					_List_fromArray(
						[
							elm$html$Html$Events$onClick(
							A2(author$project$Page$Product$Like, token, id)),
							elm$html$Html$Attributes$class('product-like')
						]),
					author$project$Page$Product$itemLikeBody(likedCount));
			} else {
				return A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('product-like-label')
						]),
					author$project$Page$Product$itemLikeBody(likedCount));
			}
		}
	});
var author$project$Page$Product$productsViewLike = F4(
	function (logInState, sending, likedCount, id) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('product-like-container')
				]),
			_List_fromArray(
				[
					A4(author$project$Page$Product$likeButton, logInState, sending, likedCount, id)
				]));
	});
var author$project$Page$Product$productsViewName = function (name) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('product-name')
			]),
		_List_fromArray(
			[
				elm$html$Html$text(name)
			]));
};
var author$project$Data$Product$detailGetPrice = function (_n0) {
	var price = _n0.b4;
	return price;
};
var author$project$Page$Product$ToConfirmPage = {$: 8};
var author$project$Page$Product$buyButton = F2(
	function (product, userWithNameMaybe) {
		var _n0 = _Utils_Tuple2(
			author$project$Data$Product$detailGetStatus(product),
			userWithNameMaybe);
		if ((!_n0.a) && (!_n0.b.$)) {
			var _n1 = _n0.a;
			var user = _n0.b.a;
			return _Utils_eq(
				author$project$Data$User$withNameGetId(
					author$project$Data$Product$detailGetSeller(product)),
				author$project$Data$User$withNameGetId(user)) ? elm$core$Maybe$Nothing : elm$core$Maybe$Just(
				A2(
					elm$html$Html$button,
					_List_fromArray(
						[
							elm$html$Html$Events$onClick(author$project$Page$Product$ToConfirmPage)
						]),
					_List_fromArray(
						[
							elm$html$Html$text('購入手続きへ')
						])));
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var author$project$Page$Product$productsViewPriceAndBuyButton = F3(
	function (isWideScreen, product, userWithNameMaybe) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('product-priceAndBuyButton', true),
							_Utils_Tuple2('product-priceAndBuyButton-wide', isWideScreen)
						]))
				]),
			_Utils_ap(
				_List_fromArray(
					[
						A2(
						elm$html$Html$div,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('product-price')
							]),
						_List_fromArray(
							[
								elm$html$Html$text(
								author$project$Data$Product$priceToString(
									author$project$Data$Product$detailGetPrice(product)))
							]))
					]),
				function () {
					var _n0 = A2(author$project$Page$Product$buyButton, product, userWithNameMaybe);
					if (!_n0.$) {
						var button = _n0.a;
						return _List_fromArray(
							[button]);
					} else {
						return _List_Nil;
					}
				}()));
	});
var author$project$Page$Product$sellerNameView = function (user) {
	return A2(
		author$project$Page$Style$titleAndContent,
		'出品者',
		A2(
			elm$html$Html$a,
			_List_fromArray(
				[
					elm$html$Html$Attributes$href(
					author$project$PageLocation$toUrlAsString(
						author$project$PageLocation$User(
							author$project$Data$User$withNameGetId(user)))),
					A2(elm$html$Html$Attributes$style, 'display', 'flex'),
					A2(elm$html$Html$Attributes$style, 'align-items', 'center'),
					A2(elm$html$Html$Attributes$style, 'text-decoration', 'none')
				]),
			_List_fromArray(
				[
					A2(
					author$project$Page$Style$userImage,
					48,
					author$project$Data$User$withNameGetImageId(user)),
					elm$html$Html$text(
					author$project$Data$User$withNameGetDisplayName(user))
				])));
};
var author$project$Data$Product$statusToJapaneseString = function (status) {
	switch (status) {
		case 0:
			return '出品中';
		case 1:
			return '取引中';
		default:
			return '売却済み';
	}
};
var author$project$Page$Product$statusView = function (status) {
	return A2(
		author$project$Page$Style$titleAndContent,
		'取引状態',
		A2(
			elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					elm$html$Html$text(
					author$project$Data$Product$statusToJapaneseString(status))
				])));
};
var author$project$Page$Product$normalView = F4(
	function (logInState, isWideScreen, nowMaybe, _n0) {
		var product = _n0.de;
		var likeSending = _n0.D;
		var commentSending = _n0.L;
		return {
			bI: elm$core$Maybe$Nothing,
			bQ: _List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('container')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('product')
								]),
							_Utils_ap(
								_List_fromArray(
									[
										author$project$Page$Product$productsViewImage(
										author$project$Data$Product$detailGetImageUrls(product)),
										author$project$Page$Product$productsViewName(
										author$project$Data$Product$detailGetName(product)),
										A4(
										author$project$Page$Product$productsViewLike,
										logInState,
										likeSending,
										author$project$Data$Product$detailGetLikedCount(product),
										author$project$Data$Product$detailGetId(product)),
										author$project$Page$Product$statusView(
										author$project$Data$Product$detailGetStatus(product)),
										author$project$Page$Product$sellerNameView(
										author$project$Data$Product$detailGetSeller(product)),
										author$project$Page$Product$descriptionView(
										author$project$Data$Product$detailGetDescription(product)),
										author$project$Page$Product$categoryView(
										author$project$Data$Product$detailGetCategory(product)),
										author$project$Page$Product$conditionView(
										author$project$Data$Product$detailGetCondition(product)),
										A2(
										author$project$Page$Product$createdAtView,
										nowMaybe,
										author$project$Data$Product$detailGetCreatedAt(product)),
										A5(
										author$project$Page$Product$commentListView,
										commentSending,
										nowMaybe,
										author$project$Data$User$withNameGetId(
											author$project$Data$Product$detailGetSeller(product)),
										logInState,
										author$project$Data$Product$detailGetCommentList(product))
									]),
								function () {
									if (logInState.$ === 2) {
										var token = logInState.a.dz;
										var userWithName = logInState.a.dF;
										return _Utils_eq(
											author$project$Data$User$withNameGetId(userWithName),
											author$project$Data$User$withNameGetId(
												author$project$Data$Product$detailGetSeller(product))) ? _List_fromArray(
											[
												author$project$Page$Product$editButton,
												A2(
												author$project$Page$Product$deleteView,
												author$project$Data$Product$detailGetId(product),
												token)
											]) : _List_Nil;
									} else {
										return _List_Nil;
									}
								}())),
							A3(
							author$project$Page$Product$productsViewPriceAndBuyButton,
							isWideScreen,
							product,
							function () {
								if (logInState.$ === 2) {
									var userWithName = logInState.a.dF;
									return elm$core$Maybe$Just(userWithName);
								} else {
									return elm$core$Maybe$Nothing;
								}
							}())
						]))
				]),
			ce: author$project$BasicParts$tabNone,
			bD: elm$core$Maybe$Just(
				author$project$Data$Product$detailGetName(product))
		};
	});
var author$project$Page$Product$TradeStart = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var author$project$Page$Product$tradeStartButton = F2(
	function (logInState, productId) {
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
								elm$html$Html$Attributes$class('mainButton')
							]),
						function () {
							var _n0 = author$project$Data$LogInState$getToken(logInState);
							if (!_n0.$) {
								var accessToken = _n0.a;
								return _List_fromArray(
									[
										elm$html$Html$Events$onClick(
										A2(author$project$Page$Product$TradeStart, accessToken, productId))
									]);
							} else {
								return _List_fromArray(
									[
										elm$html$Html$Attributes$class('mainButton-disabled')
									]);
							}
						}()),
					_List_fromArray(
						[
							elm$html$Html$text('取引を開始する')
						]))
				]));
	});
var author$project$Page$Product$view = F4(
	function (logInState, isWideScreen, nowMaybe, model) {
		switch (model.$) {
			case 0:
				return {
					bI: elm$core$Maybe$Nothing,
					bQ: _List_fromArray(
						[
							elm$html$Html$text('読み込み中'),
							rtfeldman$elm_css$Html$Styled$toUnstyled(
							author$project$Icon$loading(
								{
									dQ: A3(rtfeldman$elm_css$Css$rgb, 0, 0, 0),
									eo: 48
								}))
						]),
					ce: author$project$BasicParts$tabNone,
					bD: elm$core$Maybe$Just('商品詳細ページ 読み込み中')
				};
			case 1:
				var product = model.a;
				return {
					bI: elm$core$Maybe$Nothing,
					bQ: _List_fromArray(
						[
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('container')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$div,
									_List_fromArray(
										[
											elm$html$Html$Attributes$class('product')
										]),
									_List_fromArray(
										[
											elm$html$Html$text('最新の情報を取得中…'),
											rtfeldman$elm_css$Html$Styled$toUnstyled(
											author$project$Icon$loading(
												{
													dQ: A3(rtfeldman$elm_css$Css$rgb, 0, 0, 0),
													eo: 32
												})),
											author$project$Page$Product$productsViewImage(
											_List_fromArray(
												[
													author$project$Data$Product$getThumbnailImageUrl(product)
												])),
											author$project$Page$Product$productsViewName(
											author$project$Data$Product$getName(product)),
											A4(
											author$project$Page$Product$productsViewLike,
											author$project$Data$LogInState$None,
											false,
											author$project$Data$Product$getLikedCount(product),
											author$project$Data$Product$getId(product))
										]))
								]))
						]),
					ce: author$project$BasicParts$tabNone,
					bD: elm$core$Maybe$Just(
						author$project$Data$Product$getName(product))
				};
			case 2:
				var rec = model.a;
				return A4(
					author$project$Page$Product$normalView,
					logInState,
					isWideScreen,
					nowMaybe,
					{L: rec.L, D: rec.D, de: rec.de});
			case 3:
				var productEditor = model.a.b5;
				var beforeProduct = model.a.aQ;
				return {
					bI: elm$core$Maybe$Nothing,
					bQ: _List_fromArray(
						[
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('container')
								]),
							_List_fromArray(
								[
									A3(
									elm$html$Html$Keyed$node,
									'div',
									_List_fromArray(
										[
											elm$html$Html$Attributes$class('product')
										]),
									function () {
										var _n1 = author$project$Data$LogInState$getToken(logInState);
										if (!_n1.$) {
											var accessToken = _n1.a;
											return _Utils_ap(
												A2(
													elm$core$List$map,
													elm$core$Tuple$mapSecond(
														elm$html$Html$map(author$project$Page$Product$MsgByProductEditor)),
													author$project$Page$Component$ProductEditor$view(productEditor)),
												_List_fromArray(
													[
														_Utils_Tuple2(
														'okButton',
														A3(
															author$project$Page$Product$editOkCancelButton,
															accessToken,
															author$project$Data$Product$detailGetId(beforeProduct),
															author$project$Page$Component$ProductEditor$toUpdateRequest(productEditor)))
													]));
										} else {
											return _List_fromArray(
												[
													_Utils_Tuple2(
													'needLogIn',
													elm$html$Html$text('ログインしていないときに商品の編集はできません'))
												]);
										}
									}())
								]))
						]),
					ce: author$project$BasicParts$tabNone,
					bD: elm$core$Maybe$Just(
						author$project$Data$Product$detailGetName(beforeProduct))
				};
			default:
				var product = model.a.de;
				return {
					bI: elm$core$Maybe$Nothing,
					bQ: _List_fromArray(
						[
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('container')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$div,
									_List_fromArray(
										[
											elm$html$Html$Attributes$class('product')
										]),
									_List_fromArray(
										[
											elm$html$Html$text('購入確認画面。この商品の取引を開始しますか?'),
											author$project$Page$Product$productsViewImage(
											author$project$Data$Product$detailGetImageUrls(product)),
											author$project$Page$Product$productsViewName(
											author$project$Data$Product$detailGetName(product)),
											author$project$Page$Product$descriptionView(
											author$project$Data$Product$detailGetDescription(product)),
											author$project$Page$Product$conditionView(
											author$project$Data$Product$detailGetCondition(product)),
											A2(
											author$project$Page$Product$tradeStartButton,
											logInState,
											author$project$Data$Product$detailGetId(product))
										]))
								]))
						]),
					ce: author$project$BasicParts$tabNone,
					bD: elm$core$Maybe$Just(
						author$project$Data$Product$detailGetName(product))
				};
		}
	});
var author$project$Page$Search$view = function (model) {
	return {
		bI: elm$core$Maybe$Just(1),
		bQ: _List_fromArray(
			[
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('container')
					]),
				_List_fromArray(
					[
						elm$html$Html$text('検索')
					]))
			]),
		ce: author$project$BasicParts$tabNone,
		bD: elm$core$Maybe$Just('検索')
	};
};
var author$project$Page$Component$University$Left = 0;
var author$project$Page$Component$University$Right = 1;
var author$project$Data$University$graduateToJapaneseString = function (gradate) {
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
var author$project$Page$Component$University$SelectGraduate = function (a) {
	return {$: 4, a: a};
};
var author$project$Page$Component$University$graduateSelectView = function (graduateMaybe) {
	return _Utils_Tuple2(
		'selectGraduate',
		A2(
			rtfeldman$elm_css$Html$Styled$map,
			author$project$Page$Component$University$SelectGraduate,
			A3(
				author$project$Page$Style$formItem,
				'研究科',
				author$project$Page$Component$University$graduateSelectId,
				_List_fromArray(
					[
						A2(
						author$project$Page$Style$select,
						author$project$Page$Component$University$graduateSelectId,
						A2(elm$core$List$map, author$project$Data$University$graduateToJapaneseString, author$project$Data$University$graduateAllValue))
					]))));
};
var author$project$Page$Component$University$SwitchGraduateNoTsukuba = {$: 3};
var author$project$Page$Component$University$SwitchGraduateTsukuba = {$: 2};
var author$project$Page$Component$University$radioInputStyle = rtfeldman$elm_css$Css$batch(
	_List_fromArray(
		[
			rtfeldman$elm_css$Css$width(rtfeldman$elm_css$Css$zero),
			rtfeldman$elm_css$Css$height(rtfeldman$elm_css$Css$zero)
		]));
var rtfeldman$elm_css$Css$textAlign = function (fn) {
	return A3(
		rtfeldman$elm_css$Css$Internal$getOverloadedProperty,
		'textAlign',
		'text-align',
		fn(rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty));
};
var author$project$Page$Component$University$radioLabelStyle = function (select) {
	return rtfeldman$elm_css$Css$batch(
		_Utils_ap(
			_List_fromArray(
				[
					rtfeldman$elm_css$Css$backgroundColor(
					select ? author$project$Page$Style$primaryColor : A3(rtfeldman$elm_css$Css$rgb, 153, 153, 153)),
					rtfeldman$elm_css$Css$padding(
					rtfeldman$elm_css$Css$px(8)),
					rtfeldman$elm_css$Css$textAlign(rtfeldman$elm_css$Css$center),
					rtfeldman$elm_css$Css$cursor(rtfeldman$elm_css$Css$pointer),
					A2(rtfeldman$elm_css$Css$border2, rtfeldman$elm_css$Css$zero, rtfeldman$elm_css$Css$none),
					A4(
					rtfeldman$elm_css$Css$boxShadow4,
					rtfeldman$elm_css$Css$zero,
					rtfeldman$elm_css$Css$px(2),
					rtfeldman$elm_css$Css$px(4),
					A4(rtfeldman$elm_css$Css$rgba, 0, 0, 0, 0.18)),
					rtfeldman$elm_css$Css$color(
					select ? A3(rtfeldman$elm_css$Css$rgb, 255, 255, 255) : A3(rtfeldman$elm_css$Css$rgb, 0, 0, 0))
				]),
			select ? _List_Nil : _List_fromArray(
				[
					rtfeldman$elm_css$Css$hover(
					_List_fromArray(
						[
							rtfeldman$elm_css$Css$backgroundColor(
							A3(rtfeldman$elm_css$Css$rgb, 187, 187, 187))
						]))
				])));
};
var rtfeldman$elm_css$Css$borderRadius4 = rtfeldman$elm_css$Css$prop4('border-radius');
var rtfeldman$elm_css$Html$Styled$Attributes$checked = rtfeldman$elm_css$Html$Styled$Attributes$boolProperty('checked');
var rtfeldman$elm_css$Html$Styled$Attributes$name = rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('name');
var author$project$Page$Component$University$radioForm = function (_n0) {
	var select = _n0.ca;
	var leftText = _n0.bV;
	var rightText = _n0.b8;
	var name = _n0.a;
	return A2(
		rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				rtfeldman$elm_css$Html$Styled$Attributes$css(
				_List_fromArray(
					[
						rtfeldman$elm_css$Css$width(
						rtfeldman$elm_css$Css$pct(100)),
						rtfeldman$elm_css$Css$padding(
						rtfeldman$elm_css$Css$px(8)),
						author$project$Page$Style$displayGridAndGap(0),
						A2(rtfeldman$elm_css$Css$property, 'grid-template-columns', '1fr 1fr'),
						rtfeldman$elm_css$Css$boxSizing(rtfeldman$elm_css$Css$borderBox)
					]))
			]),
		_List_fromArray(
			[
				A2(
				rtfeldman$elm_css$Html$Styled$input,
				_List_fromArray(
					[
						rtfeldman$elm_css$Html$Styled$Attributes$type_('radio'),
						rtfeldman$elm_css$Html$Styled$Attributes$name(name),
						rtfeldman$elm_css$Html$Styled$Attributes$id(name + 'Left'),
						rtfeldman$elm_css$Html$Styled$Attributes$css(
						_List_fromArray(
							[author$project$Page$Component$University$radioInputStyle])),
						A2(
						rtfeldman$elm_css$Html$Styled$Events$on,
						'change',
						elm$json$Json$Decode$succeed(0)),
						rtfeldman$elm_css$Html$Styled$Attributes$checked(!select)
					]),
				_List_Nil),
				A2(
				rtfeldman$elm_css$Html$Styled$label,
				_List_fromArray(
					[
						rtfeldman$elm_css$Html$Styled$Attributes$for(name + 'Left'),
						rtfeldman$elm_css$Html$Styled$Attributes$css(
						_List_fromArray(
							[
								author$project$Page$Component$University$radioLabelStyle(!select),
								A4(
								rtfeldman$elm_css$Css$borderRadius4,
								rtfeldman$elm_css$Css$px(8),
								rtfeldman$elm_css$Css$zero,
								rtfeldman$elm_css$Css$zero,
								rtfeldman$elm_css$Css$px(8)),
								A2(rtfeldman$elm_css$Css$property, 'grid-column', '1 / 2'),
								A2(rtfeldman$elm_css$Css$property, 'grid-row', '1 / 2')
							]))
					]),
				_List_fromArray(
					[
						rtfeldman$elm_css$Html$Styled$text(leftText)
					])),
				A2(
				rtfeldman$elm_css$Html$Styled$input,
				_List_fromArray(
					[
						rtfeldman$elm_css$Html$Styled$Attributes$type_('radio'),
						rtfeldman$elm_css$Html$Styled$Attributes$name(name),
						rtfeldman$elm_css$Html$Styled$Attributes$id(name + 'Right'),
						rtfeldman$elm_css$Html$Styled$Attributes$css(
						_List_fromArray(
							[author$project$Page$Component$University$radioInputStyle])),
						A2(
						rtfeldman$elm_css$Html$Styled$Events$on,
						'change',
						elm$json$Json$Decode$succeed(1)),
						rtfeldman$elm_css$Html$Styled$Attributes$checked(select === 1)
					]),
				_List_Nil),
				A2(
				rtfeldman$elm_css$Html$Styled$label,
				_List_fromArray(
					[
						rtfeldman$elm_css$Html$Styled$Attributes$for(name + 'Right'),
						rtfeldman$elm_css$Html$Styled$Attributes$css(
						_List_fromArray(
							[
								author$project$Page$Component$University$radioLabelStyle(select === 1),
								A4(
								rtfeldman$elm_css$Css$borderRadius4,
								rtfeldman$elm_css$Css$zero,
								rtfeldman$elm_css$Css$px(8),
								rtfeldman$elm_css$Css$px(8),
								rtfeldman$elm_css$Css$zero),
								A2(rtfeldman$elm_css$Css$property, 'grid-column', '2 / 3'),
								A2(rtfeldman$elm_css$Css$property, 'grid-row', '1 / 2')
							]))
					]),
				_List_fromArray(
					[
						rtfeldman$elm_css$Html$Styled$text(rightText)
					]))
			]));
};
var author$project$Page$Style$titleAndContentStyle = F2(
	function (title, content) {
		return A2(
			rtfeldman$elm_css$Html$Styled$div,
			_List_fromArray(
				[
					rtfeldman$elm_css$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							author$project$Page$Style$displayGridAndGap(4)
						]))
				]),
			_List_fromArray(
				[
					A2(
					rtfeldman$elm_css$Html$Styled$div,
					_List_fromArray(
						[
							rtfeldman$elm_css$Html$Styled$Attributes$css(
							_List_fromArray(
								[author$project$Page$Style$labelStyle]))
						]),
					_List_fromArray(
						[
							rtfeldman$elm_css$Html$Styled$text(title)
						])),
					content
				]));
	});
var author$project$Page$Component$University$graduateYesNoTsukubaView = function (select) {
	return _Utils_Tuple2(
		'tsukubaUniversitySchoolOrNo',
		A2(
			author$project$Page$Style$titleAndContentStyle,
			'院進前の所属',
			A2(
				rtfeldman$elm_css$Html$Styled$map,
				function (msg) {
					if (!msg) {
						return author$project$Page$Component$University$SwitchGraduateTsukuba;
					} else {
						return author$project$Page$Component$University$SwitchGraduateNoTsukuba;
					}
				},
				author$project$Page$Component$University$radioForm(
					{bV: '筑波大学に所属していた', a: 'graduateYesNoTsukuba', b8: '筑波大学に所属していなかった', ca: select}))));
};
var author$project$Page$Component$University$graduateNoTsukubaView = function (graduateSelect) {
	return _List_fromArray(
		[
			author$project$Page$Component$University$graduateSelectView(graduateSelect),
			author$project$Page$Component$University$graduateYesNoTsukubaView(1)
		]);
};
var author$project$Data$University$departmentToJapaneseString = function (schoolAndDepartment) {
	switch (schoolAndDepartment) {
		case 0:
			return elm$core$Maybe$Just('人文学類');
		case 1:
			return elm$core$Maybe$Just('比較文化学類');
		case 2:
			return elm$core$Maybe$Just('日本語・日本文化学類');
		case 3:
			return elm$core$Maybe$Just('社会学類');
		case 4:
			return elm$core$Maybe$Just('国際総合学類');
		case 5:
			return elm$core$Maybe$Just('教育学類');
		case 6:
			return elm$core$Maybe$Just('心理学類');
		case 7:
			return elm$core$Maybe$Just('障害科学類');
		case 8:
			return elm$core$Maybe$Just('生物学類');
		case 9:
			return elm$core$Maybe$Just('生物資源学類');
		case 10:
			return elm$core$Maybe$Just('地球学類');
		case 11:
			return elm$core$Maybe$Just('数学類');
		case 12:
			return elm$core$Maybe$Just('物理学類');
		case 13:
			return elm$core$Maybe$Just('化学類');
		case 14:
			return elm$core$Maybe$Just('応用理工学類');
		case 15:
			return elm$core$Maybe$Just('工学システム学類');
		case 16:
			return elm$core$Maybe$Just('社会工学類');
		case 17:
			return elm$core$Maybe$Just('情報科学類');
		case 18:
			return elm$core$Maybe$Just('情報メディア創成学類');
		case 19:
			return elm$core$Maybe$Just('知識情報・図書館科学類');
		case 20:
			return elm$core$Maybe$Just('医学類');
		case 21:
			return elm$core$Maybe$Just('看護学類');
		case 22:
			return elm$core$Maybe$Just('医療科学類');
		case 23:
			return elm$core$Maybe$Nothing;
		default:
			return elm$core$Maybe$Nothing;
	}
};
var author$project$Data$University$schoolToIdString = function (school) {
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
var author$project$Page$Component$University$SelectDepartment = function (a) {
	return {$: 6, a: a};
};
var author$project$Page$Component$University$selectDepartmentView = F2(
	function (school, departmentMaybe) {
		return _Utils_Tuple2(
			'selectDepartment-' + author$project$Data$University$schoolToIdString(school),
			A2(
				rtfeldman$elm_css$Html$Styled$map,
				author$project$Page$Component$University$SelectDepartment,
				A3(
					author$project$Page$Style$formItem,
					'学類',
					author$project$Page$Component$University$departmentSelectId,
					_List_fromArray(
						[
							A2(
							author$project$Page$Style$select,
							author$project$Page$Component$University$departmentSelectId,
							A2(
								elm$core$List$map,
								A2(
									elm$core$Basics$composeR,
									author$project$Data$University$departmentToJapaneseString,
									elm$core$Maybe$withDefault('?')),
								author$project$Data$University$schoolToDepartmentList(school)))
						]))));
	});
var author$project$Data$University$schoolToJapaneseString = function (school) {
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
var author$project$Page$Component$University$SelectSchool = function (a) {
	return {$: 5, a: a};
};
var author$project$Page$Component$University$selectSchoolView = function (schoolMaybe) {
	return _Utils_Tuple2(
		'schoolSelect',
		A2(
			rtfeldman$elm_css$Html$Styled$map,
			author$project$Page$Component$University$SelectSchool,
			A3(
				author$project$Page$Style$formItem,
				'学群',
				author$project$Page$Component$University$schoolSelectId,
				_List_fromArray(
					[
						A2(
						author$project$Page$Style$select,
						author$project$Page$Component$University$schoolSelectId,
						A2(elm$core$List$map, author$project$Data$University$schoolToJapaneseString, author$project$Data$University$schoolAll))
					]))));
};
var author$project$Page$Component$University$schoolView = function (schoolSelect) {
	switch (schoolSelect.$) {
		case 0:
			return _List_fromArray(
				[
					author$project$Page$Component$University$selectSchoolView(elm$core$Maybe$Nothing)
				]);
		case 1:
			var school = schoolSelect.a;
			return _List_fromArray(
				[
					author$project$Page$Component$University$selectSchoolView(
					elm$core$Maybe$Just(school)),
					A2(author$project$Page$Component$University$selectDepartmentView, school, elm$core$Maybe$Nothing)
				]);
		default:
			var department = schoolSelect.a;
			return _List_fromArray(
				[
					author$project$Page$Component$University$selectSchoolView(
					elm$core$Maybe$Just(
						author$project$Data$University$schoolFromDepartment(department))),
					A2(
					author$project$Page$Component$University$selectDepartmentView,
					author$project$Data$University$schoolFromDepartment(department),
					elm$core$Maybe$Just(department))
				]);
	}
};
var author$project$Page$Component$University$graduateTsukubaView = F2(
	function (graduateSelect, schoolSelect) {
		return _Utils_ap(
			_List_fromArray(
				[
					author$project$Page$Component$University$graduateSelectView(graduateSelect),
					author$project$Page$Component$University$graduateYesNoTsukubaView(0)
				]),
			author$project$Page$Component$University$schoolView(schoolSelect));
	});
var author$project$Page$Component$University$SwitchGraduate = {$: 0};
var author$project$Page$Component$University$SwitchSchool = {$: 1};
var author$project$Page$Component$University$schoolOrGraduateView = function (select) {
	return _Utils_Tuple2(
		'schoolOrGraduate',
		A2(
			author$project$Page$Style$titleAndContentStyle,
			'所属',
			A2(
				rtfeldman$elm_css$Html$Styled$map,
				function (msg) {
					if (!msg) {
						return author$project$Page$Component$University$SwitchSchool;
					} else {
						return author$project$Page$Component$University$SwitchGraduate;
					}
				},
				author$project$Page$Component$University$radioForm(
					{bV: '学群生', a: 'schoolOrGraduate', b8: '院生', ca: select}))));
};
var author$project$Page$Component$University$view = function (model) {
	switch (model.$) {
		case 0:
			var schoolSelect = model.a;
			return A2(
				elm$core$List$cons,
				author$project$Page$Component$University$schoolOrGraduateView(0),
				author$project$Page$Component$University$schoolView(schoolSelect));
		case 1:
			var graduate = model.a.bP;
			var school = model.a.b9;
			return A2(
				elm$core$List$cons,
				author$project$Page$Component$University$schoolOrGraduateView(1),
				A2(author$project$Page$Component$University$graduateTsukubaView, graduate, school));
		default:
			var graduate = model.a;
			return A2(
				elm$core$List$cons,
				author$project$Page$Component$University$schoolOrGraduateView(1),
				author$project$Page$Component$University$graduateNoTsukubaView(graduate));
	}
};
var author$project$Page$SignUp$MsgByUniversity = function (a) {
	return {$: 3, a: a};
};
var author$project$Page$SignUp$InputDisplayName = function (a) {
	return {$: 4, a: a};
};
var elm$html$Html$input = _VirtualDom_node('input');
var elm$html$Html$label = _VirtualDom_node('label');
var elm$html$Html$Attributes$attribute = elm$virtual_dom$VirtualDom$attribute;
var elm$html$Html$Attributes$for = elm$html$Html$Attributes$stringProperty('htmlFor');
var author$project$Page$SignUp$displayNameForm = function (nickName) {
	return _List_fromArray(
		[
			_Utils_Tuple2(
			'nickNameForm',
			A2(
				elm$html$Html$div,
				_List_Nil,
				_Utils_ap(
					_List_fromArray(
						[
							A2(
							elm$html$Html$label,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('form-label'),
									elm$html$Html$Attributes$for(author$project$Page$SignUp$displayNameFormId)
								]),
							_List_fromArray(
								[
									elm$html$Html$text('表示名')
								])),
							A2(
							elm$html$Html$input,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('form-input'),
									elm$html$Html$Attributes$id(author$project$Page$SignUp$displayNameFormId),
									A2(elm$html$Html$Attributes$attribute, 'autocomplete', 'nickname'),
									elm$html$Html$Events$onInput(author$project$Page$SignUp$InputDisplayName)
								]),
							_List_Nil)
						]),
					(elm$core$String$length(nickName) < 1) ? _List_fromArray(
						[
							elm$html$Html$text('表示名は 1文字以上である必要があります')
						]) : ((50 < elm$core$String$length(nickName)) ? _List_fromArray(
						[
							elm$html$Html$text('表示名は 50文字以内である必要があります')
						]) : _List_Nil))))
		]);
};
var author$project$Page$Component$University$getUniversity = function (universitySelect) {
	_n0$3:
	while (true) {
		switch (universitySelect.$) {
			case 0:
				if (universitySelect.a.$ === 2) {
					var schoolAndDepartment = universitySelect.a.a;
					return elm$core$Maybe$Just(
						author$project$Data$University$NotGraduate(schoolAndDepartment));
				} else {
					break _n0$3;
				}
			case 1:
				var graduate = universitySelect.a.bP;
				var school = universitySelect.a.b9;
				var _n1 = _Utils_Tuple2(graduate, school);
				if ((!_n1.a.$) && (_n1.b.$ === 2)) {
					var g = _n1.a.a;
					var s = _n1.b.a;
					return elm$core$Maybe$Just(
						A2(author$project$Data$University$GraduateTsukuba, g, s));
				} else {
					return elm$core$Maybe$Nothing;
				}
			default:
				if (!universitySelect.a.$) {
					var graduate = universitySelect.a.a;
					return elm$core$Maybe$Just(
						author$project$Data$University$GraduateNoTsukuba(graduate));
				} else {
					break _n0$3;
				}
		}
	}
	return elm$core$Maybe$Nothing;
};
var author$project$Data$StudentId$digitToChar = function (i) {
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
var author$project$Data$StudentId$toString = function (_n0) {
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
			author$project$Data$StudentId$digitToChar,
			_List_fromArray(
				[i0, i1, i2, i3, i4, i5, i6])));
};
var author$project$Data$SAddress$toEmailAddressString = function (_n0) {
	var studentId = _n0.a;
	var subDomain = _n0.b;
	return 's' + (author$project$Data$StudentId$toString(studentId) + ('@' + (subDomain + '.tsukuba.ac.jp')));
};
var author$project$Data$EmailAddress$fromSAddress = function (sAddress) {
	return author$project$Data$SAddress$toEmailAddressString(sAddress);
};
var author$project$Data$SAddress$fromStudentId = function (studentId) {
	return A2(author$project$Data$SAddress$SAddress, studentId, 's');
};
var author$project$Page$SignUp$analysisStudentIdOrSAddressResultToEmailAddress = function (sAddressOrStudentId) {
	switch (sAddressOrStudentId.$) {
		case 1:
			var studentId = sAddressOrStudentId.a;
			return elm$core$Maybe$Just(
				author$project$Data$EmailAddress$fromSAddress(
					author$project$Data$SAddress$fromStudentId(studentId)));
		case 2:
			var sAddress = sAddressOrStudentId.a;
			return elm$core$Maybe$Just(
				author$project$Data$EmailAddress$fromSAddress(sAddress));
		case 0:
			return elm$core$Maybe$Nothing;
		case 3:
			return elm$core$Maybe$Nothing;
		default:
			var emailAddress = sAddressOrStudentId.a;
			return elm$core$Maybe$Just(emailAddress);
	}
};
var author$project$Page$SignUp$getSendEmailRequest = F5(
	function (studentIdOrSAddress, university, nickName, image, sendEmailToken) {
		var _n0 = _Utils_Tuple2(
			author$project$Page$SignUp$analysisStudentIdOrSAddressResultToEmailAddress(studentIdOrSAddress),
			author$project$Page$Component$University$getUniversity(university));
		if ((!_n0.a.$) && (!_n0.b.$)) {
			var emailAddress = _n0.a.a;
			var universityData = _n0.b.a;
			return ((1 <= elm$core$String$length(nickName)) && (elm$core$String$length(nickName) <= 50)) ? elm$core$Maybe$Just(
				{
					Y: nickName,
					cJ: emailAddress,
					bn: function () {
						if (!image.$) {
							return elm$core$Maybe$Nothing;
						} else {
							var dataUrl = image.a;
							return elm$core$Maybe$Just(dataUrl);
						}
					}(),
					$7: sendEmailToken,
					bb: universityData
				}) : elm$core$Maybe$Nothing;
		} else {
			return elm$core$Maybe$Nothing;
		}
	});
var elm$html$Html$Attributes$accept = elm$html$Html$Attributes$stringProperty('accept');
var elm$html$Html$Attributes$multiple = elm$html$Html$Attributes$boolProperty('multiple');
var elm$html$Html$Attributes$type_ = elm$html$Html$Attributes$stringProperty('type');
var author$project$Page$SignUp$imageForm = function (image) {
	return _List_fromArray(
		[
			_Utils_Tuple2(
			'imageForm',
			A2(
				elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						elm$html$Html$label,
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('exhibition-photo-add'),
								elm$html$Html$Attributes$id(author$project$Page$SignUp$imageLabelId),
								elm$html$Html$Attributes$for(author$project$Page$SignUp$imageInputId)
							]),
						_List_fromArray(
							[
								A2(
								elm$html$Html$img,
								_List_fromArray(
									[
										A2(elm$html$Html$Attributes$style, 'width', '50%'),
										A2(elm$html$Html$Attributes$style, 'border-radius', '50%'),
										elm$html$Html$Attributes$src(
										function () {
											if (!image.$) {
												var url = image.a;
												return author$project$Data$ImageId$toUrlString(url);
											} else {
												var dataUrl = image.a;
												return dataUrl;
											}
										}())
									]),
								_List_Nil)
							])),
						A2(
						elm$html$Html$input,
						_List_fromArray(
							[
								A2(elm$html$Html$Attributes$style, 'display', 'none'),
								elm$html$Html$Attributes$id(author$project$Page$SignUp$imageInputId),
								elm$html$Html$Attributes$type_('file'),
								elm$html$Html$Attributes$multiple(false),
								elm$html$Html$Attributes$accept('image/*')
							]),
						_List_Nil)
					])))
		]);
};
var author$project$Page$SignUp$SignUp = function (a) {
	return {$: 5, a: a};
};
var author$project$Page$SignUp$signUpSubmitButton = function (signUpRequestMaybe) {
	return A2(
		elm$html$Html$div,
		_List_Nil,
		_Utils_ap(
			function () {
				if (!signUpRequestMaybe.$) {
					var signUpRequest = signUpRequestMaybe.a;
					return _List_fromArray(
						[
							elm$html$Html$text(
							author$project$Data$EmailAddress$toString(signUpRequest.cJ) + 'に認証メールを送信します')
						]);
				} else {
					return _List_Nil;
				}
			}(),
			_List_fromArray(
				[
					A2(
					elm$html$Html$button,
					_Utils_ap(
						_List_fromArray(
							[
								elm$html$Html$Attributes$classList(
								_List_fromArray(
									[
										_Utils_Tuple2('mainButton', true),
										_Utils_Tuple2(
										'mainButton-disabled',
										_Utils_eq(signUpRequestMaybe, elm$core$Maybe$Nothing))
									])),
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
												author$project$Page$SignUp$SignUp(signUpRequest),
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
				])));
};
var author$project$Data$StudentId$listGrow = F2(
	function (length, list) {
		var listLength = elm$core$List$length(list);
		return (_Utils_cmp(length, listLength) < 0) ? A2(
			elm$core$List$map,
			elm$core$Maybe$Just,
			A2(elm$core$List$take, length, list)) : _Utils_ap(
			A2(elm$core$List$map, elm$core$Maybe$Just, list),
			A2(elm$core$List$repeat, length - listLength, elm$core$Maybe$Nothing));
	});
var author$project$Data$StudentId$partStudentIdToString = function (partStudentId) {
	return elm$core$String$fromList(
		A2(
			elm$core$List$map,
			function (numMaybe) {
				return A2(
					elm$core$Maybe$withDefault,
					'?',
					A2(elm$core$Maybe$map, author$project$Data$StudentId$digitToChar, numMaybe));
			},
			A2(
				author$project$Data$StudentId$listGrow,
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
var author$project$Data$StudentId$partStudentIdToStringWith20 = function (partStudentId) {
	return '20' + author$project$Data$StudentId$partStudentIdToString(partStudentId);
};
var author$project$Data$StudentId$toStringWith20 = function (studentId) {
	return '20' + author$project$Data$StudentId$toString(studentId);
};
var author$project$Page$SignUp$InputStudentIdOrEmailAddress = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$SignUp$studentHasSAddressFormList = function (analysisStudentIdOrEmailAddressResult) {
	return _List_fromArray(
		[
			_Utils_Tuple2(
			'sAddressFrom',
			A2(
				elm$html$Html$div,
				_List_Nil,
				_Utils_ap(
					_List_fromArray(
						[
							A2(
							elm$html$Html$label,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('form-label'),
									elm$html$Html$Attributes$for('signUpStudentIdOrTsukubaEmail')
								]),
							_List_fromArray(
								[
									elm$html$Html$text('学籍番号')
								])),
							A2(
							elm$html$Html$input,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('form-input'),
									elm$html$Html$Attributes$id('signUpStudentIdOrTsukubaEmail'),
									A2(elm$html$Html$Attributes$attribute, 'autocomplete', 'username'),
									elm$html$Html$Events$onInput(author$project$Page$SignUp$InputStudentIdOrEmailAddress)
								]),
							_List_Nil)
						]),
					function () {
						switch (analysisStudentIdOrEmailAddressResult.$) {
							case 0:
								return _List_fromArray(
									[
										A2(
										elm$html$Html$div,
										_List_Nil,
										_List_fromArray(
											[
												elm$html$Html$text('学籍番号は20から始まる9桁の数字、筑波大学のメールアドレスはs1234567@s.tsukuba.ac.jpのような形のメールアドレス')
											]))
									]);
							case 1:
								var studentId = analysisStudentIdOrEmailAddressResult.a;
								return _List_fromArray(
									[
										A2(
										elm$html$Html$div,
										_List_Nil,
										_List_fromArray(
											[
												elm$html$Html$text(
												'学籍番号 ' + author$project$Data$StudentId$toStringWith20(studentId))
											])),
										A2(
										elm$html$Html$div,
										_List_Nil,
										_List_fromArray(
											[
												elm$html$Html$text(
												author$project$Data$EmailAddress$toString(
													author$project$Data$EmailAddress$fromSAddress(
														author$project$Data$SAddress$fromStudentId(studentId))) + 'にメールを送信します')
											]))
									]);
							case 3:
								var partStudentId = analysisStudentIdOrEmailAddressResult.a;
								return _List_fromArray(
									[
										A2(
										elm$html$Html$div,
										_List_Nil,
										_List_fromArray(
											[
												elm$html$Html$text(
												'学籍番号 ' + author$project$Data$StudentId$partStudentIdToStringWith20(partStudentId))
											]))
									]);
							case 2:
								var sAddress = analysisStudentIdOrEmailAddressResult.a;
								return _List_fromArray(
									[
										A2(
										elm$html$Html$div,
										_List_Nil,
										_List_fromArray(
											[
												elm$html$Html$text(
												'筑波大学のメールアドレス ' + author$project$Data$SAddress$toEmailAddressString(sAddress))
											]))
									]);
							default:
								return _List_fromArray(
									[
										A2(
										elm$html$Html$div,
										_List_Nil,
										_List_fromArray(
											[
												elm$html$Html$text('筑波大学のメールアドレスではありません')
											]))
									]);
						}
					}())))
		]);
};
var author$project$Page$SignUp$normalView = F5(
	function (studentIdOrTsukubaEmailAddress, university, nickName, image, sendEmailToken) {
		return A3(
			elm$html$Html$Keyed$node,
			'div',
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('form')
				]),
			_Utils_ap(
				author$project$Page$SignUp$studentHasSAddressFormList(studentIdOrTsukubaEmailAddress),
				_Utils_ap(
					author$project$Page$SignUp$imageForm(image),
					_Utils_ap(
						author$project$Page$SignUp$displayNameForm(nickName),
						_Utils_ap(
							A2(
								elm$core$List$map,
								elm$core$Tuple$mapSecond(
									A2(
										elm$core$Basics$composeR,
										rtfeldman$elm_css$Html$Styled$toUnstyled,
										elm$html$Html$map(author$project$Page$SignUp$MsgByUniversity))),
								author$project$Page$Component$University$view(university)),
							_List_fromArray(
								[
									_Utils_Tuple2(
									'submit',
									author$project$Page$SignUp$signUpSubmitButton(
										A5(author$project$Page$SignUp$getSendEmailRequest, studentIdOrTsukubaEmailAddress, university, nickName, image, sendEmailToken)))
								]))))));
	});
var author$project$Page$SignUp$sendingSignUpDataView = function (emailAddress) {
	return A2(
		elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				elm$html$Html$text(
				author$project$Data$EmailAddress$toString(emailAddress) + 'に認証メールの送信をしました')
			]));
};
var author$project$Page$SignUp$sentSingUpDataView = function (emailAddress) {
	return A2(
		elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				elm$html$Html$text(
				author$project$Data$EmailAddress$toString(emailAddress) + 'に認証メールの送信をしました')
			]));
};
var author$project$Page$SignUp$view = function (userSignUpPage) {
	var _n0 = function () {
		switch (userSignUpPage.$) {
			case 0:
				var sAddressOrStudentId = userSignUpPage.a.bz;
				var university = userSignUpPage.a.bb;
				var nickName = userSignUpPage.a.bZ;
				var image = userSignUpPage.a.bn;
				var sendEmailToken = userSignUpPage.a.$7;
				return _Utils_Tuple2(
					'新規登録',
					A5(author$project$Page$SignUp$normalView, sAddressOrStudentId, university, nickName, image, sendEmailToken));
			case 1:
				var emailAddress = userSignUpPage.a.cJ;
				return _Utils_Tuple2(
					'新規登録データを送信中',
					author$project$Page$SignUp$sendingSignUpDataView(emailAddress));
			default:
				var emailAddress = userSignUpPage.a.cJ;
				return _Utils_Tuple2(
					'認証メールの送信をしました',
					author$project$Page$SignUp$sentSingUpDataView(emailAddress));
		}
	}();
	var tabText = _n0.a;
	var mainView = _n0.b;
	return {
		bI: elm$core$Maybe$Nothing,
		bQ: _List_fromArray(
			[
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('container')
					]),
				_List_fromArray(
					[mainView]))
			]),
		ce: author$project$BasicParts$tabSingle(tabText),
		bD: elm$core$Maybe$Just('新規登録')
	};
};
var author$project$Page$SoldProducts$view = F3(
	function (logInState, isWideScreen, _n0) {
		var rec = _n0;
		return {
			bI: elm$core$Maybe$Nothing,
			bQ: _List_fromArray(
				[
					A2(
					elm$html$Html$map,
					author$project$Page$SoldProducts$MsgByProductList,
					A4(
						author$project$Page$Component$ProductList$view,
						rec.a0,
						logInState,
						isWideScreen,
						function () {
							var _n1 = rec.ae;
							switch (_n1.$) {
								case 0:
									return elm$core$Maybe$Nothing;
								case 1:
									var soldProducts = _n1.a;
									return elm$core$Maybe$Just(soldProducts);
								default:
									return elm$core$Maybe$Just(_List_Nil);
							}
						}()))
				]),
			ce: author$project$BasicParts$tabSingle('出品した商品'),
			bD: elm$core$Maybe$Just('出品した商品')
		};
	});
var author$project$Page$Trade$loadingView = function (trade) {
	var product = author$project$Data$Trade$getProduct(trade);
	return _List_fromArray(
		[
			A2(
			elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					elm$html$Html$text('読み込み中'),
					rtfeldman$elm_css$Html$Styled$toUnstyled(
					author$project$Icon$loading(
						{
							dQ: A3(rtfeldman$elm_css$Css$rgb, 0, 0, 0),
							eo: 64
						}))
				]))
		]);
};
var author$project$Data$Trade$detailGetBuyer = function (_n0) {
	var buyer = _n0.cx;
	return buyer;
};
var author$project$Data$Trade$detailGetCreatedAt = function (_n0) {
	var createdAt = _n0.aS;
	return createdAt;
};
var author$project$Data$Trade$detailGetProduct = function (_n0) {
	var product = _n0.de;
	return product;
};
var author$project$Data$Trade$detailGetUpdateAt = function (_n0) {
	var updateAt = _n0.dD;
	return updateAt;
};
var author$project$Data$Trade$statusToJapaneseString = function (status) {
	switch (status) {
		case 0:
			return '進行中';
		case 1:
			return '出品者の終了待ち';
		case 2:
			return '購入者の終了待ち';
		case 3:
			return '出品者がキャンセルした';
		case 4:
			return '購入者がキャンセルした';
		default:
			return '取引終了';
	}
};
var author$project$Page$Trade$CancelTrade = function (a) {
	return {$: 3, a: a};
};
var author$project$Page$Trade$cancelButton = F2(
	function (sending, token) {
		if (!sending.$) {
			if (sending.a === 2) {
				var _n1 = sending.a;
				return A2(
					elm$html$Html$button,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('product-deleteButton'),
							elm$html$Html$Attributes$disabled(true)
						]),
					_List_fromArray(
						[
							rtfeldman$elm_css$Html$Styled$toUnstyled(
							author$project$Icon$loading(
								{
									dQ: A3(rtfeldman$elm_css$Css$rgb, 0, 0, 0),
									eo: 24
								}))
						]));
			} else {
				return A2(
					elm$html$Html$button,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('product-deleteButton'),
							elm$html$Html$Attributes$disabled(true)
						]),
					_List_fromArray(
						[
							elm$html$Html$text('取引をキャンセルする')
						]));
			}
		} else {
			return A2(
				elm$html$Html$button,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('product-deleteButton'),
						elm$html$Html$Events$onClick(
						author$project$Page$Trade$CancelTrade(token))
					]),
				_List_fromArray(
					[
						elm$html$Html$text('取引をキャンセルする')
					]));
		}
	});
var author$project$Page$Trade$AddComment = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$Trade$InputComment = function (a) {
	return {$: 0, a: a};
};
var author$project$Page$Trade$commentInputArea = F2(
	function (sending, token) {
		return A2(
			elm$html$Html$div,
			_List_Nil,
			_Utils_ap(
				_List_fromArray(
					[
						A2(
						elm$html$Html$textarea,
						_List_fromArray(
							[
								elm$html$Html$Events$onInput(author$project$Page$Trade$InputComment),
								elm$html$Html$Attributes$class('form-textarea'),
								elm$html$Html$Attributes$id(author$project$Page$Trade$commentTextAreaId)
							]),
						_List_Nil)
					]),
				function () {
					if (!sending.$) {
						if (!sending.a) {
							var _n1 = sending.a;
							return _List_fromArray(
								[
									A2(
									elm$html$Html$button,
									_List_fromArray(
										[
											elm$html$Html$Attributes$class('product-comment-sendButton'),
											elm$html$Html$Attributes$disabled(true)
										]),
									_List_fromArray(
										[
											rtfeldman$elm_css$Html$Styled$toUnstyled(
											author$project$Icon$loading(
												{
													dQ: A3(rtfeldman$elm_css$Css$rgb, 0, 0, 0),
													eo: 24
												}))
										]))
								]);
						} else {
							return _List_fromArray(
								[
									A2(
									elm$html$Html$button,
									_List_fromArray(
										[
											elm$html$Html$Attributes$class('product-comment-sendButton'),
											elm$html$Html$Attributes$disabled(true)
										]),
									_List_fromArray(
										[
											elm$html$Html$text('コメントを送信')
										]))
								]);
						}
					} else {
						return _List_fromArray(
							[
								A2(
								elm$html$Html$button,
								_List_fromArray(
									[
										elm$html$Html$Events$onClick(
										author$project$Page$Trade$AddComment(token)),
										elm$html$Html$Attributes$class('product-comment-sendButton')
									]),
								_List_fromArray(
									[
										elm$html$Html$text('コメントを送信')
									]))
							]);
					}
				}()));
	});
var author$project$Data$Trade$detailGetComment = function (_n0) {
	var comments = _n0.dR;
	return comments;
};
var author$project$Page$Trade$tradeCommentToCommentData = F3(
	function (trade, myId, _n0) {
		var body = _n0.bg;
		var speaker = _n0.ds;
		var createdAt = _n0.aS;
		if (!speaker) {
			var commentUser = author$project$Data$Product$detailGetSeller(
				author$project$Data$Trade$detailGetProduct(trade));
			return {
				bg: body,
				aS: createdAt,
				bT: _Utils_eq(
					author$project$Data$User$withNameGetId(commentUser),
					myId),
				aX: true,
				ch: commentUser
			};
		} else {
			var commentUser = author$project$Data$Trade$detailGetBuyer(trade);
			return {
				bg: body,
				aS: createdAt,
				bT: _Utils_eq(
					author$project$Data$User$withNameGetId(commentUser),
					myId),
				aX: false,
				ch: commentUser
			};
		}
	});
var author$project$Page$Trade$commentView = F3(
	function (timeData, user, trade) {
		return A2(
			elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					author$project$Page$Component$Comment$view,
					timeData,
					elm$core$Maybe$Just(
						A2(
							elm$core$List$map,
							A2(
								author$project$Page$Trade$tradeCommentToCommentData,
								trade,
								author$project$Data$User$withNameGetId(user)),
							author$project$Data$Trade$detailGetComment(trade))))
				]));
	});
var author$project$Page$Trade$FinishTrade = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$Trade$finishText = function (position) {
	if (!position) {
		return '商品を渡した';
	} else {
		return '商品を受け取った';
	}
};
var author$project$Page$Trade$finishButton = F3(
	function (sending, position, token) {
		if (!sending.$) {
			if (sending.a === 1) {
				var _n1 = sending.a;
				return A2(
					elm$html$Html$button,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('mainButton'),
							elm$html$Html$Attributes$disabled(true)
						]),
					_List_fromArray(
						[
							rtfeldman$elm_css$Html$Styled$toUnstyled(
							author$project$Icon$loading(
								{
									dQ: A3(rtfeldman$elm_css$Css$rgb, 0, 0, 0),
									eo: 24
								}))
						]));
			} else {
				return A2(
					elm$html$Html$button,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('mainButton'),
							elm$html$Html$Attributes$disabled(true)
						]),
					_List_fromArray(
						[
							elm$html$Html$text(
							author$project$Page$Trade$finishText(position))
						]));
			}
		} else {
			return A2(
				elm$html$Html$button,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('mainButton'),
						elm$html$Html$Events$onClick(
						author$project$Page$Trade$FinishTrade(token))
					]),
				_List_fromArray(
					[
						elm$html$Html$text(
						author$project$Page$Trade$finishText(position))
					]));
		}
	});
var author$project$Page$Trade$imageView = function (url) {
	return A2(
		elm$html$Html$img,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('product-image'),
				elm$html$Html$Attributes$src(url)
			]),
		_List_Nil);
};
var author$project$Page$Trade$productImageView = function (urlList) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('product-imageListContainer')
			]),
		_List_fromArray(
			[
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('product-imageList')
					]),
				A2(elm$core$List$map, author$project$Page$Trade$imageView, urlList))
			]));
};
var author$project$Page$Trade$userView = function (userWithName) {
	return A2(
		elm$html$Html$a,
		_List_fromArray(
			[
				elm$html$Html$Attributes$href(
				author$project$PageLocation$toUrlAsString(
					author$project$PageLocation$User(
						author$project$Data$User$withNameGetId(userWithName))))
			]),
		_List_fromArray(
			[
				A2(
				author$project$Page$Style$userImage,
				48,
				author$project$Data$User$withNameGetImageId(userWithName)),
				elm$html$Html$text(
				author$project$Data$User$withNameGetDisplayName(userWithName))
			]));
};
var author$project$Page$Trade$sellerAndBuyerView = F2(
	function (seller, buyer) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					A2(elm$html$Html$Attributes$style, 'display', 'flex')
				]),
			_List_fromArray(
				[
					author$project$Page$Trade$userView(seller),
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							A2(elm$html$Html$Attributes$style, 'font-size', '32px')
						]),
					_List_fromArray(
						[
							elm$html$Html$text('→')
						])),
					author$project$Page$Trade$userView(buyer)
				]));
	});
var author$project$Page$Trade$mainView = F5(
	function (sending, token, timeData, user, trade) {
		var tradeStatus = author$project$Data$Trade$detailGetStatus(trade);
		var product = author$project$Data$Trade$detailGetProduct(trade);
		var position = _Utils_eq(
			author$project$Data$User$withNameGetId(
				author$project$Data$Trade$detailGetBuyer(trade)),
			author$project$Data$User$withNameGetId(user)) ? 1 : 0;
		return _Utils_ap(
			_List_fromArray(
				[
					author$project$Page$Trade$productImageView(
					author$project$Data$Product$detailGetImageUrls(product)),
					A2(
					author$project$Page$Style$titleAndContent,
					'商品名',
					A2(
						elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								elm$html$Html$text(
								author$project$Data$Product$detailGetName(product))
							]))),
					A2(
					author$project$Page$Style$titleAndContent,
					'値段',
					A2(
						elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								elm$html$Html$text(
								author$project$Data$Product$priceToString(
									author$project$Data$Product$detailGetPrice(product)))
							]))),
					A2(
					author$project$Page$Style$titleAndContent,
					'取引状態',
					elm$html$Html$text(
						author$project$Data$Trade$statusToJapaneseString(
							author$project$Data$Trade$detailGetStatus(trade)))),
					A2(
					author$project$Page$Style$titleAndContent,
					'更新日時',
					elm$html$Html$text(
						A2(
							author$project$Data$DateTime$toDiffString,
							timeData,
							author$project$Data$Trade$detailGetUpdateAt(trade)))),
					A2(
					author$project$Page$Style$titleAndContent,
					'開始日時',
					elm$html$Html$text(
						A2(
							author$project$Data$DateTime$toDiffString,
							timeData,
							author$project$Data$Trade$detailGetCreatedAt(trade)))),
					A2(
					elm$html$Html$a,
					_List_fromArray(
						[
							A2(elm$html$Html$Attributes$style, 'display', 'block'),
							elm$html$Html$Attributes$href(
							author$project$PageLocation$toUrlAsString(
								author$project$PageLocation$Product(
									author$project$Data$Product$detailGetId(product))))
						]),
					_List_fromArray(
						[
							elm$html$Html$text('商品詳細ページ')
						])),
					A2(
					author$project$Page$Trade$sellerAndBuyerView,
					author$project$Data$Product$detailGetSeller(product),
					author$project$Data$Trade$detailGetBuyer(trade))
				]),
			_Utils_ap(
				function () {
					switch (tradeStatus) {
						case 0:
							return _List_fromArray(
								[
									A2(author$project$Page$Trade$commentInputArea, sending, token)
								]);
						case 1:
							return _List_fromArray(
								[
									A2(author$project$Page$Trade$commentInputArea, sending, token)
								]);
						case 2:
							return _List_fromArray(
								[
									A2(author$project$Page$Trade$commentInputArea, sending, token)
								]);
						case 3:
							return _List_Nil;
						case 4:
							return _List_Nil;
						default:
							return _List_Nil;
					}
				}(),
				_Utils_ap(
					_List_fromArray(
						[
							A3(author$project$Page$Trade$commentView, timeData, user, trade)
						]),
					_Utils_ap(
						function () {
							switch (tradeStatus) {
								case 0:
									return _List_fromArray(
										[
											A3(author$project$Page$Trade$finishButton, sending, position, token)
										]);
								case 1:
									if (position === 1) {
										return _List_Nil;
									} else {
										return _List_fromArray(
											[
												A3(author$project$Page$Trade$finishButton, sending, position, token)
											]);
									}
								case 2:
									if (position === 1) {
										return _List_fromArray(
											[
												A3(author$project$Page$Trade$finishButton, sending, position, token)
											]);
									} else {
										return _List_Nil;
									}
								default:
									return _List_Nil;
							}
						}(),
						function () {
							switch (tradeStatus) {
								case 0:
									return _List_fromArray(
										[
											A2(author$project$Page$Trade$cancelButton, sending, token)
										]);
								case 1:
									return _List_fromArray(
										[
											A2(author$project$Page$Trade$cancelButton, sending, token)
										]);
								case 2:
									return _List_fromArray(
										[
											A2(author$project$Page$Trade$cancelButton, sending, token)
										]);
								case 3:
									return _List_Nil;
								case 4:
									return _List_Nil;
								default:
									return _List_Nil;
							}
						}()))));
	});
var author$project$Page$Trade$view = F3(
	function (logInState, timeData, model) {
		return {
			bI: elm$core$Maybe$Nothing,
			bQ: _List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('container')
						]),
					_List_fromArray(
						[
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('product')
								]),
							function () {
								switch (logInState.$) {
									case 2:
										var token = logInState.a.dz;
										var userWithName = logInState.a.dF;
										switch (model.$) {
											case 0:
												var id = model.a;
												return _List_fromArray(
													[
														elm$html$Html$text(
														'id=' + (author$project$Data$Trade$idToString(id) + 'の取引データを読み込み中')),
														rtfeldman$elm_css$Html$Styled$toUnstyled(
														author$project$Icon$loading(
															{
																dQ: A3(rtfeldman$elm_css$Css$rgb, 0, 0, 0),
																eo: 64
															}))
													]);
											case 1:
												var trade = model.a;
												return author$project$Page$Trade$loadingView(trade);
											default:
												var trade = model.a.V;
												var sending = model.a.cb;
												return A5(author$project$Page$Trade$mainView, sending, token, timeData, userWithName, trade);
										}
									case 1:
										return _List_fromArray(
											[
												elm$html$Html$text('読み込み中'),
												rtfeldman$elm_css$Html$Styled$toUnstyled(
												author$project$Icon$loading(
													{
														dQ: A3(rtfeldman$elm_css$Css$rgb, 0, 0, 0),
														eo: 64
													}))
											]);
									default:
										return _List_fromArray(
											[
												elm$html$Html$text('取引するにはログインが必要です')
											]);
								}
							}())
						]))
				]),
			ce: author$project$BasicParts$tabNone,
			bD: elm$core$Maybe$Just('取引')
		};
	});
var author$project$Page$Component$TradeList$emptyView = _List_fromArray(
	[
		A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				elm$html$Html$Attributes$class('productList-zero')
			]),
		_List_fromArray(
			[
				A2(
				elm$html$Html$img,
				_List_fromArray(
					[
						elm$html$Html$Attributes$src('/assets/logo_bird.png'),
						elm$html$Html$Attributes$class('productList-zeroImage'),
						elm$html$Html$Attributes$alt('ざんねん。取引がありません')
					]),
				_List_Nil),
				elm$html$Html$text('ここに表示する取引がありません')
			]))
	]);
var author$project$Data$Trade$getBuyer = function (_n0) {
	var buyer = _n0.cx;
	return buyer;
};
var author$project$Data$Trade$getSeller = function (_n0) {
	var seller = _n0.dn;
	return seller;
};
var author$project$Page$Component$TradeList$userView = function (userWithName) {
	return A2(
		elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				author$project$Page$Style$userImage,
				48,
				author$project$Data$User$withNameGetImageId(userWithName)),
				elm$html$Html$text(
				author$project$Data$User$withNameGetDisplayName(userWithName))
			]));
};
var author$project$Page$Component$TradeList$item = function (trade) {
	var product = author$project$Data$Trade$getProduct(trade);
	return A2(
		elm$html$Html$a,
		_List_fromArray(
			[
				elm$html$Html$Attributes$href(
				author$project$PageLocation$toUrlAsString(
					author$project$PageLocation$Trade(
						author$project$Data$Trade$getId(trade)))),
				A2(elm$html$Html$Attributes$style, 'display', 'grid'),
				A2(elm$html$Html$Attributes$style, 'grid-template-columns', '194px 1fr'),
				A2(elm$html$Html$Attributes$style, 'grid-template-rows', 'max-content max-content max-content'),
				A2(elm$html$Html$Attributes$style, 'border', 'solid 1px rgba(0,0,0,.4)'),
				A2(elm$html$Html$Attributes$style, 'text-decoration', 'none'),
				A2(elm$html$Html$Attributes$style, 'color', 'black')
			]),
		_List_fromArray(
			[
				A2(
				elm$html$Html$img,
				_List_fromArray(
					[
						elm$html$Html$Attributes$src(
						author$project$Data$Product$getThumbnailImageUrl(product)),
						A2(elm$html$Html$Attributes$style, 'grid-column', '1 / 2'),
						A2(elm$html$Html$Attributes$style, 'grid-row', '1 / 4'),
						A2(elm$html$Html$Attributes$style, 'width', '192px'),
						A2(elm$html$Html$Attributes$style, 'height', '192px'),
						A2(elm$html$Html$Attributes$style, 'object-fit', 'contain')
					]),
				_List_Nil),
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						A2(elm$html$Html$Attributes$style, 'grid-column', '2 / 3'),
						A2(elm$html$Html$Attributes$style, 'grid-row', '1 / 2'),
						A2(elm$html$Html$Attributes$style, 'color', 'black'),
						A2(elm$html$Html$Attributes$style, 'font-size', '32px')
					]),
				_List_fromArray(
					[
						elm$html$Html$text(
						author$project$Data$Product$getName(product))
					])),
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						A2(elm$html$Html$Attributes$style, 'grid-column', '2 / 3'),
						A2(elm$html$Html$Attributes$style, 'grid-row', '2 / 3')
					]),
				_List_fromArray(
					[
						elm$html$Html$text(
						author$project$Data$Product$priceToString(
							author$project$Data$Product$getPrice(product)))
					])),
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						A2(elm$html$Html$Attributes$style, 'grid-column', '2 / 3'),
						A2(elm$html$Html$Attributes$style, 'grid-row', '3 / 4'),
						A2(elm$html$Html$Attributes$style, 'display', 'flex')
					]),
				_List_fromArray(
					[
						author$project$Page$Component$TradeList$userView(
						author$project$Data$Trade$getSeller(trade)),
						A2(
						elm$html$Html$div,
						_List_fromArray(
							[
								A2(elm$html$Html$Attributes$style, 'font-size', '32px')
							]),
						_List_fromArray(
							[
								elm$html$Html$text('→')
							])),
						author$project$Page$Component$TradeList$userView(
						author$project$Data$Trade$getBuyer(trade))
					]))
			]));
};
var author$project$Page$Component$TradeList$mainView = function (_n0) {
	var x = _n0.a;
	var xs = _n0.b;
	return A2(
		elm$core$List$map,
		author$project$Page$Component$TradeList$item,
		A2(elm$core$List$cons, x, xs));
};
var author$project$Page$Component$TradeList$view = function (tradesMaybe) {
	return A2(
		elm$html$Html$div,
		_List_Nil,
		function () {
			if (!tradesMaybe.$) {
				if (tradesMaybe.a.b) {
					var _n1 = tradesMaybe.a;
					var x = _n1.a;
					var xs = _n1.b;
					return author$project$Page$Component$TradeList$mainView(
						_Utils_Tuple2(x, xs));
				} else {
					return author$project$Page$Component$TradeList$emptyView;
				}
			} else {
				return _List_fromArray(
					[
						elm$html$Html$text('読み込み中'),
						rtfeldman$elm_css$Html$Styled$toUnstyled(
						author$project$Icon$loading(
							{
								dQ: A3(rtfeldman$elm_css$Css$rgb, 0, 0, 0),
								eo: 64
							}))
					]);
			}
		}());
};
var author$project$Page$TradesInPast$MsgByLogIn = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$TradesInPast$view = F2(
	function (logInState, _n0) {
		var rec = _n0;
		return {
			bI: elm$core$Maybe$Nothing,
			bQ: function () {
				if (!logInState.$) {
					return _List_fromArray(
						[
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('container')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											elm$html$Html$text('ログインか新規登録をして、いいねと閲覧履歴を使えるようにしよう!')
										])),
									A2(
									elm$html$Html$map,
									author$project$Page$TradesInPast$MsgByLogIn,
									author$project$Page$Component$LogIn$view(rec.bq))
								]))
						]);
				} else {
					return _List_fromArray(
						[
							author$project$Page$Component$TradeList$view(
							function () {
								var _n2 = rec.ae;
								switch (_n2.$) {
									case 0:
										return elm$core$Maybe$Nothing;
									case 1:
										var trades = _n2.a;
										return elm$core$Maybe$Just(
											elm$core$List$reverse(trades));
									default:
										return elm$core$Maybe$Just(_List_Nil);
								}
							}())
						]);
				}
			}(),
			ce: author$project$BasicParts$tabSingle('過去にした取引'),
			bD: elm$core$Maybe$Just('過去にした取引')
		};
	});
var author$project$Page$TradesInProgress$MsgByLogIn = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$TradesInProgress$view = F2(
	function (logInState, _n0) {
		var rec = _n0;
		return {
			bI: elm$core$Maybe$Nothing,
			bQ: function () {
				if (!logInState.$) {
					return _List_fromArray(
						[
							A2(
							elm$html$Html$div,
							_List_fromArray(
								[
									elm$html$Html$Attributes$class('container')
								]),
							_List_fromArray(
								[
									A2(
									elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											elm$html$Html$text('ログインか新規登録をして、いいねと閲覧履歴を使えるようにしよう!')
										])),
									A2(
									elm$html$Html$map,
									author$project$Page$TradesInProgress$MsgByLogIn,
									author$project$Page$Component$LogIn$view(rec.bq))
								]))
						]);
				} else {
					return _List_fromArray(
						[
							author$project$Page$Component$TradeList$view(
							function () {
								var _n2 = rec.ae;
								switch (_n2.$) {
									case 0:
										return elm$core$Maybe$Nothing;
									case 1:
										var trades = _n2.a;
										return elm$core$Maybe$Just(
											elm$core$List$reverse(trades));
									default:
										return elm$core$Maybe$Just(_List_Nil);
								}
							}())
						]);
				}
			}(),
			ce: author$project$BasicParts$tabSingle('進行中の取引'),
			bD: elm$core$Maybe$Just('進行中の取引')
		};
	});
var author$project$Data$User$withProfileGetId = function (_n0) {
	var id = _n0.aa;
	return id;
};
var author$project$Page$User$MsgByUniversity = function (a) {
	return {$: 3, a: a};
};
var author$project$Page$User$MsgInputDisplayName = function (a) {
	return {$: 1, a: a};
};
var author$project$Page$User$displayNameEditor = function (displayName) {
	return A2(
		elm$html$Html$div,
		_List_Nil,
		_Utils_ap(
			_List_fromArray(
				[
					A2(
					elm$html$Html$label,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('form-label'),
							elm$html$Html$Attributes$for(author$project$Page$User$nickNameEditorId)
						]),
					_List_fromArray(
						[
							elm$html$Html$text('表示名')
						])),
					A2(
					elm$html$Html$input,
					_List_fromArray(
						[
							A2(elm$html$Html$Attributes$attribute, 'autocomplete', 'username'),
							elm$html$Html$Attributes$id(author$project$Page$User$nickNameEditorId),
							elm$html$Html$Attributes$class('form-input'),
							elm$html$Html$Events$onInput(author$project$Page$User$MsgInputDisplayName)
						]),
					_List_Nil)
				]),
			(elm$core$String$length(displayName) < 1) ? _List_fromArray(
				[
					elm$html$Html$text('表示名は 1文字以上である必要があります')
				]) : ((50 < elm$core$String$length(displayName)) ? _List_fromArray(
				[
					elm$html$Html$text('表示名は 50文字以内である必要があります')
				]) : _List_Nil)));
};
var author$project$Page$User$MsgBackToViewMode = {$: 4};
var author$project$Page$User$MsgChangeProfile = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var author$project$Page$User$editModelToProfileUpdateData = function (_n0) {
	var displayName = _n0.Y;
	var introduction = _n0.bS;
	var university = _n0.bb;
	if ((1 <= elm$core$String$length(displayName)) && (elm$core$String$length(displayName) <= 50)) {
		var _n1 = author$project$Page$Component$University$getUniversity(university);
		if (!_n1.$) {
			var univ = _n1.a;
			return elm$core$Maybe$Just(
				{Y: displayName, bn: elm$core$Maybe$Nothing, bS: introduction, bb: univ});
		} else {
			return elm$core$Maybe$Nothing;
		}
	} else {
		return elm$core$Maybe$Nothing;
	}
};
var author$project$Page$User$editButton = F2(
	function (token, editModel) {
		return A2(
			elm$html$Html$div,
			_List_fromArray(
				[
					elm$html$Html$Attributes$class('profile-editButtonArea')
				]),
			_List_fromArray(
				[
					A2(
					elm$html$Html$button,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('profile-editCancelButton'),
							elm$html$Html$Events$onClick(author$project$Page$User$MsgBackToViewMode)
						]),
					_List_fromArray(
						[
							elm$html$Html$text('キャンセル')
						])),
					A2(
					elm$html$Html$button,
					_Utils_ap(
						_List_fromArray(
							[
								elm$html$Html$Attributes$class('profile-editOkButton')
							]),
						function () {
							var _n0 = author$project$Page$User$editModelToProfileUpdateData(editModel);
							if (!_n0.$) {
								var profile = _n0.a;
								return _List_fromArray(
									[
										elm$html$Html$Events$onClick(
										A2(author$project$Page$User$MsgChangeProfile, token, profile)),
										elm$html$Html$Attributes$disabled(false)
									]);
							} else {
								return _List_fromArray(
									[
										elm$html$Html$Attributes$disabled(true)
									]);
							}
						}()),
					_List_fromArray(
						[
							elm$html$Html$text('変更する')
						]))
				]));
	});
var author$project$Page$User$MsgInputIntroduction = function (a) {
	return {$: 2, a: a};
};
var author$project$Page$User$introductionEditor = function (introduction) {
	return A2(
		elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				elm$html$Html$label,
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('form-label'),
						elm$html$Html$Attributes$for(author$project$Page$User$introductionEditorId)
					]),
				_List_fromArray(
					[
						elm$html$Html$text('紹介文')
					])),
				A2(
				elm$html$Html$textarea,
				_List_fromArray(
					[
						elm$html$Html$Attributes$id(author$project$Page$User$introductionEditorId),
						elm$html$Html$Attributes$class('form-textarea'),
						elm$html$Html$Events$onInput(author$project$Page$User$MsgInputIntroduction)
					]),
				_List_Nil)
			]));
};
var author$project$Page$User$editView = F2(
	function (access, editModel) {
		return _List_fromArray(
			[
				A3(
				elm$html$Html$Keyed$node,
				'div',
				_List_fromArray(
					[
						elm$html$Html$Attributes$class('form')
					]),
				_Utils_ap(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'nickNameEditor',
							author$project$Page$User$displayNameEditor(editModel.Y)),
							_Utils_Tuple2(
							'introductionEditor',
							author$project$Page$User$introductionEditor(editModel.bS))
						]),
					_Utils_ap(
						A2(
							elm$core$List$map,
							elm$core$Tuple$mapSecond(
								A2(
									elm$core$Basics$composeR,
									rtfeldman$elm_css$Html$Styled$toUnstyled,
									elm$html$Html$map(author$project$Page$User$MsgByUniversity))),
							author$project$Page$Component$University$view(editModel.bb)),
						_List_fromArray(
							[
								_Utils_Tuple2(
								'button',
								A2(author$project$Page$User$editButton, access, editModel))
							]))))
			]);
	});
var author$project$Page$User$imageAndDisplayNameView = F3(
	function (isWideScreen, imageId, displayName) {
		return isWideScreen ? _List_fromArray(
			[
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						A2(elm$html$Html$Attributes$style, 'display', 'flex'),
						A2(elm$html$Html$Attributes$style, 'justify-content', 'center')
					]),
				_List_fromArray(
					[
						A2(author$project$Page$Style$userImage, 200, imageId),
						A2(
						elm$html$Html$div,
						_List_fromArray(
							[
								A2(elm$html$Html$Attributes$style, 'flex-grow', '1'),
								A2(elm$html$Html$Attributes$style, 'font-size', '1.5rem')
							]),
						_List_fromArray(
							[
								elm$html$Html$text(displayName)
							]))
					]))
			]) : _List_fromArray(
			[
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						A2(elm$html$Html$Attributes$style, 'display', 'flex'),
						A2(elm$html$Html$Attributes$style, 'justify-content', 'center')
					]),
				_List_fromArray(
					[
						A2(author$project$Page$Style$userImage, 200, imageId)
					])),
				A2(
				elm$html$Html$div,
				_List_fromArray(
					[
						A2(elm$html$Html$Attributes$style, 'flex-grow', '1'),
						A2(elm$html$Html$Attributes$style, 'font-size', '1.5rem')
					]),
				_List_fromArray(
					[
						elm$html$Html$text(displayName)
					]))
			]);
	});
var author$project$Page$User$loadingWithUserIdAndNameView = F2(
	function (isWideScreen, userWithName) {
		return _Utils_ap(
			A3(
				author$project$Page$User$imageAndDisplayNameView,
				isWideScreen,
				author$project$Data$User$withNameGetImageId(userWithName),
				author$project$Data$User$withNameGetDisplayName(userWithName)),
			_List_fromArray(
				[
					elm$html$Html$text(
					author$project$Data$User$withNameGetDisplayName(userWithName) + 'さんの紹介文、学群学類を読み込み中'),
					rtfeldman$elm_css$Html$Styled$toUnstyled(
					author$project$Icon$loading(
						{
							dQ: A3(rtfeldman$elm_css$Css$rgb, 0, 0, 0),
							eo: 48
						}))
				]));
	});
var author$project$Page$User$loadingWithUserIdView = function (userId) {
	return _List_fromArray(
		[
			elm$html$Html$text(
			'ユーザーID' + (author$project$Data$User$idToString(userId) + 'のプロフィールを読み込み中')),
			rtfeldman$elm_css$Html$Styled$toUnstyled(
			author$project$Icon$loading(
				{
					dQ: A3(rtfeldman$elm_css$Css$rgb, 0, 0, 0),
					eo: 48
				}))
		]);
};
var author$project$Page$User$MsgLogOut = {$: 7};
var author$project$Page$User$logOutButton = A2(
	elm$html$Html$button,
	_List_fromArray(
		[
			elm$html$Html$Attributes$class('subButton'),
			elm$html$Html$Events$onClick(author$project$Page$User$MsgLogOut)
		]),
	_List_fromArray(
		[
			elm$html$Html$text('ログアウトする')
		]));
var author$project$Page$User$profileContainerStyle = _List_fromArray(
	[
		A2(elm$html$Html$Attributes$style, 'display', 'grid'),
		A2(elm$html$Html$Attributes$style, 'max-width', '40rem'),
		A2(elm$html$Html$Attributes$style, 'gap', '16px'),
		A2(elm$html$Html$Attributes$style, 'padding', '16px'),
		A2(elm$html$Html$Attributes$style, 'box-sizing', 'border-box'),
		A2(elm$html$Html$Attributes$style, 'width', '100%')
	]);
var author$project$Page$User$MsgToEditMode = {$: 0};
var author$project$Page$User$toEditButton = A2(
	elm$html$Html$button,
	_List_fromArray(
		[
			elm$html$Html$Attributes$class('mainButton'),
			elm$html$Html$Events$onClick(author$project$Page$User$MsgToEditMode)
		]),
	_List_fromArray(
		[
			author$project$Icon$edit(
			_List_fromArray(
				[
					rtfeldman$elm_css$Css$width(
					rtfeldman$elm_css$Css$px(32)),
					rtfeldman$elm_css$Css$height(
					rtfeldman$elm_css$Css$px(32))
				])),
			elm$html$Html$text('編集する')
		]));
var author$project$Page$User$userDataLinkItem = F2(
	function (link, text) {
		return A2(
			elm$html$Html$a,
			_List_fromArray(
				[
					elm$html$Html$Attributes$href(
					author$project$PageLocation$toUrlAsString(link)),
					A2(elm$html$Html$Attributes$style, 'text-decoration', 'none'),
					A2(elm$html$Html$Attributes$style, 'color', 'black'),
					A2(elm$html$Html$Attributes$style, 'background-color', '#999'),
					A2(elm$html$Html$Attributes$style, 'padding', '16px'),
					A2(elm$html$Html$Attributes$style, 'font-size', '1.5rem'),
					A2(elm$html$Html$Attributes$style, 'text-align', 'center')
				]),
			_List_fromArray(
				[
					elm$html$Html$text(text)
				]));
	});
var author$project$Page$User$userPrivateDataLink = function (userId) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				A2(elm$html$Html$Attributes$style, 'display', 'grid'),
				A2(elm$html$Html$Attributes$style, 'gap', '8px'),
				A2(elm$html$Html$Attributes$style, 'padding', '0 0 48px 0')
			]),
		_List_fromArray(
			[
				A2(author$project$Page$User$userDataLinkItem, author$project$PageLocation$LikedProducts, 'いいねした商品'),
				A2(author$project$Page$User$userDataLinkItem, author$project$PageLocation$History, '閲覧した商品'),
				A2(
				author$project$Page$User$userDataLinkItem,
				author$project$PageLocation$SoldProducts(userId),
				'出品した商品'),
				A2(author$project$Page$User$userDataLinkItem, author$project$PageLocation$BoughtProducts, '購入した商品'),
				A2(author$project$Page$User$userDataLinkItem, author$project$PageLocation$TradingProducts, '進行中の取引'),
				A2(author$project$Page$User$userDataLinkItem, author$project$PageLocation$TradedProducts, '過去にした取引'),
				A2(author$project$Page$User$userDataLinkItem, author$project$PageLocation$CommentedProducts, 'コメントをした商品')
			]));
};
var author$project$Data$User$withProfileGetImageId = function (_n0) {
	var imageId = _n0.bR;
	return imageId;
};
var elm$core$List$intersperse = F2(
	function (sep, xs) {
		if (!xs.b) {
			return _List_Nil;
		} else {
			var hd = xs.a;
			var tl = xs.b;
			var step = F2(
				function (x, rest) {
					return A2(
						elm$core$List$cons,
						sep,
						A2(elm$core$List$cons, x, rest));
				});
			var spersed = A3(elm$core$List$foldr, step, _List_Nil, tl);
			return A2(elm$core$List$cons, hd, spersed);
		}
	});
var elm$core$String$lines = _String_lines;
var elm$html$Html$br = _VirtualDom_node('br');
var author$project$Page$User$introductionView = function (introduction) {
	return A2(
		author$project$Page$Style$titleAndContent,
		'紹介文',
		A2(
			elm$html$Html$div,
			_List_Nil,
			A2(
				elm$core$List$intersperse,
				A2(elm$html$Html$br, _List_Nil, _List_Nil),
				A2(
					elm$core$List$map,
					elm$html$Html$text,
					elm$core$String$lines(introduction)))));
};
var author$project$Data$University$universityToJapaneseString = function (university) {
	switch (university.$) {
		case 0:
			var graduate = university.a;
			var schoolAndDepartment = university.b;
			return {
				bM: author$project$Data$University$departmentToJapaneseString(schoolAndDepartment),
				bP: elm$core$Maybe$Just(
					author$project$Data$University$graduateToJapaneseString(graduate)),
				b9: elm$core$Maybe$Just(
					author$project$Data$University$schoolToJapaneseString(
						author$project$Data$University$schoolFromDepartment(schoolAndDepartment)))
			};
		case 1:
			var graduate = university.a;
			return {
				bM: elm$core$Maybe$Nothing,
				bP: elm$core$Maybe$Just(
					author$project$Data$University$graduateToJapaneseString(graduate)),
				b9: elm$core$Maybe$Nothing
			};
		default:
			var schoolAndDepartment = university.a;
			return {
				bM: author$project$Data$University$departmentToJapaneseString(schoolAndDepartment),
				bP: elm$core$Maybe$Nothing,
				b9: elm$core$Maybe$Just(
					author$project$Data$University$schoolToJapaneseString(
						author$project$Data$University$schoolFromDepartment(schoolAndDepartment)))
			};
	}
};
var author$project$Page$User$universityView = function (university) {
	var _n0 = author$project$Data$University$universityToJapaneseString(university);
	var graduate = _n0.bP;
	var school = _n0.b9;
	var department = _n0.bM;
	return _Utils_ap(
		function () {
			if (!graduate.$) {
				var g = graduate.a;
				return _List_fromArray(
					[
						A2(
						author$project$Page$Style$titleAndContent,
						'研究科',
						A2(
							elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									elm$html$Html$text(g)
								])))
					]);
			} else {
				return _List_Nil;
			}
		}(),
		_Utils_ap(
			function () {
				if (!school.$) {
					var s = school.a;
					return _List_fromArray(
						[
							A2(
							author$project$Page$Style$titleAndContent,
							'学群',
							A2(
								elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										elm$html$Html$text(s)
									])))
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
							A2(
							author$project$Page$Style$titleAndContent,
							'学類',
							A2(
								elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										elm$html$Html$text(d)
									])))
						]);
				} else {
					return _List_Nil;
				}
			}()));
};
var author$project$Page$User$userView = F2(
	function (isWideScreen, userWithProfile) {
		return _Utils_ap(
			A3(
				author$project$Page$User$imageAndDisplayNameView,
				isWideScreen,
				author$project$Data$User$withProfileGetImageId(userWithProfile),
				author$project$Data$User$withProfileGetDisplayName(userWithProfile)),
			_Utils_ap(
				_List_fromArray(
					[
						author$project$Page$User$introductionView(
						author$project$Data$User$withProfileGetIntroduction(userWithProfile))
					]),
				_Utils_ap(
					author$project$Page$User$universityView(
						author$project$Data$User$withProfileGetUniversity(userWithProfile)),
					_List_fromArray(
						[
							elm$html$Html$text(
							'ユーザーID ' + author$project$Data$User$idToString(
								author$project$Data$User$withProfileGetId(userWithProfile)))
						]))));
	});
var author$project$Page$User$normalMyProfileView = F2(
	function (isWideScreen, user) {
		return _List_fromArray(
			[
				A2(
				elm$html$Html$div,
				author$project$Page$User$profileContainerStyle,
				_Utils_ap(
					A2(author$project$Page$User$userView, isWideScreen, user),
					_Utils_ap(
						_List_fromArray(
							[
								author$project$Page$User$userPrivateDataLink(
								author$project$Data$User$withProfileGetId(user))
							]),
						_List_fromArray(
							[author$project$Page$User$toEditButton, author$project$Page$User$logOutButton]))))
			]);
	});
var author$project$Page$User$userDataLink = function (userId) {
	return A2(
		elm$html$Html$div,
		_List_fromArray(
			[
				A2(elm$html$Html$Attributes$style, 'display', 'grid'),
				A2(elm$html$Html$Attributes$style, 'gap', '8px'),
				A2(elm$html$Html$Attributes$style, 'padding', '0 0 48px 0')
			]),
		_List_fromArray(
			[
				A2(
				author$project$Page$User$userDataLinkItem,
				author$project$PageLocation$SoldProducts(userId),
				'出品した商品')
			]));
};
var author$project$Page$User$normalView = F2(
	function (isWideScreen, user) {
		return _List_fromArray(
			[
				A2(
				elm$html$Html$div,
				author$project$Page$User$profileContainerStyle,
				_Utils_ap(
					A2(author$project$Page$User$userView, isWideScreen, user),
					_List_fromArray(
						[
							author$project$Page$User$userDataLink(
							author$project$Data$User$withProfileGetId(user))
						])))
			]);
	});
var author$project$Page$User$view = F3(
	function (logInState, isWideScreen, model) {
		return {
			bI: elm$core$Maybe$Just(3),
			bQ: _List_fromArray(
				[
					A2(
					elm$html$Html$div,
					_List_fromArray(
						[
							elm$html$Html$Attributes$class('container')
						]),
					function () {
						var _n0 = _Utils_Tuple2(logInState, model);
						switch (_n0.b.$) {
							case 2:
								if (_n0.a.$ === 2) {
									var userWithName = _n0.a.a.dF;
									var normalUser = _n0.b.a;
									return _Utils_eq(
										author$project$Data$User$withNameGetId(userWithName),
										author$project$Data$User$withProfileGetId(normalUser)) ? A2(author$project$Page$User$normalMyProfileView, isWideScreen, normalUser) : A2(author$project$Page$User$normalView, isWideScreen, normalUser);
								} else {
									var user = _n0.b.a;
									return A2(author$project$Page$User$normalView, isWideScreen, user);
								}
							case 0:
								var userId = _n0.b.a;
								return author$project$Page$User$loadingWithUserIdView(userId);
							case 1:
								var withName = _n0.b.a;
								return A2(author$project$Page$User$loadingWithUserIdAndNameView, isWideScreen, withName);
							default:
								if (_n0.a.$ === 2) {
									var token = _n0.a.a.dz;
									var editModel = _n0.b.a;
									return A2(author$project$Page$User$editView, token, editModel);
								} else {
									return _List_fromArray(
										[
											elm$html$Html$text('自分以外のプロフィールは編集できない')
										]);
								}
						}
					}())
				]),
			ce: author$project$BasicParts$tabSingle('プロフィール'),
			bD: elm$core$Maybe$Just(
				function () {
					switch (model.$) {
						case 0:
							var id = model.a;
							return 'ID=' + (author$project$Data$User$idToString(id) + 'のユーザーページ');
						case 1:
							var withName = model.a;
							return author$project$Data$User$withNameGetDisplayName(withName) + 'さんのユーザーページ';
						case 2:
							var withProfile = model.a;
							return author$project$Data$User$withProfileGetDisplayName(withProfile) + 'さんのユーザーページ';
						default:
							return 'プロフィール編集';
					}
				}())
		};
	});
var author$project$Main$titleAndTabDataAndMainView = F4(
	function (logInState, isWideScreen, nowMaybe, page) {
		switch (page.$) {
			case 0:
				var model = page.a;
				return A2(
					author$project$Main$mapPageData,
					author$project$Main$PageMsgHome,
					A3(author$project$Page$Home$view, logInState, isWideScreen, model));
			case 3:
				var model = page.a;
				return A2(
					author$project$Main$mapPageData,
					author$project$Main$PageMsgLikedProducts,
					A3(author$project$Page$LikedProducts$view, logInState, isWideScreen, model));
			case 4:
				var model = page.a;
				return A2(
					author$project$Main$mapPageData,
					author$project$Main$PageMsgHistory,
					A3(author$project$Page$History$view, logInState, isWideScreen, model));
			case 6:
				var model = page.a;
				return A2(
					author$project$Main$mapPageData,
					author$project$Main$PageMsgBoughtProducts,
					A3(author$project$Page$BoughtProducts$view, logInState, isWideScreen, model));
			case 5:
				var model = page.a;
				return A2(
					author$project$Main$mapPageData,
					author$project$Main$PageMsgSoldProducts,
					A3(author$project$Page$SoldProducts$view, logInState, isWideScreen, model));
			case 7:
				var model = page.a;
				return A2(
					author$project$Main$mapPageData,
					author$project$Main$PageMsgTradesInProgress,
					A2(author$project$Page$TradesInProgress$view, logInState, model));
			case 8:
				var model = page.a;
				return A2(
					author$project$Main$mapPageData,
					author$project$Main$PageMsgTradesInPast,
					A2(author$project$Page$TradesInPast$view, logInState, model));
			case 9:
				var model = page.a;
				return A2(
					author$project$Main$mapPageData,
					author$project$Main$PageMsgCommentedProducts,
					A3(author$project$Page$CommentedProducts$view, logInState, isWideScreen, model));
			case 10:
				var model = page.a;
				return A2(
					author$project$Main$mapPageData,
					author$project$Main$PageMsgExhibition,
					A2(author$project$Page$Exhibition$view, logInState, model));
			case 1:
				var model = page.a;
				return A2(
					author$project$Main$mapPageData,
					author$project$Main$PageMsgSignUp,
					author$project$Page$SignUp$view(model));
			case 2:
				var model = page.a;
				return A2(
					author$project$Main$mapPageData,
					author$project$Main$PageMsgLogIn,
					author$project$Page$LogIn$view(model));
			case 11:
				var model = page.a;
				return A2(
					author$project$Main$mapPageData,
					author$project$Main$PageMsgProduct,
					A4(author$project$Page$Product$view, logInState, isWideScreen, nowMaybe, model));
			case 12:
				var model = page.a;
				return A2(
					author$project$Main$mapPageData,
					author$project$Main$PageMsgTrade,
					A3(author$project$Page$Trade$view, logInState, nowMaybe, model));
			case 13:
				var model = page.a;
				return A2(
					author$project$Main$mapPageData,
					author$project$Main$PageMsgUser,
					A3(author$project$Page$User$view, logInState, isWideScreen, model));
			case 14:
				var model = page.a;
				return A2(
					author$project$Main$mapPageData,
					author$project$Main$PageMsgSearch,
					author$project$Page$Search$view(model));
			case 15:
				var model = page.a;
				return A2(
					author$project$Main$mapPageData,
					author$project$Main$PageMsgNotification,
					author$project$Page$Notification$view(model));
			default:
				var model = page.a;
				return author$project$Page$About$view(model);
		}
	});
var author$project$Main$view = function (_n0) {
	var page = _n0.i;
	var wideScreen = _n0.bd;
	var message = _n0.w;
	var logInState = _n0.k;
	var now = _n0.b$;
	var _n1 = A4(author$project$Main$titleAndTabDataAndMainView, logInState, wideScreen, now, page);
	var title = _n1.bD;
	var tab = _n1.ce;
	var html = _n1.bQ;
	var bottomNavigation = _n1.bI;
	return {
		bg: _Utils_ap(
			_List_fromArray(
				[
					A2(
					elm$html$Html$map,
					elm$core$Basics$always(author$project$Main$HistoryBack),
					author$project$BasicParts$headerWithBackArrow)
				]),
			_Utils_ap(
				wideScreen ? _List_fromArray(
					[
						author$project$BasicParts$menu(logInState)
					]) : _List_Nil,
				_Utils_ap(
					_List_fromArray(
						[
							A2(
							elm$html$Html$map,
							author$project$Main$PageMsg,
							A2(author$project$BasicParts$tabView, wideScreen, tab)),
							A2(
							elm$html$Html$map,
							author$project$Main$PageMsg,
							A2(
								elm$html$Html$div,
								_List_fromArray(
									[
										A2(
										elm$html$Html$Attributes$style,
										'padding',
										(author$project$BasicParts$isTabNone(tab) ? '64' : '112') + ('px 0 ' + (wideScreen ? '0 320px' : '64px 0'))),
										A2(elm$html$Html$Attributes$style, 'word-wrap', 'break-word'),
										A2(elm$html$Html$Attributes$style, 'overflow-x', 'hidden'),
										A2(elm$html$Html$Attributes$style, 'width', '100%')
									]),
								html))
						]),
					_Utils_ap(
						function () {
							if (!message.$) {
								var m = message.a;
								return _List_fromArray(
									[
										A3(
										elm$html$Html$Keyed$node,
										'div',
										_List_Nil,
										_List_fromArray(
											[
												_Utils_Tuple2(
												m,
												author$project$Main$messageView(m))
											]))
									]);
							} else {
								return _List_Nil;
							}
						}(),
						function () {
							var _n3 = _Utils_Tuple2(wideScreen, bottomNavigation);
							if ((!_n3.a) && (!_n3.b.$)) {
								var select = _n3.b.a;
								return _List_fromArray(
									[
										A2(author$project$BasicParts$bottomNavigation, logInState, select)
									]);
							} else {
								return _List_Nil;
							}
						}())))),
		bD: title
	};
};
var elm$browser$Browser$application = _Browser_application;
var author$project$Main$main = elm$browser$Browser$application(
	{d4: author$project$Main$init, eb: author$project$Main$UrlChange, ec: author$project$Main$UrlRequest, er: author$project$Main$subscription, ev: author$project$Main$update, ez: author$project$Main$view});
_Platform_export({'Main':{'init':author$project$Main$main(
	A2(
		elm$json$Json$Decode$andThen,
		function (refreshToken) {
			return elm$json$Json$Decode$succeed(
				{eh: refreshToken});
		},
		A2(
			elm$json$Json$Decode$field,
			'refreshToken',
			elm$json$Json$Decode$oneOf(
				_List_fromArray(
					[
						elm$json$Json$Decode$null(elm$core$Maybe$Nothing),
						A2(elm$json$Json$Decode$map, elm$core$Maybe$Just, elm$json$Json$Decode$string)
					])))))(0)}});}(this));