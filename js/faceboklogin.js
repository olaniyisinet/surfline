  // This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();

    } else {
      // The person is not logged into your app or we are unable to tell.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function (response) {
      statusChangeCallback(response);
    });
  }

  // window.fbAsyncInit = function () {
  //   FB.init({
  //     appId: '1026073090860657',
  //     cookie: true, // enable cookies to allow the server to access 
  //     // the session
  //     xfbml: true, // parse social plugins on this page
  //     version: 'v2.8' // use graph api version 2.8
  //   });

  //   // Now that we've initialized the JavaScript SDK, we call 
  //   // FB.getLoginStatus().  This function gets the state of the
  //   // person visiting this page and can return one of three states to
  //   // the callback you provide.  They can be:
  //   //
  //   // 1. Logged into your app ('connected')
  //   // 2. Logged into Facebook, but not your app ('not_authorized')
  //   // 3. Not logged into Facebook and can't tell if they are logged into
  //   //    your app or not.
  //   //
  //   // These three cases are handled in the callback function.

  //   // FB.getLoginStatus(function (response) {
  //   //   statusChangeCallback(response);
  //   // });
  //   FB.logout(function (response) {
  //     // alert('You are now logged out')
  //   });
  // };

  // Load the SDK asynchronously
  (function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "js/facebooksdk.js";
    // js.src ="js/facebooksdk.js"
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function (response) {
      console.log('Successful login for: ' + response.name);
      // alert(JSON.stringify(response));
      var name = response.name.split(" ");
      // alert(name[0]);
      socialLogin.getToken(name[0] + '@facebook.com', response.name, 'Facebook', response.id)
      //   document.getElementById('status').innerHTML =
      //     'Thanks for logging in, ' + response.name + '!';
      // window.location = "home.html"
      // Logout();
    });
  }

  window.fbAsyncInit = function () {
    FB.init({
      appId: '1026073090860657',
      oauth: true,
      status: true, // check login status
      cookie: true, // enable cookies to allow the server to access the session
      xfbml: true, // parse XFBML
      version: 'v2.8' // use graph api version 2.8
    });

  };

  function fb_login(permissions) {
     permissionObj = {};
                if (permissions && permissions.length > 0) {
                    permissionObj.scope = permissions.toString();
                }
    FB.login(function (response) {

      if (response.authResponse) {
        console.log('Welcome!  Fetching your information.... ');
        //console.log(response); // dump complete info
        access_token = response.authResponse.accessToken; //get access token
        user_id = response.authResponse.userID; //get FB UID

        FB.api('/me', function (response) {
          user_email = response.email; //get user email
          // you can store this data into your database  
          console.log('Successful login for: ' + response.name);
          // alert(JSON.stringify(response));
          var name = response.name.split(" ");
          // alert(name[0]);
          socialLogin.getToken(name[0] + '@facebook.com', response.name, 'Facebook', response.id)
        });

      } else {
        //user hit cancel button
        console.log('User cancelled login or did not fully authorize.');

      }
    }, {
      scope: 'public_profile,email'
    } , permissionObj);
  }
  (function () {
    var e = document.createElement('script');
    // e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
    e.src = document.location.protocol + 'js/facebooksdk.js';
    e.async = true;
    document.getElementById('fb-root').appendChild(e);
  }());