import { useWeb3Modal } from "@web3modal/wagmi/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";

const Header: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();

  return (
    <>
      <header className="header-section index">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav className="navbar navbar-expand-xl nav-shadow" id="navbar">
                <Link className="navbar-brand" to={"/"}>
                  REVIEWERS <span>Hub</span>
                </Link>
                <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasRight"
                  aria-controls="offcanvasRight"
                >
                  <i className="bi bi-list"></i>
                </button>

                <div
                  className="collapse navbar-collapse ms-auto"
                  id="navbar-content"
                >
                  <div className="main-menu index-page">
                    <ul className="navbar-nav mb-lg-0 mx-auto">
                      <li className="nav-item">
                        <Link className="nav-link" to="/">
                          Home
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/companies">
                          Explore Companies
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/about">
                          About Us
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/faq">
                          FAQs
                        </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/how-it-works">
                          How It Works
                        </Link>
                      </li>
                    </ul>
                    <div className="nav-right d-none d-xl-block">
                      <div className="nav-right__search">
                        {/* <button className="nav-right__search-icon btn_theme icon_box btn_bg_white">
                          <i className="bi bi-search"></i> <span></span>
                        </button> */}
                        <button
                          className="btn_theme btn_theme_active"
                          onClick={() => open()}
                        >
                          {!isConnected
                            ? "Connect Wallet"
                            : `${address?.slice(0, 5)}...${address?.slice(-5)}`}
                          <i className="bi bi-arrow-up-right"></i>
                          <span></span>
                        </button>
                      </div>
                      {/* <div className="nav-right__search-inner">
                        <div className="nav-search-inner__form">
                          <form id="search" className="inner__form">
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search company..."
                                required
                              />
                              <button type="button" className="search_icon">
                                <i className="bi bi-search"></i>
                              </button>
                            </div>
                          </form>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <div
        className="offcanvas offcanvas-end"
        tabIndex={-1}
        id="offcanvasRight"
      >
        <div className="offcanvas-body custom-nevbar">
          <div className="row">
            <div className="col-md-7 col-xl-8">
              <div className="custom-nevbar__left">
                <button
                  type="button"
                  className="close-icon d-md-none ms-auto"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                >
                  <i className="bi bi-x"></i>
                </button>
                <ul className="custom-nevbar__nav mb-lg-0">
                  <li className="menu_item">
                    <Link
                      className="menu_link"
                      to="/"
                      data-bs-dismiss="offcanvas"
                    >
                      Home
                    </Link>
                  </li>
                  <li className="menu_item">
                    <Link
                      className="menu_link"
                      to="/companies"
                      data-bs-dismiss="offcanvas"
                    >
                      Explore Companies
                    </Link>
                  </li>
                  <li className="menu_item" data-bs-dismiss="offcanvas">
                    <Link className="menu_link" to="/about">
                      About Us
                    </Link>
                  </li>
                  <li className="menu_item" data-bs-dismiss="offcanvas">
                    <Link className="menu_link" to="/faq">
                      FAQs
                    </Link>
                  </li>
                  <li className="menu_item" data-bs-dismiss="offcanvas">
                    <Link className="nav-link" to="/how-it-works">
                      How It Works
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-5 col-xl-4">
              <div className="custom-nevbar__right">
                <div className="custom-nevbar__top d-none d-md-block">
                  <button
                    type="button"
                    className="close-icon ms-auto"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </div>
                <ul className="custom-nevbar__right-location">
                  <li>
                    <button
                      className="btn_theme btn_theme_active"
                      onClick={() => open()}
                      data-bs-dismiss="offcanvas"
                    >
                      {!isConnected
                        ? "Connect Wallet"
                        : `${address?.slice(0, 5)}...${address?.slice(-5)}`}
                      <i className="bi bi-arrow-up-right"></i>
                      <span></span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
