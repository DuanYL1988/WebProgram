<script>
import Utils from "@/utils/request";
export default {
  data() {
    return {
      tableName: this.$route.params.tablename,
      result: {},
      condition: {},
    };
  },
  methods: {
    async init(){
      this.result = {}
      this.condition= {}
      let result = await Utils.request.get("/getFilterColumns?tableName="+this.tableName);
      if(200 == result?.code){
        this.result = result.data
        this.$emit('initResult', result.data);
      }
    },
    passCondition() {
      this.$emit('childParam', this.condition);
    },
  },
  /* 計算屬性 */
  computed: {

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
  <div class="block">
    <div class="inputRow">{{tableName}}</div>
    <div class="inputRow">
      <div class="inputCell" v-for="column in result.filterColumns" :key="`columnIndex`+column.colCamel">
        <span>{{column.colNameCh}}</span>
        <el-select class="imgSelect" v-if="'select'==column.colInputtype" v-model="condition[column.colCamel]">
          <el-option value=""></el-option>
          <el-option class="center" v-for="master in result.direct[column.colCode]" :value="master.code" :label="master.value" :key="`MSTINFO`+master.code">
            <img v-if="''!==master.imgUrl" class="selectIcon" :src="result.config.imgUrl + master.imgUrl"/>{{master.value}}
          </el-option>
        </el-select>
        <el-select v-if="'NAME'==column.colName" filterable v-model="condition[column.colCamel]">
          <el-option value=""></el-option>
          <el-option class="center" v-for="master in result.direct[column.colName]" :value="master.code" :label="master.value" :key="`MSTINFO`+master.code">
            {{master.value}}
          </el-option>
        </el-select>
        <el-radio-group v-else-if="'radio'==column.colInputtype" v-model="condition[column.colCamel]">
          <el-radio-button size="small" v-for="master in result.direct[column.colCode]" :label="master.code" :key="`MSTINFO`+master.code">
              <img v-if="``!==master.imgUrl" class="selectIcon" :src="result.config.imgUrl + master.imgUrl"/>
              <span v-else style="font-size:large">{{master.value}}</span>
          </el-radio-button>
        </el-radio-group>
        <el-switch v-else-if="'flag'==column.colInputtype" v-model="condition[column.colCamel]" active-value="1" inactive-value="0"></el-switch>
        <el-input v-else-if="'text'==column.colInputtype" v-model="condition[column.colCamel]"></el-input>
      </div>
    </div>
    <div class="inputRow">
      <div class="inputCell">
      <span>自定义条件</span>
        <el-input v-model="condition['condition']" style="width:450px!important"></el-input>
      </div>
      <div class="inputCell">
        <el-button type="primary" style="width:80px" @click="passCondition()">检索</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.el-radio-button__inner{padding:5px,5px!important}
.el-input{width:auto!important}
</style>