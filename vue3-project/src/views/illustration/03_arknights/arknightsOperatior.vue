<script>
import Utils from "@/utils/request";

export default {
    data() {
        return {
            IMG_HOST: ""
            , CODE_MASTER: {}
            , dataList: []
            , condition: {}
            , pageSize: 9
            , pageNo: 1
            , selectedData: {}
            , openDialogFlag: false
        }
    },
    /* 初始化 */
    mounted() {},
    /* 計算屬性 */
    computed: {
        displayList: function(){
            let resultList = []
            let start = (this.pageNo - 1) * this.pageSize
            for(let i = start; i < start + this.pageSize; i++) {
                if (i < this.dataList.length) {
                    let data = this.dataList[i]
                    let mstData = this.skillDirt[data.imgName]
                    $.each(mstData, (key, value) => {
                        data[key] = value
                    })
                    resultList.push(data)
                }
            }
            return resultList
        },
    },
    methods: {
        async doSearch(searchCondition){
            let keys = Object.keys(searchCondition)
            if(keys.length == 0) {
                Utils.warningMsg("请设置检索条件!")
            } else {
                let url = "/ARKNIGHTS_OPERATOR/getList"
                let response = await Utils.request.post(url, searchCondition);
                if(200 == response?.code){
                    this.dataList = response.data.dataList
                }
            }
        },
        getMasterInfo(masterData){
            this.CODE_MASTER = masterData
            this.IMG_HOST = masterData["config"]["imgUrl"]
        },
        pickData(data) {
          this.selectedData = copyObject(data)
          this.openDialogFlag = true
        },
    },
};
</script>
<template>
    <SearchComp :tableName="'ARKNIGHTS_OPERATOR'" @searchCondition="doSearch" @masterData="getMasterInfo"/>

    <div class="cardList" v-if="dataList.length > 0">
        <!-- 头像Card -->


    </div>
       
    <!-- 详细dialog -->
    <el-dialog v-model="openDialogFlag" title="明日方舟立绘" alt="Click" top="10px" width="800px">
        
    </el-dialog>
</template>
<style scoped>
/* 去掉 el-dialog 的边框和阴影（可根据需要调整） */
.el-dialog{
    padding: 10px 0px 0px 0px;
}
</style>