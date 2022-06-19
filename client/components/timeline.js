import axios from 'axios';
import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import { Line } from 'react-chartjs-2';

const basicOptions = {
  label: 'default',
  fill: false,
  lineTension: 0.1,
  pointBorderWidth: 1,
  pointHoverRadius: 5,
  pointHoverBorderWidth: 2,
  pointRadius: 1,
  pointHitRadius: 10,
  data: [],
};

const buildOptions = ({ label, color, data }) => {
  const rgb = color.join(',');
  return {
    ...basicOptions,
    label,
    data,
    backgroundColor: `rgba(${rgb},0.4)`,
    borderColor: `rgba(${rgb},1)`,
  };
};

const buildDatasets = (points) => {
  const labels = points.map((point) => point.date.split('T')[0]);
  const asset = points.map((point) => point.asset);
  const liability = points.map((point) => point.liability);
  const networth = points.map((point) => point.networth);

  return {
    labels,
    datasets: [
      buildOptions({ label: 'asset', data: asset, color: [53, 162, 235] }),
      buildOptions({
        label: 'liability',
        data: liability,
        color: [255, 99, 132],
      }),
      buildOptions({
        label: 'networth',
        data: networth,
        color: [75, 192, 192],
      }),
    ],
  };
};

const Timeline = () => {
  const format = (date) => date.toISOString().split('T')[0];
  const yearFirstDay = new Date(new Date().getFullYear(), 0, 1);
  const [points, setPoints] = useState([]);
  const [range, setRange] = useState('all');

  const getDate = (value) => {
    var date = new Date();
    switch (value) {
      case 'ytd':
        date = yearFirstDay;
        break;
      case '1m':
        date.setMonth(date.getMonth() - 1);
        break;
      case '3m':
        date.setMonth(date.getMonth() - 3);
        break;
      case '6m':
        date.setMonth(date.getMonth() - 6);
        break;
      case '1y':
        date.setFullYear(date.getFullYear() - 1);
        break;
      case 'all':
        date.setFullYear(1970);
        break;
    }
    return format(date);
  };

  const fetchData = async () => {
    const {
      data: { points },
    } = await axios.get('/api/timeline', { params: { start: getDate(range) } });
    setPoints(points);
  };

  useEffect(() => {
    fetchData();
    return () => {
      console.log('Cleanup chart');
    };
  }, [range]);

  const data = buildDatasets(points);
  return (
    <div>
      <div className='form-group'>
        <select
          className='form-control'
          onChange={(e) => setRange(e.target.value)}
          value={range}
        >
          <option value='1m'>1 Month</option>
          <option value='3m'>3 Months</option>
          <option value='6m'>6 Months</option>
          <option value='ytd' selected>
            YTD
          </option>
          <option value='1y'>1 Year</option>
          <option value='all'>All-time</option>
        </select>
      </div>
      <Line data={data} width={400} height={200} />
    </div>
  );
};

export default Timeline;
