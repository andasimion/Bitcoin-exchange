import React from 'react';
import { Menu, Icon } from 'antd';
import { NavLink, withRouter } from 'react-router-dom';


const SideMenu = () => {
    let href=window.location.href.split('/')
    href=href[3]
    return (
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['/'+href]} selectedKeys={['/'+href]} >
            <Menu.Item key="/">
                <NavLink to="/">
                    <Icon type="calculator" />
                    <span>Calculator</span>
                </NavLink>
            </Menu.Item> 
            <Menu.Item key="/historicalData">
                <NavLink to="/historicalData">
                    <Icon type="area-chart" />
                    <span>Historical data</span>  
                </NavLink>
            </Menu.Item>
        </Menu>);
}

export default withRouter(SideMenu);