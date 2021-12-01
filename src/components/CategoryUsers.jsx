import React from 'react'
import http from "../services/httpService";
import axios from 'axios'
import config from '../config.json'
import styled from "styled-components";
import Dashboard from './Dashboard';
import headerImage from './Images/Header.png';
export default class CategoryUsers extends React.Component{

    render(){

        return(
            <div>
            <div>
                <img class="headerimage" src='Header.png' alt="not dsiplaying Header Image" style={{width: '100%', height: '194px'}}/>
            </div>
            <div>
                <p style={{
                    backgroundColor: 'white',
                    color:'Black',
                    display:'flex',
                    flexdirection:'column',
                    justifyContent: 'space-around',
                    paddingTop:20,
                    fontSize:'30px',
                    fontFamily:'serif',
                    fontWeight:600,
                    marginLeft:-356

                }}> 
                {this.state.selectedCategory.categoryName &&
                          this.state.selectedCategory.categoryName.toUpperCase()} in {userData.locationId}
                </p>


            </div>
            </div>
        )
    }

}

