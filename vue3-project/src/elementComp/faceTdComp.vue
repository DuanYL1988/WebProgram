<template>
    <el-table-column width="70" fixed="left" label="头像">
        <template #default="scope"><el-avatar :size="50" :src="getFaceImgUrl(scope.row,baseUrl,tableName)"></el-avatar></template>
    </el-table-column>
</template>

<script setup>
defineProps({
    tableName:String,
    baseUrl:String
})

function getFaceImgUrl(rowData,baseUrl,tableName) {
    let imageUrl = ""
    // 规则
    if("FIREEMBLEM_HERO" == tableName) {
      imageUrl = baseUrl + rowData["faceImg"] + rowData["imgName"].replace("'","") + "_Face_FC.webp"
    } else {
      imageUrl = baseUrl + rowData["faceImg"]
    }
    return imageUrl
}
</script>

<style scoped>
</style>