<script>
import "@/assets/feh/CardList.css"
export default {
    props: {
        data: {type: Object,required: true},
        IMG_HOST: {type: String,required: true},
        CODE_MASTER: {type: Object,required: true}
    },
    methods: {
        getDirection(codeList,code){
            return getDirection(codeList,code)
        }
    },
};
</script>
<template>
    <div class="fehCard">
        <table>
          <tbody>
          <tr>
            <td class="faceImg" rowspan="4">
              <img :src="IMG_HOST + data.faceImg + data.imgName.replace(/'/g,'') + '_Face_FC.webp'"></img>
              <div class="rarity">
                <img class="rarityStar" v-for="n in parseInt(data.rarity)" src="http://localhost:5173/01_feh/Icon_Rarity_5.png">
              </div>
            </td>
            <td class="infoStr" colspan="5">
              <div class="title">{{data.titleName + ":" + data.nameCn}}</div>
            </td>
          </tr>
          <tr>
            <td class="infoStr " style="font-size:17px;font-style: italic;color: rgb(39 45 76);" colspan="5">
              <span class="weaponName">{{data.weaponName}}</span>
            </td>
          </tr>

          <tr>
            <td class="infoStr" style="font-size: 17px;" colspan="5"><img class="iconTdImg"
                :src="data.entryIcon"></img><span>{{getDirection(CODE_MASTER.direct["ENTRY"],data.entry)}}</span></td>
          </tr>
          <tr style="position: relative;top: -5px;">
            <td class="infoStr">HP:{{data.hp}}</td>
            <td class="infoStr">POW:{{data.atk}}</td>
            <td class="infoStr">SPD:{{data.spd}}</td>
            <td class="infoStr">DEF:{{data.def}}</td>
            <td class="infoStr">RES:{{data.res}}</td>
          </tr>
          <tr class="infoTr">
            <td class="infoStr" colspan="3">
              <img class="iconTdImg" :src="IMG_HOST + data.skillAIcon"></img><span>{{data.skillAName}}</span>
            </td>
            <td colspan="3">
              <img class="infoStr" src="http://localhost:5173/01_feh/Icon_Skill_Assist.png" />
              <span>{{data.skillAssName}}</span>
            </td>
          </tr>
          <tr class="infoTr" style="top: -15px;">
            <td class="infoStr" colspan="3">
              <img class="iconTdImg" :src="IMG_HOST + data.skillBIcon"></img><span>{{data.skillBName}}</span>
            </td>
            <td colspan="3">
              <img class="infoStr" src="http://localhost:5173/01_feh/Icon_Skill_Special.png" />
              <span>{{data.skillSpName}}</span>
            </td>
          </tr>
          <tr class="infoTr" style="top: -20px;">
            <td class="infoStr" colspan="3">
              <img class="iconTdImg" :src="IMG_HOST + data.skillCIcon"></img><span>{{data.skillCName}}</span>
            </td>
            <td colspan="3">
            </td>
          </tr>
          </tbody>
        </table>
    </div>
</template>