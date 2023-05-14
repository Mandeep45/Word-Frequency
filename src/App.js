import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const URL = 'https://www.terriblytinytales.com/test.txt';

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(URL);
      const words = response.data.split(/\s+/);
      const frequency = {};
      words.forEach(word => {
        const lowerCaseWord = word.toLowerCase();
        frequency[lowerCaseWord] = (frequency[lowerCaseWord] || 0) + 1;
      });
      const sortedFrequency = Object.entries(frequency).sort((a, b) => b[1] - a[1]).slice(0, 20);
      setData(sortedFrequency);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const csv = Papa.unparse(data, { header: true });
    const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const csvURL = window.URL.createObjectURL(csvData);
    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'histogram.csv');
    tempLink.click();
  };

  return (
    <div>
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Loading...' : 'Submit'}
      </button>
      {data.length > 0 && (
        <div>
          <BarChart width={800} height={400} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="0" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="1" fill="#FBB917" />
          </BarChart>
          <button onClick={handleExport}>Export</button>
        </div>
      )}
    </div>
  );
};

export default App;