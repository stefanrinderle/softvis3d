import { configure } from "enzyme";
import ReactSixteenAdapter = require("enzyme-adapter-react-16");

configure({
    adapter: new ReactSixteenAdapter(),
});
