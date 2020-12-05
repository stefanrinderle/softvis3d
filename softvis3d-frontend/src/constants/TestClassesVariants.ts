import {
    NoTestClassesVariant,
    OnlyTestClassesVariant,
    TestClassesVariant,
    WithTestClassesVariant
} from "../classes/TestClassesVariant";

const NO_TEST_CLASSES_VARIANT: TestClassesVariant = new NoTestClassesVariant();

const WITH_TEST_CLASSES_VARIANT: TestClassesVariant = new WithTestClassesVariant();

const ONLY_TEST_CLASSES_VARIANT: TestClassesVariant = new OnlyTestClassesVariant();

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
