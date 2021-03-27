



const lastUpdated = document.querySelector("#dateLastUpdated");
const positiveIncrease = document.querySelector("#positiveIncrease");
const deathIncrease = document.querySelector("#deathIncrease");
const hospitalized = document.querySelector("#hospitalized");
const inICU = document.querySelector("#inICU");
const totalPositive = document.querySelector("#totalPositive");
const totalTests = document.querySelector("#totalTests");
const totalDeaths = document.querySelector("#totalDeaths");

var currInfected;
var californiaPop = 39560000;

var yearlyTotals = [];
var yearlyDates = [];
var yearlyRates = [];
var yearlyHospitalized = [];

const getDailyData = async () => {
    try {
        const res = await axios.get('https://api.covidtracking.com/v1/states/CA/current.json')
        return res.data;
    }
    catch (e) {
        console.log("Error", e)
    }

}

const renderDailyData = async () => {
    const data = await getDailyData()
    let date = parseDate(data.lastUpdateEt);
    lastUpdated.innerHTML = date
    positiveIncrease.innerHTML = data.positiveIncrease;
    deathIncrease.innerHTML = data.deathIncrease;
    totalPositive.innerHTML = data.positive;
    totalDeaths.innerHTML = data.death;
    totalTests.innerHTML = data.totalTestResults
    hospitalized.innerHTML = data.hospitalizedCurrently;
    inICU.innerHTML = data.inIcuCurrently;
}

const getHistoricData = async () => {
    try {
        const res = await axios.get('https://api.covidtracking.com/v1/states/CA/daily.json')
        return res.data;
    }
    catch (e) {
        console.log("Error", e)
    }


}

const getCurrentInfected = async () => {
    const data = await getDailyData()
    let currInfectedLoc = parseInt(data.positive);
    currInfected = currInfectedLoc;
}

const getYearlyData = async() => {
    const data = await getHistoricData()
    for (let entry of data){
        let dailyTotal = parseInt(entry.total);
        let dailyDates = parseDate(entry.lastUpdateEt);
        let dailyRates = parseInt(entry.positiveIncrease);
        let dailyHospitalized = parseInt(entry.hospitalizedCurrently)
        yearlyTotals.push(dailyTotal);
        yearlyDates.push(dailyDates);
        yearlyRates.push(dailyRates);
        yearlyHospitalized.push(dailyHospitalized);
    }
    yearlyTotals = yearlyTotals.reverse();
    yearlyDates = yearlyDates.reverse();
    yearlyRates = yearlyRates.reverse();
    yearlyHospitalized = yearlyHospitalized.reverse();
}




function parseDate(string) {
    if (string !== null){
        let i = 0;
    while (string.charAt(i) !== " ") {
        i++;
    }
    let date = string.substr(0, i);
    return date;
    }
    else{
        return ""
    }
    
}


const renderCurrentData = async () => {
    await renderDailyData()
    await getCurrentInfected()
    await getYearlyData();
    loadGraphs();
}


function loadGraphs() {
    var pieChart1 = document.querySelector('#percentInfected').getContext('2d');
    var pieChartData = new Chart(pieChart1, {
        type: 'pie',

        data: {
            labels: ['Estimated % with positive test', 'Estimated % without positive test'],
            datasets: [{
                data: [currInfected, californiaPop],
                backgroundColor: ['rgb(255,64,25)', 'rgb(34,204,0)']
            }],


        },
        options: {
            responsive: true,
            title: {
                display: true,
                position: "top",
                text: "Estimated Percentage of California With Positive Test",
                fontSize: 15,
                fontColor: '#222'
            },
            legend: {
                display: true,
                position: "bottom"
            },
            plugins:{
                labels: {
                    render: 'percentage',
                    fontColor: '#222',
                    fontStyle: 'bold'
                }
            }
        }

    })

    var lineChart1 = document.querySelector('#yearlyTotals').getContext('2d');
    var lineChart1Data = new Chart(lineChart1, {
        type: 'bar',
        data: {
            labels: yearlyDates,
            datasets: [{
                label: 'Daily Positive Total',
                backgroundColor: 'rgb(255,64,25)',
                borderColor: 'rgb(255,64,25)',
                pointBackgroundColor: 'rgb(255, 255, 255)',
                data: yearlyTotals
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                position: "top",
                text: "Positive COVID-19 Cases by Date",
                fontSize: 15,
                fontColor: '#222'
            },
            legend: {
                labels: {
                    fontColor: '#222'
                }
            },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Dates'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Number of Total Cases'
                    }
                }],
            },
            plugins: {
                labels: {
                    render: ''
                }
            }

        }

    })

    var lineChart2 = document.querySelector('#rateOfIncrease').getContext('2d');
    var lineChart2Data = new Chart (lineChart2, {
        type: 'bar',

        data: {
            labels: yearlyDates,
            datasets: [{
                label: 'Daily Increase in Cases',
                backgroundColor: 'rgb(235, 152, 52)',
                borderColor: 'rgb(235, 152, 52)',
                pointBackgroundColor: 'rgb(255, 255, 255)',
                data: yearlyRates
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                position: "top",
                text: "Increase in Positive Covid Tests by Date",
                fontSize: 15,
                fontColor: '#222'
            },
            legend: {
                labels: {
                    fontColor: '#222'
                }
            },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Dates'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Daily Increase in Cases'
                    }
                }],
            }

        }
    })

    var lineChart3 = document.querySelector('#yearlyHospitalized').getContext('2d');
    var lineChart3Data = new Chart (lineChart3, {
        type: 'bar',

        data: {
            labels: yearlyDates,
            datasets: [{
                label: 'Daily Hospitalized',
                backgroundColor: 'rgb(0,255,128)',
                borderColor: 'rgb(0,255,128)',
                pointBackgroundColor: 'rgb(255, 255, 255)',
                data: yearlyHospitalized
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                position: "top",
                text: "Total Number of Hospitalizations by Date",
                fontSize: 15,
                fontColor: '#222'
            },
            legend: {
                labels: {
                    fontColor: '#222'
                }
            },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Dates'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Daily Hospitalized'
                    }
                }],
            }

        }
    })
    
}




//Load visuals

renderCurrentData()
