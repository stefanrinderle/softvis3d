import * as React from "react";
import * as ReactDOM from "react-dom";
import CityBuilder from "./components/CityBuilder";

const myLayouts = {
    name: "layouts",
    layouts: [
        { value: "district", label: "District", img: "static/resources/preview-district.png"},
        { value: "evostreet", label: "Evostreet", img: "static/resources/preview-evostreet.png"}
    ]
};

ReactDOM.render(
    <CityBuilder name={myLayouts.name} layouts={myLayouts.layouts} />,
    document.getElementById("example")!
);
