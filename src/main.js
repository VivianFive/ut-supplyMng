// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import iView from 'iview';
import '@/assets/styles/global.less';
import 'iview/dist/styles/iview.css';
import VueCurrencyFilter from 'vue-currency-filter'

Vue.config.productionTip = false;
Vue.use(iView);
Vue.use(VueCurrencyFilter,
    {
        symbol : '￥',
        thousandsSeparator: ',',
        fractionCount: 2,
        fractionSeparator: '.',
        symbolPosition: 'front',
        symbolSpacing: true
    });
router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next();
    } else if (localStorage.getItem('code')) {
        next();
    } else {
        next('/login');
    }
});
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
});
