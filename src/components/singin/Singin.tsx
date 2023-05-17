import Logo from "./Logo";
import SinginForm from "./SinginForm";
import StyleSheet from 'reactjs-styleSheet';

export default function Singin() {
    return (
        
    <div style={style.container}>
         <div style={style.logo}>
            <Logo></Logo>
         </div>
      
       
     <div className="bg-yellow-100 rounded-md drop-shadow-md" style={style.signin}>
        <SinginForm></SinginForm>
     </div>

     <div className="container" >

     </div>
   </div>
    ) 

}

const style = StyleSheet.create({
    container : {
        height:'100vh',
        width:'100vw',
        display: "flex",
        justifyContent: "space-around",
        alignItems:"center",
        flexWrap: 'wrap',
    },
    logo : {
        height: "100px",
        width: "500px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    signin: {
        width: "400px"
    }
})