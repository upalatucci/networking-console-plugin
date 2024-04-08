import { global_palette_black_300 as globalBlack300 } from '@patternfly/react-tokens/dist/js/global_palette_black_300';

const pfDependentAxisTickLabels = {
  fill: 'var(--pf-v5-global--Color--200)',
  fontFamily: 'var(--pf-v5-chart-global--FontFamily)',
  letterSpacing: 'var(--pf-v5-chart-global--letter-spacing)',
  padding: 5,
};

const axisTicks = {
  size: 5,
  stroke: globalBlack300.value,
  strokeWidth: 1,
};

export const areaTheme = {
  area: {
    style: {
      data: {
        fillOpacity: 0.15,
      },
    },
  },
  chart: {
    padding: {
      bottom: 30,
      left: 60,
      right: 10,
      top: 0,
    },
  },
  dependentAxis: {
    style: {
      axis: {
        stroke: 'EDEDED',
        strokeWidth: 2,
      },
      grid: { stroke: '#EDEDED' },
      tickLabels: pfDependentAxisTickLabels,
      ticks: axisTicks,
    },
  },
};
