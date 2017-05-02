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

require('lazy-some').bindToPrototypeIn(Array);

var likeAr = require('like-ar');

var regexplicit = require('regexplicit');

var changing = require('best-globals').changing;

TimeWarp = function TimeWarp(object, precision){
    likeAr(TimeWarp.property).forEach(function(prop, name){
        if(name in object){
            var value = object[name];
            if(!prop.text){
                value = Number(value);
            }
            if(!prop.validate(value)){
                throw new Error("invalid value for "+name);
            }
            this[name] = value;
        }
    },this);
    if(!('precision' in this) && precision){
        this.precision = precision;
    }
    likeAr(object).forEach(function(value, name){
        if(!(name in TimeWarp.property[this.precision].property)){
            throw new Error("invalid property "+name+" for "+this.precision);
        }
    },this);
    TimeWarp.property.precision.validate(this.precision);
};

function validateIntRange(from,to){
    return function(n){return n>=from && n<=to && n===Math.abs(n);};
}

TimeWarp.precisions = [
    {name:'year'     , controlers:[
        {regexp:/^\s*(\d+)\s*$/, match2tw: function(matches){ return TimeWarp.year(Number(matches[1])); }}
    ]},
    {name:'trim', controlers:[
        {regexp:regexplicit.yearTrim, match2tw: function(matches){ 
            var tw={year:matches[1], trim:matches[2]};
            if(matches[3]){ tw.trim=1; }
            if(matches[4]){ tw.trim=2; }
            if(matches[5]){ tw.trim=3; }
            if(matches[6]){ tw.trim=4; }
            return TimeWarp.trim(tw);
        }}, 
        {regexp:regexplicit.trimYear, match2tw: function(matches){ 
            var tw={year:matches[6], trim:matches[1]};
            if(matches[2]){ tw.trim=1; }
            if(matches[3]){ tw.trim=2; }
            if(matches[4]){ tw.trim=3; }
            if(matches[5]){ tw.trim=4; }
            return TimeWarp.trim(tw);
        }}, 
    ] },
    {name:'sem', controlers:[
        {regexp:regexplicit.yearSem, match2tw: function(matches){ 
            var tw={year:matches[1], sem:matches[2]};
            if(matches[3]){ tw.sem=1; }
            if(matches[4]){ tw.sem=2; }
            return TimeWarp.sem(tw);
        }}, 
        {regexp:regexplicit.semYear, match2tw: function(matches){ 
            var tw={year:matches[4], sem:matches[1]};
            if(matches[2]){ tw.sem=1; }
            if(matches[3]){ tw.sem=2; }
            return TimeWarp.sem(tw);
        }}, 
    ] },
];

TimeWarp.precisionsRegExp = new RegExp(TimeWarp.precisions.map(function(p){ return p.name; }).join('|'));

TimeWarp.property = {
    precision: {validate:function(x){ return TimeWarp.precisionsRegExp.test(x); }, text:true, skipInToString:true},
    year     : {validate:function(x){ return !isNaN(x) && typeof x === "number";}, property:{precision:true, year:true}, prefix:''},
    trim     : {validate:validateIntRange(1,4) , property:{precision:true, year:true, trim :true}, prefix:'t'},
    sem      : {validate:validateIntRange(1,2) , property:{precision:true, year:true, sem  :true}, prefix:'s'},
    month    : {validate:validateIntRange(1,12), property:{precision:true, year:true, month:true}, prefix:'-'}
};

TimeWarp.year = function parse(year){
    return new TimeWarp({year:year}, 'year');
};

function completeYearAndValidateMinimumLength(o){
    if(o.year<100 && o.year>=0){
        if(typeof o.year === "string" && o.year.length<2){
            throw new Error('invalid year');
        }
        return changing(o,{year:2000+Number(o.year)});
    }
    return o;
}

TimeWarp.trim = function parse(o){
    o=completeYearAndValidateMinimumLength(o);
    return new TimeWarp(o,'trim');
};

TimeWarp.sem = function parse(o){
    o=completeYearAndValidateMinimumLength(o);
    return new TimeWarp(o,'sem');
};

TimeWarp.parse = function parse(text){
    var pc = TimeWarp.precisions.lazySome(function(precisionDef){
        var result = precisionDef.controlers.lazySome(function(controler){
            var match=text.match(controler.regexp);
            return match && {controler:controler, match:match};
        });
        return result && {precision:precisionDef, controler:result.controler, match:result.match};
    });
    if(pc){
        return pc.controler.match2tw(pc.match);
    }else{
        throw new Error('not a time string');
    }
};

TimeWarp.JSON4reviver = function JSON4reviver(value){
    var rta = new TimeWarp(value);
    return rta;
};

TimeWarp.prototype.toString = function toString(){
    return likeAr(TimeWarp.property).map(function(prop, name){
        if(prop.skipInToString){
            return '';
        }
        if(name in this){
            return prop.prefix+this[name];
        }else{
            return '';
        }
    },this).join('');
};

return TimeWarp;

});