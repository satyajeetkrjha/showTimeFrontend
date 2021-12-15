import React from 'react'
import http from '../services/httpService';
import styled from "styled-components";
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import {Button} from 'react';
import {Toolbar} from "@material-ui/core";
import Typography from "@mui/material/Typography";
 class Signup extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            locations:[],
            firstName:'',
            lastName:'',
            email:'',
            password:'',
            username:'',
            location:'',
            options:[],
            textdisplay:false,
            loactionId:1
        }
        this.handleInputChange = this.handleInputChange.bind(this);

    }
    componentDidMount() {
        localStorage.clear();
        this.callLocationsApi();
    }

     redirectLogin =()=>{
        this.props.history.push('/login')
     }


    callLocationsApi = async () => {
        let url = 'showtime/locations';
        const response = await http.get(url)
        let locationdata = response && response.data ;
        let optionsArray =[];
        for(let index =0 ;index <locationdata.length;index++){
            optionsArray.push({
                'value':locationdata[index].locationName,
                'label':locationdata[index].locationName,
                 'id':locationdata[index].locationId
            })
        }
        this.setState({
            options:optionsArray
        })
    }
    handleInputChange=(event)=> {
        const target = event.target;
        const value =  target.value;
        const name = target.name;
        console.log("val is ",event.target);
        this.setState({
            [name]: value
        });

    }
     handleChange=(event)=> {

        let value =event.target.value ;
        let locationData = this.state.options.filter((data) => data.value  === value);
        console.log("locationData ",locationData);
         this.setState({
             location: value ,
             locationId:locationData && locationData[0] && locationData[0].id
         });
     }
     handleSubmit= async (event)=> {

         event.preventDefault();
         console.log("state here ", this.state);
         let obj ={
             username :this.state.username,
             firstName : this.state.firstName,
             lastName : this.state.lastName,
             email:this.state.email,
             password:this.state.password,
             locationId :this.state.locationId
         };

        console.log("obj is ",obj);
         try{
             const response = await http.post('auth/signup', {
                username :this.state.username,
                firstName : this.state.firstName,
                lastName : this.state.lastName,
                email:this.state.email,
                password:this.state.password,
                locationId :this.state.locationId

             })
             console.log("response",response);
             if(response && response.status == 200){
                 this.setState({
                     textdisplay:true
                 })
             }
         }
         catch(ex){
            console.log("error user registeration",ex);
         }

     }


    render(){
        console.log("locations",this.state);
        const {classes} = this.props;
        const {options,textdisplay} = this.state ;


        return(
            <div>
                <div>
                    <header style={{display:""}} >

                        <Toolbar style={{backgroundColor:'red',display:"grid"}}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}>
                                <Typography style={{fontSize:"22px",fontColor:"green"}}>
                                    Show Time
                                </Typography>
                            </div>

                        </Toolbar>
                    </header>
                </div>

                <FirstRoot  style={{backgroundColor:'chocolate'}}>
              <form onSubmit={this.handleSubmit}>
                  <div>
                      <Names>
                          FirstName
                      </Names>
                      <input required={true} name="firstName" type="text" value={this.state.firstName} onChange={this.handleInputChange}
                      />
                  </div>
                  <div>
                      <Names>
                          LastName
                      </Names>
                      <input required={true} name="lastName" type="text" value={this.state.lastName} onChange={this.handleInputChange}/>
                  </div>
                  <div>
                      <Names>Email</Names>
                      <input required={true} name="email" type="email" value={this.state.email} onChange={this.handleInputChange}/>
                  </div>
                  <div>
                      <Names>Password</Names>
                      <input required={true} name="password" type="password" value={this.state.password} onChange={this.handleInputChange}/>
                  </div>
                  <div>
                      <Names>UserName</Names>
                      <input required={true} name="username"  value={this.state.username} onChange={this.handleInputChange}/>
                  </div>

                      <div style={{marginTop:10,width:'200px'}}>
                      <select  placeholder="select a city" value={this.state.location} onChange={this.handleChange}>

                          {
                              options && options.map((data)=>{
                                  return(

                                      <option value={data.value}>
                                        {data.label}
                                      </option>
                                  )
                              })
                          }


                      </select>
                      </div>
                  <button style={{marginTop:10}} type="submit">SignUp</button>
                  {
                      textdisplay == true?
                          <div style={{marginTop:10}}>
                              Verify your email and click on <button onClick ={this.redirectLogin}>Login</button>
                          </div>
                          :
                          null

                  }
              </form>
            </FirstRoot>

            </div>


        )
    }
}

const FirstRoot = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
 
`;

 const Root = styled.div`
   backgroundColor:'chocolate'
 `

 const Names = styled.div`
   font-size: 18px;
   line-height: 1.75;
 `

 const city = styled.p`
   font-size: 10px;
 `

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default withStyles(useStyles)(Signup)