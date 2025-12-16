<script setup>
import "@/assets/feh/singleHero.css"
import {ref, watch, toRefs} from 'vue';

const props = defineProps({
    selectedData: { type: Object, default: () => ({}) },
    IMG_HOST: { type: String, default: '' }
})
const { selectedData, IMG_HOST } = toRefs(props)
const showDetailFlag = ref(false)
const imgIndex = ref(0)
console.debug(JSON.stringify(selectedData.value.stageImg))

watch(imgIndex, (newVal) => {
    console.debug("imgIndex changed to " + selectedData)
    if(newVal < 0) {
        imgIndex.value = selectedData.value.stageImg.length - 1
    } else if(newVal >= selectedData.value.stageImg.length) {
        imgIndex.value = 0
    }
})
</script>

<template>
    <div id='activity'>
        <div id='sameHero'></div>
        <div class="cntlBtn" style="padding:10px;" @click="showDetailFlag=!showDetailFlag">
            <img src="http://localhost:5173/01_feh/btn-show.png" />
        </div>
        <div class="changeBtn" v-if="!showDetailFlag">
            <div class="cntlBtn preBckBtn" style="padding:10px;" @click="imgIndex=imgIndex-1">
                <img src="http://localhost:5173/01_feh/btn-back.png" />
            </div>
            <div class="cntlBtn preBckBtn" style="padding:10px;right: 10px;;transform: rotate(180deg);" @click="imgIndex+=1">
                <img src="http://localhost:5173/01_feh/btn-back.png" />
            </div>
        </div>
        <div id='heroIllustration'>
            <img :src="selectedData.stageImg[imgIndex]" />
        </div>
        <!-- 面板 -->
        <div id='heroStatusArea' v-if="showDetailFlag">
            <!-- 称号 名称 -->
            <div id='titleArea'>
                <label id="titleName">{{selectedData.titleName}}</label>
                <label id="name">{{selectedData.nameCn}}</label>
            </div>
            <!-- 属性 -->
            <div class="textArea" style="margin-left: 7rem;position: relative;">
                <div class="leftText" style="width:200px;display:inline-block;position: absolute;top: 19px;">
                    <div class="statusAndSkillRow">
                        <label class="value" id="hp">{{selectedData.hp}}</label>
                    </div>
                    <div class="statusAndSkillRow">
                        <label class="value" id="attact">{{selectedData.atk}}</label>
                    </div>
                    <div class="statusAndSkillRow">
                        <label class="value" id="speed">{{selectedData.spd}}</label>
                    </div>
                    <div class="statusAndSkillRow">
                        <label class="value" id="def">{{selectedData.def}}</label>
                    </div>
                    <div class="statusAndSkillRow">
                        <label class="value" id="mdf">{{selectedData.res}}</label>
                    </div>
                    <div class="statusAndSkillRow">
                        <label class="value" id="">9999</label>
                    </div>
                    <div class="statusAndSkillRow">
                        <label class="value" id="">6000</label>
                    </div>
                </div>
                <div class="rightText" style="width:200px;display:inline-block;position: absolute;left: 220px;top: 19px;">
                    <div class="statusAndSkillRow">
                        <label class="value" id="weapon">{{selectedData.weaponName}}</label>
                    </div>
                    <div class="statusAndSkillRow">
                        <label class="value" id="skillS">{{selectedData.skillAssName}}</label>
                    </div>
                    <div class="statusAndSkillRow">
                        <label class="value" id="skillE">{{selectedData.skillSpName}}</label>
                    </div>
                    <div class="statusAndSkillRow">
                        <img :src="IMG_HOST + selectedData.skillAIcon" />
                        <label class="value" style="position: absolute;left: 0px;" id="skillA">{{selectedData.skillAName}}</label>
                    </div>
                    <div class="statusAndSkillRow">
                        <img :src="IMG_HOST + selectedData.skillBIcon" />
                        <label class="value" style="position: absolute;left: 0px;" id="skillB">{{selectedData.skillBName}}</label>
                    </div>
                    <div class="statusAndSkillRow">
                        <img :src="IMG_HOST + selectedData.skillCIcon" />
                        <label class="value" style="position: absolute;left: 0px;" id="skillC">{{selectedData.skillCName}}</label>
                    </div>
                    <div class="statusAndSkillRow">
                        <label class="value" id="skillD">{{selectedData.skillDName}}</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
