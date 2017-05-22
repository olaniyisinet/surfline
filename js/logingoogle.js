        function onSuccess(googleUser) {
            console.log('Logged in as: ' + googleUser.getBasicProfile().getName());

            // alert(JSON.stringify(googleUser.getBasicProfile()));
            var profile = googleUser.getBasicProfile();
             socialLogin.getToken(profile.U3, profile.ig , 'Google', profile.Eea)
        }

        function onFailure(error) {
            console.log(error);
        }

        function renderButton() {
            gapi.signin2.render('my-signin2', {
                'scope': 'profile email',
                'width': 240,
                'height': 50,
                'longtitle': true,
                'theme': 'dark',
                'onsuccess': onSuccess,
                'onfailure': onFailure
            });
        }
