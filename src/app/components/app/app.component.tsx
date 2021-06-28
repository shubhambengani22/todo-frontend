import * as React from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import { TodoComponent } from "@components";
import { PrivateRoute } from "@hoc";
import { DIContext, getDependencies } from "@helpers";
import { Navbar, NavbarBrand } from "reactstrap";

import "./app.styles.css";

const App = (): JSX.Element => {
  return (
    <DIContext.Provider value={getDependencies()}>
      <div className="center-wrap">
        <Navbar color="dark" dark>
          <NavbarBrand className="title">TODO</NavbarBrand>
        </Navbar>
        <TodoComponent />
      </div>
    </DIContext.Provider>
  );
};

export default App;
