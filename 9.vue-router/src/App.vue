<template>
  <div id="app">
    <div id="nav">
      <router-link tag="span" to="/">Home</router-link> |
      <router-link tag="span" to="/about">About</router-link>
    </div>
    {{this._routerRoot._router.history.current.path}}
    <br>
    {{this._routerRoot._route}}
    
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  mounted() {
    // console.log('App', this._routerRoot._router);
    // console.log('App的爸爸', this.$parent);
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
