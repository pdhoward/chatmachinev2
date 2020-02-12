<template>
  <div>
    <flat-pickr v-model="date"></flat-pickr>
  </div>
</template>
 
<script>
  import flatPickr from 'vue-flatpickr-component';
  import 'flatpickr/dist/flatpickr.css';
  
  export default {    
    data () {
      return {
        date: null,       
      }
    },
    components: {
      flatPickr
    }
  }
</script> 