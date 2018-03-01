<style>

</style>
<template>
    <div id="layout">
        <v-header>
            <img slot="logo" src="../../assets/images/nav_logo.png" alt="logo">
            <ul>
                <li><router-link to="/dashboard" active-class="link-active">概况</router-link></li>
                <li><router-link to="/vip" active-class="link-active">会员数据</router-link></li>
            </ul>
            <label slot="systemName">会员财务数据查询系统</label>
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
