<script>
import Utils from "@/utils/request";
import SearchComp from "@/components/searchComp.vue"
import CardComp from "@/views/illustration/01_fireemblem/card.vue"
import DialogComp from "@/views/illustration/01_fireemblem/dialog.vue"

export default {
    components: {SearchComp, CardComp, DialogComp},
    data() {
        return {
            IMG_HOST: ""
            , dataList: []
            , skillDirt: {}
            , condition: {}
            , CODE_MASTER: {}
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
                let url = "/FIREEMBLEM_HERO/getList"
                let response = await Utils.request.post(url, searchCondition);
                if(200 == response?.code){
                    this.dataList = response.data.dataList
                    this.skillDirt = response.data.skillDirt
                }
            }
        },
        getMasterInfo(masterData){
            this.CODE_MASTER = masterData
            this.IMG_HOST = masterData["config"]["imgUrl"]
        },
        pickData(data) {
          this.selectedData = copyObject(data)
          let stageImgBox = JSON.parse(data.stageImg)
          let imgName = data.imgName.replace("'", "")
          this.selectedData.stageImg = ['','','','']
          // 使用本地图片服务器代理 "http://localhost:3001/proxy-image?url="
          this.selectedData.stageImg[0] = this.IMG_HOST + stageImgBox[0] + imgName + "_Face.webp"
          this.selectedData.stageImg[1] = this.IMG_HOST + stageImgBox[1] + imgName + "_BtlFace.webp"
          this.selectedData.stageImg[2] = this.IMG_HOST + stageImgBox[2] + imgName + "_BtlFace_C.webp"
          this.selectedData.stageImg[3] = this.IMG_HOST + stageImgBox[3] + imgName + "_BtlFace_D.webp"
          this.openDialogFlag = true
        },
    },
};
</script>
<template>
    <SearchComp :tableName="'FIREEMBLEM_HERO'" @searchCondition="doSearch" @masterData="getMasterInfo"/>

    <div class="resultArea" v-if="dataList.length > 0">
        <!-- 头像Card -->
        <div class="cardList" style="padding: 10px 0px 0 20px; max-width: 1400px;">
            <CardComp v-for="data in displayList" :key="data.id" :data="data" :IMG_HOST="IMG_HOST" :CODE_MASTER="CODE_MASTER" @click="pickData(data)"/>
        </div>
        <div class="block" style="float: left;">
            <el-pagination 
                :current-page="pageNo" 
                :page-size="pageSize" 
                :page-sizes="[6,9,15,30]" 
                :total="dataList.length"
                layout="total, sizes, prev, pager, next, jumper" 
                @size-change="(val)=>{pageSize = val;pageNo=1}"
                @current-change="(val)=>{pageNo = val}">
            </el-pagination>
        </div>
    </div>
       
    <!-- 详细dialog -->
    <el-dialog v-model="openDialogFlag" title="火纹英雄立绘" alt="Click" top="5vi" width="800px">
        <DialogComp :selectedData="selectedData" :IMG_HOST="IMG_HOST"/>
        <!-- <img src="http://localhost:5173/01_feh/Corrin_Starry_Seer/01_normal.png" /> -->
    </el-dialog>
</template>
<style scoped>
::v-deep(.el-pagination){
    float: left;
    padding-left: 30px;
}

/* 去掉 el-dialog 的边框和阴影（可根据需要调整） */
.el-dialog{
    padding: 10px 0px 0px 0px;
}

</style>