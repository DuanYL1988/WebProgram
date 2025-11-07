<template>
    <el-table-column :label="label" :width="width">
        <template #default="scope">
            <el-switch v-model="scope.row[prop]" inactive-value="0" active-value="1" @change="()=>handleSwitchChange(scope.row,prop)"/>
        </template>
    </el-table-column>
</template>

<script setup>
defineProps({
    prop:String,
    label:String,
    width:Number
})

const emit = defineEmits(['switch-change'])

function handleSwitchChange(row,prop) {
    console.debug("child",row[prop])
    emit('switch-change', row, prop)
}
</script>
