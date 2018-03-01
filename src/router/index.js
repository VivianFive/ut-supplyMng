import Vue from 'vue';
import Router from 'vue-router';

import Dashboard from '@/views/dashboard';
import Vip from '@/views/vip';
import Login from '@/views/login';
import Layout from '@/components/layout';

import SupplyLayout from '@/components/layout/supplyLayout';
import S_dashboard from '@/views/supply/dashboard';
import S_commodity from '@/views/supply/commodity';
import S_order from '@/views/supply/order';
import S_user from '@/views/supply/user';
import S_c_Info from '@/views/supply/commodity/info';
import S_o_Info from '@/views/supply/order/info';
import S_u_Info from '@/views/supply/user/info';


Vue.use(Router);

const routesMap = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/dashboard',
        component: Layout,
        redirect: '/dashboard/index',
        children: [
            {
                path: 'index',
                component: Dashboard
            }
        ]
    },
    {
        path: '/vip',
        component: Layout,
        redirect: '/vip/index',
        children: [
            {
                path: 'index',
                component: Vip
            }
        ]
    },
    {
        path: '/supplyDashboard',
        component: SupplyLayout,
        redirect: '/supplyDashboard/index',
        children: [
            {
                path: 'index',
                component: S_dashboard
            }
        ]
    },
    {
        path: '/commodityMng',
        component: SupplyLayout,
        redirect: '/commodityMng/index',
        children: [
            {
                path: 'index',
                component: S_commodity
            },
            {
                path: 'info',
                component: S_c_Info
            }
        ]
    },
    {
        path: '/orderMng',
        component: SupplyLayout,
        redirect: '/orderMng/index',
        children: [
            {
                path: 'index',
                component: S_order
            },
            {
                path: 'info',
                component: S_o_Info
            }
        ]
    },
    {
        path: '/userMng',
        component: SupplyLayout,
        redirect: '/userMng/index',
        children: [
            {
                path: 'index',
                component: S_user
            },
            {
                path: 'info',
                component: S_u_Info
            }
        ]
    }
];
export default new Router({
    routes: routesMap
});
