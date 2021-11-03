var $6MnZR$firebasefirestore = require("firebase/firestore");
var $6MnZR$firebaseapp = require("firebase/app");


var $9c85cd53fb472000$exports = {};
(function(scope) {
    function F(arity, fun, wrapper) {
        wrapper.a = arity;
        wrapper.f = fun;
        return wrapper;
    }
    function F2(fun) {
        return F(2, fun, function(a) {
            return function(b) {
                return fun(a, b);
            };
        });
    }
    function F3(fun) {
        return F(3, fun, function(a) {
            return function(b) {
                return function(c) {
                    return fun(a, b, c);
                };
            };
        });
    }
    function F4(fun) {
        return F(4, fun, function(a) {
            return function(b) {
                return function(c) {
                    return function(d) {
                        return fun(a, b, c, d);
                    };
                };
            };
        });
    }
    function F5(fun) {
        return F(5, fun, function(a) {
            return function(b) {
                return function(c) {
                    return function(d) {
                        return function(e) {
                            return fun(a, b, c, d, e);
                        };
                    };
                };
            };
        });
    }
    function F6(fun) {
        return F(6, fun, function(a) {
            return function(b) {
                return function(c) {
                    return function(d) {
                        return function(e) {
                            return function(f) {
                                return fun(a, b, c, d, e, f);
                            };
                        };
                    };
                };
            };
        });
    }
    function F7(fun) {
        return F(7, fun, function(a) {
            return function(b) {
                return function(c) {
                    return function(d) {
                        return function(e) {
                            return function(f) {
                                return function(g) {
                                    return fun(a, b, c, d, e, f, g);
                                };
                            };
                        };
                    };
                };
            };
        });
    }
    function F8(fun) {
        return F(8, fun, function(a) {
            return function(b) {
                return function(c) {
                    return function(d) {
                        return function(e) {
                            return function(f) {
                                return function(g) {
                                    return function(h) {
                                        return fun(a, b, c, d, e, f, g, h);
                                    };
                                };
                            };
                        };
                    };
                };
            };
        });
    }
    function F9(fun) {
        return F(9, fun, function(a) {
            return function(b) {
                return function(c) {
                    return function(d) {
                        return function(e) {
                            return function(f) {
                                return function(g) {
                                    return function(h) {
                                        return function(i) {
                                            return fun(a, b, c, d, e, f, g, h, i);
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
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
    console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');
    var _JsArray_empty = [];
    function _JsArray_singleton(value) {
        return [
            value
        ];
    }
    function _JsArray_length(array) {
        return array.length;
    }
    var _JsArray_initialize = F3(function(size, offset, func) {
        var result = new Array(size);
        for(var i = 0; i < size; i++)result[i] = func(offset + i);
        return result;
    });
    var _JsArray_initializeFromList = F2(function(max, ls) {
        var result = new Array(max);
        for(var i = 0; i < max && ls.b; i++){
            result[i] = ls.a;
            ls = ls.b;
        }
        result.length = i;
        return _Utils_Tuple2(result, ls);
    });
    var _JsArray_unsafeGet = F2(function(index, array) {
        return array[index];
    });
    var _JsArray_unsafeSet = F3(function(index, value, array) {
        var length = array.length;
        var result = new Array(length);
        for(var i = 0; i < length; i++)result[i] = array[i];
        result[index] = value;
        return result;
    });
    var _JsArray_push = F2(function(value, array) {
        var length = array.length;
        var result = new Array(length + 1);
        for(var i = 0; i < length; i++)result[i] = array[i];
        result[length] = value;
        return result;
    });
    var _JsArray_foldl = F3(function(func, acc, array) {
        var length = array.length;
        for(var i = 0; i < length; i++)acc = A2(func, array[i], acc);
        return acc;
    });
    var _JsArray_foldr = F3(function(func, acc, array) {
        for(var i = array.length - 1; i >= 0; i--)acc = A2(func, array[i], acc);
        return acc;
    });
    var _JsArray_map = F2(function(func, array) {
        var length = array.length;
        var result = new Array(length);
        for(var i = 0; i < length; i++)result[i] = func(array[i]);
        return result;
    });
    var _JsArray_indexedMap = F3(function(func, offset, array) {
        var length = array.length;
        var result = new Array(length);
        for(var i = 0; i < length; i++)result[i] = A2(func, offset + i, array[i]);
        return result;
    });
    var _JsArray_slice = F3(function(from, to, array) {
        return array.slice(from, to);
    });
    var _JsArray_appendN = F3(function(n, dest, source) {
        var destLen = dest.length;
        var itemsToCopy = n - destLen;
        if (itemsToCopy > source.length) itemsToCopy = source.length;
        var size = destLen + itemsToCopy;
        var result = new Array(size);
        for(var i = 0; i < destLen; i++)result[i] = dest[i];
        for(var i = 0; i < itemsToCopy; i++)result[i + destLen] = source[i];
        return result;
    });
    // LOG
    var _Debug_log_UNUSED = F2(function(tag, value) {
        return value;
    });
    var _Debug_log = F2(function(tag, value) {
        console.log(tag + ': ' + _Debug_toString(value));
        return value;
    });
    // TODOS
    function _Debug_todo(moduleName, region) {
        return function(message) {
            _Debug_crash(8, moduleName, region, message);
        };
    }
    function _Debug_todoCase(moduleName, region, value) {
        return function(message) {
            _Debug_crash(9, moduleName, region, value, message);
        };
    }
    // TO STRING
    function _Debug_toString_UNUSED(value) {
        return '<internals>';
    }
    function _Debug_toString(value) {
        return _Debug_toAnsiString(false, value);
    }
    function _Debug_toAnsiString(ansi, value) {
        if (typeof value === 'function') return _Debug_internalColor(ansi, '<function>');
        if (typeof value === 'boolean') return _Debug_ctorColor(ansi, value ? 'True' : 'False');
        if (typeof value === 'number') return _Debug_numberColor(ansi, value + '');
        if (value instanceof String) return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
        if (typeof value === 'string') return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
        if (typeof value === 'object' && '$' in value) {
            var tag = value.$;
            if (typeof tag === 'number') return _Debug_internalColor(ansi, '<internals>');
            if (tag[0] === '#') {
                var output = [];
                for(var k in value){
                    if (k === '$') continue;
                    output.push(_Debug_toAnsiString(ansi, value[k]));
                }
                return '(' + output.join(',') + ')';
            }
            if (tag === 'Set_elm_builtin') return _Debug_ctorColor(ansi, 'Set') + _Debug_fadeColor(ansi, '.fromList') + ' ' + _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
            if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin') return _Debug_ctorColor(ansi, 'Dict') + _Debug_fadeColor(ansi, '.fromList') + ' ' + _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
            if (tag === 'Array_elm_builtin') return _Debug_ctorColor(ansi, 'Array') + _Debug_fadeColor(ansi, '.fromList') + ' ' + _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
            if (tag === '::' || tag === '[]') {
                var output = '[';
                value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b);
                for(; value.b; value = value.b)output += ',' + _Debug_toAnsiString(ansi, value.a);
                return output + ']';
            }
            var output = '';
            for(var i in value){
                if (i === '$') continue;
                var str = _Debug_toAnsiString(ansi, value[i]);
                var c0 = str[0];
                var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
                output += ' ' + (parenless ? str : '(' + str + ')');
            }
            return _Debug_ctorColor(ansi, tag) + output;
        }
        if (typeof DataView === 'function' && value instanceof DataView) return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
        if (typeof File !== 'undefined' && value instanceof File) return _Debug_internalColor(ansi, '<' + value.name + '>');
        if (typeof value === 'object') {
            var output = [];
            for(var key in value){
                var field = key[0] === '_' ? key.slice(1) : key;
                output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
            }
            if (output.length === 0) return '{}';
            return '{ ' + output.join(', ') + ' }';
        }
        return _Debug_internalColor(ansi, '<internals>');
    }
    function _Debug_addSlashes(str, isChar) {
        var s = str.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r').replace(/\v/g, '\\v').replace(/\0/g, '\\0');
        if (isChar) return s.replace(/\'/g, '\\\'');
        else return s.replace(/\"/g, '\\"');
    }
    function _Debug_ctorColor(ansi, string) {
        return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
    }
    function _Debug_numberColor(ansi, string) {
        return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
    }
    function _Debug_stringColor(ansi, string) {
        return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
    }
    function _Debug_charColor(ansi, string) {
        return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
    }
    function _Debug_fadeColor(ansi, string) {
        return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
    }
    function _Debug_internalColor(ansi, string) {
        return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
    }
    function _Debug_toHexDigit(n) {
        return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
    }
    // CRASH
    function _Debug_crash_UNUSED(identifier) {
        throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
    }
    function _Debug_crash(identifier, fact1, fact2, fact3, fact4) {
        switch(identifier){
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
                throw new Error('TODO in module `' + moduleName + '` from the `case` expression ' + _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    ' + _Debug_toString(value).replace('\n', '\n    ') + '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    '));
            case 10:
                throw new Error('Bug in https://github.com/elm/virtual-dom/issues');
            case 11:
                throw new Error('Cannot perform mod 0. Division by zero error.');
        }
    }
    function _Debug_regionToString(region) {
        if (region.start.line === region.end.line) return 'on line ' + region.start.line;
        return 'on lines ' + region.start.line + ' through ' + region.end.line;
    }
    // EQUALITY
    function _Utils_eq(x, y) {
        for(var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack); isEqual && (pair = stack.pop()); isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack));
        return isEqual;
    }
    function _Utils_eqHelp(x, y, depth, stack) {
        if (x === y) return true;
        if (typeof x !== 'object' || x === null || y === null) {
            typeof x === 'function' && _Debug_crash(5);
            return false;
        }
        if (depth > 100) {
            stack.push(_Utils_Tuple2(x, y));
            return true;
        }
        /**/ if (x.$ === 'Set_elm_builtin') {
            x = $elm$core$Set$toList(x);
            y = $elm$core$Set$toList(y);
        }
        if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin') {
            x = $elm$core$Dict$toList(x);
            y = $elm$core$Dict$toList(y);
        }
        //*/
        /**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/ for(var key in x){
            if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack)) return false;
        }
        return true;
    }
    var _Utils_equal = F2(_Utils_eq);
    var _Utils_notEqual = F2(function(a, b) {
        return !_Utils_eq(a, b);
    });
    // COMPARISONS
    // Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
    // the particular integer values assigned to LT, EQ, and GT.
    function _Utils_cmp(x, y, ord) {
        if (typeof x !== 'object') return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
        /**/ if (x instanceof String) {
            var a = x.valueOf();
            var b = y.valueOf();
            return a === b ? 0 : a < b ? -1 : 1;
        }
        //*/
        /**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/ /**/ if (x.$[0] === '#') return (ord = _Utils_cmp(x.a, y.a)) ? ord : (ord = _Utils_cmp(x.b, y.b)) ? ord : _Utils_cmp(x.c, y.c);
        // traverse conses until end of a list or a mismatch
        for(; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b); // WHILE_CONSES
        return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
    }
    var _Utils_lt = F2(function(a, b) {
        return _Utils_cmp(a, b) < 0;
    });
    var _Utils_le = F2(function(a, b) {
        return _Utils_cmp(a, b) < 1;
    });
    var _Utils_gt = F2(function(a, b) {
        return _Utils_cmp(a, b) > 0;
    });
    var _Utils_ge = F2(function(a, b) {
        return _Utils_cmp(a, b) >= 0;
    });
    var _Utils_compare = F2(function(x, y) {
        var n = _Utils_cmp(x, y);
        return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
    });
    // COMMON VALUES
    var _Utils_Tuple0_UNUSED = 0;
    var _Utils_Tuple0 = {
        $: '#0'
    };
    function _Utils_Tuple2_UNUSED(a, b) {
        return {
            a: a,
            b: b
        };
    }
    function _Utils_Tuple2(a, b) {
        return {
            $: '#2',
            a: a,
            b: b
        };
    }
    function _Utils_Tuple3_UNUSED(a, b, c) {
        return {
            a: a,
            b: b,
            c: c
        };
    }
    function _Utils_Tuple3(a, b, c) {
        return {
            $: '#3',
            a: a,
            b: b,
            c: c
        };
    }
    function _Utils_chr_UNUSED(c) {
        return c;
    }
    function _Utils_chr(c) {
        return new String(c);
    }
    // RECORDS
    function _Utils_update(oldRecord, updatedFields) {
        var newRecord = {
        };
        for(var key in oldRecord)newRecord[key] = oldRecord[key];
        for(var key in updatedFields)newRecord[key] = updatedFields[key];
        return newRecord;
    }
    // APPEND
    var _Utils_append = F2(_Utils_ap);
    function _Utils_ap(xs, ys) {
        // append Strings
        if (typeof xs === 'string') return xs + ys;
        // append Lists
        if (!xs.b) return ys;
        var root = _List_Cons(xs.a, ys);
        xs = xs.b;
        for(var curr = root; xs.b; xs = xs.b)curr = curr.b = _List_Cons(xs.a, ys);
        return root;
    }
    var _List_Nil_UNUSED = {
        $: 0
    };
    var _List_Nil = {
        $: '[]'
    };
    function _List_Cons_UNUSED(hd, tl) {
        return {
            $: 1,
            a: hd,
            b: tl
        };
    }
    function _List_Cons(hd, tl) {
        return {
            $: '::',
            a: hd,
            b: tl
        };
    }
    var _List_cons = F2(_List_Cons);
    function _List_fromArray(arr) {
        var out = _List_Nil;
        for(var i = arr.length; i--;)out = _List_Cons(arr[i], out);
        return out;
    }
    function _List_toArray(xs) {
        for(var out = []; xs.b; xs = xs.b)out.push(xs.a);
        return out;
    }
    var _List_map2 = F3(function(f, xs, ys) {
        for(var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b)arr.push(A2(f, xs.a, ys.a));
        return _List_fromArray(arr);
    });
    var _List_map3 = F4(function(f, xs, ys, zs) {
        for(var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b)arr.push(A3(f, xs.a, ys.a, zs.a));
        return _List_fromArray(arr);
    });
    var _List_map4 = F5(function(f, ws, xs, ys, zs) {
        for(var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b)arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
        return _List_fromArray(arr);
    });
    var _List_map5 = F6(function(f, vs, ws, xs, ys, zs) {
        for(var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b)arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
        return _List_fromArray(arr);
    });
    var _List_sortBy = F2(function(f, xs) {
        return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
            return _Utils_cmp(f(a), f(b));
        }));
    });
    var _List_sortWith = F2(function(f, xs) {
        return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
            var ord = A2(f, a, b);
            return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
        }));
    });
    // MATH
    var _Basics_add = F2(function(a, b) {
        return a + b;
    });
    var _Basics_sub = F2(function(a, b) {
        return a - b;
    });
    var _Basics_mul = F2(function(a, b) {
        return a * b;
    });
    var _Basics_fdiv = F2(function(a, b) {
        return a / b;
    });
    var _Basics_idiv = F2(function(a, b) {
        return a / b | 0;
    });
    var _Basics_pow = F2(Math.pow);
    var _Basics_remainderBy = F2(function(b, a) {
        return a % b;
    });
    // https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
    var _Basics_modBy = F2(function(modulus, x) {
        var answer = x % modulus;
        return modulus === 0 ? _Debug_crash(11) : answer > 0 && modulus < 0 || answer < 0 && modulus > 0 ? answer + modulus : answer;
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
    function _Basics_toFloat(x) {
        return x;
    }
    function _Basics_truncate(n) {
        return n | 0;
    }
    function _Basics_isInfinite(n) {
        return n === Infinity || n === -Infinity;
    }
    var _Basics_ceiling = Math.ceil;
    var _Basics_floor = Math.floor;
    var _Basics_round = Math.round;
    var _Basics_sqrt = Math.sqrt;
    var _Basics_log = Math.log;
    var _Basics_isNaN = isNaN;
    // BOOLEANS
    function _Basics_not(bool) {
        return !bool;
    }
    var _Basics_and = F2(function(a, b) {
        return a && b;
    });
    var _Basics_or = F2(function(a, b) {
        return a || b;
    });
    var _Basics_xor = F2(function(a, b) {
        return a !== b;
    });
    var _String_cons = F2(function(chr, str) {
        return chr + str;
    });
    function _String_uncons(string) {
        var word = string.charCodeAt(0);
        return !isNaN(word) ? $elm$core$Maybe$Just(55296 <= word && word <= 56319 ? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2)) : _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))) : $elm$core$Maybe$Nothing;
    }
    var _String_append = F2(function(a, b) {
        return a + b;
    });
    function _String_length(str) {
        return str.length;
    }
    var _String_map = F2(function(func, string) {
        var len = string.length;
        var array = new Array(len);
        var i = 0;
        while(i < len){
            var word = string.charCodeAt(i);
            if (55296 <= word && word <= 56319) {
                array[i] = func(_Utils_chr(string[i] + string[i + 1]));
                i += 2;
                continue;
            }
            array[i] = func(_Utils_chr(string[i]));
            i++;
        }
        return array.join('');
    });
    var _String_filter = F2(function(isGood, str) {
        var arr = [];
        var len = str.length;
        var i = 0;
        while(i < len){
            var char = str[i];
            var word = str.charCodeAt(i);
            i++;
            if (55296 <= word && word <= 56319) {
                char += str[i];
                i++;
            }
            if (isGood(_Utils_chr(char))) arr.push(char);
        }
        return arr.join('');
    });
    function _String_reverse(str) {
        var len = str.length;
        var arr = new Array(len);
        var i = 0;
        while(i < len){
            var word = str.charCodeAt(i);
            if (55296 <= word && word <= 56319) {
                arr[len - i] = str[i + 1];
                i++;
                arr[len - i] = str[i - 1];
                i++;
            } else {
                arr[len - i] = str[i];
                i++;
            }
        }
        return arr.join('');
    }
    var _String_foldl = F3(function(func, state, string) {
        var len = string.length;
        var i = 0;
        while(i < len){
            var char = string[i];
            var word = string.charCodeAt(i);
            i++;
            if (55296 <= word && word <= 56319) {
                char += string[i];
                i++;
            }
            state = A2(func, _Utils_chr(char), state);
        }
        return state;
    });
    var _String_foldr = F3(function(func, state, string) {
        var i = string.length;
        while(i--){
            var char = string[i];
            var word = string.charCodeAt(i);
            if (56320 <= word && word <= 57343) {
                i--;
                char = string[i] + char;
            }
            state = A2(func, _Utils_chr(char), state);
        }
        return state;
    });
    var _String_split = F2(function(sep, str) {
        return str.split(sep);
    });
    var _String_join = F2(function(sep, strs) {
        return strs.join(sep);
    });
    var _String_slice = F3(function(start, end, str) {
        return str.slice(start, end);
    });
    function _String_trim(str) {
        return str.trim();
    }
    function _String_trimLeft(str) {
        return str.replace(/^\s+/, '');
    }
    function _String_trimRight(str) {
        return str.replace(/\s+$/, '');
    }
    function _String_words(str) {
        return _List_fromArray(str.trim().split(/\s+/g));
    }
    function _String_lines(str) {
        return _List_fromArray(str.split(/\r\n|\r|\n/g));
    }
    function _String_toUpper(str) {
        return str.toUpperCase();
    }
    function _String_toLower(str) {
        return str.toLowerCase();
    }
    var _String_any = F2(function(isGood, string) {
        var i = string.length;
        while(i--){
            var char = string[i];
            var word = string.charCodeAt(i);
            if (56320 <= word && word <= 57343) {
                i--;
                char = string[i] + char;
            }
            if (isGood(_Utils_chr(char))) return true;
        }
        return false;
    });
    var _String_all = F2(function(isGood, string) {
        var i = string.length;
        while(i--){
            var char = string[i];
            var word = string.charCodeAt(i);
            if (56320 <= word && word <= 57343) {
                i--;
                char = string[i] + char;
            }
            if (!isGood(_Utils_chr(char))) return false;
        }
        return true;
    });
    var _String_contains = F2(function(sub, str) {
        return str.indexOf(sub) > -1;
    });
    var _String_startsWith = F2(function(sub, str) {
        return str.indexOf(sub) === 0;
    });
    var _String_endsWith = F2(function(sub, str) {
        return str.length >= sub.length && str.lastIndexOf(sub) === str.length - sub.length;
    });
    var _String_indexes = F2(function(sub, str) {
        var subLen = sub.length;
        if (subLen < 1) return _List_Nil;
        var i = 0;
        var is = [];
        while((i = str.indexOf(sub, i)) > -1){
            is.push(i);
            i = i + subLen;
        }
        return _List_fromArray(is);
    });
    // TO STRING
    function _String_fromNumber(number) {
        return number + '';
    }
    // INT CONVERSIONS
    function _String_toInt(str) {
        var total = 0;
        var code0 = str.charCodeAt(0);
        var start = code0 == 43 /* + */  || code0 == 45 /* - */  ? 1 : 0;
        for(var i = start; i < str.length; ++i){
            var code = str.charCodeAt(i);
            if (code < 48 || 57 < code) return $elm$core$Maybe$Nothing;
            total = 10 * total + code - 48;
        }
        return i == start ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(code0 == 45 ? -total : total);
    }
    // FLOAT CONVERSIONS
    function _String_toFloat(s) {
        // check if it is a hex, octal, or binary number
        if (s.length === 0 || /[\sxbo]/.test(s)) return $elm$core$Maybe$Nothing;
        var n = +s;
        // faster isNaN check
        return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
    }
    function _String_fromList(chars) {
        return _List_toArray(chars).join('');
    }
    function _Char_toCode(char) {
        var code = char.charCodeAt(0);
        if (55296 <= code && code <= 56319) return (code - 55296) * 1024 + char.charCodeAt(1) - 56320 + 65536;
        return code;
    }
    function _Char_fromCode(code) {
        return _Utils_chr(code < 0 || 1114111 < code ? '\uFFFD' : code <= 65535 ? String.fromCharCode(code) : (code -= 65536, String.fromCharCode(Math.floor(code / 1024) + 55296, code % 1024 + 56320)));
    }
    function _Char_toUpper(char) {
        return _Utils_chr(char.toUpperCase());
    }
    function _Char_toLower(char) {
        return _Utils_chr(char.toLowerCase());
    }
    function _Char_toLocaleUpper(char) {
        return _Utils_chr(char.toLocaleUpperCase());
    }
    function _Char_toLocaleLower(char) {
        return _Utils_chr(char.toLocaleLowerCase());
    }
    /**/ function _Json_errorToString(error) {
        return $elm$json$Json$Decode$errorToString(error);
    }
    //*/
    // CORE DECODERS
    function _Json_succeed(msg) {
        return {
            $: 0,
            a: msg
        };
    }
    function _Json_fail(msg) {
        return {
            $: 1,
            a: msg
        };
    }
    function _Json_decodePrim(decoder) {
        return {
            $: 2,
            b: decoder
        };
    }
    var _Json_decodeInt = _Json_decodePrim(function(value) {
        return typeof value !== 'number' ? _Json_expecting('an INT', value) : -2147483647 < value && value < 2147483647 && (value | 0) === value ? $elm$core$Result$Ok(value) : isFinite(value) && !(value % 1) ? $elm$core$Result$Ok(value) : _Json_expecting('an INT', value);
    });
    var _Json_decodeBool = _Json_decodePrim(function(value) {
        return typeof value === 'boolean' ? $elm$core$Result$Ok(value) : _Json_expecting('a BOOL', value);
    });
    var _Json_decodeFloat = _Json_decodePrim(function(value) {
        return typeof value === 'number' ? $elm$core$Result$Ok(value) : _Json_expecting('a FLOAT', value);
    });
    var _Json_decodeValue = _Json_decodePrim(function(value) {
        return $elm$core$Result$Ok(_Json_wrap(value));
    });
    var _Json_decodeString = _Json_decodePrim(function(value) {
        return typeof value === 'string' ? $elm$core$Result$Ok(value) : value instanceof String ? $elm$core$Result$Ok(value + '') : _Json_expecting('a STRING', value);
    });
    function _Json_decodeList(decoder) {
        return {
            $: 3,
            b: decoder
        };
    }
    function _Json_decodeArray(decoder) {
        return {
            $: 4,
            b: decoder
        };
    }
    function _Json_decodeNull(value) {
        return {
            $: 5,
            c: value
        };
    }
    var _Json_decodeField = F2(function(field, decoder) {
        return {
            $: 6,
            d: field,
            b: decoder
        };
    });
    var _Json_decodeIndex = F2(function(index, decoder) {
        return {
            $: 7,
            e: index,
            b: decoder
        };
    });
    function _Json_decodeKeyValuePairs(decoder) {
        return {
            $: 8,
            b: decoder
        };
    }
    function _Json_mapMany(f, decoders) {
        return {
            $: 9,
            f: f,
            g: decoders
        };
    }
    var _Json_andThen = F2(function(callback, decoder) {
        return {
            $: 10,
            b: decoder,
            h: callback
        };
    });
    function _Json_oneOf(decoders) {
        return {
            $: 11,
            g: decoders
        };
    }
    // DECODING OBJECTS
    var _Json_map1 = F2(function(f, d1) {
        return _Json_mapMany(f, [
            d1
        ]);
    });
    var _Json_map2 = F3(function(f, d1, d2) {
        return _Json_mapMany(f, [
            d1,
            d2
        ]);
    });
    var _Json_map3 = F4(function(f, d1, d2, d3) {
        return _Json_mapMany(f, [
            d1,
            d2,
            d3
        ]);
    });
    var _Json_map4 = F5(function(f, d1, d2, d3, d4) {
        return _Json_mapMany(f, [
            d1,
            d2,
            d3,
            d4
        ]);
    });
    var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5) {
        return _Json_mapMany(f, [
            d1,
            d2,
            d3,
            d4,
            d5
        ]);
    });
    var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6) {
        return _Json_mapMany(f, [
            d1,
            d2,
            d3,
            d4,
            d5,
            d6
        ]);
    });
    var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7) {
        return _Json_mapMany(f, [
            d1,
            d2,
            d3,
            d4,
            d5,
            d6,
            d7
        ]);
    });
    var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8) {
        return _Json_mapMany(f, [
            d1,
            d2,
            d3,
            d4,
            d5,
            d6,
            d7,
            d8
        ]);
    });
    // DECODE
    var _Json_runOnString = F2(function(decoder, string) {
        try {
            var value = JSON.parse(string);
            return _Json_runHelp(decoder, value);
        } catch (e) {
            return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
        }
    });
    var _Json_run = F2(function(decoder, value) {
        return _Json_runHelp(decoder, _Json_unwrap(value));
    });
    function _Json_runHelp(decoder, value) {
        switch(decoder.$){
            case 2:
                return decoder.b(value);
            case 5:
                return value === null ? $elm$core$Result$Ok(decoder.c) : _Json_expecting('null', value);
            case 3:
                if (!_Json_isArray(value)) return _Json_expecting('a LIST', value);
                return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);
            case 4:
                if (!_Json_isArray(value)) return _Json_expecting('an ARRAY', value);
                return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);
            case 6:
                var field = decoder.d;
                if (typeof value !== 'object' || value === null || !(field in value)) return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
                var result = _Json_runHelp(decoder.b, value[field]);
                return $elm$core$Result$isOk(result) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));
            case 7:
                var index = decoder.e;
                if (!_Json_isArray(value)) return _Json_expecting('an ARRAY', value);
                if (index >= value.length) return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
                var result = _Json_runHelp(decoder.b, value[index]);
                return $elm$core$Result$isOk(result) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));
            case 8:
                if (typeof value !== 'object' || value === null || _Json_isArray(value)) return _Json_expecting('an OBJECT', value);
                var keyValuePairs = _List_Nil;
                // TODO test perf of Object.keys and switch when support is good enough
                for(var key in value)if (value.hasOwnProperty(key)) {
                    var result = _Json_runHelp(decoder.b, value[key]);
                    if (!$elm$core$Result$isOk(result)) return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
                    keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
                }
                return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));
            case 9:
                var answer = decoder.f;
                var decoders = decoder.g;
                for(var i = 0; i < decoders.length; i++){
                    var result = _Json_runHelp(decoders[i], value);
                    if (!$elm$core$Result$isOk(result)) return result;
                    answer = answer(result.a);
                }
                return $elm$core$Result$Ok(answer);
            case 10:
                var result = _Json_runHelp(decoder.b, value);
                return !$elm$core$Result$isOk(result) ? result : _Json_runHelp(decoder.h(result.a), value);
            case 11:
                var errors = _List_Nil;
                for(var temp = decoder.g; temp.b; temp = temp.b){
                    var result = _Json_runHelp(temp.a, value);
                    if ($elm$core$Result$isOk(result)) return result;
                    errors = _List_Cons(result.a, errors);
                }
                return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));
            case 1:
                return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));
            case 0:
                return $elm$core$Result$Ok(decoder.a);
        }
    }
    function _Json_runArrayDecoder(decoder, value, toElmValue) {
        var len = value.length;
        var array = new Array(len);
        for(var i = 0; i < len; i++){
            var result = _Json_runHelp(decoder, value[i]);
            if (!$elm$core$Result$isOk(result)) return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
            array[i] = result.a;
        }
        return $elm$core$Result$Ok(toElmValue(array));
    }
    function _Json_isArray(value) {
        return Array.isArray(value) || typeof FileList !== 'undefined' && value instanceof FileList;
    }
    function _Json_toElmArray(array) {
        return A2($elm$core$Array$initialize, array.length, function(i) {
            return array[i];
        });
    }
    function _Json_expecting(type, value) {
        return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
    }
    // EQUALITY
    function _Json_equality(x, y) {
        if (x === y) return true;
        if (x.$ !== y.$) return false;
        switch(x.$){
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
    function _Json_listEquality(aDecoders, bDecoders) {
        var len = aDecoders.length;
        if (len !== bDecoders.length) return false;
        for(var i = 0; i < len; i++){
            if (!_Json_equality(aDecoders[i], bDecoders[i])) return false;
        }
        return true;
    }
    // ENCODE
    var _Json_encode = F2(function(indentLevel, value) {
        return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
    });
    function _Json_wrap(value) {
        return {
            $: 0,
            a: value
        };
    }
    function _Json_unwrap(value) {
        return value.a;
    }
    function _Json_wrap_UNUSED(value) {
        return value;
    }
    function _Json_unwrap_UNUSED(value) {
        return value;
    }
    function _Json_emptyArray() {
        return [];
    }
    function _Json_emptyObject() {
        return {
        };
    }
    var _Json_addField = F3(function(key, value, object) {
        object[key] = _Json_unwrap(value);
        return object;
    });
    function _Json_addEntry(func) {
        return F2(function(entry, array) {
            array.push(_Json_unwrap(func(entry)));
            return array;
        });
    }
    var _Json_encodeNull = _Json_wrap(null);
    // TASKS
    function _Scheduler_succeed(value) {
        return {
            $: 0,
            a: value
        };
    }
    function _Scheduler_fail(error) {
        return {
            $: 1,
            a: error
        };
    }
    function _Scheduler_binding(callback) {
        return {
            $: 2,
            b: callback,
            c: null
        };
    }
    var _Scheduler_andThen = F2(function(callback, task) {
        return {
            $: 3,
            b: callback,
            d: task
        };
    });
    var _Scheduler_onError = F2(function(callback, task) {
        return {
            $: 4,
            b: callback,
            d: task
        };
    });
    function _Scheduler_receive(callback) {
        return {
            $: 5,
            b: callback
        };
    }
    // PROCESSES
    var _Scheduler_guid = 0;
    function _Scheduler_rawSpawn(task) {
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
    function _Scheduler_spawn(task) {
        return _Scheduler_binding(function(callback) {
            callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
        });
    }
    function _Scheduler_rawSend(proc, msg) {
        proc.h.push(msg);
        _Scheduler_enqueue(proc);
    }
    var _Scheduler_send = F2(function(proc, msg) {
        return _Scheduler_binding(function(callback) {
            _Scheduler_rawSend(proc, msg);
            callback(_Scheduler_succeed(_Utils_Tuple0));
        });
    });
    function _Scheduler_kill(proc) {
        return _Scheduler_binding(function(callback) {
            var task = proc.f;
            if (task.$ === 2 && task.c) task.c();
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

*/ var _Scheduler_working = false;
    var _Scheduler_queue = [];
    function _Scheduler_enqueue(proc) {
        _Scheduler_queue.push(proc);
        if (_Scheduler_working) return;
        _Scheduler_working = true;
        while(proc = _Scheduler_queue.shift())_Scheduler_step(proc);
        _Scheduler_working = false;
    }
    function _Scheduler_step(proc) {
        while(proc.f){
            var rootTag = proc.f.$;
            if (rootTag === 0 || rootTag === 1) {
                while(proc.g && proc.g.$ !== rootTag)proc.g = proc.g.i;
                if (!proc.g) return;
                proc.f = proc.g.b(proc.f.a);
                proc.g = proc.g.i;
            } else if (rootTag === 2) {
                proc.f.c = proc.f.b(function(newRoot) {
                    proc.f = newRoot;
                    _Scheduler_enqueue(proc);
                });
                return;
            } else if (rootTag === 5) {
                if (proc.h.length === 0) return;
                proc.f = proc.f.b(proc.h.shift());
            } else {
                proc.g = {
                    $: rootTag === 3 ? 0 : 1,
                    b: proc.f.b,
                    i: proc.g
                };
                proc.f = proc.f.d;
            }
        }
    }
    function _Process_sleep(time) {
        return _Scheduler_binding(function(callback) {
            var id = setTimeout(function() {
                callback(_Scheduler_succeed(_Utils_Tuple0));
            }, time);
            return function() {
                clearTimeout(id);
            };
        });
    }
    // PROGRAMS
    var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args) {
        return _Platform_initialize(flagDecoder, args, impl.init, impl.update, impl.subscriptions, function() {
            return function() {
            };
        });
    });
    // INITIALIZE A PROGRAM
    function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder) {
        var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
        $elm$core$Result$isOk(result) || _Debug_crash(2 /**/ , _Json_errorToString(result.a));
        var managers = {
        };
        var initPair = init(result.a);
        var model = initPair.a;
        var stepper = stepperBuilder(sendToApp, model);
        var ports = _Platform_setupEffects(managers, sendToApp);
        function sendToApp(msg, viewMetadata) {
            var pair = A2(update, msg, model);
            stepper(model = pair.a, viewMetadata);
            _Platform_enqueueEffects(managers, pair.b, subscriptions(model));
        }
        _Platform_enqueueEffects(managers, initPair.b, subscriptions(model));
        return ports ? {
            ports: ports
        } : {
        };
    }
    // TRACK PRELOADS
    //
    // This is used by code in elm/browser and elm/http
    // to register any HTTP requests that are triggered by init.
    //
    var _Platform_preload;
    function _Platform_registerPreload(url) {
        _Platform_preload.add(url);
    }
    // EFFECT MANAGERS
    var _Platform_effectManagers = {
    };
    function _Platform_setupEffects(managers, sendToApp) {
        var ports;
        // setup all necessary effect managers
        for(var key in _Platform_effectManagers){
            var manager = _Platform_effectManagers[key];
            if (manager.a) {
                ports = ports || {
                };
                ports[key] = manager.a(key, sendToApp);
            }
            managers[key] = _Platform_instantiateManager(manager, sendToApp);
        }
        return ports;
    }
    function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap) {
        return {
            b: init,
            c: onEffects,
            d: onSelfMsg,
            e: cmdMap,
            f: subMap
        };
    }
    function _Platform_instantiateManager(info, sendToApp) {
        var router = {
            g: sendToApp,
            h: undefined
        };
        var onEffects = info.c;
        var onSelfMsg = info.d;
        var cmdMap = info.e;
        var subMap = info.f;
        function loop(state) {
            return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg) {
                var value = msg.a;
                if (msg.$ === 0) return A3(onSelfMsg, router, value, state);
                return cmdMap && subMap ? A4(onEffects, router, value.i, value.j, state) : A3(onEffects, router, cmdMap ? value.i : value.j, state);
            }));
        }
        return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
    }
    // ROUTING
    var _Platform_sendToApp = F2(function(router, msg) {
        return _Scheduler_binding(function(callback) {
            router.g(msg);
            callback(_Scheduler_succeed(_Utils_Tuple0));
        });
    });
    var _Platform_sendToSelf = F2(function(router, msg) {
        return A2(_Scheduler_send, router.h, {
            $: 0,
            a: msg
        });
    });
    // BAGS
    function _Platform_leaf(home) {
        return function(value) {
            return {
                $: 1,
                k: home,
                l: value
            };
        };
    }
    function _Platform_batch(list) {
        return {
            $: 2,
            m: list
        };
    }
    var _Platform_map = F2(function(tagger, bag) {
        return {
            $: 3,
            n: tagger,
            o: bag
        };
    });
    // PIPE BAGS INTO EFFECT MANAGERS
    //
    // Effects must be queued!
    //
    // Say your init contains a synchronous command, like Time.now or Time.here
    //
    //   - This will produce a batch of effects (FX_1)
    //   - The synchronous task triggers the subsequent `update` call
    //   - This will produce a batch of effects (FX_2)
    //
    // If we just start dispatching FX_2, subscriptions from FX_2 can be processed
    // before subscriptions from FX_1. No good! Earlier versions of this code had
    // this problem, leading to these reports:
    //
    //   https://github.com/elm/core/issues/980
    //   https://github.com/elm/core/pull/981
    //   https://github.com/elm/compiler/issues/1776
    //
    // The queue is necessary to avoid ordering issues for synchronous commands.
    // Why use true/false here? Why not just check the length of the queue?
    // The goal is to detect "are we currently dispatching effects?" If we
    // are, we need to bail and let the ongoing while loop handle things.
    //
    // Now say the queue has 1 element. When we dequeue the final element,
    // the queue will be empty, but we are still actively dispatching effects.
    // So you could get queue jumping in a really tricky category of cases.
    //
    var _Platform_effectsQueue = [];
    var _Platform_effectsActive = false;
    function _Platform_enqueueEffects(managers, cmdBag, subBag) {
        _Platform_effectsQueue.push({
            p: managers,
            q: cmdBag,
            r: subBag
        });
        if (_Platform_effectsActive) return;
        _Platform_effectsActive = true;
        for(var fx; fx = _Platform_effectsQueue.shift();)_Platform_dispatchEffects(fx.p, fx.q, fx.r);
        _Platform_effectsActive = false;
    }
    function _Platform_dispatchEffects(managers, cmdBag, subBag) {
        var effectsDict = {
        };
        _Platform_gatherEffects(true, cmdBag, effectsDict, null);
        _Platform_gatherEffects(false, subBag, effectsDict, null);
        for(var home in managers)_Scheduler_rawSend(managers[home], {
            $: 'fx',
            a: effectsDict[home] || {
                i: _List_Nil,
                j: _List_Nil
            }
        });
    }
    function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers) {
        switch(bag.$){
            case 1:
                var home = bag.k;
                var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
                effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
                return;
            case 2:
                for(var list = bag.m; list.b; list = list.b)_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
                return;
            case 3:
                _Platform_gatherEffects(isCmd, bag.o, effectsDict, {
                    s: bag.n,
                    t: taggers
                });
                return;
        }
    }
    function _Platform_toEffect(isCmd, home, taggers, value) {
        function applyTaggers(x) {
            for(var temp = taggers; temp; temp = temp.t)x = temp.s(x);
            return x;
        }
        var map = isCmd ? _Platform_effectManagers[home].e : _Platform_effectManagers[home].f;
        return A2(map, applyTaggers, value);
    }
    function _Platform_insert(isCmd, newEffect, effects) {
        effects = effects || {
            i: _List_Nil,
            j: _List_Nil
        };
        isCmd ? effects.i = _List_Cons(newEffect, effects.i) : effects.j = _List_Cons(newEffect, effects.j);
        return effects;
    }
    // PORTS
    function _Platform_checkPortName(name) {
        if (_Platform_effectManagers[name]) _Debug_crash(3, name);
    }
    // OUTGOING PORTS
    function _Platform_outgoingPort(name, converter) {
        _Platform_checkPortName(name);
        _Platform_effectManagers[name] = {
            e: _Platform_outgoingPortMap,
            u: converter,
            a: _Platform_setupOutgoingPort
        };
        return _Platform_leaf(name);
    }
    var _Platform_outgoingPortMap = F2(function(tagger, value) {
        return value;
    });
    function _Platform_setupOutgoingPort(name) {
        var subs = [];
        var converter = _Platform_effectManagers[name].u;
        // CREATE MANAGER
        var init = _Process_sleep(0);
        _Platform_effectManagers[name].b = init;
        _Platform_effectManagers[name].c = F3(function(router, cmdList, state) {
            for(; cmdList.b; cmdList = cmdList.b){
                // grab a separate reference to subs in case unsubscribe is called
                var currentSubs = subs;
                var value = _Json_unwrap(converter(cmdList.a));
                for(var i = 0; i < currentSubs.length; i++)currentSubs[i](value);
            }
            return init;
        });
        // PUBLIC API
        function subscribe(callback) {
            subs.push(callback);
        }
        function unsubscribe(callback) {
            // copy subs into a new array in case unsubscribe is called within a
            // subscribed callback
            subs = subs.slice();
            var index = subs.indexOf(callback);
            if (index >= 0) subs.splice(index, 1);
        }
        return {
            subscribe: subscribe,
            unsubscribe: unsubscribe
        };
    }
    // INCOMING PORTS
    function _Platform_incomingPort(name, converter) {
        _Platform_checkPortName(name);
        _Platform_effectManagers[name] = {
            f: _Platform_incomingPortMap,
            u: converter,
            a: _Platform_setupIncomingPort
        };
        return _Platform_leaf(name);
    }
    var _Platform_incomingPortMap = F2(function(tagger, finalTagger) {
        return function(value) {
            return tagger(finalTagger(value));
        };
    });
    function _Platform_setupIncomingPort(name, sendToApp) {
        var subs = _List_Nil;
        var converter = _Platform_effectManagers[name].u;
        // CREATE MANAGER
        var init = _Scheduler_succeed(null);
        _Platform_effectManagers[name].b = init;
        _Platform_effectManagers[name].c = F3(function(router, subList, state) {
            subs = subList;
            return init;
        });
        // PUBLIC API
        function send(incomingValue) {
            var result = A2(_Json_run, converter, _Json_wrap(incomingValue));
            $elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);
            var value = result.a;
            for(var temp = subs; temp.b; temp = temp.b)sendToApp(temp.a(value));
        }
        return {
            send: send
        };
    }
    // EXPORT ELM MODULES
    //
    // Have DEBUG and PROD versions so that we can (1) give nicer errors in
    // debug mode and (2) not pay for the bits needed for that in prod mode.
    //
    function _Platform_export_UNUSED(exports) {
        scope['Elm'] ? _Platform_mergeExportsProd(scope['Elm'], exports) : scope['Elm'] = exports;
    }
    function _Platform_mergeExportsProd(obj, exports) {
        for(var name in exports)name in obj ? name == 'init' ? _Debug_crash(6) : _Platform_mergeExportsProd(obj[name], exports[name]) : obj[name] = exports[name];
    }
    function _Platform_export(exports) {
        scope['Elm'] ? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports) : scope['Elm'] = exports;
    }
    function _Platform_mergeExportsDebug(moduleName, obj, exports) {
        for(var name in exports)name in obj ? name == 'init' ? _Debug_crash(6, moduleName) : _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name]) : obj[name] = exports[name];
    }
    // HELPERS
    var _VirtualDom_divertHrefToApp;
    var _VirtualDom_doc = typeof document !== 'undefined' ? document : {
    };
    function _VirtualDom_appendChild(parent, child) {
        parent.appendChild(child);
    }
    var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args) {
        // NOTE: this function needs _Platform_export available to work
        /**_UNUSED/
	var node = args['node'];
	//*/ /**/ var node = args && args['node'] ? args['node'] : _Debug_crash(0);
        //*/
        node.parentNode.replaceChild(_VirtualDom_render(virtualNode, function() {
        }), node);
        return {
        };
    });
    // TEXT
    function _VirtualDom_text(string) {
        return {
            $: 0,
            a: string
        };
    }
    // NODE
    var _VirtualDom_nodeNS = F2(function(namespace, tag) {
        return F2(function(factList, kidList) {
            for(var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b){
                var kid = kidList.a;
                descendantsCount += kid.b || 0;
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
    var _VirtualDom_keyedNodeNS = F2(function(namespace, tag) {
        return F2(function(factList, kidList) {
            for(var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b){
                var kid = kidList.a;
                descendantsCount += kid.b.b || 0;
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
    function _VirtualDom_custom(factList, model, render, diff) {
        return {
            $: 3,
            d: _VirtualDom_organizeFacts(factList),
            g: model,
            h: render,
            i: diff
        };
    }
    // MAP
    var _VirtualDom_map = F2(function(tagger, node) {
        return {
            $: 4,
            j: tagger,
            k: node,
            b: 1 + (node.b || 0)
        };
    });
    // LAZY
    function _VirtualDom_thunk(refs, thunk) {
        return {
            $: 5,
            l: refs,
            m: thunk,
            k: undefined
        };
    }
    var _VirtualDom_lazy = F2(function(func, a) {
        return _VirtualDom_thunk([
            func,
            a
        ], function() {
            return func(a);
        });
    });
    var _VirtualDom_lazy2 = F3(function(func, a, b) {
        return _VirtualDom_thunk([
            func,
            a,
            b
        ], function() {
            return A2(func, a, b);
        });
    });
    var _VirtualDom_lazy3 = F4(function(func, a, b, c) {
        return _VirtualDom_thunk([
            func,
            a,
            b,
            c
        ], function() {
            return A3(func, a, b, c);
        });
    });
    var _VirtualDom_lazy4 = F5(function(func, a, b, c, d) {
        return _VirtualDom_thunk([
            func,
            a,
            b,
            c,
            d
        ], function() {
            return A4(func, a, b, c, d);
        });
    });
    var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e) {
        return _VirtualDom_thunk([
            func,
            a,
            b,
            c,
            d,
            e
        ], function() {
            return A5(func, a, b, c, d, e);
        });
    });
    var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f) {
        return _VirtualDom_thunk([
            func,
            a,
            b,
            c,
            d,
            e,
            f
        ], function() {
            return A6(func, a, b, c, d, e, f);
        });
    });
    var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g) {
        return _VirtualDom_thunk([
            func,
            a,
            b,
            c,
            d,
            e,
            f,
            g
        ], function() {
            return A7(func, a, b, c, d, e, f, g);
        });
    });
    var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h) {
        return _VirtualDom_thunk([
            func,
            a,
            b,
            c,
            d,
            e,
            f,
            g,
            h
        ], function() {
            return A8(func, a, b, c, d, e, f, g, h);
        });
    });
    // FACTS
    var _VirtualDom_on = F2(function(key, handler) {
        return {
            $: 'a0',
            n: key,
            o: handler
        };
    });
    var _VirtualDom_style = F2(function(key, value) {
        return {
            $: 'a1',
            n: key,
            o: value
        };
    });
    var _VirtualDom_property = F2(function(key, value) {
        return {
            $: 'a2',
            n: key,
            o: value
        };
    });
    var _VirtualDom_attribute = F2(function(key, value) {
        return {
            $: 'a3',
            n: key,
            o: value
        };
    });
    var _VirtualDom_attributeNS = F3(function(namespace, key, value) {
        return {
            $: 'a4',
            n: key,
            o: {
                f: namespace,
                o: value
            }
        };
    });
    // XSS ATTACK VECTOR CHECKS
    function _VirtualDom_noScript(tag) {
        return tag == 'script' ? 'p' : tag;
    }
    function _VirtualDom_noOnOrFormAction(key) {
        return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
    }
    function _VirtualDom_noInnerHtmlOrFormAction(key) {
        return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
    }
    function _VirtualDom_noJavaScriptUri_UNUSED(value) {
        return /^javascript:/i.test(value.replace(/\s/g, '')) ? '' : value;
    }
    function _VirtualDom_noJavaScriptUri(value) {
        return /^javascript:/i.test(value.replace(/\s/g, '')) ? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")' : value;
    }
    function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value) {
        return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
    }
    function _VirtualDom_noJavaScriptOrHtmlUri(value) {
        return /^\s*(javascript:|data:text\/html)/i.test(value) ? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")' : value;
    }
    // MAP FACTS
    var _VirtualDom_mapAttribute = F2(function(func, attr) {
        return attr.$ === 'a0' ? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o)) : attr;
    });
    function _VirtualDom_mapHandler(func, handler) {
        var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);
        // 0 = Normal
        // 1 = MayStopPropagation
        // 2 = MayPreventDefault
        // 3 = Custom
        return {
            $: handler.$,
            a: !tag ? A2($elm$json$Json$Decode$map, func, handler.a) : A3($elm$json$Json$Decode$map2, tag < 3 ? _VirtualDom_mapEventTuple : _VirtualDom_mapEventRecord, $elm$json$Json$Decode$succeed(func), handler.a)
        };
    }
    var _VirtualDom_mapEventTuple = F2(function(func, tuple) {
        return _Utils_Tuple2(func(tuple.a), tuple.b);
    });
    var _VirtualDom_mapEventRecord = F2(function(func, record) {
        return {
            message: func(record.message),
            stopPropagation: record.stopPropagation,
            preventDefault: record.preventDefault
        };
    });
    // ORGANIZE FACTS
    function _VirtualDom_organizeFacts(factList) {
        for(var facts = {
        }; factList.b; factList = factList.b){
            var entry = factList.a;
            var tag = entry.$;
            var key = entry.n;
            var value = entry.o;
            if (tag === 'a2') {
                key === 'className' ? _VirtualDom_addClass(facts, key, _Json_unwrap(value)) : facts[key] = _Json_unwrap(value);
                continue;
            }
            var subFacts = facts[tag] || (facts[tag] = {
            });
            tag === 'a3' && key === 'class' ? _VirtualDom_addClass(subFacts, key, value) : subFacts[key] = value;
        }
        return facts;
    }
    function _VirtualDom_addClass(object, key, newClass) {
        var classes = object[key];
        object[key] = classes ? classes + ' ' + newClass : newClass;
    }
    // RENDER
    function _VirtualDom_render(vNode, eventNode) {
        var tag = vNode.$;
        if (tag === 5) return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
        if (tag === 0) return _VirtualDom_doc.createTextNode(vNode.a);
        if (tag === 4) {
            var subNode = vNode.k;
            var tagger = vNode.j;
            while(subNode.$ === 4){
                typeof tagger !== 'object' ? tagger = [
                    tagger,
                    subNode.j
                ] : tagger.push(subNode.j);
                subNode = subNode.k;
            }
            var subEventRoot = {
                j: tagger,
                p: eventNode
            };
            var domNode = _VirtualDom_render(subNode, subEventRoot);
            domNode.elm_event_node_ref = subEventRoot;
            return domNode;
        }
        if (tag === 3) {
            var domNode = vNode.h(vNode.g);
            _VirtualDom_applyFacts(domNode, eventNode, vNode.d);
            return domNode;
        }
        // at this point `tag` must be 1 or 2
        var domNode = vNode.f ? _VirtualDom_doc.createElementNS(vNode.f, vNode.c) : _VirtualDom_doc.createElement(vNode.c);
        if (_VirtualDom_divertHrefToApp && vNode.c == 'a') domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
        _VirtualDom_applyFacts(domNode, eventNode, vNode.d);
        for(var kids = vNode.e, i = 0; i < kids.length; i++)_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
        return domNode;
    }
    // APPLY FACTS
    function _VirtualDom_applyFacts(domNode, eventNode, facts) {
        for(var key in facts){
            var value = facts[key];
            key === 'a1' ? _VirtualDom_applyStyles(domNode, value) : key === 'a0' ? _VirtualDom_applyEvents(domNode, eventNode, value) : key === 'a3' ? _VirtualDom_applyAttrs(domNode, value) : key === 'a4' ? _VirtualDom_applyAttrsNS(domNode, value) : (key !== 'value' && key !== 'checked' || domNode[key] !== value) && (domNode[key] = value);
        }
    }
    // APPLY STYLES
    function _VirtualDom_applyStyles(domNode, styles) {
        var domNodeStyle = domNode.style;
        for(var key in styles)domNodeStyle[key] = styles[key];
    }
    // APPLY ATTRS
    function _VirtualDom_applyAttrs(domNode, attrs) {
        for(var key in attrs){
            var value = attrs[key];
            typeof value !== 'undefined' ? domNode.setAttribute(key, value) : domNode.removeAttribute(key);
        }
    }
    // APPLY NAMESPACED ATTRS
    function _VirtualDom_applyAttrsNS(domNode, nsAttrs) {
        for(var key in nsAttrs){
            var pair = nsAttrs[key];
            var namespace = pair.f;
            var value = pair.o;
            typeof value !== 'undefined' ? domNode.setAttributeNS(namespace, key, value) : domNode.removeAttributeNS(namespace, key);
        }
    }
    // APPLY EVENTS
    function _VirtualDom_applyEvents(domNode, eventNode, events) {
        var allCallbacks = domNode.elmFs || (domNode.elmFs = {
        });
        for(var key in events){
            var newHandler = events[key];
            var oldCallback = allCallbacks[key];
            if (!newHandler) {
                domNode.removeEventListener(key, oldCallback);
                allCallbacks[key] = undefined;
                continue;
            }
            if (oldCallback) {
                var oldHandler = oldCallback.q;
                if (oldHandler.$ === newHandler.$) {
                    oldCallback.q = newHandler;
                    continue;
                }
                domNode.removeEventListener(key, oldCallback);
            }
            oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
            domNode.addEventListener(key, oldCallback, _VirtualDom_passiveSupported && {
                passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2
            });
            allCallbacks[key] = oldCallback;
        }
    }
    // PASSIVE EVENTS
    var _VirtualDom_passiveSupported;
    try {
        window.addEventListener('t', null, Object.defineProperty({
        }, 'passive', {
            get: function() {
                _VirtualDom_passiveSupported = true;
            }
        }));
    } catch (e) {
    }
    // EVENT HANDLERS
    function _VirtualDom_makeCallback(eventNode, initialHandler) {
        function callback(event) {
            var handler = callback.q;
            var result = _Json_runHelp(handler.a, event);
            if (!$elm$core$Result$isOk(result)) return;
            var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);
            // 0 = Normal
            // 1 = MayStopPropagation
            // 2 = MayPreventDefault
            // 3 = Custom
            var value = result.a;
            var message = !tag ? value : tag < 3 ? value.a : value.message;
            var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
            var currentEventNode = (stopPropagation && event.stopPropagation(), (tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(), eventNode);
            var tagger;
            var i;
            while(tagger = currentEventNode.j){
                if (typeof tagger == 'function') message = tagger(message);
                else for(var i = tagger.length; i--;)message = tagger[i](message);
                currentEventNode = currentEventNode.p;
            }
            currentEventNode(message, stopPropagation); // stopPropagation implies isSync
        }
        callback.q = initialHandler;
        return callback;
    }
    function _VirtualDom_equalEvents(x, y) {
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
    function _VirtualDom_diff(x, y) {
        var patches = [];
        _VirtualDom_diffHelp(x, y, patches, 0);
        return patches;
    }
    function _VirtualDom_pushPatch(patches, type, index, data) {
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
    function _VirtualDom_diffHelp(x, y, patches, index) {
        if (x === y) return;
        var xType = x.$;
        var yType = y.$;
        // Bail if you run into different types of nodes. Implies that the
        // structure has changed significantly and it's not worth a diff.
        if (xType !== yType) {
            if (xType === 1 && yType === 2) {
                y = _VirtualDom_dekey(y);
                yType = 1;
            } else {
                _VirtualDom_pushPatch(patches, 0, index, y);
                return;
            }
        }
        // Now we know that both nodes are the same $.
        switch(yType){
            case 5:
                var xRefs = x.l;
                var yRefs = y.l;
                var i = xRefs.length;
                var same = i === yRefs.length;
                while(same && i--)same = xRefs[i] === yRefs[i];
                if (same) {
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
                while(xSubNode.$ === 4){
                    nesting = true;
                    typeof xTaggers !== 'object' ? xTaggers = [
                        xTaggers,
                        xSubNode.j
                    ] : xTaggers.push(xSubNode.j);
                    xSubNode = xSubNode.k;
                }
                var ySubNode = y.k;
                while(ySubNode.$ === 4){
                    nesting = true;
                    typeof yTaggers !== 'object' ? yTaggers = [
                        yTaggers,
                        ySubNode.j
                    ] : yTaggers.push(ySubNode.j);
                    ySubNode = ySubNode.k;
                }
                // Just bail if different numbers of taggers. This implies the
                // structure of the virtual DOM has changed.
                if (nesting && xTaggers.length !== yTaggers.length) {
                    _VirtualDom_pushPatch(patches, 0, index, y);
                    return;
                }
                // check if taggers are "the same"
                if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers) _VirtualDom_pushPatch(patches, 2, index, yTaggers);
                // diff everything below the taggers
                _VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
                return;
            case 0:
                if (x.a !== y.a) _VirtualDom_pushPatch(patches, 3, index, y.a);
                return;
            case 1:
                _VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
                return;
            case 2:
                _VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
                return;
            case 3:
                if (x.h !== y.h) {
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
    function _VirtualDom_pairwiseRefEqual(as, bs) {
        for(var i = 0; i < as.length; i++){
            if (as[i] !== bs[i]) return false;
        }
        return true;
    }
    function _VirtualDom_diffNodes(x, y, patches, index, diffKids) {
        // Bail if obvious indicators have changed. Implies more serious
        // structural changes such that it's not worth it to diff.
        if (x.c !== y.c || x.f !== y.f) {
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
    function _VirtualDom_diffFacts(x, y, category) {
        var diff;
        // look for changes and removals
        for(var xKey in x){
            if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4') {
                var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {
                }, xKey);
                if (subDiff) {
                    diff = diff || {
                    };
                    diff[xKey] = subDiff;
                }
                continue;
            }
            // remove if not in the new facts
            if (!(xKey in y)) {
                diff = diff || {
                };
                diff[xKey] = !category ? typeof x[xKey] === 'string' ? '' : null : category === 'a1' ? '' : category === 'a0' || category === 'a3' ? undefined : {
                    f: x[xKey].f,
                    o: undefined
                };
                continue;
            }
            var xValue = x[xKey];
            var yValue = y[xKey];
            // reference equal, so don't worry about it
            if (xValue === yValue && xKey !== 'value' && xKey !== 'checked' || category === 'a0' && _VirtualDom_equalEvents(xValue, yValue)) continue;
            diff = diff || {
            };
            diff[xKey] = yValue;
        }
        // add new stuff
        for(var yKey in y)if (!(yKey in x)) {
            diff = diff || {
            };
            diff[yKey] = y[yKey];
        }
        return diff;
    }
    // DIFF KIDS
    function _VirtualDom_diffKids(xParent, yParent, patches, index) {
        var xKids = xParent.e;
        var yKids = yParent.e;
        var xLen = xKids.length;
        var yLen = yKids.length;
        // FIGURE OUT IF THERE ARE INSERTS OR REMOVALS
        if (xLen > yLen) _VirtualDom_pushPatch(patches, 6, index, {
            v: yLen,
            i: xLen - yLen
        });
        else if (xLen < yLen) _VirtualDom_pushPatch(patches, 7, index, {
            v: xLen,
            e: yKids
        });
        // PAIRWISE DIFF EVERYTHING ELSE
        for(var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++){
            var xKid = xKids[i];
            _VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
            index += xKid.b || 0;
        }
    }
    // KEYED DIFF
    function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex) {
        var localPatches = [];
        var changes = {
        }; // Dict String Entry
        var inserts = []; // Array { index : Int, entry : Entry }
        // type Entry = { tag : String, vnode : VNode, index : Int, data : _ }
        var xKids = xParent.e;
        var yKids = yParent.e;
        var xLen = xKids.length;
        var yLen = yKids.length;
        var xIndex = 0;
        var yIndex = 0;
        var index = rootIndex;
        while(xIndex < xLen && yIndex < yLen){
            var x = xKids[xIndex];
            var y = yKids[yIndex];
            var xKey = x.a;
            var yKey = y.a;
            var xNode = x.b;
            var yNode = y.b;
            var newMatch = undefined;
            var oldMatch = undefined;
            // check if keys match
            if (xKey === yKey) {
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
            if (xNext) {
                var xNextKey = xNext.a;
                var xNextNode = xNext.b;
                oldMatch = yKey === xNextKey;
            }
            if (yNext) {
                var yNextKey = yNext.a;
                var yNextNode = yNext.b;
                newMatch = xKey === yNextKey;
            }
            // swap x and y
            if (newMatch && oldMatch) {
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
            if (newMatch) {
                index++;
                _VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
                _VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
                index += xNode.b || 0;
                xIndex += 1;
                yIndex += 2;
                continue;
            }
            // remove x
            if (oldMatch) {
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
            if (xNext && xNextKey === yNextKey) {
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
        while(xIndex < xLen){
            index++;
            var x = xKids[xIndex];
            var xNode = x.b;
            _VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
            index += xNode.b || 0;
            xIndex++;
        }
        while(yIndex < yLen){
            var endInserts = endInserts || [];
            var y = yKids[yIndex];
            _VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
            yIndex++;
        }
        if (localPatches.length > 0 || inserts.length > 0 || endInserts) _VirtualDom_pushPatch(patches, 8, rootIndex, {
            w: localPatches,
            x: inserts,
            y: endInserts
        });
    }
    // CHANGES FROM KEYED DIFF
    var _VirtualDom_POSTFIX = '_elmW6BL';
    function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts) {
        var entry = changes[key];
        // never seen this key before
        if (!entry) {
            entry = {
                c: 0,
                z: vnode,
                r: yIndex,
                s: undefined
            };
            inserts.push({
                r: yIndex,
                A: entry
            });
            changes[key] = entry;
            return;
        }
        // this key was removed earlier, a match!
        if (entry.c === 1) {
            inserts.push({
                r: yIndex,
                A: entry
            });
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
    function _VirtualDom_removeNode(changes, localPatches, key, vnode, index) {
        var entry = changes[key];
        // never seen this key before
        if (!entry) {
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
        if (entry.c === 0) {
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
    function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode) {
        _VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
    }
    // assumes `patches` is non-empty and indexes increase monotonically.
    function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode) {
        var patch = patches[i];
        var index = patch.r;
        while(index === low){
            var patchType = patch.$;
            if (patchType === 1) _VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
            else if (patchType === 8) {
                patch.t = domNode;
                patch.u = eventNode;
                var subPatches = patch.s.w;
                if (subPatches.length > 0) _VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
            } else if (patchType === 9) {
                patch.t = domNode;
                patch.u = eventNode;
                var data = patch.s;
                if (data) {
                    data.A.s = domNode;
                    var subPatches = data.w;
                    if (subPatches.length > 0) _VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
                }
            } else {
                patch.t = domNode;
                patch.u = eventNode;
            }
            i++;
            if (!(patch = patches[i]) || (index = patch.r) > high) return i;
        }
        var tag = vNode.$;
        if (tag === 4) {
            var subNode = vNode.k;
            while(subNode.$ === 4)subNode = subNode.k;
            return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
        }
        // tag must be 1 or 2 at this point
        var vKids = vNode.e;
        var childNodes = domNode.childNodes;
        for(var j = 0; j < vKids.length; j++){
            low++;
            var vKid = tag === 1 ? vKids[j] : vKids[j].b;
            var nextLow = low + (vKid.b || 0);
            if (low <= index && index <= nextLow) {
                i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
                if (!(patch = patches[i]) || (index = patch.r) > high) return i;
            }
            low = nextLow;
        }
        return i;
    }
    // APPLY PATCHES
    function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode) {
        if (patches.length === 0) return rootDomNode;
        _VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
        return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
    }
    function _VirtualDom_applyPatchesHelp(rootDomNode, patches) {
        for(var i = 0; i < patches.length; i++){
            var patch = patches[i];
            var localDomNode = patch.t;
            var newNode = _VirtualDom_applyPatch(localDomNode, patch);
            if (localDomNode === rootDomNode) rootDomNode = newNode;
        }
        return rootDomNode;
    }
    function _VirtualDom_applyPatch(domNode, patch) {
        switch(patch.$){
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
                if (domNode.elm_event_node_ref) domNode.elm_event_node_ref.j = patch.s;
                else domNode.elm_event_node_ref = {
                    j: patch.s,
                    p: patch.u
                };
                return domNode;
            case 6:
                var data = patch.s;
                for(var i = 0; i < data.i; i++)domNode.removeChild(domNode.childNodes[data.v]);
                return domNode;
            case 7:
                var data = patch.s;
                var kids = data.e;
                var i = data.v;
                var theEnd = domNode.childNodes[i];
                for(; i < kids.length; i++)domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
                return domNode;
            case 9:
                var data = patch.s;
                if (!data) {
                    domNode.parentNode.removeChild(domNode);
                    return domNode;
                }
                var entry = data.A;
                if (typeof entry.r !== 'undefined') domNode.parentNode.removeChild(domNode);
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
    function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode) {
        var parentNode = domNode.parentNode;
        var newNode = _VirtualDom_render(vNode, eventNode);
        if (!newNode.elm_event_node_ref) newNode.elm_event_node_ref = domNode.elm_event_node_ref;
        if (parentNode && newNode !== domNode) parentNode.replaceChild(newNode, domNode);
        return newNode;
    }
    function _VirtualDom_applyPatchReorder(domNode, patch) {
        var data = patch.s;
        // remove end inserts
        var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);
        // removals
        domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);
        // inserts
        var inserts = data.x;
        for(var i = 0; i < inserts.length; i++){
            var insert = inserts[i];
            var entry = insert.A;
            var node = entry.c === 2 ? entry.s : _VirtualDom_render(entry.z, patch.u);
            domNode.insertBefore(node, domNode.childNodes[insert.r]);
        }
        // add end inserts
        if (frag) _VirtualDom_appendChild(domNode, frag);
        return domNode;
    }
    function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch) {
        if (!endInserts) return;
        var frag = _VirtualDom_doc.createDocumentFragment();
        for(var i = 0; i < endInserts.length; i++){
            var insert = endInserts[i];
            var entry = insert.A;
            _VirtualDom_appendChild(frag, entry.c === 2 ? entry.s : _VirtualDom_render(entry.z, patch.u));
        }
        return frag;
    }
    function _VirtualDom_virtualize(node) {
        // TEXT NODES
        if (node.nodeType === 3) return _VirtualDom_text(node.textContent);
        // WEIRD NODES
        if (node.nodeType !== 1) return _VirtualDom_text('');
        // ELEMENT NODES
        var attrList = _List_Nil;
        var attrs = node.attributes;
        for(var i = attrs.length; i--;){
            var attr = attrs[i];
            var name = attr.name;
            var value = attr.value;
            attrList = _List_Cons(A2(_VirtualDom_attribute, name, value), attrList);
        }
        var tag = node.tagName.toLowerCase();
        var kidList = _List_Nil;
        var kids = node.childNodes;
        for(var i = kids.length; i--;)kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
        return A3(_VirtualDom_node, tag, attrList, kidList);
    }
    function _VirtualDom_dekey(keyedNode) {
        var keyedKids = keyedNode.e;
        var len = keyedKids.length;
        var kids = new Array(len);
        for(var i = 0; i < len; i++)kids[i] = keyedKids[i].b;
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
    var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args) {
        return _Platform_initialize(flagDecoder, args, impl.init, impl.update, impl.subscriptions, function(sendToApp, initialModel) {
            var view = impl.view;
            /**_UNUSED/
			var domNode = args['node'];
			//*/ /**/ var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
            //*/
            var currNode = _VirtualDom_virtualize(domNode);
            return _Browser_makeAnimator(initialModel, function(model) {
                var nextNode = view(model);
                var patches = _VirtualDom_diff(currNode, nextNode);
                domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
                currNode = nextNode;
            });
        });
    });
    // DOCUMENT
    var _Debugger_document;
    var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args) {
        return _Platform_initialize(flagDecoder, args, impl.init, impl.update, impl.subscriptions, function(sendToApp, initialModel) {
            var divertHrefToApp = impl.setup && impl.setup(sendToApp);
            var view = impl.view;
            var title = _VirtualDom_doc.title;
            var bodyNode = _VirtualDom_doc.body;
            var currNode = _VirtualDom_virtualize(bodyNode);
            return _Browser_makeAnimator(initialModel, function(model) {
                _VirtualDom_divertHrefToApp = divertHrefToApp;
                var doc = view(model);
                var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
                var patches = _VirtualDom_diff(currNode, nextNode);
                bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
                currNode = nextNode;
                _VirtualDom_divertHrefToApp = 0;
                title !== doc.title && (_VirtualDom_doc.title = title = doc.title);
            });
        });
    });
    // ANIMATION
    var _Browser_cancelAnimationFrame = typeof cancelAnimationFrame !== 'undefined' ? cancelAnimationFrame : function(id) {
        clearTimeout(id);
    };
    var _Browser_requestAnimationFrame = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : function(callback) {
        return setTimeout(callback, 1000 / 60);
    };
    function _Browser_makeAnimator(model, draw) {
        draw(model);
        var state = 0;
        function updateIfNeeded() {
            state = state === 1 ? 0 : (_Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1);
        }
        return function(nextModel, isSync) {
            model = nextModel;
            isSync ? (draw(model), state === 2 && (state = 1)) : (state === 0 && _Browser_requestAnimationFrame(updateIfNeeded), state = 2);
        };
    }
    // APPLICATION
    function _Browser_application(impl) {
        var onUrlChange = impl.onUrlChange;
        var onUrlRequest = impl.onUrlRequest;
        var key = function() {
            key.a(onUrlChange(_Browser_getUrl()));
        };
        return _Browser_document({
            setup: function(sendToApp) {
                key.a = sendToApp;
                _Browser_window.addEventListener('popstate', key);
                _Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);
                return F2(function(domNode, event) {
                    if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download')) {
                        event.preventDefault();
                        var href = domNode.href;
                        var curr = _Browser_getUrl();
                        var next = $elm$url$Url$fromString(href).a;
                        sendToApp(onUrlRequest(next && curr.protocol === next.protocol && curr.host === next.host && curr.port_.a === next.port_.a ? $elm$browser$Browser$Internal(next) : $elm$browser$Browser$External(href)));
                    }
                });
            },
            init: function(flags) {
                return A3(impl.init, flags, _Browser_getUrl(), key);
            },
            view: impl.view,
            update: impl.update,
            subscriptions: impl.subscriptions
        });
    }
    function _Browser_getUrl() {
        return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
    }
    var _Browser_go = F2(function(key, n) {
        return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
            n && history.go(n);
            key();
        }));
    });
    var _Browser_pushUrl = F2(function(key, url) {
        return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
            history.pushState({
            }, '', url);
            key();
        }));
    });
    var _Browser_replaceUrl = F2(function(key, url) {
        return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
            history.replaceState({
            }, '', url);
            key();
        }));
    });
    // GLOBAL EVENTS
    var _Browser_fakeNode = {
        addEventListener: function() {
        },
        removeEventListener: function() {
        }
    };
    var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
    var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;
    var _Browser_on = F3(function(node, eventName, sendToSelf) {
        return _Scheduler_spawn(_Scheduler_binding(function(callback) {
            function handler(event) {
                _Scheduler_rawSpawn(sendToSelf(event));
            }
            node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && {
                passive: true
            });
            return function() {
                node.removeEventListener(eventName, handler);
            };
        }));
    });
    var _Browser_decodeEvent = F2(function(decoder, event) {
        var result = _Json_runHelp(decoder, event);
        return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
    });
    // PAGE VISIBILITY
    function _Browser_visibilityInfo() {
        return typeof _VirtualDom_doc.hidden !== 'undefined' ? {
            hidden: 'hidden',
            change: 'visibilitychange'
        } : typeof _VirtualDom_doc.mozHidden !== 'undefined' ? {
            hidden: 'mozHidden',
            change: 'mozvisibilitychange'
        } : typeof _VirtualDom_doc.msHidden !== 'undefined' ? {
            hidden: 'msHidden',
            change: 'msvisibilitychange'
        } : typeof _VirtualDom_doc.webkitHidden !== 'undefined' ? {
            hidden: 'webkitHidden',
            change: 'webkitvisibilitychange'
        } : {
            hidden: 'hidden',
            change: 'visibilitychange'
        };
    }
    // ANIMATION FRAMES
    function _Browser_rAF() {
        return _Scheduler_binding(function(callback) {
            var id = _Browser_requestAnimationFrame(function() {
                callback(_Scheduler_succeed(Date.now()));
            });
            return function() {
                _Browser_cancelAnimationFrame(id);
            };
        });
    }
    function _Browser_now() {
        return _Scheduler_binding(function(callback) {
            callback(_Scheduler_succeed(Date.now()));
        });
    }
    // DOM STUFF
    function _Browser_withNode(id, doStuff) {
        return _Scheduler_binding(function(callback) {
            _Browser_requestAnimationFrame(function() {
                var node = document.getElementById(id);
                callback(node ? _Scheduler_succeed(doStuff(node)) : _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id)));
            });
        });
    }
    function _Browser_withWindow(doStuff) {
        return _Scheduler_binding(function(callback) {
            _Browser_requestAnimationFrame(function() {
                callback(_Scheduler_succeed(doStuff()));
            });
        });
    }
    // FOCUS and BLUR
    var _Browser_call = F2(function(functionName, id) {
        return _Browser_withNode(id, function(node) {
            node[functionName]();
            return _Utils_Tuple0;
        });
    });
    // WINDOW VIEWPORT
    function _Browser_getViewport() {
        return {
            scene: _Browser_getScene(),
            viewport: {
                x: _Browser_window.pageXOffset,
                y: _Browser_window.pageYOffset,
                width: _Browser_doc.documentElement.clientWidth,
                height: _Browser_doc.documentElement.clientHeight
            }
        };
    }
    function _Browser_getScene() {
        var body = _Browser_doc.body;
        var elem = _Browser_doc.documentElement;
        return {
            width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
            height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
        };
    }
    var _Browser_setViewport = F2(function(x, y) {
        return _Browser_withWindow(function() {
            _Browser_window.scroll(x, y);
            return _Utils_Tuple0;
        });
    });
    // ELEMENT VIEWPORT
    function _Browser_getViewportOf(id) {
        return _Browser_withNode(id, function(node) {
            return {
                scene: {
                    width: node.scrollWidth,
                    height: node.scrollHeight
                },
                viewport: {
                    x: node.scrollLeft,
                    y: node.scrollTop,
                    width: node.clientWidth,
                    height: node.clientHeight
                }
            };
        });
    }
    var _Browser_setViewportOf = F3(function(id, x, y) {
        return _Browser_withNode(id, function(node) {
            node.scrollLeft = x;
            node.scrollTop = y;
            return _Utils_Tuple0;
        });
    });
    // ELEMENT
    function _Browser_getElement(id) {
        return _Browser_withNode(id, function(node) {
            var rect = node.getBoundingClientRect();
            var x = _Browser_window.pageXOffset;
            var y = _Browser_window.pageYOffset;
            return {
                scene: _Browser_getScene(),
                viewport: {
                    x: x,
                    y: y,
                    width: _Browser_doc.documentElement.clientWidth,
                    height: _Browser_doc.documentElement.clientHeight
                },
                element: {
                    x: x + rect.left,
                    y: y + rect.top,
                    width: rect.width,
                    height: rect.height
                }
            };
        });
    }
    // LOAD and RELOAD
    function _Browser_reload(skipCache) {
        return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback) {
            _VirtualDom_doc.location.reload(skipCache);
        }));
    }
    function _Browser_load(url) {
        return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback) {
            try {
                _Browser_window.location = url;
            } catch (err) {
                // Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
                // Other browsers reload the page, so let's be consistent about that.
                _VirtualDom_doc.location.reload(false);
            }
        }));
    }
    // SEND REQUEST
    var _Http_toTask = F3(function(router, toTask, request) {
        return _Scheduler_binding(function(callback) {
            function done(response) {
                callback(toTask(request.expect.a(response)));
            }
            var xhr = new XMLHttpRequest();
            xhr.addEventListener('error', function() {
                done($elm$http$Http$NetworkError_);
            });
            xhr.addEventListener('timeout', function() {
                done($elm$http$Http$Timeout_);
            });
            xhr.addEventListener('load', function() {
                done(_Http_toResponse(request.expect.b, xhr));
            });
            $elm$core$Maybe$isJust(request.tracker) && _Http_track(router, xhr, request.tracker.a);
            try {
                xhr.open(request.method, request.url, true);
            } catch (e) {
                return done($elm$http$Http$BadUrl_(request.url));
            }
            _Http_configureRequest(xhr, request);
            request.body.a && xhr.setRequestHeader('Content-Type', request.body.a);
            xhr.send(request.body.b);
            return function() {
                xhr.c = true;
                xhr.abort();
            };
        });
    });
    // CONFIGURE
    function _Http_configureRequest(xhr, request) {
        for(var headers = request.headers; headers.b; headers = headers.b)xhr.setRequestHeader(headers.a.a, headers.a.b);
        xhr.timeout = request.timeout.a || 0;
        xhr.responseType = request.expect.d;
        xhr.withCredentials = request.allowCookiesFromOtherDomains;
    }
    // RESPONSES
    function _Http_toResponse(toBody, xhr) {
        return A2(200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_, _Http_toMetadata(xhr), toBody(xhr.response));
    }
    // METADATA
    function _Http_toMetadata(xhr) {
        return {
            url: xhr.responseURL,
            statusCode: xhr.status,
            statusText: xhr.statusText,
            headers: _Http_parseHeaders(xhr.getAllResponseHeaders())
        };
    }
    // HEADERS
    function _Http_parseHeaders(rawHeaders) {
        if (!rawHeaders) return $elm$core$Dict$empty;
        var headers = $elm$core$Dict$empty;
        var headerPairs = rawHeaders.split('\r\n');
        for(var i = headerPairs.length; i--;){
            var headerPair = headerPairs[i];
            var index = headerPair.indexOf(': ');
            if (index > 0) {
                var key = headerPair.substring(0, index);
                var value = headerPair.substring(index + 2);
                headers = A3($elm$core$Dict$update, key, function(oldValue) {
                    return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue) ? value + ', ' + oldValue.a : value);
                }, headers);
            }
        }
        return headers;
    }
    // EXPECT
    var _Http_expect = F3(function(type, toBody, toValue) {
        return {
            $: 0,
            d: type,
            b: toBody,
            a: toValue
        };
    });
    var _Http_mapExpect = F2(function(func, expect) {
        return {
            $: 0,
            d: expect.d,
            b: expect.b,
            a: function(x) {
                return func(expect.a(x));
            }
        };
    });
    function _Http_toDataView(arrayBuffer) {
        return new DataView(arrayBuffer);
    }
    // BODY and PARTS
    var _Http_emptyBody = {
        $: 0
    };
    var _Http_pair = F2(function(a, b) {
        return {
            $: 0,
            a: a,
            b: b
        };
    });
    function _Http_toFormData(parts) {
        for(var formData = new FormData(); parts.b; parts = parts.b){
            var part = parts.a;
            formData.append(part.a, part.b);
        }
        return formData;
    }
    var _Http_bytesToBlob = F2(function(mime, bytes) {
        return new Blob([
            bytes
        ], {
            type: mime
        });
    });
    // PROGRESS
    function _Http_track(router, xhr, tracker) {
        // TODO check out lengthComputable on loadstart event
        xhr.upload.addEventListener('progress', function(event) {
            if (xhr.c) return;
            _Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
                sent: event.loaded,
                size: event.total
            }))));
        });
        xhr.addEventListener('progress', function(event) {
            if (xhr.c) return;
            _Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
                received: event.loaded,
                size: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
            }))));
        });
    }
    function _Time_now(millisToPosix) {
        return _Scheduler_binding(function(callback) {
            callback(_Scheduler_succeed(millisToPosix(Date.now())));
        });
    }
    var _Time_setInterval = F2(function(interval, task) {
        return _Scheduler_binding(function(callback) {
            var id = setInterval(function() {
                _Scheduler_rawSpawn(task);
            }, interval);
            return function() {
                clearInterval(id);
            };
        });
    });
    function _Time_here() {
        return _Scheduler_binding(function(callback) {
            callback(_Scheduler_succeed(A2($elm$time$Time$customZone, -new Date().getTimezoneOffset(), _List_Nil)));
        });
    }
    function _Time_getZoneName() {
        return _Scheduler_binding(function(callback) {
            try {
                var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
            } catch (e) {
                var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
            }
            callback(_Scheduler_succeed(name));
        });
    }
    // CREATE
    var _Regex_never = /.^/;
    var _Regex_fromStringWith = F2(function(options, string) {
        var flags = 'g';
        if (options.multiline) flags += 'm';
        if (options.caseInsensitive) flags += 'i';
        try {
            return $elm$core$Maybe$Just(new RegExp(string, flags));
        } catch (error) {
            return $elm$core$Maybe$Nothing;
        }
    });
    // USE
    var _Regex_contains = F2(function(re, string) {
        return string.match(re) !== null;
    });
    var _Regex_findAtMost = F3(function(n, re, str) {
        var out = [];
        var number = 0;
        var string = str;
        var lastIndex = re.lastIndex;
        var prevLastIndex = -1;
        var result;
        while((number++) < n && (result = re.exec(string))){
            if (prevLastIndex == re.lastIndex) break;
            var i = result.length - 1;
            var subs = new Array(i);
            while(i > 0){
                var submatch = result[i];
                subs[--i] = submatch ? $elm$core$Maybe$Just(submatch) : $elm$core$Maybe$Nothing;
            }
            out.push(A4($elm$regex$Regex$Match, result[0], result.index, number, _List_fromArray(subs)));
            prevLastIndex = re.lastIndex;
        }
        re.lastIndex = lastIndex;
        return _List_fromArray(out);
    });
    var _Regex_replaceAtMost = F4(function(n, re, replacer, string) {
        var count = 0;
        function jsReplacer(match) {
            if ((count++) >= n) return match;
            var i = arguments.length - 3;
            var submatches = new Array(i);
            while(i > 0){
                var submatch = arguments[i];
                submatches[--i] = submatch ? $elm$core$Maybe$Just(submatch) : $elm$core$Maybe$Nothing;
            }
            return replacer(A4($elm$regex$Regex$Match, match, arguments[arguments.length - 2], count, _List_fromArray(submatches)));
        }
        return string.replace(re, jsReplacer);
    });
    var _Regex_splitAtMost = F3(function(n, re, str) {
        var string = str;
        var out = [];
        var start = re.lastIndex;
        var restoreLastIndex = re.lastIndex;
        while(n--){
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
    function _Url_percentEncode(string) {
        return encodeURIComponent(string);
    }
    function _Url_percentDecode(string) {
        try {
            return $elm$core$Maybe$Just(decodeURIComponent(string));
        } catch (e) {
            return $elm$core$Maybe$Nothing;
        }
    }
    var _Bitwise_and = F2(function(a, b) {
        return a & b;
    });
    var _Bitwise_or = F2(function(a, b) {
        return a | b;
    });
    var _Bitwise_xor = F2(function(a, b) {
        return a ^ b;
    });
    function _Bitwise_complement(a) {
        return ~a;
    }
    var _Bitwise_shiftLeftBy = F2(function(offset, a) {
        return a << offset;
    });
    var _Bitwise_shiftRightBy = F2(function(offset, a) {
        return a >> offset;
    });
    var _Bitwise_shiftRightZfBy = F2(function(offset, a) {
        return a >>> offset;
    });
    var $elm$core$Maybe$Just = function(a) {
        return {
            $: 'Just',
            a: a
        };
    };
    var $elm$core$Maybe$Nothing = {
        $: 'Nothing'
    };
    var $author$project$Main$UrlChange = function(a) {
        return {
            $: 'UrlChange',
            a: a
        };
    };
    var $author$project$Main$UrlRequest = function(a) {
        return {
            $: 'UrlRequest',
            a: a
        };
    };
    var $elm$core$List$cons = _List_cons;
    var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
    var $elm$core$Array$foldr = F3(function(func, baseCase, _v0) {
        var tree = _v0.c;
        var tail = _v0.d;
        var helper = F2(function(node, acc) {
            if (node.$ === 'SubTree') {
                var subTree = node.a;
                return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
            } else {
                var values = node.a;
                return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
            }
        });
        return A3($elm$core$Elm$JsArray$foldr, helper, A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail), tree);
    });
    var $elm$core$Array$toList = function(array) {
        return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
    };
    var $elm$core$Dict$foldr = F3(function(func, acc, t) {
        foldr: while(true){
            if (t.$ === 'RBEmpty_elm_builtin') return acc;
            else {
                var key = t.b;
                var value = t.c;
                var left = t.d;
                var right = t.e;
                var $temp$func = func, $temp$acc = A3(func, key, value, A3($elm$core$Dict$foldr, func, acc, right)), $temp$t = left;
                func = $temp$func;
                acc = $temp$acc;
                t = $temp$t;
                continue foldr;
            }
        }
    });
    var $elm$core$Dict$toList = function(dict) {
        return A3($elm$core$Dict$foldr, F3(function(key, value, list) {
            return A2($elm$core$List$cons, _Utils_Tuple2(key, value), list);
        }), _List_Nil, dict);
    };
    var $elm$core$Dict$keys = function(dict) {
        return A3($elm$core$Dict$foldr, F3(function(key, value, keyList) {
            return A2($elm$core$List$cons, key, keyList);
        }), _List_Nil, dict);
    };
    var $elm$core$Set$toList = function(_v0) {
        var dict = _v0.a;
        return $elm$core$Dict$keys(dict);
    };
    var $elm$core$Basics$EQ = {
        $: 'EQ'
    };
    var $elm$core$Basics$GT = {
        $: 'GT'
    };
    var $elm$core$Basics$LT = {
        $: 'LT'
    };
    var $elm$core$Result$Err = function(a) {
        return {
            $: 'Err',
            a: a
        };
    };
    var $elm$json$Json$Decode$Failure = F2(function(a, b) {
        return {
            $: 'Failure',
            a: a,
            b: b
        };
    });
    var $elm$json$Json$Decode$Field = F2(function(a, b) {
        return {
            $: 'Field',
            a: a,
            b: b
        };
    });
    var $elm$json$Json$Decode$Index = F2(function(a, b) {
        return {
            $: 'Index',
            a: a,
            b: b
        };
    });
    var $elm$core$Result$Ok = function(a) {
        return {
            $: 'Ok',
            a: a
        };
    };
    var $elm$json$Json$Decode$OneOf = function(a) {
        return {
            $: 'OneOf',
            a: a
        };
    };
    var $elm$core$Basics$False = {
        $: 'False'
    };
    var $elm$core$Basics$add = _Basics_add;
    var $elm$core$String$all = _String_all;
    var $elm$core$Basics$and = _Basics_and;
    var $elm$core$Basics$append = _Utils_append;
    var $elm$json$Json$Encode$encode = _Json_encode;
    var $elm$core$String$fromInt = _String_fromNumber;
    var $elm$core$String$join = F2(function(sep, chunks) {
        return A2(_String_join, sep, _List_toArray(chunks));
    });
    var $elm$core$String$split = F2(function(sep, string) {
        return _List_fromArray(A2(_String_split, sep, string));
    });
    var $elm$json$Json$Decode$indent = function(str) {
        return A2($elm$core$String$join, '\n    ', A2($elm$core$String$split, '\n', str));
    };
    var $elm$core$List$foldl = F3(function(func, acc, list) {
        foldl: while(true){
            if (!list.b) return acc;
            else {
                var x = list.a;
                var xs = list.b;
                var $temp$func = func, $temp$acc = A2(func, x, acc), $temp$list = xs;
                func = $temp$func;
                acc = $temp$acc;
                list = $temp$list;
                continue foldl;
            }
        }
    });
    var $elm$core$List$length = function(xs) {
        return A3($elm$core$List$foldl, F2(function(_v0, i) {
            return i + 1;
        }), 0, xs);
    };
    var $elm$core$List$map2 = _List_map2;
    var $elm$core$Basics$le = _Utils_le;
    var $elm$core$Basics$sub = _Basics_sub;
    var $elm$core$List$rangeHelp = F3(function(lo, hi, list) {
        rangeHelp: while(true){
            if (_Utils_cmp(lo, hi) < 1) {
                var $temp$lo = lo, $temp$hi = hi - 1, $temp$list = A2($elm$core$List$cons, hi, list);
                lo = $temp$lo;
                hi = $temp$hi;
                list = $temp$list;
                continue rangeHelp;
            } else return list;
        }
    });
    var $elm$core$List$range = F2(function(lo, hi) {
        return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
    });
    var $elm$core$List$indexedMap = F2(function(f, xs) {
        return A3($elm$core$List$map2, f, A2($elm$core$List$range, 0, $elm$core$List$length(xs) - 1), xs);
    });
    var $elm$core$Char$toCode = _Char_toCode;
    var $elm$core$Char$isLower = function(_char) {
        var code = $elm$core$Char$toCode(_char);
        return 97 <= code && code <= 122;
    };
    var $elm$core$Char$isUpper = function(_char) {
        var code = $elm$core$Char$toCode(_char);
        return code <= 90 && 65 <= code;
    };
    var $elm$core$Basics$or = _Basics_or;
    var $elm$core$Char$isAlpha = function(_char) {
        return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
    };
    var $elm$core$Char$isDigit = function(_char) {
        var code = $elm$core$Char$toCode(_char);
        return code <= 57 && 48 <= code;
    };
    var $elm$core$Char$isAlphaNum = function(_char) {
        return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char);
    };
    var $elm$core$List$reverse = function(list) {
        return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
    };
    var $elm$core$String$uncons = _String_uncons;
    var $elm$json$Json$Decode$errorOneOf = F2(function(i, error) {
        return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent($elm$json$Json$Decode$errorToString(error))));
    });
    var $elm$json$Json$Decode$errorToString = function(error) {
        return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
    };
    var $elm$json$Json$Decode$errorToStringHelp = F2(function(error, context) {
        errorToStringHelp: while(true)switch(error.$){
            case 'Field':
                var f = error.a;
                var err = error.b;
                var isSimple = function() {
                    var _v1 = $elm$core$String$uncons(f);
                    if (_v1.$ === 'Nothing') return false;
                    else {
                        var _v2 = _v1.a;
                        var _char = _v2.a;
                        var rest = _v2.b;
                        return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
                    }
                }();
                var fieldName = isSimple ? '.' + f : '[\'' + (f + '\']');
                var $temp$error = err, $temp$context = A2($elm$core$List$cons, fieldName, context);
                error = $temp$error;
                context = $temp$context;
                continue errorToStringHelp;
            case 'Index':
                var i = error.a;
                var err = error.b;
                var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
                var $temp$error = err, $temp$context = A2($elm$core$List$cons, indexName, context);
                error = $temp$error;
                context = $temp$context;
                continue errorToStringHelp;
            case 'OneOf':
                var errors = error.a;
                if (!errors.b) return 'Ran into a Json.Decode.oneOf with no possibilities' + (function() {
                    if (!context.b) return '!';
                    else return ' at json' + A2($elm$core$String$join, '', $elm$core$List$reverse(context));
                })();
                else if (!errors.b.b) {
                    var err = errors.a;
                    var $temp$error = err, $temp$context = context;
                    error = $temp$error;
                    context = $temp$context;
                    continue errorToStringHelp;
                } else {
                    var starter = function() {
                        if (!context.b) return 'Json.Decode.oneOf';
                        else return 'The Json.Decode.oneOf at json' + A2($elm$core$String$join, '', $elm$core$List$reverse(context));
                    }();
                    var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt($elm$core$List$length(errors)) + ' ways:'));
                    return A2($elm$core$String$join, '\n\n', A2($elm$core$List$cons, introduction, A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
                }
            default:
                var msg = error.a;
                var json = error.b;
                var introduction = function() {
                    if (!context.b) return 'Problem with the given value:\n\n';
                    else return 'Problem with the value at json' + (A2($elm$core$String$join, '', $elm$core$List$reverse(context)) + ':\n\n    ');
                }();
                return introduction + ($elm$json$Json$Decode$indent(A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
        }
    });
    var $elm$core$Array$branchFactor = 32;
    var $elm$core$Array$Array_elm_builtin = F4(function(a, b, c, d) {
        return {
            $: 'Array_elm_builtin',
            a: a,
            b: b,
            c: c,
            d: d
        };
    });
    var $elm$core$Elm$JsArray$empty = _JsArray_empty;
    var $elm$core$Basics$ceiling = _Basics_ceiling;
    var $elm$core$Basics$fdiv = _Basics_fdiv;
    var $elm$core$Basics$logBase = F2(function(base, number) {
        return _Basics_log(number) / _Basics_log(base);
    });
    var $elm$core$Basics$toFloat = _Basics_toFloat;
    var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
    var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
    var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
    var $elm$core$Array$Leaf = function(a) {
        return {
            $: 'Leaf',
            a: a
        };
    };
    var $elm$core$Basics$apL = F2(function(f, x) {
        return f(x);
    });
    var $elm$core$Basics$apR = F2(function(x, f) {
        return f(x);
    });
    var $elm$core$Basics$eq = _Utils_equal;
    var $elm$core$Basics$floor = _Basics_floor;
    var $elm$core$Elm$JsArray$length = _JsArray_length;
    var $elm$core$Basics$gt = _Utils_gt;
    var $elm$core$Basics$max = F2(function(x, y) {
        return _Utils_cmp(x, y) > 0 ? x : y;
    });
    var $elm$core$Basics$mul = _Basics_mul;
    var $elm$core$Array$SubTree = function(a) {
        return {
            $: 'SubTree',
            a: a
        };
    };
    var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
    var $elm$core$Array$compressNodes = F2(function(nodes, acc) {
        compressNodes: while(true){
            var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
            var node = _v0.a;
            var remainingNodes = _v0.b;
            var newAcc = A2($elm$core$List$cons, $elm$core$Array$SubTree(node), acc);
            if (!remainingNodes.b) return $elm$core$List$reverse(newAcc);
            else {
                var $temp$nodes = remainingNodes, $temp$acc = newAcc;
                nodes = $temp$nodes;
                acc = $temp$acc;
                continue compressNodes;
            }
        }
    });
    var $elm$core$Tuple$first = function(_v0) {
        var x = _v0.a;
        return x;
    };
    var $elm$core$Array$treeFromBuilder = F2(function(nodeList, nodeListSize) {
        treeFromBuilder: while(true){
            var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
            if (newNodeSize === 1) return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
            else {
                var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil), $temp$nodeListSize = newNodeSize;
                nodeList = $temp$nodeList;
                nodeListSize = $temp$nodeListSize;
                continue treeFromBuilder;
            }
        }
    });
    var $elm$core$Array$builderToArray = F2(function(reverseNodeList, builder) {
        if (!builder.nodeListSize) return A4($elm$core$Array$Array_elm_builtin, $elm$core$Elm$JsArray$length(builder.tail), $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, builder.tail);
        else {
            var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
            var depth = $elm$core$Basics$floor(A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
            var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
            var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
            return A4($elm$core$Array$Array_elm_builtin, $elm$core$Elm$JsArray$length(builder.tail) + treeLen, A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep), tree, builder.tail);
        }
    });
    var $elm$core$Basics$idiv = _Basics_idiv;
    var $elm$core$Basics$lt = _Utils_lt;
    var $elm$core$Array$initializeHelp = F5(function(fn, fromIndex, len, nodeList, tail) {
        initializeHelp: while(true){
            if (fromIndex < 0) return A2($elm$core$Array$builderToArray, false, {
                nodeList: nodeList,
                nodeListSize: len / $elm$core$Array$branchFactor | 0,
                tail: tail
            });
            else {
                var leaf = $elm$core$Array$Leaf(A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
                var $temp$fn = fn, $temp$fromIndex = fromIndex - $elm$core$Array$branchFactor, $temp$len = len, $temp$nodeList = A2($elm$core$List$cons, leaf, nodeList), $temp$tail = tail;
                fn = $temp$fn;
                fromIndex = $temp$fromIndex;
                len = $temp$len;
                nodeList = $temp$nodeList;
                tail = $temp$tail;
                continue initializeHelp;
            }
        }
    });
    var $elm$core$Basics$remainderBy = _Basics_remainderBy;
    var $elm$core$Array$initialize = F2(function(len, fn) {
        if (len <= 0) return $elm$core$Array$empty;
        else {
            var tailLen = len % $elm$core$Array$branchFactor;
            var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
            var initialFromIndex = len - tailLen - $elm$core$Array$branchFactor;
            return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
        }
    });
    var $elm$core$Basics$True = {
        $: 'True'
    };
    var $elm$core$Result$isOk = function(result) {
        if (result.$ === 'Ok') return true;
        else return false;
    };
    var $elm$json$Json$Decode$andThen = _Json_andThen;
    var $elm$json$Json$Decode$map = _Json_map1;
    var $elm$json$Json$Decode$map2 = _Json_map2;
    var $elm$json$Json$Decode$succeed = _Json_succeed;
    var $elm$virtual_dom$VirtualDom$toHandlerInt = function(handler) {
        switch(handler.$){
            case 'Normal':
                return 0;
            case 'MayStopPropagation':
                return 1;
            case 'MayPreventDefault':
                return 2;
            default:
                return 3;
        }
    };
    var $elm$browser$Browser$External = function(a) {
        return {
            $: 'External',
            a: a
        };
    };
    var $elm$browser$Browser$Internal = function(a) {
        return {
            $: 'Internal',
            a: a
        };
    };
    var $elm$core$Basics$identity = function(x) {
        return x;
    };
    var $elm$browser$Browser$Dom$NotFound = function(a) {
        return {
            $: 'NotFound',
            a: a
        };
    };
    var $elm$url$Url$Http = {
        $: 'Http'
    };
    var $elm$url$Url$Https = {
        $: 'Https'
    };
    var $elm$url$Url$Url = F6(function(protocol, host, port_, path, query, fragment) {
        return {
            fragment: fragment,
            host: host,
            path: path,
            port_: port_,
            protocol: protocol,
            query: query
        };
    });
    var $elm$core$String$contains = _String_contains;
    var $elm$core$String$length = _String_length;
    var $elm$core$String$slice = _String_slice;
    var $elm$core$String$dropLeft = F2(function(n, string) {
        return n < 1 ? string : A3($elm$core$String$slice, n, $elm$core$String$length(string), string);
    });
    var $elm$core$String$indexes = _String_indexes;
    var $elm$core$String$isEmpty = function(string) {
        return string === '';
    };
    var $elm$core$String$left = F2(function(n, string) {
        return n < 1 ? '' : A3($elm$core$String$slice, 0, n, string);
    });
    var $elm$core$String$toInt = _String_toInt;
    var $elm$url$Url$chompBeforePath = F5(function(protocol, path, params, frag, str) {
        if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) return $elm$core$Maybe$Nothing;
        else {
            var _v0 = A2($elm$core$String$indexes, ':', str);
            if (!_v0.b) return $elm$core$Maybe$Just(A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
            else {
                if (!_v0.b.b) {
                    var i = _v0.a;
                    var _v1 = $elm$core$String$toInt(A2($elm$core$String$dropLeft, i + 1, str));
                    if (_v1.$ === 'Nothing') return $elm$core$Maybe$Nothing;
                    else {
                        var port_ = _v1;
                        return $elm$core$Maybe$Just(A6($elm$url$Url$Url, protocol, A2($elm$core$String$left, i, str), port_, path, params, frag));
                    }
                } else return $elm$core$Maybe$Nothing;
            }
        }
    });
    var $elm$url$Url$chompBeforeQuery = F4(function(protocol, params, frag, str) {
        if ($elm$core$String$isEmpty(str)) return $elm$core$Maybe$Nothing;
        else {
            var _v0 = A2($elm$core$String$indexes, '/', str);
            if (!_v0.b) return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
            else {
                var i = _v0.a;
                return A5($elm$url$Url$chompBeforePath, protocol, A2($elm$core$String$dropLeft, i, str), params, frag, A2($elm$core$String$left, i, str));
            }
        }
    });
    var $elm$url$Url$chompBeforeFragment = F3(function(protocol, frag, str) {
        if ($elm$core$String$isEmpty(str)) return $elm$core$Maybe$Nothing;
        else {
            var _v0 = A2($elm$core$String$indexes, '?', str);
            if (!_v0.b) return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
            else {
                var i = _v0.a;
                return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Just(A2($elm$core$String$dropLeft, i + 1, str)), frag, A2($elm$core$String$left, i, str));
            }
        }
    });
    var $elm$url$Url$chompAfterProtocol = F2(function(protocol, str) {
        if ($elm$core$String$isEmpty(str)) return $elm$core$Maybe$Nothing;
        else {
            var _v0 = A2($elm$core$String$indexes, '#', str);
            if (!_v0.b) return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
            else {
                var i = _v0.a;
                return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Just(A2($elm$core$String$dropLeft, i + 1, str)), A2($elm$core$String$left, i, str));
            }
        }
    });
    var $elm$core$String$startsWith = _String_startsWith;
    var $elm$url$Url$fromString = function(str) {
        return A2($elm$core$String$startsWith, 'http://', str) ? A2($elm$url$Url$chompAfterProtocol, $elm$url$Url$Http, A2($elm$core$String$dropLeft, 7, str)) : A2($elm$core$String$startsWith, 'https://', str) ? A2($elm$url$Url$chompAfterProtocol, $elm$url$Url$Https, A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing;
    };
    var $elm$core$Basics$never = function(_v0) {
        never: while(true){
            var nvr = _v0.a;
            var $temp$_v0 = nvr;
            _v0 = $temp$_v0;
            continue never;
        }
    };
    var $elm$core$Task$Perform = function(a) {
        return {
            $: 'Perform',
            a: a
        };
    };
    var $elm$core$Task$succeed = _Scheduler_succeed;
    var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
    var $elm$core$List$foldrHelper = F4(function(fn, acc, ctr, ls) {
        if (!ls.b) return acc;
        else {
            var a = ls.a;
            var r1 = ls.b;
            if (!r1.b) return A2(fn, a, acc);
            else {
                var b = r1.a;
                var r2 = r1.b;
                if (!r2.b) return A2(fn, a, A2(fn, b, acc));
                else {
                    var c = r2.a;
                    var r3 = r2.b;
                    if (!r3.b) return A2(fn, a, A2(fn, b, A2(fn, c, acc)));
                    else {
                        var d = r3.a;
                        var r4 = r3.b;
                        var res = ctr > 500 ? A3($elm$core$List$foldl, fn, acc, $elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
                        return A2(fn, a, A2(fn, b, A2(fn, c, A2(fn, d, res))));
                    }
                }
            }
        }
    });
    var $elm$core$List$foldr = F3(function(fn, acc, ls) {
        return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
    });
    var $elm$core$List$map = F2(function(f, xs) {
        return A3($elm$core$List$foldr, F2(function(x, acc) {
            return A2($elm$core$List$cons, f(x), acc);
        }), _List_Nil, xs);
    });
    var $elm$core$Task$andThen = _Scheduler_andThen;
    var $elm$core$Task$map = F2(function(func, taskA) {
        return A2($elm$core$Task$andThen, function(a) {
            return $elm$core$Task$succeed(func(a));
        }, taskA);
    });
    var $elm$core$Task$map2 = F3(function(func, taskA, taskB) {
        return A2($elm$core$Task$andThen, function(a) {
            return A2($elm$core$Task$andThen, function(b) {
                return $elm$core$Task$succeed(A2(func, a, b));
            }, taskB);
        }, taskA);
    });
    var $elm$core$Task$sequence = function(tasks) {
        return A3($elm$core$List$foldr, $elm$core$Task$map2($elm$core$List$cons), $elm$core$Task$succeed(_List_Nil), tasks);
    };
    var $elm$core$Platform$sendToApp = _Platform_sendToApp;
    var $elm$core$Task$spawnCmd = F2(function(router, _v0) {
        var task = _v0.a;
        return _Scheduler_spawn(A2($elm$core$Task$andThen, $elm$core$Platform$sendToApp(router), task));
    });
    var $elm$core$Task$onEffects = F3(function(router, commands, state) {
        return A2($elm$core$Task$map, function(_v0) {
            return _Utils_Tuple0;
        }, $elm$core$Task$sequence(A2($elm$core$List$map, $elm$core$Task$spawnCmd(router), commands)));
    });
    var $elm$core$Task$onSelfMsg = F3(function(_v0, _v1, _v2) {
        return $elm$core$Task$succeed(_Utils_Tuple0);
    });
    var $elm$core$Task$cmdMap = F2(function(tagger, _v0) {
        var task = _v0.a;
        return $elm$core$Task$Perform(A2($elm$core$Task$map, tagger, task));
    });
    _Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
    var $elm$core$Task$command = _Platform_leaf('Task');
    var $elm$core$Task$perform = F2(function(toMessage, task) {
        return $elm$core$Task$command($elm$core$Task$Perform(A2($elm$core$Task$map, toMessage, task)));
    });
    var $elm$browser$Browser$application = _Browser_application;
    var $elm$json$Json$Decode$field = _Json_decodeField;
    var $author$project$Main$GetMyProfileAndLikedProductIdsResponse = function(a) {
        return {
            $: 'GetMyProfileAndLikedProductIdsResponse',
            a: a
        };
    };
    var $author$project$Main$GetNowTime = function(a) {
        return {
            $: 'GetNowTime',
            a: a
        };
    };
    var $author$project$PageLocation$InitHome = {
        $: 'InitHome'
    };
    var $author$project$Data$LogInState$LoadingProfile = function(a) {
        return {
            $: 'LoadingProfile',
            a: a
        };
    };
    var $author$project$Main$Model = function(a) {
        return {
            $: 'Model',
            a: a
        };
    };
    var $author$project$Data$LogInState$None = {
        $: 'None'
    };
    var $elm$core$Basics$composeL = F3(function(g, f, x) {
        return g(f(x));
    });
    var $elm$core$Task$onError = _Scheduler_onError;
    var $elm$core$Task$attempt = F2(function(resultToMessage, task) {
        return $elm$core$Task$command($elm$core$Task$Perform(A2($elm$core$Task$onError, A2($elm$core$Basics$composeL, A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage), $elm$core$Result$Err), A2($elm$core$Task$andThen, A2($elm$core$Basics$composeL, A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage), $elm$core$Result$Ok), task))));
    });
    var $elm$core$Platform$Cmd$batch = _Platform_batch;
    var $author$project$Api$Field = function(a) {
        return {
            $: 'Field',
            a: a
        };
    };
    var $author$project$Api$GraphQLString = function(a) {
        return {
            $: 'GraphQLString',
            a: a
        };
    };
    var $author$project$Api$Query = function(a) {
        return {
            $: 'Query',
            a: a
        };
    };
    var $elm$http$Http$BadStatus_ = F2(function(a, b) {
        return {
            $: 'BadStatus_',
            a: a,
            b: b
        };
    });
    var $elm$http$Http$BadUrl_ = function(a) {
        return {
            $: 'BadUrl_',
            a: a
        };
    };
    var $elm$http$Http$GoodStatus_ = F2(function(a, b) {
        return {
            $: 'GoodStatus_',
            a: a,
            b: b
        };
    });
    var $elm$http$Http$NetworkError_ = {
        $: 'NetworkError_'
    };
    var $elm$http$Http$Receiving = function(a) {
        return {
            $: 'Receiving',
            a: a
        };
    };
    var $elm$http$Http$Sending = function(a) {
        return {
            $: 'Sending',
            a: a
        };
    };
    var $elm$http$Http$Timeout_ = {
        $: 'Timeout_'
    };
    var $elm$core$Dict$RBEmpty_elm_builtin = {
        $: 'RBEmpty_elm_builtin'
    };
    var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
    var $elm$core$Maybe$isJust = function(maybe) {
        if (maybe.$ === 'Just') return true;
        else return false;
    };
    var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
    var $elm$core$Basics$compare = _Utils_compare;
    var $elm$core$Dict$get = F2(function(targetKey, dict) {
        get: while(true){
            if (dict.$ === 'RBEmpty_elm_builtin') return $elm$core$Maybe$Nothing;
            else {
                var key = dict.b;
                var value = dict.c;
                var left = dict.d;
                var right = dict.e;
                var _v1 = A2($elm$core$Basics$compare, targetKey, key);
                switch(_v1.$){
                    case 'LT':
                        var $temp$targetKey = targetKey, $temp$dict = left;
                        targetKey = $temp$targetKey;
                        dict = $temp$dict;
                        continue get;
                    case 'EQ':
                        return $elm$core$Maybe$Just(value);
                    default:
                        var $temp$targetKey = targetKey, $temp$dict = right;
                        targetKey = $temp$targetKey;
                        dict = $temp$dict;
                        continue get;
                }
            }
        }
    });
    var $elm$core$Dict$Black = {
        $: 'Black'
    };
    var $elm$core$Dict$RBNode_elm_builtin = F5(function(a, b, c, d, e) {
        return {
            $: 'RBNode_elm_builtin',
            a: a,
            b: b,
            c: c,
            d: d,
            e: e
        };
    });
    var $elm$core$Dict$Red = {
        $: 'Red'
    };
    var $elm$core$Dict$balance = F5(function(color, key, value, left, right) {
        if (right.$ === 'RBNode_elm_builtin' && right.a.$ === 'Red') {
            var _v1 = right.a;
            var rK = right.b;
            var rV = right.c;
            var rLeft = right.d;
            var rRight = right.e;
            if (left.$ === 'RBNode_elm_builtin' && left.a.$ === 'Red') {
                var _v3 = left.a;
                var lK = left.b;
                var lV = left.c;
                var lLeft = left.d;
                var lRight = left.e;
                return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight), A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
            } else return A5($elm$core$Dict$RBNode_elm_builtin, color, rK, rV, A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft), rRight);
        } else {
            if (left.$ === 'RBNode_elm_builtin' && left.a.$ === 'Red' && left.d.$ === 'RBNode_elm_builtin' && left.d.a.$ === 'Red') {
                var _v5 = left.a;
                var lK = left.b;
                var lV = left.c;
                var _v6 = left.d;
                var _v7 = _v6.a;
                var llK = _v6.b;
                var llV = _v6.c;
                var llLeft = _v6.d;
                var llRight = _v6.e;
                var lRight = left.e;
                return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight), A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
            } else return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
        }
    });
    var $elm$core$Dict$insertHelp = F3(function(key, value, dict) {
        if (dict.$ === 'RBEmpty_elm_builtin') return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
        else {
            var nColor = dict.a;
            var nKey = dict.b;
            var nValue = dict.c;
            var nLeft = dict.d;
            var nRight = dict.e;
            var _v1 = A2($elm$core$Basics$compare, key, nKey);
            switch(_v1.$){
                case 'LT':
                    return A5($elm$core$Dict$balance, nColor, nKey, nValue, A3($elm$core$Dict$insertHelp, key, value, nLeft), nRight);
                case 'EQ':
                    return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
                default:
                    return A5($elm$core$Dict$balance, nColor, nKey, nValue, nLeft, A3($elm$core$Dict$insertHelp, key, value, nRight));
            }
        }
    });
    var $elm$core$Dict$insert = F3(function(key, value, dict) {
        var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
        if (_v0.$ === 'RBNode_elm_builtin' && _v0.a.$ === 'Red') {
            var _v1 = _v0.a;
            var k = _v0.b;
            var v = _v0.c;
            var l = _v0.d;
            var r = _v0.e;
            return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
        } else {
            var x = _v0;
            return x;
        }
    });
    var $elm$core$Dict$getMin = function(dict) {
        getMin: while(true){
            if (dict.$ === 'RBNode_elm_builtin' && dict.d.$ === 'RBNode_elm_builtin') {
                var left = dict.d;
                var $temp$dict = left;
                dict = $temp$dict;
                continue getMin;
            } else return dict;
        }
    };
    var $elm$core$Dict$moveRedLeft = function(dict) {
        if (dict.$ === 'RBNode_elm_builtin' && dict.d.$ === 'RBNode_elm_builtin' && dict.e.$ === 'RBNode_elm_builtin') {
            if (dict.e.d.$ === 'RBNode_elm_builtin' && dict.e.d.a.$ === 'Red') {
                var clr = dict.a;
                var k = dict.b;
                var v = dict.c;
                var _v1 = dict.d;
                var lClr = _v1.a;
                var lK = _v1.b;
                var lV = _v1.c;
                var lLeft = _v1.d;
                var lRight = _v1.e;
                var _v2 = dict.e;
                var rClr = _v2.a;
                var rK = _v2.b;
                var rV = _v2.c;
                var rLeft = _v2.d;
                var _v3 = rLeft.a;
                var rlK = rLeft.b;
                var rlV = rLeft.c;
                var rlL = rLeft.d;
                var rlR = rLeft.e;
                var rRight = _v2.e;
                return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rlK, rlV, A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight), rlL), A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rlR, rRight));
            } else {
                var clr = dict.a;
                var k = dict.b;
                var v = dict.c;
                var _v4 = dict.d;
                var lClr = _v4.a;
                var lK = _v4.b;
                var lV = _v4.c;
                var lLeft = _v4.d;
                var lRight = _v4.e;
                var _v5 = dict.e;
                var rClr = _v5.a;
                var rK = _v5.b;
                var rV = _v5.c;
                var rLeft = _v5.d;
                var rRight = _v5.e;
                if (clr.$ === 'Black') return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight), A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
                else return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight), A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
            }
        } else return dict;
    };
    var $elm$core$Dict$moveRedRight = function(dict) {
        if (dict.$ === 'RBNode_elm_builtin' && dict.d.$ === 'RBNode_elm_builtin' && dict.e.$ === 'RBNode_elm_builtin') {
            if (dict.d.d.$ === 'RBNode_elm_builtin' && dict.d.d.a.$ === 'Red') {
                var clr = dict.a;
                var k = dict.b;
                var v = dict.c;
                var _v1 = dict.d;
                var lClr = _v1.a;
                var lK = _v1.b;
                var lV = _v1.c;
                var _v2 = _v1.d;
                var _v3 = _v2.a;
                var llK = _v2.b;
                var llV = _v2.c;
                var llLeft = _v2.d;
                var llRight = _v2.e;
                var lRight = _v1.e;
                var _v4 = dict.e;
                var rClr = _v4.a;
                var rK = _v4.b;
                var rV = _v4.c;
                var rLeft = _v4.d;
                var rRight = _v4.e;
                return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight), A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, lRight, A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight)));
            } else {
                var clr = dict.a;
                var k = dict.b;
                var v = dict.c;
                var _v5 = dict.d;
                var lClr = _v5.a;
                var lK = _v5.b;
                var lV = _v5.c;
                var lLeft = _v5.d;
                var lRight = _v5.e;
                var _v6 = dict.e;
                var rClr = _v6.a;
                var rK = _v6.b;
                var rV = _v6.c;
                var rLeft = _v6.d;
                var rRight = _v6.e;
                if (clr.$ === 'Black') return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight), A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
                else return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight), A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
            }
        } else return dict;
    };
    var $elm$core$Dict$removeHelpPrepEQGT = F7(function(targetKey, dict, color, key, value, left, right) {
        if (left.$ === 'RBNode_elm_builtin' && left.a.$ === 'Red') {
            var _v1 = left.a;
            var lK = left.b;
            var lV = left.c;
            var lLeft = left.d;
            var lRight = left.e;
            return A5($elm$core$Dict$RBNode_elm_builtin, color, lK, lV, lLeft, A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, lRight, right));
        } else {
            _v2$2: while(true){
                if (right.$ === 'RBNode_elm_builtin' && right.a.$ === 'Black') {
                    if (right.d.$ === 'RBNode_elm_builtin') {
                        if (right.d.a.$ === 'Black') {
                            var _v3 = right.a;
                            var _v4 = right.d;
                            var _v5 = _v4.a;
                            return $elm$core$Dict$moveRedRight(dict);
                        } else break _v2$2;
                    } else {
                        var _v6 = right.a;
                        var _v7 = right.d;
                        return $elm$core$Dict$moveRedRight(dict);
                    }
                } else break _v2$2;
            }
            return dict;
        }
    });
    var $elm$core$Dict$removeMin = function(dict) {
        if (dict.$ === 'RBNode_elm_builtin' && dict.d.$ === 'RBNode_elm_builtin') {
            var color = dict.a;
            var key = dict.b;
            var value = dict.c;
            var left = dict.d;
            var lColor = left.a;
            var lLeft = left.d;
            var right = dict.e;
            if (lColor.$ === 'Black') {
                if (lLeft.$ === 'RBNode_elm_builtin' && lLeft.a.$ === 'Red') {
                    var _v3 = lLeft.a;
                    return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, $elm$core$Dict$removeMin(left), right);
                } else {
                    var _v4 = $elm$core$Dict$moveRedLeft(dict);
                    if (_v4.$ === 'RBNode_elm_builtin') {
                        var nColor = _v4.a;
                        var nKey = _v4.b;
                        var nValue = _v4.c;
                        var nLeft = _v4.d;
                        var nRight = _v4.e;
                        return A5($elm$core$Dict$balance, nColor, nKey, nValue, $elm$core$Dict$removeMin(nLeft), nRight);
                    } else return $elm$core$Dict$RBEmpty_elm_builtin;
                }
            } else return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, $elm$core$Dict$removeMin(left), right);
        } else return $elm$core$Dict$RBEmpty_elm_builtin;
    };
    var $elm$core$Dict$removeHelp = F2(function(targetKey, dict) {
        if (dict.$ === 'RBEmpty_elm_builtin') return $elm$core$Dict$RBEmpty_elm_builtin;
        else {
            var color = dict.a;
            var key = dict.b;
            var value = dict.c;
            var left = dict.d;
            var right = dict.e;
            if (_Utils_cmp(targetKey, key) < 0) {
                if (left.$ === 'RBNode_elm_builtin' && left.a.$ === 'Black') {
                    var _v4 = left.a;
                    var lLeft = left.d;
                    if (lLeft.$ === 'RBNode_elm_builtin' && lLeft.a.$ === 'Red') {
                        var _v6 = lLeft.a;
                        return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, A2($elm$core$Dict$removeHelp, targetKey, left), right);
                    } else {
                        var _v7 = $elm$core$Dict$moveRedLeft(dict);
                        if (_v7.$ === 'RBNode_elm_builtin') {
                            var nColor = _v7.a;
                            var nKey = _v7.b;
                            var nValue = _v7.c;
                            var nLeft = _v7.d;
                            var nRight = _v7.e;
                            return A5($elm$core$Dict$balance, nColor, nKey, nValue, A2($elm$core$Dict$removeHelp, targetKey, nLeft), nRight);
                        } else return $elm$core$Dict$RBEmpty_elm_builtin;
                    }
                } else return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, A2($elm$core$Dict$removeHelp, targetKey, left), right);
            } else return A2($elm$core$Dict$removeHelpEQGT, targetKey, A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
        }
    });
    var $elm$core$Dict$removeHelpEQGT = F2(function(targetKey, dict) {
        if (dict.$ === 'RBNode_elm_builtin') {
            var color = dict.a;
            var key = dict.b;
            var value = dict.c;
            var left = dict.d;
            var right = dict.e;
            if (_Utils_eq(targetKey, key)) {
                var _v1 = $elm$core$Dict$getMin(right);
                if (_v1.$ === 'RBNode_elm_builtin') {
                    var minKey = _v1.b;
                    var minValue = _v1.c;
                    return A5($elm$core$Dict$balance, color, minKey, minValue, left, $elm$core$Dict$removeMin(right));
                } else return $elm$core$Dict$RBEmpty_elm_builtin;
            } else return A5($elm$core$Dict$balance, color, key, value, left, A2($elm$core$Dict$removeHelp, targetKey, right));
        } else return $elm$core$Dict$RBEmpty_elm_builtin;
    });
    var $elm$core$Dict$remove = F2(function(key, dict) {
        var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
        if (_v0.$ === 'RBNode_elm_builtin' && _v0.a.$ === 'Red') {
            var _v1 = _v0.a;
            var k = _v0.b;
            var v = _v0.c;
            var l = _v0.d;
            var r = _v0.e;
            return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
        } else {
            var x = _v0;
            return x;
        }
    });
    var $elm$core$Dict$update = F3(function(targetKey, alter, dictionary) {
        var _v0 = alter(A2($elm$core$Dict$get, targetKey, dictionary));
        if (_v0.$ === 'Just') {
            var value = _v0.a;
            return A3($elm$core$Dict$insert, targetKey, value, dictionary);
        } else return A2($elm$core$Dict$remove, targetKey, dictionary);
    });
    var $elm$core$Basics$composeR = F3(function(f, g, x) {
        return g(f(x));
    });
    var $elm$http$Http$expectStringResponse = F2(function(toMsg, toResult) {
        return A3(_Http_expect, '', $elm$core$Basics$identity, A2($elm$core$Basics$composeR, toResult, toMsg));
    });
    var $elm$http$Http$jsonBody = function(value) {
        return A2(_Http_pair, 'application/json', A2($elm$json$Json$Encode$encode, 0, value));
    };
    var $elm$json$Json$Encode$object = function(pairs) {
        return _Json_wrap(A3($elm$core$List$foldl, F2(function(_v0, obj) {
            var k = _v0.a;
            var v = _v0.b;
            return A3(_Json_addField, k, v, obj);
        }), _Json_emptyObject(_Utils_Tuple0), pairs));
    };
    var $elm$json$Json$Encode$string = _Json_wrap;
    var $author$project$Api$graphQlRequestBody = function(queryOrMutation) {
        return $elm$http$Http$jsonBody($elm$json$Json$Encode$object(_List_fromArray([
            _Utils_Tuple2('query', $elm$json$Json$Encode$string(queryOrMutation))
        ])));
    };
    var $elm$json$Json$Decode$decodeString = _Json_runOnString;
    var $elm$json$Json$Decode$list = _Json_decodeList;
    var $elm$json$Json$Decode$string = _Json_decodeString;
    var $author$project$Api$graphQLErrorResponseDecoder = A2($elm$json$Json$Decode$map, $elm$core$String$join(', '), A2($elm$json$Json$Decode$field, 'errors', $elm$json$Json$Decode$list(A2($elm$json$Json$Decode$field, 'message', $elm$json$Json$Decode$string))));
    var $elm$core$Result$mapError = F2(function(f, result) {
        if (result.$ === 'Ok') {
            var v = result.a;
            return $elm$core$Result$Ok(v);
        } else {
            var e = result.a;
            return $elm$core$Result$Err(f(e));
        }
    });
    var $author$project$Api$graphQlResponseDecoder = F2(function(decoder, response) {
        switch(response.$){
            case 'BadUrl_':
                return $elm$core$Result$Err('BadURL');
            case 'Timeout_':
                return $elm$core$Result$Err('Timeout');
            case 'NetworkError_':
                return $elm$core$Result$Err('NetworkError');
            case 'BadStatus_':
                var body = response.b;
                var _v1 = A2($elm$json$Json$Decode$decodeString, $author$project$Api$graphQLErrorResponseDecoder, body);
                if (_v1.$ === 'Ok') {
                    var message = _v1.a;
                    return $elm$core$Result$Err(message);
                } else {
                    var decodeError = _v1.a;
                    return $elm$core$Result$Err($elm$json$Json$Decode$errorToString(decodeError));
                }
            default:
                var body = response.b;
                return A2($elm$core$Result$mapError, $elm$json$Json$Decode$errorToString, A2($elm$json$Json$Decode$decodeString, A2($elm$json$Json$Decode$field, 'data', decoder), body));
        }
    });
    var $elm$http$Http$Request = function(a) {
        return {
            $: 'Request',
            a: a
        };
    };
    var $elm$http$Http$State = F2(function(reqs, subs) {
        return {
            reqs: reqs,
            subs: subs
        };
    });
    var $elm$http$Http$init = $elm$core$Task$succeed(A2($elm$http$Http$State, $elm$core$Dict$empty, _List_Nil));
    var $elm$core$Process$kill = _Scheduler_kill;
    var $elm$core$Process$spawn = _Scheduler_spawn;
    var $elm$http$Http$updateReqs = F3(function(router, cmds, reqs) {
        updateReqs: while(true){
            if (!cmds.b) return $elm$core$Task$succeed(reqs);
            else {
                var cmd = cmds.a;
                var otherCmds = cmds.b;
                if (cmd.$ === 'Cancel') {
                    var tracker = cmd.a;
                    var _v2 = A2($elm$core$Dict$get, tracker, reqs);
                    if (_v2.$ === 'Nothing') {
                        var $temp$router = router, $temp$cmds = otherCmds, $temp$reqs = reqs;
                        router = $temp$router;
                        cmds = $temp$cmds;
                        reqs = $temp$reqs;
                        continue updateReqs;
                    } else {
                        var pid = _v2.a;
                        return A2($elm$core$Task$andThen, function(_v3) {
                            return A3($elm$http$Http$updateReqs, router, otherCmds, A2($elm$core$Dict$remove, tracker, reqs));
                        }, $elm$core$Process$kill(pid));
                    }
                } else {
                    var req = cmd.a;
                    return A2($elm$core$Task$andThen, function(pid) {
                        var _v4 = req.tracker;
                        if (_v4.$ === 'Nothing') return A3($elm$http$Http$updateReqs, router, otherCmds, reqs);
                        else {
                            var tracker = _v4.a;
                            return A3($elm$http$Http$updateReqs, router, otherCmds, A3($elm$core$Dict$insert, tracker, pid, reqs));
                        }
                    }, $elm$core$Process$spawn(A3(_Http_toTask, router, $elm$core$Platform$sendToApp(router), req)));
                }
            }
        }
    });
    var $elm$http$Http$onEffects = F4(function(router, cmds, subs, state) {
        return A2($elm$core$Task$andThen, function(reqs) {
            return $elm$core$Task$succeed(A2($elm$http$Http$State, reqs, subs));
        }, A3($elm$http$Http$updateReqs, router, cmds, state.reqs));
    });
    var $elm$core$List$maybeCons = F3(function(f, mx, xs) {
        var _v0 = f(mx);
        if (_v0.$ === 'Just') {
            var x = _v0.a;
            return A2($elm$core$List$cons, x, xs);
        } else return xs;
    });
    var $elm$core$List$filterMap = F2(function(f, xs) {
        return A3($elm$core$List$foldr, $elm$core$List$maybeCons(f), _List_Nil, xs);
    });
    var $elm$http$Http$maybeSend = F4(function(router, desiredTracker, progress, _v0) {
        var actualTracker = _v0.a;
        var toMsg = _v0.b;
        return _Utils_eq(desiredTracker, actualTracker) ? $elm$core$Maybe$Just(A2($elm$core$Platform$sendToApp, router, toMsg(progress))) : $elm$core$Maybe$Nothing;
    });
    var $elm$http$Http$onSelfMsg = F3(function(router, _v0, state) {
        var tracker = _v0.a;
        var progress = _v0.b;
        return A2($elm$core$Task$andThen, function(_v1) {
            return $elm$core$Task$succeed(state);
        }, $elm$core$Task$sequence(A2($elm$core$List$filterMap, A3($elm$http$Http$maybeSend, router, tracker, progress), state.subs)));
    });
    var $elm$http$Http$Cancel = function(a) {
        return {
            $: 'Cancel',
            a: a
        };
    };
    var $elm$http$Http$cmdMap = F2(function(func, cmd) {
        if (cmd.$ === 'Cancel') {
            var tracker = cmd.a;
            return $elm$http$Http$Cancel(tracker);
        } else {
            var r = cmd.a;
            return $elm$http$Http$Request({
                allowCookiesFromOtherDomains: r.allowCookiesFromOtherDomains,
                body: r.body,
                expect: A2(_Http_mapExpect, func, r.expect),
                headers: r.headers,
                method: r.method,
                timeout: r.timeout,
                tracker: r.tracker,
                url: r.url
            });
        }
    });
    var $elm$http$Http$MySub = F2(function(a, b) {
        return {
            $: 'MySub',
            a: a,
            b: b
        };
    });
    var $elm$http$Http$subMap = F2(function(func, _v0) {
        var tracker = _v0.a;
        var toMsg = _v0.b;
        return A2($elm$http$Http$MySub, tracker, A2($elm$core$Basics$composeR, toMsg, func));
    });
    _Platform_effectManagers['Http'] = _Platform_createManager($elm$http$Http$init, $elm$http$Http$onEffects, $elm$http$Http$onSelfMsg, $elm$http$Http$cmdMap, $elm$http$Http$subMap);
    var $elm$http$Http$command = _Platform_leaf('Http');
    var $elm$http$Http$subscription = _Platform_leaf('Http');
    var $elm$http$Http$request = function(r) {
        return $elm$http$Http$command($elm$http$Http$Request({
            allowCookiesFromOtherDomains: false,
            body: r.body,
            expect: r.expect,
            headers: r.headers,
            method: r.method,
            timeout: r.timeout,
            tracker: r.tracker,
            url: r.url
        }));
    };
    var $elm$http$Http$post = function(r) {
        return $elm$http$Http$request({
            body: r.body,
            expect: r.expect,
            headers: _List_Nil,
            method: 'POST',
            timeout: $elm$core$Maybe$Nothing,
            tracker: $elm$core$Maybe$Nothing,
            url: r.url
        });
    };
    var $elm$core$String$fromFloat = _String_fromNumber;
    var $author$project$Api$graphQLValueToString = function(graphQLValue) {
        switch(graphQLValue.$){
            case 'GraphQLString':
                var string = graphQLValue.a;
                return A2($elm$json$Json$Encode$encode, 0, $elm$json$Json$Encode$string(string));
            case 'GraphQLEnum':
                var string = graphQLValue.a;
                return string;
            case 'GraphQLInt':
                var _int = graphQLValue.a;
                return $elm$core$String$fromInt(_int);
            case 'GraphQLFloat':
                var _float = graphQLValue.a;
                return $elm$core$String$fromFloat(_float);
            case 'GraphQLObject':
                var object = graphQLValue.a;
                return '{' + (A2($elm$core$String$join, ', ', A2($elm$core$List$map, function(_v1) {
                    var argsName = _v1.a;
                    var argsValue = _v1.b;
                    return argsName + (': ' + $author$project$Api$graphQLValueToString(argsValue));
                }, object)) + '}');
            case 'GraphQLList':
                var list = graphQLValue.a;
                return '[' + (A2($elm$core$String$join, ', ', A2($elm$core$List$map, $author$project$Api$graphQLValueToString, list)) + ']');
            default:
                return 'null';
        }
    };
    var $author$project$Api$fieldToString = function(_v0) {
        var name = _v0.a.name;
        var args = _v0.a.args;
        var _return = _v0.a._return;
        return _Utils_ap(name, _Utils_ap(_Utils_eq(args, _List_Nil) ? '' : '(' + (A2($elm$core$String$join, ', ', A2($elm$core$List$map, function(_v1) {
            var argsName = _v1.a;
            var argsValue = _v1.b;
            return argsName + (': ' + $author$project$Api$graphQLValueToString(argsValue));
        }, args)) + ')'), _Utils_eq(_return, _List_Nil) ? '' : ' {\n' + (A2($elm$core$String$join, '\n', A2($elm$core$List$map, $author$project$Api$fieldToString, _return)) + '\n}')));
    };
    var $author$project$Api$queryToString = function(query) {
        if (query.$ === 'Mutation') {
            var fieldList = query.a;
            return 'mutation {\n' + (A2($elm$core$String$join, '\n', A2($elm$core$List$map, $author$project$Api$fieldToString, fieldList)) + '}');
        } else {
            var fieldList = query.a;
            return '{\n' + (A2($elm$core$String$join, '\n', A2($elm$core$List$map, $author$project$Api$fieldToString, fieldList)) + '}');
        }
    };
    var $author$project$Api$graphQlApiRequest = F3(function(query, responseDecoder, callBack) {
        return $elm$http$Http$post({
            body: $author$project$Api$graphQlRequestBody($author$project$Api$queryToString(query)),
            expect: A2($elm$http$Http$expectStringResponse, callBack, $author$project$Api$graphQlResponseDecoder(responseDecoder)),
            url: 'https://asia-northeast1-tsukumart-f0971.cloudfunctions.net/api'
        });
    });
    var $author$project$Data$Product$Id = function(a) {
        return {
            $: 'Id',
            a: a
        };
    };
    var $author$project$Data$Product$idFromString = $author$project$Data$Product$Id;
    var $author$project$Data$ImageId$ImageId = function(a) {
        return {
            $: 'ImageId',
            a: a
        };
    };
    var $author$project$Data$ImageId$fromString = $author$project$Data$ImageId$ImageId;
    var $author$project$Api$imageIdDecoder = A2($elm$json$Json$Decode$map, function(string) {
        return $author$project$Data$ImageId$fromString(string);
    }, $elm$json$Json$Decode$string);
    var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
    var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required = F3(function(key, valDecoder, decoder) {
        return A2($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom, A2($elm$json$Json$Decode$field, key, valDecoder), decoder);
    });
    var $author$project$Data$User$WithName = function(a) {
        return {
            $: 'WithName',
            a: a
        };
    };
    var $author$project$Data$User$Id = function(a) {
        return {
            $: 'Id',
            a: a
        };
    };
    var $author$project$Data$User$idFromString = $author$project$Data$User$Id;
    var $author$project$Data$User$withNameFromApi = function(_v0) {
        var id = _v0.id;
        var displayName = _v0.displayName;
        var imageId = _v0.imageId;
        return $author$project$Data$User$WithName({
            displayName: displayName,
            id: $author$project$Data$User$idFromString(id),
            imageId: imageId
        });
    };
    var $author$project$Api$profileAndLikedProductsIdDecoder = A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'likedProductAll', $elm$json$Json$Decode$list(A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$string)), A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'imageId', $author$project$Api$imageIdDecoder, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'displayName', $elm$json$Json$Decode$string, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'id', $elm$json$Json$Decode$string, $elm$json$Json$Decode$succeed(F4(function(id, displayName, imageId, likedProductIds) {
        return _Utils_Tuple2($author$project$Data$User$withNameFromApi({
            displayName: displayName,
            id: id,
            imageId: imageId
        }), A2($elm$core$List$map, $author$project$Data$Product$idFromString, likedProductIds));
    }))))));
    var $author$project$Api$tokenToString = function(_v0) {
        var accessToken = _v0.a;
        return accessToken;
    };
    var $author$project$Api$getMyNameAndLikedProductsId = function(token) {
        return A2($author$project$Api$graphQlApiRequest, $author$project$Api$Query(_List_fromArray([
            $author$project$Api$Field({
                args: _List_fromArray([
                    _Utils_Tuple2('accessToken', $author$project$Api$GraphQLString($author$project$Api$tokenToString(token)))
                ]),
                name: 'userPrivate',
                _return: _List_fromArray([
                    $author$project$Api$Field({
                        args: _List_Nil,
                        name: 'id',
                        _return: _List_Nil
                    }),
                    $author$project$Api$Field({
                        args: _List_Nil,
                        name: 'displayName',
                        _return: _List_Nil
                    }),
                    $author$project$Api$Field({
                        args: _List_Nil,
                        name: 'imageId',
                        _return: _List_Nil
                    }),
                    $author$project$Api$Field({
                        args: _List_Nil,
                        name: 'likedProductAll',
                        _return: _List_fromArray([
                            $author$project$Api$Field({
                                args: _List_Nil,
                                name: 'id',
                                _return: _List_Nil
                            })
                        ])
                    })
                ])
            })
        ])), A2($elm$json$Json$Decode$field, 'userPrivate', $author$project$Api$profileAndLikedProductsIdDecoder));
    };
    var $elm$time$Time$Name = function(a) {
        return {
            $: 'Name',
            a: a
        };
    };
    var $elm$time$Time$Offset = function(a) {
        return {
            $: 'Offset',
            a: a
        };
    };
    var $elm$time$Time$Zone = F2(function(a, b) {
        return {
            $: 'Zone',
            a: a,
            b: b
        };
    });
    var $elm$time$Time$customZone = $elm$time$Time$Zone;
    var $elm$time$Time$here = _Time_here(_Utils_Tuple0);
    var $author$project$PageLocation$InitAbout = {
        $: 'InitAbout'
    };
    var $author$project$PageLocation$InitAboutPrivacyPolicy = {
        $: 'InitAboutPrivacyPolicy'
    };
    var $author$project$PageLocation$InitBoughtProducts = {
        $: 'InitBoughtProducts'
    };
    var $author$project$PageLocation$InitCommentedProducts = {
        $: 'InitCommentedProducts'
    };
    var $author$project$PageLocation$InitExhibition = {
        $: 'InitExhibition'
    };
    var $author$project$PageLocation$InitHistory = {
        $: 'InitHistory'
    };
    var $author$project$PageLocation$InitLikedProducts = {
        $: 'InitLikedProducts'
    };
    var $author$project$PageLocation$InitLogIn = {
        $: 'InitLogIn'
    };
    var $author$project$PageLocation$InitNotification = {
        $: 'InitNotification'
    };
    var $author$project$PageLocation$InitProduct = function(a) {
        return {
            $: 'InitProduct',
            a: a
        };
    };
    var $author$project$PageLocation$InitSearch = {
        $: 'InitSearch'
    };
    var $author$project$PageLocation$InitSearchResult = function(a) {
        return {
            $: 'InitSearchResult',
            a: a
        };
    };
    var $author$project$PageLocation$InitSoldProducts = function(a) {
        return {
            $: 'InitSoldProducts',
            a: a
        };
    };
    var $author$project$PageLocation$InitTrade = function(a) {
        return {
            $: 'InitTrade',
            a: a
        };
    };
    var $author$project$PageLocation$InitTradedProducts = {
        $: 'InitTradedProducts'
    };
    var $author$project$PageLocation$InitTradingProducts = {
        $: 'InitTradingProducts'
    };
    var $author$project$PageLocation$InitUser = function(a) {
        return {
            $: 'InitUser',
            a: a
        };
    };
    var $author$project$PageLocation$aboutPath = 'about';
    var $author$project$PageLocation$aboutParser = function(path) {
        return _Utils_eq(path, _List_fromArray([
            $author$project$PageLocation$aboutPath
        ])) ? $elm$core$Maybe$Just(_Utils_Tuple0) : $elm$core$Maybe$Nothing;
    };
    var $author$project$PageLocation$aboutPrivacyPolicyPath = 'privacy-policy';
    var $author$project$PageLocation$aboutPrivacyPolicyParser = function(path) {
        return _Utils_eq(path, _List_fromArray([
            $author$project$PageLocation$aboutPath,
            $author$project$PageLocation$aboutPrivacyPolicyPath
        ])) ? $elm$core$Maybe$Just(_Utils_Tuple0) : $elm$core$Maybe$Nothing;
    };
    var $elm$core$Basics$always = F2(function(a, _v0) {
        return a;
    });
    var $author$project$PageLocation$boughtProductsPath = _List_fromArray([
        'bought-products'
    ]);
    var $author$project$PageLocation$boughtProductsParser = function(path) {
        return _Utils_eq(path, $author$project$PageLocation$boughtProductsPath) ? $elm$core$Maybe$Just(_Utils_Tuple0) : $elm$core$Maybe$Nothing;
    };
    var $author$project$PageLocation$commentedProductsPath = _List_fromArray([
        'commented-products'
    ]);
    var $author$project$PageLocation$commentedProductsParser = function(path) {
        return _Utils_eq(path, $author$project$PageLocation$commentedProductsPath) ? $elm$core$Maybe$Just(_Utils_Tuple0) : $elm$core$Maybe$Nothing;
    };
    var $author$project$PageLocation$exhibitionPath = _List_fromArray([
        'exhibition'
    ]);
    var $author$project$PageLocation$exhibitionParser = function(path) {
        return _Utils_eq(path, $author$project$PageLocation$exhibitionPath) ? $elm$core$Maybe$Just(_Utils_Tuple0) : $elm$core$Maybe$Nothing;
    };
    var $elm$core$Dict$fromList = function(assocs) {
        return A3($elm$core$List$foldl, F2(function(_v0, dict) {
            var key = _v0.a;
            var value = _v0.b;
            return A3($elm$core$Dict$insert, key, value, dict);
        }), $elm$core$Dict$empty, assocs);
    };
    var $author$project$PageLocation$historyPath = _List_fromArray([
        'history'
    ]);
    var $author$project$PageLocation$historyParser = function(path) {
        return _Utils_eq(path, $author$project$PageLocation$historyPath) ? $elm$core$Maybe$Just(_Utils_Tuple0) : $elm$core$Maybe$Nothing;
    };
    var $author$project$PageLocation$homePath = _List_Nil;
    var $author$project$PageLocation$homeParser = function(path) {
        return _Utils_eq(path, $author$project$PageLocation$homePath) ? $elm$core$Maybe$Just(_Utils_Tuple0) : $elm$core$Maybe$Nothing;
    };
    var $author$project$PageLocation$likedProductsPath = _List_fromArray([
        'liked-products'
    ]);
    var $author$project$PageLocation$likedProductsParser = function(path) {
        return _Utils_eq(path, $author$project$PageLocation$likedProductsPath) ? $elm$core$Maybe$Just(_Utils_Tuple0) : $elm$core$Maybe$Nothing;
    };
    var $author$project$PageLocation$logInPath = _List_fromArray([
        'login'
    ]);
    var $author$project$PageLocation$logInParser = function(path) {
        return _Utils_eq(path, $author$project$PageLocation$logInPath) ? $elm$core$Maybe$Just(_Utils_Tuple0) : $elm$core$Maybe$Nothing;
    };
    var $elm$core$Maybe$map = F2(function(f, maybe) {
        if (maybe.$ === 'Just') {
            var value = maybe.a;
            return $elm$core$Maybe$Just(f(value));
        } else return $elm$core$Maybe$Nothing;
    });
    var $author$project$PageLocation$notificationPath = 'notification';
    var $author$project$PageLocation$notificationParser = function(path) {
        return _Utils_eq(path, _List_fromArray([
            $author$project$PageLocation$notificationPath
        ])) ? $elm$core$Maybe$Just(_Utils_Tuple0) : $elm$core$Maybe$Nothing;
    };
    var $author$project$PageLocation$oneOf = function(list) {
        oneOf: while(true){
            if (list.b) {
                if (list.a.$ === 'Just') {
                    var x = list.a.a;
                    return $elm$core$Maybe$Just(x);
                } else {
                    var _v1 = list.a;
                    var xs = list.b;
                    var $temp$list = xs;
                    list = $temp$list;
                    continue oneOf;
                }
            } else return $elm$core$Maybe$Nothing;
        }
    };
    var $elm$core$List$head = function(list) {
        if (list.b) {
            var x = list.a;
            var xs = list.b;
            return $elm$core$Maybe$Just(x);
        } else return $elm$core$Maybe$Nothing;
    };
    var $elm$core$Maybe$withDefault = F2(function(_default, maybe) {
        if (maybe.$ === 'Just') {
            var value = maybe.a;
            return value;
        } else return _default;
    });
    var $RomanErnst$erl$Erl$extractProtocol = function(str) {
        var parts = A2($elm$core$String$split, '://', str);
        var _v0 = $elm$core$List$length(parts);
        if (_v0 === 1) return '';
        else return A2($elm$core$Maybe$withDefault, '', $elm$core$List$head(parts));
    };
    var $elm$regex$Regex$Match = F4(function(match, index, number, submatches) {
        return {
            index: index,
            match: match,
            number: number,
            submatches: submatches
        };
    });
    var $elm$regex$Regex$findAtMost = _Regex_findAtMost;
    var $elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
    var $elm$regex$Regex$fromString = function(string) {
        return A2($elm$regex$Regex$fromStringWith, {
            caseInsensitive: false,
            multiline: false
        }, string);
    };
    var $RomanErnst$erl$Erl$extractPort = function(str) {
        var res = A2($elm$core$Maybe$withDefault, _List_Nil, A2($elm$core$Maybe$map, function(rx) {
            return A3($elm$regex$Regex$findAtMost, 1, rx, str);
        }, $elm$regex$Regex$fromString(':\\d+')));
        return (function(result) {
            if (result.$ === 'Just') {
                var port_ = result.a;
                return port_;
            } else {
                var _v1 = $RomanErnst$erl$Erl$extractProtocol(str);
                switch(_v1){
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
        })($elm$core$String$toInt(A2($elm$core$String$dropLeft, 1, A2($elm$core$Maybe$withDefault, '', $elm$core$List$head(A2($elm$core$List$map, function($) {
            return $.match;
        }, res))))));
    };
    var $elm$regex$Regex$contains = _Regex_contains;
    var $RomanErnst$erl$Erl$leftFromOrSame = F2(function(delimiter, str) {
        var parts = A2($elm$core$String$split, delimiter, str);
        return A2($elm$core$Maybe$withDefault, '', $elm$core$List$head(parts));
    });
    var $RomanErnst$erl$Erl$rightFromOrSame = F2(function(delimiter, str) {
        var parts = A2($elm$core$String$split, delimiter, str);
        return A2($elm$core$Maybe$withDefault, '', $elm$core$List$head($elm$core$List$reverse(parts)));
    });
    var $RomanErnst$erl$Erl$extractHost = function(str) {
        if (A2($elm$core$String$contains, '//', str)) return A2($RomanErnst$erl$Erl$leftFromOrSame, ':', A2($RomanErnst$erl$Erl$leftFromOrSame, '/', A2($RomanErnst$erl$Erl$rightFromOrSame, '//', str)));
        else {
            var matches = function(s) {
                return A2($elm$core$Maybe$withDefault, _List_Nil, A2($elm$core$Maybe$map, function(rx) {
                    return A3($elm$regex$Regex$findAtMost, 1, rx, s);
                }, $elm$regex$Regex$fromString('((\\w|-)+\\.)+(\\w|-)+')));
            };
            return A2($elm$core$Maybe$withDefault, '', A2($elm$core$Maybe$map, function($) {
                return $.match;
            }, $elm$core$List$head(matches(A2($RomanErnst$erl$Erl$leftFromOrSame, '/', A2($RomanErnst$erl$Erl$rightFromOrSame, '//', str))))));
        }
    };
    var $elm$regex$Regex$replaceAtMost = _Regex_replaceAtMost;
    var $RomanErnst$erl$Erl$extractPath = function(str) {
        var replace = F2(function(maybeRegex, s) {
            return A2($elm$core$Maybe$withDefault, s, A2($elm$core$Maybe$map, function(rx) {
                return A4($elm$regex$Regex$replaceAtMost, 1, rx, function(_v0) {
                    return '';
                }, s);
            }, maybeRegex));
        });
        var host_ = $RomanErnst$erl$Erl$extractHost(str);
        return A2(replace, $elm$regex$Regex$fromString(':\\d+'), A2(replace, $elm$regex$Regex$fromString(host_), A2($RomanErnst$erl$Erl$leftFromOrSame, '#', A2($RomanErnst$erl$Erl$leftFromOrSame, '?', A2($RomanErnst$erl$Erl$rightFromOrSame, '//', str)))));
    };
    var $RomanErnst$erl$Erl$hasLeadingSlashFromAll = function(str) {
        return A2($elm$core$Maybe$withDefault, false, A2($elm$core$Maybe$map, function(rx) {
            return A2($elm$regex$Regex$contains, rx, $RomanErnst$erl$Erl$extractPath(str));
        }, $elm$regex$Regex$fromString('^/')));
    };
    var $RomanErnst$erl$Erl$hasTrailingSlashFromAll = function(str) {
        return A2($elm$core$Maybe$withDefault, false, A2($elm$core$Maybe$map, function(rx) {
            return A2($elm$regex$Regex$contains, rx, $RomanErnst$erl$Erl$extractPath(str));
        }, $elm$regex$Regex$fromString('/$')));
    };
    var $elm$core$List$drop = F2(function(n, list) {
        drop: while(true){
            if (n <= 0) return list;
            else {
                if (!list.b) return list;
                else {
                    var x = list.a;
                    var xs = list.b;
                    var $temp$n = n - 1, $temp$list = xs;
                    n = $temp$n;
                    list = $temp$list;
                    continue drop;
                }
            }
        }
    });
    var $RomanErnst$erl$Erl$extractHash = function(str) {
        return A2($elm$core$Maybe$withDefault, '', $elm$core$List$head(A2($elm$core$List$drop, 1, A2($elm$core$String$split, '#', str))));
    };
    var $RomanErnst$erl$Erl$hashFromAll = function(str) {
        return $RomanErnst$erl$Erl$extractHash(str);
    };
    var $RomanErnst$erl$Erl$parseHost = function(str) {
        return A2($elm$core$String$split, '.', str);
    };
    var $RomanErnst$erl$Erl$host = function(str) {
        return $RomanErnst$erl$Erl$parseHost($RomanErnst$erl$Erl$extractHost(str));
    };
    var $elm$core$List$filter = F2(function(isGood, list) {
        return A3($elm$core$List$foldr, F2(function(x, xs) {
            return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
        }), _List_Nil, list);
    });
    var $elm$core$Basics$not = _Basics_not;
    var $RomanErnst$erl$Erl$notEmpty = function(str) {
        return !$elm$core$String$isEmpty(str);
    };
    var $elm$url$Url$percentDecode = _Url_percentDecode;
    var $RomanErnst$erl$Erl$parsePath = function(str) {
        return A2($elm$core$List$map, $elm$core$Maybe$withDefault(''), A2($elm$core$List$map, $elm$url$Url$percentDecode, A2($elm$core$List$filter, $RomanErnst$erl$Erl$notEmpty, A2($elm$core$String$split, '/', str))));
    };
    var $RomanErnst$erl$Erl$pathFromAll = function(str) {
        return $RomanErnst$erl$Erl$parsePath($RomanErnst$erl$Erl$extractPath(str));
    };
    var $RomanErnst$erl$Erl$extractQuery = function(str) {
        return A2($elm$core$Maybe$withDefault, '', $elm$core$List$head(A2($elm$core$String$split, '#', A2($elm$core$Maybe$withDefault, '', $elm$core$List$head(A2($elm$core$List$drop, 1, A2($elm$core$String$split, '?', str)))))));
    };
    var $RomanErnst$erl$Erl$queryStringElementToTuple = function(element) {
        var splitted = A2($elm$core$String$split, '=', element);
        var second = A2($elm$core$Maybe$withDefault, '', $elm$core$List$head(A2($elm$core$List$drop, 1, splitted)));
        var secondDecoded = A2($elm$core$Maybe$withDefault, '', $elm$url$Url$percentDecode(second));
        var first = A2($elm$core$Maybe$withDefault, '', $elm$core$List$head(splitted));
        var firstDecoded = A2($elm$core$Maybe$withDefault, '', $elm$url$Url$percentDecode(first));
        return _Utils_Tuple2(firstDecoded, secondDecoded);
    };
    var $RomanErnst$erl$Erl$parseQuery = function(queryString) {
        var splitted = A2($elm$core$String$split, '&', queryString);
        return $elm$core$String$isEmpty(queryString) ? _List_Nil : A2($elm$core$List$map, $RomanErnst$erl$Erl$queryStringElementToTuple, splitted);
    };
    var $RomanErnst$erl$Erl$queryFromAll = function(all) {
        return $RomanErnst$erl$Erl$parseQuery($RomanErnst$erl$Erl$extractQuery(all));
    };
    var $RomanErnst$erl$Erl$parse = function(str) {
        return {
            hasLeadingSlash: $RomanErnst$erl$Erl$hasLeadingSlashFromAll(str),
            hasTrailingSlash: $RomanErnst$erl$Erl$hasTrailingSlashFromAll(str),
            hash: $RomanErnst$erl$Erl$hashFromAll(str),
            host: $RomanErnst$erl$Erl$host(str),
            password: '',
            path: $RomanErnst$erl$Erl$pathFromAll(str),
            port_: $RomanErnst$erl$Erl$extractPort(str),
            protocol: $RomanErnst$erl$Erl$extractProtocol(str),
            query: $RomanErnst$erl$Erl$queryFromAll(str),
            username: ''
        };
    };
    var $author$project$PageLocation$parserMap = F3(function(f, parser, path) {
        return A2($elm$core$Maybe$map, f, parser(path));
    });
    var $author$project$PageLocation$productParser = function(path) {
        if (path.b && path.a === 'product' && path.b.b && !path.b.b.b) {
            var _v1 = path.b;
            var productIdString = _v1.a;
            return $elm$core$Maybe$Just($author$project$Data$Product$idFromString(productIdString));
        } else return $elm$core$Maybe$Nothing;
    };
    var $elm$core$Dict$isEmpty = function(dict) {
        if (dict.$ === 'RBEmpty_elm_builtin') return true;
        else return false;
    };
    var $author$project$PageLocation$searchPath = _List_fromArray([
        'search'
    ]);
    var $author$project$PageLocation$searchParser = F2(function(fragment, path) {
        return _Utils_eq(path, $author$project$PageLocation$searchPath) && $elm$core$Dict$isEmpty(fragment) ? $elm$core$Maybe$Just(_Utils_Tuple0) : $elm$core$Maybe$Nothing;
    });
    var $author$project$Data$SearchCondition$CategoryCategory = function(a) {
        return {
            $: 'CategoryCategory',
            a: a
        };
    };
    var $author$project$Data$SearchCondition$CategoryGroup = function(a) {
        return {
            $: 'CategoryGroup',
            a: a
        };
    };
    var $author$project$Data$SearchCondition$CategoryNone = {
        $: 'CategoryNone'
    };
    var $author$project$Data$SearchCondition$UniversityDepartment = function(a) {
        return {
            $: 'UniversityDepartment',
            a: a
        };
    };
    var $author$project$Data$SearchCondition$UniversityGraduate = function(a) {
        return {
            $: 'UniversityGraduate',
            a: a
        };
    };
    var $author$project$Data$SearchCondition$UniversityNone = {
        $: 'UniversityNone'
    };
    var $author$project$Data$SearchCondition$UniversitySchool = function(a) {
        return {
            $: 'UniversitySchool',
            a: a
        };
    };
    var $author$project$Data$University$DAandd = {
        $: 'DAandd'
    };
    var $author$project$Data$University$DBiol = {
        $: 'DBiol'
    };
    var $author$project$Data$University$DBres = {
        $: 'DBres'
    };
    var $author$project$Data$University$DChem = {
        $: 'DChem'
    };
    var $author$project$Data$University$DCis = {
        $: 'DCis'
    };
    var $author$project$Data$University$DCoens = {
        $: 'DCoens'
    };
    var $author$project$Data$University$DCoins = {
        $: 'DCoins'
    };
    var $author$project$Data$University$DCulture = {
        $: 'DCulture'
    };
    var $author$project$Data$University$DDisability = {
        $: 'DDisability'
    };
    var $author$project$Data$University$DEarth = {
        $: 'DEarth'
    };
    var $author$project$Data$University$DEducation = {
        $: 'DEducation'
    };
    var $author$project$Data$University$DEsys = {
        $: 'DEsys'
    };
    var $author$project$Data$University$DHumanity = {
        $: 'DHumanity'
    };
    var $author$project$Data$University$DJapanese = {
        $: 'DJapanese'
    };
    var $author$project$Data$University$DKlis = {
        $: 'DKlis'
    };
    var $author$project$Data$University$DMast = {
        $: 'DMast'
    };
    var $author$project$Data$University$DMath = {
        $: 'DMath'
    };
    var $author$project$Data$University$DMed = {
        $: 'DMed'
    };
    var $author$project$Data$University$DMs = {
        $: 'DMs'
    };
    var $author$project$Data$University$DNurse = {
        $: 'DNurse'
    };
    var $author$project$Data$University$DPandps = {
        $: 'DPandps'
    };
    var $author$project$Data$University$DPhys = {
        $: 'DPhys'
    };
    var $author$project$Data$University$DPsyche = {
        $: 'DPsyche'
    };
    var $author$project$Data$University$DSocial = {
        $: 'DSocial'
    };
    var $author$project$Data$University$DSport = {
        $: 'DSport'
    };
    var $author$project$Data$University$departmentAll = _List_fromArray([
        $author$project$Data$University$DHumanity,
        $author$project$Data$University$DCulture,
        $author$project$Data$University$DJapanese,
        $author$project$Data$University$DSocial,
        $author$project$Data$University$DCis,
        $author$project$Data$University$DEducation,
        $author$project$Data$University$DPsyche,
        $author$project$Data$University$DDisability,
        $author$project$Data$University$DBiol,
        $author$project$Data$University$DBres,
        $author$project$Data$University$DEarth,
        $author$project$Data$University$DMath,
        $author$project$Data$University$DPhys,
        $author$project$Data$University$DChem,
        $author$project$Data$University$DCoens,
        $author$project$Data$University$DEsys,
        $author$project$Data$University$DPandps,
        $author$project$Data$University$DCoins,
        $author$project$Data$University$DMast,
        $author$project$Data$University$DKlis,
        $author$project$Data$University$DMed,
        $author$project$Data$University$DNurse,
        $author$project$Data$University$DMs,
        $author$project$Data$University$DAandd,
        $author$project$Data$University$DSport
    ]);
    var $author$project$Data$University$departmentToIdString = function(department) {
        switch(department.$){
            case 'DHumanity':
                return 'humanity';
            case 'DCulture':
                return 'culture';
            case 'DJapanese':
                return 'japanese';
            case 'DSocial':
                return 'social';
            case 'DCis':
                return 'cis';
            case 'DEducation':
                return 'education';
            case 'DPsyche':
                return 'psyche';
            case 'DDisability':
                return 'disability';
            case 'DBiol':
                return 'biol';
            case 'DBres':
                return 'bres';
            case 'DEarth':
                return 'earth';
            case 'DMath':
                return 'math';
            case 'DPhys':
                return 'phys';
            case 'DChem':
                return 'chem';
            case 'DCoens':
                return 'coens';
            case 'DEsys':
                return 'esys';
            case 'DPandps':
                return 'pandps';
            case 'DCoins':
                return 'coins';
            case 'DMast':
                return 'mast';
            case 'DKlis':
                return 'klis';
            case 'DMed':
                return 'med';
            case 'DNurse':
                return 'nurse';
            case 'DMs':
                return 'ms';
            case 'DAandd':
                return 'aandd';
            default:
                return 'sport';
        }
    };
    var $author$project$Data$University$departmentFromIdStringLoop = F2(function(idString, departmentList) {
        departmentFromIdStringLoop: while(true){
            if (departmentList.b) {
                var x = departmentList.a;
                var xs = departmentList.b;
                if (_Utils_eq($author$project$Data$University$departmentToIdString(x), idString)) return $elm$core$Maybe$Just(x);
                else {
                    var $temp$idString = idString, $temp$departmentList = xs;
                    idString = $temp$idString;
                    departmentList = $temp$departmentList;
                    continue departmentFromIdStringLoop;
                }
            } else return $elm$core$Maybe$Nothing;
        }
    });
    var $author$project$Data$University$departmentFromIdString = function(idString) {
        return A2($author$project$Data$University$departmentFromIdStringLoop, idString, $author$project$Data$University$departmentAll);
    };
    var $author$project$Data$Category$ApplianceCommunication = {
        $: 'ApplianceCommunication'
    };
    var $author$project$Data$Category$ApplianceHumidity = {
        $: 'ApplianceHumidity'
    };
    var $author$project$Data$Category$ApplianceLight = {
        $: 'ApplianceLight'
    };
    var $author$project$Data$Category$ApplianceMicrowave = {
        $: 'ApplianceMicrowave'
    };
    var $author$project$Data$Category$ApplianceOther = {
        $: 'ApplianceOther'
    };
    var $author$project$Data$Category$AppliancePc = {
        $: 'AppliancePc'
    };
    var $author$project$Data$Category$ApplianceRefrigerator = {
        $: 'ApplianceRefrigerator'
    };
    var $author$project$Data$Category$ApplianceSmartphone = {
        $: 'ApplianceSmartphone'
    };
    var $author$project$Data$Category$ApplianceSpeaker = {
        $: 'ApplianceSpeaker'
    };
    var $author$project$Data$Category$ApplianceTemperature = {
        $: 'ApplianceTemperature'
    };
    var $author$project$Data$Category$ApplianceTv = {
        $: 'ApplianceTv'
    };
    var $author$project$Data$Category$ApplianceVacuum = {
        $: 'ApplianceVacuum'
    };
    var $author$project$Data$Category$ApplianceWashing = {
        $: 'ApplianceWashing'
    };
    var $author$project$Data$Category$BookBook = {
        $: 'BookBook'
    };
    var $author$project$Data$Category$BookComic = {
        $: 'BookComic'
    };
    var $author$project$Data$Category$BookOther = {
        $: 'BookOther'
    };
    var $author$project$Data$Category$BookTextbook = {
        $: 'BookTextbook'
    };
    var $author$project$Data$Category$FashionLadies = {
        $: 'FashionLadies'
    };
    var $author$project$Data$Category$FashionMens = {
        $: 'FashionMens'
    };
    var $author$project$Data$Category$FashionOther = {
        $: 'FashionOther'
    };
    var $author$project$Data$Category$FoodBeverage = {
        $: 'FoodBeverage'
    };
    var $author$project$Data$Category$FoodFood = {
        $: 'FoodFood'
    };
    var $author$project$Data$Category$FoodOther = {
        $: 'FoodOther'
    };
    var $author$project$Data$Category$FurnitureBed = {
        $: 'FurnitureBed'
    };
    var $author$project$Data$Category$FurnitureChair = {
        $: 'FurnitureChair'
    };
    var $author$project$Data$Category$FurnitureChest = {
        $: 'FurnitureChest'
    };
    var $author$project$Data$Category$FurnitureCurtain = {
        $: 'FurnitureCurtain'
    };
    var $author$project$Data$Category$FurnitureKitchen = {
        $: 'FurnitureKitchen'
    };
    var $author$project$Data$Category$FurnitureMat = {
        $: 'FurnitureMat'
    };
    var $author$project$Data$Category$FurnitureOther = {
        $: 'FurnitureOther'
    };
    var $author$project$Data$Category$FurnitureTable = {
        $: 'FurnitureTable'
    };
    var $author$project$Data$Category$HobbyAccessory = {
        $: 'HobbyAccessory'
    };
    var $author$project$Data$Category$HobbyArt = {
        $: 'HobbyArt'
    };
    var $author$project$Data$Category$HobbyCamera = {
        $: 'HobbyCamera'
    };
    var $author$project$Data$Category$HobbyDaily = {
        $: 'HobbyDaily'
    };
    var $author$project$Data$Category$HobbyDisc = {
        $: 'HobbyDisc'
    };
    var $author$project$Data$Category$HobbyGame = {
        $: 'HobbyGame'
    };
    var $author$project$Data$Category$HobbyHandmade = {
        $: 'HobbyHandmade'
    };
    var $author$project$Data$Category$HobbyInstrument = {
        $: 'HobbyInstrument'
    };
    var $author$project$Data$Category$HobbyOther = {
        $: 'HobbyOther'
    };
    var $author$project$Data$Category$HobbySport = {
        $: 'HobbySport'
    };
    var $author$project$Data$Category$VehicleBicycle = {
        $: 'VehicleBicycle'
    };
    var $author$project$Data$Category$VehicleBike = {
        $: 'VehicleBike'
    };
    var $author$project$Data$Category$VehicleCar = {
        $: 'VehicleCar'
    };
    var $author$project$Data$Category$VehicleOther = {
        $: 'VehicleOther'
    };
    var $author$project$Data$Category$fromIdString = function(id) {
        switch(id){
            case 'furnitureTable':
                return $elm$core$Maybe$Just($author$project$Data$Category$FurnitureTable);
            case 'furnitureChair':
                return $elm$core$Maybe$Just($author$project$Data$Category$FurnitureChair);
            case 'furnitureChest':
                return $elm$core$Maybe$Just($author$project$Data$Category$FurnitureChest);
            case 'furnitureBed':
                return $elm$core$Maybe$Just($author$project$Data$Category$FurnitureBed);
            case 'furnitureKitchen':
                return $elm$core$Maybe$Just($author$project$Data$Category$FurnitureKitchen);
            case 'furnitureCurtain':
                return $elm$core$Maybe$Just($author$project$Data$Category$FurnitureCurtain);
            case 'furnitureMat':
                return $elm$core$Maybe$Just($author$project$Data$Category$FurnitureMat);
            case 'furnitureOther':
                return $elm$core$Maybe$Just($author$project$Data$Category$FurnitureOther);
            case 'applianceRefrigerator':
                return $elm$core$Maybe$Just($author$project$Data$Category$ApplianceRefrigerator);
            case 'applianceMicrowave':
                return $elm$core$Maybe$Just($author$project$Data$Category$ApplianceMicrowave);
            case 'applianceWashing':
                return $elm$core$Maybe$Just($author$project$Data$Category$ApplianceWashing);
            case 'applianceVacuum':
                return $elm$core$Maybe$Just($author$project$Data$Category$ApplianceVacuum);
            case 'applianceTemperature':
                return $elm$core$Maybe$Just($author$project$Data$Category$ApplianceTemperature);
            case 'applianceHumidity':
                return $elm$core$Maybe$Just($author$project$Data$Category$ApplianceHumidity);
            case 'applianceLight':
                return $elm$core$Maybe$Just($author$project$Data$Category$ApplianceLight);
            case 'applianceTv':
                return $elm$core$Maybe$Just($author$project$Data$Category$ApplianceTv);
            case 'applianceSpeaker':
                return $elm$core$Maybe$Just($author$project$Data$Category$ApplianceSpeaker);
            case 'applianceSmartphone':
                return $elm$core$Maybe$Just($author$project$Data$Category$ApplianceSmartphone);
            case 'appliancePc':
                return $elm$core$Maybe$Just($author$project$Data$Category$AppliancePc);
            case 'applianceCommunication':
                return $elm$core$Maybe$Just($author$project$Data$Category$ApplianceCommunication);
            case 'applianceOther':
                return $elm$core$Maybe$Just($author$project$Data$Category$ApplianceOther);
            case 'fashionMens':
                return $elm$core$Maybe$Just($author$project$Data$Category$FashionMens);
            case 'fashionLadies':
                return $elm$core$Maybe$Just($author$project$Data$Category$FashionLadies);
            case 'fashionOther':
                return $elm$core$Maybe$Just($author$project$Data$Category$FashionOther);
            case 'bookTextbook':
                return $elm$core$Maybe$Just($author$project$Data$Category$BookTextbook);
            case 'bookBook':
                return $elm$core$Maybe$Just($author$project$Data$Category$BookBook);
            case 'bookComic':
                return $elm$core$Maybe$Just($author$project$Data$Category$BookComic);
            case 'bookOther':
                return $elm$core$Maybe$Just($author$project$Data$Category$BookOther);
            case 'vehicleBicycle':
                return $elm$core$Maybe$Just($author$project$Data$Category$VehicleBicycle);
            case 'vehicleBike':
                return $elm$core$Maybe$Just($author$project$Data$Category$VehicleBike);
            case 'vehicleCar':
                return $elm$core$Maybe$Just($author$project$Data$Category$VehicleCar);
            case 'vehicleOther':
                return $elm$core$Maybe$Just($author$project$Data$Category$VehicleOther);
            case 'foodFood':
                return $elm$core$Maybe$Just($author$project$Data$Category$FoodFood);
            case 'foodBeverage':
                return $elm$core$Maybe$Just($author$project$Data$Category$FoodBeverage);
            case 'foodOther':
                return $elm$core$Maybe$Just($author$project$Data$Category$FoodOther);
            case 'hobbyDisc':
                return $elm$core$Maybe$Just($author$project$Data$Category$HobbyDisc);
            case 'hobbyInstrument':
                return $elm$core$Maybe$Just($author$project$Data$Category$HobbyInstrument);
            case 'hobbyCamera':
                return $elm$core$Maybe$Just($author$project$Data$Category$HobbyCamera);
            case 'hobbyGame':
                return $elm$core$Maybe$Just($author$project$Data$Category$HobbyGame);
            case 'hobbySport':
                return $elm$core$Maybe$Just($author$project$Data$Category$HobbySport);
            case 'hobbyArt':
                return $elm$core$Maybe$Just($author$project$Data$Category$HobbyArt);
            case 'hobbyAccessory':
                return $elm$core$Maybe$Just($author$project$Data$Category$HobbyAccessory);
            case 'hobbyDaily':
                return $elm$core$Maybe$Just($author$project$Data$Category$HobbyDaily);
            case 'hobbyHandmade':
                return $elm$core$Maybe$Just($author$project$Data$Category$HobbyHandmade);
            case 'hobbyOther':
                return $elm$core$Maybe$Just($author$project$Data$Category$HobbyOther);
            default:
                return $elm$core$Maybe$Nothing;
        }
    };
    var $author$project$Data$University$GChs = {
        $: 'GChs'
    };
    var $author$project$Data$University$GEducation = {
        $: 'GEducation'
    };
    var $author$project$Data$University$GGabs = {
        $: 'GGabs'
    };
    var $author$project$Data$University$GGlobal = {
        $: 'GGlobal'
    };
    var $author$project$Data$University$GHass = {
        $: 'GHass'
    };
    var $author$project$Data$University$GLife = {
        $: 'GLife'
    };
    var $author$project$Data$University$GPas = {
        $: 'GPas'
    };
    var $author$project$Data$University$GSie = {
        $: 'GSie'
    };
    var $author$project$Data$University$GSlis = {
        $: 'GSlis'
    };
    var $author$project$Data$University$graduateAllValue = _List_fromArray([
        $author$project$Data$University$GEducation,
        $author$project$Data$University$GHass,
        $author$project$Data$University$GGabs,
        $author$project$Data$University$GPas,
        $author$project$Data$University$GSie,
        $author$project$Data$University$GLife,
        $author$project$Data$University$GChs,
        $author$project$Data$University$GSlis,
        $author$project$Data$University$GGlobal
    ]);
    var $author$project$Data$University$graduateToIdString = function(graduate) {
        switch(graduate.$){
            case 'GEducation':
                return 'education';
            case 'GHass':
                return 'hass';
            case 'GGabs':
                return 'gabs';
            case 'GPas':
                return 'pas';
            case 'GSie':
                return 'sie';
            case 'GLife':
                return 'life';
            case 'GChs':
                return 'chs';
            case 'GSlis':
                return 'slis';
            default:
                return 'global';
        }
    };
    var $author$project$Data$University$graduateFromIdStringLoop = F2(function(idString, graduateList) {
        graduateFromIdStringLoop: while(true){
            if (graduateList.b) {
                var x = graduateList.a;
                var xs = graduateList.b;
                if (_Utils_eq($author$project$Data$University$graduateToIdString(x), idString)) return $elm$core$Maybe$Just(x);
                else {
                    var $temp$idString = idString, $temp$graduateList = xs;
                    idString = $temp$idString;
                    graduateList = $temp$graduateList;
                    continue graduateFromIdStringLoop;
                }
            } else return $elm$core$Maybe$Nothing;
        }
    });
    var $author$project$Data$University$graduateFromIdString = function(idString) {
        return A2($author$project$Data$University$graduateFromIdStringLoop, idString, $author$project$Data$University$graduateAllValue);
    };
    var $author$project$Data$Category$Appliance = {
        $: 'Appliance'
    };
    var $author$project$Data$Category$Book = {
        $: 'Book'
    };
    var $author$project$Data$Category$Fashion = {
        $: 'Fashion'
    };
    var $author$project$Data$Category$Food = {
        $: 'Food'
    };
    var $author$project$Data$Category$Furniture = {
        $: 'Furniture'
    };
    var $author$project$Data$Category$Hobby = {
        $: 'Hobby'
    };
    var $author$project$Data$Category$Vehicle = {
        $: 'Vehicle'
    };
    var $author$project$Data$Category$groupFromIdString = function(id) {
        switch(id){
            case 'furniture':
                return $elm$core$Maybe$Just($author$project$Data$Category$Furniture);
            case 'appliance':
                return $elm$core$Maybe$Just($author$project$Data$Category$Appliance);
            case 'fashion':
                return $elm$core$Maybe$Just($author$project$Data$Category$Fashion);
            case 'book':
                return $elm$core$Maybe$Just($author$project$Data$Category$Book);
            case 'vehicle':
                return $elm$core$Maybe$Just($author$project$Data$Category$Vehicle);
            case 'food':
                return $elm$core$Maybe$Just($author$project$Data$Category$Food);
            case 'hobby':
                return $elm$core$Maybe$Just($author$project$Data$Category$Hobby);
            default:
                return $elm$core$Maybe$Nothing;
        }
    };
    var $author$project$Data$SearchCondition$Condition = function(a) {
        return {
            $: 'Condition',
            a: a
        };
    };
    var $author$project$Data$SearchCondition$init = F3(function(query, category, university) {
        return $author$project$Data$SearchCondition$Condition({
            category: category,
            query: query,
            university: university
        });
    });
    var $author$project$Data$University$SAandd = {
        $: 'SAandd'
    };
    var $author$project$Data$University$SHuman = {
        $: 'SHuman'
    };
    var $author$project$Data$University$SHumcul = {
        $: 'SHumcul'
    };
    var $author$project$Data$University$SInfo = {
        $: 'SInfo'
    };
    var $author$project$Data$University$SLife = {
        $: 'SLife'
    };
    var $author$project$Data$University$SMed = {
        $: 'SMed'
    };
    var $author$project$Data$University$SSocint = {
        $: 'SSocint'
    };
    var $author$project$Data$University$SSport = {
        $: 'SSport'
    };
    var $author$project$Data$University$SSse = {
        $: 'SSse'
    };
    var $author$project$Data$University$schoolFromIdString = function(id) {
        switch(id){
            case 'humcul':
                return $elm$core$Maybe$Just($author$project$Data$University$SHumcul);
            case 'socint':
                return $elm$core$Maybe$Just($author$project$Data$University$SSocint);
            case 'human':
                return $elm$core$Maybe$Just($author$project$Data$University$SHuman);
            case 'life':
                return $elm$core$Maybe$Just($author$project$Data$University$SLife);
            case 'sse':
                return $elm$core$Maybe$Just($author$project$Data$University$SSse);
            case 'info':
                return $elm$core$Maybe$Just($author$project$Data$University$SInfo);
            case 'med':
                return $elm$core$Maybe$Just($author$project$Data$University$SMed);
            case 'aandd':
                return $elm$core$Maybe$Just($author$project$Data$University$SAandd);
            case 'sport':
                return $elm$core$Maybe$Just($author$project$Data$University$SSport);
            default:
                return $elm$core$Maybe$Nothing;
        }
    };
    var $author$project$PageLocation$searchResultParser = F2(function(fragment, path) {
        return _Utils_eq(path, $author$project$PageLocation$searchPath) ? $elm$core$Maybe$Just(A3($author$project$Data$SearchCondition$init, A2($elm$core$Maybe$withDefault, '', A2($elm$core$Dict$get, 'query', fragment)), function() {
            var _v0 = _Utils_Tuple2(A2($elm$core$Dict$get, 'categoryType', fragment), A2($elm$core$Dict$get, 'category', fragment));
            _v0$2: while(true){
                if (_v0.a.$ === 'Just' && _v0.b.$ === 'Just') switch(_v0.a.a){
                    case 'category':
                        var categoryString = _v0.b.a;
                        var _v1 = $author$project$Data$Category$fromIdString(categoryString);
                        if (_v1.$ === 'Just') {
                            var category = _v1.a;
                            return $author$project$Data$SearchCondition$CategoryCategory(category);
                        } else return $author$project$Data$SearchCondition$CategoryNone;
                    case 'group':
                        var groupString = _v0.b.a;
                        var _v2 = $author$project$Data$Category$groupFromIdString(groupString);
                        if (_v2.$ === 'Just') {
                            var group = _v2.a;
                            return $author$project$Data$SearchCondition$CategoryGroup(group);
                        } else return $author$project$Data$SearchCondition$CategoryNone;
                    default:
                        break _v0$2;
                }
                else break _v0$2;
            }
            return $author$project$Data$SearchCondition$CategoryNone;
        }(), function() {
            var _v3 = _Utils_Tuple2(A2($elm$core$Dict$get, 'universityType', fragment), A2($elm$core$Dict$get, 'university', fragment));
            _v3$3: while(true){
                if (_v3.a.$ === 'Just' && _v3.b.$ === 'Just') switch(_v3.a.a){
                    case 'department':
                        var departmentString = _v3.b.a;
                        var _v4 = $author$project$Data$University$departmentFromIdString(departmentString);
                        if (_v4.$ === 'Just') {
                            var department = _v4.a;
                            return $author$project$Data$SearchCondition$UniversityDepartment(department);
                        } else return $author$project$Data$SearchCondition$UniversityNone;
                    case 'school':
                        var schoolString = _v3.b.a;
                        var _v5 = $author$project$Data$University$schoolFromIdString(schoolString);
                        if (_v5.$ === 'Just') {
                            var school = _v5.a;
                            return $author$project$Data$SearchCondition$UniversitySchool(school);
                        } else return $author$project$Data$SearchCondition$UniversityNone;
                    case 'graduate':
                        var graduateString = _v3.b.a;
                        var _v6 = $author$project$Data$University$graduateFromIdString(graduateString);
                        if (_v6.$ === 'Just') {
                            var graduate = _v6.a;
                            return $author$project$Data$SearchCondition$UniversityGraduate(graduate);
                        } else return $author$project$Data$SearchCondition$UniversityNone;
                    default:
                        break _v3$3;
                }
                else break _v3$3;
            }
            return $author$project$Data$SearchCondition$UniversityNone;
        }())) : $elm$core$Maybe$Nothing;
    });
    var $author$project$PageLocation$soldProductsPath = 'sold-products';
    var $author$project$PageLocation$soldProductsParser = function(path) {
        if (path.b && path.b.b && !path.b.b.b) {
            var p = path.a;
            var _v1 = path.b;
            var userId = _v1.a;
            return _Utils_eq(p, $author$project$PageLocation$soldProductsPath) ? $elm$core$Maybe$Just($author$project$Data$User$idFromString(userId)) : $elm$core$Maybe$Nothing;
        } else return $elm$core$Maybe$Nothing;
    };
    var $elm$url$Url$addPort = F2(function(maybePort, starter) {
        if (maybePort.$ === 'Nothing') return starter;
        else {
            var port_ = maybePort.a;
            return starter + (':' + $elm$core$String$fromInt(port_));
        }
    });
    var $elm$url$Url$addPrefixed = F3(function(prefix, maybeSegment, starter) {
        if (maybeSegment.$ === 'Nothing') return starter;
        else {
            var segment = maybeSegment.a;
            return _Utils_ap(starter, _Utils_ap(prefix, segment));
        }
    });
    var $elm$url$Url$toString = function(url) {
        var http = function() {
            var _v0 = url.protocol;
            if (_v0.$ === 'Http') return 'http://';
            else return 'https://';
        }();
        return A3($elm$url$Url$addPrefixed, '#', url.fragment, A3($elm$url$Url$addPrefixed, '?', url.query, _Utils_ap(A2($elm$url$Url$addPort, url.port_, _Utils_ap(http, url.host)), url.path)));
    };
    var $author$project$Api$Token = function(a) {
        return {
            $: 'Token',
            a: a
        };
    };
    var $author$project$Api$tokenFromString = $author$project$Api$Token;
    var $author$project$Data$Trade$Id = function(a) {
        return {
            $: 'Id',
            a: a
        };
    };
    var $author$project$Data$Trade$idFromString = $author$project$Data$Trade$Id;
    var $author$project$PageLocation$tradeParser = function(path) {
        if (path.b && path.a === 'trade' && path.b.b && !path.b.b.b) {
            var _v1 = path.b;
            var idString = _v1.a;
            return $elm$core$Maybe$Just($author$project$Data$Trade$idFromString(idString));
        } else return $elm$core$Maybe$Nothing;
    };
    var $author$project$PageLocation$tradedProductsPath = _List_fromArray([
        'traded-products'
    ]);
    var $author$project$PageLocation$tradedProductsParser = function(path) {
        return _Utils_eq(path, $author$project$PageLocation$tradedProductsPath) ? $elm$core$Maybe$Just(_Utils_Tuple0) : $elm$core$Maybe$Nothing;
    };
    var $author$project$PageLocation$tradingProductsPath = _List_fromArray([
        'treading-products'
    ]);
    var $author$project$PageLocation$tradingProductsParser = function(path) {
        return _Utils_eq(path, $author$project$PageLocation$tradingProductsPath) ? $elm$core$Maybe$Just(_Utils_Tuple0) : $elm$core$Maybe$Nothing;
    };
    var $author$project$PageLocation$userParser = function(path) {
        if (path.b && path.a === 'user' && path.b.b && !path.b.b.b) {
            var _v1 = path.b;
            var userId = _v1.a;
            return $elm$core$Maybe$Just($author$project$Data$User$idFromString(userId));
        } else return $elm$core$Maybe$Nothing;
    };
    var $author$project$PageLocation$initFromUrl = function(url) {
        var _v0 = $RomanErnst$erl$Erl$parse($elm$url$Url$toString(url));
        var path = _v0.path;
        var hash = _v0.hash;
        var fragmentDict = $elm$core$Dict$fromList($RomanErnst$erl$Erl$parse('?' + hash).query);
        return _Utils_Tuple2(A2($elm$core$Maybe$map, $author$project$Api$tokenFromString, A2($elm$core$Dict$get, 'accessToken', fragmentDict)), $author$project$PageLocation$oneOf(A2($elm$core$List$map, function(f) {
            return f(path);
        }, _List_fromArray([
            A2($author$project$PageLocation$parserMap, $elm$core$Basics$always($author$project$PageLocation$InitHome), $author$project$PageLocation$homeParser),
            A2($author$project$PageLocation$parserMap, $elm$core$Basics$always($author$project$PageLocation$InitLogIn), $author$project$PageLocation$logInParser),
            A2($author$project$PageLocation$parserMap, $elm$core$Basics$always($author$project$PageLocation$InitLikedProducts), $author$project$PageLocation$likedProductsParser),
            A2($author$project$PageLocation$parserMap, $elm$core$Basics$always($author$project$PageLocation$InitHistory), $author$project$PageLocation$historyParser),
            A2($author$project$PageLocation$parserMap, $author$project$PageLocation$InitSoldProducts, $author$project$PageLocation$soldProductsParser),
            A2($author$project$PageLocation$parserMap, $elm$core$Basics$always($author$project$PageLocation$InitBoughtProducts), $author$project$PageLocation$boughtProductsParser),
            A2($author$project$PageLocation$parserMap, $elm$core$Basics$always($author$project$PageLocation$InitTradingProducts), $author$project$PageLocation$tradingProductsParser),
            A2($author$project$PageLocation$parserMap, $elm$core$Basics$always($author$project$PageLocation$InitTradedProducts), $author$project$PageLocation$tradedProductsParser),
            A2($author$project$PageLocation$parserMap, $elm$core$Basics$always($author$project$PageLocation$InitCommentedProducts), $author$project$PageLocation$commentedProductsParser),
            A2($author$project$PageLocation$parserMap, $elm$core$Basics$always($author$project$PageLocation$InitExhibition), $author$project$PageLocation$exhibitionParser),
            A2($author$project$PageLocation$parserMap, $author$project$PageLocation$InitProduct, $author$project$PageLocation$productParser),
            A2($author$project$PageLocation$parserMap, $author$project$PageLocation$InitTrade, $author$project$PageLocation$tradeParser),
            A2($author$project$PageLocation$parserMap, $author$project$PageLocation$InitUser, $author$project$PageLocation$userParser),
            A2($author$project$PageLocation$parserMap, $elm$core$Basics$always($author$project$PageLocation$InitSearch), $author$project$PageLocation$searchParser(fragmentDict)),
            A2($author$project$PageLocation$parserMap, $author$project$PageLocation$InitSearchResult, $author$project$PageLocation$searchResultParser(fragmentDict)),
            A2($author$project$PageLocation$parserMap, $elm$core$Basics$always($author$project$PageLocation$InitNotification), $author$project$PageLocation$notificationParser),
            A2($author$project$PageLocation$parserMap, $elm$core$Basics$always($author$project$PageLocation$InitAbout), $author$project$PageLocation$aboutParser),
            A2($author$project$PageLocation$parserMap, $elm$core$Basics$always($author$project$PageLocation$InitAboutPrivacyPolicy), $author$project$PageLocation$aboutPrivacyPolicyParser)
        ]))));
    };
    var $elm$url$Url$Builder$toQueryPair = function(_v0) {
        var key = _v0.a;
        var value = _v0.b;
        return key + ('=' + value);
    };
    var $elm$url$Url$Builder$toQuery = function(parameters) {
        if (!parameters.b) return '';
        else return '?' + A2($elm$core$String$join, '&', A2($elm$core$List$map, $elm$url$Url$Builder$toQueryPair, parameters));
    };
    var $elm$url$Url$Builder$absolute = F2(function(pathSegments, parameters) {
        return '/' + (A2($elm$core$String$join, '/', pathSegments) + $elm$url$Url$Builder$toQuery(parameters));
    });
    var $author$project$PageLocation$aboutPrivacyPolicyUrl = A2($elm$url$Url$Builder$absolute, _List_fromArray([
        $author$project$PageLocation$aboutPath,
        $author$project$PageLocation$aboutPrivacyPolicyPath
    ]), _List_Nil);
    var $author$project$PageLocation$aboutUrl = A2($elm$url$Url$Builder$absolute, _List_fromArray([
        $author$project$PageLocation$aboutPath
    ]), _List_Nil);
    var $author$project$PageLocation$boughtProductsUrl = A2($elm$url$Url$Builder$absolute, $author$project$PageLocation$boughtProductsPath, _List_Nil);
    var $author$project$PageLocation$commentedProductsUrl = A2($elm$url$Url$Builder$absolute, $author$project$PageLocation$commentedProductsPath, _List_Nil);
    var $author$project$PageLocation$exhibitionUrl = A2($elm$url$Url$Builder$absolute, $author$project$PageLocation$exhibitionPath, _List_Nil);
    var $author$project$PageLocation$historyUrl = A2($elm$url$Url$Builder$absolute, $author$project$PageLocation$historyPath, _List_Nil);
    var $author$project$PageLocation$homeUrl = A2($elm$url$Url$Builder$absolute, $author$project$PageLocation$homePath, _List_Nil);
    var $author$project$PageLocation$likedProductsUrl = A2($elm$url$Url$Builder$absolute, $author$project$PageLocation$likedProductsPath, _List_Nil);
    var $author$project$PageLocation$logInUrl = A2($elm$url$Url$Builder$absolute, $author$project$PageLocation$logInPath, _List_Nil);
    var $author$project$PageLocation$notificationUrl = A2($elm$url$Url$Builder$absolute, _List_fromArray([
        $author$project$PageLocation$notificationPath
    ]), _List_Nil);
    var $author$project$Data$Product$idToString = function(_v0) {
        var id = _v0.a;
        return id;
    };
    var $author$project$PageLocation$productUrl = function(productId) {
        return A2($elm$url$Url$Builder$absolute, _List_fromArray([
            'product',
            $author$project$Data$Product$idToString(productId)
        ]), _List_Nil);
    };
    var $author$project$Data$SearchCondition$getCategory = function(_v0) {
        var category = _v0.a.category;
        return category;
    };
    var $author$project$Data$SearchCondition$getQuery = function(_v0) {
        var query = _v0.a.query;
        return query;
    };
    var $author$project$Data$SearchCondition$getUniversitySelect = function(_v0) {
        var university = _v0.a.university;
        return university;
    };
    var $author$project$Data$Category$groupToIdString = function(group) {
        switch(group.$){
            case 'Furniture':
                return 'furniture';
            case 'Appliance':
                return 'appliance';
            case 'Fashion':
                return 'fashion';
            case 'Book':
                return 'book';
            case 'Vehicle':
                return 'vehicle';
            case 'Food':
                return 'food';
            default:
                return 'hobby';
        }
    };
    var $elm$url$Url$percentEncode = _Url_percentEncode;
    var $author$project$Data$University$schoolToIdString = function(school) {
        switch(school.$){
            case 'SHumcul':
                return 'humcul';
            case 'SSocint':
                return 'socint';
            case 'SHuman':
                return 'human';
            case 'SLife':
                return 'life';
            case 'SSse':
                return 'sse';
            case 'SInfo':
                return 'info';
            case 'SMed':
                return 'med';
            case 'SAandd':
                return 'aandd';
            default:
                return 'sport';
        }
    };
    var $author$project$Data$Category$toIdString = function(subCategory) {
        switch(subCategory.$){
            case 'FurnitureTable':
                return 'furnitureTable';
            case 'FurnitureChair':
                return 'furnitureChair';
            case 'FurnitureChest':
                return 'furnitureChest';
            case 'FurnitureBed':
                return 'furnitureBed';
            case 'FurnitureKitchen':
                return 'furnitureKitchen';
            case 'FurnitureCurtain':
                return 'furnitureCurtain';
            case 'FurnitureMat':
                return 'furnitureMat';
            case 'FurnitureOther':
                return 'furnitureOther';
            case 'ApplianceRefrigerator':
                return 'applianceRefrigerator';
            case 'ApplianceMicrowave':
                return 'applianceMicrowave';
            case 'ApplianceWashing':
                return 'applianceWashing';
            case 'ApplianceVacuum':
                return 'applianceVacuum';
            case 'ApplianceTemperature':
                return 'applianceTemperature';
            case 'ApplianceHumidity':
                return 'applianceHumidity';
            case 'ApplianceLight':
                return 'applianceLight';
            case 'ApplianceTv':
                return 'applianceTv';
            case 'ApplianceSpeaker':
                return 'applianceSpeaker';
            case 'ApplianceSmartphone':
                return 'applianceSmartphone';
            case 'AppliancePc':
                return 'appliancePc';
            case 'ApplianceCommunication':
                return 'applianceCommunication';
            case 'ApplianceOther':
                return 'applianceOther';
            case 'FashionMens':
                return 'fashionMens';
            case 'FashionLadies':
                return 'fashionLadies';
            case 'FashionOther':
                return 'fashionOther';
            case 'BookTextbook':
                return 'bookTextbook';
            case 'BookBook':
                return 'bookBook';
            case 'BookComic':
                return 'bookComic';
            case 'BookOther':
                return 'bookOther';
            case 'VehicleBicycle':
                return 'vehicleBicycle';
            case 'VehicleBike':
                return 'vehicleBike';
            case 'VehicleCar':
                return 'vehicleCar';
            case 'VehicleOther':
                return 'vehicleOther';
            case 'FoodFood':
                return 'foodFood';
            case 'FoodBeverage':
                return 'foodBeverage';
            case 'FoodOther':
                return 'foodOther';
            case 'HobbyDisc':
                return 'hobbyDisc';
            case 'HobbyInstrument':
                return 'hobbyInstrument';
            case 'HobbyCamera':
                return 'hobbyCamera';
            case 'HobbyGame':
                return 'hobbyGame';
            case 'HobbySport':
                return 'hobbySport';
            case 'HobbyArt':
                return 'hobbyArt';
            case 'HobbyAccessory':
                return 'hobbyAccessory';
            case 'HobbyDaily':
                return 'hobbyDaily';
            case 'HobbyHandmade':
                return 'hobbyHandmade';
            default:
                return 'hobbyOther';
        }
    };
    var $author$project$PageLocation$searchFragmentFromCondition = function(condition) {
        return '#' + A2($elm$core$String$join, '&', A2($elm$core$List$cons, 'query=' + $elm$url$Url$percentEncode($author$project$Data$SearchCondition$getQuery(condition)), _Utils_ap(function() {
            var _v0 = $author$project$Data$SearchCondition$getCategory(condition);
            switch(_v0.$){
                case 'CategoryNone':
                    return _List_Nil;
                case 'CategoryCategory':
                    var category = _v0.a;
                    return _List_fromArray([
                        'categoryType=category',
                        'category=' + $author$project$Data$Category$toIdString(category)
                    ]);
                default:
                    var group = _v0.a;
                    return _List_fromArray([
                        'categoryType=group',
                        'category=' + $author$project$Data$Category$groupToIdString(group)
                    ]);
            }
        }(), function() {
            var _v1 = $author$project$Data$SearchCondition$getUniversitySelect(condition);
            switch(_v1.$){
                case 'UniversityNone':
                    return _List_Nil;
                case 'UniversityDepartment':
                    var department = _v1.a;
                    return _List_fromArray([
                        'universityType=department',
                        'university=' + $author$project$Data$University$departmentToIdString(department)
                    ]);
                case 'UniversitySchool':
                    var school = _v1.a;
                    return _List_fromArray([
                        'universityType=school',
                        'university=' + $author$project$Data$University$schoolToIdString(school)
                    ]);
                default:
                    var graduate = _v1.a;
                    return _List_fromArray([
                        'universityType=graduate',
                        'university=' + $author$project$Data$University$graduateToIdString(graduate)
                    ]);
            }
        }())));
    };
    var $author$project$PageLocation$searchResultUrl = function(condition) {
        return A2($elm$url$Url$Builder$absolute, _Utils_ap($author$project$PageLocation$searchPath, _List_fromArray([
            $author$project$PageLocation$searchFragmentFromCondition(condition)
        ])), _List_Nil);
    };
    var $author$project$PageLocation$searchUrl = A2($elm$url$Url$Builder$absolute, $author$project$PageLocation$searchPath, _List_Nil);
    var $author$project$Data$User$idToString = function(_v0) {
        var id = _v0.a;
        return id;
    };
    var $author$project$PageLocation$soldProductsUrl = function(userId) {
        return A2($elm$url$Url$Builder$absolute, _List_fromArray([
            $author$project$PageLocation$soldProductsPath,
            $author$project$Data$User$idToString(userId)
        ]), _List_Nil);
    };
    var $author$project$Data$Trade$idToString = function(_v0) {
        var string = _v0.a;
        return string;
    };
    var $author$project$PageLocation$tradeUrl = function(id) {
        return A2($elm$url$Url$Builder$absolute, _List_fromArray([
            'trade',
            $author$project$Data$Trade$idToString(id)
        ]), _List_Nil);
    };
    var $author$project$PageLocation$tradedProductsUrl = A2($elm$url$Url$Builder$absolute, $author$project$PageLocation$tradedProductsPath, _List_Nil);
    var $author$project$PageLocation$tradingProductsUrl = A2($elm$url$Url$Builder$absolute, $author$project$PageLocation$tradingProductsPath, _List_Nil);
    var $author$project$PageLocation$userUrl = function(userId) {
        return A2($elm$url$Url$Builder$absolute, _List_fromArray([
            'user',
            $author$project$Data$User$idToString(userId)
        ]), _List_Nil);
    };
    var $author$project$PageLocation$initToUrlAsString = function(location) {
        switch(location.$){
            case 'InitHome':
                return $author$project$PageLocation$homeUrl;
            case 'InitLogIn':
                return $author$project$PageLocation$logInUrl;
            case 'InitLikedProducts':
                return $author$project$PageLocation$likedProductsUrl;
            case 'InitHistory':
                return $author$project$PageLocation$historyUrl;
            case 'InitSoldProducts':
                var id = location.a;
                return $author$project$PageLocation$soldProductsUrl(id);
            case 'InitBoughtProducts':
                return $author$project$PageLocation$boughtProductsUrl;
            case 'InitTradingProducts':
                return $author$project$PageLocation$tradingProductsUrl;
            case 'InitTradedProducts':
                return $author$project$PageLocation$tradedProductsUrl;
            case 'InitCommentedProducts':
                return $author$project$PageLocation$commentedProductsUrl;
            case 'InitExhibition':
                return $author$project$PageLocation$exhibitionUrl;
            case 'InitProduct':
                var id = location.a;
                return $author$project$PageLocation$productUrl(id);
            case 'InitTrade':
                var id = location.a;
                return $author$project$PageLocation$tradeUrl(id);
            case 'InitUser':
                var id = location.a;
                return $author$project$PageLocation$userUrl(id);
            case 'InitSearch':
                return $author$project$PageLocation$searchUrl;
            case 'InitSearchResult':
                var condition = location.a;
                return $author$project$PageLocation$searchResultUrl(condition);
            case 'InitNotification':
                return $author$project$PageLocation$notificationUrl;
            case 'InitAbout':
                return $author$project$PageLocation$aboutUrl;
            default:
                return $author$project$PageLocation$aboutPrivacyPolicyUrl;
        }
    };
    var $elm$time$Time$Posix = function(a) {
        return {
            $: 'Posix',
            a: a
        };
    };
    var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
    var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
    var $elm$core$Tuple$pair = F2(function(a, b) {
        return _Utils_Tuple2(a, b);
    });
    var $elm$browser$Browser$Navigation$replaceUrl = _Browser_replaceUrl;
    var $author$project$Main$saveAccessTokenToLocalStorage = _Platform_outgoingPort('saveAccessTokenToLocalStorage', $elm$json$Json$Encode$string);
    var $elm$json$Json$Encode$null = _Json_encodeNull;
    var $author$project$Main$startListenRecommendProducts = _Platform_outgoingPort('startListenRecommendProducts', function($) {
        return $elm$json$Json$Encode$null;
    });
    var $author$project$Main$AddLogMessage = function(a) {
        return {
            $: 'AddLogMessage',
            a: a
        };
    };
    var $author$project$Main$PageHome = function(a) {
        return {
            $: 'PageHome',
            a: a
        };
    };
    var $author$project$Main$LikeProductResponse = F2(function(a, b) {
        return {
            $: 'LikeProductResponse',
            a: a,
            b: b
        };
    });
    var $author$project$Main$UnlikeProductResponse = F2(function(a, b) {
        return {
            $: 'UnlikeProductResponse',
            a: a,
            b: b
        };
    });
    var $author$project$Main$elementScrollIntoView = _Platform_outgoingPort('elementScrollIntoView', $elm$json$Json$Encode$string);
    var $author$project$Api$Mutation = function(a) {
        return {
            $: 'Mutation',
            a: a
        };
    };
    var $author$project$Api$likeProduct = F2(function(productId, token) {
        return A2($author$project$Api$graphQlApiRequest, $author$project$Api$Mutation(_List_fromArray([
            $author$project$Api$Field({
                args: _List_fromArray([
                    _Utils_Tuple2('accessToken', $author$project$Api$GraphQLString($author$project$Api$tokenToString(token))),
                    _Utils_Tuple2('productId', $author$project$Api$GraphQLString($author$project$Data$Product$idToString(productId)))
                ]),
                name: 'likeProduct',
                _return: _List_Nil
            })
        ])), $elm$json$Json$Decode$succeed(_Utils_Tuple0));
    });
    var $author$project$Api$unlikeProduct = F2(function(productId, token) {
        return A2($author$project$Api$graphQlApiRequest, $author$project$Api$Mutation(_List_fromArray([
            $author$project$Api$Field({
                args: _List_fromArray([
                    _Utils_Tuple2('accessToken', $author$project$Api$GraphQLString($author$project$Api$tokenToString(token))),
                    _Utils_Tuple2('productId', $author$project$Api$GraphQLString($author$project$Data$Product$idToString(productId)))
                ]),
                name: 'unlikeProduct',
                _return: _List_Nil
            })
        ])), $elm$json$Json$Decode$succeed(_Utils_Tuple0));
    });
    var $author$project$Main$productListCmdToCmd = function(cmd) {
        switch(cmd.$){
            case 'CmdLike':
                var token = cmd.a;
                var id = cmd.b;
                return A3($author$project$Api$likeProduct, id, token, $author$project$Main$LikeProductResponse(id));
            case 'CmdUnlike':
                var token = cmd.a;
                var id = cmd.b;
                return A3($author$project$Api$unlikeProduct, id, token, $author$project$Main$UnlikeProductResponse(id));
            default:
                var idString = cmd.a;
                return $author$project$Main$elementScrollIntoView(idString);
        }
    };
    var $author$project$Main$homePageCmdToCmd = function(cmd) {
        if (cmd.$ === 'CmdProducts') {
            var e = cmd.a;
            return $author$project$Main$productListCmdToCmd(e);
        } else {
            var log = cmd.a;
            return A2($elm$core$Task$perform, $elm$core$Basics$always($author$project$Main$AddLogMessage(log)), $elm$core$Task$succeed(_Utils_Tuple0));
        }
    };
    var $author$project$Page$Home$CmdProducts = function(a) {
        return {
            $: 'CmdProducts',
            a: a
        };
    };
    var $author$project$Page$Home$Model = function(a) {
        return {
            $: 'Model',
            a: a
        };
    };
    var $author$project$Page$Home$TabRecommend = {
        $: 'TabRecommend'
    };
    var $author$project$Component$ProductList$CmdScrollIntoView = function(a) {
        return {
            $: 'CmdScrollIntoView',
            a: a
        };
    };
    var $author$project$Component$ProductList$Model = function(a) {
        return {
            $: 'Model',
            a: a
        };
    };
    var $elm$core$Set$Set_elm_builtin = function(a) {
        return {
            $: 'Set_elm_builtin',
            a: a
        };
    };
    var $elm$core$Set$empty = $elm$core$Set$Set_elm_builtin($elm$core$Dict$empty);
    var $author$project$Component$ProductList$productIdString = function(productId) {
        return 'product-' + $author$project$Data$Product$idToString(productId);
    };
    var $author$project$Component$ProductList$initModel = function(productIdMaybe) {
        return _Utils_Tuple2($author$project$Component$ProductList$Model({
            likeUpdating: $elm$core$Set$empty
        }), function() {
            if (productIdMaybe.$ === 'Just') {
                var id = productIdMaybe.a;
                return _List_fromArray([
                    $author$project$Component$ProductList$CmdScrollIntoView($author$project$Component$ProductList$productIdString(id))
                ]);
            } else return _List_Nil;
        }());
    };
    var $author$project$Page$Home$initModel = function(productIdMaybe) {
        var _v0 = $author$project$Component$ProductList$initModel(productIdMaybe);
        var productListModel = _v0.a;
        var cmdList = _v0.b;
        return _Utils_Tuple2($author$project$Page$Home$Model({
            productListModel: productListModel,
            tabSelect: $author$project$Page$Home$TabRecommend
        }), A2($elm$core$List$map, $author$project$Page$Home$CmdProducts, cmdList));
    };
    var $author$project$Main$mapPageModel = F3(function(modelFunc, cmdListFunc, _v0) {
        var eachPageMsg = _v0.a;
        var eachPageCmdList = _v0.b;
        return _Utils_Tuple2(modelFunc(eachPageMsg), $elm$core$Platform$Cmd$batch(A2($elm$core$List$map, cmdListFunc, eachPageCmdList)));
    });
    var $elm$core$Tuple$mapSecond = F2(function(func, _v0) {
        var x = _v0.a;
        var y = _v0.b;
        return _Utils_Tuple2(x, func(y));
    });
    var $author$project$Main$pageNotFound = A2($elm$core$Tuple$mapSecond, function(c) {
        return $elm$core$Platform$Cmd$batch(_List_fromArray([
            c,
            A2($elm$core$Task$perform, $elm$core$Basics$identity, $elm$core$Task$succeed($author$project$Main$AddLogMessage('指定したページが見つからないのでホームに移動しました')))
        ]));
    }, A3($author$project$Main$mapPageModel, $author$project$Main$PageHome, $author$project$Main$homePageCmdToCmd, $author$project$Page$Home$initModel($elm$core$Maybe$Nothing)));
    var $author$project$Main$PageAbout = function(a) {
        return {
            $: 'PageAbout',
            a: a
        };
    };
    var $author$project$Main$PageBoughtProducts = function(a) {
        return {
            $: 'PageBoughtProducts',
            a: a
        };
    };
    var $author$project$Main$PageCommentedProducts = function(a) {
        return {
            $: 'PageCommentedProducts',
            a: a
        };
    };
    var $author$project$Main$PageExhibition = function(a) {
        return {
            $: 'PageExhibition',
            a: a
        };
    };
    var $author$project$Main$PageHistory = function(a) {
        return {
            $: 'PageHistory',
            a: a
        };
    };
    var $author$project$Main$PageLikedProducts = function(a) {
        return {
            $: 'PageLikedProducts',
            a: a
        };
    };
    var $author$project$Main$PageLogIn = function(a) {
        return {
            $: 'PageLogIn',
            a: a
        };
    };
    var $author$project$Main$PageNotification = function(a) {
        return {
            $: 'PageNotification',
            a: a
        };
    };
    var $author$project$Main$PageProduct = function(a) {
        return {
            $: 'PageProduct',
            a: a
        };
    };
    var $author$project$Main$PageSearch = function(a) {
        return {
            $: 'PageSearch',
            a: a
        };
    };
    var $author$project$Main$PageSearchResult = function(a) {
        return {
            $: 'PageSearchResult',
            a: a
        };
    };
    var $author$project$Main$PageSoldProducts = function(a) {
        return {
            $: 'PageSoldProducts',
            a: a
        };
    };
    var $author$project$Main$PageTrade = function(a) {
        return {
            $: 'PageTrade',
            a: a
        };
    };
    var $author$project$Main$PageTradesInPast = function(a) {
        return {
            $: 'PageTradesInPast',
            a: a
        };
    };
    var $author$project$Main$PageTradesInProgress = function(a) {
        return {
            $: 'PageTradesInProgress',
            a: a
        };
    };
    var $author$project$Main$PageUser = function(a) {
        return {
            $: 'PageUser',
            a: a
        };
    };
    var $author$project$Page$About$About = {
        $: 'About'
    };
    var $author$project$Page$About$aboutModel = $author$project$Page$About$About;
    var $author$project$Page$BoughtProducts$GetResponse = function(a) {
        return {
            $: 'GetResponse',
            a: a
        };
    };
    var $author$project$Main$PageMsg = function(a) {
        return {
            $: 'PageMsg',
            a: a
        };
    };
    var $author$project$Main$PageMsgBoughtProducts = function(a) {
        return {
            $: 'PageMsgBoughtProducts',
            a: a
        };
    };
    var $author$project$Api$getBoughtProductIds = function(token) {
        return A2($author$project$Api$graphQlApiRequest, $author$project$Api$Query(_List_fromArray([
            $author$project$Api$Field({
                args: _List_fromArray([
                    _Utils_Tuple2('accessToken', $author$project$Api$GraphQLString($author$project$Api$tokenToString(token)))
                ]),
                name: 'userPrivate',
                _return: _List_fromArray([
                    $author$project$Api$Field({
                        args: _List_Nil,
                        name: 'boughtProductAll',
                        _return: _List_fromArray([
                            $author$project$Api$Field({
                                args: _List_Nil,
                                name: 'id',
                                _return: _List_Nil
                            })
                        ])
                    })
                ])
            })
        ])), A2($elm$json$Json$Decode$field, 'userPrivate', A2($elm$json$Json$Decode$field, 'boughtProductAll', $elm$json$Json$Decode$list(A2($elm$json$Json$Decode$field, 'id', A2($elm$json$Json$Decode$map, $author$project$Data$Product$idFromString, $elm$json$Json$Decode$string))))));
    };
    var $author$project$Main$Jump = function(a) {
        return {
            $: 'Jump',
            a: a
        };
    };
    var $author$project$Api$GraphQLEnum = function(a) {
        return {
            $: 'GraphQLEnum',
            a: a
        };
    };
    var $elm$json$Json$Decode$fail = _Json_fail;
    var $author$project$Api$logInUrlResponseToResult = A2($elm$json$Json$Decode$andThen, function(urlString) {
        var _v0 = $elm$url$Url$fromString(urlString);
        if (_v0.$ === 'Just') {
            var url = _v0.a;
            return $elm$json$Json$Decode$succeed(url);
        } else return $elm$json$Json$Decode$fail('url format error');
    }, A2($elm$json$Json$Decode$field, 'getLogInUrl', $elm$json$Json$Decode$string));
    var $author$project$Api$getLogInUrl = function(service) {
        return A2($author$project$Api$graphQlApiRequest, $author$project$Api$Mutation(_List_fromArray([
            $author$project$Api$Field({
                args: _List_fromArray([
                    _Utils_Tuple2('service', $author$project$Api$GraphQLEnum('line'))
                ]),
                name: 'getLogInUrl',
                _return: _List_Nil
            })
        ])), $author$project$Api$logInUrlResponseToResult);
    };
    var $author$project$Main$logInCmdToCmd = function(cmd) {
        var service = cmd.a;
        return A2($author$project$Api$getLogInUrl, service, $author$project$Main$Jump);
    };
    var $author$project$Main$boughtProductsPageCmdToCmd = function(cmd) {
        switch(cmd.$){
            case 'CmdRequestPurchaseProductIds':
                var token = cmd.a;
                return A2($author$project$Api$getBoughtProductIds, token, A2($elm$core$Basics$composeR, $author$project$Page$BoughtProducts$GetResponse, A2($elm$core$Basics$composeR, $author$project$Main$PageMsgBoughtProducts, $author$project$Main$PageMsg)));
            case 'CmdByLogIn':
                var e = cmd.a;
                return $author$project$Main$logInCmdToCmd(e);
            case 'CmdByProductList':
                var e = cmd.a;
                return $author$project$Main$productListCmdToCmd(e);
            default:
                var log = cmd.a;
                return A2($elm$core$Task$perform, $elm$core$Basics$always($author$project$Main$AddLogMessage(log)), $elm$core$Task$succeed(_Utils_Tuple0));
        }
    };
    var $author$project$Page$CommentedProducts$GetProductsResponse = function(a) {
        return {
            $: 'GetProductsResponse',
            a: a
        };
    };
    var $author$project$Main$PageMsgCommentedProducts = function(a) {
        return {
            $: 'PageMsgCommentedProducts',
            a: a
        };
    };
    var $author$project$Api$getCommentedProductIds = function(token) {
        return A2($author$project$Api$graphQlApiRequest, $author$project$Api$Query(_List_fromArray([
            $author$project$Api$Field({
                args: _List_fromArray([
                    _Utils_Tuple2('accessToken', $author$project$Api$GraphQLString($author$project$Api$tokenToString(token)))
                ]),
                name: 'userPrivate',
                _return: _List_fromArray([
                    $author$project$Api$Field({
                        args: _List_Nil,
                        name: 'commentedProductAll',
                        _return: _List_fromArray([
                            $author$project$Api$Field({
                                args: _List_Nil,
                                name: 'id',
                                _return: _List_Nil
                            })
                        ])
                    })
                ])
            })
        ])), A2($elm$json$Json$Decode$field, 'userPrivate', A2($elm$json$Json$Decode$field, 'commentedProductAll', $elm$json$Json$Decode$list(A2($elm$json$Json$Decode$field, 'id', A2($elm$json$Json$Decode$map, $author$project$Data$Product$idFromString, $elm$json$Json$Decode$string))))));
    };
    var $author$project$Main$commentedProductsCmdToCmd = function(cmd) {
        switch(cmd.$){
            case 'CmdGetCommentedProducts':
                var token = cmd.a;
                return A2($author$project$Api$getCommentedProductIds, token, A2($elm$core$Basics$composeR, $author$project$Page$CommentedProducts$GetProductsResponse, A2($elm$core$Basics$composeR, $author$project$Main$PageMsgCommentedProducts, $author$project$Main$PageMsg)));
            case 'CmdByLogIn':
                var e = cmd.a;
                return $author$project$Main$logInCmdToCmd(e);
            case 'CmdByProductList':
                var e = cmd.a;
                return $author$project$Main$productListCmdToCmd(e);
            default:
                var log = cmd.a;
                return A2($elm$core$Task$perform, $elm$core$Basics$always($author$project$Main$AddLogMessage(log)), $elm$core$Task$succeed(_Utils_Tuple0));
        }
    };
    var $author$project$PageLocation$Home = {
        $: 'Home'
    };
    var $author$project$Main$PageMsgExhibition = function(a) {
        return {
            $: 'PageMsgExhibition',
            a: a
        };
    };
    var $author$project$Page$Exhibition$SellProductResponse = function(a) {
        return {
            $: 'SellProductResponse',
            a: a
        };
    };
    var $author$project$Main$addEventListenerForProductImages = _Platform_outgoingPort('addEventListenerForProductImages', function($) {
        return $elm$json$Json$Encode$object(_List_fromArray([
            _Utils_Tuple2('inputId', $elm$json$Json$Encode$string($.inputId)),
            _Utils_Tuple2('labelId', $elm$json$Json$Encode$string($.labelId))
        ]));
    });
    var $elm$json$Json$Encode$int = _Json_wrap;
    var $author$project$Main$changeSelectedIndex = _Platform_outgoingPort('changeSelectedIndex', function($) {
        return $elm$json$Json$Encode$object(_List_fromArray([
            _Utils_Tuple2('id', $elm$json$Json$Encode$string($.id)),
            _Utils_Tuple2('index', $elm$json$Json$Encode$int($.index))
        ]));
    });
    var $author$project$Main$categoryCmdToCmd = function(cmd) {
        var id = cmd.a.id;
        var index = cmd.a.index;
        return $author$project$Main$changeSelectedIndex({
            id: id,
            index: index
        });
    };
    var $author$project$Main$replaceText = _Platform_outgoingPort('replaceText', function($) {
        return $elm$json$Json$Encode$object(_List_fromArray([
            _Utils_Tuple2('id', $elm$json$Json$Encode$string($.id)),
            _Utils_Tuple2('text', $elm$json$Json$Encode$string($.text))
        ]));
    });
    var $author$project$Main$productEditorCmdToCmd = function(cmd) {
        switch(cmd.$){
            case 'CmdAddEventListenerForProductImages':
                var record = cmd.a;
                return $author$project$Main$addEventListenerForProductImages(record);
            case 'CmdReplaceText':
                var id = cmd.a.id;
                var text = cmd.a.text;
                return $author$project$Main$replaceText({
                    id: id,
                    text: text
                });
            case 'CmdChangeSelectedIndex':
                var id = cmd.a.id;
                var index = cmd.a.index;
                return $author$project$Main$changeSelectedIndex({
                    id: id,
                    index: index
                });
            default:
                var e = cmd.a;
                return $author$project$Main$categoryCmdToCmd(e);
        }
    };
    var $elm$browser$Browser$Navigation$pushUrl = _Browser_pushUrl;
    var $author$project$Api$GraphQLInt = function(a) {
        return {
            $: 'GraphQLInt',
            a: a
        };
    };
    var $author$project$Api$GraphQLList = function(a) {
        return {
            $: 'GraphQLList',
            a: a
        };
    };
    var $author$project$Data$Product$conditionToIdString = function(condition) {
        switch(condition.$){
            case 'ConditionNew':
                return 'new';
            case 'ConditionLikeNew':
                return 'likeNew';
            case 'ConditionVeryGood':
                return 'veryGood';
            case 'ConditionGood':
                return 'good';
            case 'ConditionAcceptable':
                return 'acceptable';
            default:
                return 'junk';
        }
    };
    var $author$project$Data$Category$all = _List_fromArray([
        $author$project$Data$Category$FurnitureTable,
        $author$project$Data$Category$FurnitureChair,
        $author$project$Data$Category$FurnitureChest,
        $author$project$Data$Category$FurnitureBed,
        $author$project$Data$Category$FurnitureKitchen,
        $author$project$Data$Category$FurnitureCurtain,
        $author$project$Data$Category$FurnitureMat,
        $author$project$Data$Category$FurnitureOther,
        $author$project$Data$Category$ApplianceRefrigerator,
        $author$project$Data$Category$ApplianceMicrowave,
        $author$project$Data$Category$ApplianceWashing,
        $author$project$Data$Category$ApplianceVacuum,
        $author$project$Data$Category$ApplianceTemperature,
        $author$project$Data$Category$ApplianceHumidity,
        $author$project$Data$Category$ApplianceLight,
        $author$project$Data$Category$ApplianceTv,
        $author$project$Data$Category$ApplianceSpeaker,
        $author$project$Data$Category$ApplianceSmartphone,
        $author$project$Data$Category$AppliancePc,
        $author$project$Data$Category$ApplianceCommunication,
        $author$project$Data$Category$ApplianceOther,
        $author$project$Data$Category$FashionMens,
        $author$project$Data$Category$FashionLadies,
        $author$project$Data$Category$FashionOther,
        $author$project$Data$Category$BookTextbook,
        $author$project$Data$Category$BookBook,
        $author$project$Data$Category$BookComic,
        $author$project$Data$Category$BookOther,
        $author$project$Data$Category$VehicleBicycle,
        $author$project$Data$Category$VehicleBike,
        $author$project$Data$Category$VehicleCar,
        $author$project$Data$Category$VehicleOther,
        $author$project$Data$Category$FoodFood,
        $author$project$Data$Category$FoodBeverage,
        $author$project$Data$Category$FoodOther,
        $author$project$Data$Category$HobbyDisc,
        $author$project$Data$Category$HobbyInstrument,
        $author$project$Data$Category$HobbyCamera,
        $author$project$Data$Category$HobbyGame,
        $author$project$Data$Category$HobbySport,
        $author$project$Data$Category$HobbyArt,
        $author$project$Data$Category$HobbyAccessory,
        $author$project$Data$Category$HobbyDaily,
        $author$project$Data$Category$HobbyHandmade,
        $author$project$Data$Category$HobbyOther
    ]);
    var $author$project$Api$enumErrorMsg = F4(function(idString, idName, all, toString) {
        return 'I can\'t understand \"' + (idString + ('\" in ' + (idName + ('.' + ('expect \"' + (A2($elm$core$String$join, '\" or \"', A2($elm$core$List$map, toString, all)) + '\".'))))));
    });
    var $author$project$Api$categoryDecoder = A2($elm$json$Json$Decode$andThen, function(idString) {
        var _v0 = $author$project$Data$Category$fromIdString(idString);
        if (_v0.$ === 'Just') {
            var category = _v0.a;
            return $elm$json$Json$Decode$succeed(category);
        } else return $elm$json$Json$Decode$fail(A4($author$project$Api$enumErrorMsg, idString, 'category', $author$project$Data$Category$all, $author$project$Data$Category$toIdString));
    }, $elm$json$Json$Decode$string);
    var $author$project$Data$Product$ConditionAcceptable = {
        $: 'ConditionAcceptable'
    };
    var $author$project$Data$Product$ConditionGood = {
        $: 'ConditionGood'
    };
    var $author$project$Data$Product$ConditionJunk = {
        $: 'ConditionJunk'
    };
    var $author$project$Data$Product$ConditionLikeNew = {
        $: 'ConditionLikeNew'
    };
    var $author$project$Data$Product$ConditionNew = {
        $: 'ConditionNew'
    };
    var $author$project$Data$Product$ConditionVeryGood = {
        $: 'ConditionVeryGood'
    };
    var $author$project$Data$Product$conditionAll = _List_fromArray([
        $author$project$Data$Product$ConditionNew,
        $author$project$Data$Product$ConditionLikeNew,
        $author$project$Data$Product$ConditionVeryGood,
        $author$project$Data$Product$ConditionGood,
        $author$project$Data$Product$ConditionAcceptable,
        $author$project$Data$Product$ConditionJunk
    ]);
    var $author$project$Data$Product$conditionFromStringLoop = F2(function(idString, conditionList) {
        conditionFromStringLoop: while(true){
            if (conditionList.b) {
                var x = conditionList.a;
                var xs = conditionList.b;
                if (_Utils_eq($author$project$Data$Product$conditionToIdString(x), idString)) return $elm$core$Maybe$Just(x);
                else {
                    var $temp$idString = idString, $temp$conditionList = xs;
                    idString = $temp$idString;
                    conditionList = $temp$conditionList;
                    continue conditionFromStringLoop;
                }
            } else return $elm$core$Maybe$Nothing;
        }
    });
    var $author$project$Data$Product$conditionFromIdString = function(idString) {
        return A2($author$project$Data$Product$conditionFromStringLoop, idString, $author$project$Data$Product$conditionAll);
    };
    var $author$project$Api$conditionDecoder = A2($elm$json$Json$Decode$andThen, function(idString) {
        var _v0 = $author$project$Data$Product$conditionFromIdString(idString);
        if (_v0.$ === 'Just') {
            var condition = _v0.a;
            return $elm$json$Json$Decode$succeed(condition);
        } else return $elm$json$Json$Decode$fail(A4($author$project$Api$enumErrorMsg, idString, 'condition', $author$project$Data$Product$conditionAll, $author$project$Data$Product$conditionToIdString));
    }, $elm$json$Json$Decode$string);
    var $elm$json$Json$Decode$float = _Json_decodeFloat;
    var $author$project$Api$dateTimeDecoder = A2($elm$json$Json$Decode$map, A2($elm$core$Basics$composeR, $elm$core$Basics$floor, $elm$time$Time$millisToPosix), $elm$json$Json$Decode$float);
    var $author$project$Data$Product$Product = function(a) {
        return {
            $: 'Product',
            a: a
        };
    };
    var $author$project$Data$Product$fromApi = function(rec) {
        return $author$project$Data$Product$Product({
            category: rec.category,
            condition: rec.condition,
            createdAt: rec.createdAt,
            description: rec.description,
            id: $author$project$Data$Product$Id(rec.id),
            imageIds: rec.imageIds,
            likedCount: rec.likedCount,
            name: rec.name,
            price: rec.price,
            seller: rec.seller,
            status: rec.status,
            thumbnailImageId: rec.thumbnailImageId,
            updateAt: rec.updateAt
        });
    };
    var $author$project$Api$imageIdsDecoder = A2($elm$json$Json$Decode$andThen, function(list) {
        if (!list.b) return $elm$json$Json$Decode$fail('imageIds length is 0');
        else {
            var x = list.a;
            var xs = list.b;
            return $elm$json$Json$Decode$succeed(_Utils_Tuple2($author$project$Data$ImageId$fromString(x), A2($elm$core$List$map, $author$project$Data$ImageId$fromString, xs)));
        }
    }, $elm$json$Json$Decode$list($elm$json$Json$Decode$string));
    var $elm$json$Json$Decode$int = _Json_decodeInt;
    var $author$project$Data$Product$Selling = {
        $: 'Selling'
    };
    var $author$project$Data$Product$SoldOut = {
        $: 'SoldOut'
    };
    var $author$project$Data$Product$Trading = {
        $: 'Trading'
    };
    var $author$project$Data$Product$statusAll = _List_fromArray([
        $author$project$Data$Product$Selling,
        $author$project$Data$Product$Trading,
        $author$project$Data$Product$SoldOut
    ]);
    var $author$project$Data$Product$statusToIdString = function(status) {
        switch(status.$){
            case 'Selling':
                return 'selling';
            case 'Trading':
                return 'trading';
            default:
                return 'soldOut';
        }
    };
    var $author$project$Data$Product$statusFromIdStringLoop = F2(function(idString, statusList) {
        statusFromIdStringLoop: while(true){
            if (statusList.b) {
                var x = statusList.a;
                var xs = statusList.b;
                if (_Utils_eq($author$project$Data$Product$statusToIdString(x), idString)) return $elm$core$Maybe$Just(x);
                else {
                    var $temp$idString = idString, $temp$statusList = xs;
                    idString = $temp$idString;
                    statusList = $temp$statusList;
                    continue statusFromIdStringLoop;
                }
            } else return $elm$core$Maybe$Nothing;
        }
    });
    var $author$project$Data$Product$statusFromIdString = function(idString) {
        return A2($author$project$Data$Product$statusFromIdStringLoop, idString, $author$project$Data$Product$statusAll);
    };
    var $author$project$Api$productStatusDecoder = A2($elm$json$Json$Decode$andThen, function(idString) {
        var _v0 = $author$project$Data$Product$statusFromIdString(idString);
        if (_v0.$ === 'Just') {
            var status = _v0.a;
            return $elm$json$Json$Decode$succeed(status);
        } else return $elm$json$Json$Decode$fail(A4($author$project$Api$enumErrorMsg, idString, 'status', $author$project$Data$Product$statusAll, $author$project$Data$Product$statusToIdString));
    }, $elm$json$Json$Decode$string);
    var $author$project$Api$userWithNameDecoder = A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'imageId', $author$project$Api$imageIdDecoder, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'displayName', $elm$json$Json$Decode$string, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'id', $elm$json$Json$Decode$string, $elm$json$Json$Decode$succeed(F3(function(id, displayName, imageId) {
        return $author$project$Data$User$withNameFromApi({
            displayName: displayName,
            id: id,
            imageId: imageId
        });
    })))));
    var $author$project$Api$productDecoder = A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'updateAt', $author$project$Api$dateTimeDecoder, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'thumbnailImageId', $author$project$Api$imageIdDecoder, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'createdAt', $author$project$Api$dateTimeDecoder, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'seller', $author$project$Api$userWithNameDecoder, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'likedCount', $elm$json$Json$Decode$int, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'imageIds', $author$project$Api$imageIdsDecoder, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'status', $author$project$Api$productStatusDecoder, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'category', $author$project$Api$categoryDecoder, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'condition', $author$project$Api$conditionDecoder, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'price', $elm$json$Json$Decode$int, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'description', $elm$json$Json$Decode$string, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'name', $elm$json$Json$Decode$string, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'id', $elm$json$Json$Decode$string, $elm$json$Json$Decode$succeed(function(id) {
        return function(name) {
            return function(description) {
                return function(price) {
                    return function(condition) {
                        return function(category) {
                            return function(status) {
                                return function(imageIds) {
                                    return function(likedCount) {
                                        return function(seller) {
                                            return function(createdAt) {
                                                return function(thumbnailImageId) {
                                                    return function(updateAt) {
                                                        return $author$project$Data$Product$fromApi({
                                                            category: category,
                                                            condition: condition,
                                                            createdAt: createdAt,
                                                            description: description,
                                                            id: id,
                                                            imageIds: imageIds,
                                                            likedCount: likedCount,
                                                            name: name,
                                                            price: price,
                                                            seller: seller,
                                                            status: status,
                                                            thumbnailImageId: thumbnailImageId,
                                                            updateAt: updateAt
                                                        });
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
            };
        };
    }))))))))))))));
    var $author$project$Api$userWithNameReturn = _List_fromArray([
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'id',
            _return: _List_Nil
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'displayName',
            _return: _List_Nil
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'imageId',
            _return: _List_Nil
        })
    ]);
    var $author$project$Api$productReturn = _List_fromArray([
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'id',
            _return: _List_Nil
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'name',
            _return: _List_Nil
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'description',
            _return: _List_Nil
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'price',
            _return: _List_Nil
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'condition',
            _return: _List_Nil
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'category',
            _return: _List_Nil
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'status',
            _return: _List_Nil
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'imageIds',
            _return: _List_Nil
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'likedCount',
            _return: _List_Nil
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'seller',
            _return: $author$project$Api$userWithNameReturn
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'createdAt',
            _return: _List_Nil
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'thumbnailImageId',
            _return: _List_Nil
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'updateAt',
            _return: _List_Nil
        })
    ]);
    var $author$project$Api$sellProduct = F2(function(_v0, token) {
        var request = _v0.a;
        return A2($author$project$Api$graphQlApiRequest, $author$project$Api$Mutation(_List_fromArray([
            $author$project$Api$Field({
                args: _List_fromArray([
                    _Utils_Tuple2('accessToken', $author$project$Api$GraphQLString($author$project$Api$tokenToString(token))),
                    _Utils_Tuple2('name', $author$project$Api$GraphQLString(request.name)),
                    _Utils_Tuple2('price', $author$project$Api$GraphQLInt(request.price)),
                    _Utils_Tuple2('description', $author$project$Api$GraphQLString(request.description)),
                    _Utils_Tuple2('images', $author$project$Api$GraphQLList(A2($elm$core$List$map, $author$project$Api$GraphQLString, request.images))),
                    _Utils_Tuple2('condition', $author$project$Api$GraphQLEnum($author$project$Data$Product$conditionToIdString(request.condition))),
                    _Utils_Tuple2('category', $author$project$Api$GraphQLEnum($author$project$Data$Category$toIdString(request.category)))
                ]),
                name: 'sellProduct',
                _return: $author$project$Api$productReturn
            })
        ])), A2($elm$json$Json$Decode$field, 'sellProduct', $author$project$Api$productDecoder));
    });
    var $author$project$PageLocation$exhibitionConfirmPath = _Utils_ap($author$project$PageLocation$exhibitionPath, _List_fromArray([
        'confirm'
    ]));
    var $author$project$PageLocation$exhibitionConfirmUrl = A2($elm$url$Url$Builder$absolute, $author$project$PageLocation$exhibitionConfirmPath, _List_Nil);
    var $author$project$PageLocation$toUrlAsString = function(location) {
        switch(location.$){
            case 'Home':
                return $author$project$PageLocation$homeUrl;
            case 'LogIn':
                return $author$project$PageLocation$logInUrl;
            case 'LikedProducts':
                return $author$project$PageLocation$likedProductsUrl;
            case 'History':
                return $author$project$PageLocation$historyUrl;
            case 'SoldProducts':
                var id = location.a;
                return $author$project$PageLocation$soldProductsUrl(id);
            case 'BoughtProducts':
                return $author$project$PageLocation$boughtProductsUrl;
            case 'TradingProducts':
                return $author$project$PageLocation$tradingProductsUrl;
            case 'TradedProducts':
                return $author$project$PageLocation$tradedProductsUrl;
            case 'CommentedProducts':
                return $author$project$PageLocation$commentedProductsUrl;
            case 'Exhibition':
                return $author$project$PageLocation$exhibitionUrl;
            case 'ExhibitionConfirm':
                return $author$project$PageLocation$exhibitionConfirmUrl;
            case 'Product':
                var id = location.a;
                return $author$project$PageLocation$productUrl(id);
            case 'Trade':
                var id = location.a;
                return $author$project$PageLocation$tradeUrl(id);
            case 'User':
                var id = location.a;
                return $author$project$PageLocation$userUrl(id);
            case 'Search':
                return $author$project$PageLocation$searchUrl;
            case 'SearchResult':
                var condition = location.a;
                return $author$project$PageLocation$searchResultUrl(condition);
            case 'Notification':
                return $author$project$PageLocation$notificationUrl;
            case 'About':
                return $author$project$PageLocation$aboutUrl;
            default:
                return $author$project$PageLocation$aboutPrivacyPolicyUrl;
        }
    };
    var $author$project$Main$exhibitionPageCmdToCmd = F2(function(key, cmd) {
        switch(cmd.$){
            case 'CmdLogInOrSignUp':
                var e = cmd.a;
                return $author$project$Main$logInCmdToCmd(e);
            case 'CmdSellProducts':
                var _v1 = cmd.a;
                var token = _v1.a;
                var request = _v1.b;
                return A3($author$project$Api$sellProduct, request, token, A2($elm$core$Basics$composeR, $author$project$Page$Exhibition$SellProductResponse, A2($elm$core$Basics$composeR, $author$project$Main$PageMsgExhibition, $author$project$Main$PageMsg)));
            case 'CmdByProductEditor':
                var e = cmd.a;
                return $author$project$Main$productEditorCmdToCmd(e);
            case 'CmdAddLogMessage':
                var log = cmd.a;
                return A2($elm$core$Task$perform, $elm$core$Basics$always($author$project$Main$AddLogMessage(log)), $elm$core$Task$succeed(_Utils_Tuple0));
            default:
                return A2($elm$browser$Browser$Navigation$pushUrl, key, $author$project$PageLocation$toUrlAsString($author$project$PageLocation$Home));
        }
    });
    var $author$project$Page$History$GetProductsResponse = function(a) {
        return {
            $: 'GetProductsResponse',
            a: a
        };
    };
    var $author$project$Main$PageMsgHistory = function(a) {
        return {
            $: 'PageMsgHistory',
            a: a
        };
    };
    var $author$project$Api$getHistoryViewProducts = function(token) {
        return A2($author$project$Api$graphQlApiRequest, $author$project$Api$Query(_List_fromArray([
            $author$project$Api$Field({
                args: _List_fromArray([
                    _Utils_Tuple2('accessToken', $author$project$Api$GraphQLString($author$project$Api$tokenToString(token)))
                ]),
                name: 'userPrivate',
                _return: _List_fromArray([
                    $author$project$Api$Field({
                        args: _List_Nil,
                        name: 'historyViewProductAll',
                        _return: $author$project$Api$productReturn
                    })
                ])
            })
        ])), A2($elm$json$Json$Decode$field, 'userPrivate', A2($elm$json$Json$Decode$field, 'historyViewProductAll', $elm$json$Json$Decode$list($author$project$Api$productDecoder))));
    };
    var $author$project$Main$historyCmdToCmd = function(cmd) {
        switch(cmd.$){
            case 'CmdGetHistoryProducts':
                var token = cmd.a;
                return A2($author$project$Api$getHistoryViewProducts, token, A2($elm$core$Basics$composeR, $author$project$Page$History$GetProductsResponse, A2($elm$core$Basics$composeR, $author$project$Main$PageMsgHistory, $author$project$Main$PageMsg)));
            case 'CmdByLogIn':
                var e = cmd.a;
                return $author$project$Main$logInCmdToCmd(e);
            case 'CmdByProductList':
                var e = cmd.a;
                return $author$project$Main$productListCmdToCmd(e);
            default:
                var log = cmd.a;
                return A2($elm$core$Task$perform, $elm$core$Basics$always($author$project$Main$AddLogMessage(log)), $elm$core$Task$succeed(_Utils_Tuple0));
        }
    };
    var $author$project$Page$BoughtProducts$CmdByProductList = function(a) {
        return {
            $: 'CmdByProductList',
            a: a
        };
    };
    var $author$project$Page$BoughtProducts$CmdRequestPurchaseProductIds = function(a) {
        return {
            $: 'CmdRequestPurchaseProductIds',
            a: a
        };
    };
    var $author$project$Page$BoughtProducts$Loading = {
        $: 'Loading'
    };
    var $author$project$Page$BoughtProducts$Model = function(a) {
        return {
            $: 'Model',
            a: a
        };
    };
    var $author$project$Data$LogInState$getToken = function(logInState) {
        switch(logInState.$){
            case 'None':
                return $elm$core$Maybe$Nothing;
            case 'LoadingProfile':
                var token = logInState.a;
                return $elm$core$Maybe$Just(token);
            default:
                var token = logInState.a.token;
                return $elm$core$Maybe$Just(token);
        }
    };
    var $author$project$Component$LogIn$Model = function(a) {
        return {
            $: 'Model',
            a: a
        };
    };
    var $author$project$Component$LogIn$initModel = $author$project$Component$LogIn$Model($elm$core$Maybe$Nothing);
    var $author$project$Page$BoughtProducts$initModel = F2(function(productIdMaybe, logInState) {
        var _v0 = $author$project$Component$ProductList$initModel(productIdMaybe);
        var productListModel = _v0.a;
        var productListCmds = _v0.b;
        return _Utils_Tuple2($author$project$Page$BoughtProducts$Model({
            logIn: $author$project$Component$LogIn$initModel,
            normal: $author$project$Page$BoughtProducts$Loading,
            productList: productListModel
        }), _Utils_ap(function() {
            var _v1 = $author$project$Data$LogInState$getToken(logInState);
            if (_v1.$ === 'Just') {
                var accessToken = _v1.a;
                return _List_fromArray([
                    $author$project$Page$BoughtProducts$CmdRequestPurchaseProductIds(accessToken)
                ]);
            } else return _List_Nil;
        }(), A2($elm$core$List$map, $author$project$Page$BoughtProducts$CmdByProductList, productListCmds)));
    });
    var $author$project$Page$CommentedProducts$CmdByProductList = function(a) {
        return {
            $: 'CmdByProductList',
            a: a
        };
    };
    var $author$project$Page$CommentedProducts$CmdGetCommentedProducts = function(a) {
        return {
            $: 'CmdGetCommentedProducts',
            a: a
        };
    };
    var $author$project$Page$CommentedProducts$Loading = {
        $: 'Loading'
    };
    var $author$project$Page$CommentedProducts$Model = function(a) {
        return {
            $: 'Model',
            a: a
        };
    };
    var $author$project$Page$CommentedProducts$initModel = F2(function(productIdMaybe, logInState) {
        var _v0 = $author$project$Component$ProductList$initModel(productIdMaybe);
        var productListModel = _v0.a;
        var cmdList = _v0.b;
        return _Utils_Tuple2($author$project$Page$CommentedProducts$Model({
            logIn: $author$project$Component$LogIn$initModel,
            normal: $author$project$Page$CommentedProducts$Loading,
            productList: productListModel
        }), _Utils_ap(function() {
            var _v1 = $author$project$Data$LogInState$getToken(logInState);
            if (_v1.$ === 'Just') {
                var accessToken = _v1.a;
                return _List_fromArray([
                    $author$project$Page$CommentedProducts$CmdGetCommentedProducts(accessToken)
                ]);
            } else return _List_Nil;
        }(), A2($elm$core$List$map, $author$project$Page$CommentedProducts$CmdByProductList, cmdList)));
    });
    var $author$project$Page$Exhibition$CmdByProductEditor = function(a) {
        return {
            $: 'CmdByProductEditor',
            a: a
        };
    };
    var $author$project$Page$Exhibition$EditPage = function(a) {
        return {
            $: 'EditPage',
            a: a
        };
    };
    var $author$project$Page$Exhibition$Model = function(a) {
        return {
            $: 'Model',
            a: a
        };
    };
    var $author$project$Component$ProductEditor$CmdAddEventListenerForProductImages = function(a) {
        return {
            $: 'CmdAddEventListenerForProductImages',
            a: a
        };
    };
    var $author$project$Component$ProductEditor$CmdByCategory = function(a) {
        return {
            $: 'CmdByCategory',
            a: a
        };
    };
    var $author$project$Component$ProductEditor$Model = function(a) {
        return {
            $: 'Model',
            a: a
        };
    };
    var $author$project$Component$Category$CmdChangeSelectedIndex = function(a) {
        return {
            $: 'CmdChangeSelectedIndex',
            a: a
        };
    };
    var $author$project$Component$Category$Model = function(a) {
        return {
            $: 'Model',
            a: a
        };
    };
    var $author$project$Component$Category$None = {
        $: 'None'
    };
    var $author$project$Component$Category$groupSelectId = 'select-category-group';
    var $author$project$Component$Category$initModel = _Utils_Tuple2($author$project$Component$Category$Model($author$project$Component$Category$None), _List_fromArray([
        $author$project$Component$Category$CmdChangeSelectedIndex({
            id: $author$project$Component$Category$groupSelectId,
            index: 0
        })
    ]));
    var $author$project$Component$ProductEditor$photoAddInputId = 'exhibition-photo-input';
    var $author$project$Component$ProductEditor$photoAddLabelId = 'exhibition-photo-addLabel';
    var $author$project$Component$ProductEditor$initModelBlank = function() {
        var _v0 = $author$project$Component$Category$initModel;
        var categoryModel = _v0.a;
        var categoryCmd = _v0.b;
        return _Utils_Tuple2($author$project$Component$ProductEditor$Model({
            addImages: _List_Nil,
            beforeImageIds: _List_Nil,
            category: categoryModel,
            condition: $elm$core$Maybe$Nothing,
            deleteImagesAt: $elm$core$Set$empty,
            description: '',
            name: '',
            price: $elm$core$Maybe$Nothing
        }), A2($elm$core$List$cons, $author$project$Component$ProductEditor$CmdAddEventListenerForProductImages({
            inputId: $author$project$Component$ProductEditor$photoAddInputId,
            labelId: $author$project$Component$ProductEditor$photoAddLabelId
        }), A2($elm$core$List$map, $author$project$Component$ProductEditor$CmdByCategory, categoryCmd)));
    }();
    var $author$project$Page$Exhibition$initModel = function() {
        var _v0 = $author$project$Component$ProductEditor$initModelBlank;
        var editorModel = _v0.a;
        var editorCmd = _v0.b;
        return _Utils_Tuple2($author$project$Page$Exhibition$Model({
            logInOrSignUpModel: $author$project$Component$LogIn$initModel,
            page: $author$project$Page$Exhibition$EditPage(editorModel)
        }), A2($elm$core$List$map, $author$project$Page$Exhibition$CmdByProductEditor, editorCmd));
    }();
    var $author$project$Page$History$CmdByProductList = function(a) {
        return {
            $: 'CmdByProductList',
            a: a
        };
    };
    var $author$project$Page$History$CmdGetHistoryProducts = function(a) {
        return {
            $: 'CmdGetHistoryProducts',
            a: a
        };
    };
    var $author$project$Page$History$Loading = {
        $: 'Loading'
    };
    var $author$project$Page$History$Model = function(a) {
        return {
            $: 'Model',
            a: a
        };
    };
    var $author$project$Page$History$initModel = F2(function(goodIdMaybe, logInState) {
        var _v0 = $author$project$Component$ProductList$initModel(goodIdMaybe);
        var productListModel = _v0.a;
        var cmdList = _v0.b;
        return _Utils_Tuple2($author$project$Page$History$Model({
            logIn: $author$project$Component$LogIn$initModel,
            normal: $author$project$Page$History$Loading,
            productList: productListModel
        }), _Utils_ap(function() {
            var _v1 = $author$project$Data$LogInState$getToken(logInState);
            if (_v1.$ === 'Just') {
                var accessToken = _v1.a;
                return _List_fromArray([
                    $author$project$Page$History$CmdGetHistoryProducts(accessToken)
                ]);
            } else return _List_Nil;
        }(), A2($elm$core$List$map, $author$project$Page$History$CmdByProductList, cmdList)));
    });
    var $author$project$Page$LikedProducts$CmdByProductList = function(a) {
        return {
            $: 'CmdByProductList',
            a: a
        };
    };
    var $author$project$Page$LikedProducts$CmdGetLikedProducts = function(a) {
        return {
            $: 'CmdGetLikedProducts',
            a: a
        };
    };
    var $author$project$Page$LikedProducts$Loading = {
        $: 'Loading'
    };
    var $author$project$Page$LikedProducts$Model = function(a) {
        return {
            $: 'Model',
            a: a
        };
    };
    var $author$project$Page$LikedProducts$initModel = F2(function(goodIdMaybe, logInState) {
        var _v0 = $author$project$Component$ProductList$initModel(goodIdMaybe);
        var productListModel = _v0.a;
        var productListCmds = _v0.b;
        return _Utils_Tuple2($author$project$Page$LikedProducts$Model({
            logIn: $author$project$Component$LogIn$initModel,
            normal: $author$project$Page$LikedProducts$Loading,
            productList: productListModel
        }), _Utils_ap(function() {
            var _v1 = $author$project$Data$LogInState$getToken(logInState);
            if (_v1.$ === 'Just') {
                var accessToken = _v1.a;
                return _List_fromArray([
                    $author$project$Page$LikedProducts$CmdGetLikedProducts(accessToken)
                ]);
            } else return _List_Nil;
        }(), A2($elm$core$List$map, $author$project$Page$LikedProducts$CmdByProductList, productListCmds)));
    });
    var $author$project$Page$LogIn$Model = function(a) {
        return {
            $: 'Model',
            a: a
        };
    };
    var $author$project$Page$LogIn$initModel = _Utils_Tuple2($author$project$Page$LogIn$Model($author$project$Component$LogIn$initModel), _List_Nil);
    var $author$project$Page$Notification$Model = {
        $: 'Model'
    };
    var $author$project$Page$Notification$initModel = _Utils_Tuple2($author$project$Page$Notification$Model, _List_Nil);
    var $author$project$Page$Product$CmdGetCommentList = function(a) {
        return {
            $: 'CmdGetCommentList',
            a: a
        };
    };
    var $author$project$Page$Product$CmdGetProductAndMarkHistory = function(a) {
        return {
            $: 'CmdGetProductAndMarkHistory',
            a: a
        };
    };
    var $author$project$Page$Product$CmdScrollToTop = {
        $: 'CmdScrollToTop'
    };
    var $author$project$Page$Product$Normal = function(a) {
        return {
            $: 'Normal',
            a: a
        };
    };
    var $author$project$Page$Product$initModel = F2(function(logInState, id) {
        return _Utils_Tuple2($author$project$Page$Product$Normal({
            comment: '',
            commentList: $elm$core$Maybe$Nothing,
            commentSending: false,
            likeSending: false,
            product: id
        }), _Utils_ap(function() {
            var _v0 = $author$project$Data$LogInState$getToken(logInState);
            if (_v0.$ === 'Just') {
                var accessToken = _v0.a;
                return _List_fromArray([
                    $author$project$Page$Product$CmdGetProductAndMarkHistory({
                        productId: id,
                        token: accessToken
                    })
                ]);
            } else return _List_Nil;
        }(), _List_fromArray([
            $author$project$Page$Product$CmdGetCommentList(id),
            $author$project$Page$Product$CmdScrollToTop
        ])));
    });
    var $author$project$Page$Search$CmdByCategory = function(a) {
        return {
            $: 'CmdByCategory',
            a: a
        };
    };
    var $author$project$Page$Search$CmdBySchoolSelect = function(a) {
        return {
            $: 'CmdBySchoolSelect',
            a: a
        };
    };
    var $author$project$Page$Search$Model = function(a) {
        return {
            $: 'Model',
            a: a
        };
    };
    var $author$project$Page$Search$School = function(a) {
        return {
            $: 'School',
            a: a
        };
    };
    var $author$project$Component$Category$GroupSelect = function(a) {
        return {
            $: 'GroupSelect',
            a: a
        };
    };
    var $author$project$Utility$getFirstIndex = F2(function(element, list) {
        if (list.b) {
            var x = list.a;
            var xs = list.b;
            return _Utils_eq(element, x) ? $elm$core$Maybe$Just(0) : A2($elm$core$Maybe$map, $elm$core$Basics$add(1), A2($author$project$Utility$getFirstIndex, element, xs));
        } else return $elm$core$Maybe$Nothing;
    });
    var $author$project$Data$Category$groupAll = _List_fromArray([
        $author$project$Data$Category$Furniture,
        $author$project$Data$Category$Appliance,
        $author$project$Data$Category$Fashion,
        $author$project$Data$Category$Book,
        $author$project$Data$Category$Vehicle,
        $author$project$Data$Category$Food,
        $author$project$Data$Category$Hobby
    ]);
    var $author$project$Data$Category$groupToIndex = function(group) {
        return A2($elm$core$Maybe$withDefault, 0, A2($author$project$Utility$getFirstIndex, group, $author$project$Data$Category$groupAll));
    };
    var $author$project$Component$Category$CategorySelect = function(a) {
        return {
            $: 'CategorySelect',
            a: a
        };
    };
    var $author$project$Component$Category$categorySelectId = 'select-category';
    var $author$project$Data$Category$groupFromCategory = function(subCategory) {
        switch(subCategory.$){
            case 'FurnitureTable':
                return $author$project$Data$Category$Furniture;
            case 'FurnitureChair':
                return $author$project$Data$Category$Furniture;
            case 'FurnitureChest':
                return $author$project$Data$Category$Furniture;
            case 'FurnitureBed':
                return $author$project$Data$Category$Furniture;
            case 'FurnitureKitchen':
                return $author$project$Data$Category$Furniture;
            case 'FurnitureCurtain':
                return $author$project$Data$Category$Furniture;
            case 'FurnitureMat':
                return $author$project$Data$Category$Furniture;
            case 'FurnitureOther':
                return $author$project$Data$Category$Furniture;
            case 'ApplianceRefrigerator':
                return $author$project$Data$Category$Appliance;
            case 'ApplianceMicrowave':
                return $author$project$Data$Category$Appliance;
            case 'ApplianceWashing':
                return $author$project$Data$Category$Appliance;
            case 'ApplianceVacuum':
                return $author$project$Data$Category$Appliance;
            case 'ApplianceTemperature':
                return $author$project$Data$Category$Appliance;
            case 'ApplianceHumidity':
                return $author$project$Data$Category$Appliance;
            case 'ApplianceLight':
                return $author$project$Data$Category$Appliance;
            case 'ApplianceTv':
                return $author$project$Data$Category$Appliance;
            case 'ApplianceSpeaker':
                return $author$project$Data$Category$Appliance;
            case 'ApplianceSmartphone':
                return $author$project$Data$Category$Appliance;
            case 'AppliancePc':
                return $author$project$Data$Category$Appliance;
            case 'ApplianceCommunication':
                return $author$project$Data$Category$Appliance;
            case 'ApplianceOther':
                return $author$project$Data$Category$Appliance;
            case 'FashionMens':
                return $author$project$Data$Category$Fashion;
            case 'FashionLadies':
                return $author$project$Data$Category$Fashion;
            case 'FashionOther':
                return $author$project$Data$Category$Fashion;
            case 'BookTextbook':
                return $author$project$Data$Category$Book;
            case 'BookBook':
                return $author$project$Data$Category$Book;
            case 'BookComic':
                return $author$project$Data$Category$Book;
            case 'BookOther':
                return $author$project$Data$Category$Book;
            case 'VehicleBicycle':
                return $author$project$Data$Category$Vehicle;
            case 'VehicleBike':
                return $author$project$Data$Category$Vehicle;
            case 'VehicleCar':
                return $author$project$Data$Category$Vehicle;
            case 'VehicleOther':
                return $author$project$Data$Category$Vehicle;
            case 'FoodFood':
                return $author$project$Data$Category$Food;
            case 'FoodBeverage':
                return $author$project$Data$Category$Food;
            case 'FoodOther':
                return $author$project$Data$Category$Food;
            case 'HobbyDisc':
                return $author$project$Data$Category$Hobby;
            case 'HobbyInstrument':
                return $author$project$Data$Category$Hobby;
            case 'HobbyCamera':
                return $author$project$Data$Category$Hobby;
            case 'HobbyGame':
                return $author$project$Data$Category$Hobby;
            case 'HobbySport':
                return $author$project$Data$Category$Hobby;
            case 'HobbyArt':
                return $author$project$Data$Category$Hobby;
            case 'HobbyAccessory':
                return $author$project$Data$Category$Hobby;
            case 'HobbyDaily':
                return $author$project$Data$Category$Hobby;
            case 'HobbyHandmade':
                return $author$project$Data$Category$Hobby;
            default:
                return $author$project$Data$Category$Hobby;
        }
    };
    var $author$project$Data$Category$groupToCategoryList = function(category) {
        switch(category.$){
            case 'Furniture':
                return _List_fromArray([
                    $author$project$Data$Category$FurnitureTable,
                    $author$project$Data$Category$FurnitureChair,
                    $author$project$Data$Category$FurnitureChest,
                    $author$project$Data$Category$FurnitureBed,
                    $author$project$Data$Category$FurnitureKitchen,
                    $author$project$Data$Category$FurnitureCurtain,
                    $author$project$Data$Category$FurnitureMat,
                    $author$project$Data$Category$FurnitureOther
                ]);
            case 'Appliance':
                return _List_fromArray([
                    $author$project$Data$Category$ApplianceRefrigerator,
                    $author$project$Data$Category$ApplianceMicrowave,
                    $author$project$Data$Category$ApplianceWashing,
                    $author$project$Data$Category$ApplianceVacuum,
                    $author$project$Data$Category$ApplianceTemperature,
                    $author$project$Data$Category$ApplianceHumidity,
                    $author$project$Data$Category$ApplianceLight,
                    $author$project$Data$Category$ApplianceTv,
                    $author$project$Data$Category$ApplianceSpeaker,
                    $author$project$Data$Category$ApplianceSmartphone,
                    $author$project$Data$Category$AppliancePc,
                    $author$project$Data$Category$ApplianceCommunication,
                    $author$project$Data$Category$ApplianceOther
                ]);
            case 'Fashion':
                return _List_fromArray([
                    $author$project$Data$Category$FashionMens,
                    $author$project$Data$Category$FashionLadies,
                    $author$project$Data$Category$FashionOther
                ]);
            case 'Book':
                return _List_fromArray([
                    $author$project$Data$Category$BookTextbook,
                    $author$project$Data$Category$BookBook,
                    $author$project$Data$Category$BookComic,
                    $author$project$Data$Category$BookOther
                ]);
            case 'Vehicle':
                return _List_fromArray([
                    $author$project$Data$Category$VehicleBicycle,
                    $author$project$Data$Category$VehicleBike,
                    $author$project$Data$Category$VehicleCar,
                    $author$project$Data$Category$VehicleOther
                ]);
            case 'Food':
                return _List_fromArray([
                    $author$project$Data$Category$FoodFood,
                    $author$project$Data$Category$FoodBeverage,
                    $author$project$Data$Category$FoodOther
                ]);
            default:
                return _List_fromArray([
                    $author$project$Data$Category$HobbyDisc,
                    $author$project$Data$Category$HobbyInstrument,
                    $author$project$Data$Category$HobbyCamera,
                    $author$project$Data$Category$HobbyGame,
                    $author$project$Data$Category$HobbySport,
                    $author$project$Data$Category$HobbyArt,
                    $author$project$Data$Category$HobbyAccessory,
                    $author$project$Data$Category$HobbyDaily,
                    $author$project$Data$Category$HobbyHandmade,
                    $author$project$Data$Category$HobbyOther
                ]);
        }
    };
    var $author$project$Data$Category$toIndexInGroup = function(subCategory) {
        return A2($elm$core$Maybe$withDefault, 0, A2($author$project$Utility$getFirstIndex, subCategory, $author$project$Data$Category$groupToCategoryList($author$project$Data$Category$groupFromCategory(subCategory))));
    };
    var $author$project$Component$Category$initModelWithCategorySelect = function(category) {
        return _Utils_Tuple2($author$project$Component$Category$Model($author$project$Component$Category$CategorySelect(category)), _List_fromArray([
            $author$project$Component$Category$CmdChangeSelectedIndex({
                id: $author$project$Component$Category$groupSelectId,
                index: $author$project$Data$Category$groupToIndex($author$project$Data$Category$groupFromCategory(category)) + 1
            }),
            $author$project$Component$Category$CmdChangeSelectedIndex({
                id: $author$project$Component$Category$categorySelectId,
                index: $author$project$Data$Category$toIndexInGroup(category) + 1
            })
        ]));
    };
    var $author$project$Component$Category$initModelWithSearchCondition = function(categorySelect) {
        switch(categorySelect.$){
            case 'CategoryNone':
                return $author$project$Component$Category$initModel;
            case 'CategoryGroup':
                var group = categorySelect.a;
                return _Utils_Tuple2($author$project$Component$Category$Model($author$project$Component$Category$GroupSelect(group)), _List_fromArray([
                    $author$project$Component$Category$CmdChangeSelectedIndex({
                        id: $author$project$Component$Category$groupSelectId,
                        index: $author$project$Data$Category$groupToIndex(group) + 1
                    })
                ]));
            default:
                var category = categorySelect.a;
                return $author$project$Component$Category$initModelWithCategorySelect(category);
        }
    };
    var $author$project$Component$SchoolSelect$CmdChangeSelectedIndex = function(a) {
        return {
            $: 'CmdChangeSelectedIndex',
            a: a
        };
    };
    var $author$project$Component$SchoolSelect$None = {
        $: 'None'
    };
    var $author$project$Component$SchoolSelect$schoolSelectId = 'signUp-selectSchool';
    var $author$project$Component$SchoolSelect$initNone = _Utils_Tuple2($author$project$Component$SchoolSelect$None, _List_fromArray([
        $author$project$Component$SchoolSelect$CmdChangeSelectedIndex({
            id: $author$project$Component$SchoolSelect$schoolSelectId,
            index: 0
        })
    ]));
    var $author$project$Page$Search$initModel = function() {
        var _v0 = $author$project$Component$SchoolSelect$initNone;
        var schoolModel = _v0.a;
        var schoolCmd = _v0.b;
        var _v1 = $author$project$Component$Category$initModelWithSearchCondition($author$project$Data$SearchCondition$CategoryNone);
        var categoryModel = _v1.a;
        var categoryCmd = _v1.b;
        return _Utils_Tuple2($author$project$Page$Search$Model({
            categorySelect: categoryModel,
            query: '',
            universitySelect: $author$project$Page$Search$School(schoolModel)
        }), _Utils_ap(A2($elm$core$List$map, $author$project$Page$Search$CmdByCategory, categoryCmd), A2($elm$core$List$map, $author$project$Page$Search$CmdBySchoolSelect, schoolCmd)));
    }();
    var $author$project$Page$SearchResult$CommandByProductList = function(a) {
        return {
            $: 'CommandByProductList',
            a: a
        };
    };
    var $author$project$Page$SearchResult$Model = function(a) {
        return {
            $: 'Model',
            a: a
        };
    };
    var $author$project$Data$Product$getId = function(_v0) {
        var id = _v0.a.id;
        return id;
    };
    var $author$project$Data$Product$getCategory = function(_v0) {
        var category = _v0.a.category;
        return category;
    };
    var $author$project$Data$SearchCondition$satisfyCategoryCondition = F2(function(condition, product) {
        switch(condition.$){
            case 'CategoryNone':
                return true;
            case 'CategoryGroup':
                var group = condition.a;
                return _Utils_eq($author$project$Data$Category$groupFromCategory($author$project$Data$Product$getCategory(product)), group);
            default:
                var category = condition.a;
                return _Utils_eq($author$project$Data$Product$getCategory(product), category);
        }
    });
    var $author$project$Data$Product$getDescription = function(_v0) {
        var description = _v0.a.description;
        return description;
    };
    var $author$project$Data$Product$getName = function(_v0) {
        var name = _v0.a.name;
        return name;
    };
    var $elm$core$Char$fromCode = _Char_fromCode;
    var $elm$core$String$fromList = _String_fromList;
    var $elm$core$String$foldr = _String_foldr;
    var $elm$core$String$toList = function(string) {
        return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
    };
    var $elm$core$Char$toLower = _Char_toLower;
    var $author$project$Data$SearchCondition$normalization = function(text) {
        return $elm$core$String$fromList(A2($elm$core$List$map, function(c) {
            var charCode = $elm$core$Char$toCode(c);
            return $elm$core$Char$toLower(_Utils_cmp($elm$core$Char$toCode(_Utils_chr('ァ')), charCode) < 1 && _Utils_cmp(charCode, $elm$core$Char$toCode(_Utils_chr('ン'))) < 1 ? $elm$core$Char$fromCode(charCode - 6) : c);
        }, $elm$core$String$toList(text)));
    };
    var $author$project$Data$SearchCondition$satisfyQuery = F2(function(query, product) {
        return A2($elm$core$String$contains, $author$project$Data$SearchCondition$normalization(query), $author$project$Data$SearchCondition$normalization($author$project$Data$Product$getName(product))) || A2($elm$core$String$contains, $author$project$Data$SearchCondition$normalization(query), $author$project$Data$SearchCondition$normalization($author$project$Data$Product$getDescription(product)));
    });
    var $author$project$Data$SearchCondition$satisfyUniversityCondition = F2(function(condition, product) {
        switch(condition.$){
            case 'UniversityNone':
                return true;
            case 'UniversityDepartment':
                var department = condition.a;
                return true;
            case 'UniversitySchool':
                var school = condition.a;
                return true;
            default:
                var graduate = condition.a;
                return true;
        }
    });
    var $author$project$Data$SearchCondition$satisfyCondition = F2(function(_v0, product) {
        var record = _v0.a;
        return A2($author$project$Data$SearchCondition$satisfyCategoryCondition, record.category, product) && A2($author$project$Data$SearchCondition$satisfyUniversityCondition, record.university, product) && A2($author$project$Data$SearchCondition$satisfyQuery, record.query, product);
    });
    var $author$project$Data$SearchCondition$search = function(condition) {
        return A2($elm$core$Basics$composeR, $elm$core$List$filter($author$project$Data$SearchCondition$satisfyCondition(condition)), $elm$core$List$map($author$project$Data$Product$getId));
    };
    var $author$project$Page$SearchResult$initModel = F3(function(productIdMaybe, condition, allProductMaybe) {
        var _v0 = $author$project$Component$ProductList$initModel(productIdMaybe);
        var productListModel = _v0.a;
        var cmdList = _v0.b;
        return _Utils_Tuple2($author$project$Page$SearchResult$Model({
            condition: condition,
            productList: productListModel,
            result: A2($elm$core$Maybe$map, $author$project$Data$SearchCondition$search(condition), allProductMaybe)
        }), A2($elm$core$List$map, $author$project$Page$SearchResult$CommandByProductList, cmdList));
    });
    var $author$project$Page$SoldProducts$CmdByProductList = function(a) {
        return {
            $: 'CmdByProductList',
            a: a
        };
    };
    var $author$project$Page$SoldProducts$CmdGetSoldProducts = function(a) {
        return {
            $: 'CmdGetSoldProducts',
            a: a
        };
    };
    var $author$project$Page$SoldProducts$Loading = {
        $: 'Loading'
    };
    var $author$project$Page$SoldProducts$Model = function(a) {
        return {
            $: 'Model',
            a: a
        };
    };
    var $author$project$Page$SoldProducts$initModel = F2(function(userId, productIdMaybe) {
        var _v0 = $author$project$Component$ProductList$initModel(productIdMaybe);
        var productListModel = _v0.a;
        var cmdList = _v0.b;
        return _Utils_Tuple2($author$project$Page$SoldProducts$Model({
            normal: $author$project$Page$SoldProducts$Loading,
            productList: productListModel,
            userId: userId
        }), A2($elm$core$List$cons, $author$project$Page$SoldProducts$CmdGetSoldProducts(userId), A2($elm$core$List$map, $author$project$Page$SoldProducts$CmdByProductList, cmdList)));
    });
    var $author$project$Page$TradesInPast$CmdGetTradedProducts = function(a) {
        return {
            $: 'CmdGetTradedProducts',
            a: a
        };
    };
    var $author$project$Page$TradesInPast$Loading = {
        $: 'Loading'
    };
    var $author$project$Page$TradesInPast$Model = function(a) {
        return {
            $: 'Model',
            a: a
        };
    };
    var $author$project$Page$TradesInPast$initModel = function(logInState) {
        return _Utils_Tuple2($author$project$Page$TradesInPast$Model({
            logIn: $author$project$Component$LogIn$initModel,
            normal: $author$project$Page$TradesInPast$Loading
        }), function() {
            var _v0 = $author$project$Data$LogInState$getToken(logInState);
            if (_v0.$ === 'Just') {
                var accessToken = _v0.a;
                return _List_fromArray([
                    $author$project$Page$TradesInPast$CmdGetTradedProducts(accessToken)
                ]);
            } else return _List_Nil;
        }());
    };
    var $author$project$Page$TradesInProgress$CmdGetTradingProducts = function(a) {
        return {
            $: 'CmdGetTradingProducts',
            a: a
        };
    };
    var $author$project$Page$TradesInProgress$Loading = {
        $: 'Loading'
    };
    var $author$project$Page$TradesInProgress$Model = function(a) {
        return {
            $: 'Model',
            a: a
        };
    };
    var $author$project$Page$TradesInProgress$initModel = function(logInState) {
        return _Utils_Tuple2($author$project$Page$TradesInProgress$Model({
            logIn: $author$project$Component$LogIn$initModel,
            normal: $author$project$Page$TradesInProgress$Loading
        }), function() {
            var _v0 = $author$project$Data$LogInState$getToken(logInState);
            if (_v0.$ === 'Just') {
                var accessToken = _v0.a;
                return _List_fromArray([
                    $author$project$Page$TradesInProgress$CmdGetTradingProducts(accessToken)
                ]);
            } else return _List_Nil;
        }());
    };
    var $author$project$Page$Trade$CheckingTrader = function(a) {
        return {
            $: 'CheckingTrader',
            a: a
        };
    };
    var $author$project$Page$Trade$CmdGetTrade = F2(function(a, b) {
        return {
            $: 'CmdGetTrade',
            a: a,
            b: b
        };
    });
    var $author$project$Page$Trade$initModelFromId = F2(function(logInState, id) {
        return _Utils_Tuple2($author$project$Page$Trade$CheckingTrader(id), function() {
            var _v0 = $author$project$Data$LogInState$getToken(logInState);
            if (_v0.$ === 'Just') {
                var token = _v0.a;
                return _List_fromArray([
                    A2($author$project$Page$Trade$CmdGetTrade, token, id)
                ]);
            } else return _List_Nil;
        }());
    });
    var $author$project$Page$User$CmdGetUserProfile = function(a) {
        return {
            $: 'CmdGetUserProfile',
            a: a
        };
    };
    var $author$project$Page$User$LoadingWithUserId = function(a) {
        return {
            $: 'LoadingWithUserId',
            a: a
        };
    };
    var $author$project$Page$User$LoadingWithUserIdAndName = function(a) {
        return {
            $: 'LoadingWithUserIdAndName',
            a: a
        };
    };
    var $author$project$Data$User$withNameGetId = function(_v0) {
        var id = _v0.a.id;
        return id;
    };
    var $author$project$Page$User$initialModel = F2(function(logInState, userId) {
        if (logInState.$ === 'Ok') {
            var userWithName = logInState.a.userWithName;
            return _Utils_eq($author$project$Data$User$withNameGetId(userWithName), userId) ? _Utils_Tuple2($author$project$Page$User$LoadingWithUserIdAndName(userWithName), _List_fromArray([
                $author$project$Page$User$CmdGetUserProfile(userId)
            ])) : _Utils_Tuple2($author$project$Page$User$LoadingWithUserId(userId), _List_fromArray([
                $author$project$Page$User$CmdGetUserProfile(userId)
            ]));
        } else return _Utils_Tuple2($author$project$Page$User$LoadingWithUserId(userId), _List_fromArray([
            $author$project$Page$User$CmdGetUserProfile(userId)
        ]));
    });
    var $author$project$Page$LikedProducts$GetProductsResponse = function(a) {
        return {
            $: 'GetProductsResponse',
            a: a
        };
    };
    var $author$project$Main$PageMsgLikedProducts = function(a) {
        return {
            $: 'PageMsgLikedProducts',
            a: a
        };
    };
    var $author$project$Api$getLikedProducts = function(token) {
        return A2($author$project$Api$graphQlApiRequest, $author$project$Api$Query(_List_fromArray([
            $author$project$Api$Field({
                args: _List_fromArray([
                    _Utils_Tuple2('accessToken', $author$project$Api$GraphQLString($author$project$Api$tokenToString(token)))
                ]),
                name: 'userPrivate',
                _return: _List_fromArray([
                    $author$project$Api$Field({
                        args: _List_Nil,
                        name: 'likedProductAll',
                        _return: $author$project$Api$productReturn
                    })
                ])
            })
        ])), A2($elm$json$Json$Decode$field, 'userPrivate', A2($elm$json$Json$Decode$field, 'likedProductAll', $elm$json$Json$Decode$list($author$project$Api$productDecoder))));
    };
    var $author$project$Main$likedProductsCmdToCmd = function(cmd) {
        switch(cmd.$){
            case 'CmdGetLikedProducts':
                var token = cmd.a;
                return A2($author$project$Api$getLikedProducts, token, A2($elm$core$Basics$composeR, $author$project$Page$LikedProducts$GetProductsResponse, A2($elm$core$Basics$composeR, $author$project$Main$PageMsgLikedProducts, $author$project$Main$PageMsg)));
            case 'CmdByLogIn':
                var e = cmd.a;
                return $author$project$Main$logInCmdToCmd(e);
            case 'CmdByProductList':
                var e = cmd.a;
                return $author$project$Main$productListCmdToCmd(e);
            default:
                var log = cmd.a;
                return A2($elm$core$Task$perform, $elm$core$Basics$always($author$project$Main$AddLogMessage(log)), $elm$core$Task$succeed(_Utils_Tuple0));
        }
    };
    var $author$project$Main$logInPageCmdToCmd = F2(function(key, cmd) {
        if (cmd.$ === 'LogInOrSignUpCmd') {
            var e = cmd.a;
            return $author$project$Main$logInCmdToCmd(e);
        } else return A2($elm$browser$Browser$Navigation$pushUrl, key, $author$project$PageLocation$toUrlAsString($author$project$PageLocation$Home));
    });
    var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
    var $author$project$Main$notificationCmdToCmd = function(cmd) {
        return $elm$core$Platform$Cmd$none;
    };
    var $author$project$Page$About$PrivacyPolicy = {
        $: 'PrivacyPolicy'
    };
    var $author$project$Page$About$privacyPolicyModel = $author$project$Page$About$PrivacyPolicy;
    var $author$project$Page$Product$DeleteResponse = function(a) {
        return {
            $: 'DeleteResponse',
            a: a
        };
    };
    var $author$project$Page$Product$GetCommentListResponse = function(a) {
        return {
            $: 'GetCommentListResponse',
            a: a
        };
    };
    var $author$project$Main$NoOperation = {
        $: 'NoOperation'
    };
    var $author$project$Main$PageMsgProduct = function(a) {
        return {
            $: 'PageMsgProduct',
            a: a
        };
    };
    var $author$project$PageLocation$Trade = function(a) {
        return {
            $: 'Trade',
            a: a
        };
    };
    var $author$project$Page$Product$TradeStartResponse = function(a) {
        return {
            $: 'TradeStartResponse',
            a: a
        };
    };
    var $author$project$Page$Product$UpdateProductDataResponse = function(a) {
        return {
            $: 'UpdateProductDataResponse',
            a: a
        };
    };
    var $author$project$Data$Product$Comment = function(a) {
        return {
            $: 'Comment',
            a: a
        };
    };
    var $author$project$Data$Product$commentFromApi = $author$project$Data$Product$Comment;
    var $author$project$Api$productCommentDecoder = A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'createdAt', $author$project$Api$dateTimeDecoder, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'speaker', $author$project$Api$userWithNameDecoder, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'body', $elm$json$Json$Decode$string, $elm$json$Json$Decode$succeed(F3(function(body, speaker, createdAt) {
        return $author$project$Data$Product$commentFromApi({
            body: body,
            createdAt: createdAt,
            speaker: speaker
        });
    })))));
    var $author$project$Api$productCommentReturn = _List_fromArray([
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'body',
            _return: _List_Nil
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'speaker',
            _return: $author$project$Api$userWithNameReturn
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'createdAt',
            _return: _List_Nil
        })
    ]);
    var $author$project$Api$addProductComment = F3(function(productId, commentBody, token) {
        return A2($author$project$Api$graphQlApiRequest, $author$project$Api$Mutation(_List_fromArray([
            $author$project$Api$Field({
                args: _List_fromArray([
                    _Utils_Tuple2('accessToken', $author$project$Api$GraphQLString($author$project$Api$tokenToString(token))),
                    _Utils_Tuple2('productId', $author$project$Api$GraphQLString($author$project$Data$Product$idToString(productId))),
                    _Utils_Tuple2('body', $author$project$Api$GraphQLString(commentBody))
                ]),
                name: 'addProductComment',
                _return: _List_fromArray([
                    $author$project$Api$Field({
                        args: _List_Nil,
                        name: 'comments',
                        _return: $author$project$Api$productCommentReturn
                    })
                ])
            })
        ])), A2($elm$json$Json$Decode$field, 'addProductComment', A2($elm$json$Json$Decode$field, 'comments', $elm$json$Json$Decode$list($author$project$Api$productCommentDecoder))));
    });
    var $elm$json$Json$Decode$bool = _Json_decodeBool;
    var $author$project$Api$deleteProduct = F2(function(productId, token) {
        return A2($author$project$Api$graphQlApiRequest, $author$project$Api$Mutation(_List_fromArray([
            $author$project$Api$Field({
                args: _List_fromArray([
                    _Utils_Tuple2('accessToken', $author$project$Api$GraphQLString($author$project$Api$tokenToString(token))),
                    _Utils_Tuple2('productId', $author$project$Api$GraphQLString($author$project$Data$Product$idToString(productId)))
                ]),
                name: 'deleteProduct',
                _return: _List_Nil
            })
        ])), A2($elm$json$Json$Decode$field, 'deleteProduct', A2($elm$json$Json$Decode$andThen, function(b) {
            return b ? $elm$json$Json$Decode$succeed(_Utils_Tuple0) : $elm$json$Json$Decode$fail('商品の削除に失敗');
        }, $elm$json$Json$Decode$bool)));
    });
    var $author$project$Data$Trade$getId = function(_v0) {
        var id = _v0.a.id;
        return id;
    };
    var $author$project$Api$getProductComments = F2(function(productId, callBack) {
        return A3($author$project$Api$graphQlApiRequest, $author$project$Api$Query(_List_fromArray([
            $author$project$Api$Field({
                args: _List_fromArray([
                    _Utils_Tuple2('productId', $author$project$Api$GraphQLString($author$project$Data$Product$idToString(productId)))
                ]),
                name: 'product',
                _return: _List_fromArray([
                    $author$project$Api$Field({
                        args: _List_Nil,
                        name: 'comments',
                        _return: $author$project$Api$productCommentReturn
                    })
                ])
            })
        ])), A2($elm$json$Json$Decode$field, 'product', A2($elm$json$Json$Decode$field, 'comments', $elm$json$Json$Decode$list($author$project$Api$productCommentDecoder))), callBack);
    });
    var $elm$browser$Browser$Navigation$load = _Browser_load;
    var $author$project$Main$mainViewScrollToTop = _Platform_outgoingPort('mainViewScrollToTop', function($) {
        return $elm$json$Json$Encode$null;
    });
    var $elm$core$Result$map = F2(function(func, ra) {
        if (ra.$ === 'Ok') {
            var a = ra.a;
            return $elm$core$Result$Ok(func(a));
        } else {
            var e = ra.a;
            return $elm$core$Result$Err(e);
        }
    });
    var $author$project$Api$markProductInHistory = F2(function(productId, token) {
        return A2($author$project$Api$graphQlApiRequest, $author$project$Api$Mutation(_List_fromArray([
            $author$project$Api$Field({
                args: _List_fromArray([
                    _Utils_Tuple2('accessToken', $author$project$Api$GraphQLString($author$project$Api$tokenToString(token))),
                    _Utils_Tuple2('productId', $author$project$Api$GraphQLString($author$project$Data$Product$idToString(productId)))
                ]),
                name: 'markProductInHistory',
                _return: $author$project$Api$productReturn
            })
        ])), A2($elm$json$Json$Decode$field, 'markProductInHistory', $author$project$Api$productDecoder));
    });
    var $author$project$Data$Trade$Trade = function(a) {
        return {
            $: 'Trade',
            a: a
        };
    };
    var $author$project$Data$Trade$fromApi = function(rec) {
        return $author$project$Data$Trade$Trade({
            buyer: rec.buyer,
            createdAt: rec.createdAt,
            id: $author$project$Data$Trade$Id(rec.id),
            productId: $author$project$Data$Product$idFromString(rec.productId),
            status: rec.status,
            updateAt: rec.updateAt
        });
    };
    var $elm$json$Json$Decode$at = F2(function(fields, decoder) {
        return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
    });
    var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt = F3(function(path, valDecoder, decoder) {
        return A2($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom, A2($elm$json$Json$Decode$at, path, valDecoder), decoder);
    });
    var $author$project$Data$Trade$CancelByBuyer = {
        $: 'CancelByBuyer'
    };
    var $author$project$Data$Trade$CancelBySeller = {
        $: 'CancelBySeller'
    };
    var $author$project$Data$Trade$Finish = {
        $: 'Finish'
    };
    var $author$project$Data$Trade$InProgress = {
        $: 'InProgress'
    };
    var $author$project$Data$Trade$WaitBuyerFinish = {
        $: 'WaitBuyerFinish'
    };
    var $author$project$Data$Trade$WaitSellerFinish = {
        $: 'WaitSellerFinish'
    };
    var $author$project$Data$Trade$statusFromIdString = function(string) {
        switch(string){
            case 'inProgress':
                return $elm$core$Maybe$Just($author$project$Data$Trade$InProgress);
            case 'waitSellerFinish':
                return $elm$core$Maybe$Just($author$project$Data$Trade$WaitSellerFinish);
            case 'waitBuyerFinish':
                return $elm$core$Maybe$Just($author$project$Data$Trade$WaitBuyerFinish);
            case 'cancelBySeller':
                return $elm$core$Maybe$Just($author$project$Data$Trade$CancelBySeller);
            case 'cancelByBuyer':
                return $elm$core$Maybe$Just($author$project$Data$Trade$CancelByBuyer);
            case 'finish':
                return $elm$core$Maybe$Just($author$project$Data$Trade$Finish);
            default:
                return $elm$core$Maybe$Nothing;
        }
    };
    var $author$project$Api$tradeStatusDecoder = A2($elm$json$Json$Decode$andThen, function(id) {
        var _v0 = $author$project$Data$Trade$statusFromIdString(id);
        if (_v0.$ === 'Just') {
            var status = _v0.a;
            return $elm$json$Json$Decode$succeed(status);
        } else return $elm$json$Json$Decode$fail('取引の状態(' + (id + ')を理解できなかった'));
    }, $elm$json$Json$Decode$string);
    var $author$project$Api$tradeDecoder = A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'status', $author$project$Api$tradeStatusDecoder, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'updateAt', $author$project$Api$dateTimeDecoder, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'createdAt', $author$project$Api$dateTimeDecoder, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'buyer', $author$project$Api$userWithNameDecoder, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt, _List_fromArray([
        'product',
        'id'
    ]), $elm$json$Json$Decode$string, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'id', $elm$json$Json$Decode$string, $elm$json$Json$Decode$succeed(F6(function(id, productId, buyer, createdAt, updateAt, status) {
        return $author$project$Data$Trade$fromApi({
            buyer: buyer,
            createdAt: createdAt,
            id: id,
            productId: productId,
            status: status,
            updateAt: updateAt
        });
    }))))))));
    var $author$project$Api$tradeReturn = _List_fromArray([
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'id',
            _return: _List_Nil
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'product',
            _return: _Utils_ap($author$project$Api$productReturn, _List_fromArray([
                $author$project$Api$Field({
                    args: _List_Nil,
                    name: 'seller',
                    _return: $author$project$Api$userWithNameReturn
                })
            ]))
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'buyer',
            _return: $author$project$Api$userWithNameReturn
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'createdAt',
            _return: _List_Nil
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'updateAt',
            _return: _List_Nil
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'status',
            _return: _List_Nil
        })
    ]);
    var $author$project$Api$startTrade = F2(function(productId, token) {
        return A2($author$project$Api$graphQlApiRequest, $author$project$Api$Mutation(_List_fromArray([
            $author$project$Api$Field({
                args: _List_fromArray([
                    _Utils_Tuple2('accessToken', $author$project$Api$GraphQLString($author$project$Api$tokenToString(token))),
                    _Utils_Tuple2('productId', $author$project$Api$GraphQLString($author$project$Data$Product$idToString(productId)))
                ]),
                name: 'startTrade',
                _return: $author$project$Api$tradeReturn
            })
        ])), A2($elm$json$Json$Decode$field, 'startTrade', $author$project$Api$tradeDecoder));
    });
    var $author$project$Api$updateProduct = F3(function(productId, _v0, token) {
        var rec = _v0.a;
        return A2($author$project$Api$graphQlApiRequest, $author$project$Api$Mutation(_List_fromArray([
            $author$project$Api$Field({
                args: _List_fromArray([
                    _Utils_Tuple2('accessToken', $author$project$Api$GraphQLString($author$project$Api$tokenToString(token))),
                    _Utils_Tuple2('productId', $author$project$Api$GraphQLString($author$project$Data$Product$idToString(productId))),
                    _Utils_Tuple2('name', $author$project$Api$GraphQLString(rec.name)),
                    _Utils_Tuple2('description', $author$project$Api$GraphQLString(rec.description)),
                    _Utils_Tuple2('price', $author$project$Api$GraphQLInt(rec.price)),
                    _Utils_Tuple2('condition', $author$project$Api$GraphQLEnum($author$project$Data$Product$conditionToIdString(rec.condition))),
                    _Utils_Tuple2('category', $author$project$Api$GraphQLEnum($author$project$Data$Category$toIdString(rec.category))),
                    _Utils_Tuple2('addImageList', $author$project$Api$GraphQLList(A2($elm$core$List$map, $author$project$Api$GraphQLString, rec.addImageList))),
                    _Utils_Tuple2('deleteImageIndex', $author$project$Api$GraphQLList(A2($elm$core$List$map, $author$project$Api$GraphQLInt, $elm$core$Set$toList(rec.deleteImageIndex))))
                ]),
                name: 'updateProduct',
                _return: $author$project$Api$productReturn
            })
        ])), A2($elm$json$Json$Decode$field, 'updateProduct', $author$project$Api$productDecoder));
    });
    var $author$project$Main$productPageCmdToCmd = F2(function(key, cmd) {
        switch(cmd.$){
            case 'CmdGetProductAndMarkHistory':
                var productId = cmd.a.productId;
                var token = cmd.a.token;
                return A3($author$project$Api$markProductInHistory, productId, token, $elm$core$Basics$always($author$project$Main$NoOperation));
            case 'CmdGetCommentList':
                var productId = cmd.a;
                return A2($author$project$Api$getProductComments, productId, A2($elm$core$Basics$composeR, $author$project$Page$Product$GetCommentListResponse, A2($elm$core$Basics$composeR, $author$project$Main$PageMsgProduct, $author$project$Main$PageMsg)));
            case 'CmdAddComment':
                var token = cmd.a;
                var productId = cmd.b.productId;
                var comment = cmd.c;
                return A4($author$project$Api$addProductComment, productId, comment, token, A2($elm$core$Basics$composeR, $author$project$Page$Product$GetCommentListResponse, A2($elm$core$Basics$composeR, $author$project$Main$PageMsgProduct, $author$project$Main$PageMsg)));
            case 'CmdLike':
                var token = cmd.a;
                var id = cmd.b;
                return A3($author$project$Api$likeProduct, id, token, $author$project$Main$LikeProductResponse(id));
            case 'CmdUnLike':
                var token = cmd.a;
                var id = cmd.b;
                return A3($author$project$Api$unlikeProduct, id, token, $author$project$Main$UnlikeProductResponse(id));
            case 'CmdTradeStart':
                var token = cmd.a;
                var id = cmd.b;
                return A3($author$project$Api$startTrade, id, token, A2($elm$core$Basics$composeR, $author$project$Page$Product$TradeStartResponse, A2($elm$core$Basics$composeR, $author$project$Main$PageMsgProduct, $author$project$Main$PageMsg)));
            case 'CmdAddLogMessage':
                var log = cmd.a;
                return A2($elm$core$Task$perform, $elm$core$Basics$always($author$project$Main$AddLogMessage(log)), $elm$core$Task$succeed(_Utils_Tuple0));
            case 'CmdUpdateNowTime':
                return A2($elm$core$Task$attempt, $author$project$Main$GetNowTime, A3($elm$core$Task$map2, $elm$core$Tuple$pair, $elm$time$Time$now, $elm$time$Time$here));
            case 'CmdDelete':
                var token = cmd.a;
                var productId = cmd.b;
                return A3($author$project$Api$deleteProduct, productId, token, A2($elm$core$Basics$composeR, $author$project$Page$Product$DeleteResponse, A2($elm$core$Basics$composeR, $author$project$Main$PageMsgProduct, $author$project$Main$PageMsg)));
            case 'CmdJumpToTradePage':
                var trade = cmd.a;
                return A2($elm$browser$Browser$Navigation$pushUrl, key, $author$project$PageLocation$toUrlAsString($author$project$PageLocation$Trade($author$project$Data$Trade$getId(trade))));
            case 'CmdByProductEditor':
                var e = cmd.a;
                return $author$project$Main$productEditorCmdToCmd(e);
            case 'CmdUpdateProductData':
                var token = cmd.a;
                var productId = cmd.b;
                var requestData = cmd.c;
                return A4($author$project$Api$updateProduct, productId, requestData, token, A2($elm$core$Basics$composeR, $elm$core$Result$map($elm$core$Basics$always(_Utils_Tuple0)), A2($elm$core$Basics$composeR, $author$project$Page$Product$UpdateProductDataResponse, A2($elm$core$Basics$composeR, $author$project$Main$PageMsgProduct, $author$project$Main$PageMsg))));
            case 'CmdReplaceElementText':
                var idAndText = cmd.a;
                return $author$project$Main$replaceText(idAndText);
            case 'CmdJumpToHome':
                return $elm$browser$Browser$Navigation$load($author$project$PageLocation$toUrlAsString($author$project$PageLocation$Home));
            default:
                return $author$project$Main$mainViewScrollToTop(_Utils_Tuple0);
        }
    });
    var $author$project$Main$graduateSelectCmdToCmd = function(cmd) {
        var idAndIndex = cmd.a;
        return $author$project$Main$changeSelectedIndex(idAndIndex);
    };
    var $author$project$Main$schoolSelectCmdToCmd = function(cmd) {
        var idAndIndex = cmd.a;
        return $author$project$Main$changeSelectedIndex(idAndIndex);
    };
    var $author$project$Main$searchPageCmdToCmd = function(cmd) {
        switch(cmd.$){
            case 'CmdReplaceElementText':
                var idAndText = cmd.a;
                return $author$project$Main$replaceText(idAndText);
            case 'CmdByCategory':
                var e = cmd.a;
                return $author$project$Main$categoryCmdToCmd(e);
            case 'CmdBySchoolSelect':
                var c = cmd.a;
                return $author$project$Main$schoolSelectCmdToCmd(c);
            default:
                var c = cmd.a;
                return $author$project$Main$graduateSelectCmdToCmd(c);
        }
    };
    var $author$project$Main$searchResultPageCmdToCmd = function(command) {
        var cmd = command.a;
        return $author$project$Main$productListCmdToCmd(cmd);
    };
    var $author$project$Page$SoldProducts$GetSoldProductListResponse = function(a) {
        return {
            $: 'GetSoldProductListResponse',
            a: a
        };
    };
    var $author$project$Main$PageMsgSoldProducts = function(a) {
        return {
            $: 'PageMsgSoldProducts',
            a: a
        };
    };
    var $author$project$Api$getSoldProductIds = function(userId) {
        return A2($author$project$Api$graphQlApiRequest, $author$project$Api$Query(_List_fromArray([
            $author$project$Api$Field({
                args: _List_fromArray([
                    _Utils_Tuple2('userId', $author$project$Api$GraphQLString($author$project$Data$User$idToString(userId)))
                ]),
                name: 'user',
                _return: _List_fromArray([
                    $author$project$Api$Field({
                        args: _List_Nil,
                        name: 'soldProductAll',
                        _return: _List_fromArray([
                            $author$project$Api$Field({
                                args: _List_Nil,
                                name: 'id',
                                _return: _List_Nil
                            })
                        ])
                    })
                ])
            })
        ])), A2($elm$json$Json$Decode$field, 'user', A2($elm$json$Json$Decode$field, 'soldProductAll', $elm$json$Json$Decode$list(A2($elm$json$Json$Decode$field, 'id', A2($elm$json$Json$Decode$map, $author$project$Data$Product$idFromString, $elm$json$Json$Decode$string))))));
    };
    var $author$project$Main$soldProductsPageCmdToCmd = function(cmd) {
        switch(cmd.$){
            case 'CmdGetSoldProducts':
                var userId = cmd.a;
                return A2($author$project$Api$getSoldProductIds, userId, A2($elm$core$Basics$composeR, $author$project$Page$SoldProducts$GetSoldProductListResponse, A2($elm$core$Basics$composeR, $author$project$Main$PageMsgSoldProducts, $author$project$Main$PageMsg)));
            case 'CmdByProductList':
                var e = cmd.a;
                return $author$project$Main$productListCmdToCmd(e);
            default:
                var log = cmd.a;
                return A2($elm$core$Task$perform, $elm$core$Basics$always($author$project$Main$AddLogMessage(log)), $elm$core$Task$succeed(_Utils_Tuple0));
        }
    };
    var $author$project$Page$Trade$AddCommentResponse = function(a) {
        return {
            $: 'AddCommentResponse',
            a: a
        };
    };
    var $author$project$Page$Trade$CancelTradeResponse = function(a) {
        return {
            $: 'CancelTradeResponse',
            a: a
        };
    };
    var $author$project$Page$Trade$FinishTradeResponse = function(a) {
        return {
            $: 'FinishTradeResponse',
            a: a
        };
    };
    var $author$project$Main$PageMsgTrade = function(a) {
        return {
            $: 'PageMsgTrade',
            a: a
        };
    };
    var $author$project$Page$Trade$TradeResponse = function(a) {
        return {
            $: 'TradeResponse',
            a: a
        };
    };
    var $author$project$Data$Trade$Comment = function(a) {
        return {
            $: 'Comment',
            a: a
        };
    };
    var $author$project$Data$Trade$Buyer = {
        $: 'Buyer'
    };
    var $author$project$Data$Trade$Seller = {
        $: 'Seller'
    };
    var $author$project$Api$tradeSpeakerDecoder = A2($elm$json$Json$Decode$andThen, function(id) {
        switch(id){
            case 'seller':
                return $elm$json$Json$Decode$succeed($author$project$Data$Trade$Seller);
            case 'buyer':
                return $elm$json$Json$Decode$succeed($author$project$Data$Trade$Buyer);
            default:
                return $elm$json$Json$Decode$fail('sellerかbuyer以外のspeakerを受け取ってしまった');
        }
    }, $elm$json$Json$Decode$string);
    var $author$project$Api$tradeCommentDecoder = A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'createdAt', $author$project$Api$dateTimeDecoder, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'speaker', $author$project$Api$tradeSpeakerDecoder, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'body', $elm$json$Json$Decode$string, $elm$json$Json$Decode$succeed(F3(function(body, speaker, createdAt) {
        return $author$project$Data$Trade$Comment({
            body: body,
            createdAt: createdAt,
            speaker: speaker
        });
    })))));
    var $author$project$Api$tradeAndCommentDecoder = A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'comment', $elm$json$Json$Decode$list($author$project$Api$tradeCommentDecoder), A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'status', $author$project$Api$tradeStatusDecoder, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'updateAt', $author$project$Api$dateTimeDecoder, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'createdAt', $author$project$Api$dateTimeDecoder, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'buyer', $author$project$Api$userWithNameDecoder, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt, _List_fromArray([
        'product',
        'id'
    ]), $elm$json$Json$Decode$string, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'id', $elm$json$Json$Decode$string, $elm$json$Json$Decode$succeed(F7(function(id, productId, buyer, createdAt, updateAt, status, comments) {
        return _Utils_Tuple2($author$project$Data$Trade$fromApi({
            buyer: buyer,
            createdAt: createdAt,
            id: id,
            productId: productId,
            status: status,
            updateAt: updateAt
        }), comments);
    })))))))));
    var $author$project$Api$tradeCommentReturn = _List_fromArray([
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'body',
            _return: _List_Nil
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'speaker',
            _return: _List_Nil
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'createdAt',
            _return: _List_Nil
        })
    ]);
    var $author$project$Api$tradeDetailReturn = _List_fromArray([
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'id',
            _return: _List_Nil
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'product',
            _return: _List_fromArray([
                $author$project$Api$Field({
                    args: _List_Nil,
                    name: 'id',
                    _return: _List_Nil
                })
            ])
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'buyer',
            _return: $author$project$Api$userWithNameReturn
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'createdAt',
            _return: _List_Nil
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'updateAt',
            _return: _List_Nil
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'status',
            _return: _List_Nil
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'comment',
            _return: $author$project$Api$tradeCommentReturn
        })
    ]);
    var $author$project$Api$addTradeComment = F3(function(tradeId, body, token) {
        return A2($author$project$Api$graphQlApiRequest, $author$project$Api$Mutation(_List_fromArray([
            $author$project$Api$Field({
                args: _List_fromArray([
                    _Utils_Tuple2('accessToken', $author$project$Api$GraphQLString($author$project$Api$tokenToString(token))),
                    _Utils_Tuple2('tradeId', $author$project$Api$GraphQLString($author$project$Data$Trade$idToString(tradeId))),
                    _Utils_Tuple2('body', $author$project$Api$GraphQLString(body))
                ]),
                name: 'addTradeComment',
                _return: $author$project$Api$tradeDetailReturn
            })
        ])), A2($elm$json$Json$Decode$field, 'addTradeComment', $author$project$Api$tradeAndCommentDecoder));
    });
    var $author$project$Api$cancelTrade = F2(function(tradeId, token) {
        return A2($author$project$Api$graphQlApiRequest, $author$project$Api$Mutation(_List_fromArray([
            $author$project$Api$Field({
                args: _List_fromArray([
                    _Utils_Tuple2('accessToken', $author$project$Api$GraphQLString($author$project$Api$tokenToString(token))),
                    _Utils_Tuple2('tradeId', $author$project$Api$GraphQLString($author$project$Data$Trade$idToString(tradeId)))
                ]),
                name: 'cancelTrade',
                _return: $author$project$Api$tradeDetailReturn
            })
        ])), A2($elm$json$Json$Decode$field, 'cancelTrade', $author$project$Api$tradeAndCommentDecoder));
    });
    var $author$project$Api$finishTrade = F2(function(tradeId, token) {
        return A2($author$project$Api$graphQlApiRequest, $author$project$Api$Mutation(_List_fromArray([
            $author$project$Api$Field({
                args: _List_fromArray([
                    _Utils_Tuple2('accessToken', $author$project$Api$GraphQLString($author$project$Api$tokenToString(token))),
                    _Utils_Tuple2('tradeId', $author$project$Api$GraphQLString($author$project$Data$Trade$idToString(tradeId)))
                ]),
                name: 'finishTrade',
                _return: $author$project$Api$tradeDetailReturn
            })
        ])), A2($elm$json$Json$Decode$field, 'finishTrade', $author$project$Api$tradeAndCommentDecoder));
    });
    var $author$project$Api$getTradeAndComments = F2(function(id, token) {
        return A2($author$project$Api$graphQlApiRequest, $author$project$Api$Query(_List_fromArray([
            $author$project$Api$Field({
                args: _List_fromArray([
                    _Utils_Tuple2('accessToken', $author$project$Api$GraphQLString($author$project$Api$tokenToString(token))),
                    _Utils_Tuple2('tradeId', $author$project$Api$GraphQLString($author$project$Data$Trade$idToString(id)))
                ]),
                name: 'trade',
                _return: $author$project$Api$tradeDetailReturn
            })
        ])), A2($elm$json$Json$Decode$field, 'trade', $author$project$Api$tradeAndCommentDecoder));
    });
    var $author$project$Main$tradePageCmdToCmd = function(cmd) {
        switch(cmd.$){
            case 'CmdUpdateNowTime':
                return A2($elm$core$Task$attempt, $author$project$Main$GetNowTime, A3($elm$core$Task$map2, $elm$core$Tuple$pair, $elm$time$Time$now, $elm$time$Time$here));
            case 'CmdGetTrade':
                var token = cmd.a;
                var id = cmd.b;
                return A3($author$project$Api$getTradeAndComments, id, token, A2($elm$core$Basics$composeR, $author$project$Page$Trade$TradeResponse, A2($elm$core$Basics$composeR, $author$project$Main$PageMsgTrade, $author$project$Main$PageMsg)));
            case 'CmdAddComment':
                var token = cmd.a;
                var id = cmd.b;
                var string = cmd.c;
                return A4($author$project$Api$addTradeComment, id, string, token, A2($elm$core$Basics$composeR, $author$project$Page$Trade$AddCommentResponse, A2($elm$core$Basics$composeR, $author$project$Main$PageMsgTrade, $author$project$Main$PageMsg)));
            case 'CmdAddLogMessage':
                var log = cmd.a;
                return A2($elm$core$Task$perform, $elm$core$Basics$always($author$project$Main$AddLogMessage(log)), $elm$core$Task$succeed(_Utils_Tuple0));
            case 'CmdReplaceElementText':
                var idAndText = cmd.a;
                return $author$project$Main$replaceText(idAndText);
            case 'CmdFinishTrade':
                var token = cmd.a;
                var id = cmd.b;
                return A3($author$project$Api$finishTrade, id, token, A2($elm$core$Basics$composeR, $author$project$Page$Trade$FinishTradeResponse, A2($elm$core$Basics$composeR, $author$project$Main$PageMsgTrade, $author$project$Main$PageMsg)));
            default:
                var token = cmd.a;
                var id = cmd.b;
                return A3($author$project$Api$cancelTrade, id, token, A2($elm$core$Basics$composeR, $author$project$Page$Trade$CancelTradeResponse, A2($elm$core$Basics$composeR, $author$project$Main$PageMsgTrade, $author$project$Main$PageMsg)));
        }
    };
    var $author$project$Page$TradesInPast$GetTradesResponse = function(a) {
        return {
            $: 'GetTradesResponse',
            a: a
        };
    };
    var $author$project$Main$PageMsgTradesInPast = function(a) {
        return {
            $: 'PageMsgTradesInPast',
            a: a
        };
    };
    var $author$project$Api$getTradedProductList = function(token) {
        return A2($author$project$Api$graphQlApiRequest, $author$project$Api$Query(_List_fromArray([
            $author$project$Api$Field({
                args: _List_fromArray([
                    _Utils_Tuple2('accessToken', $author$project$Api$GraphQLString($author$project$Api$tokenToString(token)))
                ]),
                name: 'userPrivate',
                _return: _List_fromArray([
                    $author$project$Api$Field({
                        args: _List_Nil,
                        name: 'tradedAll',
                        _return: $author$project$Api$tradeReturn
                    })
                ])
            })
        ])), A2($elm$json$Json$Decode$field, 'userPrivate', A2($elm$json$Json$Decode$field, 'tradedAll', $elm$json$Json$Decode$list($author$project$Api$tradeDecoder))));
    };
    var $author$project$Main$tradedProductsCmdToCmd = function(cmd) {
        switch(cmd.$){
            case 'CmdGetTradedProducts':
                var token = cmd.a;
                return A2($author$project$Api$getTradedProductList, token, A2($elm$core$Basics$composeR, $author$project$Page$TradesInPast$GetTradesResponse, A2($elm$core$Basics$composeR, $author$project$Main$PageMsgTradesInPast, $author$project$Main$PageMsg)));
            case 'CmdByLogIn':
                var e = cmd.a;
                return $author$project$Main$logInCmdToCmd(e);
            default:
                var log = cmd.a;
                return A2($elm$core$Task$perform, $elm$core$Basics$always($author$project$Main$AddLogMessage(log)), $elm$core$Task$succeed(_Utils_Tuple0));
        }
    };
    var $author$project$Page$TradesInProgress$GetProductsResponse = function(a) {
        return {
            $: 'GetProductsResponse',
            a: a
        };
    };
    var $author$project$Main$PageMsgTradesInProgress = function(a) {
        return {
            $: 'PageMsgTradesInProgress',
            a: a
        };
    };
    var $author$project$Api$getTradingProductList = function(token) {
        return A2($author$project$Api$graphQlApiRequest, $author$project$Api$Query(_List_fromArray([
            $author$project$Api$Field({
                args: _List_fromArray([
                    _Utils_Tuple2('accessToken', $author$project$Api$GraphQLString($author$project$Api$tokenToString(token)))
                ]),
                name: 'userPrivate',
                _return: _List_fromArray([
                    $author$project$Api$Field({
                        args: _List_Nil,
                        name: 'tradingAll',
                        _return: $author$project$Api$tradeReturn
                    })
                ])
            })
        ])), A2($elm$json$Json$Decode$field, 'userPrivate', A2($elm$json$Json$Decode$field, 'tradingAll', $elm$json$Json$Decode$list($author$project$Api$tradeDecoder))));
    };
    var $author$project$Main$tradingProductsCmdToCmd = function(cmd) {
        switch(cmd.$){
            case 'CmdGetTradingProducts':
                var token = cmd.a;
                return A2($author$project$Api$getTradingProductList, token, A2($elm$core$Basics$composeR, $author$project$Page$TradesInProgress$GetProductsResponse, A2($elm$core$Basics$composeR, $author$project$Main$PageMsgTradesInProgress, $author$project$Main$PageMsg)));
            case 'CmdByLogIn':
                var e = cmd.a;
                return $author$project$Main$logInCmdToCmd(e);
            default:
                var log = cmd.a;
                return A2($elm$core$Task$perform, $elm$core$Basics$always($author$project$Main$AddLogMessage(log)), $elm$core$Task$succeed(_Utils_Tuple0));
        }
    };
    var $author$project$Main$ChangeProfileResponse = function(a) {
        return {
            $: 'ChangeProfileResponse',
            a: a
        };
    };
    var $author$project$Main$LogOut = {
        $: 'LogOut'
    };
    var $author$project$Page$User$MsgUserProfileResponse = function(a) {
        return {
            $: 'MsgUserProfileResponse',
            a: a
        };
    };
    var $author$project$Main$PageMsgUser = function(a) {
        return {
            $: 'PageMsgUser',
            a: a
        };
    };
    var $author$project$Main$deleteAllFromLocalStorage = _Platform_outgoingPort('deleteAllFromLocalStorage', function($) {
        return $elm$json$Json$Encode$null;
    });
    var $author$project$Api$getLineNotifyUrl = function(token) {
        return A2($author$project$Api$graphQlApiRequest, $author$project$Api$Mutation(_List_fromArray([
            $author$project$Api$Field({
                args: _List_fromArray([
                    _Utils_Tuple2('accessToken', $author$project$Api$GraphQLString($author$project$Api$tokenToString(token)))
                ]),
                name: 'getLineNotifyUrl',
                _return: _List_Nil
            })
        ])), A2($elm$json$Json$Decode$andThen, function(urlString) {
            var _v0 = $elm$url$Url$fromString(urlString);
            if (_v0.$ === 'Just') {
                var url = _v0.a;
                return $elm$json$Json$Decode$succeed(url);
            } else return $elm$json$Json$Decode$fail('url format error');
        }, A2($elm$json$Json$Decode$field, 'getLineNotifyUrl', $elm$json$Json$Decode$string)));
    };
    var $elm$json$Json$Decode$null = _Json_decodeNull;
    var $elm$json$Json$Decode$oneOf = _Json_oneOf;
    var $elm$json$Json$Decode$nullable = function(decoder) {
        return $elm$json$Json$Decode$oneOf(_List_fromArray([
            $elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
            A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder)
        ]));
    };
    var $author$project$Data$University$GraduateNoTsukuba = function(a) {
        return {
            $: 'GraduateNoTsukuba',
            a: a
        };
    };
    var $author$project$Data$University$GraduateTsukuba = F2(function(a, b) {
        return {
            $: 'GraduateTsukuba',
            a: a,
            b: b
        };
    });
    var $author$project$Data$University$NotGraduate = function(a) {
        return {
            $: 'NotGraduate',
            a: a
        };
    };
    var $elm$core$Maybe$andThen = F2(function(callback, maybeValue) {
        if (maybeValue.$ === 'Just') {
            var value = maybeValue.a;
            return callback(value);
        } else return $elm$core$Maybe$Nothing;
    });
    var $author$project$Data$University$universityFromIdString = function(_v0) {
        var graduateMaybe = _v0.graduateMaybe;
        var departmentMaybe = _v0.departmentMaybe;
        var _v1 = _Utils_Tuple2(A2($elm$core$Maybe$andThen, $author$project$Data$University$departmentFromIdString, departmentMaybe), A2($elm$core$Maybe$andThen, $author$project$Data$University$graduateFromIdString, graduateMaybe));
        if (_v1.a.$ === 'Just') {
            if (_v1.b.$ === 'Just') {
                var department = _v1.a.a;
                var graduate = _v1.b.a;
                return $elm$core$Maybe$Just(A2($author$project$Data$University$GraduateTsukuba, graduate, department));
            } else {
                var department = _v1.a.a;
                var _v3 = _v1.b;
                return $elm$core$Maybe$Just($author$project$Data$University$NotGraduate(department));
            }
        } else if (_v1.b.$ === 'Just') {
            var _v2 = _v1.a;
            var graduate = _v1.b.a;
            return $elm$core$Maybe$Just($author$project$Data$University$GraduateNoTsukuba(graduate));
        } else {
            var _v4 = _v1.a;
            var _v5 = _v1.b;
            return $elm$core$Maybe$Nothing;
        }
    };
    var $author$project$Data$User$WithProfile = function(a) {
        return {
            $: 'WithProfile',
            a: a
        };
    };
    var $author$project$Data$User$withProfileFromApi = function(_v0) {
        var id = _v0.id;
        var displayName = _v0.displayName;
        var imageId = _v0.imageId;
        var introduction = _v0.introduction;
        var university = _v0.university;
        return A2($elm$core$Maybe$map, function(u) {
            return $author$project$Data$User$WithProfile({
                displayName: displayName,
                id: $author$project$Data$User$idFromString(id),
                imageId: imageId,
                introduction: introduction,
                university: u
            });
        }, university);
    };
    var $author$project$Api$userWithProfileDecoder = A2($elm$json$Json$Decode$andThen, function(userMaybe) {
        if (userMaybe.$ === 'Just') {
            var user = userMaybe.a;
            return $elm$json$Json$Decode$succeed(user);
        } else return $elm$json$Json$Decode$fail('invalid university');
    }, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt, _List_fromArray([
        'university',
        'graduate'
    ]), $elm$json$Json$Decode$nullable($elm$json$Json$Decode$string), A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$requiredAt, _List_fromArray([
        'university',
        'schoolAndDepartment'
    ]), $elm$json$Json$Decode$nullable($elm$json$Json$Decode$string), A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'introduction', $elm$json$Json$Decode$string, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'imageId', $author$project$Api$imageIdDecoder, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'displayName', $elm$json$Json$Decode$string, A3($NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required, 'id', $elm$json$Json$Decode$string, $elm$json$Json$Decode$succeed(F6(function(id, displayName, imageId, introduction, schoolAndDepartment, graduate) {
        return $author$project$Data$User$withProfileFromApi({
            displayName: displayName,
            id: id,
            imageId: imageId,
            introduction: introduction,
            university: $author$project$Data$University$universityFromIdString({
                departmentMaybe: schoolAndDepartment,
                graduateMaybe: graduate
            })
        });
    })))))))));
    var $author$project$Api$userWithProfileReturn = _List_fromArray([
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'id',
            _return: _List_Nil
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'displayName',
            _return: _List_Nil
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'imageId',
            _return: _List_Nil
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'introduction',
            _return: _List_Nil
        }),
        $author$project$Api$Field({
            args: _List_Nil,
            name: 'university',
            _return: _List_fromArray([
                $author$project$Api$Field({
                    args: _List_Nil,
                    name: 'schoolAndDepartment',
                    _return: _List_Nil
                }),
                $author$project$Api$Field({
                    args: _List_Nil,
                    name: 'graduate',
                    _return: _List_Nil
                })
            ])
        })
    ]);
    var $author$project$Api$getUserProfile = F2(function(userId, callBack) {
        return A3($author$project$Api$graphQlApiRequest, $author$project$Api$Query(_List_fromArray([
            $author$project$Api$Field({
                args: _List_fromArray([
                    _Utils_Tuple2('userId', $author$project$Api$GraphQLString($author$project$Data$User$idToString(userId)))
                ]),
                name: 'user',
                _return: $author$project$Api$userWithProfileReturn
            })
        ])), A2($elm$json$Json$Decode$field, 'user', $author$project$Api$userWithProfileDecoder), callBack);
    });
    var $author$project$Main$universityCmdToCmd = function(cmd) {
        switch(cmd.$){
            case 'CmdChangeSelectedIndex':
                var id = cmd.a.id;
                var index = cmd.a.index;
                return $author$project$Main$changeSelectedIndex({
                    id: id,
                    index: index
                });
            case 'CmdBySchoolSelect':
                var c = cmd.a;
                return $author$project$Main$schoolSelectCmdToCmd(c);
            default:
                var c = cmd.a;
                return $author$project$Main$graduateSelectCmdToCmd(c);
        }
    };
    var $author$project$Api$GraphQLNull = {
        $: 'GraphQLNull'
    };
    var $author$project$Api$nullableGraphQLValue = F2(function(func, maybe) {
        if (maybe.$ === 'Just') {
            var a = maybe.a;
            return func(a);
        } else return $author$project$Api$GraphQLNull;
    });
    var $author$project$Api$GraphQLObject = function(a) {
        return {
            $: 'GraphQLObject',
            a: a
        };
    };
    var $author$project$Api$universityToGraphQLValue = function(university) {
        return $author$project$Api$GraphQLObject(function() {
            switch(university.$){
                case 'GraduateTsukuba':
                    var graduate = university.a;
                    var schoolAndDepartment = university.b;
                    return _List_fromArray([
                        _Utils_Tuple2('graduate', $author$project$Api$GraphQLEnum($author$project$Data$University$graduateToIdString(graduate))),
                        _Utils_Tuple2('schoolAndDepartment', $author$project$Api$GraphQLEnum($author$project$Data$University$departmentToIdString(schoolAndDepartment)))
                    ]);
                case 'GraduateNoTsukuba':
                    var graduate = university.a;
                    return _List_fromArray([
                        _Utils_Tuple2('graduate', $author$project$Api$GraphQLEnum($author$project$Data$University$graduateToIdString(graduate)))
                    ]);
                default:
                    var schoolAndDepartment = university.a;
                    return _List_fromArray([
                        _Utils_Tuple2('schoolAndDepartment', $author$project$Api$GraphQLEnum($author$project$Data$University$departmentToIdString(schoolAndDepartment)))
                    ]);
            }
        }());
    };
    var $author$project$Api$updateProfile = F2(function(_v0, token) {
        var displayName = _v0.displayName;
        var introduction = _v0.introduction;
        var image = _v0.image;
        var university = _v0.university;
        return A2($author$project$Api$graphQlApiRequest, $author$project$Api$Mutation(_List_fromArray([
            $author$project$Api$Field({
                args: _List_fromArray([
                    _Utils_Tuple2('accessToken', $author$project$Api$GraphQLString($author$project$Api$tokenToString(token))),
                    _Utils_Tuple2('displayName', $author$project$Api$GraphQLString(displayName)),
                    _Utils_Tuple2('image', A2($author$project$Api$nullableGraphQLValue, $author$project$Api$GraphQLString, image)),
                    _Utils_Tuple2('introduction', $author$project$Api$GraphQLString(introduction)),
                    _Utils_Tuple2('university', $author$project$Api$universityToGraphQLValue(university))
                ]),
                name: 'updateProfile',
                _return: $author$project$Api$userWithProfileReturn
            })
        ])), A2($elm$json$Json$Decode$field, 'updateProfile', $author$project$Api$userWithProfileDecoder));
    });
    var $author$project$Main$userPageCmdToCmd = function(cmd) {
        switch(cmd.$){
            case 'CmdChangeProfile':
                var token = cmd.a;
                var profile = cmd.b;
                return A3($author$project$Api$updateProfile, profile, token, $author$project$Main$ChangeProfileResponse);
            case 'CmdReplaceElementText':
                var idAndText = cmd.a;
                return $author$project$Main$replaceText(idAndText);
            case 'CmdByUniversity':
                var e = cmd.a;
                return $author$project$Main$universityCmdToCmd(e);
            case 'CmdLogOut':
                return $elm$core$Platform$Cmd$batch(_List_fromArray([
                    $author$project$Main$deleteAllFromLocalStorage(_Utils_Tuple0),
                    A2($elm$core$Task$perform, $elm$core$Basics$always($author$project$Main$LogOut), $elm$core$Task$succeed(_Utils_Tuple0))
                ]));
            case 'CmdGetUserProfile':
                var userId = cmd.a;
                return A2($author$project$Api$getUserProfile, userId, A2($elm$core$Basics$composeR, $author$project$Page$User$MsgUserProfileResponse, A2($elm$core$Basics$composeR, $author$project$Main$PageMsgUser, $author$project$Main$PageMsg)));
            case 'CmdAddLogMessage':
                var log = cmd.a;
                return A2($elm$core$Task$perform, $elm$core$Basics$always($author$project$Main$AddLogMessage(log)), $elm$core$Task$succeed(_Utils_Tuple0));
            default:
                var token = cmd.a;
                return A2($author$project$Api$getLineNotifyUrl, token, $author$project$Main$Jump);
        }
    };
    var $author$project$Main$urlParserInitResultToPageAndCmd = F4(function(key, logInState, allProductsMaybe, page) {
        switch(page.$){
            case 'InitHome':
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageHome, $author$project$Main$homePageCmdToCmd, $author$project$Page$Home$initModel($elm$core$Maybe$Nothing));
            case 'InitLogIn':
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageLogIn, $author$project$Main$logInPageCmdToCmd(key), $author$project$Page$LogIn$initModel);
            case 'InitLikedProducts':
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageLikedProducts, $author$project$Main$likedProductsCmdToCmd, A2($author$project$Page$LikedProducts$initModel, $elm$core$Maybe$Nothing, logInState));
            case 'InitHistory':
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageHistory, $author$project$Main$historyCmdToCmd, A2($author$project$Page$History$initModel, $elm$core$Maybe$Nothing, logInState));
            case 'InitSoldProducts':
                var userId = page.a;
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageSoldProducts, $author$project$Main$soldProductsPageCmdToCmd, A2($author$project$Page$SoldProducts$initModel, userId, $elm$core$Maybe$Nothing));
            case 'InitBoughtProducts':
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageBoughtProducts, $author$project$Main$boughtProductsPageCmdToCmd, A2($author$project$Page$BoughtProducts$initModel, $elm$core$Maybe$Nothing, logInState));
            case 'InitTradingProducts':
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageTradesInProgress, $author$project$Main$tradingProductsCmdToCmd, $author$project$Page$TradesInProgress$initModel(logInState));
            case 'InitTradedProducts':
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageTradesInPast, $author$project$Main$tradedProductsCmdToCmd, $author$project$Page$TradesInPast$initModel(logInState));
            case 'InitCommentedProducts':
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageCommentedProducts, $author$project$Main$commentedProductsCmdToCmd, A2($author$project$Page$CommentedProducts$initModel, $elm$core$Maybe$Nothing, logInState));
            case 'InitExhibition':
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageExhibition, $author$project$Main$exhibitionPageCmdToCmd(key), $author$project$Page$Exhibition$initModel);
            case 'InitProduct':
                var productId = page.a;
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageProduct, $author$project$Main$productPageCmdToCmd(key), A2($author$project$Page$Product$initModel, logInState, productId));
            case 'InitTrade':
                var tradeId = page.a;
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageTrade, $author$project$Main$tradePageCmdToCmd, A2($author$project$Page$Trade$initModelFromId, logInState, tradeId));
            case 'InitUser':
                var userId = page.a;
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageUser, $author$project$Main$userPageCmdToCmd, A2($author$project$Page$User$initialModel, logInState, userId));
            case 'InitSearch':
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageSearch, $author$project$Main$searchPageCmdToCmd, $author$project$Page$Search$initModel);
            case 'InitSearchResult':
                var condition = page.a;
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageSearchResult, $author$project$Main$searchResultPageCmdToCmd, A3($author$project$Page$SearchResult$initModel, $elm$core$Maybe$Nothing, condition, allProductsMaybe));
            case 'InitNotification':
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageNotification, $author$project$Main$notificationCmdToCmd, $author$project$Page$Notification$initModel);
            case 'InitAbout':
                return _Utils_Tuple2($author$project$Main$PageAbout($author$project$Page$About$aboutModel), $elm$core$Platform$Cmd$none);
            default:
                return _Utils_Tuple2($author$project$Main$PageAbout($author$project$Page$About$privacyPolicyModel), $elm$core$Platform$Cmd$none);
        }
    });
    var $author$project$Main$urlParserInit = F4(function(logInState, key, allProductsMaybe, page) {
        if (page.$ === 'Just') {
            var p = page.a;
            return A4($author$project$Main$urlParserInitResultToPageAndCmd, key, logInState, allProductsMaybe, p);
        } else return $author$project$Main$pageNotFound;
    });
    var $author$project$Main$init = F3(function(_v0, url, key) {
        var accessToken = _v0.accessToken;
        var _v1 = $author$project$PageLocation$initFromUrl(url);
        var tokenFromUrlMaybe = _v1.a;
        var page = _v1.b;
        var _v2 = A4($author$project$Main$urlParserInit, $author$project$Data$LogInState$None, key, $elm$core$Maybe$Nothing, page);
        var newPage = _v2.a;
        var cmd = _v2.b;
        return _Utils_Tuple2($author$project$Main$Model({
            allProducts: $elm$core$Maybe$Nothing,
            key: key,
            logInState: function() {
                var _v3 = _Utils_Tuple2(tokenFromUrlMaybe, accessToken);
                if (_v3.a.$ === 'Just') {
                    var tokenFromUrl = _v3.a.a;
                    return $author$project$Data$LogInState$LoadingProfile(tokenFromUrl);
                } else {
                    if (_v3.b.$ === 'Just') {
                        var _v4 = _v3.a;
                        var accessTokenString = _v3.b.a;
                        return $author$project$Data$LogInState$LoadingProfile($author$project$Api$tokenFromString(accessTokenString));
                    } else return $author$project$Data$LogInState$None;
                }
            }(),
            message: $elm$core$Maybe$Nothing,
            notificationVisible: false,
            now: $elm$core$Maybe$Nothing,
            page: newPage,
            wideScreen: false
        }), $elm$core$Platform$Cmd$batch(_Utils_ap(function() {
            var _v5 = _Utils_Tuple2(tokenFromUrlMaybe, accessToken);
            if (_v5.a.$ === 'Just') {
                var tokenFromUrl = _v5.a.a;
                return _List_fromArray([
                    A2($author$project$Api$getMyNameAndLikedProductsId, tokenFromUrl, $author$project$Main$GetMyProfileAndLikedProductIdsResponse),
                    $author$project$Main$saveAccessTokenToLocalStorage($author$project$Api$tokenToString(tokenFromUrl)),
                    A2($elm$browser$Browser$Navigation$replaceUrl, key, $author$project$PageLocation$initToUrlAsString(A2($elm$core$Maybe$withDefault, $author$project$PageLocation$InitHome, page)))
                ]);
            } else if (_v5.b.$ === 'Just') {
                var _v6 = _v5.a;
                var accessTokenString = _v5.b.a;
                return _List_fromArray([
                    A2($author$project$Api$getMyNameAndLikedProductsId, $author$project$Api$tokenFromString(accessTokenString), $author$project$Main$GetMyProfileAndLikedProductIdsResponse),
                    $author$project$Main$saveAccessTokenToLocalStorage(accessTokenString)
                ]);
            } else {
                var _v7 = _v5.a;
                var _v8 = _v5.b;
                return _List_Nil;
            }
        }(), _List_fromArray([
            cmd,
            A2($elm$core$Task$attempt, $author$project$Main$GetNowTime, A3($elm$core$Task$map2, $elm$core$Tuple$pair, $elm$time$Time$now, $elm$time$Time$here)),
            $author$project$Main$startListenRecommendProducts(_Utils_Tuple0)
        ]))));
    });
    var $author$project$Main$ReceiveProductImages = function(a) {
        return {
            $: 'ReceiveProductImages',
            a: a
        };
    };
    var $author$project$Main$ReceiveUserImage = function(a) {
        return {
            $: 'ReceiveUserImage',
            a: a
        };
    };
    var $author$project$Main$ToNarrowScreenMode = {
        $: 'ToNarrowScreenMode'
    };
    var $author$project$Main$ToWideScreenMode = {
        $: 'ToWideScreenMode'
    };
    var $author$project$Main$UpdateProducts = function(a) {
        return {
            $: 'UpdateProducts',
            a: a
        };
    };
    var $elm$core$Platform$Sub$batch = _Platform_batch;
    var $author$project$Main$receiveAllProducts = _Platform_incomingPort('receiveAllProducts', $elm$json$Json$Decode$list(A2($elm$json$Json$Decode$andThen, function(updateAt) {
        return A2($elm$json$Json$Decode$andThen, function(thumbnailImageId) {
            return A2($elm$json$Json$Decode$andThen, function(status) {
                return A2($elm$json$Json$Decode$andThen, function(sellerImageId) {
                    return A2($elm$json$Json$Decode$andThen, function(sellerId) {
                        return A2($elm$json$Json$Decode$andThen, function(sellerDisplayName) {
                            return A2($elm$json$Json$Decode$andThen, function(price) {
                                return A2($elm$json$Json$Decode$andThen, function(name) {
                                    return A2($elm$json$Json$Decode$andThen, function(likedCount) {
                                        return A2($elm$json$Json$Decode$andThen, function(imageIds) {
                                            return A2($elm$json$Json$Decode$andThen, function(id) {
                                                return A2($elm$json$Json$Decode$andThen, function(description) {
                                                    return A2($elm$json$Json$Decode$andThen, function(createdAt) {
                                                        return A2($elm$json$Json$Decode$andThen, function(condition) {
                                                            return A2($elm$json$Json$Decode$andThen, function(category) {
                                                                return $elm$json$Json$Decode$succeed({
                                                                    category: category,
                                                                    condition: condition,
                                                                    createdAt: createdAt,
                                                                    description: description,
                                                                    id: id,
                                                                    imageIds: imageIds,
                                                                    likedCount: likedCount,
                                                                    name: name,
                                                                    price: price,
                                                                    sellerDisplayName: sellerDisplayName,
                                                                    sellerId: sellerId,
                                                                    sellerImageId: sellerImageId,
                                                                    status: status,
                                                                    thumbnailImageId: thumbnailImageId,
                                                                    updateAt: updateAt
                                                                });
                                                            }, A2($elm$json$Json$Decode$field, 'category', $elm$json$Json$Decode$string));
                                                        }, A2($elm$json$Json$Decode$field, 'condition', $elm$json$Json$Decode$string));
                                                    }, A2($elm$json$Json$Decode$field, 'createdAt', $elm$json$Json$Decode$int));
                                                }, A2($elm$json$Json$Decode$field, 'description', $elm$json$Json$Decode$string));
                                            }, A2($elm$json$Json$Decode$field, 'id', $elm$json$Json$Decode$string));
                                        }, A2($elm$json$Json$Decode$field, 'imageIds', $elm$json$Json$Decode$list($elm$json$Json$Decode$string)));
                                    }, A2($elm$json$Json$Decode$field, 'likedCount', $elm$json$Json$Decode$int));
                                }, A2($elm$json$Json$Decode$field, 'name', $elm$json$Json$Decode$string));
                            }, A2($elm$json$Json$Decode$field, 'price', $elm$json$Json$Decode$int));
                        }, A2($elm$json$Json$Decode$field, 'sellerDisplayName', $elm$json$Json$Decode$string));
                    }, A2($elm$json$Json$Decode$field, 'sellerId', $elm$json$Json$Decode$string));
                }, A2($elm$json$Json$Decode$field, 'sellerImageId', $elm$json$Json$Decode$string));
            }, A2($elm$json$Json$Decode$field, 'status', $elm$json$Json$Decode$string));
        }, A2($elm$json$Json$Decode$field, 'thumbnailImageId', $elm$json$Json$Decode$string));
    }, A2($elm$json$Json$Decode$field, 'updateAt', $elm$json$Json$Decode$int))));
    var $author$project$Main$receiveProductImages = _Platform_incomingPort('receiveProductImages', $elm$json$Json$Decode$list($elm$json$Json$Decode$string));
    var $author$project$Main$receiveUserImage = _Platform_incomingPort('receiveUserImage', $elm$json$Json$Decode$string);
    var $author$project$Main$toNarrowScreenMode = _Platform_incomingPort('toNarrowScreenMode', $elm$json$Json$Decode$null(_Utils_Tuple0));
    var $author$project$Main$toWideScreenMode = _Platform_incomingPort('toWideScreenMode', $elm$json$Json$Decode$null(_Utils_Tuple0));
    var $author$project$Main$subscription = function(_v0) {
        var wideScreen = _v0.a.wideScreen;
        return $elm$core$Platform$Sub$batch(_List_fromArray([
            $author$project$Main$receiveProductImages($author$project$Main$ReceiveProductImages),
            $author$project$Main$receiveUserImage($author$project$Main$ReceiveUserImage),
            wideScreen ? $author$project$Main$toNarrowScreenMode($elm$core$Basics$always($author$project$Main$ToNarrowScreenMode)) : $author$project$Main$toWideScreenMode($elm$core$Basics$always($author$project$Main$ToWideScreenMode)),
            $author$project$Main$receiveAllProducts($author$project$Main$UpdateProducts)
        ]));
    };
    var $elm$core$List$isEmpty = function(xs) {
        if (!xs.b) return true;
        else return false;
    };
    var $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles = F2(function(_v0, styles) {
        var newStyles = _v0.b;
        var classname = _v0.c;
        return $elm$core$List$isEmpty(newStyles) ? styles : A3($elm$core$Dict$insert, classname, newStyles, styles);
    });
    var $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute = function(_v0) {
        var val = _v0.a;
        return val;
    };
    var $elm$virtual_dom$VirtualDom$keyedNode = function(tag) {
        return _VirtualDom_keyedNode(_VirtualDom_noScript(tag));
    };
    var $elm$virtual_dom$VirtualDom$keyedNodeNS = F2(function(namespace, tag) {
        return A2(_VirtualDom_keyedNodeNS, namespace, _VirtualDom_noScript(tag));
    });
    var $elm$virtual_dom$VirtualDom$node = function(tag) {
        return _VirtualDom_node(_VirtualDom_noScript(tag));
    };
    var $elm$virtual_dom$VirtualDom$nodeNS = function(tag) {
        return _VirtualDom_nodeNS(_VirtualDom_noScript(tag));
    };
    var $rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml = F2(function(_v6, _v7) {
        var key = _v6.a;
        var html = _v6.b;
        var pairs = _v7.a;
        var styles = _v7.b;
        switch(html.$){
            case 'Unstyled':
                var vdom = html.a;
                return _Utils_Tuple2(A2($elm$core$List$cons, _Utils_Tuple2(key, vdom), pairs), styles);
            case 'Node':
                var elemType = html.a;
                var properties = html.b;
                var children = html.c;
                var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
                var _v9 = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml, _Utils_Tuple2(_List_Nil, combinedStyles), children);
                var childNodes = _v9.a;
                var finalStyles = _v9.b;
                var vdom = A3($elm$virtual_dom$VirtualDom$node, elemType, A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties), $elm$core$List$reverse(childNodes));
                return _Utils_Tuple2(A2($elm$core$List$cons, _Utils_Tuple2(key, vdom), pairs), finalStyles);
            case 'NodeNS':
                var ns = html.a;
                var elemType = html.b;
                var properties = html.c;
                var children = html.d;
                var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
                var _v10 = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml, _Utils_Tuple2(_List_Nil, combinedStyles), children);
                var childNodes = _v10.a;
                var finalStyles = _v10.b;
                var vdom = A4($elm$virtual_dom$VirtualDom$nodeNS, ns, elemType, A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties), $elm$core$List$reverse(childNodes));
                return _Utils_Tuple2(A2($elm$core$List$cons, _Utils_Tuple2(key, vdom), pairs), finalStyles);
            case 'KeyedNode':
                var elemType = html.a;
                var properties = html.b;
                var children = html.c;
                var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
                var _v11 = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml, _Utils_Tuple2(_List_Nil, combinedStyles), children);
                var childNodes = _v11.a;
                var finalStyles = _v11.b;
                var vdom = A3($elm$virtual_dom$VirtualDom$keyedNode, elemType, A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties), $elm$core$List$reverse(childNodes));
                return _Utils_Tuple2(A2($elm$core$List$cons, _Utils_Tuple2(key, vdom), pairs), finalStyles);
            default:
                var ns = html.a;
                var elemType = html.b;
                var properties = html.c;
                var children = html.d;
                var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
                var _v12 = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml, _Utils_Tuple2(_List_Nil, combinedStyles), children);
                var childNodes = _v12.a;
                var finalStyles = _v12.b;
                var vdom = A4($elm$virtual_dom$VirtualDom$keyedNodeNS, ns, elemType, A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties), $elm$core$List$reverse(childNodes));
                return _Utils_Tuple2(A2($elm$core$List$cons, _Utils_Tuple2(key, vdom), pairs), finalStyles);
        }
    });
    var $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml = F2(function(html, _v0) {
        var nodes = _v0.a;
        var styles = _v0.b;
        switch(html.$){
            case 'Unstyled':
                var vdomNode = html.a;
                return _Utils_Tuple2(A2($elm$core$List$cons, vdomNode, nodes), styles);
            case 'Node':
                var elemType = html.a;
                var properties = html.b;
                var children = html.c;
                var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
                var _v2 = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml, _Utils_Tuple2(_List_Nil, combinedStyles), children);
                var childNodes = _v2.a;
                var finalStyles = _v2.b;
                var vdomNode = A3($elm$virtual_dom$VirtualDom$node, elemType, A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties), $elm$core$List$reverse(childNodes));
                return _Utils_Tuple2(A2($elm$core$List$cons, vdomNode, nodes), finalStyles);
            case 'NodeNS':
                var ns = html.a;
                var elemType = html.b;
                var properties = html.c;
                var children = html.d;
                var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
                var _v3 = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml, _Utils_Tuple2(_List_Nil, combinedStyles), children);
                var childNodes = _v3.a;
                var finalStyles = _v3.b;
                var vdomNode = A4($elm$virtual_dom$VirtualDom$nodeNS, ns, elemType, A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties), $elm$core$List$reverse(childNodes));
                return _Utils_Tuple2(A2($elm$core$List$cons, vdomNode, nodes), finalStyles);
            case 'KeyedNode':
                var elemType = html.a;
                var properties = html.b;
                var children = html.c;
                var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
                var _v4 = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml, _Utils_Tuple2(_List_Nil, combinedStyles), children);
                var childNodes = _v4.a;
                var finalStyles = _v4.b;
                var vdomNode = A3($elm$virtual_dom$VirtualDom$keyedNode, elemType, A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties), $elm$core$List$reverse(childNodes));
                return _Utils_Tuple2(A2($elm$core$List$cons, vdomNode, nodes), finalStyles);
            default:
                var ns = html.a;
                var elemType = html.b;
                var properties = html.c;
                var children = html.d;
                var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
                var _v5 = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml, _Utils_Tuple2(_List_Nil, combinedStyles), children);
                var childNodes = _v5.a;
                var finalStyles = _v5.b;
                var vdomNode = A4($elm$virtual_dom$VirtualDom$keyedNodeNS, ns, elemType, A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties), $elm$core$List$reverse(childNodes));
                return _Utils_Tuple2(A2($elm$core$List$cons, vdomNode, nodes), finalStyles);
        }
    });
    var $elm$core$Dict$singleton = F2(function(key, value) {
        return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
    });
    var $rtfeldman$elm_css$VirtualDom$Styled$stylesFromPropertiesHelp = F2(function(candidate, properties) {
        stylesFromPropertiesHelp: while(true){
            if (!properties.b) return candidate;
            else {
                var _v1 = properties.a;
                var styles = _v1.b;
                var classname = _v1.c;
                var rest = properties.b;
                if ($elm$core$String$isEmpty(classname)) {
                    var $temp$candidate = candidate, $temp$properties = rest;
                    candidate = $temp$candidate;
                    properties = $temp$properties;
                    continue stylesFromPropertiesHelp;
                } else {
                    var $temp$candidate = $elm$core$Maybe$Just(_Utils_Tuple2(classname, styles)), $temp$properties = rest;
                    candidate = $temp$candidate;
                    properties = $temp$properties;
                    continue stylesFromPropertiesHelp;
                }
            }
        }
    });
    var $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties = function(properties) {
        var _v0 = A2($rtfeldman$elm_css$VirtualDom$Styled$stylesFromPropertiesHelp, $elm$core$Maybe$Nothing, properties);
        if (_v0.$ === 'Nothing') return $elm$core$Dict$empty;
        else {
            var _v1 = _v0.a;
            var classname = _v1.a;
            var styles = _v1.b;
            return A2($elm$core$Dict$singleton, classname, styles);
        }
    };
    var $elm$core$List$singleton = function(value) {
        return _List_fromArray([
            value
        ]);
    };
    var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
    var $elm$core$List$any = F2(function(isOkay, list) {
        any: while(true){
            if (!list.b) return false;
            else {
                var x = list.a;
                var xs = list.b;
                if (isOkay(x)) return true;
                else {
                    var $temp$isOkay = isOkay, $temp$list = xs;
                    isOkay = $temp$isOkay;
                    list = $temp$list;
                    continue any;
                }
            }
        }
    });
    var $elm$core$List$all = F2(function(isOkay, list) {
        return !A2($elm$core$List$any, A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay), list);
    });
    var $rtfeldman$elm_css$Css$Structure$compactHelp = F2(function(declaration, _v0) {
        var keyframesByName = _v0.a;
        var declarations = _v0.b;
        switch(declaration.$){
            case 'StyleBlockDeclaration':
                var _v2 = declaration.a;
                var properties = _v2.c;
                return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(keyframesByName, A2($elm$core$List$cons, declaration, declarations));
            case 'MediaRule':
                var styleBlocks = declaration.b;
                return A2($elm$core$List$all, function(_v3) {
                    var properties = _v3.c;
                    return $elm$core$List$isEmpty(properties);
                }, styleBlocks) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(keyframesByName, A2($elm$core$List$cons, declaration, declarations));
            case 'SupportsRule':
                var otherDeclarations = declaration.b;
                return $elm$core$List$isEmpty(otherDeclarations) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(keyframesByName, A2($elm$core$List$cons, declaration, declarations));
            case 'DocumentRule':
                return _Utils_Tuple2(keyframesByName, A2($elm$core$List$cons, declaration, declarations));
            case 'PageRule':
                var properties = declaration.b;
                return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(keyframesByName, A2($elm$core$List$cons, declaration, declarations));
            case 'FontFace':
                var properties = declaration.a;
                return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(keyframesByName, A2($elm$core$List$cons, declaration, declarations));
            case 'Keyframes':
                var record = declaration.a;
                return $elm$core$String$isEmpty(record.declaration) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(A3($elm$core$Dict$insert, record.name, record.declaration, keyframesByName), declarations);
            case 'Viewport':
                var properties = declaration.a;
                return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(keyframesByName, A2($elm$core$List$cons, declaration, declarations));
            case 'CounterStyle':
                var properties = declaration.a;
                return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(keyframesByName, A2($elm$core$List$cons, declaration, declarations));
            default:
                var tuples = declaration.a;
                return A2($elm$core$List$all, function(_v4) {
                    var properties = _v4.b;
                    return $elm$core$List$isEmpty(properties);
                }, tuples) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(keyframesByName, A2($elm$core$List$cons, declaration, declarations));
        }
    });
    var $rtfeldman$elm_css$Css$Structure$Keyframes = function(a) {
        return {
            $: 'Keyframes',
            a: a
        };
    };
    var $elm$core$List$append = F2(function(xs, ys) {
        if (!ys.b) return xs;
        else return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
    });
    var $rtfeldman$elm_css$Css$Structure$withKeyframeDeclarations = F2(function(keyframesByName, compactedDeclarations) {
        return A2($elm$core$List$append, A2($elm$core$List$map, function(_v0) {
            var name = _v0.a;
            var decl = _v0.b;
            return $rtfeldman$elm_css$Css$Structure$Keyframes({
                declaration: decl,
                name: name
            });
        }, $elm$core$Dict$toList(keyframesByName)), compactedDeclarations);
    });
    var $rtfeldman$elm_css$Css$Structure$compactStylesheet = function(_v0) {
        var charset = _v0.charset;
        var imports = _v0.imports;
        var namespaces = _v0.namespaces;
        var declarations = _v0.declarations;
        var _v1 = A3($elm$core$List$foldr, $rtfeldman$elm_css$Css$Structure$compactHelp, _Utils_Tuple2($elm$core$Dict$empty, _List_Nil), declarations);
        var keyframesByName = _v1.a;
        var compactedDeclarations = _v1.b;
        var finalDeclarations = A2($rtfeldman$elm_css$Css$Structure$withKeyframeDeclarations, keyframesByName, compactedDeclarations);
        return {
            charset: charset,
            declarations: finalDeclarations,
            imports: imports,
            namespaces: namespaces
        };
    };
    var $rtfeldman$elm_css$Css$Structure$Output$charsetToString = function(charset) {
        return A2($elm$core$Maybe$withDefault, '', A2($elm$core$Maybe$map, function(str) {
            return '@charset \"' + (str + '\"');
        }, charset));
    };
    var $rtfeldman$elm_css$Css$Structure$Output$mediaExpressionToString = function(expression) {
        return '(' + (expression.feature + (A2($elm$core$Maybe$withDefault, '', A2($elm$core$Maybe$map, $elm$core$Basics$append(': '), expression.value)) + ')'));
    };
    var $rtfeldman$elm_css$Css$Structure$Output$mediaTypeToString = function(mediaType) {
        switch(mediaType.$){
            case 'Print':
                return 'print';
            case 'Screen':
                return 'screen';
            default:
                return 'speech';
        }
    };
    var $rtfeldman$elm_css$Css$Structure$Output$mediaQueryToString = function(mediaQuery) {
        var prefixWith = F3(function(str, mediaType, expressions) {
            return str + (' ' + A2($elm$core$String$join, ' and ', A2($elm$core$List$cons, $rtfeldman$elm_css$Css$Structure$Output$mediaTypeToString(mediaType), A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$mediaExpressionToString, expressions))));
        });
        switch(mediaQuery.$){
            case 'AllQuery':
                var expressions = mediaQuery.a;
                return A2($elm$core$String$join, ' and ', A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$mediaExpressionToString, expressions));
            case 'OnlyQuery':
                var mediaType = mediaQuery.a;
                var expressions = mediaQuery.b;
                return A3(prefixWith, 'only', mediaType, expressions);
            case 'NotQuery':
                var mediaType = mediaQuery.a;
                var expressions = mediaQuery.b;
                return A3(prefixWith, 'not', mediaType, expressions);
            default:
                var str = mediaQuery.a;
                return str;
        }
    };
    var $rtfeldman$elm_css$Css$Structure$Output$importMediaQueryToString = F2(function(name, mediaQuery) {
        return '@import \"' + (name + ($rtfeldman$elm_css$Css$Structure$Output$mediaQueryToString(mediaQuery) + '\"'));
    });
    var $rtfeldman$elm_css$Css$Structure$Output$importToString = function(_v0) {
        var name = _v0.a;
        var mediaQueries = _v0.b;
        return A2($elm$core$String$join, '\n', A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$importMediaQueryToString(name), mediaQueries));
    };
    var $rtfeldman$elm_css$Css$Structure$Output$namespaceToString = function(_v0) {
        var prefix = _v0.a;
        var str = _v0.b;
        return '@namespace ' + (prefix + ('\"' + (str + '\"')));
    };
    var $rtfeldman$elm_css$Css$Structure$Output$spaceIndent = '    ';
    var $rtfeldman$elm_css$Css$Structure$Output$indent = function(str) {
        return _Utils_ap($rtfeldman$elm_css$Css$Structure$Output$spaceIndent, str);
    };
    var $rtfeldman$elm_css$Css$Structure$Output$noIndent = '';
    var $rtfeldman$elm_css$Css$Structure$Output$emitProperty = function(str) {
        return str + ';';
    };
    var $rtfeldman$elm_css$Css$Structure$Output$emitProperties = function(properties) {
        return A2($elm$core$String$join, '\n', A2($elm$core$List$map, A2($elm$core$Basics$composeL, $rtfeldman$elm_css$Css$Structure$Output$indent, $rtfeldman$elm_css$Css$Structure$Output$emitProperty), properties));
    };
    var $elm$core$String$append = _String_append;
    var $rtfeldman$elm_css$Css$Structure$Output$pseudoElementToString = function(_v0) {
        var str = _v0.a;
        return '::' + str;
    };
    var $rtfeldman$elm_css$Css$Structure$Output$combinatorToString = function(combinator) {
        switch(combinator.$){
            case 'AdjacentSibling':
                return '+';
            case 'GeneralSibling':
                return '~';
            case 'Child':
                return '>';
            default:
                return '';
        }
    };
    var $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString = function(repeatableSimpleSelector) {
        switch(repeatableSimpleSelector.$){
            case 'ClassSelector':
                var str = repeatableSimpleSelector.a;
                return '.' + str;
            case 'IdSelector':
                var str = repeatableSimpleSelector.a;
                return '#' + str;
            case 'PseudoClassSelector':
                var str = repeatableSimpleSelector.a;
                return ':' + str;
            default:
                var str = repeatableSimpleSelector.a;
                return '[' + (str + ']');
        }
    };
    var $rtfeldman$elm_css$Css$Structure$Output$simpleSelectorSequenceToString = function(simpleSelectorSequence) {
        switch(simpleSelectorSequence.$){
            case 'TypeSelectorSequence':
                var str = simpleSelectorSequence.a.a;
                var repeatableSimpleSelectors = simpleSelectorSequence.b;
                return A2($elm$core$String$join, '', A2($elm$core$List$cons, str, A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString, repeatableSimpleSelectors)));
            case 'UniversalSelectorSequence':
                var repeatableSimpleSelectors = simpleSelectorSequence.a;
                return $elm$core$List$isEmpty(repeatableSimpleSelectors) ? '*' : A2($elm$core$String$join, '', A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString, repeatableSimpleSelectors));
            default:
                var str = simpleSelectorSequence.a;
                var repeatableSimpleSelectors = simpleSelectorSequence.b;
                return A2($elm$core$String$join, '', A2($elm$core$List$cons, str, A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString, repeatableSimpleSelectors)));
        }
    };
    var $rtfeldman$elm_css$Css$Structure$Output$selectorChainToString = function(_v0) {
        var combinator = _v0.a;
        var sequence = _v0.b;
        return A2($elm$core$String$join, ' ', _List_fromArray([
            $rtfeldman$elm_css$Css$Structure$Output$combinatorToString(combinator),
            $rtfeldman$elm_css$Css$Structure$Output$simpleSelectorSequenceToString(sequence)
        ]));
    };
    var $rtfeldman$elm_css$Css$Structure$Output$selectorToString = function(_v0) {
        var simpleSelectorSequence = _v0.a;
        var chain = _v0.b;
        var pseudoElement = _v0.c;
        var segments = A2($elm$core$List$cons, $rtfeldman$elm_css$Css$Structure$Output$simpleSelectorSequenceToString(simpleSelectorSequence), A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$selectorChainToString, chain));
        var pseudoElementsString = A2($elm$core$String$join, '', _List_fromArray([
            A2($elm$core$Maybe$withDefault, '', A2($elm$core$Maybe$map, $rtfeldman$elm_css$Css$Structure$Output$pseudoElementToString, pseudoElement))
        ]));
        return A2($elm$core$String$append, A2($elm$core$String$join, ' ', A2($elm$core$List$filter, A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty), segments)), pseudoElementsString);
    };
    var $rtfeldman$elm_css$Css$Structure$Output$prettyPrintStyleBlock = F2(function(indentLevel, _v0) {
        var firstSelector = _v0.a;
        var otherSelectors = _v0.b;
        var properties = _v0.c;
        var selectorStr = A2($elm$core$String$join, ', ', A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$selectorToString, A2($elm$core$List$cons, firstSelector, otherSelectors)));
        return A2($elm$core$String$join, '', _List_fromArray([
            selectorStr,
            ' {\n',
            indentLevel,
            $rtfeldman$elm_css$Css$Structure$Output$emitProperties(properties),
            '\n',
            indentLevel,
            '}'
        ]));
    });
    var $rtfeldman$elm_css$Css$Structure$Output$prettyPrintDeclaration = function(decl) {
        switch(decl.$){
            case 'StyleBlockDeclaration':
                var styleBlock = decl.a;
                return A2($rtfeldman$elm_css$Css$Structure$Output$prettyPrintStyleBlock, $rtfeldman$elm_css$Css$Structure$Output$noIndent, styleBlock);
            case 'MediaRule':
                var mediaQueries = decl.a;
                var styleBlocks = decl.b;
                var query = A2($elm$core$String$join, ',\n', A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$mediaQueryToString, mediaQueries));
                var blocks = A2($elm$core$String$join, '\n\n', A2($elm$core$List$map, A2($elm$core$Basics$composeL, $rtfeldman$elm_css$Css$Structure$Output$indent, $rtfeldman$elm_css$Css$Structure$Output$prettyPrintStyleBlock($rtfeldman$elm_css$Css$Structure$Output$spaceIndent)), styleBlocks));
                return '@media ' + (query + (' {\n' + (blocks + '\n}')));
            case 'SupportsRule':
                return 'TODO';
            case 'DocumentRule':
                return 'TODO';
            case 'PageRule':
                return 'TODO';
            case 'FontFace':
                return 'TODO';
            case 'Keyframes':
                var name = decl.a.name;
                var declaration = decl.a.declaration;
                return '@keyframes ' + (name + (' {\n' + (declaration + '\n}')));
            case 'Viewport':
                return 'TODO';
            case 'CounterStyle':
                return 'TODO';
            default:
                return 'TODO';
        }
    };
    var $rtfeldman$elm_css$Css$Structure$Output$prettyPrint = function(_v0) {
        var charset = _v0.charset;
        var imports = _v0.imports;
        var namespaces = _v0.namespaces;
        var declarations = _v0.declarations;
        return A2($elm$core$String$join, '\n\n', A2($elm$core$List$filter, A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty), _List_fromArray([
            $rtfeldman$elm_css$Css$Structure$Output$charsetToString(charset),
            A2($elm$core$String$join, '\n', A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$importToString, imports)),
            A2($elm$core$String$join, '\n', A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$namespaceToString, namespaces)),
            A2($elm$core$String$join, '\n\n', A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$prettyPrintDeclaration, declarations))
        ])));
    };
    var $elm$core$List$concat = function(lists) {
        return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
    };
    var $elm$core$List$concatMap = F2(function(f, list) {
        return $elm$core$List$concat(A2($elm$core$List$map, f, list));
    });
    var $rtfeldman$elm_css$Css$Structure$CounterStyle = function(a) {
        return {
            $: 'CounterStyle',
            a: a
        };
    };
    var $rtfeldman$elm_css$Css$Structure$FontFace = function(a) {
        return {
            $: 'FontFace',
            a: a
        };
    };
    var $rtfeldman$elm_css$Css$Structure$PageRule = F2(function(a, b) {
        return {
            $: 'PageRule',
            a: a,
            b: b
        };
    });
    var $rtfeldman$elm_css$Css$Structure$Selector = F3(function(a, b, c) {
        return {
            $: 'Selector',
            a: a,
            b: b,
            c: c
        };
    });
    var $rtfeldman$elm_css$Css$Structure$StyleBlock = F3(function(a, b, c) {
        return {
            $: 'StyleBlock',
            a: a,
            b: b,
            c: c
        };
    });
    var $rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration = function(a) {
        return {
            $: 'StyleBlockDeclaration',
            a: a
        };
    };
    var $rtfeldman$elm_css$Css$Structure$SupportsRule = F2(function(a, b) {
        return {
            $: 'SupportsRule',
            a: a,
            b: b
        };
    });
    var $rtfeldman$elm_css$Css$Structure$Viewport = function(a) {
        return {
            $: 'Viewport',
            a: a
        };
    };
    var $rtfeldman$elm_css$Css$Structure$MediaRule = F2(function(a, b) {
        return {
            $: 'MediaRule',
            a: a,
            b: b
        };
    });
    var $rtfeldman$elm_css$Css$Structure$mapLast = F2(function(update, list) {
        if (!list.b) return list;
        else if (!list.b.b) {
            var only = list.a;
            return _List_fromArray([
                update(only)
            ]);
        } else {
            var first = list.a;
            var rest = list.b;
            return A2($elm$core$List$cons, first, A2($rtfeldman$elm_css$Css$Structure$mapLast, update, rest));
        }
    });
    var $rtfeldman$elm_css$Css$Structure$withPropertyAppended = F2(function(property, _v0) {
        var firstSelector = _v0.a;
        var otherSelectors = _v0.b;
        var properties = _v0.c;
        return A3($rtfeldman$elm_css$Css$Structure$StyleBlock, firstSelector, otherSelectors, _Utils_ap(properties, _List_fromArray([
            property
        ])));
    });
    var $rtfeldman$elm_css$Css$Structure$appendProperty = F2(function(property, declarations) {
        if (!declarations.b) return declarations;
        else if (!declarations.b.b) switch(declarations.a.$){
            case 'StyleBlockDeclaration':
                var styleBlock = declarations.a.a;
                return _List_fromArray([
                    $rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(A2($rtfeldman$elm_css$Css$Structure$withPropertyAppended, property, styleBlock))
                ]);
            case 'MediaRule':
                var _v1 = declarations.a;
                var mediaQueries = _v1.a;
                var styleBlocks = _v1.b;
                return _List_fromArray([
                    A2($rtfeldman$elm_css$Css$Structure$MediaRule, mediaQueries, A2($rtfeldman$elm_css$Css$Structure$mapLast, $rtfeldman$elm_css$Css$Structure$withPropertyAppended(property), styleBlocks))
                ]);
            default:
                return declarations;
        }
        else {
            var first = declarations.a;
            var rest = declarations.b;
            return A2($elm$core$List$cons, first, A2($rtfeldman$elm_css$Css$Structure$appendProperty, property, rest));
        }
    });
    var $rtfeldman$elm_css$Css$Structure$appendToLastSelector = F2(function(f, styleBlock) {
        if (!styleBlock.b.b) {
            var only = styleBlock.a;
            var properties = styleBlock.c;
            return _List_fromArray([
                A3($rtfeldman$elm_css$Css$Structure$StyleBlock, only, _List_Nil, properties),
                A3($rtfeldman$elm_css$Css$Structure$StyleBlock, f(only), _List_Nil, _List_Nil)
            ]);
        } else {
            var first = styleBlock.a;
            var rest = styleBlock.b;
            var properties = styleBlock.c;
            var newRest = A2($elm$core$List$map, f, rest);
            var newFirst = f(first);
            return _List_fromArray([
                A3($rtfeldman$elm_css$Css$Structure$StyleBlock, first, rest, properties),
                A3($rtfeldman$elm_css$Css$Structure$StyleBlock, newFirst, newRest, _List_Nil)
            ]);
        }
    });
    var $rtfeldman$elm_css$Css$Structure$applyPseudoElement = F2(function(pseudo, _v0) {
        var sequence = _v0.a;
        var selectors = _v0.b;
        return A3($rtfeldman$elm_css$Css$Structure$Selector, sequence, selectors, $elm$core$Maybe$Just(pseudo));
    });
    var $rtfeldman$elm_css$Css$Structure$appendPseudoElementToLastSelector = F2(function(pseudo, styleBlock) {
        return A2($rtfeldman$elm_css$Css$Structure$appendToLastSelector, $rtfeldman$elm_css$Css$Structure$applyPseudoElement(pseudo), styleBlock);
    });
    var $rtfeldman$elm_css$Css$Structure$CustomSelector = F2(function(a, b) {
        return {
            $: 'CustomSelector',
            a: a,
            b: b
        };
    });
    var $rtfeldman$elm_css$Css$Structure$TypeSelectorSequence = F2(function(a, b) {
        return {
            $: 'TypeSelectorSequence',
            a: a,
            b: b
        };
    });
    var $rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence = function(a) {
        return {
            $: 'UniversalSelectorSequence',
            a: a
        };
    };
    var $rtfeldman$elm_css$Css$Structure$appendRepeatable = F2(function(selector, sequence) {
        switch(sequence.$){
            case 'TypeSelectorSequence':
                var typeSelector = sequence.a;
                var list = sequence.b;
                return A2($rtfeldman$elm_css$Css$Structure$TypeSelectorSequence, typeSelector, _Utils_ap(list, _List_fromArray([
                    selector
                ])));
            case 'UniversalSelectorSequence':
                var list = sequence.a;
                return $rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence(_Utils_ap(list, _List_fromArray([
                    selector
                ])));
            default:
                var str = sequence.a;
                var list = sequence.b;
                return A2($rtfeldman$elm_css$Css$Structure$CustomSelector, str, _Utils_ap(list, _List_fromArray([
                    selector
                ])));
        }
    });
    var $rtfeldman$elm_css$Css$Structure$appendRepeatableWithCombinator = F2(function(selector, list) {
        if (!list.b) return _List_Nil;
        else if (!list.b.b) {
            var _v1 = list.a;
            var combinator = _v1.a;
            var sequence = _v1.b;
            return _List_fromArray([
                _Utils_Tuple2(combinator, A2($rtfeldman$elm_css$Css$Structure$appendRepeatable, selector, sequence))
            ]);
        } else {
            var first = list.a;
            var rest = list.b;
            return A2($elm$core$List$cons, first, A2($rtfeldman$elm_css$Css$Structure$appendRepeatableWithCombinator, selector, rest));
        }
    });
    var $rtfeldman$elm_css$Css$Structure$appendRepeatableSelector = F2(function(repeatableSimpleSelector, selector) {
        if (!selector.b.b) {
            var sequence = selector.a;
            var pseudoElement = selector.c;
            return A3($rtfeldman$elm_css$Css$Structure$Selector, A2($rtfeldman$elm_css$Css$Structure$appendRepeatable, repeatableSimpleSelector, sequence), _List_Nil, pseudoElement);
        } else {
            var firstSelector = selector.a;
            var tuples = selector.b;
            var pseudoElement = selector.c;
            return A3($rtfeldman$elm_css$Css$Structure$Selector, firstSelector, A2($rtfeldman$elm_css$Css$Structure$appendRepeatableWithCombinator, repeatableSimpleSelector, tuples), pseudoElement);
        }
    });
    var $rtfeldman$elm_css$Css$Structure$appendRepeatableToLastSelector = F2(function(selector, styleBlock) {
        return A2($rtfeldman$elm_css$Css$Structure$appendToLastSelector, $rtfeldman$elm_css$Css$Structure$appendRepeatableSelector(selector), styleBlock);
    });
    var $rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors = function(declarations) {
        collectSelectors: while(true){
            if (!declarations.b) return _List_Nil;
            else if (declarations.a.$ === 'StyleBlockDeclaration') {
                var _v1 = declarations.a.a;
                var firstSelector = _v1.a;
                var otherSelectors = _v1.b;
                var rest = declarations.b;
                return _Utils_ap(A2($elm$core$List$cons, firstSelector, otherSelectors), $rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors(rest));
            } else {
                var rest = declarations.b;
                var $temp$declarations = rest;
                declarations = $temp$declarations;
                continue collectSelectors;
            }
        }
    };
    var $rtfeldman$elm_css$Css$Structure$DocumentRule = F5(function(a, b, c, d, e) {
        return {
            $: 'DocumentRule',
            a: a,
            b: b,
            c: c,
            d: d,
            e: e
        };
    });
    var $rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock = F2(function(update, declarations) {
        _v0$12: while(true){
            if (!declarations.b) return declarations;
            else {
                if (!declarations.b.b) switch(declarations.a.$){
                    case 'StyleBlockDeclaration':
                        var styleBlock = declarations.a.a;
                        return A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration, update(styleBlock));
                    case 'MediaRule':
                        if (declarations.a.b.b) {
                            if (!declarations.a.b.b.b) {
                                var _v1 = declarations.a;
                                var mediaQueries = _v1.a;
                                var _v2 = _v1.b;
                                var styleBlock = _v2.a;
                                return _List_fromArray([
                                    A2($rtfeldman$elm_css$Css$Structure$MediaRule, mediaQueries, update(styleBlock))
                                ]);
                            } else {
                                var _v3 = declarations.a;
                                var mediaQueries = _v3.a;
                                var _v4 = _v3.b;
                                var first = _v4.a;
                                var rest = _v4.b;
                                var _v5 = A2($rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock, update, _List_fromArray([
                                    A2($rtfeldman$elm_css$Css$Structure$MediaRule, mediaQueries, rest)
                                ]));
                                if (_v5.b && _v5.a.$ === 'MediaRule' && !_v5.b.b) {
                                    var _v6 = _v5.a;
                                    var newMediaQueries = _v6.a;
                                    var newStyleBlocks = _v6.b;
                                    return _List_fromArray([
                                        A2($rtfeldman$elm_css$Css$Structure$MediaRule, newMediaQueries, A2($elm$core$List$cons, first, newStyleBlocks))
                                    ]);
                                } else {
                                    var newDeclarations = _v5;
                                    return newDeclarations;
                                }
                            }
                        } else break _v0$12;
                    case 'SupportsRule':
                        var _v7 = declarations.a;
                        var str = _v7.a;
                        var nestedDeclarations = _v7.b;
                        return _List_fromArray([
                            A2($rtfeldman$elm_css$Css$Structure$SupportsRule, str, A2($rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock, update, nestedDeclarations))
                        ]);
                    case 'DocumentRule':
                        var _v8 = declarations.a;
                        var str1 = _v8.a;
                        var str2 = _v8.b;
                        var str3 = _v8.c;
                        var str4 = _v8.d;
                        var styleBlock = _v8.e;
                        return A2($elm$core$List$map, A4($rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4), update(styleBlock));
                    case 'PageRule':
                        var _v9 = declarations.a;
                        return declarations;
                    case 'FontFace':
                        return declarations;
                    case 'Keyframes':
                        return declarations;
                    case 'Viewport':
                        return declarations;
                    case 'CounterStyle':
                        return declarations;
                    default:
                        return declarations;
                }
                else break _v0$12;
            }
        }
        var first = declarations.a;
        var rest = declarations.b;
        return A2($elm$core$List$cons, first, A2($rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock, update, rest));
    });
    var $elm$core$String$cons = _String_cons;
    var $rtfeldman$elm_css$ElmCssVendor$Murmur3$HashData = F4(function(shift, seed, hash, charsProcessed) {
        return {
            charsProcessed: charsProcessed,
            hash: hash,
            seed: seed,
            shift: shift
        };
    });
    var $rtfeldman$elm_css$ElmCssVendor$Murmur3$c1 = 3432918353;
    var $rtfeldman$elm_css$ElmCssVendor$Murmur3$c2 = 461845907;
    var $elm$core$Bitwise$and = _Bitwise_and;
    var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
    var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
    var $rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy = F2(function(b, a) {
        return (a & 65535) * b + (((a >>> 16) * b & 65535) << 16);
    });
    var $elm$core$Basics$neq = _Utils_notEqual;
    var $elm$core$Bitwise$or = _Bitwise_or;
    var $rtfeldman$elm_css$ElmCssVendor$Murmur3$rotlBy = F2(function(b, a) {
        return a << b | a >>> 32 - b;
    });
    var $elm$core$Bitwise$xor = _Bitwise_xor;
    var $rtfeldman$elm_css$ElmCssVendor$Murmur3$finalize = function(data) {
        var acc = !!data.hash ? data.seed ^ A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy, $rtfeldman$elm_css$ElmCssVendor$Murmur3$c2, A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$rotlBy, 15, A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy, $rtfeldman$elm_css$ElmCssVendor$Murmur3$c1, data.hash))) : data.seed;
        var h0 = acc ^ data.charsProcessed;
        var h1 = A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy, 2246822507, h0 ^ h0 >>> 16);
        var h2 = A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy, 3266489909, h1 ^ h1 >>> 13);
        return (h2 ^ h2 >>> 16) >>> 0;
    };
    var $elm$core$String$foldl = _String_foldl;
    var $rtfeldman$elm_css$ElmCssVendor$Murmur3$mix = F2(function(h1, k1) {
        return A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy, 5, A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$rotlBy, 13, h1 ^ A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy, $rtfeldman$elm_css$ElmCssVendor$Murmur3$c2, A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$rotlBy, 15, A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$multiplyBy, $rtfeldman$elm_css$ElmCssVendor$Murmur3$c1, k1))))) + 3864292196;
    });
    var $rtfeldman$elm_css$ElmCssVendor$Murmur3$hashFold = F2(function(c, data) {
        var res = data.hash | (255 & $elm$core$Char$toCode(c)) << data.shift;
        var _v0 = data.shift;
        if (_v0 === 24) return {
            charsProcessed: data.charsProcessed + 1,
            hash: 0,
            seed: A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$mix, data.seed, res),
            shift: 0
        };
        else return {
            charsProcessed: data.charsProcessed + 1,
            hash: res,
            seed: data.seed,
            shift: data.shift + 8
        };
    });
    var $rtfeldman$elm_css$ElmCssVendor$Murmur3$hashString = F2(function(seed, str) {
        return $rtfeldman$elm_css$ElmCssVendor$Murmur3$finalize(A3($elm$core$String$foldl, $rtfeldman$elm_css$ElmCssVendor$Murmur3$hashFold, A4($rtfeldman$elm_css$ElmCssVendor$Murmur3$HashData, 0, seed, 0, 0), str));
    });
    var $rtfeldman$elm_css$Hash$murmurSeed = 15739;
    var $elm$core$Basics$negate = function(n) {
        return -n;
    };
    var $elm$core$Basics$modBy = _Basics_modBy;
    var $rtfeldman$elm_hex$Hex$unsafeToDigit = function(num) {
        unsafeToDigit: while(true)switch(num){
            case 0:
                return _Utils_chr('0');
            case 1:
                return _Utils_chr('1');
            case 2:
                return _Utils_chr('2');
            case 3:
                return _Utils_chr('3');
            case 4:
                return _Utils_chr('4');
            case 5:
                return _Utils_chr('5');
            case 6:
                return _Utils_chr('6');
            case 7:
                return _Utils_chr('7');
            case 8:
                return _Utils_chr('8');
            case 9:
                return _Utils_chr('9');
            case 10:
                return _Utils_chr('a');
            case 11:
                return _Utils_chr('b');
            case 12:
                return _Utils_chr('c');
            case 13:
                return _Utils_chr('d');
            case 14:
                return _Utils_chr('e');
            case 15:
                return _Utils_chr('f');
            default:
                var $temp$num = num;
                num = $temp$num;
                continue unsafeToDigit;
        }
    };
    var $rtfeldman$elm_hex$Hex$unsafePositiveToDigits = F2(function(digits, num) {
        unsafePositiveToDigits: while(true){
            if (num < 16) return A2($elm$core$List$cons, $rtfeldman$elm_hex$Hex$unsafeToDigit(num), digits);
            else {
                var $temp$digits = A2($elm$core$List$cons, $rtfeldman$elm_hex$Hex$unsafeToDigit(A2($elm$core$Basics$modBy, 16, num)), digits), $temp$num = num / 16 | 0;
                digits = $temp$digits;
                num = $temp$num;
                continue unsafePositiveToDigits;
            }
        }
    });
    var $rtfeldman$elm_hex$Hex$toString = function(num) {
        return $elm$core$String$fromList(num < 0 ? A2($elm$core$List$cons, _Utils_chr('-'), A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, -num)) : A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, num));
    };
    var $rtfeldman$elm_css$Hash$fromString = function(str) {
        return A2($elm$core$String$cons, _Utils_chr('_'), $rtfeldman$elm_hex$Hex$toString(A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$hashString, $rtfeldman$elm_css$Hash$murmurSeed, str)));
    };
    var $rtfeldman$elm_css$Css$Preprocess$Resolve$last = function(list) {
        last: while(true){
            if (!list.b) return $elm$core$Maybe$Nothing;
            else if (!list.b.b) {
                var singleton = list.a;
                return $elm$core$Maybe$Just(singleton);
            } else {
                var rest = list.b;
                var $temp$list = rest;
                list = $temp$list;
                continue last;
            }
        }
    };
    var $rtfeldman$elm_css$Css$Preprocess$Resolve$lastDeclaration = function(declarations) {
        lastDeclaration: while(true){
            if (!declarations.b) return $elm$core$Maybe$Nothing;
            else if (!declarations.b.b) {
                var x = declarations.a;
                return $elm$core$Maybe$Just(_List_fromArray([
                    x
                ]));
            } else {
                var xs = declarations.b;
                var $temp$declarations = xs;
                declarations = $temp$declarations;
                continue lastDeclaration;
            }
        }
    };
    var $rtfeldman$elm_css$Css$Preprocess$Resolve$oneOf = function(maybes) {
        oneOf: while(true){
            if (!maybes.b) return $elm$core$Maybe$Nothing;
            else {
                var maybe = maybes.a;
                var rest = maybes.b;
                if (maybe.$ === 'Nothing') {
                    var $temp$maybes = rest;
                    maybes = $temp$maybes;
                    continue oneOf;
                } else return maybe;
            }
        }
    };
    var $rtfeldman$elm_css$Css$Structure$FontFeatureValues = function(a) {
        return {
            $: 'FontFeatureValues',
            a: a
        };
    };
    var $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveFontFeatureValues = function(tuples) {
        var expandTuples = function(tuplesToExpand) {
            if (!tuplesToExpand.b) return _List_Nil;
            else {
                var properties = tuplesToExpand.a;
                var rest = tuplesToExpand.b;
                return A2($elm$core$List$cons, properties, expandTuples(rest));
            }
        };
        var newTuples = expandTuples(tuples);
        return _List_fromArray([
            $rtfeldman$elm_css$Css$Structure$FontFeatureValues(newTuples)
        ]);
    };
    var $rtfeldman$elm_css$Css$Structure$styleBlockToMediaRule = F2(function(mediaQueries, declaration) {
        if (declaration.$ === 'StyleBlockDeclaration') {
            var styleBlock = declaration.a;
            return A2($rtfeldman$elm_css$Css$Structure$MediaRule, mediaQueries, _List_fromArray([
                styleBlock
            ]));
        } else return declaration;
    });
    var $elm$core$List$tail = function(list) {
        if (list.b) {
            var x = list.a;
            var xs = list.b;
            return $elm$core$Maybe$Just(xs);
        } else return $elm$core$Maybe$Nothing;
    };
    var $elm$core$List$takeReverse = F3(function(n, list, kept) {
        takeReverse: while(true){
            if (n <= 0) return kept;
            else {
                if (!list.b) return kept;
                else {
                    var x = list.a;
                    var xs = list.b;
                    var $temp$n = n - 1, $temp$list = xs, $temp$kept = A2($elm$core$List$cons, x, kept);
                    n = $temp$n;
                    list = $temp$list;
                    kept = $temp$kept;
                    continue takeReverse;
                }
            }
        }
    });
    var $elm$core$List$takeTailRec = F2(function(n, list) {
        return $elm$core$List$reverse(A3($elm$core$List$takeReverse, n, list, _List_Nil));
    });
    var $elm$core$List$takeFast = F3(function(ctr, n, list) {
        if (n <= 0) return _List_Nil;
        else {
            var _v0 = _Utils_Tuple2(n, list);
            _v0$1: while(true){
                _v0$5: while(true){
                    if (!_v0.b.b) return list;
                    else if (_v0.b.b.b) switch(_v0.a){
                        case 1:
                            break _v0$1;
                        case 2:
                            var _v2 = _v0.b;
                            var x = _v2.a;
                            var _v3 = _v2.b;
                            var y = _v3.a;
                            return _List_fromArray([
                                x,
                                y
                            ]);
                        case 3:
                            if (_v0.b.b.b.b) {
                                var _v4 = _v0.b;
                                var x = _v4.a;
                                var _v5 = _v4.b;
                                var y = _v5.a;
                                var _v6 = _v5.b;
                                var z = _v6.a;
                                return _List_fromArray([
                                    x,
                                    y,
                                    z
                                ]);
                            } else break _v0$5;
                        default:
                            if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
                                var _v7 = _v0.b;
                                var x = _v7.a;
                                var _v8 = _v7.b;
                                var y = _v8.a;
                                var _v9 = _v8.b;
                                var z = _v9.a;
                                var _v10 = _v9.b;
                                var w = _v10.a;
                                var tl = _v10.b;
                                return ctr > 1000 ? A2($elm$core$List$cons, x, A2($elm$core$List$cons, y, A2($elm$core$List$cons, z, A2($elm$core$List$cons, w, A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2($elm$core$List$cons, x, A2($elm$core$List$cons, y, A2($elm$core$List$cons, z, A2($elm$core$List$cons, w, A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
                            } else break _v0$5;
                    }
                    else {
                        if (_v0.a === 1) break _v0$1;
                        else break _v0$5;
                    }
                }
                return list;
            }
            var _v1 = _v0.b;
            var x = _v1.a;
            return _List_fromArray([
                x
            ]);
        }
    });
    var $elm$core$List$take = F2(function(n, list) {
        return A3($elm$core$List$takeFast, 0, n, list);
    });
    var $rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule = F5(function(str1, str2, str3, str4, declaration) {
        if (declaration.$ === 'StyleBlockDeclaration') {
            var structureStyleBlock = declaration.a;
            return A5($rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4, structureStyleBlock);
        } else return declaration;
    });
    var $rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule = F2(function(mediaQueries, declaration) {
        switch(declaration.$){
            case 'StyleBlockDeclaration':
                var structureStyleBlock = declaration.a;
                return A2($rtfeldman$elm_css$Css$Structure$MediaRule, mediaQueries, _List_fromArray([
                    structureStyleBlock
                ]));
            case 'MediaRule':
                var newMediaQueries = declaration.a;
                var structureStyleBlocks = declaration.b;
                return A2($rtfeldman$elm_css$Css$Structure$MediaRule, _Utils_ap(mediaQueries, newMediaQueries), structureStyleBlocks);
            case 'SupportsRule':
                var str = declaration.a;
                var declarations = declaration.b;
                return A2($rtfeldman$elm_css$Css$Structure$SupportsRule, str, A2($elm$core$List$map, $rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule(mediaQueries), declarations));
            case 'DocumentRule':
                var str1 = declaration.a;
                var str2 = declaration.b;
                var str3 = declaration.c;
                var str4 = declaration.d;
                var structureStyleBlock = declaration.e;
                return A5($rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4, structureStyleBlock);
            case 'PageRule':
                return declaration;
            case 'FontFace':
                return declaration;
            case 'Keyframes':
                return declaration;
            case 'Viewport':
                return declaration;
            case 'CounterStyle':
                return declaration;
            default:
                return declaration;
        }
    });
    var $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet = function(_v0) {
        var declarations = _v0.a;
        return declarations;
    };
    var $rtfeldman$elm_css$Css$Preprocess$Resolve$applyNestedStylesToLast = F4(function(nestedStyles, rest, f, declarations) {
        var withoutParent = function(decls) {
            return A2($elm$core$Maybe$withDefault, _List_Nil, $elm$core$List$tail(decls));
        };
        var nextResult = A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, rest, A2($elm$core$Maybe$withDefault, _List_Nil, $rtfeldman$elm_css$Css$Preprocess$Resolve$lastDeclaration(declarations)));
        var newDeclarations = function() {
            var _v14 = _Utils_Tuple2($elm$core$List$head(nextResult), $rtfeldman$elm_css$Css$Preprocess$Resolve$last(declarations));
            if (_v14.a.$ === 'Just' && _v14.b.$ === 'Just') {
                var nextResultParent = _v14.a.a;
                var originalParent = _v14.b.a;
                return _Utils_ap(A2($elm$core$List$take, $elm$core$List$length(declarations) - 1, declarations), _List_fromArray([
                    !_Utils_eq(originalParent, nextResultParent) ? nextResultParent : originalParent
                ]));
            } else return declarations;
        }();
        var insertStylesToNestedDecl = function(lastDecl) {
            return $elm$core$List$concat(A2($rtfeldman$elm_css$Css$Structure$mapLast, $rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles(nestedStyles), A2($elm$core$List$map, $elm$core$List$singleton, A2($rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock, f, lastDecl))));
        };
        var initialResult = A2($elm$core$Maybe$withDefault, _List_Nil, A2($elm$core$Maybe$map, insertStylesToNestedDecl, $rtfeldman$elm_css$Css$Preprocess$Resolve$lastDeclaration(declarations)));
        return _Utils_ap(newDeclarations, _Utils_ap(withoutParent(initialResult), withoutParent(nextResult)));
    });
    var $rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles = F2(function(styles, declarations) {
        if (!styles.b) return declarations;
        else switch(styles.a.$){
            case 'AppendProperty':
                var property = styles.a.a;
                var rest = styles.b;
                return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, rest, A2($rtfeldman$elm_css$Css$Structure$appendProperty, property, declarations));
            case 'ExtendSelector':
                var _v4 = styles.a;
                var selector = _v4.a;
                var nestedStyles = _v4.b;
                var rest = styles.b;
                return A4($rtfeldman$elm_css$Css$Preprocess$Resolve$applyNestedStylesToLast, nestedStyles, rest, $rtfeldman$elm_css$Css$Structure$appendRepeatableToLastSelector(selector), declarations);
            case 'NestSnippet':
                var _v5 = styles.a;
                var selectorCombinator = _v5.a;
                var snippets = _v5.b;
                var rest = styles.b;
                var chain = F2(function(_v9, _v10) {
                    var originalSequence = _v9.a;
                    var originalTuples = _v9.b;
                    var originalPseudoElement = _v9.c;
                    var newSequence = _v10.a;
                    var newTuples = _v10.b;
                    var newPseudoElement = _v10.c;
                    return A3($rtfeldman$elm_css$Css$Structure$Selector, originalSequence, _Utils_ap(originalTuples, A2($elm$core$List$cons, _Utils_Tuple2(selectorCombinator, newSequence), newTuples)), $rtfeldman$elm_css$Css$Preprocess$Resolve$oneOf(_List_fromArray([
                        newPseudoElement,
                        originalPseudoElement
                    ])));
                });
                var expandDeclaration = function(declaration) {
                    switch(declaration.$){
                        case 'StyleBlockDeclaration':
                            var _v7 = declaration.a;
                            var firstSelector = _v7.a;
                            var otherSelectors = _v7.b;
                            var nestedStyles = _v7.c;
                            var newSelectors = A2($elm$core$List$concatMap, function(originalSelector) {
                                return A2($elm$core$List$map, chain(originalSelector), A2($elm$core$List$cons, firstSelector, otherSelectors));
                            }, $rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors(declarations));
                            var newDeclarations = function() {
                                if (!newSelectors.b) return _List_Nil;
                                else {
                                    var first = newSelectors.a;
                                    var remainder = newSelectors.b;
                                    return _List_fromArray([
                                        $rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(A3($rtfeldman$elm_css$Css$Structure$StyleBlock, first, remainder, _List_Nil))
                                    ]);
                                }
                            }();
                            return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, nestedStyles, newDeclarations);
                        case 'MediaRule':
                            var mediaQueries = declaration.a;
                            var styleBlocks = declaration.b;
                            return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule, mediaQueries, styleBlocks);
                        case 'SupportsRule':
                            var str = declaration.a;
                            var otherSnippets = declaration.b;
                            return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule, str, otherSnippets);
                        case 'DocumentRule':
                            var str1 = declaration.a;
                            var str2 = declaration.b;
                            var str3 = declaration.c;
                            var str4 = declaration.d;
                            var styleBlock = declaration.e;
                            return A2($elm$core$List$map, A4($rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule, str1, str2, str3, str4), $rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
                        case 'PageRule':
                            var str = declaration.a;
                            var properties = declaration.b;
                            return _List_fromArray([
                                A2($rtfeldman$elm_css$Css$Structure$PageRule, str, properties)
                            ]);
                        case 'FontFace':
                            var properties = declaration.a;
                            return _List_fromArray([
                                $rtfeldman$elm_css$Css$Structure$FontFace(properties)
                            ]);
                        case 'Viewport':
                            var properties = declaration.a;
                            return _List_fromArray([
                                $rtfeldman$elm_css$Css$Structure$Viewport(properties)
                            ]);
                        case 'CounterStyle':
                            var properties = declaration.a;
                            return _List_fromArray([
                                $rtfeldman$elm_css$Css$Structure$CounterStyle(properties)
                            ]);
                        default:
                            var tuples = declaration.a;
                            return $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveFontFeatureValues(tuples);
                    }
                };
                return $elm$core$List$concat(_Utils_ap(_List_fromArray([
                    A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, rest, declarations)
                ]), A2($elm$core$List$map, expandDeclaration, A2($elm$core$List$concatMap, $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet, snippets))));
            case 'WithPseudoElement':
                var _v11 = styles.a;
                var pseudoElement = _v11.a;
                var nestedStyles = _v11.b;
                var rest = styles.b;
                return A4($rtfeldman$elm_css$Css$Preprocess$Resolve$applyNestedStylesToLast, nestedStyles, rest, $rtfeldman$elm_css$Css$Structure$appendPseudoElementToLastSelector(pseudoElement), declarations);
            case 'WithKeyframes':
                var str = styles.a.a;
                var rest = styles.b;
                var name = $rtfeldman$elm_css$Hash$fromString(str);
                var newProperty = 'animation-name:' + name;
                var newDeclarations = A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, rest, A2($rtfeldman$elm_css$Css$Structure$appendProperty, newProperty, declarations));
                return A2($elm$core$List$append, newDeclarations, _List_fromArray([
                    $rtfeldman$elm_css$Css$Structure$Keyframes({
                        declaration: str,
                        name: name
                    })
                ]));
            case 'WithMedia':
                var _v12 = styles.a;
                var mediaQueries = _v12.a;
                var nestedStyles = _v12.b;
                var rest = styles.b;
                var extraDeclarations = function() {
                    var _v13 = $rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors(declarations);
                    if (!_v13.b) return _List_Nil;
                    else {
                        var firstSelector = _v13.a;
                        var otherSelectors = _v13.b;
                        return A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$styleBlockToMediaRule(mediaQueries), A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, nestedStyles, $elm$core$List$singleton($rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(A3($rtfeldman$elm_css$Css$Structure$StyleBlock, firstSelector, otherSelectors, _List_Nil)))));
                    }
                }();
                return _Utils_ap(A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, rest, declarations), extraDeclarations);
            default:
                var otherStyles = styles.a.a;
                var rest = styles.b;
                return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, _Utils_ap(otherStyles, rest), declarations);
        }
    });
    var $rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock = function(_v2) {
        var firstSelector = _v2.a;
        var otherSelectors = _v2.b;
        var styles = _v2.c;
        return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, styles, _List_fromArray([
            $rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(A3($rtfeldman$elm_css$Css$Structure$StyleBlock, firstSelector, otherSelectors, _List_Nil))
        ]));
    };
    var $rtfeldman$elm_css$Css$Preprocess$Resolve$extract = function(snippetDeclarations) {
        if (!snippetDeclarations.b) return _List_Nil;
        else {
            var first = snippetDeclarations.a;
            var rest = snippetDeclarations.b;
            return _Utils_ap($rtfeldman$elm_css$Css$Preprocess$Resolve$toDeclarations(first), $rtfeldman$elm_css$Css$Preprocess$Resolve$extract(rest));
        }
    };
    var $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule = F2(function(mediaQueries, styleBlocks) {
        var handleStyleBlock = function(styleBlock) {
            return A2($elm$core$List$map, $rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule(mediaQueries), $rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
        };
        return A2($elm$core$List$concatMap, handleStyleBlock, styleBlocks);
    });
    var $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule = F2(function(str, snippets) {
        var declarations = $rtfeldman$elm_css$Css$Preprocess$Resolve$extract(A2($elm$core$List$concatMap, $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet, snippets));
        return _List_fromArray([
            A2($rtfeldman$elm_css$Css$Structure$SupportsRule, str, declarations)
        ]);
    });
    var $rtfeldman$elm_css$Css$Preprocess$Resolve$toDeclarations = function(snippetDeclaration) {
        switch(snippetDeclaration.$){
            case 'StyleBlockDeclaration':
                var styleBlock = snippetDeclaration.a;
                return $rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock);
            case 'MediaRule':
                var mediaQueries = snippetDeclaration.a;
                var styleBlocks = snippetDeclaration.b;
                return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule, mediaQueries, styleBlocks);
            case 'SupportsRule':
                var str = snippetDeclaration.a;
                var snippets = snippetDeclaration.b;
                return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule, str, snippets);
            case 'DocumentRule':
                var str1 = snippetDeclaration.a;
                var str2 = snippetDeclaration.b;
                var str3 = snippetDeclaration.c;
                var str4 = snippetDeclaration.d;
                var styleBlock = snippetDeclaration.e;
                return A2($elm$core$List$map, A4($rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule, str1, str2, str3, str4), $rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
            case 'PageRule':
                var str = snippetDeclaration.a;
                var properties = snippetDeclaration.b;
                return _List_fromArray([
                    A2($rtfeldman$elm_css$Css$Structure$PageRule, str, properties)
                ]);
            case 'FontFace':
                var properties = snippetDeclaration.a;
                return _List_fromArray([
                    $rtfeldman$elm_css$Css$Structure$FontFace(properties)
                ]);
            case 'Viewport':
                var properties = snippetDeclaration.a;
                return _List_fromArray([
                    $rtfeldman$elm_css$Css$Structure$Viewport(properties)
                ]);
            case 'CounterStyle':
                var properties = snippetDeclaration.a;
                return _List_fromArray([
                    $rtfeldman$elm_css$Css$Structure$CounterStyle(properties)
                ]);
            default:
                var tuples = snippetDeclaration.a;
                return $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveFontFeatureValues(tuples);
        }
    };
    var $rtfeldman$elm_css$Css$Preprocess$Resolve$toStructure = function(_v0) {
        var charset = _v0.charset;
        var imports = _v0.imports;
        var namespaces = _v0.namespaces;
        var snippets = _v0.snippets;
        var declarations = $rtfeldman$elm_css$Css$Preprocess$Resolve$extract(A2($elm$core$List$concatMap, $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet, snippets));
        return {
            charset: charset,
            declarations: declarations,
            imports: imports,
            namespaces: namespaces
        };
    };
    var $rtfeldman$elm_css$Css$Preprocess$Resolve$compileHelp = function(sheet) {
        return $rtfeldman$elm_css$Css$Structure$Output$prettyPrint($rtfeldman$elm_css$Css$Structure$compactStylesheet($rtfeldman$elm_css$Css$Preprocess$Resolve$toStructure(sheet)));
    };
    var $rtfeldman$elm_css$Css$Preprocess$Resolve$compile = function(styles) {
        return A2($elm$core$String$join, '\n\n', A2($elm$core$List$map, $rtfeldman$elm_css$Css$Preprocess$Resolve$compileHelp, styles));
    };
    var $rtfeldman$elm_css$Css$Structure$ClassSelector = function(a) {
        return {
            $: 'ClassSelector',
            a: a
        };
    };
    var $rtfeldman$elm_css$Css$Preprocess$Snippet = function(a) {
        return {
            $: 'Snippet',
            a: a
        };
    };
    var $rtfeldman$elm_css$Css$Preprocess$StyleBlock = F3(function(a, b, c) {
        return {
            $: 'StyleBlock',
            a: a,
            b: b,
            c: c
        };
    });
    var $rtfeldman$elm_css$Css$Preprocess$StyleBlockDeclaration = function(a) {
        return {
            $: 'StyleBlockDeclaration',
            a: a
        };
    };
    var $rtfeldman$elm_css$VirtualDom$Styled$makeSnippet = F2(function(styles, sequence) {
        var selector = A3($rtfeldman$elm_css$Css$Structure$Selector, sequence, _List_Nil, $elm$core$Maybe$Nothing);
        return $rtfeldman$elm_css$Css$Preprocess$Snippet(_List_fromArray([
            $rtfeldman$elm_css$Css$Preprocess$StyleBlockDeclaration(A3($rtfeldman$elm_css$Css$Preprocess$StyleBlock, selector, _List_Nil, styles))
        ]));
    });
    var $rtfeldman$elm_css$VirtualDom$Styled$snippetFromPair = function(_v0) {
        var classname = _v0.a;
        var styles = _v0.b;
        return A2($rtfeldman$elm_css$VirtualDom$Styled$makeSnippet, styles, $rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence(_List_fromArray([
            $rtfeldman$elm_css$Css$Structure$ClassSelector(classname)
        ])));
    };
    var $rtfeldman$elm_css$Css$Preprocess$stylesheet = function(snippets) {
        return {
            charset: $elm$core$Maybe$Nothing,
            imports: _List_Nil,
            namespaces: _List_Nil,
            snippets: snippets
        };
    };
    var $rtfeldman$elm_css$VirtualDom$Styled$toDeclaration = function(dict) {
        return $rtfeldman$elm_css$Css$Preprocess$Resolve$compile($elm$core$List$singleton($rtfeldman$elm_css$Css$Preprocess$stylesheet(A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$snippetFromPair, $elm$core$Dict$toList(dict)))));
    };
    var $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode = function(styles) {
        return A3($elm$virtual_dom$VirtualDom$node, 'style', _List_Nil, $elm$core$List$singleton($elm$virtual_dom$VirtualDom$text($rtfeldman$elm_css$VirtualDom$Styled$toDeclaration(styles))));
    };
    var $rtfeldman$elm_css$VirtualDom$Styled$unstyle = F3(function(elemType, properties, children) {
        var unstyledProperties = A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
        var initialStyles = $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
        var _v0 = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml, _Utils_Tuple2(_List_Nil, initialStyles), children);
        var childNodes = _v0.a;
        var styles = _v0.b;
        var styleNode = $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode(styles);
        return A3($elm$virtual_dom$VirtualDom$node, elemType, unstyledProperties, A2($elm$core$List$cons, styleNode, $elm$core$List$reverse(childNodes)));
    });
    var $rtfeldman$elm_css$VirtualDom$Styled$containsKey = F2(function(key, pairs) {
        containsKey: while(true){
            if (!pairs.b) return false;
            else {
                var _v1 = pairs.a;
                var str = _v1.a;
                var rest = pairs.b;
                if (_Utils_eq(key, str)) return true;
                else {
                    var $temp$key = key, $temp$pairs = rest;
                    key = $temp$key;
                    pairs = $temp$pairs;
                    continue containsKey;
                }
            }
        }
    });
    var $rtfeldman$elm_css$VirtualDom$Styled$getUnusedKey = F2(function(_default, pairs) {
        getUnusedKey: while(true){
            if (!pairs.b) return _default;
            else {
                var _v1 = pairs.a;
                var firstKey = _v1.a;
                var rest = pairs.b;
                var newKey = '_' + firstKey;
                if (A2($rtfeldman$elm_css$VirtualDom$Styled$containsKey, newKey, rest)) {
                    var $temp$default = newKey, $temp$pairs = rest;
                    _default = $temp$default;
                    pairs = $temp$pairs;
                    continue getUnusedKey;
                } else return newKey;
            }
        }
    });
    var $rtfeldman$elm_css$VirtualDom$Styled$toKeyedStyleNode = F2(function(allStyles, keyedChildNodes) {
        var styleNodeKey = A2($rtfeldman$elm_css$VirtualDom$Styled$getUnusedKey, '_', keyedChildNodes);
        var finalNode = $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode(allStyles);
        return _Utils_Tuple2(styleNodeKey, finalNode);
    });
    var $rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyed = F3(function(elemType, properties, keyedChildren) {
        var unstyledProperties = A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
        var initialStyles = $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
        var _v0 = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml, _Utils_Tuple2(_List_Nil, initialStyles), keyedChildren);
        var keyedChildNodes = _v0.a;
        var styles = _v0.b;
        var keyedStyleNode = A2($rtfeldman$elm_css$VirtualDom$Styled$toKeyedStyleNode, styles, keyedChildNodes);
        return A3($elm$virtual_dom$VirtualDom$keyedNode, elemType, unstyledProperties, A2($elm$core$List$cons, keyedStyleNode, $elm$core$List$reverse(keyedChildNodes)));
    });
    var $rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyedNS = F4(function(ns, elemType, properties, keyedChildren) {
        var unstyledProperties = A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
        var initialStyles = $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
        var _v0 = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml, _Utils_Tuple2(_List_Nil, initialStyles), keyedChildren);
        var keyedChildNodes = _v0.a;
        var styles = _v0.b;
        var keyedStyleNode = A2($rtfeldman$elm_css$VirtualDom$Styled$toKeyedStyleNode, styles, keyedChildNodes);
        return A4($elm$virtual_dom$VirtualDom$keyedNodeNS, ns, elemType, unstyledProperties, A2($elm$core$List$cons, keyedStyleNode, $elm$core$List$reverse(keyedChildNodes)));
    });
    var $rtfeldman$elm_css$VirtualDom$Styled$unstyleNS = F4(function(ns, elemType, properties, children) {
        var unstyledProperties = A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute, properties);
        var initialStyles = $rtfeldman$elm_css$VirtualDom$Styled$stylesFromProperties(properties);
        var _v0 = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml, _Utils_Tuple2(_List_Nil, initialStyles), children);
        var childNodes = _v0.a;
        var styles = _v0.b;
        var styleNode = $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode(styles);
        return A4($elm$virtual_dom$VirtualDom$nodeNS, ns, elemType, unstyledProperties, A2($elm$core$List$cons, styleNode, $elm$core$List$reverse(childNodes)));
    });
    var $rtfeldman$elm_css$VirtualDom$Styled$toUnstyled = function(vdom) {
        switch(vdom.$){
            case 'Unstyled':
                var plainNode = vdom.a;
                return plainNode;
            case 'Node':
                var elemType = vdom.a;
                var properties = vdom.b;
                var children = vdom.c;
                return A3($rtfeldman$elm_css$VirtualDom$Styled$unstyle, elemType, properties, children);
            case 'NodeNS':
                var ns = vdom.a;
                var elemType = vdom.b;
                var properties = vdom.c;
                var children = vdom.d;
                return A4($rtfeldman$elm_css$VirtualDom$Styled$unstyleNS, ns, elemType, properties, children);
            case 'KeyedNode':
                var elemType = vdom.a;
                var properties = vdom.b;
                var children = vdom.c;
                return A3($rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyed, elemType, properties, children);
            default:
                var ns = vdom.a;
                var elemType = vdom.b;
                var properties = vdom.c;
                var children = vdom.d;
                return A4($rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyedNS, ns, elemType, properties, children);
        }
    };
    var $rtfeldman$elm_css$Html$Styled$toUnstyled = $rtfeldman$elm_css$VirtualDom$Styled$toUnstyled;
    var $author$project$Component$ProductEditor$InputImageList = function(a) {
        return {
            $: 'InputImageList',
            a: a
        };
    };
    var $author$project$Page$Exhibition$MsgByProductEditor = function(a) {
        return {
            $: 'MsgByProductEditor',
            a: a
        };
    };
    var $author$project$Page$Product$MsgByProductEditor = function(a) {
        return {
            $: 'MsgByProductEditor',
            a: a
        };
    };
    var $author$project$Page$User$MsgChangeProfileResponse = function(a) {
        return {
            $: 'MsgChangeProfileResponse',
            a: a
        };
    };
    var $author$project$Data$LogInState$Ok = function(a) {
        return {
            $: 'Ok',
            a: a
        };
    };
    var $author$project$Data$LogInState$addUserWithNameAndLikedProductIds = F2(function(_v0, logInState) {
        var userWithName = _v0.a;
        var likedProductIds = _v0.b;
        switch(logInState.$){
            case 'None':
                return $author$project$Data$LogInState$None;
            case 'LoadingProfile':
                var token = logInState.a;
                return $author$project$Data$LogInState$Ok({
                    likedProductIds: likedProductIds,
                    token: token,
                    userWithName: userWithName
                });
            default:
                var rec = logInState.a;
                return $author$project$Data$LogInState$Ok(_Utils_update(rec, {
                    likedProductIds: likedProductIds,
                    userWithName: userWithName
                }));
        }
    });
    var $elm$browser$Browser$Navigation$back = F2(function(key, n) {
        return A2(_Browser_go, key, -n);
    });
    var $author$project$Data$Product$fromFirestore = function(rec) {
        var _v0 = _Utils_Tuple3($author$project$Data$Category$fromIdString(rec.category), $author$project$Data$Product$statusFromIdString(rec.status), _Utils_Tuple2($author$project$Data$Product$conditionFromIdString(rec.condition), rec.imageIds));
        if (_v0.a.$ === 'Just' && _v0.b.$ === 'Just' && _v0.c.a.$ === 'Just' && _v0.c.b.b) {
            var category = _v0.a.a;
            var status = _v0.b.a;
            var _v1 = _v0.c;
            var condition = _v1.a.a;
            var _v2 = _v1.b;
            var imageIdFirst = _v2.a;
            var imageIdOthers = _v2.b;
            return $elm$core$Maybe$Just($author$project$Data$Product$Product({
                category: category,
                condition: condition,
                createdAt: $elm$time$Time$millisToPosix(rec.createdAt),
                description: rec.description,
                id: $author$project$Data$Product$Id(rec.id),
                imageIds: _Utils_Tuple2($author$project$Data$ImageId$fromString(imageIdFirst), A2($elm$core$List$map, $author$project$Data$ImageId$fromString, imageIdOthers)),
                likedCount: rec.likedCount,
                name: rec.name,
                price: rec.price,
                seller: $author$project$Data$User$withNameFromApi({
                    displayName: rec.sellerDisplayName,
                    id: rec.sellerId,
                    imageId: $author$project$Data$ImageId$fromString(rec.sellerImageId)
                }),
                status: status,
                thumbnailImageId: $author$project$Data$ImageId$fromString(rec.thumbnailImageId),
                updateAt: $elm$time$Time$millisToPosix(rec.updateAt)
            }));
        } else {
            var _v3 = _v0.c;
            return $elm$core$Maybe$Nothing;
        }
    };
    var $elm$core$List$member = F2(function(x, xs) {
        return A2($elm$core$List$any, function(a) {
            return _Utils_eq(a, x);
        }, xs);
    });
    var $author$project$Data$LogInState$likeProduct = F2(function(id, logInState) {
        if (logInState.$ === 'Ok') {
            var rec = logInState.a;
            return $author$project$Data$LogInState$Ok(_Utils_update(rec, {
                likedProductIds: A2($elm$core$List$member, id, rec.likedProductIds) ? rec.likedProductIds : A2($elm$core$List$cons, id, rec.likedProductIds)
            }));
        } else return logInState;
    });
    var $author$project$Utility$sequenceMaybeList = function(list) {
        if (list.b) {
            if (list.a.$ === 'Just') {
                var x = list.a.a;
                var xs = list.b;
                var _v1 = $author$project$Utility$sequenceMaybeList(xs);
                if (_v1.$ === 'Just') {
                    var xss = _v1.a;
                    return $elm$core$Maybe$Just(A2($elm$core$List$cons, x, xss));
                } else return $elm$core$Maybe$Nothing;
            } else {
                var _v2 = list.a;
                return $elm$core$Maybe$Nothing;
            }
        } else return $elm$core$Maybe$Just(_List_Nil);
    };
    var $author$project$Data$LogInState$unlikeProduct = F2(function(id, logInState) {
        if (logInState.$ === 'Ok') {
            var rec = logInState.a;
            return $author$project$Data$LogInState$Ok(_Utils_update(rec, {
                likedProductIds: A2($elm$core$List$filterMap, function(i) {
                    return _Utils_eq(i, id) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(i);
                }, rec.likedProductIds)
            }));
        } else return logInState;
    });
    var $elm$core$Tuple$mapFirst = F2(function(func, _v0) {
        var x = _v0.a;
        var y = _v0.b;
        return _Utils_Tuple2(func(x), y);
    });
    var $author$project$Page$Exhibition$CmdAddLogMessage = function(a) {
        return {
            $: 'CmdAddLogMessage',
            a: a
        };
    };
    var $author$project$Page$Exhibition$CmdJumpToHome = {
        $: 'CmdJumpToHome'
    };
    var $author$project$Page$Exhibition$CmdSellProducts = function(a) {
        return {
            $: 'CmdSellProducts',
            a: a
        };
    };
    var $author$project$Page$Exhibition$ConfirmPage = function(a) {
        return {
            $: 'ConfirmPage',
            a: a
        };
    };
    var $author$project$Component$ProductEditor$CmdChangeSelectedIndex = function(a) {
        return {
            $: 'CmdChangeSelectedIndex',
            a: a
        };
    };
    var $author$project$Component$ProductEditor$CmdReplaceText = function(a) {
        return {
            $: 'CmdReplaceText',
            a: a
        };
    };
    var $author$project$Component$ProductEditor$conditionSelectId = 'exhibition-selectCondition';
    var $author$project$Data$Product$conditionToIndex = function(condition) {
        return A2($elm$core$Maybe$withDefault, 0, A2($author$project$Utility$getFirstIndex, condition, $author$project$Data$Product$conditionAll));
    };
    var $author$project$Component$ProductEditor$descriptionEditorId = 'exhibition-description';
    var $author$project$Component$ProductEditor$nameEditorId = 'exhibition-name';
    var $author$project$Component$ProductEditor$priceEditorId = 'exhibition-price';
    var $author$project$Component$ProductEditor$initModelFromSellRequestData = function(_v0) {
        var rec = _v0.a;
        var _v1 = $author$project$Component$Category$initModelWithCategorySelect(rec.category);
        var categoryModel = _v1.a;
        var categoryCmd = _v1.b;
        return _Utils_Tuple2($author$project$Component$ProductEditor$Model({
            addImages: rec.images,
            beforeImageIds: _List_Nil,
            category: categoryModel,
            condition: $elm$core$Maybe$Just(rec.condition),
            deleteImagesAt: $elm$core$Set$empty,
            description: rec.description,
            name: rec.name,
            price: $elm$core$Maybe$Just(rec.price)
        }), _Utils_ap(_List_fromArray([
            $author$project$Component$ProductEditor$CmdAddEventListenerForProductImages({
                inputId: $author$project$Component$ProductEditor$photoAddInputId,
                labelId: $author$project$Component$ProductEditor$photoAddLabelId
            }),
            $author$project$Component$ProductEditor$CmdReplaceText({
                id: $author$project$Component$ProductEditor$nameEditorId,
                text: rec.name
            }),
            $author$project$Component$ProductEditor$CmdReplaceText({
                id: $author$project$Component$ProductEditor$descriptionEditorId,
                text: rec.description
            }),
            $author$project$Component$ProductEditor$CmdReplaceText({
                id: $author$project$Component$ProductEditor$priceEditorId,
                text: $elm$core$String$fromInt(rec.price)
            }),
            $author$project$Component$ProductEditor$CmdChangeSelectedIndex({
                id: $author$project$Component$ProductEditor$conditionSelectId,
                index: $author$project$Data$Product$conditionToIndex(rec.condition) + 1
            })
        ]), A2($elm$core$List$map, $author$project$Component$ProductEditor$CmdByCategory, categoryCmd)));
    };
    var $elm$core$Tuple$mapBoth = F3(function(funcA, funcB, _v0) {
        var x = _v0.a;
        var y = _v0.b;
        return _Utils_Tuple2(funcA(x), funcB(y));
    });
    var $elm$core$Array$fromListHelp = F3(function(list, nodeList, nodeListSize) {
        fromListHelp: while(true){
            var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
            var jsArray = _v0.a;
            var remainingItems = _v0.b;
            if (_Utils_cmp($elm$core$Elm$JsArray$length(jsArray), $elm$core$Array$branchFactor) < 0) return A2($elm$core$Array$builderToArray, true, {
                nodeList: nodeList,
                nodeListSize: nodeListSize,
                tail: jsArray
            });
            else {
                var $temp$list = remainingItems, $temp$nodeList = A2($elm$core$List$cons, $elm$core$Array$Leaf(jsArray), nodeList), $temp$nodeListSize = nodeListSize + 1;
                list = $temp$list;
                nodeList = $temp$nodeList;
                nodeListSize = $temp$nodeListSize;
                continue fromListHelp;
            }
        }
    });
    var $elm$core$Array$fromList = function(list) {
        if (!list.b) return $elm$core$Array$empty;
        else return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
    };
    var $elm$core$Array$bitMask = 4294967295 >>> 32 - $elm$core$Array$shiftStep;
    var $elm$core$Basics$ge = _Utils_ge;
    var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
    var $elm$core$Array$getHelp = F3(function(shift, index, tree) {
        getHelp: while(true){
            var pos = $elm$core$Array$bitMask & index >>> shift;
            var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
            if (_v0.$ === 'SubTree') {
                var subTree = _v0.a;
                var $temp$shift = shift - $elm$core$Array$shiftStep, $temp$index = index, $temp$tree = subTree;
                shift = $temp$shift;
                index = $temp$index;
                tree = $temp$tree;
                continue getHelp;
            } else {
                var values = _v0.a;
                return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
            }
        }
    });
    var $elm$core$Array$tailIndex = function(len) {
        return len >>> 5 << 5;
    };
    var $elm$core$Array$get = F2(function(index, _v0) {
        var len = _v0.a;
        var startShift = _v0.b;
        var tree = _v0.c;
        var tail = _v0.d;
        return index < 0 || _Utils_cmp(index, len) > -1 ? $elm$core$Maybe$Nothing : _Utils_cmp(index, $elm$core$Array$tailIndex(len)) > -1 ? $elm$core$Maybe$Just(A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(A3($elm$core$Array$getHelp, startShift, index, tree));
    });
    var $author$project$Utility$getAt = F2(function(index, list) {
        return A2($elm$core$Array$get, index, $elm$core$Array$fromList(list));
    });
    var $author$project$Data$Product$conditionFromIndex = function(index) {
        return A2($author$project$Utility$getAt, index, $author$project$Data$Product$conditionAll);
    };
    var $elm$core$Set$insert = F2(function(key, _v0) {
        var dict = _v0.a;
        return $elm$core$Set$Set_elm_builtin(A3($elm$core$Dict$insert, key, _Utils_Tuple0, dict));
    });
    var $elm$core$Dict$member = F2(function(key, dict) {
        var _v0 = A2($elm$core$Dict$get, key, dict);
        if (_v0.$ === 'Just') return true;
        else return false;
    });
    var $elm$core$Set$member = F2(function(key, _v0) {
        var dict = _v0.a;
        return A2($elm$core$Dict$member, key, dict);
    });
    var $author$project$Component$ProductEditor$beforeImageAddDeleteIndex = F4(function(index, beforeImageIdLength, deleteAt, offset) {
        beforeImageAddDeleteIndex: while(true){
            if (_Utils_cmp(offset, beforeImageIdLength) < 1) {
                if (A2($elm$core$Set$member, offset, deleteAt)) {
                    var $temp$index = index, $temp$beforeImageIdLength = beforeImageIdLength, $temp$deleteAt = deleteAt, $temp$offset = offset + 1;
                    index = $temp$index;
                    beforeImageIdLength = $temp$beforeImageIdLength;
                    deleteAt = $temp$deleteAt;
                    offset = $temp$offset;
                    continue beforeImageAddDeleteIndex;
                } else {
                    if (!index) return $elm$core$Maybe$Just(A2($elm$core$Set$insert, offset, deleteAt));
                    else {
                        var $temp$index = index - 1, $temp$beforeImageIdLength = beforeImageIdLength, $temp$deleteAt = deleteAt, $temp$offset = offset + 1;
                        index = $temp$index;
                        beforeImageIdLength = $temp$beforeImageIdLength;
                        deleteAt = $temp$deleteAt;
                        offset = $temp$offset;
                        continue beforeImageAddDeleteIndex;
                    }
                }
            } else return $elm$core$Maybe$Nothing;
        }
    });
    var $author$project$Utility$removeAt = F2(function(index, list) {
        return _Utils_ap(A2($elm$core$List$take, index, list), A2($elm$core$List$drop, index + 1, list));
    });
    var $elm$core$Dict$sizeHelp = F2(function(n, dict) {
        sizeHelp: while(true){
            if (dict.$ === 'RBEmpty_elm_builtin') return n;
            else {
                var left = dict.d;
                var right = dict.e;
                var $temp$n = A2($elm$core$Dict$sizeHelp, n + 1, right), $temp$dict = left;
                n = $temp$n;
                dict = $temp$dict;
                continue sizeHelp;
            }
        }
    });
    var $elm$core$Dict$size = function(dict) {
        return A2($elm$core$Dict$sizeHelp, 0, dict);
    };
    var $elm$core$Set$size = function(_v0) {
        var dict = _v0.a;
        return $elm$core$Dict$size(dict);
    };
    var $author$project$Component$ProductEditor$imageDeleteAt = F2(function(index, _v0) {
        var beforeImageIdLength = _v0.beforeImageIdLength;
        var addImages = _v0.addImages;
        var deleteIndex = _v0.deleteIndex;
        var _v1 = A4($author$project$Component$ProductEditor$beforeImageAddDeleteIndex, index, beforeImageIdLength, deleteIndex, 0);
        if (_v1.$ === 'Just') {
            var newDeleteIndex = _v1.a;
            return {
                addImages: addImages,
                deleteIndex: newDeleteIndex
            };
        } else return {
            addImages: A2($author$project$Utility$removeAt, index - (beforeImageIdLength - $elm$core$Set$size(deleteIndex)), addImages),
            deleteIndex: deleteIndex
        };
    });
    var $author$project$Data$Category$fromIndexInGroup = F2(function(group, index) {
        return A2($author$project$Utility$getAt, index, $author$project$Data$Category$groupToCategoryList(group));
    });
    var $author$project$Component$Category$selectCategory = F2(function(index, categorySelect) {
        switch(categorySelect.$){
            case 'None':
                return $author$project$Component$Category$None;
            case 'GroupSelect':
                var group = categorySelect.a;
                var _v1 = A2($elm$core$Maybe$andThen, $author$project$Data$Category$fromIndexInGroup(group), index);
                if (_v1.$ === 'Just') {
                    var category = _v1.a;
                    return $author$project$Component$Category$CategorySelect(category);
                } else return $author$project$Component$Category$GroupSelect(group);
            default:
                var category = categorySelect.a;
                var _v2 = A2($elm$core$Maybe$andThen, $author$project$Data$Category$fromIndexInGroup($author$project$Data$Category$groupFromCategory(category)), index);
                if (_v2.$ === 'Just') {
                    var newCategory = _v2.a;
                    return $author$project$Component$Category$CategorySelect(newCategory);
                } else return $author$project$Component$Category$GroupSelect($author$project$Data$Category$groupFromCategory(category));
        }
    });
    var $author$project$Data$Category$groupFromIndex = function(index) {
        return A2($author$project$Utility$getAt, index, $author$project$Data$Category$groupAll);
    };
    var $author$project$Component$Category$selectCategoryGroup = F2(function(index, categorySelect) {
        var _v0 = A2($elm$core$Maybe$andThen, $author$project$Data$Category$groupFromIndex, index);
        if (_v0.$ === 'Just') {
            var group = _v0.a;
            switch(categorySelect.$){
                case 'None':
                    return $author$project$Component$Category$GroupSelect(group);
                case 'GroupSelect':
                    return $author$project$Component$Category$GroupSelect(group);
                default:
                    var category = categorySelect.a;
                    return _Utils_eq($author$project$Data$Category$groupFromCategory(category), group) ? categorySelect : $author$project$Component$Category$GroupSelect(group);
            }
        } else return $author$project$Component$Category$None;
    });
    var $author$project$Component$Category$update = F2(function(msg, _v0) {
        var select = _v0.a;
        if (msg.$ === 'SelectCategoryGroup') {
            var maybe = msg.a;
            return $author$project$Component$Category$Model(A2($author$project$Component$Category$selectCategoryGroup, maybe, select));
        } else {
            var maybe = msg.a;
            return $author$project$Component$Category$Model(A2($author$project$Component$Category$selectCategory, maybe, select));
        }
    });
    var $author$project$Component$ProductEditor$update = F2(function(msg, _v0) {
        var rec = _v0.a;
        switch(msg.$){
            case 'InputName':
                var nameString = msg.a;
                return $author$project$Component$ProductEditor$Model(_Utils_update(rec, {
                    name: nameString
                }));
            case 'InputDescription':
                var descriptionString = msg.a;
                return $author$project$Component$ProductEditor$Model(_Utils_update(rec, {
                    description: descriptionString
                }));
            case 'InputPrice':
                var priceString = msg.a;
                return $author$project$Component$ProductEditor$Model(_Utils_update(rec, {
                    price: A2($elm$core$Maybe$andThen, function(price) {
                        return 0 <= price && price <= 1000000 ? $elm$core$Maybe$Just(price) : $elm$core$Maybe$Nothing;
                    }, $elm$core$String$toInt(priceString))
                }));
            case 'SelectCondition':
                var index = msg.a;
                return $author$project$Component$ProductEditor$Model(_Utils_update(rec, {
                    condition: A2($elm$core$Maybe$andThen, $author$project$Data$Product$conditionFromIndex, index)
                }));
            case 'DeleteImage':
                var index = msg.a;
                var _v2 = A2($author$project$Component$ProductEditor$imageDeleteAt, index, {
                    addImages: rec.addImages,
                    beforeImageIdLength: $elm$core$List$length(rec.beforeImageIds),
                    deleteIndex: rec.deleteImagesAt
                });
                var addImages = _v2.addImages;
                var deleteIndex = _v2.deleteIndex;
                return $author$project$Component$ProductEditor$Model(_Utils_update(rec, {
                    addImages: addImages,
                    deleteImagesAt: deleteIndex
                }));
            case 'InputImageList':
                var dataUrlList = msg.a;
                return $author$project$Component$ProductEditor$Model(_Utils_update(rec, {
                    addImages: _Utils_ap(rec.addImages, dataUrlList)
                }));
            default:
                var categoryMsg = msg.a;
                return $author$project$Component$ProductEditor$Model(_Utils_update(rec, {
                    category: A2($author$project$Component$Category$update, categoryMsg, rec.category)
                }));
        }
    });
    var $author$project$Page$Exhibition$updateWhenLogIn = F2(function(msg, page) {
        if (page.$ === 'EditPage') {
            var productEditorModel = page.a;
            switch(msg.$){
                case 'ToConfirmPage':
                    var _v2 = msg.a;
                    var request = _v2.b;
                    return _Utils_Tuple2($author$project$Page$Exhibition$ConfirmPage({
                        request: request,
                        sending: false
                    }), _List_Nil);
                case 'MsgByProductEditor':
                    var m = msg.a;
                    return _Utils_Tuple2($author$project$Page$Exhibition$EditPage(A2($author$project$Component$ProductEditor$update, m, productEditorModel)), _List_Nil);
                default:
                    return _Utils_Tuple2($author$project$Page$Exhibition$EditPage(productEditorModel), _List_Nil);
            }
        } else {
            var rec = page.a;
            switch(msg.$){
                case 'SellProduct':
                    var data = msg.a;
                    return _Utils_Tuple2($author$project$Page$Exhibition$ConfirmPage(_Utils_update(rec, {
                        sending: true
                    })), _List_fromArray([
                        $author$project$Page$Exhibition$CmdSellProducts(data)
                    ]));
                case 'BackToEditPage':
                    return A3($elm$core$Tuple$mapBoth, $author$project$Page$Exhibition$EditPage, $elm$core$List$map($author$project$Page$Exhibition$CmdByProductEditor), $author$project$Component$ProductEditor$initModelFromSellRequestData(rec.request));
                case 'SellProductResponse':
                    var result = msg.a;
                    return _Utils_Tuple2($author$project$Page$Exhibition$ConfirmPage(rec), function() {
                        if (result.$ === 'Ok') return _List_fromArray([
                            $author$project$Page$Exhibition$CmdAddLogMessage('出品しました'),
                            $author$project$Page$Exhibition$CmdJumpToHome
                        ]);
                        else {
                            var errorMessage = result.a;
                            return _List_fromArray([
                                $author$project$Page$Exhibition$CmdAddLogMessage('出品できませんでした ' + errorMessage)
                            ]);
                        }
                    }());
                default:
                    return _Utils_Tuple2($author$project$Page$Exhibition$ConfirmPage(rec), _List_Nil);
            }
        }
    });
    var $author$project$Page$Exhibition$CmdLogInOrSignUp = function(a) {
        return {
            $: 'CmdLogInOrSignUp',
            a: a
        };
    };
    var $author$project$Component$LogIn$CmdLogInOrSignUp = function(a) {
        return {
            $: 'CmdLogInOrSignUp',
            a: a
        };
    };
    var $author$project$Component$LogIn$update = F2(function(msg, _v0) {
        var service = msg.a;
        return _Utils_Tuple2($author$project$Component$LogIn$Model($elm$core$Maybe$Just(service)), _List_fromArray([
            $author$project$Component$LogIn$CmdLogInOrSignUp(service)
        ]));
    });
    var $author$project$Page$Exhibition$updateWhenNoLogIn = F2(function(msg, _v0) {
        var rec = _v0.a;
        if (msg.$ === 'LogInOrSignUpMsg') {
            var m = msg.a;
            var exCmd = _List_Nil;
            return A3($elm$core$Tuple$mapBoth, function(logInModel) {
                return $author$project$Page$Exhibition$Model(_Utils_update(rec, {
                    logInOrSignUpModel: logInModel
                }));
            }, function(e) {
                return _Utils_ap(A2($elm$core$List$map, $author$project$Page$Exhibition$CmdLogInOrSignUp, e), exCmd);
            }, A2($author$project$Component$LogIn$update, m, rec.logInOrSignUpModel));
        } else return _Utils_Tuple2($author$project$Page$Exhibition$Model(rec), _List_Nil);
    });
    var $author$project$Page$Exhibition$update = F3(function(logInState, msg, _v0) {
        var rec = _v0.a;
        if (logInState.$ === 'None') return A2($author$project$Page$Exhibition$updateWhenNoLogIn, msg, $author$project$Page$Exhibition$Model(rec));
        else return A2($elm$core$Tuple$mapFirst, function(p) {
            return $author$project$Page$Exhibition$Model(_Utils_update(rec, {
                page: p
            }));
        }, A2($author$project$Page$Exhibition$updateWhenLogIn, msg, rec.page));
    });
    var $author$project$Page$Product$CmdAddComment = F3(function(a, b, c) {
        return {
            $: 'CmdAddComment',
            a: a,
            b: b,
            c: c
        };
    });
    var $author$project$Page$Product$CmdAddLogMessage = function(a) {
        return {
            $: 'CmdAddLogMessage',
            a: a
        };
    };
    var $author$project$Page$Product$CmdByProductEditor = function(a) {
        return {
            $: 'CmdByProductEditor',
            a: a
        };
    };
    var $author$project$Page$Product$CmdDelete = F2(function(a, b) {
        return {
            $: 'CmdDelete',
            a: a,
            b: b
        };
    });
    var $author$project$Page$Product$CmdJumpToHome = {
        $: 'CmdJumpToHome'
    };
    var $author$project$Page$Product$CmdJumpToTradePage = function(a) {
        return {
            $: 'CmdJumpToTradePage',
            a: a
        };
    };
    var $author$project$Page$Product$CmdLike = F2(function(a, b) {
        return {
            $: 'CmdLike',
            a: a,
            b: b
        };
    });
    var $author$project$Page$Product$CmdReplaceElementText = function(a) {
        return {
            $: 'CmdReplaceElementText',
            a: a
        };
    };
    var $author$project$Page$Product$CmdTradeStart = F2(function(a, b) {
        return {
            $: 'CmdTradeStart',
            a: a,
            b: b
        };
    });
    var $author$project$Page$Product$CmdUnLike = F2(function(a, b) {
        return {
            $: 'CmdUnLike',
            a: a,
            b: b
        };
    });
    var $author$project$Page$Product$CmdUpdateNowTime = {
        $: 'CmdUpdateNowTime'
    };
    var $author$project$Page$Product$CmdUpdateProductData = F3(function(a, b, c) {
        return {
            $: 'CmdUpdateProductData',
            a: a,
            b: b,
            c: c
        };
    });
    var $author$project$Page$Product$Edit = function(a) {
        return {
            $: 'Edit',
            a: a
        };
    };
    var $author$project$Page$Product$EditConfirm = function(a) {
        return {
            $: 'EditConfirm',
            a: a
        };
    };
    var $author$project$Page$Product$commentTextAreaId = 'comment-text-area';
    var $author$project$Data$Product$getCondition = function(_v0) {
        var condition = _v0.a.condition;
        return condition;
    };
    var $elm$core$Tuple$second = function(_v0) {
        var y = _v0.b;
        return y;
    };
    var $author$project$Data$Product$getImageIds = function(_v0) {
        var imageIds = _v0.a.imageIds;
        return A2($elm$core$List$cons, imageIds.a, imageIds.b);
    };
    var $author$project$Data$Product$getPrice = function(_v0) {
        var price = _v0.a.price;
        return price;
    };
    var $author$project$Page$Product$getProductId = function(model) {
        switch(model.$){
            case 'Normal':
                var product = model.a.product;
                return product;
            case 'Edit':
                var beforeProduct = model.a.beforeProduct;
                return beforeProduct;
            default:
                var productId = model.a;
                return productId;
        }
    };
    var $author$project$Component$ProductEditor$initModel = function(_v0) {
        var name = _v0.name;
        var description = _v0.description;
        var price = _v0.price;
        var condition = _v0.condition;
        var category = _v0.category;
        var imageIds = _v0.imageIds;
        var _v1 = $author$project$Component$Category$initModelWithCategorySelect(category);
        var categoryModel = _v1.a;
        var categoryCmd = _v1.b;
        return _Utils_Tuple2($author$project$Component$ProductEditor$Model({
            addImages: _List_Nil,
            beforeImageIds: imageIds,
            category: categoryModel,
            condition: $elm$core$Maybe$Just(condition),
            deleteImagesAt: $elm$core$Set$empty,
            description: description,
            name: name,
            price: $elm$core$Maybe$Just(price)
        }), _Utils_ap(_List_fromArray([
            $author$project$Component$ProductEditor$CmdAddEventListenerForProductImages({
                inputId: $author$project$Component$ProductEditor$photoAddInputId,
                labelId: $author$project$Component$ProductEditor$photoAddLabelId
            }),
            $author$project$Component$ProductEditor$CmdReplaceText({
                id: $author$project$Component$ProductEditor$nameEditorId,
                text: name
            }),
            $author$project$Component$ProductEditor$CmdReplaceText({
                id: $author$project$Component$ProductEditor$descriptionEditorId,
                text: description
            }),
            $author$project$Component$ProductEditor$CmdReplaceText({
                id: $author$project$Component$ProductEditor$priceEditorId,
                text: $elm$core$String$fromInt(price)
            }),
            $author$project$Component$ProductEditor$CmdChangeSelectedIndex({
                id: $author$project$Component$ProductEditor$conditionSelectId,
                index: $author$project$Data$Product$conditionToIndex(condition) + 1
            })
        ]), A2($elm$core$List$map, $author$project$Component$ProductEditor$CmdByCategory, categoryCmd)));
    };
    var $author$project$Data$Product$searchFromId = F2(function(id, list) {
        searchFromId: while(true){
            if (list.b) {
                var x = list.a;
                var xs = list.b;
                if (_Utils_eq($author$project$Data$Product$getId(x), id)) return x;
                else {
                    var $temp$id = id, $temp$list = xs;
                    id = $temp$id;
                    list = $temp$list;
                    continue searchFromId;
                }
            } else return $author$project$Data$Product$Product({
                category: $author$project$Data$Category$FurnitureOther,
                condition: $author$project$Data$Product$ConditionJunk,
                createdAt: $elm$time$Time$millisToPosix(0),
                description: '存在しない商品',
                id: $author$project$Data$Product$Id('unknown'),
                imageIds: _Utils_Tuple2($author$project$Data$ImageId$fromString('unknown'), _List_Nil),
                likedCount: 0,
                name: '?????????',
                price: 0,
                seller: $author$project$Data$User$withNameFromApi({
                    displayName: '???',
                    id: 'unknownUser',
                    imageId: $author$project$Data$ImageId$fromString('unknown')
                }),
                status: $author$project$Data$Product$Selling,
                thumbnailImageId: $author$project$Data$ImageId$fromString('unknown'),
                updateAt: $elm$time$Time$millisToPosix(0)
            });
        }
    });
    var $author$project$Page$Product$update = F3(function(allProductsMaybe, msg, model) {
        switch(msg.$){
            case 'GetCommentListResponse':
                var commentListResult = msg.a;
                var _v1 = _Utils_Tuple2(model, commentListResult);
                if (_v1.b.$ === 'Ok') {
                    if (_v1.a.$ === 'Normal') {
                        var rec = _v1.a.a;
                        var commentList = _v1.b.a;
                        return _Utils_Tuple2($author$project$Page$Product$Normal(_Utils_update(rec, {
                            comment: '',
                            commentList: $elm$core$Maybe$Just(commentList),
                            commentSending: false,
                            product: rec.product
                        })), _List_fromArray([
                            $author$project$Page$Product$CmdReplaceElementText({
                                id: $author$project$Page$Product$commentTextAreaId,
                                text: ''
                            }),
                            $author$project$Page$Product$CmdUpdateNowTime
                        ]));
                    } else return _Utils_Tuple2(model, _List_fromArray([
                        $author$project$Page$Product$CmdAddLogMessage('画面がNormalでないときにコメントを受け取ってしまった')
                    ]));
                } else {
                    var text = _v1.b.a;
                    return _Utils_Tuple2(model, _List_fromArray([
                        $author$project$Page$Product$CmdAddLogMessage('コメント取得に失敗しました ' + text)
                    ]));
                }
            case 'Like':
                var token = msg.a;
                var id = msg.b;
                return _Utils_Tuple2(function() {
                    if (model.$ === 'Normal') {
                        var rec = model.a;
                        return $author$project$Page$Product$Normal(_Utils_update(rec, {
                            likeSending: true
                        }));
                    } else return model;
                }(), _List_fromArray([
                    A2($author$project$Page$Product$CmdLike, token, id)
                ]));
            case 'UnLike':
                var token = msg.a;
                var id = msg.b;
                return _Utils_Tuple2(function() {
                    if (model.$ === 'Normal') {
                        var rec = model.a;
                        return $author$project$Page$Product$Normal(_Utils_update(rec, {
                            likeSending: true
                        }));
                    } else return model;
                }(), _List_fromArray([
                    A2($author$project$Page$Product$CmdUnLike, token, id)
                ]));
            case 'LikeResponse':
                var result = msg.a;
                var _v4 = _Utils_Tuple2(result, model);
                if (_v4.a.$ === 'Ok') {
                    if (_v4.b.$ === 'Normal') {
                        var rec = _v4.b.a;
                        return _Utils_Tuple2($author$project$Page$Product$Normal(_Utils_update(rec, {
                            likeSending: false
                        })), _List_Nil);
                    } else return _Utils_Tuple2(model, _List_Nil);
                } else {
                    var text = _v4.a.a;
                    return _Utils_Tuple2(model, _List_fromArray([
                        $author$project$Page$Product$CmdAddLogMessage('いいねをするのに失敗 ' + text)
                    ]));
                }
            case 'UnlikeResponse':
                var result = msg.a;
                var _v5 = _Utils_Tuple2(result, model);
                if (_v5.a.$ === 'Ok') {
                    if (_v5.b.$ === 'Normal') {
                        var rec = _v5.b.a;
                        return _Utils_Tuple2($author$project$Page$Product$Normal(_Utils_update(rec, {
                            likeSending: false
                        })), _List_Nil);
                    } else return _Utils_Tuple2(model, _List_Nil);
                } else {
                    var text = _v5.a.a;
                    return _Utils_Tuple2(model, _List_fromArray([
                        $author$project$Page$Product$CmdAddLogMessage('いいねを外すのに失敗 ' + text)
                    ]));
                }
            case 'TradeStart':
                var token = msg.a;
                var productId = msg.b;
                return _Utils_Tuple2(model, _List_fromArray([
                    A2($author$project$Page$Product$CmdTradeStart, token, productId)
                ]));
            case 'TradeStartResponse':
                var result = msg.a;
                return _Utils_Tuple2(model, function() {
                    if (result.$ === 'Ok') {
                        var trade = result.a;
                        return _List_fromArray([
                            $author$project$Page$Product$CmdAddLogMessage('取引開始'),
                            $author$project$Page$Product$CmdJumpToTradePage(trade)
                        ]);
                    } else {
                        var text = result.a;
                        return _List_fromArray([
                            $author$project$Page$Product$CmdAddLogMessage('取引開始を失敗しました ' + text)
                        ]);
                    }
                }());
            case 'ToConfirmPage':
                return _Utils_Tuple2(function() {
                    if (model.$ === 'Normal') {
                        var product = model.a.product;
                        return $author$project$Page$Product$EditConfirm(product);
                    } else return model;
                }(), _List_Nil);
            case 'InputComment':
                var string = msg.a;
                if (model.$ === 'Normal') {
                    var rec = model.a;
                    return _Utils_Tuple2($author$project$Page$Product$Normal(_Utils_update(rec, {
                        comment: string
                    })), _List_Nil);
                } else return _Utils_Tuple2(model, _List_Nil);
            case 'SendComment':
                var token = msg.a;
                if (model.$ === 'Normal') {
                    var rec = model.a;
                    return _Utils_Tuple2($author$project$Page$Product$Normal(_Utils_update(rec, {
                        commentSending: true
                    })), _List_fromArray([
                        A3($author$project$Page$Product$CmdAddComment, token, {
                            productId: rec.product
                        }, rec.comment)
                    ]));
                } else return _Utils_Tuple2(model, _List_Nil);
            case 'Delete':
                var token = msg.a;
                var productId = msg.b;
                return _Utils_Tuple2(model, _List_fromArray([
                    A2($author$project$Page$Product$CmdDelete, token, productId)
                ]));
            case 'DeleteResponse':
                var result = msg.a;
                return _Utils_Tuple2(model, function() {
                    if (result.$ === 'Ok') return _List_fromArray([
                        $author$project$Page$Product$CmdAddLogMessage('商品の削除に成功しました'),
                        $author$project$Page$Product$CmdJumpToHome
                    ]);
                    else {
                        var errorMessage = result.a;
                        return _List_fromArray([
                            $author$project$Page$Product$CmdAddLogMessage('商品の削除に失敗しました' + errorMessage)
                        ]);
                    }
                }());
            case 'EditProduct':
                var _v11 = _Utils_Tuple2(model, allProductsMaybe);
                if (_v11.a.$ === 'Normal' && _v11.b.$ === 'Just') {
                    var product = _v11.a.a.product;
                    var allProducts = _v11.b.a;
                    var productData = A2($author$project$Data$Product$searchFromId, product, allProducts);
                    var _v12 = $author$project$Component$ProductEditor$initModel({
                        category: $author$project$Data$Product$getCategory(productData),
                        condition: $author$project$Data$Product$getCondition(productData),
                        description: $author$project$Data$Product$getDescription(productData),
                        imageIds: $author$project$Data$Product$getImageIds(productData),
                        name: $author$project$Data$Product$getName(productData),
                        price: $author$project$Data$Product$getPrice(productData)
                    });
                    var productEditorMode = _v12.a;
                    var productEditorCmdList = _v12.b;
                    return _Utils_Tuple2($author$project$Page$Product$Edit({
                        beforeProduct: product,
                        productEditor: productEditorMode,
                        sending: false
                    }), A2($elm$core$List$map, $author$project$Page$Product$CmdByProductEditor, productEditorCmdList));
                } else return _Utils_Tuple2(model, _List_Nil);
            case 'MsgBackToViewMode':
                if (model.$ === 'Edit') {
                    var beforeProduct = model.a.beforeProduct;
                    return _Utils_Tuple2($author$project$Page$Product$Normal({
                        comment: '',
                        commentList: $elm$core$Maybe$Nothing,
                        commentSending: false,
                        likeSending: false,
                        product: beforeProduct
                    }), _List_fromArray([
                        $author$project$Page$Product$CmdGetCommentList(beforeProduct)
                    ]));
                } else return _Utils_Tuple2(model, _List_Nil);
            case 'MsgByProductEditor':
                var productEditorMsg = msg.a;
                return _Utils_Tuple2(function() {
                    if (model.$ === 'Edit') {
                        var r = model.a;
                        return $author$project$Page$Product$Edit(_Utils_update(r, {
                            productEditor: A2($author$project$Component$ProductEditor$update, productEditorMsg, r.productEditor)
                        }));
                    } else return model;
                }(), _List_Nil);
            case 'UpdateProductData':
                var token = msg.a;
                var productId = msg.b;
                var requestData = msg.c;
                return _Utils_Tuple2(function() {
                    if (model.$ === 'Edit') {
                        var rec = model.a;
                        return $author$project$Page$Product$Edit(_Utils_update(rec, {
                            sending: true
                        }));
                    } else return model;
                }(), _List_fromArray([
                    A3($author$project$Page$Product$CmdUpdateProductData, token, productId, requestData)
                ]));
            default:
                var result = msg.a;
                if (result.$ === 'Ok') return _Utils_Tuple2($author$project$Page$Product$Normal({
                    comment: '',
                    commentList: $elm$core$Maybe$Nothing,
                    commentSending: false,
                    likeSending: false,
                    product: $author$project$Page$Product$getProductId(model)
                }), _List_fromArray([
                    $author$project$Page$Product$CmdGetCommentList($author$project$Page$Product$getProductId(model))
                ]));
                else {
                    var text = result.a;
                    if (model.$ === 'Edit') {
                        var rec = model.a;
                        return _Utils_Tuple2($author$project$Page$Product$Edit(_Utils_update(rec, {
                            sending: false
                        })), _List_fromArray([
                            $author$project$Page$Product$CmdAddLogMessage('商品の編集に失敗しました ' + text)
                        ]));
                    } else return _Utils_Tuple2(model, _List_fromArray([
                        $author$project$Page$Product$CmdAddLogMessage('商品の編集に失敗しました ' + text)
                    ]));
                }
        }
    });
    var $author$project$Page$User$CmdAddLogMessage = function(a) {
        return {
            $: 'CmdAddLogMessage',
            a: a
        };
    };
    var $author$project$Page$User$CmdByUniversity = function(a) {
        return {
            $: 'CmdByUniversity',
            a: a
        };
    };
    var $author$project$Page$User$CmdChangeProfile = F2(function(a, b) {
        return {
            $: 'CmdChangeProfile',
            a: a,
            b: b
        };
    });
    var $author$project$Page$User$CmdJumpToLineNotifySetting = function(a) {
        return {
            $: 'CmdJumpToLineNotifySetting',
            a: a
        };
    };
    var $author$project$Page$User$CmdLogOut = {
        $: 'CmdLogOut'
    };
    var $author$project$Page$User$Edit = function(a) {
        return {
            $: 'Edit',
            a: a
        };
    };
    var $author$project$Page$User$Normal = function(a) {
        return {
            $: 'Normal',
            a: a
        };
    };
    var $author$project$Page$User$CmdReplaceElementText = function(a) {
        return {
            $: 'CmdReplaceElementText',
            a: a
        };
    };
    var $author$project$Component$University$CmdByGraduateSelect = function(a) {
        return {
            $: 'CmdByGraduateSelect',
            a: a
        };
    };
    var $author$project$Component$University$CmdBySchoolSelect = function(a) {
        return {
            $: 'CmdBySchoolSelect',
            a: a
        };
    };
    var $author$project$Component$University$GraduateNoTsukuba = function(a) {
        return {
            $: 'GraduateNoTsukuba',
            a: a
        };
    };
    var $author$project$Component$University$GraduateTsukuba = function(a) {
        return {
            $: 'GraduateTsukuba',
            a: a
        };
    };
    var $author$project$Component$University$School = function(a) {
        return {
            $: 'School',
            a: a
        };
    };
    var $author$project$Component$GraduateSelect$CmdChangeSelectedIndex = function(a) {
        return {
            $: 'CmdChangeSelectedIndex',
            a: a
        };
    };
    var $author$project$Component$GraduateSelect$Selected = function(a) {
        return {
            $: 'Selected',
            a: a
        };
    };
    var $author$project$Component$GraduateSelect$graduateSelectId = 'signUp-selectGraduate';
    var $author$project$Data$University$graduateToIndex = function(graduate) {
        return A2($elm$core$Maybe$withDefault, 0, A2($author$project$Utility$getFirstIndex, graduate, $author$project$Data$University$graduateAllValue));
    };
    var $author$project$Component$GraduateSelect$initSelected = function(graduate) {
        return _Utils_Tuple2($author$project$Component$GraduateSelect$Selected(graduate), _List_fromArray([
            $author$project$Component$GraduateSelect$CmdChangeSelectedIndex({
                id: $author$project$Component$GraduateSelect$graduateSelectId,
                index: $author$project$Data$University$graduateToIndex(graduate) + 1
            })
        ]));
    };
    var $author$project$Component$SchoolSelect$Department = function(a) {
        return {
            $: 'Department',
            a: a
        };
    };
    var $author$project$Component$SchoolSelect$departmentSelectId = 'signUp-selectDepartment';
    var $author$project$Data$University$schoolFromDepartment = function(schoolAndDepartment) {
        switch(schoolAndDepartment.$){
            case 'DHumanity':
                return $author$project$Data$University$SHumcul;
            case 'DCulture':
                return $author$project$Data$University$SHumcul;
            case 'DJapanese':
                return $author$project$Data$University$SHumcul;
            case 'DSocial':
                return $author$project$Data$University$SSocint;
            case 'DCis':
                return $author$project$Data$University$SSocint;
            case 'DEducation':
                return $author$project$Data$University$SHuman;
            case 'DPsyche':
                return $author$project$Data$University$SHuman;
            case 'DDisability':
                return $author$project$Data$University$SHuman;
            case 'DBiol':
                return $author$project$Data$University$SLife;
            case 'DBres':
                return $author$project$Data$University$SLife;
            case 'DEarth':
                return $author$project$Data$University$SLife;
            case 'DMath':
                return $author$project$Data$University$SSse;
            case 'DPhys':
                return $author$project$Data$University$SSse;
            case 'DChem':
                return $author$project$Data$University$SSse;
            case 'DCoens':
                return $author$project$Data$University$SSse;
            case 'DEsys':
                return $author$project$Data$University$SSse;
            case 'DPandps':
                return $author$project$Data$University$SSse;
            case 'DCoins':
                return $author$project$Data$University$SInfo;
            case 'DMast':
                return $author$project$Data$University$SInfo;
            case 'DKlis':
                return $author$project$Data$University$SInfo;
            case 'DMed':
                return $author$project$Data$University$SMed;
            case 'DNurse':
                return $author$project$Data$University$SMed;
            case 'DMs':
                return $author$project$Data$University$SMed;
            case 'DAandd':
                return $author$project$Data$University$SAandd;
            default:
                return $author$project$Data$University$SSport;
        }
    };
    var $author$project$Data$University$schoolToDepartmentList = function(school) {
        switch(school.$){
            case 'SHumcul':
                return _List_fromArray([
                    $author$project$Data$University$DHumanity,
                    $author$project$Data$University$DCulture,
                    $author$project$Data$University$DJapanese
                ]);
            case 'SSocint':
                return _List_fromArray([
                    $author$project$Data$University$DSocial,
                    $author$project$Data$University$DCis
                ]);
            case 'SHuman':
                return _List_fromArray([
                    $author$project$Data$University$DEducation,
                    $author$project$Data$University$DPsyche,
                    $author$project$Data$University$DDisability
                ]);
            case 'SLife':
                return _List_fromArray([
                    $author$project$Data$University$DBiol,
                    $author$project$Data$University$DBres,
                    $author$project$Data$University$DEarth
                ]);
            case 'SSse':
                return _List_fromArray([
                    $author$project$Data$University$DMath,
                    $author$project$Data$University$DPhys,
                    $author$project$Data$University$DChem,
                    $author$project$Data$University$DCoens,
                    $author$project$Data$University$DEsys,
                    $author$project$Data$University$DPandps
                ]);
            case 'SInfo':
                return _List_fromArray([
                    $author$project$Data$University$DCoins,
                    $author$project$Data$University$DMast,
                    $author$project$Data$University$DKlis
                ]);
            case 'SMed':
                return _List_fromArray([
                    $author$project$Data$University$DMed,
                    $author$project$Data$University$DNurse,
                    $author$project$Data$University$DMs
                ]);
            case 'SAandd':
                return _List_Nil;
            default:
                return _List_Nil;
        }
    };
    var $author$project$Data$University$departmentToIndexInSchool = function(department) {
        return A2($elm$core$Maybe$withDefault, 0, A2($author$project$Utility$getFirstIndex, department, $author$project$Data$University$schoolToDepartmentList($author$project$Data$University$schoolFromDepartment(department))));
    };
    var $author$project$Data$University$schoolAll = _List_fromArray([
        $author$project$Data$University$SHumcul,
        $author$project$Data$University$SSocint,
        $author$project$Data$University$SHuman,
        $author$project$Data$University$SLife,
        $author$project$Data$University$SSse,
        $author$project$Data$University$SInfo,
        $author$project$Data$University$SMed,
        $author$project$Data$University$SAandd,
        $author$project$Data$University$SSport
    ]);
    var $author$project$Data$University$schoolToIndex = function(school) {
        return A2($elm$core$Maybe$withDefault, 0, A2($author$project$Utility$getFirstIndex, school, $author$project$Data$University$schoolAll));
    };
    var $author$project$Component$SchoolSelect$initSelected = function(department) {
        return _Utils_Tuple2($author$project$Component$SchoolSelect$Department(department), _List_fromArray([
            $author$project$Component$SchoolSelect$CmdChangeSelectedIndex({
                id: $author$project$Component$SchoolSelect$schoolSelectId,
                index: $author$project$Data$University$schoolToIndex($author$project$Data$University$schoolFromDepartment(department)) + 1
            }),
            $author$project$Component$SchoolSelect$CmdChangeSelectedIndex({
                id: $author$project$Component$SchoolSelect$departmentSelectId,
                index: $author$project$Data$University$departmentToIndexInSchool(department) + 1
            })
        ]));
    };
    var $author$project$Component$University$initModelFromUniversity = function(university) {
        switch(university.$){
            case 'GraduateTsukuba':
                var graduate = university.a;
                var schoolAndDepartment = university.b;
                var _v1 = $author$project$Component$SchoolSelect$initSelected(schoolAndDepartment);
                var schoolModel = _v1.a;
                var schoolCmd = _v1.b;
                var _v2 = $author$project$Component$GraduateSelect$initSelected(graduate);
                var graduateModel = _v2.a;
                var graduateCmd = _v2.b;
                return _Utils_Tuple2($author$project$Component$University$GraduateTsukuba({
                    graduate: graduateModel,
                    school: schoolModel
                }), _Utils_ap(A2($elm$core$List$map, $author$project$Component$University$CmdByGraduateSelect, graduateCmd), A2($elm$core$List$map, $author$project$Component$University$CmdBySchoolSelect, schoolCmd)));
            case 'GraduateNoTsukuba':
                var graduate = university.a;
                var _v3 = $author$project$Component$GraduateSelect$initSelected(graduate);
                var graduateModel = _v3.a;
                var graduateCmd = _v3.b;
                return _Utils_Tuple2($author$project$Component$University$GraduateNoTsukuba(graduateModel), A2($elm$core$List$map, $author$project$Component$University$CmdByGraduateSelect, graduateCmd));
            default:
                var schoolAndDepartment = university.a;
                var _v4 = $author$project$Component$SchoolSelect$initSelected(schoolAndDepartment);
                var schoolModel = _v4.a;
                var schoolCmd = _v4.b;
                return _Utils_Tuple2($author$project$Component$University$School(schoolModel), A2($elm$core$List$map, $author$project$Component$University$CmdBySchoolSelect, schoolCmd));
        }
    };
    var $author$project$Page$User$introductionEditorId = 'introduction-editor';
    var $author$project$Page$User$nickNameEditorId = 'nickname-editor';
    var $author$project$Data$User$withProfileGetDisplayName = function(_v0) {
        var displayName = _v0.a.displayName;
        return displayName;
    };
    var $author$project$Data$User$withProfileGetIntroduction = function(_v0) {
        var introduction = _v0.a.introduction;
        return introduction;
    };
    var $author$project$Data$User$withProfileGetUniversity = function(_v0) {
        var university = _v0.a.university;
        return university;
    };
    var $author$project$Page$User$toEditMode = function(userWithProfile) {
        var introduction = $author$project$Data$User$withProfileGetIntroduction(userWithProfile);
        var displayName = $author$project$Data$User$withProfileGetDisplayName(userWithProfile);
        var _v0 = $author$project$Component$University$initModelFromUniversity($author$project$Data$User$withProfileGetUniversity(userWithProfile));
        var universityModel = _v0.a;
        var universityCmds = _v0.b;
        return _Utils_Tuple2($author$project$Page$User$Edit({
            before: userWithProfile,
            displayName: displayName,
            introduction: introduction,
            university: universityModel
        }), _Utils_ap(_List_fromArray([
            $author$project$Page$User$CmdReplaceElementText({
                id: $author$project$Page$User$nickNameEditorId,
                text: displayName
            }),
            $author$project$Page$User$CmdReplaceElementText({
                id: $author$project$Page$User$introductionEditorId,
                text: introduction
            })
        ]), A2($elm$core$List$map, $author$project$Page$User$CmdByUniversity, universityCmds)));
    };
    var $elm$core$String$trim = _String_trim;
    var $author$project$Component$GraduateSelect$None = {
        $: 'None'
    };
    var $author$project$Component$GraduateSelect$initNone = _Utils_Tuple2($author$project$Component$GraduateSelect$None, _List_fromArray([
        $author$project$Component$GraduateSelect$CmdChangeSelectedIndex({
            id: $author$project$Component$GraduateSelect$graduateSelectId,
            index: 0
        })
    ]));
    var $author$project$Data$University$graduateFromIndex = function(index) {
        return A2($author$project$Utility$getAt, index, $author$project$Data$University$graduateAllValue);
    };
    var $author$project$Component$GraduateSelect$update = F2(function(msg, model) {
        var index = msg.a;
        var _v1 = A2($elm$core$Maybe$andThen, $author$project$Data$University$graduateFromIndex, index);
        if (_v1.$ === 'Just') {
            var graduate = _v1.a;
            return $author$project$Component$GraduateSelect$Selected(graduate);
        } else return $author$project$Component$GraduateSelect$None;
    });
    var $author$project$Component$SchoolSelect$School = function(a) {
        return {
            $: 'School',
            a: a
        };
    };
    var $author$project$Data$University$departmentFromIndexInSchool = F2(function(school, index) {
        return A2($author$project$Utility$getAt, index, $author$project$Data$University$schoolToDepartmentList(school));
    });
    var $author$project$Component$SchoolSelect$selectDepartment = F2(function(index, schoolSelect) {
        switch(schoolSelect.$){
            case 'None':
                return $author$project$Component$SchoolSelect$None;
            case 'School':
                var school = schoolSelect.a;
                var _v1 = A2($elm$core$Maybe$andThen, $author$project$Data$University$departmentFromIndexInSchool(school), index);
                if (_v1.$ === 'Just') {
                    var department = _v1.a;
                    return $author$project$Component$SchoolSelect$Department(department);
                } else return $author$project$Component$SchoolSelect$School(school);
            default:
                var schoolAndDepartment = schoolSelect.a;
                var _v2 = A2($elm$core$Maybe$andThen, $author$project$Data$University$departmentFromIndexInSchool($author$project$Data$University$schoolFromDepartment(schoolAndDepartment)), index);
                if (_v2.$ === 'Just') {
                    var department = _v2.a;
                    return $author$project$Component$SchoolSelect$Department(department);
                } else return $author$project$Component$SchoolSelect$School($author$project$Data$University$schoolFromDepartment(schoolAndDepartment));
        }
    });
    var $author$project$Data$University$schoolFromIndex = function(index) {
        return A2($author$project$Utility$getAt, index, $author$project$Data$University$schoolAll);
    };
    var $author$project$Component$SchoolSelect$selectSchool = F2(function(index, schoolSelect) {
        var _v0 = A2($elm$core$Maybe$andThen, $author$project$Data$University$schoolFromIndex, index);
        if (_v0.$ === 'Just') {
            var school = _v0.a;
            switch(schoolSelect.$){
                case 'None':
                    return $author$project$Component$SchoolSelect$School(school);
                case 'School':
                    return $author$project$Component$SchoolSelect$School(school);
                default:
                    var department = schoolSelect.a;
                    return _Utils_eq($author$project$Data$University$schoolFromDepartment(department), school) ? schoolSelect : $author$project$Component$SchoolSelect$School(school);
            }
        } else return $author$project$Component$SchoolSelect$None;
    });
    var $author$project$Component$SchoolSelect$update = function(msg) {
        if (msg.$ === 'SelectSchool') {
            var index = msg.a;
            return $author$project$Component$SchoolSelect$selectSchool(index);
        } else {
            var index = msg.a;
            return $author$project$Component$SchoolSelect$selectDepartment(index);
        }
    };
    var $author$project$Component$University$update = F2(function(msg, model) {
        var _v0 = _Utils_Tuple2(msg, model);
        _v0$9: while(true)switch(_v0.b.$){
            case 'GraduateNoTsukuba':
                switch(_v0.a.$){
                    case 'SwitchSchool':
                        var _v4 = _v0.a;
                        return A3($elm$core$Tuple$mapBoth, $author$project$Component$University$School, $elm$core$List$map($author$project$Component$University$CmdBySchoolSelect), $author$project$Component$SchoolSelect$initNone);
                    case 'SwitchGraduateTsukuba':
                        var _v5 = _v0.a;
                        var graduate = _v0.b.a;
                        var _v6 = $author$project$Component$SchoolSelect$initNone;
                        var schoolSelectModel = _v6.a;
                        var schoolSelectCmd = _v6.b;
                        return _Utils_Tuple2($author$project$Component$University$GraduateTsukuba({
                            graduate: graduate,
                            school: schoolSelectModel
                        }), A2($elm$core$List$map, $author$project$Component$University$CmdBySchoolSelect, schoolSelectCmd));
                    case 'MsgByGraduate':
                        var graduateMsg = _v0.a.a;
                        var graduateModel = _v0.b.a;
                        return _Utils_Tuple2($author$project$Component$University$GraduateNoTsukuba(A2($author$project$Component$GraduateSelect$update, graduateMsg, graduateModel)), _List_Nil);
                    default:
                        break _v0$9;
                }
            case 'School':
                switch(_v0.a.$){
                    case 'SwitchGraduate':
                        var _v1 = _v0.a;
                        var schoolSelect = _v0.b.a;
                        var _v2 = $author$project$Component$GraduateSelect$initNone;
                        var graduateModel = _v2.a;
                        var graduateCmd = _v2.b;
                        return _Utils_Tuple2($author$project$Component$University$GraduateTsukuba({
                            graduate: graduateModel,
                            school: schoolSelect
                        }), A2($elm$core$List$map, $author$project$Component$University$CmdByGraduateSelect, graduateCmd));
                    case 'MsgBySchool':
                        var schoolMsg = _v0.a.a;
                        var school = _v0.b.a;
                        return _Utils_Tuple2($author$project$Component$University$School(A2($author$project$Component$SchoolSelect$update, schoolMsg, school)), _List_Nil);
                    default:
                        break _v0$9;
                }
            default:
                switch(_v0.a.$){
                    case 'SwitchSchool':
                        var _v3 = _v0.a;
                        var school = _v0.b.a.school;
                        return _Utils_Tuple2($author$project$Component$University$School(school), _List_Nil);
                    case 'SwitchGraduateNoTsukuba':
                        var _v7 = _v0.a;
                        var graduate = _v0.b.a.graduate;
                        return _Utils_Tuple2($author$project$Component$University$GraduateNoTsukuba(graduate), _List_Nil);
                    case 'MsgByGraduate':
                        var graduateMsg = _v0.a.a;
                        var rec = _v0.b.a;
                        return _Utils_Tuple2($author$project$Component$University$GraduateTsukuba(_Utils_update(rec, {
                            graduate: A2($author$project$Component$GraduateSelect$update, graduateMsg, rec.graduate)
                        })), _List_Nil);
                    case 'MsgBySchool':
                        var schoolMsg = _v0.a.a;
                        var rec = _v0.b.a;
                        return _Utils_Tuple2($author$project$Component$University$GraduateTsukuba(_Utils_update(rec, {
                            school: A2($author$project$Component$SchoolSelect$update, schoolMsg, rec.school)
                        })), _List_Nil);
                    default:
                        break _v0$9;
                }
        }
        return _Utils_Tuple2(model, _List_Nil);
    });
    var $author$project$Page$User$update = F2(function(msg, model) {
        switch(msg.$){
            case 'MsgToEditMode':
                if (model.$ === 'Normal') {
                    var userWithProfile = model.a;
                    return $author$project$Page$User$toEditMode(userWithProfile);
                } else return _Utils_Tuple2(model, _List_Nil);
            case 'MsgInputDisplayName':
                var nickName = msg.a;
                return _Utils_Tuple2(function() {
                    if (model.$ === 'Edit') {
                        var r = model.a;
                        return $author$project$Page$User$Edit(_Utils_update(r, {
                            displayName: $elm$core$String$trim(nickName)
                        }));
                    } else return model;
                }(), _List_Nil);
            case 'MsgInputIntroduction':
                var introduction = msg.a;
                return _Utils_Tuple2(function() {
                    if (model.$ === 'Edit') {
                        var r = model.a;
                        return $author$project$Page$User$Edit(_Utils_update(r, {
                            introduction: introduction
                        }));
                    } else return model;
                }(), _List_Nil);
            case 'MsgByUniversity':
                var componentMsg = msg.a;
                if (model.$ === 'Edit') {
                    var r = model.a;
                    var _v5 = A2($author$project$Component$University$update, componentMsg, r.university);
                    var componentModel = _v5.a;
                    var componentEmittions = _v5.b;
                    return _Utils_Tuple2($author$project$Page$User$Edit(_Utils_update(r, {
                        university: componentModel
                    })), A2($elm$core$List$map, $author$project$Page$User$CmdByUniversity, componentEmittions));
                } else return _Utils_Tuple2(model, _List_Nil);
            case 'MsgBackToViewMode':
                return _Utils_Tuple2(function() {
                    if (model.$ === 'Edit') {
                        var before = model.a.before;
                        return $author$project$Page$User$Normal(before);
                    } else return model;
                }(), _List_Nil);
            case 'MsgChangeProfile':
                var token = msg.a;
                var profile = msg.b;
                return _Utils_Tuple2(model, _List_fromArray([
                    A2($author$project$Page$User$CmdChangeProfile, token, profile)
                ]));
            case 'MsgChangeProfileResponse':
                var result = msg.a;
                if (result.$ === 'Ok') {
                    var profile = result.a;
                    return _Utils_Tuple2($author$project$Page$User$Normal(profile), _List_fromArray([
                        $author$project$Page$User$CmdAddLogMessage('ユーザー情報を更新しました')
                    ]));
                } else return _Utils_Tuple2(model, _List_fromArray([
                    $author$project$Page$User$CmdAddLogMessage('ユーザー情報を更新に失敗しました')
                ]));
            case 'MsgLogOut':
                return _Utils_Tuple2(model, _List_fromArray([
                    $author$project$Page$User$CmdLogOut
                ]));
            case 'MsgUserProfileResponse':
                var result = msg.a;
                var _v8 = _Utils_Tuple2(model, result);
                if (_v8.b.$ === 'Ok') switch(_v8.a.$){
                    case 'LoadingWithUserId':
                        var profile = _v8.b.a;
                        return _Utils_Tuple2($author$project$Page$User$Normal(profile), _List_Nil);
                    case 'LoadingWithUserIdAndName':
                        var profile = _v8.b.a;
                        return _Utils_Tuple2($author$project$Page$User$Normal(profile), _List_Nil);
                    default:
                        return _Utils_Tuple2(model, _List_Nil);
                }
                else {
                    var string = _v8.b.a;
                    return _Utils_Tuple2(model, _List_fromArray([
                        $author$project$Page$User$CmdAddLogMessage('ユーザー情報の取得に失敗しました ' + string)
                    ]));
                }
            default:
                var token = msg.a;
                return _Utils_Tuple2(model, _List_fromArray([
                    $author$project$Page$User$CmdJumpToLineNotifySetting(token)
                ]));
        }
    });
    var $author$project$Page$Product$LikeResponse = function(a) {
        return {
            $: 'LikeResponse',
            a: a
        };
    };
    var $author$project$Page$BoughtProducts$MsgByProductList = function(a) {
        return {
            $: 'MsgByProductList',
            a: a
        };
    };
    var $author$project$Page$History$MsgByProductList = function(a) {
        return {
            $: 'MsgByProductList',
            a: a
        };
    };
    var $author$project$Page$Home$MsgByProductList = function(a) {
        return {
            $: 'MsgByProductList',
            a: a
        };
    };
    var $author$project$Page$LikedProducts$MsgByProductList = function(a) {
        return {
            $: 'MsgByProductList',
            a: a
        };
    };
    var $author$project$Page$SoldProducts$MsgByProductList = function(a) {
        return {
            $: 'MsgByProductList',
            a: a
        };
    };
    var $author$project$Component$ProductList$UpdateLikedCountResponse = F2(function(a, b) {
        return {
            $: 'UpdateLikedCountResponse',
            a: a,
            b: b
        };
    });
    var $author$project$Page$BoughtProducts$CmdAddLogMessage = function(a) {
        return {
            $: 'CmdAddLogMessage',
            a: a
        };
    };
    var $author$project$Page$BoughtProducts$CmdByLogIn = function(a) {
        return {
            $: 'CmdByLogIn',
            a: a
        };
    };
    var $author$project$Page$BoughtProducts$Error = {
        $: 'Error'
    };
    var $author$project$Page$BoughtProducts$Normal = function(a) {
        return {
            $: 'Normal',
            a: a
        };
    };
    var $author$project$Component$ProductList$CmdLike = F2(function(a, b) {
        return {
            $: 'CmdLike',
            a: a,
            b: b
        };
    });
    var $author$project$Component$ProductList$CmdUnlike = F2(function(a, b) {
        return {
            $: 'CmdUnlike',
            a: a,
            b: b
        };
    });
    var $elm$core$Set$remove = F2(function(key, _v0) {
        var dict = _v0.a;
        return $elm$core$Set$Set_elm_builtin(A2($elm$core$Dict$remove, key, dict));
    });
    var $author$project$Component$ProductList$update = F2(function(msg, _v0) {
        var rec = _v0.a;
        switch(msg.$){
            case 'Like':
                var token = msg.a;
                var productId = msg.b;
                return _Utils_Tuple2($author$project$Component$ProductList$Model(_Utils_update(rec, {
                    likeUpdating: A2($elm$core$Set$insert, $author$project$Data$Product$idToString(productId), rec.likeUpdating)
                })), _List_fromArray([
                    A2($author$project$Component$ProductList$CmdLike, token, productId)
                ]));
            case 'UnLike':
                var token = msg.a;
                var productId = msg.b;
                return _Utils_Tuple2($author$project$Component$ProductList$Model(_Utils_update(rec, {
                    likeUpdating: A2($elm$core$Set$insert, $author$project$Data$Product$idToString(productId), rec.likeUpdating)
                })), _List_fromArray([
                    A2($author$project$Component$ProductList$CmdUnlike, token, productId)
                ]));
            default:
                var productId = msg.a;
                return _Utils_Tuple2($author$project$Component$ProductList$Model(_Utils_update(rec, {
                    likeUpdating: A2($elm$core$Set$remove, $author$project$Data$Product$idToString(productId), rec.likeUpdating)
                })), _List_Nil);
        }
    });
    var $author$project$Page$BoughtProducts$update = F2(function(msg, _v0) {
        var rec = _v0.a;
        switch(msg.$){
            case 'GetResponse':
                var result = msg.a;
                if (result.$ === 'Ok') {
                    var products = result.a;
                    return _Utils_Tuple2($author$project$Page$BoughtProducts$Model(_Utils_update(rec, {
                        normal: $author$project$Page$BoughtProducts$Normal(products)
                    })), _List_Nil);
                } else {
                    var errorMessage = result.a;
                    return _Utils_Tuple2($author$project$Page$BoughtProducts$Model(_Utils_update(rec, {
                        normal: $author$project$Page$BoughtProducts$Error
                    })), _List_fromArray([
                        $author$project$Page$BoughtProducts$CmdAddLogMessage('商品の取得に失敗 ' + errorMessage)
                    ]));
                }
            case 'MsgByLogIn':
                var logInOrSignUpMsg = msg.a;
                var _v3 = A2($author$project$Component$LogIn$update, logInOrSignUpMsg, rec.logIn);
                var newModel = _v3.a;
                var cmdList = _v3.b;
                return _Utils_Tuple2($author$project$Page$BoughtProducts$Model(_Utils_update(rec, {
                    logIn: newModel
                })), A2($elm$core$List$map, $author$project$Page$BoughtProducts$CmdByLogIn, cmdList));
            default:
                var productListMsg = msg.a;
                var _v4 = A2($author$project$Component$ProductList$update, productListMsg, rec.productList);
                var newModel = _v4.a;
                var cmds = _v4.b;
                return _Utils_Tuple2(function() {
                    if (productListMsg.$ === 'UpdateLikedCountResponse' && productListMsg.b.$ === 'Ok') {
                        var id = productListMsg.a;
                        return $author$project$Page$BoughtProducts$Model(_Utils_update(rec, {
                            productList: newModel
                        }));
                    } else return $author$project$Page$BoughtProducts$Model(_Utils_update(rec, {
                        productList: newModel
                    }));
                }(), A2($elm$core$List$map, $author$project$Page$BoughtProducts$CmdByProductList, cmds));
        }
    });
    var $author$project$Page$History$CmdAddLogMessage = function(a) {
        return {
            $: 'CmdAddLogMessage',
            a: a
        };
    };
    var $author$project$Page$History$CmdByLogIn = function(a) {
        return {
            $: 'CmdByLogIn',
            a: a
        };
    };
    var $author$project$Page$History$Error = {
        $: 'Error'
    };
    var $author$project$Page$History$Normal = function(a) {
        return {
            $: 'Normal',
            a: a
        };
    };
    var $author$project$Page$History$update = F2(function(msg, _v0) {
        var rec = _v0.a;
        switch(msg.$){
            case 'GetProductsResponse':
                var result = msg.a;
                if (result.$ === 'Ok') {
                    var products = result.a;
                    return _Utils_Tuple2($author$project$Page$History$Model(_Utils_update(rec, {
                        normal: $author$project$Page$History$Normal(products)
                    })), _List_Nil);
                } else {
                    var errorMessage = result.a;
                    return _Utils_Tuple2($author$project$Page$History$Model(_Utils_update(rec, {
                        normal: $author$project$Page$History$Error
                    })), _List_fromArray([
                        $author$project$Page$History$CmdAddLogMessage('閲覧履歴の取得に失敗 ' + errorMessage)
                    ]));
                }
            case 'MsgByLogIn':
                var logInOrSignUpMsg = msg.a;
                var _v3 = A2($author$project$Component$LogIn$update, logInOrSignUpMsg, rec.logIn);
                var newModel = _v3.a;
                var cmdList = _v3.b;
                return _Utils_Tuple2($author$project$Page$History$Model(_Utils_update(rec, {
                    logIn: newModel
                })), A2($elm$core$List$map, $author$project$Page$History$CmdByLogIn, cmdList));
            default:
                var productListMsg = msg.a;
                var _v4 = A2($author$project$Component$ProductList$update, productListMsg, rec.productList);
                var newModel = _v4.a;
                var cmdList = _v4.b;
                return _Utils_Tuple2($author$project$Page$History$Model(_Utils_update(rec, {
                    productList: newModel
                })), A2($elm$core$List$map, $author$project$Page$History$CmdByProductList, cmdList));
        }
    });
    var $author$project$Page$Home$update = F2(function(msg, _v0) {
        var rec = _v0.a;
        if (msg.$ === 'SelectTab') {
            var tabSelect = msg.a;
            return _Utils_Tuple2($author$project$Page$Home$Model(_Utils_update(rec, {
                tabSelect: tabSelect
            })), _List_Nil);
        } else {
            var productListMsg = msg.a;
            var _v2 = A2($author$project$Component$ProductList$update, productListMsg, rec.productListModel);
            var newModel = _v2.a;
            var cmdList = _v2.b;
            return _Utils_Tuple2($author$project$Page$Home$Model(_Utils_update(rec, {
                productListModel: newModel
            })), A2($elm$core$List$map, $author$project$Page$Home$CmdProducts, cmdList));
        }
    });
    var $author$project$Page$LikedProducts$CmdAddLogMessage = function(a) {
        return {
            $: 'CmdAddLogMessage',
            a: a
        };
    };
    var $author$project$Page$LikedProducts$CmdByLogIn = function(a) {
        return {
            $: 'CmdByLogIn',
            a: a
        };
    };
    var $author$project$Page$LikedProducts$Error = {
        $: 'Error'
    };
    var $author$project$Page$LikedProducts$Normal = function(a) {
        return {
            $: 'Normal',
            a: a
        };
    };
    var $author$project$Page$LikedProducts$update = F2(function(msg, _v0) {
        var rec = _v0.a;
        switch(msg.$){
            case 'GetProductsResponse':
                var result = msg.a;
                if (result.$ === 'Ok') {
                    var products = result.a;
                    return _Utils_Tuple2($author$project$Page$LikedProducts$Model(_Utils_update(rec, {
                        normal: $author$project$Page$LikedProducts$Normal(products)
                    })), _List_Nil);
                } else {
                    var errorMessage = result.a;
                    return _Utils_Tuple2($author$project$Page$LikedProducts$Model(_Utils_update(rec, {
                        normal: $author$project$Page$LikedProducts$Error
                    })), _List_fromArray([
                        $author$project$Page$LikedProducts$CmdAddLogMessage('いいねした商品の取得に失敗 ' + errorMessage)
                    ]));
                }
            case 'MsgByLogIn':
                var logInOrSignUpMsg = msg.a;
                var _v3 = A2($author$project$Component$LogIn$update, logInOrSignUpMsg, rec.logIn);
                var newModel = _v3.a;
                var cmdList = _v3.b;
                return _Utils_Tuple2($author$project$Page$LikedProducts$Model(_Utils_update(rec, {
                    logIn: newModel
                })), A2($elm$core$List$map, $author$project$Page$LikedProducts$CmdByLogIn, cmdList));
            default:
                var productListMsg = msg.a;
                var _v4 = A2($author$project$Component$ProductList$update, productListMsg, rec.productList);
                var newModel = _v4.a;
                var cmdList = _v4.b;
                return _Utils_Tuple2($author$project$Page$LikedProducts$Model(_Utils_update(rec, {
                    productList: newModel
                })), A2($elm$core$List$map, $author$project$Page$LikedProducts$CmdByProductList, cmdList));
        }
    });
    var $author$project$Page$SoldProducts$CmdAddLogMessage = function(a) {
        return {
            $: 'CmdAddLogMessage',
            a: a
        };
    };
    var $author$project$Page$SoldProducts$Error = {
        $: 'Error'
    };
    var $author$project$Page$SoldProducts$Normal = function(a) {
        return {
            $: 'Normal',
            a: a
        };
    };
    var $author$project$Page$SoldProducts$update = F2(function(msg, _v0) {
        var rec = _v0.a;
        if (msg.$ === 'GetSoldProductListResponse') {
            var result = msg.a;
            if (result.$ === 'Ok') {
                var soldProductList = result.a;
                return _Utils_Tuple2($author$project$Page$SoldProducts$Model(_Utils_update(rec, {
                    normal: $author$project$Page$SoldProducts$Normal(soldProductList)
                })), _List_Nil);
            } else {
                var errorMessage = result.a;
                return _Utils_Tuple2($author$project$Page$SoldProducts$Model(_Utils_update(rec, {
                    normal: $author$project$Page$SoldProducts$Error
                })), _List_fromArray([
                    $author$project$Page$SoldProducts$CmdAddLogMessage(errorMessage)
                ]));
            }
        } else {
            var productListMsg = msg.a;
            var _v3 = A2($author$project$Component$ProductList$update, productListMsg, rec.productList);
            var newModel = _v3.a;
            var cmdList = _v3.b;
            return _Utils_Tuple2($author$project$Page$SoldProducts$Model(_Utils_update(rec, {
                productList: newModel
            })), A2($elm$core$List$map, $author$project$Page$SoldProducts$CmdByProductList, cmdList));
        }
    });
    var $author$project$Main$updateLikedCountInEachPageProduct = F5(function(key, productId, allProductsMaybe, result, page) {
        var productListMsg = A2($author$project$Component$ProductList$UpdateLikedCountResponse, productId, result);
        switch(page.$){
            case 'PageHome':
                var msg = page.a;
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageHome, $author$project$Main$homePageCmdToCmd, A2($author$project$Page$Home$update, $author$project$Page$Home$MsgByProductList(productListMsg), msg));
            case 'PageLikedProducts':
                var msg = page.a;
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageLikedProducts, $author$project$Main$likedProductsCmdToCmd, A2($author$project$Page$LikedProducts$update, $author$project$Page$LikedProducts$MsgByProductList(productListMsg), msg));
            case 'PageHistory':
                var msg = page.a;
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageHistory, $author$project$Main$historyCmdToCmd, A2($author$project$Page$History$update, $author$project$Page$History$MsgByProductList(productListMsg), msg));
            case 'PageSoldProducts':
                var msg = page.a;
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageSoldProducts, $author$project$Main$soldProductsPageCmdToCmd, A2($author$project$Page$SoldProducts$update, $author$project$Page$SoldProducts$MsgByProductList(productListMsg), msg));
            case 'PageBoughtProducts':
                var msg = page.a;
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageBoughtProducts, $author$project$Main$boughtProductsPageCmdToCmd, A2($author$project$Page$BoughtProducts$update, $author$project$Page$BoughtProducts$MsgByProductList(productListMsg), msg));
            case 'PageProduct':
                var msg = page.a;
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageProduct, $author$project$Main$productPageCmdToCmd(key), A3($author$project$Page$Product$update, allProductsMaybe, $author$project$Page$Product$LikeResponse(result), msg));
            default:
                return _Utils_Tuple2(page, $elm$core$Platform$Cmd$none);
        }
    });
    var $author$project$Page$CommentedProducts$CmdAddLogMessage = function(a) {
        return {
            $: 'CmdAddLogMessage',
            a: a
        };
    };
    var $author$project$Page$CommentedProducts$CmdByLogIn = function(a) {
        return {
            $: 'CmdByLogIn',
            a: a
        };
    };
    var $author$project$Page$CommentedProducts$Error = {
        $: 'Error'
    };
    var $author$project$Page$CommentedProducts$Normal = function(a) {
        return {
            $: 'Normal',
            a: a
        };
    };
    var $author$project$Page$CommentedProducts$update = F2(function(msg, _v0) {
        var rec = _v0.a;
        switch(msg.$){
            case 'GetProductsResponse':
                var result = msg.a;
                if (result.$ === 'Ok') {
                    var products = result.a;
                    return _Utils_Tuple2($author$project$Page$CommentedProducts$Model(_Utils_update(rec, {
                        normal: $author$project$Page$CommentedProducts$Normal(products)
                    })), _List_Nil);
                } else {
                    var errorMessage = result.a;
                    return _Utils_Tuple2($author$project$Page$CommentedProducts$Model(_Utils_update(rec, {
                        normal: $author$project$Page$CommentedProducts$Error
                    })), _List_fromArray([
                        $author$project$Page$CommentedProducts$CmdAddLogMessage('コメントした商品の取得に失敗 ' + errorMessage)
                    ]));
                }
            case 'MsgByLogIn':
                var logInOrSignUpMsg = msg.a;
                var _v3 = A2($author$project$Component$LogIn$update, logInOrSignUpMsg, rec.logIn);
                var newModel = _v3.a;
                var cmdList = _v3.b;
                return _Utils_Tuple2($author$project$Page$CommentedProducts$Model(_Utils_update(rec, {
                    logIn: newModel
                })), A2($elm$core$List$map, $author$project$Page$CommentedProducts$CmdByLogIn, cmdList));
            default:
                var productListMsg = msg.a;
                var _v4 = A2($author$project$Component$ProductList$update, productListMsg, rec.productList);
                var newModel = _v4.a;
                var cmdList = _v4.b;
                return _Utils_Tuple2($author$project$Page$CommentedProducts$Model(_Utils_update(rec, {
                    productList: newModel
                })), A2($elm$core$List$map, $author$project$Page$CommentedProducts$CmdByProductList, cmdList));
        }
    });
    var $author$project$Page$LogIn$LogInOrSignUpCmd = function(a) {
        return {
            $: 'LogInOrSignUpCmd',
            a: a
        };
    };
    var $author$project$Page$LogIn$update = F2(function(msg, _v0) {
        var logInOrSignUpModel = _v0.a;
        var logInOrSignUpMsg = msg.a;
        return A3($elm$core$Tuple$mapBoth, $author$project$Page$LogIn$Model, function(e) {
            return A2($elm$core$List$map, $author$project$Page$LogIn$LogInOrSignUpCmd, e);
        }, A2($author$project$Component$LogIn$update, logInOrSignUpMsg, logInOrSignUpModel));
    });
    var $author$project$Page$Notification$update = F2(function(msg, model) {
        return _Utils_Tuple2(model, _List_Nil);
    });
    var $author$project$Page$Search$CmdByGraduateSelect = function(a) {
        return {
            $: 'CmdByGraduateSelect',
            a: a
        };
    };
    var $author$project$Page$Search$Graduate = function(a) {
        return {
            $: 'Graduate',
            a: a
        };
    };
    var $author$project$Page$Search$update = F2(function(msg, _v0) {
        var rec = _v0.a;
        switch(msg.$){
            case 'InputQuery':
                var string = msg.a;
                return _Utils_Tuple2($author$project$Page$Search$Model(_Utils_update(rec, {
                    query: string
                })), _List_Nil);
            case 'SelectSchoolOrDepartment':
                var _v2 = $author$project$Component$SchoolSelect$initNone;
                var schoolModel = _v2.a;
                var schoolCmd = _v2.b;
                return _Utils_Tuple2($author$project$Page$Search$Model(_Utils_update(rec, {
                    universitySelect: $author$project$Page$Search$School(schoolModel)
                })), A2($elm$core$List$map, $author$project$Page$Search$CmdBySchoolSelect, schoolCmd));
            case 'SelectGraduate':
                var _v3 = $author$project$Component$GraduateSelect$initNone;
                var graduateModel = _v3.a;
                var graduateCmd = _v3.b;
                return _Utils_Tuple2($author$project$Page$Search$Model(_Utils_update(rec, {
                    universitySelect: $author$project$Page$Search$Graduate(graduateModel)
                })), A2($elm$core$List$map, $author$project$Page$Search$CmdByGraduateSelect, graduateCmd));
            case 'MsgByCategory':
                var categoryMsg = msg.a;
                return _Utils_Tuple2($author$project$Page$Search$Model(_Utils_update(rec, {
                    categorySelect: A2($author$project$Component$Category$update, categoryMsg, rec.categorySelect)
                })), _List_Nil);
            case 'MsgBySchoolSelect':
                var schoolSelectMsg = msg.a;
                var _v4 = rec.universitySelect;
                if (_v4.$ === 'School') {
                    var schoolModel = _v4.a;
                    return _Utils_Tuple2($author$project$Page$Search$Model(_Utils_update(rec, {
                        universitySelect: $author$project$Page$Search$School(A2($author$project$Component$SchoolSelect$update, schoolSelectMsg, schoolModel))
                    })), _List_Nil);
                } else return _Utils_Tuple2($author$project$Page$Search$Model(rec), _List_Nil);
            default:
                var graduateMsg = msg.a;
                var _v5 = rec.universitySelect;
                if (_v5.$ === 'School') return _Utils_Tuple2($author$project$Page$Search$Model(rec), _List_Nil);
                else {
                    var graduateModel = _v5.a;
                    return _Utils_Tuple2($author$project$Page$Search$Model(_Utils_update(rec, {
                        universitySelect: $author$project$Page$Search$Graduate(A2($author$project$Component$GraduateSelect$update, graduateMsg, graduateModel))
                    })), _List_Nil);
                }
        }
    });
    var $author$project$Page$SearchResult$update = F2(function(msg, _v0) {
        var rec = _v0.a;
        var productListMsg = msg.a;
        var _v2 = A2($author$project$Component$ProductList$update, productListMsg, rec.productList);
        var newModel = _v2.a;
        var cmdList = _v2.b;
        return _Utils_Tuple2($author$project$Page$SearchResult$Model(_Utils_update(rec, {
            productList: newModel
        })), A2($elm$core$List$map, $author$project$Page$SearchResult$CommandByProductList, cmdList));
    });
    var $author$project$Page$Trade$Cancel = {
        $: 'Cancel'
    };
    var $author$project$Page$Trade$CmdAddComment = F3(function(a, b, c) {
        return {
            $: 'CmdAddComment',
            a: a,
            b: b,
            c: c
        };
    });
    var $author$project$Page$Trade$CmdAddLogMessage = function(a) {
        return {
            $: 'CmdAddLogMessage',
            a: a
        };
    };
    var $author$project$Page$Trade$CmdCancelTrade = F2(function(a, b) {
        return {
            $: 'CmdCancelTrade',
            a: a,
            b: b
        };
    });
    var $author$project$Page$Trade$CmdFinishTrade = F2(function(a, b) {
        return {
            $: 'CmdFinishTrade',
            a: a,
            b: b
        };
    });
    var $author$project$Page$Trade$CmdReplaceElementText = function(a) {
        return {
            $: 'CmdReplaceElementText',
            a: a
        };
    };
    var $author$project$Page$Trade$CmdUpdateNowTime = {
        $: 'CmdUpdateNowTime'
    };
    var $author$project$Page$Trade$Comment = {
        $: 'Comment'
    };
    var $author$project$Page$Trade$Finish = {
        $: 'Finish'
    };
    var $author$project$Page$Trade$Main = function(a) {
        return {
            $: 'Main',
            a: a
        };
    };
    var $author$project$Page$Trade$commentTextAreaId = 'comment-text-area';
    var $author$project$Data$Trade$getStatus = function(_v0) {
        var status = _v0.a.status;
        return status;
    };
    var $author$project$Page$Trade$update = F2(function(msg, model) {
        var _v0 = _Utils_Tuple2(msg, model);
        _v0$7: while(true)if (_v0.b.$ === 'Main') switch(_v0.a.$){
            case 'InputComment':
                var string = _v0.a.a;
                var rec = _v0.b.a;
                return _Utils_Tuple2($author$project$Page$Trade$Main(_Utils_update(rec, {
                    commentInput: string
                })), _List_Nil);
            case 'AddComment':
                var token = _v0.a.a;
                var rec = _v0.b.a;
                var _v1 = rec.sending;
                if (_v1.$ === 'Just') return _Utils_Tuple2(model, _List_fromArray([
                    $author$project$Page$Trade$CmdAddLogMessage('同時に複数のリクエストをすることはできません')
                ]));
                else return _Utils_Tuple2($author$project$Page$Trade$Main(_Utils_update(rec, {
                    sending: $elm$core$Maybe$Just($author$project$Page$Trade$Comment)
                })), _List_fromArray([
                    A3($author$project$Page$Trade$CmdAddComment, token, $author$project$Data$Trade$getId(rec.trade), rec.commentInput)
                ]));
            case 'FinishTrade':
                var token = _v0.a.a;
                var rec = _v0.b.a;
                var _v2 = rec.sending;
                if (_v2.$ === 'Just') return _Utils_Tuple2(model, _List_fromArray([
                    $author$project$Page$Trade$CmdAddLogMessage('同時に複数のリクエストをすることはできません')
                ]));
                else return _Utils_Tuple2($author$project$Page$Trade$Main(_Utils_update(rec, {
                    sending: $elm$core$Maybe$Just($author$project$Page$Trade$Finish)
                })), _List_fromArray([
                    A2($author$project$Page$Trade$CmdFinishTrade, token, $author$project$Data$Trade$getId(rec.trade))
                ]));
            case 'CancelTrade':
                var token = _v0.a.a;
                var rec = _v0.b.a;
                var _v3 = rec.sending;
                if (_v3.$ === 'Just') return _Utils_Tuple2(model, _List_fromArray([
                    $author$project$Page$Trade$CmdAddLogMessage('同時に複数のリクエストをすることはできません')
                ]));
                else return _Utils_Tuple2($author$project$Page$Trade$Main(_Utils_update(rec, {
                    sending: $elm$core$Maybe$Just($author$project$Page$Trade$Cancel)
                })), _List_fromArray([
                    A2($author$project$Page$Trade$CmdCancelTrade, token, $author$project$Data$Trade$getId(rec.trade))
                ]));
            case 'FinishTradeResponse':
                var result = _v0.a.a;
                var rec = _v0.b.a;
                if (result.$ === 'Ok') {
                    var _v5 = result.a;
                    var trade = _v5.a;
                    var comments = _v5.b;
                    return _Utils_Tuple2($author$project$Page$Trade$Main({
                        commentInput: '',
                        comments: $elm$core$Maybe$Just(comments),
                        sending: $elm$core$Maybe$Nothing,
                        trade: trade
                    }), _List_fromArray([
                        $author$project$Page$Trade$CmdReplaceElementText({
                            id: $author$project$Page$Trade$commentTextAreaId,
                            text: ''
                        }),
                        $author$project$Page$Trade$CmdAddLogMessage(function() {
                            var _v6 = $author$project$Data$Trade$getStatus(trade);
                            if (_v6.$ === 'Finish') return '取引を完了しました';
                            else return '相手の回答を待ちます';
                        }())
                    ]));
                } else {
                    var errMsg = result.a;
                    return _Utils_Tuple2($author$project$Page$Trade$Main(_Utils_update(rec, {
                        sending: $elm$core$Maybe$Nothing
                    })), _List_fromArray([
                        $author$project$Page$Trade$CmdAddLogMessage('取引の完了に失敗 ' + errMsg)
                    ]));
                }
            case 'CancelTradeResponse':
                var result = _v0.a.a;
                var rec = _v0.b.a;
                if (result.$ === 'Ok') {
                    var _v8 = result.a;
                    var trade = _v8.a;
                    var comments = _v8.b;
                    return _Utils_Tuple2($author$project$Page$Trade$Main({
                        commentInput: '',
                        comments: $elm$core$Maybe$Just(comments),
                        sending: $elm$core$Maybe$Nothing,
                        trade: trade
                    }), _List_fromArray([
                        $author$project$Page$Trade$CmdReplaceElementText({
                            id: $author$project$Page$Trade$commentTextAreaId,
                            text: ''
                        }),
                        $author$project$Page$Trade$CmdAddLogMessage('取引をキャンセルしました'),
                        $author$project$Page$Trade$CmdUpdateNowTime
                    ]));
                } else {
                    var errMsg = result.a;
                    return _Utils_Tuple2($author$project$Page$Trade$Main(_Utils_update(rec, {
                        sending: $elm$core$Maybe$Nothing
                    })), _List_fromArray([
                        $author$project$Page$Trade$CmdAddLogMessage('取引のキャンセルに失敗 ' + errMsg)
                    ]));
                }
            case 'AddCommentResponse':
                var result = _v0.a.a;
                var rec = _v0.b.a;
                if (result.$ === 'Ok') {
                    var _v10 = result.a;
                    var trade = _v10.a;
                    var comments = _v10.b;
                    return _Utils_Tuple2($author$project$Page$Trade$Main({
                        commentInput: '',
                        comments: $elm$core$Maybe$Just(comments),
                        sending: $elm$core$Maybe$Nothing,
                        trade: trade
                    }), _List_fromArray([
                        $author$project$Page$Trade$CmdReplaceElementText({
                            id: $author$project$Page$Trade$commentTextAreaId,
                            text: ''
                        }),
                        $author$project$Page$Trade$CmdUpdateNowTime
                    ]));
                } else {
                    var errMsg = result.a;
                    return _Utils_Tuple2($author$project$Page$Trade$Main(_Utils_update(rec, {
                        sending: $elm$core$Maybe$Nothing
                    })), _List_fromArray([
                        $author$project$Page$Trade$CmdAddLogMessage('コメントの追加に失敗 ' + errMsg)
                    ]));
                }
            default:
                break _v0$7;
        }
        else {
            if (_v0.a.$ === 'TradeResponse') break _v0$7;
            else return _Utils_Tuple2(model, _List_fromArray([
                $author$project$Page$Trade$CmdAddLogMessage('取引の関係者かどうか調べているときに取引に関する結果を受け取ってしまった')
            ]));
        }
        var result = _v0.a.a;
        if (result.$ === 'Ok') {
            var _v12 = result.a;
            var trade = _v12.a;
            var comments = _v12.b;
            return _Utils_Tuple2($author$project$Page$Trade$Main({
                commentInput: '',
                comments: $elm$core$Maybe$Just(comments),
                sending: $elm$core$Maybe$Nothing,
                trade: trade
            }), _List_fromArray([
                $author$project$Page$Trade$CmdReplaceElementText({
                    id: $author$project$Page$Trade$commentTextAreaId,
                    text: ''
                }),
                $author$project$Page$Trade$CmdUpdateNowTime
            ]));
        } else {
            var errMsg = result.a;
            return _Utils_Tuple2(function() {
                if (model.$ === 'Main') {
                    var rec = model.a;
                    return $author$project$Page$Trade$Main(_Utils_update(rec, {
                        sending: $elm$core$Maybe$Nothing
                    }));
                } else return model;
            }(), _List_fromArray([
                $author$project$Page$Trade$CmdAddLogMessage('取引の情報の取得に失敗 ' + errMsg)
            ]));
        }
    });
    var $author$project$Page$TradesInPast$CmdAddLogMessage = function(a) {
        return {
            $: 'CmdAddLogMessage',
            a: a
        };
    };
    var $author$project$Page$TradesInPast$CmdByLogIn = function(a) {
        return {
            $: 'CmdByLogIn',
            a: a
        };
    };
    var $author$project$Page$TradesInPast$Error = {
        $: 'Error'
    };
    var $author$project$Page$TradesInPast$Normal = function(a) {
        return {
            $: 'Normal',
            a: a
        };
    };
    var $author$project$Page$TradesInPast$update = F2(function(msg, _v0) {
        var rec = _v0.a;
        if (msg.$ === 'GetTradesResponse') {
            var result = msg.a;
            if (result.$ === 'Ok') {
                var products = result.a;
                return _Utils_Tuple2($author$project$Page$TradesInPast$Model(_Utils_update(rec, {
                    normal: $author$project$Page$TradesInPast$Normal(products)
                })), _List_Nil);
            } else {
                var errorMessage = result.a;
                return _Utils_Tuple2($author$project$Page$TradesInPast$Model(_Utils_update(rec, {
                    normal: $author$project$Page$TradesInPast$Error
                })), _List_fromArray([
                    $author$project$Page$TradesInPast$CmdAddLogMessage('取引した商品の取得に失敗 ' + errorMessage)
                ]));
            }
        } else {
            var logInOrSignUpMsg = msg.a;
            var _v3 = A2($author$project$Component$LogIn$update, logInOrSignUpMsg, rec.logIn);
            var newModel = _v3.a;
            var cmdList = _v3.b;
            return _Utils_Tuple2($author$project$Page$TradesInPast$Model(_Utils_update(rec, {
                logIn: newModel
            })), A2($elm$core$List$map, $author$project$Page$TradesInPast$CmdByLogIn, cmdList));
        }
    });
    var $author$project$Page$TradesInProgress$CmdAddLogMessage = function(a) {
        return {
            $: 'CmdAddLogMessage',
            a: a
        };
    };
    var $author$project$Page$TradesInProgress$CmdByLogIn = function(a) {
        return {
            $: 'CmdByLogIn',
            a: a
        };
    };
    var $author$project$Page$TradesInProgress$Error = {
        $: 'Error'
    };
    var $author$project$Page$TradesInProgress$Normal = function(a) {
        return {
            $: 'Normal',
            a: a
        };
    };
    var $author$project$Page$TradesInProgress$update = F2(function(msg, _v0) {
        var rec = _v0.a;
        if (msg.$ === 'GetProductsResponse') {
            var result = msg.a;
            if (result.$ === 'Ok') {
                var products = result.a;
                return _Utils_Tuple2($author$project$Page$TradesInProgress$Model(_Utils_update(rec, {
                    normal: $author$project$Page$TradesInProgress$Normal(products)
                })), _List_Nil);
            } else {
                var errorMessage = result.a;
                return _Utils_Tuple2($author$project$Page$TradesInProgress$Model(_Utils_update(rec, {
                    normal: $author$project$Page$TradesInProgress$Error
                })), _List_fromArray([
                    $author$project$Page$TradesInProgress$CmdAddLogMessage('取引中の商品の取得に失敗 ' + errorMessage)
                ]));
            }
        } else {
            var logInOrSignUpMsg = msg.a;
            var _v3 = A2($author$project$Component$LogIn$update, logInOrSignUpMsg, rec.logIn);
            var newModel = _v3.a;
            var cmdList = _v3.b;
            return _Utils_Tuple2($author$project$Page$TradesInProgress$Model(_Utils_update(rec, {
                logIn: newModel
            })), A2($elm$core$List$map, $author$project$Page$TradesInProgress$CmdByLogIn, cmdList));
        }
    });
    var $author$project$Main$updatePageMsg = F3(function(allProductsMaybe, pageMsg, _v0) {
        var rec = _v0.a;
        var _v1 = _Utils_Tuple2(pageMsg, rec.page);
        _v1$16: while(true)switch(_v1.a.$){
            case 'PageMsgHome':
                if (_v1.b.$ === 'PageHome') {
                    var msg = _v1.a.a;
                    var model = _v1.b.a;
                    return A3($author$project$Main$mapPageModel, $author$project$Main$PageHome, $author$project$Main$homePageCmdToCmd, A2($author$project$Page$Home$update, msg, model));
                } else break _v1$16;
            case 'PageMsgLikedProducts':
                if (_v1.b.$ === 'PageLikedProducts') {
                    var msg = _v1.a.a;
                    var model = _v1.b.a;
                    return A3($author$project$Main$mapPageModel, $author$project$Main$PageLikedProducts, $author$project$Main$likedProductsCmdToCmd, A2($author$project$Page$LikedProducts$update, msg, model));
                } else break _v1$16;
            case 'PageMsgHistory':
                if (_v1.b.$ === 'PageHistory') {
                    var msg = _v1.a.a;
                    var model = _v1.b.a;
                    return A3($author$project$Main$mapPageModel, $author$project$Main$PageHistory, $author$project$Main$historyCmdToCmd, A2($author$project$Page$History$update, msg, model));
                } else break _v1$16;
            case 'PageMsgSoldProducts':
                if (_v1.b.$ === 'PageSoldProducts') {
                    var msg = _v1.a.a;
                    var model = _v1.b.a;
                    return A3($author$project$Main$mapPageModel, $author$project$Main$PageSoldProducts, $author$project$Main$soldProductsPageCmdToCmd, A2($author$project$Page$SoldProducts$update, msg, model));
                } else break _v1$16;
            case 'PageMsgBoughtProducts':
                if (_v1.b.$ === 'PageBoughtProducts') {
                    var msg = _v1.a.a;
                    var model = _v1.b.a;
                    return A3($author$project$Main$mapPageModel, $author$project$Main$PageBoughtProducts, $author$project$Main$boughtProductsPageCmdToCmd, A2($author$project$Page$BoughtProducts$update, msg, model));
                } else break _v1$16;
            case 'PageMsgTradesInProgress':
                if (_v1.b.$ === 'PageTradesInProgress') {
                    var msg = _v1.a.a;
                    var model = _v1.b.a;
                    return A3($author$project$Main$mapPageModel, $author$project$Main$PageTradesInProgress, $author$project$Main$tradingProductsCmdToCmd, A2($author$project$Page$TradesInProgress$update, msg, model));
                } else break _v1$16;
            case 'PageMsgTradesInPast':
                if (_v1.b.$ === 'PageTradesInPast') {
                    var msg = _v1.a.a;
                    var model = _v1.b.a;
                    return A3($author$project$Main$mapPageModel, $author$project$Main$PageTradesInPast, $author$project$Main$tradedProductsCmdToCmd, A2($author$project$Page$TradesInPast$update, msg, model));
                } else break _v1$16;
            case 'PageMsgCommentedProducts':
                if (_v1.b.$ === 'PageCommentedProducts') {
                    var msg = _v1.a.a;
                    var model = _v1.b.a;
                    return A3($author$project$Main$mapPageModel, $author$project$Main$PageCommentedProducts, $author$project$Main$commentedProductsCmdToCmd, A2($author$project$Page$CommentedProducts$update, msg, model));
                } else break _v1$16;
            case 'PageMsgLogIn':
                if (_v1.b.$ === 'PageLogIn') {
                    var msg = _v1.a.a;
                    var model = _v1.b.a;
                    return A3($author$project$Main$mapPageModel, $author$project$Main$PageLogIn, $author$project$Main$logInPageCmdToCmd(rec.key), A2($author$project$Page$LogIn$update, msg, model));
                } else break _v1$16;
            case 'PageMsgExhibition':
                if (_v1.b.$ === 'PageExhibition') {
                    var msg = _v1.a.a;
                    var model = _v1.b.a;
                    return A3($author$project$Main$mapPageModel, $author$project$Main$PageExhibition, $author$project$Main$exhibitionPageCmdToCmd(rec.key), A3($author$project$Page$Exhibition$update, rec.logInState, msg, model));
                } else break _v1$16;
            case 'PageMsgSearch':
                if (_v1.b.$ === 'PageSearch') {
                    var msg = _v1.a.a;
                    var model = _v1.b.a;
                    return A3($author$project$Main$mapPageModel, $author$project$Main$PageSearch, $author$project$Main$searchPageCmdToCmd, A2($author$project$Page$Search$update, msg, model));
                } else break _v1$16;
            case 'PageMsgSearchResult':
                if (_v1.b.$ === 'PageSearchResult') {
                    var msg = _v1.a.a;
                    var model = _v1.b.a;
                    return A3($author$project$Main$mapPageModel, $author$project$Main$PageSearchResult, $author$project$Main$searchResultPageCmdToCmd, A2($author$project$Page$SearchResult$update, msg, model));
                } else break _v1$16;
            case 'PageMsgNotification':
                if (_v1.b.$ === 'PageNotification') {
                    var msg = _v1.a.a;
                    var model = _v1.b.a;
                    return A3($author$project$Main$mapPageModel, $author$project$Main$PageNotification, $author$project$Main$notificationCmdToCmd, A2($author$project$Page$Notification$update, msg, model));
                } else break _v1$16;
            case 'PageMsgUser':
                if (_v1.b.$ === 'PageUser') {
                    var msg = _v1.a.a;
                    var model = _v1.b.a;
                    return A3($author$project$Main$mapPageModel, $author$project$Main$PageUser, $author$project$Main$userPageCmdToCmd, A2($author$project$Page$User$update, msg, model));
                } else break _v1$16;
            case 'PageMsgProduct':
                if (_v1.b.$ === 'PageProduct') {
                    var msg = _v1.a.a;
                    var model = _v1.b.a;
                    return A3($author$project$Main$mapPageModel, $author$project$Main$PageProduct, $author$project$Main$productPageCmdToCmd(rec.key), A3($author$project$Page$Product$update, allProductsMaybe, msg, model));
                } else break _v1$16;
            default:
                if (_v1.b.$ === 'PageTrade') {
                    var msg = _v1.a.a;
                    var model = _v1.b.a;
                    return A3($author$project$Main$mapPageModel, $author$project$Main$PageTrade, $author$project$Main$tradePageCmdToCmd, A2($author$project$Page$Trade$update, msg, model));
                } else break _v1$16;
        }
        return _Utils_Tuple2(rec.page, $elm$core$Platform$Cmd$none);
    });
    var $author$project$Data$LogInState$updateWithName = F2(function(userWithName, logInState) {
        if (logInState.$ === 'Ok') {
            var rec = logInState.a;
            return $author$project$Data$LogInState$Ok(_Utils_update(rec, {
                userWithName: userWithName
            }));
        } else return logInState;
    });
    var $author$project$PageLocation$About = {
        $: 'About'
    };
    var $author$project$PageLocation$AboutPrivacyPolicy = {
        $: 'AboutPrivacyPolicy'
    };
    var $author$project$PageLocation$BoughtProducts = {
        $: 'BoughtProducts'
    };
    var $author$project$PageLocation$CommentedProducts = {
        $: 'CommentedProducts'
    };
    var $author$project$PageLocation$Exhibition = {
        $: 'Exhibition'
    };
    var $author$project$PageLocation$ExhibitionConfirm = {
        $: 'ExhibitionConfirm'
    };
    var $author$project$PageLocation$History = {
        $: 'History'
    };
    var $author$project$PageLocation$LikedProducts = {
        $: 'LikedProducts'
    };
    var $author$project$PageLocation$LogIn = {
        $: 'LogIn'
    };
    var $author$project$PageLocation$Notification = {
        $: 'Notification'
    };
    var $author$project$PageLocation$Product = function(a) {
        return {
            $: 'Product',
            a: a
        };
    };
    var $author$project$PageLocation$Search = {
        $: 'Search'
    };
    var $author$project$PageLocation$SearchResult = function(a) {
        return {
            $: 'SearchResult',
            a: a
        };
    };
    var $author$project$PageLocation$SoldProducts = function(a) {
        return {
            $: 'SoldProducts',
            a: a
        };
    };
    var $author$project$PageLocation$TradedProducts = {
        $: 'TradedProducts'
    };
    var $author$project$PageLocation$TradingProducts = {
        $: 'TradingProducts'
    };
    var $author$project$PageLocation$User = function(a) {
        return {
            $: 'User',
            a: a
        };
    };
    var $author$project$PageLocation$exhibitionConfirmParser = function(path) {
        return _Utils_eq(path, $author$project$PageLocation$exhibitionConfirmPath) ? $elm$core$Maybe$Just(_Utils_Tuple0) : $elm$core$Maybe$Nothing;
    };
    var $author$project$PageLocation$fromUrl = function(url) {
        var _v0 = $RomanErnst$erl$Erl$parse($elm$url$Url$toString(url));
        var path = _v0.path;
        var hash = _v0.hash;
        var fragmentDict = $elm$core$Dict$fromList($RomanErnst$erl$Erl$parse('?' + hash).query);
        return $author$project$PageLocation$oneOf(A2($elm$core$List$map, function(f) {
            return f(path);
        }, _List_fromArray([
            A2($author$project$PageLocation$parserMap, $elm$core$Basics$always($author$project$PageLocation$Home), $author$project$PageLocation$homeParser),
            A2($author$project$PageLocation$parserMap, $elm$core$Basics$always($author$project$PageLocation$LogIn), $author$project$PageLocation$logInParser),
            A2($author$project$PageLocation$parserMap, $elm$core$Basics$always($author$project$PageLocation$LikedProducts), $author$project$PageLocation$likedProductsParser),
            A2($author$project$PageLocation$parserMap, $elm$core$Basics$always($author$project$PageLocation$History), $author$project$PageLocation$historyParser),
            A2($author$project$PageLocation$parserMap, $author$project$PageLocation$SoldProducts, $author$project$PageLocation$soldProductsParser),
            A2($author$project$PageLocation$parserMap, $elm$core$Basics$always($author$project$PageLocation$BoughtProducts), $author$project$PageLocation$boughtProductsParser),
            A2($author$project$PageLocation$parserMap, $elm$core$Basics$always($author$project$PageLocation$TradingProducts), $author$project$PageLocation$tradingProductsParser),
            A2($author$project$PageLocation$parserMap, $elm$core$Basics$always($author$project$PageLocation$TradedProducts), $author$project$PageLocation$tradedProductsParser),
            A2($author$project$PageLocation$parserMap, $elm$core$Basics$always($author$project$PageLocation$CommentedProducts), $author$project$PageLocation$commentedProductsParser),
            A2($author$project$PageLocation$parserMap, $elm$core$Basics$always($author$project$PageLocation$Exhibition), $author$project$PageLocation$exhibitionParser),
            A2($author$project$PageLocation$parserMap, $elm$core$Basics$always($author$project$PageLocation$ExhibitionConfirm), $author$project$PageLocation$exhibitionConfirmParser),
            A2($author$project$PageLocation$parserMap, $author$project$PageLocation$Product, $author$project$PageLocation$productParser),
            A2($author$project$PageLocation$parserMap, $author$project$PageLocation$Trade, $author$project$PageLocation$tradeParser),
            A2($author$project$PageLocation$parserMap, $author$project$PageLocation$User, $author$project$PageLocation$userParser),
            A2($author$project$PageLocation$parserMap, $elm$core$Basics$always($author$project$PageLocation$Search), $author$project$PageLocation$searchParser(fragmentDict)),
            A2($author$project$PageLocation$parserMap, $author$project$PageLocation$SearchResult, $author$project$PageLocation$searchResultParser(fragmentDict)),
            A2($author$project$PageLocation$parserMap, $elm$core$Basics$always($author$project$PageLocation$Notification), $author$project$PageLocation$notificationParser),
            A2($author$project$PageLocation$parserMap, $elm$core$Basics$always($author$project$PageLocation$About), $author$project$PageLocation$aboutParser),
            A2($author$project$PageLocation$parserMap, $elm$core$Basics$always($author$project$PageLocation$AboutPrivacyPolicy), $author$project$PageLocation$aboutPrivacyPolicyParser)
        ])));
    };
    var $author$project$Page$Exhibition$BackToEditPage = {
        $: 'BackToEditPage'
    };
    var $author$project$Main$getProductId = function(page) {
        if (page.$ === 'PageProduct') {
            var productModel = page.a;
            return $elm$core$Maybe$Just($author$project$Page$Product$getProductId(productModel));
        } else return $elm$core$Maybe$Nothing;
    };
    var $author$project$Page$TradesInPast$getAllTrades = function(_v0) {
        var normal = _v0.a.normal;
        if (normal.$ === 'Normal') {
            var trades = normal.a;
            return trades;
        } else return _List_Nil;
    };
    var $author$project$Page$TradesInProgress$getAllTrades = function(_v0) {
        var normal = _v0.a.normal;
        if (normal.$ === 'Normal') {
            var trades = normal.a;
            return trades;
        } else return _List_Nil;
    };
    var $author$project$Data$Trade$searchFromId = F2(function(id, list) {
        searchFromId: while(true){
            if (list.b) {
                var x = list.a;
                var xs = list.b;
                if (_Utils_eq($author$project$Data$Trade$getId(x), id)) return $elm$core$Maybe$Just(x);
                else {
                    var $temp$id = id, $temp$list = xs;
                    id = $temp$id;
                    list = $temp$list;
                    continue searchFromId;
                }
            } else return $elm$core$Maybe$Nothing;
        }
    });
    var $author$project$Main$getTradeFromPage = F2(function(tradeId, pageModel) {
        return A2($author$project$Data$Trade$searchFromId, tradeId, function() {
            switch(pageModel.$){
                case 'PageTradesInProgress':
                    var model = pageModel.a;
                    return $author$project$Page$TradesInProgress$getAllTrades(model);
                case 'PageTradesInPast':
                    var model = pageModel.a;
                    return $author$project$Page$TradesInPast$getAllTrades(model);
                default:
                    return _List_Nil;
            }
        }());
    });
    var $author$project$Page$Trade$initModelFromTrade = F2(function(logInState, trade) {
        return _Utils_Tuple2($author$project$Page$Trade$Main({
            commentInput: '',
            comments: $elm$core$Maybe$Nothing,
            sending: $elm$core$Maybe$Nothing,
            trade: trade
        }), function() {
            var _v0 = $author$project$Data$LogInState$getToken(logInState);
            if (_v0.$ === 'Just') {
                var token = _v0.a;
                return _List_fromArray([
                    A2($author$project$Page$Trade$CmdGetTrade, token, $author$project$Data$Trade$getId(trade))
                ]);
            } else return _List_Nil;
        }());
    });
    var $author$project$Page$Exhibition$ToConfirmPage = function(a) {
        return {
            $: 'ToConfirmPage',
            a: a
        };
    };
    var $author$project$Api$SellProductRequest = function(a) {
        return {
            $: 'SellProductRequest',
            a: a
        };
    };
    var $author$project$Component$Category$getCategory = function(_v0) {
        var select = _v0.a;
        switch(select.$){
            case 'None':
                return $elm$core$Maybe$Nothing;
            case 'GroupSelect':
                return $elm$core$Maybe$Nothing;
            default:
                var category = select.a;
                return $elm$core$Maybe$Just(category);
        }
    };
    var $author$project$Component$ProductEditor$imagesCheck = F2(function(addImageList, beforeImageIds) {
        var length = $elm$core$List$length(addImageList) + $elm$core$List$length(beforeImageIds);
        return length < 1 ? $elm$core$Maybe$Just('画像は1枚以上必要です') : 4 < length ? $elm$core$Maybe$Just('画像は4枚以内でなければいけません') : $elm$core$Maybe$Nothing;
    });
    var $author$project$Component$ProductEditor$nameCheck = function(name) {
        var nameLength = $elm$core$String$length($elm$core$String$trim(name));
        return nameLength < 1 ? $elm$core$Maybe$Just('商品名は1文字以上でないといけません') : 40 < nameLength ? $elm$core$Maybe$Just('商品名は40文字以内でないといけません') : $elm$core$Maybe$Nothing;
    };
    var $author$project$Component$ProductEditor$priceCheck = function(priceMaybe) {
        if (priceMaybe.$ === 'Just') {
            var price = priceMaybe.a;
            return price < 0 ? $elm$core$Result$Err('価格は正の値で入力してください') : 1000000 < price ? $elm$core$Result$Err('価格は100万円以下でないといけません') : $elm$core$Result$Ok(price);
        } else return $elm$core$Result$Err('0 ～ 100万円の価格を入力してください');
    };
    var $author$project$Component$ProductEditor$toSoldRequest = function(_v0) {
        var rec = _v0.a;
        var _v1 = _Utils_Tuple3($author$project$Component$ProductEditor$priceCheck(rec.price), rec.condition, $author$project$Component$Category$getCategory(rec.category));
        if (_v1.a.$ === 'Ok' && _v1.b.$ === 'Just' && _v1.c.$ === 'Just') {
            var price = _v1.a.a;
            var condition = _v1.b.a;
            var category = _v1.c.a;
            return _Utils_eq($author$project$Component$ProductEditor$nameCheck(rec.name), $elm$core$Maybe$Nothing) && _Utils_eq(A2($author$project$Component$ProductEditor$imagesCheck, rec.addImages, rec.beforeImageIds), $elm$core$Maybe$Nothing) ? $elm$core$Maybe$Just($author$project$Api$SellProductRequest({
                category: category,
                condition: condition,
                description: rec.description,
                images: rec.addImages,
                name: rec.name,
                price: price
            })) : $elm$core$Maybe$Nothing;
        } else return $elm$core$Maybe$Nothing;
    };
    var $author$project$Page$Exhibition$toConfirmPageMsgFromModel = F2(function(logInState, _v0) {
        var rec = _v0.a;
        var _v1 = _Utils_Tuple2(rec.page, $author$project$Data$LogInState$getToken(logInState));
        if (_v1.a.$ === 'EditPage' && _v1.b.$ === 'Just') {
            var editModel = _v1.a.a;
            var token = _v1.b.a;
            return A2($elm$core$Maybe$map, function(request) {
                return $author$project$Page$Exhibition$ToConfirmPage(_Utils_Tuple2(token, request));
            }, $author$project$Component$ProductEditor$toSoldRequest(editModel));
        } else return $elm$core$Maybe$Nothing;
    });
    var $author$project$Main$urlParserResultToPageAndCmd = F2(function(_v0, result) {
        var rec = _v0.a;
        switch(result.$){
            case 'Home':
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageHome, $author$project$Main$homePageCmdToCmd, $author$project$Page$Home$initModel($author$project$Main$getProductId(rec.page)));
            case 'LogIn':
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageLogIn, $author$project$Main$logInPageCmdToCmd(rec.key), $author$project$Page$LogIn$initModel);
            case 'LikedProducts':
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageLikedProducts, $author$project$Main$likedProductsCmdToCmd, A2($author$project$Page$LikedProducts$initModel, $author$project$Main$getProductId(rec.page), rec.logInState));
            case 'History':
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageHistory, $author$project$Main$historyCmdToCmd, A2($author$project$Page$History$initModel, $author$project$Main$getProductId(rec.page), rec.logInState));
            case 'SoldProducts':
                var userId = result.a;
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageSoldProducts, $author$project$Main$soldProductsPageCmdToCmd, A2($author$project$Page$SoldProducts$initModel, userId, $author$project$Main$getProductId(rec.page)));
            case 'BoughtProducts':
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageBoughtProducts, $author$project$Main$boughtProductsPageCmdToCmd, A2($author$project$Page$BoughtProducts$initModel, $author$project$Main$getProductId(rec.page), rec.logInState));
            case 'TradingProducts':
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageTradesInProgress, $author$project$Main$tradingProductsCmdToCmd, $author$project$Page$TradesInProgress$initModel(rec.logInState));
            case 'TradedProducts':
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageTradesInPast, $author$project$Main$tradedProductsCmdToCmd, $author$project$Page$TradesInPast$initModel(rec.logInState));
            case 'CommentedProducts':
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageCommentedProducts, $author$project$Main$commentedProductsCmdToCmd, A2($author$project$Page$CommentedProducts$initModel, $author$project$Main$getProductId(rec.page), rec.logInState));
            case 'Exhibition':
                var _v2 = rec.page;
                if (_v2.$ === 'PageExhibition') {
                    var exhibitionModel = _v2.a;
                    return A3($author$project$Main$mapPageModel, $author$project$Main$PageExhibition, $author$project$Main$exhibitionPageCmdToCmd(rec.key), A3($author$project$Page$Exhibition$update, rec.logInState, $author$project$Page$Exhibition$BackToEditPage, exhibitionModel));
                } else return A3($author$project$Main$mapPageModel, $author$project$Main$PageExhibition, $author$project$Main$exhibitionPageCmdToCmd(rec.key), $author$project$Page$Exhibition$initModel);
            case 'ExhibitionConfirm':
                var _v3 = rec.page;
                if (_v3.$ === 'PageExhibition') {
                    var pageModel = _v3.a;
                    var _v4 = A2($author$project$Page$Exhibition$toConfirmPageMsgFromModel, rec.logInState, pageModel);
                    if (_v4.$ === 'Just') {
                        var msg = _v4.a;
                        return A3($author$project$Main$mapPageModel, $author$project$Main$PageExhibition, $author$project$Main$exhibitionPageCmdToCmd(rec.key), A3($author$project$Page$Exhibition$update, rec.logInState, msg, pageModel));
                    } else return _Utils_Tuple2($author$project$Main$PageExhibition(pageModel), $elm$core$Platform$Cmd$none);
                } else return _Utils_Tuple2(rec.page, $elm$core$Platform$Cmd$none);
            case 'Product':
                var productId = result.a;
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageProduct, $author$project$Main$productPageCmdToCmd(rec.key), A2($author$project$Page$Product$initModel, rec.logInState, productId));
            case 'Trade':
                var tradeId = result.a;
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageTrade, $author$project$Main$tradePageCmdToCmd, function() {
                    var _v5 = A2($author$project$Main$getTradeFromPage, tradeId, rec.page);
                    if (_v5.$ === 'Just') {
                        var trade = _v5.a;
                        return A2($author$project$Page$Trade$initModelFromTrade, rec.logInState, trade);
                    } else return A2($author$project$Page$Trade$initModelFromId, rec.logInState, tradeId);
                }());
            case 'User':
                var userId = result.a;
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageUser, $author$project$Main$userPageCmdToCmd, A2($author$project$Page$User$initialModel, rec.logInState, userId));
            case 'Search':
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageSearch, $author$project$Main$searchPageCmdToCmd, $author$project$Page$Search$initModel);
            case 'SearchResult':
                var condition = result.a;
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageSearchResult, $author$project$Main$searchResultPageCmdToCmd, A3($author$project$Page$SearchResult$initModel, $author$project$Main$getProductId(rec.page), condition, rec.allProducts));
            case 'Notification':
                return A3($author$project$Main$mapPageModel, $author$project$Main$PageNotification, $author$project$Main$notificationCmdToCmd, $author$project$Page$Notification$initModel);
            case 'About':
                return _Utils_Tuple2($author$project$Main$PageAbout($author$project$Page$About$aboutModel), $elm$core$Platform$Cmd$none);
            default:
                return _Utils_Tuple2($author$project$Main$PageAbout($author$project$Page$About$privacyPolicyModel), $elm$core$Platform$Cmd$none);
        }
    });
    var $author$project$Main$urlParser = F2(function(_v0, url) {
        var rec = _v0.a;
        var _v1 = function() {
            var _v2 = $author$project$PageLocation$fromUrl(url);
            if (_v2.$ === 'Just') {
                var urlParserResult = _v2.a;
                return A2($author$project$Main$urlParserResultToPageAndCmd, $author$project$Main$Model(rec), urlParserResult);
            } else return $author$project$Main$pageNotFound;
        }();
        var page = _v1.a;
        var cmds = _v1.b;
        return _Utils_Tuple2($author$project$Main$Model(_Utils_update(rec, {
            page: page
        })), cmds);
    });
    var $author$project$Data$User$withProfileToWithName = function(_v0) {
        var rec = _v0.a;
        return $author$project$Data$User$WithName({
            displayName: rec.displayName,
            id: rec.id,
            imageId: rec.imageId
        });
    };
    var $author$project$Main$update = F2(function(msg, _v0) {
        var rec = _v0.a;
        switch(msg.$){
            case 'ToWideScreenMode':
                return _Utils_Tuple2($author$project$Main$Model(_Utils_update(rec, {
                    wideScreen: true
                })), $elm$core$Platform$Cmd$none);
            case 'ToNarrowScreenMode':
                return _Utils_Tuple2($author$project$Main$Model(_Utils_update(rec, {
                    wideScreen: false
                })), $elm$core$Platform$Cmd$none);
            case 'UrlChange':
                var url = msg.a;
                return A2($author$project$Main$urlParser, $author$project$Main$Model(rec), url);
            case 'UrlRequest':
                var urlRequest = msg.a;
                return _Utils_Tuple2($author$project$Main$Model(rec), function() {
                    if (urlRequest.$ === 'Internal') {
                        var url = urlRequest.a;
                        return A2($elm$browser$Browser$Navigation$pushUrl, rec.key, $elm$url$Url$toString(url));
                    } else {
                        var urlString = urlRequest.a;
                        return $elm$browser$Browser$Navigation$load(urlString);
                    }
                }());
            case 'AddLogMessage':
                var logMessage = msg.a;
                return _Utils_Tuple2($author$project$Main$Model(_Utils_update(rec, {
                    message: $elm$core$Maybe$Just(logMessage)
                })), $elm$core$Platform$Cmd$none);
            case 'LogOut':
                return _Utils_Tuple2($author$project$Main$Model(_Utils_update(rec, {
                    logInState: $author$project$Data$LogInState$None,
                    message: $elm$core$Maybe$Just('ログアウトしました')
                })), $elm$core$Platform$Cmd$none);
            case 'ReceiveProductImages':
                var dataUrlList = msg.a;
                var _v3 = rec.page;
                switch(_v3.$){
                    case 'PageExhibition':
                        var exhibitionPageModel = _v3.a;
                        var _v4 = A3($author$project$Page$Exhibition$update, rec.logInState, $author$project$Page$Exhibition$MsgByProductEditor($author$project$Component$ProductEditor$InputImageList(dataUrlList)), exhibitionPageModel);
                        var newModel = _v4.a;
                        var cmds = _v4.b;
                        return _Utils_Tuple2($author$project$Main$Model(_Utils_update(rec, {
                            page: $author$project$Main$PageExhibition(newModel)
                        })), $elm$core$Platform$Cmd$batch(A2($elm$core$List$map, $author$project$Main$exhibitionPageCmdToCmd(rec.key), cmds)));
                    case 'PageProduct':
                        var productPageModel = _v3.a;
                        var _v5 = A3($author$project$Page$Product$update, rec.allProducts, $author$project$Page$Product$MsgByProductEditor($author$project$Component$ProductEditor$InputImageList(dataUrlList)), productPageModel);
                        var newModel = _v5.a;
                        var cmds = _v5.b;
                        return _Utils_Tuple2($author$project$Main$Model(_Utils_update(rec, {
                            page: $author$project$Main$PageProduct(newModel)
                        })), $elm$core$Platform$Cmd$batch(A2($elm$core$List$map, $author$project$Main$productPageCmdToCmd(rec.key), cmds)));
                    default:
                        return _Utils_Tuple2($author$project$Main$Model(rec), $elm$core$Platform$Cmd$none);
                }
            case 'ReceiveUserImage':
                var image = msg.a;
                var _v6 = rec.page;
                return _Utils_Tuple2($author$project$Main$Model(rec), $elm$core$Platform$Cmd$none);
            case 'PageMsg':
                var pageMsg = msg.a;
                var _v7 = A3($author$project$Main$updatePageMsg, rec.allProducts, pageMsg, $author$project$Main$Model(rec));
                var pageModel = _v7.a;
                var cmd = _v7.b;
                return _Utils_Tuple2($author$project$Main$Model(_Utils_update(rec, {
                    page: pageModel
                })), cmd);
            case 'GetMyProfileAndLikedProductIdsResponse':
                var response = msg.a;
                if (response.$ === 'Ok') {
                    var userWithProfile = response.a;
                    return _Utils_Tuple2($author$project$Main$Model(_Utils_update(rec, {
                        logInState: A2($author$project$Data$LogInState$addUserWithNameAndLikedProductIds, userWithProfile, rec.logInState)
                    })), $elm$core$Platform$Cmd$none);
                } else {
                    var string = response.a;
                    return _Utils_Tuple2($author$project$Main$Model(_Utils_update(rec, {
                        message: $elm$core$Maybe$Just(string)
                    })), string === '他の端末でログインされたので、ログインしなおしてください' ? $author$project$Main$deleteAllFromLocalStorage(_Utils_Tuple0) : $elm$core$Platform$Cmd$none);
                }
            case 'LikeProductResponse':
                var id = msg.a;
                var response = msg.b;
                var _v9 = A5($author$project$Main$updateLikedCountInEachPageProduct, rec.key, id, rec.allProducts, response, rec.page);
                var page = _v9.a;
                var cmd = _v9.b;
                return _Utils_Tuple2($author$project$Main$Model(_Utils_update(rec, {
                    logInState: A2($author$project$Data$LogInState$likeProduct, id, rec.logInState),
                    page: page
                })), cmd);
            case 'UnlikeProductResponse':
                var id = msg.a;
                var response = msg.b;
                var _v10 = A5($author$project$Main$updateLikedCountInEachPageProduct, rec.key, id, rec.allProducts, response, rec.page);
                var page = _v10.a;
                var cmd = _v10.b;
                return _Utils_Tuple2($author$project$Main$Model(_Utils_update(rec, {
                    logInState: A2($author$project$Data$LogInState$unlikeProduct, id, rec.logInState),
                    page: page
                })), cmd);
            case 'ChangeProfileResponse':
                var response = msg.a;
                if (response.$ === 'Ok') {
                    var newProfile = response.a;
                    var _v12 = rec.page;
                    if (_v12.$ === 'PageUser') {
                        var profileModel = _v12.a;
                        var _v13 = A2($author$project$Page$User$update, $author$project$Page$User$MsgChangeProfileResponse(response), profileModel);
                        var newModel = _v13.a;
                        var cmds = _v13.b;
                        return _Utils_Tuple2($author$project$Main$Model(_Utils_update(rec, {
                            logInState: A2($author$project$Data$LogInState$updateWithName, $author$project$Data$User$withProfileToWithName(newProfile), rec.logInState),
                            page: $author$project$Main$PageUser(newModel)
                        })), $elm$core$Platform$Cmd$batch(A2($elm$core$List$map, $author$project$Main$userPageCmdToCmd, cmds)));
                    } else return _Utils_Tuple2($author$project$Main$Model(rec), $elm$core$Platform$Cmd$none);
                } else {
                    var text = response.a;
                    return _Utils_Tuple2($author$project$Main$Model(_Utils_update(rec, {
                        message: $elm$core$Maybe$Just('プロフィール更新に失敗しました ' + text)
                    })), $elm$core$Platform$Cmd$none);
                }
            case 'HistoryBack':
                return _Utils_Tuple2($author$project$Main$Model(rec), A2($elm$browser$Browser$Navigation$back, rec.key, 1));
            case 'GetNowTime':
                var result = msg.a;
                if (result.$ === 'Ok') {
                    var posixAndZone = result.a;
                    return _Utils_Tuple2($author$project$Main$Model(_Utils_update(rec, {
                        now: $elm$core$Maybe$Just(posixAndZone)
                    })), $elm$core$Platform$Cmd$none);
                } else return _Utils_Tuple2($author$project$Main$Model(_Utils_update(rec, {
                    message: $elm$core$Maybe$Just('時間の取得に失敗しました')
                })), $elm$core$Platform$Cmd$none);
            case 'Jump':
                var result = msg.a;
                if (result.$ === 'Ok') {
                    var url = result.a;
                    return _Utils_Tuple2($author$project$Main$Model(rec), $elm$browser$Browser$Navigation$load($elm$url$Url$toString(url)));
                } else {
                    var string = result.a;
                    return _Utils_Tuple2($author$project$Main$Model(_Utils_update(rec, {
                        message: $elm$core$Maybe$Just('URL取得に失敗した ' + string)
                    })), $elm$core$Platform$Cmd$none);
                }
            case 'UpdateProducts':
                var products = msg.a;
                var _v16 = $author$project$Utility$sequenceMaybeList(A2($elm$core$List$map, $author$project$Data$Product$fromFirestore, products));
                if (_v16.$ === 'Just') {
                    var allProducts = _v16.a;
                    return _Utils_Tuple2($author$project$Main$Model(_Utils_update(rec, {
                        allProducts: $elm$core$Maybe$Just(allProducts)
                    })), $elm$core$Platform$Cmd$none);
                } else return _Utils_Tuple2($author$project$Main$Model(rec), A2($elm$core$Task$perform, $elm$core$Basics$always($author$project$Main$AddLogMessage('FireStoreから取得した商品データの型が合わない')), $elm$core$Task$succeed(_Utils_Tuple0)));
            default:
                return _Utils_Tuple2($author$project$Main$Model(rec), $elm$core$Platform$Cmd$none);
        }
    });
    var $author$project$Main$HistoryBack = {
        $: 'HistoryBack'
    };
    var $author$project$BasicParts$Home = {
        $: 'Home'
    };
    var $author$project$BasicParts$Notification = {
        $: 'Notification'
    };
    var $author$project$BasicParts$Search = {
        $: 'Search'
    };
    var $author$project$BasicParts$User = {
        $: 'User'
    };
    var $rtfeldman$elm_css$Css$Preprocess$AppendProperty = function(a) {
        return {
            $: 'AppendProperty',
            a: a
        };
    };
    var $rtfeldman$elm_css$Css$property = F2(function(key, value) {
        return $rtfeldman$elm_css$Css$Preprocess$AppendProperty(key + (':' + value));
    });
    var $rtfeldman$elm_css$Css$backgroundColor = function(c) {
        return A2($rtfeldman$elm_css$Css$property, 'background-color', c.value);
    };
    var $rtfeldman$elm_css$Css$prop1 = F2(function(key, arg) {
        return A2($rtfeldman$elm_css$Css$property, key, arg.value);
    });
    var $rtfeldman$elm_css$Css$bottom = $rtfeldman$elm_css$Css$prop1('bottom');
    var $rtfeldman$elm_css$VirtualDom$Styled$Attribute = F3(function(a, b, c) {
        return {
            $: 'Attribute',
            a: a,
            b: b,
            c: c
        };
    });
    var $rtfeldman$elm_css$VirtualDom$Styled$murmurSeed = 15739;
    var $rtfeldman$elm_css$VirtualDom$Styled$getClassname = function(styles) {
        return $elm$core$List$isEmpty(styles) ? 'unstyled' : A2($elm$core$String$cons, _Utils_chr('_'), $rtfeldman$elm_hex$Hex$toString(A2($rtfeldman$elm_css$ElmCssVendor$Murmur3$hashString, $rtfeldman$elm_css$VirtualDom$Styled$murmurSeed, $rtfeldman$elm_css$Css$Preprocess$Resolve$compile($elm$core$List$singleton($rtfeldman$elm_css$Css$Preprocess$stylesheet($elm$core$List$singleton(A2($rtfeldman$elm_css$VirtualDom$Styled$makeSnippet, styles, $rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence(_List_Nil)))))))));
    };
    var $elm$virtual_dom$VirtualDom$property = F2(function(key, value) {
        return A2(_VirtualDom_property, _VirtualDom_noInnerHtmlOrFormAction(key), _VirtualDom_noJavaScriptOrHtmlUri(value));
    });
    var $rtfeldman$elm_css$Html$Styled$Internal$css = function(styles) {
        var classname = $rtfeldman$elm_css$VirtualDom$Styled$getClassname(styles);
        var classProperty = A2($elm$virtual_dom$VirtualDom$property, 'className', $elm$json$Json$Encode$string(classname));
        return A3($rtfeldman$elm_css$VirtualDom$Styled$Attribute, classProperty, styles, classname);
    };
    var $rtfeldman$elm_css$Html$Styled$Attributes$css = $rtfeldman$elm_css$Html$Styled$Internal$css;
    var $rtfeldman$elm_css$Css$Preprocess$ApplyStyles = function(a) {
        return {
            $: 'ApplyStyles',
            a: a
        };
    };
    var $rtfeldman$elm_css$Css$batch = $rtfeldman$elm_css$Css$Preprocess$ApplyStyles;
    var $rtfeldman$elm_css$Css$Structure$Compatible = {
        $: 'Compatible'
    };
    var $rtfeldman$elm_css$Css$block = {
        display: $rtfeldman$elm_css$Css$Structure$Compatible,
        value: 'block'
    };
    var $rtfeldman$elm_css$Css$display = $rtfeldman$elm_css$Css$prop1('display');
    var $author$project$Style$displayGridAndGap = function(gap) {
        var block = $rtfeldman$elm_css$Css$block;
        return $rtfeldman$elm_css$Css$batch(A2($elm$core$List$cons, $rtfeldman$elm_css$Css$display(_Utils_update(block, {
            value: 'grid'
        })), !gap ? _List_Nil : _List_fromArray([
            A2($rtfeldman$elm_css$Css$property, 'gap', $elm$core$String$fromInt(gap) + 'px')
        ])));
    };
    var $rtfeldman$elm_css$VirtualDom$Styled$Node = F3(function(a, b, c) {
        return {
            $: 'Node',
            a: a,
            b: b,
            c: c
        };
    });
    var $rtfeldman$elm_css$VirtualDom$Styled$node = $rtfeldman$elm_css$VirtualDom$Styled$Node;
    var $rtfeldman$elm_css$Html$Styled$node = $rtfeldman$elm_css$VirtualDom$Styled$node;
    var $rtfeldman$elm_css$Html$Styled$div = $rtfeldman$elm_css$Html$Styled$node('div');
    var $author$project$Style$gridColumn = F2(function(start, end) {
        return A2($rtfeldman$elm_css$Css$property, 'grid-column', $elm$core$String$fromInt(start) + (' / ' + $elm$core$String$fromInt(end)));
    });
    var $author$project$Style$gridRow = F2(function(start, end) {
        return A2($rtfeldman$elm_css$Css$property, 'grid-row', $elm$core$String$fromInt(start) + (' / ' + $elm$core$String$fromInt(end)));
    });
    var $author$project$Style$gridTemplateColumns = $rtfeldman$elm_css$Css$property('grid-template-columns');
    var $rtfeldman$elm_css$Css$height = $rtfeldman$elm_css$Css$prop1('height');
    var $rtfeldman$elm_css$Css$PercentageUnits = {
        $: 'PercentageUnits'
    };
    var $rtfeldman$elm_css$Css$Internal$lengthConverter = F3(function(units, unitLabel, numericValue) {
        return {
            absoluteLength: $rtfeldman$elm_css$Css$Structure$Compatible,
            calc: $rtfeldman$elm_css$Css$Structure$Compatible,
            flexBasis: $rtfeldman$elm_css$Css$Structure$Compatible,
            fontSize: $rtfeldman$elm_css$Css$Structure$Compatible,
            length: $rtfeldman$elm_css$Css$Structure$Compatible,
            lengthOrAuto: $rtfeldman$elm_css$Css$Structure$Compatible,
            lengthOrAutoOrCoverOrContain: $rtfeldman$elm_css$Css$Structure$Compatible,
            lengthOrMinMaxDimension: $rtfeldman$elm_css$Css$Structure$Compatible,
            lengthOrNone: $rtfeldman$elm_css$Css$Structure$Compatible,
            lengthOrNoneOrMinMaxDimension: $rtfeldman$elm_css$Css$Structure$Compatible,
            lengthOrNumber: $rtfeldman$elm_css$Css$Structure$Compatible,
            lengthOrNumberOrAutoOrNoneOrContent: $rtfeldman$elm_css$Css$Structure$Compatible,
            numericValue: numericValue,
            textIndent: $rtfeldman$elm_css$Css$Structure$Compatible,
            unitLabel: unitLabel,
            units: units,
            value: _Utils_ap($elm$core$String$fromFloat(numericValue), unitLabel)
        };
    });
    var $rtfeldman$elm_css$Css$pct = A2($rtfeldman$elm_css$Css$Internal$lengthConverter, $rtfeldman$elm_css$Css$PercentageUnits, '%');
    var $rtfeldman$elm_css$Css$PxUnits = {
        $: 'PxUnits'
    };
    var $rtfeldman$elm_css$Css$px = A2($rtfeldman$elm_css$Css$Internal$lengthConverter, $rtfeldman$elm_css$Css$PxUnits, 'px');
    var $elm$core$List$repeatHelp = F3(function(result, n, value) {
        repeatHelp: while(true){
            if (n <= 0) return result;
            else {
                var $temp$result = A2($elm$core$List$cons, value, result), $temp$n = n - 1, $temp$value = value;
                result = $temp$result;
                n = $temp$n;
                value = $temp$value;
                continue repeatHelp;
            }
        }
    });
    var $elm$core$List$repeat = F2(function(n, value) {
        return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
    });
    var $rtfeldman$elm_css$Css$cssFunction = F2(function(funcName, args) {
        return funcName + ('(' + (A2($elm$core$String$join, ', ', args) + ')'));
    });
    var $rtfeldman$elm_css$Css$rgb = F3(function(r, g, b) {
        return {
            alpha: 1,
            blue: b,
            color: $rtfeldman$elm_css$Css$Structure$Compatible,
            green: g,
            red: r,
            value: A2($rtfeldman$elm_css$Css$cssFunction, 'rgb', A2($elm$core$List$map, $elm$core$String$fromInt, _List_fromArray([
                r,
                g,
                b
            ])))
        };
    });
    var $rtfeldman$elm_css$Css$width = $rtfeldman$elm_css$Css$prop1('width');
    var $rtfeldman$elm_css$Css$UnitlessInteger = {
        $: 'UnitlessInteger'
    };
    var $rtfeldman$elm_css$Css$zero = {
        length: $rtfeldman$elm_css$Css$Structure$Compatible,
        lengthOrAuto: $rtfeldman$elm_css$Css$Structure$Compatible,
        lengthOrAutoOrCoverOrContain: $rtfeldman$elm_css$Css$Structure$Compatible,
        lengthOrMinMaxDimension: $rtfeldman$elm_css$Css$Structure$Compatible,
        lengthOrNone: $rtfeldman$elm_css$Css$Structure$Compatible,
        lengthOrNoneOrMinMaxDimension: $rtfeldman$elm_css$Css$Structure$Compatible,
        lengthOrNumber: $rtfeldman$elm_css$Css$Structure$Compatible,
        number: $rtfeldman$elm_css$Css$Structure$Compatible,
        numericValue: 0,
        outline: $rtfeldman$elm_css$Css$Structure$Compatible,
        unitLabel: '',
        units: $rtfeldman$elm_css$Css$UnitlessInteger,
        value: '0'
    };
    var $author$project$BasicParts$bottomNavigationContainer = function(item) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $author$project$Style$displayGridAndGap(0),
                A2($author$project$Style$gridColumn, 2, 3),
                A2($author$project$Style$gridRow, 4, 5),
                $author$project$Style$gridTemplateColumns(A2($elm$core$String$join, ' ', A2($elm$core$List$repeat, $elm$core$List$length(item), '1fr'))),
                $rtfeldman$elm_css$Css$bottom($rtfeldman$elm_css$Css$zero),
                $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$pct(100)),
                $rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$px(64)),
                $rtfeldman$elm_css$Css$backgroundColor(A3($rtfeldman$elm_css$Css$rgb, 81, 33, 130))
            ]))
        ]), item);
    };
    var $rtfeldman$elm_css$Html$Styled$a = $rtfeldman$elm_css$Html$Styled$node('a');
    var $rtfeldman$elm_css$Css$Internal$property = F2(function(key, value) {
        return $rtfeldman$elm_css$Css$Preprocess$AppendProperty(key + (':' + value));
    });
    var $rtfeldman$elm_css$Css$Internal$getOverloadedProperty = F3(function(functionName, desiredKey, style) {
        getOverloadedProperty: while(true)switch(style.$){
            case 'AppendProperty':
                var str = style.a;
                var key = A2($elm$core$Maybe$withDefault, '', $elm$core$List$head(A2($elm$core$String$split, ':', str)));
                return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, key);
            case 'ExtendSelector':
                var selector = style.a;
                return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-selector'));
            case 'NestSnippet':
                var combinator = style.a;
                return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-combinator'));
            case 'WithPseudoElement':
                var pseudoElement = style.a;
                return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-pseudo-element setter'));
            case 'WithMedia':
                return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-media-query'));
            case 'WithKeyframes':
                return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-keyframes'));
            default:
                if (!style.a.b) return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-empty-Style'));
                else if (!style.a.b.b) {
                    var _v1 = style.a;
                    var only = _v1.a;
                    var $temp$functionName = functionName, $temp$desiredKey = desiredKey, $temp$style = only;
                    functionName = $temp$functionName;
                    desiredKey = $temp$desiredKey;
                    style = $temp$style;
                    continue getOverloadedProperty;
                } else {
                    var _v2 = style.a;
                    var first = _v2.a;
                    var rest = _v2.b;
                    var $temp$functionName = functionName, $temp$desiredKey = desiredKey, $temp$style = $rtfeldman$elm_css$Css$Preprocess$ApplyStyles(rest);
                    functionName = $temp$functionName;
                    desiredKey = $temp$desiredKey;
                    style = $temp$style;
                    continue getOverloadedProperty;
                }
        }
    });
    var $rtfeldman$elm_css$Css$Internal$IncompatibleUnits = {
        $: 'IncompatibleUnits'
    };
    var $rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty = A3($rtfeldman$elm_css$Css$Internal$lengthConverter, $rtfeldman$elm_css$Css$Internal$IncompatibleUnits, '', 0);
    var $rtfeldman$elm_css$Css$alignItems = function(fn) {
        return A3($rtfeldman$elm_css$Css$Internal$getOverloadedProperty, 'alignItems', 'align-items', fn($rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty));
    };
    var $rtfeldman$elm_css$Css$center = $rtfeldman$elm_css$Css$prop1('center');
    var $rtfeldman$elm_css$Css$color = function(c) {
        return A2($rtfeldman$elm_css$Css$property, 'color', c.value);
    };
    var $rtfeldman$elm_css$Css$row = {
        flexDirection: $rtfeldman$elm_css$Css$Structure$Compatible,
        flexDirectionOrWrap: $rtfeldman$elm_css$Css$Structure$Compatible,
        value: 'row'
    };
    var $rtfeldman$elm_css$Css$column = _Utils_update($rtfeldman$elm_css$Css$row, {
        value: 'column'
    });
    var $rtfeldman$elm_css$Css$displayFlex = A2($rtfeldman$elm_css$Css$property, 'display', 'flex');
    var $rtfeldman$elm_css$Css$flexDirection = $rtfeldman$elm_css$Css$prop1('flex-direction');
    var $rtfeldman$elm_css$Css$justifyContent = function(fn) {
        return A3($rtfeldman$elm_css$Css$Internal$getOverloadedProperty, 'justifyContent', 'justify-content', fn($rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty));
    };
    var $rtfeldman$elm_css$Css$none = {
        backgroundImage: $rtfeldman$elm_css$Css$Structure$Compatible,
        blockAxisOverflow: $rtfeldman$elm_css$Css$Structure$Compatible,
        borderStyle: $rtfeldman$elm_css$Css$Structure$Compatible,
        cursor: $rtfeldman$elm_css$Css$Structure$Compatible,
        display: $rtfeldman$elm_css$Css$Structure$Compatible,
        hoverCapability: $rtfeldman$elm_css$Css$Structure$Compatible,
        inlineAxisOverflow: $rtfeldman$elm_css$Css$Structure$Compatible,
        keyframes: $rtfeldman$elm_css$Css$Structure$Compatible,
        lengthOrNone: $rtfeldman$elm_css$Css$Structure$Compatible,
        lengthOrNoneOrMinMaxDimension: $rtfeldman$elm_css$Css$Structure$Compatible,
        lengthOrNumberOrAutoOrNoneOrContent: $rtfeldman$elm_css$Css$Structure$Compatible,
        listStyleType: $rtfeldman$elm_css$Css$Structure$Compatible,
        listStyleTypeOrPositionOrImage: $rtfeldman$elm_css$Css$Structure$Compatible,
        none: $rtfeldman$elm_css$Css$Structure$Compatible,
        outline: $rtfeldman$elm_css$Css$Structure$Compatible,
        pointerDevice: $rtfeldman$elm_css$Css$Structure$Compatible,
        pointerEvents: $rtfeldman$elm_css$Css$Structure$Compatible,
        resize: $rtfeldman$elm_css$Css$Structure$Compatible,
        scriptingSupport: $rtfeldman$elm_css$Css$Structure$Compatible,
        textDecorationLine: $rtfeldman$elm_css$Css$Structure$Compatible,
        textTransform: $rtfeldman$elm_css$Css$Structure$Compatible,
        touchAction: $rtfeldman$elm_css$Css$Structure$Compatible,
        transform: $rtfeldman$elm_css$Css$Structure$Compatible,
        updateFrequency: $rtfeldman$elm_css$Css$Structure$Compatible,
        value: 'none'
    };
    var $rtfeldman$elm_css$Css$textDecoration = $rtfeldman$elm_css$Css$prop1('text-decoration');
    var $author$project$BasicParts$bottomNavigationStyle = function(select) {
        return _List_fromArray([
            $rtfeldman$elm_css$Css$displayFlex,
            $rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$center),
            $rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$center),
            $rtfeldman$elm_css$Css$flexDirection($rtfeldman$elm_css$Css$column),
            $rtfeldman$elm_css$Css$color(select ? A3($rtfeldman$elm_css$Css$rgb, 255, 255, 255) : A3($rtfeldman$elm_css$Css$rgb, 170, 170, 170)),
            $rtfeldman$elm_css$Css$textDecoration($rtfeldman$elm_css$Css$none)
        ]);
    };
    var $rtfeldman$elm_css$Css$fill = $rtfeldman$elm_css$Css$prop1('fill');
    var $rtfeldman$elm_css$VirtualDom$Styled$property = F2(function(key, value) {
        return A3($rtfeldman$elm_css$VirtualDom$Styled$Attribute, A2($elm$virtual_dom$VirtualDom$property, key, value), _List_Nil, '');
    });
    var $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty = F2(function(key, string) {
        return A2($rtfeldman$elm_css$VirtualDom$Styled$property, key, $elm$json$Json$Encode$string(string));
    });
    var $rtfeldman$elm_css$Html$Styled$Attributes$href = function(url) {
        return A2($rtfeldman$elm_css$Html$Styled$Attributes$stringProperty, 'href', url);
    };
    var $rtfeldman$elm_css$VirtualDom$Styled$Unstyled = function(a) {
        return {
            $: 'Unstyled',
            a: a
        };
    };
    var $rtfeldman$elm_css$VirtualDom$Styled$text = function(str) {
        return $rtfeldman$elm_css$VirtualDom$Styled$Unstyled($elm$virtual_dom$VirtualDom$text(str));
    };
    var $rtfeldman$elm_css$Html$Styled$text = $rtfeldman$elm_css$VirtualDom$Styled$text;
    var $author$project$BasicParts$bottomNavigationItem = F4(function(select, linkMaybe, iconMaybe, text) {
        return (function() {
            if (linkMaybe.$ === 'Just') {
                var link = linkMaybe.a;
                return $rtfeldman$elm_css$Html$Styled$a(_List_fromArray([
                    $rtfeldman$elm_css$Html$Styled$Attributes$css($author$project$BasicParts$bottomNavigationStyle(select)),
                    $rtfeldman$elm_css$Html$Styled$Attributes$href($author$project$PageLocation$toUrlAsString(link))
                ]));
            } else return $rtfeldman$elm_css$Html$Styled$div(_List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css($author$project$BasicParts$bottomNavigationStyle(select))
            ]));
        })()(function() {
            if (iconMaybe.$ === 'Just') {
                var icon = iconMaybe.a;
                return _List_fromArray([
                    icon($rtfeldman$elm_css$Css$batch(_List_fromArray([
                        $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$px(32)),
                        $rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$px(32)),
                        $rtfeldman$elm_css$Css$fill(select ? A3($rtfeldman$elm_css$Css$rgb, 255, 255, 255) : A3($rtfeldman$elm_css$Css$rgb, 170, 170, 170))
                    ]))),
                    $rtfeldman$elm_css$Html$Styled$text(text)
                ]);
            } else return _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text(text)
            ]);
        }());
    });
    var $elm$virtual_dom$VirtualDom$attribute = F2(function(key, value) {
        return A2(_VirtualDom_attribute, _VirtualDom_noOnOrFormAction(key), _VirtualDom_noJavaScriptOrHtmlUri(value));
    });
    var $rtfeldman$elm_css$Svg$Styled$Internal$css = function(styles) {
        var classname = $rtfeldman$elm_css$VirtualDom$Styled$getClassname(styles);
        var classAttribute = A2($elm$virtual_dom$VirtualDom$attribute, 'class', classname);
        return A3($rtfeldman$elm_css$VirtualDom$Styled$Attribute, classAttribute, styles, classname);
    };
    var $rtfeldman$elm_css$Svg$Styled$Attributes$css = $rtfeldman$elm_css$Svg$Styled$Internal$css;
    var $rtfeldman$elm_css$VirtualDom$Styled$attribute = F2(function(key, value) {
        return A3($rtfeldman$elm_css$VirtualDom$Styled$Attribute, A2($elm$virtual_dom$VirtualDom$attribute, key, value), _List_Nil, '');
    });
    var $rtfeldman$elm_css$Svg$Styled$Attributes$d = $rtfeldman$elm_css$VirtualDom$Styled$attribute('d');
    var $rtfeldman$elm_css$VirtualDom$Styled$NodeNS = F4(function(a, b, c, d) {
        return {
            $: 'NodeNS',
            a: a,
            b: b,
            c: c,
            d: d
        };
    });
    var $rtfeldman$elm_css$VirtualDom$Styled$nodeNS = $rtfeldman$elm_css$VirtualDom$Styled$NodeNS;
    var $rtfeldman$elm_css$Svg$Styled$node = $rtfeldman$elm_css$VirtualDom$Styled$nodeNS('http://www.w3.org/2000/svg');
    var $rtfeldman$elm_css$Svg$Styled$path = $rtfeldman$elm_css$Svg$Styled$node('path');
    var $rtfeldman$elm_css$Svg$Styled$svg = $rtfeldman$elm_css$Svg$Styled$node('svg');
    var $rtfeldman$elm_css$Svg$Styled$Attributes$viewBox = $rtfeldman$elm_css$VirtualDom$Styled$attribute('viewBox');
    var $author$project$Icon$home = function(style) {
        return A2($rtfeldman$elm_css$Svg$Styled$svg, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 24 24'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$css(_List_fromArray([
                style
            ]))
        ]), _List_fromArray([
            A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
                $rtfeldman$elm_css$Svg$Styled$Attributes$d('M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z')
            ]), _List_Nil)
        ]));
    };
    var $author$project$Icon$notifications = function(style) {
        return A2($rtfeldman$elm_css$Svg$Styled$svg, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 24 24'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$css(_List_fromArray([
                style
            ]))
        ]), _List_fromArray([
            A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
                $rtfeldman$elm_css$Svg$Styled$Attributes$d('M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29c-.63.63-.19 1.71.7 1.71h13.17c.89 0 1.34-1.08.71-1.71L18 16z')
            ]), _List_Nil)
        ]));
    };
    var $author$project$Icon$search = function(style) {
        return A2($rtfeldman$elm_css$Svg$Styled$svg, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 24 24'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$css(_List_fromArray([
                style
            ]))
        ]), _List_fromArray([
            A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
                $rtfeldman$elm_css$Svg$Styled$Attributes$d('M15.5 14h-.79l-.28-.27c1.2-1.4 1.82-3.31 1.48-5.34-.47-2.78-2.79-5-5.59-5.34-4.23-.52-7.79 3.04-7.27 7.27.34 2.8 2.56 5.12 5.34 5.59 2.03.34 3.94-.28 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z')
            ]), _List_Nil)
        ]));
    };
    var $rtfeldman$elm_css$Css$borderRadius = $rtfeldman$elm_css$Css$prop1('border-radius');
    var $rtfeldman$elm_css$Css$flexShrink = $rtfeldman$elm_css$Css$prop1('flex-shrink');
    var $rtfeldman$elm_css$Html$Styled$img = $rtfeldman$elm_css$Html$Styled$node('img');
    var $rtfeldman$elm_css$Css$int = function(val) {
        return {
            fontWeight: $rtfeldman$elm_css$Css$Structure$Compatible,
            intOrAuto: $rtfeldman$elm_css$Css$Structure$Compatible,
            lengthOrNumber: $rtfeldman$elm_css$Css$Structure$Compatible,
            lengthOrNumberOrAutoOrNoneOrContent: $rtfeldman$elm_css$Css$Structure$Compatible,
            number: $rtfeldman$elm_css$Css$Structure$Compatible,
            numberOrInfinite: $rtfeldman$elm_css$Css$Structure$Compatible,
            numericValue: val,
            unitLabel: '',
            units: $rtfeldman$elm_css$Css$UnitlessInteger,
            value: $elm$core$String$fromInt(val)
        };
    };
    var $rtfeldman$elm_css$Css$padding = $rtfeldman$elm_css$Css$prop1('padding');
    var $rtfeldman$elm_css$Html$Styled$Attributes$src = function(url) {
        return A2($rtfeldman$elm_css$Html$Styled$Attributes$stringProperty, 'src', url);
    };
    var $author$project$Data$ImageId$toUrlString = function(_v0) {
        var id = _v0.a;
        return 'https://asia-northeast1-tsukumart-f0971.cloudfunctions.net/image/' + id;
    };
    var $author$project$Style$userImage = F2(function(size, imageId) {
        return A2($rtfeldman$elm_css$Html$Styled$img, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $rtfeldman$elm_css$Css$display($rtfeldman$elm_css$Css$block),
                $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$px(size)),
                $rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$px(size)),
                $rtfeldman$elm_css$Css$borderRadius($rtfeldman$elm_css$Css$pct(50)),
                $rtfeldman$elm_css$Css$flexShrink($rtfeldman$elm_css$Css$int(0)),
                $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(4))
            ])),
            $rtfeldman$elm_css$Html$Styled$Attributes$src($author$project$Data$ImageId$toUrlString(imageId))
        ]), _List_Nil);
    });
    var $author$project$Data$User$withNameGetImageId = function(_v0) {
        var imageId = _v0.a.imageId;
        return imageId;
    };
    var $author$project$BasicParts$bottomNavigation = F2(function(logInState, select) {
        switch(logInState.$){
            case 'None':
                return $author$project$BasicParts$bottomNavigationContainer(_List_fromArray([
                    A4($author$project$BasicParts$bottomNavigationItem, _Utils_eq(select, $author$project$BasicParts$Home), $elm$core$Maybe$Just($author$project$PageLocation$Home), $elm$core$Maybe$Just($author$project$Icon$home), 'ホーム'),
                    A4($author$project$BasicParts$bottomNavigationItem, _Utils_eq(select, $author$project$BasicParts$Search), $elm$core$Maybe$Just($author$project$PageLocation$Search), $elm$core$Maybe$Just($author$project$Icon$search), '検索'),
                    A4($author$project$BasicParts$bottomNavigationItem, _Utils_eq(select, $author$project$BasicParts$User), $elm$core$Maybe$Just($author$project$PageLocation$LogIn), $elm$core$Maybe$Nothing, 'ログイン')
                ]));
            case 'LoadingProfile':
                return $author$project$BasicParts$bottomNavigationContainer(_List_fromArray([
                    A4($author$project$BasicParts$bottomNavigationItem, _Utils_eq(select, $author$project$BasicParts$Home), $elm$core$Maybe$Just($author$project$PageLocation$Home), $elm$core$Maybe$Just($author$project$Icon$home), 'ホーム'),
                    A4($author$project$BasicParts$bottomNavigationItem, _Utils_eq(select, $author$project$BasicParts$Search), $elm$core$Maybe$Just($author$project$PageLocation$Search), $elm$core$Maybe$Just($author$project$Icon$search), '検索'),
                    A4($author$project$BasicParts$bottomNavigationItem, _Utils_eq(select, $author$project$BasicParts$Notification), $elm$core$Maybe$Just($author$project$PageLocation$Notification), $elm$core$Maybe$Just($author$project$Icon$notifications), '通知'),
                    A4($author$project$BasicParts$bottomNavigationItem, _Utils_eq(select, $author$project$BasicParts$User), $elm$core$Maybe$Just($author$project$PageLocation$LogIn), $elm$core$Maybe$Nothing, 'ユーザー')
                ]));
            default:
                var userWithName = logInState.a.userWithName;
                return $author$project$BasicParts$bottomNavigationContainer(_List_fromArray([
                    A4($author$project$BasicParts$bottomNavigationItem, _Utils_eq(select, $author$project$BasicParts$Home), $elm$core$Maybe$Just($author$project$PageLocation$Home), $elm$core$Maybe$Just($author$project$Icon$home), 'ホーム'),
                    A4($author$project$BasicParts$bottomNavigationItem, _Utils_eq(select, $author$project$BasicParts$Search), $elm$core$Maybe$Just($author$project$PageLocation$Search), $elm$core$Maybe$Just($author$project$Icon$search), '検索'),
                    A4($author$project$BasicParts$bottomNavigationItem, _Utils_eq(select, $author$project$BasicParts$Notification), $elm$core$Maybe$Just($author$project$PageLocation$Notification), $elm$core$Maybe$Just($author$project$Icon$notifications), '通知'),
                    A4($author$project$BasicParts$bottomNavigationItem, _Utils_eq(select, $author$project$BasicParts$User), $elm$core$Maybe$Just($author$project$PageLocation$User($author$project$Data$User$withNameGetId(userWithName))), $elm$core$Maybe$Just($elm$core$Basics$always(A2($author$project$Style$userImage, 32, $author$project$Data$User$withNameGetImageId(userWithName)))), 'ユーザー')
                ]));
        }
    });
    var $rtfeldman$elm_css$Css$breakWord = {
        overflowWrap: $rtfeldman$elm_css$Css$Structure$Compatible,
        value: 'break-word'
    };
    var $author$project$Style$gridTemplateRows = $rtfeldman$elm_css$Css$property('grid-template-rows');
    var $rtfeldman$elm_css$Css$cursor = $rtfeldman$elm_css$Css$prop1('cursor');
    var $rtfeldman$elm_css$Svg$Styled$Attributes$fill = $rtfeldman$elm_css$VirtualDom$Styled$attribute('fill');
    var $rtfeldman$elm_css$Css$Preprocess$ExtendSelector = F2(function(a, b) {
        return {
            $: 'ExtendSelector',
            a: a,
            b: b
        };
    });
    var $rtfeldman$elm_css$Css$Structure$PseudoClassSelector = function(a) {
        return {
            $: 'PseudoClassSelector',
            a: a
        };
    };
    var $rtfeldman$elm_css$Css$pseudoClass = function(_class) {
        return $rtfeldman$elm_css$Css$Preprocess$ExtendSelector($rtfeldman$elm_css$Css$Structure$PseudoClassSelector(_class));
    };
    var $rtfeldman$elm_css$Css$hover = $rtfeldman$elm_css$Css$pseudoClass('hover');
    var $rtfeldman$elm_css$Css$rgba = F4(function(r, g, b, alpha) {
        return {
            alpha: alpha,
            blue: b,
            color: $rtfeldman$elm_css$Css$Structure$Compatible,
            green: g,
            red: r,
            value: A2($rtfeldman$elm_css$Css$cssFunction, 'rgba', _Utils_ap(A2($elm$core$List$map, $elm$core$String$fromInt, _List_fromArray([
                r,
                g,
                b
            ])), _List_fromArray([
                $elm$core$String$fromFloat(alpha)
            ])))
        };
    });
    var $author$project$BasicParts$hoverCss = $rtfeldman$elm_css$Css$hover(_List_fromArray([
        $rtfeldman$elm_css$Css$backgroundColor(A4($rtfeldman$elm_css$Css$rgba, 0, 0, 0, 0.4))
    ]));
    var $elm$virtual_dom$VirtualDom$Normal = function(a) {
        return {
            $: 'Normal',
            a: a
        };
    };
    var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
    var $rtfeldman$elm_css$VirtualDom$Styled$on = F2(function(eventName, handler) {
        return A3($rtfeldman$elm_css$VirtualDom$Styled$Attribute, A2($elm$virtual_dom$VirtualDom$on, eventName, handler), _List_Nil, '');
    });
    var $rtfeldman$elm_css$Html$Styled$Events$on = F2(function(event, decoder) {
        return A2($rtfeldman$elm_css$VirtualDom$Styled$on, event, $elm$virtual_dom$VirtualDom$Normal(decoder));
    });
    var $rtfeldman$elm_css$Html$Styled$Events$onClick = function(msg) {
        return A2($rtfeldman$elm_css$Html$Styled$Events$on, 'click', $elm$json$Json$Decode$succeed(msg));
    };
    var $rtfeldman$elm_css$Css$pointer = {
        cursor: $rtfeldman$elm_css$Css$Structure$Compatible,
        value: 'pointer'
    };
    var $author$project$BasicParts$backArrow = A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
        $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
            $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$px(32)),
            $rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$px(32)),
            $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(16)),
            $rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$pointer),
            $author$project$BasicParts$hoverCss
        ])),
        $rtfeldman$elm_css$Html$Styled$Events$onClick(_Utils_Tuple0)
    ]), _List_fromArray([
        A2($rtfeldman$elm_css$Svg$Styled$svg, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 24 24')
        ]), _List_fromArray([
            A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
                $rtfeldman$elm_css$Svg$Styled$Attributes$d('M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z'),
                $rtfeldman$elm_css$Svg$Styled$Attributes$fill('white')
            ]), _List_Nil)
        ]))
    ]));
    var $rtfeldman$elm_css$Css$flexGrow = $rtfeldman$elm_css$Css$prop1('flex-grow');
    var $rtfeldman$elm_css$Html$Styled$h1 = $rtfeldman$elm_css$Html$Styled$node('h1');
    var $rtfeldman$elm_css$Css$borderBox = {
        backgroundClip: $rtfeldman$elm_css$Css$Structure$Compatible,
        boxSizing: $rtfeldman$elm_css$Css$Structure$Compatible,
        value: 'border-box'
    };
    var $rtfeldman$elm_css$Css$boxSizing = $rtfeldman$elm_css$Css$prop1('box-sizing');
    var $rtfeldman$elm_css$Html$Styled$header = $rtfeldman$elm_css$Html$Styled$node('header');
    var $rtfeldman$elm_css$Css$prop4 = F5(function(key, argA, argB, argC, argD) {
        return A2($rtfeldman$elm_css$Css$property, key, A2($elm$core$String$join, ' ', _List_fromArray([
            argA.value,
            argB.value,
            argC.value,
            argD.value
        ])));
    });
    var $rtfeldman$elm_css$Css$boxShadow4 = $rtfeldman$elm_css$Css$prop4('box-shadow');
    var $author$project$Style$normalShadow = A4($rtfeldman$elm_css$Css$boxShadow4, $rtfeldman$elm_css$Css$zero, $rtfeldman$elm_css$Css$px(2), $rtfeldman$elm_css$Css$px(4), A4($rtfeldman$elm_css$Css$rgba, 0, 0, 0, 0.18));
    var $author$project$Style$primaryColor = A3($rtfeldman$elm_css$Css$rgb, 115, 63, 167);
    var $rtfeldman$elm_css$Css$zIndex = $rtfeldman$elm_css$Css$prop1('z-index');
    var $author$project$BasicParts$header = $rtfeldman$elm_css$Html$Styled$header(_List_fromArray([
        $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
            $rtfeldman$elm_css$Css$displayFlex,
            $rtfeldman$elm_css$Css$backgroundColor($author$project$Style$primaryColor),
            $author$project$Style$normalShadow,
            $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$pct(100)),
            $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$zero),
            $rtfeldman$elm_css$Css$boxSizing($rtfeldman$elm_css$Css$borderBox),
            $rtfeldman$elm_css$Css$zIndex($rtfeldman$elm_css$Css$int(2)),
            A2($author$project$Style$gridColumn, 1, 3),
            A2($author$project$Style$gridRow, 1, 2)
        ]))
    ]));
    var $author$project$BasicParts$logoSubTextFontColor = $rtfeldman$elm_css$Svg$Styled$Attributes$fill('#ffe2a6');
    var $rtfeldman$elm_css$Svg$Styled$Attributes$transform = $rtfeldman$elm_css$VirtualDom$Styled$attribute('transform');
    var $author$project$BasicParts$logoSubText = _List_fromArray([
        A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$d('M45.47,34.08a9.23,9.23,0,0,1,.8,1.56.62.62,0,0,1,0,.18.5.5,0,0,1-.42.46l-.24,0a.49.49,0,0,1-.51-.34,9.9,9.9,0,0,0-.89-1.89h-.88A13.18,13.18,0,0,1,42,35.85a.76.76,0,0,1-.54.28.65.65,0,0,1-.41-.16.61.61,0,0,1-.21-.44.53.53,0,0,1,.18-.41,9.3,9.3,0,0,0,2.16-3.36.52.52,0,0,1,.51-.34l.26,0c.29.1.42.24.42.46a.65.65,0,0,1-.07.29c-.11.27-.22.55-.35.83h3.73c.28,0,.47.18.47.53a.46.46,0,0,1-.47.52Zm-3.77,4.1c-.29,0-.45-.25-.45-.57s.16-.55.45-.55h4.88c.29,0,.45.22.45.55s-.16.57-.45.57H44.69v4.43c.56-.19,1.09-.39,1.55-.58a.57.57,0,0,1,.27-.07.45.45,0,0,1,.43.3.67.67,0,0,1,0,.24.65.65,0,0,1-.43.62,34.44,34.44,0,0,1-4.91,1.61h-.18a.54.54,0,0,1-.55-.48,1,1,0,0,1,0-.22.48.48,0,0,1,.43-.52A20.06,20.06,0,0,0,43.47,43V38.18Zm11.85,6.29c0,.32.13.39.5.39s.57-.12.67-.43a5.5,5.5,0,0,0,.18-1.51c0-.34.23-.48.54-.48h0A.48.48,0,0,1,56,43a7.18,7.18,0,0,1-.29,2c-.23.68-.6,1-1.75,1-1.32,0-1.6-.27-1.6-1.18V37.89c0-.33-.14-.43-.48-.43H49.42c-.32,0-.48.1-.48.43,0,4.72-.67,6.64-2.51,8.28a.88.88,0,0,1-.55.23.61.61,0,0,1-.44-.19.68.68,0,0,1-.21-.48.52.52,0,0,1,.23-.42c1.87-1.56,2.29-3.18,2.29-7.62,0-.93.42-1.3,1.35-1.3h3.1c.94,0,1.35.37,1.35,1.3ZM49.78,34.1a8.8,8.8,0,0,1-1.09,1.59.67.67,0,0,1-.5.28.64.64,0,0,1-.39-.15.5.5,0,0,1-.21-.4.71.71,0,0,1,.17-.43,8.45,8.45,0,0,0,1.73-3.18.5.5,0,0,1,.52-.39l.24,0a.52.52,0,0,1,.37.73,7.71,7.71,0,0,1-.32.86h4.89c.29,0,.47.17.47.52s-.18.54-.47.54H52.4a7.5,7.5,0,0,1,.68,1.36.61.61,0,0,1,0,.17.47.47,0,0,1-.42.45.82.82,0,0,1-.21,0,.59.59,0,0,1-.56-.37,8.78,8.78,0,0,0-.76-1.64ZM50,38.94a.67.67,0,0,1,.52.33,14.25,14.25,0,0,1,1.33,2.65.77.77,0,0,1,.07.32.59.59,0,0,1-.36.54.67.67,0,0,1-.28.08.55.55,0,0,1-.49-.42,15.31,15.31,0,0,0-1.28-2.64.54.54,0,0,1-.11-.32.5.5,0,0,1,.31-.46A.6.6,0,0,1,50,38.94Z'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
            $author$project$BasicParts$logoSubTextFontColor
        ]), _List_Nil),
        A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$d('M60.47,41.18a.7.7,0,0,1,0,.25A24.41,24.41,0,0,1,58.16,46a.63.63,0,0,1-.52.27.72.72,0,0,1-.42-.13.55.55,0,0,1-.29-.5.65.65,0,0,1,.11-.36A20,20,0,0,0,59.23,41a.56.56,0,0,1,.54-.39.71.71,0,0,1,.7.61ZM60.32,38a.59.59,0,0,1-.14.37.63.63,0,0,1-.49.24.69.69,0,0,1-.46-.18,16.21,16.21,0,0,0-2-1.59.52.52,0,0,1-.23-.44.73.73,0,0,1,.13-.39.69.69,0,0,1,.5-.26.64.64,0,0,1,.33.1,14,14,0,0,1,2.16,1.64A.74.74,0,0,1,60.32,38ZM61,34a.57.57,0,0,1-.16.41.64.64,0,0,1-.47.23.71.71,0,0,1-.52-.25A13.88,13.88,0,0,0,58,32.83a.51.51,0,0,1-.23-.42A.69.69,0,0,1,57.9,32a.76.76,0,0,1,.52-.25.67.67,0,0,1,.36.12,12.26,12.26,0,0,1,2,1.69A.64.64,0,0,1,61,34Zm2.1,4.73c-.2,3.48-.81,5.59-1.82,7.23a.66.66,0,0,1-.54.35.78.78,0,0,1-.36-.1.54.54,0,0,1-.3-.49.67.67,0,0,1,.13-.39c1.26-2,1.7-4.22,1.7-9.07V34.91a1.29,1.29,0,0,1,1.46-1.46H66V31.86c0-.31.22-.47.6-.47s.6.16.6.47v1.59h3.46c.78,0,1.2.39,1.2,1a1.55,1.55,0,0,1-.1.54,6.33,6.33,0,0,1-1,1.76.71.71,0,0,1-.56.3.6.6,0,0,1-.35-.11.53.53,0,0,1-.25-.42.63.63,0,0,1,.13-.36,6.22,6.22,0,0,0,.78-1.22.27.27,0,0,0,0-.16c0-.11-.09-.16-.31-.16h-3v3.07h2.52a1,1,0,0,1,1.1,1,1.82,1.82,0,0,1-.14.66,12,12,0,0,1-2.62,3.77,12.69,12.69,0,0,0,3.59,2,.61.61,0,0,1,.41.57.86.86,0,0,1,0,.27.66.66,0,0,1-.59.41.68.68,0,0,1-.29-.07,13.35,13.35,0,0,1-4-2.35,14.08,14.08,0,0,1-4,2.39.69.69,0,0,1-.31.06.6.6,0,0,1-.54-.37.7.7,0,0,1-.05-.25.61.61,0,0,1,.44-.56,14,14,0,0,0,3.64-2.07,13.4,13.4,0,0,1-2.63-4.34Zm3-1.1V34.59H63.72c-.44,0-.6.13-.6.63v1.22c0,.42,0,.83,0,1.22Zm-1.11,1.1a10.4,10.4,0,0,0,2.31,3.59,8.91,8.91,0,0,0,2.23-3.15.74.74,0,0,0,0-.23c0-.14-.08-.21-.26-.21Z'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
            $author$project$BasicParts$logoSubTextFontColor
        ]), _List_Nil),
        A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$d('M81.31,36.59a12.32,12.32,0,0,0,2.54,5,12.09,12.09,0,0,0,4.09,3.17.58.58,0,0,1,.38.55.87.87,0,0,1-.13.44.67.67,0,0,1-.59.34.85.85,0,0,1-.4-.1,13.17,13.17,0,0,1-4.33-3.55,12.81,12.81,0,0,1-2.14-4.16,11.82,11.82,0,0,1-1.16,3,11.28,11.28,0,0,1-5.23,4.8,1.07,1.07,0,0,1-.32.08.66.66,0,0,1-.6-.41.68.68,0,0,1-.1-.36.59.59,0,0,1,.36-.53,9.6,9.6,0,0,0,4.82-4.28,10.87,10.87,0,0,0,1.25-4H74c-.32,0-.5-.3-.5-.65s.18-.62.5-.62h5.88c.07-.91.1-2,.1-3.15,0-.39.28-.56.67-.56s.65.2.65.56c0,1.13,0,2.17-.12,3.15h6.44c.32,0,.5.27.5.62s-.18.65-.5.65Z'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
            $author$project$BasicParts$logoSubTextFontColor
        ]), _List_Nil),
        A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$d('M103.91,44.68c.3,0,.47.24.47.6s-.17.58-.47.58H90.13c-.29,0-.45-.24-.45-.58s.16-.6.45-.6h6.39V40.57H92.21c-.29,0-.48-.25-.48-.59s.19-.58.48-.58h4.31V36h-3.8a15.92,15.92,0,0,1-1.89,3,.64.64,0,0,1-.47.24.67.67,0,0,1-.47-.19.57.57,0,0,1-.23-.44.81.81,0,0,1,.18-.46,15,15,0,0,0,2.84-5.63.53.53,0,0,1,.54-.41l.23,0a.59.59,0,0,1,.5.54.3.3,0,0,1,0,.16,16.39,16.39,0,0,1-.7,1.95h3.3V32c0-.31.28-.5.65-.5s.67.19.67.5v2.86h5.47c.29,0,.46.23.46.59s-.17.58-.46.58H97.84v3.4h4.61c.29,0,.47.24.47.58s-.18.59-.47.59H97.84v4.11Z'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
            $author$project$BasicParts$logoSubTextFontColor
        ]), _List_Nil),
        A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$d('M109,40.57c-.92,0-1.36-.38-1.36-1.27v-3c0-.89.44-1.27,1.36-1.27h3.82V33.94h-6.11c-.27,0-.45-.2-.45-.54s.18-.52.45-.52h6.11v-1c0-.28.25-.46.6-.46s.59.18.59.46v1h6.43c.28,0,.46.18.46.52s-.18.54-.46.54h-6.43V35h4.14c.91,0,1.35.38,1.35,1.29v3c0,.89-.44,1.27-1.35,1.27h-.61v1h2.92c.28,0,.44.21.44.52s-.16.56-.44.56h-2.92v2.45c0,.94-.54,1.35-1.78,1.35a9,9,0,0,1-1.56-.15.49.49,0,0,1-.47-.53.56.56,0,0,1,0-.17.48.48,0,0,1,.5-.45h.18a5.69,5.69,0,0,0,1.19.13c.58,0,.71-.09.71-.52V42.7h-9.65c-.28,0-.44-.23-.44-.56s.16-.52.44-.52h9.65v-1Zm.41-4.62c-.37,0-.57.13-.57.51v.79h4V36Zm-.57,2.21v.94c0,.39.2.51.57.51h3.41V38.16Zm3.58,6.6a.59.59,0,0,1,.14.37.54.54,0,0,1-.21.43.7.7,0,0,1-.45.17.58.58,0,0,1-.43-.17,13.28,13.28,0,0,0-1.72-1.6.4.4,0,0,1-.19-.34.54.54,0,0,1,.19-.39.72.72,0,0,1,.46-.18.74.74,0,0,1,.42.15A15.33,15.33,0,0,1,112.46,44.76Zm5.88-7.51v-.79c0-.38-.2-.51-.57-.51h-3.72v1.3Zm-.57,2.36c.37,0,.57-.12.57-.51v-.94h-4.29v1.45Z'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
            $author$project$BasicParts$logoSubTextFontColor
        ]), _List_Nil),
        A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$d('M124.87,41.1A11.46,11.46,0,0,1,123.5,46a.61.61,0,0,1-.55.34.76.76,0,0,1-.36-.1.65.65,0,0,1-.37-.56.56.56,0,0,1,.1-.33c1.2-1.79,1.41-4.32,1.44-8.37,0-1,0-2.16,0-3.52,0-1,.48-1.4,1.45-1.4H135c1,0,1.45.4,1.45,1.4V44.76c0,1-.62,1.53-1.94,1.53a11.21,11.21,0,0,1-2-.17.51.51,0,0,1-.47-.53.46.46,0,0,1,0-.2.5.5,0,0,1,.49-.45h.16a8.09,8.09,0,0,0,1.61.18c.75,0,.89-.13.89-.66V41.1h-4.74v4.44c0,.29-.26.45-.64.45s-.6-.16-.6-.45V41.1Zm.16-4a1.1,1.1,0,0,0,0,.25c0,.91,0,1.77-.06,2.57h4.27V37.15ZM129.22,36V33.25h-3.64c-.36,0-.52.1-.52.49,0,.85,0,1.59,0,2.29Zm6-2.29c0-.39-.14-.49-.5-.49h-4.24V36h4.74Zm0,3.41h-4.74V40h4.74Z'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
            $author$project$BasicParts$logoSubTextFontColor
        ]), _List_Nil),
        A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$d('M146.93,34c-1.66.18-3.36.31-5.05.36h0a.55.55,0,0,1-.6-.59.53.53,0,0,1,.53-.6,39.31,39.31,0,0,0,10.35-1.43.8.8,0,0,1,.31-.07.54.54,0,0,1,.54.41,1,1,0,0,1,0,.28.58.58,0,0,1-.47.57,36.9,36.9,0,0,1-4.34.89v2.62h5.26c.28,0,.46.24.46.58a.51.51,0,0,1-.46.57H148.2v2.44h6a.52.52,0,0,1,.47.58c0,.33-.19.6-.47.6h-6v3.38c0,1.21-.52,1.66-2.18,1.66a9.73,9.73,0,0,1-2-.19.57.57,0,0,1-.46-.61.36.36,0,0,1,0-.14.5.5,0,0,1,.52-.49.44.44,0,0,1,.16,0,10.05,10.05,0,0,0,1.68.18c.84,0,1-.12,1-.67V41.23h-6.34a.52.52,0,0,1-.47-.58c0-.34.18-.6.47-.6h6.34V37.61h-5.57c-.3,0-.46-.24-.46-.57s.16-.58.46-.58h5.57Z'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
            $author$project$BasicParts$logoSubTextFontColor
        ]), _List_Nil),
        A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$d('M159.29,41.18a1.29,1.29,0,0,1,0,.25,21.92,21.92,0,0,1-1.92,4.63.65.65,0,0,1-.55.31.73.73,0,0,1-.36-.1.58.58,0,0,1-.32-.52.74.74,0,0,1,.1-.37A19.32,19.32,0,0,0,158.07,41a.55.55,0,0,1,.54-.42.91.91,0,0,1,.23,0A.53.53,0,0,1,159.29,41.18ZM159.5,38a.54.54,0,0,1-.14.37.62.62,0,0,1-.51.25.66.66,0,0,1-.43-.18,14.59,14.59,0,0,0-2-1.5.48.48,0,0,1-.22-.44.75.75,0,0,1,.13-.39.66.66,0,0,1,.5-.24.76.76,0,0,1,.33.08,13,13,0,0,1,2.14,1.55A.62.62,0,0,1,159.5,38Zm.44-4.45a.73.73,0,0,1,.2.48.57.57,0,0,1-.16.41.6.6,0,0,1-.46.21.75.75,0,0,1-.52-.23,13.47,13.47,0,0,0-1.85-1.59.57.57,0,0,1-.21-.45.65.65,0,0,1,.13-.39.68.68,0,0,1,.52-.25.57.57,0,0,1,.35.12A13.39,13.39,0,0,1,159.94,33.55Zm10.76-.83c.29,0,.44.24.44.55s-.15.59-.44.59h-8.35c-.41,0-.57.14-.57.58,0,1.8-.05,4.32-.23,6.11a14.86,14.86,0,0,1-1.48,5.38.75.75,0,0,1-.63.39.8.8,0,0,1-.26,0,.62.62,0,0,1-.34-.55.61.61,0,0,1,.1-.34,12.91,12.91,0,0,0,1.41-5c.18-1.85.23-4.19.23-6.21A1.27,1.27,0,0,1,162,32.72h3.06v-.86c0-.33.24-.49.61-.49s.62.16.62.49v.86Zm-8.21,8.5c-.29,0-.43-.21-.43-.52s.14-.52.43-.52h6.2c.71,0,1.08.39,1.08.87a1.28,1.28,0,0,1-.26.74A10,10,0,0,1,167.35,44a12.42,12.42,0,0,0,3.42,1.31.53.53,0,0,1,.47.54.44.44,0,0,1,0,.16.52.52,0,0,1-.55.46,1.29,1.29,0,0,1-.25,0,14,14,0,0,1-4.06-1.77,14.48,14.48,0,0,1-4.47,1.76h-.16a.55.55,0,0,1-.58-.4.33.33,0,0,1,0-.18.53.53,0,0,1,.46-.54,12.84,12.84,0,0,0,3.85-1.35,9.7,9.7,0,0,1-2.16-2.69ZM169,38c0,.84-.4,1.17-1.23,1.17h-2.71c-.85,0-1.26-.33-1.26-1.17v-1.4h-1.3c-.24,0-.4-.21-.4-.5s.16-.51.4-.51h1.3v-.91c0-.29.25-.45.56-.45s.55.16.55.45v.91h3v-.91c0-.29.19-.45.55-.45s.55.16.55.45v.91h1.55c.29,0,.42.18.42.51s-.13.5-.42.5H169Zm-4.55,3.25a7.07,7.07,0,0,0,1.95,2.09,9.14,9.14,0,0,0,1.87-1.69.41.41,0,0,0,.12-.24c0-.1-.08-.16-.25-.16Zm.46-4.65v1.2c0,.29.15.39.44.39h2.11c.29,0,.44-.08.44-.39v-1.2Z'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
            $author$project$BasicParts$logoSubTextFontColor
        ]), _List_Nil),
        A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$d('M176.94,32.83v.05c-.08,2.39-.21,5.27-.21,7.87,0,1.52.19,2.37.71,2.87a3.46,3.46,0,0,0,2.47.68,4.75,4.75,0,0,0,3.48-1.39,7.78,7.78,0,0,0,1.72-3.24.66.66,0,0,1,.62-.55.8.8,0,0,1,.26.05.68.68,0,0,1,.5.67.71.71,0,0,1-.05.27,8.84,8.84,0,0,1-2.16,3.9,6.14,6.14,0,0,1-4.4,1.72,4.73,4.73,0,0,1-3.46-1.12c-.75-.73-1.09-1.78-1.09-3.85,0-2.52.08-5.52.19-7.91a.66.66,0,0,1,.7-.68h0A.62.62,0,0,1,176.94,32.83Z'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
            $author$project$BasicParts$logoSubTextFontColor
        ]), _List_Nil),
        A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$d('M200.46,33.22a1.82,1.82,0,0,1,1.56.59,1.75,1.75,0,0,1,.34,1.17,3.64,3.64,0,0,1,0,.45c-.7,4.94-4.11,8.65-9.5,10a1,1,0,0,1-.3.05.59.59,0,0,1-.61-.46,1.17,1.17,0,0,1,0-.26.7.7,0,0,1,.52-.68c4.68-1.23,7.87-4.31,8.4-8.68a1,1,0,0,0,0-.24c0-.42-.21-.54-.71-.54h-9.48c-.37,0-.58-.29-.58-.7a.6.6,0,0,1,.58-.68Z'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
            $author$project$BasicParts$logoSubTextFontColor
        ]), _List_Nil),
        A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$d('M208.41,40.08a.66.66,0,0,1-.74.67.65.65,0,0,1-.73-.65V33a.66.66,0,0,1,.73-.66c.44,0,.74.22.74.65ZM215,33a.65.65,0,0,1,.7-.68c.44,0,.77.22.77.65v5.29c0,2.44-.62,4.15-2,5.37a9.68,9.68,0,0,1-5,2.08h-.12a.71.71,0,0,1-.73-.57,1.15,1.15,0,0,1,0-.18.62.62,0,0,1,.58-.64,8.2,8.2,0,0,0,4.29-1.78c1.06-1,1.51-2.36,1.51-4.47Z'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
            $author$project$BasicParts$logoSubTextFontColor
        ]), _List_Nil),
        A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$d('M222.12,39.82a.61.61,0,0,1-.64-.7.65.65,0,0,1,.65-.73h12.34a.65.65,0,0,1,.65.73.61.61,0,0,1-.64.7Z'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
            $author$project$BasicParts$logoSubTextFontColor
        ]), _List_Nil),
        A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$d('M238.4,34.94c-.35,0-.56-.3-.56-.68a.63.63,0,0,1,.56-.7h11a1.67,1.67,0,0,1,1.43.6,1.41,1.41,0,0,1,.28.86,2.36,2.36,0,0,1-.33,1.15,17,17,0,0,1-5.6,5.67,27.46,27.46,0,0,1,1.9,2.38.67.67,0,0,1,.13.42.86.86,0,0,1-.36.67.76.76,0,0,1-.4.13.78.78,0,0,1-.64-.38,38.65,38.65,0,0,0-5.6-6.4.63.63,0,0,1-.25-.47.62.62,0,0,1,.28-.49.63.63,0,0,1,.44-.18.86.86,0,0,1,.52.21,35.2,35.2,0,0,1,3.08,3,14.49,14.49,0,0,0,5-5,1,1,0,0,0,.15-.45c0-.26-.2-.39-.61-.39Z'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
            $author$project$BasicParts$logoSubTextFontColor
        ]), _List_Nil),
        A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$d('M254.61,39.82a.61.61,0,0,1-.64-.7.65.65,0,0,1,.65-.73H267a.65.65,0,0,1,.65.73c0,.44-.23.7-.63.7Z'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
            $author$project$BasicParts$logoSubTextFontColor
        ]), _List_Nil),
        A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$d('M280.2,36.1c-.15,4.81-2.37,8.2-6.62,9.73a1.25,1.25,0,0,1-.32.05.65.65,0,0,1-.62-.39.83.83,0,0,1-.08-.32.67.67,0,0,1,.49-.64c3.54-1.31,5.56-4,5.74-8.43h-4.93a11.61,11.61,0,0,1-2.73,3.25.8.8,0,0,1-.5.19.66.66,0,0,1-.47-.21.71.71,0,0,1-.21-.5.7.7,0,0,1,.27-.55,12.16,12.16,0,0,0,3.3-4.72,8.71,8.71,0,0,0,.45-1.22.65.65,0,0,1,.61-.48l.21,0a.63.63,0,0,1,.53.6.92.92,0,0,1,0,.16,14.11,14.11,0,0,1-.88,2.16h9a.56.56,0,0,1,.62.64c0,.4-.19.65-.6.65Z'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
            $author$project$BasicParts$logoSubTextFontColor
        ]), _List_Nil),
        A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$d('M288.82,36.11a.58.58,0,0,1,.54.35,22,22,0,0,1,1.35,3.36c0,.1,0,.16,0,.24a.55.55,0,0,1-.45.54.91.91,0,0,1-.26,0,.56.56,0,0,1-.57-.41,22.2,22.2,0,0,0-1.3-3.3.38.38,0,0,1-.07-.22.59.59,0,0,1,.42-.54A.73.73,0,0,1,288.82,36.11Zm9.57.31v.12a11.85,11.85,0,0,1-2,5.83,9.46,9.46,0,0,1-5.46,3.45h-.18a.57.57,0,0,1-.58-.44,1,1,0,0,1,0-.24.54.54,0,0,1,.45-.54,8.45,8.45,0,0,0,4.78-3,11.28,11.28,0,0,0,1.75-5.26.55.55,0,0,1,.61-.5h.08C298.18,35.87,298.39,36.07,298.39,36.42Zm-6.15-1a.62.62,0,0,1,.55.36,17.56,17.56,0,0,1,1.27,3.32.86.86,0,0,1,0,.16.57.57,0,0,1-.44.55,1.18,1.18,0,0,1-.27,0,.53.53,0,0,1-.56-.37,19.17,19.17,0,0,0-1.21-3.22.44.44,0,0,1-.07-.24.6.6,0,0,1,.42-.52A.66.66,0,0,1,292.24,35.46Z'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
            $author$project$BasicParts$logoSubTextFontColor
        ]), _List_Nil),
        A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$d('M307.18,45.3c0,.43-.31.61-.71.61s-.72-.18-.72-.61V32.67c0-.44.28-.62.72-.62s.71.18.71.64v4.17a48.46,48.46,0,0,1,7.93,2.91.71.71,0,0,1,.44.68.94.94,0,0,1-.06.36.7.7,0,0,1-.65.47.81.81,0,0,1-.34-.08,44.76,44.76,0,0,0-7.32-2.89Z'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
            $author$project$BasicParts$logoSubTextFontColor
        ]), _List_Nil),
        A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$d('M321.72,32.72a.6.6,0,0,1,.68-.62.64.64,0,0,1,.72.62V35.3h5.31V32.72a.59.59,0,0,1,.67-.62.63.63,0,0,1,.71.62V35.3h2.49a.57.57,0,0,1,.62.64.58.58,0,0,1-.6.65h-2.51v1.73A8.1,8.1,0,0,1,328.63,43a7.37,7.37,0,0,1-4.81,2.86.82.82,0,0,1-.21,0,.59.59,0,0,1-.64-.51,1,1,0,0,1,0-.17c0-.33.21-.54.58-.61a6.24,6.24,0,0,0,3.93-2.37,7.07,7.07,0,0,0,1-4.14V36.59h-5.31v4c0,.41-.31.62-.72.62s-.68-.21-.68-.62v-4h-2.5a.58.58,0,0,1-.6-.65.56.56,0,0,1,.62-.62h2.48Z'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
            $author$project$BasicParts$logoSubTextFontColor
        ]), _List_Nil),
        A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$d('M335.84,39.82c-.41,0-.63-.26-.63-.7a.64.64,0,0,1,.65-.73h12.33a.65.65,0,0,1,.65.73c0,.44-.23.7-.63.7Z'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
            $author$project$BasicParts$logoSubTextFontColor
        ]), _List_Nil),
        A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$d('M354.47,41.75c0,2.1.36,2.23,3.56,2.23a29.87,29.87,0,0,0,5-.42.68.68,0,0,1,.2,0,.59.59,0,0,1,.61.59v.11a.67.67,0,0,1-.6.7,32.55,32.55,0,0,1-5.51.39c-3.94,0-4.63-.6-4.63-3.67V33.17c0-.44.31-.61.7-.61s.7.17.7.61v4.41A22.33,22.33,0,0,0,362.11,35a.79.79,0,0,1,.41-.11.71.71,0,0,1,.6.36.76.76,0,0,1,.11.4.67.67,0,0,1-.34.59,23.62,23.62,0,0,1-8.42,2.71Zm8-9.93a.53.53,0,0,1,.42.18,10.81,10.81,0,0,1,1.4,1.82.83.83,0,0,1,.11.43.5.5,0,0,1-.53.45.44.44,0,0,1-.43-.28,11.24,11.24,0,0,0-1.28-1.77.57.57,0,0,1-.16-.39A.48.48,0,0,1,362.52,31.82Zm1.93-.84a.61.61,0,0,1,.44.19A9.71,9.71,0,0,1,366.22,33a.8.8,0,0,1,.1.4.49.49,0,0,1-.5.46.47.47,0,0,1-.43-.26,10.21,10.21,0,0,0-1.21-1.73.48.48,0,0,1-.2-.42A.49.49,0,0,1,364.45,31Z'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
            $author$project$BasicParts$logoSubTextFontColor
        ]), _List_Nil),
        A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$d('M369.4,34.59c-.39,0-.6-.28-.6-.72a.59.59,0,0,1,.6-.65l8.28-.08a1.41,1.41,0,0,1,1.65,1.46,3,3,0,0,1-.18.95,15.14,15.14,0,0,1-2.58,4.22,28.82,28.82,0,0,1,4.52,4,.94.94,0,0,1,.23.57.81.81,0,0,1-.22.52.74.74,0,0,1-.56.24.77.77,0,0,1-.59-.26,27.33,27.33,0,0,0-4.29-4.1,18.12,18.12,0,0,1-6.87,4.51,1.36,1.36,0,0,1-.39.08.6.6,0,0,1-.61-.41.82.82,0,0,1,0-.28.73.73,0,0,1,.48-.69A18.31,18.31,0,0,0,374,40.49a13.86,13.86,0,0,0,3.68-5.29,1.53,1.53,0,0,0,.08-.35c0-.25-.18-.36-.59-.36Z'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
            $author$project$BasicParts$logoSubTextFontColor
        ]), _List_Nil)
    ]);
    var $rtfeldman$elm_css$Svg$Styled$text = $rtfeldman$elm_css$VirtualDom$Styled$text;
    var $rtfeldman$elm_css$Svg$Styled$title = $rtfeldman$elm_css$Svg$Styled$node('title');
    var $rtfeldman$elm_css$Svg$Styled$Attributes$height = $rtfeldman$elm_css$VirtualDom$Styled$attribute('height');
    var $rtfeldman$elm_css$Svg$Styled$image = $rtfeldman$elm_css$Svg$Styled$node('image');
    var $rtfeldman$elm_css$Svg$Styled$Attributes$cx = $rtfeldman$elm_css$VirtualDom$Styled$attribute('cx');
    var $rtfeldman$elm_css$Svg$Styled$Attributes$cy = $rtfeldman$elm_css$VirtualDom$Styled$attribute('cy');
    var $rtfeldman$elm_css$Svg$Styled$ellipse = $rtfeldman$elm_css$Svg$Styled$node('ellipse');
    var $rtfeldman$elm_css$Svg$Styled$Attributes$rx = $rtfeldman$elm_css$VirtualDom$Styled$attribute('rx');
    var $rtfeldman$elm_css$Svg$Styled$Attributes$ry = $rtfeldman$elm_css$VirtualDom$Styled$attribute('ry');
    var $author$project$BasicParts$tsukuBirdShadow = A2($rtfeldman$elm_css$Svg$Styled$ellipse, _List_fromArray([
        $rtfeldman$elm_css$Svg$Styled$Attributes$cx('383.22'),
        $rtfeldman$elm_css$Svg$Styled$Attributes$cy('93.55'),
        $rtfeldman$elm_css$Svg$Styled$Attributes$rx('39.04'),
        $rtfeldman$elm_css$Svg$Styled$Attributes$ry('18.08'),
        $rtfeldman$elm_css$Svg$Styled$Attributes$fill('#999')
    ]), _List_Nil);
    var $rtfeldman$elm_css$Svg$Styled$Attributes$width = $rtfeldman$elm_css$VirtualDom$Styled$attribute('width');
    var $elm$virtual_dom$VirtualDom$attributeNS = F3(function(namespace, key, value) {
        return A3(_VirtualDom_attributeNS, namespace, _VirtualDom_noOnOrFormAction(key), _VirtualDom_noJavaScriptOrHtmlUri(value));
    });
    var $rtfeldman$elm_css$VirtualDom$Styled$attributeNS = F3(function(namespace, key, value) {
        return A3($rtfeldman$elm_css$VirtualDom$Styled$Attribute, A3($elm$virtual_dom$VirtualDom$attributeNS, namespace, key, value), _List_Nil, '');
    });
    var $rtfeldman$elm_css$Svg$Styled$Attributes$xlinkHref = function(value) {
        return A3($rtfeldman$elm_css$VirtualDom$Styled$attributeNS, 'http://www.w3.org/1999/xlink', 'xlink:href', value);
    };
    var $author$project$BasicParts$tsukuBird = _List_fromArray([
        $author$project$BasicParts$tsukuBirdShadow,
        A2($rtfeldman$elm_css$Svg$Styled$image, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$xlinkHref('/assets/logo_bird.png'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$width('370'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$height('320'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(307.49) scale(0.36)')
        ]), _List_Nil)
    ]);
    var $author$project$BasicParts$tsukuMartFontColor = $rtfeldman$elm_css$Svg$Styled$Attributes$fill('#fff4d8');
    var $author$project$BasicParts$tsukuMartCharacters = _List_fromArray([
        A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$d('M41.91,75.12c0-5.66,3.52-11.1,10.79-11.1,3.52,0,7.88-.15,12.63-.15,17.44,0,39.47,2.22,39.47,23.18,0,18.9-22.26,28.39-24.78,28.39-2,0-3.6-1.23-3.6-2.76,0-3.21,7.27-5.43,7.27-13,0-7.12-8-13.31-19.82-13.31-2.68,0-8.72.84-10.4.84C45.89,87.21,41.91,81.09,41.91,75.12Z'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
            $author$project$BasicParts$tsukuMartFontColor
        ]), _List_Nil),
        A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$d('M117.81,88.83c0-6.34,7.47-4.15,19.24-27.25A12.81,12.81,0,0,1,149,54.19c7.32,0,14.79,5.43,14.79,12.45,0,3.24-1.51,6.79-5.44,10.34-5.2,4.68-11.47,10.79-13.73,12.45s-1.81,4.3-.68,6c9.58,13.73,12.45,15.77,12.45,19.09,0,2.57-2.11,4.15-4.68,4.15-6.94,0-9.05-9.73-31.39-25.28A5.55,5.55,0,0,1,117.81,88.83Z'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
            $author$project$BasicParts$tsukuMartFontColor
        ]), _List_Nil),
        A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$d('M221.66,100.25a79.24,79.24,0,0,1,6.36,7.94c1.18,1.73,2.6,5.27-.47,5.27a8.49,8.49,0,0,1-3.54-1.18c-8.09-4.49-19.18-7-23.82-7.71s-5.73-3.06-2.9-6a27.75,27.75,0,0,0,6.13-8.73c1.41-3.3,3.85-3.3,6.37-1.1,1.33,1.18,3.61,3.23,6.28,5.82,1.42-3.38,2.21-6.45,2.44-6.92,1.1-2.67-4.48-2.12-6.84-2.12a135,135,0,0,0-17.37,1.1C189.5,87.36,183,90.19,183,83c0-3.06-1.26-9.27-3.07-11.55-2.75-3.46-1.57-8.57,4.25-8.57a10.87,10.87,0,0,1,2.12.15c6.21,1,44.42,1.42,52,.48,5.9-.71,10.06,3.45,6.45,7.62a53,53,0,0,0-5.27,7.39A90.93,90.93,0,0,1,221.66,100.25Z'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
            $author$project$BasicParts$tsukuMartFontColor
        ]), _List_Nil),
        A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$d('M257.82,89.71a26.73,26.73,0,0,0-.71-6.6c-.95-3.69-.87-7.47,4-7.47a12.21,12.21,0,0,1,2.2.24c5.66.86,28.69,1.26,37.26.47,7.78-.87,4.09,8.41,4.09,14,0,1.81.39,3,.39,4.56,0,3.38-3.06,4.8-5.89,4.4-9.52-1.18-24.61-2-35.62-.47-3.3.47-6-1.1-6-4.79C257.58,92.62,257.82,91.13,257.82,89.71Z'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
            $author$project$BasicParts$tsukuMartFontColor
        ]), _List_Nil),
        A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$d('M345.07,65c-.94,1.41-1.8,6.29-2.59,12.34,6.6.55,14.07.71,19.89-.55,3.77-.71,7.15-.08,7.15,3.3A8,8,0,0,1,369,83a25.75,25.75,0,0,0-1.81,8.73c0,3.53-1.88,4.87-5.5,3.85a43.92,43.92,0,0,0-8.41-.55c-3.62,0-7.94.16-12.26.31-.16,3-.24,5.9-.24,8.42s.08,4.87.24,6.52c.15,1.34,1.57,2.75,1.57,4.48,0,2.83-3.93,3.38-8.33,3.38-4,0-7.79-.31-7.79-3.54a29.62,29.62,0,0,0,.24-3.93c-.94-10.53-5.5-44-6.92-46.38A10.23,10.23,0,0,1,318,59.53c0-4.64,7.86-2.83,11.79-2.83,3.15,0,6.45-.16,11.64-.16C348.3,56.54,347.75,60.94,345.07,65Z'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(-40.84 -16.87)'),
            $author$project$BasicParts$tsukuMartFontColor
        ]), _List_Nil)
    ]);
    var $author$project$BasicParts$logo = A2($rtfeldman$elm_css$Svg$Styled$svg, _List_fromArray([
        $rtfeldman$elm_css$Svg$Styled$Attributes$css(_List_fromArray([
            $rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$px(48)),
            $rtfeldman$elm_css$Css$display($rtfeldman$elm_css$Css$block),
            $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(8))
        ])),
        $rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 440.08 114.67')
    ]), A2($elm$core$List$cons, A2($rtfeldman$elm_css$Svg$Styled$title, _List_Nil, _List_fromArray([
        $rtfeldman$elm_css$Svg$Styled$text('つくマートのロゴ クリックしてホームに戻る')
    ])), _Utils_ap($author$project$BasicParts$tsukuMartCharacters, _Utils_ap($author$project$BasicParts$tsukuBird, $author$project$BasicParts$logoSubText))));
    var $rtfeldman$elm_css$Css$margin = $rtfeldman$elm_css$Css$prop1('margin');
    var $author$project$BasicParts$headerWithBackArrow = $author$project$BasicParts$header(_List_fromArray([
        $author$project$BasicParts$backArrow,
        A2($rtfeldman$elm_css$Html$Styled$a, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $rtfeldman$elm_css$Css$flexGrow($rtfeldman$elm_css$Css$int(1)),
                $author$project$BasicParts$hoverCss
            ])),
            $rtfeldman$elm_css$Html$Styled$Attributes$href($author$project$PageLocation$toUrlAsString($author$project$PageLocation$Home))
        ]), _List_fromArray([
            A2($rtfeldman$elm_css$Html$Styled$h1, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $rtfeldman$elm_css$Css$margin($rtfeldman$elm_css$Css$zero)
                ]))
            ]), _List_fromArray([
                $author$project$BasicParts$logo
            ]))
        ]))
    ]));
    var $rtfeldman$elm_css$VirtualDom$Styled$KeyedNode = F3(function(a, b, c) {
        return {
            $: 'KeyedNode',
            a: a,
            b: b,
            c: c
        };
    });
    var $rtfeldman$elm_css$VirtualDom$Styled$KeyedNodeNS = F4(function(a, b, c, d) {
        return {
            $: 'KeyedNodeNS',
            a: a,
            b: b,
            c: c,
            d: d
        };
    });
    var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
    var $elm$virtual_dom$VirtualDom$mapAttribute = _VirtualDom_mapAttribute;
    var $rtfeldman$elm_css$VirtualDom$Styled$mapAttribute = F2(function(transform, _v0) {
        var prop = _v0.a;
        var styles = _v0.b;
        var classname = _v0.c;
        return A3($rtfeldman$elm_css$VirtualDom$Styled$Attribute, A2($elm$virtual_dom$VirtualDom$mapAttribute, transform, prop), styles, classname);
    });
    var $rtfeldman$elm_css$VirtualDom$Styled$map = F2(function(transform, vdomNode) {
        switch(vdomNode.$){
            case 'Node':
                var elemType = vdomNode.a;
                var properties = vdomNode.b;
                var children = vdomNode.c;
                return A3($rtfeldman$elm_css$VirtualDom$Styled$Node, elemType, A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$mapAttribute(transform), properties), A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$map(transform), children));
            case 'NodeNS':
                var ns = vdomNode.a;
                var elemType = vdomNode.b;
                var properties = vdomNode.c;
                var children = vdomNode.d;
                return A4($rtfeldman$elm_css$VirtualDom$Styled$NodeNS, ns, elemType, A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$mapAttribute(transform), properties), A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$map(transform), children));
            case 'KeyedNode':
                var elemType = vdomNode.a;
                var properties = vdomNode.b;
                var children = vdomNode.c;
                return A3($rtfeldman$elm_css$VirtualDom$Styled$KeyedNode, elemType, A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$mapAttribute(transform), properties), A2($elm$core$List$map, function(_v1) {
                    var key = _v1.a;
                    var child = _v1.b;
                    return _Utils_Tuple2(key, A2($rtfeldman$elm_css$VirtualDom$Styled$map, transform, child));
                }, children));
            case 'KeyedNodeNS':
                var ns = vdomNode.a;
                var elemType = vdomNode.b;
                var properties = vdomNode.c;
                var children = vdomNode.d;
                return A4($rtfeldman$elm_css$VirtualDom$Styled$KeyedNodeNS, ns, elemType, A2($elm$core$List$map, $rtfeldman$elm_css$VirtualDom$Styled$mapAttribute(transform), properties), A2($elm$core$List$map, function(_v2) {
                    var key = _v2.a;
                    var child = _v2.b;
                    return _Utils_Tuple2(key, A2($rtfeldman$elm_css$VirtualDom$Styled$map, transform, child));
                }, children));
            default:
                var vdom = vdomNode.a;
                return $rtfeldman$elm_css$VirtualDom$Styled$Unstyled(A2($elm$virtual_dom$VirtualDom$map, transform, vdom));
        }
    });
    var $rtfeldman$elm_css$Html$Styled$map = $rtfeldman$elm_css$VirtualDom$Styled$map;
    var $rtfeldman$elm_css$Css$left = $rtfeldman$elm_css$Css$prop1('left');
    var $author$project$Icon$information = function(style) {
        return A2($rtfeldman$elm_css$Svg$Styled$svg, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 24 24'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$css(_List_fromArray([
                style
            ]))
        ]), _List_fromArray([
            A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
                $rtfeldman$elm_css$Svg$Styled$Attributes$d('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z')
            ]), _List_Nil)
        ]));
    };
    var $rtfeldman$elm_css$Css$fontSize = $rtfeldman$elm_css$Css$prop1('font-size');
    var $rtfeldman$elm_css$Css$RemUnits = {
        $: 'RemUnits'
    };
    var $rtfeldman$elm_css$Css$rem = A2($rtfeldman$elm_css$Css$Internal$lengthConverter, $rtfeldman$elm_css$Css$RemUnits, 'rem');
    var $author$project$Style$userSelectNone = A2($rtfeldman$elm_css$Css$property, 'user-select', 'none');
    var $author$project$BasicParts$menuItemStyle = $rtfeldman$elm_css$Css$batch(_List_fromArray([
        $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(4)),
        $rtfeldman$elm_css$Css$displayFlex,
        $rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$center),
        $rtfeldman$elm_css$Css$fontSize($rtfeldman$elm_css$Css$rem(1.5)),
        $author$project$Style$userSelectNone,
        $rtfeldman$elm_css$Css$textDecoration($rtfeldman$elm_css$Css$none),
        $rtfeldman$elm_css$Css$color(A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0)),
        $rtfeldman$elm_css$Css$hover(_List_fromArray([
            $rtfeldman$elm_css$Css$backgroundColor(A3($rtfeldman$elm_css$Css$rgb, 187, 187, 187))
        ]))
    ]));
    var $author$project$BasicParts$menuItem = F2(function(locationAndIconMaybe, text) {
        if (locationAndIconMaybe.$ === 'Just') {
            var _v1 = locationAndIconMaybe.a;
            var location = _v1.a;
            var icon = _v1.b;
            return A2($rtfeldman$elm_css$Html$Styled$a, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $author$project$BasicParts$menuItemStyle
                ])),
                $rtfeldman$elm_css$Html$Styled$Attributes$href($author$project$PageLocation$toUrlAsString(location))
            ]), _List_fromArray([
                icon($rtfeldman$elm_css$Css$batch(_List_fromArray([
                    $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$px(32)),
                    $rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$px(32)),
                    $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(8)),
                    $rtfeldman$elm_css$Css$fill(A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0))
                ]))),
                $rtfeldman$elm_css$Html$Styled$text(text)
            ]));
        } else return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $author$project$BasicParts$menuItemStyle
            ]))
        ]), _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$text(text)
        ]));
    });
    var $rtfeldman$elm_css$Css$padding4 = $rtfeldman$elm_css$Css$prop4('padding');
    var $author$project$BasicParts$subMenuItemStyle = $rtfeldman$elm_css$Css$batch(_List_fromArray([
        A4($rtfeldman$elm_css$Css$padding4, $rtfeldman$elm_css$Css$px(4), $rtfeldman$elm_css$Css$zero, $rtfeldman$elm_css$Css$px(4), $rtfeldman$elm_css$Css$px(52)),
        $rtfeldman$elm_css$Css$fontSize($rtfeldman$elm_css$Css$rem(1.3)),
        $rtfeldman$elm_css$Css$displayFlex,
        $rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$center),
        $author$project$Style$userSelectNone,
        $rtfeldman$elm_css$Css$textDecoration($rtfeldman$elm_css$Css$none),
        $rtfeldman$elm_css$Css$color(A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0)),
        $rtfeldman$elm_css$Css$hover(_List_fromArray([
            $rtfeldman$elm_css$Css$backgroundColor(A3($rtfeldman$elm_css$Css$rgb, 187, 187, 187))
        ]))
    ]));
    var $author$project$BasicParts$subMenuItem = F2(function(linkMaybe, text) {
        return (function() {
            if (linkMaybe.$ === 'Just') {
                var link = linkMaybe.a;
                return $rtfeldman$elm_css$Html$Styled$a(_List_fromArray([
                    $rtfeldman$elm_css$Html$Styled$Attributes$href($author$project$PageLocation$toUrlAsString(link)),
                    $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                        $author$project$BasicParts$subMenuItemStyle
                    ]))
                ]));
            } else return $rtfeldman$elm_css$Html$Styled$div(_List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $author$project$BasicParts$subMenuItemStyle
                ]))
            ]));
        })()(_List_fromArray([
            $rtfeldman$elm_css$Html$Styled$text(text)
        ]));
    });
    var $author$project$BasicParts$menuLogInStateLoadingProfile = _List_fromArray([
        A2($author$project$BasicParts$menuItem, $elm$core$Maybe$Just(_Utils_Tuple2($author$project$PageLocation$Home, $author$project$Icon$home)), 'ホーム'),
        A2($author$project$BasicParts$menuItem, $elm$core$Maybe$Just(_Utils_Tuple2($author$project$PageLocation$Search, $author$project$Icon$search)), '検索'),
        A2($author$project$BasicParts$menuItem, $elm$core$Maybe$Just(_Utils_Tuple2($author$project$PageLocation$Notification, $author$project$Icon$notifications)), '通知'),
        A2($author$project$BasicParts$menuItem, $elm$core$Maybe$Nothing, 'プロフィール情報を読み込み中……'),
        A2($author$project$BasicParts$subMenuItem, $elm$core$Maybe$Just($author$project$PageLocation$LikedProducts), 'いいねした商品'),
        A2($author$project$BasicParts$subMenuItem, $elm$core$Maybe$Just($author$project$PageLocation$History), '閲覧した商品'),
        A2($author$project$BasicParts$subMenuItem, $elm$core$Maybe$Just($author$project$PageLocation$BoughtProducts), '購入した商品'),
        A2($author$project$BasicParts$subMenuItem, $elm$core$Maybe$Nothing, 'プロフィール情報を読み込み中……'),
        A2($author$project$BasicParts$subMenuItem, $elm$core$Maybe$Just($author$project$PageLocation$TradingProducts), '進行中の取引'),
        A2($author$project$BasicParts$subMenuItem, $elm$core$Maybe$Just($author$project$PageLocation$TradedProducts), '過去にした取引'),
        A2($author$project$BasicParts$subMenuItem, $elm$core$Maybe$Just($author$project$PageLocation$CommentedProducts), 'コメントをした商品'),
        A2($author$project$BasicParts$menuItem, $elm$core$Maybe$Just(_Utils_Tuple2($author$project$PageLocation$About, $author$project$Icon$information)), 'つくマートについて')
    ]);
    var $rtfeldman$elm_css$Css$prop2 = F3(function(key, argA, argB) {
        return A2($rtfeldman$elm_css$Css$property, key, A2($elm$core$String$join, ' ', _List_fromArray([
            argA.value,
            argB.value
        ])));
    });
    var $rtfeldman$elm_css$Css$padding2 = $rtfeldman$elm_css$Css$prop2('padding');
    var $author$project$BasicParts$menuLogInStateNone = _List_fromArray([
        A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $rtfeldman$elm_css$Css$displayFlex,
                $rtfeldman$elm_css$Css$flexDirection($rtfeldman$elm_css$Css$column),
                $rtfeldman$elm_css$Css$backgroundColor($author$project$Style$primaryColor),
                $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(16))
            ]))
        ]), _List_fromArray([
            A2($rtfeldman$elm_css$Html$Styled$a, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $rtfeldman$elm_css$Css$backgroundColor(A3($rtfeldman$elm_css$Css$rgb, 170, 170, 170)),
                    $rtfeldman$elm_css$Css$color(A3($rtfeldman$elm_css$Css$rgb, 17, 17, 17)),
                    A2($rtfeldman$elm_css$Css$padding2, $rtfeldman$elm_css$Css$px(16), $rtfeldman$elm_css$Css$zero),
                    $rtfeldman$elm_css$Css$borderRadius($rtfeldman$elm_css$Css$px(8)),
                    $rtfeldman$elm_css$Css$textDecoration($rtfeldman$elm_css$Css$none),
                    $author$project$Style$userSelectNone,
                    $rtfeldman$elm_css$Css$displayFlex,
                    $rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$center),
                    $rtfeldman$elm_css$Css$hover(_List_fromArray([
                        $rtfeldman$elm_css$Css$backgroundColor(A3($rtfeldman$elm_css$Css$rgb, 221, 221, 221))
                    ]))
                ])),
                $rtfeldman$elm_css$Html$Styled$Attributes$href($author$project$PageLocation$toUrlAsString($author$project$PageLocation$LogIn))
            ]), _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text('ログイン / 新規登録')
            ]))
        ])),
        A2($author$project$BasicParts$menuItem, $elm$core$Maybe$Just(_Utils_Tuple2($author$project$PageLocation$Home, $author$project$Icon$home)), 'ホーム'),
        A2($author$project$BasicParts$menuItem, $elm$core$Maybe$Just(_Utils_Tuple2($author$project$PageLocation$Search, $author$project$Icon$search)), '検索'),
        A2($author$project$BasicParts$menuItem, $elm$core$Maybe$Just(_Utils_Tuple2($author$project$PageLocation$About, $author$project$Icon$information)), 'つくマートについて')
    ]);
    var $author$project$Data$User$withNameGetDisplayName = function(_v0) {
        var displayName = _v0.a.displayName;
        return displayName;
    };
    var $author$project$BasicParts$menuLogInStateOk = function(userWithName) {
        return _List_fromArray([
            A2($author$project$BasicParts$menuItem, $elm$core$Maybe$Just(_Utils_Tuple2($author$project$PageLocation$Home, $author$project$Icon$home)), 'ホーム'),
            A2($author$project$BasicParts$menuItem, $elm$core$Maybe$Just(_Utils_Tuple2($author$project$PageLocation$Search, $author$project$Icon$search)), '検索'),
            A2($author$project$BasicParts$menuItem, $elm$core$Maybe$Just(_Utils_Tuple2($author$project$PageLocation$Notification, $author$project$Icon$notifications)), '通知'),
            A2($author$project$BasicParts$menuItem, $elm$core$Maybe$Just(_Utils_Tuple2($author$project$PageLocation$User($author$project$Data$User$withNameGetId(userWithName)), $elm$core$Basics$always(A2($author$project$Style$userImage, 40, $author$project$Data$User$withNameGetImageId(userWithName))))), $author$project$Data$User$withNameGetDisplayName(userWithName)),
            A2($author$project$BasicParts$subMenuItem, $elm$core$Maybe$Just($author$project$PageLocation$LikedProducts), 'いいねした商品'),
            A2($author$project$BasicParts$subMenuItem, $elm$core$Maybe$Just($author$project$PageLocation$History), '閲覧した商品'),
            A2($author$project$BasicParts$subMenuItem, $elm$core$Maybe$Just($author$project$PageLocation$BoughtProducts), '購入した商品'),
            A2($author$project$BasicParts$subMenuItem, $elm$core$Maybe$Just($author$project$PageLocation$SoldProducts($author$project$Data$User$withNameGetId(userWithName))), '出品した商品'),
            A2($author$project$BasicParts$subMenuItem, $elm$core$Maybe$Just($author$project$PageLocation$TradingProducts), '進行中の取引'),
            A2($author$project$BasicParts$subMenuItem, $elm$core$Maybe$Just($author$project$PageLocation$TradedProducts), '過去にした取引'),
            A2($author$project$BasicParts$subMenuItem, $elm$core$Maybe$Just($author$project$PageLocation$CommentedProducts), 'コメントをした商品'),
            A2($author$project$BasicParts$menuItem, $elm$core$Maybe$Just(_Utils_Tuple2($author$project$PageLocation$About, $author$project$Icon$information)), 'つくマートについて')
        ]);
    };
    var $rtfeldman$elm_css$Css$top = $rtfeldman$elm_css$Css$prop1('top');
    var $author$project$BasicParts$menu = function(logInState) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$px(320)),
                $rtfeldman$elm_css$Css$backgroundColor(A3($rtfeldman$elm_css$Css$rgb, 221, 221, 221)),
                $rtfeldman$elm_css$Css$top($rtfeldman$elm_css$Css$px(64)),
                $rtfeldman$elm_css$Css$left($rtfeldman$elm_css$Css$zero),
                A2($author$project$Style$gridColumn, 1, 2),
                A2($author$project$Style$gridRow, 2, 5)
            ]))
        ]), function() {
            switch(logInState.$){
                case 'None':
                    return $author$project$BasicParts$menuLogInStateNone;
                case 'LoadingProfile':
                    return $author$project$BasicParts$menuLogInStateLoadingProfile;
                default:
                    var userWithName = logInState.a.userWithName;
                    return $author$project$BasicParts$menuLogInStateOk(userWithName);
            }
        }());
    };
    var $rtfeldman$elm_css$Css$animationDelay = function(arg) {
        return A2($rtfeldman$elm_css$Css$prop1, 'animation-delay', arg);
    };
    var $rtfeldman$elm_css$Css$animationDuration = function(arg) {
        return A2($rtfeldman$elm_css$Css$prop1, 'animation-duration', arg);
    };
    var $rtfeldman$elm_css$Css$animationIterationCount = function(arg) {
        return A2($rtfeldman$elm_css$Css$prop1, 'animation-iteration-count', arg);
    };
    var $rtfeldman$elm_css$Css$Preprocess$WithKeyframes = function(a) {
        return {
            $: 'WithKeyframes',
            a: a
        };
    };
    var $rtfeldman$elm_css$Css$animationName = function(arg) {
        return arg.value === 'none' || arg.value === 'inherit' || arg.value === 'unset' || arg.value === 'initial' ? A2($rtfeldman$elm_css$Css$prop1, 'animation-name', arg) : $rtfeldman$elm_css$Css$Preprocess$WithKeyframes(arg.value);
    };
    var $rtfeldman$elm_css$Css$prop3 = F4(function(key, argA, argB, argC) {
        return A2($rtfeldman$elm_css$Css$property, key, A2($elm$core$String$join, ' ', _List_fromArray([
            argA.value,
            argB.value,
            argC.value
        ])));
    });
    var $rtfeldman$elm_css$Css$border3 = $rtfeldman$elm_css$Css$prop3('border');
    var $rtfeldman$elm_css$Css$fixed = {
        backgroundAttachment: $rtfeldman$elm_css$Css$Structure$Compatible,
        position: $rtfeldman$elm_css$Css$Structure$Compatible,
        tableLayout: $rtfeldman$elm_css$Css$Structure$Compatible,
        value: 'fixed'
    };
    var $rtfeldman$elm_css$Css$Internal$printKeyframeSelector = function(_v0) {
        var percentage = _v0.a;
        var properties = _v0.b;
        var propertiesStr = A2($elm$core$String$join, '', A2($elm$core$List$map, function(_v1) {
            var prop = _v1.a;
            return prop + ';';
        }, properties));
        var percentageStr = $elm$core$String$fromInt(percentage) + '%';
        return percentageStr + (' {' + (propertiesStr + '}'));
    };
    var $rtfeldman$elm_css$Css$Internal$compileKeyframes = function(tuples) {
        return A2($elm$core$String$join, '\n\n', A2($elm$core$List$map, $rtfeldman$elm_css$Css$Internal$printKeyframeSelector, tuples));
    };
    var $rtfeldman$elm_css$Css$Animations$keyframes = function(tuples) {
        return $elm$core$List$isEmpty(tuples) ? {
            keyframes: $rtfeldman$elm_css$Css$Structure$Compatible,
            none: $rtfeldman$elm_css$Css$Structure$Compatible,
            value: 'none'
        } : {
            keyframes: $rtfeldman$elm_css$Css$Structure$Compatible,
            none: $rtfeldman$elm_css$Css$Structure$Compatible,
            value: $rtfeldman$elm_css$Css$Internal$compileKeyframes(tuples)
        };
    };
    var $rtfeldman$elm_css$Css$maxWidth = $rtfeldman$elm_css$Css$prop1('max-width');
    var $rtfeldman$elm_css$Css$UnitlessFloat = {
        $: 'UnitlessFloat'
    };
    var $rtfeldman$elm_css$Css$num = function(val) {
        return {
            lengthOrNumber: $rtfeldman$elm_css$Css$Structure$Compatible,
            lengthOrNumberOrAutoOrNoneOrContent: $rtfeldman$elm_css$Css$Structure$Compatible,
            number: $rtfeldman$elm_css$Css$Structure$Compatible,
            numberOrInfinite: $rtfeldman$elm_css$Css$Structure$Compatible,
            numericValue: val,
            unitLabel: '',
            units: $rtfeldman$elm_css$Css$UnitlessFloat,
            value: $elm$core$String$fromFloat(val)
        };
    };
    var $rtfeldman$elm_css$Css$Internal$Property = function(a) {
        return {
            $: 'Property',
            a: a
        };
    };
    var $rtfeldman$elm_css$Css$Animations$opacity = function(_v0) {
        var value = _v0.value;
        return $rtfeldman$elm_css$Css$Internal$Property('opacity:' + value);
    };
    var $rtfeldman$elm_css$Css$overflowWrap = $rtfeldman$elm_css$Css$prop1('overflow-wrap');
    var $rtfeldman$elm_css$Css$pointerEvents = $rtfeldman$elm_css$Css$prop1('pointer-events');
    var $rtfeldman$elm_css$Css$position = $rtfeldman$elm_css$Css$prop1('position');
    var $rtfeldman$elm_css$Css$sec = function(amount) {
        return {
            duration: $rtfeldman$elm_css$Css$Structure$Compatible,
            value: $elm$core$String$fromFloat(amount) + 's'
        };
    };
    var $rtfeldman$elm_css$Css$solid = {
        borderStyle: $rtfeldman$elm_css$Css$Structure$Compatible,
        textDecorationStyle: $rtfeldman$elm_css$Css$Structure$Compatible,
        value: 'solid'
    };
    var $rtfeldman$elm_css$Css$textAlign = function(fn) {
        return A3($rtfeldman$elm_css$Css$Internal$getOverloadedProperty, 'textAlign', 'text-align', fn($rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty));
    };
    var $author$project$Main$messageView = function(message) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$fixed),
                $rtfeldman$elm_css$Css$top($rtfeldman$elm_css$Css$px(128)),
                $rtfeldman$elm_css$Css$left($rtfeldman$elm_css$Css$pct(10)),
                $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$pct(80)),
                $rtfeldman$elm_css$Css$textAlign($rtfeldman$elm_css$Css$center),
                $rtfeldman$elm_css$Css$zIndex($rtfeldman$elm_css$Css$int(2)),
                $rtfeldman$elm_css$Css$backgroundColor(A3($rtfeldman$elm_css$Css$rgb, 221, 221, 221)),
                $rtfeldman$elm_css$Css$color(A3($rtfeldman$elm_css$Css$rgb, 17, 17, 17)),
                A3($rtfeldman$elm_css$Css$border3, $rtfeldman$elm_css$Css$px(2), $rtfeldman$elm_css$Css$solid, A3($rtfeldman$elm_css$Css$rgb, 17, 17, 17)),
                $rtfeldman$elm_css$Css$borderRadius($rtfeldman$elm_css$Css$px(8)),
                $rtfeldman$elm_css$Css$fontSize($rtfeldman$elm_css$Css$rem(1.3)),
                $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(32)),
                $rtfeldman$elm_css$Css$pointerEvents($rtfeldman$elm_css$Css$none),
                $rtfeldman$elm_css$Css$animationName($rtfeldman$elm_css$Css$Animations$keyframes(_List_fromArray([
                    _Utils_Tuple2(0, _List_fromArray([
                        $rtfeldman$elm_css$Css$Animations$opacity($rtfeldman$elm_css$Css$num(1))
                    ])),
                    _Utils_Tuple2(100, _List_fromArray([
                        $rtfeldman$elm_css$Css$Animations$opacity($rtfeldman$elm_css$Css$num(0))
                    ]))
                ]))),
                $rtfeldman$elm_css$Css$animationDuration($rtfeldman$elm_css$Css$sec(2)),
                $rtfeldman$elm_css$Css$animationDelay($rtfeldman$elm_css$Css$sec(4)),
                $rtfeldman$elm_css$Css$animationIterationCount($rtfeldman$elm_css$Css$int(1)),
                A2($rtfeldman$elm_css$Css$property, 'animation-fill-mode', 'forwards'),
                $rtfeldman$elm_css$Css$maxWidth($rtfeldman$elm_css$Css$pct(100)),
                $rtfeldman$elm_css$Css$boxSizing($rtfeldman$elm_css$Css$borderBox),
                $rtfeldman$elm_css$Css$overflowWrap($rtfeldman$elm_css$Css$breakWord)
            ]))
        ]), _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$text(message)
        ]));
    };
    var $rtfeldman$elm_css$VirtualDom$Styled$keyedNode = $rtfeldman$elm_css$VirtualDom$Styled$KeyedNode;
    var $rtfeldman$elm_css$Html$Styled$Keyed$node = $rtfeldman$elm_css$VirtualDom$Styled$keyedNode;
    var $rtfeldman$elm_css$Css$bold = {
        fontWeight: $rtfeldman$elm_css$Css$Structure$Compatible,
        value: 'bold'
    };
    var $rtfeldman$elm_css$Css$Transitions$Color = {
        $: 'Color'
    };
    var $rtfeldman$elm_css$Css$Transitions$Transition = function(a) {
        return {
            $: 'Transition',
            a: a
        };
    };
    var $rtfeldman$elm_css$Css$Transitions$fullTransition = F4(function(animation, duration, delay, timing) {
        return $rtfeldman$elm_css$Css$Transitions$Transition({
            animation: animation,
            delay: $elm$core$Maybe$Just(delay),
            duration: duration,
            timing: $elm$core$Maybe$Just(timing)
        });
    });
    var $rtfeldman$elm_css$Css$Transitions$color3 = $rtfeldman$elm_css$Css$Transitions$fullTransition($rtfeldman$elm_css$Css$Transitions$Color);
    var $rtfeldman$elm_css$Css$Transitions$Ease = {
        $: 'Ease'
    };
    var $rtfeldman$elm_css$Css$Transitions$ease = $rtfeldman$elm_css$Css$Transitions$Ease;
    var $rtfeldman$elm_css$Css$fontWeight = function(_v0) {
        var value = _v0.value;
        return A2($rtfeldman$elm_css$Css$property, 'font-weight', value);
    };
    var $rtfeldman$elm_css$Css$Transitions$propToString = function(prop) {
        switch(prop.$){
            case 'Background':
                return 'background';
            case 'BackgroundColor':
                return 'background-color';
            case 'BackgroundPosition':
                return 'background-position';
            case 'BackgroundSize':
                return 'background-size';
            case 'Border':
                return 'border';
            case 'BorderBottom':
                return 'border-bottom';
            case 'BorderBottomColor':
                return 'border-bottom-color';
            case 'BorderBottomLeftRadius':
                return 'border-bottom-left-radius';
            case 'BorderBottomRightRadius':
                return 'border-bottom-right-radius';
            case 'BorderBottomWidth':
                return 'border-bottom-width';
            case 'BorderColor':
                return 'border-color';
            case 'BorderLeft':
                return 'border-left';
            case 'BorderLeftColor':
                return 'border-left-color';
            case 'BorderLeftWidth':
                return 'border-left-width';
            case 'BorderRadius':
                return 'border-radius';
            case 'BorderRight':
                return 'border-right';
            case 'BorderRightColor':
                return 'border-right-color';
            case 'BorderRightWidth':
                return 'border-right-width';
            case 'BorderTop':
                return 'border-top';
            case 'BorderTopColor':
                return 'border-top-color';
            case 'BorderTopLeftRadius':
                return 'border-top-left-radius';
            case 'BorderTopRightRadius':
                return 'border-top-right-radius';
            case 'BorderTopWidth':
                return 'border-top-width';
            case 'BorderWidth':
                return 'border-width';
            case 'Bottom':
                return 'bottom';
            case 'BoxShadow':
                return 'box-shadow';
            case 'CaretColor':
                return 'caret-color';
            case 'Clip':
                return 'clip';
            case 'ClipPath':
                return 'clip-path';
            case 'Color':
                return 'color';
            case 'ColumnCount':
                return 'column-count';
            case 'ColumnGap':
                return 'column-gap';
            case 'ColumnRule':
                return 'column-rule';
            case 'ColumnRuleColor':
                return 'column-rule-color';
            case 'ColumnRuleWidth':
                return 'column-rule-width';
            case 'ColumnWidth':
                return 'column-width';
            case 'Columns':
                return 'columns';
            case 'Filter':
                return 'filter';
            case 'Flex':
                return 'flex';
            case 'FlexBasis':
                return 'flex-basis';
            case 'FlexGrow':
                return 'flex-grow';
            case 'FlexShrink':
                return 'flex-shrink';
            case 'Font':
                return 'font';
            case 'FontSize':
                return 'font-size';
            case 'FontSizeAdjust':
                return 'font-size-adjust';
            case 'FontStretch':
                return 'font-stretch';
            case 'FontVariationSettings':
                return 'font-variation-settings';
            case 'FontWeight':
                return 'font-weight';
            case 'GridColumnGap':
                return 'grid-column-gap';
            case 'GridGap':
                return 'grid-gap';
            case 'GridRowGap':
                return 'grid-row-gap';
            case 'Height':
                return 'height';
            case 'Left':
                return 'left';
            case 'LetterSpacing':
                return 'letter-spacing';
            case 'LineHeight':
                return 'line-height';
            case 'Margin':
                return 'margin';
            case 'MarginBottom':
                return 'margin-bottom';
            case 'MarginLeft':
                return 'margin-left';
            case 'MarginRight':
                return 'margin-right';
            case 'MarginTop':
                return 'margin-top';
            case 'Mask':
                return 'mask';
            case 'MaskPosition':
                return 'mask-position';
            case 'MaskSize':
                return 'mask-size';
            case 'MaxHeight':
                return 'max-height';
            case 'MaxWidth':
                return 'max-width';
            case 'MinHeight':
                return 'min-height';
            case 'MinWidth':
                return 'min-width';
            case 'ObjectPosition':
                return 'object-position';
            case 'Offset':
                return 'offset';
            case 'OffsetAnchor':
                return 'offset-anchor';
            case 'OffsetDistance':
                return 'offset-distance';
            case 'OffsetPath':
                return 'offset-path';
            case 'OffsetRotate':
                return 'offset-rotate';
            case 'Opacity':
                return 'opacity';
            case 'Order':
                return 'order';
            case 'Outline':
                return 'outline';
            case 'OutlineColor':
                return 'outline-color';
            case 'OutlineOffset':
                return 'outline-offset';
            case 'OutlineWidth':
                return 'outline-width';
            case 'Padding':
                return 'padding';
            case 'PaddingBottom':
                return 'padding-bottom';
            case 'PaddingLeft':
                return 'padding-left';
            case 'PaddingRight':
                return 'padding-right';
            case 'PaddingTop':
                return 'padding-top';
            case 'Right':
                return 'right';
            case 'TabSize':
                return 'tab-size';
            case 'TextIndent':
                return 'text-indent';
            case 'TextShadow':
                return 'text-shadow';
            case 'Top':
                return 'top';
            case 'Transform':
                return 'transform';
            case 'TransformOrigin':
                return 'transform-origin';
            case 'VerticalAlign':
                return 'vertical-align';
            case 'Visibility':
                return 'visibility';
            case 'Width':
                return 'width';
            case 'WordSpacing':
                return 'word-spacing';
            default:
                return 'z-index';
        }
    };
    var $rtfeldman$elm_css$Css$Transitions$timeToString = function(time) {
        return $elm$core$String$fromFloat(time) + 'ms';
    };
    var $rtfeldman$elm_css$Css$Transitions$timingFunctionToString = function(tf) {
        switch(tf.$){
            case 'Ease':
                return 'ease';
            case 'Linear':
                return 'linear';
            case 'EaseIn':
                return 'ease-in';
            case 'EaseOut':
                return 'ease-out';
            case 'EaseInOut':
                return 'ease-in-out';
            case 'StepStart':
                return 'step-start';
            case 'StepEnd':
                return 'step-end';
            default:
                var _float = tf.a;
                var float2 = tf.b;
                var float3 = tf.c;
                var float4 = tf.d;
                return 'cubic-bezier(' + ($elm$core$String$fromFloat(_float) + (' , ' + ($elm$core$String$fromFloat(float2) + (' , ' + ($elm$core$String$fromFloat(float3) + (' , ' + ($elm$core$String$fromFloat(float4) + ')')))))));
        }
    };
    var $rtfeldman$elm_css$Css$Transitions$transition = function(options) {
        var v = A3($elm$core$String$slice, 0, -1, A3($elm$core$List$foldl, F2(function(_v0, s) {
            var animation = _v0.a.animation;
            var duration = _v0.a.duration;
            var delay = _v0.a.delay;
            var timing = _v0.a.timing;
            return s + (A2($elm$core$String$join, ' ', _List_fromArray([
                $rtfeldman$elm_css$Css$Transitions$propToString(animation),
                $rtfeldman$elm_css$Css$Transitions$timeToString(duration),
                A2($elm$core$Maybe$withDefault, '', A2($elm$core$Maybe$map, $rtfeldman$elm_css$Css$Transitions$timeToString, delay)),
                A2($elm$core$Maybe$withDefault, '', A2($elm$core$Maybe$map, $rtfeldman$elm_css$Css$Transitions$timingFunctionToString, timing))
            ])) + ',');
        }), '', options));
        return A2($rtfeldman$elm_css$Css$property, 'transition', v);
    };
    var $author$project$Style$webkitTapHighlightColorTransparent = A2($rtfeldman$elm_css$Css$property, '-webkit-tap-highlight-color', 'transparent');
    var $author$project$BasicParts$itemView = F4(function(index, selectIndex, label, clickEventMaybe) {
        var isSelected = _Utils_eq(index, selectIndex);
        return A2($rtfeldman$elm_css$Html$Styled$div, _Utils_ap(_List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_Utils_ap(_List_fromArray([
                $rtfeldman$elm_css$Css$displayFlex,
                $rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$center),
                $rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$center),
                $rtfeldman$elm_css$Css$color(isSelected ? $author$project$Style$primaryColor : A3($rtfeldman$elm_css$Css$rgb, 85, 85, 85)),
                $author$project$Style$userSelectNone,
                $rtfeldman$elm_css$Css$Transitions$transition(_List_fromArray([
                    A3($rtfeldman$elm_css$Css$Transitions$color3, 300, 0, $rtfeldman$elm_css$Css$Transitions$ease)
                ])),
                A2($author$project$Style$gridRow, 1, 2),
                A2($author$project$Style$gridColumn, index + 1, index + 2)
            ]), _Utils_ap(isSelected ? _List_fromArray([
                $rtfeldman$elm_css$Css$fontWeight($rtfeldman$elm_css$Css$bold)
            ]) : _List_fromArray([
                $rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$pointer),
                $rtfeldman$elm_css$Css$hover(_List_fromArray([
                    $rtfeldman$elm_css$Css$backgroundColor(A3($rtfeldman$elm_css$Css$rgb, 221, 221, 221)),
                    $rtfeldman$elm_css$Css$color($author$project$Style$primaryColor)
                ]))
            ]), function() {
                if (clickEventMaybe.$ === 'Just') return _List_fromArray([
                    $author$project$Style$webkitTapHighlightColorTransparent
                ]);
                else return _List_Nil;
            }())))
        ]), function() {
            if (clickEventMaybe.$ === 'Just') {
                var clickEvent = clickEventMaybe.a;
                return _List_fromArray([
                    $rtfeldman$elm_css$Html$Styled$Events$onClick(clickEvent)
                ]);
            } else return _List_Nil;
        }()), _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$text(label)
        ]));
    });
    var $rtfeldman$elm_css$Css$absolute = {
        position: $rtfeldman$elm_css$Css$Structure$Compatible,
        value: 'absolute'
    };
    var $rtfeldman$elm_css$Css$alignSelf = function(fn) {
        return A3($rtfeldman$elm_css$Css$Internal$getOverloadedProperty, 'alignSelf', 'align-self', fn($rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty));
    };
    var $rtfeldman$elm_css$Css$end = $rtfeldman$elm_css$Css$prop1('end');
    var $rtfeldman$elm_css$Css$Transitions$Left = {
        $: 'Left'
    };
    var $rtfeldman$elm_css$Css$Transitions$left3 = $rtfeldman$elm_css$Css$Transitions$fullTransition($rtfeldman$elm_css$Css$Transitions$Left);
    var $author$project$Style$pointerEventsNone = A2($rtfeldman$elm_css$Css$property, 'pointer-events', 'none');
    var $rtfeldman$elm_css$Css$relative = {
        position: $rtfeldman$elm_css$Css$Structure$Compatible,
        value: 'relative'
    };
    var $author$project$BasicParts$selectLineView = F2(function(index, count) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$relative),
                A2($author$project$Style$gridColumn, 1, 4),
                A2($author$project$Style$gridRow, 1, 2),
                $rtfeldman$elm_css$Css$alignSelf($rtfeldman$elm_css$Css$end),
                $rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$px(4)),
                $author$project$Style$pointerEventsNone
            ]))
        ]), _List_fromArray([
            A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$absolute),
                    $rtfeldman$elm_css$Css$backgroundColor($author$project$Style$primaryColor),
                    $rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$pct(100)),
                    $rtfeldman$elm_css$Css$Transitions$transition(_List_fromArray([
                        A3($rtfeldman$elm_css$Css$Transitions$left3, 300, 0, $rtfeldman$elm_css$Css$Transitions$ease)
                    ])),
                    A2($rtfeldman$elm_css$Css$property, 'left', 'calc( 100% /' + ($elm$core$String$fromInt(count) + (' * ' + ($elm$core$String$fromInt(index) + ')')))),
                    A2($rtfeldman$elm_css$Css$property, 'width', 'calc( 100% / ' + ($elm$core$String$fromInt(count) + ')'))
                ]))
            ]), _List_Nil)
        ]));
    });
    var $rtfeldman$elm_css$Css$textShadow4 = $rtfeldman$elm_css$Css$prop4('text-shadow');
    var $author$project$BasicParts$toCount = function(tab) {
        switch(tab.$){
            case 'Multi':
                var list = tab.a;
                return $elm$core$List$length(list);
            case 'Single':
                return 1;
            default:
                return 0;
        }
    };
    var $author$project$BasicParts$tabStyle = function(tab) {
        return $rtfeldman$elm_css$Css$batch(_Utils_ap(_List_fromArray([
            $rtfeldman$elm_css$Css$backgroundColor(A3($rtfeldman$elm_css$Css$rgb, 240, 240, 240)),
            $author$project$Style$displayGridAndGap(0),
            $author$project$Style$gridTemplateRows('48px'),
            A4($rtfeldman$elm_css$Css$boxShadow4, $rtfeldman$elm_css$Css$zero, $rtfeldman$elm_css$Css$px(2), $rtfeldman$elm_css$Css$px(4), A4($rtfeldman$elm_css$Css$rgba, 0, 0, 0, 0.4)),
            A4($rtfeldman$elm_css$Css$textShadow4, $rtfeldman$elm_css$Css$zero, $rtfeldman$elm_css$Css$px(1), $rtfeldman$elm_css$Css$px(2), A4($rtfeldman$elm_css$Css$rgba, 0, 0, 0, 0.4)),
            A2($author$project$Style$gridColumn, 2, 3),
            A2($author$project$Style$gridRow, 2, 3)
        ]), function() {
            if (tab.$ === 'None') return _List_fromArray([
                $rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$zero)
            ]);
            else return _List_fromArray([
                $author$project$Style$gridTemplateColumns(A2($elm$core$String$join, ' ', A2($elm$core$List$repeat, $author$project$BasicParts$toCount(tab), '1fr'))),
                $rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$px(48))
            ]);
        }()));
    };
    var $author$project$BasicParts$tabView = function(tabData) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $author$project$BasicParts$tabStyle(tabData)
            ]))
        ]), function() {
            switch(tabData.$){
                case 'Multi':
                    var tabList = tabData.a;
                    var selectIndex = tabData.b;
                    return _Utils_ap(A2($elm$core$List$indexedMap, F2(function(index, _v1) {
                        var label = _v1.a;
                        var msg = _v1.b;
                        return A4($author$project$BasicParts$itemView, index, selectIndex, label, $elm$core$Maybe$Just(msg));
                    }), tabList), _List_fromArray([
                        A2($author$project$BasicParts$selectLineView, selectIndex, $elm$core$List$length(tabList))
                    ]));
                case 'Single':
                    var label = tabData.a;
                    return _List_fromArray([
                        A4($author$project$BasicParts$itemView, 0, 0, label, $elm$core$Maybe$Nothing),
                        A2($author$project$BasicParts$selectLineView, 0, 1)
                    ]);
                default:
                    return _List_Nil;
            }
        }());
    };
    var $author$project$Main$PageMsgHome = function(a) {
        return {
            $: 'PageMsgHome',
            a: a
        };
    };
    var $author$project$Main$PageMsgLogIn = function(a) {
        return {
            $: 'PageMsgLogIn',
            a: a
        };
    };
    var $author$project$Main$PageMsgNotification = function(a) {
        return {
            $: 'PageMsgNotification',
            a: a
        };
    };
    var $author$project$Main$PageMsgSearch = function(a) {
        return {
            $: 'PageMsgSearch',
            a: a
        };
    };
    var $author$project$Main$PageMsgSearchResult = function(a) {
        return {
            $: 'PageMsgSearchResult',
            a: a
        };
    };
    var $author$project$BasicParts$Multi = F2(function(a, b) {
        return {
            $: 'Multi',
            a: a,
            b: b
        };
    });
    var $author$project$BasicParts$None = {
        $: 'None'
    };
    var $author$project$BasicParts$Single = function(a) {
        return {
            $: 'Single',
            a: a
        };
    };
    var $author$project$BasicParts$tabMap = F2(function(f, tab) {
        switch(tab.$){
            case 'Multi':
                var list = tab.a;
                var selectIndex = tab.b;
                return A2($author$project$BasicParts$Multi, A2($elm$core$List$map, $elm$core$Tuple$mapSecond(f), list), selectIndex);
            case 'Single':
                var string = tab.a;
                return $author$project$BasicParts$Single(string);
            default:
                return $author$project$BasicParts$None;
        }
    });
    var $author$project$Main$mapPageMsg = F2(function(f, record) {
        return {
            bottomNavigation: record.bottomNavigation,
            tab: A2($author$project$BasicParts$tabMap, f, record.tab),
            title: (function() {
                var _v0 = record.title;
                if (_v0.$ === 'Just') {
                    var titleText = _v0.a;
                    return titleText + ' | つくマート';
                } else return 'つくマート';
            })(),
            view: A2($rtfeldman$elm_css$Html$Styled$map, f, record.view)
        };
    });
    var $author$project$Style$containerInnerStyle = $rtfeldman$elm_css$Css$batch(_List_fromArray([
        $author$project$Style$displayGridAndGap(48),
        $rtfeldman$elm_css$Css$maxWidth($rtfeldman$elm_css$Css$px(640)),
        $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(16)),
        $rtfeldman$elm_css$Css$boxSizing($rtfeldman$elm_css$Css$borderBox),
        $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$pct(100))
    ]));
    var $rtfeldman$elm_css$Css$auto = {
        alignItemsOrAuto: $rtfeldman$elm_css$Css$Structure$Compatible,
        cursor: $rtfeldman$elm_css$Css$Structure$Compatible,
        flexBasis: $rtfeldman$elm_css$Css$Structure$Compatible,
        intOrAuto: $rtfeldman$elm_css$Css$Structure$Compatible,
        justifyContentOrAuto: $rtfeldman$elm_css$Css$Structure$Compatible,
        lengthOrAuto: $rtfeldman$elm_css$Css$Structure$Compatible,
        lengthOrAutoOrCoverOrContain: $rtfeldman$elm_css$Css$Structure$Compatible,
        lengthOrNumberOrAutoOrNoneOrContent: $rtfeldman$elm_css$Css$Structure$Compatible,
        overflow: $rtfeldman$elm_css$Css$Structure$Compatible,
        pointerEvents: $rtfeldman$elm_css$Css$Structure$Compatible,
        tableLayout: $rtfeldman$elm_css$Css$Structure$Compatible,
        textRendering: $rtfeldman$elm_css$Css$Structure$Compatible,
        touchAction: $rtfeldman$elm_css$Css$Structure$Compatible,
        value: 'auto'
    };
    var $rtfeldman$elm_css$Css$overflowY = $rtfeldman$elm_css$Css$prop1('overflow-y');
    var $author$project$Style$containerStyle = $rtfeldman$elm_css$Css$batch(_List_fromArray([
        $rtfeldman$elm_css$Css$displayFlex,
        $rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$center),
        $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$pct(100)),
        $rtfeldman$elm_css$Css$flexDirection($rtfeldman$elm_css$Css$column),
        $rtfeldman$elm_css$Css$overflowY($rtfeldman$elm_css$Css$auto)
    ]));
    var $author$project$Style$container = function(children) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $author$project$Style$containerStyle
            ]))
        ]), _List_fromArray([
            A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $author$project$Style$containerInnerStyle
                ]))
            ]), children)
        ]));
    };
    var $rtfeldman$elm_css$Css$border2 = $rtfeldman$elm_css$Css$prop2('border');
    var $rtfeldman$elm_css$Css$notAllowed = {
        cursor: $rtfeldman$elm_css$Css$Structure$Compatible,
        value: 'not-allowed'
    };
    var $author$project$Style$mainButtonDisabledStyle = $rtfeldman$elm_css$Css$batch(_List_fromArray([
        $rtfeldman$elm_css$Css$backgroundColor(A3($rtfeldman$elm_css$Css$rgb, 170, 170, 170)),
        $rtfeldman$elm_css$Css$color(A3($rtfeldman$elm_css$Css$rgb, 221, 221, 221)),
        $rtfeldman$elm_css$Css$fill(A3($rtfeldman$elm_css$Css$rgb, 221, 221, 221)),
        $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(16)),
        $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$pct(100)),
        $rtfeldman$elm_css$Css$fontSize($rtfeldman$elm_css$Css$rem(1.5)),
        $rtfeldman$elm_css$Css$borderRadius($rtfeldman$elm_css$Css$px(8)),
        $author$project$Style$normalShadow,
        A2($rtfeldman$elm_css$Css$border2, $rtfeldman$elm_css$Css$zero, $rtfeldman$elm_css$Css$none),
        $rtfeldman$elm_css$Css$displayFlex,
        $rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$center),
        $rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$center),
        $rtfeldman$elm_css$Css$boxSizing($rtfeldman$elm_css$Css$borderBox),
        $rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$notAllowed)
    ]));
    var $author$project$Style$primaryColorLight = A3($rtfeldman$elm_css$Css$rgb, 154, 108, 201);
    var $author$project$Style$mainButtonStyle = $rtfeldman$elm_css$Css$batch(_List_fromArray([
        $rtfeldman$elm_css$Css$backgroundColor($author$project$Style$primaryColor),
        $rtfeldman$elm_css$Css$color(A3($rtfeldman$elm_css$Css$rgb, 221, 221, 221)),
        $rtfeldman$elm_css$Css$fill(A3($rtfeldman$elm_css$Css$rgb, 221, 221, 221)),
        $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(16)),
        $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$pct(100)),
        $rtfeldman$elm_css$Css$fontSize($rtfeldman$elm_css$Css$rem(1.5)),
        $rtfeldman$elm_css$Css$borderRadius($rtfeldman$elm_css$Css$px(8)),
        $author$project$Style$normalShadow,
        A2($rtfeldman$elm_css$Css$border2, $rtfeldman$elm_css$Css$zero, $rtfeldman$elm_css$Css$none),
        $rtfeldman$elm_css$Css$displayFlex,
        $rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$center),
        $rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$center),
        $rtfeldman$elm_css$Css$boxSizing($rtfeldman$elm_css$Css$borderBox),
        $rtfeldman$elm_css$Css$textDecoration($rtfeldman$elm_css$Css$none),
        $rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$pointer),
        $rtfeldman$elm_css$Css$hover(_List_fromArray([
            $rtfeldman$elm_css$Css$backgroundColor($author$project$Style$primaryColorLight),
            $rtfeldman$elm_css$Css$color(A3($rtfeldman$elm_css$Css$rgb, 17, 17, 17)),
            $rtfeldman$elm_css$Css$fill(A3($rtfeldman$elm_css$Css$rgb, 17, 17, 17))
        ]))
    ]));
    var $author$project$Style$mainButtonLink = F2(function(children, locationMaybe) {
        if (locationMaybe.$ === 'Just') {
            var location = locationMaybe.a;
            return A2($rtfeldman$elm_css$Html$Styled$a, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$href($author$project$PageLocation$toUrlAsString(location)),
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $author$project$Style$mainButtonStyle
                ]))
            ]), A2($elm$core$List$map, $rtfeldman$elm_css$Html$Styled$map($elm$core$Basics$never), children));
        } else return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $author$project$Style$mainButtonDisabledStyle
            ]))
        ]), A2($elm$core$List$map, $rtfeldman$elm_css$Html$Styled$map($elm$core$Basics$never), children));
    });
    var $rtfeldman$elm_css$Html$Styled$Attributes$id = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('id');
    var $author$project$Style$mainId = $rtfeldman$elm_css$Html$Styled$Attributes$id('mainView');
    var $rtfeldman$elm_css$Css$overflowX = $rtfeldman$elm_css$Css$prop1('overflow-x');
    var $author$project$Style$webkitOverflowScrolling = A2($rtfeldman$elm_css$Css$property, '-webkit-overflow-scrolling', 'touch');
    var $author$project$Style$mainView = $rtfeldman$elm_css$Html$Styled$div(_List_fromArray([
        $author$project$Style$mainId,
        $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
            $rtfeldman$elm_css$Css$overflowX($rtfeldman$elm_css$Css$auto),
            A2($author$project$Style$gridColumn, 2, 3),
            A2($author$project$Style$gridRow, 3, 4),
            $author$project$Style$webkitOverflowScrolling
        ]))
    ]));
    var $author$project$BasicParts$tabNone = $author$project$BasicParts$None;
    var $author$project$Page$About$view = function(model) {
        if (model.$ === 'About') return {
            bottomNavigation: $elm$core$Maybe$Nothing,
            tab: $author$project$BasicParts$tabNone,
            title: 'つくマートについて',
            view: $author$project$Style$mainView(_List_fromArray([
                $author$project$Style$container(_List_fromArray([
                    $rtfeldman$elm_css$Html$Styled$text('つくマートについてはまだ書かれていません'),
                    A2($author$project$Style$mainButtonLink, _List_fromArray([
                        $rtfeldman$elm_css$Html$Styled$text('プライバシーポリシー(未完成)')
                    ]), $elm$core$Maybe$Just($author$project$PageLocation$AboutPrivacyPolicy))
                ]))
            ]))
        };
        else return {
            bottomNavigation: $elm$core$Maybe$Nothing,
            tab: $author$project$BasicParts$tabNone,
            title: 'プライバシーポリシー',
            view: $author$project$Style$mainView(_List_fromArray([
                $author$project$Style$container(_List_fromArray([
                    $rtfeldman$elm_css$Html$Styled$text('プライバシーポリシーはまだ書かれていません')
                ]))
            ]))
        };
    };
    var $author$project$Page$BoughtProducts$MsgByLogIn = function(a) {
        return {
            $: 'MsgByLogIn',
            a: a
        };
    };
    var $author$project$BasicParts$tabSingle = $author$project$BasicParts$Single;
    var $rtfeldman$elm_css$Css$borderRightColor = function(c) {
        return A2($rtfeldman$elm_css$Css$property, 'border-right-color', c.value);
    };
    var $author$project$Icon$infinite = function() {
        var a = $rtfeldman$elm_css$Css$int(0);
        return _Utils_update(a, {
            value: 'infinite'
        });
    }();
    var $rtfeldman$elm_css$Css$rotate = function(_v0) {
        var value = _v0.value;
        return {
            transform: $rtfeldman$elm_css$Css$Structure$Compatible,
            value: A2($rtfeldman$elm_css$Css$cssFunction, 'rotate', _List_fromArray([
                value
            ]))
        };
    };
    var $rtfeldman$elm_css$Css$Animations$transform = function(values) {
        return $rtfeldman$elm_css$Css$Internal$Property($elm$core$List$isEmpty(values) ? 'transform:none' : 'transform:' + A2($elm$core$String$join, ' ', A2($elm$core$List$map, function($) {
            return $.value;
        }, values)));
    };
    var $rtfeldman$elm_css$Css$transparent = {
        color: $rtfeldman$elm_css$Css$Structure$Compatible,
        value: 'transparent'
    };
    var $rtfeldman$elm_css$Css$angleConverter = F2(function(suffix, angleVal) {
        return {
            angle: $rtfeldman$elm_css$Css$Structure$Compatible,
            angleOrDirection: $rtfeldman$elm_css$Css$Structure$Compatible,
            value: _Utils_ap($elm$core$String$fromFloat(angleVal), suffix)
        };
    });
    var $rtfeldman$elm_css$Css$turn = $rtfeldman$elm_css$Css$angleConverter('turn');
    var $author$project$Icon$loading = function(_v0) {
        var size = _v0.size;
        var color = _v0.color;
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $rtfeldman$elm_css$Css$borderRadius($rtfeldman$elm_css$Css$pct(50)),
                $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$px(size)),
                $rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$px(size)),
                A3($rtfeldman$elm_css$Css$border3, $rtfeldman$elm_css$Css$px(3), $rtfeldman$elm_css$Css$solid, color),
                $rtfeldman$elm_css$Css$borderRightColor($rtfeldman$elm_css$Css$transparent),
                $rtfeldman$elm_css$Css$animationName($rtfeldman$elm_css$Css$Animations$keyframes(_List_fromArray([
                    _Utils_Tuple2(100, _List_fromArray([
                        $rtfeldman$elm_css$Css$Animations$transform(_List_fromArray([
                            $rtfeldman$elm_css$Css$rotate($rtfeldman$elm_css$Css$turn(1))
                        ]))
                    ]))
                ]))),
                $rtfeldman$elm_css$Css$animationIterationCount($author$project$Icon$infinite),
                $rtfeldman$elm_css$Css$animationDuration($rtfeldman$elm_css$Css$sec(0.6)),
                A2($rtfeldman$elm_css$Css$property, 'animation-timing-function', 'linear')
            ]))
        ]), _List_Nil);
    };
    var $author$project$Data$SocialLoginService$Line = {
        $: 'Line'
    };
    var $author$project$Component$LogIn$LogInOrSignUpRequest = function(a) {
        return {
            $: 'LogInOrSignUpRequest',
            a: a
        };
    };
    var $rtfeldman$elm_css$Css$active = $rtfeldman$elm_css$Css$pseudoClass('active');
    var $rtfeldman$elm_css$Css$borderRight3 = $rtfeldman$elm_css$Css$prop3('border-right');
    var $rtfeldman$elm_css$Html$Styled$button = $rtfeldman$elm_css$Html$Styled$node('button');
    var $rtfeldman$elm_css$Css$withPrecedingHash = function(str) {
        return A2($elm$core$String$startsWith, '#', str) ? str : A2($elm$core$String$cons, _Utils_chr('#'), str);
    };
    var $rtfeldman$elm_css$Css$erroneousHex = function(str) {
        return {
            alpha: 1,
            blue: 0,
            color: $rtfeldman$elm_css$Css$Structure$Compatible,
            green: 0,
            red: 0,
            value: $rtfeldman$elm_css$Css$withPrecedingHash(str)
        };
    };
    var $elm$core$String$fromChar = function(_char) {
        return A2($elm$core$String$cons, _char, '');
    };
    var $elm$core$Basics$pow = _Basics_pow;
    var $rtfeldman$elm_hex$Hex$fromStringHelp = F3(function(position, chars, accumulated) {
        fromStringHelp: while(true){
            if (!chars.b) return $elm$core$Result$Ok(accumulated);
            else {
                var _char = chars.a;
                var rest = chars.b;
                switch(_char.valueOf()){
                    case '0':
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated;
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case '1':
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case '2':
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + 2 * A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case '3':
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + 3 * A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case '4':
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + 4 * A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case '5':
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + 5 * A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case '6':
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + 6 * A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case '7':
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + 7 * A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case '8':
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + 8 * A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case '9':
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + 9 * A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case 'a':
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + 10 * A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case 'b':
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + 11 * A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case 'c':
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + 12 * A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case 'd':
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + 13 * A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case 'e':
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + 14 * A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    case 'f':
                        var $temp$position = position - 1, $temp$chars = rest, $temp$accumulated = accumulated + 15 * A2($elm$core$Basics$pow, 16, position);
                        position = $temp$position;
                        chars = $temp$chars;
                        accumulated = $temp$accumulated;
                        continue fromStringHelp;
                    default:
                        var nonHex = _char;
                        return $elm$core$Result$Err($elm$core$String$fromChar(nonHex) + ' is not a valid hexadecimal character.');
                }
            }
        }
    });
    var $rtfeldman$elm_hex$Hex$fromString = function(str) {
        if ($elm$core$String$isEmpty(str)) return $elm$core$Result$Err('Empty strings are not valid hexadecimal strings.');
        else {
            var result = function() {
                if (A2($elm$core$String$startsWith, '-', str)) {
                    var list = A2($elm$core$Maybe$withDefault, _List_Nil, $elm$core$List$tail($elm$core$String$toList(str)));
                    return A2($elm$core$Result$map, $elm$core$Basics$negate, A3($rtfeldman$elm_hex$Hex$fromStringHelp, $elm$core$List$length(list) - 1, list, 0));
                } else return A3($rtfeldman$elm_hex$Hex$fromStringHelp, $elm$core$String$length(str) - 1, $elm$core$String$toList(str), 0);
            }();
            var formatError = function(err) {
                return A2($elm$core$String$join, ' ', _List_fromArray([
                    '\"' + (str + '\"'),
                    'is not a valid hexadecimal string because',
                    err
                ]));
            };
            return A2($elm$core$Result$mapError, formatError, result);
        }
    };
    var $elm$core$String$toLower = _String_toLower;
    var $rtfeldman$elm_css$Css$validHex = F5(function(str, _v0, _v1, _v2, _v3) {
        var r1 = _v0.a;
        var r2 = _v0.b;
        var g1 = _v1.a;
        var g2 = _v1.b;
        var b1 = _v2.a;
        var b2 = _v2.b;
        var a1 = _v3.a;
        var a2 = _v3.b;
        var toResult = A2($elm$core$Basics$composeR, $elm$core$String$fromList, A2($elm$core$Basics$composeR, $elm$core$String$toLower, $rtfeldman$elm_hex$Hex$fromString));
        var results = _Utils_Tuple2(_Utils_Tuple2(toResult(_List_fromArray([
            r1,
            r2
        ])), toResult(_List_fromArray([
            g1,
            g2
        ]))), _Utils_Tuple2(toResult(_List_fromArray([
            b1,
            b2
        ])), toResult(_List_fromArray([
            a1,
            a2
        ]))));
        if (results.a.a.$ === 'Ok' && results.a.b.$ === 'Ok' && results.b.a.$ === 'Ok' && results.b.b.$ === 'Ok') {
            var _v5 = results.a;
            var red = _v5.a.a;
            var green = _v5.b.a;
            var _v6 = results.b;
            var blue = _v6.a.a;
            var alpha = _v6.b.a;
            return {
                alpha: alpha / 255,
                blue: blue,
                color: $rtfeldman$elm_css$Css$Structure$Compatible,
                green: green,
                red: red,
                value: $rtfeldman$elm_css$Css$withPrecedingHash(str)
            };
        } else return $rtfeldman$elm_css$Css$erroneousHex(str);
    });
    var $rtfeldman$elm_css$Css$hex = function(str) {
        var withoutHash = A2($elm$core$String$startsWith, '#', str) ? A2($elm$core$String$dropLeft, 1, str) : str;
        var _v0 = $elm$core$String$toList(withoutHash);
        _v0$4: while(true){
            if (_v0.b && _v0.b.b && _v0.b.b.b) {
                if (!_v0.b.b.b.b) {
                    var r = _v0.a;
                    var _v1 = _v0.b;
                    var g = _v1.a;
                    var _v2 = _v1.b;
                    var b = _v2.a;
                    return A5($rtfeldman$elm_css$Css$validHex, str, _Utils_Tuple2(r, r), _Utils_Tuple2(g, g), _Utils_Tuple2(b, b), _Utils_Tuple2(_Utils_chr('f'), _Utils_chr('f')));
                } else if (!_v0.b.b.b.b.b) {
                    var r = _v0.a;
                    var _v3 = _v0.b;
                    var g = _v3.a;
                    var _v4 = _v3.b;
                    var b = _v4.a;
                    var _v5 = _v4.b;
                    var a = _v5.a;
                    return A5($rtfeldman$elm_css$Css$validHex, str, _Utils_Tuple2(r, r), _Utils_Tuple2(g, g), _Utils_Tuple2(b, b), _Utils_Tuple2(a, a));
                } else {
                    if (_v0.b.b.b.b.b.b) {
                        if (!_v0.b.b.b.b.b.b.b) {
                            var r1 = _v0.a;
                            var _v6 = _v0.b;
                            var r2 = _v6.a;
                            var _v7 = _v6.b;
                            var g1 = _v7.a;
                            var _v8 = _v7.b;
                            var g2 = _v8.a;
                            var _v9 = _v8.b;
                            var b1 = _v9.a;
                            var _v10 = _v9.b;
                            var b2 = _v10.a;
                            return A5($rtfeldman$elm_css$Css$validHex, str, _Utils_Tuple2(r1, r2), _Utils_Tuple2(g1, g2), _Utils_Tuple2(b1, b2), _Utils_Tuple2(_Utils_chr('f'), _Utils_chr('f')));
                        } else {
                            if (_v0.b.b.b.b.b.b.b.b && !_v0.b.b.b.b.b.b.b.b.b) {
                                var r1 = _v0.a;
                                var _v11 = _v0.b;
                                var r2 = _v11.a;
                                var _v12 = _v11.b;
                                var g1 = _v12.a;
                                var _v13 = _v12.b;
                                var g2 = _v13.a;
                                var _v14 = _v13.b;
                                var b1 = _v14.a;
                                var _v15 = _v14.b;
                                var b2 = _v15.a;
                                var _v16 = _v15.b;
                                var a1 = _v16.a;
                                var _v17 = _v16.b;
                                var a2 = _v17.a;
                                return A5($rtfeldman$elm_css$Css$validHex, str, _Utils_Tuple2(r1, r2), _Utils_Tuple2(g1, g2), _Utils_Tuple2(b1, b2), _Utils_Tuple2(a1, a2));
                            } else break _v0$4;
                        }
                    } else break _v0$4;
                }
            } else break _v0$4;
        }
        return $rtfeldman$elm_css$Css$erroneousHex(str);
    };
    var $author$project$Component$LogIn$logInButtonText = function(text) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $rtfeldman$elm_css$Css$flexGrow($rtfeldman$elm_css$Css$int(1)),
                $rtfeldman$elm_css$Css$fontWeight($rtfeldman$elm_css$Css$bold)
            ]))
        ]), _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$text(text)
        ]));
    };
    var $author$project$Component$LogIn$logInButtonLine = A2($rtfeldman$elm_css$Html$Styled$button, _List_fromArray([
        $rtfeldman$elm_css$Html$Styled$Events$onClick($author$project$Component$LogIn$LogInOrSignUpRequest($author$project$Data$SocialLoginService$Line)),
        $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
            $rtfeldman$elm_css$Css$backgroundColor($rtfeldman$elm_css$Css$hex('#00c300')),
            $rtfeldman$elm_css$Css$borderRadius($rtfeldman$elm_css$Css$px(4)),
            A2($rtfeldman$elm_css$Css$border2, $rtfeldman$elm_css$Css$zero, $rtfeldman$elm_css$Css$none),
            $rtfeldman$elm_css$Css$color(A3($rtfeldman$elm_css$Css$rgb, 255, 255, 255)),
            $rtfeldman$elm_css$Css$displayFlex,
            $rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$center),
            $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$zero),
            $rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$pointer),
            $rtfeldman$elm_css$Css$hover(_List_fromArray([
                $rtfeldman$elm_css$Css$backgroundColor($rtfeldman$elm_css$Css$hex('#00e000'))
            ])),
            $rtfeldman$elm_css$Css$active(_List_fromArray([
                $rtfeldman$elm_css$Css$backgroundColor($rtfeldman$elm_css$Css$hex('#00b300'))
            ]))
        ]))
    ]), _List_fromArray([
        A2($rtfeldman$elm_css$Html$Styled$img, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$src('/assets/line_icon120.png'),
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $rtfeldman$elm_css$Css$display($rtfeldman$elm_css$Css$block),
                $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$px(44)),
                $rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$px(44)),
                A3($rtfeldman$elm_css$Css$borderRight3, $rtfeldman$elm_css$Css$px(1), $rtfeldman$elm_css$Css$solid, $rtfeldman$elm_css$Css$hex('#00b300')),
                $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(4)),
                $rtfeldman$elm_css$Css$hover(_List_fromArray([
                    $rtfeldman$elm_css$Css$borderRightColor($rtfeldman$elm_css$Css$hex('#00c900'))
                ])),
                $rtfeldman$elm_css$Css$hover(_List_fromArray([
                    $rtfeldman$elm_css$Css$borderRightColor($rtfeldman$elm_css$Css$hex('#009800'))
                ]))
            ]))
        ]), _List_Nil),
        $author$project$Component$LogIn$logInButtonText('LINEでログイン')
    ]));
    var $author$project$Component$LogIn$serviceLogInButtonListView = _List_fromArray([
        $author$project$Component$LogIn$logInButtonLine
    ]);
    var $author$project$Data$SocialLoginService$serviceName = function(service) {
        return 'LINE';
    };
    var $author$project$Component$LogIn$view = function(_v0) {
        var waitLogInUrl = _v0.a;
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $author$project$Style$displayGridAndGap(24),
                $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(24))
            ]))
        ]), A2($elm$core$List$cons, A2($rtfeldman$elm_css$Html$Styled$div, _List_Nil, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$text('ログイン/新規登録するためには以下のどれかのアカウントが必要です')
        ])), function() {
            if (waitLogInUrl.$ === 'Just') {
                var service = waitLogInUrl.a;
                return _List_fromArray([
                    A2($rtfeldman$elm_css$Html$Styled$div, _List_Nil, _List_fromArray([
                        $rtfeldman$elm_css$Html$Styled$text($author$project$Data$SocialLoginService$serviceName(service) + 'のログイン画面へのURLを取得中')
                    ])),
                    $author$project$Icon$loading({
                        color: A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0),
                        size: 64
                    })
                ]);
            } else return $author$project$Component$LogIn$serviceLogInButtonListView;
        }()));
    };
    var $rtfeldman$elm_css$Html$Styled$Attributes$alt = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('alt');
    var $author$project$Style$emptyList = function(text) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $rtfeldman$elm_css$Css$displayFlex,
                $rtfeldman$elm_css$Css$flexDirection($rtfeldman$elm_css$Css$column),
                $rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$center),
                $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(32))
            ]))
        ]), _List_fromArray([
            A2($rtfeldman$elm_css$Html$Styled$img, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$src('/assets/logo_bird.png'),
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    A2($rtfeldman$elm_css$Css$property, 'filter', 'grayscale(100%)'),
                    $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$px(128))
                ])),
                $rtfeldman$elm_css$Html$Styled$Attributes$alt('無いことを悲しむつくバード')
            ]), _List_Nil),
            $rtfeldman$elm_css$Html$Styled$text(text)
        ]));
    };
    var $author$project$Style$justifyItemsCenter = A2($rtfeldman$elm_css$Css$property, 'justify-items', 'center');
    var $author$project$Data$Product$getStatus = function(_v0) {
        var status = _v0.a.status;
        return status;
    };
    var $author$project$Data$Product$getThumbnailImageUrl = function(_v0) {
        var thumbnailImageId = _v0.a.thumbnailImageId;
        return $author$project$Data$ImageId$toUrlString(thumbnailImageId);
    };
    var $author$project$Component$ProductList$itemImage = F2(function(name, url) {
        return A2($rtfeldman$elm_css$Html$Styled$img, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $rtfeldman$elm_css$Css$display($rtfeldman$elm_css$Css$block),
                $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$pct(100)),
                $rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$px(192)),
                A2($rtfeldman$elm_css$Css$property, 'object-fit', 'cover'),
                A2($author$project$Style$gridColumn, 1, 2),
                A2($author$project$Style$gridRow, 1, 2),
                $rtfeldman$elm_css$Css$backgroundColor(A3($rtfeldman$elm_css$Css$rgb, 128, 128, 128))
            ])),
            $rtfeldman$elm_css$Html$Styled$Attributes$src(url),
            $rtfeldman$elm_css$Html$Styled$Attributes$alt(name + 'の画像')
        ]), _List_Nil);
    });
    var $author$project$Component$ProductList$Like = F2(function(a, b) {
        return {
            $: 'Like',
            a: a,
            b: b
        };
    });
    var $author$project$Component$ProductList$UnLike = F2(function(a, b) {
        return {
            $: 'UnLike',
            a: a,
            b: b
        };
    });
    var $elm$virtual_dom$VirtualDom$Custom = function(a) {
        return {
            $: 'Custom',
            a: a
        };
    };
    var $rtfeldman$elm_css$Html$Styled$Events$custom = F2(function(event, decoder) {
        return A2($rtfeldman$elm_css$VirtualDom$Styled$on, event, $elm$virtual_dom$VirtualDom$Custom(decoder));
    });
    var $elm$json$Json$Encode$bool = _Json_wrap;
    var $rtfeldman$elm_css$Html$Styled$Attributes$boolProperty = F2(function(key, bool) {
        return A2($rtfeldman$elm_css$VirtualDom$Styled$property, key, $elm$json$Json$Encode$bool(bool));
    });
    var $rtfeldman$elm_css$Html$Styled$Attributes$disabled = $rtfeldman$elm_css$Html$Styled$Attributes$boolProperty('disabled');
    var $author$project$Data$Product$getLikedCount = function(_v0) {
        var likedCount = _v0.a.likedCount;
        return likedCount;
    };
    var $rtfeldman$elm_css$Html$Styled$span = $rtfeldman$elm_css$Html$Styled$node('span');
    var $author$project$Component$ProductList$itemLikeBody = function(count) {
        return _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$text('いいね'),
            A2($rtfeldman$elm_css$Html$Styled$span, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $rtfeldman$elm_css$Css$fontSize($rtfeldman$elm_css$Css$rem(1.3))
                ]))
            ]), _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text($elm$core$String$fromInt(count))
            ]))
        ]);
    };
    var $author$project$Component$ProductList$productListLikeStyle = function(isLiked) {
        return $rtfeldman$elm_css$Css$batch(_List_fromArray([
            $rtfeldman$elm_css$Css$backgroundColor(isLiked ? $author$project$Style$primaryColor : A3($rtfeldman$elm_css$Css$rgb, 170, 170, 170)),
            $rtfeldman$elm_css$Css$borderRadius($rtfeldman$elm_css$Css$px(8)),
            $author$project$Style$userSelectNone,
            $rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$pointer),
            $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(8)),
            A2($rtfeldman$elm_css$Css$border2, $rtfeldman$elm_css$Css$zero, $rtfeldman$elm_css$Css$none),
            $rtfeldman$elm_css$Css$fontSize($rtfeldman$elm_css$Css$rem(0.8)),
            $rtfeldman$elm_css$Css$color(isLiked ? A3($rtfeldman$elm_css$Css$rgb, 255, 255, 255) : A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0)),
            $rtfeldman$elm_css$Css$hover(_List_fromArray([
                $rtfeldman$elm_css$Css$backgroundColor(isLiked ? $author$project$Style$primaryColorLight : A3($rtfeldman$elm_css$Css$rgb, 136, 136, 136))
            ]))
        ]));
    };
    var $author$project$Component$ProductList$itemLike = F3(function(logInState, sending, product) {
        if (sending) return A2($rtfeldman$elm_css$Html$Styled$button, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $author$project$Component$ProductList$productListLikeStyle(false)
            ])),
            $rtfeldman$elm_css$Html$Styled$Attributes$disabled(true),
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                A2($rtfeldman$elm_css$Css$padding2, $rtfeldman$elm_css$Css$px(8), $rtfeldman$elm_css$Css$px(24))
            ]))
        ]), _List_fromArray([
            $author$project$Icon$loading({
                color: A3($rtfeldman$elm_css$Css$rgb, 255, 255, 255),
                size: 20
            })
        ]));
        else {
            if (logInState.$ === 'Ok') {
                var likedProductIds = logInState.a.likedProductIds;
                var token = logInState.a.token;
                return A2($elm$core$List$member, $author$project$Data$Product$getId(product), likedProductIds) ? A2($rtfeldman$elm_css$Html$Styled$button, _List_fromArray([
                    A2($rtfeldman$elm_css$Html$Styled$Events$custom, 'click', $elm$json$Json$Decode$succeed({
                        message: A2($author$project$Component$ProductList$UnLike, token, $author$project$Data$Product$getId(product)),
                        preventDefault: true,
                        stopPropagation: true
                    })),
                    $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                        $author$project$Component$ProductList$productListLikeStyle(true)
                    ]))
                ]), $author$project$Component$ProductList$itemLikeBody($author$project$Data$Product$getLikedCount(product))) : A2($rtfeldman$elm_css$Html$Styled$button, _List_fromArray([
                    A2($rtfeldman$elm_css$Html$Styled$Events$custom, 'click', $elm$json$Json$Decode$succeed({
                        message: A2($author$project$Component$ProductList$Like, token, $author$project$Data$Product$getId(product)),
                        preventDefault: true,
                        stopPropagation: true
                    })),
                    $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                        $author$project$Component$ProductList$productListLikeStyle(false)
                    ]))
                ]), $author$project$Component$ProductList$itemLikeBody($author$project$Data$Product$getLikedCount(product)));
            } else return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $author$project$Style$userSelectNone,
                    $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(8)),
                    A3($rtfeldman$elm_css$Css$border3, $rtfeldman$elm_css$Css$px(1), $rtfeldman$elm_css$Css$solid, A3($rtfeldman$elm_css$Css$rgb, 170, 180, 170)),
                    $rtfeldman$elm_css$Css$fontSize($rtfeldman$elm_css$Css$rem(0.8))
                ]))
            ]), $author$project$Component$ProductList$itemLikeBody($author$project$Data$Product$getLikedCount(product)));
        }
    });
    var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
    var $elm$core$String$repeatHelp = F3(function(n, chunk, result) {
        return n <= 0 ? result : A3($elm$core$String$repeatHelp, n >> 1, _Utils_ap(chunk, chunk), !(n & 1) ? result : _Utils_ap(result, chunk));
    });
    var $elm$core$String$repeat = F2(function(n, chunk) {
        return A3($elm$core$String$repeatHelp, n, chunk, '');
    });
    var $elm$core$String$padLeft = F3(function(n, _char, string) {
        return _Utils_ap(A2($elm$core$String$repeat, n - $elm$core$String$length(string), $elm$core$String$fromChar(_char)), string);
    });
    var $author$project$Data$Product$priceToStringWithoutYen = function(price) {
        return A2($elm$core$String$join, ',', function(_v0) {
            var a = _v0.a;
            var b = _v0.b;
            return A2($elm$core$List$cons, a, b);
        }(A2($elm$core$Tuple$mapSecond, $elm$core$List$map(A2($elm$core$Basics$composeR, $elm$core$String$fromInt, A2($elm$core$String$padLeft, 3, _Utils_chr('0')))), A2($elm$core$Tuple$mapFirst, $elm$core$String$fromInt, price < 1000 ? _Utils_Tuple2(price, _List_Nil) : price < 1000000 ? _Utils_Tuple2(price / 1000 | 0, _List_fromArray([
            A2($elm$core$Basics$modBy, 1000, price)
        ])) : _Utils_Tuple2(price / 1000000 | 0, _List_fromArray([
            A2($elm$core$Basics$modBy, 1000, price / 1000 | 0),
            A2($elm$core$Basics$modBy, 1000, price)
        ]))))));
    };
    var $author$project$Component$ProductList$itemPrice = function(price) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_Nil, _List_fromArray([
            A2($rtfeldman$elm_css$Html$Styled$span, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $rtfeldman$elm_css$Css$fontSize($rtfeldman$elm_css$Css$rem(1.5)),
                    $rtfeldman$elm_css$Css$color(A3($rtfeldman$elm_css$Css$rgb, 81, 33, 130))
                ]))
            ]), _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text($author$project$Data$Product$priceToStringWithoutYen(price))
            ])),
            $rtfeldman$elm_css$Html$Styled$text('円')
        ]));
    };
    var $rtfeldman$elm_css$Css$deg = $rtfeldman$elm_css$Css$angleConverter('deg');
    var $rtfeldman$elm_css$Css$hidden = {
        borderStyle: $rtfeldman$elm_css$Css$Structure$Compatible,
        overflow: $rtfeldman$elm_css$Css$Structure$Compatible,
        value: 'hidden',
        visibility: $rtfeldman$elm_css$Css$Structure$Compatible
    };
    var $rtfeldman$elm_css$Css$overflow = $rtfeldman$elm_css$Css$prop1('overflow');
    var $rtfeldman$elm_css$Css$valuesOrNone = function(list) {
        return $elm$core$List$isEmpty(list) ? {
            value: 'none'
        } : {
            value: A2($elm$core$String$join, ' ', A2($elm$core$List$map, function($) {
                return $.value;
            }, list))
        };
    };
    var $rtfeldman$elm_css$Css$transforms = A2($elm$core$Basics$composeL, $rtfeldman$elm_css$Css$prop1('transform'), $rtfeldman$elm_css$Css$valuesOrNone);
    var $rtfeldman$elm_css$Css$translate2 = F2(function(tx, ty) {
        return {
            transform: $rtfeldman$elm_css$Css$Structure$Compatible,
            value: A2($rtfeldman$elm_css$Css$cssFunction, 'translate', _List_fromArray([
                tx.value,
                ty.value
            ]))
        };
    });
    var $author$project$Component$ProductList$soldOutBar = A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
        $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
            A2($author$project$Style$gridColumn, 1, 2),
            A2($author$project$Style$gridRow, 1, 2),
            $rtfeldman$elm_css$Css$overflow($rtfeldman$elm_css$Css$hidden)
        ]))
    ]), _List_fromArray([
        A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $rtfeldman$elm_css$Css$backgroundColor(A3($rtfeldman$elm_css$Css$rgb, 149, 12, 12)),
                $rtfeldman$elm_css$Css$color(A3($rtfeldman$elm_css$Css$rgb, 255, 255, 255)),
                $rtfeldman$elm_css$Css$transforms(_List_fromArray([
                    A2($rtfeldman$elm_css$Css$translate2, $rtfeldman$elm_css$Css$px(-73), $rtfeldman$elm_css$Css$px(42)),
                    $rtfeldman$elm_css$Css$rotate($rtfeldman$elm_css$Css$deg(315))
                ])),
                $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$px(256)),
                $rtfeldman$elm_css$Css$fontSize($rtfeldman$elm_css$Css$rem(1.5)),
                $rtfeldman$elm_css$Css$textAlign($rtfeldman$elm_css$Css$center)
            ]))
        ]), _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$text('うりきれ')
        ]))
    ]));
    var $rtfeldman$elm_css$Css$spaceBetween = $rtfeldman$elm_css$Css$prop1('space-between');
    var $author$project$Component$ProductList$itemView = F3(function(logInState, sending, product) {
        return A2($rtfeldman$elm_css$Html$Styled$a, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $author$project$Style$displayGridAndGap(0),
                A3($rtfeldman$elm_css$Css$border3, $rtfeldman$elm_css$Css$px(1), $rtfeldman$elm_css$Css$solid, A4($rtfeldman$elm_css$Css$rgba, 0, 0, 0, 0.4)),
                $rtfeldman$elm_css$Css$textDecoration($rtfeldman$elm_css$Css$none),
                $rtfeldman$elm_css$Css$color(A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0)),
                $rtfeldman$elm_css$Css$hover(_List_fromArray([
                    $rtfeldman$elm_css$Css$backgroundColor(A3($rtfeldman$elm_css$Css$rgb, 204, 204, 204))
                ]))
            ])),
            $rtfeldman$elm_css$Html$Styled$Attributes$href($author$project$PageLocation$toUrlAsString($author$project$PageLocation$Product($author$project$Data$Product$getId(product)))),
            $rtfeldman$elm_css$Html$Styled$Attributes$id($author$project$Component$ProductList$productIdString($author$project$Data$Product$getId(product)))
        ]), A2($elm$core$List$cons, A2($author$project$Component$ProductList$itemImage, $author$project$Data$Product$getName(product), $author$project$Data$Product$getThumbnailImageUrl(product)), _Utils_ap(function() {
            var _v0 = $author$project$Data$Product$getStatus(product);
            switch(_v0.$){
                case 'Selling':
                    return _List_Nil;
                case 'Trading':
                    return _List_fromArray([
                        $author$project$Component$ProductList$soldOutBar
                    ]);
                default:
                    return _List_fromArray([
                        $author$project$Component$ProductList$soldOutBar
                    ]);
            }
        }(), _List_fromArray([
            A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $rtfeldman$elm_css$Css$fontSize($rtfeldman$elm_css$Css$rem(1.1)),
                    $rtfeldman$elm_css$Css$overflowWrap($rtfeldman$elm_css$Css$breakWord),
                    A2($rtfeldman$elm_css$Css$padding2, $rtfeldman$elm_css$Css$px(4), $rtfeldman$elm_css$Css$px(8))
                ]))
            ]), _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text($author$project$Data$Product$getName(product))
            ])),
            A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $rtfeldman$elm_css$Css$displayFlex,
                    $rtfeldman$elm_css$Css$flexDirection($rtfeldman$elm_css$Css$row),
                    $rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$spaceBetween),
                    A2($rtfeldman$elm_css$Css$padding2, $rtfeldman$elm_css$Css$px(4), $rtfeldman$elm_css$Css$px(8))
                ]))
            ]), _List_fromArray([
                A3($author$project$Component$ProductList$itemLike, logInState, sending, product),
                $author$project$Component$ProductList$itemPrice($author$project$Data$Product$getPrice(product))
            ]))
        ]))));
    });
    var $author$project$Component$ProductList$listView = F4(function(sending, logInState, isWideMode, _v0) {
        var product = _v0.a;
        var productList = _v0.b;
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $author$project$Style$displayGridAndGap(0),
                A2($rtfeldman$elm_css$Css$property, 'grid-template-columns', isWideMode ? '33.3% 33.4% 33.3%' : '50% 50%')
            ]))
        ]), A2($elm$core$List$map, function(p) {
            return A3($author$project$Component$ProductList$itemView, logInState, A2($elm$core$Set$member, $author$project$Data$Product$idToString($author$project$Data$Product$getId(p)), sending), p);
        }, A2($elm$core$List$cons, product, productList)));
    });
    var $author$project$Component$ProductList$view = F4(function(_v0, logInState, isWideMode, productList) {
        var likeUpdating = _v0.a.likeUpdating;
        if (productList.$ === 'Just') {
            if (!productList.a.b) return $author$project$Style$emptyList('ここに表示する商品がありません');
            else {
                var _v2 = productList.a;
                var x = _v2.a;
                var xs = _v2.b;
                return A4($author$project$Component$ProductList$listView, likeUpdating, logInState, isWideMode, _Utils_Tuple2(x, xs));
            }
        } else return $author$project$Style$container(_List_fromArray([
            A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $author$project$Style$displayGridAndGap(0),
                    $author$project$Style$justifyItemsCenter
                ]))
            ]), _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text('読み込み中'),
                $author$project$Icon$loading({
                    color: A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0),
                    size: 48
                })
            ]))
        ]));
    });
    var $author$project$Page$BoughtProducts$view = F4(function(logInState, isWideScreen, allProductsMaybe, _v0) {
        var rec = _v0.a;
        return {
            bottomNavigation: $elm$core$Maybe$Nothing,
            tab: $author$project$BasicParts$tabSingle('購入した商品'),
            title: $elm$core$Maybe$Just('購入した商品'),
            view: $author$project$Style$mainView(function() {
                if (logInState.$ === 'None') return _List_fromArray([
                    $author$project$Style$container(_List_fromArray([
                        $rtfeldman$elm_css$Html$Styled$text('ログインか新規登録をして、購入した商品一覧機能を使えるようにしよう!'),
                        A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Page$BoughtProducts$MsgByLogIn, $author$project$Component$LogIn$view(rec.logIn))
                    ]))
                ]);
                else return _List_fromArray([
                    A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Page$BoughtProducts$MsgByProductList, A4($author$project$Component$ProductList$view, rec.productList, logInState, isWideScreen, function() {
                        var _v2 = _Utils_Tuple2(rec.normal, allProductsMaybe);
                        switch(_v2.a.$){
                            case 'Normal':
                                if (_v2.b.$ === 'Just') {
                                    var productIds = _v2.a.a;
                                    var allProducts = _v2.b.a;
                                    return $elm$core$Maybe$Just(A2($elm$core$List$map, function(id) {
                                        return A2($author$project$Data$Product$searchFromId, id, allProducts);
                                    }, productIds));
                                } else {
                                    var _v3 = _v2.b;
                                    return $elm$core$Maybe$Nothing;
                                }
                            case 'Loading':
                                var _v4 = _v2.a;
                                return $elm$core$Maybe$Nothing;
                            default:
                                var _v5 = _v2.a;
                                return $elm$core$Maybe$Just(_List_Nil);
                        }
                    }()))
                ]);
            }())
        };
    });
    var $author$project$Page$CommentedProducts$MsgByLogIn = function(a) {
        return {
            $: 'MsgByLogIn',
            a: a
        };
    };
    var $author$project$Page$CommentedProducts$MsgByProductList = function(a) {
        return {
            $: 'MsgByProductList',
            a: a
        };
    };
    var $author$project$Page$CommentedProducts$view = F4(function(logInState, isWideScreen, allProductsMaybe, _v0) {
        var rec = _v0.a;
        return {
            bottomNavigation: $elm$core$Maybe$Nothing,
            tab: $author$project$BasicParts$tabSingle('コメントした商品'),
            title: $elm$core$Maybe$Just('コメントした商品'),
            view: $author$project$Style$mainView(function() {
                if (logInState.$ === 'None') return _List_fromArray([
                    $author$project$Style$container(_List_fromArray([
                        $rtfeldman$elm_css$Html$Styled$text('ログインか新規登録をして、いいねと閲覧履歴を使えるようにしよう!'),
                        A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Page$CommentedProducts$MsgByLogIn, $author$project$Component$LogIn$view(rec.logIn))
                    ]))
                ]);
                else return _List_fromArray([
                    A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Page$CommentedProducts$MsgByProductList, A4($author$project$Component$ProductList$view, rec.productList, logInState, isWideScreen, function() {
                        var _v2 = _Utils_Tuple2(rec.normal, allProductsMaybe);
                        switch(_v2.a.$){
                            case 'Normal':
                                if (_v2.b.$ === 'Just') {
                                    var productIds = _v2.a.a;
                                    var allProducts = _v2.b.a;
                                    return $elm$core$Maybe$Just(A2($elm$core$List$map, function(id) {
                                        return A2($author$project$Data$Product$searchFromId, id, allProducts);
                                    }, productIds));
                                } else return $elm$core$Maybe$Nothing;
                            case 'Loading':
                                var _v3 = _v2.a;
                                return $elm$core$Maybe$Nothing;
                            default:
                                var _v4 = _v2.a;
                                return $elm$core$Maybe$Just(_List_Nil);
                        }
                    }()))
                ]);
            }())
        };
    });
    var $author$project$Page$Exhibition$SellProduct = function(a) {
        return {
            $: 'SellProduct',
            a: a
        };
    };
    var $author$project$Data$Product$conditionToJapaneseString = function(condition) {
        switch(condition.$){
            case 'ConditionNew':
                return '新品・未使用';
            case 'ConditionLikeNew':
                return 'ほぼ未使用';
            case 'ConditionVeryGood':
                return '目立った傷や汚れなし';
            case 'ConditionGood':
                return '多少の傷や汚れあり';
            case 'ConditionAcceptable':
                return '目立つ傷や汚れあり';
            default:
                return '状態が悪い・ジャンク';
        }
    };
    var $rtfeldman$elm_css$Svg$Styled$circle = $rtfeldman$elm_css$Svg$Styled$node('circle');
    var $rtfeldman$elm_css$Svg$Styled$line = $rtfeldman$elm_css$Svg$Styled$node('line');
    var $rtfeldman$elm_css$Svg$Styled$Events$onClick = function(msg) {
        return A2($rtfeldman$elm_css$Html$Styled$Events$on, 'click', $elm$json$Json$Decode$succeed(msg));
    };
    var $rtfeldman$elm_css$Svg$Styled$Attributes$r = $rtfeldman$elm_css$VirtualDom$Styled$attribute('r');
    var $rtfeldman$elm_css$Css$right = $rtfeldman$elm_css$Css$prop1('right');
    var $rtfeldman$elm_css$Svg$Styled$Attributes$stroke = $rtfeldman$elm_css$VirtualDom$Styled$attribute('stroke');
    var $rtfeldman$elm_css$Svg$Styled$Attributes$x1 = $rtfeldman$elm_css$VirtualDom$Styled$attribute('x1');
    var $rtfeldman$elm_css$Svg$Styled$Attributes$x2 = $rtfeldman$elm_css$VirtualDom$Styled$attribute('x2');
    var $rtfeldman$elm_css$Svg$Styled$Attributes$y1 = $rtfeldman$elm_css$VirtualDom$Styled$attribute('y1');
    var $rtfeldman$elm_css$Svg$Styled$Attributes$y2 = $rtfeldman$elm_css$VirtualDom$Styled$attribute('y2');
    var $author$project$Icon$delete = A2($rtfeldman$elm_css$Svg$Styled$svg, _List_fromArray([
        $rtfeldman$elm_css$Svg$Styled$Attributes$css(_List_fromArray([
            $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$px(32)),
            $rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$px(32)),
            $rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$absolute),
            $rtfeldman$elm_css$Css$right($rtfeldman$elm_css$Css$px(8)),
            $rtfeldman$elm_css$Css$top($rtfeldman$elm_css$Css$px(8)),
            $rtfeldman$elm_css$Css$fill(A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0)),
            $rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$pointer),
            $rtfeldman$elm_css$Css$hover(_List_fromArray([
                $rtfeldman$elm_css$Css$fill(A3($rtfeldman$elm_css$Css$rgb, 68, 68, 68))
            ]))
        ])),
        $rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 10 10'),
        $rtfeldman$elm_css$Svg$Styled$Events$onClick(_Utils_Tuple0)
    ]), _List_fromArray([
        A2($rtfeldman$elm_css$Svg$Styled$circle, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$cx('5'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$cy('5'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$r('5'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$stroke('none')
        ]), _List_Nil),
        A2($rtfeldman$elm_css$Svg$Styled$line, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$x1('3'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$y1('3'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$x2('7'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$y2('7'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$stroke('white')
        ]), _List_Nil),
        A2($rtfeldman$elm_css$Svg$Styled$line, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$x1('7'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$y1('3'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$x2('3'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$y2('7'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$stroke('white')
        ]), _List_Nil)
    ]));
    var $author$project$Style$cardListItem = F2(function(index, data) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$relative),
                $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$px(120)),
                $rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$px(120)),
                $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(16))
            ]))
        ]), _Utils_ap(function() {
            var _v0 = data._delete;
            if (_v0.$ === 'Just') {
                var deleteMessage = _v0.a;
                return _List_fromArray([
                    A2($rtfeldman$elm_css$Html$Styled$map, $elm$core$Basics$always(deleteMessage(index)), $author$project$Icon$delete)
                ]);
            } else return _List_Nil;
        }(), _List_fromArray([
            A2($rtfeldman$elm_css$Html$Styled$img, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $rtfeldman$elm_css$Css$display($rtfeldman$elm_css$Css$block),
                    $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$px(120)),
                    $rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$px(120)),
                    A2($rtfeldman$elm_css$Css$property, 'object-fit', 'contain')
                ])),
                $rtfeldman$elm_css$Html$Styled$Attributes$src(data.url)
            ]), _List_Nil)
        ])));
    });
    var $author$project$Style$cardListContainer = function(children) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $rtfeldman$elm_css$Css$backgroundColor(A3($rtfeldman$elm_css$Css$rgb, 100, 100, 100)),
                $rtfeldman$elm_css$Css$overflowX($rtfeldman$elm_css$Css$auto),
                $rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$relative)
            ]))
        ]), _List_fromArray([
            A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $rtfeldman$elm_css$Css$displayFlex,
                    $rtfeldman$elm_css$Css$flexDirection($rtfeldman$elm_css$Css$row)
                ]))
            ]), A2($elm$core$List$indexedMap, $author$project$Style$cardListItem, children))
        ]));
    };
    var $author$project$Page$Exhibition$confirmViewImage = function(images) {
        return $author$project$Style$cardListContainer(A2($elm$core$List$map, function(dataUrl) {
            return {
                _delete: $elm$core$Maybe$Nothing,
                url: dataUrl
            };
        }, images));
    };
    var $author$project$Style$mainButton = F2(function(children, msgMaybe) {
        return A2($rtfeldman$elm_css$Html$Styled$button, function() {
            if (msgMaybe.$ === 'Just') {
                var msg = msgMaybe.a;
                return _List_fromArray([
                    A2($rtfeldman$elm_css$Html$Styled$Events$custom, 'click', $elm$json$Json$Decode$succeed({
                        message: msg,
                        preventDefault: true,
                        stopPropagation: true
                    })),
                    $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                        $author$project$Style$mainButtonStyle
                    ]))
                ]);
            } else return _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$disabled(true),
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $author$project$Style$mainButtonDisabledStyle
                ]))
            ]);
        }(), A2($elm$core$List$map, $rtfeldman$elm_css$Html$Styled$map($elm$core$Basics$never), children));
    });
    var $author$project$Data$Product$priceToString = function(price) {
        return $author$project$Data$Product$priceToStringWithoutYen(price) + '円';
    };
    var $author$project$Style$labelStyle = $rtfeldman$elm_css$Css$batch(_List_Nil);
    var $author$project$Style$titleAndContent = F2(function(title, content) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $author$project$Style$displayGridAndGap(4)
            ]))
        ]), _List_fromArray([
            A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $author$project$Style$labelStyle
                ]))
            ]), _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text(title)
            ])),
            content
        ]));
    });
    var $author$project$Data$Category$groupToJapaneseString = function(group) {
        switch(group.$){
            case 'Furniture':
                return '家具';
            case 'Appliance':
                return '電化製品・電子機器';
            case 'Fashion':
                return 'ファッション';
            case 'Book':
                return '教科書・本';
            case 'Vehicle':
                return '自転車・車両';
            case 'Food':
                return '食料品';
            default:
                return 'ホビー・雑貨';
        }
    };
    var $author$project$Data$Category$partToJapaneseString = function(category) {
        switch(category.$){
            case 'FurnitureTable':
                return '机';
            case 'FurnitureChair':
                return 'イス';
            case 'FurnitureChest':
                return 'タンス・棚';
            case 'FurnitureBed':
                return '寝具';
            case 'FurnitureKitchen':
                return '食器・調理器具';
            case 'FurnitureCurtain':
                return 'カーテン';
            case 'FurnitureMat':
                return 'マット・カーペット';
            case 'FurnitureOther':
                return 'その他';
            case 'ApplianceRefrigerator':
                return '冷蔵庫';
            case 'ApplianceMicrowave':
                return '電子レンジ';
            case 'ApplianceWashing':
                return '洗濯機';
            case 'ApplianceVacuum':
                return '掃除機';
            case 'ApplianceTemperature':
                return '冷暖房・扇風機';
            case 'ApplianceHumidity':
                return '加湿器・除湿機';
            case 'ApplianceLight':
                return '照明・ライト';
            case 'ApplianceTv':
                return 'TV・ディスプレイ・プロジェクター';
            case 'ApplianceSpeaker':
                return 'スピーカー';
            case 'ApplianceSmartphone':
                return 'スマホ・タブレット';
            case 'AppliancePc':
                return 'パソコン';
            case 'ApplianceCommunication':
                return 'Wi-Fi ルーター・通信機器';
            case 'ApplianceOther':
                return 'その他';
            case 'FashionMens':
                return 'メンズ';
            case 'FashionLadies':
                return 'レディース';
            case 'FashionOther':
                return 'その他';
            case 'BookTextbook':
                return '教科書';
            case 'BookBook':
                return '本';
            case 'BookComic':
                return '漫画';
            case 'BookOther':
                return 'その他';
            case 'VehicleBicycle':
                return '自転車';
            case 'VehicleBike':
                return 'バイク';
            case 'VehicleCar':
                return '自動車';
            case 'VehicleOther':
                return 'その他';
            case 'FoodFood':
                return '食料';
            case 'FoodBeverage':
                return '飲料';
            case 'FoodOther':
                return 'その他';
            case 'HobbyDisc':
                return 'CD・DVD';
            case 'HobbyInstrument':
                return '楽器';
            case 'HobbyCamera':
                return 'カメラ';
            case 'HobbyGame':
                return 'ゲーム';
            case 'HobbySport':
                return 'スポーツ';
            case 'HobbyArt':
                return '美術・芸術品';
            case 'HobbyAccessory':
                return '雑貨・小物';
            case 'HobbyDaily':
                return '日用品';
            case 'HobbyHandmade':
                return 'ハンドメイド';
            default:
                return 'その他';
        }
    };
    var $author$project$Data$Category$toJapaneseString = function(category) {
        return $author$project$Data$Category$groupToJapaneseString($author$project$Data$Category$groupFromCategory(category)) + (' / ' + $author$project$Data$Category$partToJapaneseString(category));
    };
    var $author$project$Page$Exhibition$confirmView = F3(function(accessToken, _v0, sending) {
        var requestData = _v0.a;
        return _Utils_Tuple2('出品 確認', A2($elm$core$List$indexedMap, F2(function(index, a) {
            return _Utils_Tuple2($elm$core$String$fromInt(index), a);
        }), _Utils_ap(_List_fromArray([
            $author$project$Page$Exhibition$confirmViewImage(requestData.images),
            A2($author$project$Style$titleAndContent, '商品名', $rtfeldman$elm_css$Html$Styled$text(requestData.name)),
            A2($author$project$Style$titleAndContent, '説明文', $rtfeldman$elm_css$Html$Styled$text(requestData.description)),
            A2($author$project$Style$titleAndContent, '値段', $rtfeldman$elm_css$Html$Styled$text($author$project$Data$Product$priceToString(requestData.price))),
            A2($author$project$Style$titleAndContent, 'カテゴリー', $rtfeldman$elm_css$Html$Styled$text($author$project$Data$Category$toJapaneseString(requestData.category))),
            A2($author$project$Style$titleAndContent, '状態', $rtfeldman$elm_css$Html$Styled$text($author$project$Data$Product$conditionToJapaneseString(requestData.condition)))
        ]), sending ? _List_fromArray([
            A2($author$project$Style$mainButtonLink, _List_fromArray([
                $author$project$Icon$loading({
                    color: A3($rtfeldman$elm_css$Css$rgb, 255, 255, 255),
                    size: 24
                })
            ]), $elm$core$Maybe$Nothing)
        ]) : _List_fromArray([
            A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $rtfeldman$elm_css$Css$fontSize($rtfeldman$elm_css$Css$rem(1.5)),
                    $rtfeldman$elm_css$Css$textAlign($rtfeldman$elm_css$Css$center)
                ]))
            ]), _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text('この商品を出品します。よろしいですか?')
            ])),
            A2($author$project$Style$mainButton, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text('出品する')
            ]), $elm$core$Maybe$Just($author$project$Page$Exhibition$SellProduct(_Utils_Tuple2(accessToken, $author$project$Api$SellProductRequest(requestData)))))
        ]))));
    });
    var $author$project$Style$containerKeyed = function(children) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $author$project$Style$containerStyle
            ]))
        ]), _List_fromArray([
            A3($rtfeldman$elm_css$Html$Styled$Keyed$node, 'div', _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $author$project$Style$containerInnerStyle
                ]))
            ]), children)
        ]));
    };
    var $author$project$Page$Exhibition$toConformPageButton = function(available) {
        return A2($author$project$Style$mainButtonLink, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$text('出品確認画面へ')
        ]), available ? $elm$core$Maybe$Just($author$project$PageLocation$ExhibitionConfirm) : $elm$core$Maybe$Nothing);
    };
    var $author$project$Component$ProductEditor$MsgByCategory = function(a) {
        return {
            $: 'MsgByCategory',
            a: a
        };
    };
    var $author$project$Component$ProductEditor$SelectCondition = function(a) {
        return {
            $: 'SelectCondition',
            a: a
        };
    };
    var $rtfeldman$elm_css$Html$Styled$Attributes$for = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('htmlFor');
    var $rtfeldman$elm_css$Html$Styled$label = $rtfeldman$elm_css$Html$Styled$node('label');
    var $author$project$Style$formItem = F3(function(title, idString, content) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $author$project$Style$displayGridAndGap(4)
            ]))
        ]), A2($elm$core$List$cons, A2($rtfeldman$elm_css$Html$Styled$label, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $author$project$Style$labelStyle
            ])),
            $rtfeldman$elm_css$Html$Styled$Attributes$for(idString)
        ]), _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$text(title)
        ])), content));
    });
    var $rtfeldman$elm_css$Html$Styled$option = $rtfeldman$elm_css$Html$Styled$node('option');
    var $author$project$Style$blankOption = A2($rtfeldman$elm_css$Html$Styled$option, _List_Nil, _List_fromArray([
        $rtfeldman$elm_css$Html$Styled$text('--選択してください--')
    ]));
    var $rtfeldman$elm_css$Html$Styled$select = $rtfeldman$elm_css$Html$Styled$node('select');
    var $author$project$Style$selectDecoder = A2($elm$json$Json$Decode$map, function(index) {
        if (!index) return $elm$core$Maybe$Nothing;
        else {
            var x = index;
            return $elm$core$Maybe$Just(x - 1);
        }
    }, A2($elm$json$Json$Decode$at, _List_fromArray([
        'target',
        'selectedIndex'
    ]), $elm$json$Json$Decode$int));
    var $author$project$Style$selectMenu = F3(function(disabled, id, labelList) {
        return A2($rtfeldman$elm_css$Html$Styled$select, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $rtfeldman$elm_css$Css$display($rtfeldman$elm_css$Css$block),
                $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$pct(100)),
                $rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$px(64)),
                A3($rtfeldman$elm_css$Css$border3, $rtfeldman$elm_css$Css$px(1), $rtfeldman$elm_css$Css$solid, A3($rtfeldman$elm_css$Css$rgb, 204, 204, 204)),
                $rtfeldman$elm_css$Css$boxSizing($rtfeldman$elm_css$Css$borderBox),
                $rtfeldman$elm_css$Css$borderRadius($rtfeldman$elm_css$Css$px(8)),
                $rtfeldman$elm_css$Css$fontSize($rtfeldman$elm_css$Css$px(24))
            ])),
            $rtfeldman$elm_css$Html$Styled$Attributes$id(id),
            $rtfeldman$elm_css$Html$Styled$Attributes$disabled(disabled),
            A2($rtfeldman$elm_css$Html$Styled$Events$on, 'change', $author$project$Style$selectDecoder)
        ]), A2($elm$core$List$cons, $author$project$Style$blankOption, A2($elm$core$List$map, function(s) {
            return A2($rtfeldman$elm_css$Html$Styled$option, _List_Nil, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text(s)
            ]));
        }, labelList)));
    });
    var $author$project$Component$ProductEditor$conditionView = function(_v0) {
        return A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Component$ProductEditor$SelectCondition, A3($author$project$Style$formItem, '商品の状態', $author$project$Component$ProductEditor$conditionSelectId, _List_fromArray([
            A3($author$project$Style$selectMenu, false, $author$project$Component$ProductEditor$conditionSelectId, A2($elm$core$List$map, $author$project$Data$Product$conditionToJapaneseString, $author$project$Data$Product$conditionAll))
        ])));
    };
    var $author$project$Component$ProductEditor$InputDescription = function(a) {
        return {
            $: 'InputDescription',
            a: a
        };
    };
    var $rtfeldman$elm_css$Css$Transitions$BorderColor = {
        $: 'BorderColor'
    };
    var $rtfeldman$elm_css$Css$Transitions$borderColor3 = $rtfeldman$elm_css$Css$Transitions$fullTransition($rtfeldman$elm_css$Css$Transitions$BorderColor);
    var $rtfeldman$elm_css$Css$Transitions$BoxShadow = {
        $: 'BoxShadow'
    };
    var $rtfeldman$elm_css$Css$Transitions$boxShadow3 = $rtfeldman$elm_css$Css$Transitions$fullTransition($rtfeldman$elm_css$Css$Transitions$BoxShadow);
    var $rtfeldman$elm_css$Css$prop5 = F6(function(key, argA, argB, argC, argD, argE) {
        return A2($rtfeldman$elm_css$Css$property, key, A2($elm$core$String$join, ' ', _List_fromArray([
            argA.value,
            argB.value,
            argC.value,
            argD.value,
            argE.value
        ])));
    });
    var $rtfeldman$elm_css$Css$boxShadow5 = $rtfeldman$elm_css$Css$prop5('box-shadow');
    var $rtfeldman$elm_css$Css$Transitions$EaseInOut = {
        $: 'EaseInOut'
    };
    var $rtfeldman$elm_css$Css$Transitions$easeInOut = $rtfeldman$elm_css$Css$Transitions$EaseInOut;
    var $rtfeldman$elm_css$Css$focus = $rtfeldman$elm_css$Css$pseudoClass('focus');
    var $rtfeldman$elm_css$Css$inset = {
        borderStyle: $rtfeldman$elm_css$Css$Structure$Compatible,
        value: 'inset'
    };
    var $rtfeldman$elm_css$Css$outline = $rtfeldman$elm_css$Css$prop1('outline');
    var $author$project$Style$inputTextStyle = $rtfeldman$elm_css$Css$batch(_List_fromArray([
        $rtfeldman$elm_css$Css$fontSize($rtfeldman$elm_css$Css$rem(1.2)),
        $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(8)),
        $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$pct(100)),
        A3($rtfeldman$elm_css$Css$border3, $rtfeldman$elm_css$Css$px(1), $rtfeldman$elm_css$Css$solid, A3($rtfeldman$elm_css$Css$rgb, 204, 204, 204)),
        $rtfeldman$elm_css$Css$boxSizing($rtfeldman$elm_css$Css$borderBox),
        $rtfeldman$elm_css$Css$borderRadius($rtfeldman$elm_css$Css$px(8)),
        A5($rtfeldman$elm_css$Css$boxShadow5, $rtfeldman$elm_css$Css$inset, $rtfeldman$elm_css$Css$zero, $rtfeldman$elm_css$Css$px(1), $rtfeldman$elm_css$Css$px(1), A4($rtfeldman$elm_css$Css$rgba, 0, 0, 0, 0.075)),
        $rtfeldman$elm_css$Css$outline($rtfeldman$elm_css$Css$zero),
        $rtfeldman$elm_css$Css$Transitions$transition(_List_fromArray([
            A3($rtfeldman$elm_css$Css$Transitions$borderColor3, 150, 0, $rtfeldman$elm_css$Css$Transitions$easeInOut),
            A3($rtfeldman$elm_css$Css$Transitions$boxShadow3, 150, 0, $rtfeldman$elm_css$Css$Transitions$easeInOut)
        ])),
        $rtfeldman$elm_css$Css$focus(_List_fromArray([
            A2($rtfeldman$elm_css$Css$property, 'box-shadow', 'inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6)'),
            A3($rtfeldman$elm_css$Css$border3, $rtfeldman$elm_css$Css$px(1), $rtfeldman$elm_css$Css$solid, A3($rtfeldman$elm_css$Css$rgb, 102, 175, 233))
        ]))
    ]));
    var $rtfeldman$elm_css$Html$Styled$Events$alwaysStop = function(x) {
        return _Utils_Tuple2(x, true);
    };
    var $elm$virtual_dom$VirtualDom$MayStopPropagation = function(a) {
        return {
            $: 'MayStopPropagation',
            a: a
        };
    };
    var $rtfeldman$elm_css$Html$Styled$Events$stopPropagationOn = F2(function(event, decoder) {
        return A2($rtfeldman$elm_css$VirtualDom$Styled$on, event, $elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
    });
    var $rtfeldman$elm_css$Html$Styled$Events$targetValue = A2($elm$json$Json$Decode$at, _List_fromArray([
        'target',
        'value'
    ]), $elm$json$Json$Decode$string);
    var $rtfeldman$elm_css$Html$Styled$Events$onInput = function(tagger) {
        return A2($rtfeldman$elm_css$Html$Styled$Events$stopPropagationOn, 'input', A2($elm$json$Json$Decode$map, $rtfeldman$elm_css$Html$Styled$Events$alwaysStop, A2($elm$json$Json$Decode$map, tagger, $rtfeldman$elm_css$Html$Styled$Events$targetValue)));
    };
    var $rtfeldman$elm_css$Css$resize = $rtfeldman$elm_css$Css$prop1('resize');
    var $rtfeldman$elm_css$Html$Styled$textarea = $rtfeldman$elm_css$Html$Styled$node('textarea');
    var $author$project$Style$inputMutilineText = function(id) {
        return A2($rtfeldman$elm_css$Html$Styled$textarea, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $author$project$Style$inputTextStyle,
                $rtfeldman$elm_css$Css$resize($rtfeldman$elm_css$Css$none)
            ])),
            $rtfeldman$elm_css$Html$Styled$Attributes$id(id),
            $rtfeldman$elm_css$Html$Styled$Events$onInput($elm$core$Basics$identity)
        ]), _List_Nil);
    };
    var $author$project$Component$ProductEditor$descriptionView = A3($author$project$Style$formItem, '商品の説明', $author$project$Component$ProductEditor$descriptionEditorId, _List_fromArray([
        A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Component$ProductEditor$InputDescription, $author$project$Style$inputMutilineText($author$project$Component$ProductEditor$descriptionEditorId))
    ]));
    var $author$project$Component$ProductEditor$imageCount = function(_v0) {
        var addImagesLength = _v0.addImagesLength;
        var deleteIndexSize = _v0.deleteIndexSize;
        var beforeImageIdsLength = _v0.beforeImageIdsLength;
        return beforeImageIdsLength - deleteIndexSize + addImagesLength;
    };
    var $author$project$Component$ProductEditor$InputName = function(a) {
        return {
            $: 'InputName',
            a: a
        };
    };
    var $rtfeldman$elm_css$Html$Styled$Attributes$attribute = $rtfeldman$elm_css$VirtualDom$Styled$attribute;
    var $rtfeldman$elm_css$Html$Styled$input = $rtfeldman$elm_css$Html$Styled$node('input');
    var $rtfeldman$elm_css$Html$Styled$Attributes$maxlength = function(n) {
        return A2($rtfeldman$elm_css$VirtualDom$Styled$attribute, 'maxlength', $elm$core$String$fromInt(n));
    };
    var $rtfeldman$elm_css$Html$Styled$Attributes$placeholder = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('placeholder');
    var $rtfeldman$elm_css$Html$Styled$Attributes$required = $rtfeldman$elm_css$Html$Styled$Attributes$boolProperty('required');
    var $rtfeldman$elm_css$Html$Styled$Attributes$type_ = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('type');
    var $author$project$Style$inputText = function(_v0) {
        var id = _v0.id;
        var type_ = _v0.type_;
        var autoCompleteMaybe = _v0.autoCompleteMaybe;
        var required = _v0.required;
        var placeholder = _v0.placeholder;
        var maxlengthMaybe = _v0.maxlengthMaybe;
        return A2($rtfeldman$elm_css$Html$Styled$input, _Utils_ap(_List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $author$project$Style$inputTextStyle
            ])),
            $rtfeldman$elm_css$Html$Styled$Attributes$id(id),
            $rtfeldman$elm_css$Html$Styled$Events$onInput($elm$core$Basics$identity),
            $rtfeldman$elm_css$Html$Styled$Attributes$type_(type_),
            $rtfeldman$elm_css$Html$Styled$Attributes$required(required)
        ]), _Utils_ap($elm$core$String$isEmpty(placeholder) ? _List_Nil : _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$placeholder(placeholder)
        ]), _Utils_ap(function() {
            if (maxlengthMaybe.$ === 'Just') {
                var maxlength = maxlengthMaybe.a;
                return _List_fromArray([
                    $rtfeldman$elm_css$Html$Styled$Attributes$maxlength(maxlength)
                ]);
            } else return _List_Nil;
        }(), function() {
            if (autoCompleteMaybe.$ === 'Just') {
                var autoComplete = autoCompleteMaybe.a;
                return _List_fromArray([
                    A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'autocomplete', autoComplete)
                ]);
            } else return _List_Nil;
        }()))), _List_Nil);
    };
    var $author$project$Component$ProductEditor$nameView = function(name) {
        return A3($author$project$Style$formItem, '商品名', $author$project$Component$ProductEditor$nameEditorId, A2($elm$core$List$cons, A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Component$ProductEditor$InputName, $author$project$Style$inputText({
            autoCompleteMaybe: $elm$core$Maybe$Nothing,
            id: $author$project$Component$ProductEditor$nameEditorId,
            maxlengthMaybe: $elm$core$Maybe$Just(40),
            placeholder: '40文字まで',
            required: true,
            type_: 'text'
        })), function() {
            var _v0 = $author$project$Component$ProductEditor$nameCheck(name);
            if (_v0.$ === 'Just') {
                var errorMsg = _v0.a;
                return _List_fromArray([
                    $rtfeldman$elm_css$Html$Styled$text(errorMsg)
                ]);
            } else return _List_Nil;
        }()));
    };
    var $rtfeldman$elm_css$Html$Styled$Attributes$accept = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('accept');
    var $rtfeldman$elm_css$Html$Styled$Attributes$multiple = $rtfeldman$elm_css$Html$Styled$Attributes$boolProperty('multiple');
    var $author$project$Icon$photo = A2($rtfeldman$elm_css$Svg$Styled$svg, _List_fromArray([
        $rtfeldman$elm_css$Svg$Styled$Attributes$css(_List_fromArray([
            $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$px(112)),
            $rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$px(112))
        ])),
        $rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 24 24')
    ]), _List_fromArray([
        A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$d('M3 8c0 .55.45 1 1 1s1-.45 1-1V6h2c.55 0 1-.45 1-1s-.45-1-1-1H5V2c0-.55-.45-1-1-1s-1 .45-1 1v2H1c-.55 0-1 .45-1 1s.45 1 1 1h2v2z')
        ]), _List_Nil),
        A2($rtfeldman$elm_css$Svg$Styled$circle, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$cx('13'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$cy('14'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$r('3')
        ]), _List_Nil),
        A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$d('M21 6h-3.17l-1.24-1.35c-.37-.41-.91-.65-1.47-.65h-6.4c.17.3.28.63.28 1 0 1.1-.9 2-2 2H6v1c0 1.1-.9 2-2 2-.37 0-.7-.11-1-.28V20c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z')
        ]), _List_Nil)
    ]));
    var $author$project$Component$ProductEditor$photoAdd = A2($rtfeldman$elm_css$Html$Styled$div, _List_Nil, _List_fromArray([
        A2($rtfeldman$elm_css$Html$Styled$label, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$pct(100)),
                $rtfeldman$elm_css$Css$displayFlex,
                $rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$center),
                $rtfeldman$elm_css$Css$backgroundColor(A3($rtfeldman$elm_css$Css$rgb, 100, 100, 100)),
                $rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$pointer)
            ])),
            $rtfeldman$elm_css$Html$Styled$Attributes$id($author$project$Component$ProductEditor$photoAddLabelId),
            $rtfeldman$elm_css$Html$Styled$Attributes$for($author$project$Component$ProductEditor$photoAddInputId)
        ]), _List_fromArray([
            $author$project$Icon$photo
        ])),
        A2($rtfeldman$elm_css$Html$Styled$input, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$id($author$project$Component$ProductEditor$photoAddInputId),
            $rtfeldman$elm_css$Html$Styled$Attributes$type_('file'),
            $rtfeldman$elm_css$Html$Styled$Attributes$multiple(true),
            $rtfeldman$elm_css$Html$Styled$Attributes$accept('image/*')
        ]), _List_Nil)
    ]));
    var $author$project$Component$ProductEditor$DeleteImage = function(a) {
        return {
            $: 'DeleteImage',
            a: a
        };
    };
    var $author$project$Component$ProductEditor$photoImage = function(dataUrl) {
        return {
            _delete: $elm$core$Maybe$Just($author$project$Component$ProductEditor$DeleteImage),
            url: dataUrl
        };
    };
    var $author$project$Component$ProductEditor$toImageUrlList = function(_v0) {
        var addImages = _v0.addImages;
        var deleteAt = _v0.deleteAt;
        var beforeImageIds = _v0.beforeImageIds;
        return _Utils_ap($elm$core$List$concat(A2($elm$core$List$indexedMap, F2(function(index, image) {
            return A2($elm$core$Set$member, index, deleteAt) ? _List_Nil : _List_fromArray([
                image
            ]);
        }), addImages)), A2($elm$core$List$map, $author$project$Data$ImageId$toUrlString, beforeImageIds));
    };
    var $author$project$Component$ProductEditor$photoCardList = function(rec) {
        return $author$project$Style$cardListContainer(A2($elm$core$List$map, $author$project$Component$ProductEditor$photoImage, $author$project$Component$ProductEditor$toImageUrlList(rec)));
    };
    var $author$project$Component$ProductEditor$InputPrice = function(a) {
        return {
            $: 'InputPrice',
            a: a
        };
    };
    var $rtfeldman$elm_css$Css$baseline = $rtfeldman$elm_css$Css$prop1('baseline');
    var $rtfeldman$elm_css$Html$Styled$Attributes$max = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('max');
    var $rtfeldman$elm_css$Html$Styled$Attributes$min = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('min');
    var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
    var $rtfeldman$elm_css$VirtualDom$Styled$style = F2(function(key, val) {
        return A3($rtfeldman$elm_css$VirtualDom$Styled$Attribute, A2($elm$virtual_dom$VirtualDom$style, key, val), _List_Nil, '');
    });
    var $rtfeldman$elm_css$Html$Styled$Attributes$style = $rtfeldman$elm_css$VirtualDom$Styled$style;
    var $author$project$Component$ProductEditor$priceView = function(priceMaybe) {
        return A3($author$project$Style$formItem, '販売価格', $author$project$Component$ProductEditor$priceEditorId, _List_fromArray([
            A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $rtfeldman$elm_css$Css$displayFlex,
                    $rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$baseline)
                ]))
            ]), _List_fromArray([
                A2($rtfeldman$elm_css$Html$Styled$input, _List_fromArray([
                    $rtfeldman$elm_css$Html$Styled$Attributes$type_('number'),
                    $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                        $rtfeldman$elm_css$Css$fontSize($rtfeldman$elm_css$Css$rem(2)),
                        $rtfeldman$elm_css$Css$flexGrow($rtfeldman$elm_css$Css$int(1)),
                        $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(8)),
                        $rtfeldman$elm_css$Css$textAlign($rtfeldman$elm_css$Css$right),
                        A3($rtfeldman$elm_css$Css$border3, $rtfeldman$elm_css$Css$px(1), $rtfeldman$elm_css$Css$solid, A3($rtfeldman$elm_css$Css$rgb, 204, 204, 204)),
                        $rtfeldman$elm_css$Css$boxSizing($rtfeldman$elm_css$Css$borderBox),
                        $rtfeldman$elm_css$Css$borderRadius($rtfeldman$elm_css$Css$px(8)),
                        A5($rtfeldman$elm_css$Css$boxShadow5, $rtfeldman$elm_css$Css$inset, $rtfeldman$elm_css$Css$zero, $rtfeldman$elm_css$Css$px(1), $rtfeldman$elm_css$Css$px(1), A4($rtfeldman$elm_css$Css$rgba, 0, 0, 0, 0.075)),
                        $rtfeldman$elm_css$Css$Transitions$transition(_List_fromArray([
                            A3($rtfeldman$elm_css$Css$Transitions$borderColor3, 0, 150, $rtfeldman$elm_css$Css$Transitions$easeInOut),
                            A3($rtfeldman$elm_css$Css$Transitions$boxShadow3, 0, 150, $rtfeldman$elm_css$Css$Transitions$easeInOut)
                        ])),
                        $rtfeldman$elm_css$Css$outline($rtfeldman$elm_css$Css$none),
                        $rtfeldman$elm_css$Css$focus(_List_fromArray([
                            A2($rtfeldman$elm_css$Css$property, 'box-shadow', 'inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6)'),
                            A3($rtfeldman$elm_css$Css$border3, $rtfeldman$elm_css$Css$px(1), $rtfeldman$elm_css$Css$solid, A3($rtfeldman$elm_css$Css$rgb, 102, 175, 233))
                        ]))
                    ])),
                    $rtfeldman$elm_css$Html$Styled$Attributes$id($author$project$Component$ProductEditor$priceEditorId),
                    $rtfeldman$elm_css$Html$Styled$Attributes$placeholder('0 ～ 1000000'),
                    $rtfeldman$elm_css$Html$Styled$Attributes$min('0'),
                    $rtfeldman$elm_css$Html$Styled$Attributes$max('1000000'),
                    $rtfeldman$elm_css$Html$Styled$Events$onInput($author$project$Component$ProductEditor$InputPrice)
                ]), _List_Nil),
                A2($rtfeldman$elm_css$Html$Styled$span, _List_fromArray([
                    A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'font-size', '1.5rem')
                ]), _List_fromArray([
                    $rtfeldman$elm_css$Html$Styled$text('円')
                ]))
            ])),
            A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $rtfeldman$elm_css$Css$textAlign($rtfeldman$elm_css$Css$right)
                ]))
            ]), _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text(function() {
                    if (priceMaybe.$ === 'Just') {
                        var price = priceMaybe.a;
                        return $author$project$Data$Product$priceToString(price);
                    } else return '0 ～ 100万円の価格を入力してください';
                }())
            ]))
        ]));
    };
    var $author$project$Component$Category$SelectCategory = function(a) {
        return {
            $: 'SelectCategory',
            a: a
        };
    };
    var $author$project$Component$Category$categoryView = F2(function(group, _v0) {
        return _Utils_Tuple2('selectCategory' + $author$project$Data$Category$groupToIdString(group), A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Component$Category$SelectCategory, A3($author$project$Style$formItem, 'カテゴリ', $author$project$Component$Category$categorySelectId, _List_fromArray([
            A3($author$project$Style$selectMenu, false, $author$project$Component$Category$categorySelectId, A2($elm$core$List$map, $author$project$Data$Category$partToJapaneseString, $author$project$Data$Category$groupToCategoryList(group)))
        ]))));
    });
    var $author$project$Component$Category$categoryViewDisable = _Utils_Tuple2('selectCategoryDisable', A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Component$Category$SelectCategory, A3($author$project$Style$formItem, 'カテゴリ', $author$project$Component$Category$categorySelectId, _List_fromArray([
        A3($author$project$Style$selectMenu, true, $author$project$Component$Category$categorySelectId, _List_Nil)
    ]))));
    var $author$project$Component$Category$SelectCategoryGroup = function(a) {
        return {
            $: 'SelectCategoryGroup',
            a: a
        };
    };
    var $author$project$Component$Category$groupView = function(_v0) {
        return _Utils_Tuple2('selectCategoryGroup', A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Component$Category$SelectCategoryGroup, A3($author$project$Style$formItem, 'カテゴリ グループ', $author$project$Component$Category$groupSelectId, _List_fromArray([
            A3($author$project$Style$selectMenu, false, $author$project$Component$Category$groupSelectId, A2($elm$core$List$map, $author$project$Data$Category$groupToJapaneseString, $author$project$Data$Category$groupAll))
        ]))));
    };
    var $author$project$Component$Category$view = function(_v0) {
        var select = _v0.a;
        return A3($rtfeldman$elm_css$Html$Styled$Keyed$node, 'div', _List_Nil, function() {
            switch(select.$){
                case 'None':
                    return _List_fromArray([
                        $author$project$Component$Category$groupView($elm$core$Maybe$Nothing),
                        $author$project$Component$Category$categoryViewDisable
                    ]);
                case 'GroupSelect':
                    var group = select.a;
                    return _List_fromArray([
                        $author$project$Component$Category$groupView($elm$core$Maybe$Just(group)),
                        A2($author$project$Component$Category$categoryView, group, $elm$core$Maybe$Nothing)
                    ]);
                default:
                    var category = select.a;
                    return _List_fromArray([
                        $author$project$Component$Category$groupView($elm$core$Maybe$Just($author$project$Data$Category$groupFromCategory(category))),
                        A2($author$project$Component$Category$categoryView, $author$project$Data$Category$groupFromCategory(category), $elm$core$Maybe$Just(category))
                    ]);
            }
        }());
    };
    var $author$project$Component$ProductEditor$view = function(_v0) {
        var rec = _v0.a;
        return _Utils_ap(4 <= $author$project$Component$ProductEditor$imageCount({
            addImagesLength: $elm$core$List$length(rec.addImages),
            beforeImageIdsLength: $elm$core$List$length(rec.beforeImageIds),
            deleteIndexSize: $elm$core$Set$size(rec.deleteImagesAt)
        }) ? _List_Nil : _List_fromArray([
            _Utils_Tuple2('photoAdd', $author$project$Component$ProductEditor$photoAdd)
        ]), _List_fromArray([
            _Utils_Tuple2('photoCardList', $author$project$Component$ProductEditor$photoCardList({
                addImages: rec.addImages,
                beforeImageIds: rec.beforeImageIds,
                deleteAt: rec.deleteImagesAt
            })),
            _Utils_Tuple2('name', $author$project$Component$ProductEditor$nameView(rec.name)),
            _Utils_Tuple2('description', $author$project$Component$ProductEditor$descriptionView),
            _Utils_Tuple2('price', $author$project$Component$ProductEditor$priceView(rec.price)),
            _Utils_Tuple2('condition', $author$project$Component$ProductEditor$conditionView(rec.condition)),
            _Utils_Tuple2('category', A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Component$ProductEditor$MsgByCategory, $author$project$Component$Category$view(rec.category)))
        ]));
    };
    var $author$project$Page$Exhibition$editView = function(productEditorModel) {
        return _Utils_Tuple2('商品の情報を入力', _Utils_ap(A2($elm$core$List$map, $elm$core$Tuple$mapSecond($rtfeldman$elm_css$Html$Styled$map($author$project$Page$Exhibition$MsgByProductEditor)), $author$project$Component$ProductEditor$view(productEditorModel)), _List_fromArray([
            _Utils_Tuple2('conform', $author$project$Page$Exhibition$toConformPageButton(!_Utils_eq($author$project$Component$ProductEditor$toSoldRequest(productEditorModel), $elm$core$Maybe$Nothing)))
        ])));
    };
    var $author$project$Page$Exhibition$LogInOrSignUpMsg = function(a) {
        return {
            $: 'LogInOrSignUpMsg',
            a: a
        };
    };
    var $author$project$Page$Exhibition$logInStateNoneView = function(model) {
        return _Utils_Tuple2('出品画面', _List_fromArray([
            _Utils_Tuple2('logIn', A2($rtfeldman$elm_css$Html$Styled$div, _List_Nil, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text('ログインして商品を出品しよう')
            ]))),
            _Utils_Tuple2('logInComp', A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Page$Exhibition$LogInOrSignUpMsg, $author$project$Component$LogIn$view(model)))
        ]));
    };
    var $author$project$Page$Exhibition$view = F2(function(logInState, _v0) {
        var page = _v0.a.page;
        var logInOrSignUpModel = _v0.a.logInOrSignUpModel;
        var _v1 = function() {
            var _v2 = $author$project$Data$LogInState$getToken(logInState);
            if (_v2.$ === 'Just') {
                var accessToken = _v2.a;
                if (page.$ === 'EditPage') {
                    var editModel = page.a;
                    return $author$project$Page$Exhibition$editView(editModel);
                } else {
                    var request = page.a.request;
                    var sending = page.a.sending;
                    return A3($author$project$Page$Exhibition$confirmView, accessToken, request, sending);
                }
            } else return $author$project$Page$Exhibition$logInStateNoneView(logInOrSignUpModel);
        }();
        var tabText = _v1.a;
        var body = _v1.b;
        return {
            bottomNavigation: $elm$core$Maybe$Nothing,
            tab: $author$project$BasicParts$tabSingle(tabText),
            title: $elm$core$Maybe$Just('出品'),
            view: $author$project$Style$mainView(_List_fromArray([
                $author$project$Style$containerKeyed(body)
            ]))
        };
    });
    var $author$project$Page$History$MsgByLogIn = function(a) {
        return {
            $: 'MsgByLogIn',
            a: a
        };
    };
    var $author$project$Page$History$view = F3(function(logInState, isWideScreen, _v0) {
        var rec = _v0.a;
        return {
            bottomNavigation: $elm$core$Maybe$Nothing,
            tab: $author$project$BasicParts$tabSingle('閲覧履歴'),
            title: $elm$core$Maybe$Just('いいね・閲覧した商品'),
            view: $author$project$Style$mainView(function() {
                if (logInState.$ === 'None') return _List_fromArray([
                    $author$project$Style$container(_List_fromArray([
                        $rtfeldman$elm_css$Html$Styled$text('ログインか新規登録をして、いいねと閲覧履歴を使えるようにしよう!'),
                        A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Page$History$MsgByLogIn, $author$project$Component$LogIn$view(rec.logIn))
                    ]))
                ]);
                else return _List_fromArray([
                    A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Page$History$MsgByProductList, A4($author$project$Component$ProductList$view, rec.productList, logInState, isWideScreen, function() {
                        var _v2 = rec.normal;
                        switch(_v2.$){
                            case 'Loading':
                                return $elm$core$Maybe$Nothing;
                            case 'Normal':
                                var products = _v2.a;
                                return $elm$core$Maybe$Just(products);
                            default:
                                return $elm$core$Maybe$Just(_List_Nil);
                        }
                    }()))
                ]);
            }())
        };
    });
    var $author$project$Page$Home$SelectTab = function(a) {
        return {
            $: 'SelectTab',
            a: a
        };
    };
    var $author$project$Page$Home$TabFree = {
        $: 'TabFree'
    };
    var $author$project$Page$Home$TabRecent = {
        $: 'TabRecent'
    };
    var $author$project$Page$Home$exhibitButton = A2($rtfeldman$elm_css$Html$Styled$a, _List_fromArray([
        $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
            $rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$fixed),
            $rtfeldman$elm_css$Css$bottom($rtfeldman$elm_css$Css$px(80)),
            $rtfeldman$elm_css$Css$right($rtfeldman$elm_css$Css$px(16)),
            $rtfeldman$elm_css$Css$borderRadius($rtfeldman$elm_css$Css$pct(50)),
            $rtfeldman$elm_css$Css$backgroundColor(A3($rtfeldman$elm_css$Css$rgb, 255, 165, 0)),
            $rtfeldman$elm_css$Css$color(A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0)),
            $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$px(96)),
            $rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$px(96)),
            $author$project$Style$normalShadow,
            $rtfeldman$elm_css$Css$textDecoration($rtfeldman$elm_css$Css$none),
            $rtfeldman$elm_css$Css$displayFlex,
            $rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$center),
            $rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$center),
            $rtfeldman$elm_css$Css$hover(_List_fromArray([
                $rtfeldman$elm_css$Css$backgroundColor(A3($rtfeldman$elm_css$Css$rgb, 200, 145, 0))
            ]))
        ])),
        $rtfeldman$elm_css$Html$Styled$Attributes$href($author$project$PageLocation$toUrlAsString($author$project$PageLocation$Exhibition))
    ]), _List_fromArray([
        $rtfeldman$elm_css$Html$Styled$text('出品')
    ]));
    var $author$project$Data$Product$getCreatedAt = function(_v0) {
        var createdAt = _v0.a.createdAt;
        return createdAt;
    };
    var $elm$time$Time$posixToMillis = function(_v0) {
        var millis = _v0.a;
        return millis;
    };
    var $elm$core$List$sortBy = _List_sortBy;
    var $author$project$Page$Home$filterOrSortBySelectedTab = F2(function(tabSelect, allProducts) {
        switch(tabSelect.$){
            case 'TabRecent':
                return $elm$core$List$reverse(A2($elm$core$List$sortBy, A2($elm$core$Basics$composeR, $author$project$Data$Product$getCreatedAt, $elm$time$Time$posixToMillis), allProducts));
            case 'TabRecommend':
                return $elm$core$List$reverse(A2($elm$core$List$sortBy, $author$project$Data$Product$getLikedCount, allProducts));
            default:
                return A2($elm$core$List$filter, function(p) {
                    return !$author$project$Data$Product$getPrice(p);
                }, allProducts);
        }
    });
    var $author$project$BasicParts$tabMulti = function(_v0) {
        var textAndMsgList = _v0.textAndMsgList;
        var selectIndex = _v0.selectIndex;
        return A2($author$project$BasicParts$Multi, textAndMsgList, selectIndex);
    };
    var $author$project$Page$Home$view = F4(function(logInState, isWideScreen, allProducts, _v0) {
        var rec = _v0.a;
        return {
            bottomNavigation: $elm$core$Maybe$Just($author$project$BasicParts$Home),
            tab: $author$project$BasicParts$tabMulti({
                selectIndex: function() {
                    var _v1 = rec.tabSelect;
                    switch(_v1.$){
                        case 'TabRecent':
                            return 0;
                        case 'TabRecommend':
                            return 1;
                        default:
                            return 2;
                    }
                }(),
                textAndMsgList: _List_fromArray([
                    _Utils_Tuple2('新着', $author$project$Page$Home$SelectTab($author$project$Page$Home$TabRecent)),
                    _Utils_Tuple2('おすすめ', $author$project$Page$Home$SelectTab($author$project$Page$Home$TabRecommend)),
                    _Utils_Tuple2('0円', $author$project$Page$Home$SelectTab($author$project$Page$Home$TabFree))
                ])
            }),
            title: $elm$core$Maybe$Nothing,
            view: $author$project$Style$mainView(A2($elm$core$List$cons, A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Page$Home$MsgByProductList, A4($author$project$Component$ProductList$view, rec.productListModel, logInState, isWideScreen, A2($elm$core$Maybe$map, $author$project$Page$Home$filterOrSortBySelectedTab(rec.tabSelect), allProducts))), function() {
                var _v2 = $author$project$Data$LogInState$getToken(logInState);
                if (_v2.$ === 'Just') return _List_fromArray([
                    $author$project$Page$Home$exhibitButton
                ]);
                else return _List_Nil;
            }()))
        };
    });
    var $author$project$Page$LikedProducts$MsgByLogIn = function(a) {
        return {
            $: 'MsgByLogIn',
            a: a
        };
    };
    var $author$project$Page$LikedProducts$view = F3(function(logInState, isWideScreen, _v0) {
        var rec = _v0.a;
        return {
            bottomNavigation: $elm$core$Maybe$Nothing,
            tab: $author$project$BasicParts$tabSingle('いいねした商品'),
            title: $elm$core$Maybe$Just('いいねした商品'),
            view: $author$project$Style$mainView(function() {
                if (logInState.$ === 'None') return _List_fromArray([
                    $author$project$Style$container(_List_fromArray([
                        $rtfeldman$elm_css$Html$Styled$text('ログインか新規登録をして、いいねと閲覧履歴を使えるようにしよう!'),
                        A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Page$LikedProducts$MsgByLogIn, $author$project$Component$LogIn$view(rec.logIn))
                    ]))
                ]);
                else return _List_fromArray([
                    A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Page$LikedProducts$MsgByProductList, A4($author$project$Component$ProductList$view, rec.productList, logInState, isWideScreen, function() {
                        var _v2 = rec.normal;
                        switch(_v2.$){
                            case 'Loading':
                                return $elm$core$Maybe$Nothing;
                            case 'Normal':
                                var products = _v2.a;
                                return $elm$core$Maybe$Just(products);
                            default:
                                return $elm$core$Maybe$Just(_List_Nil);
                        }
                    }()))
                ]);
            }())
        };
    });
    var $author$project$Page$LogIn$Msg = function(a) {
        return {
            $: 'Msg',
            a: a
        };
    };
    var $author$project$Page$LogIn$view = function(_v0) {
        var logInOrSignUpModel = _v0.a;
        return {
            bottomNavigation: $elm$core$Maybe$Just($author$project$BasicParts$User),
            tab: $author$project$BasicParts$tabSingle('ログイン'),
            title: $elm$core$Maybe$Just('ログイン'),
            view: $author$project$Style$mainView(_List_fromArray([
                $author$project$Style$container(_List_fromArray([
                    A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Page$LogIn$Msg, $author$project$Component$LogIn$view(logInOrSignUpModel))
                ]))
            ]))
        };
    };
    var $author$project$Page$Notification$view = function(model) {
        return {
            bottomNavigation: $elm$core$Maybe$Just($author$project$BasicParts$Notification),
            tab: $author$project$BasicParts$tabSingle('通知'),
            title: $elm$core$Maybe$Just('通知'),
            view: $author$project$Style$mainView(_List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text('通知は、作り途中♪♪♪♪')
            ]))
        };
    };
    var $author$project$Page$Product$conditionView = function(condition) {
        return A2($author$project$Style$titleAndContent, '商品の状態', A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $rtfeldman$elm_css$Css$fontSize($rtfeldman$elm_css$Css$rem(1.5))
            ]))
        ]), _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$text($author$project$Data$Product$conditionToJapaneseString(condition))
        ])));
    };
    var $author$project$Page$Product$descriptionView = function(description) {
        return A2($author$project$Style$titleAndContent, '商品の説明', $rtfeldman$elm_css$Html$Styled$text(description));
    };
    var $author$project$Page$Product$MsgBackToViewMode = {
        $: 'MsgBackToViewMode'
    };
    var $author$project$Page$Product$UpdateProductData = F3(function(a, b, c) {
        return {
            $: 'UpdateProductData',
            a: a,
            b: b,
            c: c
        };
    });
    var $author$project$Style$buttonStyle = $rtfeldman$elm_css$Css$batch(_List_fromArray([
        $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(16)),
        $rtfeldman$elm_css$Css$fontSize($rtfeldman$elm_css$Css$rem(1.5)),
        $rtfeldman$elm_css$Css$borderRadius($rtfeldman$elm_css$Css$px(8)),
        A4($rtfeldman$elm_css$Css$boxShadow4, $rtfeldman$elm_css$Css$zero, $rtfeldman$elm_css$Css$px(2), $rtfeldman$elm_css$Css$px(4), A4($rtfeldman$elm_css$Css$rgba, 0, 0, 0, 0.18)),
        $author$project$Style$userSelectNone,
        $rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$pointer)
    ]));
    var $author$project$Style$cancelButton = F2(function(text, msg) {
        return A2($rtfeldman$elm_css$Html$Styled$button, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Events$onClick(msg),
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $author$project$Style$buttonStyle,
                $rtfeldman$elm_css$Css$displayFlex,
                $rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$center),
                $rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$center),
                $rtfeldman$elm_css$Css$flexGrow($rtfeldman$elm_css$Css$int(1)),
                $rtfeldman$elm_css$Css$backgroundColor(A3($rtfeldman$elm_css$Css$rgb, 153, 153, 153)),
                $rtfeldman$elm_css$Css$color(A3($rtfeldman$elm_css$Css$rgb, 17, 17, 17)),
                $rtfeldman$elm_css$Css$fill(A3($rtfeldman$elm_css$Css$rgb, 17, 17, 17)),
                $rtfeldman$elm_css$Css$hover(_List_fromArray([
                    $rtfeldman$elm_css$Css$backgroundColor(A3($rtfeldman$elm_css$Css$rgb, 187, 187, 187))
                ]))
            ]))
        ]), _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$text(text)
        ]));
    });
    var $rtfeldman$elm_css$Css$disabled = $rtfeldman$elm_css$Css$pseudoClass('disabled');
    var $author$project$Style$okButton = F2(function(text, msgMaybe) {
        return A2($rtfeldman$elm_css$Html$Styled$button, _List_fromArray([
            function() {
                if (msgMaybe.$ === 'Just') {
                    var msg = msgMaybe.a;
                    return $rtfeldman$elm_css$Html$Styled$Events$onClick(msg);
                } else return $rtfeldman$elm_css$Html$Styled$Attributes$disabled(true);
            }(),
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $author$project$Style$buttonStyle,
                $rtfeldman$elm_css$Css$displayFlex,
                $rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$center),
                $rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$center),
                $rtfeldman$elm_css$Css$flexGrow($rtfeldman$elm_css$Css$int(1)),
                $rtfeldman$elm_css$Css$backgroundColor($author$project$Style$primaryColor),
                $rtfeldman$elm_css$Css$color(A3($rtfeldman$elm_css$Css$rgb, 221, 221, 221)),
                $rtfeldman$elm_css$Css$fill(A3($rtfeldman$elm_css$Css$rgb, 221, 221, 221)),
                $rtfeldman$elm_css$Css$hover(_List_fromArray([
                    $rtfeldman$elm_css$Css$backgroundColor($author$project$Style$primaryColorLight),
                    $rtfeldman$elm_css$Css$color(A3($rtfeldman$elm_css$Css$rgb, 17, 17, 17)),
                    $rtfeldman$elm_css$Css$fill(A3($rtfeldman$elm_css$Css$rgb, 17, 17, 17))
                ])),
                $rtfeldman$elm_css$Css$disabled(_List_fromArray([
                    $rtfeldman$elm_css$Css$backgroundColor(A3($rtfeldman$elm_css$Css$rgb, 170, 170, 170)),
                    $rtfeldman$elm_css$Css$color(A3($rtfeldman$elm_css$Css$rgb, 221, 221, 221)),
                    $rtfeldman$elm_css$Css$fill(A3($rtfeldman$elm_css$Css$rgb, 221, 221, 221)),
                    $rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$notAllowed)
                ]))
            ]))
        ]), _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$text(text)
        ]));
    });
    var $author$project$Style$okAndCancelButton = F2(function(cancel, ok) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $author$project$Style$displayGridAndGap(8),
                $author$project$Style$gridTemplateColumns('1fr 1fr')
            ]))
        ]), _List_fromArray([
            A2($author$project$Style$cancelButton, cancel.text, cancel.msg),
            A2($author$project$Style$okButton, ok.text, ok.msg)
        ]));
    });
    var $author$project$Page$Product$editOkCancelButton = F4(function(token, productId, sending, requestDataMaybe) {
        return sending ? A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $author$project$Style$buttonStyle,
                $rtfeldman$elm_css$Css$backgroundColor(A3($rtfeldman$elm_css$Css$rgb, 153, 153, 153)),
                $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$pct(100)),
                $rtfeldman$elm_css$Css$fill(A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0)),
                $rtfeldman$elm_css$Css$displayFlex,
                $rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$center)
            ]))
        ]), _List_fromArray([
            $author$project$Icon$loading({
                color: A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0),
                size: 32
            })
        ])) : A2($author$project$Style$okAndCancelButton, {
            msg: $author$project$Page$Product$MsgBackToViewMode,
            text: 'キャンセル'
        }, {
            msg: A2($elm$core$Maybe$map, A2($author$project$Page$Product$UpdateProductData, token, productId), requestDataMaybe),
            text: '変更する'
        });
    });
    var $author$project$Data$Product$getImageUrls = A2($elm$core$Basics$composeR, $author$project$Data$Product$getImageIds, $elm$core$List$map($author$project$Data$ImageId$toUrlString));
    var $author$project$Page$Product$categoryView = function(category) {
        return A2($author$project$Style$titleAndContent, 'カテゴリー', $rtfeldman$elm_css$Html$Styled$text($author$project$Data$Category$toJapaneseString(category)));
    };
    var $author$project$Data$Product$commentGetBody = function(_v0) {
        var body = _v0.a.body;
        return body;
    };
    var $author$project$Data$Product$commentGetCreatedAt = function(_v0) {
        var createdAt = _v0.a.createdAt;
        return createdAt;
    };
    var $author$project$Data$Product$commentGetSpeaker = function(_v0) {
        var speaker = _v0.a.speaker;
        return speaker;
    };
    var $author$project$Page$Product$InputComment = function(a) {
        return {
            $: 'InputComment',
            a: a
        };
    };
    var $author$project$Page$Product$SendComment = function(a) {
        return {
            $: 'SendComment',
            a: a
        };
    };
    var $author$project$Component$Comment$commentSendButtonStyle = $rtfeldman$elm_css$Css$batch(_List_fromArray([
        A2($rtfeldman$elm_css$Css$padding2, $rtfeldman$elm_css$Css$px(16), $rtfeldman$elm_css$Css$px(32)),
        $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$pct(100)),
        $rtfeldman$elm_css$Css$borderRadius($rtfeldman$elm_css$Css$px(8))
    ]));
    var $author$project$Page$Product$commentInputArea = F3(function(commentText, sending, token) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_Nil, A2($elm$core$List$cons, A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Page$Product$InputComment, $author$project$Style$inputMutilineText($author$project$Page$Product$commentTextAreaId)), sending ? _List_fromArray([
            A2($rtfeldman$elm_css$Html$Styled$button, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $author$project$Component$Comment$commentSendButtonStyle
                ])),
                $rtfeldman$elm_css$Html$Styled$Attributes$disabled(true)
            ]), _List_fromArray([
                $author$project$Icon$loading({
                    color: A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0),
                    size: 24
                })
            ]))
        ]) : $elm$core$String$isEmpty($elm$core$String$trim(commentText)) ? _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$text('コメントには1文字以上必要です'),
            A2($rtfeldman$elm_css$Html$Styled$button, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$disabled(true),
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $author$project$Component$Comment$commentSendButtonStyle
                ]))
            ]), _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text('コメントを送信')
            ]))
        ]) : _List_fromArray([
            A2($rtfeldman$elm_css$Html$Styled$button, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Events$onClick($author$project$Page$Product$SendComment(token)),
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $author$project$Component$Comment$commentSendButtonStyle
                ]))
            ]), _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text('コメントを送信')
            ]))
        ])));
    });
    var $author$project$Data$LogInState$getMyUserId = function(logInState) {
        switch(logInState.$){
            case 'None':
                return $elm$core$Maybe$Nothing;
            case 'LoadingProfile':
                return $elm$core$Maybe$Nothing;
            default:
                var userWithName = logInState.a.userWithName;
                return $elm$core$Maybe$Just($author$project$Data$User$withNameGetId(userWithName));
        }
    };
    var $rtfeldman$elm_css$Css$paddingBottom = $rtfeldman$elm_css$Css$prop1('padding-bottom');
    var $rtfeldman$elm_css$Css$borderRadius4 = $rtfeldman$elm_css$Css$prop4('border-radius');
    var $rtfeldman$elm_css$Svg$Styled$Attributes$points = $rtfeldman$elm_css$VirtualDom$Styled$attribute('points');
    var $rtfeldman$elm_css$Svg$Styled$polygon = $rtfeldman$elm_css$Svg$Styled$node('polygon');
    var $author$project$Component$Comment$mineColor = A3($rtfeldman$elm_css$Css$rgb, 200, 162, 219);
    var $author$project$Component$Comment$triangleStyle = function(isMine) {
        return $rtfeldman$elm_css$Css$batch(_List_fromArray([
            $rtfeldman$elm_css$Css$fill(isMine ? $author$project$Component$Comment$mineColor : A3($rtfeldman$elm_css$Css$rgb, 221, 221, 221)),
            $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$px(16)),
            $rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$px(16))
        ]));
    };
    var $author$project$Component$Comment$commentTriangleLeft = function(isMine) {
        return A2($rtfeldman$elm_css$Svg$Styled$svg, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 10 10'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$css(_List_fromArray([
                $author$project$Component$Comment$triangleStyle(isMine)
            ]))
        ]), _List_fromArray([
            A2($rtfeldman$elm_css$Svg$Styled$polygon, _List_fromArray([
                $rtfeldman$elm_css$Svg$Styled$Attributes$points('10 0 0 0 10 10')
            ]), _List_Nil)
        ]));
    };
    var $author$project$Component$Comment$commentTriangleRight = function(isMine) {
        return A2($rtfeldman$elm_css$Svg$Styled$svg, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 10 10'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$css(_List_fromArray([
                $author$project$Component$Comment$triangleStyle(isMine)
            ]))
        ]), _List_fromArray([
            A2($rtfeldman$elm_css$Svg$Styled$polygon, _List_fromArray([
                $rtfeldman$elm_css$Svg$Styled$Attributes$points('0 0 10 0 0 10')
            ]), _List_Nil)
        ]));
    };
    var $rtfeldman$elm_css$Css$flexEnd = $rtfeldman$elm_css$Css$prop1('flex-end');
    var $rtfeldman$elm_css$Css$flexStart = $rtfeldman$elm_css$Css$prop1('flex-start');
    var $justinmimbs$time_extra$Time$Extra$Day = {
        $: 'Day'
    };
    var $justinmimbs$time_extra$Time$Extra$Hour = {
        $: 'Hour'
    };
    var $justinmimbs$time_extra$Time$Extra$Minute = {
        $: 'Minute'
    };
    var $justinmimbs$time_extra$Time$Extra$Month = {
        $: 'Month'
    };
    var $justinmimbs$time_extra$Time$Extra$Second = {
        $: 'Second'
    };
    var $justinmimbs$time_extra$Time$Extra$Millisecond = {
        $: 'Millisecond'
    };
    var $justinmimbs$time_extra$Time$Extra$Week = {
        $: 'Week'
    };
    var $justinmimbs$date$Date$Day = {
        $: 'Day'
    };
    var $justinmimbs$date$Date$Friday = {
        $: 'Friday'
    };
    var $justinmimbs$date$Date$Monday = {
        $: 'Monday'
    };
    var $justinmimbs$date$Date$Month = {
        $: 'Month'
    };
    var $justinmimbs$date$Date$Quarter = {
        $: 'Quarter'
    };
    var $justinmimbs$date$Date$Saturday = {
        $: 'Saturday'
    };
    var $justinmimbs$date$Date$Sunday = {
        $: 'Sunday'
    };
    var $justinmimbs$date$Date$Thursday = {
        $: 'Thursday'
    };
    var $justinmimbs$date$Date$Tuesday = {
        $: 'Tuesday'
    };
    var $justinmimbs$date$Date$Wednesday = {
        $: 'Wednesday'
    };
    var $justinmimbs$date$Date$Week = {
        $: 'Week'
    };
    var $justinmimbs$date$Date$Year = {
        $: 'Year'
    };
    var $elm$time$Time$Fri = {
        $: 'Fri'
    };
    var $elm$time$Time$Mon = {
        $: 'Mon'
    };
    var $justinmimbs$date$Date$RD = function(a) {
        return {
            $: 'RD',
            a: a
        };
    };
    var $elm$time$Time$Sat = {
        $: 'Sat'
    };
    var $elm$time$Time$Sun = {
        $: 'Sun'
    };
    var $elm$time$Time$Thu = {
        $: 'Thu'
    };
    var $elm$time$Time$Tue = {
        $: 'Tue'
    };
    var $elm$time$Time$Wed = {
        $: 'Wed'
    };
    var $justinmimbs$date$Date$weekdayNumber = function(_v0) {
        var rd = _v0.a;
        var _v1 = A2($elm$core$Basics$modBy, 7, rd);
        if (!_v1) return 7;
        else {
            var n = _v1;
            return n;
        }
    };
    var $justinmimbs$date$Date$weekdayToNumber = function(wd) {
        switch(wd.$){
            case 'Mon':
                return 1;
            case 'Tue':
                return 2;
            case 'Wed':
                return 3;
            case 'Thu':
                return 4;
            case 'Fri':
                return 5;
            case 'Sat':
                return 6;
            default:
                return 7;
        }
    };
    var $justinmimbs$date$Date$daysSincePreviousWeekday = F2(function(wd, date) {
        return A2($elm$core$Basics$modBy, 7, $justinmimbs$date$Date$weekdayNumber(date) + 7 - $justinmimbs$date$Date$weekdayToNumber(wd));
    });
    var $justinmimbs$date$Date$isLeapYear = function(y) {
        return !A2($elm$core$Basics$modBy, 4, y) && !!A2($elm$core$Basics$modBy, 100, y) || !A2($elm$core$Basics$modBy, 400, y);
    };
    var $justinmimbs$date$Date$daysBeforeMonth = F2(function(y, m) {
        var leapDays = $justinmimbs$date$Date$isLeapYear(y) ? 1 : 0;
        switch(m.$){
            case 'Jan':
                return 0;
            case 'Feb':
                return 31;
            case 'Mar':
                return 59 + leapDays;
            case 'Apr':
                return 90 + leapDays;
            case 'May':
                return 120 + leapDays;
            case 'Jun':
                return 151 + leapDays;
            case 'Jul':
                return 181 + leapDays;
            case 'Aug':
                return 212 + leapDays;
            case 'Sep':
                return 243 + leapDays;
            case 'Oct':
                return 273 + leapDays;
            case 'Nov':
                return 304 + leapDays;
            default:
                return 334 + leapDays;
        }
    });
    var $justinmimbs$date$Date$floorDiv = F2(function(a, b) {
        return $elm$core$Basics$floor(a / b);
    });
    var $justinmimbs$date$Date$daysBeforeYear = function(y1) {
        var y = y1 - 1;
        var leapYears = A2($justinmimbs$date$Date$floorDiv, y, 4) - A2($justinmimbs$date$Date$floorDiv, y, 100) + A2($justinmimbs$date$Date$floorDiv, y, 400);
        return 365 * y + leapYears;
    };
    var $justinmimbs$date$Date$firstOfMonth = F2(function(y, m) {
        return $justinmimbs$date$Date$RD($justinmimbs$date$Date$daysBeforeYear(y) + A2($justinmimbs$date$Date$daysBeforeMonth, y, m) + 1);
    });
    var $justinmimbs$date$Date$firstOfYear = function(y) {
        return $justinmimbs$date$Date$RD($justinmimbs$date$Date$daysBeforeYear(y) + 1);
    };
    var $elm$time$Time$Jan = {
        $: 'Jan'
    };
    var $justinmimbs$date$Date$daysInMonth = F2(function(y, m) {
        switch(m.$){
            case 'Jan':
                return 31;
            case 'Feb':
                return $justinmimbs$date$Date$isLeapYear(y) ? 29 : 28;
            case 'Mar':
                return 31;
            case 'Apr':
                return 30;
            case 'May':
                return 31;
            case 'Jun':
                return 30;
            case 'Jul':
                return 31;
            case 'Aug':
                return 31;
            case 'Sep':
                return 30;
            case 'Oct':
                return 31;
            case 'Nov':
                return 30;
            default:
                return 31;
        }
    });
    var $justinmimbs$date$Date$monthToNumber = function(m) {
        switch(m.$){
            case 'Jan':
                return 1;
            case 'Feb':
                return 2;
            case 'Mar':
                return 3;
            case 'Apr':
                return 4;
            case 'May':
                return 5;
            case 'Jun':
                return 6;
            case 'Jul':
                return 7;
            case 'Aug':
                return 8;
            case 'Sep':
                return 9;
            case 'Oct':
                return 10;
            case 'Nov':
                return 11;
            default:
                return 12;
        }
    };
    var $elm$time$Time$Apr = {
        $: 'Apr'
    };
    var $elm$time$Time$Aug = {
        $: 'Aug'
    };
    var $elm$time$Time$Dec = {
        $: 'Dec'
    };
    var $elm$time$Time$Feb = {
        $: 'Feb'
    };
    var $elm$time$Time$Jul = {
        $: 'Jul'
    };
    var $elm$time$Time$Jun = {
        $: 'Jun'
    };
    var $elm$time$Time$Mar = {
        $: 'Mar'
    };
    var $elm$time$Time$May = {
        $: 'May'
    };
    var $elm$time$Time$Nov = {
        $: 'Nov'
    };
    var $elm$time$Time$Oct = {
        $: 'Oct'
    };
    var $elm$time$Time$Sep = {
        $: 'Sep'
    };
    var $justinmimbs$date$Date$numberToMonth = function(mn) {
        var _v0 = A2($elm$core$Basics$max, 1, mn);
        switch(_v0){
            case 1:
                return $elm$time$Time$Jan;
            case 2:
                return $elm$time$Time$Feb;
            case 3:
                return $elm$time$Time$Mar;
            case 4:
                return $elm$time$Time$Apr;
            case 5:
                return $elm$time$Time$May;
            case 6:
                return $elm$time$Time$Jun;
            case 7:
                return $elm$time$Time$Jul;
            case 8:
                return $elm$time$Time$Aug;
            case 9:
                return $elm$time$Time$Sep;
            case 10:
                return $elm$time$Time$Oct;
            case 11:
                return $elm$time$Time$Nov;
            default:
                return $elm$time$Time$Dec;
        }
    };
    var $justinmimbs$date$Date$toCalendarDateHelp = F3(function(y, m, d) {
        toCalendarDateHelp: while(true){
            var monthDays = A2($justinmimbs$date$Date$daysInMonth, y, m);
            var mn = $justinmimbs$date$Date$monthToNumber(m);
            if (mn < 12 && _Utils_cmp(d, monthDays) > 0) {
                var $temp$y = y, $temp$m = $justinmimbs$date$Date$numberToMonth(mn + 1), $temp$d = d - monthDays;
                y = $temp$y;
                m = $temp$m;
                d = $temp$d;
                continue toCalendarDateHelp;
            } else return {
                day: d,
                month: m,
                year: y
            };
        }
    });
    var $justinmimbs$date$Date$divWithRemainder = F2(function(a, b) {
        return _Utils_Tuple2(A2($justinmimbs$date$Date$floorDiv, a, b), A2($elm$core$Basics$modBy, b, a));
    });
    var $justinmimbs$date$Date$year = function(_v0) {
        var rd = _v0.a;
        var _v1 = A2($justinmimbs$date$Date$divWithRemainder, rd, 146097);
        var n400 = _v1.a;
        var r400 = _v1.b;
        var _v2 = A2($justinmimbs$date$Date$divWithRemainder, r400, 36524);
        var n100 = _v2.a;
        var r100 = _v2.b;
        var _v3 = A2($justinmimbs$date$Date$divWithRemainder, r100, 1461);
        var n4 = _v3.a;
        var r4 = _v3.b;
        var _v4 = A2($justinmimbs$date$Date$divWithRemainder, r4, 365);
        var n1 = _v4.a;
        var r1 = _v4.b;
        var n = !r1 ? 0 : 1;
        return n400 * 400 + n100 * 100 + n4 * 4 + n1 + n;
    };
    var $justinmimbs$date$Date$toOrdinalDate = function(_v0) {
        var rd = _v0.a;
        var y = $justinmimbs$date$Date$year($justinmimbs$date$Date$RD(rd));
        return {
            ordinalDay: rd - $justinmimbs$date$Date$daysBeforeYear(y),
            year: y
        };
    };
    var $justinmimbs$date$Date$toCalendarDate = function(_v0) {
        var rd = _v0.a;
        var date = $justinmimbs$date$Date$toOrdinalDate($justinmimbs$date$Date$RD(rd));
        return A3($justinmimbs$date$Date$toCalendarDateHelp, date.year, $elm$time$Time$Jan, date.ordinalDay);
    };
    var $justinmimbs$date$Date$month = A2($elm$core$Basics$composeR, $justinmimbs$date$Date$toCalendarDate, function($) {
        return $.month;
    });
    var $justinmimbs$date$Date$monthToQuarter = function(m) {
        return ($justinmimbs$date$Date$monthToNumber(m) + 2) / 3 | 0;
    };
    var $justinmimbs$date$Date$quarter = A2($elm$core$Basics$composeR, $justinmimbs$date$Date$month, $justinmimbs$date$Date$monthToQuarter);
    var $justinmimbs$date$Date$quarterToMonth = function(q) {
        return $justinmimbs$date$Date$numberToMonth(q * 3 - 2);
    };
    var $justinmimbs$date$Date$floor = F2(function(interval, date) {
        var rd = date.a;
        switch(interval.$){
            case 'Year':
                return $justinmimbs$date$Date$firstOfYear($justinmimbs$date$Date$year(date));
            case 'Quarter':
                return A2($justinmimbs$date$Date$firstOfMonth, $justinmimbs$date$Date$year(date), $justinmimbs$date$Date$quarterToMonth($justinmimbs$date$Date$quarter(date)));
            case 'Month':
                return A2($justinmimbs$date$Date$firstOfMonth, $justinmimbs$date$Date$year(date), $justinmimbs$date$Date$month(date));
            case 'Week':
                return $justinmimbs$date$Date$RD(rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, $elm$time$Time$Mon, date));
            case 'Monday':
                return $justinmimbs$date$Date$RD(rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, $elm$time$Time$Mon, date));
            case 'Tuesday':
                return $justinmimbs$date$Date$RD(rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, $elm$time$Time$Tue, date));
            case 'Wednesday':
                return $justinmimbs$date$Date$RD(rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, $elm$time$Time$Wed, date));
            case 'Thursday':
                return $justinmimbs$date$Date$RD(rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, $elm$time$Time$Thu, date));
            case 'Friday':
                return $justinmimbs$date$Date$RD(rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, $elm$time$Time$Fri, date));
            case 'Saturday':
                return $justinmimbs$date$Date$RD(rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, $elm$time$Time$Sat, date));
            case 'Sunday':
                return $justinmimbs$date$Date$RD(rd - A2($justinmimbs$date$Date$daysSincePreviousWeekday, $elm$time$Time$Sun, date));
            default:
                return date;
        }
    });
    var $elm$core$Basics$clamp = F3(function(low, high, number) {
        return _Utils_cmp(number, low) < 0 ? low : _Utils_cmp(number, high) > 0 ? high : number;
    });
    var $justinmimbs$date$Date$fromCalendarDate = F3(function(y, m, d) {
        return $justinmimbs$date$Date$RD($justinmimbs$date$Date$daysBeforeYear(y) + A2($justinmimbs$date$Date$daysBeforeMonth, y, m) + A3($elm$core$Basics$clamp, 1, A2($justinmimbs$date$Date$daysInMonth, y, m), d));
    });
    var $elm$time$Time$flooredDiv = F2(function(numerator, denominator) {
        return $elm$core$Basics$floor(numerator / denominator);
    });
    var $elm$time$Time$toAdjustedMinutesHelp = F3(function(defaultOffset, posixMinutes, eras) {
        toAdjustedMinutesHelp: while(true){
            if (!eras.b) return posixMinutes + defaultOffset;
            else {
                var era = eras.a;
                var olderEras = eras.b;
                if (_Utils_cmp(era.start, posixMinutes) < 0) return posixMinutes + era.offset;
                else {
                    var $temp$defaultOffset = defaultOffset, $temp$posixMinutes = posixMinutes, $temp$eras = olderEras;
                    defaultOffset = $temp$defaultOffset;
                    posixMinutes = $temp$posixMinutes;
                    eras = $temp$eras;
                    continue toAdjustedMinutesHelp;
                }
            }
        }
    });
    var $elm$time$Time$toAdjustedMinutes = F2(function(_v0, time) {
        var defaultOffset = _v0.a;
        var eras = _v0.b;
        return A3($elm$time$Time$toAdjustedMinutesHelp, defaultOffset, A2($elm$time$Time$flooredDiv, $elm$time$Time$posixToMillis(time), 60000), eras);
    });
    var $elm$time$Time$toCivil = function(minutes) {
        var rawDay = A2($elm$time$Time$flooredDiv, minutes, 1440) + 719468;
        var era = (rawDay >= 0 ? rawDay : rawDay - 146096) / 146097 | 0;
        var dayOfEra = rawDay - era * 146097;
        var yearOfEra = (dayOfEra - (dayOfEra / 1460 | 0) + (dayOfEra / 36524 | 0) - (dayOfEra / 146096 | 0)) / 365 | 0;
        var dayOfYear = dayOfEra - (365 * yearOfEra + (yearOfEra / 4 | 0) - (yearOfEra / 100 | 0));
        var mp = (5 * dayOfYear + 2) / 153 | 0;
        var month = mp + (mp < 10 ? 3 : -9);
        var year = yearOfEra + era * 400;
        return {
            day: dayOfYear - ((153 * mp + 2) / 5 | 0) + 1,
            month: month,
            year: year + (month <= 2 ? 1 : 0)
        };
    };
    var $elm$time$Time$toDay = F2(function(zone, time) {
        return $elm$time$Time$toCivil(A2($elm$time$Time$toAdjustedMinutes, zone, time)).day;
    });
    var $elm$time$Time$toMonth = F2(function(zone, time) {
        var _v0 = $elm$time$Time$toCivil(A2($elm$time$Time$toAdjustedMinutes, zone, time)).month;
        switch(_v0){
            case 1:
                return $elm$time$Time$Jan;
            case 2:
                return $elm$time$Time$Feb;
            case 3:
                return $elm$time$Time$Mar;
            case 4:
                return $elm$time$Time$Apr;
            case 5:
                return $elm$time$Time$May;
            case 6:
                return $elm$time$Time$Jun;
            case 7:
                return $elm$time$Time$Jul;
            case 8:
                return $elm$time$Time$Aug;
            case 9:
                return $elm$time$Time$Sep;
            case 10:
                return $elm$time$Time$Oct;
            case 11:
                return $elm$time$Time$Nov;
            default:
                return $elm$time$Time$Dec;
        }
    });
    var $elm$time$Time$toYear = F2(function(zone, time) {
        return $elm$time$Time$toCivil(A2($elm$time$Time$toAdjustedMinutes, zone, time)).year;
    });
    var $justinmimbs$date$Date$fromPosix = F2(function(zone, posix) {
        return A3($justinmimbs$date$Date$fromCalendarDate, A2($elm$time$Time$toYear, zone, posix), A2($elm$time$Time$toMonth, zone, posix), A2($elm$time$Time$toDay, zone, posix));
    });
    var $justinmimbs$date$Date$toRataDie = function(_v0) {
        var rd = _v0.a;
        return rd;
    };
    var $justinmimbs$time_extra$Time$Extra$dateToMillis = function(date) {
        var daysSinceEpoch = $justinmimbs$date$Date$toRataDie(date) - 719163;
        return daysSinceEpoch * 86400000;
    };
    var $justinmimbs$time_extra$Time$Extra$timeFromClock = F4(function(hour, minute, second, millisecond) {
        return hour * 3600000 + minute * 60000 + second * 1000 + millisecond;
    });
    var $elm$time$Time$toHour = F2(function(zone, time) {
        return A2($elm$core$Basics$modBy, 24, A2($elm$time$Time$flooredDiv, A2($elm$time$Time$toAdjustedMinutes, zone, time), 60));
    });
    var $elm$time$Time$toMillis = F2(function(_v0, time) {
        return A2($elm$core$Basics$modBy, 1000, $elm$time$Time$posixToMillis(time));
    });
    var $elm$time$Time$toMinute = F2(function(zone, time) {
        return A2($elm$core$Basics$modBy, 60, A2($elm$time$Time$toAdjustedMinutes, zone, time));
    });
    var $elm$time$Time$toSecond = F2(function(_v0, time) {
        return A2($elm$core$Basics$modBy, 60, A2($elm$time$Time$flooredDiv, $elm$time$Time$posixToMillis(time), 1000));
    });
    var $justinmimbs$time_extra$Time$Extra$timeFromPosix = F2(function(zone, posix) {
        return A4($justinmimbs$time_extra$Time$Extra$timeFromClock, A2($elm$time$Time$toHour, zone, posix), A2($elm$time$Time$toMinute, zone, posix), A2($elm$time$Time$toSecond, zone, posix), A2($elm$time$Time$toMillis, zone, posix));
    });
    var $justinmimbs$time_extra$Time$Extra$toOffset = F2(function(zone, posix) {
        var millis = $elm$time$Time$posixToMillis(posix);
        var localMillis = $justinmimbs$time_extra$Time$Extra$dateToMillis(A2($justinmimbs$date$Date$fromPosix, zone, posix)) + A2($justinmimbs$time_extra$Time$Extra$timeFromPosix, zone, posix);
        return (localMillis - millis) / 60000 | 0;
    });
    var $justinmimbs$time_extra$Time$Extra$posixFromDateTime = F3(function(zone, date, time) {
        var millis = $justinmimbs$time_extra$Time$Extra$dateToMillis(date) + time;
        var offset0 = A2($justinmimbs$time_extra$Time$Extra$toOffset, zone, $elm$time$Time$millisToPosix(millis));
        var posix1 = $elm$time$Time$millisToPosix(millis - offset0 * 60000);
        var offset1 = A2($justinmimbs$time_extra$Time$Extra$toOffset, zone, posix1);
        if (_Utils_eq(offset0, offset1)) return posix1;
        else {
            var posix2 = $elm$time$Time$millisToPosix(millis - offset1 * 60000);
            var offset2 = A2($justinmimbs$time_extra$Time$Extra$toOffset, zone, posix2);
            return _Utils_eq(offset1, offset2) ? posix2 : posix1;
        }
    });
    var $justinmimbs$time_extra$Time$Extra$floorDate = F3(function(dateInterval, zone, posix) {
        return A3($justinmimbs$time_extra$Time$Extra$posixFromDateTime, zone, A2($justinmimbs$date$Date$floor, dateInterval, A2($justinmimbs$date$Date$fromPosix, zone, posix)), 0);
    });
    var $justinmimbs$time_extra$Time$Extra$floor = F3(function(interval, zone, posix) {
        switch(interval.$){
            case 'Millisecond':
                return posix;
            case 'Second':
                return A3($justinmimbs$time_extra$Time$Extra$posixFromDateTime, zone, A2($justinmimbs$date$Date$fromPosix, zone, posix), A4($justinmimbs$time_extra$Time$Extra$timeFromClock, A2($elm$time$Time$toHour, zone, posix), A2($elm$time$Time$toMinute, zone, posix), A2($elm$time$Time$toSecond, zone, posix), 0));
            case 'Minute':
                return A3($justinmimbs$time_extra$Time$Extra$posixFromDateTime, zone, A2($justinmimbs$date$Date$fromPosix, zone, posix), A4($justinmimbs$time_extra$Time$Extra$timeFromClock, A2($elm$time$Time$toHour, zone, posix), A2($elm$time$Time$toMinute, zone, posix), 0, 0));
            case 'Hour':
                return A3($justinmimbs$time_extra$Time$Extra$posixFromDateTime, zone, A2($justinmimbs$date$Date$fromPosix, zone, posix), A4($justinmimbs$time_extra$Time$Extra$timeFromClock, A2($elm$time$Time$toHour, zone, posix), 0, 0, 0));
            case 'Day':
                return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Day, zone, posix);
            case 'Month':
                return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Month, zone, posix);
            case 'Year':
                return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Year, zone, posix);
            case 'Quarter':
                return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Quarter, zone, posix);
            case 'Week':
                return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Week, zone, posix);
            case 'Monday':
                return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Monday, zone, posix);
            case 'Tuesday':
                return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Tuesday, zone, posix);
            case 'Wednesday':
                return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Wednesday, zone, posix);
            case 'Thursday':
                return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Thursday, zone, posix);
            case 'Friday':
                return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Friday, zone, posix);
            case 'Saturday':
                return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Saturday, zone, posix);
            default:
                return A3($justinmimbs$time_extra$Time$Extra$floorDate, $justinmimbs$date$Date$Sunday, zone, posix);
        }
    });
    var $justinmimbs$time_extra$Time$Extra$toFractionalDay = F2(function(zone, posix) {
        return A2($justinmimbs$time_extra$Time$Extra$timeFromPosix, zone, posix) / 86400000;
    });
    var $justinmimbs$time_extra$Time$Extra$toMonths = F2(function(zone, posix) {
        var wholeMonths = 12 * (A2($elm$time$Time$toYear, zone, posix) - 1) + ($justinmimbs$date$Date$monthToNumber(A2($elm$time$Time$toMonth, zone, posix)) - 1);
        var fractionalMonth = (A2($elm$time$Time$toDay, zone, posix) + A2($justinmimbs$time_extra$Time$Extra$toFractionalDay, zone, posix)) / 100;
        return wholeMonths + fractionalMonth;
    });
    var $justinmimbs$time_extra$Time$Extra$toRataDieMoment = F2(function(zone, posix) {
        return $justinmimbs$date$Date$toRataDie(A2($justinmimbs$date$Date$fromPosix, zone, posix)) + A2($justinmimbs$time_extra$Time$Extra$toFractionalDay, zone, posix);
    });
    var $elm$core$Basics$truncate = _Basics_truncate;
    var $justinmimbs$time_extra$Time$Extra$diff = F4(function(interval, zone, posix1, posix2) {
        diff: while(true)switch(interval.$){
            case 'Millisecond':
                return $elm$time$Time$posixToMillis(posix2) - $elm$time$Time$posixToMillis(posix1);
            case 'Second':
                return A4($justinmimbs$time_extra$Time$Extra$diff, $justinmimbs$time_extra$Time$Extra$Millisecond, zone, posix1, posix2) / 1000 | 0;
            case 'Minute':
                return A4($justinmimbs$time_extra$Time$Extra$diff, $justinmimbs$time_extra$Time$Extra$Millisecond, zone, posix1, posix2) / 60000 | 0;
            case 'Hour':
                return A4($justinmimbs$time_extra$Time$Extra$diff, $justinmimbs$time_extra$Time$Extra$Millisecond, zone, posix1, posix2) / 3600000 | 0;
            case 'Day':
                return A2($justinmimbs$time_extra$Time$Extra$toRataDieMoment, zone, posix2) - A2($justinmimbs$time_extra$Time$Extra$toRataDieMoment, zone, posix1) | 0;
            case 'Month':
                return A2($justinmimbs$time_extra$Time$Extra$toMonths, zone, posix2) - A2($justinmimbs$time_extra$Time$Extra$toMonths, zone, posix1) | 0;
            case 'Year':
                return A4($justinmimbs$time_extra$Time$Extra$diff, $justinmimbs$time_extra$Time$Extra$Month, zone, posix1, posix2) / 12 | 0;
            case 'Quarter':
                return A4($justinmimbs$time_extra$Time$Extra$diff, $justinmimbs$time_extra$Time$Extra$Month, zone, posix1, posix2) / 3 | 0;
            case 'Week':
                return A4($justinmimbs$time_extra$Time$Extra$diff, $justinmimbs$time_extra$Time$Extra$Day, zone, posix1, posix2) / 7 | 0;
            default:
                var weekday = interval;
                var $temp$interval = $justinmimbs$time_extra$Time$Extra$Week, $temp$zone = zone, $temp$posix1 = A3($justinmimbs$time_extra$Time$Extra$floor, weekday, zone, posix1), $temp$posix2 = A3($justinmimbs$time_extra$Time$Extra$floor, weekday, zone, posix2);
                interval = $temp$interval;
                zone = $temp$zone;
                posix1 = $temp$posix1;
                posix2 = $temp$posix2;
                continue diff;
        }
    });
    var $elm$core$String$concat = function(strings) {
        return A2($elm$core$String$join, '', strings);
    };
    var $author$project$Data$DateTime$monthToString = function(month) {
        switch(month.$){
            case 'Jan':
                return '1';
            case 'Feb':
                return '2';
            case 'Mar':
                return '3';
            case 'Apr':
                return '4';
            case 'May':
                return '5';
            case 'Jun':
                return '6';
            case 'Jul':
                return '7';
            case 'Aug':
                return '8';
            case 'Sep':
                return '9';
            case 'Oct':
                return '10';
            case 'Nov':
                return '11';
            default:
                return '12';
        }
    };
    var $author$project$Data$DateTime$toStringHelper = function(_v0) {
        var year = _v0.year;
        var month = _v0.month;
        var day = _v0.day;
        var hour = _v0.hour;
        var minute = _v0.minute;
        var second = _v0.second;
        return $elm$core$String$concat(_List_fromArray([
            A3($elm$core$String$padLeft, 4, _Utils_chr('0'), $elm$core$String$fromInt(year)),
            '/',
            A3($elm$core$String$padLeft, 2, _Utils_chr('0'), $author$project$Data$DateTime$monthToString(month)),
            '/',
            A3($elm$core$String$padLeft, 2, _Utils_chr('0'), $elm$core$String$fromInt(day)),
            ' ',
            A3($elm$core$String$padLeft, 2, _Utils_chr('0'), $elm$core$String$fromInt(hour)),
            ':',
            A3($elm$core$String$padLeft, 2, _Utils_chr('0'), $elm$core$String$fromInt(minute)),
            ':',
            A3($elm$core$String$padLeft, 2, _Utils_chr('0'), $elm$core$String$fromInt(second))
        ]));
    };
    var $author$project$Data$DateTime$toString = F2(function(posix, zone) {
        return $author$project$Data$DateTime$toStringHelper({
            day: A2($elm$time$Time$toDay, zone, posix),
            hour: A2($elm$time$Time$toHour, zone, posix),
            minute: A2($elm$time$Time$toMinute, zone, posix),
            month: A2($elm$time$Time$toMonth, zone, posix),
            second: A2($elm$time$Time$toSecond, zone, posix),
            year: A2($elm$time$Time$toYear, zone, posix)
        });
    });
    var $elm$time$Time$utc = A2($elm$time$Time$Zone, 0, _List_Nil);
    var $author$project$Data$DateTime$toDiffString = F2(function(nowMaybe, createdTime) {
        if (nowMaybe.$ === 'Just') {
            var _v1 = nowMaybe.a;
            var nowPosix = _v1.a;
            var zone = _v1.b;
            if (!A4($justinmimbs$time_extra$Time$Extra$diff, $justinmimbs$time_extra$Time$Extra$Month, zone, createdTime, nowPosix)) {
                var diffSecond = A4($justinmimbs$time_extra$Time$Extra$diff, $justinmimbs$time_extra$Time$Extra$Second, zone, createdTime, nowPosix);
                var diffMinute = A4($justinmimbs$time_extra$Time$Extra$diff, $justinmimbs$time_extra$Time$Extra$Minute, zone, createdTime, nowPosix);
                var diffHour = A4($justinmimbs$time_extra$Time$Extra$diff, $justinmimbs$time_extra$Time$Extra$Hour, zone, createdTime, nowPosix);
                var diffDay = A4($justinmimbs$time_extra$Time$Extra$diff, $justinmimbs$time_extra$Time$Extra$Day, zone, createdTime, nowPosix);
                return !!diffDay ? $elm$core$String$fromInt(diffDay) + '日前' : !!diffHour ? $elm$core$String$fromInt(diffHour) + '時間前' : !!diffMinute ? $elm$core$String$fromInt(diffMinute) + '分前' : $elm$core$String$fromInt(diffSecond) + '秒前';
            } else return A2($author$project$Data$DateTime$toString, createdTime, zone);
        } else return A2($author$project$Data$DateTime$toString, createdTime, $elm$time$Time$utc) + '(UTC)';
    });
    var $author$project$Component$Comment$commentView = F2(function(nowMaybe, comment) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $author$project$Style$displayGridAndGap(0),
                A2($rtfeldman$elm_css$Css$property, 'grid-template-columns', '1fr')
            ]))
        ]), _List_fromArray([
            A2($rtfeldman$elm_css$Html$Styled$a, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $rtfeldman$elm_css$Css$displayFlex,
                    $rtfeldman$elm_css$Css$justifyContent(comment.isSeller ? $rtfeldman$elm_css$Css$flexStart : $rtfeldman$elm_css$Css$flexEnd),
                    $rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$center),
                    $rtfeldman$elm_css$Css$textDecoration($rtfeldman$elm_css$Css$none)
                ])),
                $rtfeldman$elm_css$Html$Styled$Attributes$href($author$project$PageLocation$toUrlAsString($author$project$PageLocation$User($author$project$Data$User$withNameGetId(comment.user))))
            ]), _List_fromArray([
                A2($author$project$Style$userImage, 48, $author$project$Data$User$withNameGetImageId(comment.user)),
                $rtfeldman$elm_css$Html$Styled$text($author$project$Data$User$withNameGetDisplayName(comment.user))
            ])),
            A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $rtfeldman$elm_css$Css$displayFlex,
                    $rtfeldman$elm_css$Css$justifyContent(comment.isSeller ? $rtfeldman$elm_css$Css$flexStart : $rtfeldman$elm_css$Css$flexEnd)
                ]))
            ]), _Utils_ap(comment.isSeller ? _List_fromArray([
                $author$project$Component$Comment$commentTriangleLeft(comment.isMine)
            ]) : _List_Nil, A2($elm$core$List$cons, A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $rtfeldman$elm_css$Css$backgroundColor(comment.isMine ? $author$project$Component$Comment$mineColor : A3($rtfeldman$elm_css$Css$rgb, 221, 221, 221)),
                    $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(8)),
                    comment.isSeller ? A4($rtfeldman$elm_css$Css$borderRadius4, $rtfeldman$elm_css$Css$zero, $rtfeldman$elm_css$Css$px(8), $rtfeldman$elm_css$Css$px(8), $rtfeldman$elm_css$Css$px(8)) : A4($rtfeldman$elm_css$Css$borderRadius4, $rtfeldman$elm_css$Css$px(8), $rtfeldman$elm_css$Css$zero, $rtfeldman$elm_css$Css$px(8), $rtfeldman$elm_css$Css$px(8))
                ]))
            ]), _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text(comment.body)
            ])), comment.isSeller ? _List_Nil : _List_fromArray([
                $author$project$Component$Comment$commentTriangleRight(comment.isMine)
            ])))),
            A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $rtfeldman$elm_css$Css$displayFlex,
                    $rtfeldman$elm_css$Css$fontSize($rtfeldman$elm_css$Css$rem(0.8)),
                    $rtfeldman$elm_css$Css$color(A3($rtfeldman$elm_css$Css$rgb, 102, 102, 102)),
                    $rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$flexEnd)
                ]))
            ]), _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text(A2($author$project$Data$DateTime$toDiffString, nowMaybe, comment.createdAt))
            ]))
        ]));
    });
    var $author$project$Component$Comment$view = F2(function(nowMaybe, commentListMaybe) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $author$project$Style$displayGridAndGap(16)
            ]))
        ]), function() {
            if (commentListMaybe.$ === 'Just') {
                var comments = commentListMaybe.a;
                return A2($elm$core$List$map, $author$project$Component$Comment$commentView(nowMaybe), $elm$core$List$reverse(comments));
            } else return _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text('コメント読み込み中'),
                $author$project$Icon$loading({
                    color: A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0),
                    size: 48
                })
            ]);
        }());
    });
    var $author$project$Page$Product$commentListView = F6(function(commentText, commentSending, nowMaybe, sellerId, logInState, commentListMaybe) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $rtfeldman$elm_css$Css$paddingBottom($rtfeldman$elm_css$Css$px(64))
            ]))
        ]), _Utils_ap(function() {
            var _v0 = $author$project$Data$LogInState$getToken(logInState);
            if (_v0.$ === 'Just') {
                var token = _v0.a;
                return _List_fromArray([
                    A3($author$project$Page$Product$commentInputArea, commentText, commentSending, token)
                ]);
            } else return _List_Nil;
        }(), _List_fromArray([
            A2($author$project$Component$Comment$view, nowMaybe, A2($elm$core$Maybe$map, $elm$core$List$map(function(comment) {
                return {
                    body: $author$project$Data$Product$commentGetBody(comment),
                    createdAt: $author$project$Data$Product$commentGetCreatedAt(comment),
                    isMine: _Utils_eq($elm$core$Maybe$Just($author$project$Data$User$withNameGetId($author$project$Data$Product$commentGetSpeaker(comment))), $author$project$Data$LogInState$getMyUserId(logInState)),
                    isSeller: _Utils_eq($author$project$Data$User$withNameGetId($author$project$Data$Product$commentGetSpeaker(comment)), sellerId),
                    user: $author$project$Data$Product$commentGetSpeaker(comment)
                };
            }), commentListMaybe))
        ])));
    });
    var $author$project$Page$Product$createdAtView = F2(function(nowMaybe, createdAt) {
        return A2($author$project$Style$titleAndContent, '出品日時', $rtfeldman$elm_css$Html$Styled$text(A2($author$project$Data$DateTime$toDiffString, nowMaybe, createdAt)));
    });
    var $author$project$Page$Product$Delete = F2(function(a, b) {
        return {
            $: 'Delete',
            a: a,
            b: b
        };
    });
    var $author$project$Style$alertColorButton = function(msgMaybe) {
        return $rtfeldman$elm_css$Html$Styled$div(_List_fromArray([
            function() {
                if (msgMaybe.$ === 'Just') {
                    var msg = msgMaybe.a;
                    return $rtfeldman$elm_css$Html$Styled$Events$onClick(msg);
                } else return $rtfeldman$elm_css$Html$Styled$Attributes$disabled(true);
            }(),
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $author$project$Style$buttonStyle,
                $rtfeldman$elm_css$Css$backgroundColor(A3($rtfeldman$elm_css$Css$rgb, 189, 46, 46)),
                $rtfeldman$elm_css$Css$color(A3($rtfeldman$elm_css$Css$rgb, 238, 238, 238)),
                $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$pct(100)),
                $rtfeldman$elm_css$Css$displayFlex,
                $rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$center),
                $rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$center),
                $rtfeldman$elm_css$Css$boxSizing($rtfeldman$elm_css$Css$borderBox),
                $rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$pointer),
                A2($rtfeldman$elm_css$Css$border2, $rtfeldman$elm_css$Css$zero, $rtfeldman$elm_css$Css$none),
                $rtfeldman$elm_css$Css$hover(_List_fromArray([
                    $rtfeldman$elm_css$Css$backgroundColor(A3($rtfeldman$elm_css$Css$rgb, 221, 84, 84))
                ]))
            ]))
        ]));
    };
    var $author$project$Icon$deleteGarbageCan = function(style) {
        return A2($rtfeldman$elm_css$Svg$Styled$svg, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 24 24'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$css(_List_fromArray([
                style
            ]))
        ]), _List_fromArray([
            A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
                $rtfeldman$elm_css$Svg$Styled$Attributes$d('M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v10zM18 4h-2.5l-.71-.71c-.18-.18-.44-.29-.7-.29H9.91c-.26 0-.52.11-.7.29L8.5 4H6c-.55 0-1 .45-1 1s.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1z')
            ]), _List_Nil)
        ]));
    };
    var $author$project$Page$Product$deleteView = F2(function(productId, token) {
        return A2($author$project$Style$alertColorButton, $elm$core$Maybe$Just(A2($author$project$Page$Product$Delete, token, productId)), _List_fromArray([
            $author$project$Icon$deleteGarbageCan($rtfeldman$elm_css$Css$batch(_List_fromArray([
                $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$px(32)),
                $rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$px(32)),
                $rtfeldman$elm_css$Css$fill(A3($rtfeldman$elm_css$Css$rgb, 238, 238, 238))
            ]))),
            $rtfeldman$elm_css$Html$Styled$text('削除する')
        ]));
    });
    var $author$project$Page$Product$EditProduct = {
        $: 'EditProduct'
    };
    var $author$project$Icon$edit = function(style) {
        return A2($rtfeldman$elm_css$Svg$Styled$svg, _List_fromArray([
            $rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 24 24'),
            $rtfeldman$elm_css$Svg$Styled$Attributes$css(_List_fromArray([
                style
            ]))
        ]), _List_fromArray([
            A2($rtfeldman$elm_css$Svg$Styled$path, _List_fromArray([
                $rtfeldman$elm_css$Svg$Styled$Attributes$d('M3 17.46v3.04c0 .28.22.5.5.5h3.04c.13 0 .26-.05.35-.15L17.81 9.94l-3.75-3.75L3.15 17.1c-.1.1-.15.22-.15.36zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z')
            ]), _List_Nil)
        ]));
    };
    var $author$project$Style$subButtonStyle = $rtfeldman$elm_css$Css$batch(_List_fromArray([
        $rtfeldman$elm_css$Css$backgroundColor(A3($rtfeldman$elm_css$Css$rgb, 153, 153, 153)),
        $rtfeldman$elm_css$Css$color(A3($rtfeldman$elm_css$Css$rgb, 17, 17, 17)),
        $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(16)),
        $rtfeldman$elm_css$Css$fontSize($rtfeldman$elm_css$Css$rem(1.5)),
        $rtfeldman$elm_css$Css$borderRadius($rtfeldman$elm_css$Css$px(8)),
        A4($rtfeldman$elm_css$Css$boxShadow4, $rtfeldman$elm_css$Css$zero, $rtfeldman$elm_css$Css$px(2), $rtfeldman$elm_css$Css$px(4), A4($rtfeldman$elm_css$Css$rgba, 0, 0, 0, 0.18)),
        A2($rtfeldman$elm_css$Css$border2, $rtfeldman$elm_css$Css$zero, $rtfeldman$elm_css$Css$none),
        $author$project$Style$userSelectNone,
        $rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$pointer),
        $rtfeldman$elm_css$Css$displayFlex,
        $rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$center),
        $rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$center),
        $rtfeldman$elm_css$Css$hover(_List_fromArray([
            $rtfeldman$elm_css$Css$backgroundColor(A3($rtfeldman$elm_css$Css$rgb, 187, 187, 187))
        ]))
    ]));
    var $author$project$Style$subButton = F2(function(children, msg) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $author$project$Style$subButtonStyle
            ])),
            $rtfeldman$elm_css$Html$Styled$Events$onClick(msg)
        ]), A2($elm$core$List$map, $rtfeldman$elm_css$Html$Styled$map($elm$core$Basics$never), children));
    });
    var $author$project$Page$Product$editButton = A2($author$project$Style$subButton, _List_fromArray([
        $author$project$Icon$edit($rtfeldman$elm_css$Css$batch(_List_fromArray([
            $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$px(32)),
            $rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$px(32))
        ]))),
        $rtfeldman$elm_css$Html$Styled$text('編集する')
    ]), $author$project$Page$Product$EditProduct);
    var $author$project$Data$Product$getSeller = function(_v0) {
        var seller = _v0.a.seller;
        return seller;
    };
    var $author$project$Page$Product$editButtonAndDeleteButton = F2(function(product, logInState) {
        if (logInState.$ === 'Ok') {
            var token = logInState.a.token;
            var userWithName = logInState.a.userWithName;
            if (_Utils_eq($author$project$Data$User$withNameGetId(userWithName), $author$project$Data$User$withNameGetId($author$project$Data$Product$getSeller(product)))) {
                var _v1 = $author$project$Data$Product$getStatus(product);
                if (_v1.$ === 'Selling') return _List_fromArray([
                    $author$project$Page$Product$editButton,
                    A2($author$project$Page$Product$deleteView, $author$project$Data$Product$getId(product), token)
                ]);
                else return _List_Nil;
            } else return _List_Nil;
        } else return _List_Nil;
    });
    var $author$project$Style$imageView = function(url) {
        return A2($rtfeldman$elm_css$Html$Styled$img, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $rtfeldman$elm_css$Css$display($rtfeldman$elm_css$Css$block),
                $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$px(320)),
                $rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$px(320)),
                A2($rtfeldman$elm_css$Css$property, 'object-fit', 'contain')
            ])),
            $rtfeldman$elm_css$Html$Styled$Attributes$src(url)
        ]), _List_Nil);
    };
    var $author$project$Style$productImageList = function(urlList) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $rtfeldman$elm_css$Css$backgroundColor(A3($rtfeldman$elm_css$Css$rgb, 128, 128, 128)),
                $rtfeldman$elm_css$Css$overflowX($rtfeldman$elm_css$Css$auto),
                $rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$px(320))
            ]))
        ]), _List_fromArray([
            A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $author$project$Style$displayGridAndGap(16),
                    A2($rtfeldman$elm_css$Css$property, 'grid-auto-flow', 'column')
                ]))
            ]), A2($elm$core$List$map, $author$project$Style$imageView, urlList))
        ]));
    };
    var $author$project$Page$Product$Like = F2(function(a, b) {
        return {
            $: 'Like',
            a: a,
            b: b
        };
    });
    var $author$project$Page$Product$UnLike = F2(function(a, b) {
        return {
            $: 'UnLike',
            a: a,
            b: b
        };
    });
    var $author$project$Page$Product$itemLikeBody = function(count) {
        return _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$text('いいね'),
            A2($rtfeldman$elm_css$Html$Styled$span, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $rtfeldman$elm_css$Css$fontSize($rtfeldman$elm_css$Css$rem(1.3))
                ]))
            ]), _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text($elm$core$String$fromInt(count))
            ]))
        ]);
    };
    var $author$project$Page$Product$likeStyle = function(liked) {
        return $rtfeldman$elm_css$Css$batch(_List_fromArray([
            $rtfeldman$elm_css$Css$backgroundColor(liked ? $author$project$Style$primaryColor : A3($rtfeldman$elm_css$Css$rgb, 170, 170, 170)),
            $rtfeldman$elm_css$Css$color(liked ? A3($rtfeldman$elm_css$Css$rgb, 255, 255, 255) : A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0)),
            $rtfeldman$elm_css$Css$borderRadius($rtfeldman$elm_css$Css$px(8)),
            $author$project$Style$userSelectNone,
            $rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$pointer),
            $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(8)),
            A2($rtfeldman$elm_css$Css$border2, $rtfeldman$elm_css$Css$zero, $rtfeldman$elm_css$Css$none),
            $rtfeldman$elm_css$Css$hover(_List_fromArray([
                $rtfeldman$elm_css$Css$backgroundColor(liked ? $author$project$Style$primaryColorLight : A3($rtfeldman$elm_css$Css$rgb, 136, 136, 136))
            ]))
        ]));
    };
    var $author$project$Page$Product$likeButton = F4(function(logInState, sending, likedCount, id) {
        if (sending) return A2($rtfeldman$elm_css$Html$Styled$button, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $author$project$Page$Product$likeStyle(false)
            ])),
            $rtfeldman$elm_css$Html$Styled$Attributes$disabled(true)
        ]), _List_fromArray([
            $author$project$Icon$loading({
                color: A3($rtfeldman$elm_css$Css$rgb, 255, 255, 255),
                size: 20
            })
        ]));
        else {
            if (logInState.$ === 'Ok') {
                var likedProductIds = logInState.a.likedProductIds;
                var token = logInState.a.token;
                return A2($elm$core$List$member, id, likedProductIds) ? A2($rtfeldman$elm_css$Html$Styled$button, _List_fromArray([
                    $rtfeldman$elm_css$Html$Styled$Events$onClick(A2($author$project$Page$Product$UnLike, token, id)),
                    $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                        $author$project$Page$Product$likeStyle(true)
                    ]))
                ]), $author$project$Page$Product$itemLikeBody(likedCount)) : A2($rtfeldman$elm_css$Html$Styled$button, _List_fromArray([
                    $rtfeldman$elm_css$Html$Styled$Events$onClick(A2($author$project$Page$Product$Like, token, id)),
                    $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                        $author$project$Page$Product$likeStyle(false)
                    ]))
                ]), $author$project$Page$Product$itemLikeBody(likedCount));
            } else return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $rtfeldman$elm_css$Css$borderRadius($rtfeldman$elm_css$Css$px(8)),
                    $author$project$Style$userSelectNone,
                    $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(8)),
                    A3($rtfeldman$elm_css$Css$border3, $rtfeldman$elm_css$Css$px(1), $rtfeldman$elm_css$Css$solid, A3($rtfeldman$elm_css$Css$rgb, 170, 170, 170))
                ]))
            ]), $author$project$Page$Product$itemLikeBody(likedCount));
        }
    });
    var $author$project$Page$Product$productsViewLike = F4(function(logInState, sending, likedCount, id) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $rtfeldman$elm_css$Css$displayFlex,
                $rtfeldman$elm_css$Css$flexDirection($rtfeldman$elm_css$Css$row)
            ]))
        ]), _List_fromArray([
            A4($author$project$Page$Product$likeButton, logInState, sending, likedCount, id)
        ]));
    });
    var $author$project$Page$Product$productsViewName = function(name) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $rtfeldman$elm_css$Css$fontSize($rtfeldman$elm_css$Css$rem(1.5))
            ]))
        ]), _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$text(name)
        ]));
    };
    var $author$project$Page$Product$ToConfirmPage = {
        $: 'ToConfirmPage'
    };
    var $author$project$Page$Product$buyButton = F2(function(product, userWithNameMaybe) {
        var _v0 = _Utils_Tuple2($author$project$Data$Product$getStatus(product), userWithNameMaybe);
        if (_v0.a.$ === 'Selling' && _v0.b.$ === 'Just') {
            var _v1 = _v0.a;
            var user = _v0.b.a;
            return _Utils_eq($author$project$Data$User$withNameGetId($author$project$Data$Product$getSeller(product)), $author$project$Data$User$withNameGetId(user)) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(A2($rtfeldman$elm_css$Html$Styled$button, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Events$onClick($author$project$Page$Product$ToConfirmPage)
            ]), _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text('購入手続きへ')
            ])));
        } else return $elm$core$Maybe$Nothing;
    });
    var $author$project$Page$Product$productsViewPriceAndBuyButton = F3(function(isWideScreen, product, userWithNameMaybe) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(8)),
                $rtfeldman$elm_css$Css$displayFlex,
                $rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$spaceBetween),
                $rtfeldman$elm_css$Css$backgroundColor($author$project$Style$primaryColor),
                $rtfeldman$elm_css$Css$color(A3($rtfeldman$elm_css$Css$rgb, 255, 255, 255))
            ]))
        ]), A2($elm$core$List$cons, A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $rtfeldman$elm_css$Css$fontSize($rtfeldman$elm_css$Css$rem(1.5))
            ]))
        ]), _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$text($author$project$Data$Product$priceToString($author$project$Data$Product$getPrice(product)))
        ])), function() {
            var _v0 = A2($author$project$Page$Product$buyButton, product, userWithNameMaybe);
            if (_v0.$ === 'Just') {
                var button = _v0.a;
                return _List_fromArray([
                    button
                ]);
            } else return _List_Nil;
        }()));
    });
    var $author$project$Page$Product$sellerNameView = function(user) {
        return A2($author$project$Style$titleAndContent, '出品者', A2($rtfeldman$elm_css$Html$Styled$a, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$href($author$project$PageLocation$toUrlAsString($author$project$PageLocation$User($author$project$Data$User$withNameGetId(user)))),
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $rtfeldman$elm_css$Css$displayFlex,
                $rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$center),
                $rtfeldman$elm_css$Css$textDecoration($rtfeldman$elm_css$Css$none)
            ]))
        ]), _List_fromArray([
            A2($author$project$Style$userImage, 48, $author$project$Data$User$withNameGetImageId(user)),
            $rtfeldman$elm_css$Html$Styled$text($author$project$Data$User$withNameGetDisplayName(user))
        ])));
    };
    var $author$project$Data$Product$statusToJapaneseString = function(status) {
        switch(status.$){
            case 'Selling':
                return '出品中';
            case 'Trading':
                return '取引中';
            default:
                return '売却済み';
        }
    };
    var $author$project$Page$Product$statusView = function(status) {
        return A2($author$project$Style$titleAndContent, '取引状態', $rtfeldman$elm_css$Html$Styled$text($author$project$Data$Product$statusToJapaneseString(status)));
    };
    var $author$project$Page$Product$normalView = F4(function(logInState, isWideScreen, nowMaybe, data) {
        return {
            bottomNavigation: $elm$core$Maybe$Nothing,
            tab: $author$project$BasicParts$tabNone,
            title: $elm$core$Maybe$Just($author$project$Data$Product$getName(data.product)),
            view: A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $author$project$Style$displayGridAndGap(0),
                    A2($author$project$Style$gridColumn, 2, 3),
                    A2($author$project$Style$gridRow, 2, 4)
                ]))
            ]), _List_fromArray([
                A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                    $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                        $author$project$Style$displayGridAndGap(16),
                        $rtfeldman$elm_css$Css$overflowY($rtfeldman$elm_css$Css$auto),
                        $author$project$Style$webkitOverflowScrolling,
                        $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(16))
                    ])),
                    $author$project$Style$mainId
                ]), _Utils_ap(_List_fromArray([
                    $author$project$Style$productImageList($author$project$Data$Product$getImageUrls(data.product)),
                    $author$project$Page$Product$productsViewName($author$project$Data$Product$getName(data.product)),
                    A4($author$project$Page$Product$productsViewLike, logInState, data.likeSending, $author$project$Data$Product$getLikedCount(data.product), $author$project$Data$Product$getId(data.product)),
                    $author$project$Page$Product$statusView($author$project$Data$Product$getStatus(data.product)),
                    $author$project$Page$Product$sellerNameView($author$project$Data$Product$getSeller(data.product)),
                    $author$project$Page$Product$descriptionView($author$project$Data$Product$getDescription(data.product)),
                    $author$project$Page$Product$categoryView($author$project$Data$Product$getCategory(data.product)),
                    $author$project$Page$Product$conditionView($author$project$Data$Product$getCondition(data.product)),
                    A2($author$project$Page$Product$createdAtView, nowMaybe, $author$project$Data$Product$getCreatedAt(data.product)),
                    A6($author$project$Page$Product$commentListView, data.commentText, data.commentSending, nowMaybe, $author$project$Data$User$withNameGetId($author$project$Data$Product$getSeller(data.product)), logInState, data.commentList)
                ]), A2($author$project$Page$Product$editButtonAndDeleteButton, data.product, logInState))),
                A3($author$project$Page$Product$productsViewPriceAndBuyButton, isWideScreen, data.product, function() {
                    if (logInState.$ === 'Ok') {
                        var userWithName = logInState.a.userWithName;
                        return $elm$core$Maybe$Just(userWithName);
                    } else return $elm$core$Maybe$Nothing;
                }())
            ]))
        };
    });
    var $author$project$Api$UpdateProductRequest = function(a) {
        return {
            $: 'UpdateProductRequest',
            a: a
        };
    };
    var $author$project$Component$ProductEditor$toUpdateRequest = function(_v0) {
        var rec = _v0.a;
        var _v1 = _Utils_Tuple3(rec.price, rec.condition, $author$project$Component$Category$getCategory(rec.category));
        if (_v1.a.$ === 'Just' && _v1.b.$ === 'Just' && _v1.c.$ === 'Just') {
            var price = _v1.a.a;
            var condition = _v1.b.a;
            var category = _v1.c.a;
            return _Utils_eq($author$project$Component$ProductEditor$nameCheck(rec.name), $elm$core$Maybe$Nothing) && _Utils_eq(A2($author$project$Component$ProductEditor$imagesCheck, rec.addImages, rec.beforeImageIds), $elm$core$Maybe$Nothing) ? $elm$core$Maybe$Just($author$project$Api$UpdateProductRequest({
                addImageList: rec.addImages,
                category: category,
                condition: condition,
                deleteImageIndex: rec.deleteImagesAt,
                description: rec.description,
                name: rec.name,
                price: price
            })) : $elm$core$Maybe$Nothing;
        } else return $elm$core$Maybe$Nothing;
    };
    var $author$project$Page$Product$TradeStart = F2(function(a, b) {
        return {
            $: 'TradeStart',
            a: a,
            b: b
        };
    });
    var $author$project$Page$Product$tradeStartButton = F2(function(logInState, productId) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_Nil, _List_fromArray([
            A2($author$project$Style$mainButton, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text('取引を開始する')
            ]), A2($elm$core$Maybe$map, function(accessToken) {
                return A2($author$project$Page$Product$TradeStart, accessToken, productId);
            }, $author$project$Data$LogInState$getToken(logInState)))
        ]));
    });
    var $author$project$Page$Product$view = F5(function(logInState, isWideScreen, nowMaybe, productAllMaybe, model) {
        var _v0 = _Utils_Tuple2(model, productAllMaybe);
        if (_v0.b.$ === 'Nothing') {
            var _v1 = _v0.b;
            return {
                bottomNavigation: $elm$core$Maybe$Nothing,
                tab: $author$project$BasicParts$tabNone,
                title: $elm$core$Maybe$Just('商品詳細ページ 読み込み中'),
                view: $author$project$Style$mainView(_List_fromArray([
                    $author$project$Style$container(_List_fromArray([
                        $rtfeldman$elm_css$Html$Styled$text('読み込み中'),
                        $author$project$Icon$loading({
                            color: A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0),
                            size: 48
                        })
                    ]))
                ]))
            };
        } else switch(_v0.a.$){
            case 'Normal':
                var rec = _v0.a.a;
                var productAll = _v0.b.a;
                return A4($author$project$Page$Product$normalView, logInState, isWideScreen, nowMaybe, {
                    commentList: rec.commentList,
                    commentSending: rec.commentSending,
                    commentText: rec.comment,
                    likeSending: rec.likeSending,
                    product: A2($author$project$Data$Product$searchFromId, rec.product, productAll)
                });
            case 'Edit':
                var productEditor = _v0.a.a.productEditor;
                var beforeProduct = _v0.a.a.beforeProduct;
                var sending = _v0.a.a.sending;
                var productAll = _v0.b.a;
                var productId = A2($author$project$Data$Product$searchFromId, beforeProduct, productAll);
                return {
                    bottomNavigation: $elm$core$Maybe$Nothing,
                    tab: $author$project$BasicParts$tabNone,
                    title: $elm$core$Maybe$Just($author$project$Data$Product$getName(productId)),
                    view: $author$project$Style$mainView(_List_fromArray([
                        $author$project$Style$containerKeyed(function() {
                            var _v2 = $author$project$Data$LogInState$getToken(logInState);
                            if (_v2.$ === 'Just') {
                                var accessToken = _v2.a;
                                return _Utils_ap(A2($elm$core$List$map, $elm$core$Tuple$mapSecond($rtfeldman$elm_css$Html$Styled$map($author$project$Page$Product$MsgByProductEditor)), $author$project$Component$ProductEditor$view(productEditor)), _List_fromArray([
                                    _Utils_Tuple2('okButton', A4($author$project$Page$Product$editOkCancelButton, accessToken, beforeProduct, sending, $author$project$Component$ProductEditor$toUpdateRequest(productEditor)))
                                ]));
                            } else return _List_fromArray([
                                _Utils_Tuple2('needLogIn', $rtfeldman$elm_css$Html$Styled$text('ログインしていないときに商品の編集はできません'))
                            ]);
                        }())
                    ]))
                };
            default:
                var product = _v0.a.a;
                var productAll = _v0.b.a;
                var productData = A2($author$project$Data$Product$searchFromId, product, productAll);
                return {
                    bottomNavigation: $elm$core$Maybe$Nothing,
                    tab: $author$project$BasicParts$tabNone,
                    title: $elm$core$Maybe$Just($author$project$Data$Product$getName(productData)),
                    view: $author$project$Style$mainView(_List_fromArray([
                        $author$project$Style$container(_List_fromArray([
                            $rtfeldman$elm_css$Html$Styled$text('購入確認画面。この商品の取引を開始しますか?'),
                            $author$project$Style$productImageList($author$project$Data$Product$getImageUrls(productData)),
                            $author$project$Page$Product$productsViewName($author$project$Data$Product$getName(productData)),
                            $author$project$Page$Product$descriptionView($author$project$Data$Product$getDescription(productData)),
                            $author$project$Page$Product$conditionView($author$project$Data$Product$getCondition(productData)),
                            A2($author$project$Page$Product$tradeStartButton, logInState, product)
                        ]))
                    ]))
                };
        }
    });
    var $author$project$Page$Search$InputQuery = function(a) {
        return {
            $: 'InputQuery',
            a: a
        };
    };
    var $author$project$Style$Left = {
        $: 'Left'
    };
    var $author$project$Page$Search$MsgByCategory = function(a) {
        return {
            $: 'MsgByCategory',
            a: a
        };
    };
    var $author$project$Page$Search$MsgByGraduateSelect = function(a) {
        return {
            $: 'MsgByGraduateSelect',
            a: a
        };
    };
    var $author$project$Page$Search$MsgBySchoolSelect = function(a) {
        return {
            $: 'MsgBySchoolSelect',
            a: a
        };
    };
    var $author$project$Style$Right = {
        $: 'Right'
    };
    var $author$project$Page$Search$SelectGraduate = {
        $: 'SelectGraduate'
    };
    var $author$project$Page$Search$SelectSchoolOrDepartment = {
        $: 'SelectSchoolOrDepartment'
    };
    var $rtfeldman$elm_css$Html$Styled$Attributes$checked = $rtfeldman$elm_css$Html$Styled$Attributes$boolProperty('checked');
    var $rtfeldman$elm_css$Html$Styled$Attributes$name = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('name');
    var $author$project$Style$radioInputStyle = $rtfeldman$elm_css$Css$batch(_List_fromArray([
        $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$zero),
        $rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$zero)
    ]));
    var $author$project$Style$radioLabelStyle = function(select) {
        return $rtfeldman$elm_css$Css$batch(_Utils_ap(_List_fromArray([
            $rtfeldman$elm_css$Css$backgroundColor(select ? $author$project$Style$primaryColor : A3($rtfeldman$elm_css$Css$rgb, 153, 153, 153)),
            $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(8)),
            $rtfeldman$elm_css$Css$textAlign($rtfeldman$elm_css$Css$center),
            $rtfeldman$elm_css$Css$cursor($rtfeldman$elm_css$Css$pointer),
            A2($rtfeldman$elm_css$Css$border2, $rtfeldman$elm_css$Css$zero, $rtfeldman$elm_css$Css$none),
            $author$project$Style$normalShadow,
            $rtfeldman$elm_css$Css$color(select ? A3($rtfeldman$elm_css$Css$rgb, 255, 255, 255) : A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0))
        ]), select ? _List_Nil : _List_fromArray([
            $rtfeldman$elm_css$Css$hover(_List_fromArray([
                $rtfeldman$elm_css$Css$backgroundColor(A3($rtfeldman$elm_css$Css$rgb, 187, 187, 187))
            ]))
        ])));
    };
    var $author$project$Style$radioForm = function(_v0) {
        var select = _v0.select;
        var leftText = _v0.leftText;
        var rightText = _v0.rightText;
        var name = _v0.name;
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$pct(100)),
                $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(8)),
                $author$project$Style$displayGridAndGap(0),
                A2($rtfeldman$elm_css$Css$property, 'grid-template-columns', '1fr 1fr'),
                $rtfeldman$elm_css$Css$boxSizing($rtfeldman$elm_css$Css$borderBox)
            ]))
        ]), _List_fromArray([
            A2($rtfeldman$elm_css$Html$Styled$input, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$type_('radio'),
                $rtfeldman$elm_css$Html$Styled$Attributes$name(name),
                $rtfeldman$elm_css$Html$Styled$Attributes$id(name + 'Left'),
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $author$project$Style$radioInputStyle
                ])),
                A2($rtfeldman$elm_css$Html$Styled$Events$on, 'change', $elm$json$Json$Decode$succeed($author$project$Style$Left)),
                $rtfeldman$elm_css$Html$Styled$Attributes$checked(_Utils_eq(select, $author$project$Style$Left))
            ]), _List_Nil),
            A2($rtfeldman$elm_css$Html$Styled$label, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$for(name + 'Left'),
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $author$project$Style$radioLabelStyle(_Utils_eq(select, $author$project$Style$Left)),
                    A4($rtfeldman$elm_css$Css$borderRadius4, $rtfeldman$elm_css$Css$px(8), $rtfeldman$elm_css$Css$zero, $rtfeldman$elm_css$Css$zero, $rtfeldman$elm_css$Css$px(8)),
                    A2($author$project$Style$gridColumn, 1, 2),
                    A2($author$project$Style$gridRow, 1, 2)
                ]))
            ]), _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text(leftText)
            ])),
            A2($rtfeldman$elm_css$Html$Styled$input, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$type_('radio'),
                $rtfeldman$elm_css$Html$Styled$Attributes$name(name),
                $rtfeldman$elm_css$Html$Styled$Attributes$id(name + 'Right'),
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $author$project$Style$radioInputStyle
                ])),
                A2($rtfeldman$elm_css$Html$Styled$Events$on, 'change', $elm$json$Json$Decode$succeed($author$project$Style$Right)),
                $rtfeldman$elm_css$Html$Styled$Attributes$checked(_Utils_eq(select, $author$project$Style$Right))
            ]), _List_Nil),
            A2($rtfeldman$elm_css$Html$Styled$label, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$for(name + 'Right'),
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $author$project$Style$radioLabelStyle(_Utils_eq(select, $author$project$Style$Right)),
                    A4($rtfeldman$elm_css$Css$borderRadius4, $rtfeldman$elm_css$Css$zero, $rtfeldman$elm_css$Css$px(8), $rtfeldman$elm_css$Css$px(8), $rtfeldman$elm_css$Css$zero),
                    A2($author$project$Style$gridColumn, 2, 3),
                    A2($author$project$Style$gridRow, 1, 2)
                ]))
            ]), _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text(rightText)
            ]))
        ]));
    };
    var $author$project$Data$University$departmentFromOneSchool = function(school) {
        switch(school.$){
            case 'SAandd':
                return $elm$core$Maybe$Just($author$project$Data$University$DAandd);
            case 'SSport':
                return $elm$core$Maybe$Just($author$project$Data$University$DSport);
            default:
                return $elm$core$Maybe$Nothing;
        }
    };
    var $author$project$Component$SchoolSelect$getDepartment = function(select) {
        switch(select.$){
            case 'None':
                return $elm$core$Maybe$Nothing;
            case 'Department':
                var department = select.a;
                return $elm$core$Maybe$Just(department);
            default:
                var school = select.a;
                return $author$project$Data$University$departmentFromOneSchool(school);
        }
    };
    var $author$project$Component$GraduateSelect$getGraduate = function(model) {
        if (model.$ === 'None') return $elm$core$Maybe$Nothing;
        else {
            var graduate = model.a;
            return $elm$core$Maybe$Just(graduate);
        }
    };
    var $author$project$Component$SchoolSelect$getSchool = function(model) {
        switch(model.$){
            case 'None':
                return $elm$core$Maybe$Nothing;
            case 'School':
                var school = model.a;
                return $elm$core$Maybe$Just(school);
            default:
                var department = model.a;
                return $elm$core$Maybe$Just($author$project$Data$University$schoolFromDepartment(department));
        }
    };
    var $author$project$Component$Category$getSelect = function(_v0) {
        var select = _v0.a;
        switch(select.$){
            case 'None':
                return $author$project$Data$SearchCondition$CategoryNone;
            case 'GroupSelect':
                var group = select.a;
                return $author$project$Data$SearchCondition$CategoryGroup(group);
            default:
                var category = select.a;
                return $author$project$Data$SearchCondition$CategoryCategory(category);
        }
    };
    var $author$project$Page$Search$searchLinkButton = function(_v0) {
        var rec = _v0.a;
        return A2($author$project$Style$mainButtonLink, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$text('検索する')
        ]), $elm$core$Maybe$Just($author$project$PageLocation$SearchResult(A3($author$project$Data$SearchCondition$init, rec.query, $author$project$Component$Category$getSelect(rec.categorySelect), function() {
            var _v1 = rec.universitySelect;
            if (_v1.$ === 'School') {
                var schoolModel = _v1.a;
                var _v2 = $author$project$Component$SchoolSelect$getDepartment(schoolModel);
                if (_v2.$ === 'Just') {
                    var department = _v2.a;
                    return $author$project$Data$SearchCondition$UniversityDepartment(department);
                } else {
                    var _v3 = $author$project$Component$SchoolSelect$getSchool(schoolModel);
                    if (_v3.$ === 'Just') {
                        var school = _v3.a;
                        return $author$project$Data$SearchCondition$UniversitySchool(school);
                    } else return $author$project$Data$SearchCondition$UniversityNone;
                }
            } else {
                var graduateModel = _v1.a;
                var _v4 = $author$project$Component$GraduateSelect$getGraduate(graduateModel);
                if (_v4.$ === 'Just') {
                    var graduate = _v4.a;
                    return $author$project$Data$SearchCondition$UniversityGraduate(graduate);
                } else return $author$project$Data$SearchCondition$UniversityNone;
            }
        }()))));
    };
    var $author$project$Page$Search$searchTextId = 'search-text';
    var $author$project$Component$GraduateSelect$Select = function(a) {
        return {
            $: 'Select',
            a: a
        };
    };
    var $author$project$Data$University$graduateToJapaneseString = function(gradate) {
        switch(gradate.$){
            case 'GEducation':
                return '教育研究科';
            case 'GHass':
                return '人文社会科学研究科';
            case 'GGabs':
                return 'ビジネス科学研究科';
            case 'GPas':
                return '数理物質科学研究科';
            case 'GSie':
                return 'システム情報工学研究科';
            case 'GLife':
                return '生命環境科学研究科';
            case 'GChs':
                return '人間総合科学研究科';
            case 'GSlis':
                return '図書館情報メディア研究科';
            default:
                return 'グローバル研究院';
        }
    };
    var $author$project$Component$GraduateSelect$view = function(_v0) {
        return _Utils_Tuple2('selectGraduate', A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Component$GraduateSelect$Select, A3($author$project$Style$formItem, '研究科', $author$project$Component$GraduateSelect$graduateSelectId, _List_fromArray([
            A3($author$project$Style$selectMenu, false, $author$project$Component$GraduateSelect$graduateSelectId, A2($elm$core$List$map, $author$project$Data$University$graduateToJapaneseString, $author$project$Data$University$graduateAllValue))
        ]))));
    };
    var $author$project$Data$University$departmentToJapaneseString = function(schoolAndDepartment) {
        switch(schoolAndDepartment.$){
            case 'DHumanity':
                return $elm$core$Maybe$Just('人文学類');
            case 'DCulture':
                return $elm$core$Maybe$Just('比較文化学類');
            case 'DJapanese':
                return $elm$core$Maybe$Just('日本語・日本文化学類');
            case 'DSocial':
                return $elm$core$Maybe$Just('社会学類');
            case 'DCis':
                return $elm$core$Maybe$Just('国際総合学類');
            case 'DEducation':
                return $elm$core$Maybe$Just('教育学類');
            case 'DPsyche':
                return $elm$core$Maybe$Just('心理学類');
            case 'DDisability':
                return $elm$core$Maybe$Just('障害科学類');
            case 'DBiol':
                return $elm$core$Maybe$Just('生物学類');
            case 'DBres':
                return $elm$core$Maybe$Just('生物資源学類');
            case 'DEarth':
                return $elm$core$Maybe$Just('地球学類');
            case 'DMath':
                return $elm$core$Maybe$Just('数学類');
            case 'DPhys':
                return $elm$core$Maybe$Just('物理学類');
            case 'DChem':
                return $elm$core$Maybe$Just('化学類');
            case 'DCoens':
                return $elm$core$Maybe$Just('応用理工学類');
            case 'DEsys':
                return $elm$core$Maybe$Just('工学システム学類');
            case 'DPandps':
                return $elm$core$Maybe$Just('社会工学類');
            case 'DCoins':
                return $elm$core$Maybe$Just('情報科学類');
            case 'DMast':
                return $elm$core$Maybe$Just('情報メディア創成学類');
            case 'DKlis':
                return $elm$core$Maybe$Just('知識情報・図書館科学類');
            case 'DMed':
                return $elm$core$Maybe$Just('医学類');
            case 'DNurse':
                return $elm$core$Maybe$Just('看護学類');
            case 'DMs':
                return $elm$core$Maybe$Just('医療科学類');
            case 'DAandd':
                return $elm$core$Maybe$Nothing;
            default:
                return $elm$core$Maybe$Nothing;
        }
    };
    var $author$project$Component$SchoolSelect$SelectDepartment = function(a) {
        return {
            $: 'SelectDepartment',
            a: a
        };
    };
    var $author$project$Component$SchoolSelect$selectDepartmentViewFromLabelString = F2(function(school, labelList) {
        return _Utils_Tuple2('selectDepartment-' + $author$project$Data$University$schoolToIdString(school), A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Component$SchoolSelect$SelectDepartment, A3($author$project$Style$formItem, '学類', $author$project$Component$SchoolSelect$departmentSelectId, _List_fromArray([
            A3($author$project$Style$selectMenu, false, $author$project$Component$SchoolSelect$departmentSelectId, labelList)
        ]))));
    });
    var $author$project$Component$SchoolSelect$selectDepartmentView = F2(function(school, _v0) {
        var _v1 = $author$project$Data$University$schoolToDepartmentList(school);
        if (_v1.b) {
            var x = _v1.a;
            var xs = _v1.b;
            return $elm$core$Maybe$Just(A2($author$project$Component$SchoolSelect$selectDepartmentViewFromLabelString, school, A2($elm$core$List$filterMap, $author$project$Data$University$departmentToJapaneseString, A2($elm$core$List$cons, x, xs))));
        } else return $elm$core$Maybe$Nothing;
    });
    var $author$project$Component$SchoolSelect$SelectSchool = function(a) {
        return {
            $: 'SelectSchool',
            a: a
        };
    };
    var $author$project$Data$University$schoolToJapaneseString = function(school) {
        switch(school.$){
            case 'SHumcul':
                return '人文・文化学群';
            case 'SSocint':
                return '社会・国際学群';
            case 'SHuman':
                return '人間学群';
            case 'SLife':
                return '生命環境学群';
            case 'SSse':
                return '理工学群';
            case 'SInfo':
                return '情報学群';
            case 'SMed':
                return '医学群';
            case 'SAandd':
                return '芸術専門学群';
            default:
                return '体育専門学群';
        }
    };
    var $author$project$Component$SchoolSelect$selectSchoolView = function(_v0) {
        return _Utils_Tuple2('schoolSelect', A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Component$SchoolSelect$SelectSchool, A3($author$project$Style$formItem, '学群', $author$project$Component$SchoolSelect$schoolSelectId, _List_fromArray([
            A3($author$project$Style$selectMenu, false, $author$project$Component$SchoolSelect$schoolSelectId, A2($elm$core$List$map, $author$project$Data$University$schoolToJapaneseString, $author$project$Data$University$schoolAll))
        ]))));
    };
    var $author$project$Component$SchoolSelect$view = function(schoolSelect) {
        switch(schoolSelect.$){
            case 'None':
                return _List_fromArray([
                    $author$project$Component$SchoolSelect$selectSchoolView($elm$core$Maybe$Nothing)
                ]);
            case 'School':
                var school = schoolSelect.a;
                return A2($elm$core$List$cons, $author$project$Component$SchoolSelect$selectSchoolView($elm$core$Maybe$Just(school)), function() {
                    var _v1 = A2($author$project$Component$SchoolSelect$selectDepartmentView, school, $elm$core$Maybe$Nothing);
                    if (_v1.$ === 'Just') {
                        var v = _v1.a;
                        return _List_fromArray([
                            v
                        ]);
                    } else return _List_Nil;
                }());
            default:
                var department = schoolSelect.a;
                return A2($elm$core$List$cons, $author$project$Component$SchoolSelect$selectSchoolView($elm$core$Maybe$Just($author$project$Data$University$schoolFromDepartment(department))), function() {
                    var _v2 = A2($author$project$Component$SchoolSelect$selectDepartmentView, $author$project$Data$University$schoolFromDepartment(department), $elm$core$Maybe$Just(department));
                    if (_v2.$ === 'Just') {
                        var v = _v2.a;
                        return _List_fromArray([
                            v
                        ]);
                    } else return _List_Nil;
                }());
        }
    };
    var $author$project$Page$Search$viewBody = function(_v0) {
        var rec = _v0.a;
        return _Utils_ap(_List_fromArray([
            A3($author$project$Style$formItem, '検索語句', $author$project$Page$Search$searchTextId, _List_fromArray([
                A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Page$Search$InputQuery, $author$project$Style$inputText({
                    autoCompleteMaybe: $elm$core$Maybe$Just('searchQuery'),
                    id: $author$project$Page$Search$searchTextId,
                    maxlengthMaybe: $elm$core$Maybe$Nothing,
                    placeholder: 'キーワードからさがす',
                    required: false,
                    type_: 'text'
                }))
            ])),
            A2($author$project$Style$titleAndContent, 'カテゴリ', A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Page$Search$MsgByCategory, $author$project$Component$Category$view(rec.categorySelect))),
            A2($rtfeldman$elm_css$Html$Styled$map, function(m) {
                if (m.$ === 'Left') return $author$project$Page$Search$SelectSchoolOrDepartment;
                else return $author$project$Page$Search$SelectGraduate;
            }, $author$project$Style$radioForm({
                leftText: '学群/学類',
                name: 'searchUniversityType',
                rightText: '研究科',
                select: function() {
                    var _v1 = rec.universitySelect;
                    if (_v1.$ === 'School') return $author$project$Style$Left;
                    else return $author$project$Style$Right;
                }()
            }))
        ]), _Utils_ap(function() {
            var _v3 = rec.universitySelect;
            if (_v3.$ === 'School') {
                var schoolModel = _v3.a;
                return _List_fromArray([
                    A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Page$Search$MsgBySchoolSelect, A3($rtfeldman$elm_css$Html$Styled$Keyed$node, 'div', _List_Nil, $author$project$Component$SchoolSelect$view(schoolModel)))
                ]);
            } else {
                var graduateModel = _v3.a;
                return _List_fromArray([
                    A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Page$Search$MsgByGraduateSelect, A3($rtfeldman$elm_css$Html$Styled$Keyed$node, 'div', _List_Nil, _List_fromArray([
                        $author$project$Component$GraduateSelect$view(graduateModel)
                    ])))
                ]);
            }
        }(), _List_fromArray([
            $author$project$Page$Search$searchLinkButton($author$project$Page$Search$Model(rec))
        ])));
    };
    var $author$project$Page$Search$view = function(model) {
        return {
            bottomNavigation: $elm$core$Maybe$Just($author$project$BasicParts$Search),
            tab: $author$project$BasicParts$tabNone,
            title: $elm$core$Maybe$Just('検索'),
            view: $author$project$Style$mainView(_List_fromArray([
                $author$project$Style$container($author$project$Page$Search$viewBody(model))
            ]))
        };
    };
    var $author$project$Page$SearchResult$MessageFromProductList = function(a) {
        return {
            $: 'MessageFromProductList',
            a: a
        };
    };
    var $author$project$Page$SearchResult$view = F4(function(logInState, isWideScreen, allProductsMaybe, _v0) {
        var rec = _v0.a;
        return {
            bottomNavigation: $elm$core$Maybe$Nothing,
            tab: $author$project$BasicParts$tabSingle('検索結果'),
            title: $elm$core$Maybe$Just('検索結果'),
            view: $author$project$Style$mainView(_List_fromArray([
                A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Page$SearchResult$MessageFromProductList, A4($author$project$Component$ProductList$view, rec.productList, logInState, isWideScreen, function() {
                    var _v1 = _Utils_Tuple2(allProductsMaybe, rec.result);
                    if (_v1.a.$ === 'Just' && _v1.b.$ === 'Just') {
                        var allProducts = _v1.a.a;
                        var ids = _v1.b.a;
                        return $elm$core$Maybe$Just(A2($elm$core$List$map, function(id) {
                            return A2($author$project$Data$Product$searchFromId, id, allProducts);
                        }, ids));
                    } else return $elm$core$Maybe$Nothing;
                }()))
            ]))
        };
    });
    var $author$project$Page$SoldProducts$view = F4(function(logInState, isWideScreen, allProductsMaybe, _v0) {
        var rec = _v0.a;
        return {
            bottomNavigation: $elm$core$Maybe$Nothing,
            tab: $author$project$BasicParts$tabSingle('出品した商品'),
            title: $elm$core$Maybe$Just('出品した商品'),
            view: $author$project$Style$mainView(_List_fromArray([
                A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Page$SoldProducts$MsgByProductList, A4($author$project$Component$ProductList$view, rec.productList, logInState, isWideScreen, function() {
                    var _v1 = _Utils_Tuple2(rec.normal, allProductsMaybe);
                    switch(_v1.a.$){
                        case 'Normal':
                            if (_v1.b.$ === 'Just') {
                                var soldProducts = _v1.a.a;
                                var allProducts = _v1.b.a;
                                return $elm$core$Maybe$Just(A2($elm$core$List$map, function(id) {
                                    return A2($author$project$Data$Product$searchFromId, id, allProducts);
                                }, soldProducts));
                            } else {
                                var _v2 = _v1.b;
                                return $elm$core$Maybe$Nothing;
                            }
                        case 'Loading':
                            var _v3 = _v1.a;
                            return $elm$core$Maybe$Nothing;
                        default:
                            var _v4 = _v1.a;
                            return $elm$core$Maybe$Just(_List_Nil);
                    }
                }()))
            ]))
        };
    });
    var $author$project$Page$Trade$CancelTrade = function(a) {
        return {
            $: 'CancelTrade',
            a: a
        };
    };
    var $author$project$Page$Trade$cancelButton = F2(function(sending, token) {
        if (sending.$ === 'Just') {
            if (sending.a.$ === 'Cancel') {
                var _v1 = sending.a;
                return A2($author$project$Style$alertColorButton, $elm$core$Maybe$Nothing, _List_fromArray([
                    $author$project$Icon$loading({
                        color: A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0),
                        size: 24
                    })
                ]));
            } else return A2($author$project$Style$alertColorButton, $elm$core$Maybe$Nothing, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text('取引をキャンセルする')
            ]));
        } else return A2($author$project$Style$alertColorButton, $elm$core$Maybe$Just($author$project$Page$Trade$CancelTrade(token)), _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$text('取引をキャンセルする')
        ]));
    });
    var $author$project$Page$Trade$AddComment = function(a) {
        return {
            $: 'AddComment',
            a: a
        };
    };
    var $author$project$Page$Trade$InputComment = function(a) {
        return {
            $: 'InputComment',
            a: a
        };
    };
    var $author$project$Page$Trade$commentInputArea = F2(function(sending, token) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_Nil, A2($elm$core$List$cons, A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Page$Trade$InputComment, $author$project$Style$inputMutilineText($author$project$Page$Trade$commentTextAreaId)), function() {
            if (sending.$ === 'Just') {
                if (sending.a.$ === 'Comment') {
                    var _v1 = sending.a;
                    return _List_fromArray([
                        A2($rtfeldman$elm_css$Html$Styled$button, _List_fromArray([
                            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                                $author$project$Component$Comment$commentSendButtonStyle
                            ])),
                            $rtfeldman$elm_css$Html$Styled$Attributes$disabled(true)
                        ]), _List_fromArray([
                            $author$project$Icon$loading({
                                color: A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0),
                                size: 24
                            })
                        ]))
                    ]);
                } else return _List_fromArray([
                    A2($rtfeldman$elm_css$Html$Styled$button, _List_fromArray([
                        $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                            $author$project$Component$Comment$commentSendButtonStyle
                        ])),
                        $rtfeldman$elm_css$Html$Styled$Attributes$disabled(true)
                    ]), _List_fromArray([
                        $rtfeldman$elm_css$Html$Styled$text('コメントを送信')
                    ]))
                ]);
            } else return _List_fromArray([
                A2($rtfeldman$elm_css$Html$Styled$button, _List_fromArray([
                    $rtfeldman$elm_css$Html$Styled$Events$onClick($author$project$Page$Trade$AddComment(token)),
                    $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                        $author$project$Component$Comment$commentSendButtonStyle
                    ]))
                ]), _List_fromArray([
                    $rtfeldman$elm_css$Html$Styled$text('コメントを送信')
                ]))
            ]);
        }()));
    });
    var $author$project$Data$Trade$getProductId = function(_v0) {
        var productId = _v0.a.productId;
        return productId;
    };
    var $author$project$Data$Trade$getBuyer = function(_v0) {
        var buyer = _v0.a.buyer;
        return buyer;
    };
    var $author$project$Page$Trade$tradeCommentToCommentData = F4(function(trade, myId, seller, _v0) {
        var body = _v0.a.body;
        var speaker = _v0.a.speaker;
        var createdAt = _v0.a.createdAt;
        if (speaker.$ === 'Seller') return {
            body: body,
            createdAt: createdAt,
            isMine: _Utils_eq($author$project$Data$User$withNameGetId(seller), myId),
            isSeller: true,
            user: seller
        };
        else {
            var commentUser = $author$project$Data$Trade$getBuyer(trade);
            return {
                body: body,
                createdAt: createdAt,
                isMine: _Utils_eq($author$project$Data$User$withNameGetId(commentUser), myId),
                isSeller: false,
                user: commentUser
            };
        }
    });
    var $author$project$Page$Trade$commentView = F5(function(timeData, user, allProducts, trade, commentsMaybe) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_Nil, _List_fromArray([
            A2($author$project$Component$Comment$view, timeData, A2($elm$core$Maybe$map, $elm$core$List$map(A3($author$project$Page$Trade$tradeCommentToCommentData, trade, $author$project$Data$User$withNameGetId(user), $author$project$Data$Product$getSeller(A2($author$project$Data$Product$searchFromId, $author$project$Data$Trade$getProductId(trade), allProducts)))), commentsMaybe))
        ]));
    });
    var $author$project$Page$Trade$FinishTrade = function(a) {
        return {
            $: 'FinishTrade',
            a: a
        };
    };
    var $author$project$Page$Trade$finishText = function(position) {
        if (position.$ === 'Seller') return '商品を渡した';
        else return '商品を受け取った';
    };
    var $author$project$Page$Trade$finishButton = F3(function(sending, position, token) {
        if (sending.$ === 'Just') {
            if (sending.a.$ === 'Finish') {
                var _v1 = sending.a;
                return A2($author$project$Style$mainButton, _List_fromArray([
                    $author$project$Icon$loading({
                        color: A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0),
                        size: 24
                    })
                ]), $elm$core$Maybe$Nothing);
            } else return A2($author$project$Style$mainButton, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text($author$project$Page$Trade$finishText(position))
            ]), $elm$core$Maybe$Nothing);
        } else return A2($author$project$Style$mainButton, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$text($author$project$Page$Trade$finishText(position))
        ]), $elm$core$Maybe$Just($author$project$Page$Trade$FinishTrade(token)));
    });
    var $author$project$Data$Trade$getCreatedAt = function(_v0) {
        var createdAt = _v0.a.createdAt;
        return createdAt;
    };
    var $author$project$Data$Trade$getUpdateAt = function(_v0) {
        var updateAt = _v0.a.updateAt;
        return updateAt;
    };
    var $author$project$Style$displayGridFlowColumn = function(gap) {
        var block = $rtfeldman$elm_css$Css$block;
        return $rtfeldman$elm_css$Css$batch(_Utils_ap(_List_fromArray([
            $rtfeldman$elm_css$Css$display(_Utils_update(block, {
                value: 'grid'
            })),
            A2($rtfeldman$elm_css$Css$property, 'grid-auto-flow', 'column')
        ]), !gap ? _List_Nil : _List_fromArray([
            A2($rtfeldman$elm_css$Css$property, 'gap', $elm$core$String$fromInt(gap) + 'px')
        ])));
    };
    var $author$project$Page$Trade$userView = function(userWithName) {
        return A2($rtfeldman$elm_css$Html$Styled$a, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$href($author$project$PageLocation$toUrlAsString($author$project$PageLocation$User($author$project$Data$User$withNameGetId(userWithName))))
        ]), _List_fromArray([
            A2($author$project$Style$userImage, 48, $author$project$Data$User$withNameGetImageId(userWithName)),
            $rtfeldman$elm_css$Html$Styled$text($author$project$Data$User$withNameGetDisplayName(userWithName))
        ]));
    };
    var $author$project$Page$Trade$sellerAndBuyerView = F2(function(seller, buyer) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $author$project$Style$displayGridFlowColumn(0)
            ]))
        ]), _List_fromArray([
            $author$project$Page$Trade$userView(seller),
            A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $rtfeldman$elm_css$Css$fontSize($rtfeldman$elm_css$Css$px(32))
                ]))
            ]), _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text('→')
            ])),
            $author$project$Page$Trade$userView(buyer)
        ]));
    });
    var $author$project$Data$Trade$statusToJapaneseString = function(status) {
        switch(status.$){
            case 'InProgress':
                return '進行中';
            case 'WaitSellerFinish':
                return '出品者の終了待ち';
            case 'WaitBuyerFinish':
                return '購入者の終了待ち';
            case 'CancelBySeller':
                return '出品者がキャンセルした';
            case 'CancelByBuyer':
                return '購入者がキャンセルした';
            default:
                return '取引終了';
        }
    };
    var $author$project$Page$Trade$mainView = F7(function(sending, token, timeData, user, allProducts, comments, trade) {
        var tradeStatus = $author$project$Data$Trade$getStatus(trade);
        var product = A2($author$project$Data$Product$searchFromId, $author$project$Data$Trade$getProductId(trade), allProducts);
        var position = _Utils_eq($author$project$Data$User$withNameGetId($author$project$Data$Trade$getBuyer(trade)), $author$project$Data$User$withNameGetId(user)) ? $author$project$Data$Trade$Buyer : $author$project$Data$Trade$Seller;
        return _Utils_ap(_List_fromArray([
            $author$project$Style$productImageList($author$project$Data$Product$getImageUrls(product)),
            A2($author$project$Style$titleAndContent, '商品名', $rtfeldman$elm_css$Html$Styled$text($author$project$Data$Product$getName(product))),
            A2($author$project$Style$titleAndContent, '値段', $rtfeldman$elm_css$Html$Styled$text($author$project$Data$Product$priceToString($author$project$Data$Product$getPrice(product)))),
            A2($author$project$Style$titleAndContent, '取引状態', $rtfeldman$elm_css$Html$Styled$text($author$project$Data$Trade$statusToJapaneseString($author$project$Data$Trade$getStatus(trade)))),
            A2($author$project$Style$titleAndContent, '更新日時', $rtfeldman$elm_css$Html$Styled$text(A2($author$project$Data$DateTime$toDiffString, timeData, $author$project$Data$Trade$getUpdateAt(trade)))),
            A2($author$project$Style$titleAndContent, '開始日時', $rtfeldman$elm_css$Html$Styled$text(A2($author$project$Data$DateTime$toDiffString, timeData, $author$project$Data$Trade$getCreatedAt(trade)))),
            A2($rtfeldman$elm_css$Html$Styled$a, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $rtfeldman$elm_css$Css$display($rtfeldman$elm_css$Css$block)
                ])),
                $rtfeldman$elm_css$Html$Styled$Attributes$href($author$project$PageLocation$toUrlAsString($author$project$PageLocation$Product($author$project$Data$Trade$getProductId(trade))))
            ]), _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text('商品詳細ページ')
            ])),
            A2($author$project$Page$Trade$sellerAndBuyerView, $author$project$Data$Product$getSeller(product), $author$project$Data$Trade$getBuyer(trade))
        ]), _Utils_ap(function() {
            switch(tradeStatus.$){
                case 'InProgress':
                    return _List_fromArray([
                        A2($author$project$Page$Trade$commentInputArea, sending, token)
                    ]);
                case 'WaitSellerFinish':
                    return _List_fromArray([
                        A2($author$project$Page$Trade$commentInputArea, sending, token)
                    ]);
                case 'WaitBuyerFinish':
                    return _List_fromArray([
                        A2($author$project$Page$Trade$commentInputArea, sending, token)
                    ]);
                case 'CancelBySeller':
                    return _List_Nil;
                case 'CancelByBuyer':
                    return _List_Nil;
                default:
                    return _List_Nil;
            }
        }(), A2($elm$core$List$cons, A5($author$project$Page$Trade$commentView, timeData, user, allProducts, trade, comments), _Utils_ap(function() {
            switch(tradeStatus.$){
                case 'InProgress':
                    return _List_fromArray([
                        A3($author$project$Page$Trade$finishButton, sending, position, token)
                    ]);
                case 'WaitSellerFinish':
                    if (position.$ === 'Buyer') return _List_Nil;
                    else return _List_fromArray([
                        A3($author$project$Page$Trade$finishButton, sending, position, token)
                    ]);
                case 'WaitBuyerFinish':
                    if (position.$ === 'Buyer') return _List_fromArray([
                        A3($author$project$Page$Trade$finishButton, sending, position, token)
                    ]);
                    else return _List_Nil;
                default:
                    return _List_Nil;
            }
        }(), function() {
            switch(tradeStatus.$){
                case 'InProgress':
                    return _List_fromArray([
                        A2($author$project$Page$Trade$cancelButton, sending, token)
                    ]);
                case 'WaitSellerFinish':
                    return _List_fromArray([
                        A2($author$project$Page$Trade$cancelButton, sending, token)
                    ]);
                case 'WaitBuyerFinish':
                    return _List_fromArray([
                        A2($author$project$Page$Trade$cancelButton, sending, token)
                    ]);
                case 'CancelBySeller':
                    return _List_Nil;
                case 'CancelByBuyer':
                    return _List_Nil;
                default:
                    return _List_Nil;
            }
        }()))));
    });
    var $author$project$Page$Trade$view = F4(function(logInState, timeData, allProductsMaybe, model) {
        return {
            bottomNavigation: $elm$core$Maybe$Nothing,
            tab: $author$project$BasicParts$tabNone,
            title: $elm$core$Maybe$Just('取引'),
            view: $author$project$Style$mainView(_List_fromArray([
                $author$project$Style$container(function() {
                    switch(logInState.$){
                        case 'Ok':
                            var token = logInState.a.token;
                            var userWithName = logInState.a.userWithName;
                            if (model.$ === 'CheckingTrader') {
                                var id = model.a;
                                return _List_fromArray([
                                    $rtfeldman$elm_css$Html$Styled$text('id=' + ($author$project$Data$Trade$idToString(id) + 'の取引の関係者かどうかの調べてる')),
                                    $author$project$Icon$loading({
                                        color: A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0),
                                        size: 64
                                    })
                                ]);
                            } else {
                                var trade = model.a.trade;
                                var sending = model.a.sending;
                                var comments = model.a.comments;
                                if (allProductsMaybe.$ === 'Just') {
                                    var allProducts = allProductsMaybe.a;
                                    return A7($author$project$Page$Trade$mainView, sending, token, timeData, userWithName, allProducts, comments, trade);
                                } else return _List_fromArray([
                                    $rtfeldman$elm_css$Html$Styled$text('商品データの読み込み中'),
                                    $author$project$Icon$loading({
                                        color: A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0),
                                        size: 64
                                    })
                                ]);
                            }
                        case 'LoadingProfile':
                            return _List_fromArray([
                                $rtfeldman$elm_css$Html$Styled$text('読み込み中'),
                                $author$project$Icon$loading({
                                    color: A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0),
                                    size: 64
                                })
                            ]);
                        default:
                            return _List_fromArray([
                                $rtfeldman$elm_css$Html$Styled$text('取引するにはログインが必要です')
                            ]);
                    }
                }())
            ]))
        };
    });
    var $author$project$Page$TradesInPast$MsgByLogIn = function(a) {
        return {
            $: 'MsgByLogIn',
            a: a
        };
    };
    var $author$project$Component$TradeList$userView = function(userWithName) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_Nil, _List_fromArray([
            A2($author$project$Style$userImage, 48, $author$project$Data$User$withNameGetImageId(userWithName)),
            $rtfeldman$elm_css$Html$Styled$text($author$project$Data$User$withNameGetDisplayName(userWithName))
        ]));
    };
    var $author$project$Component$TradeList$itemView = F2(function(allProducts, trade) {
        var product = A2($author$project$Data$Product$searchFromId, $author$project$Data$Trade$getProductId(trade), allProducts);
        return A2($rtfeldman$elm_css$Html$Styled$a, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$href($author$project$PageLocation$toUrlAsString($author$project$PageLocation$Trade($author$project$Data$Trade$getId(trade)))),
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $author$project$Style$displayGridAndGap(0),
                A2($rtfeldman$elm_css$Css$property, 'grid-template-columns', '194px 1fr'),
                A2($rtfeldman$elm_css$Css$property, 'grid-template-rows', 'max-content max-content max-content'),
                A3($rtfeldman$elm_css$Css$border3, $rtfeldman$elm_css$Css$px(1), $rtfeldman$elm_css$Css$solid, A4($rtfeldman$elm_css$Css$rgba, 0, 0, 0, 0.4)),
                $rtfeldman$elm_css$Css$textDecoration($rtfeldman$elm_css$Css$none),
                $rtfeldman$elm_css$Css$color(A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0))
            ]))
        ]), _List_fromArray([
            A2($rtfeldman$elm_css$Html$Styled$img, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$src($author$project$Data$Product$getThumbnailImageUrl(product)),
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $rtfeldman$elm_css$Css$display($rtfeldman$elm_css$Css$block),
                    A2($author$project$Style$gridColumn, 1, 2),
                    A2($author$project$Style$gridRow, 1, 4),
                    $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$px(192)),
                    $rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$px(192)),
                    A2($rtfeldman$elm_css$Css$property, 'object-fit', 'contain')
                ]))
            ]), _List_Nil),
            A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    A2($author$project$Style$gridColumn, 2, 3),
                    A2($author$project$Style$gridRow, 1, 2),
                    $rtfeldman$elm_css$Css$color(A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0)),
                    $rtfeldman$elm_css$Css$fontSize($rtfeldman$elm_css$Css$px(32))
                ]))
            ]), _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text($author$project$Data$Product$getName(product))
            ])),
            A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    A2($author$project$Style$gridColumn, 2, 3),
                    A2($author$project$Style$gridRow, 2, 3)
                ]))
            ]), _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text($author$project$Data$Product$priceToString($author$project$Data$Product$getPrice(product)))
            ])),
            A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    A2($author$project$Style$gridColumn, 2, 3),
                    A2($author$project$Style$gridRow, 3, 4),
                    $rtfeldman$elm_css$Css$displayFlex
                ]))
            ]), _List_fromArray([
                $author$project$Component$TradeList$userView($author$project$Data$Product$getSeller(product)),
                A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                    $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                        $rtfeldman$elm_css$Css$fontSize($rtfeldman$elm_css$Css$rem(2))
                    ]))
                ]), _List_fromArray([
                    $rtfeldman$elm_css$Html$Styled$text('→')
                ])),
                $author$project$Component$TradeList$userView($author$project$Data$Trade$getBuyer(trade))
            ]))
        ]));
    });
    var $author$project$Component$TradeList$mainView = F2(function(allProducts, _v0) {
        var x = _v0.a;
        var xs = _v0.b;
        return A2($elm$core$List$map, $author$project$Component$TradeList$itemView(allProducts), A2($elm$core$List$cons, x, xs));
    });
    var $author$project$Component$TradeList$view = F2(function(allProductsMaybe, tradesMaybe) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_Nil, function() {
            var _v0 = _Utils_Tuple2(allProductsMaybe, tradesMaybe);
            _v0$1: while(true)if (_v0.b.$ === 'Just') {
                if (_v0.a.$ === 'Just') {
                    if (_v0.b.a.b) {
                        var allProducts = _v0.a.a;
                        var _v1 = _v0.b.a;
                        var x = _v1.a;
                        var xs = _v1.b;
                        return A2($author$project$Component$TradeList$mainView, allProducts, _Utils_Tuple2(x, xs));
                    } else break _v0$1;
                } else {
                    if (!_v0.b.a.b) break _v0$1;
                    else {
                        var _v3 = _v0.a;
                        return _List_fromArray([
                            $rtfeldman$elm_css$Html$Styled$text('商品情報を読み込み中'),
                            $author$project$Icon$loading({
                                color: A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0),
                                size: 64
                            })
                        ]);
                    }
                }
            } else {
                var _v2 = _v0.b;
                return _List_fromArray([
                    $rtfeldman$elm_css$Html$Styled$text('取引情報を読み込み中'),
                    $author$project$Icon$loading({
                        color: A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0),
                        size: 64
                    })
                ]);
            }
            return _List_fromArray([
                $author$project$Style$emptyList('ここに表示する取引がありません')
            ]);
        }());
    });
    var $author$project$Page$TradesInPast$view = F3(function(logInState, allProductsMaybe, _v0) {
        var rec = _v0.a;
        return {
            bottomNavigation: $elm$core$Maybe$Nothing,
            tab: $author$project$BasicParts$tabSingle('過去にした取引'),
            title: $elm$core$Maybe$Just('過去にした取引'),
            view: $author$project$Style$mainView(function() {
                if (logInState.$ === 'None') return _List_fromArray([
                    $author$project$Style$container(_List_fromArray([
                        $rtfeldman$elm_css$Html$Styled$text('ログインか新規登録をして、いいねと閲覧履歴を使えるようにしよう!'),
                        A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Page$TradesInPast$MsgByLogIn, $author$project$Component$LogIn$view(rec.logIn))
                    ]))
                ]);
                else return _List_fromArray([
                    A2($author$project$Component$TradeList$view, allProductsMaybe, function() {
                        var _v2 = rec.normal;
                        switch(_v2.$){
                            case 'Loading':
                                return $elm$core$Maybe$Nothing;
                            case 'Normal':
                                var trades = _v2.a;
                                return $elm$core$Maybe$Just($elm$core$List$reverse(trades));
                            default:
                                return $elm$core$Maybe$Just(_List_Nil);
                        }
                    }())
                ]);
            }())
        };
    });
    var $author$project$Page$TradesInProgress$MsgByLogIn = function(a) {
        return {
            $: 'MsgByLogIn',
            a: a
        };
    };
    var $author$project$Page$TradesInProgress$view = F3(function(logInState, allProductsMaybe, _v0) {
        var rec = _v0.a;
        return {
            bottomNavigation: $elm$core$Maybe$Nothing,
            tab: $author$project$BasicParts$tabSingle('進行中の取引'),
            title: $elm$core$Maybe$Just('進行中の取引'),
            view: $author$project$Style$mainView(function() {
                if (logInState.$ === 'None') return _List_fromArray([
                    $author$project$Style$container(_List_fromArray([
                        $rtfeldman$elm_css$Html$Styled$text('ログインか新規登録をして、いいねと閲覧履歴を使えるようにしよう!'),
                        A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Page$TradesInProgress$MsgByLogIn, $author$project$Component$LogIn$view(rec.logIn))
                    ]))
                ]);
                else return _List_fromArray([
                    A2($author$project$Component$TradeList$view, allProductsMaybe, function() {
                        var _v2 = rec.normal;
                        switch(_v2.$){
                            case 'Loading':
                                return $elm$core$Maybe$Nothing;
                            case 'Normal':
                                var trades = _v2.a;
                                return $elm$core$Maybe$Just($elm$core$List$reverse(trades));
                            default:
                                return $elm$core$Maybe$Just(_List_Nil);
                        }
                    }())
                ]);
            }())
        };
    });
    var $author$project$Page$User$MsgByUniversity = function(a) {
        return {
            $: 'MsgByUniversity',
            a: a
        };
    };
    var $author$project$Page$User$MsgInputDisplayName = function(a) {
        return {
            $: 'MsgInputDisplayName',
            a: a
        };
    };
    var $rtfeldman$elm_css$Html$Styled$Attributes$class = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('className');
    var $author$project$Page$User$displayNameEditor = function(displayName) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_Nil, _Utils_ap(_List_fromArray([
            A2($rtfeldman$elm_css$Html$Styled$label, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$class('form-label'),
                $rtfeldman$elm_css$Html$Styled$Attributes$for($author$project$Page$User$nickNameEditorId)
            ]), _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text('表示名')
            ])),
            A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Page$User$MsgInputDisplayName, $author$project$Style$inputText({
                autoCompleteMaybe: $elm$core$Maybe$Just('username'),
                id: $author$project$Page$User$nickNameEditorId,
                maxlengthMaybe: $elm$core$Maybe$Nothing,
                placeholder: '',
                required: true,
                type_: 'text'
            }))
        ]), $elm$core$String$length(displayName) < 1 ? _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$text('表示名は 1文字以上である必要があります')
        ]) : 50 < $elm$core$String$length(displayName) ? _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$text('表示名は 50文字以内である必要があります')
        ]) : _List_Nil));
    };
    var $author$project$Page$User$MsgBackToViewMode = {
        $: 'MsgBackToViewMode'
    };
    var $author$project$Page$User$MsgChangeProfile = F2(function(a, b) {
        return {
            $: 'MsgChangeProfile',
            a: a,
            b: b
        };
    });
    var $author$project$Component$University$getUniversity = function(universitySelect) {
        switch(universitySelect.$){
            case 'School':
                var schoolSelect = universitySelect.a;
                return A2($elm$core$Maybe$map, $author$project$Data$University$NotGraduate, $author$project$Component$SchoolSelect$getDepartment(schoolSelect));
            case 'GraduateTsukuba':
                var graduate = universitySelect.a.graduate;
                var school = universitySelect.a.school;
                var _v1 = _Utils_Tuple2($author$project$Component$GraduateSelect$getGraduate(graduate), $author$project$Component$SchoolSelect$getDepartment(school));
                if (_v1.a.$ === 'Just' && _v1.b.$ === 'Just') {
                    var g = _v1.a.a;
                    var department = _v1.b.a;
                    return $elm$core$Maybe$Just(A2($author$project$Data$University$GraduateTsukuba, g, department));
                } else return $elm$core$Maybe$Nothing;
            default:
                var graduate = universitySelect.a;
                return A2($elm$core$Maybe$map, $author$project$Data$University$GraduateNoTsukuba, $author$project$Component$GraduateSelect$getGraduate(graduate));
        }
    };
    var $author$project$Page$User$editModelToProfileUpdateData = function(_v0) {
        var displayName = _v0.displayName;
        var introduction = _v0.introduction;
        var university = _v0.university;
        return 1 <= $elm$core$String$length(displayName) && $elm$core$String$length(displayName) <= 50 ? A2($elm$core$Maybe$map, function(univ) {
            return {
                displayName: displayName,
                image: $elm$core$Maybe$Nothing,
                introduction: introduction,
                university: univ
            };
        }, $author$project$Component$University$getUniversity(university)) : $elm$core$Maybe$Nothing;
    };
    var $author$project$Page$User$editButton = F2(function(token, editModel) {
        return A2($author$project$Style$okAndCancelButton, {
            msg: $author$project$Page$User$MsgBackToViewMode,
            text: 'キャンセル'
        }, {
            msg: A2($elm$core$Maybe$map, $author$project$Page$User$MsgChangeProfile(token), $author$project$Page$User$editModelToProfileUpdateData(editModel)),
            text: '変更する'
        });
    });
    var $author$project$Page$User$MsgInputIntroduction = function(a) {
        return {
            $: 'MsgInputIntroduction',
            a: a
        };
    };
    var $author$project$Page$User$introductionEditor = function(_v0) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_Nil, _List_fromArray([
            A2($rtfeldman$elm_css$Html$Styled$label, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$class('form-label'),
                $rtfeldman$elm_css$Html$Styled$Attributes$for($author$project$Page$User$introductionEditorId)
            ]), _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text('紹介文')
            ])),
            A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Page$User$MsgInputIntroduction, $author$project$Style$inputMutilineText($author$project$Page$User$introductionEditorId))
        ]));
    };
    var $author$project$Component$University$MsgBySchool = function(a) {
        return {
            $: 'MsgBySchool',
            a: a
        };
    };
    var $author$project$Component$University$MsgByGraduate = function(a) {
        return {
            $: 'MsgByGraduate',
            a: a
        };
    };
    var $author$project$Component$University$SwitchGraduateNoTsukuba = {
        $: 'SwitchGraduateNoTsukuba'
    };
    var $author$project$Component$University$SwitchGraduateTsukuba = {
        $: 'SwitchGraduateTsukuba'
    };
    var $author$project$Component$University$graduateYesNoTsukubaView = function(select) {
        return _Utils_Tuple2('tsukubaUniversitySchoolOrNo', A2($author$project$Style$titleAndContent, '院進前の所属', A2($rtfeldman$elm_css$Html$Styled$map, function(msg) {
            if (msg.$ === 'Left') return $author$project$Component$University$SwitchGraduateTsukuba;
            else return $author$project$Component$University$SwitchGraduateNoTsukuba;
        }, $author$project$Style$radioForm({
            leftText: '筑波大学に所属していた',
            name: 'graduateYesNoTsukuba',
            rightText: '筑波大学に所属していなかった',
            select: select
        }))));
    };
    var $author$project$Component$University$graduateNoTsukubaView = function(graduateSelect) {
        return _List_fromArray([
            A2($elm$core$Tuple$mapSecond, $rtfeldman$elm_css$Html$Styled$map($author$project$Component$University$MsgByGraduate), $author$project$Component$GraduateSelect$view(graduateSelect)),
            $author$project$Component$University$graduateYesNoTsukubaView($author$project$Style$Right)
        ]);
    };
    var $author$project$Component$University$graduateTsukubaView = F2(function(graduateSelect, schoolSelect) {
        return _Utils_ap(_List_fromArray([
            A2($elm$core$Tuple$mapSecond, $rtfeldman$elm_css$Html$Styled$map($author$project$Component$University$MsgByGraduate), $author$project$Component$GraduateSelect$view(graduateSelect)),
            $author$project$Component$University$graduateYesNoTsukubaView($author$project$Style$Left)
        ]), A2($elm$core$List$map, $elm$core$Tuple$mapSecond($rtfeldman$elm_css$Html$Styled$map($author$project$Component$University$MsgBySchool)), $author$project$Component$SchoolSelect$view(schoolSelect)));
    });
    var $author$project$Component$University$SwitchGraduate = {
        $: 'SwitchGraduate'
    };
    var $author$project$Component$University$SwitchSchool = {
        $: 'SwitchSchool'
    };
    var $author$project$Component$University$schoolOrGraduateView = function(select) {
        return _Utils_Tuple2('schoolOrGraduate', A2($author$project$Style$titleAndContent, '所属', A2($rtfeldman$elm_css$Html$Styled$map, function(msg) {
            if (msg.$ === 'Left') return $author$project$Component$University$SwitchSchool;
            else return $author$project$Component$University$SwitchGraduate;
        }, $author$project$Style$radioForm({
            leftText: '学群生',
            name: 'schoolOrGraduate',
            rightText: '院生',
            select: select
        }))));
    };
    var $author$project$Component$University$view = function(model) {
        switch(model.$){
            case 'School':
                var schoolSelect = model.a;
                return A2($elm$core$List$cons, $author$project$Component$University$schoolOrGraduateView($author$project$Style$Left), A2($elm$core$List$map, $elm$core$Tuple$mapSecond($rtfeldman$elm_css$Html$Styled$map($author$project$Component$University$MsgBySchool)), $author$project$Component$SchoolSelect$view(schoolSelect)));
            case 'GraduateTsukuba':
                var graduate = model.a.graduate;
                var school = model.a.school;
                return A2($elm$core$List$cons, $author$project$Component$University$schoolOrGraduateView($author$project$Style$Right), A2($author$project$Component$University$graduateTsukubaView, graduate, school));
            default:
                var graduate = model.a;
                return A2($elm$core$List$cons, $author$project$Component$University$schoolOrGraduateView($author$project$Style$Right), $author$project$Component$University$graduateNoTsukubaView(graduate));
        }
    };
    var $author$project$Page$User$editView = F2(function(access, editModel) {
        return _List_fromArray([
            A3($rtfeldman$elm_css$Html$Styled$Keyed$node, 'div', _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $author$project$Style$displayGridAndGap(24),
                    $rtfeldman$elm_css$Css$maxWidth($rtfeldman$elm_css$Css$px(640)),
                    $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(24)),
                    $rtfeldman$elm_css$Css$boxSizing($rtfeldman$elm_css$Css$borderBox),
                    $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$pct(100)),
                    $rtfeldman$elm_css$Css$overflowWrap($rtfeldman$elm_css$Css$breakWord)
                ]))
            ]), _Utils_ap(_List_fromArray([
                _Utils_Tuple2('nickNameEditor', $author$project$Page$User$displayNameEditor(editModel.displayName)),
                _Utils_Tuple2('introductionEditor', $author$project$Page$User$introductionEditor(editModel.introduction))
            ]), _Utils_ap(A2($elm$core$List$map, $elm$core$Tuple$mapSecond($rtfeldman$elm_css$Html$Styled$map($author$project$Page$User$MsgByUniversity)), $author$project$Component$University$view(editModel.university)), _List_fromArray([
                _Utils_Tuple2('button', A2($author$project$Page$User$editButton, access, editModel))
            ]))))
        ]);
    });
    var $author$project$Page$User$imageAndDisplayNameView = F3(function(isWideScreen, imageId, displayName) {
        return isWideScreen ? _List_fromArray([
            A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $rtfeldman$elm_css$Css$displayFlex,
                    $rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$center)
                ]))
            ]), _List_fromArray([
                A2($author$project$Style$userImage, 200, imageId),
                A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                    $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                        $rtfeldman$elm_css$Css$flexGrow($rtfeldman$elm_css$Css$int(1)),
                        $rtfeldman$elm_css$Css$fontSize($rtfeldman$elm_css$Css$rem(1.5))
                    ]))
                ]), _List_fromArray([
                    $rtfeldman$elm_css$Html$Styled$text(displayName)
                ]))
            ]))
        ]) : _List_fromArray([
            A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $rtfeldman$elm_css$Css$displayFlex,
                    $rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$center)
                ]))
            ]), _List_fromArray([
                A2($author$project$Style$userImage, 200, imageId)
            ])),
            A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $rtfeldman$elm_css$Css$fontSize($rtfeldman$elm_css$Css$rem(1.5))
                ]))
            ]), _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$text(displayName)
            ]))
        ]);
    });
    var $author$project$Page$User$loadingWithUserIdAndNameView = F2(function(isWideScreen, userWithName) {
        return _Utils_ap(A3($author$project$Page$User$imageAndDisplayNameView, isWideScreen, $author$project$Data$User$withNameGetImageId(userWithName), $author$project$Data$User$withNameGetDisplayName(userWithName)), _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$text($author$project$Data$User$withNameGetDisplayName(userWithName) + 'さんの紹介文、学群学類を読み込み中'),
            A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $rtfeldman$elm_css$Css$displayFlex,
                    $rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$center)
                ]))
            ]), _List_fromArray([
                $author$project$Icon$loading({
                    color: A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0),
                    size: 48
                })
            ]))
        ]));
    });
    var $author$project$Page$User$loadingWithUserIdView = function(userId) {
        return _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$text('ユーザーID' + ($author$project$Data$User$idToString(userId) + 'のプロフィールを読み込み中')),
            A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                    $rtfeldman$elm_css$Css$displayFlex,
                    $rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$center)
                ]))
            ]), _List_fromArray([
                $author$project$Icon$loading({
                    color: A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0),
                    size: 48
                })
            ]))
        ]);
    };
    var $author$project$Page$User$MsgToLineNotifySetting = function(a) {
        return {
            $: 'MsgToLineNotifySetting',
            a: a
        };
    };
    var $author$project$Page$User$lineNotifySettingButton = function(token) {
        return A2($author$project$Style$mainButton, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$text('LINE Notifyで通知を有効にする')
        ]), $elm$core$Maybe$Just($author$project$Page$User$MsgToLineNotifySetting(token)));
    };
    var $author$project$Page$User$MsgLogOut = {
        $: 'MsgLogOut'
    };
    var $author$project$Page$User$logOutButton = A2($author$project$Style$subButton, _List_fromArray([
        $rtfeldman$elm_css$Html$Styled$text('ログアウトする')
    ]), $author$project$Page$User$MsgLogOut);
    var $author$project$Page$User$MsgToEditMode = {
        $: 'MsgToEditMode'
    };
    var $author$project$Page$User$toEditButton = A2($author$project$Style$mainButton, _List_fromArray([
        $author$project$Icon$edit($rtfeldman$elm_css$Css$batch(_List_fromArray([
            $rtfeldman$elm_css$Css$width($rtfeldman$elm_css$Css$px(32)),
            $rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$px(32))
        ]))),
        $rtfeldman$elm_css$Html$Styled$text('編集する')
    ]), $elm$core$Maybe$Just($author$project$Page$User$MsgToEditMode));
    var $author$project$Page$User$userDataLinkItem = F2(function(link, text) {
        return A2($rtfeldman$elm_css$Html$Styled$a, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$href($author$project$PageLocation$toUrlAsString(link)),
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $rtfeldman$elm_css$Css$textDecoration($rtfeldman$elm_css$Css$none),
                $rtfeldman$elm_css$Css$color(A3($rtfeldman$elm_css$Css$rgb, 0, 0, 0)),
                $rtfeldman$elm_css$Css$backgroundColor(A3($rtfeldman$elm_css$Css$rgb, 153, 153, 153)),
                $rtfeldman$elm_css$Css$padding($rtfeldman$elm_css$Css$px(16)),
                $rtfeldman$elm_css$Css$fontSize($rtfeldman$elm_css$Css$rem(1.5)),
                $rtfeldman$elm_css$Css$textAlign($rtfeldman$elm_css$Css$center)
            ]))
        ]), _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$text(text)
        ]));
    });
    var $author$project$Page$User$dataLinkContainer = function(data) {
        return A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                $author$project$Style$displayGridAndGap(8),
                A4($rtfeldman$elm_css$Css$padding4, $rtfeldman$elm_css$Css$zero, $rtfeldman$elm_css$Css$zero, $rtfeldman$elm_css$Css$px(48), $rtfeldman$elm_css$Css$zero)
            ]))
        ]), A2($elm$core$List$map, function(_v0) {
            var link = _v0.a;
            var text = _v0.b;
            return A2($author$project$Page$User$userDataLinkItem, link, text);
        }, data));
    };
    var $author$project$Page$User$userPrivateDataLink = function(userId) {
        return $author$project$Page$User$dataLinkContainer(_List_fromArray([
            _Utils_Tuple2($author$project$PageLocation$LikedProducts, 'いいねした商品'),
            _Utils_Tuple2($author$project$PageLocation$History, '閲覧した商品'),
            _Utils_Tuple2($author$project$PageLocation$SoldProducts(userId), '出品した商品'),
            _Utils_Tuple2($author$project$PageLocation$BoughtProducts, '購入した商品'),
            _Utils_Tuple2($author$project$PageLocation$TradingProducts, '進行中の取引'),
            _Utils_Tuple2($author$project$PageLocation$TradedProducts, '過去にした取引'),
            _Utils_Tuple2($author$project$PageLocation$CommentedProducts, 'コメントをした商品')
        ]));
    };
    var $rtfeldman$elm_css$Html$Styled$br = $rtfeldman$elm_css$Html$Styled$node('br');
    var $elm$core$List$intersperse = F2(function(sep, xs) {
        if (!xs.b) return _List_Nil;
        else {
            var hd = xs.a;
            var tl = xs.b;
            var step = F2(function(x, rest) {
                return A2($elm$core$List$cons, sep, A2($elm$core$List$cons, x, rest));
            });
            var spersed = A3($elm$core$List$foldr, step, _List_Nil, tl);
            return A2($elm$core$List$cons, hd, spersed);
        }
    });
    var $elm$core$String$lines = _String_lines;
    var $author$project$Page$User$introductionView = A2($elm$core$Basics$composeR, $elm$core$String$lines, A2($elm$core$Basics$composeR, $elm$core$List$map($rtfeldman$elm_css$Html$Styled$text), A2($elm$core$Basics$composeR, $elm$core$List$intersperse(A2($rtfeldman$elm_css$Html$Styled$br, _List_Nil, _List_Nil)), A2($elm$core$Basics$composeR, $rtfeldman$elm_css$Html$Styled$div(_List_Nil), $author$project$Style$titleAndContent('紹介文')))));
    var $author$project$Data$University$universityToJapaneseString = function(university) {
        switch(university.$){
            case 'GraduateTsukuba':
                var graduate = university.a;
                var schoolAndDepartment = university.b;
                return {
                    department: $author$project$Data$University$departmentToJapaneseString(schoolAndDepartment),
                    graduate: $elm$core$Maybe$Just($author$project$Data$University$graduateToJapaneseString(graduate)),
                    school: $elm$core$Maybe$Just($author$project$Data$University$schoolToJapaneseString($author$project$Data$University$schoolFromDepartment(schoolAndDepartment)))
                };
            case 'GraduateNoTsukuba':
                var graduate = university.a;
                return {
                    department: $elm$core$Maybe$Nothing,
                    graduate: $elm$core$Maybe$Just($author$project$Data$University$graduateToJapaneseString(graduate)),
                    school: $elm$core$Maybe$Nothing
                };
            default:
                var schoolAndDepartment = university.a;
                return {
                    department: $author$project$Data$University$departmentToJapaneseString(schoolAndDepartment),
                    graduate: $elm$core$Maybe$Nothing,
                    school: $elm$core$Maybe$Just($author$project$Data$University$schoolToJapaneseString($author$project$Data$University$schoolFromDepartment(schoolAndDepartment)))
                };
        }
    };
    var $author$project$Page$User$universityView = function(university) {
        var _v0 = $author$project$Data$University$universityToJapaneseString(university);
        var graduate = _v0.graduate;
        var school = _v0.school;
        var department = _v0.department;
        return _Utils_ap(function() {
            if (graduate.$ === 'Just') {
                var g = graduate.a;
                return _List_fromArray([
                    A2($author$project$Style$titleAndContent, '研究科', A2($rtfeldman$elm_css$Html$Styled$div, _List_Nil, _List_fromArray([
                        $rtfeldman$elm_css$Html$Styled$text(g)
                    ])))
                ]);
            } else return _List_Nil;
        }(), _Utils_ap(function() {
            if (school.$ === 'Just') {
                var s = school.a;
                return _List_fromArray([
                    A2($author$project$Style$titleAndContent, '学群', A2($rtfeldman$elm_css$Html$Styled$div, _List_Nil, _List_fromArray([
                        $rtfeldman$elm_css$Html$Styled$text(s)
                    ])))
                ]);
            } else return _List_Nil;
        }(), function() {
            if (department.$ === 'Just') {
                var d = department.a;
                return _List_fromArray([
                    A2($author$project$Style$titleAndContent, '学類', A2($rtfeldman$elm_css$Html$Styled$div, _List_Nil, _List_fromArray([
                        $rtfeldman$elm_css$Html$Styled$text(d)
                    ])))
                ]);
            } else return _List_Nil;
        }()));
    };
    var $author$project$Data$User$withProfileGetId = function(_v0) {
        var id = _v0.a.id;
        return id;
    };
    var $author$project$Data$User$withProfileGetImageId = function(_v0) {
        var imageId = _v0.a.imageId;
        return imageId;
    };
    var $author$project$Page$User$userView = F2(function(isWideScreen, userWithProfile) {
        return _Utils_ap(A3($author$project$Page$User$imageAndDisplayNameView, isWideScreen, $author$project$Data$User$withProfileGetImageId(userWithProfile), $author$project$Data$User$withProfileGetDisplayName(userWithProfile)), A2($elm$core$List$cons, $author$project$Page$User$introductionView($author$project$Data$User$withProfileGetIntroduction(userWithProfile)), _Utils_ap($author$project$Page$User$universityView($author$project$Data$User$withProfileGetUniversity(userWithProfile)), _List_fromArray([
            $rtfeldman$elm_css$Html$Styled$text('ユーザーID ' + $author$project$Data$User$idToString($author$project$Data$User$withProfileGetId(userWithProfile)))
        ]))));
    });
    var $author$project$Page$User$normalMyProfileView = F3(function(token, isWideScreen, user) {
        return _Utils_ap(A2($author$project$Page$User$userView, isWideScreen, user), _List_fromArray([
            $author$project$Page$User$userPrivateDataLink($author$project$Data$User$withProfileGetId(user)),
            $author$project$Page$User$lineNotifySettingButton(token),
            $author$project$Page$User$toEditButton,
            $author$project$Page$User$logOutButton
        ]));
    });
    var $author$project$Page$User$userDataLink = function(userId) {
        return $author$project$Page$User$dataLinkContainer(_List_fromArray([
            _Utils_Tuple2($author$project$PageLocation$SoldProducts(userId), '出品した商品')
        ]));
    };
    var $author$project$Page$User$normalView = F2(function(isWideScreen, user) {
        return _Utils_ap(A2($author$project$Page$User$userView, isWideScreen, user), _List_fromArray([
            $author$project$Page$User$userDataLink($author$project$Data$User$withProfileGetId(user))
        ]));
    });
    var $author$project$Page$User$view = F3(function(logInState, isWideScreen, model) {
        return {
            bottomNavigation: $elm$core$Maybe$Just($author$project$BasicParts$User),
            tab: $author$project$BasicParts$tabSingle('プロフィール'),
            title: $elm$core$Maybe$Just(function() {
                switch(model.$){
                    case 'LoadingWithUserId':
                        var id = model.a;
                        return 'ID=' + ($author$project$Data$User$idToString(id) + 'のユーザーページ');
                    case 'LoadingWithUserIdAndName':
                        var withName = model.a;
                        return $author$project$Data$User$withNameGetDisplayName(withName) + 'さんのユーザーページ';
                    case 'Normal':
                        var withProfile = model.a;
                        return $author$project$Data$User$withProfileGetDisplayName(withProfile) + 'さんのユーザーページ';
                    default:
                        return 'プロフィール編集';
                }
            }()),
            view: $author$project$Style$mainView(_List_fromArray([
                $author$project$Style$container(function() {
                    var _v1 = _Utils_Tuple2(logInState, model);
                    switch(_v1.b.$){
                        case 'Normal':
                            if (_v1.a.$ === 'Ok') {
                                var userWithName = _v1.a.a.userWithName;
                                var token = _v1.a.a.token;
                                var normalUser = _v1.b.a;
                                return _Utils_eq($author$project$Data$User$withNameGetId(userWithName), $author$project$Data$User$withProfileGetId(normalUser)) ? A3($author$project$Page$User$normalMyProfileView, token, isWideScreen, normalUser) : A2($author$project$Page$User$normalView, isWideScreen, normalUser);
                            } else {
                                var user = _v1.b.a;
                                return A2($author$project$Page$User$normalView, isWideScreen, user);
                            }
                        case 'LoadingWithUserId':
                            var userId = _v1.b.a;
                            return $author$project$Page$User$loadingWithUserIdView(userId);
                        case 'LoadingWithUserIdAndName':
                            var withName = _v1.b.a;
                            return A2($author$project$Page$User$loadingWithUserIdAndNameView, isWideScreen, withName);
                        default:
                            if (_v1.a.$ === 'Ok') {
                                var token = _v1.a.a.token;
                                var editModel = _v1.b.a;
                                return A2($author$project$Page$User$editView, token, editModel);
                            } else return _List_fromArray([
                                $rtfeldman$elm_css$Html$Styled$text('自分以外のプロフィールは編集できない')
                            ]);
                    }
                }())
            ]))
        };
    });
    var $author$project$Main$titleAndTabDataAndMainView = F5(function(logInState, isWideScreen, nowMaybe, allProductsMaybe, page) {
        switch(page.$){
            case 'PageHome':
                var model = page.a;
                return A2($author$project$Main$mapPageMsg, $author$project$Main$PageMsgHome, A4($author$project$Page$Home$view, logInState, isWideScreen, allProductsMaybe, model));
            case 'PageLikedProducts':
                var model = page.a;
                return A2($author$project$Main$mapPageMsg, $author$project$Main$PageMsgLikedProducts, A3($author$project$Page$LikedProducts$view, logInState, isWideScreen, model));
            case 'PageHistory':
                var model = page.a;
                return A2($author$project$Main$mapPageMsg, $author$project$Main$PageMsgHistory, A3($author$project$Page$History$view, logInState, isWideScreen, model));
            case 'PageBoughtProducts':
                var model = page.a;
                return A2($author$project$Main$mapPageMsg, $author$project$Main$PageMsgBoughtProducts, A4($author$project$Page$BoughtProducts$view, logInState, isWideScreen, allProductsMaybe, model));
            case 'PageSoldProducts':
                var model = page.a;
                return A2($author$project$Main$mapPageMsg, $author$project$Main$PageMsgSoldProducts, A4($author$project$Page$SoldProducts$view, logInState, isWideScreen, allProductsMaybe, model));
            case 'PageTradesInProgress':
                var model = page.a;
                return A2($author$project$Main$mapPageMsg, $author$project$Main$PageMsgTradesInProgress, A3($author$project$Page$TradesInProgress$view, logInState, allProductsMaybe, model));
            case 'PageTradesInPast':
                var model = page.a;
                return A2($author$project$Main$mapPageMsg, $author$project$Main$PageMsgTradesInPast, A3($author$project$Page$TradesInPast$view, logInState, allProductsMaybe, model));
            case 'PageCommentedProducts':
                var model = page.a;
                return A2($author$project$Main$mapPageMsg, $author$project$Main$PageMsgCommentedProducts, A4($author$project$Page$CommentedProducts$view, logInState, isWideScreen, allProductsMaybe, model));
            case 'PageExhibition':
                var model = page.a;
                return A2($author$project$Main$mapPageMsg, $author$project$Main$PageMsgExhibition, A2($author$project$Page$Exhibition$view, logInState, model));
            case 'PageLogIn':
                var model = page.a;
                return A2($author$project$Main$mapPageMsg, $author$project$Main$PageMsgLogIn, $author$project$Page$LogIn$view(model));
            case 'PageProduct':
                var model = page.a;
                return A2($author$project$Main$mapPageMsg, $author$project$Main$PageMsgProduct, A5($author$project$Page$Product$view, logInState, isWideScreen, nowMaybe, allProductsMaybe, model));
            case 'PageTrade':
                var model = page.a;
                return A2($author$project$Main$mapPageMsg, $author$project$Main$PageMsgTrade, A4($author$project$Page$Trade$view, logInState, nowMaybe, allProductsMaybe, model));
            case 'PageUser':
                var model = page.a;
                return A2($author$project$Main$mapPageMsg, $author$project$Main$PageMsgUser, A3($author$project$Page$User$view, logInState, isWideScreen, model));
            case 'PageSearch':
                var model = page.a;
                return A2($author$project$Main$mapPageMsg, $author$project$Main$PageMsgSearch, $author$project$Page$Search$view(model));
            case 'PageSearchResult':
                var model = page.a;
                return A2($author$project$Main$mapPageMsg, $author$project$Main$PageMsgSearchResult, A4($author$project$Page$SearchResult$view, logInState, isWideScreen, allProductsMaybe, model));
            case 'PageNotification':
                var model = page.a;
                return A2($author$project$Main$mapPageMsg, $author$project$Main$PageMsgNotification, $author$project$Page$Notification$view(model));
            default:
                var model = page.a;
                return $author$project$Page$About$view(model);
        }
    });
    var $author$project$Main$view = function(_v0) {
        var record = _v0.a;
        var pageRecord = A5($author$project$Main$titleAndTabDataAndMainView, record.logInState, record.wideScreen, record.now, record.allProducts, record.page);
        return {
            body: _List_fromArray([
                A2($rtfeldman$elm_css$Html$Styled$div, _List_fromArray([
                    $rtfeldman$elm_css$Html$Styled$Attributes$css(_List_fromArray([
                        $author$project$Style$displayGridAndGap(0),
                        $author$project$Style$gridTemplateColumns('max-content 1fr'),
                        $author$project$Style$gridTemplateRows('64px max-content 1fr max-content'),
                        $rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$pct(100)),
                        $rtfeldman$elm_css$Css$overflowWrap($rtfeldman$elm_css$Css$breakWord)
                    ]))
                ]), A2($elm$core$List$cons, A2($rtfeldman$elm_css$Html$Styled$map, $elm$core$Basics$always($author$project$Main$HistoryBack), $author$project$BasicParts$headerWithBackArrow), _Utils_ap(record.wideScreen ? _List_fromArray([
                    $author$project$BasicParts$menu(record.logInState)
                ]) : _List_Nil, _Utils_ap(_List_fromArray([
                    A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Main$PageMsg, $author$project$BasicParts$tabView(pageRecord.tab)),
                    A2($rtfeldman$elm_css$Html$Styled$map, $author$project$Main$PageMsg, pageRecord.view)
                ]), _Utils_ap(function() {
                    var _v1 = record.message;
                    if (_v1.$ === 'Just') {
                        var m = _v1.a;
                        return _List_fromArray([
                            A3($rtfeldman$elm_css$Html$Styled$Keyed$node, 'div', _List_Nil, _List_fromArray([
                                _Utils_Tuple2(m, $author$project$Main$messageView(m))
                            ]))
                        ]);
                    } else return _List_Nil;
                }(), function() {
                    var _v2 = _Utils_Tuple2(record.wideScreen, pageRecord.bottomNavigation);
                    if (!_v2.a && _v2.b.$ === 'Just') {
                        var select = _v2.b.a;
                        return _List_fromArray([
                            A2($author$project$BasicParts$bottomNavigation, record.logInState, select)
                        ]);
                    } else return _List_Nil;
                }())))))
            ]),
            title: pageRecord.title
        };
    };
    var $author$project$Main$main = $elm$browser$Browser$application({
        init: $author$project$Main$init,
        onUrlChange: $author$project$Main$UrlChange,
        onUrlRequest: $author$project$Main$UrlRequest,
        subscriptions: $author$project$Main$subscription,
        update: $author$project$Main$update,
        view: function(model) {
            return {
                body: A2($elm$core$List$map, $rtfeldman$elm_css$Html$Styled$toUnstyled, $author$project$Main$view(model).body),
                title: $author$project$Main$view(model).title
            };
        }
    });
    _Platform_export({
        'Main': {
            'init': $author$project$Main$main(A2($elm$json$Json$Decode$andThen, function(accessToken) {
                return $elm$json$Json$Decode$succeed({
                    accessToken: accessToken
                });
            }, A2($elm$json$Json$Decode$field, 'accessToken', $elm$json$Json$Decode$oneOf(_List_fromArray([
                $elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
                A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, $elm$json$Json$Decode$string)
            ])))))(0)
        }
    });
})($9c85cd53fb472000$exports);



const $80e239b6d01d5815$var$userImageFileResizeAndConvertToDataUrl = (file)=>new Promise((resolve, reject)=>{
        const image = new Image();
        image.addEventListener("load", (e)=>{
            const canvas = document.createElement("canvas");
            const sourceSize = Math.min(image.width, image.height);
            const outputSize = Math.min(sourceSize, 400);
            canvas.width = outputSize;
            canvas.height = outputSize;
            const context = canvas.getContext("2d");
            context.drawImage(image, (image.width - sourceSize) / 2, (image.height - sourceSize) / 2, sourceSize, sourceSize, 0, 0, outputSize, outputSize);
            resolve(canvas.toDataURL("image/png"));
        });
        image.src = window.URL.createObjectURL(file);
    })
;
const $80e239b6d01d5815$var$insideSize = (width, height)=>{
    if (Math.max(width, height) > 1024) {
        if (height < width) return {
            width: 1024,
            height: 1024 * height / width
        };
        return {
            width: 1024 * width / height,
            height: 1024
        };
    }
    return {
        width: width,
        height: height
    };
};
const $80e239b6d01d5815$var$productImageFilesResizeAndConvertToDataUrl = (fileList)=>{
    const result = [];
    for(let i = 0; i < Math.min(5, fileList.length); i += 1){
        const file = fileList.item(i);
        if (file !== null) result.push($80e239b6d01d5815$var$productImageResizeAndConvertToDataUrl(file));
    }
    return Promise.all(result);
};
const $80e239b6d01d5815$var$productImageResizeAndConvertToDataUrl = (file)=>new Promise((resolve, reject)=>{
        const image = new Image();
        image.addEventListener("load", ()=>{
            const canvas = document.createElement("canvas");
            const size = $80e239b6d01d5815$var$insideSize(image.width, image.height);
            canvas.width = size.width;
            canvas.height = size.height;
            const context = canvas.getContext("2d");
            context.drawImage(image, 0, 0, image.width, image.height, 0, 0, size.width, size.height);
            resolve(canvas.toDataURL("image/jpeg"));
        });
        image.src = window.URL.createObjectURL(file);
    })
;
const $80e239b6d01d5815$var$checkFileInput = (id)=>async ()=>{
        const inputElement = document.getElementById(id);
        if (inputElement === null) return;
        if (inputElement.files === null || inputElement.files.length <= 0) {
            window.requestAnimationFrame($80e239b6d01d5815$var$checkFileInput(id));
            return;
        }
        const dataUrls = await $80e239b6d01d5815$var$productImageFilesResizeAndConvertToDataUrl(inputElement.files);
        $80e239b6d01d5815$var$app.ports.receiveProductImages.send(dataUrls);
        inputElement.value = "";
        window.requestAnimationFrame($80e239b6d01d5815$var$checkFileInput(id));
    }
;
/* Elmを起動!! */ const $80e239b6d01d5815$var$app = $9c85cd53fb472000$exports.Elm.Main.init({
    flags: {
        accessToken: localStorage.getItem("accessToken")
    }
});
const $80e239b6d01d5815$var$windowResizeListener = ()=>{
    if (window.innerWidth > 1000) $80e239b6d01d5815$var$app.ports.toWideScreenMode.send(null);
    else $80e239b6d01d5815$var$app.ports.toNarrowScreenMode.send(null);
};
/* ウィンドウサイズのリサイズ情報をElmに送信 */ addEventListener("resize", $80e239b6d01d5815$var$windowResizeListener);
$80e239b6d01d5815$var$windowResizeListener();
/* リフレッシュトークンを保存する */ $80e239b6d01d5815$var$app.ports.saveAccessTokenToLocalStorage.subscribe((accessToken)=>{
    localStorage.setItem("accessToken", accessToken);
});
/* リフレッシュトークンとその他すべてを削除する */ $80e239b6d01d5815$var$app.ports.deleteAllFromLocalStorage.subscribe(()=>{
    localStorage.clear();
});
/* 指定されたidのHTML要素のテキストを変える */ $80e239b6d01d5815$var$app.ports.replaceText.subscribe(({ id: id , text: text  })=>{
    const replaceText = ()=>{
        const element = document.getElementById(id);
        if (element === null) {
            window.requestAnimationFrame(replaceText);
            return;
        }
        element.value = text;
    };
    window.requestAnimationFrame(replaceText);
});
/* 指定されたidの要素のスクロール位置を(0,0)にする */ $80e239b6d01d5815$var$app.ports.mainViewScrollToTop.subscribe(()=>{
    window.requestAnimationFrame(()=>{
        const element = document.getElementById("mainView");
        if (element !== null) element.scroll(0, 0);
    });
});
/* 指定されたidの要素が表示されるようにスクロールさせる */ $80e239b6d01d5815$var$app.ports.elementScrollIntoView.subscribe((id)=>{
    const scrollIntoView = ()=>{
        const element = document.getElementById(id);
        if (element === null) {
            window.requestAnimationFrame(scrollIntoView);
            return;
        }
        element.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    };
    window.requestAnimationFrame(scrollIntoView);
});
/* 指定されたidの要素のselectedIndexを変更する */ $80e239b6d01d5815$var$app.ports.changeSelectedIndex.subscribe(({ id: id , index: index  })=>{
    const changeSelectedIndex = ()=>{
        const element = document.getElementById(id);
        if (element === null) {
            window.requestAnimationFrame(changeSelectedIndex);
            return;
        }
        element.selectedIndex = index;
    };
    window.requestAnimationFrame(changeSelectedIndex);
});
/* 商品画像の入力イベントを設定する */ $80e239b6d01d5815$var$app.ports.addEventListenerForProductImages.subscribe(({ inputId: inputId , labelId: labelId  })=>{
    const addEventListenerForProductImages = async ()=>{
        (await $80e239b6d01d5815$var$checkFileInput(inputId))();
        const labelElement = document.getElementById(labelId);
        if (labelElement === null) {
            window.requestAnimationFrame(addEventListenerForProductImages);
            return;
        }
        labelElement.addEventListener("dragover", (e)=>{
            e.preventDefault();
        });
        labelElement.addEventListener("drop", async (e)=>{
            e.preventDefault();
            if (e.dataTransfer === null) return;
            $80e239b6d01d5815$var$app.ports.receiveProductImages.send(await $80e239b6d01d5815$var$productImageFilesResizeAndConvertToDataUrl(e.dataTransfer.files));
        });
    };
    window.requestAnimationFrame(addEventListenerForProductImages);
});
(async ()=>{
    await navigator.serviceWorker.register(new URL("sw.js", "file:" + __filename), {
        scope: "/"
    });
})();
(()=>{
    const firebaseApp = $6MnZR$firebaseapp.initializeApp({
        projectId: "tsukumart-f0971"
    });
    console.log("firestore run");
    const firestore = $6MnZR$firebasefirestore.getFirestore(firebaseApp);
    const productCollection = $6MnZR$firebasefirestore.collection(firestore, "product");
    console.log("firestore request");
    $80e239b6d01d5815$var$app.ports.startListenRecommendProducts.subscribe(()=>{
        $6MnZR$firebasefirestore.onSnapshot(productCollection, (productsQuerySnapshot)=>{
            console.log("firestore get response");
            $80e239b6d01d5815$var$app.ports.receiveAllProducts.send(productsQuerySnapshot.docs.map($80e239b6d01d5815$var$documentDataToProduct));
        });
    });
})();
const $80e239b6d01d5815$var$documentDataToProduct = (documentSnapshot)=>{
    const data = documentSnapshot.data();
    return {
        id: documentSnapshot.id,
        category: data.category,
        condition: data.condition,
        createdAt: data.createdAt.toMillis(),
        description: data.description,
        imageIds: data.imageIds,
        likedCount: data.likedCount,
        name: data.name,
        price: data.price,
        sellerDisplayName: data.sellerDisplayName,
        sellerId: data.sellerId,
        sellerImageId: data.sellerImageId,
        status: data.status,
        thumbnailImageId: data.thumbnailImageId,
        updateAt: data.updateAt.toMillis()
    };
};


//# sourceMappingURL=index.js.map
