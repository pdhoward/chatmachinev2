<template>
    <div class="card">
        <img class="card-image" v-if="imageUri" :src="imageUri" :alt="imageTitle || title" />
        <div class="card-content">
            <div class="card-title" v-if="title">{{title}}</div>
            <div class="card-subtitle" v-if="subtitle">{{subtitle}}</div>
            <div class="card-text" v-if="text">{{text}}</div>
            <div>
                <flat-pickr v-model="date"
                            :config="config"
                            placeholder="Please select a date"
                            name="datetime"
                >
                </flat-pickr>
            </div>
            <slot></slot>
        </div>
    </div>
</template>


<style lang="sass" scoped>
.card
    background-color: var(--component-background)
    box-shadow: var(--shadow)
    border-radius: 12px

.card-image
    width: 100%
    height: auto
    object-fit: cover
    border-top-right-radius: 10px
    border-top-left-radius: 10px
    background-color: var(--image-background)

.card-content
    padding: 16px

.card-title
    font-weight: 500
    font-size: 20px
    color: var(--text)
    line-height: 24px
    overflow: hidden
    text-overflow: ellipsis

.card-subtitle
    font-size: 16px
    line-height: 24px
    color: var(--text-subtitle)

.card-text
    line-height: 24px
    font-size: 14px
    color: var(--text-secondary)
    white-space: normal
</style>

<script>

  import flatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';
  
  export default { 
    name: 'DateCard',
    props: ['text', 'imageUri', 'imageTitle', 'subtitle', 'title'],
    data () {
      return {
        date: null,
        config: {
          altInput: true,
          altFormat: "F j, Y",
          enableTime: false,      
          dateFormat: 'Y-m-d',
          onChange: this.dateselected,
          inline: true           
        } 
      }
    },
    components: {
      flatPickr
    },
    methods: {    
         dateselected(selectedDates, dateStr){
            console.log('event triggered')
            console.log(selectedDates, dateStr)
            this.$parent.sendMessage({
              component: "query",
              text: dateStr.trim()})
         } 
    }
        
  }

</script>