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

import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import LoadAction from "../../../../src/classes/status/LoadAction";
import StatusActionQueue from "../../../../src/classes/status/StatusActionQueue";
import Loading from "../../../../src/components/status/loading/Loading";
import LoadingImage from "../../../../src/components/status/loading/LoadingImage";
import LoadingQueue from "../../../../src/components/status/loading/LoadingQueue";

describe("<Loading/>", () => {
    it("should draw loading components if loading", () => {
        const loadingQueue = new StatusActionQueue<LoadAction>();

        loadingQueue.add(new LoadAction("test", ""));

        const loading = shallow(<Loading loadingQueue={loadingQueue} />);

        expect(loading.contains(<LoadingImage />)).to.be.true;
        expect(loading.contains(<LoadingQueue loadingQueue={loadingQueue} />)).to.be.true;
    });

    it("should draw nothing if not visible", () => {
        const loadingQueue = new StatusActionQueue<LoadAction>();

        const loading = shallow(<Loading loadingQueue={loadingQueue} />);

        expect(loading.children().length).to.be.eq(0);
    });
});
