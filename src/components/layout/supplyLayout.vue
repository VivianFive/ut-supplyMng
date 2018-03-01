<style>

</style>
<template>
    <div id="layout">
        <v-header>
            <img slot="logo" src="../../assets/images/BK-logo.png" alt="logo">
            <ul>
                <li><router-link to="/supplyDashboard" active-class="link-active">主页</router-link></li>
                <li><router-link to="/commodityMng" active-class="link-active">商品管理</router-link></li>
                <li><router-link to="/orderMng" active-class="link-active">订单管理</router-link></li>
                <li><router-link to="/userMng" active-class="link-active">用户管理</router-link></li>
            </ul>
            <label slot="systemName">货权供货管理系统</label>
        </v-header>
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>
    import vHeader from './header.vue';
    export default {
        components: {
            vHeader
        }
    };
</script>
