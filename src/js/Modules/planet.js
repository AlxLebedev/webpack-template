export default class Planet {
    constructor() {
        this.paths = ["https://d3js.org/d3.v3.min.js", "https://d3js.org/topojson.v1.min.js", "https://d3js.org/queue.v1.min.js"];
        this.planetContainer = document.getElementById('planet');
        this.width = 600;
        this.height = 500;
    }
  
    async init() {
        await Promise.all(this.paths.map(path => this.loadScript(path)));
        this.constructPlanet();
    }

    loadScript(path) {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = path;
            script.defer = true;
            document.body.appendChild(script);
            script.addEventListener('load', () => {
                resolve();
            })
        });
    }

    constructPlanet() {
        const sens = 0.25;
        let focused;

        //Setting projection

        var projection = d3.geo.orthographic()
            .scale(245)
            .rotate([0, 0])
            .translate([this.width / 2, this.height / 2])
            .clipAngle(90)
        ;

        var path = d3.geo.path().projection(projection);

        //SVG container

        var svg = d3.select("#planet").append("svg")
            .attr("width", this.width)
            .attr("height", this.height);

        //Adding water

        svg.append("path")
            .datum({type: "Sphere"})
            .attr("class", "water")
            .attr("d", path)
        ;

        let countryTooltip = d3.select("#planet").append("div").attr("class", "countryTooltip");

        queue()
            .defer(d3.json, "./src/static/world-110m.json")
            .defer(d3.tsv, "./src/static/world-country-names.tsv")
            .await(ready)
        ;

        //Main function

        function ready(error, world, countryData) {

            var countryById = {},
            countries = topojson.feature(world, world.objects.countries).features;

            //Adding countries

            countryData.forEach(function(d) {
                countryById[d.id] = d.name;
            });

            //Drawing countries on the globe

            var world = svg.selectAll("path.land")
                .data(countries)
                .enter().append("path")
                .attr("class", "land")
                .attr("d", path)

                //Drag event

                .call(d3.behavior.drag()
                .origin(function() { var r = projection.rotate(); return {x: r[0] / sens, y: -r[1] / sens}; })
                .on("drag", function() {
                    var rotate = projection.rotate();
                    projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
                    svg.selectAll("path.land").attr("d", path);
                    svg.selectAll(".focused").classed("focused", focused = false);
                }))

                //Mouse events

                .on("mouseover", function(d) {
                    countryTooltip.text(countryById[d.id])
                    .style("left", (d3.event.pageX + 7) + "px")
                    .style("top", (d3.event.pageY - 15) + "px")
                    .style("display", "block")
                    .style("opacity", 1);
                })
                .on("mouseout", function(d) {
                    countryTooltip.style("opacity", 0)
                    .style("display", "none");
                })
                .on("mousemove", function(d) {
                    countryTooltip.style("left", (d3.event.pageX + 7) + "px")
                    .style("top", (d3.event.pageY - 15) + "px");
                })
            ;
        };
    }
  }
  