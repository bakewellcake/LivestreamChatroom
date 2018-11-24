<template>
    <v-layout style="min-height: 80vh" justify-center class="auth-fs-background">
        <v-flex lg4 sm8 xl0 xs12>
            <v-card class="mt-5" style="min-height: 300px;">
                <v-slide-x-transition>
                    <v-form v-if="state === 'login'" @submit.prevent="login" @keydown="loginForm.onKeydown($event)" ref="loginForm">
                        <v-card-title class="py-0">
                            <v-container>
                                <v-flex>
                                    <h3>Livestream Login</h3>
                                </v-flex>
                            </v-container>
                        </v-card-title>
                        <v-card-text class="px-5">
                            <v-flex lg10 sm8 x10 xs10>
                                <v-text-field label="Username" name="Username" v-model="loginForm.username" maxlength="64" :rules="[v => !!v || 'Username is required']"></v-text-field>
                                <v-text-field label="Password" name="Password" v-model="loginForm.password" maxlength="32" :rules="[v => !!v || 'Password is required']"
                                            :type="loginPasswordHidden ? 'password' : 'text'" :append-icon="loginPasswordHidden ? 'visibility_off' : 'visibility'"
                                            @click:append="loginPasswordHidden = !loginPasswordHidden"></v-text-field>
                            </v-flex>
                        </v-card-text>
                        <v-card-actions class="pl-4 pb-4">
                            <v-btn color="gray" type="submit" :loading="loginLoading" small>Login</v-btn>
                            <v-btn color="gray" v-on:click="changeState('register')" small>Register</v-btn>
                        </v-card-actions>
                    </v-form>
                </v-slide-x-transition>
                <v-slide-x-reverse-transition>
                    <v-form v-if="state === 'register'" @submit.prevent="register" @keydown="registerForm.onKeydown($event)" ref="registerForm">
                        <v-card-title class="py-0">
                            <v-container>
                                <v-flex>
                                    <h3>Livestream Register</h3>
                                </v-flex>
                            </v-container>
                        </v-card-title>
                        <v-card-text class="px-5">
                            <v-flex lg10 sm8 x10 xs10>
                                <v-text-field label="Username" name="Username" v-model="registerForm.username" maxlength="64" :rules="[v => !!v || 'Username is required']"></v-text-field>
                                <v-text-field label="Password" name="Password" v-model="registerForm.password" maxlength="32" :rules="[v => !!v || 'Password is required']"
                                            :type="registerPasswordHidden ? 'password' : 'text'" :append-icon="registerPasswordHidden ? 'visibility_off' : 'visibility'"
                                            @click:append="registerPasswordHidden = !registerPasswordHidden"></v-text-field>
                            </v-flex>
                        </v-card-text>
                        <v-card-actions class="pl-4 pb-4">
                            <v-btn color="gray" type="submit" :loading="registerLoading" small>Submit</v-btn>
                            <v-btn color="gray" v-on:click="changeState('login')" small>Back</v-btn>
                        </v-card-actions>
                    </v-form>
                </v-slide-x-reverse-transition>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        data: function () {
            return {
                state: 'login',
                loginForm: {
                    username: null,
                    password: null
                },
                loginPasswordHidden: true,
                loginLoading: false,
                registerForm: {
                    username: null,
                    password: null
                },
                registerPasswordHidden: true,
                registerLoading: false
            }
        },
        methods: {
            login: function () {               
                if (this.$refs.loginForm.validate()) {
                    this.loginLoading = true
                    this.$http.post('/login', this.loginForm).then((data) => {
                        if (data.body.error) {
                            this.$root.toast(data.body.error, 'red')
                            this.loginForm.password = null
                        } else {
                            this.$cookies.set('authentication', data.body.token, '7d', '/')
                            window.location.replace('/livestream')
                        }
                    }, (error) => {
                        this.$root.toast(error.body, 'red')
                    }).finally(() => {
                        this.loginLoading = false
                    })
                }
            },
            register: function () {
                if (this.$refs.registerForm.validate()) {
                    this.registerLoading = true
                    this.$http.post('/register', this.registerForm).then((data) => {
                        if (data.body.error) {
                            this.$root.toast(data.body.error, 'red')
                            this.$refs.registerForm.reset()
                        } else {
                            this.$root.toast('Registration successful, please login to continue', 'green')
                            this.changeState('login')
                        }
                    }, (error) => {
                        this.$root.toast(error.body, 'red')
                    }).finally(() => {
                        this.registerLoading = false
                    })
                }
            },
            changeState(state) {
                this.state = null
                setTimeout(() => {
                    this.state = state
                }, 300)
            }
        }
    }
</script>