
import React, { Component } from "react";
import {Routes, Route, Switch} from "react-router-dom";
import {UserProfile} from "./components";
import {Signup,DashBoard,Login,Userprofile,PrivateRoute} from "./components";


class App extends React.Component{
  render(){
    return(
       <React.Fragment>
           <main>
               <Switch>

                   <PrivateRoute path="/userprofile"
                                 component={UserProfile}/>
                   <PrivateRoute path="/dashboard"
                                 component={DashBoard}/>
                   <Route path="/signup" component={Signup}/>
                   <Route path="/login" component={Login}/>
                   <Route path ="/" component={Signup}/>
               </Switch>
           </main>
       </React.Fragment>
    )
  }

}

export default App;
