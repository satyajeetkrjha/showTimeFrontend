
import React from 'react'
import http from "../services/httpService";
import axios from 'axios'
export default class Dashboard extends  React.Component{
    constructor(props) {
        super(props);
        this.state ={
            categories:[]
        }
    }
    componentDidMount () {
        this.callCategoriesApi();
    }

    callCategoriesApi = async()=>{
        let url = 'http://localhost:8080/api/auth/categories';
        axios.get(url)
            .then((response)=>{
                console.log("response is ", response);
            })

    }

    render(){
        return(
            <h1>
                DASHBOARD
            </h1>

        )
    }

}
