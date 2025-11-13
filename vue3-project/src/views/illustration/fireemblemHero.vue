<script>
import Utils from "@/utils/request";
import SearchComp from "@/components/searchComp.vue"
import CardComp from "@/views/illustration/card.vue"

export default {
    components: {SearchComp, CardComp},
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
    mounted() {
        
    },
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
                alert("请设置检索条件!")
            } else {
                let url = "/Illustration/FIREEMBLEM_HERO"
                let response = await Utils.request.post(url, searchCondition);
                if(200 == response?.code){
                    this.IMG_HOST = response.data.config.imgUrl
                    this.dataList = response.data.dataList
                    this.skillDirt = response.data.skillDirt
                }
            }
        },
        
    },
};
</script>
<template>
    <SearchComp :tableName="'FIREEMBLEM_HERO'" @searchCondition="doSearch" @masterData="CODE_MASTER = $event"/>

    <div class="resultArea" v-if="dataList.length > 0">
        <!-- 头像Card -->
        <div class="cardList" style="padding: 10px 0px 0 20px; max-width: 1400px;">
            <CardComp v-for="data in displayList" :key="data.id" :data="data" :IMG_HOST="IMG_HOST" :CODE_MASTER="CODE_MASTER"/>

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
</template>
<style scoped>
::v-deep(.el-pagination){
    float: left;
    padding-left: 30px;
}
</style>