(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const lifeShift = "ＬＩＦＥ　ＳＨＩＦＴ（ライフ・シフト）―１００年時代の人生戦略";
firebase.firestore().collection('books').doc(lifeShift).collection('lines').get()
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
                slideSpeed = 2000;

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

},{}]},{},[1]);
