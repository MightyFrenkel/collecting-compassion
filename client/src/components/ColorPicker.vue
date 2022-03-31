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
    <div class="w-full overflow-hidden inline-block relative cursor-pointer " :style="'color: ' + color">
        <svg
            :class="'fill-current absolute ' + (flip ? '-scale-x-100' : 'scale-x-100')"
            width="100%"
            height="100%"
            preserveAspectRatio="none"
            viewBox="0 0 163 361"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xml:space="preserve"
            xmlns:serif="http://www.serif.com/"
            style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;"
        >
            <g transform="matrix(1,0,0,1,-177.905,-92.3509)">
                <g transform="matrix(1,0,0,1,37.7024,17.8693)">
                    <path d="M140.202,74.482L140.202,435.405L302.347,435.405L140.202,74.482Z" />
                </g>
            </g>
        </svg>
        <BrushIcon :class="'text-white absolute bottom-4 w-2/3 ' + (active ? 'text-opacity-100' :'text-opacity-60') + ' ' + (flip ? 'right-4' : 'left-4 -scale-x-100')" />
    </div>
</template>