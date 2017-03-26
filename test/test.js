"use strict";

// var auditCopy = require('audit-copy');
var discrepances = require('discrepances');

var TimeWarp = require('..');
/*
function compareTest(theObject1, theObject2){
    var result = discrepances(theObject1, theObject2);
    console.log(result,theObject1, theObject2);
    for(var __ in result){
        console.log('DIFS');
        console.log(result);
        throw new Error("differances "+JSON.stringify(result));
    }
}
*/
var compareTest = discrepances.showAndThrow;

var quartersFixtures=[
    {in:'I'          , expected:new Error('not a time string')},
    {in:'2016'       , expected:TimeWarp.JSON4reviver({precision:'year', year:2016})},
    {in:'2016q1'     , expected:TimeWarp.JSON4reviver({precision:'trimester', year:2016, trimester:1})},
    {in:'2016q1'     , expected:TimeWarp.trim({year:2016, trimester:1})},
    {in:'2016Q2'     , expected:TimeWarp.trim({year:2016, trimester:2})},
    {in:'2016 Trim 2', expected:TimeWarp.trim({year:2016, trimester:2})},
    {in:'3 Trim 2016', expected:TimeWarp.trim({year:2016, trimester:3})},
    {in:'I.2017'     , expected:TimeWarp.trim({year:2016, trimester:1})},
    {in:'II. 2017'   , expected:TimeWarp.trim({year:2016, trimester:2})},
    {in:'2017-III'   , expected:TimeWarp.trim({year:2016, trimester:3})},
    {in:'IV 2017'    , expected:TimeWarp.trim({year:2016, trimester:4})},
];

describe("quarters", function(){
    quartersFixtures.forEach(function(fixture){
        if(fixture.skip){
            it(fixture.in);
        }else{
            it(fixture.in, function(){
                try{
                    var obtained = TimeWarp.parse(fixture.in);
                    compareTest(obtained, fixture.expected);
                }catch(err){
                    compareTest(err, fixture.expected);
                }
            });
        }
    });
    it("compare fixtures", function(){
    });
});