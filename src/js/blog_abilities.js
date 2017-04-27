/**
 * Created by cls on 2017/4/26.
 */
;(function (global) {
    function parseData(obj) {
        var ret = [];

        for (var keys = Object.keys(obj), size = keys.length, i = 0; i < size; i++) {
            ret.push({
                axis: keys[i].replace(/或/, '或\n'),
                value: obj[keys[i]]
            });
        }

        return ret;
    }

    function draw(el, title, data, maxSpi) {
        maxSpi = maxSpi || 5;
        var margin = {top: 100, right: 100, bottom: 100, left: 100},
            width = Math.min(700, document.querySelector('.post-content').offsetWidth - 10) - margin.left - margin.right,
            height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

        var color = d3.scale.ordinal()
            .range(["#EDC951", "#00A0B0"]);
        var LegendOptions = ['他人评价', '自我评价'];

        var multiFactor = Math.floor(maxSpi / 5);
        var radarChartOptions = {
            w: width,
            h: height + 10,
            margin: margin,
            maxValue: 5 * (maxSpi % 5 === 0 ? multiFactor : multiFactor + 1),
            levels: 5,
            roundStrokes: true,
            color: color
        };
        //Call function to draw the Radar chart
        RadarChart(el, data, radarChartOptions);

        var svg = d3.select(el + ' > svg');

        //Create the title for the legend
        var text = svg.append("text")
            .attr("class", "title")
            .attr('transform', 'translate(90,20)')
            .attr("x", width - 70)
            .attr("y", 10)
            .attr("font-size", "12px")
            .attr("fill", "#404040")
            .text(title);

        //Initiate Legend
        var legend = svg.append("g")
            .attr("class", "legend")
            .attr("height", 100)
            .attr("width", 200)
            .attr('transform', 'translate(90,40)');

        //Create colour squares
        legend.selectAll('rect')
            .data(LegendOptions)
            .enter()
            .append("rect")
            .attr("x", width - 65)
            .attr("y", function (d, i) {
                return i * 20;
            })
            .attr("width", 10)
            .attr("height", 10)
            .style("fill", function (d, i) {
                return color(i);
            });

        //Create text next to squares
        legend.selectAll('text')
            .data(LegendOptions)
            .enter()
            .append("text")
            .attr("x", width - 52)
            .attr("y", function (d, i) {
                return i * 20 + 9;
            })
            .attr("font-size", "11px")
            .attr("fill", "#737373")
            .text(function (d) {
                return d;
            });
    }

    var parsedData = JSON.parse('{"spi":{"非耳听觉":2,"颅内传心（盗梦空间中的筑梦）":6,"预知（注定的未来）":7,"非心感知（俗称心理感应）":9,"颅内传视":2,"非眼视觉":4,"颅内传力（念力，瞬移）":3,"非身触觉":1,"后瞻（真实的历史）":4,"颅内传味":1},"lawAbility":{"面对一般事物或行为的判断力":3.4545454545454546,"面对一般事物或行为的自我保护能力":3.1818181818181817,"面对重大事物或行为的判断力":3.5454545454545454,"面对重大事物或行为的自我保护能力":3.3636363636363638,"面对较复杂事物或行为的判断力":3.272727272727273,"面对较复杂事物或行为的自我保护能力":3.3636363636363638},"ability":{"想象力":4.454545454545454,"记忆力":4.2727272727272725,"观察能力":3.727272727272727,"联想能力":4.363636363636363,"组织能力":2.909090909090909,"沟通能力":2.909090909090909,"领导能力":3.272727272727273,"创新能力":4.2727272727272725,"学习能力":4.7272727272727275,"号召能力":3.1818181818181817,"适应能力":3.3636363636363638}}');

    draw('#chart1', '个人能力图谱', [parseData(parsedData.ability), parseData({
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
    })]);

    draw('#chart2', '行为能力图谱', [parseData(parsedData.lawAbility), parseData({
        "面对一般事物或行为的判断力": 5,
        "面对一般事物或行为的自我保护能力": 3,
        "面对重大事物或行为的判断力": 3,
        "面对重大事物或行为的自我保护能力": 4,
        "面对较复杂事物或行为的判断力": 4,
        "面对较复杂事物或行为的自我保护能力": 4
    })]);

    var spi = parseData(parsedData.spi), maxSpi = 0;
    for (var i = 0, size = spi.length; i < size; i++ ) {
        if (maxSpi < spi[i].value) {
            maxSpi = spi[i].value;
        }
    }
    draw('#chart3', '可能具有的超能力', [spi, spi], maxSpi);
})(window);
