import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { withRouter } from 'next/router'
import { startsWith, get } from '../lib/utils'
import { Router, Link } from '../routes'

import Search from './Search'
import Avator from './Avator'
import { ME } from '../query/index.gql'

class Header extends Component {
  constructor (props) {
    super(props)
    this.state = {
      toggle: false 
    }
    this.handleSearch = this.handleSearch.bind(this)
    this.handleTouchStart = this.handleTouchStart.bind(this)
  }

  handleSearch (value) {
    Router.pushRoute('poems', {
      q: value 
    })
  }

  handleTouchStart () {
    this.setState({
      toggle: !this.state.toggle 
    })
  }

  renderMobile () {
    const { router: { query, asPath } } = this.props
    return (
      <div className={`container mobile-container ${this.state.toggle ? 'active' : ''}`}>
        <style jsx>{`
          .item {
            height: 53px; 
            width: 100%;
            display: flex;
            justify-content: flex-start;
            border-top: 1px solid #f6f6f6;
            padding: 0 20px;
          }

          .container {
            display: flex;
            position: relative;
          }

          .mobile-container {
            display: none; 
            opacity: 0;
            transition: all ease .3s;
          }

          .mobile-container.active {
            opacity: 1;
            display: flex; 
            flex-direction: column;
          }
        `}</style>
        <div className="item">
          <Link route="poems">
            <a className={(startsWith(asPath, '/poems') && asPath.indexOf('phrase') === -1) || asPath === '/' ? 'active' : ''}>诗词</a>
          </Link>
        </div>
        <div className="item">
          <Link route="authors">
            <a className={startsWith(asPath, '/authors') ? 'active' : ''}>作者</a>
          </Link>
        </div>
        <div className="item">
          <Link route="phrases">
            <a className={asPath.indexOf('phrase') !== -1 ? 'active' : ''}>名句</a>
          </Link>
        </div>
        <div className="item">
          <Search
            defaultValue={query.q}
            placeholder={query.q || '将进酒'}
            onSearch={this.handleSearch}
          />
        </div>
      </div>
    )
  }

  render () {
    const { router: { query, asPath }, username, userId, loading } = this.props
  
    return (
      <header>
        <div className="container">
          <Link href="/">
            <span className="title">诗词弦歌</span>
          </Link>
          <Link route="poems">
            <a className={(startsWith(asPath, '/poems') && asPath.indexOf('phrase') === -1) || asPath === '/' ? 'active hidden-xs' : 'hidden-xs'}>诗词</a>
          </Link>
          <Link route="authors">
            <a className={startsWith(asPath, '/authors') ? 'active hidden-xs' : 'hidden-xs'}>作者</a>
          </Link>
          <Link route="phrases">
            <a className={asPath.indexOf('phrase') !== -1 ? 'active hidden-xs' : 'hidden-xs'}>名句</a>
          </Link>
          <div className="search-box">
            <Search
              defaultValue={query.q}
              placeholder={query.q || '将进酒'}
              onSearch={this.handleSearch}
              style={{ marginLeft: 20 }}
            />
          </div>
          {
            loading ? null : username ? <a className="active user">
                <Avator name={username} />
              </a> :
              <Link href='/login'>
                <a className="active" style={{ marginLeft: 'auto' }}>登录</a>
              </Link>
          }
          <div className="button more" onTouchStart={this.handleTouchStart} >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path fill="#888" d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
          </div>
          <div className="dropdown-menu">
            <Link route="profile" params={{ userId: String(userId), tag: 'stars' }}>
              <a className="dropdown-item">个人中心</a>
            </Link>
            <a className="dropdown-item" href="" onClick={() => localStorage.token = ""}>注销</a>
          </div>
        </div>
        { this.renderMobile() }
        <style jsx>{`
          header {
            margin-bottom: 20px;
            line-height: 53px;
            background-color: #fff;
            box-shadow: 0 1px 3px rgba(26,26,26,.1);
            position: fixed;
            width: 100%;
            z-index: 1;
          }

          .search-box {
            display: flex; 
          }

          @media (max-width: 575px) {
            header {
              margin-bottom: 1px; 
              padding: 0 20px;
            }
            .search-box {
              display: none; 
            }
            .more.button {
              display: flex; 
              padding: 0 10px;
              align-items: center;
            }
          }

          .container {
            display: flex;
            position: relative;
          }

          .title {
            font-size: 25px; 
            color: #f60;
            cursor: pointer;
          }

          a {
            font-size: 18px;
            margin-left: 20px;
            color: #888;
          }

          a.active {
            color: #f60; 
          }

          .more {
            display: none;
          }

          .user {
            margin-left: auto; 
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .user:hover ~ .dropdown-menu,
          .dropdown-menu:hover {
            display: block; 
          }

          .dropdown-item {
            display: block;
          }

          .dropdown-menu {
            display: none;
            width: 8rem;
            position: absolute; 
            right: 0;
            top: 100%;
            background-color: #fff;
            border: 1px solid rgba(177,180,185,.45);
            box-shadow: 0 1px 2px 0 rgba(0,0,0,.1);
          }
        `}</style>
      </header>
    )
  }
}

export default compose(
  withRouter,
  graphql(ME, {
    props ({ data }) {
      return {
        username: get(data, 'me.name'),
        userId: get(data, 'me.id'),
        loading: data.loading
      }
    },
    options: {
      ssr: false
    }
  })
)(Header)
