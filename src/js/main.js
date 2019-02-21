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
