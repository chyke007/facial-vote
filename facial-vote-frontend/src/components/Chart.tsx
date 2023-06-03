import { Chart } from "react-google-charts";

interface Charts {
  chart: {
    chartType: unknown,
    data: unknown,
    options: unknown,
    width: string,
    height: string
  }
}

const charts = (prop: Charts) => {
  return (
    <Chart
      chartType={prop.chart.chartType as unknown as any}
      data={prop.chart.data as unknown as any}
      options={prop.chart.options as unknown as any}
      width={prop.chart.width}
      height={prop.chart.height}
    />
  )
}
export default charts