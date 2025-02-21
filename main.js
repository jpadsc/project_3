import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

async function StressData() {
    try {
      const response = await fetch('./data/P3Mid1.json');
      const weatherData = await response.json();
      return weatherData;
    } catch (error) {
      console.error('Error loading weather data:', error);
    }
}
  
const stressdata = await StressData();

  
const Mid1scores = [78, 82, 77, 75, 67, 71, 64, 92, 80, 89];
const Mid2scores = [82, 85, 90, 77, 77, 64, 33, 88, 39, 64];
const Finalscores = [91, 90, 94, 74.5, 78.5, 87.5, 55, 92, 63, 58];



const stresslevels = [0.325916249110957,
    0.1645448589072247,
    0.23662736144602975,
    0.3399083703901657,
    0.14728593881887303,
    0.5924178830280886,
    0.15194721944079942,
    0.42062218482873776,
    0.16641807828795618,
    0.20157073417477803];


const m2stresslevels = [0.11659085389399006,
    0.12560107292698297,
    0.5720111552990558,
    0.49674516271211766,
    0.37560913175907623,
    0.205339090329287,
    0.26333118673849215,
    0.10869366073534947,
    0.3167008740322159,
    0.16907275250649473];

const fstresslevels = [0.1029258996911766,
    0.07829707457694014,
    0.16966588201349686,
    0.5262563942197439,
    0.5420325832281334,
    0.12972197444633732,
    0.21214585590319757,
    0.5342068278549975,
    0.4012330654289485,
    0.1110962572190138]; 

const students = ['Student 1', 'Student 2', 'Student 3', 'Student 4', 'Student 5', 'Student 6', 'Student 7', 'Student 8', 'Student 9', 'Student 10'];

const width = 907;
const height = 300;
const margin = { top: 20, right: 20, bottom: 30, left: 40 };


const svg = d3.select('#stress-graph');

var current_scores = Mid1scores;
var current_stress = stresslevels;

// Make an x scale of for a barchart containing students 1 to 10
const xScale = d3.scaleBand()
    .domain(students)
    .range([margin.left, width - margin.right])
    .padding(0.2);
// Make a y scale for the barchart containing the stress levels
const yScale = d3.scaleLinear()
    .domain([0, d3.max(stresslevels)])
    .range([height - margin.bottom, margin.top]);


svg.attr('width', width);
svg.attr('height', height);

// Draw the x-axis
svg.append('g')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(xScale));

// Draw the y-axis
svg.append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale))
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '0.71em')
    .attr('text-anchor', 'end')


// add a tooltip div to the body and make it invisible by default,
// style it so it looks nice
const tooltip = d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('padding', '3px')
    .style('background', 'white')
    .style('border', '1px solid black')
    .style('border-radius', '2px')
    .style('pointer-events', 'none')
    .style('opacity', 0);

svg.on('mousemove', function(event) {
    tooltip.style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY + 10) + 'px');
});

// Draw the bars
svg.selectAll('rect')
    .data(stresslevels)
    .join('rect')
    .attr('x', (d, i) => xScale(students[i]))
    .attr('y', d => yScale(d))
    .attr('width', xScale.bandwidth())
    .attr('height', d => height - margin.bottom - yScale(d))
    .attr('fill', 'steelblue')
    .on('mouseover', function(event, d) {
        d3.select(this)
            .attr('fill', 'orange');
        
        tooltip.style('opacity', 1).text(d.toFixed(4) + '  Avg EDA (stress level).' + "  Score:" + current_scores[findIndexs(d)]);   
    })
    .on('mouseout', function(event, d) {
        d3.select(this)
            .attr('fill', 'steelblue');
        tooltip.style('opacity', 0);
    });


const score_filter_button = d3.select('#score_filter');

// make a funtion that returns the indeces of all values lower than score in Mid1scores
function filterScores(score) {
    return current_scores.map((d, i) => d < score ? i : -1).filter(d => d !== -1);
}

// make a function that takes an array of indeces and return a copy of stresslevels with the values at those indeces replaced with 0
function filterStress(indeces) {
    return current_stress.map((d, i) => indeces.includes(i) ? 0 : d);
}


score_filter_button.on('click', function() {
    var minimum_score = d3.select('#min_score').node().value;
    var bad_indeces  = filterScores(minimum_score);
    var new_stress = filterStress(bad_indeces);

    // reDraw the bars with the new_stress levels
    svg.selectAll('rect')
        .data(new_stress)
        .join('rect')
        .attr('x', (d, i) => xScale(students[i]))
        .attr('y', d => yScale(d))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - margin.bottom - yScale(d))
        .attr('fill', 'steelblue')
        .on('mouseover', function(event, d) {
            d3.select(this)
                .attr('fill', 'orange');
            
            tooltip.style('opacity', 1).text(d.toFixed(4) + '  Avg EDA (stress level)' + "  Score:" + current_scores[findIndexs(d)]);   
        })
        .on('mouseout', function(event, d) {
            d3.select(this)
                .attr('fill', 'steelblue');
            tooltip.style('opacity', 0);
        });
    

});

const current_exam = d3.select('#current_exam'); 

// make a function that whenever the currentt_exam select item is cahnge, it logs the current exam value
current_exam.on('change', function() {
    var exam = d3.select(this).node().value;
    if (exam === 'Mid1') {
        current_scores = Mid1scores;
        current_stress = stresslevels;
    } else if (exam === 'Mid2') {
        current_scores = Mid2scores;
        current_stress = m2stresslevels;
    } else {
        current_scores = Finalscores;
        current_stress = fstresslevels;
    }

    // reDraw the bars using current_stress as data
    svg.selectAll('rect')
        .data(current_stress)
        .join('rect')
        .attr('x', (d, i) => xScale(students[i]))
        .attr('y', d => yScale(d))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - margin.bottom - yScale(d))
        .attr('fill', 'steelblue')
        .on('mouseover', function(event, d) {
            d3.select(this)
                .attr('fill', 'orange');
            
            tooltip.style('opacity', 1).text(d.toFixed(4) + '  Avg EDA (stress level)' + "  Score:" + current_scores[findIndexs(d)]);   
        })
        .on('mouseout', function(event, d) {
            d3.select(this)
                .attr('fill', 'steelblue');
            tooltip.style('opacity', 0);
        });


});

// write a function that takes a value from stresslevel and returns its index in stresslevels
function findIndexs(value) {
    return current_stress.findIndex(d => d === value);
}