<template>
    <main id="app">
    <section class="container chat-container">  
        <table class="message" >          
            <!-- message -->
            <tr id="message-box" ref="messageBox">
                <component         
                    v-for="(message, index) in messages"
                    :is="message.component"                 
                    :key="index"
                    :actionKey="message.actionKey"
                    :imageUri="message.imageUri"
                    :assetUri="message.assetUri"
                    :title="message.title"
                    :subtitle="message.subtitle"
                    :text="message.text"
                    :from="message.to"
                    >                     
                </component>                 
            </tr>     
                    
        </table>         
    </section>
    
    
    <ChatInput @submit="sendMessage"> 
        <!-- suggestions -->
         <component
            v-for="(suggestion, index) in suggestions"
            :is="suggestion.component"
            @click.native="sendMessage(suggestion)"
            :key="index"
            :title="suggestion.title"
            /> 
        <!-- suggestions with hotlinks -->
        <component
            v-for="(message, index) in links"
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
import DateCard from './../RichComponents/DateCard.vue'
import TimeCard from './../RichComponents/TimeCard.vue'
import Link from './../RichComponents/Link.vue'
import List from './../RichComponents/List.vue'
import ListItem from './../RichComponents/ListItem.vue'
import Picture from './../RichComponents/Picture.vue'
import Media from './../RichComponents/Media.vue'
import TableCard from './../RichComponents/TableCard.vue'
import Suggestion from './../RichComponents/Suggestion.vue'
import Videoclip from './../RichComponents/Videoclip.vue'

import * as uuidv1 from 'uuid/v1'
import { set_seo } from './../../utils'
import db from '../../../db.js'
import test from '../../../testdata'
import './Theme.sass'

export default {
    name: 'app',
    components: {
        'bubble': Bubble,
        'card': Card,
        'carousel': Carousel,     
        ChatInput,
        'datecard': DateCard,
        'timecard': TimeCard,
        'linkit': Link,
        'suggestions': Suggestion,
        'cardbutton': CardButton,
        'videoclip': Videoclip 
    },
    data: function () {
    return {
        date: null,
        cardComponent: Card,
        smallIconComponent: Card,
        smallIconProperties: test.smallcard,
        buttonProperties: test.buttonproperties,
        carouselComponent: Carousel,
        app: null,  
        messages: [],
        suggestions: [],
        links: [], 
        language: '',
        session: '',
        muted: this.config.app.muted,
        loading: false,
        error: null,       
        //socket : io('localhost:4000', { query: "netId=rest001" })
        //socket : io('https://chaotic.ngrok.io', { query: "netId=rest001" })
        socket : io('https://machinev2-dev.us-east-1.elasticbeanstalk.com', { query: "netId=rest001" })
        }      
    },
    computed: {
        
        currentProperties: function() {
            if (this.cardComponent === Card) {            
            return test.card
            }
          }
        },

    created(){
        this.app = db        
        //if(this.history()) localStorage.setItem('agent', JSON.stringify(configObj))
        },

    watch: {
        
        // This function is triggered, when new messages arrive 
        messages(messages){
            //if(this.history()) localStorage.setItem('message_history', JSON.stringify(messages)) // <- Save history if the feature is enabled
            
            console.log('--------------watch: new messages arrived---------')
        },
        // This function is triggered, when request is started or finished 
        loading(){      
            this.$nextTick(() => {   
                let chat = this.$refs.messageBox.clientHeight 
                this.$scrollTo(chat)
            })           
        },
        // You don't need the function below. It's only for managed version, get the SEO right 
        app(agent){
            set_seo(agent)
        }        
    },

    methods:{
       
        sendMessage(e) {
            console.log(`-----------------debug -- why not query -------`)
            console.log(e)
            this.socket.emit('MESSAGE', {
                user: "Test User",
                netId: "rest001",
                message: e,
                action: "this.action"
            });            
            this.message = ''
            this.action = ''
            this.loading=true
            let msg = {
                component: 'bubble',
                text: (e.text) ? e.text : e.title,
                to: 'guest'

            }
            // post user message to the web page
            this.messages.push(msg)
            //this.loading=false
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
            this.loading=true
            data.reply.forEach(e => {
                switch(e.component){
                    case 'bubble':
                        console.log(`this is detecting bubble`)
                        console.log(e)
                        this.messages.push(e)
                        this.loading=false
                        break;
                    case 'suggestions':
                        this.suggestions.push(e)
                        this.loading=false
                        break;
                    default:
                        console.log(`detected some other component`)
                        console.log(e)
                        this.messages.push(e)
                        this.loading=false
                        break;
                }
            })           
            
        }),
        /////////////////////////////////////////////////////////
        //   Cross document communication to parent web page  //
        //   if chat app used in a webapp via sdk. Permits   //
        //   webapp to a number of sdk functions/apis       //
        /////////////////////////////////////////////////////
        this.socket.on('connect', () =>{
            window.parent.postMessage(this.socket.id, '*')
        })
    }
}
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Roboto:400,500,700')
@import url('https://fonts.googleapis.com/css?family=Material+Icons')

html
    height: 100%
    margin: 0
body
    margin: 0
    height: 100%
    padding: 0
    font-family: Google Sans, Roboto, sans-serif
    font-display: swap
    background-color: var(--background)

.container
    max-width: 400px
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
        width: 100% 
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
