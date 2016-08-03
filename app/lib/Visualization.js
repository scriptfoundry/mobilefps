import React from 'react';
import axios from 'axios';
import {PerformanceChart} from './PerformanceChart';
import {Filter} from './Filter';
import {Report} from './Report';


export class Visualization extends React.Component {
    constructor (...props) {
        super(...props);

        this.state = {
            agents: {},
            devices: { modelsByMaker: {}, versionsByOSName: {}, versionsByBrowserName: {}, modelsByDeviceVendor: {} },
            reports: []
        };
    }
    componentWillMount() {
        this.loadData();
    }

    loadData () {
        axios.get('/api/devices')
            .then(response => {
                this.setDevices(response.data);
                return axios.get('/api/summaries');
            })
            .then(response => {
                this.setReports(response.data);
            });
    }

    setDevices (devices) {
        this.setState({devices: devices});
    }

    setReports (reports) {
        this.setState({reports: reports.map(report => new Report(report))});
    }

    render () {
        return <div>
            <Filter devices={this.state.devices}  />
            <PerformanceChart reports={this.state.reports} />
        </div>;
    }
}

