<template>
     <div class="video">
        <video controls autoplay autopictureinpicture playsinline :src="clip" :poster="poster"></video>
        <button id="togglePipButton">Click here</button>
    </div>
</template>

<style lang="sass" scoped>
.video     
    border-radius: 4px
    width: 80%
</style>

<script>
  // https://www.w3schools.com/tags/movie.mp4
  // https://stackoverflow.com/questions/44746718/html-5-video-and-src-value-with-vue
  // https://stackoverflow.com/questions/53696952/html5-video-element-in-vue-js
  // https://archive.org
  // https://github.com/hilongjw/vue-video/blob/master/video.vue
  // https://w3c.github.io/picture-in-picture/
  // https://www.w3.org/TR/picture-in-picture/
  // https://googlechrome.github.io/samples/picture-in-picture/
  // https://googlechrome.github.io/samples/auto-picture-in-picture/
  export default {
    name: 'Videoclip',
    props: ['assetUri'],
    data () {
      return {
        $video: null,
        togglePipButton: null,
        clip: null,
        //clip: "https://res.cloudinary.com/stratmachine/video/upload/v1585142740/ibmcallcenter_e2cb0c.mp4",
        //clip: "https://www.youtube.com/watch?v=9G_AnmzZNbM",
        //clip: "assets/ibmcallcenter.mp4",
        poster: "assets/sm256.png"
      }
    },
     mounted() {
       //if (video !== document.pictureInPictureElement)
        this.init() 
    },

    ///////////////////REFACTOR//////////////
    // IF VIDEO IS PLAYING .. CLOSE ALL PLAYERS THEN OPEN
    // THIS ONE? Also PIP seems to be only active on the first
    // may have to exit PIP as well so next video can use
    methods: {
      async init(){        
        this.$video = await document.getElementsByTagName('video')[0]      
        this.togglePipButton = document.getElementById('togglePipButton');

        togglePipButton.addEventListener('click', () => {        
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
        })
        console.log(this.$props)
        this.clip = this.$props.assetUri

        if (!document.pictureInPictureEnabled) {
            console.log(`================pip not supported============`)
        }
      }


    }
  }

</script>