<script setup>
import { ref, onMounted } from 'vue'
import Utils from "@/utils/request";
import SwitchTd from '../elementComp/switchTdComp.vue'
import InputTd from '../elementComp/inputTdComp.vue'

var tableList = ref([])
var tableName = ref("")
var columnList = ref([])
onMounted(async() => {
    console.debug("System Page Onload!!")
    let response = await Utils.request.get("/systemconf/tableEdit")
    console.debug(response)
    tableList.value = response.data.tableList
})

async function showColumnsInfo(){
    if(isEmpty(tableName.value)) {
        Utils.alertMessage("请选择表", "error")
        return
    }
    let url = "/systemconf/getColumnListByTblnm?tableName=" + tableName.value
    let response = await Utils.request.get(url)
    console.debug(response)
    columnList.value = response.data
}

function changeColVal(row,prop){
    Utils.alertMessage(row[prop],"info")
}

</script>
<template>
    <div class="block">
        <div class="inputRow">
            <div class="inputCell">
                <span>选择表</span>
                <el-select class="tableNamePulldown" v-model="tableName">
                    <el-option v-for="tblInfo in tableList" :value="tblInfo.code" :label="tblInfo.value" :key="`index`+tblInfo.code"/>
                </el-select>
            </div>
            <div class="inputCell">
                <el-button type="primary" @click="showColumnsInfo()">查看字段配置</el-button>
            </div>
        </div>
    </div>

    <div class="block" style="height:80%;overflow-y:scroll;width:915px">
        <el-table :data="columnList" v-if="columnList.length > 0" border>
            <el-table-column prop="colNameCh" width="160" label="字段名"/>
            <el-table-column prop="colInputtype" width="100" label="输入类型"/>
            <SwitchTd prop="colFifterable" label="检索条件flag" :width="120" @switch-change="()=>changeColVal"/>
            <el-table-column prop="colCode" width="130" label="MASTER_CODE"/>
            <SwitchTd prop="colListDisableFlag" label="一览表示flag" :width="120" />
            <InputTd prop="colListWidth" label="一览宽度" :width="150" :step="10" numberFlag="True" />
            <InputTd prop="colSort" label="排序" :width="120" :step="1" numberFlag="True" />
        </el-table>
    </div>
    <div class="block">
        <el-button style="float:left" type="primary">批量更新</el-button>
    </div>
</template>
<style scoped>
</style>