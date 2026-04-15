import React from 'react';
import { Outlet } from 'react-router-dom';
import classes from './AuthLayout.module.css';
import logoImage from '../../assets/images/nomeagle_site_logo.png';
import logoText from '../../assets/images/nomeagle_site_text.png';

export const AuthLayout: React.FC = () => {
  return (
    <div className={classes.layoutContainer}>
      <div className={classes.brandSection}>
        <div className={classes.brandContent}>
          <img src={logoImage} alt="NomEagle Logo" className={classes.logo} />
          <img src={logoText} alt="NomEagle" className={classes.logoText} />
          <p className={classes.subtitle}>Embark on your cultural journey.</p>
        </div>
      </div>
      <div className={classes.formSection}>
         <div className={classes.formContainer}>
           <Outlet />
         </div>
      </div>
    </div>
  );
};
