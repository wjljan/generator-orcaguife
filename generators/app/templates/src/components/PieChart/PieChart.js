import React, {Component} from 'react';
import echarts from 'echarts';

export default class PieChart extends Component {
    constructor (props) {
        super(props);
        let {option: {width = '100%', height = '100%', title, tooltip, legend = {}, series = [], resizeDelay = 16.67}} = this.props;
        this.state = {
            width,
            height,
            title,
            tooltip,
            legend,
            series: this.makeSeries(series, this.props),
            resizeDelay,
        };
        this.resizeChart = this.resizeChart.bind(this);
    }

    componentDidMount (){
        this.renderChart();
        window.addEventListener('resize', this.resizeChart);
    }

    componentWillUnmount (){
        window.removeEventListener('resize', this.resizeChart);
    }

    async componentWillReceiveProps(nextProps){
        let {option: {series}} = nextProps;
        await this.setState({
            series: this.makeSeries(series, nextProps)
        });
        this.updateChart(this.state);
    }

    makeSeries (series, props){
        let {option: {formatter = '',}} = props;
        return series.map(series => {
            series['radius'] = ['70%', '100%'];
            series['hoverAnimation'] = false;
            series['itemStyle'] = {
                normal: {
                    label: {
                        show: false
                    }
                }
            };
            series.data.forEach((data, i) => {
                data['itemStyle'] = {
                    normal : {
                        label: i === 0 && {
                            show: true,
                            position: 'center',
                            formatter,
                            textStyle: {
                                baseline : 'bottom'
                            }
                        },
                        labelLine: {
                            show: false
                        }
                    },
                };
            });
            return series;
        });
    }

    generateOption ({title, legend, tooltip}){
        return {
            title,
            tooltip,
            legend: {
                orient: 'vertical',
                x: 'left',
                data: legend.data
            },
            calculable: true,
            series: this.state.series
        };
    }

    renderChart (){
        this._chartInstance = echarts.init(this.chartWrapper);
        this._chartInstance.setOption(this.generateOption(this.state));
    }

    updateChart (data){
        this._chartInstance.setOption(this.generateOption(data));
    }

    resizeChart (){
        this.timer && clearTimeout(this.timer);
        let {resizeDelay} = this.state;
        // should do it after all animations that will affect the width calculation are done
        this.timer = setTimeout(this._chartInstance.resize, resizeDelay);
    }

    render (){
        return (
            <div
                className="fs-chart-content"
                style={{width: this.state.width, height: this.state.height + 'px'}}
                ref={chartWrapper => this.chartWrapper = chartWrapper}
            >
                Sorry, your browser does not support canvas, so please replace it with modern browsers that support HTML5 standards.
            </div>
        );
    }
}