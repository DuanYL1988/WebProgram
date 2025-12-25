<script>
export default {
    props: {
        data: {type: Object,required: true},
        IMG_HOST: {type: String,required: true},
        CODE_MASTER: {type: Object,required: true}
    },
    mounted() {
        this.data = this.getDetailInfo(this.data)
    },
    methods: {
        getDirection(codeList,code){
            return getDirection(codeList,code)
        },
        getDetailInfo(data) {
            let bgSrc = this.IMG_HOST + data.stageOneImg;
            data.skinImage = JSON.parse(data.skinImage)
            let skinSize = data.skinImage.length
            if (skinSize > 0) {
                bgSrc = this.IMG_HOST + data.skinImage[skinSize - 1];
            } else if (data.rarity > 3) {
                bgSrc = this.IMG_HOST + data.stageTwoImg
            }
            data["bgImg"] = bgSrc
            data["stage"] = (data.rarity > 3 ? "stage2.png" : "stage1.png")
            data["maxLevel"] = data.rarity == 3 ? 55 : data.rarity == 4 ? 75 : data.rarity == 5 ? 80 : 90
            return data
        }
    },
};
</script>

<template>
    <div class="card">
        <img class="bgImg" :src="data.bgImg" />
        <table>
            <tr>
                <td class="classIcon" style="position: relative;">
                    <div class="text"style="width:100px;background-color: #8c8d8dc2;position: absolute; bottom: -10px;">{{data.subVocation}}</div>
                </td>
                <td colspan="2">
                    <div class="rarity">
                        <img class="rarityStar" v-for="n in parseInt(data.rarity)" src="@/assets/feh/Icon_Rarity_5.png"/>
                    </div>
                </td>
            </tr>
            <tr>
                <td colspan="3" style="height: 300px;"></td>
            </tr>
            <tr>
                <td><img :src="f`@/assets/arknights/${data.stage}`"></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>
                    <div class="level">
                        <div class="inner text">
                            {{data.maxLevel}}
                        </div>
                    </div>
                </td>
                <td></td>
                <td style="position: relative;">
                    <div class="text"style="width:100px;background-color: #8c8d8dc2;position: absolute; right:0px; bottom: -10px;">{{data.nameCn}}</div>
                </td>
            </tr>
        </table>
    </div>
</template>

<style scoped>

</style>