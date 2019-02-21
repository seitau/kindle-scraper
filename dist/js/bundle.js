(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const userId = '2cb0e03eef321c467dfa07b70bda2fdada09696253cc5f9d590753bf1aa9dc1f';
const lifeShift = "ＬＩＦＥ　ＳＨＩＦＴ（ライフ・シフト）―１００年時代の人生戦略";
const userRef = firebase.firestore().collection('users').doc(userId); 
userRef.collection('books').doc(lifeShift).collection('lines').get()
    .then((datas) => {
        $( ".loopSlider" ).append( "<ul></ul>" );
        const linesPromise = datas.forEach((data) => { 
            $( "div.loopSlider ul").append( "<li>" + data.data().line + "</li>" );
        });

        return Promise.resolve();
    })
    .then(() => {
        (function(){
            var setElm = $('.loopSlider'),
                slideSpeed = 6000;

            setElm.each(function(){
                var self = $(this),
                    selfWidth = self.innerWidth(),
                    findUl = self.find('ul'),
                    findLi = findUl.find('li'),
                    listWidth = findLi.outerWidth(),
                    listCount = findLi.length,
                    loopWidth = listWidth * listCount;
                console.log(loopWidth)
                console.log(selfWidth)

                findUl.wrapAll('<div class="loopSliderWrap" />');
                var selfWrap = self.find('.loopSliderWrap');

                if(loopWidth >= selfWidth){
                    findUl.css({width:loopWidth}).clone().appendTo(selfWrap);

                    selfWrap.css({width:loopWidth*2});

                    function loopMove(){
                        console.log('-' + (loopWidth) + 'px')
                        selfWrap.animate({left:'-' + (loopWidth) + 'px'},slideSpeed*listCount,'linear',function(){
                            selfWrap.css({left:'0'});
                            loopMove();
                        });
                    };
                    loopMove();

                    //   setElm.hover(function() {
                    //       selfWrap.pause();
                    //   }, function() {
                    //       selfWrap.resume();
                    //   });
                }
            });
        })();
    })
    .catch((err) => console.error(err));

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCB1c2VySWQgPSAnMmNiMGUwM2VlZjMyMWM0NjdkZmEwN2I3MGJkYTJmZGFkYTA5Njk2MjUzY2M1ZjlkNTkwNzUzYmYxYWE5ZGMxZic7XG5jb25zdCBsaWZlU2hpZnQgPSBcIu+8rO+8qe+8pu+8peOAgO+8s++8qO+8qe+8pu+8tO+8iOODqeOCpOODleODu+OCt+ODleODiO+8ieKAle+8ke+8kO+8kOW5tOaZguS7o+OBruS6uueUn+aIpueVpVwiO1xuY29uc3QgdXNlclJlZiA9IGZpcmViYXNlLmZpcmVzdG9yZSgpLmNvbGxlY3Rpb24oJ3VzZXJzJykuZG9jKHVzZXJJZCk7IFxudXNlclJlZi5jb2xsZWN0aW9uKCdib29rcycpLmRvYyhsaWZlU2hpZnQpLmNvbGxlY3Rpb24oJ2xpbmVzJykuZ2V0KClcbiAgICAudGhlbigoZGF0YXMpID0+IHtcbiAgICAgICAgJCggXCIubG9vcFNsaWRlclwiICkuYXBwZW5kKCBcIjx1bD48L3VsPlwiICk7XG4gICAgICAgIGNvbnN0IGxpbmVzUHJvbWlzZSA9IGRhdGFzLmZvckVhY2goKGRhdGEpID0+IHsgXG4gICAgICAgICAgICAkKCBcImRpdi5sb29wU2xpZGVyIHVsXCIpLmFwcGVuZCggXCI8bGk+XCIgKyBkYXRhLmRhdGEoKS5saW5lICsgXCI8L2xpPlwiICk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9KVxuICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgc2V0RWxtID0gJCgnLmxvb3BTbGlkZXInKSxcbiAgICAgICAgICAgICAgICBzbGlkZVNwZWVkID0gNjAwMDtcblxuICAgICAgICAgICAgc2V0RWxtLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgIHNlbGZXaWR0aCA9IHNlbGYuaW5uZXJXaWR0aCgpLFxuICAgICAgICAgICAgICAgICAgICBmaW5kVWwgPSBzZWxmLmZpbmQoJ3VsJyksXG4gICAgICAgICAgICAgICAgICAgIGZpbmRMaSA9IGZpbmRVbC5maW5kKCdsaScpLFxuICAgICAgICAgICAgICAgICAgICBsaXN0V2lkdGggPSBmaW5kTGkub3V0ZXJXaWR0aCgpLFxuICAgICAgICAgICAgICAgICAgICBsaXN0Q291bnQgPSBmaW5kTGkubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICBsb29wV2lkdGggPSBsaXN0V2lkdGggKiBsaXN0Q291bnQ7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cobG9vcFdpZHRoKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGZXaWR0aClcblxuICAgICAgICAgICAgICAgIGZpbmRVbC53cmFwQWxsKCc8ZGl2IGNsYXNzPVwibG9vcFNsaWRlcldyYXBcIiAvPicpO1xuICAgICAgICAgICAgICAgIHZhciBzZWxmV3JhcCA9IHNlbGYuZmluZCgnLmxvb3BTbGlkZXJXcmFwJyk7XG5cbiAgICAgICAgICAgICAgICBpZihsb29wV2lkdGggPj0gc2VsZldpZHRoKXtcbiAgICAgICAgICAgICAgICAgICAgZmluZFVsLmNzcyh7d2lkdGg6bG9vcFdpZHRofSkuY2xvbmUoKS5hcHBlbmRUbyhzZWxmV3JhcCk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2VsZldyYXAuY3NzKHt3aWR0aDpsb29wV2lkdGgqMn0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGxvb3BNb3ZlKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnLScgKyAobG9vcFdpZHRoKSArICdweCcpXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmV3JhcC5hbmltYXRlKHtsZWZ0OictJyArIChsb29wV2lkdGgpICsgJ3B4J30sc2xpZGVTcGVlZCpsaXN0Q291bnQsJ2xpbmVhcicsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmV3JhcC5jc3Moe2xlZnQ6JzAnfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9vcE1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBsb29wTW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vICAgc2V0RWxtLmhvdmVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICBzZWxmV3JhcC5wYXVzZSgpO1xuICAgICAgICAgICAgICAgICAgICAvLyAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICBzZWxmV3JhcC5yZXN1bWUoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSkoKTtcbiAgICB9KVxuICAgIC5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmVycm9yKGVycikpO1xuIl19
