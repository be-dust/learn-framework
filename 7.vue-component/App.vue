<template>
   <div class="box">
       <li v-for="(img, index) in imgs" :key="index">
           <!-- <img :src="img" alt=""> -->
           <img v-lazy="img">
       </li>
   </div>
</template>

<script>
// import axios from 'axios';// 基于promise
export default {
    data() {
        return {
            imgs: []
        }
    },
    async created() {
        // let {data} = await axios.get('http://www.fullstackjavascript.cn:9999/api/img');
        // console.log(data);
        setTimeout( () => {
            this.imgs = [
                'https://images.unsplash.com/photo-1581320546160-0078de357255?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
                'https://images.unsplash.com/photo-1580996317881-41d34b5c7ba5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
                'https://images.unsplash.com/photo-1580996317881-41d34b5c7ba5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
                'https://images.unsplash.com/photo-1580996317881-41d34b5c7ba5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
                'https://images.unsplash.com/photo-1580996317881-41d34b5c7ba5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
                'https://images.unsplash.com/photo-1580996317881-41d34b5c7ba5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
                'https://images.unsplash.com/photo-1580996317881-41d34b5c7ba5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
                'https://images.unsplash.com/photo-1580996317881-41d34b5c7ba5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
                'https://images.unsplash.com/photo-1580996317881-41d34b5c7ba5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
                'https://images.unsplash.com/photo-1580996317881-41d34b5c7ba5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
                'https://images.unsplash.com/photo-1580996317881-41d34b5c7ba5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
                'https://images.unsplash.com/photo-1580996317881-41d34b5c7ba5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
                'https://images.unsplash.com/photo-1580996317881-41d34b5c7ba5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
                'https://images.unsplash.com/photo-1580996317881-41d34b5c7ba5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
                'https://images.unsplash.com/photo-1580996317881-41d34b5c7ba5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
                'https://images.unsplash.com/photo-1580996317881-41d34b5c7ba5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
                'https://images.unsplash.com/photo-1580996317881-41d34b5c7ba5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
                'https://images.unsplash.com/photo-1580996317881-41d34b5c7ba5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
                'https://images.unsplash.com/photo-1580996317881-41d34b5c7ba5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
                'https://images.unsplash.com/photo-1580996317881-41d34b5c7ba5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
                'https://images.unsplash.com/photo-1580996317881-41d34b5c7ba5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
                'https://images.unsplash.com/photo-1580996317881-41d34b5c7ba5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60',
            ]
        }, 3000);
    }
}
</script>

<style>
.box {
    height: 300px;
    overflow: scroll;
    width: 200px;
    border: 1px solid #ccc;
}
img {
    width: 100px;
    height: 100px;
}
</style>
