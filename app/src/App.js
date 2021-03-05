/*eslint-disable*/
import React, { useEffect } from 'react';
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import PropTypes from "prop-types"

import Home from "./pages/PAGE_HOME"
import Table from "./pages/PAGE_TABLE"
import Map from "./pages/PAGE_MAP"
import NotFound from "./pages/PAGE_NOT_FOUND"

import Header from "./components/HEADER"
import Sidebar from "./components/SIDEBAR"

import * as actions from "./store/actions"

function App(props) {

  console.log(props)

  useEffect(() => {
    props.actions.loadKeys().catch(err => {
      alert(`Loading keys failed: ${err}`)
    })
    props.actions.loadParams({ view: "table", site: "pfr", category: "team", schema: "season" })
  }, [])

  return (
    <Router>
      <Sidebar {...props} />
      <Header {...props} />
      <main id="main">
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path={"/table/:schema"} exact render={() => <Table {...props} />} />
          <Route path={"/map/:schema"} exact component={Map} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </Router>
  );
}

App.propTypes = {
  keys: PropTypes.object.isRequired,
  site: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    keys: state.keys,
    site: state.site
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)