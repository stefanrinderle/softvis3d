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

export class Scales {

    public static availableScales: Scale[] = [
        LOGARITHMIC,
        EXPONENTIAL,
        LINEAR_SCALED,
        LINEAR
    ];

    public static getScaleById(scaleId: string): Scale | undefined {
        if (scaleId !== undefined) {
            for (const availableScale of Scales.availableScales) {
                if (availableScale.getId() === scaleId) {
                    return availableScale;
                }
            }
        }
    }
}