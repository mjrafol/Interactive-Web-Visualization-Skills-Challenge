// Use the D3 library to read in samples.json from the URL
const samples = `https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json`;

// Fetch the JSON data and test slicing function in console
d3.json(samples).then((data) => {
    console.log(data)
    let test = data.samples.filter(entry => entry.id == "940")
    console.log(test[0].sample_values.slice(0,10).reverse())
})


// Initializes the page with a default plot
function init() {
    viewPlot()
  }
  

// Create a function when a data from dropdown is selected (optionChange from HTML)
function optionChanged(){
    viewPlot();
}

// Create a function for the view plot
function viewPlot(){

    // Read the samples.json URL
    d3.json(samples).then((data) => {

        // Set a variable for all names (test ID subject no)
        var sampleIds = data.names;

        // Loop through the names and append as option
        sampleIds.forEach(id => d3.select("#selDataset").append("option").text(id).property("value",id));

        // Set a variable to store the selected test ID
        var currentID = d3.selectAll("#selDataset").node().value;

        // Filter the selected test ID and store in another variable to call later for the charts
        testID = data.samples.filter(entry => entry.id == currentID);

        // Create plotly bar chart based on the selected test ID
        var trace1 = {
            x: testID[0].sample_values.slice(0,10).reverse(),
            y: testID[0].otu_ids.slice(0,10).reverse().map(int => "OTU "+ int.toString()),
            text: testID[0].otu_labels.slice(0,10).reverse(),
            type:"bar",
            orientation: 'h',
            marker: {
                color: 'rgb(239, 150, 132)',
                opacity: 0.8
            }
        };

        var dataPlot = [trace1];

        var layout = {
            title: `Top 10 Bacteria Cultures Found in Test Subject ID No. ${currentID}`,

        };

        Plotly.newPlot("bar", dataPlot, layout);

        // Apply the selected test ID to the metadata demographics
        metaData = data.metadata.filter(entry => entry.id == currentID)

        var demographics = {
            'id: ' : metaData[0].id,
            'ethnicity: ' : metaData[0].ethnicity,
            'gender: ' : metaData[0].gender,
            'age: ': metaData[0].age,
            'location: ': metaData[0].location,
            'bbtype: ' : metaData[0].bbtype,
            'wfreq: ' : metaData[0].wfreq
        }

        panelBody = d3.select("#sample-metadata")

        panelBody.html("")

        Object.entries(demographics).forEach(([key, value]) => {
            panelBody.append('p').attr('style', 'font-weight: bold').text(key + value)
        });

        // Create a plotly bubble chart based on the selected test ID
        var trace2 = {
            x: testID[0].otu_ids,
            y: testID[0].sample_values,
            text: testID[0].otu_labels,
            mode:"markers",
            marker: {
                color: testID[0].otu_ids,
                size : testID[0].sample_values
            }
        };

        var data2 = [trace2]

        var layout2 = {
            title: `OTU ID No. ${currentID}`
        }

        Plotly.newPlot('bubble',data2, layout2)
        console.log(testID)


    });

}

init();
