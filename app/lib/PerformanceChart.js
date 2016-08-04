import React from 'react';
import {EventEmitter} from './Utils';
import {Report} from './Report';
import {PerformanceItemComponent} from './PerformanceItemComponent';

export class PerformanceChart extends React.Component {
    constructor (...props) {
        super(...props);

        this.state = {
            filter: {}
        };

        EventEmitter.add(this);
    }

    onFilterChange (newFilter) {
        this.setState({filter: newFilter});
    } 

    render () {
        var visibleReports = Report
                .filter(this.props.reports, this.state.filter)
                .sort((a, b) => a.testResults[this.state.filter.selectedTestType].score > b.testResults[this.state.filter.selectedTestType].score ? 1 : -1)
                .map((report, index) => <PerformanceItemComponent report={report} activeHistogram={this.state.filter.selectedTestType} key={index} />),
            title = visibleReports.length ? [visibleReports.length, ' report', visibleReports.length === 1 ? '' : 's'].join('') : 'Loading....';

        return <div className="perf">
            <h1>{title}</h1>
            <div className="report heading">
                <div>User description</div>
                <div>Make/model*</div>
                <div>OS</div>
                <div>Browser</div>
                <div>Vers</div>
                <div>Info</div>
                <div>Device Rating</div>
                <div>Test Score</div>
                <div>Flame Chart</div>
            </div>
            {visibleReports}
        </div>;
    }
}
PerformanceChart.propTypes = {
    reports: React.PropTypes.array.isRequired
};
