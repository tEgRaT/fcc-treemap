import * as d3 from 'd3';
import React, { useRef, useEffect, useCallback, } from 'react';

const Treemap = ({ url, width, height, onClick }) => {
    const ref = useRef();
    const legendSvg = useRef();

    useEffect(() => {
        if (!legendSvg.current)
            legendSvg.current = d3
                .select('#legend')
                .append('svg')
                .attr('width', width)
                .attr('height', 50);
    }, [width]);

    useEffect(() => {
        const svg = d3.select(ref.current)
            .attr('width', width)
            .attr('height', height)
            .style('border', '1px solid black');
    }, [width, height]);

    const draw = useCallback(() => {
        d3.json(url)
            .then(data => {
                const svg = d3.select(ref.current);

                // Give the data to this cluster layout:
                const root = d3.hierarchy(data).sum(d => Number(d?.value));

                // initialize the treemap:
                d3.treemap()
                    .size([width, height])
                    // .paddingTop(28)
                    // .paddingRight(7)
                    // .paddingInner(3)
                    (root);

                const color = d3.scaleOrdinal()
                    .domain(data?.children?.map(d => d?.name))
                    .range(d3.schemePaired);

                const opacity = d3.scaleLinear()
                    .domain([0, Number(root.value)])
                    .range([0.5, 1]);

                // Select the nodes
                const nodes = svg
                    .selectAll('rect')
                    .data(root.leaves());

                // add tooltip
                const tooltip = d3
                    .select('body')
                    .append('div')
                    .attr('id', 'tooltip')
                    .attr('width', 'auto')
                    .attr('height', 'auto')
                    .style('position', 'absolute')
                    .style('background-color', 'black')
                    .style('color', 'white')
                    .style('padding', '5px')
                    .style('border-radius', '5px')
                    .style('opacity', 0.8)
                    .style('display', 'none');

                const mouseover = (e, d) => {
                    console.log(d)
                    tooltip
                        .style('display', 'block')
                        .attr('data-value', d?.data?.value)
                        .html(
                            `<span>${d?.data?.name}</span>
                            <br />
                            <span>Category: ${d?.data?.category}</span>
                            <br />
                            <span>Value: ${d?.data?.value}</span>`
                        )
                        .style('left', `${d.x0 + 5}px`)
                        .style('top', `${d.y1}px`);
                };

                const mouseleave = () => tooltip.style('display', 'none');

                // animate new additions
                nodes
                    .transition()
                    .duration(750)
                    .attr('x', d => d.x0)
                    .attr('y', d => d.y0)
                    .attr('width', d => d.x1 - d.x0)
                    .attr('height', d => d.y1 - d.y0)
                    // .style('fill', d => color(d.data.name))
                    .style('fill', d => color(d.parent.data.name))
                    // .style('opacity', d => opacity(d.value));
                    // .style('opacity', d => opacity(d.parent.value));
                    .style('opacity', d => opacity(Number(d.data.value)));

                // draw rectangles
                nodes.enter()
                    .append('rect')
                    .data(root.leaves())
                    .attr('class', 'tile')
                    .on('mouseover', mouseover)
                    .on('mouseleave', mouseleave)
                    .attr('data-name', d => d.data.name)
                    .attr('data-category', d => d.data.category)
                    .attr('data-value', d => d.data.value)
                    .attr('x', d => d.x0)
                    .attr('y', d => d.y0)
                    .attr('width', d => d.x1 - d.x0)
                    .attr('height', d => d.y1 - d.y0)
                    // .style('fill', d => color(d.data.name))
                    .style('fill', d => color(d.parent.data.name))
                    // .style('opacity', d => opacity(d.value))
                    .style('opacity', d => opacity(Number(d.data.value)))
                    .style('stroke', 'black');

                nodes.exit().remove();

                // select node titles
                const nodeText = svg
                    .selectAll('text')
                    .data(root.leaves());

                // animate new additions
                nodeText
                    .transition()
                    .duration(750)
                    .attr('x', d => d.x0 + 5)
                    .attr('y', d => d.y0 + 20)
                    .text(d => d.data.name);

                // add the text
                nodeText.enter()
                    .append('text')
                    .attr('x', d => d.x0 + 5)
                    .attr('y', d => d.y0 + 20)
                    // .text(d => d.data.name)
                    .text(d => d.data.name)
                    .style('font-size', '12px')
                    .style('fill', 'black');

                nodeText.exit().remove();

                // select node values
                // const nodeVals = svg
                //     .selectAll('vals')
                //     .data(root.leaves());

                // // add the values
                // nodeVals.enter()
                //     .append('text')
                //     .attr('x', d => d.x0 + 5)
                //     .attr('y', d => d.y0 + 40)
                //     .text(d => d.data.value)
                //     .style('font-size', '12px')
                //     .style('fill', 'white');

                // nodeVals.exit().remove();

                // add the parent node titles
                // svg
                //     .selectAll('titles')
                //     // .data(root.leaves())
                //     // .data(root.descendants())
                //     .data(root.descendants().filter(d => d.depth === 1))
                //     .enter()
                //     .append('text')
                //     .attr('x', d => d.x0)
                //     .attr('y', d => d.y0 + 21)
                //     .text(d => d.data.name)
                //     .style('font-size', '12px')
                //     .style('fill', d => color(d.data.name));

                // Add the chart heading
                // svg
                //     .append('text')
                //     .attr('x', 0)
                //     .attr('y', 20)
                //     .text('Treemap')
                //     .style('font-size', '20px')
                //     .style('fill', 'black');

                // add legend
                // d3
                //     .select('body')
                //     .append('div')
                //     .attr('id', 'legend');

                const names = data
                    ?.children
                    ?.map(child => child?.name);

                names?.forEach((name, i) => {
                    const legendRow = legendSvg.current.append('g');

                    legendRow
                        .append('rect')
                        .attr('class', 'legend-item')
                        .attr('width', width / names.length)
                        .attr('height', 20)
                        .attr('x', i * width / names.length)
                        .attr('y', 0)
                        .style('fill', d => color(name))
                        .style('opacity', 0.8);

                    legendRow
                        .append('text')
                        .attr('x', i * width / names.length + 5)
                        .attr('y', 40)
                        .attr('text-anchor', 'start')
                        .text(name);
                });
            })
            .catch(error => console.log(error));
    }, [width, height, url, /*onClick*/]);

    useEffect(() => draw(), [draw]);

    return (
        <div className="treemap">
            <svg ref={ref} />
        </div>
    );
};

export default Treemap;