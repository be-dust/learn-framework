
<template>
    <div>
        <my-menu :data="data"></my-menu>
    </div>
</template>

<script>
import myMenu from './components/my-menu.js';
export default {
    components: {
        'my-menu': myMenu
    },
    data() {
        return {
            data: [
                { title: "根1", id: 1 },
                {
                    title: "根2",
                    id: 2,
                    children: [
                        {
                            title: "根2-1",
                            id: 21,
                            children: [
                                { title: "根2-1-1", id: 211 },
                                { title: "根2-1-2", id: 212 }
                            ]
                        }
                    ]
                },
                { title: "根3", id: 3 },
                {
                    title: "根4",
                    id: 4,
                    children: [
                        { title: "根4-1", id: 41 },
                        { title: "根4-2", id: 42 }
                    ]
                }
            ]
        };
    }
};
</script>

<style>
</style>
