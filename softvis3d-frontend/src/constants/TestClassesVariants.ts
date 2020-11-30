import {TestClassesVariant} from "../classes/TestClassesVariant";

const NO_TEST_CLASSES_VARIANT: TestClassesVariant = new TestClassesVariant("no", "No test classes");

const WITH_TEST_CLASSES_VARIANT: TestClassesVariant = new TestClassesVariant("with", "With test classes");

const ONLY_TEST_CLASSES_VARIANT: TestClassesVariant = new TestClassesVariant("only", "Only test classes");

export {
    NO_TEST_CLASSES_VARIANT,
    WITH_TEST_CLASSES_VARIANT,
    ONLY_TEST_CLASSES_VARIANT
};

export class TestClassesVariants {

    public static availableTestClassesVariants: TestClassesVariant[] = [
        NO_TEST_CLASSES_VARIANT,
        WITH_TEST_CLASSES_VARIANT,
        ONLY_TEST_CLASSES_VARIANT
    ];

    public static getTestClassesVariantById(modeId: string): TestClassesVariant | undefined {
        if (!modeId) {
            return;
        }

        for (const availableMode of TestClassesVariants.availableTestClassesVariants) {
            if (availableMode.id === modeId) {
                return availableMode;
            }
        }
    }
}
