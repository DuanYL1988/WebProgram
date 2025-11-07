<template>
    <el-table-column :label="label" :width="width">
        <template #default="scope">
            <el-input-number class="tdInput Number" v-if="'True'==numberFlag" v-model="scope.row[prop]" :step="step" controls-position="right" @change="handleSwitchChange(scope.row,prop)"/>
            <el-input class="tdInput" v-else v-model="scope.row[prop]" />
        </template>
    </el-table-column>
</template>

<script setup>
const emit = defineEmits(['switch-change'])

defineProps({
    prop:String,
    label:String,
    width:Number,
    step:Number,
    numberFlag:String
})

function handleSwitchChange(row,prop) {
    console.debug("child",row[prop])
    emit('switch-change', row)
}

</script>
<style scoped>
.tdInput{margin-left: -10px;}
.Number{width:120%}
</style>