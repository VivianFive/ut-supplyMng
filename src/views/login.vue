<style scoped lang="less" type="text/less">
  #login{
    position: relative;
    height: 100%;
  }
  .container{
    height: 348px;
    background: #00BA9C;
    position: absolute;
    top:50%;
    left: 0;
    right: 0;
    margin-top: -174px;
      display: flex;
      justify-content: center;
      align-items: center;
  }
  .codeInput{
    display: inline-block;
    width: 280px;
    height: 52px;
    border: 1px solid #77D9CA;
    padding: 10px 20px;
    background: transparent;
    color: #ffffff;
    font-size: 14px;
      margin-right: 15px;
      margin-left: 110px;
    &::placeholder{
      color: #77D9CA;
    }
  }
  .loginBtn{
    width: 120px;
    height: 32px;
    border: 1px solid #ffffff;
    background: transparent;
    color: #fff;
    font-size: 16px;
      cursor: pointer;
      border-radius: 3px;
      padding: 0 3px;
  }
  .loginBtn:first-child{
      margin-bottom: 15px;
  }
</style>
<template>
  <div id="login">
    <div class="container">
      <img src="../assets/images/login_logo.png" alt="logo">
      <input type="text" v-model="code" placeholder="请输入授权码" class="codeInput">
        <div>
            <div>
                <button class="loginBtn" @click="() => loginHandle()">登录财务系统</button>
            </div>
            <div>
                <button class="loginBtn" @click="() => loginHandle('supply')">登录供货系统</button>
            </div>
        </div>

    </div>
  </div>
</template>
<script>
    let validCode = ['039b9560', '94ce957f', '78d71a2a', 'f8833e4e', 'c4e3917c'];
    export default {
        data() {
            return {
                code: ''
            };
        },
        methods: {
            loginHandle(type) {
                if (!this.code) {
                    this.$Message.error('请输入授权码！');
                    return;
                }
                if (validCode.includes(this.code)) {
                    localStorage.setItem('code', this.code);
                    this.$router.push(type ? '/supplyDashboard' : '/dashboard');
                } else {
                    this.$Message.error('授权码错误！');
                }
            }
        }
    };
</script>
