import { Chart } from "react-google-charts";
const charts = (prop: any) => {
  return (
    <Chart
      chartType={prop.chart.chartType}
      data={prop.chart.data}
      options={prop.chart.options}
      width={prop.chart.width}
      height={prop.chart.height}
    />
  )
}
export default charts