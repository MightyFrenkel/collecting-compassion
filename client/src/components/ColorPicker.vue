<script lang="ts">
import { defineComponent } from "vue";
import BrushIcon from "./icons/BrushIcon.vue";

export default defineComponent({
    components: {
        BrushIcon
    },
    props: {
        color: {
            default: 'rgb(255, 99, 171)'
        },
        active: {
            default: true
        },
        flip: {
            default: false
        }
    }
})
</script>

<template>
    <div class="w-full overflow-hidden inline-block" :style="'color: ' + color">
        <svg :class="'fill-current '  + (flip ? '-scale-x-100' : 'scale-x-100')" width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 163 361" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
        
    <g transform="matrix(1,0,0,1,-177.905,-92.3509)">
        <g transform="matrix(1,0,0,1,37.7024,17.8693)">
            <path d="M140.202,74.482L140.202,435.405L302.347,435.405L140.202,74.482Z"/>
        </g>
    </g>
    
</svg>
    </div>
    <!-- <div
        :class="'w-full h-full cursor-pointer flex items-end bg-yellow-500'" 
        :style="'background-color: ' + color"
    >
        <BrushIcon :class="'text-white p-4 ' + (active ? 'text-opacity-100' :'text-opacity-60')" />
    </div>-->
</template>