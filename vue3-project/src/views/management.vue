<script>
import request from "@/utils/request";
export default {
  data() {
    return {
      tableName: this.$route.params.tablename,
      result: {},
      condition: {},
      searchDataList:[],
      pageSize:10,
			pageNo:1
    };
  },
  methods: {
    async init(){
      this.result = {}
      this.condition= {}
      this.searchDataList=[]
      let result = await request.get("/getFilterColumns?tableName="+this.tableName);
      console.debug(result)
      if(200 == result?.code){
        this.result = result.data
      }
    },
    async doSearch(){
      let keys = Object.keys(this.condition)
      if(keys.length == 0) {
        alert("请设置检索条件!")
      } else {
        console.debug(JSON.stringify(this.condition))
        let response = await request.post("/fireemblem/getList", this.condition);
        if(200 == response?.code){
          this.searchDataList = response.data
        }
      }
    },
    getFaceImgUrl(rowData) {
        let imageUrl = this.result.config.imgUrl + rowData.faceImg + rowData.imgName.replace("'","") + "_Face_FC.webp"
        return imageUrl
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
  },
  /* 計算屬性 */
  computed: {
		displayList:function(){
			let result = []
			let start = (this.pageNo - 1) * this.pageSize
			for(let i = start; i < start + this.pageSize; i++) {
				result.push(this.searchDataList[i])
			}
      console.debug(result)
			return result
		}
	},
  /* 初始化 */
  async mounted(){
    console.debug(this.$route.params);
    this.init();
  },
  /* 監視器 */
  watch:{
    '$route.params.tablename'(newVal) {
      this.tableName = newVal;
    },
    tableName:{
      handler(newVal, oldVal) {
        if(newVal !== oldVal) {
          
          this.init();
        }
      },
      deep: true
    },
  }
};
</script>

<template>
{{tableName}}
  <div class="block">
    <div class="cell" :key="`column`+index" v-for="column in result.filterColumns">
      <span>{{column.colNameCh}}</span>
      <el-select v-if="'select'==column.colInputtype" v-model="condition[column.colCamel]">
        <el-option value=""></el-option>
        <el-option class="center" v-for="master in result.direct[column.colCode]" :value="master.code" :label="master.value">
          <img class="selectIcon" :src="result.config.imgUrl + master.imgUrl"/>{{master.value}}
        </el-option>
      </el-select>
      <el-radio-group v-else-if="'radio'==column.colInputtype" v-model="condition[column.colCamel]">
        <el-radio-button v-for="master in result.direct[column.colCode]" :label="master.code" >
					  <img class="selectIcon" :src="result.config.imgUrl + master.imgUrl"/>
			  </el-radio-button>
      </el-radio-group>
      <el-switch v-else-if="'flag'==column.colInputtype" v-model="condition[column.colCamel]" active-value="1" inactive-value="0"></el-switch>
      <el-input v-else v-model="condition[column.colCamel]"></el-input>
    </div>
    <el-button type="primary" @click="doSearch()">检索</el-button>
  </div>
    
  <div v-if="searchDataList.length > 0" class="block">
    <el-table :data="displayList" border >
        <el-table-column width="70" fixed="left" label="头像">
          <template #default="scope"><el-avatar :size="50" :src="getFaceImgUrl(scope.row)"></el-avatar></template>
        </el-table-column>
        <!-- 通用一览表示 -->
        <template v-for="column in result.listColumns">
            <el-table-column v-if="'select'== column.colInputtype || 'radio'== column.colInputtype" :width="120" fixed="left" :label="column.colNameCh">
                <template #default="scope">{{getDirection(result.direct[column.colCode],scope.row[column.colCamel])}}</template>
            </el-table-column>
            <el-table-column v-else :width="120" fixed="left" :label="column.colNameCh">
                <template #default="scope">{{scope.row[column.colCamel]}}</template>
            </el-table-column>
        </template>
    </el-table>
    <el-pagination 
              v-model:current-page="pageNo" 
              v-model:page-size="pageSize" 
              :page-sizes="[5, 10, 15, 20]" 
              layout="total, sizes, prev, pager, next, jumper" 
              :total="searchDataList.length"
              :default-page-size="5"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<style scoped>
.center{display: flex; align-items: center;}
.selectIcon{width:25px;height:25px;margin-right: 10px;}
.el-radio-button__inner{padding:5px,5px!important}
.el-input{width:auto!important}
</style>
