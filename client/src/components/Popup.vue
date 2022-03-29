<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        isOpen: {
            default: true
        }
    }
});
</script>

<template>
<div v-if="isOpen" class="fixed w-full h-full items-center justify-center flex bg-black bg-opacity-20 z-50">
    <div class="bg-white border p-10 rounded-xl">
    <slot></slot>
    </div>
</div>
</template>