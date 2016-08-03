import React from 'react';
import { normalize, EventEmitter } from './Utils';

export class Filter extends React.Component {
    constructor (...props) {
        super(...props);
        this.state = {
            selectedMake: '',
            selectedModel: '',
            selectedOSName: '',
            selectedOSVersion: '',
            selectedBrowserName: '',
            selectedBrowserVersion: '',
            selectedDeviceVendor: '',
            selectedDeviceVendorModel: '',
            selectedTestType: 'baseline'
        };
    }

    componentWillUpdate(nextProps, nextState) {
        EventEmitter.emit('FilterChange', nextState);
    }

    clearSelections() {
        this.setState({
            selectedMake: '',
            selectedModel: '',
            selectedOSName: '',
            selectedOSVersion: '',
            selectedBrowserName: '',
            selectedBrowserVersion: '',
            selectedDeviceVendor: '',
            selectedDeviceVendorModel: '',
            selectedTestType: 'baseline'
        });
    }
    

    render () {
        var makers = Object.keys(this.props.devices.modelsByMaker).sort(),
            models = this.state.selectedMake === '' ? [] : this.props.devices.modelsByMaker[this.state.selectedMake].sort(),
            oses = Object.keys(this.props.devices.versionsByOSName).sort(),
            osVersions = this.state.selectedOSName === '' ? [] : this.props.devices.versionsByOSName[this.state.selectedOSName].sort(),
            browsers = Object.keys(this.props.devices.versionsByBrowserName).sort(),
            browserVersions = this.state.selectedBrowserName === '' ? [] : this.props.devices.versionsByBrowserName[this.state.selectedBrowserName].sort(),
            deviceVendors = Object.keys(this.props.devices.modelsByDeviceVendor).sort(),
            deviceVendorModels = this.state.selectedDeviceVendor === '' ? [] : this.props.devices.modelsByDeviceVendor[this.state.selectedDeviceVendor].sort(),
            testTypes = ['baseline', 'dom', 'canvas', 'css', 'touch'],

            makerElements = [''].concat(makers).map((makerName, index) => <option value={makerName} key={'make' + index}>{makerName}</option>),
            modelElements = [''].concat(models).map((modelName, index) => <option value={modelName} key={'model' + index}>{modelName}</option>),
            osElements = [''].concat(oses).map((osName, index) => <option value={osName} key={'os' + index}>{osName}</option>),
            osVersionElements = [''].concat(osVersions).map((osVersion, index) => <option value={osVersion} key={'osVersion' + index}>{osVersion}</option>),
            browserElements = [''].concat(browsers).map((browserName, index) => <option value={browserName} key={'browser' + index}>{browserName}</option>),
            browserVersionElements = [''].concat(browserVersions).map((browserVersion, index) => <option value={browserVersion} key={'browserVersion' + index}>{browserVersion}</option>),
            deviceVendorElements = [''].concat(deviceVendors).map((deviceVendor, index) => <option value={deviceVendor} key={'deviceVendor' + index}>{deviceVendor}</option>),
            deviceVendorModelElements = [''].concat(deviceVendorModels).map((deviceModelVendor, index) => <option value={deviceModelVendor} key={'deviceModelVendor' + index}>{deviceModelVendor}</option>),
            testTypeElements = testTypes.map(type => <option value={type} key={type}>{type}</option>);

        return <div className="filter">
            <div className="section">
                <h6>User description</h6>
                <select value={this.state.selectedMake} onChange={evt => this.setState({selectedMake: evt.target.value, selectedModel: ''})}>{makerElements}</select>
                <select value={this.state.selectedModel} onChange={evt => this.setState({selectedModel: evt.target.value})}>{modelElements}</select>
            </div>
            <div className="section">
                <h6>Operating system</h6>
                <select value={this.state.selectedOSName} onChange={evt => this.setState({selectedOSName: evt.target.value, selectedOSVersion: ''})}>{osElements}</select>
                <select value={this.state.selectedOSVersion} onChange={evt => this.setState({selectedOSVersion: evt.target.value})}  >{osVersionElements}</select>
            </div>
            <div className="section">
                <h6>Browser</h6>
                <select value={this.state.selectedBrowserName} onChange={ evt => this.setState({selectedBrowserName: evt.target.value, selectedBrowserVersion: ''})}>{browserElements}</select>
                <select value={this.state.selectedBrowserVersion} onChange={ evt => this.setState({selectedBrowserVersion: evt.target.value})}>{browserVersionElements}</select>
            </div>
            <div className="section">
                <h6>Vendor</h6>
                <select value={this.state.selectedDeviceVendor} onChange={ evt => this.setState({selectedDeviceVendor: evt.target.value, selectedDeviceVendorModel: ''})}>{deviceVendorElements}</select>
                <select value={this.state.selectedDeviceVendorModel} onChange={ evt => this.setState({selectedDeviceVendorModel: evt.target.value})}>{deviceVendorModelElements}</select>
            </div>
            <div className="section">
                <h6>Test</h6>
                <select value={this.state.selectedTestType} onChange={ evt => this.setState({selectedTestType: evt.target.value}) }>{testTypeElements}</select>
                <button onClick={() => this.clearSelections()}>Clear all filters</button>
            </div>
        </div>;
    }
}
Filter.propTypes = {
    devices: React.PropTypes.object.isRequired
};
