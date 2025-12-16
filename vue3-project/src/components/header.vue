<script setup>
const userInfo = localStorage.getItem("userinfo")
const faceImg = userInfo

</script>

<template>
    <div id="topMenu">
        <span class="title"></span>
        <div id="faceImg">
            <img class="faceImg" style="width: 90px; height: 90px; border-radius: 50px;" :src="faceImg"/>
        </div>
    </div>
</template>

<style scoped>
#topMenu {
    width: 100%;
    height: 7rem;
    background-color: #97f2ff
}

#faceImg {
    position: relative;
    float: right;
    top: 10px;
    right: 20px;
}
</style>