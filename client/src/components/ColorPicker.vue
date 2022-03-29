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
        }
    }
})
</script>

<template>
    <div
        :class="'w-full h-full cursor-pointer flex items-end bg-yellow-500'" 
        :style="'background-color: ' + color"
    >
        <BrushIcon :class="'text-white p-4 ' + (active ? 'text-opacity-100' :'text-opacity-60')" />
    </div>
</template>