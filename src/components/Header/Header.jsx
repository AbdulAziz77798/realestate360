import React, { useState } from "react";
import "./Header.css";
import { BiMenuAltRight } from "react-icons/bi";
import { getMenuStyles } from "../../utils/common";
import useHeaderColor from "../../hooks/useHeaderColor";
import OutsideClickHandler from "react-outside-click-handler";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import ProfileMenu from "../ProfileMenu/ProfileMenu";
import AddPropertyModel from "../AddPropertyModel/AddPropertyModel";
import useAuthCheck from "../../hooks/useAuthCheck"
const Header = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const headerColor = useHeaderColor();
  const [modalOpened,setModalOpened] = useState(false)

  const { loginWithRedirect , isAuthenticated , user, logout } = useAuth0();

  const {validateLogin}= useAuthCheck()
  const handleAddPropertyClick = ()=>{
    if (validateLogin()){
      setModalOpened(true)
    }
  }
  return (
    <section className="h-wrapper" style={{ background: headerColor }}>
      <div className="flexCenter innerWidth paddings h-container">
        {/* logo */}
        <Link to="/">
          <img src="./logo.png" alt="logo" width={100} />
        </Link>

        {/* menu */}
        <OutsideClickHandler
          onOutsideClick={() => {
            setMenuOpened(false);
          }}
        >
          <div className="flexCenter h-menu" style={getMenuStyles(menuOpened)}>
            <NavLink to="/properties">Properties</NavLink>
            <a href="mailto:abdulaziz2002ece@gmail.com">Contact</a>

            <div onClick={handleAddPropertyClick}>
              Add Property
            </div>
            <AddPropertyModel
              opened={modalOpened}
              setOpened ={setModalOpened} 
            />

            {

              !isAuthenticated ?

              (<button className="button" onClick={loginWithRedirect}>
                Login
              </button>)
              :(
                <div>
                  <ProfileMenu user={user} logout={logout}/>
                </div>
              )
            }
          </div>
        </OutsideClickHandler>

        {/* for medium and small screens */}
        <div
          className="menu-icon"
          onClick={() => setMenuOpened((prev) => !prev)}
        >
          <BiMenuAltRight size={30} />
        </div>
      </div>
    </section>
  );
};

export default Header;
