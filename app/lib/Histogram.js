import React from 'react';
import {hslToRgb} from './Utils';

var colors = [];

function getColor(h, s, l, a) {
    var matchingColors = colors.filter(color => color.h == h && color.s == s && color.l == l),
        color;


    if (matchingColors.length > 0) {
        color = matchingColors.pop();
    } else {
        let [r, g, b] = hslToRgb(h, s, l);

        color = {
            h: h,
            s: s,
            l: l,
            r: r,
            g: g,
            b: b
        };
        colors.push(color);
    }

    return `rgba(${color.r}, ${color.g}, ${color.b}, ${a})`;
};

var histogramLabels = [
    '<5fps',
    '5-10fps',
    '10-15fps',
    '15-20fps',
    '20-25fps',
    '25-30fps',
    '30-35fps',
    '35-40fps',
    '40-45fps',
    '45-50fps',
    '50-55fps',
    '>55fps',
]; 

export class Histogram extends React.Component {
    render() {
        var items = this.props.report.histograms[this.props.activeHistogram]
            .map((histogramItem, index) => {
                var h = (255 - (Math.ceil(index * 200 / 12))) / 255,
                    a = histogramItem / 100,
                    rgba = getColor(h, 1, 0.5, a),
                    styles = {backgroundColor: rgba},
                    key = `hist_${index}`,
                    histogramValue = histogramItem ? `${histogramItem}%` : '';

                return <div style={styles} key={key} title={histogramLabels[index]}>{histogramValue}</div>;
            }); 

        return <div className="histogram">{items}</div>;
    }
}
Histogram.propTypes = {
    report: React.PropTypes.object.isRequired,
    activeHistogram: React.PropTypes.string.isRequired
};
