window.onload = main;

function main() {
    let rect = d3.select("#mapSvg").node().getBoundingClientRect();
    var width = rect.width,
        height = rect.height;

    var small_width = rect.width * 0.2,
        small_height = rect.height * 0.2;

    var svg = d3.select("#mapSvg");
    var small_svg = d3.select("#smallMapSVG");
    small_svg.style("border", "1px solid #666a").style("border-radius", "1em");

    const TaiwanCoords = [121.5654, 25.033];
    const translation = [width / 2, height / 2];
    const small_translation = [small_width / 1.6, small_width / 1.6];
    var projection = three_d_map(width / 2, translation, TaiwanCoords);
    var path = d3.geoPath().projection(projection);
    var small_projection = three_d_map(width / 7.5, small_translation, [
        TaiwanCoords[0] + 70,
        TaiwanCoords[1] + 20,
    ]);
    var small_path = d3.geoPath().projection(small_projection);

    const InitialScale = projection.scale();
    const SmallInitialScale = small_projection.scale();
    const Sensitivity = 100;
    const CountriesColor = "#F4F6FC";
    const ocean_color = "#CCDCF2";
    const point_color = "orange";
    const link_color = "#5A7BB5";
    const text_color = ["#0E4E90", "#1A79DB", "#3EB5E1", "#97C1DF"];
    const ZoomRange = [1, 1];
    const LinksScale = 0.013;
    const PointsScaleList = [0.015, 0.03];
    var PointsScale = PointsScaleList[0];
    const count = 10;
    const data_date = ["2019年12月", "2020年1月", "2020年2月", "2020年3月"];

    const img_person_id = load_img_pattern(svg, "img/person.png", "img-person");
    const img_plane_id = load_img_pattern(svg, "img/plane.png", "img-plane");

    var rotation_btn;
    var change_icon_btn;
    var departure_btn;
    var view_idx = 0;

    var files = [
        "https://unpkg.com/world-atlas@1/world/110m.json",
        "data/flights.csv",
    ];

    var promises = [];
    files.forEach((url) => {
        let splitted_url = url.split(".");
        if (splitted_url[splitted_url.length - 1] == "json") {
            promises.push(d3.json(url));
        } else if (splitted_url[splitted_url.length - 1] == "csv") {
            promises.push(d3.csv(url));
        }
    });

    // Main Function
    Promise.all(promises).then(function (values) {
        let world = values[0];

        // Convert {flights_data} to dictionary
        let flights_data = values[1],
            flights_data_dict = {};
        for (let i = 0; i < count; ++i) {
            let code = flights_data[i]["代碼"];
            flights_data_dict[code] = flights_data[i];
        }

        let topojson_world = topojson.feature(world, world.objects.countries);
        let target_world_mesh = topojson.mesh(
            world,
            world.objects.countries,
            function (a, b) {
                return a.id in flights_data_dict || b.id in flights_data_dict;
            }
        );
        let rest_world_mesh = topojson.mesh(
            world,
            world.objects.countries,
            function (a, b) {
                return !(
                    a.id in flights_data_dict || b.id in flights_data_dict
                );
            }
        );

        var tooltip = create_tooltip();
        var titlebox = create_titlebox("航空業面臨疫情之影響 (入境)");
        var infobox = create_infobox(titlebox);
        var globe_bg = draw_globe_bg(
            svg,
            translation,
            InitialScale,
            infobox,
            ocean_color
        );
        var small_globe_bg = draw_globe_bg(
            small_svg,
            small_translation,
            SmallInitialScale,
            infobox,
            "#BBCBE1"
        );
        var countries = draw_countries(
            svg,
            topojson_world,
            path,
            tooltip,
            infobox,
            flights_data_dict
        );
        var small_countries = draw_countries(
            small_svg,
            topojson_world,
            small_path,
            tooltip,
            infobox,
            flights_data_dict
        );
        var target_boundries = draw_boundries(
            svg,
            path,
            target_world_mesh,
            "#111"
        );
        var small_target_boundries = draw_boundries(
            small_svg,
            small_path,
            target_world_mesh,
            "#111"
        );
        var rest_boundries = draw_boundries(svg, path, rest_world_mesh, "#999");
        var small_rest_boundries = draw_boundries(
            small_svg,
            small_path,
            rest_world_mesh,
            "#999"
        );
        var graticule = draw_graticule(svg);
        var small_graticule = draw_graticule(small_svg);
        var links_data = create_links(flights_data, count);
        var in_links = links_data[0],
            out_links = links_data[1];
        var links_components = draw_links(
            svg,
            path,
            flights_data_dict,
            in_links,
            infobox,
            titlebox,
            tooltip,
            true,
            point_color,
            link_color
        );
        var small_links_components = draw_links(
            small_svg,
            small_path,
            flights_data_dict,
            in_links,
            infobox,
            titlebox,
            tooltip,
            true,
            point_color,
            link_color
        );
        var links = links_components[0],
            points = links_components[1];

        rotation_btn = new Rotation_Btn(globe_bg);
        change_icon_btn = new Change_Icon_Btn(
            [links_components, small_links_components],
            titlebox,
            point_color
        );
        departure_btn = new Departure_Btn(
            flights_data_dict,
            links_components,
            small_links_components,
            in_links,
            out_links,
            infobox,
            titlebox,
            tooltip,
            change_icon_btn
        );

        change_icon_btn.change_status(true);

        d3.select("#change-icon-btn").on("click", function () {
            change_icon_btn.change_status();
        });
        d3.select("#departure-btn").on("click", function () {
            departure_btn.change_status();
            // TODO: Modifiy below code.
            selectStatus(false, departure_btn.departure);
        });
        d3.select("#rotation-btn").on("click", function () {
            rotation_btn.change_status();
        });
    });

    function load_img_pattern(root, fpath, id) {
        root.append("defs")
            .attr("id", "mydef")
            .append("pattern")
            .attr("id", id)
            .attr("x", 0)
            .attr("y", 0)
            .attr("height", 1)
            .attr("width", 1)
            .attr("viewBox", "0 0 64 64")
            .attr("preserveAspectRatio", "none")
            .append("image")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 64)
            .attr("height", 64)
            .attr("href", fpath)
            .attr("preserveAspectRatio", "none");

        return id;
    }

    function flat_map(scale, translation, center) {
        var projection = d3
            .geoMercator()
            .scale(scale) // 放大倍率
            .center(center)
            .translate(translation); // 置中

        return projection;
    }

    function three_d_map(scale, translation, center) {
        var projection = d3
            .geoOrthographic()
            .scale(scale) // 放大倍率
            .center([0, 0])
            .rotate([-center[0], -center[1]])
            .translate(translation); // 置中

        return projection;
    }

    function create_tooltip() {
        let tooltip = d3
            .select("body")
            .append("div")
            .style("position", "absolute")
            .style("z-index", "5")
            .style("visibility", "hidden")
            .style("background", "#fffc")
            .style("padding", ".1em .5em")
            .style("font-size", "1.2em")
            .style("border-radius", ".3em");

        return tooltip;
    }

    function create_titlebox(title) {
        let titlebox = d3
            .select("#infobox")
            .style("position", "absolute")
            .style("margin", "1em")
            .style("padding", ".5em")
            .style("background-color", "#ddd")
            .style("border-radius", ".5em")
            .style("border-style", "solid")
            .style("border-color", "#ccc3")
            .style("background-color", "rgba(255,255,255,0.5)")
            .style("cursor", "pointer")
            .on("mouseover", function () {
                d3.select(this).style("border-color", "#ccc");
            })
            .on("mouseout", function () {
                d3.select(this).style("border-color", "#ccc3");
            });

        titlebox
            .append("div")
            .attr("class", "title")
            .style("font-size", "1.3em")
            .style("text-align", "center")
            .style("color", "#222c")
            .html(title);

        let svg = titlebox
            .append("svg")
            .style("height", "2.5em")
            .style("max-width", "21em");
        svg.append("circle")
            .attr("cx", "2.5em")
            .attr("cy", "1.5em")
            .attr("r", ".5em")
            .style("fill", "orange");
        svg.append("text")
            .attr("x", "3.5em")
            .attr("y", "1.5em")
            .text("旅客人數 -")
            .style("font-size", "1em")
            .attr("text-anchor", "left")
            .attr("alignment-baseline", "middle")
            .style("fill", "#333d");
        svg.append("text")
            .attr("id", "date-text")
            .attr("x", "8.5em")
            .attr("y", "1.5em")
            .text("旅客人數 -")
            .style("font-size", "1em")
            .attr("text-anchor", "left")
            .attr("alignment-baseline", "middle")
            .style("fill", "#333d");
        svg.style("display", "none");

        titlebox
            .append("svg")
            .style("width", "10vw")
            .style("height", "10vh")
            .attr("id", "smallMapSVG");

        return titlebox;
    }

    function create_infobox(root = null) {
        if (root == null) {
            root = d3.select("body");
        }

        let infobox = root
            .append("div")
            .attr("id", "infobox2")
            .style("height", "60vh")
            .style("width", "inherit")
            .style("background-color", "#ddd")
            .style("border-radius", ".5em")
            .style("margin", ".5em")
            .style("padding", "1em")
            .style("box-sizing", "border-box")
            .style("display", "none")
            .style("background", "#8ccbbe55")
            .style("border", "1px solid #aaa9");
        // .on("click", function () {
        //     d3.select(this).style("width", "50vw").style("height", "65vh");
        // });

        infobox
            .append("div")
            .attr("class", "title")
            .style("font-size", "1.3em")
            .style("color", "#333c");

        infobox.append("div").attr("class", "content");
        infobox.append("svg").style("width", "inherit").style("height", "100%");

        return infobox;
    }

    function draw_globe_bg(
        root,
        translation,
        scale,
        infobox,
        color = "#97E5EF"
    ) {
        let globe_bg = root
            .append("circle")
            .attr("fill", color)
            .attr("stroke", "#000")
            .attr("stroke-width", "0.2")
            .attr("cx", translation[0])
            .attr("cy", translation[1])
            .attr("r", scale)
            .attr("class", "globe_bg")
            .attr("cursor", "pointer")
            .on("click", function () {
                infobox.style("display", "none");
            });

        return globe_bg;
    }

    function draw_countries(root, world, path, tooltip, infobox, flights_data) {
        let countries = root
            .selectAll("_path")
            .data(world.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", (d) => "country" + d.id)
            .style("fill", CountriesColor)
            .style("opacity", (d) => {
                if (d.id in flights_data) {
                    return 1;
                } else {
                    return 0.85;
                }
            })
            .style("cursor", "pointer")
            .on("mouseover", function (d) {
                if (d.id in flights_data) {
                    set_tooltip(flights_data[d.id], tooltip);
                    highlight(d.id, true);
                } else {
                    d3.select(this).style("fill", "#3339");
                }
            })
            .on("mousemove", function () {
                tooltip
                    .style("top", event.pageY - 10 + "px")
                    .style("left", event.pageX + 10 + "px");
            })
            .on("mouseout", function (d) {
                tooltip.style("visibility", "hidden");
                highlight(d.id, false);
            })
            .on("click", function (d) {
                if (d.id in flights_data) {
                    show_info(flights_data[d.id], infobox);
                } else {
                    infobox.style("display", "none");
                }
            });

        return countries;
    }

    function highlight(code, on, country_color = "#ffb367aa") {
        if (on) {
            d3.selectAll(".link" + code).style("opacity", 1);
            d3.selectAll(".country" + code).style("fill", country_color);
            d3.selectAll(".country158").style("fill", country_color);
        } else {
            d3.selectAll(".link" + code).style("opacity", 0.25);
            d3.selectAll(".country" + code).style("fill", CountriesColor);
            d3.selectAll(".country158").style("fill", CountriesColor);
        }
    }

    function show_info(flight_data, infobox) {
        // TODO: Modifiy below code.
        if (departure_btn.departure) {
            d3.select("#status").property("value", "departure");
        } else {
            d3.select("#status").property("value", "arrival");
        }

        d3.select("#country")
            .property("value", flight_data["name"])
            .each(() => {
                selectCountry();
            });
    }

    function set_tooltip(flight_data, tooltip) {
        tooltip.text(flight_data["國家"]).style("visibility", "visible");
    }

    function draw_boundries(root, path, world, color = "#333") {
        let boundaries = root
            .append("path")
            .datum(world)
            .attr("d", path)
            .style("fill", "none")
            .style("stroke", color)
            .style("stroke-width", "0.015em");

        return boundaries;
    }

    function draw_graticule(root, step = [10, 10]) {
        let graticule = root
            .append("path")
            .datum(d3.geoGraticule().step(step))
            .attr("d", path)
            .style("fill", "none")
            .style("stroke", "#bbbc")
            .style("stroke-width", 0.2);

        return graticule;
    }

    function create_links(flights_data, count = 10) {
        let in_links = [],
            out_links = [];

        for (let i = 0; i < count; ++i) {
            let code = flights_data[i]["代碼"];
            let target_coords = [
                parseFloat(flights_data[i]["緯度"]),
                parseFloat(flights_data[i]["經度"]),
            ];

            in_links.push({
                type: "LineString",
                code: code,
                coordinates: [target_coords, TaiwanCoords],
            });
            out_links.push({
                type: "LineString",
                code: code,
                coordinates: [TaiwanCoords, target_coords],
            });
        }

        return [in_links, out_links];
    }

    function draw_links(
        root,
        path,
        flights_data,
        links_data,
        infobox,
        titlebox,
        tooltip,
        points_dynamic_scale = false,
        point_color = "orange",
        link_color = "orange",
        link_duration = 10000,
        point_duration = 10000
    ) {
        let links_base = root.selectAll("_path").data(links_data).enter();

        // Draw Links
        let links = links_base
            .append("path")
            .attr("d", (d) => path(d))
            .attr("class", "link")
            .attr("class", (d) => "link" + d.code)
            .style("fill", "none")
            .style("stroke-width", projection.scale() * LinksScale)
            .style("stroke-linecap", "round")
            .style("opacity", 0.25)
            .style("cursor", "pointer")
            .style("stroke", link_color)
            .on("mouseover", function (d) {
                set_tooltip(flights_data[d.code], tooltip);
                highlight(d.code, true);
            })
            .on("mousemove", function () {
                tooltip
                    .style("top", event.pageY - 10 + "px")
                    .style("left", event.pageX + 10 + "px");
            })
            .on("mouseout", function (d) {
                tooltip.style("visibility", "hidden");
                highlight(d.code, false);
            })
            .on("click", function (d) {
                show_info(flights_data[d.code], infobox);
            });
        links_transition();

        // Draw Points
        var points = links_base
            .append("circle")
            .attr("class", (d) => "point" + d.code)
            .attr("r", InitialScale / 150)
            .attr("cx", (d, i) => {
                let path_node = links.nodes()[i],
                    point = path_node.getPointAtLength(0);
                return point.x;
            })
            .attr("cy", (d, i) => {
                let path_node = links.nodes()[i],
                    point = path_node.getPointAtLength(0);
                return point.y;
            })
            .style("fill", point_color)
            .style("opacity", 0.9);
        points_transition();

        // show titlebox or not
        if (points_dynamic_scale) {
            titlebox.select("svg").style("display", "block");
        } else {
            titlebox.select("svg").style("display", "none");
        }

        function links_transition() {
            links
                .transition()
                .duration(link_duration)
                .attrTween("stroke-dasharray", tweenDash)
                .on("end", function () {
                    links_transition();
                });

            function tweenDash() {
                return function (t) {
                    let l = this.getTotalLength(),
                        i = d3.interpolateString("0," + l, l + "," + l);
                    return i(t);
                };
            }
        }

        function points_transition(delay = 0) {
            points
                .transition()
                .delay(delay)
                .duration(point_duration)
                .tween("pathTween", function (d, i) {
                    return pathTween(links.nodes()[i], flights_data[d.code]);
                })
                .on("end", function () {
                    points_transition();
                });

            function pathTween(path_node, flight_data) {
                let people_count = [];
                for (let i = 0; i < data_date.length; ++i) {
                    people_count.push(
                        parseInt(
                            flight_data[data_date[i]].split(",").join(""),
                            10
                        )
                    );
                }

                for (let i = people_count.length - 1; i >= 0; --i) {
                    people_count[i] /= people_count[0];
                }
                let points_transition_scale = people_count;

                return function (t) {
                    let length = path_node.getTotalLength(),
                        r = d3.interpolate(0, length),
                        point = path_node.getPointAtLength(r(t)),
                        transition_scale_length =
                            points_transition_scale.length;

                    if (points_dynamic_scale) {
                        for (let i = 1; i <= transition_scale_length; ++i) {
                            if (t * transition_scale_length <= i) {
                                d3.select(this)
                                    .attr("cx", point.x)
                                    .attr("cy", point.y)
                                    .attr(
                                        "r",
                                        PointsScale *
                                            projection.scale() *
                                            points_transition_scale[i - 1]
                                    );

                                titlebox
                                    .select("#date-text")
                                    .html(data_date[i - 1])
                                    .style("fill", text_color[i - 1]);

                                break;
                            }
                        }
                    } else {
                        d3.select(this)
                            .attr("r", projection.scale() * PointsScale)
                            .attr("cx", point.x)
                            .attr("cy", point.y);
                    }
                };
            }
        }

        return [links, points];
    }

    function switch_view(idx, globe_bg) {
        var curr_rotate = projection.rotate();

        if (idx == 0) {
            var next_rotate = [-TaiwanCoords[0], -TaiwanCoords[1]];
            projection.scale(InitialScale);
            globe_bg.attr("r", projection.scale());
        } else if (idx == 1) {
            var next_rotate = [-TaiwanCoords[0] - 70, -TaiwanCoords[1] - 20];
            projection.scale(InitialScale * 0.7);
            globe_bg.attr("r", projection.scale());
        }

        if (next_rotate != curr_rotate) {
            svg.selectAll("path").attr("d", function (d) {
                // don't apply transition to links and points
                if (d3.select(this).attr("class") != "link") {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attrTween("d", function (d) {
                            let r = d3.interpolate(curr_rotate, next_rotate);

                            return function (t) {
                                projection.rotate(r(t));

                                path = d3.geoPath().projection(projection);
                                let pathD = path(d);
                                return pathD == null ? "" : pathD;
                            };
                        });
                } else {
                    projection.rotate(next_rotate);
                    path = d3.geoPath().projection(projection);
                    let curr_link = d3.select(this);
                    setTimeout(function () {
                        curr_link.attr("d", path);
                    }, 200);
                }
            });

            small_svg.selectAll("path").attr("d", function (d) {
                // don't apply transition to links and points
                if (d3.select(this).attr("class") != "link") {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attrTween("d", function (d) {
                            let r = d3.interpolate(next_rotate, curr_rotate);

                            return function (t) {
                                small_projection.rotate(r(t));

                                small_path = d3
                                    .geoPath()
                                    .projection(small_projection);
                                let pathD = small_path(d);
                                return pathD == null ? "" : pathD;
                            };
                        });
                } else {
                    small_projection.rotate(next_rotate);
                    small_path = d3.geoPath().projection(small_projection);
                    let curr_link = d3.select(this);
                    setTimeout(function () {
                        curr_link.attr("d", small_path);
                    }, 200);
                }
            });
        }
    }

    function Rotation_Btn(globe_bg) {
        this.enable_rotation = true;

        this.change_status = function () {
            this.enable_rotation = !this.enable_rotation;
            if (this.enable_rotation) {
                switch_view(0, globe_bg);
                d3.select("#rotation-btn").style("background", "none");
            } else {
                switch_view(1, globe_bg);
                d3.select("#rotation-btn").style("background", "#7777");
            }
        };

        function rotate(elapsed) {
            const rotate = projection.rotate();
            const k = Sensitivity / projection.scale();
            projection.rotate([rotate[0] - k, rotate[1]]);
            path = d3.geoPath().projection(projection);
            svg.selectAll("path").attr("d", path);
        }

        return rotation_btn;
    }

    function Departure_Btn(
        flights_data_dict,
        links_components,
        links_components2,
        in_links,
        out_links,
        infobox,
        titlebox,
        tooltip,
        change_icon_btn
    ) {
        this.departure = false;

        this.change_status = function () {
            this.departure = !this.departure;

            if (this.departure == false) {
                clear_links();
                add_links(in_links, true);
                titlebox.select(".title").html("航空業面臨疫情之影響 (入境)");
                d3.select("#change-icon-btn").attr(
                    "class",
                    "fas fa-walking icons"
                );
                d3.select("#departure-btn").style("background", "none");
                change_icon_btn.change_status(true);
            } else {
                clear_links();
                add_links(out_links, false);
                titlebox.select(".title").html("航空業面臨疫情之影響 (出境)");
                d3.select("#change-icon-btn").attr(
                    "class",
                    "fas fa-plane icons"
                );
                d3.select("#departure-btn").style("background", "#7777");
                change_icon_btn.change_status(true);
            }
        };

        function clear_links() {
            console.log(links_components2);
            for (let i = links_components.length - 1; i >= 0; --i) {
                links_components[i].remove();
                links_components.pop();
            }
            for (let i = links_components2.length - 1; i >= 0; --i) {
                links_components2[i].remove();
                links_components2.pop();
            }
        }

        function add_links(links, dynamic_size) {
            var components = draw_links(
                svg,
                path,
                flights_data_dict,
                links,
                infobox,
                titlebox,
                tooltip,
                dynamic_size,
                point_color,
                link_color
            );
            for (let i = 0; i < components.length; ++i) {
                links_components.push(components[i]);
            }
            var small_components = draw_links(
                small_svg,
                small_path,
                flights_data_dict,
                links,
                infobox,
                titlebox,
                tooltip,
                dynamic_size,
                point_color,
                link_color
            );
            for (let i = 0; i < small_components.length; ++i) {
                links_components2.push(small_components[i]);
            }
        }
    }

    function Change_Icon_Btn(links_components, titlebox, point_color) {
        this.show = false;

        this.change_status = function (show = null) {
            if (show == null) {
                this.show = !this.show;
            } else {
                this.show = show;
            }

            links_components.forEach((links_component) => {
                let points = links_component[1];
                if (this.show == false) {
                    d3.select("#change-icon-btn").style("background", "none");
                    points.style("fill", point_color);
                    PointsScale = PointsScaleList[0];
                    titlebox
                        .select("circle")
                        .style("fill", point_color)
                        .attr("r", ".5em");
                } else {
                    let classes = d3.select("#change-icon-btn").attr("class"),
                        img_id;
                    if (classes == "fas fa-walking icons") {
                        img_id = img_person_id;
                    } else if (classes == "fas fa-plane icons") {
                        img_id = img_plane_id;
                    }

                    d3.select("#change-icon-btn").style("background", "#7777");
                    points.style("fill", "url(#" + img_id + ")");
                    PointsScale = PointsScaleList[1];
                    titlebox
                        .select("circle")
                        .style("fill", "url(#" + img_id + ")")
                        .attr("r", "1em");
                }
            });
        };
    }
}
