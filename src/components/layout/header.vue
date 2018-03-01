<style scoped lang="less" type="text/less">
    #head{
        height: 80px;
        background: #00BA9C;
    }
    .header-container{
        width: 1170px;
        height: 100%;
        margin:0 auto;
        display: flex;
        align-items: center;
        color: #ffffff;
        font-size: 16px;
    }
    .header-nav{
        flex: 1;
        margin: 0 10px;
        > ul{
            width: 400px;
            margin: 0 auto;
            > li{
                display: inline-block;
                height: 60px;
                min-width: 70px;
                line-height: 60px;
                /*border-bottom: 5px solid #ffffff;*/
                text-align: center;
                cursor: pointer;
                > a{
                    color: #ffffff;
                    width: 100%;
                    height: 100%;
                    display: inline-block;
                }
            }
        }
    }
    .header-right{
        > span{
            /*color: #dddddd;*/
        }
        > i{
            display: inline-block;
            height: 24px;
            width: 1px;
            background: #ffffff;
            margin: 0 15px;
            vertical-align: middle;
        }
    }
    .log-out{
        color: #ffffff;
        cursor: pointer;
    }
</style>
<template>
    <div id="head">
        <div class="header-container">
            <slot name="logo"></slot>
            <div class="header-nav">
                <slot></slot>
            </div>
            <div class="header-right">
                <!--已登录<span>(仅供内部查看)</span><i></i><a href="javascript:;" class="log-out" @click="logoutHandle">退出</a>-->
                <span>欢迎 <label style="text-decoration: underline">{{userName}}</label> 使用<slot name="systemName"></slot>（仅供内部使用）</span><a href="javascript:;" class="log-out" @click="logoutHandle">退出</a>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        methods: {
            logoutHandle() {
                localStorage.removeItem('code');
                this.$router.push('/login');
            }
        },
        computed: {
            userName: () => {
                let code = localStorage.getItem('code');
                const nameMap = {
                    '039b9560': 'BestK_华仔',
                    '94ce957f': 'BestK_千落',
                    '78d71a2a': 'BestK_慕华',
                    'f8833e4e': 'BestK_秦淮',
                    'c4e3917c': 'BestK_翠色',
                };
                return nameMap[code];
            }
        }
    };
</script>
