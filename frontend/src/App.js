import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import Groups from "./components/Groups/Groups";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage/LandingPage";
import Events from "./components/Events/Events";
import EventById from "./components/Events/EventById";
import GroupById from "./components/Groups/GroupById";
import CreateGroup from './components/Groups/CreateGroup'
import NotLoggedIn from "./components/NotLoggedIn/NotLoggedIn";


function App() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);
  
const loggedIn = () => {
  if(sessionUser){
    return (
      <Route path="/groups/new">
        <CreateGroup />
      </Route>
    );
  }else return (
    <Route path="/groups/new">
      <NotLoggedIn />
    </Route>
  );
}

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          {loggedIn()}
          <Route path="/groups/:groupId">
            <GroupById />
          </Route>
          <Route path="/events/:eventId">
            <EventById />
          </Route>
          <Route path="/events">
            <Events />
          </Route>
          <Route path="/groups">
            <Groups />
          </Route>
          <Route path="/login">
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route>Sorry. Page does not exist</Route>
        </Switch>
      )}
    </>
  );
}

export default App;
