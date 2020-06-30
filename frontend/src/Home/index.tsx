import React from 'react';
import './styles.css';
import { Link } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';
import logo from '../assets/logo.svg';

function Home(){
    return (
        <div id="page-home">
            <div className="content">
               <header>
               <img src={logo} alt="Ecoleta" />
               </header>

               <main>
                   <h1>Seu marketplace de coleta de resíduos.</h1>
                   <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>
               <Link to="creat-point">
                   <span>
                       <FiLogIn />
                   </span>
                   <strong>Cadastre um ponto</strong>
               </Link>
               </main>


               {/* <Link to="/creat-point">
                   <FiLogIn />
               </Link> */}
            </div>
        </div>
    );
}

export default Home;