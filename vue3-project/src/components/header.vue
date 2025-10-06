<script>
export default {
    props: {
        title: { type: String, default: "" },
        faceImg: { type: String, default: "https://static.wikia.nocookie.net/feheroes_gamepedia_en/images/9/9e/Nerthuz_God_of_the_Land_Face_FC.webp" },
    },
}
</script>

<template>
    <div id="topMenu">
        <span class="title">{{ title }}</span>
        <div id="faceImg">
            <img class="faceImg" :src="faceImg"/>
        </div>
    </div>
</template>

<style scoped>
#topMenu {
    width: 100%;
    height: 6vh;
    background-color: #97f2ff
}

#faceImg {
    position: relative;
    float: right;
    top: 10px;
    right: 20px
}
</style>