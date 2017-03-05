///
/// softvis3d-frontend
/// Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
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

import App from "./app";
import config from "config";

if (config.project === null) {
    interface MyWindow extends Window { PROJECT_KEY: string; }
    config.project = (window as MyWindow).PROJECT_KEY;
}

const appConfiguration = {
    api: config.api,
    projectKey: config.project,
    isDev: config.env === "development"
};

const softvis3d = new App(appConfiguration);
softvis3d.run("app");
