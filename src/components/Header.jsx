import { NavLink, useLocation } from "react-router-dom";
import LogoBranca from '../img/logo-preta.png';

const getNavLinkClass = ({ isActive }) =>
  "nav-link" + (isActive ? " active" : "");

const Header = () => {
  const location = useLocation();
  const isDropdownActive = location.pathname.startsWith("/controle-de-usuarios");

  return (
    <div className="container">
      <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
        <NavLink
          to="/"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none"
        >
          <img
            src={LogoBranca}
            alt="Logo Preta"
            width={120}
            height={60}
            className="me-2"
            aria-hidden="true"
          />
        </NavLink>

        <ul className="nav nav-pills">
          <li className="nav-item">
            <NavLink to="/" className={getNavLinkClass}>
              Home
            </NavLink>
          </li>

          {/* Dropdown de Controle de Usuários */}
          <li className="nav-item dropdown">
            <a
              href="#"
              className={`nav-link dropdown-toggle${isDropdownActive ? " active" : ""}`}
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Controle de Usuários
            </a>
            <ul className="dropdown-menu">
              <li>
                <NavLink to="/controle-de-usuarios/usuarios" className="dropdown-item">
                  Usuários
                </NavLink>
              </li>
              <li>
                <NavLink to="/controle-de-usuarios/perfis" className="dropdown-item">
                  Perfis
                </NavLink>
              </li>
              <li>
                <NavLink to="/controle-de-usuarios/permissoes" className="dropdown-item">
                  Permissões
                </NavLink>
              </li>
            </ul>
          </li>

          <li className="nav-item">
            <NavLink to="/pricing" className={getNavLinkClass}>
              Pricing
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/faqs" className={getNavLinkClass}>
              FAQs
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/about" className={getNavLinkClass}>
              About
            </NavLink>
          </li>
        </ul>
      </header>
    </div>
  );
};

export default Header;
