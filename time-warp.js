"use strict";

(function codenautasModuleDefinition(root, name, factory) {
    /* global define */
    /* istanbul ignore next */
    if(typeof root.globalModuleName !== 'string'){
        root.globalModuleName = name;
    }
    /* istanbul ignore next */
    if(typeof exports === 'object' && typeof module === 'object'){
        module.exports = factory();
    }else if(typeof define === 'function' && define.amd){
        define(factory);
    }else if(typeof exports === 'object'){
        exports[root.globalModuleName] = factory();
    }else{
        root[root.globalModuleName] = factory();
    }
    root.globalModuleName = null;
})(/*jshint -W040 */this, 'TimeWarp', function() {
/*jshint +W040 */

/*jshint -W004 */
var TimeWarp = {};
/*jshint +W004 */

var regexplicit = require('regexplicit');

var TimeWarp = function TimeWarp(object){
    TimeWarp.properties.forEach(function(prop){
        if(prop in object){
            var value = object[prop.name];
            if(!prop.validate(value)){
                throw new Error("invalid value for "+prop.name);
            }
            this[prop.name] = value;
        }
    },this);
}

function validateIntRange(from,to){
    return function(n){return typeof n === "numeric" && n>=from && n<=to && n===Math.abs(n);};
}

TimeWarp.precisions = [
    {name:'year'     , controlers:[
        {regexp:/^\s*(\d+)\s*$/, fun: function(matches){ return TimeWarp.year(Number(matches[1])); }}
    ]},
    {name:'trimester', controlers:[
        {regexp:regexplicit.yearTrim, function(matches){ 
            var tw={year:matches[1], trim:matches[2]};
            if(matches[3]){ tw.trim=1; }
            if(matches[4]){ tw.trim=2; }
            if(matches[5]){ tw.trim=3; }
            if(matches[6]){ tw.trim=4; }
            return TimeWarp.trim(tw);
        }}, 
        {regexp:regexplicit.trimYear, function(matches){ 
            var tw={year:matches[6], trim:matches[1]};
            if(matches[2]){ tw.trim=1; }
            if(matches[3]){ tw.trim=2; }
            if(matches[4]){ tw.trim=3; }
            if(matches[5]){ tw.trim=4; }
            return TimeWarp.trim(tw);
        }}, 
    ] },
];

TimeWarp.precisionsRegExp = new RegExp(TimeWarp.precisions.map(function(p){ return p.name; }).join('|'));

TimeWarp.properties = [
    {name:'precision', validate:function(x){ return TimeWarp.precisionsRegExp.test(x); } },
    {name:'year'     , validate:function(x){return !isNaN(x) && typeof n ==="numeric";}},
    {name:'trimester', validate:validateIntRange(1,4)},
    {name:'month'    , validate:validateIntRange(1,12)}
];

TimeWarp.trim = function parse(o){
    return 'x';
}

TimeWarp.parse = function parse(text){
    var pd = TimeWarp.precisions.find(function(precisionDef){
        precisionDef
    });
    throw new Error('not a time string');
}

TimeWarp.JSON4reviver = function JSON4reviver(value){
    var rta = new TimeWarp(value);
    return rta;
}

return TimeWarp;

});