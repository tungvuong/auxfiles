var htmlHost = "https://localhost:5000"
var isFirstTimeTuto = false;
var textFirstPopup = 'Hey ! This is how to start a discussion with someone ! You can be 4 max in a bubble.';
var textSecondPopup = 'You can also use the chat to communicate ! ';
var targetObjectTutoBubble ='Tutobubble';
var targetObjectTutoChat ='tutoChat';
var targetObjectTutoExplanation ='tutoExplanation';
var popUpExplanation = undefined;
var popUpFront = undefined;
var enterSoundUrl = "webrtc-in.mp3";
var exitSoundUrl = "webrtc-out.mp3";
var soundConfig = {
    volume : 0.2,
    loop : false
}

var p004_track1_02 = undefined;
var family_track = undefined;
var greeting_track = undefined;
var friend_track = undefined;

function stopAllTrack(){
    if (friend_track !== undefined) friend_track.stop();
    if (family_track !== undefined) family_track.stop();
    if (greeting_track !== undefined) greeting_track.stop();
    if (p004_track1_02 !== undefined) p004_track1_02.stop();
}

// initialise voices
var speech = undefined;
speechSynthesis.addEventListener("voiceschanged", () => {
  const voices = speechSynthesis.getVoices()
});
const mic = new webkitSpeechRecognition();
mic.continuous = true;
mic.lang = 'en-US';

var voice_name = "Google UK English Female";
var isAgentTalking = false;
var isEngaged = false;
function agent(project_id, session_id, text){
    isAgentTalking = true;
    fetch('https://localhost:5000/bot', {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "query_input": {
          "text": {
            "text": text,
            "language_code": "en-US"
          }
        },
        "project_id": project_id,
        "session_id": session_id
      })
    }).then(res => res.json())
      .then(res => {
        if (speech !== undefined) window.speechSynthesis.cancel();
        speech = new SpeechSynthesisUtterance(res["res"]);
        var voices = window.speechSynthesis.getVoices();
        speech.default = false;
        speech.voice = voices.filter(function(voice) { return voice.name == voice_name; })[0];
        speech.onstart = function(){
            mic.stop();
        }
        speech.onend = function(event) {
            isAgentTalking = false;
            if (isEngaged) mic.start();
            console.log('agent stops');
        };
        window.speechSynthesis.speak(speech);
      });
}



// FRONT EVENT
WA.onEnterZone('popupFrontZone', () => {
    stopAllTrack();
    popUpFront = WA.openPopup("popupFront", "Welcome", [{
        label: "OK",
        className: "success",
        callback: (popup) => {
            popup.close();
        }
    }]);

    WA.nav.openCoWebSite(htmlHost+"/1_0",false,"microphone");
    WA.loadSound(enterSoundUrl).play(soundConfig);
    WA.displayBubble();
});

WA.onLeaveZone('popupFrontZone', () => {
    WA.removeBubble();
    WA.loadSound(exitSoundUrl).play(soundConfig);
    WA.nav.closeCoWebSite();
    if(popUpFront !== undefined) popUpFront.close();
})


// REGISTRATION EVENT
WA.onEnterZone('popupRegistrationZone', () => {
    stopAllTrack();
    WA.nav.openCoWebSite(htmlHost+"/1_1",false,"microphone");
    p004_track1_02 = WA.loadSound('p004_track1_02.mp3');
    p004_track1_02.play(soundConfig);
    WA.displayBubble();
});

WA.onLeaveZone('popupRegistrationZone', () => {
    WA.removeBubble();
    // WA.loadSound(exitSoundUrl).play(soundConfig);
    WA.nav.closeCoWebSite();
    if (p004_track1_02 !== undefined) p004_track1_02.stop();
})

// RECEPTION EVENT
WA.onEnterZone('popupReceptionZone', () => {
    stopAllTrack();
    WA.nav.openCoWebSite(htmlHost+"/1_1_0",false,"microphone");
    WA.displayBubble();
    voice_name = "Google UK English Female";
    agent("welcome-rgfs", "abc", "hello");
    isEngaged = true;
    // WA.nav.openCoWebSite("https://www.youtube.com/embed/BGSghRuCDJI?autoplay=1&muted=0",false,"autoplay");
    // WA.nav.openCoWebSite("https://localhost/girltalk/tenor.gif",false,"microphone");
    
    if (isEngaged && !isAgentTalking) try{mic.start();} catch(e){mic.stop();}
    mic.onstart = function() { 
        console.log('speak');
    };

    mic.onerror = function(e) { console.log(e); };
    mic.onend = function() { console.log('end'); if(isEngaged && !isAgentTalking) try{mic.start();} catch(e){mic.stop();} };
    mic.onresult = function(event) {
        ans = ""
        for (var i = event.resultIndex; i< event.results.length; ++i) {
            if (event.results[i].isFinal){
                 console.log(event.results[i][0].transcript);
                 ans = event.results[i][0].transcript;
             }
        }
        agent("welcome-rgfs", "abc", ans);
        //console.log(res);
    };
});

