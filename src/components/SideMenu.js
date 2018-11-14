import React from 'react';
import { Menu, Icon } from 'antd';
import { NavLink } from 'react-router-dom';


const SideMenu = () => {
    return (
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
                <NavLink to="/">
                    <Icon type="calculator" />
                    <span>Calculator</span>
                </NavLink>
            </Menu.Item> 
            <Menu.Item key="2">
                <NavLink to="/historicalData">
                    <Icon type="area-chart" />
                    <span>Historical data</span>  
                </NavLink>
            </Menu.Item>
        </Menu>);
}

export default SideMenu;