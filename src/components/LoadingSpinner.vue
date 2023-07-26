<template>
    <div class="spinner-wrapper">
        <div class="spinner">
            <span class="visually-hidden">
                Загрузка...
            </span>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped>
.spinner-wrapper {
    min-width: 300px;
    min-height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.spinner {
    display: inline-block;
    width: 80px;
    height: 80px;
}

.spinner:after {
    content: "";
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid;
    border-color: #000 transparent #000 transparent;
    animation: lds-dual-ring 1.2s linear infinite;
}

@keyframes lds-dual-ring {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.spinner .visually-hidden {
    visibility: hidden;
}
</style>