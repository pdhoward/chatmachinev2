<template>
     <div>
        <video controls autoplay autopictureinpicture :poster="poster"  width="320px" height="320px">
          <source :src="clip" type="video/mp4">
        </video>
        <button @click="togglePipButton">Click here</button>
    </div>
</template>

<style lang="sass" scoped>
.videoclip 
  width: "320px"
  height: "320px"
</style>

<script> 
  export default {
    name: 'Videoclip',
    props: ['assetUri', 'actionKey'],
    data () {
      return {
        $video: null,
        $source: null,        
        clip: null,        
        poster: "assets/sm256.png"
      }
    },
     mounted() {     
        this.init() 
    },
    
    methods: {
      async init(){        
        this.clip = this.$props.assetUri
        let idx =  await document.getElementsByTagName('video').length - 1   
        this.$video = await document.getElementsByTagName('video')[idx]     
        if (!document.pictureInPictureEnabled) {
            console.log(`================pip not supported============`)
        }
      },
    
    togglePipButton() {        
            if (!document.pictureInPictureElement) {
                  this.$video.requestPictureInPicture()
                  .catch(error => {
                // Video failed to enter Picture-in-Picture mode.
               });
            } else {
                  document.exitPictureInPicture()
                  .catch(error => {
                // Video failed to leave Picture-in-Picture mode.
             });
            }
        }
    }
  }

</script>