<template>
    <div class="container">
        <div>
            <h1>Sorry, this page is not available</h1>
            <button type="button"
            @click="redirectMe()"
            class="btn btn-secondary">
                Go Home
            </button>
        </div>
    </div>
</template>
<script>
export default {
    name: "Home",
    methods:{
        redirectMe(){
            this.$router.push({name: "Home"});
        }
    }
};
</script>