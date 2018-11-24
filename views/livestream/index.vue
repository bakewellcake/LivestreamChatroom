<template>
    <v-layout justify-center class="auth-fs-background">
        <v-flex xs11>
            <v-card class="mt-5">
                <v-card-title>
                    <h3 class="headline mb-0">Livestream Chatroom</h3>
                    <v-btn right absolute v-on:click="logout">Logout</v-btn>
                </v-card-title>
                <v-card-text>
                    <v-container fluid>
                    <v-layout row>
                        <v-flex xs8>
                            <v-card class="bordered">
                                <iframe id="videoContainer" src="https://www.youtube.com/embed/XOacA3RYrXk?autoplay=1" allow="autoplay"></iframe>
                            </v-card>
                        </v-flex>
                        <v-flex xs4 class="pl-3 max-height">
                            <v-card class="max-height bordered">
                                <v-card-text id="historyContainer" ref="historyContainer">
                                    <v-flex v-for="item in messageHistory" :key="item.id" :offset-xs3="currentUser(item.user_id)" :xs9="!currentUser(item.user_id)">
                                        <v-card class="mb-2 pa-2 bordered-grey messageContainer">
                                            <v-card-text class="pa-0">
                                                <v-layout row v-if="currentUser(item.user_id)">
                                                    <v-flex left>
                                                        <small>{{ item.created_datetime | formatDateTime }}</small>
                                                    </v-flex>
                                                    <v-flex right class="text-xs-right">
                                                        <small>{{ item.name }}</small>
                                                    </v-flex>
                                                </v-layout>
                                                <v-layout v-else>
                                                    <v-flex left>
                                                        <small>{{ item.name }}</small>
                                                    </v-flex>
                                                    <v-flex right class="text-xs-right">
                                                        <small>{{ item.created_datetime | formatDateTime }}</small>
                                                    </v-flex>
                                                </v-layout>
                                                <v-divider class="pb-2"></v-divider>
                                                <div :class="{ 'text-xs-right': currentUser(item.user_id) }">
                                                    {{ item.message }}
                                                </div>
                                            </v-card-text>
                                        </v-card>
                                    </v-flex>
                                </v-card-text>
                                <v-card-actions>
                                    <v-flex xs12>
                                        <v-text-field box outline append-icon="send" hide-details single-line v-on:keyup.enter="sendMessage" @click:append="sendMessage" v-model="messageValue"></v-text-field>
                                    </v-flex>
                                </v-card-actions>
                            </v-card>
                        </v-flex>
                    </v-layout>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        data: function () {
            return {
                messageHistory: [],
                messageValue: null,
                socket: null
            }
        },
        watch: {
            messageHistory: function () {                
                // chat history doesn't scroll down all the way after value is applied...
                setTimeout(() => {
                    this.scrollDown()
                }, 10)
            }
        },
        methods: {
            logout: function () {
                this.$cookies.remove('authentication')
                window.location.replace('/')
            },
            scrollDown: function () {
                var historyContainer = this.$refs.historyContainer
                historyContainer.scrollTop = historyContainer.scrollHeight + 100
            },
            sendMessage: function () {
                if (this.messageValue.length > 0) {
                    this.socket.emit('msg', this.messageValue)
                }
            },
            currentUser(id) {
                return id === this.user.id
            }
        },
        computed: {
            user: function () {
                return this.$root.user
            },
        },
        filters: {
            formatDateTime: function (value) {
                return moment(value).format('DD/MM/YYYY HH:mm')
            }
        },
        mounted: function () {
            this.scrollDown()
            this.socket = io.connect('http://localhost:4401')
            this.socket.emit('auth', this.$cookies.get('authentication'))
            this.socket.on('msg', (data) => {
                this.messageHistory.push(data)
                this.messageValue = null
            })

            this.$http.get('/livestream/history').then(function (data) {
                this.messageHistory = data.body
            }, (error) => {
                this.$root.toast(error.body, 'red')
            })
        }
    }
</script>

<style>
    .bordered-grey {
        border: 1px solid grey !important;
    }

    .bordered {
        border: 1px solid black !important;
    }

    .max-height {
        min-height: 100%;
    }

    .messageContainer {
        overflow-wrap: break-word;
    }

    #historyContainer {
        height: 425px; 
        overflow-y: scroll;
    }

    #videoContainer {
        width: 100%;
        height: 500px;
    }
</style>