WA.onLeaveZone('popupReceptionZone', () => {
    mic.stop();
    isEngaged = false;
    if (speech !== undefined) window.speechSynthesis.cancel();
    WA.removeBubble();
    WA.nav.closeCoWebSite();
})


// TUTOR EVENT
WA.onEnterZone('popupBookExerciseZone', () => {
    WA.nav.openCoWebSite(htmlHost+"/1_2",false,"microphone");
    WA.displayBubble();
});

WA.onLeaveZone('popupBookExerciseZone', () => {
    WA.removeBubble();
    WA.nav.closeCoWebSite();
})


// book Teacher EVENT
WA.onEnterZone('popupBookTeacherZone', () => {
    stopAllTrack();
    WA.nav.openCoWebSite(htmlHost+"/1_3",false,"microphone");
    family_track = WA.loadSound('family_track.mp3');
    family_track.play({volume : 1,loop : false});
    WA.displayBubble();
});

WA.onLeaveZone('popupBookTeacherZone', () => {
    WA.removeBubble();
    WA.nav.closeCoWebSite();
    if (family_track !== undefined) family_track.stop();
})

// techer EVENT
WA.onEnterZone('popupTeacherZone', () => {
    stopAllTrack();
    WA.nav.openCoWebSite(htmlHost+"/1_3",false,"microphone");
    WA.displayBubble();
    voice_name = "Google UK English Female";
    agent("family-agent-bpph", "abc", "hello");
    isEngaged = true;
    // WA.nav.openCoWebSite("https://www.youtube.com/embed/BGSghRuCDJI?autoplay=1&muted=0",false,"autoplay");
    // WA.nav.openCoWebSite("https://localhost/girltalk/tenor.gif",false,"microphone");
    
    if (isEngaged && !isAgentTalking) try{mic.start();} catch(e){mic.stop();}
    mic.onstart = function() { 
        console.log('speak');
    };

    mic.onerror = function(e) { console.log(e); };
    mic.onend = function() { console.log('end'); if(isEngaged && !isAgentTalking) try{mic.start();} catch(e){mic.stop();} };
    mic.onresult = function(event) {
        ans = ""
        for (var i = event.resultIndex; i< event.results.length; ++i) {
            if (event.results[i].isFinal){
                 console.log(event.results[i][0].transcript);
                 ans = event.results[i][0].transcript;
             }
        }
        agent("family-agent-bpph", "abc", ans);
        //console.log(res);
    };
});

WA.onLeaveZone('popupTeacherZone', () => {
    mic.stop();
    isEngaged = false;
    if (speech !== undefined) window.speechSynthesis.cancel();
    WA.removeBubble();
    WA.nav.closeCoWebSite();
})



// book Alex EVENT
WA.onEnterZone('popupBookAlexZone', () => {
    stopAllTrack();
    WA.nav.openCoWebSite(htmlHost+"/1_4",false,"microphone");
    greeting_track = WA.loadSound('greeting_track.mp3');
    greeting_track.play({volume : 1,loop : false});
    WA.displayBubble();
});

WA.onLeaveZone('popupBookAlexZone', () => {
    WA.removeBubble();
    WA.nav.closeCoWebSite();
    if (greeting_track !== undefined) greeting_track.stop();
})



// alex EVENT
WA.onEnterZone('popupAlexZone', () => {
    stopAllTrack();
    WA.nav.openCoWebSite(htmlHost+"/1_4",false,"microphone");
    WA.displayBubble();
    voice_name = "Google UK English Male";
    agent("greeting-afky", "abc", "hello");
    isEngaged = true;
    // WA.nav.openCoWebSite("https://www.youtube.com/embed/BGSghRuCDJI?autoplay=1&muted=0",false,"autoplay");
    // WA.nav.openCoWebSite("https://localhost/girltalk/boy.gif",false,"microphone");

    if (isEngaged && !isAgentTalking) try{mic.start();} catch(e){mic.stop();}
    mic.onstart = function() { 
        console.log('speak');
    };

    mic.onerror = function(e) { console.log(e); };
    mic.onend = function() { console.log('end'); if(isEngaged && !isAgentTalking) try{mic.start();} catch(e){mic.stop();} };
    mic.onresult = function(event) {
        ans = ""
        for (var i = event.resultIndex; i< event.results.length; ++i) {
            if (event.results[i].isFinal){
                 console.log(event.results[i][0].transcript);
                 ans = event.results[i][0].transcript;
             }
        }
        agent("greeting-afky", "abc", ans);
        //console.log(res);
    };
});

