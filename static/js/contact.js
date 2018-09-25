/**
 * Created by Anirudha on 11/03/17.
 */

$(document).ready(function() {
    $('i').hide();
})

$(window).load(function() {
    $('i').show();

    var twitterPos = $('#twitter').position();
    var githubPos = $('#github').position();
    var stackPos = $('#stack').position();
    var linkedinPos = $('#linkedin').position();
    var instagramPos = $('#instagram').position();
    var fbPos = $('#facebook').position();
    var mailPos = $('#mail').position();
    var imgPos = $('.me').position();

    $('i').css({
        position: 'absolute',
        zIndex: '1',
        top: imgPos.top + 100,
        left: '47%'
    });

    setTimeout(function() {
        $('#twitter').animate({
            top: twitterPos.top + 10,
            left: twitterPos.left - 10
        }, 500);
    }, 250);

    setTimeout(function() {
        $('#twitter').animate({
            top: twitterPos.top,
            left: twitterPos.left
        }, 250);

        $('#github').animate({
            top: githubPos.top + 10,
            left: githubPos.left - 6
        }, 500);
    }, 500);

    setTimeout(function() {
        $('#github').animate({
            top: githubPos.top,
            left: githubPos.left
        }, 250);

        $('#stack').animate({
            top: stackPos.top + 10,
            left: stackPos.left - 3
        }, 500);
    }, 750);

    setTimeout(function() {
        $('#stack').animate({
            top: stackPos.top,
            left: stackPos.left
        }, 250);

        $('#linkedin').animate({
            top: linkedinPos.top + 10,
            left: linkedinPos.left
        }, 500);
    }, 1000);

    setTimeout(function() {
        $('#linkedin').animate({
            top: linkedinPos.top,
            left: linkedinPos.left
        }, 250);

        $('#instagram').animate({
            top: instagramPos.top + 10,
            left: instagramPos.left + 3
        }, 500);
    }, 1250);

    setTimeout(function() {
        $('#instagram').animate({
            top: instagramPos.top,
            left: instagramPos.left
        }, 250);

        $('#facebook').animate({
            top: fbPos.top + 10,
            left: fbPos.left + 6
        }, 500);
    }, 1500);

    setTimeout(function() {
        $('#facebook').animate({
            top: fbPos.top,
            left: fbPos.left
        }, 250);

        $('#mail').animate({
            top: mailPos.top + 10,
            left: mailPos.left + 10
        }, 500);
    }, 1750);

    setTimeout(function() {
        $('#mail').animate({
            top: mailPos.top,
            left: mailPos.left
        }, 250);
    }, 2000);

})
