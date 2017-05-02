"use strict";

var discrepances = require('discrepances');

var TimeWarp = require('..');

var compareTest = discrepances.showAndThrow;

var quartersFixtures=[
    {in:'I'          , tw:new Error('not a time string')},
    {in:'2016'       , text:'2016'   , tw:TimeWarp.JSON4reviver({precision:'year', year:2016})},
    {in:'2016q1'     , text:'2016t1' , tw:TimeWarp.JSON4reviver({precision:'trim', year:2016, trim:1})},
    {in:'2016q2'     , text:'2016t2' , tw:TimeWarp.trim({year:2016, trim:2})},
    {in:'2016Q1'     , tw:TimeWarp.trim({year:2016, trim:1})},
    {in:'2016 Trim 2', tw:TimeWarp.trim({year:2016, trim:2})},
    {in:'3 Trim 2016', tw:TimeWarp.trim({year:2016, trim:3})},
    {in:'I.2017'     , tw:TimeWarp.trim({year:2017, trim:1})},
    {in:'II. 2017'   , tw:TimeWarp.trim({year:2017, trim:2})},
    {in:'2017-III'   , tw:TimeWarp.trim({year:2017, trim:3})},
    {in:'IV 2017'    , tw:TimeWarp.trim({year:2017, trim:4})},
    {in:'I.18'       , tw:TimeWarp.trim({year:2018, trim:1})},
    {in:'I.08'       , tw:TimeWarp.trim({year:2008, trim:1})},
    {in:'IS08'       , tw:TimeWarp.sem({year:2008, sem:1})},
    {in:'1 sem 2015' , text:'2015s1' , tw:TimeWarp.sem({year:2015, sem:1})},
    {in:'14semest II', tw:TimeWarp.sem({year:2014, sem:2})},
    {in:'I.8'        , tw:new Error('invalid year')},
];

describe("quarters", function(){
    quartersFixtures.forEach(function(fixture){
        if(fixture.skip){
            it(fixture.in);
        }else{
            it(fixture.in, function(){
                var obtained;
                try{
                    var obtained = TimeWarp.parse(fixture.in);
                }catch(err){
                    obtained = err;
                }
                compareTest(obtained, fixture.tw);
                if(fixture.text){
                    compareTest(obtained.toString(), fixture.text);
                }
            });
        }
    });
});