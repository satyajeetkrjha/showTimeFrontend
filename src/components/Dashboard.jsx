
import React from 'react'
import http from "../services/httpService";
import axios from 'axios'
import config from '../config.json'
import styled from "styled-components";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Toolbar} from  "@material-ui/core";
import ProfileImageBox from 'react-profile-image-box'
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';

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
            events :[],
            src: "https://gravatar.com/avatar/2b2c67c5623f5c6148b3cfe4eeb53b83?s=400&d=robohash&r=x",
            interested:[],
            userInterested:[]

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
            },()=>{
                console.log("callback ....", this.state.events);
                let eventId = this.state.events && this.state.events[0] && this.state.events[0].eventId;
                this.callInterestedUsers(eventId);
            })
        })
    }

    callInterestedUsers=(eventId)=>{



        const {userInterested} = this.state ;
        // check if this eventId already exists in state
        function eventIdExists(eventId) {
            return userInterested.some(function(el) {
                return el.eventId === eventId;
            });
        }
        if(!eventIdExists(eventId)){
            console.log("loggging ........");
            let baseUrl = config.apiUrl;
            let url = baseUrl+'showtime/interested/'+eventId;

            axios.get(url).then((response)=>{
                console.log("interestedusers .....", response);
                let data = response && response.data;
                console.log("usersinterested..", this.state.userInterested);
                console.log("data below is ...", data);

                let mergedData = [...this.state.userInterested,...data];
                console.log("mergedData...",mergedData);
                this.setState({
                    userInterested :mergedData
                })

            })
        }

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


    markInterested =(data)=>{
        console.log("data is ", data);
        let userData = JSON.parse(localStorage.getItem('userData'));

        console.log("userData",userData);

        let dataToApi = {
            'userId':userData && userData.userId,
            'eventId':data && data.eventId
        }
        console.log("dataToApi",dataToApi);
        let baseUrl = config.apiUrl;
        let url = baseUrl +'showtime/interested';
        axios.post(url,dataToApi)
            .then((response)=>{
               this.setState({
                  interested : [...this.state.interested,dataToApi.eventId]
               })
            })




    }


    render(){
        console.log("state" ,this.state);
        let categoryName;
        const {categories,userswithcategories,suggestions,events,userData} = this.state;
        return(
            <div style={{backgroundColor:'black' ,minHeight:"1000px"}} >
                <header >

                        <Toolbar style={{backgroundColor:'red'}}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <Typography>
                                    Show Time
                                </Typography>
                            </div>

                        </Toolbar>
                </header>
                <ProfileImageBox
                    alt="Alt Text"

                    onFileChange={(e) => this.onFileChange(e, {type: 'user-image'})}
                    src={this.state.src}/>
                <Typography style={{color:'green'}}>
                    {userData.firstName} {userData.lastName}
                </Typography>
                <StyledButton>
                    Logout
                </StyledButton>
            <div style={{
                display:'flex',
                flexDirection:'row',
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
                             <StyledButton onClick={()=>{this.categoryClick(category)}}>
                                 {categoryName.toUpperCase()}
                             </StyledButton>
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

                    marginLeft:20
                }}>


                    <Typography style={{color:'white'}}>
                        User following this category
                    </Typography>

                        {
                            userswithcategories && userswithcategories.map((item)=>{
                                return(
                                    <Card style={{margin:20}}>
                                    <CardContent>
                                        <Typography style={{color:'blue'}}>
                                            {item.firstName} {'   '} {item.lastName}
                                        </Typography>
                                    </CardContent>
                                    </Card>
                                )
                            })


                        }

                </div>

                  <Accordion allowMultipleExpanded>


                  {
                      this.state.events && this.state.events.map((item) =>{

                          let InterestedUsers = this.state.userInterested
                              &&
                              this.state.userInterested.filter((data)=> data.eventId === item.eventId);
                          console.log("InterestedUser...",InterestedUsers);


                          return(
                              <AccordionItem onClick={()=> this.callInterestedUsers(item && item.eventId)} style={{'width':'200px'}}>
                                  <AccordionItemHeading>
                                  <AccordionItemButton >
                                    Users Following  {item && item.eventName}
                                  </AccordionItemButton>
                                  </AccordionItemHeading>
                                  {console.log("inside jsx", InterestedUsers)}

                                  <AccordionItemPanel style={{'color':"darkgreen"}}>
                                      {
                                          <div>
                                              {
                                                  this.state.userInterested && this.state.userInterested.filter((data)=>data.eventId == item.eventId).map((data)=>{

                                                      return(
                                                          <div>
                                                              {data.firstName}+{data.lastName}
                                                          </div>
                                                      )
                                                  })
                                              }
                                          </div>


                                      }

                                  </AccordionItemPanel>

                              </AccordionItem>

                          )
                      })


                  }
                  </Accordion>










                  <div style={{
                      margin:20
                  }}>
                      <p>Events for this {
                          this.state.selectedCategory.categoryName &&
                          this.state.selectedCategory.categoryName.toUpperCase()
                      }</p>

                      <div >
                          {

                              events && events.map((item)=>{
                                  return(
                                      <Card sx={{ minWidth: 275,margin:10 }}>
                                          <CardContent>
                                              <div  style={{display:'flex'}}>
                                                  <Typography>
                                                      Event Name :
                                                  </Typography>
                                                  <Typography>
                                                      {'  '} {item.eventName}
                                                  </Typography>
                                              </div>

                                              <div style={{display:'flex'}}>
                                                  <Typography>
                                                      StartDate :
                                                  </Typography>
                                                  <Typography>
                                                      {' '} {item.startDate}
                                                  </Typography>
                                              </div>
                                             <div style={{display:'flex'}}>
                                                 <Typography>
                                                     EndDate :
                                                 </Typography>
                                                 <Typography>
                                                     {' '}{item.endDate}
                                                 </Typography>
                                             </div>

                                          </CardContent>
                                          <CardActions>
                                              <Button onClick ={()=>{this.markInterested(item)}} size="small">Click to Mark Interested</Button>
                                          </CardActions>
                                      </Card>
                                  )
                              })


                          }

                      </div>
                  </div>
                <div style={{

                    color: 'white' ,

                    margin:20


                }}>
                    Categories Suggested For You
                    <div>
                        {
                            suggestions && suggestions.map ((item)=>{
                                return(

                                    <Card style={{margin:20}}>
                                        <CardContent>
                                            <Typography>
                                                {item.categoryName}
                                            </Typography>
                                            <StyledButton onClick={()=>{this.followCategory(item)}}>
                                                Follow
                                            </StyledButton>
                                        </CardContent>
                                    </Card>

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

const StyledButton = styled.button`
  background-color: royalblue;
  width: 170px;
  color: white;
  font-size: 15px;
  padding: 10px 40px;
  border-radius: 5px;
  margin: 10px 0px;
  cursor: pointer;
`;