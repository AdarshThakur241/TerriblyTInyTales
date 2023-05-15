import React, { useState } from 'react';
import Chart from 'chart.js/auto';
import { saveAs } from 'file-saver';
import './Counting.css';

function Counting() {
  const [histogramData, setHistogramData] = useState(null);

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

  const handleExport = () => {
    if (histogramData) {
      const csv = `Word,Frequency\n${histogramData.labels.map((label, i) => `"${label}",${histogramData.data[i]}`).join('\n')}`;
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, 'histogram.csv');
    }
  };

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

  return (
    <div>
     <button onClick={handleFetchData}>
    Submit
</button>
     
      {histogramData && (
        <div>
          <canvas id="myChart"></canvas>

<button class="button" onClick={handleExport}>   
   <svg viewBox="0 0 16 16" fill="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg" class="svgIcon">
  <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 6.854-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708z"></path>
</svg>

</button>

        
        </div>
      )}
    </div>
  );
}

export default Counting;
