<template>
    <main id="app">
    <section class="container chat-container">  
        <table class="message">            
            <tr>
                <!-- message -->
                 <component                 
                    v-for="(message, index) in messages"
                    :is="message.component"                 
                    :key="index"
                    :text="message.text"
                    :from="message.to"
                    />
            </tr>         
        </table>
    </section>
    <ChatInput @submit="sendMessage"> 
        <!-- suggestions -->
         <component
            v-for="(message, index) in messages"
            :is="message.component"
            @click.native="send(message)"
            :key="index"
            :title="message.title"
            /> 
        <!-- suggestions with hotlinks -->
        <component
            v-for="(message, index) in messages"
            :is="message.component"       
            :key="index"
            :title="message.title"
            :url="message.url"
            />          
    </ChatInput>

        <!-- Audio toggle (on the top right corner), used to toggle the audio output, default mode is defined in the settings -->
    <div
            class="audio-toggle" 
            @click="muted = !muted"
            :aria-label="(config.i18n[lang()] && config.i18n[lang()].inputTitle) || config.i18n[config.app.fallback_lang].muteTitle"
            :title="(config.i18n[lang()] && config.i18n[lang()].inputTitle) || config.i18n[config.app.fallback_lang].muteTitle"
        >
            <i aria-hidden="true" class="material-icons" v-if="!muted">volume_up</i>
            <i aria-hidden="true" class="material-icons" v-else>volume_off</i>
    </div>
    </main>
</template>

<script>
import io from 'socket.io-client';
import Welcome from './../Welcome/Welcome.vue'
import Error from './../Error/Error.vue'
import TopHead from './../Partials/TopHead.vue'
import ChatInput from './../Partials/ChatInput.vue'

import Bubble from './../RichComponents/Bubble.vue'
import Card from './../RichComponents/Card.vue'
import CardButton from './../RichComponents/CardButton.vue'
import Carousel from './../RichComponents/Carousel.vue'
import Link from './../RichComponents/Link.vue'
import List from './../RichComponents/List.vue'
import ListItem from './../RichComponents/ListItem.vue'
import Picture from './../RichComponents/Picture.vue'
import Media from './../RichComponents/Media.vue'
import TableCard from './../RichComponents/TableCard.vue'
import Suggestion from './../RichComponents/Suggestion.vue'

import * as uuidv1 from 'uuid/v1'
import { set_seo } from './../../utils'
import db from '../../../db.js'
import test from '../../../testdata'
import './Theme.sass'

export default {
    name: 'app',
    components: {
        Bubble,
        Card,
        Carousel,     
        ChatInput,
        Link,
        Suggestion,
        CardButton
    },
    data: function () {
    return {
        cardComponent: Card,
        smallIconComponent: Card,
        smallIconProperties: test.smallcard,
        buttonProperties: test.buttonproperties,
        carouselComponent: Carousel,
        app: null,  
        messages: [],        
        language: '',
        session: '',
        muted: this.config.app.muted,
        loading: false,
        error: null,
        socket : io('localhost:3100', { query: "netId=rest001" })
        }      
    },
    computed: {
        suggestions(){ 
            // noop
            let suggestions = {
                text_suggestions: ['one', 'two', 'three']
            }
            return suggestions
        },
        currentProperties: function() {
            if (this.cardComponent === Card) {            
            return test.card
            }
          }
        },
    created(){
        this.app = db
        console.log(this.app)
        //if(this.history()) localStorage.setItem('agent', JSON.stringify(configObj))
    },
    watch: {
        
        // This function is triggered, when new messages arrive 
        messages(messages){
            //if(this.history()) localStorage.setItem('message_history', JSON.stringify(messages)) // <- Save history if the feature is enabled
            console.log(messages)
        },
        // This function is triggered, when request is started or finished 
        loading(){
            setTimeout(() => {
                let app = document.querySelector('#app') // <- We need to scroll down #app, to prevent the whole page jumping to bottom, when using in iframe
                if (app.querySelector('.message')){
                    let message = app.querySelectorAll('.message')[app.querySelectorAll('.message').length - 1].offsetTop - 70
                    window.scrollTo({top: message, behavior: 'smooth'})
                }
            }, 2) // <- wait for render (timeout) and then smoothly scroll #app down to the last message
        },
        // You don't need the function below. It's only for managed version, get the SEO right 
        app(agent){
            set_seo(agent)
        }
        
    },
     
    methods: {
        sendMessage(e) {
            this.socket.emit('MESSAGE', {
                user: "Test User",
                netId: "rest001",
                message: e,
                action: "this.action"
            });
            this.message = ''
            this.action = ''
        },
        send(q){
            let request = {
                "queryInput": {
                    "text": {
                        "text": q,
                        "languageCode": this.lang()
                    }
                }
            } // <- this is how a Dialogflow request look like

            this.loading = true
            this.error = null
            
            // Backend Server Integration 
            fetch('http://localhost:3100/routes/test',
                           {method: 'GET', 
                            headers: {'content-type': 'application/json'}})
            .then(response => response.json())
            .then(response => {
                if (response.error) console.log(`error on server ${error}`)
                console.log(response)
            }) 
            

        },
        handle(response){
            /* This function is used for speech output */
            let text = "This is a demo" // <- init a text variable
           
            // This "hack" is used to format our lang format, to some other lang format (example: en -> en_EN). Mainly for Safari, Firefox and Edge
            speech.lang = this.lang() + '-' + this.lang().toUpperCase()
            if(!this.muted) window.speechSynthesis.speak(speech) // <- if app is not muted, speak out the speech
        },
        logResults(obj){
            console.log(`Logging Results From the Function`)
            console.log(obj)
        }
    },
    mounted() {
        this.socket.on('RESPONSE', (data) => {
            //this.messages = []
            this.messages = [...this.messages, ...data.reply];
            console.log(`Messages received`)
            console.log(this.messages)
            // you can also do this.messages.push(data)
        });
    }
}
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Roboto:400,500,700')
@import url('https://fonts.googleapis.com/css?family=Material+Icons')

body
    margin: 0
    padding: 0
    font-family: Google Sans, Roboto, sans-serif
    font-display: swap
    background-color: var(--background)

.container
    max-width: 500px
    margin-left: auto
    margin-right: auto
    padding: 16px
    position: relative
</style>

<style lang="sass" scoped>
.chat-container
    padding-top: 60px
    padding-bottom: 125px

.message
    width: 100%
    table-layout: fixed

    .component
        padding-bottom: 10px
        width: 70%
        display: block

        @media screen and (max-width: 720px)
            width: 100%

.audio-toggle
    position: fixed
    top: 0
    right: 0
    margin: 8px
    z-index: 999
    padding: 10px
    background-color: var(--element-background)
    border-radius: 50%
    width: 24px
    height: 24px
    cursor: pointer
    color: var(--text)
</style>
