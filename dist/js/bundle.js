(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const userId = '2cb0e03eef321c467dfa07b70bda2fdada09696253cc5f9d590753bf1aa9dc1f';
const userRef = firebase.firestore().collection('users').doc(userId); 
const booksRef = userRef.collection('books'); 
booksRef.get()
    .then((books) => {
        let linesPromises = new Array();
        let i = 0;
        books.forEach((book) => {
            console.log(i)
            const title = book.data().title;
            console.log(title)
            if (i < 5) {
                linesPromises.push(booksRef.doc(title).collection('lines').get());
            }
            i++;
        });
        return Promise.all(linesPromises);
    })
    .then((linesArray) => {
        linesArray.forEach((lines) => {
            const linesPromise = lines.forEach((data) => {
                $( ".loopSlider" ).append( "<ul></ul>" );
                $( "div.loopSlider ul").append( "<li>" + data.data().line + "</li>" );
            });
        });
        return Promise.resolve();
    })
    .then(() => {
            var setElm = $('.loopSlider'),
                slideSpeed = 500;

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
                }
            });
    })
    .catch((err) => console.error(err));

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IHVzZXJJZCA9ICcyY2IwZTAzZWVmMzIxYzQ2N2RmYTA3YjcwYmRhMmZkYWRhMDk2OTYyNTNjYzVmOWQ1OTA3NTNiZjFhYTlkYzFmJztcbmNvbnN0IHVzZXJSZWYgPSBmaXJlYmFzZS5maXJlc3RvcmUoKS5jb2xsZWN0aW9uKCd1c2VycycpLmRvYyh1c2VySWQpOyBcbmNvbnN0IGJvb2tzUmVmID0gdXNlclJlZi5jb2xsZWN0aW9uKCdib29rcycpOyBcbmJvb2tzUmVmLmdldCgpXG4gICAgLnRoZW4oKGJvb2tzKSA9PiB7XG4gICAgICAgIGxldCBsaW5lc1Byb21pc2VzID0gbmV3IEFycmF5KCk7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgYm9va3MuZm9yRWFjaCgoYm9vaykgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coaSlcbiAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gYm9vay5kYXRhKCkudGl0bGU7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aXRsZSlcbiAgICAgICAgICAgIGlmIChpIDwgNSkge1xuICAgICAgICAgICAgICAgIGxpbmVzUHJvbWlzZXMucHVzaChib29rc1JlZi5kb2ModGl0bGUpLmNvbGxlY3Rpb24oJ2xpbmVzJykuZ2V0KCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaSsrO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGxpbmVzUHJvbWlzZXMpO1xuICAgIH0pXG4gICAgLnRoZW4oKGxpbmVzQXJyYXkpID0+IHtcbiAgICAgICAgbGluZXNBcnJheS5mb3JFYWNoKChsaW5lcykgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGluZXNQcm9taXNlID0gbGluZXMuZm9yRWFjaCgoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICQoIFwiLmxvb3BTbGlkZXJcIiApLmFwcGVuZCggXCI8dWw+PC91bD5cIiApO1xuICAgICAgICAgICAgICAgICQoIFwiZGl2Lmxvb3BTbGlkZXIgdWxcIikuYXBwZW5kKCBcIjxsaT5cIiArIGRhdGEuZGF0YSgpLmxpbmUgKyBcIjwvbGk+XCIgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH0pXG4gICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdmFyIHNldEVsbSA9ICQoJy5sb29wU2xpZGVyJyksXG4gICAgICAgICAgICAgICAgc2xpZGVTcGVlZCA9IDUwMDtcblxuICAgICAgICAgICAgc2V0RWxtLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgIHNlbGZXaWR0aCA9IHNlbGYuaW5uZXJXaWR0aCgpLFxuICAgICAgICAgICAgICAgICAgICBmaW5kVWwgPSBzZWxmLmZpbmQoJ3VsJyksXG4gICAgICAgICAgICAgICAgICAgIGZpbmRMaSA9IGZpbmRVbC5maW5kKCdsaScpLFxuICAgICAgICAgICAgICAgICAgICBsaXN0V2lkdGggPSBmaW5kTGkub3V0ZXJXaWR0aCgpLFxuICAgICAgICAgICAgICAgICAgICBsaXN0Q291bnQgPSBmaW5kTGkubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgICBsb29wV2lkdGggPSBsaXN0V2lkdGggKiBsaXN0Q291bnQ7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cobG9vcFdpZHRoKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGZXaWR0aClcblxuICAgICAgICAgICAgICAgIGZpbmRVbC53cmFwQWxsKCc8ZGl2IGNsYXNzPVwibG9vcFNsaWRlcldyYXBcIiAvPicpO1xuICAgICAgICAgICAgICAgIHZhciBzZWxmV3JhcCA9IHNlbGYuZmluZCgnLmxvb3BTbGlkZXJXcmFwJyk7XG5cbiAgICAgICAgICAgICAgICBpZihsb29wV2lkdGggPj0gc2VsZldpZHRoKXtcbiAgICAgICAgICAgICAgICAgICAgZmluZFVsLmNzcyh7d2lkdGg6bG9vcFdpZHRofSkuY2xvbmUoKS5hcHBlbmRUbyhzZWxmV3JhcCk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2VsZldyYXAuY3NzKHt3aWR0aDpsb29wV2lkdGgqMn0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGxvb3BNb3ZlKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnLScgKyAobG9vcFdpZHRoKSArICdweCcpXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmV3JhcC5hbmltYXRlKHtsZWZ0OictJyArIChsb29wV2lkdGgpICsgJ3B4J30sc2xpZGVTcGVlZCpsaXN0Q291bnQsJ2xpbmVhcicsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmV3JhcC5jc3Moe2xlZnQ6JzAnfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9vcE1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBsb29wTW92ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgIH0pXG4gICAgLmNhdGNoKChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyKSk7XG4iXX0=
