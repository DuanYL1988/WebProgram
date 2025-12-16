<script setup>
import { ref, onMounted } from 'vue'
import Utils from "@/utils/request";
import SwitchTd from '../elementComp/switchTdComp.vue'
import InputTd from '../elementComp/inputTdComp.vue'

var tableList = ref([])
var tblCond = ref({"tableName":"", "colFifterable":"", "colListDisableFlag":""})
var columnList = ref([])
var updateColMp = ref({})
const COLUMN_MP = {
    "colFifterable" : "COL_FIFTERABLE"
    , "colListDisableFlag" : "COL_LIST_DISABLE_FLAG"
    , "colListWidth" : "COL_LIST_WIDTH"
    , "colSort" : "COL_SORT"
}
onMounted(async() => {
    console.debug("System Page Onload!!")
    let response = await Utils.request.get("/systemconf/tableEdit")
    console.debug(response)
    tableList.value = response.data.tableList
})

function showColumnsInfo(){
    if(isEmpty(tblCond.value["tableName"])) {
        Utils.alertMessage("请选择表", "error")
        return
    }
    let cond = {"tableName":tblCond.value["tableName"]}
    if ("1" == tblCond.value["colFifterable"]) {
        cond["colFifterable"] = "1"
    }
    if ("1" == tblCond.value["colListDisableFlag"]) {
        cond["colListDisableFlag"] = "1"
    }
    Utils.request.post("/systemconf/getColumnListByTblnm",cond).then((response)=>{
        columnList.value = response.data
    })
}

function changeColVal(row,prop){
    let tempMp = updateColMp.value
    console.debug("changeColVal:" + prop + "=" + row[prop])
    if (isEmpty(tempMp[prop])) {
        tempMp[prop] = {
            "tgtColNm": COLUMN_MP[prop]
            , "valuesMp" : {}
        }
    }
    tempMp[prop]["valuesMp"][row["id"]] = row[prop]
    updateColMp.value = tempMp
    console.debug(updateColMp.value[prop])
}

function updateRows(){
    $.each(updateColMp.value, async (prop,dirtObj)=>{
        let updateDto = {"tableName":"TABLE_INFO", "condColNm": "ID", "tgtColNm": dirtObj["tgtColNm"], "ids": [], "values": []}
        $.each(dirtObj["valuesMp"],(id,val)=>{
            updateDto["ids"].push(id)
            updateDto["values"].push(val)
        })
        let response = await Utils.request.post('/systemconf/updateColumnValues',updateDto)
        Utils.alertMessage(response.message,"success")
    })
}

</script>
<template>
    <div class="block">
        <div class="inputRow">
            <div class="inputCell">
                <span>选择表</span>
                <el-select class="tableNamePulldown" v-model="tblCond.tableName">
                    <el-option v-for="tblInfo in tableList" :value="tblInfo.code" :label="tblInfo.value" :key="`index`+tblInfo.code"/>
                </el-select>
            </div>
            <div class="inputCell">
                <span>检索条件Flag</span>
                <el-switch v-model="tblCond.colFifterable" active-value="1" inactive-value=""/>
            </div>
            <div class="inputCell">
                <span>一览表示Flag</span>
                <el-switch v-model="tblCond.colListDisableFlag" active-value="1" inactive-value=""/>
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
            <SwitchTd prop="colFifterable" label="检索条件flag" :width="120" @switch-change="changeColVal"/>
            <InputTd prop="colCode" label="MASTER_CODE" :width="130" numberFlag="False" @input-mouseout="changeColVal" />
            <SwitchTd prop="colListDisableFlag" label="一览表示flag" :width="120" @switch-change="changeColVal"/>
            <InputTd prop="colListWidth" label="一览宽度" :width="150" :step="10" numberFlag="True" @input-mouseout="changeColVal" />
            <InputTd prop="colSort" label="排序" :width="120" :step="1" numberFlag="True" @input-mouseout="changeColVal" />
        </el-table>
    </div>
    <div class="block">
        <el-button style="float:left" type="primary" @click="updateRows">批量更新</el-button>
    </div>
</template>
<style scoped>
</style>