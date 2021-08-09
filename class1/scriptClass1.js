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


WA.onEnterZone('popupFrontZone', () => {
    popUpFront = WA.openPopup("popupFront", "Welcome!", [{
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