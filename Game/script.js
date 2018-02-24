var listOfColor=['red','green','blue','black'];//список цветов кубиков
var startCountOfSquare=10;//начальное количество кубиков
var point=0;
var timeObj={
    sec:1,//текущая секунда игры
    timeForGame:60//время на игру
};
//добавляются действия на кнопки
$(function () {
    $('#start').bind('click',clickStart);
    $('#newGame').bind('click',function () {
        clearInterval(timeObj.timer);
        start();
    });
    $('#save').bind('click',clickSave);
    tableOutput();
});
//рандом от min до max  не включительно
function randomInteger(min, max) {
    return Math.floor( min + Math.random() * (max + 1 - min));
}
//вывод времени
function executeTimer() {
    var elem=document.getElementById('time');
    timeObj.timer=setInterval(function () {
        if (timeObj.sec==timeObj.timeForGame){
            clearInterval(timeObj.timer);
            elem.innerHTML="01:00";
            $('#start').text('start');
            timeObj.sec=1;
            $('.body-game').off();
            $('.body-game div').css('opacity','0.5');
            $('#myModal p').text('Your score: '+point);
            $('#myModal').modal({
                backdrop:false
            });
            $('#myModal').modal('show');
            return;
        }
        elem.innerHTML=(timeObj.sec<10)?"00:0"+timeObj.sec:"00:"+timeObj.sec;
        timeObj.sec++;
    },1000);
}
//действия для кнопки "Start"
function clickStart() {
    switch ($(this).text()){
        case "start":{
            start();
            break;
        }
        case "pause":{
            clearInterval(timeObj.timer);
            $(this).text("continue");
            $('.body-game').off();
            $('.body-game div').css('opacity','0.5');
            break;
        }
        case "continue":{
            $('.body-game').on('click','div',clickElem );
            $('.body-game div').css('opacity','1');
            executeTimer();
            $(this).text("pause");
            break;
        }
    }
}
//начальная инициализация
function start() {
    $(".body-game").empty();
    $(".body-game").off();
    timeObj.sec=1;
    point=0;
    $('#start').text("pause");
    $('#points').text("0");
    $('.body-game div').css('opacity','1');
    for(let i=0; i<startCountOfSquare;i++)
    {
        let elem = document.createElement("div");
        elem.classList.add("elems");
        $(".body-game").append(elem);
        $(".body-game div").css('background-color',function () {
            var  rand=randomInteger(0,listOfColor.length);
            return listOfColor[rand];
        })
    }
    $('.body-game').on('click','div',clickElem );
    executeTimer();
}
//действие при нажатии на кубик 
function clickElem() {
        $(this).replaceWith(function () {
            var countOfDiv=randomInteger(0,3);
            var listOfDiv=[];
            for(let i=0; i<countOfDiv;i++){
                let elem= $(this).clone();
                elem.css('background-color',function () {
                    var  rand=randomInteger(0,listOfColor.length);
                    return listOfColor[rand];
                })


                listOfDiv.push(elem);
            }
            return listOfDiv;
        });
        //$('.radio ')
        //point++;
    dependencePointOfColor($(this).css('background-color'));
    console.log($(this).css('background-color'));
        $('#points').text(point);
}
//сохранение результатов в localStorage
function clickSave() {
    var name=$('#name').val();
    if(name)
    {
        localStorage.setItem(name,point);
        tableOutput();
        $('#myModal').modal('hide');
    }
    else{
        $('.modal-body .form-group').addClass('has-error');
    }
}
//вівод таблицы результатов
function tableOutput() {
    $('#tableOfResults tbody').empty();
    for( let i=0; i<localStorage.length;i++) {
        let  key=localStorage.key(i);
        $('#tableOfResults tbody').append("<tr><td>"+key+"</td><td>"+localStorage.getItem(key)+"</td></tr>");
    }
}
//добавление(отнимание) балов в зависимости от цвета
function dependencePointOfColor(color) {
    switch ( color){
        case 'red':{
            point+=10;
            break;
        }
        case 'green':{
            point+=2;
            break;
        }
        case'black':{
            point-=10;
            break;
        }
        case 'blue':{
            point+=1;
            break;
        }
    }
}