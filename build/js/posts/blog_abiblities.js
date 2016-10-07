/**
 * Created by cls on 16/10/7.
 */
;(function (P, rootHref, R, PS) {

    P.script(document, rootHref + 'build/js/post.js');

    P.ajax(rootHref + 'build/json/survey-14220.csv.json').then(function (rawData) {
        var parsedData = JSON.parse(rawData);

        var data1 = [];

        for (var keys = Object.keys(parsedData.ability), size = keys.length, i = 0; i < size; i++) {
            data1.push({
                axis: keys[i],
                value: parsedData.ability[keys[i]]
            });
        }

        var margin = {top: 100, right: 100, bottom: 100, left: 100},
            width = Math.min(700, document.querySelector('.post-content').offsetWidth - 10) - margin.left - margin.right,
            height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

        //Data
        var data = [data1];

        var color = d3.scale.ordinal()
            .range(["#EDC951","#CC333F","#00A0B0"]);

        var radarChartOptions = {
            w: width,
            h: height,
            margin: margin,
            maxValue: 5,
            levels: 5,
            roundStrokes: true,
            color: color
        };
        //Call function to draw the Radar chart
        RadarChart("#chart", data, radarChartOptions);
    });

})(window.top.ES6Promise.Promise, window.top.Router.rootHref, window.top.Router, window.top.PageSlider);
