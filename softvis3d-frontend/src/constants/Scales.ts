import Scale from "../classes/Scale";

const LOGARITHMIC: Scale = new Scale("logarithmic", "Logarithmic");
const EXPONENTIAL: Scale = new Scale("exponential", "Exponential");
const LINEAR_SCALED: Scale = new Scale("linear_s", "Linear (scaled)");
const LINEAR: Scale = new Scale("linear", "Linear");

export {
    LOGARITHMIC,
    EXPONENTIAL,
    LINEAR_SCALED,
    LINEAR
}

export const availableScales: Scale[] = [
    LOGARITHMIC,
    EXPONENTIAL,
    LINEAR_SCALED,
    LINEAR
];