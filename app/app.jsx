/* jshint ignore:start */

import React from "react";
import Greeting from "./greeting.jsx";
import Toile from "./toile/toile.jsx";

require('./styles/app.scss');

React.render(
    <div>
        <Greeting name="World"/>
        <Toile/>
    </div>,
    document.getElementById("main")
);
