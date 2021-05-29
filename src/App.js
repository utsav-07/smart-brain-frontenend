
import './App.css';
import ImageLinkForm from './componenets/ImageLinkForm/ImageLinkForm';
import Logo from './componenets/Logo/Logo';
import Navigation from './componenets/Navigation/Navigation';
import Rank from './componenets/Rank/Rank';

import Particles from 'react-particles-js';
import {React , Component} from 'react';
import FaceRecognition from './componenets/FaceRecognition/FaceRecognition';
import SignIn from './componenets/SignIn/SignIn';
import Register from './componenets/Rgister/Register';


// const app = new Clarifai.App({

//   apiKey: 'a0cf4ff1f1bf410e9221a8d41c65be07'

// });

const particleOptions = {  
  particles : {
    number : {
      value : 80,
      density : {
        enable : true,
        value_area : 800
     }
   },
    color : {
      value :  "#ffffff" 
   },
    shape : {
      
      stroke : {
        width : 0,
        color :  "#ffffff" 
     },
      polygon : {
        nb_sides : 6
     },
    
   },
    opacity : {
      value : 0.5,
      random : false,
      anim : {
        enable : false,
        speed : 1,
        opacity_min : 0.1,
        sync : false
     }
   },
    size : {
      value : 3,
      random : true,
      anim : {
        enable : false,
        speed : 40,
        size_min : 0.1,
        sync : false
     }
   },
    line_linked : {
      enable : true,
      distance : 150,
      color :  "#000000" ,
      opacity : 0.4,
      width : 1
   },
    move : {
      enable : true,
      speed : 6,
      
      random : false,
      straight : false,
      
      bounce : false,
      attract : {
        enable : false,
        rotateX : 600,
        rotateY : 1200
     }
   }
 },
  interactivity : {
    
    events : {
      onhover : {
        enable : true,
        
     },
      onclick : {
        enable : true,
      
     },
      resize : true
   },
    modes : {
      grab : {
        distance : 400,
        line_linked : {
          opacity : 1
       }
     },
      bubble : {
        distance : 400,
        size : 40,
        duration : 2,
        opacity : 8,
        speed : 3
     },
      repulse : {
        distance : 200,
        duration : 0.4
     },
      push : {
        particles_nb : 4
     },
      remove : {
        particles_nb : 2
     }
   }
 },
  retina_detect : true
}

const initialState = {
  
    input: '',
    imageUrl: '',
    box : {},
    route : 'signIn',
    isSignedIn : false,
    user: {
          id: '',
          name: '',
          email: '',
          enteries : 0,
          joined : ''
    }
  
}


class App extends Component {

  constructor(){
    super();
    this.state = initialState;
  }


  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      enteries : data.enteries,
      joined : data.joined
    }})
  }

  // componentDidMount(){
  //   fetch('http://localhost:3000/')
  //   .then(response => response.json())
  //   .then(console.log)
  // }

  calculateFaceLocation = (data) => {
    const clarifyFace = data.outputs[0].data.regions[0].region_info.bounding_box;

    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width,height);

    return{
      leftCol : clarifyFace.left_col * width,
      topRow : clarifyFace.top_row * height,
      rightCol: width - (clarifyFace.right_col * width),
      bottomRow : height - (clarifyFace.bottom_row * height),
    }
  }


  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    console.log(event.target.value);
    this.setState({input : event.target.value})
  }

  onButtonSubmit = () => {
      console.log('click');

      this.setState({imageUrl : this.state.input})

      fetch('https://nameless-basin-70858.herokuapp.com/imageurl' , {
        method: 'post',
        headers :{'Content-Type': 'application/json'},
        body: JSON.stringify({
            input: this.state.input
        })
      }).then(response => response.json())

      // app.models

      // .predict(

      //   Clarifai.FACE_DETECT_MODEL,

      //   this.state.input)

      .then(response => {
        if(response){
          fetch('https://nameless-basin-70858.herokuapp.com/image' , {
            method: 'put',
            headers :{'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(
              Object.assign(this.state.user,{enteries : count} )
            )
          })
          .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
        .catch(err => console.log(err)) 
   
  }


  onRouteChange = (route) => {
    if(route === 'signOut'){
      this.setState(initialState)
    }else if(route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }
  render(){
  return (
    <div className="App">

      <Particles className = 'particles'
             params = {particleOptions}
            
            />
      <Navigation isSignedIn = {this.state.isSignedIn} onRouteChange = {this.onRouteChange}/>
      { this.state.route === 'home' ? 
      <div>
      <Logo/>
      <Rank name = {this.state.user.name} enteries = {this.state.user.enteries}/>
      <ImageLinkForm onInputChange = {this.onInputChange} onButtonSubmit = {this.onButtonSubmit}/>  
      <FaceRecognition box = {this.state.box} imageUrl = {this.state.imageUrl}/>
      </div>
  
      :(
        this.state.route === 'signIn' ?
        <SignIn  loadUser = {this.loadUser} onRouteChange= {this.onRouteChange}/>
        :
        <Register loadUser = {this.loadUser} onRouteChange= {this.onRouteChange}/>
      )
      

      }
    </div>
  );
  }
}

export default App;
