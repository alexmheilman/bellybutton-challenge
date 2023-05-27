// json data 
let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Create Charts
function createCharts(id) {
    // read json data and filter on ID 
    d3.json(url).then(function(data){
        let samples = data.samples;
        let filterArray = samples.filter(item =>
            item.id == id);
        let selectSample = filterArray[0];
        
        //store for plotting
        let ids = selectSample.otu_ids;
        let labels = selectSample.otu_labels;
        let values = selectSample.sample_values;
        
        // bar chart
        let yValues = ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();
        let xValues = values.slice(0,10).reverse();
        let text = labels.slice(0,10).reverse();

        let barData = {
            y:yValues,
            x:xValues,
            text:text,
            type:'bar',
            orientation:'h',
            marker:{
                color:'light blue'
            }
        };
        let barLayout = {
            autosize: false,
            width: 475,
            height: 750,
            margin: {
            l: 75,
            r: 50,
            b: 200,
            t: 10,
            pad: 4
            },
            barmode: 'group',
        };
        Plotly.newPlot("bar", [barData], barLayout);

        // Bubble Chart
        let bubbleData = {
            x:ids,
            y:values,
            text:labels,
            mode:'markers',
            marker:{
                color:ids,
                size:values
            }
        }
        let bubbleLayout = {
            autosize: false,
            width: 1100,
            height: 500,
            margin: {
              l: 50,
              r: 50,
              b: 100,
              t: 30,
              pad: 4
            },
            showlegend: false,
        };
        Plotly.newPlot("bubble", [bubbleData], bubbleLayout)
    })
}

// Charts init
function init() {
    // dropdown options 
    d3.json(url).then(function(data){
        let nameList = data.names;
        for (let i = 0; i < nameList.length; i++) {
            d3.select("#selDataset")
                .append("option")
                .text(nameList[i])
                .property("value", nameList[i])
        }

    // first ID 
        let firstID = nameList[0];
        createCharts(firstID);
        Demographics(firstID)
    })
}

// Get demographic info
function Demographics(id) {
    d3.json(url).then(function(item){
        // log metadata
        let metadata = item.metadata;
        // ID filter
        sampleArray = metadata.filter(item => item.id == id);
        let selectSample = sampleArray[0];
        //select panel
        let panel = d3.select("#sample-metadata");
        panel.html("");
        //put options in panel
        Object.entries(selectSample).forEach(([key,value]) =>{
            panel.append('div').text(`${key}: ${value}`);
        })
    })
}

// dropdown function
function optionChanged(id){
    createCharts(id);
    Demographics(id);
    buildGauge(id);
};

init();