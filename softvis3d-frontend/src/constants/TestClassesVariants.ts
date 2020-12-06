///
/// softvis3d-frontend
/// Copyright (C) 2020 Stefan Rinderle and Yvo Niedrich
/// stefan@rinderle.info / yvo.niedrich@gmail.com
///
/// This program is free software; you can redistribute it and/or
/// modify it under the terms of the GNU Lesser General Public
/// License as published by the Free Software Foundation; either
/// version 3 of the License, or (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
/// Lesser General Public License for more details.
///
/// You should have received a copy of the GNU Lesser General Public
/// License along with this program; if not, write to the Free Software
/// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
///

import {
    NoTestClassesVariant,
    OnlyTestClassesVariant,
    TestClassesVariant,
    WithTestClassesVariant,
} from "../classes/TestClassesVariant";

const NO_TEST_CLASSES_VARIANT: TestClassesVariant = new NoTestClassesVariant();

const WITH_TEST_CLASSES_VARIANT: TestClassesVariant = new WithTestClassesVariant();

const ONLY_TEST_CLASSES_VARIANT: TestClassesVariant = new OnlyTestClassesVariant();

export { NO_TEST_CLASSES_VARIANT, WITH_TEST_CLASSES_VARIANT, ONLY_TEST_CLASSES_VARIANT };

export class TestClassesVariants {
    public static availableTestClassesVariants: TestClassesVariant[] = [
        NO_TEST_CLASSES_VARIANT,
        WITH_TEST_CLASSES_VARIANT,
        ONLY_TEST_CLASSES_VARIANT,
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
