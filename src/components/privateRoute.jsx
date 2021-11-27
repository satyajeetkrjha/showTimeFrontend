import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import auth from '../services/authService'
const PrivateRoute = ({ path, component: Component, render, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props => {

                if (!auth.getCurrentUser())
                    return (
                        <Redirect
                            to={{
                                pathname: '/',
                                state: { from: props.location }
                            }}
                        />
                    )
                return Component ? <Component {...props} /> : render(props)
            }}
        />
    )
}

export  default PrivateRoute;