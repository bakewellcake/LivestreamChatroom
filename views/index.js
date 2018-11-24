import Vue from 'vue'
import Vuetify from 'vuetify'
import VueResource from 'vue-resource'
import VueCookies from 'vue-cookies'
import JsonWebToken from 'jsonwebtoken'
import Moment from 'moment'

import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)
Vue.use(VueResource)
Vue.use(VueCookies)

var app = new Vue({
    el: '#app',
    components: {
        LayoutComponent: () => import(/* webpackChunkName: "layout" */ './layout.vue'),
        LoginComponent: () => import(/* webpackChunkName: "login" */ './login/index.vue'),
        LivestreamComponent: () => import(/* webpackChunkName: "livestream" */ './livestream/index.vue')
    },
    data: {  
        snackbar: {
            visible: false,
            color: null,
            text: null
        },
    },
    methods: {
        encodeJSON: function (data) {
            var encoded = '?' + Object.keys(data).map(function (k) {
                return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
            }).join('&')

            return encoded
        },
        toast: function (text, color) {
            this.snackbar.text = text
            this.snackbar.color = color
            this.snackbar.visible = true
        }
    },
    computed: {
        mobile: function () {
            return this.$vuetify.breakpoint.width < 800
        },
        user: function () {
            return JsonWebToken.decode(this.$cookies.get('authentication'))
        }
    }
})

window.Vue = Vue
window.App = app
window.moment = Moment