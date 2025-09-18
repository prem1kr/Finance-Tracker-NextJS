import React from "react";
import OverView from "../allTransaction/page";
import Expense from "../expanse/page";
import Income from "../income/page";


const Home = () => {
     return(
           <>
            <OverView/>
            <Expense/>
            <Income/>
            
           </>
     )   
}

export default Home;