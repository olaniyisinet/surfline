var GoogleAuth;
  var SCOPE = 'https://www.googleapis.com/auth/drive.metadata.readonly';
  function handleClientLoad() {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    gapi.load('client:auth2', initClient);
  }

  function initClient() {
    // Retrieve the discovery document for version 3 of Google Drive API.
    // In practice, your app can retrieve one or more discovery documents.
    var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

    // Initialize the gapi.client object, which app uses to make API requests.
    // Get API key and client ID from API Console.
    // 'scope' field specifies space-delimited list of access scopes.
    gapi.client.init({
        'apiKey': 'AIzaSyCN9oMPRdjZnDmOiO54B90ce8fIfc5Dl38',
        'discoveryDocs': [discoveryUrl],
        'clientId': '183619491292-8q40kp872bs20p6fa4b5c42g44boch8o.apps.googleusercontent.com',
        'scope': SCOPE
    }).then(function () {
      GoogleAuth = gapi.auth2.getAuthInstance();

      // Listen for sign-in state changes.
      GoogleAuth.isSignedIn.listen(updateSigninStatus);

      // Handle initial sign-in state. (Determine if user is already signed in.)
      var user = GoogleAuth.currentUser.get();
      setSigninStatus();

      // Call handleAuthClick function when user clicks on
      //      "Sign In/Authorize" button.
      $('#sign-in-or-out-button').click(function() {
        handleAuthClick();
      }); 
      $('#revoke-access-button').click(function() {
        revokeAccess();
      }); 
      
    });
  }

  function handleAuthClick() {
    if (GoogleAuth.isSignedIn.get()) {
      // User is authorized and has clicked 'Sign out' button.
      GoogleAuth.signOut();
    } else {
      // User is not signed in. Start Google auth flow.
      GoogleAuth.signIn();
    }
  }

  function revokeAccess() {
    GoogleAuth.disconnect();
  }

  function setSigninStatus(isSignedIn) {
    var user = GoogleAuth.currentUser.get();
    // alert(JSON.stringify(user));

    var profile = user.getBasicProfile();

    // alert(JSON.stringify(profile));

    var isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized) {
              socialLogin.getToken(profile.U3, profile.ig , 'Google', profile.Eea)
    //   $('#sign-in-or-out-button').html('Sign out');
    //   $('#revoke-access-button').css('display', 'inline-block');
    //   $('#auth-status').html('You are currently signed in and have granted ' +
    //       'access to this app.');
    } else {
    //   $('#sign-in-or-out-button').html('Sign In/Authorize');
    //   $('#revoke-access-button').css('display', 'none');
    //   $('#auth-status').html('You have not authorized this app or you are ' +
    //       'signed out.');
    }
  }

  function updateSigninStatus(isSignedIn) {
    setSigninStatus();
  }
