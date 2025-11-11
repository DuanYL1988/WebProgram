<template>
    <el-table-column width="200" :label="label" show-overflow-tooltip>
        <template #default="scope">
          <el-tag v-for="tagName in transTagList(scope.row[prop])" :key="tagName">
            {{ tagName }}
          </el-tag>
        </template>
    </el-table-column>
</template>

<script setup>
defineProps({
    label:String,
    prop:String
})

function transTagList(tagStr){
  if (isEmpty(tagStr)){
    return []
  }
  return tagStr.split(",")
}
</script>