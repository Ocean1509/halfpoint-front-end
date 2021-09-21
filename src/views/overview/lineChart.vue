<template>
  <v-chart class="chart" :option="options" height="400" width="700"/>
</template>

<script>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import { LineChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";

use([
  CanvasRenderer,
  PieChart,
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
]);

export default {
  name: "LineChart",
  components: {
    VChart,
  },
  props: ['options'],
  provide: {
    // [THEME_KEY]: "dark",
  },
  data() {
    return {}
  },
  mounted() {
    console.log(this.options)
  }
};
</script>

<style scoped>
.chart {
  height: 100%;
}
</style>

<style>
body {
  margin: 0;
}
</style>