WA.onLeaveZone('popupAlexZone', () => {
    mic.stop();
    isEngaged = false;
    if (speech !== undefined) window.speechSynthesis.cancel();
    WA.removeBubble();
    WA.nav.closeCoWebSite();
})


// book Fiona EVENT
WA.onEnterZone('popupBookFionaZone', () => {
    stopAllTrack();
    WA.nav.openCoWebSite(htmlHost+"/1_5",false,"microphone");
    friend_track = WA.loadSound('friend_track.mp3');
    friend_track.play({volume : 1,loop : false});
    WA.displayBubble();
});

WA.onLeaveZone('popupBookFionaZone', () => {
    WA.removeBubble();
    WA.nav.closeCoWebSite();
    if (friend_track !== undefined) friend_track.stop();
})


// Fiona EVENT
WA.onEnterZone('popupFionaZone', () => {
    stopAllTrack();
    WA.nav.openCoWebSite(htmlHost+"/1_5",false,"microphone");
    WA.displayBubble();
    voice_name = "Google UK English Female";
    agent("aboutfriendagent-stu9", "abc", "hello");
    isEngaged = true;
    // WA.nav.openCoWebSite("https://www.youtube.com/embed/BGSghRuCDJI?autoplay=1&muted=0",false,"autoplay");
    // WA.nav.openCoWebSite("https://localhost/girltalk/boy.gif",false,"microphone");

    if (isEngaged && !isAgentTalking) try{mic.start();} catch(e){mic.stop();}
    mic.onstart = function() { 
        console.log('speak');
    };

    mic.onerror = function(e) { console.log(e); };
    mic.onend = function() { console.log('end'); if(isEngaged && !isAgentTalking) try{mic.start();} catch(e){mic.stop();} };
    mic.onresult = function(event) {
        ans = ""
        for (var i = event.resultIndex; i< event.results.length; ++i) {
            if (event.results[i].isFinal){
                 console.log(event.results[i][0].transcript);
                 ans = event.results[i][0].transcript;
             }
        }
        agent("aboutfriendagent-stu9", "abc", ans);
        //console.log(res);
    };
});

WA.onLeaveZone('popupFionaZone', () => {
    mic.stop();
    isEngaged = false;
    if (speech !== undefined) window.speechSynthesis.cancel();
    WA.removeBubble();
    WA.nav.closeCoWebSite();
})



// book Peter EVENT
WA.onEnterZone('popupBookPeterZone', () => {
    stopAllTrack();
    WA.nav.openCoWebSite(htmlHost+"/1_6",false,"microphone");
    WA.displayBubble();
});

WA.onLeaveZone('popupBookPeterZone', () => {
    WA.removeBubble();
    WA.nav.closeCoWebSite();
})



// Peter EVENT
WA.onEnterZone('popupPeterZone', () => {
    stopAllTrack();
    WA.nav.openCoWebSite(htmlHost+"/1_6",false,"microphone");
    WA.displayBubble();
    voice_name = "Google UK English Male";
    agent("jokes-kdat", "abc", "hello");
    isEngaged = true;
    // WA.nav.openCoWebSite("https://www.youtube.com/embed/BGSghRuCDJI?autoplay=1&muted=0",false,"autoplay");
    // WA.nav.openCoWebSite("https://localhost/girltalk/boy.gif",false,"microphone");

    if (isEngaged && !isAgentTalking) try{mic.start();} catch(e){mic.stop();}
    mic.onstart = function() { 
        console.log('speak');
    };

    mic.onerror = function(e) { console.log(e); };
    mic.onend = function() { console.log('end'); if(isEngaged && !isAgentTalking) try{mic.start();} catch(e){mic.stop();} };
    mic.onresult = function(event) {
        ans = ""
        for (var i = event.resultIndex; i< event.results.length; ++i) {
            if (event.results[i].isFinal){
                 console.log(event.results[i][0].transcript);
                 ans = event.results[i][0].transcript;
             }
        }
        agent("jokes-kdat", "abc", ans);
        //console.log(res);
    };
});

WA.onLeaveZone('popupPeterZone', () => {
    mic.stop();
    isEngaged = false;
    if (speech !== undefined) window.speechSynthesis.cancel();
    WA.removeBubble();
    WA.nav.closeCoWebSite();
})
