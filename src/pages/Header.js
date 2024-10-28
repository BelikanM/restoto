// Header.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUtensils, FaStar, FaShoppingCart, FaUser } from 'react-icons/fa';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  background-color: #075e54;
  padding: 16px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999;
`;

const NavList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-between;
`;

const NavItem = styled.li`
  flex: 1;
  text-align: center;
`;

const NavLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${props => (props.active ? '#fff' : 'rgba(255, 255, 255, 0.7)')};
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: #fff;
  }
`;

const NavIcon = styled.div`
  font-size: 24px;
  margin-bottom: 4px;
`;

const NavText = styled.span`
  font-size: 12px;
`;

function Header() {
  const location = useLocation();

  return (
    <HeaderWrapper>
      <nav>
        <NavList>
          <NavItem>
            <NavLink to="/" active={location.pathname === '/'}>
              <NavIcon><FaHome /></NavIcon>
              <NavText>Accueil</NavText>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/menu" active={location.pathname === '/menu'}>
              <NavIcon><FaUtensils /></NavIcon>
              <NavText>Menu</NavText>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/specials" active={location.pathname === '/specials'}>
              <NavIcon><FaStar /></NavIcon>
              <NavText>Spécialités</NavText>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/cart" active={location.pathname === '/cart'}>
              <NavIcon><FaShoppingCart /></NavIcon>
              <NavText>Panier</NavText>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/account" active={location.pathname === '/account'}>
              <NavIcon><FaUser /></NavIcon>
              <NavText>Mon Compte</NavText>
            </NavText>
          </NavItem>
        </NavList>
      </nav>
    </HeaderWrapper>
  );
}

export default Header;
