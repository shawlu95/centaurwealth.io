import { useEffect } from 'react';
import { getTimeline, setRange } from '../features/chart/chartSlice';
import { useSelector, useDispatch } from 'react-redux';
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
  const dispatch = useDispatch();
  const { points, range } = useSelector((store) => store.chart);
  const { user } = useSelector((store) => store.user);

  useEffect(() => {
    if (user) {
      dispatch(getTimeline());
    }
  }, [range, user]);

  const data = buildDatasets(points);
  return (
    <div>
      <div className='form-group'>
        <select
          className='form-control'
          onChange={(e) => dispatch(setRange({ range: e.target.value }))}
          value={range}
        >
          <option value='1m'>1 Month</option>
          <option value='3m'>3 Months</option>
          <option value='6m'>6 Months</option>
          <option value='ytd'>YTD</option>
          <option value='1y'>1 Year</option>
          <option value='all'>All-time</option>
        </select>
      </div>
      <Line data={data} width={400} height={300} />
    </div>
  );
};

export default Timeline;
