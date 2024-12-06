import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

export class ProgressArc {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            size: options.size || 100,
            thickness: options.thickness || 10,
            backgroundColor: options.backgroundColor || '#eee',
            foregroundColor: options.foregroundColor || '#4a90e2',
            animationDuration: options.animationDuration || 750,
            ...options
        };
    }

    render(percentage) {
        const { size, thickness, backgroundColor, foregroundColor, animationDuration } = this.options;
        const radius = size / 2;

        // Clear existing content
        d3.select(this.container).selectAll('*').remove();

        // Create SVG
        const svg = d3.select(this.container)
            .append('svg')
            .attr('width', size)
            .attr('height', size)
            .append('g')
            .attr('transform', `translate(${radius},${radius})`);

        // Create arc generator
        const arc = d3.arc()
            .innerRadius(radius - thickness)
            .outerRadius(radius)
            .startAngle(0);

        // Background arc
        svg.append('path')
            .datum({ endAngle: 2 * Math.PI })
            .style('fill', backgroundColor)
            .attr('d', arc);

        // Foreground arc (animated)
        const foreground = svg.append('path')
            .datum({ endAngle: 0 })
            .style('fill', foregroundColor)
            .attr('d', arc);

        // Add percentage text
        const text = svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '.3em')
            .style('font-size', '1.5em')
            .style('font-weight', 'bold')
            .text('0%');

        // Animate the arc and text
        const targetAngle = (percentage / 100) * (2 * Math.PI);
        foreground.transition()
            .duration(animationDuration)
            .attrTween('d', arcTween(targetAngle))
            .tween('text', function() {
                const textInterpolate = d3.interpolate(0, percentage);
                return function(t) {
                    text.text(`${Math.round(textInterpolate(t))}%`);
                };
            });

        // Arc tween function for smooth animation
        function arcTween(newAngle) {
            return function(d) {
                const interpolate = d3.interpolate(d.endAngle, newAngle);
                return function(t) {
                    d.endAngle = interpolate(t);
                    return arc(d);
                };
            };
        }
    }
} 