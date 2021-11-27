import React from 'react'
import http from '../services/httpService'
export default class Signup extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            locations:[]
        }
    }
    componentDidMount() {
      this.callLocationsApi();
    }
    callLocationsApi = async () => {
        let url = 'showtime/locations';
        const response = await http.get(url)
        this.setState({
            locations:response && response.data
        })
    }

    render(){
        console.log("locations",this.state);
        return(
            <div>
                <h1>
                    SignUp
                </h1>
            </div>
        )
    }
}