import React from 'react';
import {Histogram} from './Histogram';

export class PerformanceItemComponent extends React.Component {
    makeName() {
        var userDescription = [];

        if (this.props.report.userMaker) userDescription.push(this.props.report.userMaker);
        if (this.props.report.userModel) userDescription.push(this.props.report.userModel);

        return userDescription.join(' ');
    }
    makeVendorName() {
        var uaDescription = [];

        if (this.props.report.vendorName) uaDescription.push(this.props.report.vendorName.replace('unknown', ''));
        if (this.props.report.vendorModel) uaDescription.push(this.props.report.vendorModel.replace('unknown', ''));

        return uaDescription.join(' ');
    }
    render() {
        return <div className="report">
            <div>{this.makeName()}</div>
            <div>{this.makeVendorName()}</div>
            <div>{[this.props.report.osName, this.props.report.osVersion].join(' ')}</div>
            <div>{this.props.report.browserName}</div>
            <div>{this.props.report.browserVersion}</div>
            <div className="info" title={this.props.report.userAgent}></div>
            <div>{this.props.report.rating}</div>
            <div>{this.props.report.testResults[this.props.activeHistogram].score}</div>
            <Histogram {...this.props} />
        </div>;
    }
}
PerformanceItemComponent.propTypes = {
    report: React.PropTypes.object.isRequired,
    activeHistogram: React.PropTypes.string.isRequired
};
