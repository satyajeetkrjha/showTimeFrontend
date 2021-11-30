
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
            userswithcategories: [],
            userData: {
                userId:null,
                firstName:null,
                lastName:null
            },
            locationId:null,
            suggestions:[],
            events :[]
        }


    }
    componentDidMount () {
        this.callCategoriesApi();
        this.callUserDataApi();




    }
    callEvents =()=>{
        let baseUrl = config.apiUrl;
        let userData = JSON.parse(localStorage.getItem('userData'));

        let url = baseUrl +'auth/events?';
        const {selectedCategory} = this.state ;
        url+='category='+ selectedCategory.categoryId +'&';

        url+='location='+ userData.locationId;

        axios.get(url).then((response)=>{
            this.setState({
                events :response && response.data
            })
        })
    }
    callSuggestionsApi = async (data)=>{
        let baseUrl = config.apiUrl;
        let url = baseUrl +'showtime/categorysuggestions/';
        url+=data.userId;
        localStorage.setItem("userData",JSON.stringify(data));
        axios.get(url)
            .then((response)=>{
                this.setState({
                  suggestions: response && response.data
                })
            })


    }
    callUserDataApi=()=>{
        let baseUrl = config.apiUrl;
        let url = baseUrl + 'auth/info/';
        url += localStorage.getItem('username');
        axios.get(url)
            .then((response)=>{
                this.setState({
                    userData : response && response.data,
                    locationId :response && response.data && response.data.locationId
                },()=>{
                    this.callSuggestionsApi(this.state.userData);
                })

            })



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
            this.calluserwithcategories(category);
            this.callEvents();
        })

    }
    followCategory =(category)=>{
        let categoryId = category.categoryId;
        let userId =  this.state.userData && this.state.userData.userId;

        let baseUrl = config.apiUrl;
        let url = baseUrl +'showtime/usercategory';

        let data={
            'categoryId':categoryId,
            'userId':userId
        }

        axios.post(url, data)
            .then((response)=>{
                let suggestions = this.state.suggestions.filter((item)=> item.categoryId != categoryId);
                this.setState({
                    suggestions:suggestions
                })
            })
    }

    render(){
        console.log("categories..." ,this.state);
        let categoryName;
        const {categories,userswithcategories,suggestions,events} = this.state;
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
                  display:'flex',
                  justifyContent :'space-between'


              }}>
                <div style={{
                    backgroundColor: 'red',
                    color: 'white' ,
                    width:500,
                    height:600,
                    marginLeft:20
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


                  <div style={{
                      backgroundColor: 'blue',
                      color: 'white' ,
                      width:500,
                      height:600,
                      marginLeft:20
                  }}>
                      <p>Events for this {
                          this.state.selectedCategory.categoryName &&
                          this.state.selectedCategory.categoryName.toUpperCase()
                      }</p>
                      <div >
                          {

                              events && events.map((item)=>{
                                  return(
                                      <div>
                                          <p>{item.eventName}  </p>
                                          <p>{item.startDate}</p>
                                          <p>{item.endDate}</p>

                                      </div>
                                  )
                              })


                          }

                      </div>
                  </div>
                <div style={{
                    backgroundColor: 'green',
                    color: 'white' ,
                    width:500,
                    marginRight:20


                }}>
                    Categories Suggested For You
                    <div>
                        {
                            suggestions && suggestions.map ((item)=>{
                                return(
                                    <div>
                                        <p> {item.categoryName}</p>
                                        <Button onClick={()=>{this.followCategory(item)}}>
                                            Follow
                                        </Button>
                                    </div>
                                )
                            })

                        }
                    </div>

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