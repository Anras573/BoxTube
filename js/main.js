var boxTube = angular.module('boxTube', []);

boxTube.run(function() {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});

boxTube.service('youtubeService', ['$window', '$rootScope', function($window, $rootScope) {

    var service = this;

    var youtube = {
        ready: false,
        player: null,
        playerId: 'player',
        videoId: '5NV6Rdv1a3I',
        videoTitle: 'Daft Punk - Get Lucky (Official Audio) ft. Pharrell Williams, Nile Rodgers',
        playerHeight: '480',
        playerWidth: '640',
        state: 'stopped'
    };

    var results = [];
    var playlist = [{
        id: 'YqeW9_5kURI',
        title: 'Major Lazer & DJ Snake - Lean On (feat. MØ) (Official Music Video)'
    }, {
        id: 'X46t8ZFqUB4',
        title: 'Zedd - I Want You To Know ft. Selena Gomez'
    }];
    var history = [{
        id: youtube.videoId,
        title: youtube.videoTitle
    }];

    $window.onYouTubeIframeAPIReady = function() {
        youtube.player = new YT.Player(youtube.playerId, {
            height: youtube.playerHeight,
            width: youtube.playerWidth,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
        $rootScope.$apply();
    };

    function onPlayerReady(event) {
        youtube.player.cueVideoById(youtube.videoId);
        event.target.playVideo();
    }

    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {
            youtube.state = 'playing';
        } else if (event.data === YT.PlayerState.PAUSED) {
            youtube.state = 'paused';
        } else if (event.data === YT.PlayerState.ENDED) {
            youtube.state = 'ended';
            service.playNextVideo(playlist[0]);
        }
        $rootScope.$apply();
    }

    this.playNextVideo = function(video) {
        youtube.player.loadVideoById(video.id);
        youtube.videoId = video.id;
        youtube.videoTitle = video.title;
        history.push(video);
        playlist.splice(0, 1);
    };

    this.listResults = function(data) {
        results.length = 0;
        for (var i = 0; i < data.items.length; i++) {
            results.push({
                id: data.items[i].id.videoId,
                title: data.items[i].snippet.title,
                description: data.items[i].snippet.description,
                thumbnail: data.items[i].snippet.thumbnails.default.url,
                author: data.items[i].snippet.channelTitle
            });
        }
        return results;
    };

    this.deleteVideoFromPlaylist = function(index) {
        playlist.splice(index, 1);
    };

    this.deleteVideoFromHistory = function(index) {
        history.splice(index, 1);
    };

    this.playVideoFromPlaylist = function(index) {
        var video = playlist[index];
        youtube.player.loadVideoById(video.id);
        youtube.videoId = video.id;
        youtube.videoTitle = video.title;
        history.push(video);
        service.deleteVideoFromPlaylist(index);
    };

    this.playVideoFromHistory = function(index) {
        var video = history[index];
        youtube.player.loadVideoById(video.id);
        youtube.videoId = video.id;
        youtube.videoTitle = video.title;
        history.push(video);
    };

    this.queueVideo = function(video) {
        playlist.push(video);
    };

    this.getYoutube = function() {
        return youtube;
    };

    this.getResults = function() {
        return results;
    };

    this.getPlaylist = function() {
        return playlist;
    };

    this.getHistory = function() {
        return history;
    };

}]);

boxTube.controller('youtubeController', ['$scope', '$http', 'youtubeService', function($scope, $http, youtubeService) {

    init();

    function init() {
        $scope.youtube = youtubeService.getYoutube();
        $scope.results = youtubeService.getResults();
        $scope.playlist = youtubeService.getPlaylist();
        $scope.history = youtubeService.getHistory();
        $scope.showHistory = false;
    }

    $scope.search = function() {
        $http.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    key: 'AIzaSyBS-Ne64g25XjGDEYl5U96fRi7CvbpQ73w',
                    type: 'video',
                    maxResults: '8',
                    part: 'id,snippet',
                    fields: 'items/id,items/snippet/title,items/snippet/description,items/snippet/thumbnails/default,items/snippet/channelTitle',
                    q: this.request
                }
            })
            .success(function(data) {
                youtubeService.listResults(data);
            })
            .error(function(e) {
                console.log(e);
            });
    };

    $scope.queue = function(result) {
        var video = {
            id: result.id,
            title: result.title
        };
        youtubeService.queueVideo(video);
    };

    $scope.delete = function(index) {
        youtubeService.deleteVideoFromPlaylist(index);
    };

    $scope.deleteFromHistory = function(index) {
        youtubeService.deleteVideoFromHistory(index);
    };

    $scope.playVideoFromPlaylist = function(index) {
        youtubeService.playVideoFromPlaylist(index);
    };

    $scope.playVideoFromHistory = function(index) {
        youtubeService.playVideoFromHistory(index);
    };

    $scope.displayPlaylist = function() {
        $scope.showHistory = false;
    };

    $scope.displayHistory = function() {
        $scope.showHistory = true;
    };

}]);
