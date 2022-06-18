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

const Timeline = ({ points }) => {
  const data = buildDatasets(points);
  return (
    <div>
      <Line data={data} width={400} height={200} />
    </div>
  );
};

export default Timeline;
