<script>
import SearchComp from "@/components/searchComp.vue"
import FaceTdComp from "@/elementComp/faceTdComp.vue"
import TagTdComp from "@/elementComp/tagTdComp.vue";
import Utils from "@/utils/request";
export default {
  components: {SearchComp,FaceTdComp,TagTdComp},
  data() {
    return {
      tableName: this.$route.params.tablename,
      result: {},
      searchDataList:[],
      pageSize:10,
			pageNo:1,
      actionTdWidth:150,
      idValMp:{}
    };
  },
  /* 初始化 */
  mounted(){
    this.init();
  },
  /* 計算屬性 */
  computed: {
		displayList:function(){
			let result = []
			let start = (this.pageNo - 1) * this.pageSize
			for(let i = start; i < start + this.pageSize; i++) {
        if(i < this.searchDataList.length) {
          result.push(this.searchDataList[i])
        }
			}
			return result
		},
    tableWidth:function(){
      let result = 0
      $.each(this.result.listColumns,(index, column)=>{
        if (column.colListDisableFlag == "1"){
          result += parseInt(column.colListWidth)
        }
      })
      console.debug("table width:",result)
      let style = result * 2 + this.actionTdWidth + 5 + "px}"
      return style;
    }
	},
  /* 監視器 */
  watch:{
    '$route.params.tablename'(newVal) {
      this.tableName = newVal;
      this.init();
    },
  },
  methods: {
    async init(){
      this.result={}
      this.searchDataList=[]
      this.pageSize=10
      this.pageNo=1
      this.idValMp={}
    },
    async doSearch(searchCondition){
      let keys = Object.keys(searchCondition)
      if(keys.length == 0) {
        alert("请设置检索条件!")
      } else {
        let url = "/" + this.tableName + "/getList"
        console.debug(url)
        console.debug("cond:" + JSON.stringify(searchCondition))
        let response = await Utils.request.post(url, searchCondition);
        if(200 == response?.code){
          this.searchDataList = response.data
        }
      }
    },
    getDirection(codeList,code){
        let result = code
        if(code!=="" && isNotEmpty(codeList)){
            for(let i = 0; i < codeList.length; i++) {
              let info = codeList[i]
              if(info.code === code) {
                result = info.value
              }
            }
        }
        return result
    },
    handleSizeChange:function(val){
        this.pageSize = val
    },
    handleCurrentChange:function(val){
        this.pageNo = val
    },
    updateFlag: function(rowData,columnNm){
      this.idValMp[rowData.id] = rowData[columnNm]
    },
    updateColumns:async function(){
      let ids = []
      let values = []
      $.each(this.idValMp,(key,val)=>{
        ids.push(key)
        values.push(val)
      })
      if (ids.length == 0 || ids.length !== values.length) {
        Utils.warningMsg
      }
      let requestBody = {
        "tableName": this.tableName,
        "tgtColNm": "PICK_FLAG",
        "condColNm": "ID",
        "ids": ids,
        "values": values
      }
      console.debug(requestBody)
      let response = await Utils.request.post("systemconf/getColumnListByTblnm", requestBody);
      console.debug(JSON.stringify(response.message))
      // 初始化条件
      this.idValMp = {}
    }
  },
};
</script>

<template>
  <SearchComp @childParam="doSearch" @initResult="result = $event"/>
   
  <div v-if="searchDataList.length > 0" style="height:80%;" class="block">
    <div style="max-height:90%;overflow-y:scroll">
      <el-table :style="{'width':tableWidth}" :data="displayList" border stripe >
          <FaceTdComp :tableName="tableName" :baseUrl="result.config.imgUrl" />
          <!-- 通用一览表示 -->
          <template v-for="column in result.listColumns">
              <el-table-column v-if="'select'== column.colInputtype || 'radio'== column.colInputtype" :width="column.colListWidth" :label="column.colNameCh" :key="`colTd`+column.colCamel">
                  <template #default="scope">{{getDirection(result.direct[column.colCode],scope.row[column.colCamel])}}</template>
              </el-table-column>
              <el-table-column v-else-if="'flag'== column.colInputtype" :width="column.colListWidth" :label="column.colNameCh">
                  <template #default="scope">
                    <el-switch v-model="scope.row[column.colCamel]" active-value="1" inactive-value="0" @change="updateFlag(scope.row,column.colCamel)" />
                  </template>
              </el-table-column>
              <TagTdComp v-else-if="'tag'== column.colInputtype" :label="column.colNameCh" :prop="column.colCamel" />
              <el-table-column v-else :width="column.colListWidth" :label="column.colNameCh">
                  <template #default="scope">{{scope.row[column.colCamel]}}</template>
              </el-table-column>
          </template>
          <el-table-column :width="actionTdWidth" fixed="right" label="操作">
              <template #default="scope"></template>
          </el-table-column>
      </el-table>
    </div>
    <el-pagination 
              v-model:current-page="pageNo" 
              v-model:page-size="pageSize" 
              :page-sizes="[5, 10, 15, 20,500]" 
              layout="total, sizes, prev, pager, next, jumper" 
              :total="searchDataList.length"
              :default-page-size="5"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange">
    </el-pagination>
   
    <el-button @click="updateColumns()">Test</el-button>
  </div>
</template>

<style scoped>

</style>