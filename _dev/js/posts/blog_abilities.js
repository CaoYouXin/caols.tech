/**
 * Created by cls on 16/10/7.
 */
;(function (P, rootHref, R, PS) {

    P.script(document, rootHref + 'build/js/post.js');

    function parseData(obj) {
        var ret = [];

        for (var keys = Object.keys(obj), size = keys.length, i = 0; i < size; i++) {
            ret.push({
                axis: keys[i],
                value: obj[keys[i]]
            });
        }

        return ret;
    }

    P.ajax(rootHref + 'build/json/survey-14220.csv.json').then(function (rawData) {
        var parsedData = JSON.parse(rawData);

        var margin = {top: 100, right: 100, bottom: 100, left: 100},
            width = Math.min(700, document.querySelector('.post-content').offsetWidth - 10) - margin.left - margin.right,
            height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

        //Data
        var data = [parseData(parsedData.ability), parseData({
            "想象力": 4,
            "记忆力": 5,
            "观察能力": 4,
            "联想能力": 4,
            "组织能力": 2,
            "沟通能力": 4,
            "领导能力": 2,
            "创新能力": 4,
            "学习能力": 5,
            "号召能力": 2,
            "适应能力": 3
        })];

        var color = d3.scale.ordinal()
            .range(["#EDC951", "#00A0B0"]);
        var LegendOptions = ['他人评价', '自我评价'];

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

        //Initiate Legend
        var legend = d3.select('#chart > svg').append("g")
                .attr("class", "legend")
                .attr("height", 100)
                .attr("width", 200)
                .attr('transform', 'translate(90,20)');

        //Create colour squares
        legend.selectAll('rect')
            .data(LegendOptions)
            .enter()
            .append("rect")
            .attr("x", width - 65)
            .attr("y", function(d, i){ return i * 20;})
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", function(d, i){ return color(i);});

        //Create text next to squares
        legend.selectAll('text')
            .data(LegendOptions)
            .enter()
            .append("text")
            .attr("x", width - 52)
            .attr("y", function(d, i){ return i * 20 + 9;})
            .attr("font-size", "11px")
            .attr("fill", "#737373")
            .text(function(d) { return d; });
    });

})(window.top.ES6Promise.Promise, window.top.Router.rootHref, window.top.Router, window.top.PageSlider);
