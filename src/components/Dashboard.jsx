
import React from 'react'
import http from "../services/httpService";
import axios from 'axios'
import config from '../config.json'
import styled from "styled-components";
export default class Dashboard extends  React.Component{
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            selectedCategory: {},
            userswithcategories: []

        }
    }
    componentDidMount () {
        this.callCategoriesApi();
    }

    callCategoriesApi = async()=>{
        let baseUrl = config.apiUrl;
        let url = baseUrl +'auth/categories';
        axios.get(url)
            .then((response)=>{
                this.setState({
                    categories: response && response.data,
                    selectedCategory:response && response.data[0]

                },()=>{
                    this.calluserwithcategories(this.state.selectedCategory)
                })

            })

    }
    calluserwithcategories =(category)=>{
        let baseUrl = config.apiUrl;
        let url = baseUrl +'showtime/getusercategories/';
        url+=category.categoryId;
        axios.get(url)
            .then((response)=>{
                console.log("response...",response);
                this.setState({
                    userswithcategories: response && response.data
                })

            })
    }

    categoryClick =(category)=>{
        console.log("category ....", category);
        this.setState({
            selectedCategory:category
        },()=>{
            this.calluserwithcategories(category)
        })

    }

    render(){
        console.log("categories..." ,this.state);
        let categoryName;
        const {categories,userswithcategories} = this.state;
        return(
            <div>
            <div style={{
                display:'flex',
                flexdirection:'row',
                justifyContent: 'space-around',
                paddingTop:20,
             

            }}>
                {
                    categories && categories.map((category)=>{
                        let categoryName = category.categoryName;
                        let categoryId = category.categoryId;

                        return(
                            <div key={categoryId} style={{
                                paddingLeft:'10px',
                                paddingRight:'10px'
                            }}>
                             <Button onClick={()=>{this.categoryClick(category)}}>
                                 {categoryName.toUpperCase()}
                             </Button>
                            </div>
                        )
                    })

                }





            </div>
                <div style={{
                    backgroundColor: 'red',
                    color: 'white' ,
                    width:500,
                    height:600
                }}>
                    <p>USERS FOLLOWING {
                        this.state.selectedCategory.categoryName &&
                        this.state.selectedCategory.categoryName.toUpperCase()
                    }</p>
                    <div >
                        {

                                userswithcategories && userswithcategories.map((item)=>{
                                    return(
                                        <div>
                                           <p>{item.firstName} {'   '} {item.lastName}  </p>
                                        </div>
                                    )
                            })


                        }

                    </div>

                </div>
            </div>
        )
    }

}

const Button = styled.button`
  background-color: royalblue;
  width: 170px;
  color: white;
  font-size: 15px;
  padding: 10px 40px;
  border-radius: 5px;
  margin: 10px 0px;
  cursor: pointer;
`;