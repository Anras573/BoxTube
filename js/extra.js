$(document).ready(function () {

    function resize() {
        var videoHeight = $('#video').outerHeight();
        var listsHeight = $('#lists').outerHeight();

        var playlistItems = $('#playlist').children('.ng-scope');
        var historyItems = $('#history').children('.ng-scope');
        
        var tempHeight1 = 0;
        playlistItems.each(function() {
            tempHeight1 += $(this).outerHeight(true);
        });
        var tempHeight2 = 0;
        historyItems.each(function() {
            tempHeight2 += $(this).outerHeight(true);
        });
        
        var height = 0;
        if (tempHeight1 > tempHeight2){
            height = tempHeight1;
            $('#history').height(tempHeight1);
            $('#playlist').height(tempHeight1);
        } else if (tempHeight1 < tempHeight2) {
            height = tempHeight2;
            $('#playlist').height(tempHeight2);
            $('#history').height(tempHeight2);
        }

        $('#video-and-playlist').height(videoHeight + listsHeight + height);
        
        requestAnimationFrame(resize);
    };

    resize();

});
