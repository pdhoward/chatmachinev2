<template >
    <div>
        <span class="bubble clearfix" :class="{'me': from == 'me', 'loading': loading}">
            {{text}}
        </span>
    </div>
</template>

<style lang="sass" scoped>

.bubble
    margin: 10px
    padding: 12px
    border-radius: 40px
    color: var(--text)
    border: 1px solid var(--border)
    display: table
    position: relative
    background-color: var(--background)
    min-width: 52px

    &::before        
        content: var(--left-bubble)
        position: absolute
        left: 0
        top: 0
        margin-top: -10px
        margin-left: -1px            

    &.me
        float: right         
        background-color: var(--element-background)
        border: 1px solid var(--element-background)
        color: var(--text-secondary)
        margin-top: 10px        

        &::before
            content: ''                        

        &::after
            content: var(--right-bubble)
            position: absolute
            right: 0
            top: 0
            margin-top: -9px
            margin-right: -1px
           

    &.loading
        height: 16px
        animation: loading .8s ease infinite
.clearfix
    clear: both


@keyframes loading
    0%
        opacity: 0
    50%
        opacity: 1
    100%
        opacity: 0
</style>

<script>
export default {
    name: 'Bubble',
    props: ['text', 'from', 'loading']
}
</script>