(function () {
    'use strict';

    angular
        .module('gdAuth')
        .factory('currentUser', currentUser);

    currentUser.$inject = ['localStorage', 'notifier'];

    function currentUser(localStorage, notifier) {
        var USERKEY = 'utoken';
        var profile = init();

        var service = {
            profile: profile,
            setProfile: setProfile,
            signOut: signOut,
            signOutIfTokenExpired: signOutIfTokenExpired
        };

        return service;

        ////////////////

        function init(){
            var user = {
                "username": "",
                "token": "",
                get isLoggedIn(){
                    return this.token ? true : false;
                }
            };

            var localUser = localStorage.get(USERKEY);
            if(localUser){
                user.username = localUser.username;
                user.token = localUser.token;
            }

            return user;
        }

        function setProfile(username, token) {
            this.profile.username = username;
            this.profile.token = token;
            localStorage.add(USERKEY, profile);
        }

        function signOut(){
            var notifyAboutLogout = false;
            if(this.profile.isLoggedIn){
                notifyAboutLogout = true;
            }

            //Always try to remove from local-storage and clear profile:
            localStorage.remove(USERKEY);

            if(this.profile){
                this.profile.username = '';
                this.profile.token = '';
            }

            notifyAboutLogout && notifier.info('', 'User Logged Out');
        }

        function signOutIfTokenExpired(){
            if(!this.profile.isLoggedIn){
                return;
            }

            var localUser = localStorage.get(USERKEY);

            if(!localUser){
                this.signOut();

                return;
            }

            if(localUser && isTokenExpired(localUser.token)){
                this.signOut();
            }
        }

        function isTokenExpired(data){
            var payload = data.split('.');
            var tokenString = atob(payload[1]);

            var token = JSON.parse(tokenString);
            return token.exp < new Date().getTime();
        }
    }
})();