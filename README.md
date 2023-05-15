Deployed Link: https://luminous-jalebi-97cfb9.netlify.app/


Libraries and plugins used:

1.Chart.js(for histogram)

2.file-saver(for saving the file on the client side)

******************************************************************************************************************************************

const handleFetchData = () => {
    fetch('https://www.terriblytinytales.com/test.txt')
      .then(response => response.text())
      .then(text => {
        const words = text.split(' ')
          .map(word => word.trim())
          .filter(word => word.length > 0)
          .map(word => {
            let cleanedWord = '';
            for (let i = 0; i < word.length; i++) {
              const char = word[i].toLowerCase();
              if (char >= 'a' && char <= 'z') {
                cleanedWord += char;
              }
            }
            return cleanedWord;
          })
          .filter(word => word.length > 0);

        const freqMap = new Map();
        words.forEach(word => {
          const count = freqMap.get(word) || 0;
          freqMap.set(word, count + 1);
        });

        const sortedWords = [...freqMap.entries()].sort(
          ([, countA], [, countB]) => countB - countA
        );

        const maxWords = sortedWords.slice(0, 20);

        const labels = maxWords.map(([word]) => word);
        const data = maxWords.map(([word, count]) => count);

        setHistogramData({ labels, data });
      })
      .catch(error => {
        console.error('Failed to fetch data:', error);
      });
  };

This handlefetchData() function fetches data from terribly tiny tales given URL and expects the data to be in text format. 
First, the text is split into individual words and any unnecessary spaces or characters are removed. The words are then claned by converting them to lowercase and removing non-alphabetic characters. Afterwards, the function counts the frequency of each word in the text and sorts them in descending order based on their counts. The top 20 words with the highest counts are selected.Finally, the function separates the selected words and their counts into separate arrays. These arrays are used to create a histogram, where the words are displayed as labels and their counts are represented as data. If there are any errors during the fetching or processing of the data, an error message is logged.

******************************************************************************************************************************************

const handleExport = () => {
    if (histogramData) {
      const csv = `Word,Frequency\n${histogramData.labels.map((label, i) => `"${label}",${histogramData.data[i]}`).join('\n')}`;
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, 'histogram.csv');
    }
  };

This handleExport() function handles the export of histogram data as a CSV file. It checks if there is available data in the histogramData variable before moving forward with export. The function creates a CSV string by combining the word and frequency values from the histogramData object. Each line represents a word and its corresponding frequency, with the word enclosed in double quotes and separated by a comma.A Blob object is generated using the CSV string and assigned the MIME type 'text/csv;charset=utf-8'.
Finally, the saveAs function is called to initiate the download of the CSV file. The Blob object containing the CSV data is passed as the first parameter, and the desired filename 'histogram.csv' is provided as the second parameter.

******************************************************************************************************************************************

React.useEffect(() => {
    if (histogramData) {
      const ctx = document.getElementById('myChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: histogramData.labels,
          datasets: [{
            barPercentage: 1.25,
            label: 'Word Frequency',
            data: histogramData.data,
            backgroundColor: '#DBDFAA',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              title:{
                display: true,
                text: "Frequency",
              },
              beginAtZero: true,
            }
          }
        }
      });
    }
  }, [histogramData]);

In this useEffect hook builds a bar chart using Chart.js to visualize the histogram data. Whenever the histogramData variable changes, the chart is updated to reflect the new data accordingly.
