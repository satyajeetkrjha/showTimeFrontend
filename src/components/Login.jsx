import React from 'react'
import styled from "styled-components";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import http from "../services/httpService";
import {Toolbar} from "@material-ui/core";
import Typography from "@mui/material/Typography";
class Login extends React.Component{
    constructor(props) {
        super(props);
        this.state ={
            username:'',
            password:'',
            requestFailed:false
        }
    }
    componentDidMount() {
        if(localStorage.getItem('token')!=null){
            this.props.history.push('/dashboard')
        }
    }

    handleInputChange=(event)=> {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        console.log("val is ",event.target);
        this.setState({
            [name]: value
        });
    }
    handleSubmit =async(event)=>{
        event.preventDefault();
        try{
            const response = await http.post('auth/login', {
                username :this.state.username,
                password:this.state.password,
            })
            console.log("response ... ", response);
            if(response && response.status == 200){
                let data = response && response.data;
                console.log("login data .....",data);
                localStorage.setItem('token', data && data.authenticationToken);
                localStorage.setItem('username',data && data.username);
                localStorage.setItem('refreshToken', data && data.refreshToken)
                localStorage.setItem('expiresAt', data && data.expiresAt);
                this.props.history.push('/dashboard')
            }
        }
        catch(ex){
            console.log('ex', ex);
            console.log("API Error: " + JSON.stringify(ex));
            this.setState({
                requestFailed:true
            })
        }
    }

    render(){
        const {requestFailed} = this.state ;
        return(
            <Root>
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

                <FirstRoot style={{backgroundColor:'chocolate'}}>

                    <form onSubmit={this.handleSubmit}>
                        <div>
                            <Names>UserName</Names>
                            <input required={true} name="username"  value={this.state.username} onChange={this.handleInputChange}/>
                        </div>
                        <div>
                            <Names>Password</Names>
                            <input required={true} name="password" type="password" value={this.state.password} onChange={this.handleInputChange}/>
                        </div>
                        <button style={{marginTop:10}} type="submit">Login</button>

                    </form>
                </FirstRoot>
            </Root>

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
   background-color: chocolate;
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

export default withStyles(useStyles)(Login)